# Scope Declaration

**Issue**: Wave 13 Governance Failure + PR Review Findings (Addendum B+C + session-096 hardening)
**Date**: 2026-03-03
**Agent**: foreman-v2-agent (session-095 + session-096, v6.2.0)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

---

## Purpose

This PR delivers:

**Session-095 — Wave 13 Addendum B+C:**
1. Audit schema cache miss: adds missing audit_period_start/audit_period_end columns to audits table (INC-W13-AUDIT-SCHEMA-001)
2. Profile save broken: fixes useSettings.ts user_profiles -> profiles table name (INC-W13-PROFILE-TABLE-001)
3. Table pathway audit: 4 additional migrations + 8 new drift-detection tests (T-W13-SCH-5 to T-W13-SCH-12)

**Session-096 — Wave 13 PR Review Findings:**
4. audit-documents RLS hardening with org-path isolation (INC-W13-BUCKET-RLS-001)
5. audit_scores table migration (INC-W13-AUDIT-SCORES-001)
6. SCOPE_DECLARATION.md duplicate section removed
7. Column-level drift tests (T-W13-SCH-13 to T-W13-SCH-16) + T-W13-SCH-11 regex hardened

---

## Files Changed

**Total Files**: 22

All files in this PR are explicitly listed below (required by BL-027):

- `SCOPE_DECLARATION.md` - this file (updated for session-096)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-095-wave13-addendum-bc-20260303.md` - session-095 PREHANDOVER proof (IAA token: IAA-session-117-20260303-PASS)
- `.agent-workspace/foreman-v2/memory/session-095-wave13-addendum-bc-20260303.md` - session-095 memory
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-096-wave13-pr-review-findings-20260303.md` - session-096 PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-096-wave13-pr-review-findings-20260303.md` - session-096 memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - parking station append (sessions 095 + 096)
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
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000005_audit_documents_rls_hardening.sql` - hardens audit-documents bucket RLS with org-path isolation (INC-W13-BUCKET-RLS-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260303000006_audit_scores_table.sql` - creates audit_scores table (INC-W13-AUDIT-SCORES-001)
- `modules/mat/05-rca/RCA_WAVE12_POST_DEPLOYMENT_WIRING_FAILURES_20260302.md` - section 8 addendum (F-02 column gap, F-10 table name drift)
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Wave 13 Addendum B and C sections added
- `modules/mat/frontend/src/lib/hooks/useSettings.ts` - renames user_profiles to profiles in 2 from() calls (INC-W13-PROFILE-TABLE-001)
- `modules/mat/tests/wave13/schema-existence.test.ts` - adds T-W13-SCH-5 to T-W13-SCH-16 (12 new file-based tests, all GREEN; T-W13-SCH-11 regex hardened)

---

## POLC Attestation

Production code modified: modules/mat/frontend/src/lib/hooks/useSettings.ts (2-line table name fix, no logic change)
Test code modified: modules/mat/tests/wave13/schema-existence.test.ts (adds T-W13-SCH-13–T-W13-SCH-16, hardens T-W13-SCH-11 regex)
All other files: governance documentation and schema DDL (additive only, no data loss)

---

## Signature

**Scope Declared By**: foreman-v2-agent (session-095 + session-096, v6.2.0)
**Date**: 2026-03-03
**Issue**: Wave 13 Governance Failure + PR Review Findings

---

*END OF SCOPE DECLARATION*
