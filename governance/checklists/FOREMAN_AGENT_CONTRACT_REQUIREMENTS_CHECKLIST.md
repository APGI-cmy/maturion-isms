# Foreman Agent Contract Requirements Checklist (ForemanApp-agent.md)

**Status**: Reference checklist for contract drafting  
**Purpose**: One-stop "definition of done" for a compliant Foreman agent contract in this repo.  
**Primary Sources**: `governance/canon/FM_ROLE_CANON.md`, `governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md`, `governance/canon/*` (see citations per item).  
**Derived From**: office-app PR #730 gold standard checklist structure

---

## Category 0 — Identity & Canonical Bindings
- [ ] **Frontmatter matches baseline**: `agent.id=foreman` or `ForemanApp`, `agent.class=foreman`, `role` references FM orchestration authority; `governance.protocol=LIVING_AGENT_SYSTEM`, Tier-0 manifest loaded (`governance/TIER_0_CANON_MANIFEST.json`).
- [ ] **Mandatory bindings declared**: Tier-0 canon manifest + Build Philosophy, `AGENT_FILE_BINDING_REQUIREMENTS.md` Tier-0 + application bindings (ripple model, agent recruitment, FM authority, execution bootstrap, agent test execution) (`governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md`).
- [ ] **Canonical references are links, not inline copies**; locked-section protection honored (`governance/canon/AGENT_CONTRACT_PROTECTION_PROTOCOL.md`, `AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md`).

## Category 1 — Authority, Scope & Boundaries
- [ ] **Sovereign orchestration authority recorded** (build planning, sequencing, QA governance, merge authority) and GitHub action limitation noted as tooling constraint only (`governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`, `PLATFORM_AUTHORITY_BOUNDARY_AND_DELEGATION_MODEL.md`).
- [ ] **Explicit prohibitions**: FM does **not** implement code, run GitHub platform actions directly, or use stepwise human approvals (`governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`).
- [ ] **Authority chain** captured: CS2 → FM → Builders; human supremacy override and bootstrap proxy semantics preserved (`governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`).

## Category 2 — Governance Loading & Self-Alignment
- [ ] **Load order**: Tier-0 canon, Build Philosophy, FM role canon, FM memory protocol before any decision (`governance/TIER_0_CANON_MANIFEST.json`, `governance/canon/FOREMAN_MEMORY_PROTOCOL.md`).
- [ ] **Context sync**: Canonical context synchronization + governance versioning/sync rules enforced (`governance/canon/AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md`, `GOVERNANCE_VERSIONING_AND_SYNC_PROTOCOL.md`).
- [ ] **Self-alignment rule**: FM must halt if canon hashes incomplete; cannot weaken bindings; use `GOVERNANCE_LAYERDOWN_CONTRACT.md` and `GOVERNANCE_COMPLETENESS_MODEL.md` for alignment checks.

## Category 3 — Memory, Evidence & Audit
- [ ] **Memory hierarchy**: Constitutional → Wave → Session → Learning memory levels loaded and immutable (`governance/canon/FOREMAN_MEMORY_PROTOCOL.md`, `MEMORY_LIFECYCLE_STATE_MACHINE_CONTRACT.md`, `MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md`).
- [ ] **Evidence discipline**: Execution Bootstrap Protocol required for any executable artifact; PREHANDOVER proof + exit codes; CI is confirmatory not diagnostic (`governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md`, `CI_CONFIRMATORY_NOT_DIAGNOSTIC.md`, `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md`).
- [ ] **Learning/failure promotion**: Learning and failure promotion rules applied; audit readiness maintained (`governance/canon/LEARNING_PROMOTION_RULE.md`, `FAILURE_PROMOTION_RULE.md`, `AUDIT_READINESS_MODEL.md`).

## Category 4 — Ripple, Merge Gates & Alignment
- [ ] **Ripple mindset**: Assume non-local impact; surface ripples explicitly (`governance/canon/AGENT_RIPPLE_AWARENESS_OBLIGATION.md`, `GOVERNANCE_RIPPLE_MODEL.md`, `RIPPLE_INTELLIGENCE_LAYER.md`, `CROSS_REPOSITORY_RIPPLE_AWARENESS_MODEL.md`).
- [ ] **Ripple operations**: Follow governance ripple checklist and detection protocols when canon changes occur; respect cross-repo transport rules (`governance/canon/GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md`, `GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md`, `CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md`).
- [ ] **Merge/PR gates**: Apply merge-gate philosophy + FM merge-gate management canon; gate applicability matrix observed; predictive compliance + branch protection bindings honored (`governance/canon/MERGE_GATE_PHILOSOPHY.md`, `governance/canon/FM_MERGE_GATE_MANAGEMENT_CANON.md`, `MERGE_GATE_APPLICABILITY_MATRIX.md`, `PR_GATE_PRECONDITION_RULE.md`, `BRANCH_PROTECTION_ENFORCEMENT.md`, `GATE_PREDICTIVE_COMPLIANCE_ANALYSIS.md`).

## Category 5 — Escalation & Stop Conditions
- [ ] **Stop-and-Fix** doctrine enforced for warnings/test debt; zero-test-debt constitutional rule present (`governance/canon/STOP_AND_FIX_DOCTRINE.md`, `governance/policies/zero-test-debt-constitutional-rule.md`).
- [ ] **Hard stops**: Architecture not frozen, QA-to-Red missing, governance ambiguity, or canon drift → halt and escalate to CS2 (Build Philosophy + `governance/canon/AGENT_CONSTITUTION.md` Sections II–IV).
- [ ] **Escalation path**: Record context, cite canon, propose options, await decision; respects `governance/canon/CASCADING_FAILURE_CIRCUIT_BREAKER.md` and `WARNING_DISCOVERY_BLOCKER_PROTOCOL.md`.

## Category 6 — Role-Specific Deliverables & Outputs
- [ ] **Outputs enumerated**: Requirement specs, architecture compilation, QA gate definitions, wave/issue artifacts, governance evidence bundle; aligns with FM POLC model (`governance/canon/FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md`, `BUILD_EFFECTIVENESS_STANDARD.md`).
- [ ] **Wave closure**: IBWR + wave closure certification bindings referenced (`governance/canon/IN_BETWEEN_WAVE_RECONCILIATION.md`, `MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md`).
- [ ] **Traceability**: Scope-to-diff and scope declaration schema applied; decisions/audit trail kept (`governance/canon/SCOPE_TO_DIFF_RULE.md`, `SCOPE_DECLARATION_SCHEMA.md`, `COMMISSIONING_EVIDENCE_MODEL.md`).

## Category 7 — Prohibitions & Guardrails
- [ ] **No contract self-modification outside protocol**; changes require CS2/governance approval (`governance/canon/AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md`, `CS2_AGENT_FILE_AUTHORITY_MODEL.md`).
- [ ] **No boundary violations**: FM must not perform builder tasks or governance-liaison duties; respects agent QA boundaries (`governance/canon/AGENT_SCOPED_QA_BOUNDARIES.md`).
- [ ] **No scope drift**: Follow domain ownership/accountability and platform boundary rules (`governance/canon/DOMAIN_OWNERSHIP_ACCOUNTABILITY.md`, `PLATFORM_AUTHORITY_BOUNDARY_AND_DELEGATION_MODEL.md`).

---

**Usage**: Treat every unchecked item as a blocker for `ForemanApp-agent.md` readiness. Cite the listed source in the contract section that satisfies the item. If a required source is unavailable or hash-mismatched, halt and escalate per Category 5.

---

**Alignment Notes**:
- Adapted from office-app PR #730 gold standard checklist
- All canonical references updated to match maturion-isms governance structure
- Maintains comprehensive category-based organization (Categories 0-7)
- Every checklist item includes explicit canonical source citations
- Consumer repository context: Governance canon flows from APGI-cmy/maturion-foreman-governance

**Version**: 1.0.0  
**Date**: 2026-02-11  
**Authority**: office-app PR #730, LIVING_AGENT_SYSTEM.md v6.2.0
