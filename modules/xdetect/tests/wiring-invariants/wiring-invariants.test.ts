/**
 * Wave 9.6 RED Gate — xDetect AIMC Wiring Invariants
 * Tests: XDETECT-AIMC-T-001 to XDETECT-AIMC-T-006
 *
 * QA-to-Red mandate: ALL tests in this file MUST fail (RED) before implementation.
 * These tests define acceptance criteria for the Wave 9.6 xDetect AIMC wiring build.
 * They will pass (GREEN) only after api-builder/integration-builder deliver:
 *   - modules/xdetect/src/services/aimc-wiring.ts
 *
 * Architecture Freeze: ARCH-FREEZE-WAVE9-TRACK-C-20260226
 * Architecture: governance/aimc/freezes/ARCH_FREEZE-wave9-track-c-module-integration-20260226.md
 * AAWP Reference: governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md v0.2.0, §4, Wave 9.6
 * Foreman Session: session-063-20260226
 * Foreman Authorization: foreman-v2-agent — Issue #634 by @APGI-cmy
 *
 * Expected status (post-remediation, pre-Wave 9.6 implementation):
 *   XDETECT-AIMC-T-001 GREEN — PersonaLoader path corrected to plural 'personas' (regression guard)
 *   XDETECT-AIMC-T-002 RED — modules/xdetect/src/services/aimc-wiring.ts does not exist
 *   XDETECT-AIMC-T-003 RED — aimc-wiring.ts does not exist (cannot read content)
 *   XDETECT-AIMC-T-004 RED — aimc-wiring.ts does not exist (cannot read content)
 *   XDETECT-AIMC-T-005 RED — aimc-wiring.ts does not exist (cannot read content)
 *   XDETECT-AIMC-T-006 RED — modules/xdetect/src does not exist (sanity check fails)
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
  'modules/xdetect/src/services/aimc-wiring.ts',
);

const XDETECT_SRC_DIR = resolveFromRoot('modules/xdetect/src');

// ─────────────────────────────────────────────────────────────────────────────
// Test suite
// ─────────────────────────────────────────────────────────────────────────────

describe('Wave 9.6 RED Gate — xDetect AIMC Wiring Invariants', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // XDETECT-AIMC-T-001
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'XDETECT-AIMC-T-001: PersonaLoader.load("xdetect-advisor") returns non-empty Markdown string',
    async () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §3.1):
       *   A persona file must exist at packages/ai-centre/src/agents/xdetect-advisor.md
       *   and must be loadable via PersonaLoader.load().
       *
       * Acceptance criteria:
       *   1. PersonaLoader can be imported (module exists)
       *   2. PersonaLoader.load('xdetect-advisor') resolves to a non-empty string
       *   3. Content is Markdown (contains at least one '#' heading or has length > 0)
       *
       * Status: GREEN (regression guard) — import path now correctly resolves to
       *   `packages/ai-centre/src/personas/PersonaLoader.js` (plural 'personas').
       *   xdetect-advisor.md exists; this test guards that PersonaLoader continues
       *   to load the persona correctly after Wave 9.6 implementation.
       *
       * Note: The persona file xdetect-advisor.md exists; this test is a regression
       * guard ensuring the AIMC gateway module resolution path remains correct.
       */
      const { PersonaLoader } = await import(
        // Uses the correct AIMC gateway-contract path (plural 'personas')
        // This path exists at packages/ai-centre/src/personas/PersonaLoader.js
        '../../../../packages/ai-centre/src/personas/PersonaLoader.js'
      );

      const loader = new PersonaLoader();
      const content = await loader.load('xdetect-advisor');

      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // XDETECT-AIMC-T-002
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'XDETECT-AIMC-T-002: xDetect AIMC wiring service exists at expected module path',
    () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §3.1):
       *   The xDetect AIMC wiring service MUST be located at:
       *     modules/xdetect/src/services/aimc-wiring.ts
       *
       * Acceptance criteria:
       *   File exists at the canonical path defined in the architecture freeze.
       *
       * Status: RED — modules/xdetect/src/services/aimc-wiring.ts does not exist.
       *   Will turn GREEN when api-builder/integration-builder delivers Wave 9.6 impl.
       */
      expect(
        fs.existsSync(WIRING_SERVICE_PATH),
        `xDetect AIMC wiring service MUST exist at: ${WIRING_SERVICE_PATH}\n` +
          'This file will be created by api-builder/integration-builder in Wave 9.6.',
      ).toBe(true);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // XDETECT-AIMC-T-003
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'XDETECT-AIMC-T-003: xDetect wiring service calls POST /api/ai/request (not any provider SDK directly)',
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
  // XDETECT-AIMC-T-004
  // ──────────────────────────────────────────────────────────────────────────
  it(
    "XDETECT-AIMC-T-004: xDetect wiring service uses `capability: 'advisory'` in request payload",
    () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §3.1):
       *   The wiring service MUST pass `capability: 'advisory'` in the AIMC request.
       *   This routes the request through the advisory capability in the AIMC gateway.
       *
       * Acceptance criteria:
       *   aimc-wiring.ts source code contains `capability: 'advisory'`
       *   (or equivalent: capability: "advisory").
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
        "aimc-wiring.ts MUST include `capability: 'advisory'` (or double-quoted variant) " +
          'in the AIMC gateway request payload. ' +
          'This ensures AIMC routes the request via the advisory capability.',
      ).toMatch(/capability\s*:\s*['"]advisory['"]/);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // XDETECT-AIMC-T-005
  // ──────────────────────────────────────────────────────────────────────────
  it(
    "XDETECT-AIMC-T-005: xDetect wiring service uses `agent: 'xdetect-advisor'` in request payload",
    () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §3.1):
       *   The wiring service MUST pass `agent: 'xdetect-advisor'` in the AIMC request.
       *   This ensures AIMC selects the correct persona for xDetect advisory responses.
       *
       * Acceptance criteria:
       *   aimc-wiring.ts source code contains `agent: 'xdetect-advisor'`
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
        "aimc-wiring.ts MUST include `agent: 'xdetect-advisor'` (or double-quoted variant) " +
          'in the AIMC gateway request payload. ' +
          "This routes the request to the 'xdetect-advisor' persona registered in AIMC.",
      ).toMatch(/agent\s*:\s*['"]xdetect-advisor['"]/);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // XDETECT-AIMC-T-006
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'XDETECT-AIMC-T-006: No direct OpenAI/Anthropic/provider SDK imports exist in xdetect module source',
    () => {
      /**
       * Architecture mandate (ARCH-FREEZE-WAVE9-TRACK-C-20260226 §2.2):
       *   xDetect module source MUST NOT import provider SDKs directly.
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
       *   1. modules/xdetect/src directory is non-empty (sanity check)
       *   2. Zero source files contain forbidden provider SDK imports
       *
       * Status: RED — modules/xdetect/src does not exist yet (sanity check will fail).
       *   Will turn GREEN after Wave 9.6 delivery (src exists with no provider imports).
       */
      const sourceFiles = collectSourceFiles(XDETECT_SRC_DIR);

      expect(
        sourceFiles.length,
        `modules/xdetect/src must be non-empty (sanity check). ` +
          `Path checked: ${XDETECT_SRC_DIR}\n` +
          'This directory will be created by api-builder/integration-builder in Wave 9.6.',
      ).toBeGreaterThan(0);

      const FORBIDDEN_IMPORT_PATTERN =
        /import\s+.*from\s+['"](?:openai|anthropic|@anthropic-ai(?:\/[^'"]*)?|perplexity)['"]/;

      const violatingFiles = sourceFiles.filter((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return FORBIDDEN_IMPORT_PATTERN.test(content);
      });

      expect(
        violatingFiles,
        'No xDetect module source files may import provider SDKs directly. ' +
          'All AI calls must route through the AIMC gateway.\n' +
          `Violating files: ${violatingFiles.join(', ')}`,
      ).toHaveLength(0);
    },
  );
});
