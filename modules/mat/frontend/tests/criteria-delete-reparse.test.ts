/**
 * MAT Frontend Test Suite — CAT-FE-DEL: Document Delete & Re-parse (Replace)
 *
 * Covers: useDeleteCriteriaDocument, useReparseCriteriaDocument hooks and the
 * corresponding UI confirmation flow in CriteriaUpload.tsx.
 *
 * All assertions are file-based (no live Supabase / network / React rendering required).
 *
 * Tests:
 *   T-DEL-001: useDeleteCriteriaDocument hook exported from useCriteria.ts
 *   T-DEL-002: Delete hook deletes domains scoped to audit_id (cascade to MPS/criteria)
 *   T-DEL-003: Delete hook removes criteria_documents row for audit_id + file_path
 *   T-DEL-004: Delete hook removes audit_logs entries for the file
 *   T-DEL-005: useReparseCriteriaDocument hook exported from useCriteria.ts
 *   T-DEL-006: Re-parse hook clears all domains before re-triggering
 *   T-DEL-007: Re-parse hook resets criteria_documents status to 'processing'
 *   T-DEL-008: Re-parse hook triggers invoke-ai-parse-criteria Edge Function
 *   T-DEL-009: useCallback wraps invalidate in useUploadedDocuments (ESLint-safe)
 *   T-DEL-010: CriteriaUpload renders delete button per document
 *   T-DEL-011: CriteriaUpload renders re-parse button for COMPLETE documents
 *   T-DEL-012: CriteriaUpload renders delete confirmation with cancel + confirm buttons
 *   T-DEL-013: CriteriaUpload renders re-parse confirmation with cancel + confirm buttons
 *   T-DEL-014: Delete and re-parse actions are scoped to audit_id only
 *
 * FRS: FR-004 (Criteria management), FR-103 (Error surfacing)
 * Governance overlay: governance/overlays/OVL-CRITERIA-DELETE-REPARSE.md
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const USE_CRITERIA_PATH = path.resolve(
  process.cwd(),
  'tests/../src/lib/hooks/useCriteria.ts',
);

const CRITERIA_UPLOAD_PATH = path.resolve(
  process.cwd(),
  'tests/../src/components/criteria/CriteriaUpload.tsx',
);

// ---------------------------------------------------------------------------
// T-DEL-001: useDeleteCriteriaDocument hook is exported
// ---------------------------------------------------------------------------
describe('[T-DEL-001] useDeleteCriteriaDocument hook is exported from useCriteria.ts', () => {
  it('useCriteria.ts exports useDeleteCriteriaDocument', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toContain('export function useDeleteCriteriaDocument');
  });
});

// ---------------------------------------------------------------------------
// T-DEL-002: Delete hook deletes domains for the audit (cascade to MPS/criteria)
// ---------------------------------------------------------------------------
describe('[T-DEL-002] useDeleteCriteriaDocument deletes domains scoped to audit_id', () => {
  it('delete hook deletes from domains table', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // Must delete from 'domains' table to cascade-delete MPS and criteria
    expect(content).toMatch(/useDeleteCriteriaDocument[\s\S]{0,800}from\(['"]\s*domains\s*['"]\)\s*\.delete/);
  });

  it('delete hook scopes domains deletion to audit_id', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // Must use .eq('audit_id', auditId) to avoid cross-audit contamination
    expect(content).toMatch(/useDeleteCriteriaDocument[\s\S]{0,1000}\.eq\(\s*['"]audit_id['"]\s*,\s*auditId\s*\)/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-003: Delete hook removes criteria_documents row for audit_id + file_path
// ---------------------------------------------------------------------------
describe('[T-DEL-003] useDeleteCriteriaDocument removes criteria_documents row', () => {
  it('delete hook deletes from criteria_documents table', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toMatch(/useDeleteCriteriaDocument[\s\S]{0,1500}from\(['"]\s*criteria_documents\s*['"]\)\s*\.delete/);
  });

  it('delete hook scopes criteria_documents deletion to file_path', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // Must filter by file_path to ensure only the target document row is removed
    expect(content).toMatch(/useDeleteCriteriaDocument[\s\S]{0,2000}criteria_documents[\s\S]{0,400}\.eq\(\s*['"]file_path['"]/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-004: Delete hook removes audit_logs entries for the file
// ---------------------------------------------------------------------------
describe('[T-DEL-004] useDeleteCriteriaDocument removes audit_logs entries for the file', () => {
  it('delete hook deletes from audit_logs table', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toMatch(/useDeleteCriteriaDocument[\s\S]{0,2500}from\(['"]\s*audit_logs\s*['"]\)\s*\.delete/);
  });

  it('delete hook filters audit_logs by file_path', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toMatch(/useDeleteCriteriaDocument[\s\S]{0,3000}audit_logs[\s\S]{0,500}\.eq\(\s*['"]file_path['"]/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-005: useReparseCriteriaDocument hook is exported
// ---------------------------------------------------------------------------
describe('[T-DEL-005] useReparseCriteriaDocument hook is exported from useCriteria.ts', () => {
  it('useCriteria.ts exports useReparseCriteriaDocument', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toContain('export function useReparseCriteriaDocument');
  });
});

// ---------------------------------------------------------------------------
// T-DEL-006: Re-parse hook clears all domains before re-triggering
// ---------------------------------------------------------------------------
describe('[T-DEL-006] useReparseCriteriaDocument clears all domains before re-parse', () => {
  it('re-parse hook deletes from domains table', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toMatch(/useReparseCriteriaDocument[\s\S]{0,800}from\(['"]\s*domains\s*['"]\)\s*\.delete/);
  });

  it('re-parse hook scopes domain deletion to audit_id only', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toMatch(/useReparseCriteriaDocument[\s\S]{0,1000}domains[\s\S]{0,300}\.eq\(\s*['"]audit_id['"]/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-007: Re-parse hook resets criteria_documents status to 'processing'
// ---------------------------------------------------------------------------
describe('[T-DEL-007] useReparseCriteriaDocument resets criteria_documents status to processing', () => {
  it('re-parse hook upserts criteria_documents with processing status', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // Must upsert criteria_documents with status: 'processing' to reset parse state
    expect(content).toMatch(/useReparseCriteriaDocument[\s\S]{0,1500}criteria_documents[\s\S]{0,400}processing/);
  });

  it('re-parse hook uses upsert for criteria_documents (not raw insert)', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toMatch(/useReparseCriteriaDocument[\s\S]{0,2000}\.upsert\(/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-008: Re-parse hook triggers the AI Edge Function
// ---------------------------------------------------------------------------
describe('[T-DEL-008] useReparseCriteriaDocument triggers invoke-ai-parse-criteria', () => {
  it('re-parse hook invokes the AI parse Edge Function', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toMatch(/useReparseCriteriaDocument[\s\S]{0,2500}invoke-ai-parse-criteria/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-009: useCallback wraps invalidate in useUploadedDocuments (ESLint-safe)
// ---------------------------------------------------------------------------
describe('[T-DEL-009] useUploadedDocuments.invalidate is wrapped in useCallback', () => {
  it('useCriteria.ts imports useCallback from @tanstack/react-query', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    expect(content).toMatch(/useCallback/);
  });

  it('invalidate function in useUploadedDocuments is wrapped with useCallback', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // The invalidate function should be defined via useCallback() within useUploadedDocuments
    expect(content).toMatch(/useUploadedDocuments[\s\S]{0,2500}useCallback\(/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-010: CriteriaUpload renders a delete button per document
// ---------------------------------------------------------------------------
describe('[T-DEL-010] CriteriaUpload renders delete button per document', () => {
  it('CriteriaUpload.tsx contains a delete button with the expected data-testid', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="delete-document-button"');
  });

  it('delete button is aria-labelled for accessibility', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    // aria-label must reference the document name and convey the delete action
    expect(content).toMatch(/delete-document-button[\s\S]{0,400}aria-label/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-011: CriteriaUpload renders re-parse button for COMPLETE documents
// ---------------------------------------------------------------------------
describe('[T-DEL-011] CriteriaUpload renders Re-parse button for COMPLETE documents', () => {
  it('CriteriaUpload.tsx contains a re-parse button with the expected data-testid', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="reparse-button"');
  });

  it('re-parse button is only shown when status is COMPLETE', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toMatch(/status\s*===\s*['"]COMPLETE['"][\s\S]{0,300}reparse-button/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-012: CriteriaUpload renders delete confirmation with cancel + confirm
// ---------------------------------------------------------------------------
describe('[T-DEL-012] CriteriaUpload renders delete confirmation dialog', () => {
  it('CriteriaUpload.tsx contains delete confirmation section', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="delete-confirmation"');
  });

  it('delete confirmation has a confirm button', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="delete-confirm-button"');
  });

  it('delete confirmation has a cancel button', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="delete-cancel-button"');
  });

  it('delete confirmation uses alertdialog role for accessibility', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toMatch(/delete-confirmation[\s\S]{0,200}alertdialog/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-013: CriteriaUpload renders re-parse confirmation with cancel + confirm
// ---------------------------------------------------------------------------
describe('[T-DEL-013] CriteriaUpload renders re-parse confirmation dialog', () => {
  it('CriteriaUpload.tsx contains re-parse confirmation section', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="reparse-confirmation"');
  });

  it('re-parse confirmation has a confirm button', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="reparse-confirm-button"');
  });

  it('re-parse confirmation has a cancel button', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toContain('data-testid="reparse-cancel-button"');
  });

  it('re-parse confirmation uses alertdialog role for accessibility', () => {
    const content = fs.readFileSync(CRITERIA_UPLOAD_PATH, 'utf-8');
    expect(content).toMatch(/reparse-confirmation[\s\S]{0,200}alertdialog/);
  });
});

// ---------------------------------------------------------------------------
// T-DEL-014: Delete and re-parse are scoped to audit_id — do not affect other audits
// ---------------------------------------------------------------------------
describe('[T-DEL-014] Delete and re-parse hooks are scoped to audit_id only', () => {
  it('useDeleteCriteriaDocument only deletes rows matching auditId', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    // The hook must scope all DELETE operations with .eq('audit_id', auditId)
    // No global delete (no .delete() without a .eq() filter) should exist in the hook.
    const hookStart = content.indexOf('export function useDeleteCriteriaDocument');
    const hookEnd = content.indexOf('\nexport function ', hookStart + 1);
    const hookBody = content.slice(hookStart, hookEnd === -1 ? undefined : hookEnd);
    // Count .delete() calls vs .eq('audit_id') checks — every delete must be scoped
    const deleteCount = (hookBody.match(/\.delete\(\)/g) ?? []).length;
    const auditScopeCount = (hookBody.match(/\.eq\(\s*['"]audit_id['"]/g) ?? []).length;
    expect(deleteCount).toBeGreaterThan(0);
    expect(auditScopeCount).toBeGreaterThanOrEqual(deleteCount);
  });

  it('useReparseCriteriaDocument only deletes rows matching auditId', () => {
    const content = fs.readFileSync(USE_CRITERIA_PATH, 'utf-8');
    const hookStart = content.indexOf('export function useReparseCriteriaDocument');
    const hookEnd = content.indexOf('\nexport function ', hookStart + 1);
    const hookBody = content.slice(hookStart, hookEnd === -1 ? undefined : hookEnd);
    const deleteCount = (hookBody.match(/\.delete\(\)/g) ?? []).length;
    const auditScopeCount = (hookBody.match(/\.eq\(\s*['"]audit_id['"]/g) ?? []).length;
    expect(deleteCount).toBeGreaterThan(0);
    expect(auditScopeCount).toBeGreaterThanOrEqual(deleteCount);
  });
});
