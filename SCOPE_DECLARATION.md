# Scope Declaration — foreman-v2-agent Session 140 — Wave 14 Batch A

**PR**: `copilot/implement-onboarding-and-assignment`
**Sessions**: session-140
**Wave**: Wave 14 Batch A — Onboarding, Assignment, Exclude Cascade, and Org-Isolation Foundations
**Issue**: #909
**Date**: 2026-03-04
**Authority**: BL-027 (MERGE_GATE_PHILOSOPHY.md)

## POLC Violation Notice

> ⚠️ **SELF-BREACH-SESSION-140-001**: Implementation was delivered before IAA Pre-Brief was
> confirmed for Batch A implementation tasks. Pre-Brief generated retroactively. All IAA P0
> watch points resolved (WP-001: trigger user_id bug; WP-002: INSERT policy; WP-003: INSERT+UPDATE
> policies on assignment tables; WP-006/007: verified non-issues). IAA assurance token obtained.
> Violation recorded per FAIL-ONLY-ONCE A-rule protocol.

## Files Declared

### Added

- `apps/maturion-maturity-legacy/supabase/migrations/20260305000000_wave14_onboarding_support.sql` - GAP-W01/FR-089: onboarding_completions table + trigger (auth.uid fix) + SELECT/INSERT RLS
- `apps/maturion-maturity-legacy/supabase/migrations/20260305000001_wave14_invitations_assignments.sql` - GAP-W02/W04/W14/FR-090/092/102: audit_invitations, domain/mps/criteria_assignments, responsibility_cascade VIEW, SELECT+INSERT+UPDATE RLS
- `apps/maturion-maturity-legacy/supabase/migrations/20260305000002_wave14_excluded_columns.sql` - GAP-W03/FR-091: excluded BOOLEAN on domains/MPS/criteria, cascade trigger + create_report_gate VIEW
- `apps/maturion-maturity-legacy/supabase/migrations/20260305000008_wave14_new_tables_rls.sql` - GAP-W15: org-isolation RLS consolidation for all Wave 14 tables (IF EXISTS guards for Batch B dependencies)
- `.agent-admin/assurance/iaa-prebrief-wave14-batchA.md` - IAA Pre-Brief for Wave 14 Batch A (retroactive, 5 P0 watch points identified)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-140-wave14-batchA-20260304.md` - Foreman PREHANDOVER session-140
- `.agent-workspace/foreman-v2/memory/session-140-wave14-batchA-20260304.md` - Foreman session memory session-140

### Modified

- `modules/mat/frontend/src/App.tsx` - GAP-W01/FR-089: OnboardingGuard data-testid="onboarding-guard" hidden sentinel for test automation
- `modules/mat/frontend/src/pages/OnboardingPage.tsx` - GAP-W01/FR-089: data-testid="onboarding-step-1" and data-testid="onboarding-step-2" on wizard forms
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated with Wave 14 Batch A tasks + POLC violation record (SELF-BREACH-SESSION-140-001)
- `SCOPE_DECLARATION.md` - This file — scope declaration for session-140 Wave 14 Batch A
