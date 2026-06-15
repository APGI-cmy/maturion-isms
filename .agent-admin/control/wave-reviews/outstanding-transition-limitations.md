# Outstanding Transition Limitations

This file tracks intentional limitations accepted during the waved governance cleanup so they are not lost before final merge validation.

```yaml
outstanding_transition_limitations:
  updated: "2026-06-15"
  applies_to_pr: 1800
  branch: "strategy/agent-governance-cleanup-waves"
  limitations:
    - id: W1-CONTRACT-OVERLAY-NOT-BODY
      introduced_in_wave: 1
      description: "Foreman/IAA pre-brief harmonization began as scoped overlay/protocol/schema artifacts. Wave 5 integrated the Foreman side into Tier 1/Tier 2; IAA contract-body integration still needs final review/confirmation before merge."
      planned_resolution_wave: "5-review-or-7"
      blocking_before_final_merge: true
    - id: W2-MERGE-GATE-INVENTORY-DEFERRED
      introduced_in_wave: 2
      description: "preflight/foreman-prehandover-lane-gate exists as a required-check candidate, but merge-gate required-check inventory alignment is deferred."
      planned_resolution_wave: 6
      blocking_before_final_merge: true
    - id: W3-MERGE-GATE-INVENTORY-DEFERRED
      introduced_in_wave: 3
      description: "preflight/delegation-order-gate exists as a required-check candidate, but merge-gate required-check inventory alignment is deferred."
      planned_resolution_wave: 6
      blocking_before_final_merge: true
    - id: W4-ECAP-SCHEMA-VALIDATION-NOT-FULLY-ENFORCED
      introduced_in_wave: 4
      description: "ECAP scanner validates output claims and boundary declarations, but does not yet perform full JSON Schema validation of embedded ECAP admin validation YAML/JSON."
      planned_resolution_wave: "6-or-7"
      blocking_before_final_merge: true
    - id: W4-CONTRACT-BODY-INTEGRATION-DEFERRED
      introduced_in_wave: 4
      description: "Wave 5 integrated ECAP admin-only treatment into the Foreman Tier 1/Tier 2 contract. IAA/ECAP contract-body confirmation still requires review before final merge."
      planned_resolution_wave: "5-review-or-7"
      blocking_before_final_merge: true
    - id: W5-AGCFPP-REVIEW-PENDING
      introduced_in_wave: 5
      description: "Foreman agent contract body was rewritten in Wave 5. CodexAdvisor review or CS2-approved equivalent, IAA impact review, and CS2 acceptance are required before this PR leaves draft or merges."
      planned_resolution_wave: "5-review"
      blocking_before_final_merge: true
    - id: W5-TIER1-CONTROL-FIDELITY-REVIEW-PENDING
      introduced_in_wave: 5
      description: "The relocation map now records fidelity levels, but Wave 5 still requires final review to confirm summarized controls preserve mandatory behavior."
      planned_resolution_wave: "5-review"
      blocking_before_final_merge: true
```

## Handling rule

Before final merge, every limitation above must either be resolved in its planned wave or explicitly carried forward in a CS2-approved transition note. No limitation may disappear silently.
