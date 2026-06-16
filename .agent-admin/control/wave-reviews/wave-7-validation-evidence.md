# Wave 7 Validation Evidence

```yaml
wave7_validation:
  wave: "Wave 7 — Validation wave"
  result: "CWT_VALIDATION_IMPLEMENTED"
  final_merge_ready: false
  validation_script: ".github/scripts/wave7-governance-validation.js"
  validation_workflow: ".github/workflows/wave7-governance-validation.yml"
```

## Policy-model validation scenarios

| # | Scenario | Expected |
|---:|---|---|
| 1 | Foreman-only governance/doc change with no implementation files | PASS |
| 2 | Builder implementation change with valid pre-brief and ordered delegation | PASS |
| 3 | Implementation change with missing builder delegation | FAIL |
| 4 | Implementation change with retroactive delegation | FAIL |
| 5 | Handover language without `handover-allowed.json` | FAIL |
| 6 | Stale `handover-allowed.json` where HEAD does not match | FAIL |
| 7 | ECAP admin validation missing while required | FAIL |
| 8 | IAA pre-brief missing for implementation change | FAIL |

## Real-gate fixture validation scenarios

The Wave 7 validation script now creates temporary fixture repositories/artifacts and invokes the actual gate scripts:

| # | Gate fixture | Expected | Actual gate exercised |
|---:|---|---|---|
| G1 | Valid ordered delegation proof | PASS | `.github/scripts/delegation-order-gate.js` |
| G2 | Implementation change with missing delegation control | FAIL | `.github/scripts/delegation-order-gate.js` |
| G3 | Retroactive/same-commit delegation proof | FAIL | `.github/scripts/delegation-order-gate.js` |
| G4 | Implementation-only change with no handover claim | PASS | `.github/scripts/foreman-prehandover-lane-gate.js` |
| G5 | Handover language with missing `handover-allowed.json` | FAIL | `.github/scripts/foreman-prehandover-lane-gate.js` |
| G6 | Handover language with stale `handover-allowed.json` | FAIL | `.github/scripts/foreman-prehandover-lane-gate.js` |
| G7 | ECAP required but admin validation missing | FAIL | `.github/scripts/foreman-prehandover-lane-gate.js` |
| G8 | Valid ECAP admin-only output | PASS | `.github/scripts/ecap-admin-boundary-gate.js` |
| G9 | ECAP readiness/assurance overstep output | FAIL | `.github/scripts/ecap-admin-boundary-gate.js` |
| G10 | Current branch required-check alignment | PASS | `.github/scripts/merge-gate-required-checks-alignment.js` |

## Test-count reconciliation

| Count class | Count |
|---|---:|
| Planned policy scenarios | 8 |
| Executed policy scenarios | 8 |
| Expected policy PASS scenarios | 2 |
| Expected policy FAIL scenarios | 6 |
| Planned real-gate fixture scenarios | 10 |
| Executed real-gate fixture scenarios | 10 |
| Expected real-gate PASS scenarios | 4 |
| Expected real-gate FAIL scenarios | 6 |
| Unresolved scenario mismatches | 0 |

## Scope

The validation harness verifies behavioral policy expectations and actual gate behavior across the Waves 1–6 controls:

- IAA pre-brief requirement;
- builder delegation requirement;
- delegation timing requirement;
- implementation-only work is not blocked by pre-handover approval before handover is attempted;
- handover language gating;
- stale `handover-allowed.json` detection;
- ECAP admin validation requirement;
- ECAP admin-only output boundary;
- required-check inventory alignment;
- required dependency files from Waves 1–6.

## Current limitation

Final review still needs to confirm that the CI run is green and that branch-protection required-check configuration is either confirmed or explicitly accepted by CS2 before draft exit/final merge readiness.
