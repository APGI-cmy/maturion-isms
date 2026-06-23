# IAA Wave Record — PIT Project Implementation Tracker Routing

| Field | Value |
|---|---|
| Wave ID | `pit-project-implementation-tracker-routing` |
| Governing issue | `#1810` |
| Scope | Product routing and wording fix for PIT module entry |
| Posture | `IMPLEMENTATION_FOR_REVIEW` |

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pit-project-implementation-tracker-routing"
  pr: "#1835"
  issue: "#1810"
  branch: "pit-nav-copy-fix"
  qualifying_tasks:
    - task_id: "pit-module-navigation-wording"
      summary: "Route entitled Project Implementation users to the PIT tracker and correct PIT wording."
      assurance_category: "product-routing-copy-boundary"
  required_build_gates:
    - "Routing Governance Check"
    - "Deploy ISMS Portal to Vercel"
    - "POLC Boundary Validation"
  expected_qa_scope:
    - "Entitled Project Implementation dashboard tile opens /pit/tracker."
    - "Non-entitled Project Implementation dashboard tile keeps subscription upgrade path."
    - "PIT marketing copy says Project Implementation Tracker."
    - "Public marketing and subscription routes remain public."
  high_risk_failure_modes:
    - "Dashboard Project Implementation tile loops back to marketing/subscription after entitlement."
    - "PIT acronym is expanded incorrectly."
    - "Subscription flow is bypassed for non-entitled users."
  required_builder_evidence:
    - "Dashboard project-implementation entitlement path routes to ROUTES.PIT_TRACKER."
    - "PITInfo copy uses Project Implementation Tracker."
    - "No Supabase, billing, or subscription fixture files are changed."
  required_foreman_qp_checks:
    - "Verify entitled dashboard Project Implementation tile routes to /pit/tracker."
    - "Verify non-entitled dashboard path still routes to subscribe upgrade."
    - "Verify PIT marketing CTA routes to tracker only for authenticated entitled users."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Confirm no W8.2 completion claim is made."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## FINAL ASSURANCE

PENDING. No final assurance, completion, or merge-readiness claim is made by this artifact.
