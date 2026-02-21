# AGENT_REGISTRY_ARCHITECTURE

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-20

---

## Purpose

Defines the **canonical agent registry architecture** for tracking registered orchestrator and specialist agents within the Maturion ISMS platform.

This canon separates concerns: `CANON_INVENTORY.json` tracks canonical *artifacts* (governance documents, checklists, templates); `AGENT_REGISTRY.json` tracks deployed *agents* (orchestrators, specialists, and their operational metadata).

---

## Why a Dedicated Registry

`CANON_INVENTORY.json` is an artifact inventory. Its schema tracks governance documents with fields like `filename`, `version`, `file_hash_sha256`, `effective_date`, `type`, and `layer_down_status`. It is optimised for drift detection and merge gate alignment.

Agent registration requires different fields:
- Agent class (`orchestrator` / `specialist`)
- Primary domain (for specialists)
- Registered orchestrator link (for specialists)
- Operational status (`active` / `inactive` / `deprecated`)
- Deployed repository contexts

Mixing these schemas would make both the artifact inventory and the agent registry harder to validate and harder to evolve independently. Therefore, agent registration lives in a dedicated registry file.

---

## Registry Location

**File**: `governance/AGENT_REGISTRY.json`  
**Schema version**: tracked within the file via `schema_version` field  
**Layer-down status**: `PUBLIC_API` — consumer repositories receive this via governance ripple  
**Owner**: Governance Repository Administrator under CS2 authority

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
  "orchestrator_link": "<orchestrator-agent-id or null for orchestrators>",
  "status": "active|inactive|deprecated",
  "registered_date": "<YYYY-MM-DD>",
  "deprecated_date": "<YYYY-MM-DD or null>",
  "canon_inventory_ref": "<filename in CANON_INVENTORY.json>",
  "description": "<brief description>",
  "layer_down_status": "PUBLIC_API|INTERNAL|OPTIONAL"
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent_id` | string | YES | Unique identifier (matches `id` in agent YAML frontmatter) |
| `agent_class` | enum | YES | `orchestrator` or `specialist` |
| `filename` | string | YES | Agent contract filename (e.g., `my-orchestrator.agent.md`) |
| `path` | string | YES | Relative path from repo root |
| `domain` | string | SPEC only | Primary domain for specialist (null for orchestrators) |
| `orchestrator_link` | string | SPEC only | Registered orchestrator ID for this specialist (null for orchestrators) |
| `status` | enum | YES | `active`, `inactive`, or `deprecated` |
| `registered_date` | date | YES | ISO-8601 date of initial registration |
| `deprecated_date` | date | COND | Required when `status: deprecated` |
| `canon_inventory_ref` | string | YES | Cross-reference to CANON_INVENTORY.json filename entry |
| `description` | string | YES | Brief one-line description of agent purpose |
| `layer_down_status` | enum | YES | `PUBLIC_API`, `INTERNAL`, or `OPTIONAL` |

---

## Validation Requirements

### Integrity Checks (run by alignment gate)

1. **Schema version match**: Registry `schema_version` must match canonical schema version
2. **No phantom agents**: Every entry in `AGENT_REGISTRY.json` MUST have a corresponding entry in `CANON_INVENTORY.json` via `canon_inventory_ref`
3. **No orphaned CANON entries**: Every orchestrator/specialist agent contract in CANON_INVENTORY.json MUST have a corresponding entry in `AGENT_REGISTRY.json`
4. **Unique agent_id**: All `agent_id` values must be unique
5. **Specialist domain declared**: All `agent_class: specialist` entries must have a non-null `domain`
6. **Orchestrator link valid**: All `agent_class: specialist` entries with `orchestrator_link` must reference an active orchestrator `agent_id`
7. **Active count matches `total_agents`**: `total_agents` must equal count of entries with `status: active`

### Hash Tracking

The registry file itself is tracked in `CANON_INVENTORY.json` with a full SHA256 hash. When the registry is updated (agent added, status changed, etc.), the CANON_INVENTORY entry must be updated accordingly — this is the mechanism by which drift is detected across consumer repositories.

---

## Lifecycle Operations

### Registering a New Agent

1. CS2 authorizes agent creation (via approved issue)
2. Agent contract created under `.github/agents/` via PR
3. Agent contract added to `CANON_INVENTORY.json` with SHA256
4. Agent entry added to `AGENT_REGISTRY.json`
5. `AGENT_REGISTRY.json` entry updated in `CANON_INVENTORY.json` with new SHA256
6. Governance ripple dispatched to consumer repositories

### Deprecating an Agent

1. CS2 authorizes deprecation
2. Agent contract marked `status: deprecated` in `AGENT_REGISTRY.json`
3. `deprecated_date` set in registry entry
4. `CANON_INVENTORY.json` entry updated with new registry SHA256
5. Consumer repositories notified via layer-down ripple

### Consumer Repository Alignment

Consumer repositories receive `AGENT_REGISTRY.json` via governance layer-down ripple. Orchestrators running in consumer repositories load the registry to discover available specialists:

```bash
# Load specialist registry in orchestrator induction
SPECIALIST_REGISTRY_PATH="governance/AGENT_REGISTRY.json"
AVAILABLE_SPECIALISTS=$(jq '[.agents[] | select(.agent_class == "specialist" and .status == "active")]' "${SPECIALIST_REGISTRY_PATH}")
```

---

## Separation of Concerns Summary

| Concern | File | Purpose |
|---------|------|---------|
| Artifact drift detection | `governance/CANON_INVENTORY.json` | Hash tracking for all governance documents |
| Agent operational status | `governance/AGENT_REGISTRY.json` | Registry of active orchestrators and specialists |
| Agent contract content | `.github/agents/<name>.agent.md` | Four-component contract defining agent behavior |
| Agent requirements | `governance/checklists/` | Compliance checklists per agent class |
| Agent contract templates | `governance/templates/` | Implementation templates |

---

## Related Canon

- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` - Architecture overview
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` - Delegation mechanics
- `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` - Knowledge management
- `governance/canon/LIVING_AGENT_SYSTEM.md` - Governance framework v6.2.0
- `governance/AGENT_REGISTRY.json` - The registry itself

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-20  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
