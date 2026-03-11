/**
 * Bug Fix: AI Gateway status:failed silently swallowed — PR #1072
 *
 * Root Cause: invoke-ai-parse-criteria/index.ts only checked parseResponse.ok
 *   (which is true for HTTP 200). When the AI Gateway returns HTTP 200 with
 *   { "status": "failed", "error": "..." } in the body, the edge function
 *   extracted `parseResult.domains ?? []` → [] and logged outcome: 'success'
 *   with 0 criteria written — making failures completely invisible.
 *
 * Fixes:
 *   1. After parseResponse.json(), throw if parseResult.status === 'failed'.
 *      Error propagates through the existing catch block →
 *      criteria_documents.status = 'parse_failed' + criteria_parse_failed audit log.
 *   2. Debug log: console.log for the signed URL hostname (not the token) to aid
 *      diagnosis of gateway fetch failures without leaking credentials.
 *   3. .gitignore: supabase/.tmp/ added to stop Supabase CLI temp files appearing
 *      as uncommitted changes.
 *
 * Test IDs: T-WAGRF-001 to T-WAGRF-005
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const EDGE_FN_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/index.ts',
);

const GITIGNORE_PATH = path.resolve(process.cwd(), '.gitignore');

function readEdgeFn(): string {
  expect(fs.existsSync(EDGE_FN_PATH), `Edge Function not found: ${EDGE_FN_PATH}`).toBe(true);
  return fs.readFileSync(EDGE_FN_PATH, 'utf-8');
}

describe('PR #1072 — AI Gateway status:failed detection', () => {
  it("T-WAGRF-001: Edge Function checks parseResult.status === 'failed' after parseResponse.json()", () => {
    const src = readEdgeFn();
    expect(
      src,
      "Edge Function must check parseResult.status === 'failed' after calling parseResponse.json().\n" +
      "Without this check, a gateway failure (HTTP 200 + {status:'failed'}) is silently treated as an empty result.",
    ).toMatch(/parseResult\.status\s*===\s*['"]failed['"]/);
  });

  it('T-WAGRF-002: Edge Function throws an Error when gateway returns status:failed', () => {
    const src = readEdgeFn();
    expect(
      src,
      "Edge Function must throw an Error when parseResult.status === 'failed'.\n" +
      "The thrown error must propagate through the existing catch block to set parse_failed status.",
    ).toMatch(/throw new Error\(`AI Gateway parse failed:/);
  });

  it('T-WAGRF-003: Edge Function includes the gateway error message in the thrown Error', () => {
    const src = readEdgeFn();
    // The error should include the gateway's own error message (parseResult.error)
    expect(
      src,
      "Edge Function must include parseResult.error in the thrown Error message.\n" +
      "This surfaces the gateway's actual failure reason (e.g. '404 Not Found for url ...') in the audit log.",
    ).toMatch(/parseResult\.error/);
  });

  it('T-WAGRF-004: Edge Function logs the signed URL hostname for diagnostics', () => {
    const src = readEdgeFn();
    expect(
      src,
      "Edge Function must log the signed URL hostname after generating it.\n" +
      "Use new URL(documentUrl).hostname (not the full signed URL) to avoid leaking the signed token in logs.",
    ).toMatch(/new URL\(documentUrl\)\.hostname/);
  });

  it('T-WAGRF-005: .gitignore includes supabase/.tmp/ to suppress Supabase CLI temp files', () => {
    expect(fs.existsSync(GITIGNORE_PATH), `.gitignore not found: ${GITIGNORE_PATH}`).toBe(true);
    const gitignore = fs.readFileSync(GITIGNORE_PATH, 'utf-8');
    expect(
      gitignore,
      ".gitignore must include 'supabase/.tmp/' to prevent Supabase CLI temp files from\n" +
      "appearing as uncommitted changes (cli-latest, gotrue-version, pooler-url, etc.).",
    ).toContain('supabase/.tmp/');
  });
});
