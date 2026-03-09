/**
 * Wave Upload Doclist Fix — RED Gate Tests
 * Test ID Suite: T-WUF-001 through T-WUF-005
 *
 * Wave    : wave-upload-doclist-fix
 * Branch  : copilot/fix-ai-parsing-trigger
 * Session : qa-builder-wave-upload-doclist-fix-20260308
 * Authority: CS2 (@APGI-cmy) — fix(app/api): Criteria document upload — AI parsing never
 *            triggers, uploaded documents never show
 * IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-wave-upload-doclist-fix.md
 *
 * RED-GATE CONTRACT (SB-001 from IAA Pre-Brief):
 *   These tests MUST be confirmed RED before T-WUF-API-001 (api-builder) or T-WUF-UI-001
 *   (ui-builder) may begin implementation. They become GREEN after both builder tasks complete.
 *   Opening implementation tasks before QA gate is confirmed RED is an OPOJD violation.
 *
 * Production bug captured by these tests:
 *   - useUploadCriteria uploads a file but writes NO audit_log entry on success.
 *   - useUploadedDocuments only queries action IN ('criteria_parsed','criteria_parse_failed').
 *   - When Edge Function fails/is unavailable, no audit_log row is ever written.
 *   - Result: uploaded documents list always shows "No documents uploaded yet."
 *
 * Asserts (file-based — no live Supabase / network / React rendering required):
 *   T-WUF-001: useUploadCriteria writes audit_log(action='criteria_upload') on storage upload success
 *   T-WUF-002: useUploadedDocuments query includes 'criteria_upload' in the action list
 *   T-WUF-003: getParseStatus() in CriteriaUpload.tsx handles 'criteria_upload' → returns 'PENDING'
 *   T-WUF-004: UploadedDocument interface docstring updated to mention criteria_upload (SB-002)
 *   T-WUF-005: useUploadedDocuments deduplicates results by resource_id/file_path, best-status wins (SB-003)
 *
 * FRS: FR-004 (upload produces audit_log entry immediately), FR-103 (errors surfaced inline)
 * TRS: TR-047 (useUploadedDocuments query pattern)
 * Architecture: modules/mat/02-architecture/system-architecture.md §4
 *
 * FFA checks covered: FFA-001 (gate), FFA-002 (T-WUF-001), FFA-003 (T-WUF-002),
 *                     FFA-004 (T-WUF-003), FFA-005 (T-WUF-004 + T-WUF-005)
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const USE_CRITERIA_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/lib/hooks/useCriteria.ts',
);

const CRITERIA_UPLOAD_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx',
);

// ---------------------------------------------------------------------------
// T-WUF-001: useUploadCriteria writes audit_log(action='criteria_upload') on success
// ---------------------------------------------------------------------------
describe('[T-WUF-001] useUploadCriteria writes audit_log(action=criteria_upload) on success', () => {
  /**
   * RED REASON (all three assertions):
   * useCriteria.ts currently contains NO 'criteria_upload' string anywhere.
   * The useUploadCriteria mutationFn calls supabase.storage.upload() and returns
   * { path, hash } — it performs ZERO writes to the audit_logs table.
   * Fix (T-WUF-API-001): insert audit_log row with action='criteria_upload' immediately
   * after storage upload succeeds and before triggerParsing is invoked.
   */
  it('useCriteria.ts contains the criteria_upload action string', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // RED: 'criteria_upload' does not appear anywhere in useCriteria.ts.
    expect(content).toContain('criteria_upload');
  });

  it('useUploadCriteria mutationFn inserts into audit_logs with action criteria_upload', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // RED: no .insert() call paired with 'criteria_upload' exists.
    // After T-WUF-API-001: mutationFn will contain supabase.from('audit_logs').insert({...
    // action: 'criteria_upload', ... }) immediately after the storage upload succeeds.
    expect(content).toMatch(/\.insert\([\s\S]{0,500}criteria_upload/);
  });

  it('audit_log insert for criteria_upload includes file_path in the details payload', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // RED: no audit_log insert with criteria_upload + file_path details exists.
    // After T-WUF-API-001: the insert will include details: { file_path: filePath } so that
    // useUploadedDocuments can surface the filename in the documents list.
    expect(content).toMatch(/criteria_upload[\s\S]{0,300}file_path/);
  });
});

// ---------------------------------------------------------------------------
// T-WUF-002: useUploadedDocuments query includes 'criteria_upload' action
// ---------------------------------------------------------------------------
describe('[T-WUF-002] useUploadedDocuments query includes criteria_upload action', () => {
  /**
   * RED REASON (both assertions):
   * The current .in('action', ['criteria_parsed', 'criteria_parse_failed']) call in
   * useUploadedDocuments does NOT include 'criteria_upload'. This means any document that
   * was uploaded but whose Edge Function parse job never ran (or failed silently before
   * writing any audit_log row) will be permanently invisible in the documents list.
   * Fix (T-WUF-API-001): expand the action list to include 'criteria_upload'.
   */
  it('useUploadedDocuments .in() call includes criteria_upload in the action list', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // RED: .in('action', [...]) currently lists only criteria_parsed and criteria_parse_failed.
    // After T-WUF-API-001: list becomes ['criteria_upload', 'criteria_parsed', 'criteria_parse_failed']
    // (or equivalent ordering).
    expect(content).toMatch(/\.in\(\s*['"]action['"]\s*,\s*\[[\s\S]{0,200}criteria_upload/);
  });

  it('useUploadedDocuments action list includes all three required actions together', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // RED: criteria_upload is missing — the three-action requirement cannot be satisfied.
    // After T-WUF-API-001: all three actions will appear in a single .in() call, satisfying
    // FRS FR-004 and TRS TR-047 query pattern requirements.
    expect(content).toMatch(
      /criteria_upload[\s\S]{0,100}criteria_parsed[\s\S]{0,100}criteria_parse_failed|criteria_parsed[\s\S]{0,100}criteria_parse_failed[\s\S]{0,100}criteria_upload|criteria_parsed[\s\S]{0,100}criteria_upload[\s\S]{0,100}criteria_parse_failed/,
    );
  });
});

// ---------------------------------------------------------------------------
// T-WUF-003: getParseStatus handles criteria_upload → returns PENDING
// ---------------------------------------------------------------------------
describe('[T-WUF-003] getParseStatus in CriteriaUpload.tsx handles criteria_upload → PENDING', () => {
  /**
   * RED REASON (both assertions):
   * CriteriaUpload.tsx currently does NOT contain the string 'criteria_upload' anywhere.
   * getParseStatus() has explicit branches only for 'criteria_parsed' and 'criteria_parse_failed'.
   * While the existing `return 'PENDING'` default would technically handle unknown actions,
   * the specification (T-WUF-UI-001) requires an explicit 'criteria_upload' branch or an
   * acknowledged comment co-located with the function so that future maintainers understand
   * the contract. This test enforces that understanding is made explicit in the code.
   * Fix (T-WUF-UI-001): add `if (doc.action === 'criteria_upload') return 'PENDING'` or
   * equivalent annotated branch to getParseStatus().
   */
  it('CriteriaUpload.tsx contains the criteria_upload action string', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    // RED: 'criteria_upload' does not appear anywhere in CriteriaUpload.tsx.
    expect(content).toContain('criteria_upload');
  });

  it('getParseStatus maps criteria_upload to PENDING (explicit branch or annotated default)', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    // RED: criteria_upload string is absent — no proximity between criteria_upload and PENDING
    // in getParseStatus exists. After T-WUF-UI-001: either an explicit check such as
    // `if (doc.action === 'criteria_upload') return 'PENDING'` will be present, or
    // the function will contain criteria_upload in a comment confirming the default mapping.
    expect(content).toMatch(
      /criteria_upload[\s\S]{0,200}PENDING|getParseStatus[\s\S]{0,300}criteria_upload/,
    );
  });
});

// ---------------------------------------------------------------------------
// T-WUF-004: UploadedDocument interface docstring updated for criteria_upload
// ---------------------------------------------------------------------------
describe('[T-WUF-004] UploadedDocument interface docstring updated to include criteria_upload', () => {
  /**
   * RED REASON:
   * The current UploadedDocument interface docstring in useCriteria.ts reads:
   *   "`action` is 'criteria_parsed' (success) or 'criteria_parse_failed' (failure)."
   * It does NOT mention 'criteria_upload'. After T-WUF-API-001, criteria_upload becomes a
   * first-class action value returned by useUploadedDocuments. Failing to update the docstring
   * creates a TypeScript type-comprehension mismatch and violates SB-002 of the IAA Pre-Brief.
   * Fix (T-WUF-API-001): update the UploadedDocument docstring to list all three valid actions.
   */
  it('UploadedDocument type comment/docstring mentions criteria_upload as a valid action', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // RED: 'criteria_upload' is absent from the file entirely — the docstring only names
    // criteria_parsed and criteria_parse_failed. The regex checks within 400 chars of the
    // UploadedDocument interface declaration for the criteria_upload string.
    expect(content).toMatch(/UploadedDocument[\s\S]{0,400}criteria_upload/);
  });
});

// ---------------------------------------------------------------------------
// T-WUF-005: useUploadedDocuments deduplicates results (best-status wins)
// ---------------------------------------------------------------------------
describe('[T-WUF-005] useUploadedDocuments deduplicates by resource_id/file_path, best-status wins', () => {
  /**
   * RED REASON (both assertions):
   * useUploadedDocuments currently has NO deduplication logic — it returns raw query rows.
   * After T-WUF-API-001, each upload will create a criteria_upload row immediately, AND the
   * Edge Function may later write a criteria_parsed or criteria_parse_failed row for the same
   * file. Without deduplication the documents list would show the same file 2–3 times.
   * Fix (T-WUF-API-001): deduplicate by resource_id/file_path keeping the best-status row:
   *   criteria_parsed (3) > criteria_parse_failed (2) > criteria_upload (1)
   * Per SB-003 of IAA Pre-Brief: priority ordering, NOT chronological ordering, must be used.
   */
  it('useUploadedDocuments contains deduplication logic (reduce, Map, or explicit dedup)', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // RED: no .reduce(), new Map(), or dedup/deduplicate keyword exists in useCriteria.ts.
    // After T-WUF-API-001: deduplication via Array.reduce + Map or equivalent will be present.
    expect(content).toMatch(/\.reduce\(|new Map\(|\/\/ dedup|deduplic/i);
  });

  it('deduplication uses best-status priority ordering (criteria_parsed > criteria_parse_failed > criteria_upload)', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // RED: criteria_upload is absent from the file; no priority ordering structure exists.
    // After T-WUF-API-001: a STATUS_PRIORITY map or equivalent ordered comparison will reference
    // all three actions in priority order, ensuring criteria_parsed beats criteria_parse_failed
    // beats criteria_upload when multiple rows exist for the same document.
    expect(content).toMatch(
      /criteria_parsed[\s\S]{0,100}criteria_parse_failed[\s\S]{0,100}criteria_upload|criteria_upload[\s\S]{0,100}criteria_parse_failed[\s\S]{0,100}criteria_parsed/,
    );
  });
});
