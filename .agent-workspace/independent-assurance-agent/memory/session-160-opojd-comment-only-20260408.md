# IAA Session Memory — Session 160 | Wave opojd-comment-only-copilot-20260408

session_id: session-160-opojd-comment-only-20260408
date: 2026-04-08
pr_reviewed: copilot/fix-uninterrupted-opojd-delivery (issue #1286)
invoking_agent: foreman-v2-agent
producing_agent: foreman-v2-agent
producing_agent_class: foreman
pr_category: CI_WORKFLOW
checks_executed: 20
checks_passed: 18
checks_failed: 2
merge_gate_parity_result: FAIL (OVL-CI-001/OVL-CI-003 injection finding)
verdict: REJECTION-PACKAGE
token_reference: IAA-session-160-opojd-comment-only-copilot-20260408-REJECTION
failures_cited:
  - "OVL-CI-001/OVL-CI-003: ${{ inputs.operation }} and ${{ inputs.ref }} directly interpolated in run: block (maturion-bot-writer.yml lines 65-66). Script injection risk. Fix: use env: block."
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed: session-wave20-atomic-write-back-20260318-R2 (last ASSURANCE-TOKEN — no open rejections)
fail_only_once_rules_applied:
  - A-001: PASS — PREHANDOVER proof present with pre-populated iaa_audit_token
  - A-002: N/A — CI_WORKFLOW, not AGENT_CONTRACT
  - A-003: N/A — category unambiguous
  - A-005: PASS — no .github/agents/ changes
learning_notes:
  - "workflow_dispatch-only workflows with MATURION_BOT_TOKEN gate have low practical injection risk, but ${{ inputs.X }} in run: blocks is still a documented GitHub Actions injection pattern and must be flagged per ZERO_SEVERITY_TOLERANCE."
  - "The fix pattern (env: block) is well-established and non-breaking. Producing agents should apply it proactively for all run: blocks receiving workflow inputs."

suggestions_for_improvement:
  - "Add a pre-Brief scope blocker SB-007 in future CI_WORKFLOW waves: any workflow_dispatch with inputs must use env: blocks for run: interpolation. Document this as a standard CI governance requirement to prevent recurrence."

fail_only_once_updates: none — existing rules sufficient
