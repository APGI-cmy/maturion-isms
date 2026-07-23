# PIT Stage 12 Slice 4 — PR #1952 Assurance Wave Record

| Field | Value |
|---|---|
| Wave | `pit-stage12-slice4-supabase-project-persistence` |
| Issue | #1943 |
| Reconciliation issue | #1964 |
| Implementation PR | #1952 |
| Merge commit | `61ef3795d953ae11e0c153705729bff52aa3dc9f` |
| Date | 2026-07-22 |
| Classification | T2 product-facing persistence, authentication and access-control build |
| Preparation authority | CS2-directed Foreman control |
| Final assurance | PASSED — MERGED AND POST-MERGE VERIFIED |

> The YAML below remains the immutable PR-specific preflight brief committed before builder appointment and before any implementation or QA-to-RED test commit. The closure linkage is recorded after the original brief.

## IAA_PREFLIGHT_BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pit-stage12-slice4-supabase-project-persistence"
  pr: "1952"
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
    - "Slice 4 QA-to-RED then Build-to-GREEN"
    - "SQL/RLS positive and negative verification"
    - "Portal tests and TypeScript build"
    - "Delegation, POLC, CodeQL and deployment gates"
    - "Authenticated deployed browser LFV"
  high_risk_failure_modes:
    - "Cross-organisation project disclosure or mutation"
    - "Viewer or non-creator mutation bypass"
    - "Service-role credential exposure in browser code"
    - "Client-supplied organisation identity trusted as authorisation"
    - "Browser-local records represented as migrated production truth"
    - "Partial project or orphan source-link writes"
  required_builder_evidence:
    - "Exact prebrief, appointment and first implementation ancestry"
    - "Migration and RLS policy evidence"
    - "RED-to-GREEN results"
    - "Same-organisation allow and cross-organisation deny evidence"
    - "Authenticated create, register, detail and update browser evidence"
    - "Current-head deployment and gate evidence"
  result: PREFLIGHT_BRIEF_COMPLETE
```

## Closure linkage

- Final PR disposition: `CS2_PROXY_REVIEW_PASS / MERGE_RECOMMENDED`.
- CS2 merge: PR #1952 at `61ef3795d953ae11e0c153705729bff52aa3dc9f`.
- Authenticated LFV: `modules/pit/12-build/slice-4/authenticated-deployed-lfv-evidence-20260723.md`.
- Post-merge verification: `modules/pit/12-build/slice-4/post-merge-verification-and-closure-20260723.md`.

This assurance record closes Slice 4 only. It does not claim `FUNCTIONAL_PASS`, Stage 12 completion, PIT completion, release readiness or Issue #1944 completion.
