# Escalation: Agent Contract Files — Ripple b54d57b5 (2026-04-08)

**Type**: AUTHORITY_BOUNDARY  
**Date**: 2026-04-08  
**Raised by**: governance-liaison-isms-agent (session-059-20260408)  
**Authority required**: CS2 (Johan Ras) + CodexAdvisor-agent  
**Rule**: A-009, A-015  
**Status**: PARTIALLY COMPLETE — foreman-v2-agent changes applied; CS2-only decisions and IAA verdict still pending  

---

## Context

Canonical commit `b54d57b5864a4df67f5bc44323ebde3807192c39` (trigger: `Merge pull request -1330 from APGI-cmy-copilot-governance-harden-pre-iaa-handover`, 2026-04-08T10:58:14Z) changed the following agent contract files in the canonical source:

| File | Action required |
|------|----------------|
| `.github/agents/CodexAdvisor-agent.md` | **CS2 only** — per A-015(1) |
| `.github/agents/foreman-v2.agent.md` (canonical) → `.github/agents/foreman-v2-agent.md` (local) | **CodexAdvisor-agent + IAA + CS2** — per A-015(2) |
| `.github/agents/governance-repo-administrator-v2.agent.md` | **CS2 only** — file not present locally; CS2 to decide if introduction to maturion-isms is required |

---

## Why This Was Not Layered Down Automatically

Per **A-009** (Agent File Write Prohibition):
> I NEVER modify any file under `.github/agents/**`. Ripple payloads containing `.github/agents/**` paths are escalation triggers, not layer-down targets.

Per **A-015** (Agent File Routing):
> For CodexAdvisor-agent.md → escalate to CS2 only.
> For all other `.github/agents/*.md` → invoke CodexAdvisor-agent via `task(agent_type: "CodexAdvisor-agent")`.

The CI workflow (`align-governance.sh`) correctly filtered these files and only layered down `governance/canon/AGENT_HANDOVER_AUTOMATION.md` via PR #1294 (auto-merged 2026-04-08T11:09:32Z).

---

## What Changed in Canonical Source

The canonical trigger was "governance-harden-pre-iaa-handover". Based on changes to `AGENT_HANDOVER_AUTOMATION.md` (v1.1.5 → v1.2.0), the agent contracts were likely updated to:

1. Add **§4.3c Pre-IAA Commit-State Gate** requirement to Phase 4 handover sequence
2. Update advisory_phase declaration from `PHASE_A_ADVISORY` to `PHASE_B_BLOCKING` where applicable
3. Add pre-IAA commit hygiene requirements per AGENT_HANDOVER_AUTOMATION.md v1.2.0

---

## Required Actions

### For CodexAdvisor-agent.md:
- **CS2 direct action** required  
- CS2 to review canonical changes and determine authoritative update for local `.github/agents/CodexAdvisor-agent.md`
- Escalation ref: `ESC-AGENTFILE-B54D57B5-CA-20260408`

### For foreman-v2-agent.md:
- **CodexAdvisor-agent + IAA + CS2** required  
- CodexAdvisor-agent invoked in session-059 per A-015(2)  
- CodexAdvisor-agent to review canonical `foreman-v2.agent.md` changes and apply updates to local `.github/agents/foreman-v2-agent.md`
- Escalation ref: `ESC-AGENTFILE-B54D57B5-FV2-20260408`

### For governance-repo-administrator-v2.agent.md:
- **CS2 decision required** — file not present in this consumer repository  
- CS2 to determine if this agent should be introduced to maturion-isms  
- Escalation ref: `ESC-AGENTFILE-B54D57B5-GRA-20260408`

---

## References

- Canonical commit: `b54d57b5864a4df67f5bc44323ebde3807192c39`
- Ripple PR: `APGI-cmy/maturion-isms#1294` (merged)
- Layer-down issue: `APGI-cmy/maturion-isms#1293`
- Agent policy: `AGCFPP-001` | `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md`
- Rules: A-009, A-015 (FAIL-ONLY-ONCE.md v1.5.0)

**Status**: COMPLETE — CodexAdvisor-agent session-055-20260408 applied changes. DRAFT PR opened for CS2 review.

**Resolution**: Changes applied to `.github/agents/foreman-v2-agent.md` (v2.9.0 → v2.10.0):
- Added `Step 4.3a Pre-IAA Commit-State Gate` (AGENT_HANDOVER_AUTOMATION.md v1.2.0)
- Renumbered existing Step 4.3a (IAA audit) → Step 4.3b
- Renumbered existing Step 4.3b (token ceremony) → Step 4.3c
- All cross-references updated throughout file
- Character count: 29,880 / 30,000

**PREHANDOVER proof**: `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-055-20260408.md`
**Session memory**: `.agent-workspace/CodexAdvisor-agent/memory/session-055-20260408.md`
**IAA token**: `.agent-admin/assurance/iaa-token-session-055-wave1-20260408.md` (pending IAA verdict)

---

*Raised by governance-liaison-isms-agent | Session 059 | 2026-04-08*
