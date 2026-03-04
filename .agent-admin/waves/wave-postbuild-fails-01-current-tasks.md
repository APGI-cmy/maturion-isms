# Wave postbuild-fails-01 — Current Tasks
# Issue: #891 — MAT App: Supabase RLS Failures
# Date: 2026-03-04
# Authority: CS2 (Johan Ras / @APGI-cmy)

**Wave**: postbuild-fails-01 — MAT App Supabase RLS Fix
**Failures**: F-001 (profiles RLS INSERT/UPDATE), F-002 (audits RLS INSERT)
**Root Cause**: Missing `handle_new_user()` trigger + missing RLS INSERT/UPDATE policies

## Task List

| ID | Agent | Task | Status |
|----|-------|------|--------|
| TASK-PBF-01-001 | schema-builder | Supabase sync audit → `supabase-sync-audit-20260304.md` | ✅ DONE |
| TASK-PBF-01-002 | schema-builder | RLS fix migration `20260304000003_fix_rls_policies_postbuild.sql` | ✅ DONE |
| TASK-PBF-01-003 | qa-builder | QA tests T-PBF-001 to T-PBF-004 → `wave-postbuild-fails-01.test.ts` | ✅ DONE |
| TASK-PBF-01-004 | foreman | Governance updates (BUILD_PROGRESS_TRACKER, FRS, TRS, TEST_REGISTRY, impl-plan) | ✅ DONE |

## Acceptance Criteria

- [x] Migration `20260304000003_fix_rls_policies_postbuild.sql` is idempotent and covers all gaps
- [x] `handle_new_user()` trigger function created with SECURITY DEFINER
- [x] `profiles` SELECT, INSERT, UPDATE policies created
- [x] `audits` INSERT policy created
- [x] Tests T-PBF-001 to T-PBF-004 all GREEN in CI
- [x] BUILD_PROGRESS_TRACKER.md updated with Wave postbuild-fails-01
- [x] FRS updated with FR-082, FR-083
- [x] TRS updated with TR-082, TR-083
- [x] TEST_REGISTRY.json updated with T-PBF-001 to T-PBF-004

## State Machine

| Date | Status | Note |
|------|--------|------|
| 2026-03-04 | P0 GAPS IDENTIFIED | F-001 and F-002 confirmed from production testing |
| 2026-03-04 | IN PROGRESS | Migration + tests + governance files being created |
| 2026-03-04 | COMPLETE | All tasks done, CI GREEN |
