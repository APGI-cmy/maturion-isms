# Escalation: Agent Contract Ripple — CS2 Approval Required

## Type
BLOCKER

## Escalation ID
ESC-AGENTFILE-4E2E193C-20260304

## Status
OPEN — Awaiting CS2 review and authorization

## Description
Ripple `4e2e193c` (canonical commit `4e2e193c3cfedf04441e26076759d718b92db5a3`,
trigger: "Reinstate mandatory commit step for IAA invocation") contains a change to
`.github/agents/CodexAdvisor-agent.md`.

Per **A-015** (FAIL-ONLY-ONCE v1.5.0, CS2-authorized 2026-03-04):
- `CodexAdvisor-agent.md` changes must be escalated **directly to CS2** — not routed to CodexAdvisor-agent.
- No files were layered down. This escalation documents the pending update for CS2 review.

## Context

| Field | Value |
|-------|-------|
| Session | session-047-20260304 |
| Source issue | APGI-cmy/maturion-isms#921 |
| Canonical commit | `4e2e193c3cfedf04441e26076759d718b92db5a3` |
| Trigger | `Reinstate mandatory commit step for IAA invocation` |
| Agent file | `.github/agents/CodexAdvisor-agent.md` |
| Dispatch ID | `4e2e193c` |
| Canonical contract_version | 3.2.0 |
| Local contract_version | 3.4.0 (local is NEWER than canonical) |

## Change Summary

The canonical commit modified `.github/agents/CodexAdvisor-agent.md` with 27 additions
and 27 deletions. The trigger message "Reinstate mandatory commit step for IAA invocation"
suggests the change adds back a mandatory commit step before IAA invocation in the Phase 4
handover protocol.

**Note**: Local version (3.4.0) is newer than canonical (3.2.0). This is a layer-up situation —
CS2 must determine which version is authoritative and whether a layer-up PR to
maturion-foreman-governance is required, or whether the canonical change should be merged
into the local contract.

## Prior Related Escalations (same file)

| Escalation ID | Session | Canonical Commit | Status |
|--------------|---------|-----------------|--------|
| ESC-AGENTFILE-E77B00C7-20260303 | session-040 | `e77b00c7` | OPEN |
| ESC-AGENTFILE-61AB7B83-20260304 | session-045 | `61ab7b83` | OPEN |
| ESC-AGENTFILE-4981C34F-20260304 | session-046 | `4981c34f` | OPEN |
| ESC-AGENTFILE-4E2E193C-20260304 | session-047 | `4e2e193c` | OPEN (this) |

## Required CS2 Action

CS2 (@APGI-cmy) must:
1. Review the change in canonical commit `4e2e193c3cfedf04441e26076759d718b92db5a3`
2. Determine whether local v3.4.0 or canonical v3.2.0 is the authoritative version
3. Either: (a) update local `.github/agents/CodexAdvisor-agent.md` via CodexAdvisor-agent + IAA,
   or (b) submit a layer-up PR to the canonical governance source
4. Close this escalation once resolved

## Governance References

- A-009 (FAIL-ONLY-ONCE): Agent files are escalation triggers, not layer-down targets
- A-015 (FAIL-ONLY-ONCE): CodexAdvisor-agent.md → escalate directly to CS2
- AGCFPP-001: All `.github/agents/**` changes require CodexAdvisor-agent + IAA + CS2
- CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md: Agent contract protection clause

---
*Created: 2026-03-04 | Session: session-047-20260304 | Authority: CS2 (@APGI-cmy)*
