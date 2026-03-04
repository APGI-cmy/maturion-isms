# Scope Declaration

**Issue**: #869 — Schema mapping mismatch: frontend-to-Supabase table columns missing for profile and audit management
**Date**: 2026-03-03
**Agent**: foreman-v2-agent (session-096, v6.2.0)
**Issue**: Wave 13 Governance Failure + PR Review Findings (Addendum B+C + session-096 hardening)
**Date**: 2026-03-03
**Agent**: copilot-swe-agent (CS2-direct, co-authored: @APGI-cmy)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)
**Incident**: INC-W14-COL-MAPPING-001

---

## Purpose

This PR delivers Wave 14 Addendum A — Column Mapping Remediation (INC-W14-COL-MAPPING-001):

1. Two P0 production blockers resolved: `profiles.full_name` missing (Save Profile broken) + `audits.criteria_approved` missing (Create Audit broken)
2. `audit_scores` table carry-forward migration (INC-W13-AUDIT-SCORES-001)
3. Column-level drift regression tests T-W14-COL-001 to T-W14-COL-006 (all GREEN, file-based)
4. Governance: FAIL-ONLY-ONCE A-027, RCA §9, FRS v1.6.0, TRS v1.5.0, data-architecture.md update
This PR delivers:

1. New GitHub Actions workflow: `.github/workflows/foreman-reanchor.yml`
2. New wave task tracker template: `.agent-workspace/foreman-v2/personal/wave-current-tasks-template.md`
3. New Tier 2 knowledge document: `.agent-workspace/foreman-v2/knowledge/WAVE-CURRENT-TASKS-PROTOCOL.md`
4. Updated knowledge index: `.agent-workspace/foreman-v2/knowledge/index.md` (v1.7.0)

Plus ceremony artifacts and IAA session memory.

---

## Files Changed

**Total Files**: 22

All files in this PR are explicitly listed below (required by BL-027):

- `SCOPE_DECLARATION.md` - this file (Wave 14 Addendum A scope)
- `apps/maturion-maturity-legacy/supabase/migrations/20260304000000_profiles_add_full_name_and_preferences.sql` - adds full_name TEXT and preferences JSONB to profiles (INC-W14-PROFILES-COL-001, INC-W14-PROFILES-COL-002)
- `apps/maturion-maturity-legacy/supabase/migrations/20260304000001_audits_add_criteria_approved.sql` - adds criteria_approved BOOLEAN + missing audit columns (INC-W14-AUDITS-COL-001)
- `apps/maturion-maturity-legacy/supabase/migrations/20260304000002_audit_scores_table.sql` - creates audit_scores table with RLS (INC-W13-AUDIT-SCORES-001 carry-forward)
- `modules/mat/tests/wave14/column-mapping.test.ts` - T-W14-COL-001 to T-W14-COL-006 column drift guard tests (all GREEN)
- `modules/mat/02-architecture/data-architecture.md` - §1.1.2 updated: full_name and preferences columns added to profiles spec
- `modules/mat/01-frs/functional-requirements.md` - FR-078 to FR-081 added (v1.5.0 → v1.6.0)
- `modules/mat/01.5-trs/technical-requirements-specification.md` - TR-078 to TR-081 added, header v1.4.0 → v1.5.0 (v1.4.0 → v1.5.0)
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Wave 14 Addendum A task list + incident registry added
- `modules/mat/05-rca/RCA_WAVE12_POST_DEPLOYMENT_WIRING_FAILURES_20260302.md` - §9 RCA entry for INC-W14-COL-MAPPING-001
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - A-027 codified; header version 2.2.0 → 2.5.0; Version History section added; Section 4 attestation block updated
- `.agent-workspace/foreman-v2/knowledge/index.md` - FAIL-ONLY-ONCE.md version updated 2.4.0 → 2.5.0
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-096-wave14-addendum-a-20260303.md` - Phase 4 PREHANDOVER proof
- `.agent-workspace/foreman-v2/memory/session-096-20260303.md` - Phase 4 session memory
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - session-096 suggestions appended
- `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` - A-027 + A-028 codified by IAA (sessions 118–120)
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` - IAA knowledge index updated by IAA (sessions 118–120)
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-113-20260303.md` - IAA archived session (rotation)
- `.agent-workspace/independent-assurance-agent/memory/session-118-20260303.md` - IAA session-118 memory (first REJECTION-PACKAGE)
- `.agent-workspace/independent-assurance-agent/memory/session-119-20260303.md` - IAA session-119 memory (second REJECTION-PACKAGE)
- `.agent-workspace/independent-assurance-agent/memory/session-120-20260303.md` - IAA session-120 memory (third REJECTION-PACKAGE — BL-027 format fix required)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station appended (sessions 118–120)
**Total Files**: 24

All files in this PR are explicitly listed below (required by BL-027):

- `SCOPE_DECLARATION.md` - this file (reset for re-anchor workflow PR)
- `.github/workflows/foreman-reanchor.yml` - NEW Re-Anchor Pulse workflow
- `.agent-workspace/foreman-v2/personal/wave-current-tasks-template.md` - NEW wave task tracker template
- `.agent-workspace/foreman-v2/knowledge/WAVE-CURRENT-TASKS-PROTOCOL.md` - NEW Tier 2 knowledge doc (v1.0.0)
- `.agent-workspace/foreman-v2/knowledge/index.md` - UPDATED to v1.7.0 (adds WAVE-CURRENT-TASKS-PROTOCOL entry)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-reanchor-workflow-20260303.md` - PREHANDOVER proof (iaa_audit_token: IAA-session-123-20260303-PASS)
- `.agent-workspace/foreman-v2/memory/session-reanchor-workflow-20260303.md` - session memory for this PR
- `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` - A-027 and A-028 codified by IAA (sessions 120 and 122)
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` - version bumps by IAA (sessions 120 and 122)
- `.agent-workspace/independent-assurance-agent/memory/session-120-20260303.md` - IAA session-120 memory (REJECTION-PACKAGE, 10 findings)
- `.agent-workspace/independent-assurance-agent/memory/session-121-20260303.md` - IAA session-121 memory (REJECTION-PACKAGE, 2 findings)
- `.agent-workspace/independent-assurance-agent/memory/session-122-20260303.md` - IAA session-122 memory (REJECTION-PACKAGE, 2 findings)
- `.agent-workspace/independent-assurance-agent/memory/session-123-20260303.md` - IAA session-123 memory (ASSURANCE-TOKEN: IAA-session-123-20260303-PASS)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station append (sessions 120, 121, 122, 123)

---

## POLC Attestation

Production code modified: none (migrations only — no TypeScript/React changes)
Schema DDL: 3 new idempotent migrations (ADD COLUMN IF NOT EXISTS, CREATE TABLE IF NOT EXISTS)
Test code: 1 new test file — 6 file-based tests, all GREEN, no env vars required
Governance files: FAIL-ONLY-ONCE v2.5.0, FRS v1.6.0, TRS v1.5.0, data-architecture.md, BUILD_PROGRESS_TRACKER, RCA §9
No `.github/agents/*.md` files modified (AGCFPP-001 compliant)
Production code modified: modules/mat/frontend/src/lib/hooks/useSettings.ts (2-line table name fix, no logic change)
Test code modified: modules/mat/tests/wave13/schema-existence.test.ts (adds T-W13-SCH-13–T-W13-SCH-16, hardens T-W13-SCH-11 regex)
All other files: governance documentation and schema DDL (additive only, no data loss)

---

## Signature

**Scope Declared By**: foreman-v2-agent (session-096, v6.2.0)
**Date**: 2026-03-03
**Issue**: #869 — Schema mapping mismatch: frontend-to-Supabase table columns missing
**Scope Declared By**: foreman-v2-agent (session-095 + session-096, v6.2.0)
**Date**: 2026-03-03
**Issue**: feat: Foreman Re-Anchor Pulse — mid-wave context recovery workflow

---

*END OF SCOPE DECLARATION*
