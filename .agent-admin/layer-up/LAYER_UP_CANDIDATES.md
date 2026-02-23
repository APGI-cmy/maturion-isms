# Layer-Up Candidates Catalog

**Generated**: 2026-02-23  
**Session**: foreman-v2-050  
**Authority**: LAYER_UP_PROTOCOL.md v1.0.0, Section 5  
**Foreman**: foreman-v2-agent v2.2.0  
**Purpose**: Identify all files in maturion-isms requiring governance layer-up to canonical governance repo (maturion-foreman-governance)

---

## Summary

| Priority | Count | Files |
|----------|-------|-------|
| HIGH | 3 | TRS Upgrade: MODULE_LIFECYCLE, APP_DESCRIPTION_POLICY, BUILD_PROGRESS_TRACKER_TEMPLATE |
| MEDIUM | 6 | Local policies: FM_DELEGATED_ACTION, AUTOMATED_DEPRECATION_GATE, QA_POLICY_MASTER, BUILDER_QA_HANDOVER, TEST_REMOVAL_GATE, PR_GATE_FAILURE_HANDLING |
| MEDIUM | 3 | Local governance: AGENT_IGNORANCE_PROHIBITION, CROSS_AGENT_COORDINATION, GOVERNANCE_REPO_ADMINISTRATOR_REQUIREMENTS |
| LOW | 2 | Infrastructure: layer-up-dispatch.yml (workflow pattern), governance-ripple-sync.yml (workflow pattern) |
| LOW | 1 | RCA: LAYER_UP_PROTOCOL_RCA_AND_IMPLEMENTATION |

**Total Candidates**: 15 files

---

## Group 1: TRS Governance Upgrade (HIGH — Evidence Package Already Complete)

Evidence package: `LAYER_UP_TRS_GOVERNANCE_UPGRADE.md`  
Phase 1 completion proof: `LAYER_UP_PHASE1_COMPLETE.md`  
Trigger: **Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
Status: Phase 1 COMPLETE — awaiting dispatch to canonical governance repo

### 1.1 MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md

**File**: `governance/strategy/MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md`  
**SHA256**: `b832fc05e9dfdb3cc238b3750a2131598383d1d32edb2d7382f6483fab460773`  
**Change Type**: UPDATE — Canonical module lifecycle from 6 to 7 stages  
**Breaking**: YES (MODERATE — adds mandatory TRS stage between FRS and Architecture)  
**Summary**: Inserted TRS (Technical Requirements Specification) as Stage 1.5; added comprehensive Section 4.1 defining TRS purpose, ownership, scope (5 categories), deliverables; updated module folder structure to include `01.5-trs/`  
**Rationale**: Closes governance gap where direct FRS → Architecture transition caused late discovery of technical constraints and downstream failures. Validated in maturion-isms (PR #98) across 8 modules.

### 1.2 APP_DESCRIPTION_REQUIREMENT_POLICY.md

**File**: `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md`  
**SHA256**: `3e14b061c313aab7b70197846b333f17b7de7db445b6feb9b9cf57afc88b422c`  
**Change Type**: UPDATE — Flow diagram and ordering rule  
**Breaking**: YES (ordering rule change)  
**Summary**: Updated canonical flow diagram to include TRS; updated ordering rule to: App Description → FRS → **TRS** → Architecture → Build Authorization → Implementation  
**Rationale**: Maintains consistent policy flow matching updated module lifecycle.

### 1.3 BUILD_PROGRESS_TRACKER_TEMPLATE.md (NEW)

**File**: `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`  
**SHA256**: `070d3345e0b3904e8b14fcb8a3dde745cd2dca5787c3e275c9355283e2c8e1f4`  
**Change Type**: NEW — Template for module lifecycle progress tracking  
**Breaking**: NO (new template, not required retroactively)  
**Summary**: Standardized template for tracking module lifecycle progress; all 7 stages documented with checklists; includes TRS Stage 1.5 with specific artifacts; governance compliance section  
**Rationale**: Provides standardized audit-ready tracking; improves module governance visibility across ecosystem.

---

## Group 2: Local Policy Extensions (MEDIUM — CS2-Authorized Local Policies)

These files were authored with "Canonical Governance Policy" or "Constitutional" status by Maturion Engineering Leadership (Johan Ras) and represent validated policies operating in maturion-isms that should be propagated to canonical governance for ecosystem-wide enforcement.

Trigger: **Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7) + **Cross-Repository Pattern Observed** (Section 5.8)

### 2.1 FM_MATURION_DELEGATED_ACTION_POLICY.md

**File**: `governance/policy/FM_MATURION_DELEGATED_ACTION_POLICY.md`  
**Status in file**: "Canonical Governance Policy v1.0, Authority: Governance Administrator, Required By: G-C13"  
**Change Type**: NEW in canonical governance  
**Breaking**: NO  
**Summary**: Establishes governance framework for FM-to-Maturion delegated platform actions; defines when/how FM delegates; audit evidence requirements; delegation failure handling  
**Rationale**: Authoritative policy operating in isms but not present in canonical governance repo; should be propagated for all consumer repos to benefit.

### 2.2 AUTOMATED_DEPRECATION_DETECTION_GATE.md

**File**: `governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md`  
**Status in file**: "Canonical Governance Policy v1.0, Authority: Corporate Governance Canon, Source Learning: BL-026"  
**Change Type**: NEW in canonical governance  
**Breaking**: NO  
**Summary**: Mandatory automated deprecation detection gate for technical debt prevention; triggered by Wave 2.13 builder reflection; establishes deprecation warnings as OPOJD gate failures  
**Rationale**: Already validated as effective in maturion-isms; BL-026 learning should propagate ecosystem-wide.

### 2.3 QA_POLICY_MASTER.md

**File**: `governance/policy/QA_POLICY_MASTER.md`  
**Status in file**: "Constitutional — Canonical Policy, Authority: Supreme, Scope: Universal"  
**Change Type**: NEW in canonical governance  
**Breaking**: NO  
**Summary**: Single canonical source of truth for QA, verification, and failure-handling doctrine; applies to all repositories in Maturion ecosystem  
**Rationale**: Universal scope policy existing only locally; should be in canonical governance for ecosystem enforcement.

### 2.4 BUILDER_QA_HANDOVER_POLICY.md

**File**: `governance/policy/BUILDER_QA_HANDOVER_POLICY.md`  
**Change Type**: NEW in canonical governance  
**Breaking**: NO  
**Summary**: Builder QA handover requirements for foreman quality professor gate  
**Rationale**: Cross-repo applicable policy pattern.

### 2.5 TEST_REMOVAL_GOVERNANCE_GATE.md

**File**: `governance/policy/TEST_REMOVAL_GOVERNANCE_GATE.md`  
**Change Type**: NEW in canonical governance  
**Breaking**: NO  
**Summary**: Governance gate preventing unauthorized test removal; validates test changes do not reduce coverage  
**Rationale**: Cross-repo applicable gate pattern.

### 2.6 PR_GATE_FAILURE_HANDLING_PROTOCOL.md

**File**: `governance/policy/PR_GATE_FAILURE_HANDLING_PROTOCOL.md`  
**Change Type**: NEW in canonical governance  
**Breaking**: NO  
**Summary**: Protocol for handling PR gate failures; distinguishes governance failures from technical failures  
**Rationale**: Cross-repo applicable protocol pattern.

---

## Group 3: Local Governance Artifacts (MEDIUM — Constitutional/Supreme Authority)

These files carry "Constitutional - Active" or "Supreme" authority status and are explicitly marked as applying to all repositories in the Maturion ecosystem.

Trigger: **Governance Gap Discovered** (LAYER_UP_PROTOCOL.md Section 5.2) — these canonical-level policies exist only locally

### 3.1 AGENT_IGNORANCE_PROHIBITION_DOCTRINE.md

**File**: `governance/agent/AGENT_IGNORANCE_PROHIBITION_DOCTRINE.md`  
**Status in file**: "Constitutional - Active, Authority: Supreme, Layer-Down Status: PUBLIC_API, Applies To: All Agents, All Work, All Repositories"  
**Change Type**: NEW in canonical governance  
**Breaking**: NO  
**Summary**: Constitutional doctrine prohibiting agent ignorance of governance; equivalent authority to OPOJD, STOP_AND_FIX_DOCTRINE; Ratified by Johan Ras 2026-02-11  
**Rationale**: Explicitly marked PUBLIC_API and "All Repositories" scope — must be in canonical governance.

### 3.2 CROSS_AGENT_COORDINATION_PROTOCOL.md

**File**: `governance/coordination/CROSS_AGENT_COORDINATION_PROTOCOL.md`  
**Status in file**: "Constitutional - Active, Authority: Supreme, Layer-Down Status: PUBLIC_API, Applies To: All Agents, All Coordination Scenarios, All Repositories"  
**Change Type**: NEW in canonical governance  
**Breaking**: NO  
**Summary**: Constitutional protocol for cross-agent coordination; equivalent authority to OPOJD, STOP_AND_FIX_DOCTRINE; Ratified by Johan Ras 2026-02-11  
**Rationale**: Explicitly marked PUBLIC_API and "All Repositories" scope — must be in canonical governance.

### 3.3 GOVERNANCE_REPO_ADMINISTRATOR_REQUIREMENTS.md

**File**: `governance/contracts/GOVERNANCE_REPO_ADMINISTRATOR_REQUIREMENTS.md`  
**Status in file**: "Authority: Governance Canon + LCAS-001 Strategy, Version: 2.0.0"  
**Change Type**: Governance extension/clarification  
**Breaking**: NO  
**Summary**: Complete requirements checklist for governance-repo-administrator agent; derived from governance canon files; includes DEGRADED mode notes  
**Rationale**: Provides clarification/extension of canonical governance-repo-administrator requirements; useful for all repos governed by same pattern.

---

## Group 4: Infrastructure Patterns (LOW — Workflow Implementation Patterns)

These workflow files implement governance protocols and represent patterns that should be documented/canonicalized for other consumer repositories to adopt.

Trigger: **Learning Promotion Threshold Met** (LAYER_UP_PROTOCOL.md Section 5.6)

### 4.1 layer-up-dispatch.yml

**File**: `.github/workflows/layer-up-dispatch.yml`  
**Change Type**: Pattern documentation / canonical workflow template  
**Breaking**: NO  
**Summary**: Automates LAYER_UP_PROTOCOL.md Phase 3 escalation; validated in maturion-isms (PR #426); should be documented as canonical workflow pattern for all consumer repos  
**Rationale**: Session 049 implementation; proved the workflow infrastructure; other consumer repos need same pattern.

### 4.2 governance-ripple-sync.yml

**File**: `.github/workflows/governance-ripple-sync.yml`  
**Change Type**: Pattern documentation / canonical workflow template  
**Breaking**: NO  
**Summary**: Closes the repository_dispatch gap; handles governance_ripple events from canonical repo; matches parity with ripple-integration.yml  
**Rationale**: Session 049 implementation; closes critical gap in governance ripple pipeline; all consumer repos need this handler.

---

## Group 5: RCA Documentation (LOW — Learning Evidence)

### 5.1 LAYER_UP_PROTOCOL_RCA_AND_IMPLEMENTATION.md

**File**: `governance/rca/LAYER_UP_PROTOCOL_RCA_AND_IMPLEMENTATION.md`  
**Change Type**: Learning evidence / governance learning  
**Breaking**: NO  
**Summary**: Root cause analysis of auto-layer-down failure; documents the repository_dispatch gap; implementation report for governance-ripple-sync.yml and layer-up-dispatch.yml  
**Rationale**: Valuable learning for canonical governance; should be preserved in governance repo as evidence of protocol evolution.

---

## Layer-Up Dispatch Priority

For the initial layer-up issue to test and validate the `layer-up-dispatch.yml` workflow, the **TRS Governance Upgrade** (Group 1) is the highest priority because:

1. Phase 1 documentation is already complete (`LAYER_UP_TRS_GOVERNANCE_UPGRADE.md`)
2. Evidence package with SHA256 checksums is ready
3. Impact assessment is done (HIGH priority, 4 consumer repos)
4. The dispatch was blocked only by lack of workflow infrastructure (now resolved in PR #426)

**Recommended initial layer-up issue**: Reference `LAYER_UP_TRS_GOVERNANCE_UPGRADE.md` with labels `layer-up` + `governance-improvement` to trigger `layer-up-dispatch.yml` and validate end-to-end flow.

---

## Evidence References

- `LAYER_UP_TRS_GOVERNANCE_UPGRADE.md` — TRS layer-up evidence package (Phase 1 complete)
- `LAYER_UP_PHASE1_COMPLETE.md` — Phase 1 completion summary
- `governance/rca/LAYER_UP_PROTOCOL_RCA_AND_IMPLEMENTATION.md` — Infrastructure RCA
- `.agent-workspace/foreman-v2/memory/session-049-20260223.md` — Session 049 memory (workflow implementation)
- `.agent-workspace/foreman-v2/memory/session-050-20260223.md` — This session memory

---

**Created**: 2026-02-23  
**Authority**: LAYER_UP_PROTOCOL.md v1.0.0, GOVERNANCE_RIPPLE_MODEL.md Section 3.1  
**Foreman Session**: 050
