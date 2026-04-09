# IAA Session Memory — session-061-assurance-20260409

## Agent
- session_id: session-061-assurance-20260409
- date: 2026-04-09
- pr_reviewed: branch copilot/layer-down-propagate-governance-changes-ebeedb3e-5f72-49ea-bcee-273101606d0f
- invoking_agent: governance-liaison-isms (via user invocation)
- producing_agent: governance-liaison-isms
- producing_agent_class: liaison
- pr_category: LIAISON_ADMIN
- checks_executed: 19
- checks_passed: 17
- checks_failed: 2
- merge_gate_parity_result: FAIL — PREHANDOVER proof absent
- verdict: REJECTION-PACKAGE
- token_reference: REJECTION-IAA-session-061-wave-ripple-f5b61144-20260409-FAIL
- adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
- prior_sessions_reviewed: session-wave20-atomic-write-back-20260318-R2, session-wave20-atomic-write-back-20260318, session-wave19-orchestration-20260317-R2, session-wave19-orchestration-20260317, session-wave18-postmerge-hotfix-20260315-AUDIT
- fail_only_once_rules_applied: A-001, A-002, A-015, A-029
- failures_cited:
    - CORE-018: PREHANDOVER proof absent from branch
    - CORE-007/governance-misalignment: session memory incorrectly asserts PHASE_A_ADVISORY when IAA is PHASE_B_BLOCKING

## learning_notes

1. LIAISON_ADMIN PRs for governance-tracking-only ripple events are recurring. Agents consistently omit the PREHANDOVER proof on the grounds that "no PR is required." Clarification needed: the PREHANDOVER proof is required for IAA invocation ceremony regardless of whether a layer-down PR is raised. The ceremony is about the TRACKING commit, not the absence of a layer-down PR.

2. The liaison agent asserting `iaa_invocation_result: PHASE_A_ADVISORY` in session memory is a recurring pattern (check prior sessions). The agent does not control IAA's adoption phase. Session memory should record `iaa_audit_token: <expected-ref>` only; the actual result is determined by IAA.

## fail_only_once_updates
none — patterns noted above are candidates for promotion if they recur in next session

## Suggestions for Improvement

Both failures are correctable in a single remediation commit. The substantive governance work (A-015 compliance, sync_state.json accuracy, GOVERNANCE_ALIGNMENT_INVENTORY.json update) is of good quality. Recommend adding a PREHANDOVER proof template to the liaison agent's knowledge base for tracking-only ripple sessions to prevent recurrence.
