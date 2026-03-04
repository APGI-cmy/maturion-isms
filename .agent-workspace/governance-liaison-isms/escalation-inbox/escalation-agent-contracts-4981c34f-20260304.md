# Escalation: Agent Contract Ripple — CS2 Approval Required

## Type
BLOCKER

## Escalation ID
ESC-AGENTFILE-4981C34F-20260304

## Status
OPEN — Awaiting CS2 review and authorization

## Description
Ripple `4981c34f` (canonical commit `4981c34fb1fadf8d297723ab3660425f85f287a3`,
trigger: "Update invocation step and contract version") contains a change to
`.github/agents/CodexAdvisor-agent.md`.

Per **A-015** (FAIL-ONLY-ONCE, CS2-authorized 2026-03-04):
- `CodexAdvisor-agent.md` changes must be escalated **directly to CS2** — not routed to CodexAdvisor-agent.
- No files were layered down. This escalation documents the pending update for CS2 review.

## Context

| Field | Value |
|-------|-------|
| Session | session-046-20260304 |
| Source issue | APGI-cmy/maturion-isms#894 |
| Canonical commit | `4981c34fb1fadf8d297723ab3660425f85f287a3` |
| Trigger | `Update invocation step and contract version` |
| Agent file | `.github/agents/CodexAdvisor-agent.md` |
| Dispatch ID | `4981c34f` |

## Prior Related Escalations (same file)

| Escalation ID | Session | Canonical Commit | Status |
|--------------|---------|-----------------|--------|
| ESC-AGENTFILE-E77B00C7-20260303 | session-040 | `e77b00c7` | OPEN (CodexAdvisor-agent.md portion) |
| ESC-AGENTFILE-61AB7B83-20260304 | session-045 | `61ab7b83` | OPEN |
| ESC-AGENTFILE-4981C34F-20260304 | session-046 | `4981c34f` | OPEN (this) |

Note: The non-CodexAdvisor files from ESC-AGENTFILE-E77B00C7-20260303 and
ESC-AGENTFILE-6523FE8D-20260304 (foreman-v2-agent.md, independent-assurance-agent.md)
have been re-routed to CodexAdvisor-agent per A-015 in this session.

## Required Action

CS2 (@APGI-cmy) must:
1. Review `.github/agents/CodexAdvisor-agent.md` changes from canonical commit `4981c34f`
2. Directly authorize and apply the changes (or direct CodexAdvisor-agent under CS2 supervision)
3. Merge the resulting DRAFT PR
4. Close this escalation

## Authority
CS2 only (@APGI-cmy)

---
*Created by governance-liaison-isms session-046-20260304*
