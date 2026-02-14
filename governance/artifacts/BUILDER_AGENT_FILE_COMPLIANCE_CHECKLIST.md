# BUILDER AGENT FILE COMPLIANCE CHECKLIST

**Status**: Canonical Governance Artifact  
**Version**: 1.1.0  
**Authority**: Governance Liaison (maturion-isms)  
**Created**: 2026-02-14  
**Purpose**: Machine-checkable checklist for builder agent file creation and validation

---

## Executive Summary

This document provides a **machine-checkable compliance checklist** for creating and validating builder agent files. It ensures all builder agents are properly configured with required metadata, governance bindings, and constitutional commitments before recruitment and execution.

**Critical Principle**: A builder agent file is INCOMPLETE and the agent is OUT OF GOVERNANCE if ANY required element is missing or non-compliant.

This checklist is derived from:
- `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` v1.2.0 (comprehensive binding requirements)
- `.github/agents/BUILDER_CONTRACT_SCHEMA.md` v2.0 (file format and structure)
- `governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md` (agent file specifications)
- `governance/CANON_INVENTORY.json` (canonical governance alignment)

---

## Usage Instructions

### For Foreman (FM) During Builder Recruitment

When creating builder agent files:
1. Use this checklist to verify all required elements are present
2. Mark each item as ✅ (compliant) or ❌ (non-compliant)
3. A builder agent file is VALID only if ALL required items are ✅
4. Block recruitment if validation fails
5. Document checklist completion as evidence artifact

### For Validation Tooling

Automated validators MUST:
1. Parse builder agent file (`.github/agents/<builder-id>.md`)
2. For each checklist item, verify presence and correctness
3. Generate validation report showing pass/fail for each item
4. Return VALID only if all required items pass
5. Block recruitment/execution if validation fails

### For Governance Auditors

When auditing builder compliance:
1. Use this checklist as validation baseline
2. Verify builder agent files contain all required elements
3. Verify elements are correctly specified (not placeholders)
4. Document any gaps or non-compliance
5. Require remediation before agent may continue operating

---

## File Location and Format Requirements

### File Location
- **Requirement**: MANDATORY
- **Location**: `.github/agents/<builder-id>.md`
- **Examples**: 
  - `.github/agents/ui-builder.md`
  - `.github/agents/api-builder.md`
  - `.github/agents/schema-builder.md`
  - `.github/agents/integration-builder.md`
  - `.github/agents/qa-builder.md`
- **Validation**: File exists at correct path
- **Severity if Missing**: BLOCKER - File cannot be discovered

### File Format
- **Requirement**: MANDATORY
- **Format**: YAML frontmatter + Markdown body
- **Structure**:
  ```markdown
  ---
  # YAML frontmatter (machine-readable metadata)
  name: <Display Name>
  role: builder
  ...
  ---
  
  # Markdown body (human-readable documentation)
  ## Section 1
  Content...
  ```
- **Validation**: File contains valid YAML frontmatter followed by markdown content
- **Severity if Missing**: BLOCKER - File cannot be parsed

---

## SECTION 1: GitHub Copilot Agent Metadata (REQUIRED FOR SELECTABILITY)

### 1.1 Display Name (`name`)
- **Requirement**: MANDATORY
- **Field**: `name`
- **Type**: string
- **Description**: Display name shown in GitHub Copilot agent selector
- **Example**: `name: API Builder`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Human-readable (title case recommended)
  - Clearly identifies builder's role
- **Canonical Reference**: `.github/agents/BUILDER_CONTRACT_SCHEMA.md` section 2.1
- **Severity if Missing**: BLOCKER - Agent not selectable in GitHub Copilot

### 1.2 Agent Role (`role`)
- **Requirement**: MANDATORY
- **Field**: `role`
- **Type**: string
- **Allowed Value**: `builder`
- **Example**: `role: builder`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is exactly `builder`
- **Canonical Reference**: `.github/agents/BUILDER_CONTRACT_SCHEMA.md` section 2.2
- **Severity if Missing**: BLOCKER - Agent not selectable in GitHub Copilot

### 1.3 Description (`description`)
- **Requirement**: MANDATORY
- **Field**: `description`
- **Type**: string (1-2 sentences, <200 characters)
- **Example**: `description: Implements API routes, handlers, and business logic according to frozen architecture specifications.`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Non-empty string
  - Concise description of builder's responsibilities
- **Canonical Reference**: `.github/agents/BUILDER_CONTRACT_SCHEMA.md` section 2.3
- **Severity if Missing**: HIGH - Agent purpose unclear

---

## SECTION 2: Maturion Agent Identity and Versioning

### 2.1 Builder ID (`builder_id`)
- **Requirement**: MANDATORY
- **Field**: `builder_id`
- **Type**: string (kebab-case)
- **Example**: `builder_id: api-builder`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Matches filename (e.g., `api-builder.md` → `builder_id: api-builder`)
  - Uses kebab-case naming convention
- **Canonical Reference**: `.github/agents/BUILDER_CONTRACT_SCHEMA.md` section 3.1
- **Severity if Missing**: BLOCKER - Agent identity undefined

### 2.2 Builder Type (`builder_type`)
- **Requirement**: MANDATORY
- **Field**: `builder_type`
- **Type**: string
- **Allowed Values**: `ui`, `api`, `schema`, `integration`, `qa`, `general`
- **Example**: `builder_type: api`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value matches one of allowed types
- **Canonical Reference**: `.github/agents/BUILDER_CONTRACT_SCHEMA.md` section 3.2
- **Severity if Missing**: BLOCKER - Builder specialization undefined

### 2.3 Version (`version`)
- **Requirement**: MANDATORY
- **Field**: `version`
- **Type**: string (semantic version)
- **Example**: `version: "1.0.0"`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Follows semantic versioning (MAJOR.MINOR.PATCH)
- **Canonical Reference**: `.github/agents/BUILDER_CONTRACT_SCHEMA.md` section 3.3
- **Severity if Missing**: HIGH - Version tracking impossible

### 2.4 Status (`status`)
- **Requirement**: MANDATORY
- **Field**: `status`
- **Type**: string
- **Allowed Values**: `active`, `inactive`, `deprecated`, `draft`
- **Example**: `status: active`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value matches one of allowed statuses
- **Canonical Reference**: `.github/agents/BUILDER_CONTRACT_SCHEMA.md` section 3.4
- **Severity if Missing**: MEDIUM - Operational status unclear

### 2.5 Created Date (`created`)
- **Requirement**: MANDATORY
- **Field**: `created`
- **Type**: string (ISO 8601 date)
- **Example**: `created: "2026-02-14"`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Valid ISO 8601 date format (YYYY-MM-DD)
- **Canonical Reference**: `.github/agents/BUILDER_CONTRACT_SCHEMA.md` section 3.5
- **Severity if Missing**: MEDIUM - Audit trail incomplete

### 2.6 Updated Date (`updated`)
- **Requirement**: MANDATORY
- **Field**: `updated`
- **Type**: string (ISO 8601 date)
- **Example**: `updated: "2026-02-14"`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Valid ISO 8601 date format (YYYY-MM-DD)
  - Date >= created date
- **Canonical Reference**: `.github/agents/BUILDER_CONTRACT_SCHEMA.md` section 3.6
- **Severity if Missing**: MEDIUM - Audit trail incomplete

---

## SECTION 3: Canon Inventory Alignment (Governance Binding)

### 3.1 Canonical Governance Reference (`governance.canon_inventory`)
- **Requirement**: MANDATORY
- **Field**: `governance.canon_inventory`
- **Type**: string (path reference)
- **Example**: `governance.canon_inventory: "governance/CANON_INVENTORY.json"`
- **Validation**: 
  - Field exists in YAML frontmatter
  - References `governance/CANON_INVENTORY.json` in local repository
  - Referenced file exists and is valid JSON
- **Canonical Reference**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`
- **Severity if Missing**: BLOCKER - Agent operating without governance alignment

### 3.2 Canon Inventory Version (`governance.canon_version`)
- **Requirement**: MANDATORY
- **Field**: `governance.canon_version`
- **Type**: string (semantic version)
- **Example**: `governance.canon_version: "1.0.0"`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Matches `version` field in `governance/CANON_INVENTORY.json`
  - Version is current (not stale)
- **Canonical Reference**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`
- **Severity if Missing**: BLOCKER - Canon version drift undetected

### 3.3 Governance Binding Mode (`governance.binding`)
- **Requirement**: MANDATORY
- **Field**: `governance.binding`
- **Type**: string
- **Allowed Value**: `MANDATORY`
- **Example**: `governance.binding: "MANDATORY"`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is exactly `MANDATORY` (not "optional" or "advisory")
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.2.3
- **Severity if Missing**: BLOCKER - Governance is optional (constitutional violation)

### 3.4 Canonical Source Repository (`governance.canonical_source`)
- **Requirement**: MANDATORY
- **Field**: `governance.canonical_source`
- **Type**: string (GitHub repository reference)
- **Example**: `governance.canonical_source: "APGI-cmy/maturion-foreman-governance"`
- **Validation**: 
  - Field exists in YAML frontmatter
  - References canonical governance repository
  - Format: `<owner>/<repo>`
- **Canonical Reference**: `governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`
- **Severity if Missing**: BLOCKER - Canonical source undefined

---

## SECTION 4: Build Philosophy Binding (Maturion Doctrine)

### 4.1 Build-to-Green Commitment (`build_philosophy.build_to_green`)
- **Requirement**: MANDATORY
- **Field**: `build_philosophy.build_to_green`
- **Type**: boolean
- **Allowed Value**: `true`
- **Example**: `build_philosophy.build_to_green: true`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is `true`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.4.1
- **Severity if Missing**: BLOCKER - Core build obligation missing

### 4.2 Refuses Non-Build-to-Green Instructions (`build_philosophy.refuses_non_build_to_green_instructions`)
- **Requirement**: MANDATORY
- **Field**: `build_philosophy.refuses_non_build_to_green_instructions`
- **Type**: boolean
- **Allowed Value**: `true`
- **Example**: `build_philosophy.refuses_non_build_to_green_instructions: true`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is `true`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.4.1
- **Severity if Missing**: CRITICAL - Builder may accept non-compliant instructions

### 4.3 Zero Test Debt Commitment (`build_philosophy.zero_test_debt`)
- **Requirement**: MANDATORY
- **Field**: `build_philosophy.zero_test_debt`
- **Type**: string
- **Allowed Value**: `ABSOLUTE_MANDATE`
- **Example**: `build_philosophy.zero_test_debt: "ABSOLUTE_MANDATE"`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is `ABSOLUTE_MANDATE`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.4.2
- **Severity if Missing**: CRITICAL - Quality mandate missing

### 4.4 Test Debt Triggers Stop (`build_philosophy.test_debt_triggers_stop`)
- **Requirement**: MANDATORY
- **Field**: `build_philosophy.test_debt_triggers_stop`
- **Type**: boolean
- **Allowed Value**: `true`
- **Example**: `build_philosophy.test_debt_triggers_stop: true`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is `true`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.4.2
- **Severity if Missing**: CRITICAL - Stop-and-fix behavior undefined

### 4.5 100% GREEN Philosophy (`build_philosophy.hundred_percent_green`)
- **Requirement**: MANDATORY
- **Field**: `build_philosophy.hundred_percent_green`
- **Type**: string
- **Allowed Value**: `ABSOLUTE`
- **Example**: `build_philosophy.hundred_percent_green: "ABSOLUTE"`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is `ABSOLUTE`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.4.3
- **Severity if Missing**: CRITICAL - Quality threshold missing

### 4.6 Acceptable Test Failure Threshold (`build_philosophy.acceptable_test_failure_threshold`)
- **Requirement**: MANDATORY
- **Field**: `build_philosophy.acceptable_test_failure_threshold`
- **Type**: integer
- **Allowed Value**: `0`
- **Example**: `build_philosophy.acceptable_test_failure_threshold: 0`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is exactly `0`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.4.3
- **Severity if Missing**: CRITICAL - Failure tolerance undefined

---

## SECTION 5: OPOJD (One-Prompt One-Job Doctrine) Binding

### 5.1 Continuous Execution Commitment (`opojd.continuous_execution`)
- **Requirement**: MANDATORY
- **Field**: `opojd.continuous_execution`
- **Type**: boolean
- **Allowed Value**: `true`
- **Example**: `opojd.continuous_execution: true`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is `true`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.5.1
- **Severity if Missing**: HIGH - Execution model undefined

### 5.2 Mid-Execution Approval Requests Prohibited (`opojd.mid_execution_approval_requests_prohibited`)
- **Requirement**: MANDATORY
- **Field**: `opojd.mid_execution_approval_requests_prohibited`
- **Type**: boolean
- **Allowed Value**: `true`
- **Example**: `opojd.mid_execution_approval_requests_prohibited: true`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is `true`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.5.1
- **Severity if Missing**: HIGH - Mid-execution pauses allowed (violation)

### 5.3 Legitimate Pause Points (`opojd.legitimate_pause_points`)
- **Requirement**: MANDATORY
- **Field**: `opojd.legitimate_pause_points`
- **Type**: array of strings
- **Allowed Values**: `["cs2_intervention", "governance_violation", "unrecoverable_failure", "ambiguity"]`
- **Example**:
  ```yaml
  opojd:
    legitimate_pause_points:
      - "cs2_intervention"
      - "governance_violation"
      - "unrecoverable_failure"
      - "ambiguity"
  ```
- **Validation**: 
  - Field exists in YAML frontmatter
  - Array contains only legitimate pause triggers
  - Does NOT include "await_approval" or similar
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.5.2
- **Severity if Missing**: HIGH - Pause conditions unclear

---

## SECTION 6: Scope Declaration

### 6.1 Allowed Paths (`scope.allowed_paths`)
- **Requirement**: MANDATORY
- **Field**: `scope.allowed_paths`
- **Type**: array of strings (glob patterns)
- **Example**:
  ```yaml
  scope:
    allowed_paths:
      - "apps/**/*.ts"
      - "apps/**/*.tsx"
      - "packages/**/*.ts"
      - "tests/**/*.test.ts"
  ```
- **Validation**: 
  - Field exists in YAML frontmatter
  - Array is not empty (at least one path defined)
  - Paths use glob patterns or explicit paths
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.3.1
- **Severity if Missing**: BLOCKER - Scope undefined

### 6.2 Restricted Paths (`scope.restricted_paths`)
- **Requirement**: MANDATORY
- **Field**: `scope.restricted_paths`
- **Type**: array of strings (glob patterns)
- **Minimum Required Entries**: 
  - `governance/**`
  - `.github/agents/**`
  - `.github/workflows/**`
- **Example**:
  ```yaml
  scope:
    restricted_paths:
      - "governance/**"
      - ".github/agents/**"
      - ".github/workflows/**"
      - "architecture/**"
  ```
- **Validation**: 
  - Field exists in YAML frontmatter
  - Array is not empty
  - Includes at minimum: governance, agents, workflows
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.3.2
- **Severity if Missing**: CRITICAL - Protected paths unguarded

### 6.3 Escalation-Required Paths (`scope.escalation_required`)
- **Requirement**: MANDATORY
- **Field**: `scope.escalation_required`
- **Type**: array of strings (glob patterns)
- **Example**:
  ```yaml
  scope:
    escalation_required:
      - "architecture/**"
      - "modules/**/00-app-description/**"
  ```
- **Validation**: 
  - Field exists in YAML frontmatter
  - Array may be empty if no escalation-required paths (but field must exist)
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.3.3
- **Severity if Missing**: HIGH - Escalation triggers unclear

---

## SECTION 7: Evidence and Gate Compliance

### 7.1 Evidence Artifact Requirements (`evidence.required_artifacts`)
- **Requirement**: MANDATORY
- **Field**: `evidence.required_artifacts`
- **Type**: array of strings
- **Minimum Required Entries**: `["test_results", "build_logs", "handover_proof"]`
- **Example**:
  ```yaml
  evidence:
    required_artifacts:
      - "test_results"
      - "build_logs"
      - "handover_proof"
  ```
- **Validation**: 
  - Field exists in YAML frontmatter
  - Array includes minimum required artifacts
- **Canonical Reference**: `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`
- **Severity if Missing**: HIGH - Evidence requirements undefined

### 7.2 Gate Compliance (`gate_compliance.merge_gate_interface`)
- **Requirement**: MANDATORY
- **Field**: `gate_compliance.merge_gate_interface`
- **Type**: boolean
- **Allowed Value**: `true`
- **Example**: `gate_compliance.merge_gate_interface: true`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is `true`
- **Canonical Reference**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md`
- **Severity if Missing**: CRITICAL - Gate compliance undefined

---

## SECTION 8: Escalation Protocol

### 8.1 Escalation Path (`escalation.path`)
- **Requirement**: MANDATORY
- **Field**: `escalation.path`
- **Type**: string
- **Allowed Value**: `foreman` (builders escalate to FM)
- **Example**: `escalation.path: "foreman"`
- **Validation**: 
  - Field exists in YAML frontmatter
  - Value is `foreman`
- **Canonical Reference**: `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`
- **Severity if Missing**: HIGH - Escalation path undefined

### 8.2 Escalation Triggers (`escalation.triggers`)
- **Requirement**: MANDATORY
- **Field**: `escalation.triggers`
- **Type**: array of strings
- **Minimum Required Entries**: `["governance_violation", "ambiguity", "scope_boundary", "architectural_change"]`
- **Example**:
  ```yaml
  escalation:
    triggers:
      - "governance_violation"
      - "ambiguity"
      - "scope_boundary"
      - "architectural_change"
  ```
- **Validation**: 
  - Field exists in YAML frontmatter
  - Array includes minimum required triggers
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section A.6
- **Severity if Missing**: HIGH - Escalation triggers incomplete

---

## SECTION 9: Specialty-Specific Requirements

### 9.1 UI Builder: Accessibility Commitment
- **Requirement**: CONDITIONAL (UI builders only)
- **Field**: `specialty.accessibility_mandatory`
- **Type**: boolean
- **Allowed Value**: `true`
- **Validation**: 
  - Field exists if `builder_type: ui`
  - Value is `true`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section B.1
- **Severity if Missing**: HIGH (for UI builders)

### 9.2 API Builder: Security-First Commitment
- **Requirement**: CONDITIONAL (API builders only)
- **Field**: `specialty.security_first`
- **Type**: boolean
- **Allowed Value**: `true`
- **Validation**: 
  - Field exists if `builder_type: api`
  - Value is `true`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section B.2
- **Severity if Missing**: CRITICAL (for API builders)

### 9.3 Schema Builder: Migration Safety Commitment
- **Requirement**: CONDITIONAL (Schema builders only)
- **Field**: `specialty.migration_safety`
- **Type**: boolean
- **Allowed Value**: `true`
- **Validation**: 
  - Field exists if `builder_type: schema`
  - Value is `true`
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section B.3
- **Severity if Missing**: CRITICAL (for schema builders)

### 9.4 Integration Builder: Circuit Breaker Awareness
- **Requirement**: CONDITIONAL (Integration builders only)
- **Field**: `specialty.circuit_breaker_awareness`
- **Type**: boolean
- **Allowed Value**: `true`
- **Validation**: 
  - Field exists if `builder_type: integration`
  - Value is `true`
- **Canonical Reference**: `governance/canon/CASCADING_FAILURE_CIRCUIT_BREAKER.md`
- **Severity if Missing**: HIGH (for integration builders)

### 9.5 QA Builder: Test Registry Alignment
- **Requirement**: CONDITIONAL (QA builders only)
- **Field**: `specialty.test_registry_alignment`
- **Type**: boolean
- **Allowed Value**: `true`
- **Validation**: 
  - Field exists if `builder_type: qa`
  - Value is `true`
- **Canonical Reference**: `governance/canon/QA_CATALOG_ALIGNMENT_GATE_CANON.md`
- **Severity if Missing**: HIGH (for QA builders)

---

## SECTION 10: Markdown Body Content Requirements

### 10.1 Mission Statement Section
- **Requirement**: MANDATORY
- **Section Header**: `## Mission` (or similar)
- **Content**: Clear statement of builder's purpose and responsibilities
- **Validation**: Section exists in markdown body
- **Severity if Missing**: MEDIUM - Purpose unclear to human readers

### 10.2 Build Philosophy Section
- **Requirement**: MANDATORY
- **Section Header**: `## Build Philosophy` (or similar)
- **Content**: 
  - Build-to-Green commitment
  - Zero Test Debt commitment
  - 100% GREEN philosophy
  - OPOJD continuous execution
- **Validation**: Section exists with explicit commitments
- **Severity if Missing**: HIGH - Philosophy not documented

### 10.3 Scope and Boundaries Section
- **Requirement**: MANDATORY
- **Section Header**: `## Scope and Boundaries` (or similar)
- **Content**: 
  - Allowed file paths
  - Restricted file paths
  - Escalation-required paths
  - Negative definitions (what builder is NOT)
- **Validation**: Section exists with clear boundaries
- **Severity if Missing**: HIGH - Boundaries unclear

### 10.4 Evidence Requirements Section
- **Requirement**: MANDATORY
- **Section Header**: `## Evidence Requirements` (or similar)
- **Content**: 
  - Required evidence artifacts
  - Evidence format specifications
  - Handover requirements
- **Validation**: Section exists with evidence requirements
- **Severity if Missing**: MEDIUM - Evidence requirements unclear

### 10.5 Escalation Protocol Section
- **Requirement**: MANDATORY
- **Section Header**: `## Escalation Protocol` (or similar)
- **Content**: 
  - When to escalate
  - How to escalate
  - Escalation path (to FM)
  - Legitimate pause points
- **Validation**: Section exists with escalation protocol
- **Severity if Missing**: HIGH - Escalation process unclear

---

## SECTION 11: Canon Inventory Alignment Verification

### 11.1 CANON_INVENTORY.json Exists
- **Requirement**: MANDATORY (environment check)
- **Location**: `governance/CANON_INVENTORY.json`
- **Validation**: File exists at expected path
- **Severity if Missing**: BLOCKER - Cannot verify governance alignment

### 11.2 CANON_INVENTORY.json Valid JSON
- **Requirement**: MANDATORY (environment check)
- **Validation**: File is valid JSON with expected schema
- **Expected Fields**: `version`, `generated_date`, `artifacts`, `integrity`
- **Severity if Missing**: BLOCKER - Cannot parse governance inventory

### 11.3 Builder References Current Canon Version
- **Requirement**: MANDATORY (alignment check)
- **Validation**: 
  - `governance.canon_version` in builder file matches `version` in CANON_INVENTORY.json
  - No version drift detected
- **Severity if Missing**: HIGH - Canon version drift undetected

### 11.4 Referenced Canon Files Exist and Match Checksums
- **Requirement**: MANDATORY (integrity check)
- **Validation**: 
  - All canon files referenced in CANON_INVENTORY.json exist
  - SHA256 checksums match expected values
  - No placeholder hashes (e.g., "sha256:placeholder")
- **Severity if Missing**: CRITICAL - Canon integrity compromised

---

## Validation Checklist Summary

### Critical Blockers (Must Pass)
- [ ] File exists at `.github/agents/<builder-id>.md`
- [ ] File contains valid YAML frontmatter + markdown body
- [ ] `name` field present (GitHub Copilot selectability)
- [ ] `role: builder` present (GitHub Copilot selectability)
- [ ] `builder_id` matches filename
- [ ] `builder_type` specified and valid
- [ ] `governance.canon_inventory` references `governance/CANON_INVENTORY.json`
- [ ] `governance.canon_version` matches CANON_INVENTORY.json version
- [ ] `governance.binding: MANDATORY` present
- [ ] `governance.canonical_source` references canonical governance repository
- [ ] `build_philosophy.build_to_green: true` present
- [ ] `build_philosophy.zero_test_debt: ABSOLUTE_MANDATE` present
- [ ] `scope.allowed_paths` defined (not empty)
- [ ] `scope.restricted_paths` includes governance, agents, workflows
- [ ] CANON_INVENTORY.json exists and is valid JSON
- [ ] Canon version alignment verified (no drift)

### High Priority (Should Pass)
- [ ] `description` field present and concise
- [ ] `version` field present (semantic version)
- [ ] `created` and `updated` dates present (ISO 8601)
- [ ] `build_philosophy.refuses_non_build_to_green_instructions: true`
- [ ] `build_philosophy.test_debt_triggers_stop: true`
- [ ] `build_philosophy.hundred_percent_green: ABSOLUTE`
- [ ] `build_philosophy.acceptable_test_failure_threshold: 0`
- [ ] `opojd.continuous_execution: true`
- [ ] `opojd.mid_execution_approval_requests_prohibited: true`
- [ ] `opojd.legitimate_pause_points` defined
- [ ] `scope.escalation_required` field exists (may be empty array)
- [ ] `evidence.required_artifacts` includes minimum required
- [ ] `gate_compliance.merge_gate_interface: true`
- [ ] `escalation.path: foreman`
- [ ] `escalation.triggers` includes minimum required
- [ ] Markdown body includes Mission statement
- [ ] Markdown body includes Build Philosophy section
- [ ] Markdown body includes Scope and Boundaries section
- [ ] Markdown body includes Escalation Protocol section

### Specialty-Specific (Conditional)
- [ ] UI builders: `specialty.accessibility_mandatory: true`
- [ ] API builders: `specialty.security_first: true`
- [ ] Schema builders: `specialty.migration_safety: true`
- [ ] Integration builders: `specialty.circuit_breaker_awareness: true`
- [ ] QA builders: `specialty.test_registry_alignment: true`

---

## Authority and Maintenance

**Authority**: This checklist is maintained by the Governance Liaison for maturion-isms repository and derived from canonical governance artifacts in `APGI-cmy/maturion-foreman-governance`.

**Canonical References**:
- `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` v1.2.0
- `.github/agents/BUILDER_CONTRACT_SCHEMA.md` v2.0
- `governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md`
- `governance/CANON_INVENTORY.json` v1.0.0

**Version History**:
- v1.1.0 (2026-02-14): Initial artifact creation; replaced all Tier-0 references with Canon Inventory alignment logic
- v1.0.0 (conceptual): Based on BUILDER_CONTRACT_BINDING_CHECKLIST.md v1.2.0

**Ripple Notes**: This artifact consolidates builder agent file creation requirements and eliminates legacy "Tier-0" terminology in favor of explicit Canon Inventory alignment per `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`.

---

**END OF CHECKLIST**
