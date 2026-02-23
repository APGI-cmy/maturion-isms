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

export class PersonaLoader implements IPersonaLoader {
  async load(agentId: string): Promise<string> {
    validateAgentId(agentId);
    const filePath = join(AGENTS_DIR, `${agentId}.md`);
    try {
      return await readFile(filePath, 'utf-8');
    } catch {
      throw new PersonaNotFoundError(agentId);
    }
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
