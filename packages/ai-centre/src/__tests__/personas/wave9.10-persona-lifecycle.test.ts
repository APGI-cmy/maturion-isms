/**
 * QA Suite — Wave 9.10 Persona Lifecycle (GREEN gate)
 *
 * Validates all AAWP Wave 9.10 deliverables for the Persona Lifecycle feature:
 *
 *   (a) All 8 AIMC personas load correctly via PersonaLoader.load(agentId)
 *       — T-001..T-008: GREEN — all 8 personas present and loadable
 *
 *   (b) All 8 persona files contain YAML front-matter with the required fields:
 *       version, last_reviewed, owner, module
 *       — T-009..T-012: mat-advisor — all GREEN (full YAML present)
 *       — T-013..T-016: isms-navigator — all GREEN (full YAML present)
 *       — T-017..T-020: pit-advisor — all GREEN (full YAML present)
 *       — T-021..T-024: risk-advisor — all GREEN (full YAML present)
 *       — T-025..T-028: xdetect-advisor — all GREEN (full YAML present)
 *       — T-029..T-032: course-crafter-advisor — all GREEN (full YAML present)
 *       — T-033..T-036: incident-intelligence-advisor — all GREEN (file and YAML present)
 *       — T-037..T-040: maturity-roadmap-advisor — all GREEN (file and YAML present)
 *
 *   (c) governance/aimc/AIMC_PERSONA_LIFECYCLE.md exists
 *       — T-041: GREEN — regression gate to ensure lifecycle spec remains present
 *
 *   (d) PersonaLoader.listAvailable() returns all 8 expected persona IDs
 *       — T-042: GREEN — regression gate to ensure all personas remain discoverable
 *
 * Governance Reference: AAWP Wave 9.10 | APS §5 | AIMC_STRATEGY.md §7
 * Authority: CS2 (@APGI-cmy)
 * Issue: Wave 9.10 — Persona Lifecycle
 */

import { describe, it, expect } from 'vitest';
import { PersonaLoader } from '../../personas/PersonaLoader.js';

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
  'incident-intelligence-advisor',
  'maturity-roadmap-advisor',
];

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('Wave 9.10 — Persona Lifecycle', () => {
  const loader = new PersonaLoader();

  // =========================================================================
  // GROUP 1 — PersonaLoader.load() — all 8 personas must load
  //
  // T-001..T-008: GREEN — all 8 persona files present and loadable
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
     * incident-intelligence-advisor.md is a Wave 9.10 deliverable.
     * GREEN — file exists in this PR.
     *
     * AAWP Wave 9.10 deliverable: new persona file required by AIMC_STRATEGY.md §7.
     */
    it(
      'W9.10-T-007: load("incident-intelligence-advisor") returns non-empty markdown content',
      async () => {
        const content = await loader.load('incident-intelligence-advisor');
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);
        expect(content).toContain('#');
      },
    );

    /**
     * W9.10-T-008
     * maturity-roadmap-advisor.md is a Wave 9.10 deliverable.
     * GREEN — file exists in this PR.
     *
     * AAWP Wave 9.10 deliverable: new persona file required by AIMC_STRATEGY.md §7.
     */
    it(
      'W9.10-T-008: load("maturity-roadmap-advisor") returns non-empty markdown content',
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
    // mat-advisor — full YAML (version, last_reviewed, owner, module all present)
    // T-009: GREEN  T-010: GREEN  T-011: GREEN  T-012: GREEN
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
     * GREEN — mat-advisor.md has `last_reviewed` YAML field (added in Wave 9.10).
     */
    it(
      'W9.10-T-010: mat-advisor front-matter contains "last_reviewed:" field',
      async () => {
        const content = await loader.load('mat-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-011
     * GREEN — mat-advisor.md has `owner` YAML field (added in Wave 9.10).
     */
    it(
      'W9.10-T-011: mat-advisor front-matter contains "owner:" field',
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
    // isms-navigator — full YAML (version, last_reviewed, owner, module all present)
    // T-013: GREEN  T-014: GREEN  T-015: GREEN  T-016: GREEN
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
     * GREEN — isms-navigator.md has `last_reviewed` YAML field (added in Wave 9.10).
     */
    it(
      'W9.10-T-014: isms-navigator front-matter contains "last_reviewed:" field',
      async () => {
        const content = await loader.load('isms-navigator');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-015
     * GREEN — isms-navigator.md has `owner` YAML field (added in Wave 9.10).
     */
    it(
      'W9.10-T-015: isms-navigator front-matter contains "owner:" field',
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
    // risk-advisor — full YAML (version, last_reviewed, owner, module all present)
    // T-021: GREEN  T-022: GREEN  T-023: GREEN  T-024: GREEN
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
     * GREEN — risk-advisor.md has `last_reviewed` YAML field (added in Wave 9.10).
     */
    it(
      'W9.10-T-022: risk-advisor front-matter contains "last_reviewed:" field',
      async () => {
        const content = await loader.load('risk-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-023
     * GREEN — risk-advisor.md has `owner` YAML field (added in Wave 9.10).
     */
    it(
      'W9.10-T-023: risk-advisor front-matter contains "owner:" field',
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
    // xdetect-advisor — full YAML (version, last_reviewed, owner, module all present)
    // T-025: GREEN  T-026: GREEN  T-027: GREEN  T-028: GREEN
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
     * GREEN — xdetect-advisor.md has `last_reviewed` YAML field (added in Wave 9.10).
     */
    it(
      'W9.10-T-026: xdetect-advisor front-matter contains "last_reviewed:" field',
      async () => {
        const content = await loader.load('xdetect-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-027
     * GREEN — xdetect-advisor.md has `owner` YAML field (added in Wave 9.10).
     */
    it(
      'W9.10-T-027: xdetect-advisor front-matter contains "owner:" field',
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
    // course-crafter-advisor — full YAML (version, last_reviewed, owner, module all present)
    // T-029: GREEN  T-030: GREEN  T-031: GREEN  T-032: GREEN
    // -----------------------------------------------------------------------

    /**
     * W9.10-T-029
     * GREEN — course-crafter-advisor.md has full YAML front-matter (added in Wave 9.10).
     */
    it(
      'W9.10-T-029: course-crafter-advisor front-matter contains "version:" field',
      async () => {
        const content = await loader.load('course-crafter-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    /**
     * W9.10-T-030
     * GREEN — course-crafter-advisor.md has `last_reviewed` in front-matter (added in Wave 9.10).
     */
    it(
      'W9.10-T-030: course-crafter-advisor front-matter contains "last_reviewed:" field',
      async () => {
        const content = await loader.load('course-crafter-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-031
     * GREEN — course-crafter-advisor.md has `owner` in front-matter (added in Wave 9.10).
     */
    it(
      'W9.10-T-031: course-crafter-advisor front-matter contains "owner:" field',
      async () => {
        const content = await loader.load('course-crafter-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    /**
     * W9.10-T-032
     * GREEN — course-crafter-advisor.md has `module` in front-matter (added in Wave 9.10).
     */
    it(
      'W9.10-T-032: course-crafter-advisor front-matter contains "module:" field',
      async () => {
        const content = await loader.load('course-crafter-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('module:');
      },
    );

    // -----------------------------------------------------------------------
    // incident-intelligence-advisor — created in Wave 9.10
    // T-033..T-036: all GREEN
    // -----------------------------------------------------------------------

    /**
     * W9.10-T-033
     * GREEN — incident-intelligence-advisor.md created in Wave 9.10 with full YAML.
     */
    it(
      'W9.10-T-033: incident-intelligence-advisor front-matter contains "version:" field',
      async () => {
        const content = await loader.load('incident-intelligence-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    /**
     * W9.10-T-034
     * GREEN — incident-intelligence-advisor.md has `last_reviewed` field.
     */
    it(
      'W9.10-T-034: incident-intelligence-advisor front-matter contains "last_reviewed:" field',
      async () => {
        const content = await loader.load('incident-intelligence-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-035
     * GREEN — incident-intelligence-advisor.md has `owner` field.
     */
    it(
      'W9.10-T-035: incident-intelligence-advisor front-matter contains "owner:" field',
      async () => {
        const content = await loader.load('incident-intelligence-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    /**
     * W9.10-T-036
     * GREEN — incident-intelligence-advisor.md has `module` field.
     */
    it(
      'W9.10-T-036: incident-intelligence-advisor front-matter contains "module:" field',
      async () => {
        const content = await loader.load('incident-intelligence-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('module:');
      },
    );

    // -----------------------------------------------------------------------
    // maturity-roadmap-advisor — created in Wave 9.10
    // T-037..T-040: all GREEN
    // -----------------------------------------------------------------------

    /**
     * W9.10-T-037
     * GREEN — maturity-roadmap-advisor.md created in Wave 9.10 with full YAML.
     */
    it(
      'W9.10-T-037: maturity-roadmap-advisor front-matter contains "version:" field',
      async () => {
        const content = await loader.load('maturity-roadmap-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('version:');
      },
    );

    /**
     * W9.10-T-038
     * GREEN — maturity-roadmap-advisor.md has `last_reviewed` field.
     */
    it(
      'W9.10-T-038: maturity-roadmap-advisor front-matter contains "last_reviewed:" field',
      async () => {
        const content = await loader.load('maturity-roadmap-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('last_reviewed:');
      },
    );

    /**
     * W9.10-T-039
     * GREEN — maturity-roadmap-advisor.md has `owner` field.
     */
    it(
      'W9.10-T-039: maturity-roadmap-advisor front-matter contains "owner:" field',
      async () => {
        const content = await loader.load('maturity-roadmap-advisor');
        const fm = extractFrontMatter(content);
        expect(fm).toContain('owner:');
      },
    );

    /**
     * W9.10-T-040
     * GREEN — maturity-roadmap-advisor.md has `module` field.
     */
    it(
      'W9.10-T-040: maturity-roadmap-advisor front-matter contains "module:" field',
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
  // T-041: GREEN — regression gate
  // =========================================================================

  describe('GROUP-3: Governance document AIMC_PERSONA_LIFECYCLE.md exists', () => {
    /**
     * W9.10-T-041
     * The persona lifecycle governance document must exist at:
     *   governance/aimc/AIMC_PERSONA_LIFECYCLE.md
     *
     * GREEN — file created as AAWP Wave 9.10 deliverable.
     *
     * Reference: AAWP Wave 9.10 | APS §5 | AIMC_STRATEGY.md §7
     */
    it(
      'W9.10-T-041: governance/aimc/AIMC_PERSONA_LIFECYCLE.md exists',
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
  // T-042: GREEN — regression gate, all 8 personas discoverable
  // =========================================================================

  describe('GROUP-4: PersonaLoader.listAvailable() returns all 8 expected persona IDs', () => {
    /**
     * W9.10-T-042
     * listAvailable() must return all 8 AAWP Wave 9.10 persona IDs.
     * GREEN — all 8 persona files present in agents/ directory (Wave 9.10 deliverable).
     *
     * Reference: AAWP Wave 9.10 | APS §5
     */
    it(
      'W9.10-T-042: listAvailable() includes all 8 expected persona IDs',
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
