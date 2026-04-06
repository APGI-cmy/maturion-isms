/**
 * PersonaLoader — Wave 2 implementation
 *
 * Loads persona Markdown files from the agents/ directory.
 * Protects against path traversal attacks.
 *
 * References: GRS-010, GRS-028, GRS-029 | APS §8.1 | AAD §5.8
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PersonaNotFoundError,
  PersonaValidationError,
  type PersonaLoader as IPersonaLoader,
} from '../types/index.js';

const AGENTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '../agents');

function validateAgentId(agentId: string): void {
  if (
    agentId.includes('/') ||
    agentId.includes('\\') ||
    agentId.includes('..')
  ) {
    throw new PersonaNotFoundError(agentId);
  }
}

function parseYamlField(yamlBlock: string, fieldName: string): string | undefined {
  const match = yamlBlock.match(new RegExp(`^${fieldName}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim();
}

const REQUIRED_FIELDS = ['agentId', 'description', 'module', 'version', 'last_reviewed', 'owner'] as const;

const SEMVER_RE = /^\d+\.\d+\.\d+/;
const DATE_YYYYMMDD_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateYamlFrontMatter(agentId: string, content: string): void {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new PersonaValidationError(agentId, 'no YAML front-matter block found');
  }
  const yamlBlock = match[1];
  for (const field of REQUIRED_FIELDS) {
    const value = parseYamlField(yamlBlock, field);
    if (!value) {
      throw new PersonaValidationError(agentId, `required field "${field}" is missing or empty`);
    }
  }
  // §3.4/§5.1: agentId must exactly match the loaded agentId (derived from filename)
  const yamlAgentId = parseYamlField(yamlBlock, 'agentId')!;
  if (yamlAgentId !== agentId) {
    throw new PersonaValidationError(
      agentId,
      `agentId field "${yamlAgentId}" does not match expected "${agentId}"`,
    );
  }
  // §5.1: version must be semver (N.N.N)
  const version = parseYamlField(yamlBlock, 'version')!;
  if (!SEMVER_RE.test(version)) {
    throw new PersonaValidationError(
      agentId,
      `version "${version}" is not valid semver (expected N.N.N)`,
    );
  }
  // §5.1: last_reviewed must be YYYY-MM-DD
  const lastReviewed = parseYamlField(yamlBlock, 'last_reviewed')!;
  if (!DATE_YYYYMMDD_RE.test(lastReviewed)) {
    throw new PersonaValidationError(
      agentId,
      `last_reviewed "${lastReviewed}" is not a valid YYYY-MM-DD date`,
    );
  }
}

export class PersonaLoader implements IPersonaLoader {
  async load(agentId: string): Promise<string> {
    validateAgentId(agentId);
    const filePath = join(AGENTS_DIR, `${agentId}.md`);
    let content: string;
    try {
      content = await readFile(filePath, 'utf-8');
    } catch {
      throw new PersonaNotFoundError(agentId);
    }
    validateYamlFrontMatter(agentId, content);
    return content;
  }

  async listAvailable(): Promise<string[]> {
    try {
      const files = await readdir(AGENTS_DIR);
      return files
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.replace(/\.md$/, ''));
    } catch {
      return [];
    }
  }
}
