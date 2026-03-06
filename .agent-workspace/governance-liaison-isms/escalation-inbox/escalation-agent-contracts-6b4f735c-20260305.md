# Escalation: Agent Contract Ripple — CS2 Approval Required

## Type
BLOCKER

## Escalation ID
ESC-AGENTFILE-6B4F735C-20260305

## Status
OPEN — Awaiting CS2 review and authorization

## Description
Ripple `6b4f735c` (canonical commit `6b4f735c0e99341256fa7bd218f8db28681101c1`,
trigger: "Update CodexAdvisor-agent.md") contains a change to
`.github/agents/CodexAdvisor-agent.md`.

Per **A-015** (FAIL-ONLY-ONCE, CS2-authorized 2026-03-04):
- `CodexAdvisor-agent.md` changes must be escalated **directly to CS2** — not routed to CodexAdvisor-agent.
- No files were layered down. This escalation documents the pending update for CS2 review.

## Context

| Field | Value |
|-------|-------|
| Session | session-051-20260306 |
| Canonical commit | `6b4f735c0e99341256fa7bd218f8db28681101c1` |
| Trigger | `Update CodexAdvisor-agent.md` |
| Agent file | `.github/agents/CodexAdvisor-agent.md` |
| Dispatch ID | `6b4f735c` |
| Date | 2026-03-05T09:43:30Z |

## Prior Related Escalations (same file — pending CS2 resolution)

| Escalation ID | Session | Canonical Commit | Status |
|--------------|---------|-----------------|--------|
| ESC-AGENTFILE-E77B00C7-20260303 | session-040 | `e77b00c7` | OPEN |
| ESC-AGENTFILE-61AB7B83-20260304 | session-045 | `61ab7b83` | OPEN |
| ESC-AGENTFILE-4981C34F-20260304 | session-046 | `4981c34f` | OPEN |
| ESC-AGENTFILE-6B4F735C-20260305 | session-051 | `6b4f735c` | OPEN (this) |

## Required Action

CS2 (@APGI-cmy) must:
1. Review `.github/agents/CodexAdvisor-agent.md` changes from canonical commit `6b4f735c`
2. Directly authorize and apply the changes (or direct CodexAdvisor-agent under CS2 supervision)
3. Merge the resulting DRAFT PR
4. Close this escalation

## Authority
CS2 only (@APGI-cmy)

---
*Created by governance-liaison-isms session-051-20260306*
