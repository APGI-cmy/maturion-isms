# IAA Prebrief - PIT W8.1 Deployed Evidence

IAA_PREFLIGHT_BRIEF: true
PR: TBD
ISSUE: 1775
WAVE: PIT_STAGE12_W8_1_DEPLOYED_EVIDENCE
WAVE_TASKS_PATH: modules/pit/12-build/w81-deployed-lfv-evidence.md
CURRENT_HEAD_SHA: CURRENT_HEAD

## PRE-BRIEF

Scope is limited to W8.1 deployed-evidence harness and ledger after PR #1777.

## EXPECTED_QA_SCOPE

- Verify the deployed smoke harness covers all W8.1 routes.
- Verify the evidence ledger does not claim runtime captures without proof.
- Verify W8.2 remains blocked.
- Verify no FUNCTIONAL_PASS or Stage 12 completion claim.

## EXPECTED_FAILURE_MODES

- Ledger claims screenshots/HARs that are not attached.
- Harness omits W8.1 routes.
- PR starts W8.2 before W8.1 deployed evidence is accepted.
- Evidence uses merge-ready/full-exit language without runtime proof.

## FOREMAN_INSTRUCTIONS

Foreman must distinguish harness/ledger readiness from actual deployed runtime evidence. Do not mark W8.1 fully exited unless deployed evidence is attached and accepted.

## IAA_WILL_QA

IAA will check harness coverage, evidence honesty, ECAP, Foreman QP, and any attached runtime output/screenshots/HARs.

RESULT: PREFLIGHT_BRIEF_COMPLETE
