# IAA Wave Record — PIT Navigation Copy Fix

| Field | Value |
|---|---|
| Wave ID | `pit-nav-copy` |
| Governing issue | `#1810` |
| Scope | Project Implementation Tracker navigation and wording fix |
| Posture | `IMPLEMENTATION_FOR_REVIEW` |

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pit-nav-copy"
  pr: "PENDING"
  issue: "#1810"
  branch: "nav-copy-clean-2"
  qualifying_tasks:
    - task_id: "pit-nav-copy"
      summary: "Correct PIT wording and route entitled users from dashboard to the tracker."
      assurance_category: "product-routing-copy-boundary"
  required_build_gates:
    - "Routing Governance Check"
    - "Deploy ISMS Portal to Vercel"
    - "POLC Boundary Validation"
    - "Builder Delegation Order Gate"
  expected_qa_scope:
    - "Entitled Project Implementation dashboard tile opens /pit/tracker."
    - "Non-entitled dashboard tile keeps subscription upgrade path."
    - "PIT wording says Project Implementation Tracker."
    - "Public marketing/subscription routes remain public."
  high_risk_failure_modes:
    - "Entitled users loop back to marketing/subscription."
    - "PIT acronym is expanded incorrectly."
    - "Non-entitled users bypass subscription path."
  required_builder_evidence:
    - "Dashboard routes entitled project-implementation users to ROUTES.PIT_TRACKER."
    - "PITInfo copy uses Project Implementation Tracker."
    - "No Supabase, billing, or subscription fixture files are changed."
  required_foreman_qp_checks:
    - "Confirm dashboard routing behavior."
    - "Confirm PIT marketing CTA behavior."
    - "Confirm no W8.2 completion claim is made."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Confirm no completion or merge-readiness claim is made before final review."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## FINAL ASSURANCE

PENDING. No final assurance, completion, or merge-readiness claim is made by this artifact.
