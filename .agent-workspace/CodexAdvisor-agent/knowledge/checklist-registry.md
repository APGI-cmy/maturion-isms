# CodexAdvisor — Checklist Registry

**Agent**: CodexAdvisor-agent  
**Knowledge Version**: 1.2.0  
**Last Updated**: 2026-07-12

## Role and Class Mapping

| Agent Role or Class | Mandatory Checklist |
|---|---|
| Governance Liaison | `governance/checklists/GOVERNANCE_LIAISON_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| Foreman | `governance/checklists/FOREMAN_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| Builder | `governance/checklists/BUILDER_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| Orchestrator | `governance/checklists/ORCHESTRATOR_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| Specialist | `governance/checklists/SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` |
| CodexAdvisor recommendation about itself | `governance/checklists/CODEX_ADVISOR_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md` — recommendation only; implementation remains CS2-direct |

For every orchestrator or runtime-specialist bundle, also load `.agent-workspace/CodexAdvisor-agent/knowledge/runtime-specialist-bundle-process.md`. The runtime method supplements and never replaces the applicable canonical role checklist.

## Missing Checklist Rule

Confirm the canonical path and inventory state. Where authorised, use the Governance Liaison to layer down a missing canonical artifact. If the required checklist or method remains unavailable, stop and escalate to CS2. Never create a substitute checklist ad hoc.

## Own-Contract Rule

CodexAdvisor may load its checklist to assess or recommend a correction, but may not implement, commit, approve, or self-assure a change to `.github/agents/CodexAdvisor-agent.md`.

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0