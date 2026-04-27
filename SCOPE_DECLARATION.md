# Scope Declaration — track-migration-connectivity-failure-20260427

**Wave**: track-migration-connectivity-failure-20260427
**Issue**: maturion-isms#1472
**Branch**: copilot/track-migration-connectivity-failure
**Date**: 2026-04-27
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Two MMM deployment-validation blockers (umbrella issue #1472):

- **Child A (#1474)** — Replace psql-based migration steps in `deploy-mmm-supabase-migrations.yml`
  with Supabase Management API calls (HTTPS/443). Adds reusable Python helper scripts.
- **Child B (#1476)** — Reconcile stale MAT-era CI gate tests that hardcode the non-existent
  `deploy-mat-vercel.yml` workflow; update to reference MMM deployment workflows per §7.4.

## Changed Files

- `.github/scripts/apply-migrations-via-api.py`
- `.github/scripts/verify-schema-via-api.py`
- `.github/workflows/deploy-mmm-supabase-migrations.yml`
- `modules/mat/tests/wave13/ci-gates.test.ts`
- `modules/mat/tests/wave13/wave13-gate.test.ts`
- `modules/mat/tests/wave19/wave19-criteria-parsing.test.ts`
- `SCOPE_DECLARATION.md`

## Out of Scope

- Any governance workspace artifacts (.agent-workspace/, .agent-admin/)
- Any agent contract files (.github/agents/*.md)
- Any files not listed above
