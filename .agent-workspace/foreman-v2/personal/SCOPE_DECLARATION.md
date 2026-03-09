# SCOPE_DECLARATION — wave-criteria-delete-reparse (R2)

**Session**: session-wave-criteria-delete-reparse-20260309-R2
**Wave**: wave-criteria-delete-reparse — Document Delete + Re-parse function
**Branch**: copilot/add-document-delete-reparse-function
**Cleared**: yes (R1 scope extended for R2 fix)

## Declared Files in Scope

- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` - updated; useCallback + useDeleteCriteriaDocument + useReparseCriteriaDocument
- `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` - updated; delete/reparse UI + confirmation dialogs
- `modules/mat/frontend/tests/criteria-delete-reparse.test.ts` - updated; 36 assertions (T-DEL-001 to T-DEL-015)
- `governance/overlays/OVL-CRITERIA-DELETE-REPARSE.md` - updated; §5 RLS note added
- `apps/maturion-maturity-legacy/supabase/migrations/20260309000003_criteria_delete_reparse_rls.sql` - new; 5 RLS policies
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - updated; wave-criteria-delete-reparse


- `SCOPE_DECLARATION.md` - updated; root-level merge gate input (F-1 fix)
