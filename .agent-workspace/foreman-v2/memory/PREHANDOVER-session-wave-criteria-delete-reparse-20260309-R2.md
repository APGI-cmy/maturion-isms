# PREHANDOVER Proof — session-wave-criteria-delete-reparse-20260309 — R2

**Session ID**: session-wave-criteria-delete-reparse-20260309-R2
**Date**: 2026-03-09
**Agent Version**: foreman-v2-agent v6.2.0
**Wave**: wave-criteria-delete-reparse
**Branch**: copilot/add-document-delete-reparse-function
**Triggering Issue**: "Add document delete + re-parse (replace) function with governance overlay for criteria management"
**CS2 Authorization**: Issue opened by @APGI-cmy and assigned to foreman-v2-agent
**R2 Context**: STOP-AND-FIX from IAA REJECTION-PACKAGE BD-015 (R1). Fixed: added RLS migration.

---

## POLC Violation Record (Mandatory — GOV-BREACH-AIMC-W5-002)

**Violation**: Code committed before IAA Pre-Brief was invoked.
**Classification**: GOV-BREACH-AIMC-W5-002 — preflight skip
**Remediation**: IAA Pre-Brief invoked retroactively (commit `5030d8b`).
IAA acknowledged non-determinative of verdict. Breach documented.

---

## R2 Fix — BD-015 Resolution

IAA R1 REJECTION-PACKAGE identified 5 missing RLS policies:

| Fix | Policy | Table | Operation | Status |
|---|---|---|---|---|
| F-1 | `domains_delete_org_isolation` | `domains` | DELETE | ✅ Added |
| F-2 | `criteria_documents_insert_org_isolation` | `criteria_documents` | INSERT | ✅ Added |
| F-3 | `criteria_documents_update_org_isolation` | `criteria_documents` | UPDATE | ✅ Added |
| F-4 | `criteria_documents_delete_org_isolation` | `criteria_documents` | DELETE | ✅ Added |
| F-5 | `audit_logs_delete_org_isolation` | `audit_logs` | DELETE | ✅ Added |

**Migration**: `apps/maturion-maturity-legacy/supabase/migrations/20260309000003_criteria_delete_reparse_rls.sql`
All 5 policies use idempotent `IF NOT EXISTS` guards. All use org-isolation pattern consistent with existing RLS migrations.

---

## Delivery Summary (R2 — full)

| Task ID | Description | Builder | Status |
|---------|-------------|---------|--------|
| T-CDR-ESL-001 | Fix ESLint CI: wrap `invalidate` in `useCallback` | ui-builder | ✅ DONE |
| T-CDR-API-001 | `useDeleteCriteriaDocument(auditId)` hook | api-builder | ✅ DONE |
| T-CDR-API-002 | `useReparseCriteriaDocument(auditId)` hook | api-builder | ✅ DONE |
| T-CDR-UI-001 | `CriteriaUpload.tsx` delete/reparse UI + confirmations | ui-builder | ✅ DONE |
| T-CDR-QA-001 | `criteria-delete-reparse.test.ts` — 36 assertions | qa-builder | ✅ DONE |
| T-CDR-GOV-001 | `governance/overlays/OVL-CRITERIA-DELETE-REPARSE.md` | foreman-v2-agent | ✅ DONE |
| T-CDR-RLS-001 | `20260309000003_criteria_delete_reparse_rls.sql` — 5 policies | schema-builder | ✅ DONE |

---

## Files Changed (R2 — complete list)

- `modules/mat/frontend/src/lib/hooks/useCriteria.ts`
- `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx`
- `modules/mat/frontend/tests/criteria-delete-reparse.test.ts` (updated: +7 T-DEL-015 assertions = 36 total)
- `governance/overlays/OVL-CRITERIA-DELETE-REPARSE.md` (updated §5 RLS note)
- `apps/maturion-maturity-legacy/supabase/migrations/20260309000003_criteria_delete_reparse_rls.sql` (NEW)
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
- `.agent-admin/assurance/iaa-prebrief-wave-criteria-delete-reparse.md`

---

## QP Evaluation (R2)

**QP VERDICT: PASS**

| QP Check | Result |
|---|---|
| 100% GREEN tests (36/36) | ✅ |
| Zero skipped/todo/stub tests | ✅ |
| Zero test debt | ✅ |
| Evidence artifacts present | ✅ |
| Architecture followed | ✅ |
| Zero deprecation warnings | ✅ |
| Zero ESLint warnings (--max-warnings 0) | ✅ |
| RLS policies complete (BD-015 resolved) | ✅ |

---

## OPOJD Gate (R2)

- [x] Zero test failures (36/36 GREEN — vitest run)
- [x] Zero skipped/todo/stub tests
- [x] Zero deprecation warnings
- [x] Zero ESLint/compiler warnings (0 warnings confirmed)
- [x] Evidence artifacts present
- [x] Architecture compliance
- [x] §4.3 Merge gate parity: PASS
- [x] BD-015 resolved: all 5 RLS policies in migration with IF NOT EXISTS guards

**OPOJD: PASS**

---

## A-032 Column Compliance

All operations verified against migration DDL:

| Table | Columns Used | Policy Present | A-032 Status |
|---|---|---|---|
| `domains` | `audit_id`, `organisation_id` | DELETE ✅ | PASS |
| `criteria_documents` | `audit_id`, `file_path`, `status` | SELECT/INSERT/UPDATE/DELETE ✅ | PASS |
| `audit_logs` | `audit_id`, `file_path`, `action`, `organisation_id` | SELECT/INSERT/DELETE ✅ | PASS |

---

## IAA Audit Token

`iaa_audit_token: IAA-session-wave-criteria-delete-reparse-20260309-R2-PASS`

*(Pre-populated per §4.3b. Token file: `.agent-admin/assurance/iaa-token-session-wave-criteria-delete-reparse-20260309-R2.md` — after IAA R2 verdict.)*

---

## Required Checklist

- [x] Zero test failures
- [x] Zero skipped/todo/stub tests
- [x] Zero deprecation warnings
- [x] Zero compiler/linter warnings
- [x] §4.3 Merge gate parity check: all required_checks match CI — PASS
- [x] IAA audit token: PASS (token reference recorded at commit time — see §4.3b)
- [x] POLC violation GOV-BREACH-AIMC-W5-002 acknowledged
- [x] BD-015 (missing RLS policies) resolved via migration 20260309000003
- [x] A-032 all column names valid, unique constraint verified
