# IAA Wave Record — public-profiles-root-provenance-recovery-20260729-gate-corrected

PR: #1996
ISSUE: #1993
BRANCH: copilot/recover-public-profiles-root-migration-20260729-gate-corrected
STATUS: PRE-BRIEF COMPLETE — FINAL IAA WITHHELD

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "public-profiles-root-provenance-recovery-20260729-gate-corrected"
  issue: "#1993 — recover missing public.profiles migration provenance"
  branch: "copilot/recover-public-profiles-root-migration-20260729-gate-corrected"
  qualifying_tasks:
    - task_id: "T-1993-SOURCE-001"
      summary: "Recover only the missing public.profiles root migration."
      assurance_category: "foundational-schema-provenance"
  required_build_gates:
    - "QA-to-RED guard is committed before the recovery migration"
    - "source recovery remains one root migration plus PR-scoped evidence"
    - "no production database action"
  expected_qa_scope:
    - "migration ordering"
    - "11 profile columns and defaults"
    - "two foreign keys, RLS, and three self-only policies"
    - "absence of legacy MAT objects and broad grants"
  high_risk_failure_modes:
    - "unrelated legacy MAT recovery"
    - "weak RLS or broad grants"
    - "treating a preview as clean-bootstrap evidence"
    - "mutating production"
  result: PREFLIGHT_BRIEF_COMPLETE

## Withheld decisions

Clean bootstrap, QP, ECAP, final IAA, and merge decisions remain withheld.
