# Governance Overlay — OVL-CRITERIA-DELETE-REPARSE

**Overlay ID**: OVL-CRITERIA-DELETE-REPARSE  
**Title**: Criteria Document Delete and Re-parse Completeness Gap  
**Status**: ACTIVE  
**Severity**: MODERATE  
**Created**: 2026-03-09  
**Author**: foreman-v2-agent  
**Authority**: CS2 (@APGI-cmy)  
**Related Issue**: Add document delete + re-parse (replace) function with governance overlay for criteria management  
**Resolution PR**: copilot/add-document-delete-reparse-function  

---

## 1. Gap Summary

Criteria Management lacked a document delete capability and a reliable re-parse (replace)
function. This created the following risks and failure modes:

| # | Failure Mode | Risk | Impact |
|---|---|---|---|
| F-1 | Partially parsed criteria documents could not be removed without manual DB intervention | HIGH | Lingering stale criteria data for an audit |
| F-2 | Re-parse after an interrupted/failed parse had no safe reset path | HIGH | Duplicate or corrupt criteria hierarchy per audit |
| F-3 | Multiple `audit_logs` upload entries were orphaned with no cleanup mechanism | MODERATE | Confusing document list UI; audit log clutter |
| F-4 | No user-facing confirmation requirement for destructive operations | MODERATE | Accidental data loss risk |
| F-5 | ESLint violation in `CriteriaUpload.tsx` (`react-hooks/exhaustive-deps`) caused CI gate failure | MINOR | CI blocked; `useCallback` missing on `invalidate` function |

---

## 2. Scope of Risk

- **Affected component**: `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx`
- **Affected hook**: `modules/mat/frontend/src/lib/hooks/useCriteria.ts`
- **Affected data**: `public.domains`, `public.mini_performance_standards`, `public.criteria`,
  `public.criteria_documents`, `public.audit_logs`
- **Boundary**: Strictly per `audit_id`. No cross-audit contamination is possible.

---

## 3. Resolution

### 3.1 ESLint CI Failure (F-5)

The `invalidate` function in `useUploadedDocuments` was not wrapped in `useCallback`, causing
the `react-hooks/exhaustive-deps` rule to flag a missing dependency in `CriteriaUpload.tsx`.

**Fix**: `invalidate` is now wrapped with `useCallback([queryClient, auditId])` making it a
stable reference, satisfying the exhaustive-deps rule without causing extra effect re-runs.

### 3.2 Document Delete (`useDeleteCriteriaDocument`)

A new hook was added that performs a surgical, audit-scoped delete:

1. Deletes all `domains` rows for `audit_id` (cascades to `mini_performance_standards` → `criteria`).
2. Deletes the `criteria_documents` row for `audit_id` + `file_path`.
3. Deletes `audit_logs` entries for `audit_id` + `file_path` (actions: `criteria_upload`, `criteria_parsed`, `criteria_parse_failed`).

**Safety guarantee**: All DELETE operations are gated by `.eq('audit_id', auditId)`.
Unrelated audits are never affected.

**Schema limitation acknowledged**: The current schema does not track which domain/MPS/criterion
was created by which source document (no `source_document_path` column on `domains`). Therefore
delete affects ALL parsed criteria for the audit, not per-document criteria. This is a known
limitation of the current data model. A future migration could add per-document provenance
tracking to enable more granular deletes.

### 3.3 Re-parse (Replace) (`useReparseCriteriaDocument`)

A new hook was added that performs a safe re-parse sequence:

1. Deletes all `domains` for `audit_id` (cascade to MPS → criteria) to clear stale data.
2. Upserts `criteria_documents` to `status='processing'` (resets parse state for the file).
3. Refreshes the user session and invokes the `invoke-ai-parse-criteria` Edge Function.

**UI contract**: The UI always requires explicit user confirmation before invoking this mutation
(see §3.4).

### 3.4 UI Confirmation Flow

The UI was updated to:

- Add a **Delete** button per document in the Uploaded Documents list.
- Show a **"Re-parse"** button (replacing "Parse Now") for documents with `COMPLETE` status.
- Both destructive actions display an **inline confirmation banner** with:
  - A clear human-readable warning about what will be deleted.
  - `role="alertdialog"` and `aria-modal="true"` for accessibility.
  - A `Yes, [action]` confirm button and a `Cancel` button.
- Inline `actionError` state surfaces failures (delete/re-parse) without `alert()`.

---

## 4. Tests Added

Test file: `modules/mat/frontend/tests/criteria-delete-reparse.test.ts`

| Test ID | Description |
|---|---|
| T-DEL-001 | `useDeleteCriteriaDocument` hook exported |
| T-DEL-002 | Delete scopes domain deletion to `audit_id` |
| T-DEL-003 | Delete removes `criteria_documents` row |
| T-DEL-004 | Delete removes `audit_logs` entries |
| T-DEL-005 | `useReparseCriteriaDocument` hook exported |
| T-DEL-006 | Re-parse clears domains before re-trigger |
| T-DEL-007 | Re-parse resets `criteria_documents` status to `processing` |
| T-DEL-008 | Re-parse triggers Edge Function |
| T-DEL-009 | `useCallback` wraps `invalidate` (ESLint-safe) |
| T-DEL-010 | UI renders delete button per document |
| T-DEL-011 | UI renders re-parse button for COMPLETE documents |
| T-DEL-012 | UI renders delete confirmation dialog |
| T-DEL-013 | UI renders re-parse confirmation dialog |
| T-DEL-014 | Both hooks are scoped to `audit_id` only |

All 29 assertions pass (29/29 GREEN).

---

## 5. Known Remaining Limitations

| ID | Description | Mitigation |
|---|---|---|
| LIM-001 | No per-document provenance on domains/MPS/criteria — delete affects all criteria for the audit | Acceptable given current schema; future migration could add `source_document_path` |
| LIM-002 | Storage object (the uploaded file itself) is not deleted | Intentional: preserves the original file for re-parse; manual cleanup via Supabase console if needed |
| LIM-003 | Delete does not remove `criteria_evaluations`, `domain_assignments`, `mps_assignments`, `criteria_assignments` cascade data | These cascade from domain ON DELETE CASCADE in the Supabase schema |

> **Note**: RLS policies for `domains` DELETE, `criteria_documents` INSERT/UPDATE/DELETE, and
> `audit_logs` DELETE are added by migration
> `apps/maturion-maturity-legacy/supabase/migrations/20260309000003_criteria_delete_reparse_rls.sql`.
> This closes the RLS gap identified by IAA REJECTION-PACKAGE BD-015 (R1 round).

---

## 6. Completeness Gap Tracking

This overlay is linked to the ISMS completeness gap tracking system. The gap identified
in the original issue (no delete/re-parse capability, ESLint CI failure) is resolved by
this PR. No further action is required unless the schema limitation in LIM-001 is addressed
in a future wave.

---

**Governed by**: `governance/canon/LIVING_AGENT_SYSTEM.md`  
**Overlay authority**: CS2 (@APGI-cmy)
