# Scope Declaration — Wave postbuild-fails-02 (qa-builder Session-098 + prior sessions)

**PR**: `copilot/add-wave-next-entry-supabase-rls`
**Session**: qa-builder session-098 (Task 4); foreman-v2-agent session-097 (prior Tasks 1–3)
**Date**: 2026-03-04
**Authority**: BL-027 (MERGE_GATE_PHILOSOPHY.md), SCOPE_TO_DIFF_RULE.md
**CS2 Authorization**: Issue #897 — Wave Next: Foreman to orchestrate remediation for Supabase RLS failures

---

## Files Declared

### Implementation Deliverables (schema-builder / qa-builder)
- `.agent-admin/waves/wave-postbuild-fails-01-current-tasks.md` - Wave postbuild-fails-01 task checklist
- `apps/maturion-maturity-legacy/supabase/migrations/20260304000003_fix_rls_policies_postbuild.sql` - RLS fix migration: handle_new_user() trigger + profiles/audits policies
- `modules/mat/tests/security-rls/wave-postbuild-fails-01.test.ts` - T-PBF-001 to T-PBF-004 (file-based, all GREEN)
- `modules/mat/tests/security-rls/wave-postbuild-fails-02.test.ts` - T-PBF2-001 to T-PBF2-008 (file-based, all RED — awaiting schema-builder Task 5)

### Governance Deliverables (Foreman)
- `governance/TEST_REGISTRY.json` - Registered T-PBF-001 to T-PBF-004 (CAT-14, P0, v1.3.0)
- `modules/mat/01-frs/functional-requirements.md` - Added FR-082 and FR-083 (v1.7.0)
- `modules/mat/01.5-trs/technical-requirements-specification.md` - Added TR-082 and TR-083 (v1.6.0)
- `modules/mat/03-implementation-plan/implementation-plan.md` - Added Wave postbuild-fails-01 section
- `modules/mat/03-implementation-plan/supabase-sync-audit-20260304.md` - Full Supabase RLS gap audit (5 gaps identified and fixed)
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Wave postbuild-fails-01 section added

### Governance Ceremony Artifacts (Foreman Phase 4 — Wave postbuild-fails-01)
- `SCOPE_DECLARATION.md` - This file (updated to include wave-postbuild-fails-02 Task 4 deliverables)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-097-wave-postbuild-fails-01-20260304.md` - Foreman PREHANDOVER proof for session-097
- `.agent-workspace/foreman-v2/memory/session-097-20260304.md` - Foreman session memory for session-097

### Governance Ceremony Artifacts (qa-builder Phase 4 — Wave postbuild-fails-02 Task 4)
- `.agent-admin/prehandover/prehandover_proof-wave-postbuild-fails-02-task4.md` - qa-builder PREHANDOVER proof (session-098)
- `.agent-workspace/qa-builder/memory/session-098-20260304.md` - qa-builder session memory for session-098

### Implementation Deliverables (schema-builder — Wave postbuild-fails-02 Task 5)
- `apps/maturion-maturity-legacy/supabase/migrations/20260304000004_fix_rls_remaining_tables.sql` - RLS policies for all 8 remaining tables (GAP-006 to GAP-013); 16 policies total

### Governance Ceremony Artifacts (schema-builder Phase 4 — Wave postbuild-fails-02 Task 5)
- `.agent-admin/prehandover/prehandover_proof-wave-postbuild-fails-02-task5.md` - schema-builder PREHANDOVER proof with full OVL-AM-008 wiring trace (session-098)
- `.agent-workspace/schema-builder/memory/session-098-20260304.md` - schema-builder session memory for session-098
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - TASK-PBF2-005 updated to 🟢 DONE; GAP-006 to GAP-013 marked ✅

### IAA Audit Artifacts (independent-assurance-agent)
- `.agent-admin/assurance/iaa-rejection-session-097-wave-postbuild-fails-01-20260304.md` - IAA first invocation rejection package (governance ceremony absent)
- `.agent-workspace/independent-assurance-agent/memory/session-097-20260304.md` - IAA session memory for first invocation
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station (updated by IAA during session)

### IAA Session Archive (independent-assurance-agent housekeeping)
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-114-20260303.md` - Archived IAA session (preflight maintenance)
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-120-20260303.md` - Archived IAA session (preflight maintenance)
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-121-20260303.md` - Archived IAA session (preflight maintenance)
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-122-20260303.md` - Archived IAA session (preflight maintenance)
- `.agent-workspace/independent-assurance-agent/memory/.archive/session-123-20260303.md` - Archived IAA session (preflight maintenance)

---

## Files Removed (IAA session archive rotation)

The following files were deleted by the IAA agent's preflight session archive rotation (older sessions moved to `.archive/`):
- `.agent-workspace/independent-assurance-agent/memory/session-114-20260303.md` - Moved to `.archive/`
- `.agent-workspace/independent-assurance-agent/memory/session-120-20260303.md` - Moved to `.archive/`
- `.agent-workspace/independent-assurance-agent/memory/session-121-20260303.md` - Moved to `.archive/`
- `.agent-workspace/independent-assurance-agent/memory/session-122-20260303.md` - Moved to `.archive/`
- `.agent-workspace/independent-assurance-agent/memory/session-123-20260303.md` - Moved to `.archive/`

---

## Out of Scope

No `.github/agents/*.md` files were modified (CORE-017 compliant — no agent contract changes).
No `.github/workflows/` files were modified.
