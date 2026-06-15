# ISMS W7 Deployment, Runtime, Env, CI Hardening Runbook

| Field | Value |
|---|---|
| Wave | W7 — Deployment, Runtime, Env, CI Hardening |
| Branch | `foreman/isms-w7-deployment-runtime-hardening` |
| Status | IMPLEMENTED ON BRANCH — PR/CI PENDING |
| Date | 2026-06-11 |

---

## Deployment target

W7 selects Vercel as the initial deployment target for the ISMS portal.

Runtime app path:

```text
apps/isms-portal
```

Package manager:

```text
pnpm@9.12.0
```

Build command:

```text
pnpm run build
```

Output directory:

```text
dist
```

Install command:

```text
pnpm install --frozen-lockfile
```

Rationale: the repository is a pnpm workspace and the ISMS portal consumes workspace packages, so Vercel must use the workspace-aware package manager rather than `npm install` from the app directory.

---

## SPA fallback

`apps/isms-portal/vercel.json` configures a catch-all rewrite to `/index.html` so deep links such as `/dashboard`, `/maturity/setup`, `/subscribe/checkout`, and canonical `/modules/*` routes resolve through the Vite/React SPA router.

---

## Environment registry

W7 adds `apps/isms-portal/.env.example`.

Current W7 env posture:

- `VITE_APP_NAME` — public display/runtime label.
- `VITE_APP_ENV` — runtime environment label.
- `VITE_PUBLIC_BASE_PATH` — public base path.

No live Supabase URL/key, AI provider key, payment provider key, Edge Function URL, or audit writer secret is required by W7 because W5 remains deterministic local adapter behavior and W6 persistence is schema-registered only.

---

## Route verification

W7 adds:

```text
apps/isms-portal/scripts/verify-routes.mjs
```

The script verifies:

- public landing routes;
- subscription routes;
- auth/onboarding/dashboard routes;
- protected assessment and maturity setup routes;
- canonical marketing module routes;
- no duplicate route declarations in the W7 route verification list.

Run locally from `apps/isms-portal`:

```text
pnpm run verify:routes
```

---

## CI command alignment

W7 adds the package command:

```text
pnpm run ci:w7
```

This command runs:

```text
pnpm run lint && pnpm run test:run && pnpm run verify:routes && pnpm run build
```

---

## Rollback/redeploy strategy

If a W7 deployment fails:

1. Do not advance to W8.
2. Inspect the Vercel build log and GitHub PR checks.
3. Revert the W7 deployment config or package script change that caused the failure.
4. Redeploy the last known green merge commit.
5. Re-run route verification and the repository gates before retrying W7.

---

## Explicit non-scope

W7 does not implement:

- W8 cumulative regression/PBFAG rerun;
- live AI provider calls;
- production auth/payment;
- Supabase runtime persistence hooks;
- Edge Function invocation;
- production audit writer invocation;
- implementation handover.
