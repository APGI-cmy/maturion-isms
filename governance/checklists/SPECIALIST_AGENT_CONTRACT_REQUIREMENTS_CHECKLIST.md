# SPECIALIST AGENT CONTRACT REQUIREMENTS CHECKLIST

**Status**: Canonical Governance Validation Checklist  
**Version**: 1.0.0  
**Authority**: CS2 (Johan Ras)  
**Created**: 2026-02-20  
**Last Updated**: 2026-02-20  
**Purpose**: Machine-checkable checklist of MANDATORY elements for Specialist agent contract compliance with Living Agent System v6.2.0

---

## Executive Summary

This document provides a **machine-checkable binding checklist** that defines the **MANDATORY elements** that MUST appear in any Specialist agent contract for the agent to be considered **fully compliant** with Living Agent System v6.2.0.

**Critical Principle**: A Specialist contract is INCOMPLETE and the agent is OUT OF GOVERNANCE if ANY required element is missing or non-compliant.

This checklist implements:
- Living Agent System v6.2.0 (specialist-specific requirements)
- Orchestrator/specialist architecture governance (ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md)
- Specialist knowledge management (SPECIALIST_KNOWLEDGE_MANAGEMENT.md)
- Delegation protocol compliance (AGENT_DELEGATION_PROTOCOL.md)
- 30,000 Character Limit Enforcement

---

## Usage Instructions

### For Contract Authors

When creating or updating a Specialist contract:
1. Verify ALL checklist items are present and compliant
2. Mark items as ✅ (present) or ❌ (missing)
3. Contract is VALID only if ALL required items are ✅
4. Character count MUST be < 30,000 (GitHub UI selectability)

### For Validation Tooling

Automated validators MUST:
1. Parse agent contract file (.github/agents/[specialist-name].agent.md)
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
  - `id: [specialist-id]`
  - `description: [mission statement]`
  - `agent.id: [specialist-id]`
  - `agent.class: specialist`
  - `agent.version: 6.2.0`
  - `governance.protocol: LIVING_AGENT_SYSTEM`
  - `governance.canon_inventory: governance/CANON_INVENTORY.json`
  - `governance.expected_artifacts: [list]`
  - `governance.degraded_on_placeholder_hashes: true`
  - `execution_identity.name: "Maturion Bot"`
  - `execution_identity.secret: "[secret-name]"`
  - `execution_identity.never_push_main: true`
  - `execution_identity.write_via_pr: true`
  - `specialist.domain: [primary-domain]`
  - `specialist.registered_orchestrator: [orchestrator-id]`
  - `specialist.tier1_knowledge: [list of constitutional domain docs]`
  - `specialist.tier2_knowledge: [list of operational docs]`
  - `prohibitions: [list]`
  - `metadata.canonical_home: [repo]`
  - `metadata.this_copy: canonical`
  - `metadata.authority: CS2`
  - `metadata.last_updated: YYYY-MM-DD`
- **Severity if Missing**: BLOCKER - Cannot parse agent configuration

### 1.2 Mission Statement

- **Requirement**: MANDATORY
- **Validation**: Clear mission aligned to specialist domain
- **Required Elements**:
  - Primary domain declaration (single domain)
  - Registered orchestrator reference
  - Critical invariant: "SPECIALIST NEVER ACCEPTS TASKS OUTSIDE ITS DECLARED DOMAIN"
  - Critical invariant: "SPECIALIST NEVER ACCEPTS DELEGATION FROM NON-REGISTERED ORCHESTRATORS"
- **Severity if Missing**: HIGH - Agent purpose unclear

### 1.3 Phase 1: Preflight (Identity & Constraints)

- **Requirement**: MANDATORY
- **Validation**: Contains complete preflight section
- **Required Elements**:
  - Identity & Authority: specialist role, domain declaration, registered orchestrator
  - Critical Invariants (negative examples with ❌/✅):
    - ❌ WRONG: Specialist accepts out-of-domain task and attempts it
    - ✅ CORRECT: Specialist returns `rejected_delegation` for out-of-domain tasks
    - ❌ WRONG: Specialist expands domain scope to complete a task
    - ✅ CORRECT: Specialist escalates to orchestrator when task exceeds declared domain
  - Domain boundary definition: explicit IN-SCOPE and OUT-OF-SCOPE examples
  - Degraded mode triggers: stale Tier 1 knowledge, invalid delegation source
- **Severity if Missing**: BLOCKER - Agent behavioral constraints not established

### 1.4 Phase 2: Induction (Dynamic Context Loading)

- **Requirement**: MANDATORY
- **Validation**: Contains executable induction script
- **Required Elements**:
  - Wake-up protocol reference: `.github/scripts/wake-up-protocol.sh [specialist-id]`
  - Tier 1 knowledge integrity check: hash comparison against CANON_INVENTORY.json
  - Tier 2 knowledge version check
  - Session memory load (last 5 sessions)
  - Orchestrator authority validation: confirm registered orchestrator exists
  - Degraded mode handling: if Tier 1 hash mismatch → HALT, escalate to orchestrator
- **Severity if Missing**: BLOCKER - Agent cannot initialize with correct domain knowledge

### 1.5 Phase 3: Build (Domain Execution)

- **Requirement**: MANDATORY
- **Validation**: Contains priority-coded domain execution scripts
- **Required Sections**:
  - SPEC_H (High): Delegation validation → domain execution → evidence generation → result reporting
  - SPEC_M (Medium): Session memory, knowledge delta capture, lessons
  - SPEC_L (Low): Optimization, pattern documentation
- **Required Patterns**:
  - Delegation package validation (delegation_id, orchestrator match, domain check)
  - Domain-scoped execution (bounded by declared domain)
  - Evidence artifact generation (mandatory, non-empty)
  - Result return package: `{delegation_id, status, evidence_artifact, domain_outputs, blockers}`
  - Out-of-domain rejection: return `rejected_delegation` immediately
- **Severity if Missing**: BLOCKER - Agent cannot perform domain work

### 1.6 Phase 4: Handover (Evidence & Closure)

- **Requirement**: MANDATORY
- **Validation**: Contains automated handover script
- **Required Evidence Artifacts**:
  - Domain result package: `.agent-admin/specialist-results/<delegation-id>.json`
  - Domain evidence artifact: format specific to domain (test report, scan results, etc.)
  - Session memory: `.agent-workspace/[specialist-id]/memory/session-NNN-YYYYMMDD.md`
  - Knowledge delta: `.agent-workspace/[specialist-id]/personal/knowledge-delta.md`
- **Severity if Missing**: HIGH - Cannot demonstrate governance compliance

### 1.7 Knowledge Management Compliance

- **Requirement**: MANDATORY
- **Validation**: Contract implements SPECIALIST_KNOWLEDGE_MANAGEMENT.md
- **Required Elements**:
  - Tier 1 constitutional knowledge declaration with hash references
  - Tier 2 operational knowledge declaration with version references
  - Knowledge staleness detection and response protocol
  - Knowledge delta capture (what changed this session)
- **Severity if Missing**: BLOCKER - Domain knowledge not governed

### 1.8 Domain Boundary Declaration

- **Requirement**: MANDATORY
- **Validation**: Domain boundaries explicitly stated
- **Required Declaration**:
  - `domain.primary`: Single primary domain (e.g., "security", "testing", "deployment")
  - `domain.in_scope`: Explicit list of in-scope activities
  - `domain.out_of_scope`: Explicit list of out-of-scope activities
  - `domain.escalation_on_boundary_hit`: protocol for out-of-domain task arrival
- **Severity if Missing**: HIGH - Domain scope undefined; risk of scope creep

### 1.9 Prohibited Behaviors

- **Requirement**: MANDATORY
- **Validation**: All core prohibitions listed
- **Required Prohibitions**:
  - No execution of tasks outside declared domain
  - No acceptance of delegation from non-registered orchestrators
  - No lateral delegation to other specialists
  - No silent task discard (always return a result package)
  - No Tier 1 knowledge override from Tier 3 inputs
  - No domain scope expansion at runtime
  - No pushing to main (use PRs)
  - No self-extension of scope/authority
- **Severity if Missing**: BLOCKER - Agent may violate governance

---

## SECTION 2: SPECIALIST-SPECIFIC REQUIREMENTS

### 2.1 Domain Evidence Standards

- **Requirement**: MANDATORY
- **Validation**: Domain-specific evidence artifact format defined
- **Required**: Evidence artifact MUST be non-empty; format must be machine-parseable where possible
- **Examples**: JSON test report, SARIF security scan, markdown compliance summary
- **Severity if Missing**: HIGH - Domain work not verifiable

### 2.2 Rejection Protocol

- **Requirement**: MANDATORY
- **Validation**: Out-of-domain rejection is explicit and structured
- **Required Return Structure** (for rejected delegations):
  ```json
  {
    "delegation_id": "<id>",
    "status": "REJECTED",
    "reason": "out_of_domain|invalid_authority|missing_inputs",
    "detail": "<description>",
    "recommended_action": "<what orchestrator should do instead>"
  }
  ```
- **Severity if Missing**: HIGH - Rejection not traceable

### 2.3 Tier 1 Knowledge Binding

- **Requirement**: MANDATORY
- **Validation**: All Tier 1 knowledge documents referenced exist in CANON_INVENTORY.json
- **Required**: CANON_INVENTORY entries for each Tier 1 document with matching SHA256
- **Severity if Missing**: BLOCKER - Constitutional domain knowledge unverifiable

---

## SECTION 3: VALIDATION REQUIREMENTS

### 3.1 File Size Validation

- **Requirement**: MANDATORY (BLOCKING)
- **Validation**: Character count MUST be < 30,000
- **Enforcement**: Pre-PR creation validation
- **Test Command**: `wc -m < .github/agents/[specialist-name].agent.md`
- **Severity if Exceeded**: BLOCKER

### 3.2 Version Consistency

- **Requirement**: MANDATORY
- **Validation**: All version references MUST be v6.2.0
- **Check Locations**: YAML frontmatter, session memory template, authority footer
- **Severity if Inconsistent**: HIGH

### 3.3 Domain Canon References

- **Requirement**: MANDATORY
- **Validation**: All Tier 1 and Tier 2 knowledge paths exist and have CANON_INVENTORY entries
- **Rationale**: Domain knowledge must be canonical; ad hoc references indicate governance gap
- **Severity if Missing**: HIGH

---

## VALIDATION SUMMARY

**Total Required Sections**: 9 mandatory components + 3 specialist-specific + 3 validation  
**Compliance Threshold**: 100% (ALL items MUST be ✅)  
**Character Limit**: < 30,000 characters (BLOCKING)  
**Version Requirement**: Living Agent System v6.2.0  
**CS2 Authorization**: REQUIRED for all specialist contract creation/modification

---

## Authority

**Living Agent System**: v6.2.0  
**Checklist Version**: 1.0.0  
**Authority**: CS2 (Johan Ras)  
**Canonical Home**: APGI-cmy/maturion-foreman-governance  
**Last Updated**: 2026-02-20  
**Review Frequency**: Quarterly
