# Scope Declaration

**Issue**: Wave 13 Governance Failure: Post-deployment audit schema/cache miss + profile save broken (record, RCA, wire fix)  
**Date**: 2026-03-03  
**Agent**: foreman-v2-agent (session-095, v6.2.0)  
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

---

## Purpose

This PR delivers Wave 13 Addendum B (two production-stopper fix) + Addendum C (full Supabase table population pathway audit — "We Only Fail Once"):

1. **Immediate fixes**:
   - Add missing `audit_period_start`/`audit_period_end` columns to `audits` table (INC-W13-AUDIT-SCHEMA-001)
   - Fix `useSettings.ts`: `user_profiles` → `profiles` table name (INC-W13-PROFILE-TABLE-001)

2. **Table pathway audit** (all `.from('...')` references in MAT frontend audited):
   - 4 additional migrations: `evidence`, `scores`, `organisation_settings` tables + storage buckets
   - 8 new file-based tests T-W13-SCH-5 to T-W13-SCH-12 (all GREEN, no env vars required)
   - T-W13-SCH-11: structural drift guard — fails if any hook references a table absent from migrations

3. **Governance documentation**:
   - BUILD_PROGRESS_TRACKER.md: Wave 13 Addendum B+C sections
   - RCA file: §8 addendum (F-02 column gap, F-10 table name drift, WGI-05/06)
   - PREHANDOVER proof + session memory

---

## Files Changed

**Total Files**: 17

All files in this PR are explicitly listed below (required by BL-027):

**Supabase Migrations (production schema fixes):**
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000000_audits_add_period_columns.sql` — adds `audit_period_start`, `audit_period_end` DATE columns to `audits` table (INC-W13-AUDIT-SCHEMA-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000001_evidence_table.sql` — creates `evidence` table (INC-W13-EVIDENCE-TABLE-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000002_scores_table.sql` — creates `scores` table (INC-W13-SCORES-TABLE-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000003_organisation_settings_table.sql` — creates `organisation_settings` table (INC-W13-ORG-SETTINGS-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000004_storage_buckets.sql` — creates `audit-documents` and `organisation-assets` storage buckets (INC-W13-BUCKET-001)

**Frontend fix:**
- `modules/mat/frontend/src/lib/hooks/useSettings.ts` — renames `user_profiles` → `profiles` in 2 `.from()` calls (INC-W13-PROFILE-TABLE-001)

**Tests:**
- `modules/mat/tests/wave13/schema-existence.test.ts` — adds T-W13-SCH-5 to T-W13-SCH-12 (file-based, 8/8 GREEN)

**Governance documentation:**
- `modules/mat/BUILD_PROGRESS_TRACKER.md` — Wave 13 Addendum B+C (audit table, incident registry, WGI-07/08/09)
- `modules/mat/05-rca/RCA_WAVE12_POST_DEPLOYMENT_WIRING_FAILURES_20260302.md` — §8 addendum
- `SCOPE_DECLARATION.md` — this file (updated for this PR)

**Agent workspace (governance artifacts):**
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-095-wave13-addendum-bc-20260303.md` — PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-095-wave13-addendum-bc-20260303.md` — session memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` — parking station append
- `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` — A-026 codified by IAA
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` — version bump to 1.9.0
- `.agent-workspace/independent-assurance-agent/memory/session-115-20260303.md` — IAA session-115 memory
- `.agent-workspace/independent-assurance-agent/memory/session-116-20260303.md` — IAA session-116 memory
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` — IAA parking station append

---

## POLC Attestation

**Files Modified by Category:**

| Category | Files | Production Code? |
|---|---|---|
| SQL migrations (schema only) | 5 | ⚠️ Schema DDL — additive only, no data loss |
| Frontend hook fix | 1 | ✅ Production code — minimal 2-line fix |
| Test additions | 1 | Test code only |
| Governance documentation | 5 | Not production code |
| Agent workspace artifacts | 5 | Not production code |

**Production Code Patterns Modified:**
- `modules/**/src/**/*.ts` — ✅ 1 file (`useSettings.ts` — 2-line table name fix, no logic change)
- `modules/**/tests/**/*.test.ts` — ✅ 1 file (additive only — 8 new tests, no existing tests modified)

---

## Signature

**Scope Declared By**: foreman-v2-agent (session-095, v6.2.0)  
**Date**: 2026-03-03  
**Issue**: Wave 13 Governance Failure: Post-deployment audit schema/cache miss + profile save broken

---

*END OF SCOPE DECLARATION*
