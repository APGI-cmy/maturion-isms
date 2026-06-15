# Wave Review Gate — Wave 2

```yaml
wave_review_gate:
  wave: "Wave 2 — Introduce pre-handover lane gate"
  objective_met: true
  exit_criteria_met: true
  overreach_checked: true
  overreach_found: true
  correction_applied: true
  unresolved_drift:
    - "Foreman contract body was not edited in Wave 2; the scoped overlay is the intentional pre-Wave-5 contract reference."
    - "Merge-gate required-check inventory is not updated in Wave 2; it remains scheduled for Wave 6."
  control_deletions_relocated: not_applicable
  rollback_or_correction_needed: false
  next_wave_allowed: true
  reviewer: "ChatGPT / CS2-directed cleanup review"
  date: "2026-06-15"
```

## Review notes

Initial Wave 2 implementation was too broad because the lane-gate script scanned the full repository and treated existing implementation files/docs as gate-relevant. That would have made normal CI noisy.

Correction applied:

- Scoped the gate script to PR changed files.
- Scoped completion-language scanning to changed Foreman/ECAP handover artifacts.
- Required `builder_delegation_verified` and `delegation_precedes_implementation` only when implementation files changed.
- Compared `current_head_sha` to the PR head SHA rather than a synthetic pull-request merge SHA.
- Clarified the Wave 2 overlay to document changed-file scope.

Exit criteria status:

- Gate catches stale/missing handover allowance before final handover: true.
- Gate is visible as named required-check candidate: `preflight/foreman-prehandover-lane-gate`.
- Foreman contract points to the gate before Phase 4 handover: satisfied by scoped Wave 2 overlay until Wave 5 integrates or relocates contract text.
- Wave Review Gate recorded before Wave 3 starts: true.

Wave 3 may begin after CS2 accepts this correction posture.
