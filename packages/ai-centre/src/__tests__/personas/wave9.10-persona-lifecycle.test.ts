/**
 * RED Gate QA Suite — Wave 9.10 Persona Lifecycle
 *
 * Validates all AAWP Wave 9.10 deliverables for the Persona Lifecycle feature:
 *
 *   (a) All 8 AIMC personas load correctly via PersonaLoader.load(agentId)
 *       — T-001..T-006: GREEN immediately (existing personas)
 *       — T-007, T-008: RED until incident-intelligence-advisor.md and
 *         maturity-roadmap-advisor.md are created
 *
 *   (b) All 8 persona files contain YAML front-matter with the required fields:
 *       version, last_reviewed, owner, module
 *       — T-009..T-012: mat-advisor — version/module GREEN, last_reviewed/owner RED
 *       — T-013..T-016: isms-navigator — version/module GREEN, last_reviewed/owner RED
 *       — T-017..T-020: pit-advisor — all GREEN (full YAML already present)
 *       — T-021..T-024: risk-advisor — version/module GREEN, last_reviewed/owner RED
 *       — T-025..T-028: xdetect-advisor — version/module GREEN, last_reviewed/owner RED
 *       — T-029..T-032: course-crafter-advisor — all RED (no YAML front-matter)
 *       — T-033..T-036: incident-intelligence-advisor — all RED (file missing)
 *       — T-037..T-040: maturity-roadmap-advisor — all RED (file missing)
 *
 *   (c) governance/aimc/AIMC_PERSONA_LIFECYCLE.md exists
 *       — T-041: RED until file is created
 *
 *   (d) PersonaLoader.listAvailable() returns all 8 expected persona IDs
 *       — T-042: RED until incident-intelligence-advisor.md and
 *         maturity-roadmap-advisor.md are created
 *
 * Governance Reference: AAWP Wave 9.10 | APS §5 | AIMC_STRATEGY.md §7
 * Authority: CS2 (@APGI-cmy)
 * Issue: Wave 9.10 — Persona Lifecycle
 */

import { describe, it, expect } from 'vitest';
import { PersonaLoader } from '../../personas/PersonaLoader.js';
import { PersonaNotFoundError } from '../../types/index.js';

// @ts-ignore — @types/node not in package tsconfig; same pattern as existing test files
import { existsSync } from 'node:fs';
// @ts-ignore — @types/node not in package tsconfig; same pattern as existing test files
import { resolve, dirname } from 'node:path';
// @ts-ignore — @types/node not in package tsconfig; same pattern as existing test files
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Filesystem helpers
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve a path relative to the monorepo root from this test file's location.
 * This file lives at: packages/ai-centre/src/__tests__/personas/
 * Five parent steps (..×5) reach the repo root.
 */
function repoFile(...segments: string[]): string {
  return resolve(__dirname, '..', '..', '..', '..', '..', ...segments);
}

// ---------------------------------------------------------------------------
// YAML front-matter parser
//
// YAML front-matter is the block between the opening `---` and the next `---`
// at the very start of a markdown file. We extract it as a plain string so
// that individual field assertions remain simple toContain() checks.
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
// Expected persona registry (AAWP Wave 9.10 — all 8 personas)
// ---------------------------------------------------------------------------

const EXPECTED_PERSONA_IDS: ReadonlyArray<string> = [
  'mat-advisor',
  'isms-navigator',
  'pit-advisor',
  'risk-advisor',
  'xdetect-advisor',
  'course-crafter-advisor',
  'incident-intelligence-advisor', // MISSING until Wave 9.10 impl
  'maturity-roadmap-advisor',      // MISSING until Wave 9.10 impl
];

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('Wave 9.10 — Persona Lifecycle', () => {
  const loader = new PersonaLoader();

  // =========================================================================
  // GROUP 1 — PersonaLoader.load() — all 8 personas must load
  //
  // T-001..T-006: GREEN immediately (files already exist)
  // T-007, T-008: RED until the two new persona files are created
  // =========================================================================

  describe('GROUP-1: All 8 personas load via PersonaLoader.load()', () => {
    /**
     * W9.10-T-001
     * mat-advisor.md exists — should load as non-empty Markdown content.
     * GREEN immediately.
     */
    it('W9.10-T-001: load("mat-advisor") returns non-empty markdown content', async () => {
      const content = await loader.load('mat-advisor');
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('#');
    });

    /**
     * W9.10-T-002
     * isms-navigator.md exists — should load as non-empty Markdown content.
     * GREEN immediately.
     */
    it('W9.10-T-002: load("isms-navigator") returns non-empty markdown content', async () => {
      const content = await loader.load('isms-navigator');
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('#');
    });

    /**
     * W9.10-T-003
     * pit-advisor.md exists — should load as non-empty Markdown content.
     * GREEN immediately.
     */
    it('W9.10-T-003: load("pit-advisor") returns non-empty markdown content', async () => {
      const content = await loader.load('pit-advisor');
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('#');
    });

    /**
     * W9.10-T-004
     * risk-advisor.md exists — should load as non-empty Markdown content.
     * GREEN immediately.
     */
    it('W9.10-T-004: load("risk-advisor") returns non-empty markdown content', async () => {
      const content = await loader.load('risk-advisor');
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('#');
    });

    /**
     * W9.10-T-005
     * xdetect-advisor.md exists — should load as non-empty Markdown content.
     * GREEN immediately.
     */
    it('W9.10-T-005: load("xdetect-advisor") returns non-empty markdown content', async () => {
      const content = await loader.load('xdetect-advisor');
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('#');
    });

    /**
     * W9.10-T-006
     * course-crafter-advisor.md exists — should load as non-empty Markdown content.
     * GREEN immediately.
     */
    it('W9.10-T-006: load("course-crafter-advisor") returns non-empty markdown content', async () => {
      const content = await loader.load('course-crafter-advisor');
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('#');
    });

    /**
     * W9.10-T-007
     * incident-intelligence-advisor.md does NOT exist yet.
     * RED until packages/ai-centre/src/agents/incident-intelligence-advisor.md is created.
     *
     * AAWP Wave 9.10 deliverable: new persona file required by AIMC_STRATEGY.md §7.
     */
    it(
      'W9.10-T-007: load("incident-intelligence-advisor") returns non-empty markdown content' +
        ' [RED until incident-intelligence-advisor.md is created]',
      async () => {
        const content = await loader.load('incident-intelligence-advisor');
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);
        expect(content).toContain('#');
      },
    );

    /**
     * W9.10-T-008
     * maturity-roadmap-advisor.md does NOT exist yet.
     * RED until packages/ai-centre/src/agents/maturity-roadmap-advisor.md is created.
     *
     * AAWP Wave 9.10 deliverable: new persona file required by AIMC_STRATEGY.md §7.
     */
    it(
      'W9.10-T-008: load("maturity-roadmap-advisor") returns non-empty markdown content' +
        ' [RED until maturity-roadmap-advisor.md is created]',
      async () => {
        const content = await loader.load('maturity-roadmap-advisor');
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);
        expect(content).toContain('#');
      },
    );
  });

  // =========================================================================
  // GROUP 2 — YAML front-matter completeness
  //
  // All 8 personas MUST carry a YAML front-matter block with these fields:
  //   version, last_reviewed, owner, module
  //
  // Reference: AAWP Wave 9.10 | APS §5 | AIMC_STRATEGY.md §7
  // =========================================================================

  describe('GROUP-2: All 8 personas carry complete YAML front-matter (version, last_reviewed, owner, module)', () => {

    // -----------------------------------------------------------------------
    // mat-advisor — partial YAML (has version, module; missing last_reviewed, owner)
    // T-009: GREEN  T-010: RED  T-011: RED  T-012: GREEN
    // -----------------------------------------------------------------------

    it(
      'W9.10-T-009: mat-advisor front-matter contains "version:" field',
      async () => {
        const content = await loader.load('mat-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    /**
     * W9.10-T-010
     * RED — mat-advisor.md is missing the `last_reviewed` YAML field.
     * Requires AAWP Wave 9.10 implementation to add `last_reviewed:` to mat-advisor.md.
     */
    it(
      'W9.10-T-010: mat-advisor front-matter contains "last_reviewed:" field' +
        ' [RED until last_reviewed is added to mat-advisor.md]',
      async () => {
        const content = await loader.load('mat-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-011
     * RED — mat-advisor.md is missing the `owner` YAML field.
     * Requires AAWP Wave 9.10 implementation to add `owner:` to mat-advisor.md.
     */
    it(
      'W9.10-T-011: mat-advisor front-matter contains "owner:" field' +
        ' [RED until owner is added to mat-advisor.md]',
      async () => {
        const content = await loader.load('mat-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    it(
      'W9.10-T-012: mat-advisor front-matter contains "module:" field',
      async () => {
        const content = await loader.load('mat-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('module:');
      },
    );

    // -----------------------------------------------------------------------
    // isms-navigator — partial YAML (has version, module; missing last_reviewed, owner)
    // T-013: GREEN  T-014: RED  T-015: RED  T-016: GREEN
    // -----------------------------------------------------------------------

    it(
      'W9.10-T-013: isms-navigator front-matter contains "version:" field',
      async () => {
        const content = await loader.load('isms-navigator');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    /**
     * W9.10-T-014
     * RED — isms-navigator.md is missing the `last_reviewed` YAML field.
     */
    it(
      'W9.10-T-014: isms-navigator front-matter contains "last_reviewed:" field' +
        ' [RED until last_reviewed is added to isms-navigator.md]',
      async () => {
        const content = await loader.load('isms-navigator');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-015
     * RED — isms-navigator.md is missing the `owner` YAML field.
     */
    it(
      'W9.10-T-015: isms-navigator front-matter contains "owner:" field' +
        ' [RED until owner is added to isms-navigator.md]',
      async () => {
        const content = await loader.load('isms-navigator');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    it(
      'W9.10-T-016: isms-navigator front-matter contains "module:" field',
      async () => {
        const content = await loader.load('isms-navigator');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('module:');
      },
    );

    // -----------------------------------------------------------------------
    // pit-advisor — FULL YAML (version, last_reviewed, owner, module all present)
    // T-017: GREEN  T-018: GREEN  T-019: GREEN  T-020: GREEN
    // -----------------------------------------------------------------------

    it(
      'W9.10-T-017: pit-advisor front-matter contains "version:" field',
      async () => {
        const content = await loader.load('pit-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    it(
      'W9.10-T-018: pit-advisor front-matter contains "last_reviewed:" field',
      async () => {
        const content = await loader.load('pit-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    it(
      'W9.10-T-019: pit-advisor front-matter contains "owner:" field',
      async () => {
        const content = await loader.load('pit-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    it(
      'W9.10-T-020: pit-advisor front-matter contains "module:" field',
      async () => {
        const content = await loader.load('pit-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('module:');
      },
    );

    // -----------------------------------------------------------------------
    // risk-advisor — partial YAML (has version, module; missing last_reviewed, owner)
    // T-021: GREEN  T-022: RED  T-023: RED  T-024: GREEN
    // -----------------------------------------------------------------------

    it(
      'W9.10-T-021: risk-advisor front-matter contains "version:" field',
      async () => {
        const content = await loader.load('risk-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    /**
     * W9.10-T-022
     * RED — risk-advisor.md is missing the `last_reviewed` YAML field.
     */
    it(
      'W9.10-T-022: risk-advisor front-matter contains "last_reviewed:" field' +
        ' [RED until last_reviewed is added to risk-advisor.md]',
      async () => {
        const content = await loader.load('risk-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-023
     * RED — risk-advisor.md is missing the `owner` YAML field.
     */
    it(
      'W9.10-T-023: risk-advisor front-matter contains "owner:" field' +
        ' [RED until owner is added to risk-advisor.md]',
      async () => {
        const content = await loader.load('risk-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    it(
      'W9.10-T-024: risk-advisor front-matter contains "module:" field',
      async () => {
        const content = await loader.load('risk-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('module:');
      },
    );

    // -----------------------------------------------------------------------
    // xdetect-advisor — partial YAML (has version, module; missing last_reviewed, owner)
    // T-025: GREEN  T-026: RED  T-027: RED  T-028: GREEN
    // -----------------------------------------------------------------------

    it(
      'W9.10-T-025: xdetect-advisor front-matter contains "version:" field',
      async () => {
        const content = await loader.load('xdetect-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    /**
     * W9.10-T-026
     * RED — xdetect-advisor.md is missing the `last_reviewed` YAML field.
     */
    it(
      'W9.10-T-026: xdetect-advisor front-matter contains "last_reviewed:" field' +
        ' [RED until last_reviewed is added to xdetect-advisor.md]',
      async () => {
        const content = await loader.load('xdetect-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-027
     * RED — xdetect-advisor.md is missing the `owner` YAML field.
     */
    it(
      'W9.10-T-027: xdetect-advisor front-matter contains "owner:" field' +
        ' [RED until owner is added to xdetect-advisor.md]',
      async () => {
        const content = await loader.load('xdetect-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    it(
      'W9.10-T-028: xdetect-advisor front-matter contains "module:" field',
      async () => {
        const content = await loader.load('xdetect-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('module:');
      },
    );

    // -----------------------------------------------------------------------
    // course-crafter-advisor — NO YAML front-matter at all (uses inline headers)
    // T-029: RED  T-030: RED  T-031: RED  T-032: RED
    // -----------------------------------------------------------------------

    /**
     * W9.10-T-029
     * RED — course-crafter-advisor.md has no YAML front-matter block.
     * Requires AAWP Wave 9.10 implementation to add a complete front-matter block.
     */
    it(
      'W9.10-T-029: course-crafter-advisor front-matter contains "version:" field' +
        ' [RED until YAML front-matter block is added to course-crafter-advisor.md]',
      async () => {
        const content = await loader.load('course-crafter-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    /**
     * W9.10-T-030
     * RED — course-crafter-advisor.md has no YAML front-matter block.
     */
    it(
      'W9.10-T-030: course-crafter-advisor front-matter contains "last_reviewed:" field' +
        ' [RED until YAML front-matter block is added to course-crafter-advisor.md]',
      async () => {
        const content = await loader.load('course-crafter-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-031
     * RED — course-crafter-advisor.md has no YAML front-matter block.
     */
    it(
      'W9.10-T-031: course-crafter-advisor front-matter contains "owner:" field' +
        ' [RED until YAML front-matter block is added to course-crafter-advisor.md]',
      async () => {
        const content = await loader.load('course-crafter-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    /**
     * W9.10-T-032
     * RED — course-crafter-advisor.md has no YAML front-matter block.
     */
    it(
      'W9.10-T-032: course-crafter-advisor front-matter contains "module:" field' +
        ' [RED until YAML front-matter block is added to course-crafter-advisor.md]',
      async () => {
        const content = await loader.load('course-crafter-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('module:');
      },
    );

    // -----------------------------------------------------------------------
    // incident-intelligence-advisor — file does NOT exist yet
    // T-033..T-036: all RED (PersonaNotFoundError will surface on load())
    // -----------------------------------------------------------------------

    /**
     * W9.10-T-033
     * RED — incident-intelligence-advisor.md does not exist.
     * The load() call will reject with PersonaNotFoundError, failing this test.
     * Requires AAWP Wave 9.10 implementation (new persona file + full YAML).
     */
    it(
      'W9.10-T-033: incident-intelligence-advisor front-matter contains "version:" field' +
        ' [RED until incident-intelligence-advisor.md is created with full YAML]',
      async () => {
        const content = await loader.load('incident-intelligence-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    /**
     * W9.10-T-034
     * RED — incident-intelligence-advisor.md does not exist.
     */
    it(
      'W9.10-T-034: incident-intelligence-advisor front-matter contains "last_reviewed:" field' +
        ' [RED until incident-intelligence-advisor.md is created with full YAML]',
      async () => {
        const content = await loader.load('incident-intelligence-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-035
     * RED — incident-intelligence-advisor.md does not exist.
     */
    it(
      'W9.10-T-035: incident-intelligence-advisor front-matter contains "owner:" field' +
        ' [RED until incident-intelligence-advisor.md is created with full YAML]',
      async () => {
        const content = await loader.load('incident-intelligence-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    /**
     * W9.10-T-036
     * RED — incident-intelligence-advisor.md does not exist.
     */
    it(
      'W9.10-T-036: incident-intelligence-advisor front-matter contains "module:" field' +
        ' [RED until incident-intelligence-advisor.md is created with full YAML]',
      async () => {
        const content = await loader.load('incident-intelligence-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('module:');
      },
    );

    // -----------------------------------------------------------------------
    // maturity-roadmap-advisor — file does NOT exist yet
    // T-037..T-040: all RED (PersonaNotFoundError will surface on load())
    // -----------------------------------------------------------------------

    /**
     * W9.10-T-037
     * RED — maturity-roadmap-advisor.md does not exist.
     * Requires AAWP Wave 9.10 implementation (new persona file + full YAML).
     */
    it(
      'W9.10-T-037: maturity-roadmap-advisor front-matter contains "version:" field' +
        ' [RED until maturity-roadmap-advisor.md is created with full YAML]',
      async () => {
        const content = await loader.load('maturity-roadmap-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    /**
     * W9.10-T-038
     * RED — maturity-roadmap-advisor.md does not exist.
     */
    it(
      'W9.10-T-038: maturity-roadmap-advisor front-matter contains "last_reviewed:" field' +
        ' [RED until maturity-roadmap-advisor.md is created with full YAML]',
      async () => {
        const content = await loader.load('maturity-roadmap-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-039
     * RED — maturity-roadmap-advisor.md does not exist.
     */
    it(
      'W9.10-T-039: maturity-roadmap-advisor front-matter contains "owner:" field' +
        ' [RED until maturity-roadmap-advisor.md is created with full YAML]',
      async () => {
        const content = await loader.load('maturity-roadmap-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    /**
     * W9.10-T-040
     * RED — maturity-roadmap-advisor.md does not exist.
     */
    it(
      'W9.10-T-040: maturity-roadmap-advisor front-matter contains "module:" field' +
        ' [RED until maturity-roadmap-advisor.md is created with full YAML]',
      async () => {
        const content = await loader.load('maturity-roadmap-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('module:');
      },
    );
  });

  // =========================================================================
  // GROUP 3 — Governance document existence
  //
  // T-041: RED until governance/aimc/AIMC_PERSONA_LIFECYCLE.md is created
  // =========================================================================

  describe('GROUP-3: Governance document AIMC_PERSONA_LIFECYCLE.md exists', () => {
    /**
     * W9.10-T-041
     * The persona lifecycle governance document must exist at:
     *   governance/aimc/AIMC_PERSONA_LIFECYCLE.md
     *
     * RED until the file is created as an AAWP Wave 9.10 deliverable.
     *
     * Reference: AAWP Wave 9.10 | APS §5 | AIMC_STRATEGY.md §7
     */
    it(
      'W9.10-T-041: governance/aimc/AIMC_PERSONA_LIFECYCLE.md exists' +
        ' [RED until governance document is created]',
      () => {
        const docPath = repoFile('governance', 'aimc', 'AIMC_PERSONA_LIFECYCLE.md');
        expect(
          existsSync(docPath),
          `Expected governance/aimc/AIMC_PERSONA_LIFECYCLE.md to exist at ${docPath}`,
        ).toBe(true);
      },
    );
  });

  // =========================================================================
  // GROUP 4 — PersonaLoader.listAvailable() completeness
  //
  // T-042: RED until both missing persona files are created
  // =========================================================================

  describe('GROUP-4: PersonaLoader.listAvailable() returns all 8 expected persona IDs', () => {
    /**
     * W9.10-T-042
     * listAvailable() must return all 8 AAWP Wave 9.10 persona IDs.
     *
     * Currently RED because incident-intelligence-advisor.md and
     * maturity-roadmap-advisor.md do not yet exist — they are absent from the
     * agents/ directory and therefore absent from listAvailable() results.
     *
     * Will turn GREEN once both new persona files are created.
     *
     * Reference: AAWP Wave 9.10 | APS §5
     */
    it(
      'W9.10-T-042: listAvailable() includes all 8 expected persona IDs' +
        ' [RED until incident-intelligence-advisor.md and maturity-roadmap-advisor.md are created]',
      async () => {
        const available = await loader.listAvailable();

        expect(Array.isArray(available)).toBe(true);

        for (const expectedId of EXPECTED_PERSONA_IDS) {
          expect(
            available,
            `Expected PersonaLoader.listAvailable() to include "${expectedId}" — ` +
              `AAWP Wave 9.10 requires all 8 persona files to be present in agents/`,
          ).toContain(expectedId);
        }
      },
    );
  });
});
