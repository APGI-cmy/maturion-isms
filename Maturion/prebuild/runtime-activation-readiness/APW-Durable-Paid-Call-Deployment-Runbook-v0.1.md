# APW Durable Paid-Call Deployment Runbook v0.1

**Artifact ID**: APW-DURABLE-PAID-CALL-DEPLOYMENT-001  
**Version**: 0.1.0  
**Status**: REPOSITORY READY — DEPLOYMENT NOT AUTHORISED  
**Authority**: CS2 — Johan Ras  
**PR**: #1977  
**Last Updated**: 2026-07-28

## 1. Boundary

This runbook records the future deployment sequence only. PR #1977 does not authorise applying the migration, changing any environment variable, deploying a branch, or enabling paid calls.

The required live state remains:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=true
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

## 2. Unapplied migration

```text
supabase/migrations/20260728080000_apw_durable_paid_call_budget.sql
```

The migration creates private budget, client-bucket and reservation tables plus three atomic service-role-only RPCs:

- `public.apw_reserve_paid_call`;
- `public.apw_reconcile_paid_call_success`;
- `public.apw_reconcile_paid_call_failure`.

`anon` and `authenticated` receive no table or function privileges.

## 3. Required server-side configuration

The following values are required on the server-side MAT AI Gateway before any paid-call activation can be considered:

```text
SUPABASE_URL=<approved project URL>
SUPABASE_SERVICE_ROLE_KEY=<server-side secret>
MATURION_PUBLIC_CHAT_CLIENT_HASH_SECRET=<high-entropy server-side secret>
MATURION_PUBLIC_CHAT_DAILY_CALL_LIMIT=<approved integer>
MATURION_PUBLIC_CHAT_DAILY_TOKEN_LIMIT=<approved integer>
MATURION_PUBLIC_CHAT_CLIENT_DAILY_CALL_LIMIT=<approved integer>
MATURION_PUBLIC_CHAT_MAX_OUTPUT_TOKENS=300
MATURION_PUBLIC_CHAT_MODEL=gpt-4o-mini
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

The hash secret must not be reused for authentication, encryption or any other application purpose.

## 4. Future governed deployment sequence

1. Obtain a separate explicit CS2 deployment authorisation.
2. Verify the target Supabase and Render service identities.
3. Apply the migration through the governed Supabase migration lane.
4. Read-only verify tables, RLS, grants and function ownership.
5. Add the new server-side environment values while keeping paid calls `false`.
6. Redeploy the gateway and verify `/health`.
7. Run public and restricted zero-token smoke tests.
8. Prove the runtime returns `durable_budget_unavailable` when the store or hash-secret configuration is intentionally withheld in a controlled non-production test.
9. Verify route-safe logs contain only categorical and numeric budget metadata.
10. Obtain independent deployment evidence review.
11. Return to CS2 for a separate bounded paid-call observation-window decision.

## 5. Mandatory preactivation gates

```text
PROVIDER_BUDGET_EVIDENCE_VERIFIED=false
PAID_CALL_OBSERVATION_WINDOW_APPROVED=false
```

Neither gate may be changed within PR #1977.

## 6. Rollback

The immediate rollback remains:

```text
MATURION_PUBLIC_CHAT_PAID_CALLS_ENABLED=false
```

If the gateway itself is unstable, also restore:

```text
APW_SPECIALIST_PUBLIC_INTEGRATION_ENABLED=false
```

Then redeploy, verify health, prove static containment and inspect safe zero-token telemetry.

## 7. Current disposition

```text
IMPLEMENTATION_REPOSITORY_READY — MIGRATION_UNAPPLIED — DEPLOYMENT_NO_GO — PAID_CALLS_NO_GO
```
