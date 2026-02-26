/**
 * MAT Tests — Wave 8: AIMC Analysis Integration
 * Tests: MAT-T-AIMC-011 to MAT-T-AIMC-020
 *
 * RED gate — these tests define acceptance criteria for Wave 8.
 * They FAIL before Wave 8 implementation and PASS after.
 *
 * Architecture: modules/mat/02-architecture/ai-architecture.md v2.0.0
 * Implementation Plan: modules/mat/03-implementation-plan/implementation-plan.md §2.9
 * FRS: FR-072, FR-028
 * TRS: TR-072, TR-040
 *
 * Expected RED/GREEN status (pre-Wave 8):
 *   MAT-T-AIMC-011 RED  — analysis-service.ts does not exist yet
 *   MAT-T-AIMC-012 RED  — analysis-service.ts does not exist yet
 *   MAT-T-AIMC-013 RED  — analysis-service.ts does not exist yet
 *   MAT-T-AIMC-014 RED  — analysis-service.ts does not exist yet
 *   MAT-T-AIMC-015 GREEN — regression guard (criteria-management.ts already clean)
 *   MAT-T-AIMC-016 RED  — ai-scoring.ts contains hardcoded model names (gpt-4-turbo, gpt-4o-mini)
 *   MAT-T-AIMC-017 GREEN — regression guard (no direct provider imports in MAT src)
 *   MAT-T-AIMC-018 GREEN — regression guard (modules/mat/.env.example already clean)
 *   MAT-T-AIMC-019 RED  — BUILD_PROGRESS_TRACKER.md Wave 8 entry is BLOCKED, not COMPLETE
 *   MAT-T-AIMC-020 RED  — analysis-service.ts does not exist yet
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

const ROOT = process.cwd(); // repo root — resolved at runtime via process.cwd()

function resolveFromRoot(...segments: string[]): string {
  return path.join(ROOT, ...segments);
}

/**
 * Recursively collect all .ts / .tsx file paths under `dir`.
 */
function collectSourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectSourceFiles(fullPath));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

// ──────────────────────────────────────────────────────────────────────────────
// Constants — paths under test
// ──────────────────────────────────────────────────────────────────────────────

const ANALYSIS_SERVICE_PATH = resolveFromRoot(
  'modules/mat/src/services/analysis-service.ts',
);
const CRITERIA_MANAGEMENT_PATH = resolveFromRoot(
  'modules/mat/src/services/criteria-management.ts',
);
const AI_SCORING_PATH = resolveFromRoot(
  'modules/mat/src/services/ai-scoring.ts',
);
const MAT_SRC_DIR = resolveFromRoot('modules/mat/src');
const MAT_ENV_EXAMPLE_PATH = resolveFromRoot('modules/mat/.env.example');
const BUILD_PROGRESS_TRACKER_PATH = resolveFromRoot(
  'modules/mat/BUILD_PROGRESS_TRACKER.md',
);

// ──────────────────────────────────────────────────────────────────────────────
// Test suite
// ──────────────────────────────────────────────────────────────────────────────

describe('MAT Wave 8 — AIMC Analysis Integration RED Gate', () => {
  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-011
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-011: analysis-service.ts exists at ' +
      'modules/mat/src/services/analysis-service.ts',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   MAT criteria parsing and maturity scoring MUST be delegated to AIMC Analysis
       *   Gateway via a dedicated service layer — not inlined in existing services.
       *
       * Wave 8 requires a new `analysis-service.ts` that wraps AIMC Analysis calls
       * so criteria-management.ts and ai-scoring.ts can call it without direct
       * provider coupling.
       *
       * Acceptance criteria:
       *   1. File exists at modules/mat/src/services/analysis-service.ts
       *
       * Status: RED — analysis-service.ts does not exist (Wave 8 not yet built).
       */
      expect(
        fs.existsSync(ANALYSIS_SERVICE_PATH),
        `analysis-service.ts must exist at: ${ANALYSIS_SERVICE_PATH}`,
      ).toBe(true);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-012
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-012: analysis-service.ts exports parseCriteriaDocument function',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   The analysis service must expose `parseCriteriaDocument` so that
       *   criteria-management.ts can delegate document parsing to AIMC Analysis
       *   Gateway (Capability.ANALYSIS) instead of holding parsing logic inline.
       *
       * Acceptance criteria:
       *   1. analysis-service.ts exists
       *   2. Exports a `parseCriteriaDocument` function (named or const export)
       *
       * Status: RED — analysis-service.ts does not exist (Wave 8 not yet built).
       */
      expect(
        fs.existsSync(ANALYSIS_SERVICE_PATH),
        `analysis-service.ts must exist at: ${ANALYSIS_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(ANALYSIS_SERVICE_PATH, 'utf-8');

      expect(
        content,
        'analysis-service.ts must export a parseCriteriaDocument function',
      ).toMatch(
        /export\s+(?:async\s+)?(?:function\s+parseCriteriaDocument|const\s+parseCriteriaDocument\s*=)/,
      );
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-013
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-013: analysis-service.ts exports scoreMaturity function',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   The analysis service must expose `scoreMaturity` so that ai-scoring.ts
       *   can delegate maturity scoring to AIMC Analysis Gateway
       *   (Capability.ANALYSIS) instead of using a direct provider routing table.
       *
       * Acceptance criteria:
       *   1. analysis-service.ts exists
       *   2. Exports a `scoreMaturity` function (named or const export)
       *
       * Status: RED — analysis-service.ts does not exist (Wave 8 not yet built).
       */
      expect(
        fs.existsSync(ANALYSIS_SERVICE_PATH),
        `analysis-service.ts must exist at: ${ANALYSIS_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(ANALYSIS_SERVICE_PATH, 'utf-8');

      expect(
        content,
        'analysis-service.ts must export a scoreMaturity function',
      ).toMatch(
        /export\s+(?:async\s+)?(?:function\s+scoreMaturity|const\s+scoreMaturity\s*=)/,
      );
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-014
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-014: analysis-service.ts imports from @maturion/ai-centre ' +
      '(AIMC gateway) — no direct OpenAI/provider imports',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   All AI calls in MAT MUST go through AIMC gateway (`@maturion/ai-centre`
       *   or a relative import of the ai-centre package). Direct provider SDK
       *   imports (openai, @anthropic-ai, etc.) are strictly forbidden in MAT src.
       *
       * Acceptance criteria:
       *   1. analysis-service.ts exists
       *   2. Contains an import from `@maturion/ai-centre` or a relative path
       *      that resolves to the ai-centre package (e.g., `../../packages/ai-centre`)
       *   3. Does NOT import directly from 'openai', '@anthropic-ai', or any
       *      other provider SDK
       *
       * Status: RED — analysis-service.ts does not exist (Wave 8 not yet built).
       */
      expect(
        fs.existsSync(ANALYSIS_SERVICE_PATH),
        `analysis-service.ts must exist at: ${ANALYSIS_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(ANALYSIS_SERVICE_PATH, 'utf-8');

      // Must import from AIMC gateway (package name or relative path to ai-centre)
      const hasAICentreImport =
        /import\s+.*from\s+['"]@maturion\/ai-centre['"]/.test(content) ||
        /import\s+.*from\s+['"](?:[^'"]*\/)?ai-centre['"]/.test(content);

      expect(
        hasAICentreImport,
        'analysis-service.ts must import from @maturion/ai-centre or a relative ' +
          'path to the ai-centre package (AIMC gateway) — not from a direct provider SDK',
      ).toBe(true);

      // Must NOT import directly from provider SDKs
      expect(
        content,
        'analysis-service.ts must NOT import directly from "openai" package',
      ).not.toMatch(/import\s+.*from\s+['"]openai['"]/);

      expect(
        content,
        'analysis-service.ts must NOT import directly from "@anthropic-ai" package',
      ).not.toMatch(/import\s+.*from\s+['"]@anthropic-ai[^'"]*['"]/);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-015
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-015: criteria-management.ts does NOT contain hardcoded provider ' +
      'model names (gpt-4-turbo, gpt-4o-mini, whisper-1) ' +
      '[REGRESSION GUARD — must remain GREEN]',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   Model selection is AIMC's responsibility, not MAT's. criteria-management.ts
       *   must not contain any direct provider model names.
       *
       * Current state (pre-Wave 8):
       *   criteria-management.ts does NOT contain hardcoded model names — it is
       *   already clean. This test is a regression guard to ensure Wave 8 does not
       *   accidentally re-introduce model references.
       *
       *   Note: The model routing table (gpt-4-turbo, gpt-4o-mini) lives in
       *   ai-scoring.ts (tested by MAT-T-AIMC-016), NOT in criteria-management.ts.
       *
       * Status: GREEN — criteria-management.ts is already clean of model names.
       *   This test must remain GREEN through Wave 8 and beyond.
       */
      expect(
        fs.existsSync(CRITERIA_MANAGEMENT_PATH),
        `criteria-management.ts must exist at: ${CRITERIA_MANAGEMENT_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(CRITERIA_MANAGEMENT_PATH, 'utf-8');

      expect(
        content,
        'criteria-management.ts must NOT contain hardcoded OpenAI model name "gpt-4-turbo" ' +
          '(model selection belongs to AIMC routing config, not MAT)',
      ).not.toContain('gpt-4-turbo');

      expect(
        content,
        'criteria-management.ts must NOT contain hardcoded OpenAI model name "gpt-4o-mini" ' +
          '(model selection belongs to AIMC routing config, not MAT)',
      ).not.toContain('gpt-4o-mini');

      expect(
        content,
        'criteria-management.ts must NOT contain hardcoded Whisper model name "whisper-1" ' +
          '(model selection belongs to AIMC routing config, not MAT)',
      ).not.toContain('whisper-1');
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-016
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-016: ai-scoring.ts does NOT contain hardcoded provider model names ' +
      '(gpt-4-turbo, gpt-4o-mini)',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   Model selection is AIMC's responsibility, not MAT's. ai-scoring.ts currently
       *   contains an AI_ROUTING_TABLE with hardcoded provider model strings at lines
       *   ~349–355. Wave 8 must remove this routing table and delegate scoring to
       *   analysis-service.ts (which routes via AIMC Analysis Gateway).
       *
       * Current violation (pre-Wave 8):
       *   AI_ROUTING_TABLE in ai-scoring.ts has:
       *     primary_model: 'gpt-4-turbo'   (task_type: 'document_parsing', 'scoring', etc.)
       *     fallback_model: 'gpt-4o-mini'  (multiple task types)
       *     primary_model: 'whisper-1'     (task_type: 'transcription')
       *   These are provider-specific model strings that break AIMC abstraction.
       *
       * Status: RED — ai-scoring.ts currently contains 'gpt-4-turbo' and 'gpt-4o-mini'.
       */
      expect(
        fs.existsSync(AI_SCORING_PATH),
        `ai-scoring.ts must exist at: ${AI_SCORING_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(AI_SCORING_PATH, 'utf-8');

      expect(
        content,
        'ai-scoring.ts must NOT contain hardcoded OpenAI model name "gpt-4-turbo" ' +
          '(model selection belongs to AIMC routing config, not MAT). ' +
          'Current violation: AI_ROUTING_TABLE at lines ~349–355.',
      ).not.toContain('gpt-4-turbo');

      expect(
        content,
        'ai-scoring.ts must NOT contain hardcoded OpenAI model name "gpt-4o-mini" ' +
          '(model selection belongs to AIMC routing config, not MAT). ' +
          'Current violation: AI_ROUTING_TABLE at lines ~349–355.',
      ).not.toContain('gpt-4o-mini');
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-017 — REGRESSION GUARD (GREEN pre-Wave 8)
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-017: No direct provider SDK imports (openai, @anthropic-ai, ' +
      '@mistralai) in MAT src files ' +
      '[REGRESSION GUARD — must remain GREEN]',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   All AI calls are server-side only, proxied through AIMC gateway.
       *   No provider SDKs should be imported directly in any MAT src file.
       *
       * This test is a regression guard — it should PASS before Wave 8 and continue
       * to PASS after Wave 8. Wave 8 must not introduce any direct provider imports.
       *
       * Status: GREEN — no direct provider imports exist in modules/mat/src.
       */
      const sourceFiles = collectSourceFiles(MAT_SRC_DIR);

      expect(
        sourceFiles.length,
        'MAT_SRC_DIR must be non-empty (sanity check that path is correct)',
      ).toBeGreaterThan(0);

      const FORBIDDEN_IMPORT_PATTERN =
        /import\s+.*from\s+['"](?:openai|@anthropic-ai\/[^'"]+|@anthropic-ai|@mistralai\/[^'"]+)['"]/;

      const violatingFiles = sourceFiles.filter((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return FORBIDDEN_IMPORT_PATTERN.test(content);
      });

      expect(
        violatingFiles,
        `No MAT src files must import provider SDKs directly.\nViolating files: ${violatingFiles.join(', ')}`,
      ).toHaveLength(0);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-018 — REGRESSION GUARD (GREEN pre-Wave 8)
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-018: modules/mat/.env.example does NOT contain OPENAI_API_KEY ' +
      'or raw provider key variables ' +
      '[REGRESSION GUARD — must remain GREEN]',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   No provider API keys in MAT config — AIMC manages all provider credentials.
       *
       * Current state (pre-Wave 8):
       *   modules/mat/.env.example does NOT contain OPENAI_API_KEY or any provider
       *   key variables. Wave 7 already cleaned the environment configuration.
       *   This test is a regression guard to ensure Wave 8 does not re-introduce
       *   provider keys into MAT's environment.
       *
       * Status: GREEN — modules/mat/.env.example is already clean of provider keys.
       */
      expect(
        fs.existsSync(MAT_ENV_EXAMPLE_PATH),
        `modules/mat/.env.example must exist at: ${MAT_ENV_EXAMPLE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(MAT_ENV_EXAMPLE_PATH, 'utf-8');

      expect(
        content,
        'modules/mat/.env.example must NOT contain OPENAI_API_KEY ' +
          '(provider credentials belong in AIMC, not MAT)',
      ).not.toContain('OPENAI_API_KEY');

      expect(
        content,
        'modules/mat/.env.example must NOT contain OPENAI_ORG_ID ' +
          '(provider credentials belong in AIMC, not MAT)',
      ).not.toContain('OPENAI_ORG_ID');

      expect(
        content,
        'modules/mat/.env.example must NOT contain ANTHROPIC_API_KEY ' +
          '(provider credentials belong in AIMC, not MAT)',
      ).not.toContain('ANTHROPIC_API_KEY');

      expect(
        content,
        'modules/mat/.env.example must NOT contain OPENAI_DEFAULT_MODEL ' +
          '(model selection belongs in AIMC routing config, not MAT)',
      ).not.toContain('OPENAI_DEFAULT_MODEL');
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-019
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-019: BUILD_PROGRESS_TRACKER.md Wave 8 entry exists and is marked ' +
      'COMPLETE (post-delivery acceptance check)',
    () => {
      /**
       * BL-029 mandate:
       *   When completing a wave, the builder MUST update BUILD_PROGRESS_TRACKER.md.
       *   The Wave 8 entry must be marked COMPLETE (not BLOCKED, IN_PROGRESS, etc.)
       *   and must reference AIMC Analysis Integration.
       *
       * Current state:
       *   Wave 8 entry reads: "BLOCKED — Awaiting AIMC Wave 4 (Analysis Gateway)"
       *   This test will FAIL until Wave 8 delivery updates the tracker.
       *
       * Acceptance criteria:
       *   BUILD_PROGRESS_TRACKER.md contains a Wave 8 section that:
       *     1. Mentions "AIMC Analysis" or "AIMC Analysis Integration"
       *     2. Is marked COMPLETE (not BLOCKED / IN_PROGRESS / NOT_STARTED)
       *
       * Status: RED — Wave 8 is currently BLOCKED in the tracker.
       *   This test flips GREEN when api-builder delivers Wave 8 and updates the tracker.
       */
      expect(
        fs.existsSync(BUILD_PROGRESS_TRACKER_PATH),
        `BUILD_PROGRESS_TRACKER.md must exist at: ${BUILD_PROGRESS_TRACKER_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(BUILD_PROGRESS_TRACKER_PATH, 'utf-8');

      // Wave 8 section must exist and reference AIMC Analysis Integration
      expect(
        content,
        'BUILD_PROGRESS_TRACKER.md must contain a Wave 8 section referencing AIMC Analysis Integration',
      ).toMatch(/Wave\s+8[\s\S]{0,200}AIMC\s+Analysis/);

      // The Wave 8 entry must be marked COMPLETE — not BLOCKED or any other non-complete status
      expect(
        content,
        'BUILD_PROGRESS_TRACKER.md Wave 8 entry must be marked COMPLETE ' +
          '(currently shows BLOCKED — Wave 8 not yet delivered)',
      ).toMatch(/Wave\s+8[\s\S]{0,300}COMPLETE/);

      // Negative assertion: must NOT still show BLOCKED after completion
      const wave8BlockedPattern =
        /Wave\s+8[\s\S]{0,200}BLOCKED\s*[—-]\s*Awaiting\s+AIMC\s+Wave\s+4/;
      expect(
        wave8BlockedPattern.test(content),
        'BUILD_PROGRESS_TRACKER.md Wave 8 entry must NOT still show ' +
          '"BLOCKED — Awaiting AIMC Wave 4" after Wave 8 delivery',
      ).toBe(false);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-020
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-020: analysis-service.ts imports AICentre (or AICentreGateway) — ' +
      'AIMC gateway pattern confirmed',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   The analysis service must use the canonical AIMC gateway class — `AICentre`
       *   or `AICentreGateway` — as its entry point for all AI calls. This verifies
       *   the correct architectural pattern is used (not a raw HTTP client or custom
       *   wrapper that bypasses AIMC).
       *
       * Acceptance criteria:
       *   1. analysis-service.ts exists
       *   2. Contains an import statement that destructures or imports `AICentre`
       *      or `AICentreGateway` from the ai-centre package
       *
       * Status: RED — analysis-service.ts does not exist (Wave 8 not yet built).
       */
      expect(
        fs.existsSync(ANALYSIS_SERVICE_PATH),
        `analysis-service.ts must exist at: ${ANALYSIS_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(ANALYSIS_SERVICE_PATH, 'utf-8');

      // Must import AICentre or AICentreGateway from the ai-centre package
      expect(
        content,
        'analysis-service.ts must import AICentre or AICentreGateway from the ' +
          '@maturion/ai-centre package (canonical AIMC gateway class). ' +
          'Expected pattern: import { AICentre } from "@maturion/ai-centre"',
      ).toMatch(/import\s+.*\bAICentre(?:Gateway)?\b.*from/);
    },
  );
});
