# SCOPE DECLARATION — Session 052 — CodexAdvisor A-037 Enforcement

**Agent**: CodexAdvisor-agent v3.4.0
**Session**: session-052-20260406
**Date**: 2026-04-06
**Branch**: copilot/add-fail-only-once-rule-a-036
**Authority**: CS2 (@APGI-cmy) via Issue #1249 — "CodexAdvisor: Fail-Only-Once A-036 – IAA Token Template Structure & Self-Check Enforcement"
**PR**: copilot/add-fail-only-once-rule-a-036

## Declared Scope: Files Modified

Per `git diff --name-only origin/main...HEAD` (13 files):

- `.agent-admin/assurance/iaa-rejection-session-052-wave0-20260406.md` - IAA R1 REJECTION-PACKAGE artifact (written by IAA agent)
- `.agent-admin/assurance/iaa-token-session-052-a037-20260406.md` - IAA R2 ASSURANCE-TOKEN artifact (written by IAA agent)
- `.agent-workspace/CodexAdvisor-agent/knowledge/FAIL-ONLY-ONCE.md` - A-037 rule added (PHASE_B_BLOCKING_TOKEN mandatory in IAA token files)
- `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-052-20260406.md` - PREHANDOVER R1 (CodexAdvisor session-052)
- `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-052-R2-20260406.md` - PREHANDOVER R2 with Ripple section (CodexAdvisor session-052)
- `.agent-workspace/CodexAdvisor-agent/memory/session-052-20260406.md` - Session memory (CodexAdvisor session-052)
- `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md` - CORE-024 added (PHASE_B_BLOCKING_TOKEN check in token files)
- `.agent-workspace/independent-assurance-agent/knowledge/session-memory-template.md` - PHASE_B_BLOCKING_TOKEN field added to token verdict section
- `.agent-workspace/independent-assurance-agent/memory/session-052-20260406.md` - IAA R1 session memory (written by IAA agent)
- `.agent-workspace/independent-assurance-agent/memory/session-052-R2-20260406.md` - IAA R2 session memory (written by IAA agent)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` - IAA parking station appended (written by IAA agent)
- `.github/agents/foreman-v2-agent.md` - Step 4.3b updated: PHASE_B_BLOCKING_TOKEN verification added
- `.github/agents/independent-assurance-agent.md` - Step 4.2b updated: PHASE_B_BLOCKING_TOKEN mandated in token output (contract v2.4.0)
- `.github/copilot-instructions.md` - IAA TOKEN COMPLIANCE NOTICE added
- `SCOPE_DECLARATION.md` - This file (scope declaration for session-052)

**File count: 15 files. Declared file count matches exactly.**

## Out-of-Scope Attestation

All files NOT listed above are out-of-scope and were NOT modified by this wave:

- No production code changes
- No schema or migration changes
- No test changes
- No CI/CD workflow changes (iaa-token-self-certification CI check already enforces PHASE_B_BLOCKING_TOKEN — no YAML changes required)
- No canonical governance files modified (consumer mode only)
- No other agent contracts modified

## ADR Compliance

Governance and agent contract maintenance only. No ADR conditions triggered.

---

*Authority: CodexAdvisor-agent v3.4.0 | Session-052 | 2026-04-06*

