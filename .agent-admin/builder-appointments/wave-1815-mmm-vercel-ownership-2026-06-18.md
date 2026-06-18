# Builder Appointment - Issue 1815 MMM Vercel Ownership

Wave: `wave-1815-mmm-vercel-ownership-2026-06-18`
Date: 2026-06-18
Repository: `APGI-cmy/maturion-isms`
Issue: #1815
Branch: `foreman/issue-1815-mmm-vercel-ownership`
CS2 Authority: Johan Ras
Scope record: `.agent-admin/scope-declarations/wave-1815-mmm-vercel-ownership-2026-06-18.md`
IAA pre-brief: `.agent-admin/assurance/iaa-wave-record-wave-1815-mmm-vercel-ownership-2026-06-18.md`

## Appointment

The builder is appointed only for the MMM Vercel workflow ownership correction described in issue #1815, the monorepo deployment model, and the workflow ownership split.

## Authorized implementation file

The builder may modify only:

- `.github/workflows/deploy-mmm-vercel.yml`

## Required implementation behavior

The builder must:

1. Remove broad default ownership of unrelated app, root, and API paths from the MMM deployment workflow triggers.
2. Use MMM-specific Vercel secrets: `MMM_VERCEL_PROJECT_ID`, `MMM_VERCEL_ORG_ID`, `MMM_VERCEL_TOKEN`, and optional `MMM_VERCEL_AUTOMATION_BYPASS_SECRET`.
3. Keep smoke tests scoped to MMM routes only.
4. Treat HTTP 401/403 as preview-protection posture when the bypass secret is absent, rather than confusing it with route/app failure.
5. Preserve MMM build/typecheck behavior without editing ISMS or PIT workflows.
6. Avoid changing root `vercel.json` or app-specific project settings that are outside this workflow wave.

## Evidence requested

The builder must record:

- changed-file list;
- MMM-owned app path and package name;
- Vercel project target;
- secret namespace;
- trigger paths retained and removed;
- smoke routes;
- preview protection handling;
- any external-secret or unrun-test disclosure.
