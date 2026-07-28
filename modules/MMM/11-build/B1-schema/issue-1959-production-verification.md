# Issue #1959 — MMM RLS Private Helper Policy Parity Production Verification

**Date:** 2026-07-28  
**Supabase project:** `ujucvyyspfxlxlfdamda`  
**Issue:** #1959  
**Status:** PRODUCTION CORRECTION APPLIED; SOURCE MERGE PENDING

## Finding

The deployed MMM database already contained the approved hardened identity helpers:

- `app_private.mmm_current_user_org_id()`
- `app_private.mmm_current_user_role()`

Authenticated and service-role execution existed on the private helpers, while direct public helper RPC execution remained revoked.

Seven deployed policies had drifted back to public or unqualified helper references. This caused authenticated RLS evaluation to fail despite the private helper grants being correct.

## Production correction

Applied the idempotent migration equivalent to:

`supabase/migrations/20260724000001_mmm_rls_private_helper_policy_reconciliation.sql`

The migration:

1. finds policy expressions containing public or unqualified MMM identity helpers;
2. rewrites them to the approved `app_private` helpers;
3. keeps public helper execution revoked;
4. preserves authenticated/service-role execution on private helpers;
5. does not disable RLS or grant browser access to service-role capability.

## Verification results

| Check | Before | After | Result |
|---|---:|---:|---|
| Stale public/unqualified helper policy references | 7 | 0 | PASS |
| Authenticated execute: private organisation helper | allowed | allowed | PASS |
| Authenticated execute: private role helper | allowed | allowed | PASS |
| Anon execute: private helpers | denied | denied | PASS |
| Authenticated execute: public helpers | denied | denied | PASS |
| Anon execute: public helpers | denied | denied | PASS |
| RLS disabled by correction | no | no | PASS |
| Service-role capability exposed to browser role | no | no | PASS |

## Security disposition

The correct fix is policy parity, not restoration of public helper RPC access.

Issue #1959 may be closed after this source migration and its executable contract merge to `main`, followed by a final parity query confirming zero stale references.