# Layer-Up Candidates Catalog

**Generated**: 2026-02-23  
**Last Updated**: 2026-03-01 (session-076 — comprehensive triage refresh)  
**Session**: foreman-v2-050 (initial) | foreman-v2-076 (refresh)  
**Authority**: LAYER_UP_PROTOCOL.md v1.0.0, Section 5  
**Foreman**: foreman-v2-agent v6.2.0  
**Trigger Issue**: APGI-cmy/maturion-isms#707  
**Purpose**: Identify all files and improvements in maturion-isms requiring governance layer-up to canonical governance repo (maturion-foreman-governance)

---

## Summary

| Priority | Count | Files |
|----------|-------|-------|
| HIGH | 3 | TRS Upgrade: MODULE_LIFECYCLE, APP_DESCRIPTION_POLICY, BUILD_PROGRESS_TRACKER_TEMPLATE |
| MEDIUM | 6 | Local policies: FM_DELEGATED_ACTION, AUTOMATED_DEPRECATION_GATE, QA_POLICY_MASTER, BUILDER_QA_HANDOVER, TEST_REMOVAL_GATE, PR_GATE_FAILURE_HANDLING |
| MEDIUM | 3 | Local governance: AGENT_IGNORANCE_PROHIBITION, CROSS_AGENT_COORDINATION, GOVERNANCE_REPO_ADMINISTRATOR_REQUIREMENTS |
| LOW | 2 | Infrastructure: layer-up-dispatch.yml (workflow pattern), governance-ripple-sync.yml (workflow pattern) |
| LOW | 1 | RCA: LAYER_UP_PROTOCOL_RCA_AND_IMPLEMENTATION |

**Total Candidates**: 15 files (original) + 11 new candidates (session-076) = **26 total**

---

## Dispatch Status

| Candidate | Spec File | Dispatched to maturion-foreman-governance | Governance Issue # |
|---|---|---|---|
| 1.1 MODULE_LIFECYCLE | issue-spec-01-trs-module-lifecycle.md | ❌ NOT YET | — |
| 1.2 APP_DESCRIPTION_POLICY | issue-spec-02-trs-app-description-policy.md | ❌ NOT YET | — |
| 1.3 BUILD_PROGRESS_TRACKER_TEMPLATE | issue-spec-03-trs-build-progress-tracker.md | ❌ NOT YET | — |
| 2.1 FM_DELEGATED_ACTION_POLICY | issue-spec-04-fm-delegated-action-policy.md | ❌ NOT YET | — |
| 2.2 AUTOMATED_DEPRECATION_GATE | issue-spec-05-automated-deprecation-gate.md | ❌ NOT YET | — |
| 2.3 QA_POLICY_MASTER | issue-spec-06-qa-policy-master.md | ❌ NOT YET | — |
| 2.4 BUILDER_QA_HANDOVER | issue-spec-07-builder-qa-handover-policy.md | ❌ NOT YET | — |
| 2.5 TEST_REMOVAL_GATE | issue-spec-08-test-removal-gate.md | ❌ NOT YET | — |
| 2.6 PR_GATE_FAILURE_HANDLING | issue-spec-09-pr-gate-failure-handling.md | ❌ NOT YET | — |
| 3.1 AGENT_IGNORANCE_PROHIBITION | issue-spec-10-agent-ignorance-prohibition.md | ❌ NOT YET | — |
| 3.2 CROSS_AGENT_COORDINATION | issue-spec-11-cross-agent-coordination.md | ❌ NOT YET | — |
| 3.3 GOVERNANCE_REPO_ADMIN_REQS | issue-spec-12-governance-repo-admin-reqs.md | ❌ NOT YET | — |
| 4.1 layer-up-dispatch.yml pattern | issue-spec-13-layer-up-dispatch-pattern.md | ❌ NOT YET | — |
| 4.2 governance-ripple-sync.yml pattern | issue-spec-14-governance-ripple-sync-pattern.md | ❌ NOT YET | — |
| 5.1 LAYER_UP_PROTOCOL_RCA | issue-spec-15-layer-up-protocol-rca.md | ❌ NOT YET | — |
| 6.1 S-001 align-governance.sh pre-check | issue-spec-16-s001-align-governance-precheck.md | ❌ NOT YET | — |
| 6.2 S-002 CI stub-detection gate | issue-spec-17-s002-ci-stub-detection.md | ❌ NOT YET | — |
| 6.3 S-004 CI PREHANDOVER proof check | issue-spec-18-s004-ci-prehandover-check.md | ❌ NOT YET | — |
| 6.4 S-006 FAIL-ONLY-ONCE status lint | issue-spec-19-s006-fail-only-once-lint.md | ❌ NOT YET | — |
| 6.5 S-007 CI POLC boundary gate | issue-spec-20-s007-polc-boundary-gate.md | ❌ NOT YET | — |
| 6.6 S-008 CI session memory timestamp | issue-spec-21-s008-session-memory-timestamp.md | ❌ NOT YET | — |
| 6.7 S-009 PREHANDOVER verbatim IAA | issue-spec-22-s009-prehandover-verbatim-iaa.md | ❌ NOT YET | — |
| 6.8 S-003 AAWP deliverable verification | issue-spec-25-s003-aawp-deliverable-verification.md | ❌ NOT YET | — |
| 6.9 S-005 governance alignment integration test | issue-spec-26-s005-governance-alignment-integration-test.md | ❌ NOT YET | — |
| 7.1 A-014 IAA tool call mandatory rule | issue-spec-23-a014-iaa-tool-call-mandatory.md | ❌ NOT YET | — |
| 7.2 PREHANDOVER template v1.0.0+ | issue-spec-24-prehandover-template-canonical.md | ❌ NOT YET | — |

**Issue spec files location**: `.agent-admin/layer-up/issue-specs/`  
**How to dispatch**: Create an issue in maturion-isms using each spec file's title and body, then add labels `layer-up` + `governance-improvement`. The `layer-up-dispatch.yml` workflow will automatically escalate to maturion-foreman-governance.

> **IAA Rejection Note (session-076 first invocation)**: IAA-session-023-20260301-REJECT was issued for FC-5 (S-003 and S-005 missing from initial triage). Resolved by adding issue-spec-25 and issue-spec-26. See re-invocation result in PREHANDOVER proof.

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

## Group 6: FAIL-ONLY-ONCE Structural Improvements (NEW — session-076)

These are open improvement suggestions from `FAIL-ONLY-ONCE.md v1.8.0` (ISMS-local Tier 2 registry) that represent canonical governance structural improvements applicable across the ecosystem. All are currently OPEN in the registry and require governance layer-up to become enforced CI/CD gates in all consumer repositories.

Trigger: **Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7) — each originated from an incident record in FAIL-ONLY-ONCE.

### 6.1 S-001 — align-governance.sh Learning Retention Pre-Flight Check

**Suggestion ID**: S-001  
**Origin**: GV-001-20260221 (Silent Removal of Recorded Learnings incident)  
**Change Type**: CI/automation enhancement  
**Breaking**: NO  
**Summary**: `align-governance.sh` must warn (BLOCKER) when local version has MORE sections than canonical — prevents silent loss of locally-added learnings that haven't been upstreamed. Currently the script performs one-way layer-down without diff analysis.  
**Rationale**: GV-001 proved that automated sync can silently remove validated learnings. This check prevents recurrence across all consumer repos.

### 6.2 S-002 — CI Stub-Detection Gate

**Suggestion ID**: S-002  
**Origin**: INC-5.6R-DELIVERY-001 (Wave 5.6R Delivery Fraud incident)  
**Change Type**: CI gate (new check)  
**Breaking**: NO  
**Summary**: Add CI merge gate check: `grep -rn "expect(true).toBe(true)" modules/` fails PR if any matches found. Automates stub-detection that Foreman must currently perform manually.  
**Rationale**: INC-5.6R-DELIVERY-001 proved stub tests can be presented as real passing tests. Machine enforcement prevents this pattern ecosystem-wide.

### 6.3 S-004 — CI Mandatory PREHANDOVER Proof Check

**Suggestion ID**: S-004  
**Origin**: INC-PREHANDOVER-OMISSION-20260224 (PREHANDOVER protocol omitted incident)  
**Change Type**: CI gate (new check)  
**Breaking**: NO  
**Summary**: Add CI check that fails PR when `.agent-admin/prehandover/proof-*.md` is absent — converts PREHANDOVER requirement from soft governance obligation to hard machine-enforced gate.  
**Rationale**: INC-PREHANDOVER-OMISSION-20260224 showed the PREHANDOVER protocol can be silently skipped. CI enforcement makes it structurally impossible.

### 6.4 S-006 — CI FAIL-ONLY-ONCE Status Validation Lint

**Suggestion ID**: S-006  
**Origin**: maturion-isms#498  
**Change Type**: CI lint/check  
**Breaking**: NO  
**Summary**: Add CI lint check that validates every incident status in FAIL-ONLY-ONCE.md is in the allowed status set (`OPEN | IN_PROGRESS | REMEDIATED | ACCEPTED_RISK (CS2)`). Automates the invalid-status HARD STOP rule currently enforced manually at preflight.  
**Rationale**: The HARD STOP rule depends on agent discipline. CI enforcement makes registry corruption impossible to miss.

### 6.5 S-007 — CI POLC Boundary Gate

**Suggestion ID**: S-007  
**Origin**: GOV-BREACH-AIMC-W5-001 (Wave 5 POLC Violation)  
**Change Type**: CI gate (new check)  
**Breaking**: NO  
**Summary**: Add CI gate that fails PR when foreman-v2 is listed as author of production code file changes (outside designated governance evidence paths). Machine-level enforcement of A-001 preventing repeat of GOV-BREACH-AIMC-W5-001.  
**Rationale**: POLC violation recurred 3 times (W5-001, W5-002, W8-001) despite governance rules. Machine enforcement is the only reliable prevention.

### 6.6 S-008 — CI Session Memory Timestamp Enforcement

**Suggestion ID**: S-008  
**Origin**: GOV-BREACH-AIMC-W5-002 (Preflight Skipped incident)  
**Change Type**: CI check  
**Breaking**: NO  
**Summary**: Add CI check that fails PR when no `.agent-workspace/foreman-v2/memory/session-*.md` file exists with a timestamp matching the PR creation date — machine-level enforcement that Phase 1 PREFLIGHT was executed.  
**Rationale**: Session memory is only written in Phase 4 which requires Phase 1 completion. This creates a structural dependency that makes preflight skip detectable.

### 6.7 S-009 — PREHANDOVER Verbatim IAA Response Requirement

**Suggestion ID**: S-009  
**Origin**: INC-IAA-SKIP-001 (IAA Tool Call Omitted incident)  
**Change Type**: Template standard + governance rule  
**Breaking**: NO  
**Summary**: Require verbatim paste of IAA agent's actual response text in the PREHANDOVER proof `## IAA Agent Response (verbatim)` section — making the `task` tool call self-evidencing and structurally impossible to fake. A PREHANDOVER proof with blank/placeholder IAA response section is a HANDOVER BLOCKER.  
**Status in ISMS**: IMPLEMENTED — `prehandover-template.md` v1.0.0 includes this section. Layer-up required to make it canonical across all consumer repos.  
**Rationale**: INC-IAA-SKIP-001 proved that without structural evidence, IAA invocation can be faked. Canonical enforcement prevents this pattern ecosystem-wide.

### 6.8 S-003 — AAWP Deliverable Table Line-by-Line Verification

**Suggestion ID**: S-003  
**Origin**: INC-WAVE3-20260224 (Wave 3 Incomplete Scope Verification)  
**Change Type**: Governance checklist addition  
**Breaking**: NO  
**Summary**: Add AAWP deliverable table line-by-line verification as a mandatory numbered step in every pre-handover checklist. For each deliverable row: confirm file exists in PR diff (new/modified), OR if pre-existing: explicitly confirm it meets this wave's acceptance criteria. Zero unaccounted deliverable rows permitted.  
**Rationale**: INC-WAVE3-20260224 proved 8 of 10 deliverables were assumed complete without verification. Explicit line-by-line accounting prevents partial deliveries from passing QP gate.

### 6.9 S-005 — Integration Test for governance-alignment-schedule.yml Drift Detection

**Suggestion ID**: S-005  
**Origin**: session-051 (2026-02-23); carry-forward improvement  
**Change Type**: Test specification  
**Breaking**: NO  
**Summary**: Add integration test specification validating that `governance-alignment-schedule.yml` (or equivalent consumer repo scheduled governance scan) correctly creates a liaison issue when drift is detected. Provides canonical test pattern for all consumer repos.  
**Rationale**: Absence of integration test means drift detection failures are silent. Consumer repos have no canonical test specification to verify their governance alignment automation.

---

## Group 7: IAA Governance Improvements (NEW — session-076)

New governance rules and artifacts from IAA/PREHANDOVER evolution that require canonical propagation.

Trigger: **Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)

### 7.1 A-014 — IAA Tool Call Mandatory Rule

**Rule ID**: A-014  
**Origin**: CS2 directive 2026-02-28, INC-IAA-SKIP-001  
**Change Type**: Governance rule addition  
**Breaking**: NO  
**Summary**: The `independent-assurance-agent` MUST be invoked via the `task` tool as the FIRST action in Phase 4 Step 4.3a — before writing any `iaa_audit_token` value. Writing any token string WITHOUT calling the tool is a PHASE_A_ADVISORY FABRICATION breach (INC-IAA-SKIP-001 class). Currently locked in ISMS-local FAIL-ONLY-ONCE v1.8.0 but not yet in canonical governance.  
**Rationale**: A-014 is cross-ecosystem applicable — any repo using IAA must enforce this rule. Canonical propagation ensures all consumer repos benefit.

### 7.2 PREHANDOVER Proof Template Canonical Standard

**Artifact**: `.agent-workspace/foreman-v2/knowledge/prehandover-template.md` v1.0.0+  
**Origin**: S-009 implementation (session-073-layer-up-iaa-tier2-20260228), CS2-authorized  
**Change Type**: Template canonization  
**Breaking**: NO  
**Summary**: The PREHANDOVER proof template with mandatory `## IAA Agent Response (verbatim)` section (S-009 requirement) is currently only in ISMS-local Tier 2 knowledge. Should be promoted to canonical governance template for use by all consumer repos and foreman instances.  
**Rationale**: S-009 was designed as universally applicable; the template should be canonical to ensure consistency across the ecosystem.

---

## Layer-Up Dispatch Priority (Updated 2026-03-01)

### Priority 1 (HIGH — Structural Safety):
1. **S-007** (CI POLC boundary gate) — 3 repeat POLC violations; machine enforcement critical
2. **S-009** (PREHANDOVER verbatim IAA) — already implemented in ISMS; needs canonical propagation
3. **A-014** (IAA tool call mandatory) — CS2-locked rule; needs canonical propagation
4. **TRS Group** (items 1.1–1.3) — module lifecycle change affects 4+ consumer repos

### Priority 2 (MEDIUM — Policy Propagation):
5. **S-001** through **S-006, S-008** — CI/CD structural improvements
6. **Groups 2–3** (local policies and constitutional governance)

### Priority 3 (LOW — Documentation):
7. **Groups 4–5** (infrastructure patterns and RCA documentation)

---

## Evidence References

- `LAYER_UP_TRS_GOVERNANCE_UPGRADE.md` — TRS layer-up evidence package (Phase 1 complete)
- `LAYER_UP_PHASE1_COMPLETE.md` — Phase 1 completion summary
- `governance/rca/LAYER_UP_PROTOCOL_RCA_AND_IMPLEMENTATION.md` — Infrastructure RCA
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` v1.8.0 — S-001 through S-009 origin
- `.agent-workspace/foreman-v2/memory/session-049-20260223.md` — Session 049 (workflow implementation)
- `.agent-workspace/foreman-v2/memory/session-050-20260223.md` — Session 050 (initial catalog)
- `.agent-workspace/foreman-v2/memory/session-073-layer-up-iaa-tier2-20260228.md` — IAA Tier 2 layer-up
- `.agent-workspace/foreman-v2/memory/session-076-layer-up-triage-20260301.md` — This triage session
- `.agent-admin/layer-up/issue-specs/` — Per-candidate issue body specifications

---

**Created**: 2026-02-23  
**Updated**: 2026-03-01 (session-076 — comprehensive refresh, 9 new candidates added)  
**Authority**: LAYER_UP_PROTOCOL.md v1.0.0, GOVERNANCE_RIPPLE_MODEL.md Section 3.1  
**Foreman Session**: 050 (initial) | 076 (refresh)  
**Triage Issue**: APGI-cmy/maturion-isms#707
