# BUILDER AGENT FILE COMPLIANCE CHECKLIST - DETAILED SECTIONS

*This file contains the comprehensive detailed checklist sections to replace lines 98-110 in BUILDER_AGENT_FILE_COMPLIANCE_CHECKLIST.md*

---

## SECTION 1: YAML Frontmatter Requirements

This section validates the YAML frontmatter block that MUST appear at the top of every builder agent file.

### 1.1 Agent Identity and Metadata

#### REQ-BF-001: Agent ID Declaration

- **Description**: Agent must have unique identifier
- **Required Field**: `agent.id` in YAML frontmatter
- **Validation Rule**: Field exists, non-empty, follows pattern `<name>-builder` (e.g., `api-builder`, `ui-builder`)
- **Acceptance Criteria**: 
  - Field present: ✅
  - Matches pattern: ✅
  - Unique within repository: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/AGENT_RECRUITMENT.md` section 4

#### REQ-BF-002: Agent Class Declaration

- **Description**: Agent class must be explicitly declared as "builder"
- **Required Field**: `agent.class` in YAML frontmatter
- **Validation Rule**: Field exists and value equals "builder" (exact match, case-sensitive)
- **Acceptance Criteria**: 
  - Field present: ✅
  - Value = "builder": ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/AGENT_RECRUITMENT.md` section 4, `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` A.1.1

#### REQ-BF-003: Agent Version

- **Description**: Living Agent System version declaration
- **Required Field**: `agent.version` in YAML frontmatter
- **Validation Rule**: Field exists, value is "6.2.0" or later semantic version
- **Acceptance Criteria**: 
  - Field present: ✅
  - Semantic version format: ✅
  - Version >= 6.2.0: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `LIVING_AGENT_SYSTEM.md` v6.2.0

#### REQ-BF-004: Contract Version

- **Description**: Builder contract version for tracking contract evolution
- **Required Field**: `agent.contract_version` in YAML frontmatter
- **Validation Rule**: Field exists, semantic version format (e.g., "1.0.0", "2.0.0")
- **Acceptance Criteria**: 
  - Field present: ✅
  - Semantic version format: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/VERSIONING_AND_EVOLUTION_GOVERNANCE.md`

#### REQ-BF-005: Description

- **Description**: Human-readable agent description
- **Required Field**: `description` in YAML frontmatter (root level)
- **Validation Rule**: Field exists, non-empty string, describes builder specialty and scope
- **Acceptance Criteria**: 
  - Field present: ✅
  - Non-empty: ✅
  - Describes role clearly: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: Agent file standard practices

### 1.2 Governance Protocol Binding

#### REQ-BF-006: Governance Protocol Declaration

- **Description**: Must declare Living Agent System as governance protocol
- **Required Field**: `governance.protocol` in YAML frontmatter
- **Validation Rule**: Field exists and value equals "LIVING_AGENT_SYSTEM"
- **Acceptance Criteria**: 
  - Field present: ✅
  - Value = "LIVING_AGENT_SYSTEM": ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `LIVING_AGENT_SYSTEM.md` v6.2.0

#### REQ-BF-007: Governance Version

- **Description**: Living Agent System version binding
- **Required Field**: `governance.version` in YAML frontmatter
- **Validation Rule**: Field exists and value is "6.2.0" or later
- **Acceptance Criteria**: 
  - Field present: ✅
  - Version >= 6.2.0: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `LIVING_AGENT_SYSTEM.md` v6.2.0

#### REQ-BF-008: Canon Inventory Path

- **Description**: Path to Canon Inventory for governance alignment
- **Required Field**: `governance.canon_inventory` in YAML frontmatter
- **Validation Rule**: Field exists and value is "governance/CANON_INVENTORY.json"
- **Acceptance Criteria**: 
  - Field present: ✅
  - Path correct: ✅
  - File exists at path: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`

#### REQ-BF-009: Expected Artifacts List

- **Description**: List of governance artifacts builder depends on
- **Required Field**: `governance.expected_artifacts` in YAML frontmatter
- **Validation Rule**: 
  - Field exists as array
  - Contains minimum: `governance/CANON_INVENTORY.json`, `BUILD_PHILOSOPHY.md`
  - All listed files exist
- **Acceptance Criteria**: 
  - Field present: ✅
  - Minimum artifacts listed: ✅
  - All artifacts exist: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md`

#### REQ-BF-010: Degraded Mode Configuration

- **Description**: Behavior when Canon Inventory has placeholder hashes
- **Required Field**: `governance.degraded_on_placeholder_hashes` in YAML frontmatter
- **Validation Rule**: Field exists and value is `true`
- **Acceptance Criteria**: 
  - Field present: ✅
  - Value = true: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`

### 1.3 Merge Gate Interface

#### REQ-BF-011: Required Merge Gate Checks

- **Description**: List of merge gate checks builder must respect
- **Required Field**: `merge_gate_interface.required_checks` in YAML frontmatter
- **Validation Rule**: 
  - Field exists as array
  - Contains all three required checks:
    - "Merge Gate Interface / merge-gate/verdict"
    - "Merge Gate Interface / governance/alignment"
    - "Merge Gate Interface / stop-and-fix/enforcement"
- **Acceptance Criteria**: 
  - Field present: ✅
  - All 3 checks listed: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md`, `LIVING_AGENT_SYSTEM.md` v6.2.0

### 1.4 Scope Declaration

#### REQ-BF-012: Repository Scope

- **Description**: Target repository for builder operations
- **Required Field**: `scope.repository` in YAML frontmatter
- **Validation Rule**: Field exists, format is "owner/repo" (e.g., "APGI-cmy/maturion-isms")
- **Acceptance Criteria**: 
  - Field present: ✅
  - Format correct: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: Agent scope requirements

#### REQ-BF-013: Read Access Paths

- **Description**: Paths builder may read from
- **Required Field**: `scope.read_access` in YAML frontmatter
- **Validation Rule**: 
  - Field exists as array
  - Contains minimum paths: "foreman/**", "architecture/**", "governance/**"
  - Contains role-specific read paths
- **Acceptance Criteria**: 
  - Field present: ✅
  - Minimum paths present: ✅
  - Role-specific paths present: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/AGENT_RECRUITMENT.md` section 7

#### REQ-BF-014: Write Access Paths

- **Description**: Paths builder may write to
- **Required Field**: `scope.write_access` in YAML frontmatter
- **Validation Rule**: 
  - Field exists as array
  - Contains role-specific implementation paths
  - Contains `.agent-workspace/<builder-id>/**`
  - Does NOT contain governance or architecture paths
- **Acceptance Criteria**: 
  - Field present: ✅
  - Role-specific paths present: ✅
  - Workspace path present: ✅
  - Protected paths excluded: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/AGENT_RECRUITMENT.md` section 7, `governance/profiles/builder.v1.md` section 6

#### REQ-BF-015: Escalation-Required Paths

- **Description**: Paths that require escalation if builder needs to modify
- **Required Field**: `scope.escalation_required` in YAML frontmatter
- **Validation Rule**: 
  - Field exists as array
  - Contains minimum: ".github/agents/**", ".github/workflows/**", "BUILD_PHILOSOPHY.md", "governance/canon/**"
- **Acceptance Criteria**: 
  - Field present: ✅
  - Minimum protected paths listed: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/profiles/builder.v1.md` section 7

### 1.5 Execution Identity and Safety

#### REQ-BF-016: Execution Identity Name

- **Description**: Bot identity for GitHub operations
- **Required Field**: `execution_identity.name` in YAML frontmatter
- **Validation Rule**: Field exists and value is "Maturion Bot"
- **Acceptance Criteria**: 
  - Field present: ✅
  - Value = "Maturion Bot": ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/MATURION_BOT_EXECUTION_IDENTITY_MODEL.md`

#### REQ-BF-017: Execution Identity Secret

- **Description**: GitHub secret reference for authentication
- **Required Field**: `execution_identity.secret` in YAML frontmatter
- **Validation Rule**: Field exists and value is "MATURION_BOT_TOKEN"
- **Acceptance Criteria**: 
  - Field present: ✅
  - Value = "MATURION_BOT_TOKEN": ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/MATURION_BOT_EXECUTION_IDENTITY_MODEL.md`

#### REQ-BF-018: Never Push Main

- **Description**: Safety constraint to prevent direct main branch pushes
- **Required Field**: `execution_identity.never_push_main` in YAML frontmatter
- **Validation Rule**: Field exists and value is `true`
- **Acceptance Criteria**: 
  - Field present: ✅
  - Value = true: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/BRANCH_PROTECTION_ENFORCEMENT.md`

#### REQ-BF-019: Write Via PR

- **Description**: Constraint to write only via pull requests
- **Required Field**: `execution_identity.write_via_pr` in YAML frontmatter
- **Validation Rule**: Field exists and value is `true`
- **Acceptance Criteria**: 
  - Field present: ✅
  - Value = true: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/PR_GATE_PRECONDITION_RULE.md`

### 1.6 Prohibitions Declaration

#### REQ-BF-020: Prohibitions List

- **Description**: Explicit list of prohibited actions
- **Required Field**: `prohibitions` in YAML frontmatter
- **Validation Rule**: 
  - Field exists as array
  - Contains minimum prohibitions:
    - No modification of agent contract without CS2 approval
    - No skipping wake-up or session closure protocols
    - No direct pushes to main
    - Role-specific prohibitions (e.g., "No frontend UI changes" for API builder)
- **Acceptance Criteria**: 
  - Field present: ✅
  - Minimum prohibitions listed: ✅
  - Role-specific prohibitions listed: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/AGENT_RECRUITMENT.md`, builder role specifications

### 1.7 Metadata

#### REQ-BF-021: Canonical Home

- **Description**: Source repository for governance canon
- **Required Field**: `metadata.canonical_home` in YAML frontmatter
- **Validation Rule**: Field exists and value is "APGI-cmy/maturion-foreman-governance"
- **Acceptance Criteria**: 
  - Field present: ✅
  - Value correct: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: Consumer repository governance model

#### REQ-BF-022: Recruitment Status

- **Description**: Builder recruitment status tracking
- **Required Field**: `metadata.status` in YAML frontmatter
- **Validation Rule**: Field exists and value is one of: "recruited", "active", "suspended", "retired"
- **Acceptance Criteria**: 
  - Field present: ✅
  - Valid status value: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/AGENT_RECRUITMENT.md`

---

## SECTION 2: Canon Inventory Alignment

This section validates builder binding to canonical governance via Canon Inventory.

### 2.1 Canon Inventory Loading

#### REQ-CA-001: Canon Inventory File Existence

- **Description**: Canon Inventory file must exist at declared path
- **Required Path**: `governance/CANON_INVENTORY.json`
- **Validation Rule**: File exists at path, is valid JSON, is readable
- **Acceptance Criteria**: 
  - File exists: ✅
  - Valid JSON: ✅
  - Readable: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`

#### REQ-CA-002: Canon Inventory Version

- **Description**: Canon Inventory must have version field
- **Required Field**: `version` in Canon Inventory JSON
- **Validation Rule**: Field exists, semantic version format
- **Acceptance Criteria**: 
  - Field present: ✅
  - Semantic version format: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`

#### REQ-CA-003: Canon Inventory Artifact Count

- **Description**: Canon Inventory must declare total artifact count
- **Required Field**: `total_artifacts` in Canon Inventory JSON
- **Validation Rule**: Field exists, is positive integer, matches actual artifact count
- **Acceptance Criteria**: 
  - Field present: ✅
  - Positive integer: ✅
  - Matches artifact count: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`

### 2.2 SHA256 Hash Validation

#### REQ-CA-004: No Placeholder Hashes

- **Description**: All PUBLIC_API artifacts must have complete SHA256 hashes
- **Required Condition**: No PUBLIC_API artifacts with placeholder hashes (e.g., "PLACEHOLDER_HASH_PENDING", "TBD")
- **Validation Rule**: For each artifact in `artifacts` with `classification: "PUBLIC_API"`, `sha256` field must be 64-character hex string
- **Acceptance Criteria**: 
  - All PUBLIC_API artifacts have sha256: ✅
  - All sha256 values are 64-char hex: ✅
  - No placeholder values: ✅
- **Severity if Missing**: BLOCKER (triggers degraded mode)
- **Canonical Reference**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`, `LIVING_AGENT_SYSTEM.md` v6.2.0 degraded mode

#### REQ-CA-005: Hash Verification

- **Description**: Sample verification that file hashes match Canon Inventory
- **Required Condition**: Spot-check that actual file SHA256 matches declared hash
- **Validation Rule**: 
  - Select 3 random PUBLIC_API artifacts
  - Calculate actual SHA256 of each file
  - Compare against declared hash in Canon Inventory
  - All 3 must match
- **Acceptance Criteria**: 
  - Can access files: ✅
  - Calculated hashes match: ✅
- **Severity if Missing**: HIGH (indicates drift or corruption)
- **Canonical Reference**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`

### 2.3 Required Canon Bindings

#### REQ-CA-006: BUILD_PHILOSOPHY.md Binding

- **Description**: Builder must reference BUILD_PHILOSOPHY.md in expected artifacts or bindings
- **Required Field**: BUILD_PHILOSOPHY.md listed in `governance.expected_artifacts` OR `bindings.build_philosophy`
- **Validation Rule**: Path appears in expected artifacts list AND file exists
- **Acceptance Criteria**: 
  - Path listed: ✅
  - File exists: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` A.4, `governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md` section 2.1

#### REQ-CA-007: BUILDER_CONTRACT_BINDING_CHECKLIST.md Awareness

- **Description**: Builder agent file should reference canonical binding checklist
- **Required Field**: Reference to `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` in governance bindings or documentation
- **Validation Rule**: Document is referenced in agent file OR in builder onboarding section
- **Acceptance Criteria**: 
  - Referenced in file: ✅
  - File exists in governance: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md`

#### REQ-CA-008: FM_BUILDER_APPOINTMENT_PROTOCOL.md Awareness

- **Description**: Builder should be aware of appointment protocol requirements
- **Required Field**: Reference to `governance/canon/FM_BUILDER_APPOINTMENT_PROTOCOL.md` in governance bindings
- **Validation Rule**: Document referenced OR builder onboarding section describes appointment requirements
- **Acceptance Criteria**: 
  - Referenced: ✅
  - File exists: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/FM_BUILDER_APPOINTMENT_PROTOCOL.md`

---

## SECTION 3: Build Philosophy Binding

This section validates builder commitment to Maturion Build Philosophy mandates.

### 3.1 Build-to-Green Mandate

#### REQ-BP-001: Build-to-Green Declaration

- **Description**: Builder must explicitly commit to Build-to-Green mandate
- **Required Element**: Section in agent file body stating Build-to-Green commitment
- **Validation Rule**: 
  - Agent file contains section titled "Build-to-Green" or "Build Philosophy" or "Maturion Builder Mindset"
  - Section explicitly states "Build-to-Green" mandate
  - Section states builder ONLY accepts Build-to-Green instructions
- **Acceptance Criteria**: 
  - Section exists: ✅
  - Build-to-Green explicitly stated: ✅
  - Refusal of non-Build-to-Green stated: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `BUILD_PHILOSOPHY.md`, `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` A.4.1

#### REQ-BP-002: QA-to-Red Precondition

- **Description**: Builder must state QA-to-Red is precondition for building
- **Required Element**: Statement that failing test suite (RED) must exist before building
- **Validation Rule**: 
  - Agent file states QA-to-Red is precondition
  - States builder REQUIRES failing tests before implementation
- **Acceptance Criteria**: 
  - Precondition stated: ✅
  - RED tests required: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `BUILD_PHILOSOPHY.md`, `governance/canon/FM_BUILDER_APPOINTMENT_PROTOCOL.md` section 1.3

#### REQ-BP-003: Sacred Workflow Statement

- **Description**: Builder must state the sacred workflow sequence
- **Required Element**: Statement of workflow: Architecture (frozen) → QA-to-Red (failing) → Build-to-Green → Validation
- **Validation Rule**: Agent file contains workflow statement in correct order
- **Acceptance Criteria**: 
  - Workflow stated: ✅
  - Correct order: ✅
  - All 4 phases present: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `BUILD_PHILOSOPHY.md`, `governance/canon/FM_BUILDER_APPOINTMENT_PROTOCOL.md`

### 3.2 Zero Test Debt Mandate

#### REQ-BP-004: Zero Test Debt Declaration

- **Description**: Builder must commit to absolute zero test debt
- **Required Element**: Section explicitly stating "ZERO TEST DEBT" commitment
- **Validation Rule**: 
  - Agent file contains Zero Test Debt section
  - States zero test debt is ABSOLUTE (no exceptions)
  - Defines test debt (any failing tests, warnings, skipped tests)
- **Acceptance Criteria**: 
  - Section exists: ✅
  - ABSOLUTE commitment stated: ✅
  - Test debt defined: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `BUILD_PHILOSOPHY.md` sections 11-107, `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` A.4.2, `governance/policies/zero-test-debt-constitutional-rule.md`

#### REQ-BP-005: Stop-and-Fix Doctrine

- **Description**: Builder must commit to Stop-and-Fix when test debt detected
- **Required Element**: Statement that test debt triggers STOP → FIX → RE-RUN → VERIFY
- **Validation Rule**: 
  - Agent file states Stop-and-Fix sequence
  - States builder STOPS when any test fails
  - States builder FIXES issue before proceeding
- **Acceptance Criteria**: 
  - Stop-and-Fix stated: ✅
  - Sequence correct: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/STOP_AND_FIX_DOCTRINE.md`, `BUILD_PHILOSOPHY.md`

#### REQ-BP-006: 100% GREEN Requirement

- **Description**: Builder must state 100% GREEN is absolute threshold
- **Required Element**: Statement that 100% GREEN is required (not 99%, not "mostly passing")
- **Validation Rule**: 
  - Agent file states 100% GREEN requirement
  - States partial pass = total failure (e.g., "301/303 = FAILURE")
- **Acceptance Criteria**: 
  - 100% GREEN stated: ✅
  - Partial pass = failure stated: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `BUILD_PHILOSOPHY.md`, `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` A.4.3

### 3.3 Architecture-as-Law Binding

#### REQ-BP-007: Architecture Precondition Requirement

- **Description**: Builder must state architecture must exist before building
- **Required Element**: Statement that architecture is precondition for building
- **Validation Rule**: 
  - Agent file states frozen architecture required before building
  - States builder CANNOT build without architecture
  - States builder escalates if architecture missing/incomplete
- **Acceptance Criteria**: 
  - Precondition stated: ✅
  - Cannot build without architecture: ✅
  - Escalation trigger stated: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `BUILD_PHILOSOPHY.md`, `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` A.6.1

#### REQ-BP-008: Architecture Conformance Requirement

- **Description**: Builder must commit to exact architecture conformance
- **Required Element**: Statement that implementation must match architecture exactly
- **Validation Rule**: 
  - Agent file states exact conformance required
  - Prohibits "helpful improvements" or deviations
  - States architecture mismatch = STOP condition
- **Acceptance Criteria**: 
  - Exact conformance stated: ✅
  - Deviations prohibited: ✅
  - Mismatch = STOP stated: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` A.6.2, `governance/canon/ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md`

### 3.4 OPOJD (One-Prompt One-Job Doctrine) Binding

#### REQ-BP-009: Continuous Execution Commitment

- **Description**: Builder must commit to OPOJD continuous execution
- **Required Element**: Statement of continuous execution commitment
- **Validation Rule**: 
  - Agent file states OPOJD continuous execution commitment
  - States execution continues until completion or constitutional block
  - Prohibits mid-execution approval requests
- **Acceptance Criteria**: 
  - OPOJD commitment stated: ✅
  - Continuous execution stated: ✅
  - Mid-execution pauses prohibited: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/opojd/OPOJD_COMPLETE_JOB_HANDOVER_DOCTRINE.md`, `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` A.5.1

#### REQ-BP-010: Complete Job Handover

- **Description**: Builder must commit to complete handover (not partial delivery)
- **Required Element**: Statement that builder completes entire job before handover
- **Validation Rule**: 
  - Agent file states complete job handover requirement
  - States builder delivers 100% GREEN before PR creation
- **Acceptance Criteria**: 
  - Complete handover stated: ✅
  - 100% GREEN before handover: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/opojd/OPOJD_COMPLETE_JOB_HANDOVER_DOCTRINE.md`

---

## SECTION 4: Evidence and Artifact Requirements

This section validates builder commitment to evidence production and audit trail.

### 4.1 Evidence Bundle Requirements

#### REQ-EA-001: Evidence Bundle Awareness

- **Description**: Builder must be aware of evidence bundle requirements
- **Required Element**: Reference to evidence bundle standard in agent file
- **Validation Rule**: 
  - Agent file references `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` OR
  - Describes evidence bundle requirements
- **Acceptance Criteria**: 
  - Referenced or described: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`

#### REQ-EA-002: Session Memory Protocol

- **Description**: Builder must describe session memory protocol
- **Required Element**: Section describing session memory creation and structure
- **Validation Rule**: 
  - Agent file contains "Session Memory Protocol" section OR
  - References session memory protocol in governance
  - Describes session memory file creation at `.agent-workspace/<builder-id>/memory/session-NNN-YYYYMMDD.md`
- **Acceptance Criteria**: 
  - Protocol described or referenced: ✅
  - File path correct: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `LIVING_AGENT_SYSTEM.md` v6.2.0 session memory protocol

#### REQ-EA-003: PREHANDOVER Proof Requirement

- **Description**: Builder must commit to PREHANDOVER proof generation
- **Required Element**: Statement that builder creates PREHANDOVER proof before PR
- **Validation Rule**: 
  - Agent file states PREHANDOVER proof requirement
  - States builder runs all tests before PR creation
  - States exit codes must be captured
- **Acceptance Criteria**: 
  - PREHANDOVER proof stated: ✅
  - Test execution stated: ✅
  - Exit code capture stated: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md`, `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md`

### 4.2 Test Execution Requirements

#### REQ-EA-004: Agent Test Execution Protocol Binding

- **Description**: Builder must bind to agent test execution protocol
- **Required Element**: Reference to `governance/runbooks/AGENT_TEST_EXECUTION_PROTOCOL.md` in bindings
- **Validation Rule**: 
  - Document referenced in governance bindings OR
  - Test execution before handover described
- **Acceptance Criteria**: 
  - Referenced or described: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/runbooks/AGENT_TEST_EXECUTION_PROTOCOL.md`, `governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md` section 3.1

#### REQ-EA-005: CI-Confirmatory-Not-Diagnostic Principle

- **Description**: Builder must understand CI confirms, does not diagnose
- **Required Element**: Statement that CI is confirmatory (tests must pass in agent environment first)
- **Validation Rule**: 
  - Agent file states CI-Confirmatory-Not-Diagnostic principle OR
  - States builder runs tests before PR creation
- **Acceptance Criteria**: 
  - Principle stated or implied: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/CI_CONFIRMATORY_NOT_DIAGNOSTIC.md`

### 4.3 Audit Trail Requirements

#### REQ-EA-006: Decision Documentation

- **Description**: Builder must document significant decisions
- **Required Element**: Statement that builder documents decisions in session memory
- **Validation Rule**: 
  - Agent file describes decision documentation requirement OR
  - Session memory protocol includes "Decisions Made" section
- **Acceptance Criteria**: 
  - Documented: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md`

#### REQ-EA-007: Lessons Learned Capture

- **Description**: Builder must capture lessons learned
- **Required Element**: Statement that builder updates personal lessons learned file
- **Validation Rule**: 
  - Agent file describes lessons learned capture OR
  - References `.agent-workspace/<builder-id>/personal/lessons-learned.md`
- **Acceptance Criteria**: 
  - Described or referenced: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/LEARNING_PROMOTION_RULE.md`, `LIVING_AGENT_SYSTEM.md` v6.2.0

---

## SECTION 5: Merge Gate Compliance

This section validates builder understanding of and compliance with merge gates.

### 5.1 Merge Gate Awareness

#### REQ-MG-001: Merge Gate Philosophy Understanding

- **Description**: Builder must understand merge gate philosophy
- **Required Element**: Reference to `governance/canon/MERGE_GATE_PHILOSOPHY.md` OR description of merge gate role
- **Validation Rule**: 
  - Agent file references merge gate philosophy document OR
  - Describes that merge gates enforce constitutional compliance
- **Acceptance Criteria**: 
  - Referenced or described: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/MERGE_GATE_PHILOSOPHY.md`

#### REQ-MG-002: Three Required Checks

- **Description**: Builder must be aware of three required merge gate checks
- **Required Element**: List of three required checks in `merge_gate_interface.required_checks`
- **Validation Rule**: 
  - YAML frontmatter contains all three checks:
    1. "Merge Gate Interface / merge-gate/verdict"
    2. "Merge Gate Interface / governance/alignment"
    3. "Merge Gate Interface / stop-and-fix/enforcement"
- **Acceptance Criteria**: 
  - All 3 checks listed: ✅
- **Severity if Missing**: BLOCKER (duplicate of REQ-BF-011, validates presence)
- **Canonical Reference**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md`

### 5.2 Merge Gate Failure Response

#### REQ-MG-003: Failure Response Protocol

- **Description**: Builder must understand how to respond to merge gate failures
- **Required Element**: Description of builder response when merge gate fails
- **Validation Rule**: 
  - Agent file describes merge gate failure response OR
  - States builder investigates failures, fixes issues, re-runs validation
- **Acceptance Criteria**: 
  - Response described: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/MERGE_GATE_PHILOSOPHY.md`, `governance/canon/FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md`

#### REQ-MG-004: Stop-and-Fix on Gate Failure

- **Description**: Builder must commit to Stop-and-Fix on gate failure
- **Required Element**: Statement that builder STOPS when merge gate fails
- **Validation Rule**: 
  - Agent file states gate failure triggers STOP OR
  - References Stop-and-Fix doctrine in gate context
- **Acceptance Criteria**: 
  - Stop-and-Fix on gate failure stated: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/STOP_AND_FIX_DOCTRINE.md`

---

## SECTION 6: Escalation Protocol

This section validates builder understanding of when and how to escalate.

### 6.1 Escalation Triggers

#### REQ-EP-001: Escalation Trigger List

- **Description**: Builder must enumerate escalation triggers
- **Required Element**: List of conditions that trigger escalation
- **Validation Rule**: 
  - Agent file contains "Escalation" section
  - Lists minimum triggers:
    - Architecture missing/incomplete/ambiguous
    - QA-to-Red missing or non-failing
    - Governance violation detected
    - Constitutional conflict
    - Cannot achieve 100% GREEN due to external dependency
- **Acceptance Criteria**: 
  - Section exists: ✅
  - Minimum triggers listed: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/FM_BUILDER_APPOINTMENT_PROTOCOL.md`, `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` section B

#### REQ-EP-002: Escalation Authority

- **Description**: Builder must know to whom to escalate
- **Required Element**: Statement that builder escalates to Foreman (FM) or CS2
- **Validation Rule**: 
  - Agent file states escalation path (builder → FM → CS2) OR
  - States "escalate to Foreman" or "escalate to CS2"
- **Acceptance Criteria**: 
  - Escalation authority stated: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`

### 6.2 Escalation Execution

#### REQ-EP-003: Escalation Evidence Requirements

- **Description**: Builder must know what to include in escalation
- **Required Element**: Description of escalation content (context, canon citation, options)
- **Validation Rule**: 
  - Agent file describes escalation format OR
  - States builder provides context, cites canon, proposes options
- **Acceptance Criteria**: 
  - Content requirements described: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `governance/canon/FM_BUILDER_APPOINTMENT_PROTOCOL.md` escalation requirements

#### REQ-EP-004: Escalation File Location

- **Description**: Builder must know where to create escalation files
- **Required Element**: Reference to `.agent-workspace/<builder-id>/escalation-inbox/` directory
- **Validation Rule**: 
  - Agent file references escalation inbox path OR
  - Describes creating escalation files in workspace
- **Acceptance Criteria**: 
  - Path referenced or described: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: `LIVING_AGENT_SYSTEM.md` v6.2.0 escalation protocol

---

## SECTION 7: Specialty Requirements (Role-Specific)

This section validates role-specific requirements for different builder types.

### 7.1 UI Builder Specific

#### REQ-RS-UI-001: UI Builder Specialty Declaration

- **Description**: UI builder must declare UI specialty in capabilities
- **Required Field**: `capabilities.builder_ops` contains "ui", "frontend", or "components"
- **Validation Rule**: Field exists and contains UI-related values
- **Acceptance Criteria**: 
  - Field present: ✅
  - UI-related values present: ✅
- **Severity if Missing**: HIGH (if agent is UI builder)
- **Canonical Reference**: Builder role specifications

#### REQ-RS-UI-002: UI Builder Write Access

- **Description**: UI builder write access must include UI component paths
- **Required Field**: `scope.write_access` includes UI component paths (e.g., "apps/*/components/**", "apps/*/ui/**")
- **Validation Rule**: Write access includes UI-related paths
- **Acceptance Criteria**: 
  - UI paths in write access: ✅
- **Severity if Missing**: HIGH (if agent is UI builder)
- **Canonical Reference**: UI builder scope requirements

#### REQ-RS-UI-003: UI Builder Prohibitions

- **Description**: UI builder must prohibit API/backend modifications
- **Required Field**: `prohibitions` includes "No API route changes", "No backend logic changes", "No database schema changes"
- **Validation Rule**: Prohibitions include backend-related restrictions
- **Acceptance Criteria**: 
  - Backend prohibitions listed: ✅
- **Severity if Missing**: MEDIUM (if agent is UI builder)
- **Canonical Reference**: UI builder role boundaries

### 7.2 API Builder Specific

#### REQ-RS-API-001: API Builder Specialty Declaration

- **Description**: API builder must declare API specialty in capabilities
- **Required Field**: `capabilities.builder_ops` contains "api", "backend", or "business-logic"
- **Validation Rule**: Field exists and contains API-related values
- **Acceptance Criteria**: 
  - Field present: ✅
  - API-related values present: ✅
- **Severity if Missing**: HIGH (if agent is API builder)
- **Canonical Reference**: Builder role specifications

#### REQ-RS-API-002: API Builder Write Access

- **Description**: API builder write access must include API paths
- **Required Field**: `scope.write_access` includes API paths (e.g., "apps/*/api/**")
- **Validation Rule**: Write access includes API-related paths
- **Acceptance Criteria**: 
  - API paths in write access: ✅
- **Severity if Missing**: HIGH (if agent is API builder)
- **Canonical Reference**: API builder scope requirements

#### REQ-RS-API-003: API Builder Prohibitions

- **Description**: API builder must prohibit frontend UI modifications
- **Required Field**: `prohibitions` includes "No frontend UI changes", "No component modifications"
- **Validation Rule**: Prohibitions include frontend-related restrictions
- **Acceptance Criteria**: 
  - Frontend prohibitions listed: ✅
- **Severity if Missing**: MEDIUM (if agent is API builder)
- **Canonical Reference**: API builder role boundaries

### 7.3 Schema Builder Specific

#### REQ-RS-SCHEMA-001: Schema Builder Specialty Declaration

- **Description**: Schema builder must declare schema specialty in capabilities
- **Required Field**: `capabilities.builder_ops` contains "schema", "database", or "data-model"
- **Validation Rule**: Field exists and contains schema-related values
- **Acceptance Criteria**: 
  - Field present: ✅
  - Schema-related values present: ✅
- **Severity if Missing**: HIGH (if agent is schema builder)
- **Canonical Reference**: Builder role specifications

#### REQ-RS-SCHEMA-002: Schema Builder Write Access

- **Description**: Schema builder write access must include schema paths
- **Required Field**: `scope.write_access` includes schema paths (e.g., "apps/*/schema/**", "apps/*/prisma/**")
- **Validation Rule**: Write access includes schema-related paths
- **Acceptance Criteria**: 
  - Schema paths in write access: ✅
- **Severity if Missing**: HIGH (if agent is schema builder)
- **Canonical Reference**: Schema builder scope requirements

#### REQ-RS-SCHEMA-003: Schema Builder Migration Requirements

- **Description**: Schema builder must understand migration discipline
- **Required Element**: Reference to migration protocol or description of migration requirements
- **Validation Rule**: Agent file references migration protocol OR describes safe migration practices
- **Acceptance Criteria**: 
  - Referenced or described: ✅
- **Severity if Missing**: MEDIUM (if agent is schema builder)
- **Canonical Reference**: Schema builder migration protocol

### 7.4 Integration Builder Specific

#### REQ-RS-INT-001: Integration Builder Specialty Declaration

- **Description**: Integration builder must declare integration specialty in capabilities
- **Required Field**: `capabilities.builder_ops` contains "integration", "cross-module", or "system-integration"
- **Validation Rule**: Field exists and contains integration-related values
- **Acceptance Criteria**: 
  - Field present: ✅
  - Integration-related values present: ✅
- **Severity if Missing**: HIGH (if agent is integration builder)
- **Canonical Reference**: Builder role specifications

#### REQ-RS-INT-002: Integration Builder Cross-Module Awareness

- **Description**: Integration builder must acknowledge cross-module impact
- **Required Element**: Statement that integration changes have cross-module ripple effects
- **Validation Rule**: Agent file describes cross-module awareness OR references ripple model
- **Acceptance Criteria**: 
  - Cross-module awareness stated: ✅
- **Severity if Missing**: MEDIUM (if agent is integration builder)
- **Canonical Reference**: `governance/canon/AGENT_RIPPLE_AWARENESS_OBLIGATION.md`

### 7.5 QA Builder Specific

#### REQ-RS-QA-001: QA Builder Specialty Declaration

- **Description**: QA builder must declare QA specialty in capabilities
- **Required Field**: `capabilities.builder_ops` contains "qa", "testing", or "test-infrastructure"
- **Validation Rule**: Field exists and contains QA-related values
- **Acceptance Criteria**: 
  - Field present: ✅
  - QA-related values present: ✅
- **Severity if Missing**: HIGH (if agent is QA builder)
- **Canonical Reference**: Builder role specifications

#### REQ-RS-QA-002: QA Builder Test Infrastructure as Production

- **Description**: QA builder must understand test infrastructure is production code
- **Required Element**: Statement that test infrastructure is production quality
- **Validation Rule**: Agent file states test infrastructure is production code OR references BUILD_PHILOSOPHY test quality requirements
- **Acceptance Criteria**: 
  - Stated or referenced: ✅
- **Severity if Missing**: HIGH (if agent is QA builder)
- **Canonical Reference**: `BUILD_PHILOSOPHY.md` sections 56-75, `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md` A.4.4

#### REQ-RS-QA-003: QA Builder Catalog Alignment

- **Description**: QA builder must be aware of QA catalog alignment requirements
- **Required Element**: Reference to `governance/canon/QA_CATALOG_ALIGNMENT_GATE_CANON.md` OR description of QA catalog
- **Validation Rule**: Agent file references QA catalog alignment OR describes QA catalog role
- **Acceptance Criteria**: 
  - Referenced or described: ✅
- **Severity if Missing**: MEDIUM (if agent is QA builder)
- **Canonical Reference**: `governance/canon/QA_CATALOG_ALIGNMENT_GATE_CANON.md`

---

## SECTION 8: Validation Summary

This section provides completion criteria and validation tooling requirements.

### 8.1 Completion Criteria

#### REQ-VS-001: All BLOCKER Requirements Met

- **Description**: All requirements with BLOCKER severity must pass
- **Validation Rule**: 
  - Count all requirements marked BLOCKER
  - All must have ✅ acceptance criteria
  - If ANY blocker fails, entire validation fails
- **Acceptance Criteria**: 
  - All BLOCKER requirements pass: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: This checklist

#### REQ-VS-002: All HIGH Requirements Met

- **Description**: All requirements with HIGH severity must pass
- **Validation Rule**: 
  - Count all requirements marked HIGH
  - All must have ✅ acceptance criteria
  - If ANY high-severity fails, validation fails
- **Acceptance Criteria**: 
  - All HIGH requirements pass: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: This checklist

#### REQ-VS-003: Role-Specific Requirements Met

- **Description**: All role-specific requirements for builder type must pass
- **Validation Rule**: 
  - Identify builder type (UI/API/Schema/Integration/QA)
  - Validate all role-specific requirements for that type
  - All must pass
- **Acceptance Criteria**: 
  - All role-specific requirements pass: ✅
- **Severity if Missing**: HIGH
- **Canonical Reference**: This checklist, Section 7

### 8.2 Automated Validation

#### REQ-VS-004: Machine-Checkable Format

- **Description**: Builder agent file must be in machine-parseable format
- **Validation Rule**: 
  - File has YAML frontmatter delimited by `---`
  - YAML is valid (parseable by standard YAML parser)
  - Markdown body is valid
- **Acceptance Criteria**: 
  - YAML frontmatter valid: ✅
  - Markdown valid: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: Agent file format standards

#### REQ-VS-005: Validation Report Generation

- **Description**: Automated validator must generate validation report
- **Validation Rule**: 
  - Validator produces report showing pass/fail for each requirement
  - Report includes requirement ID, description, result, severity
  - Report includes overall pass/fail verdict
- **Acceptance Criteria**: 
  - Report generated: ✅
  - All fields present: ✅
  - Overall verdict clear: ✅
- **Severity if Missing**: N/A (validator requirement)
- **Canonical Reference**: Validation tooling standards

### 8.3 Manual Review Checklist

#### REQ-VS-006: Human Readability

- **Description**: Builder agent file must be human-readable
- **Validation Rule**: 
  - File uses clear, professional language
  - Sections are logically organized
  - No placeholder text (e.g., "TODO", "TBD", "FIXME")
- **Acceptance Criteria**: 
  - Clear language: ✅
  - Logical organization: ✅
  - No placeholders: ✅
- **Severity if Missing**: MEDIUM
- **Canonical Reference**: Agent file quality standards

#### REQ-VS-007: CS2/FM Review Approval

- **Description**: Builder agent file must be approved by CS2 or Foreman
- **Validation Rule**: 
  - File creation/modification is via CS2-authorized PR
  - PR includes explicit CS2 approval OR FM approval with CS2 delegation
- **Acceptance Criteria**: 
  - CS2/FM approval present: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `governance/canon/AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md`, `LIVING_AGENT_SYSTEM.md` v6.2.0 agent-factory protocol

#### REQ-VS-008: Character Count Limit

- **Description**: Builder agent file must not exceed 30,000 characters
- **Validation Rule**: 
  - Count total characters in file (including YAML frontmatter and markdown body)
  - Character count <= 30,000
- **Acceptance Criteria**: 
  - Character count <= 30,000: ✅
- **Severity if Missing**: BLOCKER
- **Canonical Reference**: `LIVING_AGENT_SYSTEM.md` v6.2.0 agent-factory protocol, GitHub UI selectability requirement (ref: PartPulse PR #265)

---

## SECTION 9: Validation Execution Workflow

### 9.1 Pre-Creation Validation (Foreman Responsibility)

**When**: Before builder agent file creation

**Steps**:
1. FM loads this checklist
2. FM verifies all pre-creation conditions met:
   - Architecture complete and frozen (REQ-BP-007)
   - QA-to-Red complete and failing (REQ-BP-002)
   - PR gates layered down
3. FM drafts builder agent file
4. FM validates file against Sections 1-7 of this checklist
5. FM ensures character count < 30,000 (REQ-VS-008)
6. If validation passes → FM creates PR with agent file
7. If validation fails → FM resolves gaps before PR creation

### 9.2 Post-Creation Validation (Automated Tooling)

**When**: After builder agent file PR created, before merge

**Steps**:
1. Automated validator loads builder agent file
2. Validator parses YAML frontmatter
3. Validator executes validation rules for each requirement
4. Validator generates validation report
5. Validator returns pass/fail verdict
6. If pass → PR may proceed to CS2 review
7. If fail → PR blocked, FM addresses issues

### 9.3 CS2 Review Validation (Human Review)

**When**: After automated validation passes, before merge

**Steps**:
1. CS2 reviews validation report
2. CS2 performs spot-check of critical requirements
3. CS2 verifies builder specialty alignment
4. CS2 checks for governance soundness
5. CS2 approves or requests changes
6. If approved → PR may merge
7. If changes requested → FM addresses, re-validates

### 9.4 Maintenance Validation

**When**: Periodically (quarterly) or when governance canon updates

**Steps**:
1. FM or governance liaison runs validation against all active builder agent files
2. Validator identifies drift or non-compliance
3. Drift detected → FM creates alignment PR
4. Validation passes → builders remain compliant

---

## APPENDIX A: Requirement Severity Definitions

### BLOCKER

- **Definition**: Requirement is absolutely mandatory; violation renders builder agent file INVALID and builder OUT OF GOVERNANCE
- **Impact**: Builder MUST NOT be recruited/activated until resolved
- **Examples**: Missing agent.class, missing Build-to-Green commitment, character count > 30,000

### HIGH

- **Definition**: Requirement is critical for governance alignment; violation represents significant risk
- **Impact**: Builder may be temporarily activated but MUST resolve before next wave
- **Examples**: Missing Zero Test Debt commitment, incomplete scope declaration

### MEDIUM

- **Definition**: Requirement supports governance alignment; violation represents moderate risk
- **Impact**: Builder should resolve during next maintenance cycle
- **Examples**: Missing evidence bundle awareness, incomplete audit trail description

---

## APPENDIX B: Quick Validation Checklist (FM Use)

Use this quick checklist during builder agent file creation:

- [ ] **YAML Frontmatter Complete** (REQ-BF-001 through REQ-BF-022)
- [ ] **Canon Inventory Loaded** (REQ-CA-001 through REQ-CA-003)
- [ ] **No Placeholder Hashes** (REQ-CA-004)
- [ ] **BUILD_PHILOSOPHY.md Bound** (REQ-CA-006)
- [ ] **Build-to-Green Declared** (REQ-BP-001)
- [ ] **QA-to-Red Precondition Stated** (REQ-BP-002)
- [ ] **Zero Test Debt Commitment** (REQ-BP-004)
- [ ] **100% GREEN Requirement** (REQ-BP-006)
- [ ] **Architecture Precondition** (REQ-BP-007)
- [ ] **OPOJD Commitment** (REQ-BP-009)
- [ ] **PREHANDOVER Proof Requirement** (REQ-EA-003)
- [ ] **Three Merge Gate Checks** (REQ-MG-002)
- [ ] **Escalation Triggers Listed** (REQ-EP-001)
- [ ] **Role-Specific Requirements** (REQ-RS-* for builder type)
- [ ] **Character Count < 30,000** (REQ-VS-008)
- [ ] **No Placeholder Text** (REQ-VS-006)

**Pass Criteria**: ALL items checked ✅

---

## APPENDIX C: Validation Report Template

```markdown
# Builder Agent File Validation Report

**Agent File**: `.github/agents/<builder-name>.md`  
**Validation Date**: YYYY-MM-DD  
**Validator**: [Automated|Foreman|CS2]

---

## Overall Verdict

**STATUS**: [✅ PASS | ❌ FAIL]

**Summary**:
- Total Requirements: X
- Passed: Y
- Failed: Z
- BLOCKER Failures: N

---

## Section 1: YAML Frontmatter Requirements

| Req ID | Description | Result | Severity |
|--------|-------------|--------|----------|
| REQ-BF-001 | Agent ID Declaration | ✅ PASS | BLOCKER |
| REQ-BF-002 | Agent Class Declaration | ✅ PASS | BLOCKER |
| ... | ... | ... | ... |

---

## Section 2: Canon Inventory Alignment

| Req ID | Description | Result | Severity |
|--------|-------------|--------|----------|
| REQ-CA-001 | Canon Inventory File Existence | ✅ PASS | BLOCKER |
| ... | ... | ... | ... |

---

[Continue for all sections]

---

## Failed Requirements Detail

### REQ-XX-YYY: [Requirement Name]

- **Severity**: [BLOCKER|HIGH|MEDIUM]
- **Validation Rule**: [Rule description]
- **Expected**: [What should be present]
- **Actual**: [What was found]
- **Remediation**: [How to fix]

---

## Recommendations

[Any additional observations or recommendations]

---

**Validation Complete**
```

---

## APPENDIX D: Canonical Reference Index

Quick reference to canonical governance documents cited in this checklist:

- **`governance/CANON_INVENTORY.json`** - Canon alignment validation authority
- **`BUILD_PHILOSOPHY.md`** - Build-to-Green, Zero Test Debt, 100% GREEN mandates
- **`LIVING_AGENT_SYSTEM.md` v6.2.0** - Agent-factory protocol, session memory, 30K character limit
- **`governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md`** - Binding completeness authority
- **`governance/canon/FM_BUILDER_APPOINTMENT_PROTOCOL.md`** - Appointment requirements authority
- **`governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md`** - Binding guidance authority
- **`governance/canon/AGENT_RECRUITMENT.md`** - Agent legitimacy and authority
- **`governance/canon/STOP_AND_FIX_DOCTRINE.md`** - Stop-and-Fix mandate
- **`governance/canon/MERGE_GATE_INTERFACE_STANDARD.md`** - Merge gate requirements
- **`governance/canon/MERGE_GATE_PHILOSOPHY.md`** - Merge gate enforcement philosophy
- **`governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md`** - PREHANDOVER proof requirements
- **`governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`** - Evidence bundle requirements
- **`governance/canon/ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md`** - Architecture standards
- **`governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`** - Hash validation requirements
- **`governance/opojd/OPOJD_COMPLETE_JOB_HANDOVER_DOCTRINE.md`** - OPOJD mandate
- **`governance/canon/QA_CATALOG_ALIGNMENT_GATE_CANON.md`** - QA catalog requirements
- **`governance/policies/zero-test-debt-constitutional-rule.md`** - Zero Test Debt policy
- **`governance/canon/LEARNING_PROMOTION_RULE.md`** - Learning capture requirements
- **`governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`** - FM authority and escalation path
- **`governance/canon/AGENT_RIPPLE_AWARENESS_OBLIGATION.md`** - Ripple awareness for integration builders
- **`governance/canon/BRANCH_PROTECTION_ENFORCEMENT.md`** - Never push main requirement
- **`governance/canon/PR_GATE_PRECONDITION_RULE.md`** - Write via PR requirement
- **`governance/canon/MATURION_BOT_EXECUTION_IDENTITY_MODEL.md`** - Execution identity requirements
- **`governance/runbooks/AGENT_TEST_EXECUTION_PROTOCOL.md`** - Test execution before handover
- **`governance/canon/CI_CONFIRMATORY_NOT_DIAGNOSTIC.md`** - CI philosophy
- **`governance/canon/AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md`** - CS2 approval authority

---

**Authority**: Maturion Engineering Leadership (Johan Ras)  
**Version**: 1.1.0 (Detailed Sections)  
**Effective Date**: 2026-02-14  
**Canonical References**: All requirements trace to canonical governance documents listed above
