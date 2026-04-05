/**
 * CL-10 RED Gate — Routing Governance CI Enforcement
 * Tests: T-C-010-001 to T-C-010-009
 *
 * QA-to-Red mandate: Tests T-C-010-001 through T-C-010-006 MUST fail (RED)
 * before CI workflow implementation. Tests T-C-010-007 through T-C-010-009
 * validate pattern logic and may be GREEN immediately.
 *
 * These tests will all pass (GREEN) only after integration-builder delivers:
 *   - .github/workflows/routing-governance-check.yml (D2)
 *   - .github/workflows/stub-detection-check.yml (D3)
 *
 * Expected RED status (pre-D2/D3 implementation):
 *   T-C-010-001 RED — .github/workflows/routing-governance-check.yml does not exist
 *   T-C-010-002 RED — .github/workflows/routing-governance-check.yml does not exist
 *   T-C-010-003 RED — .github/workflows/routing-governance-check.yml does not exist
 *   T-C-010-004 RED — .github/workflows/routing-governance-check.yml does not exist
 *   T-C-010-005 RED — stub detection workflow does not exist
 *   T-C-010-006 RED — stub detection workflow does not exist
 *   T-C-010-007 GREEN — validates pattern logic only (no filesystem dependency)
 *   T-C-010-008 GREEN — validates pattern logic only (no filesystem dependency)
 *   T-C-010-009 GREEN — validates pattern logic only (no filesystem dependency)
 *
 * CEP Reference: governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md §Wave CL-10
 * Authority: GOV-001, GOV-002, T-C-010, FAIL-ONLY-ONCE S-002
 * Wave: CL-10 — LKIAC-L4 Routing Governance CI Enforcement
 * Issue: maturion-isms#1227
 * CS2 Authorization: maturion-isms#1221
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

// ─────────────────────────────────────────────────────────────────────────────
// Constants — paths under test
// ─────────────────────────────────────────────────────────────────────────────

const ROUTING_GOVERNANCE_WORKFLOW = resolveFromRoot(
  '.github/workflows/routing-governance-check.yml',
);

const STUB_DETECTION_WORKFLOW = resolveFromRoot(
  '.github/workflows/stub-detection-check.yml',
);

// ─────────────────────────────────────────────────────────────────────────────
// Test suite
// ─────────────────────────────────────────────────────────────────────────────

describe('CL-10 RED Gate — Routing Governance CI Enforcement', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // T-C-010-001: Provider import check workflow exists
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'T-C-010-001: routing-governance-check.yml workflow file exists',
    () => {
      const exists = fs.existsSync(ROUTING_GOVERNANCE_WORKFLOW);
      // RED: this file does not yet exist (D2 not yet delivered)
      expect(exists).toBe(true);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // T-C-010-002: Provider import check contains correct patterns
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'T-C-010-002: routing-governance-check.yml contains OpenAI and Anthropic import patterns',
    () => {
      // RED: file does not exist yet, readFileSync will throw or existsSync will fail
      expect(
        fs.existsSync(ROUTING_GOVERNANCE_WORKFLOW),
        'Workflow file must exist before checking its contents',
      ).toBe(true);

      const content = fs.readFileSync(ROUTING_GOVERNANCE_WORKFLOW, 'utf8');

      // Must contain a pattern that catches `import { OpenAI }` or `import OpenAI`.
      // The workflow YAML will contain grep/rg command strings referencing 'openai'
      // (the package name) — check for presence of both the import keyword context
      // and the openai package reference.
      const hasOpenAIPattern =
        content.includes('openai') &&
        (content.includes('import') || content.includes('OpenAI'));
      expect(
        hasOpenAIPattern,
        'Workflow must contain a pattern to detect OpenAI direct imports (referencing openai package)',
      ).toBe(true);

      // Must contain a pattern that catches `import Anthropic` or destructured imports.
      // The workflow YAML will contain grep/rg command strings referencing '@anthropic-ai/sdk'.
      const hasAnthropicPattern =
        content.includes('anthropic') || content.includes('Anthropic');
      expect(
        hasAnthropicPattern,
        'Workflow must contain a pattern to detect Anthropic direct imports (referencing anthropic-ai/sdk)',
      ).toBe(true);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // T-C-010-003: Provider import check covers modules/ and apps/ directories
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'T-C-010-003: routing-governance-check.yml covers both modules/ and apps/ directories',
    () => {
      // RED: file does not exist yet
      expect(
        fs.existsSync(ROUTING_GOVERNANCE_WORKFLOW),
        'Workflow file must exist before checking its contents',
      ).toBe(true);

      const content = fs.readFileSync(ROUTING_GOVERNANCE_WORKFLOW, 'utf8');

      expect(
        content.includes('modules/'),
        'Workflow must reference modules/ directory for scanning',
      ).toBe(true);

      expect(
        content.includes('apps/'),
        'Workflow must reference apps/ directory for scanning',
      ).toBe(true);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // T-C-010-004: Provider import check excludes maturion-maturity-legacy
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'T-C-010-004: routing-governance-check.yml excludes maturion-maturity-legacy',
    () => {
      // RED: file does not exist yet
      expect(
        fs.existsSync(ROUTING_GOVERNANCE_WORKFLOW),
        'Workflow file must exist before checking its contents',
      ).toBe(true);

      const content = fs.readFileSync(ROUTING_GOVERNANCE_WORKFLOW, 'utf8');

      expect(
        content.includes('maturion-maturity-legacy'),
        'Workflow must explicitly exclude maturion-maturity-legacy from scanning',
      ).toBe(true);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // T-C-010-005: Stub detection check workflow exists
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'T-C-010-005: stub-detection-check.yml workflow file exists',
    () => {
      const exists = fs.existsSync(STUB_DETECTION_WORKFLOW);
      // RED: this file does not yet exist (D3 not yet delivered)
      expect(exists).toBe(true);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // T-C-010-006: Stub detection check contains correct pattern
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'T-C-010-006: stub-detection-check.yml contains expect(true).toBe(true) detection pattern',
    () => {
      // RED: file does not exist yet
      expect(
        fs.existsSync(STUB_DETECTION_WORKFLOW),
        'Stub detection workflow file must exist before checking its contents',
      ).toBe(true);

      const content = fs.readFileSync(STUB_DETECTION_WORKFLOW, 'utf8');

      // Must contain a pattern to detect `expect(true).toBe(true)` stubs.
      // The workflow YAML will have a grep/rg pattern string. In YAML the regex
      // is typically stored with escaped parens: expect\(true\)\.toBe\(true\)
      // (single backslashes in the file → double backslashes in JS string literal).
      const hasStubPattern =
        content.includes('expect(true)') ||
        content.includes('expect\\(true\\)') ||
        content.includes('expect\\\\(true\\\\)');
      expect(
        hasStubPattern,
        'Stub detection workflow must contain pattern to detect expect(true).toBe(true) stubs',
      ).toBe(true);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // T-C-010-007: Fixture detection — OpenAI import pattern (GREEN)
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'T-C-010-007: fixture — regex catches direct OpenAI import pattern',
    () => {
      // Validates pattern logic without filesystem dependency — should be GREEN immediately
      // Pattern covers: default import, named import (single or multi-member), 'as' alias
      const bannedImportPattern =
        /import\s*\{[^}]*OpenAI[^}]*\}\s*from\s+['"]openai['"]|import\s+OpenAI\s+from\s+['"]openai['"]/;

      const fixture1 = `import { OpenAI } from 'openai'`;
      const fixture2 = `import OpenAI from 'openai'`;
      const fixture3 = `import { OpenAI, ChatCompletion } from 'openai'`;
      const fixture4 = `import { OpenAI as OAI } from 'openai'`;
      const allowedImport = `import { aiCentre } from '@maturion/ai-centre'`;

      expect(
        bannedImportPattern.test(fixture1),
        'Pattern must catch: import { OpenAI } from \'openai\'',
      ).toBe(true);

      expect(
        bannedImportPattern.test(fixture2),
        'Pattern must catch: import OpenAI from \'openai\'',
      ).toBe(true);

      expect(
        bannedImportPattern.test(fixture3),
        'Pattern must catch: import { OpenAI, ChatCompletion } from \'openai\'',
      ).toBe(true);

      expect(
        bannedImportPattern.test(fixture4),
        'Pattern must catch: import { OpenAI as OAI } from \'openai\'',
      ).toBe(true);

      expect(
        bannedImportPattern.test(allowedImport),
        'Pattern must NOT catch allowed ai-centre imports',
      ).toBe(false);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // T-C-010-008: Fixture detection — Anthropic import pattern (GREEN)
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'T-C-010-008: fixture — regex catches direct Anthropic import pattern',
    () => {
      // Validates pattern logic without filesystem dependency — should be GREEN immediately
      // Pattern covers: default import, named/destructured import, 'as' alias
      const bannedImportPattern =
        /import\s*(?:\{[^}]*)?Anthropic(?:[^}]*\})?\s*(?:as\s+\w+\s*)?from\s+['"]@anthropic-ai\/sdk['"]/;

      const fixture1 = `import Anthropic from '@anthropic-ai/sdk'`;
      const fixture2 = `import { Anthropic } from '@anthropic-ai/sdk'`;
      const fixture3 = `import Anthropic as AI from '@anthropic-ai/sdk'`;
      const allowedImport = `import { aiCentre } from '@maturion/ai-centre'`;

      expect(
        bannedImportPattern.test(fixture1),
        'Pattern must catch: import Anthropic from \'@anthropic-ai/sdk\'',
      ).toBe(true);

      expect(
        bannedImportPattern.test(fixture2),
        'Pattern must catch: import { Anthropic } from \'@anthropic-ai/sdk\'',
      ).toBe(true);

      expect(
        bannedImportPattern.test(fixture3),
        'Pattern must catch: import Anthropic as AI from \'@anthropic-ai/sdk\'',
      ).toBe(true);

      expect(
        bannedImportPattern.test(allowedImport),
        'Pattern must NOT catch allowed ai-centre imports',
      ).toBe(false);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // T-C-010-009: Fixture detection — stub pattern (GREEN)
  // ──────────────────────────────────────────────────────────────────────────
  it(
    'T-C-010-009: fixture — regex catches expect(true).toBe(true) stub pattern',
    () => {
      // Validates pattern logic without filesystem dependency — should be GREEN immediately
      const stubPattern = /expect\s*\(\s*true\s*\)\s*\.\s*toBe\s*\(\s*true\s*\)/;

      const fixture1 = `expect(true).toBe(true)`;
      const fixture2 = `  expect( true ).toBe( true )  `;
      const legitimateExpect = `expect(result).toBe(true)`;
      const legitimateExpect2 = `expect(isValid).toBeTruthy()`;

      expect(
        stubPattern.test(fixture1),
        'Pattern must catch: expect(true).toBe(true)',
      ).toBe(true);

      expect(
        stubPattern.test(fixture2),
        'Pattern must catch whitespace variants of expect(true).toBe(true)',
      ).toBe(true);

      expect(
        stubPattern.test(legitimateExpect),
        'Pattern must NOT catch: expect(result).toBe(true)',
      ).toBe(false);

      expect(
        stubPattern.test(legitimateExpect2),
        'Pattern must NOT catch: expect(isValid).toBeTruthy()',
      ).toBe(false);
    },
  );

});
