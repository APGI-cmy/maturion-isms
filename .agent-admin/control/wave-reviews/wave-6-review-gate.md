# Wave Review Gate — Wave 6

```yaml
wave_review_gate:
  wave: "Wave 6 — Align CI gate inventory and merge gate interface"
  objective_met: true
  exit_criteria_met: true
  cwt_applied: true
  cwt_pass_for_progression: true
  overreach_checked: true
  overreach_found: true
  correction_applied: true
  final_merge_ready: false
  final_merge_blockers:
    - "Wave 7 behavioral validation scenarios"
    - "GitHub branch-protection required-check configuration confirmation before draft exit/final merge readiness"
  unresolved_drift:
    - "Legacy/external mapped required checks still require behavioral pass/fail validation in Wave 7."
    - "Branch protection was not queried by Wave 6 repository-file alignment tooling."
    - "ECAP embedded YAML/JSON full schema validation remains tracked for Wave 7/final validation."
  control_deletions_relocated: not_applicable
  rollback_or_correction_needed: false
  next_wave_allowed: true
  reviewer: "ChatGPT / CS2-directed cleanup review"
  date: "2026-06-16"
```

## Review notes

Wave 6 aligns Foreman `merge_gate_interface.required_checks` with a required-check manifest and a live workflow-backed alignment gate.

Initial critical review under CWT found that Wave 6 proved structural inventory parity but did not yet include CWT-style cross-wave scenario evidence. The correction pass added CWT self-test scenarios, robust quoted/unquoted workflow job-name parsing, explicit CWT evidence, and test-count reconciliation.

## Correction applied

The correction pass:

- updated `.github/scripts/merge-gate-required-checks-alignment.js` to run CWT self-tests when `WAVE6_ALIGNMENT_SELF_TEST=1`;
- added failure scenarios for manifest/Foreman drift, missing live workflow jobs, unmapped required checks, and missing Wave 6 added checks;
- added parser coverage for quoted and unquoted workflow job names;
- updated `.github/workflows/merge-gate-required-checks-alignment.yml` to run self-tests in CI;
- added `.agent-admin/control/wave-reviews/wave-6-cwt-evidence.md` with CWT scope, scenario results, and test-count reconciliation;
- recorded branch-protection confirmation as a final-merge blocker rather than pretending repository-file alignment queries GitHub branch protection.

## Exit criteria status

- New pre-handover lane gate is included in required checks: true.
- Delegation-order gate is included in required checks: true.
- ECAP admin boundary gate is included in required checks: true.
- IAA pre-brief contract alignment gate is included in required checks: true.
- Required-check alignment gate is included in required checks: true.
- Old/mapped checks are explicitly mapped or workflow-backed: true.
- Required checks are named consistently across Foreman, manifest, and workflow-backed job names: true.
- CWT evidence recorded before Wave 7 starts: true.

## Decision

Wave 6 is complete for progression. Wave 7 may begin.

This is not final merge approval. Final readiness still depends on Wave 7 behavioral validation scenarios and branch-protection confirmation.
