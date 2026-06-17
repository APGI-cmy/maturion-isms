# IAA Wave Record — PIT W8.2 Protected Operational Route

| Field | Value |
|---|---|
| Wave ID | `pit-w82-protected-operational-route` |
| Governing issue | `#1810` |
| Reference PR | `#1813` |
| Implementation PR | `#1824` |
| Scope | Implementation-only protected PIT operational access route |
| W8.2 posture | `W8.2_NOT_READY` |

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pit-w82-protected-operational-route"
  pr: "#1824"
  issue: "#1810 PIT Stage 12 W8.2 final verification seed execution and evidence capture"
  branch: "foreman-builder/pit-w82-protected-route"
  qualifying_tasks:
    - task_id: "pit-w82-protected-route"
      summary: "Add protected PIT operational route shell without subscription or billing fixture changes."
      assurance_category: "implementation-route-boundary"
  required_build_gates:
    - "Routing Governance Check"
    - "Deploy ISMS Portal to Vercel"
    - "POLC Boundary Validation"
    - "Builder Delegation Order Gate"
  expected_qa_scope:
    - "Unauthenticated access to /pit and /pit/tracker redirects to login through ProtectedRoute."
    - "Authenticated access to /pit redirects to /pit/tracker."
    - "Authenticated access to /pit/tracker renders the PIT tracker shell."
    - "/subscribe and /subscribe/checkout remain public commercial routes."
  high_risk_failure_modes:
    - "Marketing or subscription routes accidentally become private."
    - "The PIT tracker route text overstates role-based authorization."
    - "Route constants diverge from ISMS canonical routing."
  required_builder_evidence:
    - "apps/isms-portal/src/lib/routes.ts adds PIT and PIT_TRACKER constants."
    - "apps/isms-portal/src/App.tsx wires /pit and /pit/tracker through existing protected shell pattern."
    - "No Supabase, billing, or subscription fixture changes."
  required_foreman_qp_checks:
    - "ISMS remains public front door."
    - "PIT marketing route remains public and still routes to subscription CTA."
    - "Private operational route remains protected by existing ProtectedRoute."
    - "Route copy matches actual auth-only protection."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Confirm no handover or completion claim is made before final assurance."
    - "Confirm route evidence and CI status are reported honestly."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## Scope to verify

- Add `ROUTES.PIT = /pit`.
- Add `ROUTES.PIT_TRACKER = /pit/tracker`.
- Add `/pit` redirect to `/pit/tracker`.
- Add protected `/pit/tracker` shell route using the existing `ProtectedRoute`, `PitErrorBoundary`, and `PitShell` pattern.
- Preserve `/subscribe` and `/subscribe/checkout` as public commercial subscription routes.

## Exclusions

- No Supabase writes.
- No fake subscription state.
- No billing fixtures.
- No auth user creation.
- No W8.2 completion claim.
- No handover or merge-readiness claim in this implementation-only stage.

## FINAL ASSURANCE

PENDING. No final IAA assurance is claimed by this wave record.
