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
import { PersonaNotFoundError, PersonaValidationError } from '../../types/index.js';
// NOTE: PersonaValidationError is expected to be defined and exported from
// types/index.ts. Tests in this suite may reference it as part of the
// current PersonaLoader error-contract.

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
});

// ---------------------------------------------------------------------------
// CL-7-D1 — PersonaValidationError on invalid YAML front-matter (RED gate)
//
// These tests MUST FAIL (RED) until Wave CL-7 D3 is complete:
//   - D3 adds `PersonaValidationError` to packages/ai-centre/src/types/index.ts
//   - D3 adds YAML front-matter validation to PersonaLoader.ts
//
// RED state (current):
//   PersonaLoader.load() reads file content and returns it without validating
//   YAML front-matter.  Promises resolve instead of rejecting, so every
//   `.rejects.toThrow(...)` assertion below FAILS.
//
// GREEN state (after D3):
//   PersonaLoader.load() parses YAML front-matter and throws
//   PersonaValidationError when any required field is absent or blank.
//   Every `.rejects.toThrow(PersonaValidationError)` assertion will PASS.
//
// Fixture files (in packages/ai-centre/src/agents/):
//   cl7-fixture-missing-agentid.md        — all fields except `agentId`
//   cl7-fixture-missing-description.md    — all fields except `description`
//   cl7-fixture-missing-module.md         — all fields except `module`
//   cl7-fixture-missing-version.md        — all fields except `version`
//   cl7-fixture-missing-last-reviewed.md  — all fields except `last_reviewed`
//   cl7-fixture-missing-owner.md          — all fields except `owner`
//   cl7-fixture-no-frontmatter.md         — no YAML delimiters at all
//   cl7-fixture-blank-fields.md           — all keys present; all values empty
//
// Governance Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | LKIAC Wave CL-7
// Authority: CS2 (@APGI-cmy)
// Wave: CL-7 (LKIAC Wave 7 — LKIAC-L3 PersonaLoader Improvements)
// ---------------------------------------------------------------------------

describe('CL-7-D1 — PersonaValidationError on invalid YAML front-matter (RED gate)', () => {
  const loader = new PersonaLoader();

  /**
   * CL-7-T-001
   * load() must throw PersonaValidationError when the `agentId` required field
   * is absent from the YAML front-matter.
   *
   * Fixture: cl7-fixture-missing-agentid.md (has all fields except agentId)
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-001: load() throws PersonaValidationError when agentId field is missing',
    async () => {
      // PS-GL-001
      // RED: PersonaLoader returns content without validating → promise resolves,
      // not rejects.  GREEN after D3: throws PersonaValidationError.
      await expect(
        loader.load('cl7-fixture-missing-agentid'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-002
   * load() must throw PersonaValidationError when the `description` required
   * field is absent from the YAML front-matter.
   *
   * Fixture: cl7-fixture-missing-description.md
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-002: load() throws PersonaValidationError when description field is missing',
    async () => {
      // PS-GL-001
      await expect(
        loader.load('cl7-fixture-missing-description'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-003
   * load() must throw PersonaValidationError when the `module` required field
   * is absent from the YAML front-matter.
   *
   * Fixture: cl7-fixture-missing-module.md
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-003: load() throws PersonaValidationError when module field is missing',
    async () => {
      // PS-GL-001
      await expect(
        loader.load('cl7-fixture-missing-module'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-004
   * load() must throw PersonaValidationError when the `version` required field
   * is absent from the YAML front-matter.
   *
   * Fixture: cl7-fixture-missing-version.md
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-004: load() throws PersonaValidationError when version field is missing',
    async () => {
      // PS-GL-001
      await expect(
        loader.load('cl7-fixture-missing-version'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-005
   * load() must throw PersonaValidationError when the `last_reviewed` required
   * field is absent from the YAML front-matter.
   *
   * Fixture: cl7-fixture-missing-last-reviewed.md
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-005: load() throws PersonaValidationError when last_reviewed field is missing',
    async () => {
      // PS-GL-001
      await expect(
        loader.load('cl7-fixture-missing-last-reviewed'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-006
   * load() must throw PersonaValidationError when the `owner` required field
   * is absent from the YAML front-matter.
   *
   * Fixture: cl7-fixture-missing-owner.md
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-006: load() throws PersonaValidationError when owner field is missing',
    async () => {
      // PS-GL-001
      await expect(
        loader.load('cl7-fixture-missing-owner'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-007
   * load() must throw PersonaValidationError when the persona file has no YAML
   * front-matter block at all (no `---` delimiters).
   *
   * Fixture: cl7-fixture-no-frontmatter.md (plain Markdown, no front-matter)
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-007: load() throws PersonaValidationError when no YAML front-matter is present',
    async () => {
      // PS-GL-001
      // RED: PersonaLoader returns raw content without checking for front-matter
      // presence.  GREEN after D3: absence of `---` block triggers
      // PersonaValidationError.
      await expect(
        loader.load('cl7-fixture-no-frontmatter'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-008
   * load() must throw PersonaValidationError when all required YAML front-matter
   * keys are present but their values are empty/blank strings.
   *
   * Fixture: cl7-fixture-blank-fields.md (keys present; values are empty strings)
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-008: load() throws PersonaValidationError when required fields are blank/empty',
    async () => {
      // PS-GL-001
      // RED: PersonaLoader does not inspect field values.  GREEN after D3:
      // blank values for required fields trigger PersonaValidationError.
      await expect(
        loader.load('cl7-fixture-blank-fields'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );
});

// ---------------------------------------------------------------------------
// CL-7-D2 — Persona registry sync (RED gate)
//
// Verifies that the Persona Registry (AIMC_PERSONA_LIFECYCLE.md §2) is in sync
// with actual persona files on disk AND that PersonaLoader enforces YAML
// front-matter conformance at load time.
//
// Registry agentIds (AIMC_PERSONA_LIFECYCLE.md §2, v1.1.0):
//   mat-advisor, isms-navigator, pit-advisor, risk-advisor, xdetect-advisor,
//   course-crafter-advisor, incident-intelligence-advisor,
//   maturity-roadmap-advisor, maturion-advisor
//
// Test breakdown:
//   CL-7-T-009  (structural — expected GREEN)  listAvailable() includes all registry agentIds
//   CL-7-T-010  (structural — expected GREEN)  all registry files are loadable
//   CL-7-T-011  (structural — expected GREEN)  all registry files have required YAML fields
//   CL-7-T-012  (conformance — RED gate)       PersonaLoader enforces validation on missing fields
//   CL-7-T-013  (conformance — RED gate)       PersonaLoader enforces validation on blank fields
//
// The entire D2 gate is RED until D3 turns T-012 and T-013 GREEN.
//
// Governance Reference: AIMC_PERSONA_LIFECYCLE.md §2, §5.1 | LKIAC Wave CL-7
// Authority: CS2 (@APGI-cmy)
// Wave: CL-7 (LKIAC Wave 7 — LKIAC-L3 PersonaLoader Improvements)
// ---------------------------------------------------------------------------

describe('CL-7-D2 — Persona registry sync (RED gate)', () => {
  // PS-GL-002

  /**
   * Authoritative Persona Registry agentIds per AIMC_PERSONA_LIFECYCLE.md §2 v1.1.0.
   * Update this list whenever CS2 modifies the registry table.
   */
  const REGISTRY_AGENT_IDS = [
    'mat-advisor',
    'isms-navigator',
    'pit-advisor',
    'risk-advisor',
    'xdetect-advisor',
    'course-crafter-advisor',
    'incident-intelligence-advisor',
    'maturity-roadmap-advisor',
    'maturion-advisor',
  ] as const;

  const REQUIRED_YAML_FIELDS = [
    'agentId',
    'description',
    'module',
    'version',
    'last_reviewed',
    'owner',
  ] as const;

  const loader = new PersonaLoader();

  /**
   * CL-7-T-009
   * PersonaLoader.listAvailable() must return ALL agentIds listed in the
   * Persona Registry.  If a registry entry has no corresponding .md file the
   * result will not contain that agentId and this test fails RED.
   *
   * Currently GREEN: all 9 registry files exist on disk.
   * Becomes RED if any registry file is deleted without a corresponding
   * registry update.
   *
   * Reference: AIMC_PERSONA_LIFECYCLE.md §2 | GRS-010 | APS §8.1
   */
  it(
    'CL-7-T-009: listAvailable() returns all agentIds from the Persona Registry',
    async () => {
      // PS-GL-002
      const available = await loader.listAvailable();

      for (const agentId of REGISTRY_AGENT_IDS) {
        expect(available).toContain(agentId);
      }
    },
  );

  /**
   * CL-7-T-010
   * Every agentId in the Persona Registry must have a loadable .md file at
   * packages/ai-centre/src/agents/<agentId>.md.  A PersonaNotFoundError
   * means the file is missing → test is RED.
   *
   * Currently GREEN: all 9 files exist.
   *
   * Reference: AIMC_PERSONA_LIFECYCLE.md §2 | GRS-028
   */
  it(
    'CL-7-T-010: every Persona Registry agentId has a corresponding loadable file',
    async () => {
      // PS-GL-002
      for (const agentId of REGISTRY_AGENT_IDS) {
        // Must resolve (not reject with PersonaNotFoundError)
        await expect(loader.load(agentId)).resolves.toBeDefined();
      }
    },
  );

  /**
   * CL-7-T-011
   * Every Persona Registry file must contain all 6 required YAML front-matter
   * fields (structural content check via extractFrontMatter helper).
   *
   * Currently GREEN: all 9 registry files already have valid YAML front-matter.
   * This test will catch any future regression where a required field is
   * accidentally removed from a persona file.
   *
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1
   */
  it(
    'CL-7-T-011: all Persona Registry files contain all required YAML front-matter fields',
    async () => {
      // PS-GL-002
      for (const agentId of REGISTRY_AGENT_IDS) {
        const content = await loader.load(agentId);
        const fm = extractFrontMatter(content);

        for (const field of REQUIRED_YAML_FIELDS) {
          expect(
            fm,
            `${agentId}.md is missing required front-matter field: ${field}`,
          ).toContain(`${field}:`);
        }
      }
    },
  );

  /**
   * CL-7-T-012
   * PersonaLoader.load() must enforce YAML front-matter validation AT LOAD
   * TIME — not just return raw content — by throwing PersonaValidationError
   * when a required field is absent.
   *
   * RED gate: PersonaLoader currently does not validate front-matter.
   * The fixture file `cl7-fixture-missing-agentid.md` exists on disk, so
   * load() resolves instead of rejecting → this assertion FAILS (RED).
   *
   * GREEN after D3: PersonaLoader validates on load; throws
   * PersonaValidationError for any file missing a required field.
   *
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-012: PersonaLoader enforces YAML front-matter validation at load time (missing field)',
    async () => {
      // PS-GL-002
      // RED: PersonaLoader returns content without validating → resolves.
      // GREEN after D3: throws PersonaValidationError.
      await expect(
        loader.load('cl7-fixture-missing-agentid'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-013
   * PersonaLoader.load() must throw PersonaValidationError when all required
   * YAML front-matter keys are present but their values are empty/blank strings.
   *
   * RED gate: PersonaLoader currently does not inspect field values.
   * The fixture `cl7-fixture-blank-fields.md` resolves without error → FAILS.
   *
   * GREEN after D3: PersonaLoader validates non-blank values for each required
   * field and throws PersonaValidationError when any value is blank.
   *
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-013: PersonaLoader enforces YAML front-matter validation at load time (blank fields)',
    async () => {
      // PS-GL-002
      // RED: PersonaLoader returns content without checking field values.
      // GREEN after D3: throws PersonaValidationError for blank field values.
      await expect(
        loader.load('cl7-fixture-blank-fields'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-014
   * PersonaLoader.load() must throw PersonaValidationError when the YAML
   * `agentId` field does not exactly match the loaded agentId (filename).
   *
   * Fixture: cl7-fixture-wrong-agentid.md (agentId: wrong-id, not matching filename)
   * Reference: AIMC_PERSONA_LIFECYCLE.md §3.4, §5.1 | APS §8.1
   */
  it(
    'CL-7-T-014: load() throws PersonaValidationError when agentId field does not match filename',
    async () => {
      await expect(
        loader.load('cl7-fixture-wrong-agentid'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-015
   * PersonaLoader.load() must throw PersonaValidationError when the `version`
   * field is present but does not conform to semver (N.N.N).
   *
   * Fixture: cl7-fixture-invalid-version.md (version: not-semver)
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-015: load() throws PersonaValidationError when version is not valid semver',
    async () => {
      await expect(
        loader.load('cl7-fixture-invalid-version'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );

  /**
   * CL-7-T-016
   * PersonaLoader.load() must throw PersonaValidationError when the
   * `last_reviewed` field is present but does not conform to YYYY-MM-DD.
   *
   * Fixture: cl7-fixture-invalid-last-reviewed.md (last_reviewed: 01/01/2026)
   * Reference: AIMC_PERSONA_LIFECYCLE.md §5.1 | APS §8.1
   */
  it(
    'CL-7-T-016: load() throws PersonaValidationError when last_reviewed is not YYYY-MM-DD',
    async () => {
      await expect(
        loader.load('cl7-fixture-invalid-last-reviewed'),
      ).rejects.toThrow(PersonaValidationError);
    },
  );
});
