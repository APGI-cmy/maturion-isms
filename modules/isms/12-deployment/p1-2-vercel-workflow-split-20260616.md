# ISMS P1.2 Vercel Workflow Split

Status: MERGED - ACCEPTED FOR P1.2 SCOPE
Date: 2026-06-16
Merged PR: #1812 (`50785d5b6084fd7a2100cad8e946b596ac8b89a6`)

## Scope

P1.2 records the monorepo Vercel workflow ownership strategy and adds the ISMS-only Vercel deployment workflow.

This slice does not modify MMM or PIT workflows. MMM and PIT agents should implement their own workflow changes separately using the coordination artifact.

## Problem addressed

PR #1809 touched shared API files. The existing MMM deployment workflow triggers on `api/**`, so it deployed the MMM preview and ran MMM route checks even though the PR was an ISMS/P1.1 hygiene slice. The Vercel preview deploy succeeded, but the MMM route check returned HTTP 401 because preview protection blocked the smoke bot.

That failure showed that app deployment workflows need to be separated by ownership and path filters.

## Files added

- `MONOREPO_VERCEL_WORKFLOW_OWNERSHIP_SPLIT.md`
- `.github/workflows/deploy-isms-portal-vercel.yml`
- `modules/isms/12-deployment/p1-2-vercel-workflow-split-20260616.md`

## ISMS workflow ownership

The new ISMS workflow owns only:

- `apps/isms-portal/**`
- `.github/workflows/deploy-isms-portal-vercel.yml`
- `MONOREPO_VERCEL_WORKFLOW_OWNERSHIP_SPLIT.md`

It does not own:

- `apps/mmm/**`
- PIT app paths
- broad `api/**` changes

## Secret namespace

The ISMS workflow uses app-specific secrets:

- `ISMS_VERCEL_ORG_ID`
- `ISMS_VERCEL_PROJECT_ID`
- `ISMS_VERCEL_TOKEN`
- optional `ISMS_VERCEL_AUTOMATION_BYPASS_SECRET`

The workflow builds and verifies routes even if those secrets are not configured, then skips deploy steps with a clear message.

## Smoke-test policy

ISMS public routes fail on HTTP 404, 5xx, 401 or 403.

ISMS protected routes fail on HTTP 404 or 5xx, but HTTP 401/403 is treated as protected/auth posture rather than SPA fallback failure.

## Merge and gate result

PR #1812 merged on 2026-06-16 at merge commit `50785d5b6084fd7a2100cad8e946b596ac8b89a6`.

PR-scoped checks passed, including:

- `Layer-Up Trigger`
- `Actions Deprecation Gate`
- `Routing Governance Check`
- `Stub Detection Check`
- `Preflight Evidence Gate`
- `POLC Boundary Validation`
- `CodeQL`
- `Deploy ISMS Portal to Vercel`

One automated review thread about frozen lockfile behaviour was resolved before merge. No unresolved P1.2 review thread remains.

## Post-merge follow-up

Actual ISMS Vercel preview deployment remains gated on app-specific repository secrets:

- `ISMS_VERCEL_ORG_ID`
- `ISMS_VERCEL_PROJECT_ID`
- `ISMS_VERCEL_TOKEN`
- optional `ISMS_VERCEL_AUTOMATION_BYPASS_SECRET`

After secrets are configured, open an ISMS-only verification PR touching `apps/isms-portal/**` or `.github/workflows/deploy-isms-portal-vercel.yml` to prove a real preview deploy and ISMS smoke test.

## Coordination instructions

MMM and PIT agents should not edit the ISMS workflow. They should create or adjust their own app-specific workflows and use app-specific Vercel secret namespaces.

The coordination artifact defines the ownership matrix and must be read before any module agent changes Vercel workflows.
