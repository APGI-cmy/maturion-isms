# ORCHESTRATOR AGENT CONTRACT REQUIREMENTS CHECKLIST

**Status**: Canonical Governance Validation Checklist  
**Version**: 1.0.0  
**Authority**: CS2 (Johan Ras)  
**Created**: 2026-02-20  
**Last Updated**: 2026-02-20  
**Purpose**: Machine-checkable checklist of MANDATORY elements for Orchestrator agent contract compliance with Living Agent System v6.2.0

---

## Executive Summary

This document provides a **machine-checkable binding checklist** that defines the **MANDATORY elements** that MUST appear in any Orchestrator agent contract for the agent to be considered **fully compliant** with Living Agent System v6.2.0.

**Critical Principle**: An Orchestrator contract is INCOMPLETE and the agent is OUT OF GOVERNANCE if ANY required element is missing or non-compliant.

This checklist implements:
- Living Agent System v6.2.0 (orchestrator-specific requirements)
- Orchestrator/specialist architecture governance (ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md)
- Delegation protocol compliance (AGENT_DELEGATION_PROTOCOL.md)
- Multi-embodiment model compliance (MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md)
- 30,000 Character Limit Enforcement

---

## Usage Instructions

### For Contract Authors

When creating or updating an Orchestrator contract:
1. Verify ALL checklist items are present and compliant
2. Mark items as ✅ (present) or ❌ (missing)
3. Contract is VALID only if ALL required items are ✅
4. Character count MUST be < 30,000 (GitHub UI selectability)

### For Validation Tooling

Automated validators MUST:
1. Parse agent contract file (.github/agents/[orchestrator-name].agent.md)
2. Verify each checklist item
3. Validate character count < 30,000
4. Return VALID only if 100% compliance achieved
5. Block recruitment if validation fails

---

## SECTION 1: MANDATORY COMPONENTS

### 1.1 YAML Frontmatter

- **Requirement**: MANDATORY
- **Validation**: Valid YAML with ALL required fields
- **Required Fields**:
  - `id: [orchestrator-id]`
  - `description: [mission statement]`
  - `agent.id: [orchestrator-id]`
  - `agent.class: orchestrator`
  - `agent.version: 6.2.0`
  - `governance.protocol: LIVING_AGENT_SYSTEM`
  - `governance.canon_inventory: governance/CANON_INVENTORY.json`
  - `governance.expected_artifacts: [list]`
  - `governance.degraded_on_placeholder_hashes: true`
  - `execution_identity.name: "Maturion Bot"`
  - `execution_identity.secret: "[secret-name]"`
  - `execution_identity.never_push_main: true`
  - `execution_identity.write_via_pr: true`
  - `orchestrator.principal: [CS2|foreman-id]`
  - `orchestrator.specialist_registry: governance/AGENT_REGISTRY.json`
  - `orchestrator.max_concurrent_specialists: [N]`
  - `orchestrator.delegation_log_path: .agent-admin/delegations/`
  - `prohibitions: [list]`
  - `metadata.canonical_home: [repo]`
  - `metadata.this_copy: canonical`
  - `metadata.authority: CS2`
  - `metadata.last_updated: YYYY-MM-DD`
- **Severity if Missing**: BLOCKER - Cannot parse agent configuration

### 1.2 Mission Statement

- **Requirement**: MANDATORY
- **Validation**: Clear mission aligned to orchestrator role
- **Required Elements**:
  - Scope of coordination (which domains/specialists)
  - Principal authority source (CS2 or specific Foreman)
  - Critical invariant: "ORCHESTRATOR NEVER EXECUTES SPECIALIST-DOMAIN WORK DIRECTLY"
- **Severity if Missing**: HIGH - Agent purpose unclear

### 1.3 Phase 1: Preflight (Identity & Constraints)

- **Requirement**: MANDATORY
- **Validation**: Contains complete preflight section
- **Required Elements**:
  - Identity & Authority: orchestrator role, delegated-from principal
  - Critical Invariants (negative examples with ❌/✅):
    - ❌ WRONG: Orchestrator performs specialist domain work
    - ✅ CORRECT: Orchestrator delegates and integrates
  - Canonical Governance Bindings: references to ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md
  - Degraded mode triggers: missing specialist, degraded CANON_INVENTORY
- **Severity if Missing**: BLOCKER - Agent behavioral constraints not established

### 1.4 Phase 2: Induction (Dynamic Context Loading)

- **Requirement**: MANDATORY
- **Validation**: Contains executable induction script
- **Required Elements**:
  - Wake-up protocol reference: `.github/scripts/wake-up-protocol.sh [orchestrator-id]`
  - Specialist registry load: verify all registered specialists exist in `AGENT_REGISTRY.json`
  - CANON_INVENTORY integrity check: no placeholder PUBLIC_API hashes
  - Authority grant verification: confirm principal authorization exists
  - Working contract generation
- **Severity if Missing**: BLOCKER - Agent cannot initialize with correct specialist context

### 1.5 Phase 3: Build (Orchestration Execution)

- **Requirement**: MANDATORY
- **Validation**: Contains priority-coded orchestration scripts
- **Required Sections**:
  - ORC_H (High): Task decomposition → specialist delegation → failure handling
  - ORC_M (Medium): Monitoring, result integration, delegation log
  - ORC_L (Low): Optimization, reporting, lessons capture
- **Required Patterns**:
  - Pre-delegation validation protocol (per AGENT_DELEGATION_PROTOCOL.md)
  - Delegation package construction
  - Parallel vs sequential execution decision logic
  - Stop-and-fix trigger (≥2 specialist failures)
  - Result integration gate
- **Severity if Missing**: BLOCKER - Agent cannot perform orchestration work

### 1.6 Phase 4: Handover (Evidence & Closure)

- **Requirement**: MANDATORY
- **Validation**: Contains automated handover script
- **Required Evidence Artifacts**:
  - Delegation log: `.agent-admin/delegations/log-<timestamp>.json`
  - Consolidated result package: `.agent-admin/prehandover/proof-<timestamp>.md`
  - Session memory: `.agent-workspace/[orchestrator-id]/memory/session-NNN-YYYYMMDD.md`
  - Specialist evidence references (all embodiments)
- **Severity if Missing**: HIGH - Cannot demonstrate governance compliance

### 1.7 Delegation Protocol Compliance

- **Requirement**: MANDATORY
- **Validation**: Contract references and implements AGENT_DELEGATION_PROTOCOL.md
- **Required Elements**:
  - Pre-delegation validation script
  - Delegation package JSON structure
  - Specialist result acceptance criteria
  - Audit trail commitment (.agent-admin/delegations/)
- **Severity if Missing**: BLOCKER - Delegation not governed

### 1.8 Specialist Registry Declaration

- **Requirement**: MANDATORY
- **Validation**: Orchestrator declares which specialists it coordinates
- **Required Declaration**:
  - Each specialist's agent-id
  - Each specialist's primary domain
  - Each specialist's `AGENT_REGISTRY.json` entry reference
  - max_concurrent_specialists declared
- **Severity if Missing**: HIGH - Specialist scope undefined

### 1.9 Prohibited Behaviors

- **Requirement**: MANDATORY
- **Validation**: All core prohibitions listed
- **Required Prohibitions**:
  - No execution of specialist-domain work directly
  - No delegation to unregistered specialists
  - No scope expansion after delegation issued
  - No authority grants exceeding principal authorization
  - No silent failures (all failures logged and escalated)
  - No pushing to main (use PRs)
  - No self-extension of scope/authority
- **Severity if Missing**: BLOCKER - Agent may violate governance

---

## SECTION 2: ORCHESTRATOR-SPECIFIC REQUIREMENTS

### 2.1 Multi-Embodiment Compliance

- **Requirement**: MANDATORY when `max_concurrent_specialists > 1`
- **Validation**: Contract references MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md
- **Required Elements**:
  - Embodiment identity model (embodiment_id generation)
  - Parallel execution conditions
  - State isolation protocol
  - Conflict detection and escalation
- **Severity if Missing**: HIGH - Multi-embodiment not governed

### 2.2 Stop-and-Fix Integration

- **Requirement**: MANDATORY
- **Validation**: Contract references STOP_AND_FIX_DOCTRINE.md
- **Trigger Condition**: ≥2 specialist FAILED/ESCALATED in same session
- **Required Action**: Halt all delegation, invoke stop-and-fix, escalate to principal
- **Severity if Missing**: HIGH - Failure cascade not prevented

### 2.3 Authority Chain Documentation

- **Requirement**: MANDATORY
- **Validation**: Authority chain documented in preflight
- **Required**: CS2 approval reference, Foreman authorization (if applicable), specialist registry source
- **Severity if Missing**: BLOCKER - Authority unclear

---

## SECTION 3: VALIDATION REQUIREMENTS

### 3.1 File Size Validation

- **Requirement**: MANDATORY (BLOCKING)
- **Validation**: Character count MUST be < 30,000
- **Enforcement**: Pre-PR creation validation
- **Test Command**: `wc -m < .github/agents/[orchestrator-name].agent.md`
- **Severity if Exceeded**: BLOCKER

### 3.2 Version Consistency

- **Requirement**: MANDATORY
- **Validation**: All version references MUST be v6.2.0
- **Check Locations**: YAML frontmatter, session memory template, authority footer
- **Severity if Inconsistent**: HIGH

### 3.3 Agent Registry Reference

- **Requirement**: MANDATORY
- **Validation**: Specialist registry references `AGENT_REGISTRY.json` (not CANON_INVENTORY)
- **Rationale**: CANON_INVENTORY is an artifact inventory; AGENT_REGISTRY.json is the agent operational registry. See `governance/canon/AGENT_REGISTRY_ARCHITECTURE.md`.
- **Severity if Missing**: HIGH

---

## VALIDATION SUMMARY

**Total Required Sections**: 9 mandatory components + 3 orchestrator-specific + 3 validation  
**Compliance Threshold**: 100% (ALL items MUST be ✅)  
**Character Limit**: < 30,000 characters (BLOCKING)  
**Version Requirement**: Living Agent System v6.2.0  
**CS2 Authorization**: REQUIRED for all orchestrator contract creation/modification

---

## Authority

**Living Agent System**: v6.2.0  
**Checklist Version**: 1.0.0  
**Authority**: CS2 (Johan Ras)  
**Canonical Home**: APGI-cmy/maturion-foreman-governance  
**Last Updated**: 2026-02-20  
**Review Frequency**: Quarterly
