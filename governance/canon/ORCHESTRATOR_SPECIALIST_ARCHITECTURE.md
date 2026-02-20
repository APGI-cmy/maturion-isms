# ORCHESTRATOR_SPECIALIST_ARCHITECTURE

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-20

---

## Purpose

Defines the **orchestrator + specialist agent architecture** that enables scalable, domain-partitioned AI agent collaboration across the Maturion ISMS platform.

This canon establishes the structural pattern, authority model, and lifecycle rules for all orchestrator and specialist agents operating under Living Agent System v6.2.0.

---

## Problem Statement

As the Maturion platform grows across multiple repositories and domains, single-agent contracts become overloaded. A Foreman cannot simultaneously supervise code delivery, manage security audits, and coordinate governance ripple. Monolithic agents:

- Exceed context windows when domain knowledge accumulates
- Cannot specialize deeply without compromising breadth
- Cannot scale horizontally across parallel workstreams
- Create single points of failure in execution pipelines

## Solution: Orchestrator + Specialist Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ ORCHESTRATOR AGENT                                              │
│ ─────────────────────────────────────────────────────────────── │
│ • Receives task from CS2 or Foreman                             │
│ • Decomposes task into domain-specific subtasks                 │
│ • Delegates to registered specialists via delegation protocol   │
│ • Monitors specialist progress and integrates results           │
│ • Reports consolidated outcome to principal                     │
└─────────────────────────────────────────────────────────────────┘
                         ↓  delegates  ↑  reports
        ┌────────────────┼────────────────────────────────────┐
        ↓                ↓                                    ↓
┌───────────────┐ ┌───────────────┐                ┌───────────────┐
│ SPECIALIST A  │ │ SPECIALIST B  │    ...         │ SPECIALIST N  │
│ (Domain: X)   │ │ (Domain: Y)   │                │ (Domain: Z)   │
│ Deep expert   │ │ Deep expert   │                │ Deep expert   │
└───────────────┘ └───────────────┘                └───────────────┘
```

### Core Principle

**Orchestrators coordinate; specialists execute.** An orchestrator NEVER performs specialist-level domain work. A specialist NEVER overrides orchestrator task assignments or cross-domain coordination.

---

## Role Definitions

### Orchestrator Agent

| Attribute | Definition |
|-----------|------------|
| **Class** | `orchestrator` |
| **Authority Level** | Delegated from CS2 or Foreman |
| **Primary Mandate** | Decompose, delegate, monitor, integrate |
| **Scope** | Multi-domain, cross-specialist coordination |
| **Context Window** | Coordination-level only; deep domain knowledge held by specialists |
| **Output** | Consolidated task results + evidence package |

**Orchestrator NEVER**:
- Executes specialist-domain work directly
- Bypasses specialist contracts or governance
- Accumulates specialist-domain knowledge (context bloat)
- Reports partial results without integration attempt

**Orchestrator ALWAYS**:
- Holds delegation authority from its principal
- Registers available specialists before execution
- Maintains delegation log (audit trail)
- Escalates to principal when specialist unavailable or blocked

### Specialist Agent

| Attribute | Definition |
|-----------|------------|
| **Class** | `specialist` |
| **Authority Level** | Delegated from orchestrator only |
| **Primary Mandate** | Execute deep-domain work within assigned scope |
| **Scope** | Single domain (security, compliance, testing, deployment, etc.) |
| **Context Window** | Domain-depth optimized; coordination held by orchestrator |
| **Output** | Domain-specific result + evidence artifact |

**Specialist NEVER**:
- Accepts tasks from agents other than its registered orchestrator
- Performs work outside its declared domain
- Modifies orchestrator coordination logic or task assignments
- Self-promotes to orchestrator role

**Specialist ALWAYS**:
- Validates task is within declared domain before accepting
- Reports completion status (SUCCESS / PARTIAL / FAILED) with evidence
- Escalates out-of-domain tasks back to orchestrator
- Follows four-component contract architecture (see AGENT_CONTRACT_ARCHITECTURE.md)

---

## Authority Model

```
CS2 (Human Authority)
  └── Foreman (Supervisor) OR direct CS2 delegation
        └── Orchestrator (coordinates)
              ├── Specialist A (executes Domain A)
              ├── Specialist B (executes Domain B)
              └── Specialist N (executes Domain N)
```

**Authority Rules**:
1. An orchestrator derives authority from CS2 or Foreman; NEVER self-grants authority
2. A specialist derives authority from its registered orchestrator only
3. Authority cannot be delegated sideways (Specialist A cannot delegate to Specialist B)
4. An orchestrator can register multiple specialists but each specialist reports to one orchestrator per session

---

## Agent Class Registration

All orchestrator and specialist agents MUST be registered in **`governance/AGENT_REGISTRY.json`** (not CANON_INVENTORY.json). CANON_INVENTORY.json tracks governance *artifacts*; AGENT_REGISTRY.json tracks deployed *agents*. See `governance/canon/AGENT_REGISTRY_ARCHITECTURE.md` for the full schema definition, validation requirements, and lifecycle operations.

**Registration entry** (in `governance/AGENT_REGISTRY.json`):
```json
{
  "agent_id": "<unique-agent-id>",
  "agent_class": "orchestrator|specialist",
  "filename": "<AgentName>.agent.md",
  "path": ".github/agents/<AgentName>.agent.md",
  "domain": "<primary-domain or null for orchestrators>",
  "orchestrator_link": "<orchestrator-agent-id or null for orchestrators>",
  "status": "active",
  "registered_date": "<YYYY-MM-DD>",
  "canon_inventory_ref": "<CANON_INVENTORY.json filename entry>",
  "description": "<brief description>",
  "layer_down_status": "PUBLIC_API"
}
```

Agent contracts are **also** tracked in CANON_INVENTORY.json (as governance artifacts with SHA256 hashes) — the two registrations serve different purposes and must stay synchronized.

---

## Registry Decision

| Concern | File | Rationale |
|---------|------|-----------|
| **Where registry lives** | `governance/AGENT_REGISTRY.json` | Dedicated agent registry, separate from artifact inventory |
| **What is tracked** | agent_id, class, domain, orchestrator_link, status, registered_date | Operational metadata for agent discovery and validation |
| **How validated** | SHA256 of registry file in CANON_INVENTORY.json; integrity checks in alignment gate | Drift detected when registry SHA256 mismatches CANON_INVENTORY entry |
| **How consumer repos receive it** | Layer-down governance ripple (same as all PUBLIC_API artifacts) | Orchestrators load registry at session start to discover available specialists |

See `governance/canon/AGENT_REGISTRY_ARCHITECTURE.md` for full schema and lifecycle protocol.

---

## Lifecycle

### Orchestrator Lifecycle

1. **Activation**: Receives task from Foreman/CS2 with scope and authority grant
2. **Registration**: Loads specialist registry from `governance/AGENT_REGISTRY.json`
3. **Decomposition**: Breaks task into domain-partitioned subtasks
4. **Delegation**: Dispatches subtasks to specialists via AGENT_DELEGATION_PROTOCOL.md
5. **Monitoring**: Tracks specialist progress; handles escalations
6. **Integration**: Assembles specialist results into consolidated output
7. **Handover**: Delivers integrated result + delegation log to principal

### Specialist Lifecycle

1. **Activation**: Receives delegation from registered orchestrator
2. **Validation**: Confirms task is within declared domain
3. **Execution**: Performs domain work per four-component contract
4. **Evidence**: Generates domain evidence artifact
5. **Reporting**: Returns result (SUCCESS/PARTIAL/FAILED) + evidence to orchestrator
6. **Closure**: Archives session memory, updates personal patterns

---

## Contract Architecture

Orchestrator and specialist agents use the **same four-component canonical contract** defined in `AGENT_CONTRACT_ARCHITECTURE.md`. The agent class (`orchestrator` or `specialist`) determines Phase 3 (Build) scripts:

| Phase | Orchestrator Focus | Specialist Focus |
|-------|--------------------|-----------------|
| Phase 1: Preflight | Multi-domain identity, delegation authority | Domain identity, scope constraints |
| Phase 2: Induction | Specialist registry load, delegation gate | Orchestrator authority validation |
| Phase 3: Build | Decompose → Delegate → Monitor → Integrate | Validate → Execute → Evidence → Report |
| Phase 4: Handover | Consolidated evidence, delegation log | Domain evidence, session memory |

---

## Governance Integration

- Orchestrators and specialists are governed by Living Agent System v6.2.0
- Both classes use CANON_INVENTORY.json-first alignment (no placeholder hashes)
- Both classes participate in the merge gate: verdict, alignment, stop-and-fix
- Both classes require CS2 authorization for contract creation/modification
- Orchestrator contracts reference: `AGENT_DELEGATION_PROTOCOL.md`
- Specialist contracts reference: `SPECIALIST_KNOWLEDGE_MANAGEMENT.md`

---

## Related Canon

- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` - Four-component contract (all classes)
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` - Delegation mechanics
- `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` - Specialist domain knowledge
- `governance/canon/MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md` - Multi-embodiment patterns
- `governance/canon/AGENT_REGISTRY_ARCHITECTURE.md` - Agent registry schema and lifecycle
- `governance/canon/LIVING_AGENT_SYSTEM.md` - Living Agent framework v6.2.0
- `governance/AGENT_REGISTRY.json` - The agent registry itself
- `governance/checklists/ORCHESTRATOR_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
- `governance/checklists/SPECIALIST_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-20  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
