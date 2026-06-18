# Issue 1815 MMM Vercel Ownership Scope

Wave: `wave-issue-1815-mmm-vercel-ownership-2026-06-18`
Date: 2026-06-18
Repository: `APGI-cmy/maturion-isms`
Issue: #1815
Branch: `foreman/issue-1815-mmm-vercel-clean`
Module scope: MMM deployment workflow only
Lane: implementation lane
CS2 Authority: Johan Ras
Foreman role: orchestration, governance sequencing, and review only

## Objective

Implement issue #1815 in light of `MONOREPO_VERCEL_DEPLOYMENT_MODEL.md`.

The goal is to align `.github/workflows/deploy-mmm-vercel.yml` with the monorepo Vercel deployment model so the MMM workflow owns only the MMM deployment surface and uses MMM-specific Vercel project secrets.

## Authority inputs

- Issue #1815: MMM Vercel workflow ownership split.
- `MONOREPO_VERCEL_DEPLOYMENT_MODEL.md`.
- `FOREMAN_OPERATING_MODEL.md`.

## Bounded implementation scope

Implementation file scope is limited to:

- `.github/workflows/deploy-mmm-vercel.yml`

Evidence file scope may include:

- `.agent-admin/evidence/issue-1815-mmm-vercel-ownership-2026-06-18.md`

No MMM runtime, ISMS workflow, PIT workflow, CodeQL, root application runtime, Supabase migration, or unrelated governance behavior is in scope.

## Required workflow behavior

The workflow must:

1. Keep MMM-owned app path as `apps/mmm/**`.
2. Keep owning workflow path as `.github/workflows/deploy-mmm-vercel.yml`.
3. Use MMM-specific Vercel secrets:
   - `MMM_VERCEL_PROJECT_ID`
   - `MMM_VERCEL_ORG_ID`
   - `MMM_VERCEL_TOKEN`
   - optional `MMM_VERCEL_AUTOMATION_BYPASS_SECRET`
4. Target Vercel project `maturion-isms-mmm` as the MMM project name evidence.
5. Align to package `@maturion/mmm` and output directory `apps/mmm/dist` per the monorepo deployment model.
6. Smoke-test MMM routes only.
7. Treat preview protection deliberately so protected-preview HTTP 401/403 is not confused with route or app failure where protection is expected.
8. Narrow trigger paths so unrelated ISMS-only or broad shared changes do not automatically require MMM preview deployment.

## Out of scope

- Editing `.github/workflows/deploy-isms-portal-vercel.yml`.
- Smoke-testing ISMS or PIT routes.
- Generic ambiguous Vercel secrets for the MMM project.
- Root `vercel.json` app-specific project settings changes.
- Deployment project settings in Vercel UI.

## QA-to-red basis

Issue #1815 already describes the failing class: the MMM workflow can be triggered by non-MMM surfaces and can fail protected preview smoke checks using generic Vercel project secrets. This wave encodes those expectations into workflow ownership boundaries, secret names, path filters, smoke route selection, and evidence.

## Governance sequencing

This branch follows the PR #1800 Foreman sequence:

1. wave scope/context record;
2. canonical IAA wave record with `## PRE-BRIEF` and `IAA_PREFLIGHT_BRIEF`;
3. separate builder appointment commit;
4. workflow implementation commit;
5. evidence record;
6. delegation-order control with strict commit SHA ordering.

## Lane constraint

This branch carries implementation-lane work only. It does not invoke later assurance or CS2 disposition stages in this commit.
