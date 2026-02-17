# Builder Agent Contract Requirements Checklist

**Status**: Reference checklist for contract drafting  
**Purpose**: One-stop "definition of done" for a compliant Builder agent contract in this repo.  
**Primary Sources**: `governance/canon/BUILDER_CONTRACT_BINDING_CHECKLIST.md`, `governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md`, `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md`, `governance/canon/*`  
**Derived From**: FOREMAN_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md v1.1.0, LIVING_AGENT_SYSTEM.md v6.2.0

---

## Category 0 — Identity & Canonical Bindings (Four-Phase: Preflight)
- [ ] **Frontmatter matches baseline**: `agent.id=<builder-id>`, `agent.class=builder`, `agent.version=6.2.0`, `governance.protocol=LIVING_AGENT_SYSTEM`, Canon Inventory loaded (`governance/CANON_INVENTORY.json`).
- [ ] **Consumer mode YAML**: `scope.repository=APGI-cmy/maturion-isms`, `scope.type=consumer-repository`, `metadata.canonical_home=APGI-cmy/maturion-foreman-governance`, `metadata.this_copy=consumer`.
- [ ] **Core mandatory bindings**: Canon Inventory manifest (`governance/CANON_INVENTORY.json`) + Build Philosophy (`BUILD_PHILOSOPHY.md`) + FULLY_FUNCTIONAL_DELIVERY_STANDARD.md (wave gates).
- [ ] **Builder-specific bindings declared**: `AGENT_FILE_BINDING_REQUIREMENTS.md` Universal Mandatory Bindings + builder bindings (build philosophy, zero test debt, design freeze, execution bootstrap, test removal governance, warning handling).
- [ ] **Canonical references are links, not inline copies**; locked-section protection honored (`governance/canon/AGENT_CONTRACT_PROTECTION_PROTOCOL.md`, `AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md`).
- [ ] **Four-Phase contract pattern**: `metadata.contract_pattern=four_phase_canonical` declared in frontmatter.

## Category 1 — Authority, Scope & Boundaries (Four-Phase: Preflight)
- [ ] **Builder authority recorded**: Implement code to satisfy Red QA, achieve 100% GREEN, generate implementation evidence, escalate blockers to Foreman (`governance/canon/BUILDER_AUTHORITY_MODEL.md`).
- [ ] **Explicit prohibitions**: Builder does **not** skip/disable failing tests, merge with <100% GREEN, leave TODO stubs, bypass Foreman supervision, modify own contract, approve PRs, modify governance/ directory (`governance/canon/BUILDER_AUTHORITY_MODEL.md`, `governance/canon/AGENT_PREFLIGHT_PATTERN.md`).
- [ ] **Authority chain** captured: CS2 → Foreman → Builder; builder operates under Foreman supervision, cannot self-approve work (`governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`).
- [ ] **Critical Invariant** declared: **BUILDER NEVER BYPASSES QA GATES OR CREATES TEST DEBT** (bold caps in contract).
- [ ] **Scope boundaries**: Read access (foreman/**, architecture/**, governance/**), Write access (specific implementation paths), Escalation required (.github/agents/**, .github/workflows/**, BUILD_PHILOSOPHY.md, governance/canon/**).

## Category 2 — Governance Loading & Self-Alignment (Four-Phase: Induction)
- [ ] **Wake-up protocol**: Reference to `.github/scripts/wake-up-protocol.sh <builder-id>` for session initialization (`governance/canon/AGENT_INDUCTION_PROTOCOL.md`).
- [ ] **Load order**: Canon Inventory, Build Philosophy, builder spec, builder memory protocol before any decision (`governance/TIER_0_CANON_MANIFEST.json`).
- [ ] **Context sync**: Canonical context synchronization + governance versioning/sync rules enforced (`governance/canon/AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md`, `GOVERNANCE_VERSIONING_AND_SYNC_PROTOCOL.md`).
- [ ] **Self-alignment rule**: Builder must halt if canon hashes incomplete; cannot weaken bindings; use `GOVERNANCE_LAYERDOWN_CONTRACT.md` and `GOVERNANCE_COMPLETENESS_MODEL.md` for alignment checks.
- [ ] **Degraded mode semantics**: `degraded_on_placeholder_hashes: true` in frontmatter; halt and escalate if CANON_INVENTORY contains placeholder/truncated hashes in PUBLIC_API artifacts.

## Category 3 — Memory, Evidence & Audit (Four-Phase: Handover)
- [ ] **Session memory protocol**: Template reference for creating session memory files in `.agent-workspace/<builder-id>/memory/session-NNN-YYYYMMDD.md` (`governance/canon/AGENT_HANDOVER_AUTOMATION.md`).
- [ ] **Memory rotation**: When >5 sessions exist, move oldest to `.archive/` subdirectory; keep only 5 most recent sessions in `memory/`.
- [ ] **Evidence discipline**: Execution Bootstrap Protocol required for any executable artifact; PREHANDOVER proof + exit codes; CI is confirmatory not diagnostic (`governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md`, `CI_CONFIRMATORY_NOT_DIAGNOSTIC.md`, `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md`).
- [ ] **Learning/failure promotion**: Learning and failure promotion rules applied; audit readiness maintained (`governance/canon/LEARNING_PROMOTION_RULE.md`, `FAILURE_PROMOTION_RULE.md`, `AUDIT_READINESS_MODEL.md`).
- [ ] **Evidence artifacts**: Modified files list with SHA256 checksums, actions taken, decisions made, outcome status (COMPLETE/PARTIAL/ESCALATED).

## Category 4 — Ripple, Merge Gates & Alignment (Four-Phase: Induction)
- [ ] **Ripple mindset**: Assume non-local impact; surface ripples explicitly (`governance/canon/AGENT_RIPPLE_AWARENESS_OBLIGATION.md`, `GOVERNANCE_RIPPLE_MODEL.md`, `RIPPLE_INTELLIGENCE_LAYER.md`).
- [ ] **Consumer-mode ripple**: Receive-only ripple events from canonical source; cannot dispatch ripple events; escalate governance changes to canonical source (`governance/canon/GOVERNANCE_RIPPLE_MODEL.md`).
- [ ] **Merge/PR gates**: Apply merge-gate philosophy + builder merge-gate responsibilities; gate applicability matrix observed; branch protection bindings honored (`governance/canon/MERGE_GATE_PHILOSOPHY.md`, `MERGE_GATE_APPLICABILITY_MATRIX.md`, `BRANCH_PROTECTION_ENFORCEMENT.md`).
- [ ] **Merge Gate Interface**: Required checks listed: `Merge Gate Interface / merge-gate/verdict`, `Merge Gate Interface / governance/alignment`, `Merge Gate Interface / stop-and-fix/enforcement`.

## Category 5 — Escalation & Stop Conditions (Four-Phase: Preflight)
- [ ] **Stop-and-Fix** doctrine enforced for warnings/test debt; zero-test-debt constitutional rule present (`governance/canon/STOP_AND_FIX_DOCTRINE.md`, `governance/policies/zero-test-debt-constitutional-rule.md`).
- [ ] **Hard stops**: Architecture not frozen, QA-to-Red missing, governance ambiguity, canon drift, <100% GREEN → halt and escalate to Foreman (Build Philosophy + `governance/canon/AGENT_CONSTITUTION.md`).
- [ ] **Escalation path**: Record context, cite canon, propose options, await decision; respects `governance/canon/CASCADING_FAILURE_CIRCUIT_BREAKER.md` and `WARNING_DISCOVERY_BLOCKER_PROTOCOL.md`.
- [ ] **Escalation authority**: Escalate to Foreman (not CS2 directly); Foreman escalates to CS2 when needed.

## Category 6 — Role-Specific Deliverables & Outputs (Four-Phase: Build)
- [ ] **Build Philosophy compliance**: Architecture → QA-to-Red → Build-to-Green → Validation sequence enforced; no code before frozen architecture (`BUILD_PHILOSOPHY.md`).
- [ ] **QA-to-Red adherence**: Derive requirements from Red QA; implement to 100% GREEN; no skipping/disabling tests; test debt = escalation (`BUILD_PHILOSOPHY.md`, `governance/policies/zero-test-debt-constitutional-rule.md`).
- [ ] **Implementation boundaries**: Implement code within builder-specific scope (UI → components/pages/styles, API → api/**, Schema → database/migrations, QA → tests/**, Integration → integration endpoints).
- [ ] **Forbidden actions**: No backend logic in UI builder, no frontend logic in API builder, no cross-module logic, no database schema in non-schema builders, no bypassing TanStack Query in UI builder.
- [ ] **Wave compliance**: Comply with wave start/close merge gates; derive requirements from Foreman wave planning; bounded scope per wave (`governance/canon/FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md`).
- [ ] **PREHANDOVER evidence**: Issue PREHANDOVER_PROOF before wave completion; include implementation evidence, test results, coverage data, checklist compliance.

## Category 7 — Prohibitions & Guardrails (Four-Phase: Preflight)
- [ ] **LOCKED: Self-modification prohibition**: Builder may NEVER modify own contract file; include LOCKED section with Lock ID, Authority (CS2), Review frequency, Modification Authority (CS2 only), References (`governance/canon/AGENT_CONTRACT_PROTECTION_PROTOCOL.md` v1.1.0).
- [ ] **No contract self-modification outside protocol**; changes require CS2/governance approval and Foreman supervision (`governance/canon/AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md`, `CS2_AGENT_FILE_AUTHORITY_MODEL.md`).
- [ ] **No boundary violations**: Builder must not perform Foreman tasks (planning, approvals, governance decisions), governance-liaison duties, or QA oversight; respects agent QA boundaries (`governance/canon/AGENT_SCOPED_QA_BOUNDARIES.md`).
- [ ] **No scope drift**: Follow domain ownership/accountability and platform boundary rules; escalate scope expansion requests to Foreman (`governance/canon/DOMAIN_OWNERSHIP_ACCOUNTABILITY.md`, `PLATFORM_AUTHORITY_BOUNDARY_AND_DELEGATION_MODEL.md`).
- [ ] **Consumer-specific prohibitions**: No modification of `governance/` directory (receive-only via layer-down), no bypassing governance alignment gate, no creating governance canon, no dispatching ripple events.

## Category 8 — File Size & Format Compliance
- [ ] **Character limit**: Contract file <30,000 characters (GitHub UI selectability requirement, ref: PartPulse PR #265).
- [ ] **Compact formatting**: Use references to canonical documentation instead of duplication; link to workflows/scripts rather than embedding; prioritize critical content.
- [ ] **9 mandatory components**: YAML frontmatter, Mission (Phase 1: Preflight), Wake-up protocol (Phase 2: Induction), Build script (Phase 3: Build), Handover protocol (Phase 4: Handover), Merge gate expectations, Governance sync protocol, Consumer-specific prohibitions, Canonical references.
- [ ] **56 requirement mappings**: All REQ-CM-001 through REQ-AG-004 requirements mapped with canonical references (can be summary with link to full mapping in canonical source).
- [ ] **5 validation hooks**: VH-001 through VH-005 validation hooks included (can be summary with link to full validation in canonical source).

---

**Usage**: Treat every unchecked item as a blocker for builder contract readiness. Cite the listed source in the contract section that satisfies the item. If a required source is unavailable or hash-mismatched, halt and escalate per Category 5.

---

**Alignment Notes**:
- Derived from FOREMAN_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md v1.1.0
- Adapted for Builder agent class (specialized implementation role)
- All canonical references updated to match maturion-isms governance structure
- Maintains comprehensive category-based organization (Categories 0-8)
- Every checklist item includes explicit canonical source citations
- Consumer repository context: Governance canon flows from APGI-cmy/maturion-foreman-governance
- Four-Phase Canonical architecture integration (Preflight → Induction → Build → Handover)
- Enforces Builder-specific constraints (no approvals, no self-modification, Foreman supervision, QA gates)

**Version**: 1.0.0  
**Date**: 2026-02-17  
**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0, AGENT_CONTRACT_ARCHITECTURE.md v1.0.0, BUILDER_CONTRACT_BINDING_CHECKLIST.md v1.2.0, FOREMAN_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md v1.1.0
