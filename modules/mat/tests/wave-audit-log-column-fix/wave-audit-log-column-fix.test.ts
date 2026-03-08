/**
 * Wave Audit-Log Column Fix — RED Gate Tests
 * Test ID Suite: T-ALCF-001 through T-ALCF-007
 *
 * Wave    : wave-audit-log-column-fix
 * Session : qa-builder-T-ALCF-QA-001
 * Authority: CS2 — fix(mat/hooks): audit_logs INSERT/SELECT use non-existent columns;
 *            organisation_id (NOT NULL) omitted from INSERT → write always fails.
 *
 * RED-GATE CONTRACT:
 *   These tests MUST be confirmed RED before any production-code changes are made.
 *   They become GREEN after the fix to useCriteria.ts is applied.
 *   Opening implementation tasks before QA gate is confirmed RED is an OPOJD violation.
 *
 * Root-cause captured by these tests:
 *   The audit_logs table schema (20260308000001_audit_logs_table.sql) has columns:
 *     id, audit_id, organisation_id (NOT NULL), action, file_path, details, created_by, created_at
 *   The broken code in useCriteria.ts:
 *     1. INSERT uses `user_id`        (non-existent → should be `created_by`)
 *     2. INSERT uses `resource_type`  (non-existent → must be removed)
 *     3. INSERT uses `resource_id`    (non-existent → must be removed)
 *     4. INSERT omits `organisation_id` (NOT NULL → every write fails silently)
 *     5. SELECT includes `resource_id` (non-existent → "Failed to load uploaded documents")
 *     6. UploadedDocument interface has `resource_id: string | null` (mirrors non-existent column)
 *
 * Asserts (file-based — no live Supabase / network / React rendering required):
 *   T-ALCF-001: INSERT does NOT use `user_id` column
 *   T-ALCF-002: INSERT uses `created_by` column (correct name)
 *   T-ALCF-003: INSERT does NOT use `resource_type` column
 *   T-ALCF-004: INSERT does NOT use `resource_id` column
 *   T-ALCF-005: INSERT uses `organisation_id` column (NOT NULL — required)
 *   T-ALCF-006: SELECT does NOT include `resource_id`
 *   T-ALCF-007: UploadedDocument interface does NOT have `resource_id` field
 *
 * Architecture ref: modules/mat/02-architecture/system-architecture.md §4
 * Schema ref: apps/maturion-maturity-legacy/supabase/migrations/20260308000001_audit_logs_table.sql
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Target file under test
// ---------------------------------------------------------------------------
const USE_CRITERIA_PATH = path.resolve(
  process.cwd(),
  'modules/mat/frontend/src/lib/hooks/useCriteria.ts',
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Read the target file as UTF-8 text.
 * Throws a clear error if the file is missing so every test fails with context.
 */
function readUseCriteria(): string {
  if (!fs.existsSync(USE_CRITERIA_PATH)) {
    throw new Error(
      `Target file not found: ${USE_CRITERIA_PATH}\n` +
        'This test suite asserts against the production file. ' +
        'Ensure modules/mat/frontend/src/lib/hooks/useCriteria.ts exists.',
    );
  }
  return fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
}

/**
 * Extract the text of the `supabase.from('audit_logs').insert({...})` call block.
 *
 * Strategy: locate the start of the insert call, then walk forward counting open/close
 * braces until the outermost object literal is closed. This handles the nested `details`
 * object correctly without relying on a fixed character offset.
 *
 * Returns the extracted substring, or '' if the insert call is not found.
 */
function extractInsertBlock(content: string): string {
  const marker = "supabase.from('audit_logs').insert({";
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) return '';

  // Walk from the opening `{` of `.insert({`
  const braceStart = startIdx + marker.length - 1; // position of the first `{`
  let depth = 0;
  let endIdx = braceStart;

  for (let i = braceStart; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }

  return content.slice(startIdx, endIdx + 1);
}

/**
 * Extract the `UploadedDocument` interface block.
 *
 * Walks forward from `interface UploadedDocument ` (with trailing space/newline)
 * counting braces to avoid matching `UploadedDocumentDetails`.
 * Returns the extracted substring, or '' if the interface is not found.
 */
function extractUploadedDocumentInterface(content: string): string {
  // Use a regex to find `interface UploadedDocument` that is NOT followed by
  // more word characters (i.e. not UploadedDocumentDetails).
  const match = content.match(/interface UploadedDocument(?!\w)/);
  if (!match || match.index === undefined) return '';
  const startIdx = match.index;
  if (startIdx === -1) return '';

  // Locate the opening brace of the interface body
  const braceStart = content.indexOf('{', startIdx);
  if (braceStart === -1) return '';

  let depth = 0;
  let endIdx = braceStart;

  for (let i = braceStart; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }

  return content.slice(startIdx, endIdx + 1);
}

// ---------------------------------------------------------------------------
// T-ALCF-001: INSERT does NOT use `user_id` column
// ---------------------------------------------------------------------------
describe('[T-ALCF-001] INSERT does NOT use user_id column', () => {
  /**
   * RED REASON:
   *   useCriteria.ts currently contains `user_id: user.id` inside the
   *   .insert({...}) call (line ~171). The audit_logs table has no `user_id`
   *   column — the correct column is `created_by`.
   *
   * GREEN AFTER FIX:
   *   The fix replaces `user_id: user.id` with `created_by: user.id` so that
   *   the insert maps to an actual column in the schema.
   */
  it('audit_logs insert block does NOT contain user_id key', () => {
    const content = readUseCriteria();
    const insertBlock = extractInsertBlock(content);

    expect(insertBlock).not.toBe('');
    // RED: insertBlock currently contains `user_id: user.id`
    // GREEN after fix: `user_id` removed in favour of `created_by`
    expect(insertBlock).not.toMatch(/\buser_id\s*:/);
  });
});

// ---------------------------------------------------------------------------
// T-ALCF-002: INSERT uses `created_by` column (correct schema column name)
// ---------------------------------------------------------------------------
describe('[T-ALCF-002] INSERT uses created_by column', () => {
  /**
   * RED REASON:
   *   The insert block uses `user_id` instead of `created_by`. The actual
   *   audit_logs schema column for the author is `created_by` (NOT NULL in
   *   the default migration). `created_by` does not appear anywhere in the
   *   current insert call.
   *
   * GREEN AFTER FIX:
   *   The fix adds `created_by: user.id` to the insert payload, matching the
   *   real schema column name.
   */
  it('audit_logs insert block contains created_by key', () => {
    const content = readUseCriteria();
    const insertBlock = extractInsertBlock(content);

    expect(insertBlock).not.toBe('');
    // RED: `created_by` is absent from the insert block
    // GREEN after fix: `created_by: user.id` appears in the insert payload
    expect(insertBlock).toMatch(/\bcreated_by\s*:/);
  });
});

// ---------------------------------------------------------------------------
// T-ALCF-003: INSERT does NOT use `resource_type` column
// ---------------------------------------------------------------------------
describe('[T-ALCF-003] INSERT does NOT use resource_type column', () => {
  /**
   * RED REASON:
   *   useCriteria.ts currently passes `resource_type: 'criteria_document'`
   *   in the insert payload. The audit_logs table has no `resource_type`
   *   column — including it causes the Supabase client to return a
   *   "column does not exist" error, silently swallowed in the try/catch,
   *   meaning every audit_log write fails.
   *
   * GREEN AFTER FIX:
   *   The fix removes `resource_type` from the insert payload entirely.
   */
  it('audit_logs insert block does NOT contain resource_type key', () => {
    const content = readUseCriteria();
    const insertBlock = extractInsertBlock(content);

    expect(insertBlock).not.toBe('');
    // RED: insertBlock currently contains `resource_type: 'criteria_document'`
    // GREEN after fix: `resource_type` removed from payload
    expect(insertBlock).not.toMatch(/\bresource_type\s*:/);
  });
});

// ---------------------------------------------------------------------------
// T-ALCF-004: INSERT does NOT use `resource_id` column
// ---------------------------------------------------------------------------
describe('[T-ALCF-004] INSERT does NOT use resource_id column in insert block', () => {
  /**
   * RED REASON:
   *   useCriteria.ts currently passes `resource_id: data.path` in the insert
   *   payload. The audit_logs table has no `resource_id` column — including
   *   it causes the write to fail silently (same `resource_type` issue above).
   *   Note: `resource_id` also appears in the SELECT and UploadedDocument
   *   interface — those are tested separately in T-ALCF-006 and T-ALCF-007.
   *
   * GREEN AFTER FIX:
   *   The fix removes `resource_id` from the insert payload entirely.
   */
  it('audit_logs insert block does NOT contain resource_id key', () => {
    const content = readUseCriteria();
    const insertBlock = extractInsertBlock(content);

    expect(insertBlock).not.toBe('');
    // RED: insertBlock currently contains `resource_id: data.path`
    // GREEN after fix: `resource_id` removed from insert payload
    expect(insertBlock).not.toMatch(/\bresource_id\s*:/);
  });
});

// ---------------------------------------------------------------------------
// T-ALCF-005: INSERT uses `organisation_id` column (NOT NULL — must be present)
// ---------------------------------------------------------------------------
describe('[T-ALCF-005] INSERT uses organisation_id column', () => {
  /**
   * RED REASON:
   *   The audit_logs table declares `organisation_id UUID NOT NULL`. The
   *   current insert block does NOT include an `organisation_id` key at all.
   *   Because the column is NOT NULL with no default, every insert attempt
   *   fails with a Postgres NOT NULL constraint violation. The error is
   *   silently swallowed by the try/catch, so the document never appears
   *   in the UI. This is the primary regression path.
   *
   * GREEN AFTER FIX:
   *   The fix reads `organisation_id` from the user's profile (already done
   *   earlier in the mutationFn for the storage path) and passes it into the
   *   insert payload: `organisation_id: organisationId`.
   */
  it('audit_logs insert block contains organisation_id key', () => {
    const content = readUseCriteria();
    const insertBlock = extractInsertBlock(content);

    expect(insertBlock).not.toBe('');
    // RED: `organisation_id` is absent from the insert block
    // GREEN after fix: `organisation_id: organisationId` present in payload
    expect(insertBlock).toMatch(/\borganisation_id\s*:/);
  });
});

// ---------------------------------------------------------------------------
// T-ALCF-006: SELECT for useUploadedDocuments does NOT include `resource_id`
// ---------------------------------------------------------------------------
describe('[T-ALCF-006] useUploadedDocuments SELECT does NOT include resource_id', () => {
  /**
   * RED REASON:
   *   The `.select(...)` call in useUploadedDocuments currently includes
   *   `resource_id` in the column list:
   *     .select('id, resource_id, file_path, action, details, created_at')
   *   The audit_logs table has no `resource_id` column, so Supabase returns
   *   an error which surfaces in the UI as "Failed to load uploaded documents".
   *
   * GREEN AFTER FIX:
   *   The fix removes `resource_id` from the select string. The corrected
   *   select should only contain columns that exist: id, file_path, action,
   *   details, created_at (and optionally created_by).
   */
  it('useUploadedDocuments .select() string does NOT contain resource_id', () => {
    const content = readUseCriteria();

    // Find the .select(...) call that belongs to useUploadedDocuments by
    // locating the function definition and then the first .select( after it.
    const fnMarker = 'function useUploadedDocuments';
    const fnIdx = content.indexOf(fnMarker);
    expect(fnIdx).toBeGreaterThan(-1);

    // Slice from the function start so we only inspect its body, not other
    // .select() calls higher up (e.g. criteria-tree, profile lookup).
    const fnBody = content.slice(fnIdx, fnIdx + 1500);

    const selectMatch = fnBody.match(/\.select\((['"`])([\s\S]*?)\1\)/);
    expect(selectMatch).not.toBeNull();

    const selectString = selectMatch![2];
    // RED: selectString currently contains 'resource_id'
    // GREEN after fix: 'resource_id' removed from the column list
    expect(selectString).not.toContain('resource_id');
  });
});

// ---------------------------------------------------------------------------
// T-ALCF-007: UploadedDocument interface does NOT have `resource_id` field
// ---------------------------------------------------------------------------
describe('[T-ALCF-007] UploadedDocument interface does NOT have resource_id field', () => {
  /**
   * RED REASON:
   *   The UploadedDocument TypeScript interface currently declares:
   *     resource_id: string | null;
   *   This mirrors the non-existent `resource_id` DB column. Once the SELECT
   *   is fixed (T-ALCF-006) and the column removed from the query, the
   *   interface must also be updated so the type accurately reflects the
   *   returned shape and to eliminate the dead field that caused the original
   *   confusion.
   *
   * GREEN AFTER FIX:
   *   The fix removes `resource_id` from the UploadedDocument interface
   *   declaration, keeping it consistent with the real schema columns.
   */
  it('UploadedDocument interface body does NOT contain resource_id field', () => {
    const content = readUseCriteria();
    const interfaceBlock = extractUploadedDocumentInterface(content);

    expect(interfaceBlock).not.toBe('');
    // RED: interfaceBlock currently contains `resource_id: string | null;`
    // GREEN after fix: `resource_id` removed from the UploadedDocument interface
    expect(interfaceBlock).not.toMatch(/\bresource_id\s*:/);
  });
});
