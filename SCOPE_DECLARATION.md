# Scope Declaration — reconcile-combined-wave-tests-20260427

**Wave**: reconcile-combined-wave-tests-20260427
**Issue**: maturion-isms#1476
**Branch**: copilot/reconcile-combined-wave-tests
**Date**: 2026-04-27
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Reconcile stale MAT-era Combined Wave test expectations in `schema-existence.test.ts`:
1. Fix T-W13-SCH-1–4 to use `process.env` instead of `import.meta.env` (env vars are not
   mapped into import.meta.env in Vitest unless explicitly declared in vitest.config.ts test.env).
2. Exempt `ai_knowledge` from the MAT migration drift guard in T-W13-SCH-11 (it is an
   AIMC/MMM-managed table covered by MMM supabase migrations, not MAT legacy migrations).

## Changed Files

- `modules/mat/tests/wave13/schema-existence.test.ts`
- `SCOPE_DECLARATION.md`

## Out of Scope

- Any governance workspace artifacts (.agent-workspace/, .agent-admin/)
- Any agent contract files (.github/agents/*.md)
- Any files not listed above
