# IAA Pre-Brief — MMM RLS Helper Policy Parity

**Issue:** #1959  
**Wave:** `mmm-rls-helper-policy-parity`  
**Date:** 2026-07-28  
**CS2 Authority:** Johan Ras

## Objective

Verify and correct deployed MMM RLS policy drift without restoring public RPC access to identity helpers or weakening tenant isolation.

## Required evidence

1. Preserve `app_private.mmm_current_user_org_id()` and `app_private.mmm_current_user_role()` as the policy helpers.
2. Keep direct public helper execution revoked from PUBLIC, anon and authenticated.
3. Identify every stale policy expression that calls public or unqualified helpers.
4. Provide an idempotent migration that rewrites stale policies to the private helpers.
5. Prove authenticated may execute private helpers, anon may not, and public helper execution remains denied.
6. Prove no policy references remain stale after deployment.
7. Do not introduce service-role browser access, RLS disablement or broad grants.
8. Record production query evidence and exact project boundary.

## Handover rule

IAA may recommend merge only when the executable contract is GREEN, the migration is idempotent, production verification records zero stale references, all current-head gates pass and the change remains limited to #1959.