# Wave 7 Validation Evidence

```yaml
wave7_validation:
  wave: "Wave 7 — Validation wave"
  result: "INITIAL_VALIDATION_IMPLEMENTED"
  final_merge_ready: false
  validation_script: ".github/scripts/wave7-governance-validation.js"
  validation_workflow: ".github/workflows/wave7-governance-validation.yml"
```

## Validation scenarios

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

## Test-count reconciliation

| Count class | Count |
|---|---:|
| Planned validation scenarios | 8 |
| Executed validation scenarios | 8 |
| Expected PASS scenarios | 2 |
| Expected FAIL scenarios | 6 |
| Unresolved scenario mismatches | 0 |

## Scope

The validation harness verifies behavioral policy expectations across the Waves 1–6 controls:

- IAA pre-brief requirement;
- builder delegation requirement;
- delegation timing requirement;
- handover language gating;
- stale `handover-allowed.json` detection;
- ECAP admin validation requirement;
- required dependency files from Waves 1–6.

## Current limitation

This evidence is initial Wave 7 validation implementation. Final review still needs to confirm that the CI run is green and that branch-protection required-check configuration is either confirmed or explicitly accepted by CS2 before draft exit/final merge readiness.
