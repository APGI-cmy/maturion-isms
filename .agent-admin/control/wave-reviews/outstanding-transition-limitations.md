# Outstanding Transition Limitations

This file tracks intentional limitations accepted during the waved governance cleanup so they are not lost before final merge validation.

```yaml
outstanding_transition_limitations:
  updated: "2026-06-16"
  applies_to_pr: 1800
  branch: "strategy/agent-governance-cleanup-waves"
  limitations:
    - id: W1-IAA-CONTRACT-BODY-CONFIRMATION
      introduced_in_wave: 1
      description: "Foreman/IAA pre-brief harmonization began as scoped overlay/protocol/schema artifacts. Wave 5 integrated the Foreman side into Tier 1/Tier 2; IAA contract-body confirmation remains part of final validation."
      planned_resolution_wave: 7
      blocking_before_final_merge: true
    - id: W4-ECAP-SCHEMA-VALIDATION-NOT-FULLY-ENFORCED
      introduced_in_wave: 4
      description: "ECAP scanner validates output claims and boundary declarations, but does not yet perform full JSON Schema validation of embedded ECAP admin validation YAML/JSON."
      planned_resolution_wave: "6-or-7"
      blocking_before_final_merge: true
    - id: W4-IAA-ECAP-CONTRACT-BODY-CONFIRMATION
      introduced_in_wave: 4
      description: "Wave 5 integrated ECAP admin-only treatment into the Foreman Tier 1/Tier 2 contract. IAA/ECAP contract-body confirmation remains part of final validation."
      planned_resolution_wave: 7
      blocking_before_final_merge: true
    - id: W6-LEGACY-EXTERNAL-CHECK-BEHAVIOR-VALIDATION
      introduced_in_wave: 6
      description: "Wave 6 maps legacy/external required checks in the manifest. Wave 7 must validate behavioral pass/fail scenarios before final merge readiness."
      planned_resolution_wave: 7
      blocking_before_final_merge: true
    - id: W6-BRANCH-PROTECTION-CONFIRMATION
      introduced_in_wave: 6
      description: "Wave 6 validates repository-file alignment, but does not query GitHub branch-protection required-check configuration. Branch protection confirmation is required before draft exit/final merge readiness."
      planned_resolution_wave: 7
      blocking_before_final_merge: true
  resolved_for_wave_progression:
    - id: W2-MERGE-GATE-INVENTORY-DEFERRED
      resolved_by:
        - ".agent-admin/control/merge-gate-required-checks.json"
        - ".github/scripts/merge-gate-required-checks-alignment.js"
        - ".github/workflows/merge-gate-required-checks-alignment.yml"
        - ".github/agents/foreman-v2-agent.md"
      resolution_scope: "Wave 6 progression; Wave 7 still validates behavior."
    - id: W3-MERGE-GATE-INVENTORY-DEFERRED
      resolved_by:
        - ".agent-admin/control/merge-gate-required-checks.json"
        - ".github/scripts/merge-gate-required-checks-alignment.js"
        - ".github/workflows/merge-gate-required-checks-alignment.yml"
        - ".github/agents/foreman-v2-agent.md"
      resolution_scope: "Wave 6 progression; Wave 7 still validates behavior."
    - id: W6-CWT-EVIDENCE-MISSING
      resolved_by:
        - ".agent-admin/control/wave-reviews/wave-6-cwt-evidence.md"
        - ".github/scripts/merge-gate-required-checks-alignment.js"
        - ".github/workflows/merge-gate-required-checks-alignment.yml"
      resolution_scope: "Wave 6 progression; Wave 7 still validates end-to-end behavior."
    - id: W5-AGCFPP-REVIEW-PENDING
      resolved_by:
        - ".agent-admin/control/wave-reviews/wave-5-foreman-contract-impact-review.md"
        - ".agent-admin/control/wave-reviews/wave-5-cs2-acceptance-note.md"
        - ".agent-admin/control/wave-reviews/wave-5-agent-contract-change-compliance-note.md"
      resolution_scope: "Wave 5 progression only; not final merge approval."
    - id: W5-TIER1-CONTROL-FIDELITY-REVIEW-PENDING
      resolved_by:
        - ".agent-workspace/foreman-v2/knowledge/foreman-control-relocation-map.md"
        - ".agent-admin/control/wave-reviews/wave-5-foreman-contract-impact-review.md"
      resolution_scope: "Wave 5 progression only; Wave 7 still validates end-to-end scenarios."
```

## Handling rule

Before final merge, every limitation above must either be resolved in its planned wave or explicitly carried forward in a CS2-approved transition note. No limitation may disappear silently.
