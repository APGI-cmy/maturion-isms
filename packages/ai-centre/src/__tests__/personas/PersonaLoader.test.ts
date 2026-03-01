/**
 * RED Gate QA Suite — PersonaLoader
 *
 * All tests MUST FAIL until Wave 2 implementation is complete.
 * Do NOT modify these tests to pass without a corresponding implementation.
 *
 * References: GRS-010, GRS-028, GRS-029 | APS §8.1 | AAD §9.2
 *
 * Mapped requirements:
 *   GRS-010  Persona files stored in packages/ai-centre/src/agents/
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

      // 'mat-advisor' persona file should exist at packages/ai-centre/src/agents/mat-advisor.md
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
// Required front-matter fields (governance/aimc/AIMC_PERSONA_LIFECYCLE.md §5.1):
//   agentId, module, version, last_reviewed, owner, description
//
// Authority: CS2 (@APGI-cmy) — Issue [CL-1]
// Wave: CL-1 (LKIAC Wave 1 — Maturion Persona Migration)
// Governance Reference: LKIAC Wave 1 | APS §5 | AIMC_PERSONA_LIFECYCLE.md §5.1
// CL-1 — maturion-advisor persona (LKIAC Wave 1) — RED gate tests
//
// These tests MUST FAIL until Task CL-1.2 creates maturion-advisor.md.
// They become GREEN after the persona file is created (Task CL-1.2).
//
// Authority: CS2 (@APGI-cmy) — Issue [CL-1]
// Wave: CL-1 (LKIAC Wave 1 — Maturion Persona Migration)
// ---------------------------------------------------------------------------

describe('CL-1 — maturion-advisor persona (LKIAC Wave 1)', () => {
  const loader = new PersonaLoader();

  /**
   * CL-1-T-001
   * load("maturion-advisor") must return non-empty Markdown content.
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it('CL-1-T-001: load("maturion-advisor") returns non-empty markdown content', async () => {
    const content = await loader.load('maturion-advisor');
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    // Persona files are Markdown — must contain at least one heading
    expect(content).toContain('#');
  });

  /**
   * CL-1-T-002
   * The persona file must contain a `---` YAML front-matter delimiter.
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it(
    'CL-1-T-002: maturion-advisor front-matter contains "---" YAML delimiter (file starts with ---)',
    async () => {
      const content = await loader.load('maturion-advisor');
   * RED until maturion-advisor.md exists.
   * load("maturion-advisor") must return non-empty Markdown content.
   */
  it(
    'CL-1-T-001: load("maturion-advisor") returns non-empty markdown content',
    async () => {
      const content = await loader.load('maturion-advisor');

      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
      // Persona files are Markdown — must contain at least one heading
      expect(content).toContain('#');
    },
  );

  /**
   * CL-1-T-002
   * RED until maturion-advisor.md exists with YAML front-matter.
   * The persona file must contain a `---` YAML front-matter delimiter.
   */
  it(
    'CL-1-T-002: maturion-advisor front-matter contains "---" YAML delimiter',
    async () => {
      const content = await loader.load('maturion-advisor');

      // Front-matter must start at the beginning of the file with `---\n`
      expect(content.startsWith('---')).toBe(true);
    },
  );

  /**
   * CL-1-T-003
   * The persona file must contain `agentId:` in its front-matter
   * (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
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
   * The persona file must contain `version:` in its front-matter
   * (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
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
   * listAvailable() must include "maturion-advisor".
   *
   * Reference: LKIAC Wave 1 | GRS-010 | APS §5
   */
  it('CL-1-T-005: listAvailable() includes "maturion-advisor"', async () => {
    const available = await loader.listAvailable();
    expect(available).toContain('maturion-advisor');
  });

  /**
   * CL-1-T-006
   * The persona file must contain `module:` in its front-matter
   * (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
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
   * The persona file must contain `last_reviewed:` in its front-matter
   * (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
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
   * The persona file must contain `owner:` in its front-matter
   * (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
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
   * The persona file must contain `description:` in its front-matter
   * (required field per AIMC_PERSONA_LIFECYCLE.md §5.1).
   *
   * Reference: LKIAC Wave 1 | AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it('CL-1-T-009: maturion-advisor front-matter contains "description:" field', async () => {
    const content = await loader.load('maturion-advisor');
    const fm = extractFrontMatter(content);
    expect(fm).toContain('description:');
  });
   * RED until maturion-advisor.md exists with `agentId:` in its front-matter.
   */
  it(
    'CL-1-T-003: maturion-advisor front-matter contains "agentId:" field',
    async () => {
      const content = await loader.load('maturion-advisor');

      expect(content).toContain('agentId:');
    },
  );

  /**
   * CL-1-T-004
   * RED until maturion-advisor.md exists with `version:` in its front-matter.
   */
  it(
    'CL-1-T-004: maturion-advisor front-matter contains "version:" field',
    async () => {
      const content = await loader.load('maturion-advisor');

      expect(content).toContain('version:');
    },
  );

  /**
   * CL-1-T-005
   * RED until maturion-advisor.md exists in the agents directory.
   * listAvailable() must include "maturion-advisor".
   */
  it(
    'CL-1-T-005: listAvailable() includes "maturion-advisor"',
    async () => {
      const available = await loader.listAvailable();

      expect(available).toContain('maturion-advisor');
    },
  );
});
