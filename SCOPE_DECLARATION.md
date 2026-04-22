# Scope Declaration — mmm-post-stage12-backend-alignment-20260422

**Wave**: mmm-post-stage12-backend-alignment-20260422
**Issue**: maturion-isms#1455
**Branch**: copilot/align-mat-ai-gateway-deployments
**Date**: 2026-04-22
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-wave-record-mmm-post-stage12-backend-alignment-20260422.md` (SHA 706be01)

## Scope Decision (SB-03 Resolution)

Workflow-name rename only — `apps/mat-ai-gateway/` application path retained unchanged. All MAT-named deployment workflows renamed to MMM-aligned equivalents. Deployment documentation added to governance path. BUILD_PROGRESS_TRACKER updated.

## Changed Files

### Added

- `.github/workflows/deploy-mmm-ai-gateway.yml` - Rename from `deploy-mat-ai-gateway.yml`; update workflow name to "Deploy MMM AI Gateway"; update all references from MAT to MMM; retain same deployment logic, path filters, and Render deploy pattern
- `.github/workflows/deploy-mmm-edge-functions.yml` - Rename from `deploy-mat-edge-functions.yml`; update workflow name to "Deploy MMM Edge Functions"; update all references from MAT to MMM; update deploy step comment and step summary references to MMM
- `modules/MMM/12-phase4-ecap/deployment-alignment.md` - Deployment alignment record: Vercel frontend confirmed operational; AI gateway deployment shape defined; edge/runtime deployment aligned; env var ownership documented per platform
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-post-stage12-backend-alignment-20260422.md` - Foreman scope declaration artifact

### Modified

- `modules/MMM/BUILD_PROGRESS_TRACKER.md` - Update deployment state: Vercel frontend deployment confirmed operational; AI gateway aligned to MMM (workflow renamed to deploy-mmm-ai-gateway.yml); edge functions deployment aligned (workflow renamed to deploy-mmm-edge-functions.yml); remaining SB-003 operational items (W1/W2, PIT_BASE_URL, E2E flow) status documented
- `SCOPE_DECLARATION.md` - This scope declaration for wave mmm-post-stage12-backend-alignment-20260422

### Deleted

- `.github/workflows/deploy-mat-ai-gateway.yml` - Replaced by `deploy-mmm-ai-gateway.yml`
- `.github/workflows/deploy-mat-edge-functions.yml` - Replaced by `deploy-mmm-edge-functions.yml`

## Out of Scope

- Reopening B1-B9 implementation work
- Frontend feature feedback / UX refinement
- New functional changes unrelated to deployment alignment
- Renaming `apps/mat-ai-gateway/` application directory (deployment alignment only; app code path retained)
- Provisioning or modifying Render service configuration (external to this repository)
