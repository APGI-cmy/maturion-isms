# ISMS W7 Build Evidence — Deployment, Runtime, Env, CI Hardening

| Field | Value |
|---|---|
| Wave | W7 — Deployment, Runtime, Env, CI Hardening |
| Branch | `foreman/isms-w7-deployment-runtime-hardening` |
| Status | IMPLEMENTED ON BRANCH — PR/CI PENDING |
| Date | 2026-06-11 |

---

## Scope delivered

Runtime/deployment scope:

- `apps/isms-portal/vercel.json`
- `apps/isms-portal/.env.example`
- `apps/isms-portal/scripts/verify-routes.mjs`
- `apps/isms-portal/package.json`
- `modules/isms/12-deployment/w7-deployment-runtime-runbook.md`

Governance scope:

- `.agent-admin/builder-appointments/isms-stage11-w7-deployment-runtime-hardening-builder-appointment.md`
- `modules/isms/11-build/w7-deployment-runtime-hardening-evidence.md`

---

## Deployment target evidence

W7 selects Vercel for the ISMS portal deployment target and adds `apps/isms-portal/vercel.json`.

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

---

## SPA fallback evidence

`apps/isms-portal/vercel.json` rewrites all paths to `/index.html` to support React Router deep links.

This protects routes such as:

- `/dashboard`
- `/maturity/setup`
- `/subscribe/checkout`
- `/modules/maturity-roadmap`

---

## Env evidence

W7 adds `apps/isms-portal/.env.example`.

No live Supabase, AI provider, payment provider, Edge Function, or audit writer env is required by W7 because W5 remains deterministic and W6 remains schema-registered only.

---

## Route verification evidence

W7 adds `apps/isms-portal/scripts/verify-routes.mjs` and package script:

```text
npm run verify:routes
```

The script verifies public, protected, subscription and canonical marketing route coverage.

---

## CI command evidence

W7 adds package script:

```text
npm run ci:w7
```

This runs:

```text
npm run lint && npm run test:run && npm run verify:routes && npm run build
```

---

## Rollback/redeploy evidence

Rollback/redeploy instructions are documented in:

```text
modules/isms/12-deployment/w7-deployment-runtime-runbook.md
```

---

## Known partials

- No live Vercel deployment result is claimed by this branch until PR/deployment status is inspected.
- No W8 cumulative regression/PBFAG rerun is introduced.
- No production auth/payment, live AI provider, Supabase runtime persistence hook, Edge Function invocation, or production audit writer invocation is introduced.

---

## Evidence still required before merge

- CI status inspection.
- Review conversation disposition.
- Deployment/preview status if available.
- Confirmation that W8 remains unappointed and unimplemented.
