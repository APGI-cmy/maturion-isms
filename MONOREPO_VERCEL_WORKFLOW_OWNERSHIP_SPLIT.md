# Monorepo Vercel Workflow Ownership Split

| Field | Value |
|---|---|
| Repository | `APGI-cmy/maturion-isms` |
| Artifact Type | Deployment workflow ownership model |
| Scope | ISMS, MMM and PIT Vercel workflow separation |
| Status | Adopted coordination artifact for module agents |
| Date | 2026-06-16 |

---

## 1. Purpose

This artifact prevents deployment-workflow conflicts between module agents working in the same monorepo.

The repository contains multiple Vercel-deployed apps. A single broad workflow that triggers on shared paths such as `api/**` can accidentally make an unrelated module PR wait on another app's deployment smoke tests. PR #1809 exposed this problem: an API hygiene change triggered the MMM deployment workflow, and the MMM preview smoke test failed with HTTP 401 because preview protection blocked the smoke bot, even though build, typecheck and Vercel project status were green.

---

## 2. Core ownership rule

Each deployable app must own its own Vercel workflow, project, route smoke tests and path filters.

No module agent may broaden another module's deploy workflow without explicit coordination.

---

## 3. Workflow ownership matrix

| App | Owning workflow | Owning agent/module | Trigger paths | Must not own |
|---|---|---|---|---|
| ISMS Portal | `.github/workflows/deploy-isms-portal-vercel.yml` | ISMS agent | `apps/isms-portal/**`, workflow file, ISMS-specific deployment docs | `apps/mmm/**`, PIT app paths, broad `api/**` unless an ISMS-owned API boundary is introduced |
| MMM Frontend | `.github/workflows/deploy-mmm-vercel.yml` | MMM agent | `apps/mmm/**`, MMM workflow file, MMM-specific shared packages if needed | `apps/isms-portal/**`, PIT app paths, ISMS smoke routes |
| PIT App | `.github/workflows/deploy-pit-vercel.yml` | PIT agent | PIT app path, PIT workflow file, PIT-specific shared packages if needed | `apps/isms-portal/**`, `apps/mmm/**`, ISMS/MMM smoke routes |
| Shared API / packages | Separate validation workflow | Foreman or shared-platform agent | `api/**`, `packages/**` as specifically scoped | Automatic app preview deployment unless that app also changed |

---

## 4. ISMS workflow contract

The ISMS portal workflow must:

- build only `apps/isms-portal`;
- use pnpm from the monorepo root;
- use the package filter `isms-portal`;
- emit artifacts from `apps/isms-portal/dist`;
- smoke test ISMS routes only;
- treat HTTP 404 and 5xx as failures;
- treat HTTP 401/403 on protected routes as protection/auth posture unless the test explicitly requires automation bypass;
- never run MMM or PIT smoke tests.

Recommended commands:

| Setting | Value |
|---|---|
| Install | `corepack enable && pnpm install --no-frozen-lockfile` |
| Build | `pnpm --filter isms-portal build` |
| Route verify | `pnpm --filter isms-portal verify:routes` |
| Output | `apps/isms-portal/dist` |

---

## 5. MMM workflow contract

The MMM agent owns the existing MMM workflow and should update it separately.

MMM should remove broad ownership of unrelated app paths and should not require MMM preview smoke tests for PRs that only touch ISMS or PIT app code.

If MMM still needs shared `api/**` validation, that validation should be a shared API check, not an automatic MMM preview deployment unless MMM frontend or MMM-owned API boundaries changed.

---

## 6. PIT workflow contract

The PIT agent should create or update a PIT-specific workflow using the same model:

- PIT-only trigger paths;
- PIT project ID/secret namespace;
- PIT build command;
- PIT output directory;
- PIT-only smoke routes;
- no ISMS or MMM route checks.

---

## 7. Secret and variable namespace policy

App workflows must not share ambiguous project secrets such as `VERCEL_PROJECT_ID` when multiple Vercel projects exist.

Use app-specific names:

| App | Required secret / variable names |
|---|---|
| ISMS Portal | `ISMS_VERCEL_PROJECT_ID`, `ISMS_VERCEL_ORG_ID`, `ISMS_VERCEL_TOKEN`, optional `ISMS_VERCEL_AUTOMATION_BYPASS_SECRET` |
| MMM | `MMM_VERCEL_PROJECT_ID`, `MMM_VERCEL_ORG_ID`, `MMM_VERCEL_TOKEN`, optional `MMM_VERCEL_AUTOMATION_BYPASS_SECRET` |
| PIT | `PIT_VERCEL_PROJECT_ID`, `PIT_VERCEL_ORG_ID`, `PIT_VERCEL_TOKEN`, optional `PIT_VERCEL_AUTOMATION_BYPASS_SECRET` |

If an app workflow temporarily uses legacy generic secrets, that must be documented and replaced by app-specific secrets in a follow-up cleanup.

---

## 8. Preview protection policy

Preview smoke tests must distinguish between routing failures and preview protection.

| HTTP result | Meaning | Gate handling |
|---|---|---|
| 2xx/3xx | App reached | Pass |
| 404 | SPA fallback or route problem | Fail |
| 5xx | Deployment/runtime problem | Fail |
| 401/403 on protected routes | Auth/protection posture | Do not fail unless the test is specifically validating bypass access |
| 401/403 on public routes | App/protection misconfiguration | Fail unless preview protection is intentionally enabled and bypass is missing |

This policy prevents protected preview environments from falsely failing app deployment when routing is healthy.

---

## 9. Shared API change policy

A PR touching only `api/**` should run API validation and type checks.

It must not automatically require every app preview deployment unless:

- the changed API is explicitly owned by that app; or
- the PR also changes that app's frontend; or
- the PR declares a cross-app integration test requirement.

---

## 10. Coordination instructions for module agents

Before creating or editing a Vercel workflow, each agent must state:

1. the app path it owns;
2. the Vercel project it targets;
3. the secret namespace it uses;
4. the trigger paths it owns;
5. the routes it smoke tests;
6. the paths it explicitly does not own.

Agents must not update another module's workflow unless the owner explicitly asks them to do so.
