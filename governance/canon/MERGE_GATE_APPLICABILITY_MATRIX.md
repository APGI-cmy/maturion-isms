# MERGE GATE APPLICABILITY MATRIX

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-09  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Repositories  

---

## 1. Purpose

This document provides the **authoritative mapping of agent roles to applicable merge gates**, ensuring precise, deterministic gate enforcement across all repositories in the Maturion ecosystem.

This matrix exists to ensure:
- **Zero ambiguity** on which gates apply to which agent roles
- **Predictable enforcement** for all agent classes
- **No misapplied gates** blocking valid work
- **Canonical reference** for gate implementation
- **Consistency** across repositories

**Core Principle**: Agent role authoritatively determines gate applicability. This matrix is the single source of truth.

---

## 2. Constitutional Authority

This matrix derives authority from and implements:
- **AGENT_ROLE_GATE_APPLICABILITY.md** - Agent role definitions and gate requirements
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Class-specific gate protocols
- **MERGE_GATE_PHILOSOPHY.md** - Gate principles and patterns
- **PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md** - Gate evaluation semantics
- **FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md** - FM gate management authority
- **BUILD_PHILOSOPHY.md** - One-Time Build Law, 100% GREEN mandate

---

## 3. Agent Role Taxonomy

### 3.1 Agent Classes

This matrix recognizes **four primary agent classes**:

1. **Builder** - Application code implementation, test-to-green execution
2. **Liaison** - Repository governance administration, governance propagation
3. **Foreman** - Build orchestration, wave planning, QA creation, builder supervision
4. **Overseer** - Cross-repository coordination, constitutional enforcement, quality oversight

**Note**: Repository Seeding/Admin Liaison is a specialized Liaison role with specific gate requirements.

### 3.2 Role Detection

Gates MUST detect agent role using authoritative methods (per AGENT_ROLE_GATE_APPLICABILITY.md):
- **Primary**: Explicit agent declaration in PR metadata (`AGENT_ROLE: builder`)
- **Secondary**: Agent contract reference (`.agent` file with `role:` field)
- **Tertiary**: Repository context (governance repo only, for governance-only changes)

Gates MUST NOT use file paths, PR titles, or heuristics as sole role indicators.

---

## 4. Gate Categories

### 4.1 Gate Type Definitions

**Category A: Build Quality Gates**
- Purpose: Enforce code quality, testing, and build standards
- Examples: 100% GREEN QA, architecture completeness, build success
- Primary Role: Builder

**Category B: Governance Compliance Gates**
- Purpose: Enforce governance artifact presence and validity
- Examples: Scope-to-diff, YAML validation, governance checks
- Primary Role: All (role-specific requirements)

**Category C: Evidence Gates**
- Purpose: Ensure handover evidence complete
- Examples: PREHANDOVER_PROOF, QA reports, architecture evidence
- Primary Role: Builder, Foreman

**Category D: Constitutional Safeguards**
- Purpose: Enforce constitutional rules (CS1-CS6)
- Examples: Protected file checks, governance supremacy
- Primary Role: All (universal)

**Category E: FM-Specific Gates**
- Purpose: Enforce FM orchestration requirements
- Examples: Wave completion, QA creation, learning promotion
- Primary Role: Foreman

**Category F: Initialization Gates**
- Purpose: Validate repository initialization completeness
- Examples: Mandatory structure, initialization evidence
- Primary Role: Liaison (Repository Seeding)

---

## 5. Gate Applicability Matrix

### 5.1 Matrix Format

For each gate:
- **Gate Name**: Canonical gate identifier
- **Category**: Gate category (A-F from Section 4.1)
- **Builder**: ✅ (applies) or ❌ (does not apply)
- **Liaison**: ✅ or ❌
- **Foreman**: ✅ or ❌
- **Overseer**: ✅ or ❌
- **Canonical Reference**: Source document defining requirement
- **Implementation Note**: Key implementation guidance

### 5.2 Master Gate Applicability Matrix

| Gate Name | Category | Builder | Liaison | Foreman | Overseer | Canonical Reference | Implementation Note |
|-----------|----------|---------|---------|---------|----------|---------------------|---------------------|
| **Build-to-Green Enforcement** | A | ✅ | ❌ | ✅* | ❌ | BUILD_PHILOSOPHY.md | *Foreman when acting as builder |
| **100% GREEN QA (QIEL)** | A | ✅ | ❌ | ✅* | ❌ | BUILD_PHILOSOPHY.md, AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md | *Foreman when building code |
| **Architecture Completeness** | A | ✅ | ❌ | ✅* | ❌ | ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md | *Foreman when designing new architecture |
| **Builder QA Reports** | C | ✅ | ❌ | ❌ | ❌ | BUILDER_FIRST_PR_MERGE_MODEL.md | Required: BUILD_QA_REPORT.json, GOVERNANCE_COMPLIANCE_REPORT.json, SUMMARY.md |
| **Scope-to-Diff Validation** | B | ✅ | ✅ | ✅ | ✅ | BOOTSTRAP_EXECUTION_LEARNINGS.md (BL-027) | Universal: SCOPE_DECLARATION.md must match git diff |
| **YAML Syntax Validation** | B | ✅ | ✅ | ✅ | ✅ | BOOTSTRAP_EXECUTION_LEARNINGS.md (BL-028) | Universal: yamllint exit code 0 |
| **Governance Artifact Compliance** | B | ❌ | ✅ | ❌ | ✅ | GOVERNANCE_COMPLETENESS_MODEL.md | Schemas valid, policies complete, no contradictions |
| **Self-Governance Check** | D | ✅ | ✅ | ✅ | ✅ | AGENT_SELF_GOVERNANCE_PROTOCOL.md, LIVING_AGENT_SYSTEM.md | Universal: All agents MUST perform self-governance check |
| **PREHANDOVER_PROOF Evidence** | C | ✅ | ✅ | ✅ | ✅ | MERGE_GATE_PHILOSOPHY.md | Evidence-based validation (optional but preferred) |
| **No Deprecations (BL-026)** | A | ✅ | ❌ | ✅* | ❌ | BOOTSTRAP_EXECUTION_LEARNINGS.md (BL-026) | *Foreman when building code |
| **Living Agent System Compliance** | D | ✅ | ✅ | ✅ | ✅ | LIVING_AGENT_SYSTEM.md | Wake-up, working contract, session memory, closure |
| **Governance Ripple Execution** | B | ❌ | ✅ | ❌ | ✅ | GOVERNANCE_RIPPLE_MODEL.md | Required if canon changed |
| **Canon Inventory Update** | B | ❌ | ✅ | ❌ | ✅ | GOVERNANCE_ARTIFACT_TAXONOMY.md | If governance artifacts changed |
| **Protected File Approval (CS2)** | D | ✅ | ✅ | ✅ | ✅ | AGENT_CONTRACT_PROTECTION_PROTOCOL.md | Universal: .github/workflows/, constitution/, etc. |
| **Constitutional Integrity (CS1)** | D | ✅ | ✅ | ✅ | ✅ | GOVERNANCE_GATE_CANON.md | Universal: No constitutional violations |
| **FM Wave Completion** | E | ❌ | ❌ | ✅ | ❌ | WAVE_MODEL.md, AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md | Wave plan complete, all steps done |
| **FM QA 100% GREEN** | E | ❌ | ❌ | ✅ | ❌ | AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md | FM-created QA must be 100% GREEN |
| **FM Builder Evidence** | E | ❌ | ❌ | ✅ | ❌ | AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md | Builder compliance verified |
| **FM Learning Promotion** | E | ❌ | ❌ | ✅ | ❌ | LEARNING_PROMOTION_RULE.md | Learning loop completed |
| **FM Failure Promotion** | E | ❌ | ❌ | ✅ | ❌ | FAILURE_PROMOTION_RULE.md | Failure handling documented |
| **FM Effectiveness Tracking** | E | ❌ | ❌ | ✅ | ❌ | BUILD_EFFECTIVENESS_STANDARD.md | FM effectiveness artifacts |
| **Initialization Completeness** | F | ❌ | ✅* | ❌ | ❌ | INITIALIZATION_COMPLETENESS_GATE.md | *Only for Repository Seeding role |
| **Initialization Evidence** | F | ❌ | ✅* | ❌ | ❌ | REPOSITORY_INITIALIZATION_AND_GOVERNANCE_SEEDING_PROTOCOL.md | *Only for Repository Seeding role |
| **Cross-Repository Integrity** | D | ❌ | ❌ | ❌ | ✅ | CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md | Overseer: Layer-down requirements |
| **Quality Gate Enforcement** | D | ❌ | ❌ | ❌ | ✅ | AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md | Overseer: Quality oversight |

**Legend**:
- ✅ = Gate applies to this role
- ❌ = Gate does NOT apply to this role
- ✅* = Conditionally applies (see Implementation Note)

---

## 6. Role-Specific Gate Profiles

### 6.1 Builder Agent Gate Profile

**Applicable Gates** (Builder MUST satisfy):

1. **Build-to-Green Enforcement** - Complete build-to-green process
2. **100% GREEN QA (QIEL)** - All tests passing, zero debt
3. **Architecture Completeness** - Architecture designed and validated
4. **Builder QA Reports** - All `.qa/builder/*` artifacts present and valid
5. **Scope-to-Diff Validation** - SCOPE_DECLARATION.md matches git diff
6. **YAML Syntax Validation** - All YAML files valid
7. **No Deprecations (BL-026)** - Zero deprecated API usage
8. **Self-Governance Check** - AGENT_SELF_GOVERNANCE_PROTOCOL.md followed
9. **Living Agent System Compliance** - Wake-up, contract, memory, closure
10. **Protected File Approval (CS2)** - CS2 approval if protected files modified
11. **Constitutional Integrity (CS1)** - No constitutional violations

**Not Applicable** (Builder does NOT need to satisfy):
- Governance Artifact Compliance (not maintaining governance)
- Governance Ripple Execution (not changing canon)
- Canon Inventory Update (not governance work)
- FM-specific gates (not acting as FM)
- Initialization gates (not seeding repositories)
- Cross-repository integrity (not overseer role)

**Summary**: Builders are subject to **full build quality enforcement** but NOT governance-specific or FM-specific gates.

### 6.2 Liaison Agent Gate Profile

**Applicable Gates** (Liaison MUST satisfy):

1. **Scope-to-Diff Validation** - SCOPE_DECLARATION.md matches git diff
2. **YAML Syntax Validation** - All YAML files valid
3. **Governance Artifact Compliance** - Schemas valid, policies complete
4. **Self-Governance Check** - AGENT_SELF_GOVERNANCE_PROTOCOL.md followed
5. **Living Agent System Compliance** - Wake-up, contract, memory, closure
6. **Governance Ripple Execution** - If canon changed, ripple executed
7. **Canon Inventory Update** - If governance artifacts changed
8. **Protected File Approval (CS2)** - CS2 approval if protected files modified
9. **Constitutional Integrity (CS1)** - No constitutional violations
10. **Initialization Completeness** - *Only for Repository Seeding role*
11. **Initialization Evidence** - *Only for Repository Seeding role*

**Not Applicable** (Liaison does NOT need to satisfy):
- Build-to-Green Enforcement (no application code)
- 100% GREEN QA (no tests to execute)
- Architecture Completeness (governance is documentation)
- Builder QA Reports (no build artifacts)
- No Deprecations (no code compilation)
- FM-specific gates (not FM orchestration)
- Cross-repository integrity (not overseer role)

**Summary**: Liaisons are subject to **governance-scoped enforcement** but NOT builder-specific or FM-specific gates.

### 6.3 Foreman Agent Gate Profile

**Applicable Gates** (Foreman MUST satisfy):

1. **Scope-to-Diff Validation** - SCOPE_DECLARATION.md matches git diff
2. **YAML Syntax Validation** - All YAML files valid
3. **Self-Governance Check** - AGENT_SELF_GOVERNANCE_PROTOCOL.md followed
4. **Living Agent System Compliance** - Wake-up, contract, memory, closure
5. **Protected File Approval (CS2)** - CS2 approval if protected files modified
6. **Constitutional Integrity (CS1)** - No constitutional violations
7. **FM Wave Completion** - Wave plan complete, all steps done
8. **FM QA 100% GREEN** - FM-created QA passing
9. **FM Builder Evidence** - Builder compliance verified
10. **FM Learning Promotion** - Learning loop completed
11. **FM Failure Promotion** - Failure handling documented
12. **FM Effectiveness Tracking** - FM effectiveness artifacts
13. **Build-to-Green Enforcement** - *Only when FM acts as builder*
14. **100% GREEN QA** - *Only when FM builds code*
15. **Architecture Completeness** - *Only when FM designs new architecture*

**Not Applicable** (Foreman does NOT need to satisfy):
- Builder QA Reports (FM doesn't produce builder artifacts)
- Governance Artifact Compliance (unless modifying governance)
- Governance Ripple Execution (unless changing canon)
- Initialization gates (not seeding repositories)
- Cross-repository integrity (not overseer role)

**Summary**: Foreman is subject to **FM-scoped enforcement** plus builder gates when acting as builder.

### 6.4 Overseer Agent Gate Profile

**Applicable Gates** (Overseer MUST satisfy):

1. **Scope-to-Diff Validation** - SCOPE_DECLARATION.md matches git diff
2. **YAML Syntax Validation** - All YAML files valid
3. **Governance Artifact Compliance** - Schemas valid, policies complete
4. **Self-Governance Check** - AGENT_SELF_GOVERNANCE_PROTOCOL.md followed
5. **Living Agent System Compliance** - Wake-up, contract, memory, closure
6. **Governance Ripple Execution** - If canon changed, ripple executed
7. **Canon Inventory Update** - If governance artifacts changed
8. **Protected File Approval (CS2)** - CS2 approval if protected files modified
9. **Constitutional Integrity (CS1)** - No constitutional violations
10. **Cross-Repository Integrity** - Layer-down requirements satisfied
11. **Quality Gate Enforcement** - Quality oversight validated

**Not Applicable** (Overseer does NOT need to satisfy):
- Build-to-Green Enforcement (not building code)
- 100% GREEN QA (not executing builds)
- Architecture Completeness (not designing architecture)
- Builder QA Reports (no build artifacts)
- FM-specific gates (not FM orchestration)
- Initialization gates (not seeding repositories)

**Summary**: Overseer is subject to **constitutional enforcement and cross-repository integrity** but NOT builder or FM gates.

---

## 7. Gate Implementation Patterns

### 7.1 Role Detection Pattern

**All gates MUST implement role detection**:

```yaml
- name: Detect Agent Role
  id: detect_role
  run: |
    echo "=== Agent Role Detection ==="
    
    # Method 1: Explicit declaration in PR body
    if grep -qi "AGENT_ROLE:\s*builder" <<< "${{ github.event.pull_request.body }}"; then
      echo "role=builder" >> $GITHUB_OUTPUT
    elif grep -qi "AGENT_ROLE:\s*liaison" <<< "${{ github.event.pull_request.body }}"; then
      echo "role=liaison" >> $GITHUB_OUTPUT
    elif grep -qi "AGENT_ROLE:\s*foreman" <<< "${{ github.event.pull_request.body }}"; then
      echo "role=foreman" >> $GITHUB_OUTPUT
    elif grep -qi "AGENT_ROLE:\s*overseer" <<< "${{ github.event.pull_request.body }}"; then
      echo "role=overseer" >> $GITHUB_OUTPUT
    else
      # Method 2: Agent contract reference
      # Method 3: Repository context (governance repo only)
      # Default: Require explicit declaration
      echo "role=unknown" >> $GITHUB_OUTPUT
    fi
    
    echo "Detected role: $(cat $GITHUB_OUTPUT | grep role= | cut -d= -f2)"
```

### 7.2 Conditional Gate Execution Pattern

**Gates MUST check role before executing**:

```yaml
- name: [Gate Name]
  if: |
    steps.detect_role.outputs.role == 'builder' ||
    steps.detect_role.outputs.role == 'foreman'
  run: |
    echo "=== [Gate Name] - Applicable to Builder/Foreman ==="
    # Gate validation logic here
```

### 7.3 Evidence-Based Validation Pattern

**Gates SHOULD implement evidence-based validation**:

```yaml
- name: Check for Evidence
  id: evidence_check
  run: |
    if [ -f "PREHANDOVER_PROOF.md" ] && grep -qi "[gate-keyword]" PREHANDOVER_PROOF.md; then
      echo "skip_execution=true" >> $GITHUB_OUTPUT
      echo "✅ Evidence-based validation - PASS"
    else
      echo "skip_execution=false" >> $GITHUB_OUTPUT
      echo "ℹ️  No evidence - proceeding with script execution"
    fi

- name: Execute Gate Validation
  if: steps.evidence_check.outputs.skip_execution != 'true'
  run: |
    # Actual validation script
```

### 7.4 Clear Failure Message Pattern

**Gate failures MUST provide clear messages**:

```yaml
- name: [Gate Name]
  run: |
    if ! [validation command]; then
      echo "❌ PR Gate Failed: [Gate Name]"
      echo ""
      echo "Agent Role Detected: ${{ steps.detect_role.outputs.role }}"
      echo "Applicable Roles: builder, foreman"
      echo "Failed Requirement: [Specific requirement]"
      echo "Canonical Reference: [Document name]"
      echo ""
      echo "Action Required: [How to fix]"
      exit 1
    fi
```

---

## 8. Governance Compliance Checklist

### 8.1 For Gate Implementers

When implementing a new gate or updating existing gate, verify:

- [ ] **Role Detection**: Gate detects agent role using authoritative methods
- [ ] **Applicability Check**: Gate only executes for applicable roles (per matrix in Section 5.2)
- [ ] **Evidence Support**: Gate implements evidence-based validation (PREHANDOVER_PROOF)
- [ ] **Conditional Execution**: Gate only runs validation if evidence not found
- [ ] **Clear Messages**: Failures include role, requirement, reference, remediation
- [ ] **Canonical Alignment**: Gate logic matches canonical requirements
- [ ] **Matrix Compliance**: Gate applicability matches this matrix
- [ ] **Testing**: Gate tested against all agent roles (applicable and non-applicable)
- [ ] **Documentation**: Gate documented with canonical references

### 8.2 For FM Gate Maintenance

When fixing gate misalignments, verify:

- [ ] **Misalignment Classification**: Issue correctly categorized (FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md Section 4.1)
- [ ] **Authority Check**: Fix within FM autonomous authority
- [ ] **Matrix Alignment**: Fix aligns gate with this matrix
- [ ] **No Weakening**: Fix doesn't reduce enforcement below canonical requirements
- [ ] **Role Detection**: Fix uses authoritative role detection
- [ ] **Evidence Pattern**: Fix implements evidence-based validation
- [ ] **Clear Messages**: Fix improves failure message clarity
- [ ] **Testing**: Fix tested against all agent roles
- [ ] **Documentation**: Fix documented with rationale and canonical basis

---

## 9. Enforcement and Workflow Implementation

### 9.1 CI/CD Workflow Structure

**Recommended structure for gate workflows**:

```yaml
name: Role-Aware Merge Gate

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  detect-agent-role:
    runs-on: ubuntu-latest
    outputs:
      role: ${{ steps.detect.outputs.role }}
    steps:
      - name: Detect Agent Role
        id: detect
        # Role detection logic (Section 7.1)
        
  builder-gates:
    needs: detect-agent-role
    if: needs.detect-agent-role.outputs.role == 'builder'
    runs-on: ubuntu-latest
    steps:
      - name: Build-to-Green Enforcement
      - name: 100% GREEN QA
      - name: Architecture Completeness
      - name: Builder QA Reports
      # ... other builder gates
      
  liaison-gates:
    needs: detect-agent-role
    if: needs.detect-agent-role.outputs.role == 'liaison'
    runs-on: ubuntu-latest
    steps:
      - name: Governance Artifact Compliance
      - name: Governance Ripple Check
      - name: Canon Inventory Update
      # ... other liaison gates
      
  foreman-gates:
    needs: detect-agent-role
    if: needs.detect-agent-role.outputs.role == 'foreman'
    runs-on: ubuntu-latest
    steps:
      - name: FM Wave Completion
      - name: FM QA 100% GREEN
      - name: FM Builder Evidence
      # ... other FM gates
      
  universal-gates:
    needs: detect-agent-role
    runs-on: ubuntu-latest
    steps:
      - name: Scope-to-Diff Validation
      - name: YAML Syntax Validation
      - name: Self-Governance Check
      - name: Living Agent System Compliance
      # ... other universal gates
```

### 9.2 Gate Failure Handling

**When gate fails**:

1. **Check Agent Role**: Verify detected role is correct
2. **Check Applicability**: Verify gate should apply to this role (per matrix)
3. **If Misapplied**: Gate error, not agent failure → FM fixes gate
4. **If Legitimate**: Agent must remediate per gate requirement

**Escalation Path**:
- Misapplied gate → FM fixes per FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md
- Legitimate failure → Agent remediates or escalates per role-specific protocol
- Ambiguous requirement → Escalate to CS2

---

## 10. Integration with Existing Canon

### 10.1 Relationship to AGENT_ROLE_GATE_APPLICABILITY.md

**AGENT_ROLE_GATE_APPLICABILITY.md defines**:
- Principles of role-based applicability
- Role definitions and responsibilities
- Gate applicability by agent class (narrative)
- Non-negotiable invariants

**MERGE_GATE_APPLICABILITY_MATRIX.md (this document) provides**:
- Tabular mapping of gates to roles (operational)
- Specific gate list with applicability flags
- Implementation patterns for role detection
- Governance compliance checklists

**Integration**: This matrix operationalizes the principles defined in AGENT_ROLE_GATE_APPLICABILITY.md.

### 10.2 Relationship to AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md

**AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md defines**:
- Gate requirements per agent class (detailed)
- Self-alignment authority boundaries
- Gate validation procedures
- Cross-cutting requirements

**MERGE_GATE_APPLICABILITY_MATRIX.md provides**:
- Quick-reference matrix of gate-to-role mappings
- Implementation patterns for gate workflows
- Role-specific gate profiles

**Integration**: This matrix provides the implementation view; AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md provides the governance view.

### 10.3 Relationship to FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md

**FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md defines**:
- FM authority to fix gate misalignments
- Detection and classification of misalignments
- Fix vs. escalation decision workflow

**MERGE_GATE_APPLICABILITY_MATRIX.md provides**:
- Authoritative reference for correct gate applicability
- Detection of role misapplication patterns
- Compliance checklist for gate fixes

**Integration**: FM uses this matrix as canonical source when fixing gate applicability issues.

---

## 11. Success Criteria

This matrix is successful when:

- ✅ Every gate has clear role applicability defined
- ✅ No ambiguity on which gates apply to which roles
- ✅ Gate implementations reference this matrix
- ✅ FM uses this matrix when fixing misalignments
- ✅ No misapplied gates block valid work
- ✅ Gate failures are predictable and role-appropriate
- ✅ All repositories use consistent gate applicability
- ✅ Matrix stays synchronized with canonical governance

---

## 12. Validation & Maintenance

### 12.1 Matrix Validation

This matrix MUST be validated:
- **Before gate implementation**: Implementers reference this matrix
- **After canonical changes**: Matrix updated if agent roles or gate requirements change
- **Quarterly**: CS2 reviews for completeness, accuracy, gaps

### 12.2 Matrix Evolution

**Changes to this matrix**:
- MUST be approved by CS2 (Johan Ras)
- MUST align with canonical source documents
- MUST trigger governance ripple
- MUST update GOVERNANCE_ARTIFACT_INVENTORY.md
- MUST notify all repositories using gates

### 12.3 Synchronization

**Matrix MUST stay synchronized with**:
- AGENT_ROLE_GATE_APPLICABILITY.md (role definitions)
- AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md (gate requirements)
- MERGE_GATE_PHILOSOPHY.md (gate patterns)
- New gates added to CI/CD workflows
- New agent roles or classes

---

## 13. Cross-References

### 13.1 Primary Dependencies

- **AGENT_ROLE_GATE_APPLICABILITY.md** - Agent role definitions
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Class-specific requirements
- **MERGE_GATE_PHILOSOPHY.md** - Gate principles
- **FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md** - FM gate management
- **BUILD_PHILOSOPHY.md** - One-Time Build Law

### 13.2 Supporting Protocols

- **PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md** - Evaluation semantics
- **PR_GATE_FAILURE_HANDLING_PROTOCOL.md** - Failure handling
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** - Universal self-governance
- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle
- **GOVERNANCE_RIPPLE_MODEL.md** - Canon change propagation

---

## 14. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-09 | CS2 (Johan Ras) | Initial canonical matrix establishing authoritative gate-to-role mappings |

---

**Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-09  
**Next Review**: 2026-05-09 (Quarterly)  
**Status**: ACTIVE

---

*End of Merge Gate Applicability Matrix v1.0.0*
