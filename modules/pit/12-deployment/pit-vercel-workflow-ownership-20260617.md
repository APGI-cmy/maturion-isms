# PIT Vercel Workflow Ownership Evidence — Issue #1816

| Field | Value |
|---|---|
| Issue | `#1816` |
| Artifact type | Deployment workflow ownership evidence |
| Workflow | `.github/workflows/deploy-pit-vercel.yml` |
| Module | PIT |
| Status | IMPLEMENTED_FOR_REVIEW — INTEGRATED_SHELL_MODE_EXPLICIT |

## 1. Purpose

This record documents the PIT-owned Vercel workflow created for the monorepo workflow ownership split.

The workflow is intentionally scoped so PIT deployment checks do not block ISMS-only or MMM-only pull requests.

## 2. Current PIT deployable surface

There is no standalone `apps/pit/package.json` on `main` at the time of this issue.

Current PIT deployable surface is therefore the integrated PIT shell hosted by the ISMS portal package:

```text
apps/isms-portal/src/pages/pit/**
apps/isms-portal/src/pages/PITInfo.tsx
```

Product authority and deployment ownership evidence live under:

```text
modules/pit/**
docs/governance/PIT_APP_DESCRIPTION.md
```

The workflow builds the `isms-portal` package because that is the current deployable host for PIT routes. It does not take ownership of the ISMS Portal workflow.

The workflow now declares this explicitly as `PIT_DEPLOYMENT_MODE=integrated-shell` and includes a boundary guard that fails if `apps/pit/package.json` appears before the workflow is migrated to standalone PIT app mode.

## 3. Vercel project target

| Item | Value |
|---|---|
| Vercel production target | `https://maturion-pit.vercel.app` |
| Workflow environment | `pit-preview`, `pit-production` |
| Deployment mode | `integrated-shell` |
| Build package | `isms-portal` |
| Build command | `pnpm --filter isms-portal build` |
| Route verification | `pnpm --filter isms-portal verify:routes` |
| Build output | `apps/isms-portal/dist/` |

## 4. Secret namespace

The workflow uses only PIT-specific Vercel secrets:

```text
PIT_VERCEL_PROJECT_ID
PIT_VERCEL_ORG_ID
PIT_VERCEL_TOKEN
```

Optional preview-protection bypass:

```text
PIT_VERCEL_AUTOMATION_BYPASS_SECRET
```

No generic ambiguous Vercel project secrets are used.

## 5. Trigger paths

The workflow triggers only on PIT-owned or PIT-specific coordination paths:

```text
apps/isms-portal/src/pages/pit/**
apps/isms-portal/src/pages/PITInfo.tsx
modules/pit/**
docs/governance/PIT_APP_DESCRIPTION.md
modules/pit/12-deployment/**
.github/workflows/deploy-pit-vercel.yml
MONOREPO_VERCEL_WORKFLOW_OWNERSHIP_SPLIT.md
```

The boundary guard rejects broad `apps/isms-portal/**`, `api/**`, and `packages/**` workflow triggers unless a future PR explicitly introduces and documents a PIT-owned boundary.

## 6. Smoke routes

The workflow smoke-tests PIT routes only:

```text
/marketing/project-implementation
/pit
/pit/tracker
/projects
/projects/new
```

The workflow does not smoke-test ISMS-only or MMM routes.

## 7. Explicit non-owned paths

The PIT workflow does not own:

```text
apps/mmm/**
apps/isms-portal/** outside the PIT pages listed above
api/** unless a later PR explicitly introduces a PIT-owned API boundary
packages/** unless a later PR explicitly introduces a PIT-owned package boundary
.github/workflows/deploy-isms-portal-vercel.yml
.github/workflows/deploy-mmm-vercel.yml
```

## 8. Acceptance mapping

| Issue #1816 expectation | Evidence |
|---|---|
| PIT workflow owns only PIT deployment surface | Trigger paths are PIT-specific only. |
| PIT-specific secret namespace | Uses `PIT_VERCEL_PROJECT_ID`, `PIT_VERCEL_ORG_ID`, `PIT_VERCEL_TOKEN`. |
| PIT-only smoke routes | Smoke routes are PIT route paths only. |
| Cannot block ISMS-only or MMM-only PRs | Path filters exclude `apps/mmm/**` and broad `apps/isms-portal/**`. |
| Shared API/packages not auto-deployed | `api/**` and `packages/**` are not workflow triggers. |
| ISMS/MMM workflows untouched | This issue changes only the PIT workflow and PIT evidence record. |
| Integrated-shell posture explicit | Workflow comments, env vars, and boundary guard identify integrated-shell mode. |

## 9. Residual note

When PIT becomes a standalone app with its own package, this workflow should be updated from integrated-shell mode to standalone mode:

```text
app path: apps/pit/**
build command: pnpm --filter <pit-package-name> build
output directory: apps/pit/dist
```

Until then, the workflow deploys the current integrated PIT shell to the PIT Vercel project without broadening ISMS or MMM workflow ownership.
