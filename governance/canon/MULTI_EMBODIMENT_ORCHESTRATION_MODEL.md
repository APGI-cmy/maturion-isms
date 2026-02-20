# MULTI_EMBODIMENT_ORCHESTRATION_MODEL

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-20

---

## Purpose

Defines the canonical model for orchestrating **multiple simultaneous embodiments** of specialist agents within a single orchestration session.

This model addresses the scenario where the same specialist type is instantiated multiple times (e.g., three Builder specialists working on independent modules simultaneously) or where a single orchestrator manages parallel workflows across specialist domains.

---

## Problem Statement

A single orchestrator may need to coordinate:

- **Parallel specialist execution**: Specialist A and Specialist B running simultaneously
- **Multiple specialist instances**: Two Builder specialists working on independent code modules
- **Sequential specialist chains**: Output of Specialist A feeds into Specialist B
- **Cross-domain synthesis**: Specialist outputs require integration before delivery

Without a canonical model, orchestrators improvise coordination patterns that diverge, create race conditions, or produce un-auditable delegation chains.

---

## Embodiment Definitions

### Single Embodiment (Default)

One orchestrator instance, one specialist instance per domain, sequential or simple parallel delegation:

```
Orchestrator
  ├── delegates to Specialist A (Domain X)
  └── delegates to Specialist B (Domain Y)
```

All delegation packages are tracked in a single delegation log.

### Multiple Embodiments (Advanced)

Multiple specialist instances of the same type, or an orchestrator managing sub-orchestrators:

```
Primary Orchestrator
  ├── delegates to Specialist A-1 (Domain X, Module 1)
  ├── delegates to Specialist A-2 (Domain X, Module 2)  ← same type, different scope
  └── delegates to Specialist B (Domain Y)
```

Each embodiment MUST have a unique `embodiment_id` in its delegation package.

### Hierarchical Orchestration

An orchestrator managing sub-orchestrators (for very large task decompositions):

```
Primary Orchestrator (Cross-Domain Coordinator)
  ├── Sub-Orchestrator 1 (Domain Cluster X)
  │     ├── Specialist X-1
  │     └── Specialist X-2
  └── Sub-Orchestrator 2 (Domain Cluster Y)
        ├── Specialist Y-1
        └── Specialist Y-2
```

**Rule**: Hierarchy depth MUST NOT exceed 2 levels (primary + sub) without CS2 approval. Deeper hierarchies indicate task decomposition failure and require architectural review.

---

## Embodiment Identity Model

Each embodiment instance MUST have:

```json
{
  "embodiment_id": "<agent-id>-<session-timestamp>-<instance-number>",
  "agent_id": "<base-agent-id>",
  "agent_class": "specialist|orchestrator",
  "instance_number": "<N>",
  "session_id": "<orchestrator-session-id>",
  "scope_partition": "<what subset of the domain this embodiment handles>",
  "parent_delegation_id": "<delegation_id from orchestrator>"
}
```

The `embodiment_id` ensures audit logs distinguish between multiple instances of the same agent class in a single session.

---

## Parallel Execution Model

### When Parallel Execution Is Permitted

Orchestrators MAY dispatch multiple specialists simultaneously when:

1. Specialist tasks are **independent** (no data dependency between them)
2. Each specialist has a **unique `embodiment_id`**
3. The orchestrator can **integrate results regardless of completion order**
4. The total number of simultaneous embodiments does not exceed the declared `max_concurrent` in the orchestrator contract

### When Parallel Execution Is PROHIBITED

- Tasks with data dependencies (B requires output of A) → enforce sequential execution
- Tasks where failure of one invalidates others → sequential with stop-and-fix check
- Tasks requiring shared mutable state → coordinate via orchestrator, not directly

### Parallel Execution Protocol

```bash
# ORC_H: Dispatch parallel specialists
echo "[ORC_H] Dispatching parallel specialist embodiments..."
# For each independent task:
#   - Assign unique embodiment_id
#   - Construct delegation package (no cross-dependencies)
#   - Dispatch to specialist

# ORC_H: Monitor all embodiments
echo "[ORC_H] Monitoring parallel execution..."
# Await ALL results before integration
# If any embodiment returns FAILED: do NOT discard others' results
# Log partial results; attempt integration of successful embodiments

# ORC_M: Integration gate
echo "[ORC_M] Running integration gate on parallel results..."
# Verify all delegation_ids accounted for
# Identify gaps (missing results = escalate)
# Consolidate into unified result package
```

---

## State Management

### Orchestrator State Isolation

Each orchestration session is **state-isolated**:

- Orchestrator state does NOT persist between sessions except via session memory
- Specialist results are available only within the orchestration session
- Cross-session state sharing MUST go through governance canon (layer-up) or explicit session memory

### Shared-State Hazards

When multiple specialist embodiments operate on the same repository or file:

1. **Orchestrator MUST serialize** access to shared resources (one writer at a time)
2. **Orchestrator MUST track** which embodiment last modified each shared resource
3. **Conflict detection**: If two embodiments produce conflicting outputs for the same artifact, orchestrator MUST escalate to Foreman/CS2 — NOT self-resolve

### Session Memory Under Multi-Embodiment

Each specialist embodiment writes its own session memory:

```
.agent-workspace/<agent-id>/memory/session-NNN-<embodiment-id>.md
```

The primary orchestrator writes a consolidated session memory:

```
.agent-workspace/<orchestrator-id>/memory/session-NNN-YYYYMMDD.md
```

The consolidated memory references all embodiment memory files.

---

## Governance Compliance Under Multi-Embodiment

All embodiments are governed by the same Living Agent System v6.2.0 rules:

| Requirement | Per-Embodiment | Per-Session (Orchestrator) |
|-------------|---------------|---------------------------|
| CANON_INVENTORY alignment | ✅ Each embodiment checks | ✅ Orchestrator verifies all |
| Evidence artifact | ✅ Each embodiment produces | ✅ Orchestrator consolidates |
| Session memory | ✅ Per-embodiment | ✅ Consolidated |
| Merge gate | N/A (specialists don't merge) | ✅ Orchestrator's PR |
| Delegation log | ✅ Per-embodiment entry | ✅ Orchestrator maintains full log |

---

## Failure Modes and Recovery

| Failure Mode | Detection | Recovery |
|-------------|-----------|---------|
| Embodiment orphan (no result) | Timeout + missing result | Log + escalate; continue with available results |
| Duplicate embodiment_id | Pre-dispatch uniqueness check | HALT dispatch; fix and retry |
| State conflict between embodiments | Integration gate | Escalate to Foreman/CS2 |
| Hierarchy depth exceeded | Depth counter at dispatch | HALT; restructure task decomposition |
| All embodiments failed | Integration gate | Stop-and-fix before retry |

---

## Related Canon

- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` - Architecture overview
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` - Delegation mechanics
- `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` - Knowledge management
- `governance/canon/STOP_AND_FIX_DOCTRINE.md` - Stop-and-fix protocol
- `governance/canon/LIVING_AGENT_SYSTEM.md` - Governance framework

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-20  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
