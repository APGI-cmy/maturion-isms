---
session_id: session-062-align-tier1-20260506
pr_reviewed: "#1533 — [WIP] Align Tier 1 agent contracts with Tier 2 lifecycle and validation gates"
overlay_applied: AGENT_CONTRACT
verdict: REJECTION-PACKAGE
checks_run: "17 substance checks: 3 PASS, 14 FAIL"
learning_note: |
  NEW PATTERN — NO-REPEAT-PREVENTABLE: LOCAL-REMOTE-BRANCH-MISMATCH.
  The producing agent (CodexAdvisor via ForEman) committed 5 substantive commits
  locally but did NOT push them to the remote PR branch before invoking ECAP ceremony
  and IAA assurance. CI ran against the 4-file remote branch (not the 10-file local state).
  Result: ECAP produced ceremony artifacts against local state that CI could not validate.
  PREHANDOVER claimed merge_gate_parity: PASS against CI evidence that showed FAIL.
  Prevention action: Add mandatory pre-push verification to ceremony protocol —
  before ECAP invocation, verify `git diff origin/<branch>...HEAD` is empty.
  If any local commits are unpushed, HALT and push before proceeding.
  This pattern should be promoted to FAIL-ONLY-ONCE.md.
  
  SECONDARY PATTERN: iaa_wave_record_path / iaa_prebrief_path missing from
  wave-current-tasks.md. This is a recurring HALT-008 failure — the field must
  be populated at the same time the wave record is committed.
  
  TERTIARY PATTERN: "[WIP]" PR title retained at time of assurance invocation.
  PR title must be updated to remove WIP marker before final assurance is requested.
---
