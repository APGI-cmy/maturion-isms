# IAA Session Memory — CL-10 Routing Governance R2 ASSURANCE-TOKEN

```yaml
session_id: session-cl10-routing-governance-20260405-R2
date: 2026-04-05
pr_reviewed: "copilot/cl-10-routing-governance-ci-enforcement (Wave CL-10 — LKIAC-L4, issue #1227, Round R2)"
invoking_agent: foreman-v2-agent
producing_agent: "qa-builder (D1), integration-builder (D2+D3)"
producing_agent_class: builder
pr_category: "CI_WORKFLOW (primary) + AAWP_MAT (D1 test)"
checks_executed: 28
checks_passed: 28
checks_failed: 0
merge_gate_parity_result: PASS
verdict: ASSURANCE-TOKEN
token_reference: IAA-session-cl10-routing-governance-20260405-R2-PASS
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
phase_b_blocking_token: PASS
prior_sessions_reviewed:
  - session-wave20-atomic-write-back-20260318-R2 (ASSURANCE-TOKEN)
  - session-wave20-atomic-write-back-20260318 (REJECTION-PACKAGE)
  - session-wave19-orchestration-20260317-R2 (REJECTION-PACKAGE)
  - session-wave19-orchestration-20260317 (REJECTION-PACKAGE)
  - session-wave18-postmerge-hotfix-20260315-AUDIT (REJECTION-PACKAGE)
  - session-cl10-routing-governance-20260405 (R1 REJECTION-PACKAGE — 6 failures; all resolved)
fail_only_once_rules_applied:
  - "A-001: invocation evidence present — PASS"
  - "A-002: no class exemption — PASS"
  - "A-033: all artifacts in git — PASS (R1 pattern resolved)"
learning_notes:
  - "R1→R2 fix was clean. Ceremony-commit-then-invoke discipline internalised."
  - "S-033 exception correctly applied: all 3 conditions met, D2 path trigger acknowledged."
  - "Technical delivery was never at issue — 9/9 tests GREEN in both R1 and R2."
suggestions_for_improvement: "Pre-IAA ceremony checklist: foreman should run git ls-files on SCOPE_DECLARATION entries before invoking IAA to prevent A-033 recurrence."
fail_only_once_updates: none
```
