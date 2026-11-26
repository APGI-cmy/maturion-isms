# AGENT_CREATION_BUNDLE_REQUIREMENTS

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-21

---

## Purpose

Defines the **minimum required outputs (bundle) for every new agent creation** within the Living Agent System v6.2.0. No agent is considered created or governable until all bundle components are present and verified.

This canon closes the gap where partial agent creation left agents with contracts but no operational knowledge, no registry participation, and no execution proof.

---

## Problem Statement

Prior to this canon, agent creation was defined only as "the contract file exists". This led to:

- Agents with no Tier 2 knowledge stubs (no operational context to load)
- Agents with no registry entries (invisible to orchestrators; cannot be delegated to)
- Agents with no routing rules (cannot be reached from governance automation)
- Agents with no pre-handover proof (no evidence the agent was commissioned, not just filed)
- Templates and checklists that accepted a contract alone as "done"

## Solution: Agent Creation Bundle

All agent creation — whether by CS2 directly or by Foreman under proxy authority — MUST produce the **complete creation bundle** before the agent is considered active.

---

## Bundle Components (Mandatory)

An agent creation bundle MUST contain ALL of the following:

### Component 1: Agent Contract File

**Path**: `.github/agents/<agent-name>.agent.md`  
**Authority**: CS2 direct, or Foreman under explicit CS2 proxy authority (see `PROXY_AUTHORITY_MODEL.md`)

**Required Content**:
- Valid YAML frontmatter with all mandatory fields per agent class checklist
- Four-phase architecture: Preflight, Induction, Build, Handover
- Explicit Tier 1 knowledge bindings with `governance/canon/` references
- Explicit Tier 2 knowledge references pointing to `.agent-workspace/<agent>/knowledge/`
- CS2-approved issue reference in provenance metadata

**Validation**: Must pass agent class checklist 100% (see `governance/checklists/`)  
**Character Limit**: < 30,000 characters (BLOCKING)

---

### Component 2: Tier 2 Knowledge Stubs

**Path**: `.agent-workspace/<agent>/knowledge/`  
**Authority**: Same authority as contract creation

**Required Files** (minimum):

| File | Purpose |
|------|---------|
| `domain-flag-index.md` | Domain capability flags and activation states for this agent |
| `specialist-registry.md` | Known specialists and orchestrators in this domain |

**Content Requirements**:
- `domain-flag-index.md` MUST list the agent's primary domain flags and their initial states
- `specialist-registry.md` MUST list the agent's registered orchestrator(s) or specialist(s)
- Files MAY be stubs at creation time but MUST NOT be empty
- Files MUST include version header and effective date

**Example minimum stub** (`domain-flag-index.md`):
```markdown
# Domain Flag Index: <agent-name>

**Version**: 1.0.0
**Effective Date**: YYYY-MM-DD
**Domain**: <primary-domain>

## Active Flags

| Flag | State | Description |
|------|-------|-------------|
| <DOMAIN>_ACTIVE | ENABLED | Primary domain activated at creation |

## Registry
- Agent Registry: governance/AGENT_REGISTRY.json
- Domain Canon: governance/canon/<DOMAIN_CANON.md>
```

---

### Component 3: Agent Registry Entry

**Path**: `governance/AGENT_REGISTRY.json`  
**Authority**: governance-repo-administrator or CS2

**Required Entry** (per `AGENT_REGISTRY_ARCHITECTURE.md`):
```json
{
  "agent_id": "<unique-agent-id>",
  "agent_class": "orchestrator|specialist|foreman|builder|administrator",
  "filename": "<AgentName>.agent.md",
  "path": ".github/agents/<AgentName>.agent.md",
  "domain": "<primary-domain or null for orchestrators>",
  "orchestrator_link": "<orchestrator-agent-id or null>",
  "status": "active",
  "registered_date": "<YYYY-MM-DD>",
  "canon_inventory_ref": "<CANON_INVENTORY.json filename entry>",
  "description": "<brief description>",
  "layer_down_status": "PUBLIC_API"
}
```

**Validation**: `governance/CANON_INVENTORY.json` entry for the contract file MUST exist and have non-placeholder SHA256

---

### Component 4: Routing Rules Update

**Path**: Repository-specific routing configuration (e.g., `governance/CONSUMER_REPO_REGISTRY.json` for governance repo; agent delegation routing in orchestrator config for consumer repos)  
**Authority**: governance-repo-administrator or Foreman

**Requirements**:
- The new agent MUST be reachable via the active routing system
- If the agent is a specialist: the registered orchestrator's specialist list MUST be updated
- If the agent is an orchestrator: the Foreman's available orchestrators MUST be updated
- Routing update MUST be atomic with registry entry creation

---

### Component 5: Pre-Handover Proof

**Path**: `.agent-workspace/<agent>/memory/session-001-YYYYMMDD.md` (first session memory)  
**Authority**: The agent itself, on first commissioned execution

**Purpose**: Evidence that the agent was not just filed as a contract, but actually commissioned (i.e., ran at least one session and produced evidence).

**Required Content**:
- Session ID and date
- Task: "Agent commissioning — initial activation"
- What I Did: Tier 1 and Tier 2 knowledge loaded and verified
- Outcome: ✅ COMPLETE with evidence of all bundle components present
- Reference to CS2-approved issue number that authorised creation

**Validation**: Pre-handover proof MUST exist before the agent is declared `status: active` in `AGENT_REGISTRY.json`

---

## Bundle Completeness Gate

Before any agent is declared **created and active**, ALL five components MUST be present:

```
AGENT CREATION BUNDLE COMPLETENESS CHECK
─────────────────────────────────────────
Component 1: Contract file (.github/agents/<agent>.agent.md)
  □ File exists
  □ YAML frontmatter valid
  □ Four-phase architecture present
  □ Tier 1 + Tier 2 knowledge declared
  □ CS2-approved issue referenced
  □ Character count < 30,000
  □ Agent class checklist 100% pass

Component 2: Tier 2 knowledge stubs
  □ .agent-workspace/<agent>/knowledge/ directory exists
  □ domain-flag-index.md present and non-empty
  □ specialist-registry.md present and non-empty

Component 3: Agent Registry entry
  □ governance/AGENT_REGISTRY.json entry present
  □ governance/CANON_INVENTORY.json entry present (non-placeholder SHA256)

Component 4: Routing rules updated
  □ Orchestrator/Foreman routing updated to include new agent
  □ Or explicit note if agent operates standalone (with rationale)

Component 5: Pre-handover proof
  □ .agent-workspace/<agent>/memory/session-001-*.md exists
  □ Contains commissioning evidence
  □ Tier 1 + Tier 2 load verified in session record

RESULT: □ COMPLETE (all 5 components present) | □ INCOMPLETE (blocked — must not activate)
```

---

## Authority to Create Agents

All agent creation requires explicit CS2 authorization, either:

1. **CS2 Direct**: CS2 creates the bundle directly with an authorized GitHub issue
2. **Foreman Proxy**: Foreman creates the bundle under explicit CS2 proxy authority statement in the issue (see `PROXY_AUTHORITY_MODEL.md`)

**No agent may be created without a CS2-approved GitHub issue.**

CodexAdvisor and all agents MUST verify explicit CS2 or proxy authority exists before accepting any agent contract file as valid.

---

## Integration Points

| Component | Path | Governed By |
|-----------|------|-------------|
| Contract | `.github/agents/<agent>.md` | `CS2_AGENT_FILE_AUTHORITY_MODEL.md` |
| Tier 2 Knowledge | `.agent-workspace/<agent>/knowledge/` | `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` |
| Domain Flag Index | `.agent-workspace/<agent>/knowledge/domain-flag-index.md` | `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` |
| Specialist Registry (local) | `.agent-workspace/<agent>/knowledge/specialist-registry.md` | `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` |
| Agent Registry (global) | `governance/AGENT_REGISTRY.json` | `AGENT_REGISTRY_ARCHITECTURE.md` |
| Routing | Repo-specific routing config | `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` |
| Pre-Handover Proof | `.agent-workspace/<agent>/memory/session-001-*.md` | `AGENT_HANDOVER_AUTOMATION.md` |

---

## Consumer Implementation References

The bundle pattern was first implemented in:

- **APGI-cmy/maturion-isms#360** — Initial bundle-pattern consumer implementation
- **APGI-cmy/maturion-isms#362** — Registry, routing, and Tier 2 stub implementation
- **APGI-cmy/maturion-foreman-governance#361** — Canon alignment (this issue's PR)

---

## Related Canon

- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` — Tier 1/2/3 knowledge model
- `governance/canon/PROXY_AUTHORITY_MODEL.md` — Proxy authority for Foreman-led bundle creation
- `governance/canon/CS2_AGENT_FILE_AUTHORITY_MODEL.md` — Agent file authority hierarchy
- `governance/canon/AGENT_REGISTRY_ARCHITECTURE.md` — Registry schema and lifecycle
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` — Agent class definitions
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` — Pre-handover proof requirements
- `governance/canon/LIVING_AGENT_SYSTEM.md` — Governance framework v6.2.0
- `governance/checklists/ORCHESTRATOR_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
- `governance/checklists/SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-21  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
