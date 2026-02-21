# AGENT_CREATION_BUNDLE_REQUIREMENTS

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-21

---

## Purpose

Defines the **minimum required outputs (bundle) for every new agent creation** within the Living Agent System v6.2.0. No agent is considered created or governable until all bundle components are present and verified.

---

## Bundle Components (Mandatory)

An agent creation bundle MUST contain ALL of the following:

### Component 1: Agent Contract File

**Path**: `.github/agents/<agent-name>.agent.md`  
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

**Required Files** (minimum):

| File | Purpose |
|------|---------|
| `index.md` | Knowledge entry point and version reference |
| `domain-flag-index.md` | Domain capability flags and activation states |
| `specialist-registry.md` | Known specialists and orchestrators in this domain |

---

### Component 3: Agent Registry Entry

**Path**: `governance/AGENT_REGISTRY.json`  
**Required**: Entry per `AGENT_REGISTRY_ARCHITECTURE.md` schema

---

### Component 4: Routing Rules Update

Requirements:
- The new agent MUST be reachable via the active routing system
- If specialist: registered orchestrator's specialist list MUST be updated
- If orchestrator: Foreman's available orchestrators MUST be updated

---

### Component 5: Pre-Handover Proof

**Path**: `.agent-workspace/<agent>/memory/session-001-YYYYMMDD.md`

**Purpose**: Evidence that the agent was commissioned (ran at least one session).

**Required Content**:
- Session ID and date
- Task: "Agent commissioning — initial activation"
- Tier 1 and Tier 2 knowledge loaded and verified
- Reference to CS2-approved issue number

---

## Bundle Completeness Gate

```
AGENT CREATION BUNDLE COMPLETENESS CHECK
─────────────────────────────────────────
Component 1: Contract file — valid YAML, 4 phases, Tier 1+2 refs, <30K chars
Component 2: Tier 2 knowledge stubs — domain-flag-index.md, specialist-registry.md
Component 3: Agent Registry entry — governance/AGENT_REGISTRY.json
Component 4: Routing rules updated
Component 5: Pre-handover proof — session-001-*.md commissioning evidence

RESULT: COMPLETE / INCOMPLETE (blocked — must not activate)
```

---

## Related Canon

- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`
- `governance/canon/PROXY_AUTHORITY_MODEL.md`
- `governance/canon/AGENT_REGISTRY_ARCHITECTURE.md`
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md`
- `governance/canon/LIVING_AGENT_SYSTEM.md`

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-21  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
