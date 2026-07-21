# PIT Stage 12 Slice 4 Assurance Wave Record

| Field | Value |
|---|---|
| Wave | `pit-stage12-slice4-supabase-project-persistence` |
| Issue | #1943 |
| PR | #1945 |
| Branch | `pit-stage12-slice4-supabase-project-persistence` |
| Date | 2026-07-21 |
| Classification | T2 product-facing persistence and access-control build |
| Preparation authority | CS2-directed Foreman control |
| Final assurance | Pending current-head independent IAA or canonical CS2 Direct Review |

> This record uses the canonical `IAA_PREFLIGHT_BRIEF` schema as the binding assurance checklist. It is not a final IAA verdict.

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pit-stage12-slice4-supabase-project-persistence"
  pr: "1945"
  issue: "#1943 - PIT Stage 12 Slice 4 Supabase Project Persistence and Project Detail Workspace Foundation"
  branch: "pit-stage12-slice4-supabase-project-persistence"
  qualifying_tasks:
    - task_id: "PIT-S4-001"
      summary: "Implement Supabase-backed projects and source-links persistence"
      assurance_category: "T2 persistence and schema boundary"
    - task_id: "PIT-S4-002"
      summary: "Implement authenticated organisation-scoped RLS and denied paths"
      assurance_category: "T2 security and access-control boundary"
    - task_id: "PIT-S4-003"
      summary: "Implement project detail workspace and deterministic route states"
      assurance_category: "T2 user workflow"
  required_build_gates:
    - "Slice 4 RED-to-GREEN test suite"
    - "SQL/RLS positive and negative tests"
    - "Portal unit tests and TypeScript build"
    - "Repository governance and POLC gates"
    - "CodeQL and current-head deployment gates"
  expected_qa_scope:
    - "PIT-S4-RED-REPO-001 through PIT-S4-RED-REPO-004"
    - "PIT-S4-RED-VALID-001 through PIT-S4-RED-VALID-002"
    - "PIT-S4-RED-RLS-001 through PIT-S4-RED-RLS-006"
    - "PIT-S4-RED-AUTH-001, PIT-S4-RED-SEC-001, PIT-S4-RED-STATE-001 and PIT-S4-RED-COMPAT-001"
  high_risk_failure_modes:
    - "Cross-organisation project disclosure or mutation"
    - "Viewer or non-creator mutation bypass"
    - "Service-role credential exposure in browser code or public configuration"
    - "Client-supplied organisation identity trusted as authorisation"
    - "Browser-local records falsely represented as migrated production data"
    - "Partial project or orphan source-link writes"
  required_builder_evidence:
    - "Exact implementation head SHA and changed paths"
    - "Migration and RLS policy evidence"
    - "RED-to-GREEN output by test identifier"
    - "Same-organisation allow and cross-organisation deny evidence"
    - "Authenticated create/read/update browser evidence"
    - "Secret and client-bundle boundary verification"
  required_foreman_qp_checks:
    - "Issue #1943 scope and exclusion traceability"
    - "Canonical prebrief and builder-appointment ancestry"
    - "RLS positive and negative test sufficiency"
    - "No service-role client exposure"
    - "No scope expansion into hierarchy, timeline, evidence, reporting or AIMC"
    - "No false production-readiness or Stage 12 completion claim"
  ecap_required: true
  ecap_expected_artifacts:
    - ".agent-admin/prs/pr-1945/wave-current-tasks.md"
    - "modules/pit/12-build/slice-4/qa-to-red-supabase-rls-contract-20260721.md"
    - "modules/pit/12-build/slice-4/builder-appointment-delegation-20260721.md"
    - ".agent-admin/control/delegation-orders/issue-1943.json"
  final_iaa_focus:
    - "Organisation isolation and denied paths"
    - "Credential and actor-binding security"
    - "Durable project create/read/update behavior"
    - "Truthful compatibility handling"
    - "Current-head deployment and browser evidence"
  result: PREFLIGHT_BRIEF_COMPLETE
```

## Final assurance placeholder

No final assurance verdict is recorded here. Final disposition must be bound to the implementation PR current head after implementation and gate completion.