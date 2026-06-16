# Wave 6 CWT Evidence — Merge Gate Required Checks Alignment

```yaml
wave6_cwt_evidence:
  wave: "Wave 6 — Align CI gate inventory and merge gate interface"
  cwt_required_by: "governance/canon/COMBINED_TESTING_PATTERN.md"
  result: "PASS_FOR_WAVE6_PROGRESS_REVIEW"
  final_merge_ready: false
  final_merge_blockers:
    - "Wave 7 behavioral validation scenarios"
    - "Actual branch-protection required-check configuration confirmation before draft exit/final merge"
```

## CWT scope

Wave 6 CWT covers the cross-wave integration of governance controls introduced in Waves 1–6:

| Wave | Integration point validated in Wave 6 |
|---|---|
| Wave 1 | `preflight/iaa-prebrief-contract-alignment` is included in the required-check inventory. |
| Wave 2 | `preflight/foreman-prehandover-lane-gate` is included in the required-check inventory. |
| Wave 3 | `preflight/delegation-order-gate` is included in the required-check inventory. |
| Wave 4 | `preflight/ecap-admin-boundary-gate` is included in the required-check inventory. |
| Wave 5 | Foreman Tier 1 references the manifest and Wave 6 overlay. |
| Wave 6 | `preflight/merge-gate-required-checks-alignment` validates manifest/Foreman/workflow parity. |

## CWT scenarios

The alignment script now executes built-in CWT self-test scenarios when `WAVE6_ALIGNMENT_SELF_TEST=1`:

| Scenario | Expected result | Coverage |
|---|---:|---|
| happy-path-aligned-inventory | PASS | Manifest, Foreman list, mapped checks, workflow-backed checks aligned. |
| required-check-missing-from-foreman-fails | FAIL | Manifest check absent from Foreman required list blocks parity. |
| extra-foreman-check-fails | FAIL | Foreman check absent from manifest blocks parity. |
| workflow-backed-check-missing-live-job-fails | FAIL | Workflow-backed check without live workflow job blocks parity. |
| unmapped-required-check-fails | FAIL | Required check that is neither workflow-backed nor explicitly mapped blocks parity. |
| wave6-added-check-missing-from-required-list-fails | FAIL | Wave 6 cleanup gate omitted from required list blocks parity. |
| quoted-and-unquoted-workflow-job-name-parser | PASS | Parser detects quoted and unquoted workflow job names. |

## Test-count reconciliation

| Count class | Count |
|---|---:|
| Planned CWT scenarios | 7 |
| Executed CWT scenarios | 7 |
| Passing CWT scenarios | 7 |
| Failing/unresolved CWT scenarios | 0 |
| RED→GREEN fixes in correction pass | 2 |

RED→GREEN fixes:

1. Workflow job-name parser now supports quoted and unquoted `name:` values.
2. Alignment CI now runs CWT self-test scenarios via `WAVE6_ALIGNMENT_SELF_TEST=1`.

## Branch-protection limitation

Wave 6 validates repository-file alignment:

- `.agent-admin/control/merge-gate-required-checks.json`
- `.github/agents/foreman-v2-agent.md`
- `.github/workflows/*.yml` job names

It does not query GitHub branch-protection required-check configuration. That confirmation remains required before this draft PR exits draft state or before final merge readiness is declared.

## CWT verdict

```yaml
cwt_scope_defined: true
cwt_tests_executed: true
cwt_results_recorded: true
cross_wave_integration_validated: true
multi_scenario_coverage_verified: true
test_count_reconciliation_completed: true
cwt_pass: true
next_wave_allowed_after_review: true
```
