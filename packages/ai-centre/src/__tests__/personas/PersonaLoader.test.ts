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

// ---------------------------------------------------------------------------
// YAML front-matter helper (used by CL-1 tests below)
// Follows the same pattern as wave9.10-persona-lifecycle.test.ts.
// ---------------------------------------------------------------------------

/**
 * Extract the raw YAML front-matter block from markdown content.
 * Returns the text between the first pair of `---` delimiters, or an empty
 * string if no valid front-matter block is present.
 */
function extractFrontMatter(content: string): string {
  // Must start with `---` (anchored to string start, not line start)
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n?---/);
  return match ? match[1] : '';
}

// ---------------------------------------------------------------------------
// CL-1 — maturion-advisor persona (LKIAC Wave 1)
//
// RED gate: all 9 tests will FAIL until maturion-advisor.md is created by
// api-builder with the required YAML front-matter fields.
//
// Required front-matter fields (governance/aimc/AIMC_PERSONA_LIFECYCLE.md §5.1):
//   agentId, module, version, last_reviewed, owner, description
//
// Governance Reference: LKIAC Wave 1 | APS §5 | AIMC_PERSONA_LIFECYCLE.md §5.1
// ---------------------------------------------------------------------------

describe('CL-1 — maturion-advisor persona (LKIAC Wave 1)', () => {
  const loader = new PersonaLoader();

  /**
   * CL-1-T-001
   * RED — maturion-advisor.md does not yet exist.
   * Will turn GREEN when api-builder creates the persona file.
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it('CL-1-T-001: load("maturion-advisor") returns non-empty markdown content', async () => {
    const content = await loader.load('maturion-advisor');
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  /**
   * CL-1-T-002
   * RED — maturion-advisor.md does not yet exist.
   * Will turn GREEN when api-builder creates the persona file with a valid YAML
   * front-matter block starting with `---`.
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it(
    'CL-1-T-002: maturion-advisor front-matter contains "---" YAML delimiter (file starts with ---)',
    async () => {
      const content = await loader.load('maturion-advisor');
      expect(content).toMatch(/^---/);
    },
  );

  /**
   * CL-1-T-003
   * RED — maturion-advisor.md does not yet exist.
   * Will turn GREEN when api-builder creates the persona file with "agentId:" in
   * the YAML front-matter (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it('CL-1-T-003: maturion-advisor front-matter contains "agentId:" field', async () => {
    const content = await loader.load('maturion-advisor');
    const fm = extractFrontMatter(content);
    expect(fm).toContain('agentId:');
  });

  /**
   * CL-1-T-004
   * RED — maturion-advisor.md does not yet exist.
   * Will turn GREEN when api-builder creates the persona file with "version:" in
   * the YAML front-matter (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it('CL-1-T-004: maturion-advisor front-matter contains "version:" field', async () => {
    const content = await loader.load('maturion-advisor');
    const fm = extractFrontMatter(content);
    expect(fm).toContain('version:');
  });

  /**
   * CL-1-T-005
   * RED — maturion-advisor.md does not yet exist; PersonaLoader.listAvailable()
   * will not include it.
   * Will turn GREEN when api-builder creates the persona file.
   *
   * Reference: LKIAC Wave 1 | GRS-010 | APS §5
   */
  it('CL-1-T-005: listAvailable() includes "maturion-advisor"', async () => {
    const available = await loader.listAvailable();
    expect(available).toContain('maturion-advisor');
  });

  /**
   * CL-1-T-006
   * RED — maturion-advisor.md does not yet exist.
   * Will turn GREEN when api-builder creates the persona file with "module:" in
   * the YAML front-matter (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it('CL-1-T-006: maturion-advisor front-matter contains "module:" field', async () => {
    const content = await loader.load('maturion-advisor');
    const fm = extractFrontMatter(content);
    expect(fm).toContain('module:');
  });

  /**
   * CL-1-T-007
   * RED — maturion-advisor.md does not yet exist.
   * Will turn GREEN when api-builder creates the persona file with "last_reviewed:"
   * in the YAML front-matter (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it('CL-1-T-007: maturion-advisor front-matter contains "last_reviewed:" field', async () => {
    const content = await loader.load('maturion-advisor');
    const fm = extractFrontMatter(content);
    expect(fm).toContain('last_reviewed:');
  });

  /**
   * CL-1-T-008
   * RED — maturion-advisor.md does not yet exist.
   * Will turn GREEN when api-builder creates the persona file with "owner:" in
   * the YAML front-matter (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it('CL-1-T-008: maturion-advisor front-matter contains "owner:" field', async () => {
    const content = await loader.load('maturion-advisor');
    const fm = extractFrontMatter(content);
    expect(fm).toContain('owner:');
  });

  /**
   * CL-1-T-009
   * RED — maturion-advisor.md does not yet exist.
   * Will turn GREEN when api-builder creates the persona file with "description:"
   * in the YAML front-matter (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it('CL-1-T-009: maturion-advisor front-matter contains "description:" field', async () => {
    const content = await loader.load('maturion-advisor');
    const fm = extractFrontMatter(content);
    expect(fm).toContain('description:');
  });
});
