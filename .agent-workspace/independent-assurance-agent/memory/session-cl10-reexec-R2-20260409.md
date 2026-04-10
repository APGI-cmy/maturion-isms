# IAA Session Memory — Wave CL-10 (Re-execution) R2

```yaml
session_id: session-cl10-reexec-R2-20260409
date: 2026-04-09
pr_reviewed: "copilot/cl-10-routing-governance-ci-enforcement-again (Wave CL-10 Re-execution, Issue maturion-isms#1313, Round R2)"
invoking_agent: foreman-v2-agent
producing_agent: "integration-builder (CL-10-D2 workflow + tests), foreman-v2-agent (ceremony artifacts)"
producing_agent_class: "builder / foreman"
pr_category: "CI_WORKFLOW (primary) + AAWP_MAT (secondary)"
checks_executed: 36
checks_passed: 36
checks_failed: 0
merge_gate_parity_result: PASS
verdict: ASSURANCE-TOKEN
token_reference: IAA-session-cl10-reexec-R2-20260409-PASS
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
phase_b_blocking_token: IAA-session-cl10-reexec-R2-20260409-PASS
prior_sessions_reviewed:
  - session-cl10-routing-governance-20260405-R2 (ASSURANCE-TOKEN — prior CL-10 wave)
  - session-wave20-atomic-write-back-20260318-R2 (ASSURANCE-TOKEN)
  - session-wave20-atomic-write-back-20260318 (REJECTION-PACKAGE)
  - session-wave19-orchestration-20260317-R2 (REJECTION-PACKAGE)
  - session-wave19-orchestration-20260317 (REJECTION-PACKAGE)
fail_only_once_rules_applied:
  - "A-001: invocation evidence present — PASS (CI_WORKFLOW PR; both PREHANDOVERs have iaa_audit_token)"
  - "A-002: no class exemption — PASS"
  - "A-026: SCOPE_DECLARATION parity — PASS (R1 finding CONFIRMED RESOLVED at SHA 0cd10aa0; 12/12 files match)"
  - "A-033: all artifacts in git — PASS (11/11 bundle files verified via git show)"
  - "A-031: IAA ceremony artifact carve-out — PASS (token file correctly pre-declared as exempt)"
failures_cited: none
r1_finding_resolution:
  finding: "HFMC-02 / A-026 — 4 Foreman ceremony files absent from SCOPE_DECLARATION.md"
  fix_sha: "0cd10aa0"
  fix_description: "Root SCOPE_DECLARATION.md updated to list all 12 wave files; PREHANDOVER R2 issued"
  iaa_verification: "CONFIRMED — 12-file diff matches exactly 12 files declared in root SCOPE_DECLARATION.md"
learning_notes:
  - "R1→R2 fix was clean and complete. Root SCOPE_DECLARATION.md update correctly addresses A-026 finding."
  - "Integration-builder PREHANDOVER contained the ripple assessment (HFMC-01) — this is appropriate for the substantive delivery PREHANDOVER. Foreman orchestration PREHANDOVER need not duplicate it."
  - "yaml.safe_load in Python parses YAML 1.1 'on:' key as Python boolean True. IAA must use doc.get(True, {}) not doc.get('on', {}) when checking GitHub Actions triggers. Noted for future workflow audits."
  - "stub-detection-check.yml already pre-emptively excluded routing-governance-ci.test.ts from stub scanning — shows CI hygiene from prior waves. CORE-023 check benefited from this."
  - "S-033 exception correctly invoked with all 3 conditions documented. Pattern holds for additive new workflow PRs."
  - "R1 PREHANDOVER superseded by R2: both remain in diff per A-029 (immutability). R2 is operative PREHANDOVER. This is architecturally correct."
fail_only_once_updates: none
suggestions_for_improvement:
  - "Minor: wave-current-tasks.md T8 checkbox was not ticked after R2 PREHANDOVER commit (SHA 22057946). Foreman should tick T8 in the same commit that delivers the R2 PREHANDOVER to maintain accurate status tracking in ceremony records. Recommend Foreman add this to pre-IAA ceremony checklist."
  - "Structural observation: The R1 rejection was resolved via a fresh R2 PREHANDOVER rather than a committed R1 rejection token file. For CI_WORKFLOW PRs this is acceptable, but for agent contract PRs the R1 rejection token file would be mandatory evidence under A-001. Existing FAIL-ONLY-ONCE rules adequately cover this distinction."
```
