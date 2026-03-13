# IAA Session Memory — Wave CL-4 AIMC Audit Phase A — R3 Final — 2026-03-13

```yaml
session_id: session-wave-cl-4-aimc-audit-phase-a-20260313-R3
date: 2026-03-13
pr_reviewed: "copilot/cl-4-launch-audit-verification — Wave CL-4 AIMC Audit Phase A (R3 Final)"
pr_branch: copilot/cl-4-launch-audit-verification
invoking_agent: foreman-v2-agent
producing_agent: foreman-v2-agent
producing_agent_class: foreman
pr_category: EXEMPT (verified correct)
checks_executed: 26
checks_passed: 26
checks_failed: 0
merge_gate_parity_result: PASS
verdict: ASSURANCE-TOKEN
token_reference: IAA-session-wave-cl-4-aimc-audit-phase-a-20260313-R3-PASS
token_file: .agent-admin/assurance/iaa-token-session-wave-cl-4-aimc-audit-phase-a-20260313-R3.md
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave-cl-4-aimc-audit-phase-a-20260313-R2 (REJECTION-PACKAGE — A-026/A-031 carve-out absent)
  - session-wave-cl-4-aimc-audit-phase-a-20260313 (R1 — REJECTION-PACKAGE — A-026/A-028)
  - session-wave16-full-batch-20260310
  - session-wave16-orchestration-20260309-R2
  - session-waveOVLINJ-20260307
fail_only_once_rules_applied:
  - A-001: PASS — IAA invocation evidence present
  - A-002: PASS — N/A (EXEMPT PR)
  - A-021: PASS — committed before invocation (HEAD 9bee344)
  - A-022: PASS — trigger categories re-evaluated
  - A-026: PASS — 12/12 diff files accounted (7 table + 3 explicit A-031 + 2 implicit R2 A-031)
  - A-028: PASS — format compliant, no stale entries
  - A-029: PASS — PREHANDOVER immutable, token pre-populated
  - A-030: PASS — re-invocation carve-out applied
  - A-031: PASS — carve-out note present; R1 (3) + R2 (2) IAA ceremony files all covered
learning_notes: |
  A-031 carve-out notes should use blanket language ("all IAA ceremony artifacts from
  all prior rejection ceremonies on this branch") rather than enumerating by round.
  Each rejection adds new IAA ceremony files — explicit enumeration creates cascading
  update cycles. A-031's trigger is note PRESENCE, not exhaustive enumeration.
fail_only_once_updates: none
suggestions_for_improvement: |
  Continuous improvement: A-031 carve-out template language should be standardised to
  "all IAA ceremony artifacts from all prior rejection ceremonies on this branch are
  excluded per A-031" — single statement covers all rounds without per-round re-enumeration.
```
