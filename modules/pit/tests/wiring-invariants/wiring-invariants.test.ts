/**
 * Wave 9.7 RED Gate — PIT AIMC Wiring Invariants
 * Tests: PIT-AIMC-T-001 to PIT-AIMC-T-006
 *
 * QA-to-Red mandate: ALL tests in this file MUST fail (RED) before implementation.
 * These tests define acceptance criteria for the Wave 9.7 PIT AIMC wiring build.
 * They will pass (GREEN) only after api-builder/integration-builder deliver:
 *   - packages/ai-centre/src/agents/pit-advisor.md  (T-001 — api-builder)
 *   - modules/pit/src/services/aimc-wiring.ts       (T-002 through T-006 — integration-builder)
 *
 * Architecture Freeze: ARCH-FREEZE-WAVE9-TRACK-C-20260226
 * Architecture: governance/aimc/freezes/ARCH_FREEZE-wave9-track-c-module-integration-20260226.md
 * AAWP Reference: governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md v0.2.0, §4, Wave 9.7
 * Foreman Session: session-063-20260226
 * Foreman Authorization: foreman-v2-agent — Issue #634 by @APGI-cmy
 *
 * Expected RED status (pre-Wave 9.7 implementation):
 *   PIT-AIMC-T-001 RED — packages/ai-centre/src/agents/pit-advisor.md does not exist
 *                        (PersonaLoader throws PersonaNotFoundError)
 *   PIT-AIMC-T-002 RED — modules/pit/src/services/aimc-wiring.ts does not exist
 *   PIT-AIMC-T-003 RED — aimc-wiring.ts does not exist (cannot read content)
 *   PIT-AIMC-T-004 RED — aimc-wiring.ts does not exist (cannot read content)
 *   PIT-AIMC-T-005 RED — aimc-wiring.ts does not exist (cannot read content)
 *   PIT-AIMC-T-006 RED — modules/pit/src does not exist (sanity check fails)
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ROOT = process.cwd(); // repo root — resolved at runtime

function resolveFromRoot(...segments: string[]): string {
  return path.join(ROOT, ...segments);
}

/**
 * Recursively collect all .ts / .tsx file paths under `dir`.
 * Returns empty array if directory does not exist (callers must assert length > 0).
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

// ─────────────────────────────────────────────────────────────────────────────
// Constants — paths under test
// ─────────────────────────────────────────────────────────────────────────────

const WIRING_SERVICE_PATH = resolveFromRoot(
  'modules/pit/src/services/aimc-wiring.ts',
);

const PIT_SRC_DIR = resolveFromRoot('modules/pit/src');

// ─────────────────────────────────────────────────────────────────────────────
// Test suite
// ─────────────────────────────────────────────────────────────────────────────

describe('Wave 9.7 RED Gate — PIT AIMC Wiring Invariants', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // PIT-AIMC-T-001
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'PIT-AIMC-T-001: PersonaLoader.load("pit-advisor") returns non-empty Markdown string',
    async () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §3.2):
       *   A persona file must exist at packages/ai-centre/src/agents/pit-advisor.md
       *   and must be loadable via PersonaLoader.load().
       *
       * Acceptance criteria:
       *   1. PersonaLoader can be imported (module exists)
       *   2. PersonaLoader.load('pit-advisor') resolves to a non-empty string
       *   3. Content is Markdown (contains at least one '#' heading or has length > 0)
       *
       * Status: RED — packages/ai-centre/src/agents/pit-advisor.md does not exist.
       *   PersonaLoader.load('pit-advisor') will throw PersonaNotFoundError.
       *   Will turn GREEN when api-builder creates pit-advisor.md in Wave 9.7.
       *
       * Note: There are TWO distinct paths involved here:
       *   - Import path (plural 'personas'): packages/ai-centre/src/personas/PersonaLoader.ts
       *     This is WHERE PersonaLoader.ts itself lives (the TypeScript module file).
       *   - Persona storage path (singular 'agents'): packages/ai-centre/src/agents/*.md
       *     This is WHERE PersonaLoader loads .md persona files FROM at runtime.
       *   The import uses 'personas' (module location); the .md file lives in 'agents' (content location).
       */
      const { PersonaLoader } = await import(
        // Uses the correct AIMC gateway-contract path (plural 'personas')
        // This path exists at packages/ai-centre/src/personas/PersonaLoader.js
        '../../../../packages/ai-centre/src/personas/PersonaLoader.js'
      );

      const loader = new PersonaLoader();
      const content = await loader.load('pit-advisor');

      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // PIT-AIMC-T-002
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'PIT-AIMC-T-002: PIT AIMC wiring service exists at expected module path',
    () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §3.2):
       *   The PIT AIMC wiring service MUST be located at:
       *     modules/pit/src/services/aimc-wiring.ts
       *
       * Acceptance criteria:
       *   File exists at the canonical path defined in the architecture freeze.
       *
       * Status: RED — modules/pit/src/services/aimc-wiring.ts does not exist.
       *   Will turn GREEN when api-builder/integration-builder delivers Wave 9.7 impl.
       */
      expect(
        fs.existsSync(WIRING_SERVICE_PATH),
        `PIT AIMC wiring service MUST exist at: ${WIRING_SERVICE_PATH}\n` +
          'This file will be created by api-builder/integration-builder in Wave 9.7.',
      ).toBe(true);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // PIT-AIMC-T-003
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'PIT-AIMC-T-003: PIT wiring service calls POST /api/ai/request (not any provider SDK directly)',
    () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §2.2):
       *   The module integration service MUST call POST /api/ai/request.
       *   Direct provider SDK calls are explicitly prohibited.
       *
       * Acceptance criteria:
       *   aimc-wiring.ts source code contains a reference to '/api/ai/request'
       *   (indicating it routes through the AIMC gateway, not provider SDKs directly).
       *
       * Status: RED — aimc-wiring.ts does not exist (file check will fail first).
       */
      expect(
        fs.existsSync(WIRING_SERVICE_PATH),
        `aimc-wiring.ts must exist at: ${WIRING_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(WIRING_SERVICE_PATH, 'utf-8');

      expect(
        content,
        'aimc-wiring.ts MUST reference the AIMC gateway endpoint /api/ai/request. ' +
          'Direct provider SDK calls (openai, anthropic, etc.) are prohibited.',
      ).toContain('/api/ai/request');
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // PIT-AIMC-T-004
  // ──────────────────────────────────────────────────────────────────────────
  it(
    "PIT-AIMC-T-004: PIT wiring service uses `capability: 'analysis'` in request payload",
    () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §3.2):
       *   The PIT wiring service MUST pass `capability: 'analysis'` in the AIMC request.
       *   PIT is a threat analysis tool and uses the 'analysis' capability (not 'advisory').
       *   This routes the request through the analysis capability in the AIMC gateway.
       *
       * Acceptance criteria:
       *   aimc-wiring.ts source code contains `capability: 'analysis'`
       *   (or equivalent: capability: "analysis").
       *
       * IMPORTANT: PIT uses 'analysis' capability, NOT 'advisory'.
       *   MAT/xDetect use 'advisory'; PIT uses 'analysis' for threat analysis.
       *
       * Status: RED — aimc-wiring.ts does not exist (file check will fail first).
       */
      expect(
        fs.existsSync(WIRING_SERVICE_PATH),
        `aimc-wiring.ts must exist at: ${WIRING_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(WIRING_SERVICE_PATH, 'utf-8');

      expect(
        content,
        "aimc-wiring.ts MUST include `capability: 'analysis'` (or double-quoted variant) " +
          'in the AIMC gateway request payload. ' +
          "PIT uses threat analysis capability ('analysis'), NOT advisory ('advisory').",
      ).toMatch(/capability\s*:\s*['"]analysis['"]/);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // PIT-AIMC-T-005
  // ──────────────────────────────────────────────────────────────────────────
  it(
    "PIT-AIMC-T-005: PIT wiring service uses `agent: 'pit-advisor'` in request payload",
    () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §3.2):
       *   The PIT wiring service MUST pass `agent: 'pit-advisor'` in the AIMC request.
       *   This ensures AIMC selects the correct persona for PIT threat analysis responses.
       *
       * Acceptance criteria:
       *   aimc-wiring.ts source code contains `agent: 'pit-advisor'`
       *   (or equivalent double-quoted variant).
       *
       * Status: RED — aimc-wiring.ts does not exist (file check will fail first).
       */
      expect(
        fs.existsSync(WIRING_SERVICE_PATH),
        `aimc-wiring.ts must exist at: ${WIRING_SERVICE_PATH}`,
      ).toBe(true);

      const content = fs.readFileSync(WIRING_SERVICE_PATH, 'utf-8');

      expect(
        content,
        "aimc-wiring.ts MUST include `agent: 'pit-advisor'` (or double-quoted variant) " +
          'in the AIMC gateway request payload. ' +
          "This routes the request to the 'pit-advisor' persona registered in AIMC.",
      ).toMatch(/agent\s*:\s*['"]pit-advisor['"]/);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // PIT-AIMC-T-006
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'PIT-AIMC-T-006: No direct OpenAI/Anthropic/provider SDK imports exist in pit module source',
    () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §2.2):
       *   PIT module source MUST NOT import provider SDKs directly.
       *   All AI calls MUST route through the AIMC gateway (POST /api/ai/request).
       *   Direct provider imports bypass AIMC governance and are prohibited.
       *
       * Forbidden import patterns:
       *   - 'openai'
       *   - 'anthropic'
       *   - '@anthropic-ai'
       *   - 'perplexity'
       *
       * Acceptance criteria:
       *   1. modules/pit/src directory is non-empty (sanity check)
       *   2. Zero source files contain forbidden provider SDK imports
       *
       * Status: RED — modules/pit/src does not exist yet (sanity check will fail).
       *   Will turn GREEN after Wave 9.7 delivery (src exists with no provider imports).
       */
      const sourceFiles = collectSourceFiles(PIT_SRC_DIR);

      expect(
        sourceFiles.length,
        `modules/pit/src must be non-empty (sanity check). ` +
          `Path checked: ${PIT_SRC_DIR}\n` +
          'This directory will be created by api-builder/integration-builder in Wave 9.7.',
      ).toBeGreaterThan(0);

      const FORBIDDEN_IMPORT_PATTERN =
        /import\s+.*from\s+['"](?:openai|anthropic|@anthropic-ai(?:\/[^'"]*)?|perplexity)['"]/;

      const violatingFiles = sourceFiles.filter((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return FORBIDDEN_IMPORT_PATTERN.test(content);
      });

      expect(
        violatingFiles,
        'No PIT module source files may import provider SDKs directly. ' +
          'All AI calls must route through the AIMC gateway.\n' +
          `Violating files: ${violatingFiles.join(', ')}`,
      ).toHaveLength(0);
    },
  );
});
