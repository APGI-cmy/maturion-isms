# MMM Vercel Workflow Ownership Evidence — Issue #1815

| Field | Value |
|---|---|
| Issue | `#1815` |
| Artifact type | Deployment workflow ownership evidence |
| Workflow | `.github/workflows/deploy-mmm-vercel.yml` |
| Module | MMM |
| Status | IMPLEMENTED_FOR_REVIEW |

## 1. Purpose

This record documents the MMM-owned Vercel workflow alignment performed under the monorepo workflow ownership split.

The workflow is intentionally scoped so MMM deployment checks do not block ISMS-only, PIT-only, or unrelated shared hygiene pull requests.

## 2. MMM deployable surface

Current MMM deployable surface:

```text
apps/mmm/**
```

MMM deployment ownership evidence lives under:

```text
modules/MMM/12-deployment/**
```

The workflow builds only the MMM frontend package.

## 3. Vercel project target

| Item | Value |
|---|---|
| Vercel production target | `https://maturion-isms-mmm.vercel.app` |
| Workflow environment | `mmm-preview`, `mmm-production` |
| Build package | `@maturion/mmm` |
| Build command | `pnpm --filter @maturion/mmm build` |
| Typecheck command | `pnpm --filter @maturion/mmm exec tsc --noEmit` |
| Build output | `apps/mmm/dist/` |

## 4. Secret namespace

The workflow uses only MMM-specific Vercel deployment secrets:

```text
MMM_VERCEL_PROJECT_ID
MMM_VERCEL_ORG_ID
MMM_VERCEL_TOKEN
```

Optional preview-protection bypass:

```text
MMM_VERCEL_AUTOMATION_BYPASS_SECRET
```

No generic ambiguous `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`, `VERCEL_TOKEN`, or `VERCEL_AUTOMATION_BYPASS_SECRET` deployment secrets are used.

## 5. Trigger paths

The workflow triggers only on MMM-owned or MMM coordination paths:

```text
apps/mmm/**
modules/MMM/12-deployment/**
.github/workflows/deploy-mmm-vercel.yml
MONOREPO_VERCEL_WORKFLOW_OWNERSHIP_SPLIT.md
MONOREPO_VERCEL_DEPLOYMENT_MODEL.md
```

## 6. Smoke routes

The workflow smoke-tests MMM-owned frontend routes only:

```text
/
/login
/forgot-password
/reset-password
/onboarding
/frameworks
/frameworks/upload
```

The workflow does not smoke-test ISMS-only or PIT routes.

## 7. Explicit non-owned paths

The MMM workflow does not own:

```text
apps/isms-portal/**
modules/pit/**
apps/pit/**
api/** unless a later PR explicitly introduces an MMM-owned API boundary
packages/** unless a later PR explicitly introduces an MMM-owned package boundary
.github/workflows/deploy-isms-portal-vercel.yml
.github/workflows/deploy-pit-vercel.yml
```

## 8. Preview protection behavior

The MMM smoke test distinguishes route/runtime failures from preview-protection posture:

- `2xx/3xx` passes;
- `404` fails;
- `5xx` fails;
- `401/403` passes only as preview-protection posture when no MMM preview bypass secret is configured;
- `401/403` fails when bypass is configured and the app should be reachable through the bypass;
- `000` or unexpected statuses fail.

## 9. Acceptance mapping

| Issue #1815 expectation | Evidence |
|---|---|
| MMM workflow owns only MMM deployment surface | Trigger paths are MMM-specific only. |
| MMM-specific secret namespace | Uses `MMM_VERCEL_PROJECT_ID`, `MMM_VERCEL_ORG_ID`, `MMM_VERCEL_TOKEN`. |
| MMM-only smoke routes | Smoke routes are MMM frontend routes only. |
| Preview protection handled deliberately | 401/403 is separated from route/runtime failure depending on bypass posture. |
| Broad `api/**` not automatic deploy trigger | `api/**` removed from path filters. |
| Broad `packages/**` not automatic deploy trigger | broad `packages/**` triggers omitted. |
| ISMS/PIT workflows untouched | This issue changes only the MMM workflow and MMM evidence record. |

## 10. Residual note

If MMM later declares an explicit MMM-owned API or package integration boundary, the workflow may be extended through a governed follow-up PR. That PR must document the boundary and update this evidence rather than reintroducing broad shared-path ownership silently.
