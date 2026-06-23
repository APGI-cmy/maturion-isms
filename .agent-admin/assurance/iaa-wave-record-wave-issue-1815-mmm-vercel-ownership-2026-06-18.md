# IAA Wave Record - Issue 1815 MMM Vercel Ownership

Wave: `wave-issue-1815-mmm-vercel-ownership-2026-06-18`
Date: 2026-06-18
Repository: `APGI-cmy/maturion-isms`
Issue: #1815
Branch: `foreman/issue-1815-mmm-vercel-clean`
Scope record: `.agent-admin/scope-declarations/wave-issue-1815-mmm-vercel-ownership-2026-06-18.md`

## PRE-BRIEF

EXPECTED_QA_SCOPE:
- Verify MMM workflow path filters are limited to MMM-owned deployment surfaces, workflow self-change, and lockfile changes.
- Verify Vercel project configuration uses `MMM_VERCEL_PROJECT_ID` and `MMM_VERCEL_ORG_ID`.
- Verify Vercel CLI commands use `MMM_VERCEL_TOKEN`.
- Verify preview and production deployment paths validate required Supabase and Vercel secrets before Vercel build/deploy.
- Verify smoke testing targets MMM routes only and handles protected preview HTTP 401/403 separately from route failure.

EXPECTED_FAILURE_MODES:
- Generic Vercel secrets deploy or smoke-test the wrong project.
- Unrelated ISMS-only or shared hygiene PRs trigger MMM deployment.
- Protected preview access returns HTTP 401/403 and is misreported as app route failure.
- Missing Supabase env secrets allow a blank or broken frontend artifact to deploy.
- Issue #1815 work is mixed with descriptor runtime or other product behavior.

FOREMAN_INSTRUCTIONS:
- Keep the implementation file scope limited to `.github/workflows/deploy-mmm-vercel.yml` plus issue #1815 evidence.
- Do not edit `.github/workflows/deploy-isms-portal-vercel.yml`.
- Do not edit PIT workflows, runtime code, Supabase migrations, CodeQL, or root app-specific Vercel settings.
- Require builder evidence for secret namespace, trigger paths, smoke routes, protected-preview handling, and monorepo deployment model alignment.

IAA_WILL_QA:
- IAA will check workflow ownership boundary and secret namespace separation.
- IAA will check that route smoke tests are MMM-only.
- IAA will check that preview protection handling is explicit.
- IAA will check that evidence records non-owned paths and the MMM Vercel project contract.

RESULT: PREFLIGHT_BRIEF_COMPLETE

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-issue-1815-mmm-vercel-ownership-2026-06-18"
  pr: "1827"
  issue: "1815"
  branch: "foreman/issue-1815-mmm-vercel-clean"
  qualifying_tasks:
    - "Align MMM Vercel workflow ownership with issue #1815."
    - "Update MMM workflow to use MMM-specific Vercel secret namespace."
    - "Narrow MMM workflow triggers to MMM-owned surfaces."
    - "Document MMM deployment ownership evidence against the monorepo Vercel model."
  required_build_gates:
    - "Scope restricted to `.github/workflows/deploy-mmm-vercel.yml` plus issue #1815 evidence."
    - "No edits to `.github/workflows/deploy-isms-portal-vercel.yml`."
    - "No runtime code, Supabase migration, PIT, ISMS portal, CodeQL, or unrelated workflow changes."
    - "Workflow must use MMM-specific Vercel secrets and MMM-only smoke routes."
  expected_qa_scope:
    - "Trigger paths no longer include broad unrelated `api/**` or root `vercel.json` as automatic MMM deploy triggers."
    - "Workflow project configuration uses `MMM_VERCEL_PROJECT_ID` and `MMM_VERCEL_ORG_ID`."
    - "Vercel CLI commands use `MMM_VERCEL_TOKEN`."
    - "Preview smoke test uses only MMM routes."
    - "Protected preview 401/403 behavior is handled deliberately when no bypass secret is available."
  high_risk_failure_modes:
    - "Generic Vercel secrets deploy or smoke-test the wrong project."
    - "Unrelated ISMS-only or shared hygiene PRs trigger MMM deployment."
    - "Protected preview access returns 401/403 and is misreported as app route failure."
    - "Workflow changes attempt to solve root Vercel project settings that must remain project-level."
    - "Issue #1815 work is mixed with descriptor runtime or other product behavior."
  required_builder_evidence:
    - "Changed-file list."
    - "Secret namespace evidence."
    - "Trigger path evidence."
    - "Smoke route evidence."
    - "Monorepo deployment model alignment evidence for app path, package, output directory, and Vercel project name."
  required_foreman_qp_checks:
    - "Verify workflow uses only MMM-specific Vercel secrets."
    - "Verify trigger paths are MMM-owned or workflow/lockfile scoped."
    - "Verify smoke routes are MMM-only."
    - "Verify no ISMS/PIT workflow or runtime code changes."
    - "Verify evidence records non-owned paths and deployment model alignment."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Workflow ownership boundary."
    - "Secret namespace separation."
    - "Preview protection handling."
    - "Evidence completeness for issue #1815."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```
