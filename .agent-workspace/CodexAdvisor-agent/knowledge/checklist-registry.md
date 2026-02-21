# CodexAdvisor — Checklist Registry (Tier 2 Operational Knowledge)

**Agent**: CodexAdvisor-agent
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-02-21

---

## Purpose

Maps agent roles to their required creation checklists. CodexAdvisor MUST load the correct checklist before creating or modifying any agent file.

---

## Role → Checklist Mapping

| Agent Role | Checklist Path |
|-----------|---------------|
| Governance Liaison | `governance/checklists/GOVERNANCE_LIAISON_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| Foreman | `governance/checklists/FOREMAN_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| Builder | `governance/checklists/BUILDER_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| Specialist | `governance/checklists/SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| CodexAdvisor (self) | `governance/checklists/CODEX_ADVISOR_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |

---

## If Checklist Is Missing

1. Check if ripple from `maturion-foreman-governance` is pending
2. If pending → wait for ripple or invoke `governance-liaison-isms-agent` to layer down
3. If still missing → STOP + escalate to CS2
4. DO NOT proceed with agent creation without checklist

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
