# IAA Wave Record - MMM Vercel Workflow Ownership Split

| Field | Value |
|---|---|
| Wave ID | `mmm-vercel-workflow-ownership-1815` |
| Governing issue | `#1815` |
| Scope | MMM-owned Vercel workflow split |
| Posture | `IMPLEMENTATION_FOR_REVIEW` |

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "mmm-vercel-workflow-ownership-1815"
  issue: "#1815"
  branch: "mmm/vercel-workflow-ownership-1815"
  qualifying_tasks:
    - task_id: "mmm-vercel-workflow-split"
      summary: "Update MMM-owned Vercel workflow and ownership evidence."
      assurance_category: "deployment-workflow-boundary"
  required_build_gates:
    - "Actions Deprecation Gate"
    - "Deploy MMM Frontend to Vercel"
  expected_qa_scope:
    - "MMM workflow uses MMM-specific paths and secrets."
    - "MMM workflow smoke-tests MMM routes only."
    - "ISMS and PIT workflows are not edited."
    - "Broad api/** and packages/** changes do not automatically trigger MMM preview deployment."
  high_risk_failure_modes:
    - "MMM workflow triggers on unrelated ISMS or PIT paths."
    - "MMM workflow uses generic Vercel secrets."
    - "MMM smoke test treats protected-preview posture as route failure."
    - "MMM workflow silently reclaims broad shared API/package ownership."
  required_builder_evidence:
    - ".github/workflows/deploy-mmm-vercel.yml updated."
    - "modules/MMM/12-deployment/mmm-vercel-workflow-ownership-20260619.md exists."
  required_foreman_qp_checks:
    - "Confirm trigger paths exclude apps/isms-portal/**, modules/pit/**, broad api/**, and broad packages/**."
    - "Confirm MMM_VERCEL_PROJECT_ID, MMM_VERCEL_ORG_ID, and MMM_VERCEL_TOKEN are used."
    - "Confirm smoke routes are MMM routes only."
    - "Confirm preview-protection behavior is handled deliberately."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Confirm no handover, completion, or merge-readiness claim is made before final checks complete."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## FINAL ASSURANCE

PENDING. No final assurance, completion, or merge-readiness claim is made by this artifact.
