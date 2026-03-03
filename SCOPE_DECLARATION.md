# Scope Declaration

**Issue**: Wave 13 Governance Failure: Post-deployment audit schema/cache miss + profile save broken (record, RCA, wire fix)
**Date**: 2026-03-03
**Agent**: foreman-v2-agent (session-095, v6.2.0)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

---

## Purpose

This PR delivers Wave 13 Addendum B (two production-stopper fixes) + Addendum C (full Supabase table population pathway audit):

1. Audit schema cache miss: adds missing audit_period_start/audit_period_end columns to audits table (INC-W13-AUDIT-SCHEMA-001)
2. Profile save broken: fixes useSettings.ts user_profiles -> profiles table name (INC-W13-PROFILE-TABLE-001)
3. Table pathway audit: 4 additional migrations + 8 new drift-detection tests (T-W13-SCH-5 to T-W13-SCH-12)

---

## Files Changed

**Total Files**: 18

All files in this PR are explicitly listed below (required by BL-027):

- `SCOPE_DECLARATION.md` - this file (updated for this PR)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-095-wave13-addendum-bc-20260303.md` - PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-095-wave13-addendum-bc-20260303.md` - session memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - parking station append
- `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` - A-026 codified by IAA (session-116)
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` - version bump to 1.9.0 by IAA (session-116)
- `.agent-workspace/independent-assurance-agent/memory/session-115-20260303.md` - IAA session-115 memory
- `.agent-workspace/independent-assurance-agent/memory/session-116-20260303.md` - IAA session-116 memory
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station append
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000000_audits_add_period_columns.sql` - adds audit_period_start and audit_period_end columns (INC-W13-AUDIT-SCHEMA-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000001_evidence_table.sql` - creates evidence table (INC-W13-EVIDENCE-TABLE-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000002_scores_table.sql` - creates scores table (INC-W13-SCORES-TABLE-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000003_organisation_settings_table.sql` - creates organisation_settings table (INC-W13-ORG-SETTINGS-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000004_storage_buckets.sql` - creates audit-documents and organisation-assets storage buckets (INC-W13-BUCKET-001)
- `modules/mat/05-rca/RCA_WAVE12_POST_DEPLOYMENT_WIRING_FAILURES_20260302.md` - section 8 addendum (F-02 column gap, F-10 table name drift)
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Wave 13 Addendum B and C sections added
- `modules/mat/frontend/src/lib/hooks/useSettings.ts` - renames user_profiles to profiles in 2 from() calls (INC-W13-PROFILE-TABLE-001)
- `modules/mat/tests/wave13/schema-existence.test.ts` - adds T-W13-SCH-5 to T-W13-SCH-12 (8 new file-based tests, all GREEN)

---

## POLC Attestation

Production code modified: modules/mat/frontend/src/lib/hooks/useSettings.ts (2-line table name fix, no logic change)
Test code modified: modules/mat/tests/wave13/schema-existence.test.ts (8 new tests added, no existing tests modified)
All other files: governance documentation and schema DDL (additive only, no data loss)

---

## Signature

**Scope Declared By**: foreman-v2-agent (session-095, v6.2.0)
**Date**: 2026-03-03
**Issue**: Wave 13 Governance Failure: Post-deployment audit schema/cache miss + profile save broken

---

*END OF SCOPE DECLARATION*


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

*END OF SCOPE DECLARATION*


---

## Wave 14 Addendum A — Scope Declaration

**Issue**: #869 — Schema mapping mismatch: frontend-to-Supabase table columns missing for profile and audit management  
**Date**: 2026-03-03  
**Agent**: foreman-v2-agent session-096  
**Branch**: copilot/fix-schema-mapping-issues  
**Incident**: INC-W14-COL-MAPPING-001

### Files Changed

| File | Change Type | Incident |
|---|---|---|
| `apps/maturion-maturity-legacy/supabase/migrations/20260304000000_profiles_add_full_name_and_preferences.sql` | NEW | INC-W14-PROFILES-COL-001, INC-W14-PROFILES-COL-002 |
| `apps/maturion-maturity-legacy/supabase/migrations/20260304000001_audits_add_criteria_approved.sql` | NEW | INC-W14-AUDITS-COL-001 |
| `apps/maturion-maturity-legacy/supabase/migrations/20260304000002_audit_scores_table.sql` | NEW | INC-W13-AUDIT-SCORES-001 (carry-forward) |
| `modules/mat/tests/wave14/column-mapping.test.ts` | NEW | INC-W14-COL-MAPPING-001 |
| `modules/mat/02-architecture/data-architecture.md` | UPDATED | §1.1.2 — full_name + preferences added |
| `modules/mat/01-frs/functional-requirements.md` | UPDATED | FR-078–FR-081 added (v1.5.0 → v1.6.0) |
| `modules/mat/01.5-trs/technical-requirements-specification.md` | UPDATED | TR-078–TR-081 added (v1.4.0 → v1.5.0) |
| `modules/mat/BUILD_PROGRESS_TRACKER.md` | UPDATED | Wave 14 Addendum A section |
| `modules/mat/05-rca/RCA_WAVE12_POST_DEPLOYMENT_WIRING_FAILURES_20260302.md` | UPDATED | §9 RCA entry |
| `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | UPDATED | A-027 codified (v2.2.0 → v2.5.0) |
| `.agent-workspace/foreman-v2/knowledge/index.md` | UPDATED | FAIL-ONLY-ONCE version 2.4.0 → 2.5.0 |
| `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-096-wave14-addendum-a-20260303.md` | NEW | Phase 4 PREHANDOVER proof |
| `.agent-workspace/foreman-v2/memory/session-096-20260303.md` | NEW | Phase 4 session memory |
| `SCOPE_DECLARATION.md` | UPDATED | This section |

### Scope Boundaries

- No `.github/agents/*.md` files modified (AGCFPP-001 compliant)
- No production TypeScript/React code modified — migrations only
- All migrations idempotent (ADD COLUMN IF NOT EXISTS, CREATE TABLE IF NOT EXISTS)
- All tests file-based — no live Supabase env required
