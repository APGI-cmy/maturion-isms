# IAA Session Memory — session-054-reaudit-20260403-R3

## Session Identification
- session_id: session-054-reaudit-20260403-R3
- date: 2026-04-03
- pr_reviewed: "Branch copilot/layer-down-propagate-governance-changes-another-one (HEAD: be9941f) — layer-down FRS_TEMPLATE, TRS_TEMPLATE, minimum-architecture-template (governance-liaison-isms session-054), 3rd IAA invocation"
- invoking_agent: governance-liaison-isms (3rd invocation after 2nd REJECTION-PACKAGE)
- producing_agent: governance-liaison-isms-agent
- producing_agent_class: liaison
- pr_category: CANON_GOVERNANCE
- checks_executed: 26
- checks_passed: 25
- checks_failed: 1
- merge_gate_parity_result: FAIL
- verdict: REJECTION-PACKAGE
- token_reference: N/A (REJECTION)
- rejection_reference: IAA-session-054-reaudit-20260403-R3-REJECTION
- adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

## Failures Cited

MERGE-GATE-PARITY / A-026 (THIRD OCCURRENCE): SCOPE_DECLARATION.md wrong format.

Root cause: The fix in commit be9941f updated content but used numbered-list + em-dash format:
  `1. \`path\` — Description`
The validate-scope-to-diff.sh parser requires hyphen-bullet + hyphen format:
  `- \`path\` - Description`
Script exits code 1. 13 files in diff; 0 properly parseable declarations.

Secondary: Even with correct format, 13 files in diff (original 9 + SCOPE_DECLARATION.md itself + 3 IAA-written files from 2nd invocation). All 13 must be declared.

## Prior Sessions Reviewed
- session-054-reaudit-20260403 (2nd invocation — REJECTION-PACKAGE, A-026 SCOPE_DECLARATION 0 files)
- session-wave20-atomic-write-back-20260318-R2
- session-wave20-atomic-write-back-20260318
- session-wave19-orchestration-20260317-R2
- session-wave19-orchestration-20260317

## Open REJECTION-PACKAGEs
- iaa-rejection-session-054-reaudit-20260403.md (2nd invocation — superseded by this)
- iaa-rejection-session-054-reaudit-20260403-R3.md (this invocation — current)

## FAIL-ONLY-ONCE Rules Applied
- A-001 (IAA invocation evidence): PRESENT — PREHANDOVER has valid pre-populated token per A-029 — PASS
- A-002 (no class exceptions): CONFIRMED — PASS
- A-026 (SCOPE_DECLARATION match): FAIL — script exits code 1; format mismatch (numbered list vs bullet); 13 files in diff vs 0 parseable declarations

## Learning Notes

1. **Third consecutive A-026 failure — pattern escalation**: This is now the 3rd invocation failing A-026. Root cause progression:
   - Invocation 1: SCOPE_DECLARATION.md not created at all
   - Invocation 2: SCOPE_DECLARATION.md created with correct content but old (mmm-gov-gaps) format (0 files for this PR)
   - Invocation 3: SCOPE_DECLARATION.md updated with correct files but WRONG FORMAT (numbered list vs bullet). The format mismatch is subtle — the content looks correct visually, but the machine parser cannot extract it.

2. **Format is load-bearing**: The validate-scope-to-diff.sh parser requires EXACTLY `- \`path\` - Description` (hyphen bullet, backtick, space-hyphen-space). Any variation (numbered list, em-dash, different bullet) = 0 declarations extracted. This is not obvious from the SCOPE_DECLARATION.md template header.

3. **IAA artifact accumulation pattern**: Each IAA invocation adds files to the branch. The SCOPE_DECLARATION.md becomes stale after each IAA invocation. The validate-scope-to-diff.sh script does exact matching and has no IAA-file carve-out. This creates a maintenance cycle where SCOPE_DECLARATION.md must be updated AFTER each IAA invocation that adds files, and then IAA must be re-invoked again. This is a structural governance gap.

4. **Substantive quality is high**: All 25 non-scope checks pass. Template SHA256 hashes correct. Governance inventory correct. This PR is substantively ready — only the format/count of SCOPE_DECLARATION is blocking.

## Fail-Only-Once Updates
Recommend adding to FAIL-ONLY-ONCE.md (for CS2 consideration):
- New rule capturing: "SCOPE_DECLARATION.md must use hyphen-bullet format exactly as required by parser — numbered lists are rejected"
- New rule capturing: "IAA-written artifacts accumulate in diff across invocations; SCOPE_DECLARATION.md must be updated after each IAA rejection before re-invocation"

## Suggestions for Improvement (MANDATORY — must not be blank)

1. **Primary**: CS2 should raise a governance issue to add an IAA-file exclusion pattern to validate-scope-to-diff.sh. Files in `.agent-admin/assurance/iaa-*` and `.agent-workspace/independent-assurance-agent/` are written by IAA (not the producing agent) and should be excludable from the scope check by the script itself, not by requiring the producing agent to declare IAA's own work.

2. **Secondary**: The SCOPE_DECLARATION_TEMPLATE.md should prominently call out the exact format required by validate-scope-to-diff.sh, including a "WRONG" vs "CORRECT" example showing numbered list vs bullet format.

3. **Tertiary**: governance-liaison-isms agent should add an explicit validation step: "Run ./github/scripts/validate-scope-to-diff.sh locally — confirm exit code 0" as the final step before IAA invocation. Exit code checking prevents format failures.
