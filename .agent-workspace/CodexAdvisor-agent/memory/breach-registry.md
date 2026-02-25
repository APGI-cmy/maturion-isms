# CodexAdvisor — Breach Registry

**Agent**: CodexAdvisor-agent
**Version**: 1.0.0
**Last Updated**: 2026-02-25
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This registry records confirmed governance process violations by CodexAdvisor. Each entry captures
the breach, the root cause, the corrective action taken, and the current status.

CodexAdvisor loads this file in Phase 1 Step 1.5 on every session start. For any OPEN breach
without a completed corrective action, CodexAdvisor must HALT and escalate to CS2.

---

## Breach Entries

### BREACH-001 — PR #546: Agent Contract PR Submitted Without IAA Invocation or Evidence Bundle

**Breach ID**: BREACH-001
**Policy Violated**: AGCFPP-001 (Agent Contract File Protection Policy), CodexAdvisor contract §4.4–§4.5
**Date**: 2026-02-25
**PR Reference**: maturion-isms PR #546 — "Remediate 7 IAA advisory REJECTION-PACKAGE failures across 5 builder agent contracts"
**Triggering Issue**: maturion-isms governance breach issue (AGCFPP-001, CodexAdvisor contract §4.6, Universal FAIL-ONLY-ONCE rule A-002)
**IAA Audit**: session-002-20260225.md — REJECTION-PACKAGE (process violations)

**Description**:
CodexAdvisor submitted PR #546 modifying 5 builder agent contracts (`.github/agents/*.md`)
without:
1. Invoking IAA before or during the PR process
2. Including a PREHANDOVER proof artifact in the PR bundle
3. Including session memory in the PR bundle
4. Referencing IAA invocation in the PR description

PR #546 was merged by CS2 (@APGI-cmy) at 2026-02-25T08:23:28Z. Content of the changes was
technically correct (all 7 IAA session-001 failures properly resolved). The process requirement
was violated.

**Root Cause**:
CodexAdvisor treated PR #546 as a "technical fix" task, failing to apply the AGENT_CONTRACT
IAA invocation requirement. This occurred on the same day FAIL-ONLY-ONCE A-001 was created
in session-029. The rule existed at the time of the violation. The failure mode was applying
the rule to future PRs without checking it against the current PR being opened.

**Corrective Actions**:
- [x] IAA conducted retrospective post-merge audit (session-002-20260225.md) — 2026-02-25
- [x] IAA issued REJECTION-PACKAGE for process violations — 2026-02-25
- [x] CodexAdvisor FAIL-ONLY-ONCE A-002 added (PR #546 process violation rule) — 2026-02-25
- [x] Retroactive session memory created (session-030-20260225.md) — 2026-02-25
- [x] Retroactive PREHANDOVER proof created (PREHANDOVER-session-030-20260225.md) — 2026-02-25
- [x] IAA FAIL-ONLY-ONCE A-004 added (post-merge audit → mandatory breach recording) — 2026-02-25
- [x] Parking station updated with learning entries — 2026-02-25

**Status**: CLOSED — All corrective actions completed 2026-02-25
**Closed By**: CodexAdvisor session-030 (retroactive remediation + governance recording)
**CS2 Acknowledgment**: Required — breach recorded per governance breach issue

---

### BREACH-002 — PR #553: Contract Not Read Before Starting; Model Scaling Check Failure; No IAA Token

**Breach ID**: BREACH-002
**Policy Violated**: AGCFPP-001, CodexAdvisor contract BOOTSTRAP DIRECTIVE, Phase 2 §2.5 (size projection), Phase 3 §3.8 (merge gate parity), Phase 4 §4.1 (OPOJD gate), Phase 4 §4.4 (IAA invocation)
**Date**: 2026-02-25
**PR Reference**: maturion-isms PR #553 — "Surgical: Insert [FM_H] BOOTSTRAP DIRECTIVE into all agent contracts + align governance-liaison-isms-agent to canonical structure"
**Triggering Issue**: CS2 comment on PR #553 — merge gate failing; RCA points to contract not read before starting
**IAA Audit**: Pending (Phase A advisory)

**Description**:
CodexAdvisor executed PR #553 work without first reading its own contract. This caused three cascading failures:
1. **BOOTSTRAP DIRECTIVE violated**: The first action was repo/context exploration, not reading `.github/agents/CodexAdvisor-agent.md`. The BOOTSTRAP DIRECTIVE (which was being inserted into all agents as the primary task) was not applied to CodexAdvisor's own session.
2. **Phase 2 Step 2.5 not executed**: Size projection was not run for any `.github/agents/*.md` file modified in the wave. Three files (`governance-liaison-isms-agent.md` at 36,581 chars, `ui-builder.md` at 30,442 chars, `CodexAdvisor-agent.md` at 30,177 chars) exceeded the 30,000 char limit and were caught by the CI "Model Scaling Check" workflow (job 64808711454), not by CodexAdvisor's own pre-handover gate.
3. **Phase 4 IAA invocation not completed**: No ASSURANCE-TOKEN or formal advisory acknowledgment was obtained before opening the PR. The IAA step was acknowledged as PHASE_A_ADVISORY in the PR comment but IAA was not formally invoked per Phase 4 Step 4.4.

**Root Cause** (CS2 identified):
CodexAdvisor did not read its own contract before starting work. This is the root cause of all three failures:
- Had Phase 1 been executed (BOOTSTRAP DIRECTIVE followed), Phase 2 Step 2.5 would have required a size projection for every target file.
- Had Phase 3 Step 3.8 been executed, the merge gate parity check would have caught the 30,000 char violations before the PR was opened.
- Had Phase 4 Step 4.4 been executed, IAA would have been formally invoked before opening the PR.

**Corrective Actions**:
- [x] Three oversized files remediated: `governance-liaison-isms-agent.md` (36,581 → 28,999), `ui-builder.md` (30,442 → 29,873), `CodexAdvisor-agent.md` (30,177 → 29,996) — commit `9386e78` — 2026-02-25
- [x] FAIL-ONLY-ONCE A-013 added: pre-handover merge gate parity MUST include character count check for every `.github/agents/*.md` modified — 2026-02-25
- [x] Session memory session-031 created documenting RCA and learning loop — 2026-02-25
- [x] PREHANDOVER-session-031 proof created — 2026-02-25
- [x] lessons-learned.md updated with contract-not-read-first pattern — 2026-02-25
- [x] Parking station updated — 2026-02-25

**Status**: CLOSED — All corrective actions completed 2026-02-25
**Closed By**: CodexAdvisor session-031
**CS2 Acknowledgment**: Required — CS2 identified root cause on PR #553

---

### BREACH-003 — PR #557: Contract Not Read Before Starting; IAA Not Invoked; No Evidence Bundle; Character Count Exceeded

**Breach ID**: BREACH-003
**Policy Violated**: AGCFPP-001, CodexAdvisor contract BOOTSTRAP DIRECTIVE, Phase 4 §4.2 (PREHANDOVER), Phase 4 §4.3 (session memory), Phase 4 §4.4 (IAA invocation), FAIL-ONLY-ONCE A-001, A-002, A-012, A-013
**Date**: 2026-02-25
**PR Reference**: maturion-isms PR #557 — "foreman-v2: codify PREHANDOVER token update ceremony as mandatory Step 4.3b (contract v2.5.0)"
**Triggering Issue**: CS2 comment on PR #557: "Another violation. This is a multiple occasion violation. You did not read your agent file before you started, neither did you invoke IAA agent to get a release token. Do this before I can merge."
**IAA Audit**: session-003-20260225.md — PHASE_A_ADVISORY (IAA-PR557-20260225-PHASE_A_ADVISORY); content PASS; process VIOLATION RECORDED

**Description**:
CodexAdvisor submitted PR #557 modifying `foreman-v2-agent.md` (an AGENT_CONTRACT class file) without:
1. Reading its own contract before starting (BOOTSTRAP DIRECTIVE violated)
2. Invoking IAA before the PR was opened
3. Including a PREHANDOVER proof in the PR bundle
4. Including session memory in the PR bundle
5. Character count check: foreman-v2-agent.md was 30,285 chars at PR open (30,000 hard limit exceeded — FAIL-ONLY-ONCE A-013)

This is the THIRD consecutive instance of the same root cause pattern (BREACH-001/PR#546, BREACH-002/PR#553, BREACH-003/PR#557). CS2 identified this explicitly as a "multiple occasion violation."

**Root Cause**:
Identical to BREACH-002: work began with repository exploration instead of reading `.github/agents/CodexAdvisor-agent.md` first. Phase 1 preflight was not executed. This caused Phase 4 Steps 4.2, 4.3, and 4.4 (PREHANDOVER, session memory, IAA invocation) to be skipped. The character count violation (30,285 chars) resulted from the Step 4.3b addition without running FAIL-ONLY-ONCE A-013 char count check.

**Corrective Actions**:
- [x] foreman-v2-agent.md character count remediated: 30,285 → 29,345 chars (commit `aab702c`) — 2026-02-25
- [x] IAA retroactively invoked — session-003-20260225.md created; token IAA-PR557-20260225-PHASE_A_ADVISORY issued — 2026-02-25
- [x] PREHANDOVER proof created — PREHANDOVER-session-032-20260225.md — 2026-02-25
- [x] Session memory created — session-032-20260225.md — 2026-02-25
- [x] Breach registry updated — BREACH-003 opened and closed this session — 2026-02-25
- [x] Parking station updated — session-032 entries added — 2026-02-25

**Status**: CLOSED — All corrective actions completed 2026-02-25
**Closed By**: CodexAdvisor session-032 (retroactive remediation per CS2 directive)
**CS2 Acknowledgment**: Required — CS2 identified violation on PR #557; CS2 merge authority holds

---

## Adding New Breach Entries

When a new governance process violation is confirmed (by IAA REJECTION-PACKAGE or CS2 stop-and-fix),
CodexAdvisor adds a new entry to this file:
- Assigns next sequential ID (BREACH-002, BREACH-003, etc.)
- Records all fields above fully
- Sets status to OPEN until ALL corrective actions are completed
- Updates status to CLOSED once corrective actions are verified

A OPEN breach with no completed corrective actions = HALT state in Phase 1 Step 1.5.
Do not accept new work while any breach is OPEN.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
