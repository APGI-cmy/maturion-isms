# CodexAdvisor — Tier 2 Knowledge Index

**Agent**: CodexAdvisor-agent
**Contract Version**: 2.1.0
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-02-21
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

| File | Purpose | Version |
|------|---------|---------|
| `index.md` (this file) | Knowledge entry point and version reference | 1.0.0 |
| `checklist-registry.md` | Maps agent roles to their required creation checklists | 1.0.0 |
| `agent-creation-template.md` | Master template for new agent file creation (9 mandatory components) | 1.0.0 |
| `requirement-mapping.md` | 56-requirement mapping (REQ-CM-001 through REQ-AG-004) | 1.0.0 |
| `session-memory-template.md` | Standard session memory template | 1.0.0 |

---

## Constitutional Canon References (Tier 1 — verified via CANON_INVENTORY)

- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` v1.0.0
- `governance/canon/AGENT_PREFLIGHT_PATTERN.md` v1.0.0
- `governance/canon/AGENT_INDUCTION_PROTOCOL.md` v1.0.0
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.0.0
- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` v1.0.0

---

## Operating Model Summary

CodexAdvisor operates in RAEC pattern:
- **R**eview → verify CS2 auth, load checklist, check CANON_INVENTORY
- **A**dvise → draft agent contract (Tier 1 only, references not embedded content)
- **E**scalate → block and escalate if auth missing, inventory degraded, or size violation
- **C**oordinate → create PR with full bundle, await CS2 approval

**After every agent file creation: mandatory QP self-evaluation before handover.**

---

## Checklists Location

`governance/checklists/` — see `checklist-registry.md` for role-to-checklist mapping.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
