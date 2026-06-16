# ISMS P1.1 Deployment Hygiene Cleanup

Status: IMPLEMENTED ON BRANCH - PR/CI PENDING
Date: 2026-06-15

## Scope

P1.1 follows the P1 external deployment proof and addresses low-risk deployment hygiene findings.

This slice does not add product runtime features, schema changes, route changes, provider integrations, production auth/payment changes, runtime persistence hooks, or audit writer invocation.

## Confirmed stale PR cleanup

PR #1795 is closed and unmerged. It was a stale duplicate W3 PR after W3 had already landed through PR #1783 and later waves.

## Changes

- Bound the root Node engine to `>=20 <23` to avoid broad future Node major auto-upgrade behaviour in Vercel builds.
- Kept `packageManager` as `pnpm@9.12.0`; the repository lockfile is `lockfileVersion: '9.0'`, which is compatible with the existing package-manager declaration.
- Added typed Supabase bearer verification wrappers in non-ISMS API files so Vercel TypeScript builds do not depend on the generated Supabase auth client exposing `getUser` directly.

## Files changed

- `package.json`
- `api/ai/feedback/pending.ts`
- `api/ai/feedback/approve.ts`
- `modules/isms/12-deployment/p1-1-deployment-hygiene-cleanup-20260615.md`

## Follow-up items still outside P1.1

- bundle-size optimisation;
- any deeper non-ISMS AIMC/API hardening beyond the TypeScript build-log cleanup;
- production auth/payment hardening;
- live AI provider integration;
- runtime persistence hooks;
- audit writer invocation.
