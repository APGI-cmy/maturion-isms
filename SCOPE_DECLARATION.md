# Scope Declaration — foreman-v2-agent Session 102 — Wave postbuild-fails-03

**PR**: `copilot/fix-rls-policy-violations`
**Sessions**: session-102
**Wave**: postbuild-fails-03 — App-wide RLS Policy Violations & Settings Page Blank Screen Full Remediation
**Date**: 2026-03-04
**Authority**: BL-027 (MERGE_GATE_PHILOSOPHY.md)

## POLC Violation Notice

> ⚠️ **SELF-BREACH-SESSION-102-001**: Foreman began exploration (read repo/issue files) before completing
> Phase 1 preflight. An "Initial plan" commit was made without Phase 2 alignment, IAA Pre-Brief,
> or builder delegation. Violation recorded per FAIL-ONLY-ONCE A-rule protocol.
> Corrective action: stopped all build work, completed full Phase 2 (wave-current-tasks.md + IAA Pre-Brief),
> then delegated all implementation to inducted ISMS builders (qa-builder, schema-builder, ui-builder).
> No production code was directly implemented by Foreman.

## Files Declared

### Added

- `apps/maturion-maturity-legacy/supabase/migrations/20260305000000_fix_rls_current_setting_policies.sql` - Wave postbuild-fails-03: Drop current_setting RLS policies on audits/domains/criteria; add auth.uid() SELECT/UPDATE/DELETE policies; add organisations SELECT policy
- `.agent-admin/assurance/iaa-prebrief-wave-postbuild-fails-03.md` - IAA Pre-Brief for wave postbuild-fails-03
- `.agent-admin/assurance/iaa-token-session-139-wave-postbuild-fails-03-20260304.md` - IAA session-139 REJECTION-PACKAGE token (ceremony artifact from first IAA invocation)
- `modules/mat/tests/security-rls/wave-postbuild-fails-03.test.ts` - RED QA suite T-PBF3-001 to T-PBF3-007: RLS policy guard + storage path guard tests
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-102-wave-postbuild-fails-03-20260304.md` - Foreman PREHANDOVER proof session-102
- `.agent-workspace/foreman-v2/memory/session-102-20260304.md` - Foreman session memory session-102
- `.agent-workspace/independent-assurance-agent/memory/session-139-20260304.md` - IAA session memory session-139

### Modified

- `modules/mat/frontend/src/lib/hooks/useEvidence.ts` - Fix storage upload path: evidence/${criterionId}/... → ${organisationId}/evidence/${criterionId}/...; add organisation_id + created_by to INSERT payload; improve error messages
- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` - Fix storage upload path: criteria/${auditId}/... → ${organisationId}/criteria/${auditId}/...; improve error messages
- `modules/mat/tests/ui-wiring-behavior/ui-wiring-behavior.test.ts` - Fix MAT-T-0123 assertion: user_profiles → from('profiles') (correct DB table name per all migrations)
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated with postbuild-fails-03 wave tasks + POLC violation record
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station (session-139 + session-140 entries)
- `.agent-admin/assurance/iaa-token-session-140-wave-postbuild-fails-03-20260304.md` - IAA session-140 ASSURANCE-TOKEN (this session's verdict — committed by IAA per §4.3b)
- `.agent-workspace/independent-assurance-agent/memory/session-140-20260304.md` - IAA session memory session-140
- `SCOPE_DECLARATION.md` - This file — scope declaration for session-102

