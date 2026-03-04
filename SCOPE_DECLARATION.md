# Scope Declaration — foreman-v2-agent Session-097

**PR**: `copilot/resolve-supabase-rls-failures`
**Session**: foreman-v2-agent session-097
**Date**: 2026-03-04
**Authority**: BL-027 (MERGE_GATE_PHILOSOPHY.md), SCOPE_TO_DIFF_RULE.md
**CS2 Authorization**: Issue #891 — MAT App: Supabase RLS Failures — assigned to @Copilot by @APGI-cmy

---

## Files Declared

### Implementation Deliverables (schema-builder / qa-builder)
- `.agent-admin/waves/wave-postbuild-fails-01-current-tasks.md` - Wave postbuild-fails-01 task checklist
- `apps/maturion-maturity-legacy/supabase/migrations/20260304000003_fix_rls_policies_postbuild.sql` - RLS fix migration: handle_new_user() trigger + profiles/audits policies
- `modules/mat/tests/security-rls/wave-postbuild-fails-01.test.ts` - T-PBF-001 to T-PBF-004 (file-based, all GREEN)

### Governance Deliverables (Foreman)
- `governance/TEST_REGISTRY.json` - Registered T-PBF-001 to T-PBF-004 (CAT-14, P0, v1.3.0)
- `modules/mat/01-frs/functional-requirements.md` - Added FR-082 and FR-083 (v1.7.0)
- `modules/mat/01.5-trs/technical-requirements-specification.md` - Added TR-082 and TR-083 (v1.6.0)
- `modules/mat/03-implementation-plan/implementation-plan.md` - Added Wave postbuild-fails-01 section
- `modules/mat/03-implementation-plan/supabase-sync-audit-20260304.md` - Full Supabase RLS gap audit (5 gaps identified and fixed)
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Wave postbuild-fails-01 section added

### Governance Ceremony Artifacts (Foreman Phase 4)
- `SCOPE_DECLARATION.md` - This file (scope declaration for PR, replaces session-045 declaration)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-097-wave-postbuild-fails-01-20260304.md` - Foreman PREHANDOVER proof for session-097
- `.agent-workspace/foreman-v2/memory/session-097-20260304.md` - Foreman session memory for session-097

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
