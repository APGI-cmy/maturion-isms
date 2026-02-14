# GOVERNANCE AGENT REQUIREMENTS MATRIX

## Status
**Type**: Canonical Governance Reference — PUBLIC_API  
**Authority**: Supreme - Canonical  
**Version**: 1.0.0  
**Effective Date**: 2026-02-04  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Subordinate to GOVERNANCE_PURPOSE_AND_SCOPE.md

---

## 1. Purpose

This matrix defines which governance artifacts are **mandatory**, **recommended**, or **not applicable** for each agent type operating in the Maturion ecosystem. It serves as the canonical reference for:

1. **Agent Contract Creation** - Which governance must be bound during agent onboarding
2. **Gap Detection** - Automated identification of missing governance requirements
3. **Ripple Validation** - Verification that governance changes propagate to correct agent types
4. **Compliance Auditing** - Systematic review of agent governance coverage

**Problem Addressed**: Without a canonical matrix, governance requirements are scattered across multiple documents, leading to:
- Inconsistent governance binding across agent contracts
- Manual gap analysis prone to omission
- Unclear ripple scope when governance changes
- No systematic way to validate agent compliance

**Solution**: Single source of truth mapping all governance artifacts to all agent types with clear applicability rules.

---

## 2. Constitutional Authority

This matrix derives authority from:
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** — Supreme governance authority
- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md** — Agent contract requirements
- **AGENT_SELF_GOVERNANCE_PROTOCOL.md** — Self-governance obligations
- **GOVERNANCE_RIPPLE_MODEL.md** — Propagation requirements
- **Issue #999** — Inventory and tracking mandate

---

## 3. Agent Type Definitions

### 3.1 Core Agent Types

| Agent Type | Class | Primary Responsibility | Repository Scope |
|------------|-------|------------------------|------------------|
| **Foreman (FM)** | Overseer | Application orchestration, builder coordination, governance enforcement | Consumer repos (office-app, PartPulse, R_Roster) |
| **Builder** | Executor | Code implementation, test creation, build execution | Consumer repos |
| **Governance-Liaison** | Administrator | Governance layer-down, local governance maintenance | Consumer repos |
| **Governance-Repo-Administrator** | Administrator | Canonical governance maintenance, ripple execution | Governance repo (CANONICAL) |
| **CodexAdvisor** | Overseer | Cross-repo coordination, approval-gated oversight | Governance + Consumer repos |
| **Assurance** | Validator | Perpetual compliance validation, gap detection | All repos (post-FM launch) |

### 3.2 Agent Type Hierarchy

```
Supreme Authority: GOVERNANCE_PURPOSE_AND_SCOPE.md
├── Overseer Tier (FM, CodexAdvisor)
│   └── Approval-gated execution
│   └── Cross-agent coordination
├── Administrator Tier (Governance-Liaison, Governance-Repo-Administrator)
│   └── Governance maintenance
│   └── Ripple execution
├── Executor Tier (Builder)
│   └── Code implementation
│   └── Test creation
└── Validator Tier (Assurance - post-launch)
    └── Compliance validation
    └── Gap remediation
```

---

## 4. Governance Requirements Matrix

### Legend
- ✅ **MANDATORY** - Must be bound in agent contract, failure = gate rejection
- 🟡 **RECOMMENDED** - Should be bound, improves effectiveness but not blocking
- ⚪ **NOT APPLICABLE** - Not relevant to agent type
- 🔒 **LOCKED** - Requires LOCKED section in agent contract (see AGENT_CONTRACT_PROTECTION_PROTOCOL.md)

---

### 4.1 Constitutional & Supreme Authority

| Governance Artifact | FM | Builder | Gov-Liaison | Gov-Repo-Admin | CodexAdvisor | Assurance |
|---------------------|----|---------|--------------|--------------------|--------------|-----------|
| **GOVERNANCE_PURPOSE_AND_SCOPE.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **BUILD_PHILOSOPHY.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **CONSTITUTION.md** | ✅ | 🟡 | ✅ | ✅ | ✅ | ✅ |

---

### 4.2 Execution & Validation

| Governance Artifact | FM | Builder | Gov-Liaison | Gov-Repo-Admin | CodexAdvisor | Assurance |
|---------------------|----|---------|--------------|--------------------|--------------|-----------|
| **EXECUTION_BOOTSTRAP_PROTOCOL.md** | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 |
| **CI_CONFIRMATORY_NOT_DIAGNOSTIC.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **STOP_AND_FIX_DOCTRINE.md** | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 |
| **AGENT_TEST_EXECUTION_PROTOCOL.md** | ✅🔒 | ✅🔒 | 🟡 | 🟡 | ✅ | ✅ |
| **SCOPE_TO_DIFF_RULE.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **MERGE_GATE_PHILOSOPHY.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 4.3 Agent Contract & Self-Governance

| Governance Artifact | FM | Builder | Gov-Liaison | Gov-Repo-Admin | CodexAdvisor | Assurance |
|---------------------|----|---------|--------------|--------------------|--------------|-----------|
| **AGENT_CONTRACT_PROTECTION_PROTOCOL.md** | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 |
| **AGENT_SELF_GOVERNANCE_PROTOCOL.md** | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 |
| **CS2_AGENT_FILE_AUTHORITY_MODEL.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md** | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 |
| **agent-contracts-guidance/** (folder) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 4.4 Ripple & Layer-Down

| Governance Artifact | FM | Builder | Gov-Liaison | Gov-Repo-Admin | CodexAdvisor | Assurance |
|---------------------|----|---------|--------------|--------------------|--------------|-----------|
| **GOVERNANCE_RIPPLE_MODEL.md** | 🟡 | ⚪ | ✅ | ✅🔒 | ✅ | ✅ |
| **GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md** | ⚪ | ⚪ | ✅ | ✅🔒 | ✅ | ✅ |
| **GOVERNANCE_LAYERDOWN_CONTRACT.md** | ⚪ | ⚪ | ✅ | ✅ | ✅ | ✅ |
| **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md** | ⚪ | ⚪ | ✅ | ✅ | ✅ | ✅ |

---

### 4.5 Handover & Evidence

| Governance Artifact | FM | Builder | Gov-Liaison | Gov-Repo-Admin | CodexAdvisor | Assurance |
|---------------------|----|---------|--------------|--------------------|--------------|-----------|
| **PREHANDOVER_PROOF_TEMPLATE.md** | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 |
| **MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md** | ✅ | ✅ | ✅ | ✅🔒 | ✅ | ✅ |
| **OPOJD_DOCTRINE.md** | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 | ✅🔒 |
| **CS2_OPOJD_EXTENSION.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 4.6 Failure Handling & Learning

| Governance Artifact | FM | Builder | Gov-Liaison | Gov-Repo-Admin | CodexAdvisor | Assurance |
|---------------------|----|---------|--------------|--------------------|--------------|-----------|
| **FAILURE_PROMOTION_RULE.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **BOOTSTRAP_EXECUTION_LEARNINGS.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **LEARNING_INTAKE_AND_PROMOTION_MODEL.md** | 🟡 | 🟡 | ✅ | ✅ | ✅ | ✅ |
| **GOVERNANCE_INCIDENT_RESPONSE_DOCTRINE.md** | ✅ | 🟡 | ✅ | ✅ | ✅ | ✅ |

---

### 4.7 Foreman-Specific

| Governance Artifact | FM | Builder | Gov-Liaison | Gov-Repo-Admin | CodexAdvisor | Assurance |
|---------------------|----|---------|--------------|--------------------|--------------|-----------|
| **FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** | ✅🔒 | 🟡 | 🟡 | ⚪ | ✅ | 🟡 |
| **FM_BUILDER_APPOINTMENT_PROTOCOL.md** | ✅🔒 | 🟡 | ⚪ | ⚪ | 🟡 | 🟡 |
| **FM_GOVERNANCE_LOADING_PROTOCOL.md** | ✅🔒 | ⚪ | ⚪ | ⚪ | 🟡 | ⚪ |
| **FM_RUNTIME_ENFORCEMENT_AND_AWARENESS_MODEL.md** | ✅🔒 | 🟡 | ⚪ | ⚪ | 🟡 | 🟡 |

---

### 4.8 Builder-Specific

| Governance Artifact | FM | Builder | Gov-Liaison | Gov-Repo-Admin | CodexAdvisor | Assurance |
|---------------------|----|---------|--------------|--------------------|--------------|-----------|
| **BUILDER_FIRST_PR_MERGE_MODEL.md** | ✅ | ✅🔒 | ⚪ | ⚪ | 🟡 | 🟡 |
| **BUILDER_CONTRACT_BINDING_CHECKLIST.md** | 🟡 | ✅ | 🟡 | ⚪ | 🟡 | 🟡 |
| **ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md** | ✅ | ✅ | ⚪ | ⚪ | 🟡 | 🟡 |
| **BUILD_TREE_EXECUTION_MODEL.md** | 🟡 | ✅ | ⚪ | ⚪ | 🟡 | 🟡 |

---

### 4.9 Gate Enforcement

| Governance Artifact | FM | Builder | Gov-Liaison | Gov-Repo-Admin | CodexAdvisor | Assurance |
|---------------------|----|---------|--------------|--------------------|--------------|-----------|
| **GOVERNANCE_GATE_CANON.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **GATE_PREDICTIVE_COMPLIANCE_ANALYSIS.md** | 🟡 | 🟡 | 🟡 | ✅ | ✅ | ✅ |
| **BRANCH_PROTECTION_ENFORCEMENT.md** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **INITIALIZATION_COMPLETENESS_GATE.md** | 🟡 | ⚪ | ✅ | ✅ | ✅ | ✅ |

---

### 4.10 Inventory & Gap Detection (NEW)

| Governance Artifact | FM | Builder | Gov-Liaison | Gov-Repo-Admin | CodexAdvisor | Assurance |
|---------------------|----|---------|--------------|--------------------|--------------|-----------|
| **GOVERNANCE_AGENT_REQUIREMENTS_MATRIX.md** (this file) | ✅ | ✅ | ✅ | ✅🔒 | ✅ | ✅ |
| **GOVERNANCE_INVENTORY_SCHEMA.json** | 🟡 | ⚪ | ✅ | ✅ | ✅ | ✅ |
| **GOVERNANCE_INVENTORY.json** (per-repo) | 🟡 | ⚪ | ✅🔒 | ✅🔒 | ✅ | ✅🔒 |

---

## 5. Machine-Readable Metadata

For automated tooling and gap analysis:

```yaml
---
matrix_version: 1.0.0
last_updated: 2026-02-04
authority: GOVERNANCE_PURPOSE_AND_SCOPE.md
agent_types:
  - id: foreman
    class: overseer
    scope: consumer_repos
  - id: builder
    class: executor
    scope: consumer_repos
  - id: governance-liaison
    class: administrator
    scope: consumer_repos
  - id: governance-repo-administrator
    class: administrator
    scope: governance_repo
  - id: CodexAdvisor
    class: overseer
    scope: cross_repo
  - id: assurance
    class: validator
    scope: all_repos
    status: post_launch

applicability_rules:
  mandatory: "MUST be bound, gate rejection if missing"
  recommended: "SHOULD be bound, improves effectiveness"
  not_applicable: "Not relevant to agent type"
  locked_required: "Requires LOCKED section per AGENT_CONTRACT_PROTECTION_PROTOCOL.md"

enforcement:
  validation_script: .github/scripts/governance-gap-analyzer.sh
  pre_work_protocol: governance/canon/PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md
  gate_integration: agent-governance-check.yml
---
```

---

## 6. Usage Guidelines

### 6.1 For Agent Contract Creation
1. Identify agent type (FM, Builder, Gov-Liaison, etc.)
2. Find agent type column in matrix
3. Include all ✅ MANDATORY artifacts in `governance.bindings`
4. Add 🔒 LOCKED sections per AGENT_CONTRACT_PROTECTION_PROTOCOL.md
5. Consider 🟡 RECOMMENDED artifacts based on agent mission

### 6.2 For Gap Detection
1. Run `.github/scripts/governance-gap-analyzer.sh` against agent contract
2. Script compares agent bindings to matrix requirements
3. Reports missing MANDATORY artifacts
4. Suggests RECOMMENDED artifacts
5. Validates LOCKED section presence where required

### 6.3 For Ripple Planning
1. Identify governance artifact being changed
2. Find artifact row in matrix
3. Identify all agent types with ✅ MANDATORY or 🟡 RECOMMENDED
4. Plan ripple to all consumer repos with those agent types
5. Execute GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md

### 6.4 For Compliance Auditing
1. Compare each agent contract bindings to matrix
2. Flag missing MANDATORY artifacts
3. Verify LOCKED sections present where 🔒 required
4. Generate compliance report
5. Escalate gaps to CS2 for remediation

---

## 7. Maintenance

### 7.1 When to Update Matrix

This matrix MUST be updated when:
- New agent type introduced
- New governance canon created
- Governance artifact responsibilities change
- Agent type authority boundaries modified
- Enforcement requirements change

### 7.2 Update Process
1. Identify change requiring matrix update
2. Update relevant rows/columns
3. Increment version number (semantic versioning)
4. Update `last_updated` metadata
5. Execute GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md
6. Update GOVERNANCE_ARTIFACT_INVENTORY.md
7. Regenerate GOVERNANCE_INVENTORY.json for all consumer repos
8. Coordinate with governance-liaison agents for layer-down

### 7.3 Version History
- **v1.0.0** (2026-02-04) - Initial matrix creation with 6 agent types and 40+ governance artifacts

---

## 8. Cross-References

**Mandatory Reading**:
- `AGENT_CONTRACT_PROTECTION_PROTOCOL.md` — LOCKED sections requirements
- `AGENT_SELF_GOVERNANCE_PROTOCOL.md` — Self-governance obligations
- `PRE_WORK_GOVERNANCE_SELF_TEST_PROTOCOL.md` — Pre-work gap detection
- `GOVERNANCE_RIPPLE_MODEL.md` — Ripple propagation rules

**Related Artifacts**:
- `GOVERNANCE_INVENTORY_SCHEMA.json` — Validation schema for inventories
- `.github/scripts/governance-gap-analyzer.sh` — Gap detection script
- `GOVERNANCE_ARTIFACT_INVENTORY.md` — Complete governance catalog

---

## 9. Notes

### 9.1 Bootstrap Phase Considerations
During bootstrap (pre-FM launch), CS2 (Johan Ras) manually fixes agent contract gaps flagged in PRs. After FM and Assurance agent launch, gap detection and remediation become automated.

### 9.2 PUBLIC_API Designation
This matrix is designated **PUBLIC_API** in GOVERNANCE_ARTIFACT_INVENTORY.md, meaning:
- External tooling may depend on its structure
- Changes require version increment
- Breaking changes require deprecation period
- Machine-readable metadata must remain stable

### 9.3 Future Enhancements
Planned improvements (post-bootstrap):
- Automated matrix validation in CI
- Gap remediation auto-PRs from Assurance agent
- Matrix version compatibility checks
- Dynamic binding generation from matrix

---

**END OF GOVERNANCE_AGENT_REQUIREMENTS_MATRIX.md**
