# SCOPE DECLARATION — wave-ai-criteria-creation-fix

**Wave**: wave-ai-criteria-creation-fix
**Branch**: copilot/fix-ai-criteria-creation-failure
**Date**: 2026-03-11
**Fresh overwrite**: YES (per A-029)

## Files Modified (git diff origin/main...HEAD --name-only)

| File | Type | Justification |
|------|------|---------------|
| `apps/maturion-maturity-legacy/supabase/migrations/20260311000001_criteria_add_title_column.sql` | Schema migration | PRIMARY FIX — adds `title TEXT` to criteria table; drops NOT NULL on description |
| `modules/mat/tests/wave17/wave17-criteria-title-fix.test.ts` | QA tests | RED→GREEN gate — T-W17-CP-001 through T-W17-CP-005 |
| `.agent-admin/assurance/iaa-prebrief-wave-ai-criteria-creation-fix.md` | IAA governance artifact | PRE-BRIEF — written by IAA agent |
| `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | Governance knowledge | GOVERNANCE — INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001 REMEDIATED; version bumped to 3.9.0 |
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Governance personal | GOVERNANCE — wave task register (current wave) |
| `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` | Governance personal | GOVERNANCE — this file (scope declaration for A-026/A-028) |

## Out of Scope

- No `.github/agents/` files (A-013 — N/A)
- No `.github/workflows/` files (no CI changes)
- No frontend product code (modules/mat/frontend/)
- No Edge Function code changes (code already correct, schema was missing)
