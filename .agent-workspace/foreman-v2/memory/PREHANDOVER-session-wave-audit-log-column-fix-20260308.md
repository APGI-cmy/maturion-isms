# PREHANDOVER PROOF — wave-audit-log-column-fix

## 1. Wave Identity

- **Wave**: wave-audit-log-column-fix
- **Branch**: `copilot/fix-document-upload-issues`
- **Issue**: fix(criteria-upload): audit_logs insert/query column mismatches prevent uploaded documents from appearing; migration drift and governance gaps require postmortem / scope closure
- **Date**: 2026-03-08
- **Session**: session-wave-audit-log-column-fix-20260308
- **Authority**: CS2 (@APGI-cmy)
- **IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-audit-log-column-fix.md`
- **Agent version**: foreman-v2-agent v6.2.0 / Contract 2.6.0

---

## 2. Task Completion Evidence

| Task ID | Builder | Status | Evidence |
|---------|---------|--------|---------|
| T-ALCF-QA-001 | qa-builder | ✅ COMPLETE | `modules/mat/tests/wave-audit-log-column-fix/wave-audit-log-column-fix.test.ts` — 7 RED tests confirmed before fix |
| T-ALCF-API-001 | api-builder | ✅ COMPLETE | `modules/mat/frontend/src/lib/hooks/useCriteria.ts` — INSERT/SELECT/interface/dedup key corrected; all 7 tests GREEN |
| T-ALCF-GOV-001 | foreman-v2 | ✅ COMPLETE | FAIL-ONLY-ONCE v3.4.0; BUILD_PROGRESS_TRACKER; implementation-plan; SCOPE_DECLARATION; parking-station all updated |

---

## 3. QA Gate Evidence (MANDATORY)

### RED Gate Confirmation (before T-ALCF-API-001)

All 7 T-ALCF tests confirmed RED before api-builder fix was applied:

```
× [T-ALCF-001] INSERT does NOT use user_id column
× [T-ALCF-002] INSERT uses created_by column
× [T-ALCF-003] INSERT does NOT use resource_type column
× [T-ALCF-004] INSERT does NOT use resource_id column in insert block
× [T-ALCF-005] INSERT uses organisation_id column
× [T-ALCF-006] useUploadedDocuments SELECT does NOT include resource_id
× [T-ALCF-007] UploadedDocument interface does NOT have resource_id field
Tests  7 failed (7)
```

### GREEN Gate Confirmation (after T-ALCF-API-001)

```
✓ [T-ALCF-001] INSERT does NOT use user_id column
✓ [T-ALCF-002] INSERT uses created_by column
✓ [T-ALCF-003] INSERT does NOT use resource_type column
✓ [T-ALCF-004] INSERT does NOT use resource_id column in insert block
✓ [T-ALCF-005] INSERT uses organisation_id column
✓ [T-ALCF-006] useUploadedDocuments SELECT does NOT include resource_id
✓ [T-ALCF-007] UploadedDocument interface does NOT have resource_id field
Test Files  2 passed (2)
Tests  17 passed (17)
```

Full suite: **879 passed, 8 pre-existing env-var failures (wave13, requiring live VITE_SUPABASE_URL — unrelated to this wave)**

---

## 4. CST Gate Evidence

| Gate | Status | Evidence |
|------|--------|---------|
| QA→API gate | ✅ PASS | 7 RED tests existed (T-ALCF-001 through T-ALCF-007) before T-ALCF-API-001 api-builder started; confirmed via qa-builder delivery output |
| API→(no UI task) | ✅ N/A | No UI-layer changes required for this wave; all fixes are in the hook layer |

---

## 5. Implementation Correctness Attestation

### FFA-006: INSERT position — after storage upload success, before return

✅ PASS — The `audit_logs.insert()` call is placed at lines 166–185 of `useCriteria.ts`, after `supabase.storage.upload()` returns successfully (checked `if (error) throw`), and before `return { path: data.path, hash }`.

### FFA-007: INSERT column correctness

✅ PASS — INSERT payload confirmed:
```typescript
{
  audit_id: auditId,         // ✅ exists in schema
  organisation_id: organisationId,  // ✅ NOT NULL — was missing in prior wave
  action: 'criteria_upload', // ✅ exists in schema
  file_path: data.path,      // ✅ exists in schema (top-level column)
  created_by: user.id,       // ✅ correct column name (was user_id — non-existent)
  details: { ... },          // ✅ JSONB column
}
// REMOVED: user_id (non-existent), resource_type (non-existent), resource_id (non-existent)
```

### FFA-008: SELECT column correctness

✅ PASS — SELECT string: `'id, file_path, action, details, created_at, created_by'`
All columns verified against migration `20260308000001_audit_logs_table.sql`. `resource_id` removed.

### FFA-009: Deduplication key

✅ PASS — Deduplication key: `row.details?.file_path ?? row.file_path ?? ''`
Removed the non-existent `row.resource_id ??` prefix. Priority ordering unchanged: criteria_parsed (3) > criteria_parse_failed (2) > criteria_upload (1).

### FFA-010/FFA-011: CriteriaUpload.tsx / UploadedDocument interface

✅ PASS (FFA-010) — `getParseStatus()` in `CriteriaUpload.tsx` already has explicit `criteria_upload → 'PENDING'` branch (unchanged from previous wave, correct).
✅ PASS (FFA-011) — `UploadedDocument` interface updated: `resource_id: string | null` removed; `created_by: string | null` added.

---

## 6. Schema Column Cross-Check (NEW — FFA-016 through FFA-018)

**Migration file read**: `apps/maturion-maturity-legacy/supabase/migrations/20260308000001_audit_logs_table.sql`

| Column | In Schema | Used in INSERT | Used in SELECT |
|--------|-----------|----------------|----------------|
| `id` | ✅ | — | ✅ |
| `audit_id` | ✅ | ✅ | — |
| `organisation_id` | ✅ NOT NULL | ✅ | — |
| `action` | ✅ | ✅ | ✅ |
| `file_path` | ✅ | ✅ | ✅ |
| `details` | ✅ JSONB | ✅ | ✅ |
| `created_by` | ✅ | ✅ | ✅ |
| `created_at` | ✅ NOT NULL | — (default) | ✅ |
| `user_id` | ❌ DOES NOT EXIST | ❌ REMOVED | — |
| `resource_type` | ❌ DOES NOT EXIST | ❌ REMOVED | — |
| `resource_id` | ❌ DOES NOT EXIST | ❌ REMOVED | ❌ REMOVED |

Schema compliance: ✅ FULL COMPLIANCE — all INSERT/SELECT columns verified against DDL.

---

## 7. FRS/TRS Alignment

| Ref | Alignment | Evidence |
|-----|-----------|---------|
| FR-004 | ✅ ALIGNED | Upload produces `criteria_upload` audit_log entry immediately after storage upload; `organisation_id` ensures RLS SELECT policy is satisfied so the entry is visible to the user |
| FR-103 | ✅ ALIGNED | Upload failures and parse failures surfaced inline; `criteria_upload` entry always written (non-fatal try/catch) so document is always visible even when Edge Function is unavailable |
| TR-047 | ✅ ALIGNED | `useUploadedDocuments` query pattern includes all three actions; correct columns selected |

---

## 8. Governance Closure (T-ALCF-GOV-001)

| Item | Status |
|------|--------|
| INC-ALCF-001 in FAIL-ONLY-ONCE v3.4.0 | ✅ REGISTERED — `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` |
| S-028 SCHEMA-COLUMN-COMPLIANCE-MANDATORY | ✅ ADDED — Section 3, item S-028 |
| Knowledge index.md | ✅ UPDATED — v2.1.0; FAIL-ONLY-ONCE v3.4.0 in table |
| BUILD_PROGRESS_TRACKER.md | ✅ UPDATED — wave-audit-log-column-fix wave entry |
| implementation-plan.md | ✅ UPDATED — wave-audit-log-column-fix plan entry (v2.8.0) |
| SCOPE_DECLARATION.md | ✅ OVERWRITTEN (A-029 fresh overwrite) — wave-audit-log-column-fix |
| parking-station/suggestions-log.md | ✅ UPDATED — S-028 entry appended |

---

## 9. Test Summary

| Suite | Count | Status |
|-------|-------|--------|
| T-ALCF-001 through T-ALCF-007 (wave-audit-log-column-fix) | 7 | ✅ GREEN |
| T-WUF-001 through T-WUF-010 (wave-upload-doclist-fix) | 10 | ✅ GREEN (no regression) |
| All other mat module tests | 862 | ✅ GREEN |
| wave13 env-var tests (pre-existing) | 8 FAIL | ⚠️ Pre-existing, unrelated (require live VITE_SUPABASE_URL) |
| **Total** | **887** | **879 PASS, 8 pre-existing FAIL** |

TypeScript: 0 errors (`modules/mat/frontend`).

---

## 10. §4.3 Merge Gate Parity Check

| Check | Status |
|-------|--------|
| validate-scope-to-diff.sh | ⏳ Will be verified after full commit |
| All T-ALCF tests GREEN | ✅ 7/7 GREEN |
| All T-WUF tests GREEN | ✅ 10/10 GREEN |
| TypeScript 0 errors | ✅ PASS |
| PREHANDOVER proof present | ✅ This document |
| Session memory present | ✅ `.agent-workspace/foreman-v2/memory/session-wave-audit-log-column-fix-20260308.md` |
| IAA Pre-Brief present | ✅ `.agent-admin/assurance/iaa-prebrief-wave-audit-log-column-fix.md` |

`merge_gate_parity: PENDING — awaiting validate-scope-to-diff.sh exit 0`

---

## 11. IAA Invocation Request

- **Requesting**: IAA Final Audit
- **PREHANDOVER committed**: PENDING — will be committed with this file
- **All FFA checks self-attested**: YES (see sections 5–8 above)
- **IAA audit token** (expected reference per §4.3b): `IAA-session-wave-audit-log-column-fix-20260308-PASS`

---

*Foreman: foreman-v2-agent v6.2.0 | Session: session-wave-audit-log-column-fix-20260308 | Date: 2026-03-08*
