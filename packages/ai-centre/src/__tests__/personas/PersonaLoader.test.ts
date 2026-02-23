/**
 * RED Gate QA Suite — PersonaLoader
 *
 * All tests MUST FAIL until Wave 2 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-010, GRS-028, GRS-029 | APS §8.1 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-010  Persona files stored in packages/ai-centre/agents/
 *   GRS-028  Persona loading by agentId
 *   GRS-029  Persona files as plain Markdown only
 */
import { describe, it, expect } from 'vitest';
import { PersonaLoader } from '../../personas/PersonaLoader.js';
import { PersonaNotFoundError } from '../../types/index.js';

// ---------------------------------------------------------------------------
// Tests (GRS-010, GRS-028, GRS-029)
// ---------------------------------------------------------------------------

describe('PersonaLoader', () => {
  it(
    // GRS-028 | AAD §9.2
    "load() returns the full Markdown content of a known agentId",
    async () => {
      const loader = new PersonaLoader();

      // 'mat-advisor' persona file should exist at packages/ai-centre/agents/mat-advisor.md
      const content = await loader.load('mat-advisor');

      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
      // Persona files are Markdown — must not be empty
      expect(content).toContain('#');
    },
  );

  it(
    // GRS-028 | AAD §9.2
    "load() throws PersonaNotFoundError for an unknown agentId",
    async () => {
      const loader = new PersonaLoader();

      await expect(loader.load('totally-unknown-agent')).rejects.toThrow(
        PersonaNotFoundError,
      );
    },
  );

  it(
    // GRS-010, GRS-028 | AAD §9.2 — path traversal protection (APS §8.1)
    "load() rejects agentId values containing path traversal sequences (/, \\, ..)",
    async () => {
      const loader = new PersonaLoader();

      const traversalAttempts = [
        '../etc/passwd',
        '../../secret',
        'subdir/agent',
        'subdir\\agent',
        '..\\windows\\secret',
      ];

      for (const agentId of traversalAttempts) {
        await expect(loader.load(agentId)).rejects.toThrow();
      }
    },
  );

  it(
    // GRS-010 | AAD §9.2
    "listAvailable() returns all agentIds with a corresponding .md file",
    async () => {
      const loader = new PersonaLoader();

      const available = await loader.listAvailable();

      expect(Array.isArray(available)).toBe(true);
      expect(available.length).toBeGreaterThan(0);
      // agentIds must be non-empty strings (no file extension)
      for (const agentId of available) {
        expect(typeof agentId).toBe('string');
        expect(agentId.length).toBeGreaterThan(0);
        expect(agentId).not.toContain('.md');
      }
    },
  );
});
