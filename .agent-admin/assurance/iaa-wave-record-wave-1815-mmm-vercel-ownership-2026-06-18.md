# IAA Wave Record - Issue 1815 MMM Vercel Ownership

Wave: `wave-1815-mmm-vercel-ownership-2026-06-18`
Date: 2026-06-18
Repository: `APGI-cmy/maturion-isms`
Issue: #1815
Branch: `foreman/issue-1815-mmm-vercel-ownership`
Scope record: `.agent-admin/scope-declarations/wave-1815-mmm-vercel-ownership-2026-06-18.md`

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-1815-mmm-vercel-ownership-2026-06-18"
  pr: "pending"
  issue: "#1815"
  branch: "foreman/issue-1815-mmm-vercel-ownership"
  qualifying_tasks:
    - "Update the MMM Vercel workflow to own only the MMM deployment surface."
    - "Replace generic Vercel project secrets with MMM-specific secret namespace references."
    - "Narrow workflow triggers so unrelated ISMS, PIT, broad API, and shared hygiene changes do not require MMM preview deployment."
    - "Restrict smoke tests to MMM routes and handle protected-preview HTTP 401/403 deliberately."
    - "Record ownership evidence for app path, project target, secret namespace, trigger paths, smoke routes, and non-owned paths."
  required_build_gates:
    - "Implementation diff limited to `.github/workflows/deploy-mmm-vercel.yml` plus declared governance/evidence files."
    - "No edits to `.github/workflows/deploy-isms-portal-vercel.yml`."
    - "No root `vercel.json` app-specific ownership changes in this wave."
    - "Workflow uses `MMM_VERCEL_PROJECT_ID`, `MMM_VERCEL_ORG_ID`, `MMM_VERCEL_TOKEN`, and optional `MMM_VERCEL_AUTOMATION_BYPASS_SECRET`."
  expected_qa_scope:
    - "Static review confirms no broad `api/**` trigger remains in the MMM deployment workflow."
    - "Static review confirms no ISMS or PIT smoke routes are tested by the MMM workflow."
    - "Static review confirms protected preview 401/403 is not treated as route failure when bypass secret is absent."
    - "CI run on PR branch exercises the updated workflow where GitHub path filters apply."
  high_risk_failure_modes:
    - "Workflow still triggers on unrelated ISMS, PIT, root, or broad API changes."
    - "Workflow still uses generic ambiguous Vercel secrets."
    - "Smoke tests fail protected preview environments as if the app route is broken."
    - "Workflow edits drift into ISMS, PIT, root Vercel config, or unrelated deployment surfaces."
    - "Root Vercel config is made app-specific contrary to the monorepo deployment model."
  required_builder_evidence:
    - "Changed-file list."
    - "MMM-owned app path, package name, output directory, and Vercel project target."
    - "Secret namespace used by preview and production deployment steps."
    - "Trigger paths retained and trigger paths removed."
    - "Smoke routes and 401/403 handling behavior."
    - "Any unrun-test or external-secret limitation disclosure."
  required_foreman_qp_checks:
    - "Verify workflow trigger scope aligns to issue #1815 and the monorepo workflow ownership split."
    - "Verify workflow settings align to `MONOREPO_VERCEL_DEPLOYMENT_MODEL.md`."
    - "Verify no ISMS/PIT workflow or root app-specific Vercel config is modified."
    - "Verify branch keeps implementation-lane language only."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Workflow ownership boundary and secret namespace correctness."
    - "Preview protection handling and route-smoke ownership."
    - "Absence of cross-module deployment drift."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```
