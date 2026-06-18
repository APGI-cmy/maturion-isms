# Wave Scope - Issue 1815 MMM Vercel Ownership

Wave: `wave-1815-mmm-vercel-ownership-2026-06-18`
Date: 2026-06-18
Repository: `APGI-cmy/maturion-isms`
Issue: #1815
Module scope: MMM-only deployment workflow ownership
Lane: implementation
CS2 Authority: Johan Ras
Foreman role: orchestration, sequencing, and review
Builder role: bounded workflow implementation after pre-brief and appointment

## Objective

Implement issue #1815 in light of `MONOREPO_VERCEL_DEPLOYMENT_MODEL.md` and `MONOREPO_VERCEL_WORKFLOW_OWNERSHIP_SPLIT.md`.

The objective is to update `.github/workflows/deploy-mmm-vercel.yml` so the MMM Vercel workflow owns only the MMM deployment surface and no longer blocks unrelated ISMS, PIT, shared API, or shared hygiene changes.

## Product/deployment scope

Allowed implementation file:

- `.github/workflows/deploy-mmm-vercel.yml`

Allowed evidence/control files:

- `.agent-admin/assurance/iaa-wave-record-wave-1815-mmm-vercel-ownership-2026-06-18.md`
- `.agent-admin/builder-appointments/wave-1815-mmm-vercel-ownership-2026-06-18.md`
- `.agent-admin/evidence/issue-1815-mmm-vercel-ownership-2026-06-18.md`
- `.agent-admin/control/delegation-order.json`
- `.agent-workspace/foreman-memory/memory/session-1815-mmm-vercel-ownership-2026-06-18.md`

## Deployment ownership contract

MMM-owned deployment surface:

- App path: `apps/mmm/**`
- Package name: `@maturion/mmm`
- Expected output directory: `apps/mmm/dist`
- Vercel project: `maturion-isms-mmm`
- Workflow: `.github/workflows/deploy-mmm-vercel.yml`
- Secret namespace: `MMM_VERCEL_PROJECT_ID`, `MMM_VERCEL_ORG_ID`, `MMM_VERCEL_TOKEN`, optional `MMM_VERCEL_AUTOMATION_BYPASS_SECRET`

## Explicit non-owned paths

The MMM Vercel workflow must not own:

- `.github/workflows/deploy-isms-portal-vercel.yml`
- ISMS portal app paths
- PIT app paths
- broad `api/**` changes by default
- Supabase migrations or edge functions
- generic/root Vercel project ownership for other apps

## QA-to-red / acceptance basis

This workflow correction is tested by static CI contract checks and by the workflow itself on the PR branch:

1. path filters exclude broad unrelated app/API ownership;
2. generic Vercel secrets are replaced by MMM-specific secrets;
3. smoke routes are MMM routes only;
4. 401/403 preview protection is handled deliberately;
5. workflow evidence records app path, project target, secret namespace, trigger paths, smoke routes, and non-owned paths.

## Lane constraint

This branch carries implementation-lane workflow ownership work only. It does not create later-lane assurance or CS2 disposition artifacts in this commit.
