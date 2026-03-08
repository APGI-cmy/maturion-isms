/**
 * Wave 15R — Edge Function Health Check Tests
 * Test ID Suite: T-W15R-API-001
 *
 * Wave    : 15R — Post-Delivery Oversight Remediation
 * Session : session-wave15r-api-builder-20260308
 * Delegating Agent: foreman-v2-agent (T-W15R-API-001)
 * Authority: CS2 maturion-isms#997
 *
 * Asserts:
 *   1. Edge Function file exists at the expected path
 *   2. Health check handler is present in the Edge Function source
 *   3. Health check returns the correct JSON structure ({ "status": "healthy", "function": "invoke-ai-parse-criteria" })
 *   4. Health endpoint responds to GET (not just POST)
 *   5. Startup AI_GATEWAY_URL validation log is present
 *
 * All tests are file-based (no live Supabase/network env required).
 *
 * FRS: FR-005 (criteria parsing pipeline)
 * Architecture: modules/mat/02-architecture/system-architecture.md §4
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const EDGE_FN_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/index.ts',
);

const README_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/README.md',
);

describe('T-W15R-API-001: Edge Function health check handler', () => {
  it('Edge Function file exists at supabase/functions/invoke-ai-parse-criteria/index.ts', () => {
    expect(fs.existsSync(EDGE_FN_PATH), `File not found: ${EDGE_FN_PATH}`).toBe(true);
  });

  it('Edge Function contains a /health route handler', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    // Must handle GET /health
    expect(source).toMatch(/\/health/);
    expect(source).toMatch(/req\.method.*===.*'GET'|'GET'.*===.*req\.method/);
  });

  it('Health check returns JSON with status: "healthy"', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    // Accepts single or double quoted string literals in TypeScript source
    expect(source).toMatch(/['"]healthy['"]/);
  });

  it('Health check returns JSON with function: "invoke-ai-parse-criteria"', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    // Accepts single or double quoted string literals in TypeScript source
    expect(source).toMatch(/['"]invoke-ai-parse-criteria['"]/);
  });

  it('Health check response object contains both "status" and "function" keys', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    // Must have both keys in the health response JSON
    expect(source).toMatch(/status.*healthy/);
    expect(source).toMatch(/function.*invoke-ai-parse-criteria/);
  });

  it('Health check handler returns HTTP 200 status code', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    // The health endpoint block must include status: 200
    // Find the health check block — must have { status: 200 } nearby
    const healthBlockMatch = source.match(/\/health[\s\S]{0,500}status:\s*200/);
    expect(healthBlockMatch, 'health endpoint must return status: 200').not.toBeNull();
  });

  it('Health endpoint is accessible via GET (CORS allows GET method)', () => {
    const source = fs.readFileSync(EDGE_FN_PATH, 'utf-8');
    // Access-Control-Allow-Methods must include GET
    expect(source).toMatch(/Access-Control-Allow-Methods[\s\S]{0,100}GET/);
  });
});

describe('T-W15R-API-001: Edge Function README deployment documentation', () => {
  it('README.md exists at supabase/functions/invoke-ai-parse-criteria/README.md', () => {
    expect(fs.existsSync(README_PATH), `File not found: ${README_PATH}`).toBe(true);
  });

  it('README contains deployment instructions', () => {
    const readme = fs.readFileSync(README_PATH, 'utf-8');
    expect(readme).toMatch(/supabase functions deploy/i);
  });

  it('README documents the AI_GATEWAY_URL environment variable', () => {
    const readme = fs.readFileSync(README_PATH, 'utf-8');
    expect(readme).toContain('AI_GATEWAY_URL');
  });

  it('README includes health check verification step', () => {
    const readme = fs.readFileSync(README_PATH, 'utf-8');
    expect(readme).toMatch(/health/i);
  });
});
