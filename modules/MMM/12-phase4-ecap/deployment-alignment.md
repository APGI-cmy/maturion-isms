# MMM Deployment Alignment Record

**Wave**: mmm-post-stage12-backend-alignment-20260422
**Issue**: maturion-isms#1455
**Date**: 2026-04-22
**Status**: DEPLOYMENT WORKFLOWS ALIGNED — live operational confirmation pending CS2 staging sign-off

## Summary

Post-Stage-12 MMM deployment alignment. This document records the alignment of MAT-era
deployment infrastructure to MMM-era naming and documentation.

## Vercel Frontend Deployment

- **Workflow**: `.github/workflows/deploy-mmm-vercel.yml` (aligned in PR #1454)
- **Project**: `maturity-model-management`
- **Path**: `apps/mmm/**`
- **Status**: OPERATIONAL — recent preview and production deployments confirmed READY (PR #1454)

## AI Gateway Deployment

- **Workflow**: `.github/workflows/deploy-mmm-ai-gateway.yml` (renamed from `deploy-mat-ai-gateway.yml` in this wave)
- **Application path**: `apps/mat-ai-gateway/` (Python FastAPI service)
- **Render service**: `maturion-mat-ai-gateway-staging` (Render dashboard naming; formal MMM-designation applied via workflow rename)
- **Deployment trigger**: push to `main` with changes to `apps/mat-ai-gateway/**`
- **Status**: WORKFLOW ALIGNED — live service reachable at staging URL (confirmed by SB-003 provisioning); formal Render service rename is a CS2 operational action on the Render dashboard

## Edge Functions Deployment

- **Workflow**: `.github/workflows/deploy-mmm-edge-functions.yml` (renamed from `deploy-mat-edge-functions.yml` in this wave)
- **Edge Functions**: 22 MMM Edge Functions deployed to Supabase project (`supabase/functions/`)
- **Primary function deployed by workflow**: `invoke-ai-parse-criteria`
- **All MMM functions**: `mmm-health`, `mmm-qiw-status`, `mmm-org-update`, `mmm-invitation-create`, `mmm-invitation-accept`, `mmm-commissioning-check`, `mmm-org-create`, `mmm-framework-init`, `mmm-assessment-free-respond`, `mmm-assessment-free-result`, `mmm-framework-compile`, `mmm-framework-publish`, `mmm-upload-framework-source`, `mmm-ai-framework-parse`, `mmm-ai-framework-generate`, `mmm-ai-framework-alter`, `mmm-score-confirm`, `mmm-upload-evidence`, `mmm-ai-evidence-evaluate`, `mmm-pit-export-send`, `mmm-pit-evidence-return`, `mmm-ai-recommend`
- **Deployment target**: Supabase project (`SUPABASE_PROJECT_REF` secret)
- **Status**: WORKFLOW ALIGNED — staging deployment pending CS2 operational sign-off

## Environment Variable Ownership

| Variable | Platform | Purpose | Status |
|----------|----------|---------|--------|
| `VERCEL_ORG_ID` | Vercel (GitHub secret) | Vercel org auth | Configured (PR #1454) |
| `VERCEL_PROJECT_ID` | Vercel (GitHub secret) | MMM project ID | Configured (PR #1454) |
| `VERCEL_TOKEN` | Vercel (GitHub secret) | Vercel deploy auth | Configured (PR #1454) |
| `RENDER_API_KEY` | Render AI gateway (GitHub secret) | Render deploy auth | Configured |
| `RENDER_SERVICE_ID` | Render AI gateway (GitHub secret) | Production service ID | Configured |
| `RENDER_SERVICE_ID_STAGING` | Render AI gateway (GitHub secret) | Staging service ID | Configured |
| `RENDER_SERVICE_URL` | Render AI gateway (GitHub secret) | Production health URL | Configured |
| `RENDER_SERVICE_URL_STAGING` | Render AI gateway (GitHub secret) | Staging health URL | Configured |
| `SUPABASE_ACCESS_TOKEN` | Supabase (GitHub secret) | Supabase CLI auth | Configured |
| `SUPABASE_PROJECT_REF` | Supabase (GitHub secret) | Supabase project ref | Configured |
| `MATURION_BOT_TOKEN` | Supabase Edge Functions (GitHub secret) | Checkout auth | Configured |
| `AIMC_SERVICE_TOKEN` | Supabase project secrets + Render AI gateway env | AIMC auth token | Provisioned by CS2 (2026-04-21) |
| `PIT_SERVICE_TOKEN` | Supabase project secrets + Render AI gateway env | PIT auth token | Pre-provisioned by CS2 (2026-04-21) |
| `AIMC_BASE_URL` | Supabase project secrets | AIMC staging endpoint | Confirmed |
| `PIT_BASE_URL` | Supabase project secrets | PIT endpoint | PENDING live PIT endpoint |
| `OPENAI_API_KEY` | Render AI gateway env | OpenAI auth | Configured |
| `SUPABASE_URL` | Render AI gateway env | Supabase project URL | Configured |
| `SUPABASE_SERVICE_ROLE_KEY` | Render AI gateway env | Supabase service role | Configured |
| `VITE_SUPABASE_URL` | Vercel env + GitHub secret | Supabase URL for frontend | Configured |
| `VITE_SUPABASE_ANON_KEY` | Vercel env + GitHub secret | Supabase anon key for frontend | Configured |

## Remaining Operational Items (CS2 Action Required)

The following items require CS2 operational action on live infrastructure:

| Item | Status | Action Required |
|------|--------|-----------------|
| Render service formal rename | PENDING | CS2: rename `maturion-mat-ai-gateway-staging` → `maturion-mmm-ai-gateway-staging` in Render dashboard |
| SB-003-W1 live proof | PENDING | CS2: confirm AIMC gateway reads `AIMC_SERVICE_TOKEN` from Render env via live HTTP test |
| SB-003-W2 live proof | PENDING | CS2: confirm AIMC gateway enforces inbound token auth on MMM requests via live HTTP test |
| PIT_BASE_URL | PENDING | CS2: provision live PIT endpoint and update `PIT_BASE_URL` secret |
| MMM staging E2E flow | PENDING | CS2: demonstrate at least one live MMM workflow across Vercel → Supabase → AIMC gateway stack |
| MMM Edge Functions staging deploy | PENDING | CS2: trigger `deploy-mmm-edge-functions.yml` manually to deploy 22 MMM functions to staging |

## References

- PR #1429 — Stage 12 build execution (B1–B9 complete, merged 2026-04-21)
- PR #1454 — MMM frontend Vercel deployment aligned
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` — primary operational tracker
- `modules/MMM/12-phase4-ecap/cdv-staging-validation.md` — CDV staging validation checklist
- `.agent-admin/assurance/iaa-wave-record-mmm-post-stage12-backend-alignment-20260422.md` — IAA Pre-Brief
