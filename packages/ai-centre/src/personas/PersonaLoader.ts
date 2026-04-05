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
