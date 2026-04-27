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
2. Extend migration scan in T-W13-SCH-11 to include `packages/ai-centre/supabase/migrations/`
   so the drift guard enforces that `ai_knowledge` is present in some migration source.

## Changed Files

- `modules/mat/tests/wave13/schema-existence.test.ts`
- `SCOPE_DECLARATION.md`

## Out of Scope

- Any agent contract files (.github/agents/*.md)
- Any application code or schema migrations
- Any files not listed above
