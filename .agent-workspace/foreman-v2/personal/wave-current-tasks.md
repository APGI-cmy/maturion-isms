# Wave Current Tasks — Issue 1286

wave: opojd-comment-only-copilot-20260408
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-wave1286-opojd-20260408.md

## Active Wave: opojd-comment-only-copilot-20260408

### Wave Description
Align repo to strict comment-only Copilot model — remove write-back assumptions from
copilot-setup-steps.yml, declare COPILOT_SESSION_MODE/PUSH_DISABLED_INTENTIONAL/OUTPUT_MODE,
and create a separate maturion-bot-writer.yml for future bot write operations.

CS2 Authorization: Issue maturion-isms#1286 opened by @APGI-cmy (CS2 = Johan Ras) and assigned to
foreman-v2-agent (Copilot). Issue author is CS2 (Johan Ras / @APGI-cmy).

### Tasks
- [x] IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-wave1286-opojd-20260408.md
- [ ] OPOJD-001: Modify .github/workflows/copilot-setup-steps.yml — comment-only mode,
      remove fallback token, remove git-identity step, add session-mode env vars
- [ ] OPOJD-002: Create .github/workflows/maturion-bot-writer.yml — separate bot write
      workflow, explicit write permissions, fail-fast on missing token, no fallback
- [ ] PREHANDOVER proof: .agent-admin/assurance/PREHANDOVER-session-160-wave-opojd-20260408.md
- [ ] Session memory: .agent-workspace/foreman-v2/memory/session-160-opojd-comment-only-20260408.md
- [ ] IAA final audit and token

### IAA Pre-Brief Summary (from iaa-prebrief-wave1286-opojd-20260408.md)
- Trigger Category: CI_WORKFLOW — MANDATORY
- Qualifying Tasks: OPOJD-001, OPOJD-002
- Scope Blockers: SB-001 through SB-006
- OVL-CI-005 S-033 exception applies — three substitutes required
- BUILD_DELIVERABLE overlay: NOT APPLICABLE

### Previous Wave (Closed)
wave: mmm-39b-frs-derivation-fix (Issue #1277) — COMPLETE, awaiting CS2 merge
