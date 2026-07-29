# IAA Wave Record — public-profiles-root-provenance-recovery-20260729

PR: #1994
ISSUE: #1993
BRANCH: copilot/recover-public-profiles-root-migration-20260729
STATUS: PRE-BRIEF COMPLETE — FINAL IAA WITHHELD

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "public-profiles-root-provenance-recovery-20260729"
  pr: 1994
  issue: "#1993 — Recover missing public.profiles migration provenance for clean bootstrap"
  branch: "copilot/recover-public-profiles-root-migration-20260729"
  qualifying_tasks:
    - task_id: "T-1993-SOURCE-001"
      summary: "Recover only the missing public.profiles root migration provenance."
      assurance_category: "foundational-schema-provenance"
  required_build_gates:
    - "PR-specific QA-to-RED guard is committed before the recovery migration"
    - "Source recovery remains limited to one root migration and PR-scoped evidence"
    - "Automatic preview exception is disclosed and remains non-evidentiary"
  expected_qa_scope:
    - "migration ordering after ISMS W6 and before PIT Slice 4"
    - "11 live-compatible profile columns and defaults"
    - "auth.users and public.organisations foreign keys"
    - "RLS and three self-only auth.uid() = id policies"
    - "absence of legacy MAT objects, triggers, storage, and broad grants"
  high_risk_failure_modes:
    - "recovering unrelated legacy MAT objects"
    - "weakening RLS or adding broad grants"
    - "treating the automatic Supabase preview as clean-bootstrap validation"
    - "mutating APGI-cmy’s Project"
  required_builder_evidence:
    - "first-commit intended-RED guard"
    - "precise source-only migration diff"
    - "source/live comparison"
    - "proof PR #1986 and PR #1981 are unchanged"
  required_foreman_qp_checks:
    - "exact one-migration scope"
    - "contract and policy source checks"
    - "production migration ledger excludes 20260615000000"
  ecap_required: true
  ecap_expected_artifacts:
    - ".agent-admin/scope-declarations/pr-1994.md"
    - ".agent-admin/source-live-comparisons/pr-1994-public-profiles.md"
  final_iaa_focus:
    - "no production mutation"
    - "no legacy object resurrection"
    - "automatic preview exception remains NO-GO for merge evidence"
  result: PREFLIGHT_BRIEF_COMPLETE

## Withheld decisions

This record is a pre-brief only. Clean bootstrap, QP, ECAP, final IAA, and merge decisions remain withheld.
