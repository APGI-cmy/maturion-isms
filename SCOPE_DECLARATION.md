# SCOPE DECLARATION

**Wave**: Wave Post-FCWT Production Failures (sort_order Migration + Edge Function Gap + BPT Update)
**Branch**: copilot/sort-order-migration-update
**Session**: session-postfcwt-prodfails-20260306
**Date**: 2026-03-06
**Authority**: CS2 (Johan Ras / @APGI-cmy)

## Files Changed in This PR

- `.agent-admin/assurance/iaa-prebrief-wave-postfcwt-prodfails.md` - IAA Pre-Brief for this wave (committed by IAA)
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` - v2.7.0→v2.8.0: INC-POST-FCWT-SORT-ORDER-001, INC-POST-FCWT-EDGE-FN-001, A-032 candidate, S-021-S-022
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Wave Post-FCWT Production Failures task list
- `apps/maturion-maturity-legacy/supabase/migrations/20260306000000_domains_sort_order.sql` - TASK-F1-A: ADD COLUMN sort_order to domains, mini_performance_standards, criteria
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - TASK-F1-C/F2-C: v1.4→v1.5 Post-FCWT production failures section + stage + next steps
- `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` - TASK-F2-A: inner try/catch for AI parsing, warning element
- `modules/mat/tests/postfcwt/ai-parsing-graceful.test.ts` - TASK-F2-B: T-PFCWT-004, T-PFCWT-005
- `modules/mat/tests/postfcwt/sort-order-columns.test.ts` - TASK-F1-B: T-PFCWT-001, T-PFCWT-002, T-PFCWT-003
