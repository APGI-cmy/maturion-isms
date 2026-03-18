/**
 * Wave 20 — Atomic Write-Back Wire-Up
 * Test Suite: T-W20-001 through T-W20-008
 *
 * Wave    : Wave 20 — Wire parse_write_back_atomic RPC into Edge Function
 * Branch  : copilot/implement-wire-parse-write-back-rpc
 * Issue   : maturion-isms#1143
 * Task ID : T-W20-001 through T-W20-008
 *
 * ── Gap closed by Wave 20 ────────────────────────────────────────────────────
 *   GAP-PARSE-005 (originally T-W19C-004):
 *     The parse_write_back_atomic RPC was created in Wave 19 but was NOT wired
 *     into the Edge Function. The Edge Function continued to use sequential
 *     supabase-js upserts (domains → MPS → criteria), leaving data integrity
 *     unguarded: a failure mid-flight could leave orphaned domain/MPS rows.
 *
 * ── Fix ──────────────────────────────────────────────────────────────────────
 *   Wave 20 api-builder:
 *     1. Replaced sequential upserts with supabase.rpc('parse_write_back_atomic')
 *     2. Removed the redundant direct status update (RPC handles it)
 *     3. Re-queried IDs post-RPC for descriptor writes
 *
 *   Wave 20 schema correction (migration 20260318000001):
 *     1. Fixed the RPC's status stamp from 'processed' → 'pending_review'
 *        (the original 'processed' value was not in the CHECK constraint)
 *     2. Added service_role caller support (auth.uid() IS NULL bypass)
 *     3. Added GRANT EXECUTE to service_role
 *
 * All tests are FILE-BASED (no live DB / network / Supabase calls required).
 * Authority: Wave 20, Issue #1143 (T-W20-001 → T-W20-008)
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ── Path constants ─────────────────────────────────────────────────────────────

const MIGRATIONS_DIR = path.resolve(
  process.cwd(),
  'apps/maturion-maturity-legacy/supabase/migrations',
);

const EDGE_FN_PATH = path.resolve(
  process.cwd(),
  'supabase/functions/invoke-ai-parse-criteria/index.ts',
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function readEdgeFunction(): string {
  if (!fs.existsSync(EDGE_FN_PATH)) {
    throw new Error(`Edge Function not found at ${EDGE_FN_PATH}`);
  }
  return fs.readFileSync(EDGE_FN_PATH, 'utf-8');
}

function findMigrations(pattern: RegExp): string[] {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .filter(f => {
      const content = fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf-8');
      return pattern.test(content);
    });
}

function readMigration(filename: string): string {
  const p = path.join(MIGRATIONS_DIR, filename);
  if (!fs.existsSync(p)) return '';
  return fs.readFileSync(p, 'utf-8');
}

// ══════════════════════════════════════════════════════════════════════════════
// T-W20-001: Edge Function calls parse_write_back_atomic RPC
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 20 — GAP-PARSE-005: Edge Function must call parse_write_back_atomic RPC', () => {

  it('[T-W20-001] Edge Function calls supabase.rpc("parse_write_back_atomic")', () => {
    /*
     * RED:   Edge Function performs three independent sequential upserts
     *        (domains, then mini_performance_standards, then criteria).
     *        No call to supabase.rpc('parse_write_back_atomic') exists.
     *
     * GREEN: api-builder (T-W20-001) replaces the sequential upserts with:
     *          const { data, error } = await supabase.rpc(
     *            'parse_write_back_atomic',
     *            { p_document_id, p_domains, p_mps, p_criteria }
     *          );
     *
     * Authority: GAP-PARSE-005, Issue #1143
     */
    const edgeFn = readEdgeFunction();
    const hasRpcCall = /supabase\.rpc\s*\(\s*['"`]parse_write_back_atomic['"`]/i.test(edgeFn);
    expect(
      hasRpcCall,
      '[T-W20-001] RED: Edge Function does not call supabase.rpc("parse_write_back_atomic").\n' +
      'api-builder must replace sequential upserts with:\n' +
      "  const { data, error } = await supabase.rpc('parse_write_back_atomic', {\n" +
      '    p_document_id: documentId,\n' +
      '    p_domains,\n' +
      '    p_mps,\n' +
      '    p_criteria,\n' +
      '  });\n' +
      `Edge Function path: ${EDGE_FN_PATH}`,
    ).toBe(true);
  });

  it('[T-W20-002] RPC call passes all four required parameters', () => {
    /*
     * The parse_write_back_atomic RPC requires exactly:
     *   p_document_id — the criteria_documents.id UUID
     *   p_domains     — JSONB array of domain objects
     *   p_mps         — JSONB array of MPS objects
     *   p_criteria    — JSONB array of criteria objects
     *
     * GREEN: All four parameters appear in the rpc() call block.
     */
    const edgeFn = readEdgeFunction();
    // Find the rpc() call block
    const rpcIdx = edgeFn.search(/supabase\.rpc\s*\(\s*['"`]parse_write_back_atomic['"`]/i);
    expect(rpcIdx, '[T-W20-002] supabase.rpc("parse_write_back_atomic") call not found.').toBeGreaterThan(-1);

    // Extract the 600 chars following the rpc call — should contain all 4 params
    const rpcBlock = edgeFn.slice(rpcIdx, rpcIdx + 600);

    expect(
      /p_document_id/.test(rpcBlock),
      '[T-W20-002] RPC call missing parameter: p_document_id',
    ).toBe(true);
    expect(
      /p_domains/.test(rpcBlock),
      '[T-W20-002] RPC call missing parameter: p_domains',
    ).toBe(true);
    expect(
      /p_mps/.test(rpcBlock),
      '[T-W20-002] RPC call missing parameter: p_mps',
    ).toBe(true);
    expect(
      /p_criteria/.test(rpcBlock),
      '[T-W20-002] RPC call missing parameter: p_criteria',
    ).toBe(true);
  });

  it('[T-W20-003] Sequential upserts for domains, MPS, criteria are removed', () => {
    /*
     * After Wave 20, the three independent upsert calls for domains,
     * mini_performance_standards, and criteria must be absent from the
     * Edge Function (they are replaced by the atomic RPC).
     *
     * The descriptor upserts (domain_level_descriptors, mps_level_descriptors,
     * criteria_level_descriptors) are NOT covered by the RPC and may remain.
     *
     * GREEN: No `supabase.from('domains').upsert(...)`,
     *        `supabase.from('mini_performance_standards').upsert(...)`, or
     *        `supabase.from('criteria').upsert(...)` exist in the main parse path.
     */
    const edgeFn = readEdgeFunction();

    // Sequential direct upserts should not exist (they're replaced by the RPC)
    const hasDomainUpsert = /from\s*\(\s*['"`]domains['"`]\s*\)\s*\.upsert/.test(edgeFn);
    const hasMpsUpsert = /from\s*\(\s*['"`]mini_performance_standards['"`]\s*\)\s*\.upsert/.test(edgeFn);
    const hasCriteriaUpsert = /from\s*\(\s*['"`]criteria['"`]\s*\)\s*\.upsert/.test(edgeFn);

    expect(
      hasDomainUpsert,
      '[T-W20-003] Sequential supabase.from("domains").upsert() still exists.\n' +
      'Remove and replace with supabase.rpc("parse_write_back_atomic", ...).',
    ).toBe(false);
    expect(
      hasMpsUpsert,
      '[T-W20-003] Sequential supabase.from("mini_performance_standards").upsert() still exists.\n' +
      'Remove and replace with supabase.rpc("parse_write_back_atomic", ...).',
    ).toBe(false);
    expect(
      hasCriteriaUpsert,
      '[T-W20-003] Sequential supabase.from("criteria").upsert() still exists.\n' +
      'Remove and replace with supabase.rpc("parse_write_back_atomic", ...).',
    ).toBe(false);
  });

  it('[T-W20-004] Edge Function resolves document_id before calling the RPC', () => {
    /*
     * The parse_write_back_atomic RPC requires p_document_id (the criteria_documents.id).
     * The Edge Function must query criteria_documents for the UUID using
     * audit_id + file_path before dispatching the RPC call.
     *
     * GREEN: Edge Function queries criteria_documents for the `id` field using
     *        .eq('audit_id', auditId).eq('file_path', filePath).single()
     *        and passes it as p_document_id.
     */
    const edgeFn = readEdgeFunction();

    // Must select 'id' from criteria_documents
    const hasCriteriaDocQuery = /from\s*\(\s*['"`]criteria_documents['"`]\s*\)[\s\S]{0,200}select\s*\(\s*['"`]id['"`]/i
      .test(edgeFn);
    expect(
      hasCriteriaDocQuery,
      '[T-W20-004] Edge Function does not query criteria_documents for the document id.\n' +
      'Add before calling the RPC:\n' +
      "  const { data: docData } = await supabase\n" +
      "    .from('criteria_documents').select('id')\n" +
      "    .eq('audit_id', auditId).eq('file_path', filePath).single();\n" +
      `Edge Function path: ${EDGE_FN_PATH}`,
    ).toBe(true);
  });

  it('[T-W20-005] RPC result is checked for errors and zero-insert condition', () => {
    /*
     * After the RPC call, the Edge Function must:
     *   1. Check rpcError and throw if set
     *   2. Apply the zero-insert assertion (GAP-PARSE-004): if all three
     *      counts are 0, throw so criteria_parse_failed is written
     *
     * GREEN: rpcError check exists, and zero-insert assertion reads
     *        domains_inserted / mps_inserted / criteria_inserted from rpcData.
     */
    const edgeFn = readEdgeFunction();

    const hasErrorCheck = /rpcError/.test(edgeFn);
    expect(
      hasErrorCheck,
      '[T-W20-005] Edge Function does not check rpcError after the RPC call.',
    ).toBe(true);

    const hasZeroInsertCheck = /domainsInserted\s*===\s*0[\s\S]{0,200}mpsInserted\s*===\s*0[\s\S]{0,200}criteriaInserted\s*===\s*0/
      .test(edgeFn);
    expect(
      hasZeroInsertCheck,
      '[T-W20-005] Zero-insert assertion (GAP-PARSE-004) not found after RPC call.\n' +
      'Add: if (domainsInserted === 0 && mpsInserted === 0 && criteriaInserted === 0) { throw ... }',
    ).toBe(true);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// T-W20-006: Migration fixes RPC status value 'processed' → 'pending_review'
// ══════════════════════════════════════════════════════════════════════════════

describe('Wave 20 — Migration: fix parse_write_back_atomic status and service_role support', () => {

  it('[T-W20-006] Wave 20 migration fixes RPC status stamp to pending_review', () => {
    /*
     * The original parse_write_back_atomic (migration 20260317000003) used
     * status = 'processed', which is NOT in the CHECK constraint
     * ('pending_parse' | 'processing' | 'pending_review' | 'parse_failed').
     *
     * Wave 20 migration 20260318000001 must replace the function using
     * CREATE OR REPLACE FUNCTION and use 'pending_review' instead.
     *
     * GREEN: A migration file with a timestamp STRICTLY AFTER 20260317000003 exists that:
     *        - Contains CREATE OR REPLACE FUNCTION public.parse_write_back_atomic
     *        - Uses 'pending_review' (not 'processed') for the status update
     */
    if (!fs.existsSync(MIGRATIONS_DIR)) {
      expect.fail(`Migrations directory not found: ${MIGRATIONS_DIR}`);
    }

    // Find all migration files that re-create parse_write_back_atomic AND have
    // a filename lexicographically after '20260317000003' (strictly, by numeric prefix).
    const allMigrations = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
    const fixingMigrations = allMigrations.filter(f => {
    // Only consider migrations with a numeric prefix strictly greater than 20260317000003.
      // Use Number() comparison to guard against lexicographic edge cases
      // (e.g. '20260317000010' would sort before '20260317000003' lexicographically
      // but is numerically greater).
      const numPrefix = Number(f.replace(/^(\d+).*$/, '$1'));
      if (numPrefix <= 20260317000003) return false;
      const content = fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf-8');
      return /CREATE OR REPLACE FUNCTION public\.parse_write_back_atomic/i.test(content);
    });

    expect(
      fixingMigrations.length,
      '[T-W20-006] No migration AFTER 20260317000003 re-creates parse_write_back_atomic.\n' +
      'Wave 20 must create apps/maturion-maturity-legacy/supabase/migrations/20260318000001_*.sql\n' +
      'containing CREATE OR REPLACE FUNCTION public.parse_write_back_atomic with status = \'pending_review\'.',
    ).toBeGreaterThan(0);

    const fixingMigration = fixingMigrations[0];
    const content = fs.readFileSync(path.join(MIGRATIONS_DIR, fixingMigration), 'utf-8');

    const usesPendingReview = /status\s*=\s*'pending_review'/.test(content);
    expect(
      usesPendingReview,
      "[T-W20-006] Fixing migration does not use status = 'pending_review'.\n" +
      "Replace: SET status = 'processed'\n" +
      "With:    SET status = 'pending_review'\n" +
      `Migration: ${fixingMigration}`,
    ).toBe(true);

    const usesProcessed = /status\s*=\s*'processed'/.test(content);
    expect(
      usesProcessed,
      "[T-W20-006] Fixing migration still contains status = 'processed' (invalid constraint value).",
    ).toBe(false);
  });

  it('[T-W20-007] Wave 20 migration adds service_role EXECUTE grant', () => {
    /*
     * The original migration revoked from PUBLIC and granted only to `authenticated`.
     * The Edge Function connects with service_role, which is not covered.
     *
     * Wave 20 must add:
     *   GRANT EXECUTE ON FUNCTION public.parse_write_back_atomic(UUID, JSONB, JSONB, JSONB)
     *   TO service_role;
     *
     * GREEN: The fixing migration grants EXECUTE to service_role.
     */
    const matches = findMigrations(
      /GRANT EXECUTE ON FUNCTION public\.parse_write_back_atomic[\s\S]*?TO service_role/i,
    );
    expect(
      matches.length,
      '[T-W20-007] No migration grants EXECUTE on parse_write_back_atomic to service_role.\n' +
      'Add to the Wave 20 fixing migration:\n' +
      '  GRANT EXECUTE ON FUNCTION public.parse_write_back_atomic(UUID, JSONB, JSONB, JSONB)\n' +
      '  TO service_role;',
    ).toBeGreaterThan(0);
  });

  it('[T-W20-008] Wave 20 migration adds service_role caller support (auth.uid() IS NULL bypass)', () => {
    /*
     * The Edge Function uses the service_role key. When called from service_role,
     * auth.uid() returns NULL and the original ownership check fails.
     *
     * Wave 20 must add a NULL check on auth.uid() and perform a direct lookup
     * when auth.uid() IS NULL (service-role path).
     *
     * GREEN: The fixing migration contains an auth.uid() IS NULL check.
     */
    const matches = findMigrations(
      /auth\.uid\(\)\s+IS\s+NULL/i,
    );
    expect(
      matches.length,
      '[T-W20-008] No migration adds service_role caller support (auth.uid() IS NULL check).\n' +
      'Add to the Wave 20 fixing migration inside the function body:\n' +
      '  IF auth.uid() IS NOT NULL THEN\n' +
      '    -- authenticated user: ownership check via profiles join\n' +
      '  ELSE\n' +
      '    -- service_role: direct document lookup\n' +
      '  END IF;',
    ).toBeGreaterThan(0);
  });

});
