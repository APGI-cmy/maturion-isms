# IAA Wave Record — PIT W8.2 Role-Aware Route Authorization

| Field | Value |
|---|---|
| Wave ID | `pit-w82-role-aware-route-authorization` |
| Governing issue | `#1810` |
| Scope | Role-aware route authorization for PIT/admin/QA shells |
| Posture | `IMPLEMENTATION_FOR_REVIEW` |

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pit-w82-role-aware-route-authorization"
  pr: "PENDING"
  issue: "#1810"
  branch: "pit-w82-role-aware-route-authorization"
  qualifying_tasks:
    - task_id: "pit-w82-route-authorization"
      summary: "Add role-aware authorization around PIT, admin, and QA route shells without Supabase or billing fixture changes."
      assurance_category: "route-authorization-boundary"
  required_build_gates:
    - "Routing Governance Check"
    - "Deploy PIT to Vercel"
    - "POLC Boundary Validation"
    - "Builder Delegation Order Gate"
  expected_qa_scope:
    - "Unauthenticated users redirect from protected PIT/admin/QA routes to login."
    - "Authenticated PIT workspace users can access /pit and /pit/tracker."
    - "Non-admin roles are denied /admin/org, /admin/users, /admin/settings, and /admin/audit-log."
    - "org_admin can access admin routes but is denied /qa-dashboard."
    - "cs2_admin can access admin routes and /qa-dashboard."
    - "Public marketing/subscription routes remain public."
  high_risk_failure_modes:
    - "Admin/QA routes remain auth-only and allow non-admin roles."
    - "Public marketing/subscription flow becomes gated."
    - "Mock role mapping overclaims real Supabase/RLS enforcement."
  required_builder_evidence:
    - "Role-aware route guard is implemented in the ISMS portal route layer."
    - "Auth shell can represent deterministic mock roles for deployed evidence capture."
    - "No Supabase seed, billing, or subscription fixture files are changed."
  required_foreman_qp_checks:
    - "Verify /pit and /pit/tracker remain accessible to authenticated mock users."
    - "Verify admin routes require org_admin or cs2_admin."
    - "Verify /qa-dashboard requires cs2_admin."
    - "Verify public marketing/subscription routes remain public."
  ecap_required: false
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Confirm route authorization behavior is described as mock-route-shell authorization, not final RLS completion."
    - "Confirm W8.2 remains not complete until deployed evidence is captured."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## FINAL ASSURANCE

PENDING. No final assurance, completion, or merge-readiness claim is made by this artifact.
