# IAA Wave Record - PIT Vercel Workflow Ownership Split

| Field | Value |
|---|---|
| Wave ID | `pit-vercel-workflow-ownership-1816` |
| Governing issue | `#1816` |
| Implementation PR | `#1826` |
| Scope | PIT-owned Vercel workflow split |
| Posture | `IMPLEMENTATION_FOR_REVIEW` |

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pit-vercel-workflow-ownership-1816"
  pr: "#1826"
  issue: "#1816"
  branch: "pit-vercel-workflow-split-1816"
  qualifying_tasks:
    - task_id: "pit-vercel-workflow-split"
      summary: "Create PIT-owned Vercel workflow and ownership evidence."
      assurance_category: "deployment-workflow-boundary"
  required_build_gates:
    - "Actions Deprecation Gate"
    - "Deploy PIT to Vercel"
  expected_qa_scope:
    - "PIT workflow uses PIT-specific paths and secrets."
    - "PIT workflow smoke-tests PIT routes only."
    - "ISMS and MMM workflows are not edited."
  high_risk_failure_modes:
    - "PIT workflow triggers on unrelated app paths."
    - "PIT workflow uses generic Vercel secrets."
    - "PIT smoke test treats ISMS or MMM routes as PIT-owned routes."
  required_builder_evidence:
    - ".github/workflows/deploy-pit-vercel.yml exists."
    - "modules/pit/12-deployment/pit-vercel-workflow-ownership-20260617.md exists."
  required_foreman_qp_checks:
    - "Confirm trigger paths exclude apps/mmm/** and broad api/** or packages/**."
    - "Confirm PIT_VERCEL_PROJECT_ID, PIT_VERCEL_ORG_ID, and PIT_VERCEL_TOKEN are used."
    - "Confirm smoke routes are PIT routes only."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Confirm no readiness or completion claim is made before final checks complete."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## FINAL ASSURANCE

PENDING. No final assurance, completion, or merge-readiness claim is made by this artifact.
