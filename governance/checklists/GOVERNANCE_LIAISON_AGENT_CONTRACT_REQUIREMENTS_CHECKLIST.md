# Governance Liaison Agent Contract Requirements Checklist (governance-liaison.md)

**Status**: Reference checklist for contract drafting  
**Purpose**: Exhaustive, source-mapped requirements for a compliant Governance Liaison agent file in this repo.  
**Primary Sources**: `governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md`, `governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md`, `governance/canon/*` (see citations).  
**Derived From**: office-app PR #730 and PR #733 gold standard checklist structure

---

## Category 0 — Identity, Bindings & Scope
- [ ] **Frontmatter**: `agent.id=governance-liaison`, `agent.class=liaison`; `governance.canon` points to `APGI-cmy/maturion-foreman-governance/governance/canon`; Tier-0 manifest loaded (`governance/TIER_0_CANON_MANIFEST.json`).
- [ ] **Mandatory bindings present**: Governance purpose/scope, Build Philosophy, zero-test-debt, execution bootstrap, ripple model, contract protection, agent recruitment/authority, merge-gate philosophy, agent test execution, ripple checklist (`governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md`, `GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Sections 2 & 5).
- [ ] **Scope declaration**: Repo-scoped, write-access limits, restricted paths (.github/agents, Build Philosophy) captured.

## Category 1 — Appointment Preconditions & Authority Boundaries
- [ ] **Structural appointment**: All five preconditions recorded (Tier-0 loaded, explicit scope, authorization trail, protocol reference, coupling rules active) (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Section 5).
- [ ] **Authority chain**: FM (recruiting authority) → Governance Liaison; human authorization required; appointment revocable (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Sections 3.2, 6; `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`).
- [ ] **Explicit negatives**: NOT builder, NOT FM, NOT governance administrator, NOT enforcement agent; cannot self-modify own contract (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Section 3.3).
- [ ] **Authority model compliance**: CS2 agent file authority + contract protection protocols referenced for any contract edits (`governance/canon/CS2_AGENT_FILE_AUTHORITY_MODEL.md`, `AGENT_CONTRACT_PROTECTION_PROTOCOL.md`).

## Category 2 — Governance Alignment & Layer-Down
- [ ] **Self-alignment mandate**: Must verify local governance vs canonical and self-align drift before work; halt if own contract drifts (`governance/canon/GOVERNANCE_VERSIONING_AND_SYNC_PROTOCOL.md`).
- [ ] **Layer-down protocol**: Uses governance layerdown contract + ripple checklist for updates; respects repository seeding & enforcement role separation (`governance/canon/GOVERNANCE_LAYERDOWN_CONTRACT.md`, `GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md`, `REPOSITORY_SEEDING_AND_ENFORCEMENT_ROLE_SEPARATION.md`).
- [ ] **Inventory updates**: Maintains `GOVERNANCE_ARTIFACT_INVENTORY.md` and governance version markers per sync protocol (`governance/canon/GOVERNANCE_VERSIONING_AND_SYNC_PROTOCOL.md`).

## Category 3 — Execution Discipline, Evidence & Tests
- [ ] **Execution Bootstrap** applied to any executable/workflow changes; PREHANDOVER proof attached; CI confirmatory rule acknowledged (`governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md`, `CI_CONFIRMATORY_NOT_DIAGNOSTIC.md`, `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md`).
- [ ] **Test enforcement**: Agent Test Execution Protocol binding present; zero-test-debt + stop-and-fix doctrine enforced for governance artifacts with execution semantics (`governance/canon/AGENT_TEST_EXECUTION_PROTOCOL.md`, `governance/policies/zero-test-debt-constitutional-rule.md`, `STOP_AND_FIX_DOCTRINE.md`).
- [ ] **Audit trail**: Initialization or coupling actions documented with timestamps/authorizations (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Sections 4.1.1, 4.1.2).

## Category 4 — Ripple, Drift & Sync
- [ ] **Ripple awareness**: Non-local impact assumed; ripple detection + checklist protocols followed; cross-repo transport respected (`governance/canon/AGENT_RIPPLE_AWARENESS_OBLIGATION.md`, `GOVERNANCE_RIPPLE_MODEL.md`, `GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md`, `CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md`).
- [ ] **Sync discipline**: Governance versioning/sync protocol applied; drift flagged and cleared before proceeding (`governance/canon/GOVERNANCE_VERSIONING_AND_SYNC_PROTOCOL.md`).
- [ ] **Alignment reporting**: Ripple inbox/archival + sync_state updates executed per consumer-mode governance instructions (merge gate interface expectations noted).

## Category 5 — Escalation & Stop Rules
- [ ] **STOP triggers**: Ambiguity, contract drift, missing authorization, inability to access canonical governance → halt and escalate to CS2/FM as appropriate (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Section 7).
- [ ] **Escalation content**: Include scope, canon references, options, and await decision; follow cascading failure + warning blocker protocols for governance incidents (`governance/canon/CASCADING_FAILURE_CIRCUIT_BREAKER.md`, `WARNING_DISCOVERY_BLOCKER_PROTOCOL.md`).
- [ ] **Authority boundaries**: Cannot approve merges; cannot bypass gates; must defer to FM/governance admin on constitutional changes (`governance/canon/MERGE_GATE_PHILOSOPHY.md`).

## Category 6 — Prohibitions & Guardrails
- [ ] **No code-build tasks**: Prohibited from implementing code/tests/QA or orchestration; must not change Build Philosophy or Tier-0 artifacts (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Sections 3.3.1–3.3.4).
- [ ] **No self-contract edits** beyond formatting; changes require CS2/governance administrator.
- [ ] **No cross-repo authority**: May not modify agent contracts or governance in other repos; repository seeding tasks only when authorized (`governance/canon/REPOSITORY_SEEDING_AND_ENFORCEMENT_ROLE_SEPARATION.md`, `AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md`).

## Category 7 — Outputs & Deliverables
- [ ] **Initialization artifacts**: Directory scaffolding, governance version files, evidence logs, and PREHANDOVER proof when performing seeding/coupling (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Section 4.1.1).
- [ ] **Alignment artifacts**: Updated inventories, sync state, ripple inbox/archives, and attestation of self-governance checks.
- [ ] **Traceability**: Authorization trail + timestamps for each action; scope/assignment documented per protocol (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Sections 4–6).

## Category 8 — Cross-Repository Layer-Down Protocol
- [ ] **Layer-down initiation triggers**: Responds to breaking changes, new PUBLIC_API canon files, periodic sync, platform readiness validation, or explicit governance liaison requests; follows initiation protocol (`governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` Section 6.1).
- [ ] **Layer-down execution steps**: Reviews governance canon manifest for changes, identifies affected canon files, updates agent contracts with new version references, validates PR gates align with canon, tests changes in isolated branch, executes prehandover verification per Execution Bootstrap Protocol (`governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` Section 6.2).
- [ ] **SHA256 verification**: Validates file integrity using SHA256 hashes from `CANON_INVENTORY.json`; ensures canonical file versions match expected checksums before layer-down (`governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` Section 6.3; `governance/CANON_INVENTORY.json`).
- [ ] **Conflict resolution**: Escalates when local modifications conflict with canonical updates; documents deviations if intentional (rare cases); never silently overwrites governance changes (`governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` Sections 6.2, 11).
- [ ] **Layer-down evidence**: Produces version alignment confirmation, canon file consumption list, agent contract update diffs, PR gate validation evidence, test results, and MANDATORY PREHANDOVER_PROOF for executable artifacts (`governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` Section 6.3; `EXECUTION_BOOTSTRAP_PROTOCOL.md`).
- [ ] **Version synchronization**: Updates `GOVERNANCE_ALIGNMENT.md` with new canonical commit hash and version after successful layer-down completion (`governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` Sections 4.2, 7.1).

## Category 9 — Consumer Repository Registry Operations
- [ ] **Registry binding**: Reads consumer repository configuration from canonical source `governance/CONSUMER_REPO_REGISTRY.json`; understands this repo's entry includes enabled status, ripple targets, and metadata (`governance/canon/CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md` Section 7; canonical registry location per governance repo structure).
- [ ] **Ripple target verification**: Validates that ripple events originate from repositories listed in registry; verifies dispatch payloads match registry-defined sender expectations; rejects ripple from unlisted sources (`governance/canon/CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md` Sections 4, 7).
- [ ] **Deterministic targeting**: Respects registry order for ripple processing; skips disabled entries; applies tag-based staged rollout rules if present in registry (`governance/canon/CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md` Section 7).
- [ ] **Registry escalation protocol**: Escalates to CS2/governance administrator when registry inconsistencies detected, when circuit breaker trips after 3 failed ripple dispatches, or when ripple SLA violations occur (`governance/canon/CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md` Sections 6, 8).
- [ ] **Ripple inbox management**: Records received ripple events to `.agent-admin/governance/ripple-log.json` and updates `.agent-admin/governance/sync_state.json` per consumer expectations protocol (`governance/canon/CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md` Section 5).

## Category 10 — Role-Specific Authority Boundaries
- [ ] **No canon authoring**: Consumer repository role ONLY; prohibited from creating, modifying, or proposing canonical governance artifacts; all governance canon flows from governance repository to consumer repos via layer-down (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Section 3.3.3; `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` Section 1).
- [ ] **Sync and layer-down scope only**: Authority limited to receiving governance updates, maintaining version synchronization, updating local governance references, and executing layer-down protocol; no authority over application code, architecture, builds, or QA (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Sections 3.3.1–3.3.4; `REPOSITORY_SEEDING_AND_ENFORCEMENT_ROLE_SEPARATION.md` Section 3.1.3).
- [ ] **Constitutional change escalation**: Must escalate to CS2 or governance administrator when layer-down includes constitutional changes (Build Philosophy, zero-test-debt, supreme authority documents); cannot approve or apply constitutional updates without explicit human authorization (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Section 7; `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` Section 8; Category 5 stop rules).
- [ ] **Repository initialization authority**: When explicitly authorized, may perform one-time repository seeding and governance coupling; must follow structured appointment with scope definition and authorization trail (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Sections 3.2, 4, 5; `REPOSITORY_INITIALIZATION_AND_GOVERNANCE_SEEDING_PROTOCOL.md`).
- [ ] **Self-governance boundaries**: May self-align own contract to resolve drift from canonical baseline, but must follow CS2 agent file authority model for substantive contract changes; cannot bypass contract protection locks (`governance/canon/GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` Section 3.3; `CS2_AGENT_FILE_AUTHORITY_MODEL.md`; `AGENT_CONTRACT_PROTECTION_PROTOCOL.md`; Category 6 prohibitions).

---

## Appendix A — Required Canonical Governance Artifacts

This appendix enumerates PUBLIC_API canonical governance artifacts that governance liaison agents MUST read, reference, and layer down per protocol. All artifacts are sourced from `APGI-cmy/maturion-foreman-governance` canonical repository and tracked in `governance/CANON_INVENTORY.json`.

**Total PUBLIC_API Canons**: 102 (as of 2026-02-11)

### Core Identity & Purpose
- `GOVERNANCE_PURPOSE_AND_SCOPE.md` — Supreme authority; defines governance as canonical memory and agent roles
- `BUILD_PHILOSOPHY.md` — Constitutional principles for one-time build correctness

### Agent Contract & Recruitment
- `AGENT_RECRUITMENT.md` — Agent legitimacy and recruitment process
- `AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md` — Authority model for agent appointments
- `AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md` — Single-writer pattern for agent contracts
- `AGENT_CONTRACT_PROTECTION_PROTOCOL.md` — Locked section protection mechanisms
- `AGENT_FILE_BINDING_REQUIREMENTS.md` — Mandatory governance bindings for agent files
- `AGENT_ONBOARDING_QUICKSTART.md` — Agent onboarding process
- `CS2_AGENT_FILE_AUTHORITY_MODEL.md` — CS2 authority over agent file modifications

### Cross-Repository Layer-Down & Ripple
- `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` — Explicit controlled governance propagation protocol
- `CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md` — Mandatory ripple transport and registry targeting
- `GOVERNANCE_RIPPLE_MODEL.md` — Ripple signaling mechanism
- `GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md` — Ripple detection requirements
- `GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md` — Step-by-step ripple execution checklist
- `AGENT_RIPPLE_AWARENESS_OBLIGATION.md` — Ripple awareness obligations for all agents
- `CROSS_REPOSITORY_RIPPLE_AWARENESS_MODEL.md` — Cross-repo ripple coordination model

### Governance Liaison Role Definition
- `GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md` — Structural appointment requirements
- `GOVERNANCE_LIAISON_ROLE_SURVEY.md` — Role derivation from canonical sources
- `GOVERNANCE_LIAISON_MINIMUM_REQUIREMENTS_VALIDATION.md` — Validation methodology for appointments
- `GOVERNANCE_LIAISON_TRAINING_PROTOCOL.md` — Training and competency requirements
- `REPOSITORY_SEEDING_AND_ENFORCEMENT_ROLE_SEPARATION.md` — Liaison vs enforcement vs builder boundaries

### Version Synchronization & Alignment
- `GOVERNANCE_VERSIONING_AND_SYNC_PROTOCOL.md` — Version semantics and sync process
- `GOVERNANCE_LAYERDOWN_CONTRACT.md` — Base layer-down requirements
- `AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md` — Context synchronization for agents
- `GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md` — Alignment tracking and monitoring

### Execution, Testing & Evidence
- `EXECUTION_BOOTSTRAP_PROTOCOL.md` — 7-step prehandover verification protocol
- `PREHANDOVER_PROOF_TEMPLATE.md` — Mandatory evidence template for executable changes
- `CI_CONFIRMATORY_NOT_DIAGNOSTIC.md` — CI-confirmatory doctrine
- `AGENT_TEST_EXECUTION_PROTOCOL.md` — Test execution requirements
- `ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md` — Zero-test-debt prohibition
- `STOP_AND_FIX_DOCTRINE.md` — Immediate remediation for warnings/failures

### Gate Protocols & Merge Requirements
- `MERGE_GATE_PHILOSOPHY.md` — Constitutional merge gate principles
- `AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md` — Per-agent-class gate requirements
- `AGENT_ROLE_GATE_APPLICABILITY.md` — Which gates apply to which roles
- `PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md` — Gate evaluation procedures
- `FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md` — FM authority over gates
- `BUILDER_FIRST_PR_MERGE_MODEL.md` — First PR merge requirements for builders

### Authority Models & Supervision
- `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` — FM as sole recruiting authority
- `PLATFORM_AUTHORITY_BOUNDARY_AND_DELEGATION_MODEL.md` — Platform authority boundaries
- `SELF_ALIGNMENT_AUTHORITY_MODEL.md` — Self-alignment permissions and constraints
- `COGNITIVE_HYGIENE_AUTHORITY_MODEL.md` — Cognitive hygiene governance

### Repository Initialization & Structure
- `REPOSITORY_INITIALIZATION_AND_GOVERNANCE_SEEDING_PROTOCOL.md` — Repo seeding process
- `FPC_REPOSITORY_LAYERDOWN_GUIDE.md` — Single entry point for layer-down execution
- `GOVERNANCE_CANON_MANIFEST.md` — Canonical file inventory with layer-down status

### Escalation & Compliance
- `CASCADING_FAILURE_CIRCUIT_BREAKER.md` — Cascading failure prevention
- `WARNING_DISCOVERY_BLOCKER_PROTOCOL.md` — Warning escalation requirements
- `MANDATORY_ENHANCEMENT_CAPTURE_DOCTRINE.md` — Enhancement capture obligations
- `GOVERNANCE_COMPLETENESS_MODEL.md` — Governance coverage requirements
- `AUDIT_READINESS_MODEL.md` — Audit trail and evidence standards

### Architecture & Build Requirements
- `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` — Frozen architecture validation
- `BUILD_PHILOSOPHY.md` — One-time build correctness principles
- `BUILD_TREE_EXECUTION_MODEL.md` — Build execution model
- `BUILD_NODE_INSPECTION_MODEL.md` — Build node validation
- `BUILDER_CONTRACT_BINDING_CHECKLIST.md` — Builder agent contract requirements

### Specialized Protocols
- `FOREMAN_MEMORY_PROTOCOL.md` — FM persistent memory model
- `FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md` — Wave planning procedures
- `FM_RUNTIME_ENFORCEMENT_AND_AWARENESS_MODEL.md` — Runtime governance enforcement
- `ACTIVATION_STATE_MODEL.md` — System activation states
- `RIPPLE_INTELLIGENCE_LAYER.md` — Ripple intelligence and correlation

**Artifact Version Tracking**: All artifact versions, effective dates, SHA256 checksums, and layer-down status (`PUBLIC_API`, `INTERNAL`, `OPTIONAL`) are maintained in `governance/CANON_INVENTORY.json` (version 1.0.0, 135 total canons, last updated 2026-02-11).

**Usage Notes**:
- Governance liaison MUST verify artifact checksums against `CANON_INVENTORY.json` before layer-down
- Only PUBLIC_API artifacts may be consumed by consumer repositories
- INTERNAL artifacts are off-limits per constitutional prohibition
- OPTIONAL artifacts may be referenced if repository opts in
- Version mismatches trigger drift detection and mandatory alignment

**Registry Location**: `governance/CONSUMER_REPO_REGISTRY.json` in canonical governance repository (referenced but not layered down to consumers; read-only access for verification).

---

**Usage**: Any unchecked item blocks `governance-liaison.md`. Cite the referenced source directly in the contract section that satisfies the requirement. If canonical inputs are missing or degraded, halt and escalate per Category 5.

---

**Alignment Notes**:
- Adapted from office-app PR #730 (Categories 0-7) and PR #733 (Categories 8-10 + Appendix A) gold standard checklists
- All canonical references updated to match maturion-isms governance structure
- Maintains comprehensive category-based organization (Categories 0-10)
- Every checklist item includes explicit canonical source citations with section references
- Consumer repository context: Governance canon flows from APGI-cmy/maturion-foreman-governance
- Cross-repo layer-down protocol, registry operations, and role authority boundaries explicitly enumerated
- 102 PUBLIC_API canonical artifacts catalogued in Appendix A

**Version**: 1.0.0  
**Date**: 2026-02-11  
**Authority**: office-app PR #730 and PR #733, LIVING_AGENT_SYSTEM.md v6.2.0
