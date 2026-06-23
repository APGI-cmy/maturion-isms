# Issue 1815 MMM Vercel Ownership Evidence

Issue: #1815
Wave: `wave-issue-1815-mmm-vercel-ownership-2026-06-18`
Date: 2026-06-18
Branch: `foreman/issue-1815-mmm-vercel-clean`
Implementation file: `.github/workflows/deploy-mmm-vercel.yml`

## Monorepo Vercel model alignment

Source authority: `MONOREPO_VERCEL_DEPLOYMENT_MODEL.md`.

MMM deployment target:

- Vercel project name: `maturion-isms-mmm`
- App path: `apps/mmm`
- Package name: `@maturion/mmm`
- Expected output directory: `apps/mmm/dist`
- Vercel project root model: repository root
- Expected project settings model: pnpm install from monorepo root, then build selected app with `pnpm --filter @maturion/mmm build`

## Secret namespace

The MMM workflow uses MMM-specific Vercel secrets:

- `MMM_VERCEL_PROJECT_ID`
- `MMM_VERCEL_ORG_ID`
- `MMM_VERCEL_TOKEN`
- `MMM_VERCEL_AUTOMATION_BYPASS_SECRET` for optional preview protection bypass

The workflow includes a guard that fails if the workflow references generic Vercel secrets for MMM deployment:

- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID`
- `VERCEL_TOKEN`
- `VERCEL_AUTOMATION_BYPASS_SECRET`

## Trigger paths

The MMM workflow is now triggered only by MMM-owned or MMM deployment-relevant paths:

- `apps/mmm/**`
- `.github/workflows/deploy-mmm-vercel.yml`
- `pnpm-lock.yaml`

The workflow no longer triggers on these broad or non-owned paths by default:

- `api/**`
- `packages/**`
- `vercel.json`
- `apps/isms-portal/**`
- `supabase/**`
- PIT or other module workflows

## Smoke routes

The preview smoke test targets MMM routes only:

- `/login`
- `/forgot-password`
- `/reset-password`
- `/onboarding`
- `/frameworks`
- `/frameworks/upload`

No ISMS or PIT routes are smoke-tested by this workflow.

## Preview protection handling

The smoke test distinguishes protected preview access from route/app failure:

- HTTP 2xx/3xx passes.
- HTTP 404 fails as MMM route or SPA fallback failure.
- HTTP 401/403 fails when `MMM_VERCEL_AUTOMATION_BYPASS_SECRET` is configured, because bypass should permit access.
- HTTP 401/403 is treated as protected-preview evidence when no MMM bypass secret is configured.

## Build and deployment model

The workflow validates the local MMM package with:

- `pnpm install --no-frozen-lockfile`
- `pnpm --filter @maturion/mmm build`

The Vercel deployment path configures `.vercel/project.json` from MMM-specific project secrets and uses `MMM_VERCEL_TOKEN` for:

- `vercel pull`
- `vercel build`
- `vercel deploy`

This keeps app-specific install/build/output behavior in the MMM Vercel project settings rather than changing root `vercel.json` for one module.

## Scope confirmation

This wave does not edit:

- `.github/workflows/deploy-isms-portal-vercel.yml`
- PIT workflows
- root `vercel.json`
- runtime app code
- Supabase migrations
- CodeQL configuration
- MMM descriptor runtime files

## Builder evidence

Changed-file intent:

- Workflow implementation: `.github/workflows/deploy-mmm-vercel.yml`
- Evidence: `.agent-admin/evidence/issue-1815-mmm-vercel-ownership-2026-06-18.md`

Tests or runtime checks expected from GitHub Actions after PR creation:

- workflow syntax parsing by GitHub Actions;
- ownership-boundary job;
- MMM package build job;
- deploy-preview job if Vercel MMM secrets are available;
- smoke route behavior with explicit protected-preview handling.
