# Builder Appointment - Issue 1815 MMM Vercel Ownership

Wave: `wave-issue-1815-mmm-vercel-ownership-2026-06-18`
Date: 2026-06-18
Repository: `APGI-cmy/maturion-isms`
Issue: #1815
Branch: `foreman/issue-1815-mmm-vercel-clean`
CS2 Authority: Johan Ras
Pre-brief: `.agent-admin/assurance/iaa-wave-record-wave-issue-1815-mmm-vercel-ownership-2026-06-18.md`
Scope record: `.agent-admin/scope-declarations/wave-issue-1815-mmm-vercel-ownership-2026-06-18.md`
Builder: bounded implementation role for issue #1815

## Appointment

The builder is appointed only for the MMM Vercel workflow ownership correction described in issue #1815 and the monorepo Vercel deployment model.

## Authorized implementation file

The builder may modify only:

- `.github/workflows/deploy-mmm-vercel.yml`

The builder may add one issue evidence file under:

- `.agent-admin/evidence/`

## Required behavior

The builder must:

1. Replace generic Vercel secrets with MMM-specific secrets for MMM workflow project configuration and CLI usage.
2. Narrow MMM workflow trigger paths to MMM-owned frontend/config surfaces, workflow self-change, and lockfile changes.
3. Keep smoke tests limited to MMM routes.
4. Handle preview protection deliberately so HTTP 401/403 is not treated as route failure when protection is expected and no bypass secret is available.
5. Align workflow comments and evidence with `MONOREPO_VERCEL_DEPLOYMENT_MODEL.md`.

## Scope boundary

The builder must not edit ISMS portal workflow, PIT workflow, root app runtime, Supabase migrations, CodeQL, MMM descriptor runtime, or root `vercel.json` project-specific settings.

## Evidence requested

The builder must record app path, package name, output directory, Vercel project name, secret namespace, trigger paths, smoke routes, preview protection behavior, and non-owned paths.
