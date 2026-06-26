# IAA Wave Record - PIT Public Card Routing

| Field | Value |
|---|---|
| Wave ID | `pit-public-card-routing` |
| Governing issue | `#1810` |
| Scope | Public module card copy and entitlement-aware routing for PIT |
| Posture | `IMPLEMENTATION_FOR_REVIEW` |

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pit-public-card-routing"
  pr: "PENDING"
  issue: "#1810"
  branch: "pit-public-card-routing-clean"
  qualifying_tasks:
    - task_id: "pit-public-card-routing"
      summary: "Correct PIT public module card wording and route entitled users to the tracker."
      assurance_category: "product-routing-copy-boundary"
  required_build_gates:
    - "Routing Governance Check"
    - "Deploy ISMS Portal to Vercel"
    - "Deploy PIT to Vercel"
    - "Builder Delegation Order Gate"
  expected_qa_scope:
    - "Public module card says Project Implementation Tracker."
    - "Public module card description references project implementation and evidence readiness, not process testing."
    - "Entitled Project Implementation users clicking the public card open /pit/tracker."
    - "Non-entitled users clicking the public card remain on /marketing/project-implementation."
    - "Marketing/subscription routes remain public."
  high_risk_failure_modes:
    - "Public card keeps stale Project Implementation Tracking wording."
    - "Public card sends entitled users into the marketing/subscription loop."
    - "Non-entitled users bypass subscription/upgrade path."
  required_builder_evidence:
    - "apps/isms-portal/src/lib/moduleCards.ts updates the PIT public card copy."
    - "apps/isms-portal/src/pages/ModulesOverview.tsx resolves the PIT card route by entitlement."
    - "No Supabase, billing, or subscription fixture files are changed."
  required_foreman_qp_checks:
    - "Confirm changed files are limited to governance evidence and the intended two app files."
    - "Confirm no W8.2 completion claim is made."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Confirm build artifacts are green before merge recommendation."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## FINAL ASSURANCE

PENDING. No final assurance, completion, or merge-readiness claim is made by this artifact.
