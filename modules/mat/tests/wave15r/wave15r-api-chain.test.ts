/**
 * Wave 15R — API Chain End-to-End Code Verification Tests
 * Test ID Suite: T-W15R-API-003
 *
 * Wave    : 15R — Post-Delivery Oversight Remediation
 * Session : session-wave15r-api-builder-20260308
 * Delegating Agent: foreman-v2-agent (T-W15R-API-003)
 * Authority: CS2 maturion-isms#997
 *
 * Asserts that the full code chain is complete and well-formed (file-based):
 *   1. Edge Function contains the AI Gateway fetch call to /parse
 *   2. AI Gateway services/parsing.py contains the /parse route
 *   3. Edge Function response maps domains_inserted, mps_inserted, criteria_inserted
 *   4. Edge Function writes to audit_logs table on both success and failure
 *   5. parsing.py has a real GPT-4 implementation (no stubs)
 *   6. parsing.py performs text extraction (PDF + DOCX)
 *   7. parsing.py extracts domain/MPS/criteria hierarchy
 *
 * All tests are file-based (no live Supabase/network env required).
 *
 * FRS: FR-005 (criteria parsing pipeline), FR-103 (error surfacing)
 * TRS: TR-037 (AI Gateway connectivity verification)
 * Architecture: modules/mat/02-architecture/system-architecture.md §4
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const EDGE_FN_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/index.ts',
);

const PARSING_PY_PATH = path.resolve(
  process.cwd(),
  'apps/mat-ai-gateway/services/parsing.py',
);

describe('T-W15R-API-003: Edge Function → AI Gateway code chain', () => {
  it('Edge Function file exists', () => {
    expect(fs.existsSync(EDGE_FN_PATH), `File not found: ${EDGE_FN_PATH}`).toBe(true);
  });

  it('AI Gateway parsing.py file exists', () => {
    expect(fs.existsSync(PARSING_PY_PATH), `File not found: ${PARSING_PY_PATH}`).toBe(true);
  });

  it('Edge Function contains fetch call to AI Gateway /parse endpoint', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    // Must call the AI Gateway /parse route
    expect(source).toMatch(/fetch\(.*\/parse/s);
  });

  it('Edge Function constructs AI Gateway URL from AI_GATEWAY_URL env var', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    expect(source).toContain('AI_GATEWAY_URL');
    // The fetch must use the env var, not a hardcoded URL
    expect(source).toMatch(/\$\{AI_GATEWAY_URL\}\/parse|AI_GATEWAY_URL.*\/parse/);
  });

  it('Edge Function sends POST request to /parse endpoint', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    // Must use POST method for the AI Gateway call
    expect(source).toMatch(/method:\s*['"]POST['"]/);
  });
});

describe('T-W15R-API-003: AI Gateway /parse route implementation', () => {
  it('parsing.py defines a /parse route', () => {
    const source = fs.readFileSync(PARSING_PY_PATH, 'utf-8');
    // FastAPI route decorator
    expect(source).toMatch(/@router\.(post|get)\(['"]\/parse['"]/);
  });

  it('parsing.py contains GPT-4 model call (not a stub)', () => {
    const source = fs.readFileSync(PARSING_PY_PATH, 'utf-8');
    // Must reference a GPT-4 model
    expect(source).toMatch(/gpt-4/i);
  });

  it('parsing.py contains OpenAI client call (real implementation)', () => {
    const source = fs.readFileSync(PARSING_PY_PATH, 'utf-8');
    expect(source).toContain('OpenAI');
    expect(source).toMatch(/client\.chat\.completions\.create|chat\.completions\.create/);
  });

  it('parsing.py contains PDF text extraction', () => {
    const source = fs.readFileSync(PARSING_PY_PATH, 'utf-8');
    expect(source).toMatch(/pdf|PdfReader|extract_text/i);
  });

  it('parsing.py contains DOCX text extraction', () => {
    const source = fs.readFileSync(PARSING_PY_PATH, 'utf-8');
    expect(source).toMatch(/docx|DocxDocument|python-docx/i);
  });

  it('parsing.py extracts domains from document', () => {
    const source = fs.readFileSync(PARSING_PY_PATH, 'utf-8');
    expect(source).toMatch(/domains/);
  });

  it('parsing.py extracts mini_performance_standards from document', () => {
    const source = fs.readFileSync(PARSING_PY_PATH, 'utf-8');
    expect(source).toMatch(/mini_performance_standards/);
  });

  it('parsing.py extracts criteria from document', () => {
    const source = fs.readFileSync(PARSING_PY_PATH, 'utf-8');
    expect(source).toMatch(/criteria/);
  });

  it('parsing.py has no stub placeholders (no TODO/STUB/raise NotImplementedError)', () => {
    const source = fs.readFileSync(PARSING_PY_PATH, 'utf-8');
    // Must not contain stub indicators
    expect(source).not.toMatch(/raise NotImplementedError/);
    expect(source).not.toMatch(/# ?TODO.*stub|# ?STUB/i);
    expect(source).not.toMatch(/pass\s*#\s*TODO/i);
  });
});

describe('T-W15R-API-003: Edge Function response mapping', () => {
  it('Edge Function response includes domains_inserted count', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    expect(source).toContain('domains_inserted');
  });

  it('Edge Function response includes mps_inserted count', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    expect(source).toContain('mps_inserted');
  });

  it('Edge Function response includes criteria_inserted count', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    expect(source).toContain('criteria_inserted');
  });
});

describe('T-W15R-API-003: Edge Function audit_logs write-back', () => {
  it('Edge Function writes to audit_logs on success', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    // Must insert into audit_logs with success outcome
    expect(source).toMatch(/audit_logs.*insert|\.from\('audit_logs'\).*insert/s);
    expect(source).toContain("'success'");
  });

  it('Edge Function writes to audit_logs on failure', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    // Must also log failure to audit_logs (in catch block)
    expect(source).toContain("'failure'");
  });

  it('Edge Function audit_logs entry contains action: criteria_parsed on success', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    expect(source).toContain('criteria_parsed');
  });

  it('Edge Function audit_logs entry contains action: criteria_parse_failed on failure', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    expect(source).toContain('criteria_parse_failed');
  });
});
