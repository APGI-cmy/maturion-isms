# AGENT_REGISTRY_ARCHITECTURE

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-20

---

## Purpose

Defines the **canonical agent registry architecture** for tracking registered orchestrator and specialist agents. This separates concerns: `CANON_INVENTORY.json` tracks governance *artifacts*; `AGENT_REGISTRY.json` tracks deployed *agents*.

---

## Registry Location

**File**: `governance/AGENT_REGISTRY.json`  
**Layer-down status**: `PUBLIC_API` — consumer repositories receive this via governance ripple

---

## Schema Definition

### Top-Level Structure

```json
{
  "schema_version": "1.0.0",
  "last_updated": "<ISO-8601 timestamp>",
  "total_agents": <N>,
  "agents": [ ... ]
}
```

### Agent Entry Schema

```json
{
  "agent_id": "<unique-agent-id>",
  "agent_class": "orchestrator|specialist",
  "filename": "<AgentName>.agent.md",
  "path": ".github/agents/<AgentName>.agent.md",
  "domain": "<primary-domain or null for orchestrators>",
  "orchestrator_link": "<orchestrator-agent-id or null>",
  "status": "active|inactive|deprecated",
  "registered_date": "<YYYY-MM-DD>",
  "deprecated_date": "<YYYY-MM-DD or null>",
  "canon_inventory_ref": "<filename in CANON_INVENTORY.json>",
  "description": "<brief description>",
  "layer_down_status": "PUBLIC_API|INTERNAL|OPTIONAL"
}
```

---

## Validation Requirements

1. **No phantom agents**: Every entry in `AGENT_REGISTRY.json` MUST have a corresponding entry in `CANON_INVENTORY.json` via `canon_inventory_ref`
2. **Unique agent_id**: All `agent_id` values must be unique
3. **Specialist domain declared**: All `agent_class: specialist` entries must have a non-null `domain`
4. **Active count matches `total_agents`**: `total_agents` must equal count of entries with `status: active`

---

## Related Canon

- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md`
- `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md`
- `governance/canon/LIVING_AGENT_SYSTEM.md`
- `governance/AGENT_REGISTRY.json` — The registry itself

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-20  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
