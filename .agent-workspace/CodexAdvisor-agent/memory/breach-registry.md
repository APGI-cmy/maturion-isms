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
