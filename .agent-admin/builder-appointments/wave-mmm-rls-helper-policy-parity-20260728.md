# Builder Appointment — MMM RLS Helper Policy Parity

**Issue:** #1959  
**Wave:** `mmm-rls-helper-policy-parity`  
**Appointed role:** Supabase Security Builder  
**Date:** 2026-07-28

## Upstream authority

- IAA pre-brief commit: `b8b4bc59efea48299a6e03f0ed8bb5b060d5d054`
- Existing hardening migration: `supabase/migrations/20260530000003_mmm_function_search_path_hardening.sql`

## Authorised work

1. Add executable QA proving the private-helper security invariant and policy reconciliation migration.
2. Commit the idempotent corrective migration.
3. Record production verification evidence for the MMM Supabase project.
4. Update no product runtime or unrelated module.

## Authorised paths

- `supabase/migrations/20260724000001_mmm_rls_private_helper_policy_reconciliation.sql`
- `modules/MMM/tests/B1-schema/rls-private-helper-policy-reconciliation.test.ts`
- `modules/MMM/tests/vitest.rls-private-helper-policy.config.ts`
- `.github/workflows/mmm-rls-private-helper-policy.yml`
- `modules/MMM/11-build/B1-schema/issue-1959-production-verification.md`
- PR-scoped governance evidence

## Prohibitions

- No public helper RPC restoration.
- No RLS disablement.
- No broad authenticated table-write grant.
- No service-role browser exposure.
- No approval workflow or descriptor changes.
- No fabricated deployment evidence.

## Handover requirements

Report exact test command, current-head gate status, production policy-reference count, helper privilege matrix and explicit non-scope confirmation.