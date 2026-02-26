/**
 * MAT Tests — Wave 7: AIMC Advisory Integration
 * Tests: MAT-T-AIMC-001 to MAT-T-AIMC-010
 *
 * RED gate — these tests define acceptance criteria for Wave 7.
 * They FAIL before Wave 7 implementation and PASS after.
 *
 * Architecture: modules/mat/02-architecture/ai-architecture.md v2.0.0
 * FRS: FR-072, FR-028, FR-029
 * TRS: TR-072, TR-017
 *
 * Expected RED/GREEN status (pre-Wave 7):
 *   MAT-T-AIMC-001 RED  — advisory-service.ts does not exist yet
 *   MAT-T-AIMC-002 RED  — aiAssistantConfig.ts has hardcoded provider model names
 *   MAT-T-AIMC-003 GREEN — regression guard (no direct provider imports found)
 *   MAT-T-AIMC-004 RED  — modules/mat/.env.example contains OPENAI_API_KEY + model vars
 *   MAT-T-AIMC-005 RED  — advisory-service.ts does not exist yet
 *   MAT-T-AIMC-006 RED  — advisory-service.ts does not exist yet
 *   MAT-T-AIMC-007 RED  — advisory-service.ts does not exist yet
 *   MAT-T-AIMC-008 RED  — EmbeddedAIAssistant.tsx has no unavailable/disabled state
 *   MAT-T-AIMC-009 GREEN — regression guard (no direct provider URLs found)
 *   MAT-T-AIMC-010 RED  — BUILD_PROGRESS_TRACKER.md Wave 7 entry is BLOCKED, not COMPLETE
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

const ADVISORY_SERVICE_PATH = resolveFromRoot(
  'modules/mat/src/services/advisory-service.ts',
);
const AI_ASSISTANT_CONFIG_PATH = resolveFromRoot(
  'modules/mat/frontend/src/components/common/aiAssistantConfig.ts',
);
const EMBEDDED_AI_ASSISTANT_PATH = resolveFromRoot(
  'modules/mat/frontend/src/components/common/EmbeddedAIAssistant.tsx',
);
const FRONTEND_SRC_DIR = resolveFromRoot('modules/mat/frontend/src');
const FRONTEND_ENV_EXAMPLE_PATH = resolveFromRoot(
  'modules/mat/frontend/.env.example',
);
const MAT_ENV_EXAMPLE_PATH = resolveFromRoot('modules/mat/.env.example');
const BUILD_PROGRESS_TRACKER_PATH = resolveFromRoot(
  'modules/mat/BUILD_PROGRESS_TRACKER.md',
);

// ──────────────────────────────────────────────────────────────────────────────
// Test suite
// ──────────────────────────────────────────────────────────────────────────────

describe('MAT Wave 7 — AIMC Advisory Integration RED Gate', () => {
  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-001
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-001: advisory-service.ts exists and exports invokeAdvisory ' +
      'which calls AICentre.request() with Capability.ADVISORY',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   MAT MUST call AIMC gateway via `ai.request()` — no direct provider calls.
       *
       * Acceptance criteria:
       *   1. File exists at modules/mat/src/services/advisory-service.ts
       *   2. Exports an `invokeAdvisory` function (named or default re-export)
       *   3. Calls `AICentre.request()` (or equivalent ai/aiCentre instance .request())
       *   4. Passes `capability: Capability.ADVISORY` to the request
       *
       * Status: RED — advisory-service.ts does not exist (Wave 7 not yet built).
       */
      expect(
        fs.existsSync(ADVISORY_SERVICE_PATH),
        `advisory-service.ts must exist at: ${ADVISORY_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(ADVISORY_SERVICE_PATH, 'utf-8');

      // Must export invokeAdvisory
      expect(
        content,
        'advisory-service.ts must export an invokeAdvisory function',
      ).toMatch(/export\s+(async\s+)?function\s+invokeAdvisory|export\s+(async\s+)?const\s+invokeAdvisory/);

      // Must use AICentre or an ai/aiCentre variable's .request() method
      expect(
        content,
        'advisory-service.ts must call .request() on an AICentre/ai instance (AIMC gateway)',
      ).toMatch(/\.\s*request\s*\(/);

      // Must reference Capability.ADVISORY — not a hardcoded provider string
      expect(
        content,
        'advisory-service.ts must use Capability.ADVISORY (not a hardcoded provider model)',
      ).toMatch(/Capability\.ADVISORY/);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-002
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-002: aiAssistantConfig.ts contains NO hardcoded provider model names',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   No provider API keys or model names in MAT config.
       *   Model selection is AIMC's responsibility, not MAT's.
       *
       * Current violation (pre-Wave 7):
       *   AI_AGENT_OPTIONS in aiAssistantConfig.ts has primaryModel: 'gpt-4-turbo'
       *   and primaryModel: 'gpt-4o-mini' — both are provider-specific model strings
       *   that break AIMC abstraction.
       *
       * Status: RED — file currently contains 'gpt-4-turbo' and 'gpt-4o-mini'.
       */
      expect(
        fs.existsSync(AI_ASSISTANT_CONFIG_PATH),
        `aiAssistantConfig.ts must exist at: ${AI_ASSISTANT_CONFIG_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(AI_ASSISTANT_CONFIG_PATH, 'utf-8');

      expect(
        content,
        'aiAssistantConfig.ts must NOT contain hardcoded OpenAI model name "gpt-4-turbo"',
      ).not.toContain('gpt-4-turbo');

      expect(
        content,
        'aiAssistantConfig.ts must NOT contain hardcoded OpenAI model name "gpt-4o-mini"',
      ).not.toContain('gpt-4o-mini');

      expect(
        content,
        'aiAssistantConfig.ts must NOT contain hardcoded Anthropic model references "claude"',
      ).not.toMatch(/['"]claude[-\w]*/);

      expect(
        content,
        'aiAssistantConfig.ts must NOT contain direct "anthropic" string references',
      ).not.toMatch(/['"]anthropic/i);

      // The primaryModel field must not hold provider model strings —
      // it should either be removed or reference a capability/task type only.
      expect(
        content,
        'aiAssistantConfig.ts must NOT contain a "primaryModel" field with a provider string ' +
          '(model selection belongs to AIMC, not MAT)',
      ).not.toMatch(/primaryModel\s*:\s*['"][a-z0-9][-a-z0-9]*['"]/);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-003 — REGRESSION GUARD (GREEN pre-Wave 7)
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-003: No direct OpenAI/Anthropic package imports in MAT frontend source ' +
      '[REGRESSION GUARD — must remain GREEN]',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   All AI calls are server-side only, proxied through MAT backend Edge Functions.
       *   No provider SDKs should be imported directly in the frontend.
       *
       * This test is a regression guard — it should PASS before Wave 7 and continue
       * to PASS after Wave 7. Wave 7 must not introduce any direct provider imports.
       *
       * Status: GREEN — no direct provider imports exist in frontend src.
       */
      const sourceFiles = collectSourceFiles(FRONTEND_SRC_DIR);

      expect(
        sourceFiles.length,
        'FRONTEND_SRC_DIR must be non-empty (sanity check that path is correct)',
      ).toBeGreaterThan(0);

      const FORBIDDEN_IMPORT_PATTERN =
        /import\s+.*from\s+['"](?:openai|@anthropic-ai\/sdk|@anthropic\/|anthropic)['"]/;

      const violatingFiles = sourceFiles.filter((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return FORBIDDEN_IMPORT_PATTERN.test(content);
      });

      expect(
        violatingFiles,
        `No MAT frontend source files must import provider SDKs directly.\nViolating files: ${violatingFiles.join(', ')}`,
      ).toHaveLength(0);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-004
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-004: No AI provider API keys or provider model names in MAT ' +
      'environment configuration (.env.example files)',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   No provider API keys in MAT config — AIMC manages all provider credentials.
       *
       * Current violation found in modules/mat/.env.example (pre-Wave 7):
       *   - OPENAI_API_KEY=sk-your-openai-api-key
       *   - OPENAI_ORG_ID=org-your-openai-org-id
       *   - OPENAI_DEFAULT_MODEL=gpt-4-turbo
       *   - OPENAI_FALLBACK_MODEL=gpt-4o-mini
       *
       * These variables belong in AIMC's environment, not MAT's.
       * Wave 7 must remove them from modules/mat/.env.example.
       *
       * NOTE: The delegation brief expected this to be a GREEN regression guard,
       * but file inspection reveals real violations in modules/mat/.env.example.
       * This test is therefore RED and is a valid Wave 7 acceptance criterion.
       *
       * Status: RED — modules/mat/.env.example contains provider keys and model names.
       */

      // ── Check modules/mat/frontend/.env.example ──────────────────────────
      expect(
        fs.existsSync(FRONTEND_ENV_EXAMPLE_PATH),
        `Frontend .env.example must exist at: ${FRONTEND_ENV_EXAMPLE_PATH}`,
      ).toBe(true);

      const frontendEnvContent = fs.readFileSync(
        FRONTEND_ENV_EXAMPLE_PATH,
        'utf-8',
      );

      expect(
        frontendEnvContent,
        'modules/mat/frontend/.env.example must NOT contain OPENAI_API_KEY',
      ).not.toContain('OPENAI_API_KEY');

      expect(
        frontendEnvContent,
        'modules/mat/frontend/.env.example must NOT contain ANTHROPIC_API_KEY',
      ).not.toContain('ANTHROPIC_API_KEY');

      // ── Check modules/mat/.env.example (if it exists) ───────────────────
      if (fs.existsSync(MAT_ENV_EXAMPLE_PATH)) {
        const matEnvContent = fs.readFileSync(MAT_ENV_EXAMPLE_PATH, 'utf-8');

        expect(
          matEnvContent,
          'modules/mat/.env.example must NOT contain OPENAI_API_KEY ' +
            '(provider credentials belong in AIMC, not MAT)',
        ).not.toContain('OPENAI_API_KEY');

        expect(
          matEnvContent,
          'modules/mat/.env.example must NOT contain OPENAI_ORG_ID ' +
            '(provider credentials belong in AIMC, not MAT)',
        ).not.toContain('OPENAI_ORG_ID');

        expect(
          matEnvContent,
          'modules/mat/.env.example must NOT contain ANTHROPIC_API_KEY ' +
            '(provider credentials belong in AIMC, not MAT)',
        ).not.toContain('ANTHROPIC_API_KEY');

        expect(
          matEnvContent,
          'modules/mat/.env.example must NOT contain OPENAI_DEFAULT_MODEL ' +
            '(model selection belongs in AIMC routing config, not MAT)',
        ).not.toContain('OPENAI_DEFAULT_MODEL');

        expect(
          matEnvContent,
          'modules/mat/.env.example must NOT contain OPENAI_FALLBACK_MODEL ' +
            '(fallback model selection belongs in AIMC routing config, not MAT)',
        ).not.toContain('OPENAI_FALLBACK_MODEL');
      }
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-005
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-005: advisory-service.ts captures and returns the AIMC invocation ' +
      'reference ID (telemetry.id from AICentreResponse)',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   AIMC invocation reference ID must be stored/returned for auditability.
       *   AICentreResponse includes `telemetry: TelemetryEvent` where `telemetry.id`
       *   is the canonical invocation reference.
       *
       * Acceptance criteria:
       *   1. advisory-service.ts exists
       *   2. It references `invocationReferenceId`, `referenceId`, or accesses
       *      `telemetry.id` from the AIMC response — indicating it captures
       *      the invocation reference for callers.
       *
       * Status: RED — advisory-service.ts does not exist (Wave 7 not yet built).
       */
      expect(
        fs.existsSync(ADVISORY_SERVICE_PATH),
        `advisory-service.ts must exist at: ${ADVISORY_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(ADVISORY_SERVICE_PATH, 'utf-8');

      // The service must expose the invocation reference in its return value.
      // Acceptable patterns:
      //   return { invocationReferenceId: response.telemetry.id, ... }
      //   return { referenceId: ..., ... }
      //   invocationReferenceId: telemetry.id
      expect(
        content,
        'advisory-service.ts must capture and return the AIMC invocation reference ID ' +
          '(telemetry.id). Expected: invocationReferenceId, referenceId, or telemetry.id in return.',
      ).toMatch(/invocationReferenceId|referenceId|telemetry\.id/);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-006
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-006: advisory-service.ts handles AIMC unavailability gracefully — ' +
      'returns structured error object instead of throwing',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   AIMC unavailability must disable panel gracefully (no crash).
       *   The service layer must absorb errors and return a typed error response
       *   so the UI can handle the unavailable state without unhandled exceptions.
       *
       * Acceptance criteria:
       *   1. advisory-service.ts exists
       *   2. Has a catch block (error handling is present)
       *   3. The catch block returns an error-shaped object rather than re-throwing
       *      (no bare `throw` inside a catch block body)
       *
       * Status: RED — advisory-service.ts does not exist (Wave 7 not yet built).
       */
      expect(
        fs.existsSync(ADVISORY_SERVICE_PATH),
        `advisory-service.ts must exist at: ${ADVISORY_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(ADVISORY_SERVICE_PATH, 'utf-8');

      // Must have error handling — a catch clause
      expect(
        content,
        'advisory-service.ts must have a catch block for AIMC error handling',
      ).toMatch(/catch\s*[\w(]/);

      // The catch block must return a structured error (not re-throw raw errors).
      // Strategy: detect catch blocks that contain a bare `throw` statement.
      // A compliant implementation returns `{ error: ..., success: false }` etc.
      // We use a heuristic: if the only throw in the file is NOT inside a catch,
      // or there is no throw at all after a catch, the service is compliant.
      //
      // Simple structural check: must contain a return statement after catch
      // (i.e., the catch path returns something rather than throwing).
      expect(
        content,
        'advisory-service.ts catch block must return a structured error object, not re-throw. ' +
          'Expected a return statement that includes an error indicator (error, success: false, etc.).',
      ).toMatch(/catch\s*[\w(][^}]{0,200}return\s+\{[^}]{0,150}(error|success\s*:\s*false|ok\s*:\s*false)/);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-007
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-007: advisory-service.ts exports listAdvisoryPersonas which ' +
      'sources personas from AIMC (personaLoader.listAvailable()) — not hardcoded',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   Persona list must come from AIMC canonical agent directory
       *   via `personaLoader.listAvailable()`.
       *   MAT must NOT maintain its own hardcoded persona/agent list.
       *
       * Acceptance criteria:
       *   1. advisory-service.ts exists
       *   2. Exports `listAdvisoryPersonas` function
       *   3. Calls `listAvailable()` — sourcing from AIMC PersonaLoader
       *
       * Status: RED — advisory-service.ts does not exist (Wave 7 not yet built).
       */
      expect(
        fs.existsSync(ADVISORY_SERVICE_PATH),
        `advisory-service.ts must exist at: ${ADVISORY_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(ADVISORY_SERVICE_PATH, 'utf-8');

      // Must export listAdvisoryPersonas
      expect(
        content,
        'advisory-service.ts must export a listAdvisoryPersonas function',
      ).toMatch(
        /export\s+(async\s+)?function\s+listAdvisoryPersonas|export\s+(async\s+)?const\s+listAdvisoryPersonas/,
      );

      // Must call listAvailable() — sourcing personas from AIMC PersonaLoader
      expect(
        content,
        'listAdvisoryPersonas must source personas from AIMC via listAvailable() — ' +
          'not a hardcoded array in MAT',
      ).toMatch(/listAvailable\s*\(\s*\)/);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-008
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-008: EmbeddedAIAssistant handles AIMC disabled/unavailable state ' +
      'gracefully — renders a dedicated unavailable UI element',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   AIMC unavailability must disable panel gracefully (no crash).
       *
       * The component must render a distinct UI element when AIMC is unavailable
       * so users receive clear feedback rather than a broken/hidden panel.
       *
       * Acceptance criteria:
       *   EmbeddedAIAssistant.tsx contains at least ONE of:
       *     - data-testid="ai-assistant-unavailable"
       *     - data-testid="ai-assistant-disabled"
       *     - data-testid="ai-assistant-error"
       *     - An `aiAvailable`, `isAvailable`, `aiDisabled` prop or state variable
       *       that controls the panel render path
       *
       * Status: RED — EmbeddedAIAssistant.tsx currently has no unavailable state
       *   handling (it is a placeholder scaffold with no AIMC wiring at all).
       */
      expect(
        fs.existsSync(EMBEDDED_AI_ASSISTANT_PATH),
        `EmbeddedAIAssistant.tsx must exist at: ${EMBEDDED_AI_ASSISTANT_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(EMBEDDED_AI_ASSISTANT_PATH, 'utf-8');

      // Must have a dedicated UI element or state for the unavailable scenario
      const hasUnavailableState =
        content.includes('data-testid="ai-assistant-unavailable"') ||
        content.includes("data-testid='ai-assistant-unavailable'") ||
        content.includes('data-testid="ai-assistant-disabled"') ||
        content.includes("data-testid='ai-assistant-disabled'") ||
        content.includes('data-testid="ai-assistant-error"') ||
        content.includes("data-testid='ai-assistant-error'") ||
        /\baiAvailable\b/.test(content) ||
        /\bisAvailable\b/.test(content) ||
        /\baiDisabled\b/.test(content) ||
        /\bisAiUnavailable\b/.test(content);

      expect(
        hasUnavailableState,
        'EmbeddedAIAssistant.tsx must contain handling for the AIMC unavailable/disabled state. ' +
          'Expected one of: data-testid="ai-assistant-unavailable", data-testid="ai-assistant-disabled", ' +
          'data-testid="ai-assistant-error", or state/prop variables: aiAvailable, isAvailable, ' +
          'aiDisabled, isAiUnavailable.',
      ).toBe(true);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-009 — REGRESSION GUARD (GREEN pre-Wave 7)
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-009: EmbeddedAIAssistant.tsx contains NO direct fetch() calls to ' +
      'OpenAI or Anthropic API endpoints [REGRESSION GUARD — must remain GREEN]',
    () => {
      /**
       * Architecture mandate (ai-architecture.md v2.0.0):
       *   All AI calls are server-side only (proxied through MAT backend Edge Functions).
       *   The frontend component must NEVER call provider APIs directly.
       *
       * This test is a regression guard — it should PASS before Wave 7 and continue
       * to PASS after Wave 7. Wave 7 must not introduce any direct provider endpoint calls.
       *
       * Status: GREEN — EmbeddedAIAssistant.tsx is a placeholder scaffold with
       *   no network calls; no direct provider URLs exist.
       */
      expect(
        fs.existsSync(EMBEDDED_AI_ASSISTANT_PATH),
        `EmbeddedAIAssistant.tsx must exist at: ${EMBEDDED_AI_ASSISTANT_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(EMBEDDED_AI_ASSISTANT_PATH, 'utf-8');

      expect(
        content,
        'EmbeddedAIAssistant.tsx must NOT contain a direct call to api.openai.com',
      ).not.toContain('api.openai.com');

      expect(
        content,
        'EmbeddedAIAssistant.tsx must NOT contain a direct call to api.anthropic.com',
      ).not.toContain('api.anthropic.com');

      expect(
        content,
        'EmbeddedAIAssistant.tsx must NOT contain any openai.com endpoint reference',
      ).not.toMatch(/openai\.com\/v\d/);
    },
  );

  // ────────────────────────────────────────────────────────────────────────────
  // MAT-T-AIMC-010
  // ────────────────────────────────────────────────────────────────────────────
  it(
    'MAT-T-AIMC-010: BUILD_PROGRESS_TRACKER.md Wave 7 entry exists and is marked COMPLETE ' +
      '(post-delivery acceptance check)',
    () => {
      /**
       * BL-029 mandate:
       *   When completing a wave, the builder MUST update BUILD_PROGRESS_TRACKER.md.
       *   The Wave 7 entry must be marked COMPLETE (not BLOCKED, IN_PROGRESS, etc.)
       *   and must reference AIMC Advisory Integration.
       *
       * Current state:
       *   Wave 7 entry reads: "BLOCKED — Awaiting AIMC Wave 3 (Advisory Gateway)"
       *   This test will FAIL until Wave 7 delivery updates the tracker.
       *
       * Acceptance criteria:
       *   BUILD_PROGRESS_TRACKER.md contains a Wave 7 section that:
       *     1. Mentions "AIMC Advisory" or "AIMC Advisory Integration"
       *     2. Is marked COMPLETE (not BLOCKED / IN_PROGRESS / NOT_STARTED)
       *
       * Status: RED — Wave 7 is currently BLOCKED in the tracker.
       */
      expect(
        fs.existsSync(BUILD_PROGRESS_TRACKER_PATH),
        `BUILD_PROGRESS_TRACKER.md must exist at: ${BUILD_PROGRESS_TRACKER_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(BUILD_PROGRESS_TRACKER_PATH, 'utf-8');

      // Wave 7 section must exist and reference AIMC Advisory Integration
      expect(
        content,
        'BUILD_PROGRESS_TRACKER.md must contain a Wave 7 section referencing AIMC Advisory Integration',
      ).toMatch(/Wave\s+7[\s\S]{0,200}AIMC\s+Advisory/);

      // The Wave 7 entry must be marked COMPLETE — not BLOCKED or any other non-complete status
      // Pattern: look for Wave 7 followed by COMPLETE within reasonable proximity
      expect(
        content,
        'BUILD_PROGRESS_TRACKER.md Wave 7 entry must be marked COMPLETE ' +
          '(currently shows BLOCKED — Wave 7 not yet delivered)',
      ).toMatch(/Wave\s+7[\s\S]{0,300}COMPLETE/);

      // Negative assertion: must NOT still show BLOCKED after completion
      // This is the test that flips from RED to GREEN when Wave 7 is delivered.
      const wave7BlockedPattern =
        /Wave\s+7[\s\S]{0,200}BLOCKED\s*[—-]\s*Awaiting\s+AIMC\s+Wave\s+3/;
      expect(
        wave7BlockedPattern.test(content),
        'BUILD_PROGRESS_TRACKER.md Wave 7 entry must NOT still show ' +
          '"BLOCKED — Awaiting AIMC Wave 3" after Wave 7 delivery',
      ).toBe(false);
    },
  );
});
