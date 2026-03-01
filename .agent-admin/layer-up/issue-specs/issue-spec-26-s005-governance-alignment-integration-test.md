# Issue Spec: [Layer-Up] S-005 — Integration test for governance-alignment-schedule.yml drift detection

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: LOW  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 6.9 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**FAIL-ONLY-ONCE Ref**: S-005, session-051

---

## Issue Body

---

## Trigger

**Learning Promotion Threshold Met** (LAYER_UP_PROTOCOL.md Section 5.6)  
Session-051 (2026-02-23) identified that the `governance-alignment-schedule.yml` scheduled governance scan workflow lacks an integration test validating that it correctly creates a liaison issue on drift detection. This pattern applies to all consumer repos using scheduled governance alignment.

## Evidence

- **Origin**: session-051 (2026-02-23) — carry-forward improvement
- **Current state**: S-005 is OPEN in ISMS-local FAIL-ONLY-ONCE v1.8.0
- **Workflow**: `.github/workflows/governance-alignment-schedule.yml` in APGI-cmy/maturion-isms
- **Gap**: No integration test validates end-to-end: scheduled trigger → drift detection → liaison issue creation

## Current Governance State

The `governance-alignment-schedule.yml` workflow is operational in maturion-isms but lacks integration test coverage. The workflow's primary function (creating liaison issues when governance drift is detected) is untested. Other consumer repos implementing this workflow pattern have no canonical integration test specification to follow.

## Observed Gap/Conflict/Failure

Without an integration test for the governance alignment schedule:
1. Drift detection failures are silent — the scheduled workflow may fail without generating alerts
2. No canonical specification exists for how to verify governance alignment automation is working
3. Consumer repos implementing the pattern cannot verify their implementations without building tests from scratch

## Proposed Governance Improvement

Add canonical integration test specification to governance documentation:
1. Document required integration test for `governance-alignment-schedule.yml` (or equivalent consumer repo scheduled governance scan):
   - Mock: canonical source with a known governance artifact at version N
   - Mock: consumer repo local copy at version N-1 (drift condition)
   - Trigger: scheduled scan workflow run
   - Expected: workflow creates liaison issue with correct `layer-down` label and drift details
   - Verify: liaison issue body contains correct artifact reference and version delta
2. Add this integration test specification to `GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md` (or equivalent)
3. Update `governance-alignment-schedule.yml` workflow template (candidate 4.2 / governance-ripple-sync) to include reference to test specification

**Breaking change**: NO — documentation of test requirement; does not invalidate existing implementations.

## Impact Assessment

- **Scope**: All consumer repositories using scheduled governance alignment workflows
- **Urgency**: LOW — scheduled alignment works in practice; test coverage is a quality improvement
- **Ripple required**: NO — documentation change; consumer repos add tests at own pace
- **Conflict signal**: NONE — new test specification, no conflict

---

Reference: APGI-cmy/maturion-isms#707
