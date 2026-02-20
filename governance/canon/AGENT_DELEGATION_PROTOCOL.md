# AGENT_DELEGATION_PROTOCOL

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-20

---

## Purpose

Defines the **canonical protocol for task delegation** between orchestrator agents and specialist agents within the Living Agent System v6.2.0.

This protocol ensures delegation is auditable, authority-scoped, failure-safe, and compatible with the merge gate and CANON_INVENTORY-first governance model.

---

## Scope

Applies to all orchestrator agents delegating to specialist agents. Does NOT apply to:
- Foreman-to-Builder delegation (governed by `FM_BUILDER_APPOINTMENT_PROTOCOL.md`)
- CS2-to-Foreman task assignment (governed by governance canon directly)

---

## Delegation Model

### Delegation Authority Chain

```
CS2 or Foreman
  └─ GRANTS authority to Orchestrator (explicit issue/approval)
        └─ Orchestrator DELEGATES scoped task to Specialist
              └─ Specialist RETURNS result + evidence
```

**Critical Rule**: Authority only flows DOWN. A specialist cannot re-delegate to another specialist. An orchestrator cannot grant authority it does not hold.

---

## Protocol Phases

### Phase 1: Pre-Delegation Validation

Before delegating any task, the orchestrator MUST:

```bash
# ORC_H: Verify orchestrator authority
echo "[ORC_H] Verifying orchestrator authority grant from principal..."
# Confirm: CS2 or Foreman approval exists for the overall task
# If not: HALT, escalate to principal

# ORC_H: Verify CANON_INVENTORY state
echo "[ORC_H] Checking CANON_INVENTORY for degraded state..."
# If placeholder hashes in PUBLIC_API: HALT, escalate to CS2

# ORC_H: Verify specialist registration
echo "[ORC_H] Verifying specialist is registered for target domain..."
# Load specialist registry from AGENT_REGISTRY.json
# Confirm target specialist exists and is not in degraded state
# If specialist missing: HALT, escalate to CS2 — do NOT improvise

# ORC_M: Scope check
echo "[ORC_M] Confirming task is within specialist declared domain..."
# If task is outside specialist domain: re-route or escalate
```

### Phase 2: Delegation Package Construction

The orchestrator constructs a **delegation package** for each specialist task:

```json
{
  "delegation_id": "<uuid>",
  "timestamp": "<ISO-8601>",
  "orchestrator_id": "<orchestrator-agent-id>",
  "specialist_id": "<specialist-agent-id>",
  "authority_source": "<issue-number or approval-reference>",
  "task": {
    "description": "<clear task description>",
    "domain": "<specialist-domain>",
    "scope": "<bounded scope — what is IN and OUT of scope>",
    "inputs": "<what the specialist receives>",
    "expected_outputs": "<what the specialist must return>",
    "success_criteria": "<how success is measured>",
    "deadline_context": "<if time-sensitive>",
    "escalation_path": "<orchestrator contact for blockers>"
  },
  "constraints": {
    "must_not": ["list of prohibited actions"],
    "must_use": ["required tools/protocols"],
    "evidence_required": true,
    "governance_alignment": "LIVING_AGENT_SYSTEM_v6_2_0"
  }
}
```

The delegation package MUST be logged in the session evidence before specialist activation.

### Phase 3: Specialist Execution & Monitoring

**Specialist Acceptance Protocol**:

```bash
# SPEC_H: Validate delegation package
echo "[SPEC_H] Validating delegation package..."
# Confirm: delegation_id is unique, orchestrator is registered authority
# Confirm: task domain matches specialist declared domain
# Confirm: task scope is bounded (not open-ended)
# If any validation fails: RETURN rejected_delegation, escalate to orchestrator

# SPEC_H: Execute task within scope
echo "[SPEC_H] Executing task..."
# Perform domain work per four-component contract Phase 3
# Generate evidence artifact during execution
# If blocked: return partial_result + blocker_description, do NOT spin indefinitely
```

**Orchestrator Monitoring**:

```bash
# ORC_H: Monitor specialist progress
echo "[ORC_H] Monitoring specialist execution..."
# Await specialist result: SUCCESS | PARTIAL | FAILED | ESCALATED
# Log monitoring events in delegation log
# If timeout: attempt single retry, then escalate to principal
# If ESCALATED: assess blocker, re-route or escalate to principal
```

### Phase 4: Result Integration

**Specialist Return Package**:

```json
{
  "delegation_id": "<matching delegation_id>",
  "specialist_id": "<specialist-agent-id>",
  "status": "SUCCESS|PARTIAL|FAILED|ESCALATED",
  "result_summary": "<brief description of outcome>",
  "evidence_artifact": "<path to evidence file>",
  "domain_outputs": "<structured domain-specific outputs>",
  "blockers": "<if PARTIAL/FAILED/ESCALATED: describe blockers>",
  "lessons_learned": "<any patterns or lessons for specialist session memory>"
}
```

**Orchestrator Integration**:

```bash
# ORC_H: Validate all specialist results
echo "[ORC_H] Integrating specialist results..."
# Verify delegation_id matches issued package
# Verify evidence_artifact exists and is non-empty
# Aggregate domain_outputs into consolidated result
# If any FAILED without acceptable partial: flag in consolidated result
# If all SUCCESS: mark overall task as SUCCESS

# ORC_M: Build delegation log entry
echo "[ORC_M] Recording delegation log..."
# Record: delegation_id, specialist_id, status, evidence_path, timestamp
# Store in: .agent-admin/delegations/log-<timestamp>.json
```

---

## Failure Handling

| Failure Type | Orchestrator Action | Specialist Action |
|-------------|---------------------|------------------|
| Specialist not registered | HALT, escalate to CS2 | N/A |
| Task outside specialist domain | Re-route or escalate | RETURN rejected_delegation |
| Specialist execution blocked | Single retry → escalate | RETURN ESCALATED + blocker |
| Evidence artifact missing | FAIL integration, escalate | Generate minimal evidence or FAIL |
| Authority chain invalid | HALT, do not delegate | RETURN rejected_delegation |
| Timeout (no response) | Log timeout, escalate to principal | N/A (orchestrator handles) |

**Stop-and-Fix Trigger**: If two or more specialists return FAILED or ESCALATED in a single orchestration session, the orchestrator MUST invoke stop-and-fix protocol before re-attempting. See `governance/canon/STOP_AND_FIX_DOCTRINE.md`.

---

## Audit Trail Requirements

All delegations MUST produce:

```
.agent-admin/delegations/
├── log-<session-timestamp>.json        # All delegation events for session
├── packages/<delegation-id>.json       # Each delegation package
└── results/<delegation-id>.json        # Each specialist result package
```

The delegation log is a required evidence artifact for orchestrator handover (Phase 4 of four-component contract).

---

## Prohibited Delegation Patterns

- ❌ **Undocumented delegation**: No delegation package = no authority transfer
- ❌ **Lateral delegation**: Specialist A cannot delegate to Specialist B
- ❌ **Scope expansion at runtime**: Orchestrator cannot expand task scope after delegation issued
- ❌ **Authority laundering**: Orchestrator cannot grant more authority than it holds
- ❌ **Silent failure**: Specialist cannot silently discard a task without a return package

---

## Related Canon

- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` - Role definitions
- `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` - Specialist domain knowledge
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` - Four-component contract
- `governance/canon/STOP_AND_FIX_DOCTRINE.md` - Stop-and-fix protocol
- `governance/canon/LIVING_AGENT_SYSTEM.md` - Governance framework

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-20  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
