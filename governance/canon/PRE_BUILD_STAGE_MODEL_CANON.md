# PRE_BUILD_STAGE_MODEL_CANON

## Status
**Type**: Canonical Governance Definition  
**Version**: 1.0.0  
**Authority**: CS2 (Johan Ras / Maturion)  
**Effective Date**: 2026-04-05  
**Owner**: Maturion Engineering Leadership  
**Applies To**: All modules — MAT, ROADMAP, PIT, AIMC, RADAM, and any future Maturion delivery modules  
**Precedence**: Subordinate only to GOVERNANCE_PURPOSE_AND_SCOPE.md  
**Issue Reference**: APGI-cmy/maturion-foreman-governance#1319

---

## 1. Purpose

This canon formalises the **End-to-End Pre-Build Stage Model** as mandatory governance for all future governed builds operating under the 100% one-time build philosophy.

The model defines the complete canonical pre-build sequence that must be executed and gate-passed before any implementation (build) work begins. It closes recurring classes of build failure observed during MAT and related governed builds — especially cases where a build was document-complete, test-complete, or CI-green, but still not fully functional as a real, verifiable delivered product.

The governing sequence is:

> **App Description → UX Workflow & Wiring Spec → FRS → TRS → Architecture → QA-to-Red → PBFAG → Implementation Plan → Builder Checklist → IAA Pre-Brief → Builder Appointment → Build**

---

## 2. Constitutional Mandate

This canon derives authority from and complements:

- **GOVERNANCE_PURPOSE_AND_SCOPE.md** — Governance as canonical memory and delivery guardrail
- **BUILD_PHILOSOPHY.md** — One-Time Build Law; build once, build right
- **FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** — Foreman POLC authority over planning and checking
- **PRE_BUILD_REALITY_CHECK_CANON.md** — Mandatory reality check gate before build
- **IAA_PRE_BRIEF_PROTOCOL.md** — IAA pre-build briefing ceremony
- **FM_PREAUTH_CHECKLIST_CANON.md** — FM pre-authorization checklist
- **ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md** — Architecture readiness gate
- **GOVERNANCE_RIPPLE_MODEL.md** — Layer-down obligation when canon is created or updated

---

## 3. Problem Statement

The current build governance model is strong, but learning from MAT and related governed builds shows that key pre-build controls were still implicit, inconsistently enforced, or added reactively only after failure.

### 3.1 Recurring Failure Patterns

The following failure patterns are directly addressed by this canon:

| Pattern | Root Cause | Stage That Closes It |
|---------|-----------|---------------------|
| User workflows not fully specified early enough | No mandated UX Workflow stage | Stage 2 — UX Workflow & Wiring Spec |
| UI/API/schema/reporting wiring gaps surface after build | No end-to-end wiring spec | Stage 2 — UX Workflow & Wiring Spec |
| Upstream requirement changes not propagated into QA, implementation plan, and builder scope | No Change-Propagation Audit control | §7.1 — Change-Propagation Audit |
| Builder readiness and role-fit checks happen too late | No distinct Builder Checklist stage | Stage 9 — Builder Checklist |
| CI-green or passing tests masking runtime and deployment failures | No Runtime/Deployment Contract | §7.2 — Runtime/Deployment Contract |
| Delivery treated as "implemented" before product owner can verify | No Golden Path Verification Pack | §7.3 — Golden Path Verification Pack |
| PBFAG treated as situational review rather than hard gate | PBFAG was implicit and optional | Stage 7 — PBFAG (explicit hard gate) |
| IAA Pre-Brief skipped or informal | IAA Pre-Brief not a distinct stage | Stage 10 — IAA Pre-Brief |

### 3.2 Governing Philosophy

These failures are especially serious under the **100% one-time build philosophy**, where:
- The product owner cannot review code
- The product owner can only verify the final working product
- There is no rework budget after delivery

This model operationalises the principle: **architecture first, RED before implementation, build to green only, 100% completion — not approximate completion**.

---

## 4. Scope and Applicability

### 4.1 When This Model Applies

The Pre-Build Stage Model is **MANDATORY** for:

- Every major version or delivery milestone of any Maturion module (MAT, ROADMAP, PIT, AIMC, RADAM, or successor modules)
- Any new module introduced into the Maturion ecosystem
- Any re-architecture or scope-expanding revision of an existing module
- Any module operating under the 100% one-time build philosophy

### 4.2 When This Model Applies in Part

User-facing builds must complete all 12 stages including Stage 2 (UX Workflow & Wiring Spec). Non-user-facing builds (pure API, background services, infrastructure modules) may substitute a **Wiring Spec Only** variant of Stage 2, but may not omit Stage 2 entirely.

---

## 5. The Canonical Pre-Build Stage Sequence

The following 12 stages form the mandatory governed pre-build lifecycle. No stage may be skipped. Stage order must be respected except where explicit exceptions are documented and CS2-approved.

---

### Stage 1 — App Description

**Purpose**: Define the app/module purpose, business logic, user value, major capabilities, scope boundaries, and strategic intent.

**Mandatory Content**:
- App/module purpose statement
- Business logic summary
- User value proposition
- Major capabilities enumeration
- Scope boundary definition (in-scope and explicitly out-of-scope)
- Strategic intent and alignment to Maturion platform
- PBFAG checklist requirements (§AD-08)
- All §AD-01–§AD-24 sections as required by APP_DESCRIPTION_REQUIREMENT_POLICY.md v2.0

**Gate Condition**: CS2-approved App Description artifact filed.

**Authority Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0

---

### Stage 2 — UX Workflow & Wiring Spec

**Purpose**: Define the real user journeys, screen-level interactions, trigger points, data movement, state transitions, AI action points, report flows, dashboard behaviour, and end-to-end user-visible workflow logic.

**Mandatory for**: All user-facing builds. Non-user-facing builds require a Wiring Spec Only variant.

**Mandatory Content**:
- Complete user journey maps (all primary and secondary paths)
- Screen-level interaction definitions
- Trigger point catalogue (user actions, system events, time-based)
- Data movement flows (input → processing → output → storage)
- State transition diagrams or descriptions
- AI action integration points (where AI agents act on behalf of user)
- Report and dashboard flow definitions
- End-to-end workflow coverage matrix
- Explicit wiring between UI elements, API endpoints, schema tables, and reporting outputs

**Gate Condition**: UX Workflow & Wiring Spec approved by Foreman and client/user representative. No gap between stated user journeys and wired system behaviour is permitted.

**Enforcement Note**: This stage is **MANDATORY** for user-facing builds and is **NOT OPTIONAL**. Skipping or abbreviating this stage is a governance violation.

---

### Stage 3 — Functional Requirements Specification (FRS)

**Purpose**: Convert the approved App Description and UX Workflow & Wiring Spec into explicit, traceable functional requirements.

**Mandatory Content**:
- One FRS per major functional capability or module boundary
- Full traceability to §AD-01–§AD-24 per APP_DESCRIPTION_REQUIREMENT_POLICY.md
- No TBD or placeholder requirements
- Coverage of all user journeys defined in Stage 2
- FR-to-§AD Coverage Matrix

**Gate Condition**: FRS approved by Foreman; 100% §AD traceability confirmed; no open TBD items.

**Authority Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0, `governance/templates/FRS_TEMPLATE.md`

---

### Stage 4 — Technical Requirements Specification (TRS)

**Purpose**: Translate functional requirements into technical rules, interfaces, constraints, system responsibilities, and implementation obligations.

**Mandatory Content**:
- Technical translation of all FRS requirements
- API interface contracts (endpoints, payloads, auth, error codes)
- Schema definitions and data type constraints
- System responsibility boundaries
- Integration and dependency specifications
- Performance, security, and non-functional constraints
- §AD-03, §AD-10, §AD-11, §AD-12, §AD-15, §AD-17, §AD-20, §AD-22, §AD-24 coverage

**Gate Condition**: TRS approved by Foreman; all FRS requirements mapped to TRS items; no open technical unknowns without explicit investigation spikes planned.

**Authority Reference**: `governance/templates/TRS_TEMPLATE.md`

---

### Stage 5 — Architecture

**Purpose**: Define the system structure, data architecture, module boundaries, integration paths, deployment logic, runtime responsibilities, and governing implementation shape.

**Mandatory Content**:
- System structure diagram
- Data architecture (entity model, schema, storage decisions)
- Module and component boundaries
- Integration paths and external dependency map
- Deployment logic and target environment definition
- Runtime responsibility assignments
- All §AD-10–§AD-16, §AD-20–§AD-22 coverage checkboxes satisfied
- Architecture completeness checklist per ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md

**Gate Condition**: Architecture approved by Foreman; all TRS requirements traceable to architecture components; ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md checklist PASS.

**Authority Reference**: `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md`, `governance/templates/minimum-architecture-template.md`

---

### Stage 6 — QA-to-Red

**Purpose**: Build the authoritative RED test suite from the approved upstream artifacts (Stages 1–5). No implementation may begin before RED QA exists and is approved.

**Mandatory Content**:
- Full RED test suite derived from FRS + TRS + Architecture
- Test coverage of all user journeys from Stage 2
- Test coverage of all functional requirements from Stage 3
- Test coverage of all technical constraints from Stage 4
- Integration test coverage of all architecture boundaries from Stage 5
- Zero implementation-dependent tests (tests must be written against requirements, not implementation assumptions)
- QA Catalog alignment confirmed

**Gate Condition**: RED QA suite signed off by Foreman; QA Catalog alignment PASS; coverage matrix complete; no implementation has started.

**Enforcement Note**: The RED QA suite **must exist and be approved** before any implementation work begins. This is an absolute constraint.

**Authority Reference**: `FM_PREAUTH_CHECKLIST_CANON.md`, `QA_CATALOG_ALIGNMENT_GATE_CANON.md`

---

### Stage 7 — PBFAG (Pre-Build Functionality Assessment Gate)

**Purpose**: Mandatory Pre-Build Final Architecture Gate to verify that all upstream artifacts are complete, aligned, wire-ready, test-covered, dependency-safe, and genuinely implementation-ready.

**PBFAG is a HARD PRE-BUILD GATE — not a situational review step.**

**Mandatory Checks**:
- [ ] App Description approved and §AD-01–§AD-24 complete
- [ ] UX Workflow & Wiring Spec approved; all journeys wired
- [ ] FRS approved; no TBD; 100% §AD traceability
- [ ] TRS approved; all FRS mapped; no open technical unknowns
- [ ] Architecture approved; all TRS traceable; completeness checklist PASS
- [ ] RED QA suite signed off; coverage matrix complete
- [ ] Change-Propagation Audit complete (see §7.1)
- [ ] Runtime/Deployment Contract filed (see §7.2)
- [ ] Golden Path Verification Pack defined (see §7.3)
- [ ] All external dependencies confirmed available
- [ ] No build-blocking unknowns remain open

**Gate Condition**: All PBFAG checks PASS. Any FAIL blocks build. CS2 escalation required for any check that cannot be resolved.

**Enforcement Note**: This gate is **MANDATORY** and **CANNOT BE BYPASSED**. No builder may be appointed until PBFAG has formally PASSED.

**Authority Reference**: `APP_DESCRIPTION_REQUIREMENT_POLICY.md` §AD-08, `PRE_BUILD_REALITY_CHECK_CANON.md`

---

### Stage 8 — Implementation Plan

**Purpose**: Break the approved build into governed delivery waves with explicit scope, order, dependencies, and handover logic.

**Mandatory Content**:
- Delivery wave breakdown with explicit scope per wave
- Wave sequencing with dependency declarations
- Handover logic between waves
- Builder assignment per wave (indicative, pending Stage 9)
- Rollback and recovery plan per wave
- Full traceability from implementation waves to FRS/TRS/Architecture items
- No placeholder waves or "TBD scope" entries

**Gate Condition**: Implementation Plan approved by Foreman; all waves have explicit scope; no open TBD scope items.

---

### Stage 9 — Builder Checklist

**Purpose**: Verify builder-role fitness, scope alignment, protocol compliance, dependency readiness, and execution eligibility before builder appointment.

**This is a DISTINCT GOVERNANCE STAGE — not buried implicitly inside architecture or implementation planning.**

**Mandatory Checks (per builder candidate)**:
- [ ] Builder agent contract exists and is current
- [ ] Builder has read and acknowledged all relevant canon files for this build
- [ ] Builder has confirmed scope understanding (wave-by-wave)
- [ ] Builder has confirmed RED QA suite understanding
- [ ] Builder has confirmed architecture understanding
- [ ] Builder confirms no unresolved dependency blockers
- [ ] Builder confirms protocol compliance (STOP-AND-FIX, evidence requirements, merge gate)
- [ ] Foreman confirms role-fit for this specific build context

**Gate Condition**: Builder Checklist PASS for every appointed builder. Any FAIL blocks appointment.

**Authority Reference**: `BUILDER_CONTRACT_BINDING_CHECKLIST.md`, `FM_BUILDER_APPOINTMENT_PROTOCOL.md`

---

### Stage 10 — IAA Pre-Brief

**Purpose**: Require formal IAA-controlled pre-build briefing to ensure all QA, architecture, gate obligations, and governance expectations are fully acknowledged before delegation.

**This is a MANDATORY ENFORCEMENT AND READINESS STAGE before builder appointment.**

**Mandatory Actions**:
- Foreman invokes IAA agent with full pre-brief context (wave task list, scope declaration, PBFAG result, RED QA reference)
- IAA generates Pre-Brief artifact declaring acceptance criteria per task
- Foreman and builders receive and acknowledge the Pre-Brief
- IAA Pre-Brief artifact filed in designated location
- ASSURANCE-TOKEN or PHASE_A_ADVISORY recorded before proceeding

**Gate Condition**: IAA Pre-Brief artifact exists and is acknowledged by Foreman and all designated builders. ASSURANCE-TOKEN or PHASE_A_ADVISORY status recorded.

**Enforcement Note**: Skipping IAA Pre-Brief invocation is a constitutional violation (INC-IAA-SKIP-001) per FAIL-ONLY-ONCE Rule A-09.

**Authority Reference**: `IAA_PRE_BRIEF_PROTOCOL.md` v1.2.0

---

### Stage 11 — Builder Appointment

**Purpose**: Appoint approved builders only after all prior gates pass.

**Mandatory Conditions**:
- All Stages 1–10 complete and gate-passed
- Builder Checklist PASS for all appointed builders (Stage 9)
- IAA Pre-Brief acknowledged by all appointed builders (Stage 10)
- Formal appointment issued by Foreman
- Appointment recorded in module tracker

**Gate Condition**: Formal Foreman appointment issued; recorded in tracker.

**Authority Reference**: `FM_BUILDER_APPOINTMENT_PROTOCOL.md`, `FM_PREAUTH_CHECKLIST_CANON.md`

---

### Stage 12 — Build

**Purpose**: Build-to-Green execution begins only after the full pre-build chain is complete and governance-valid.

**Entry Conditions**:
- All Stages 1–11 complete and gate-passed
- Builder appointed (Stage 11)
- Implementation waves executing per Implementation Plan (Stage 8)
- Build-to-Green target: GREEN QA suite at end of each wave

**Build Constraints**:
- Builders may not deviate from the approved Implementation Plan scope without FM approval
- Any scope change triggers mandatory Change-Propagation Audit (§7.1)
- STOP-AND-FIX doctrine applies; no build may proceed past a failing gate
- All merge gates must pass before wave closure certification

**Authority Reference**: `BUILD_PHILOSOPHY.md`, `WAVE_MODEL.md`, `STOP_AND_FIX_DOCTRINE.md`

---

## 6. Stage Summary Table

| # | Stage | Hard Gate? | Mandatory For | Blocks Stage |
|---|-------|-----------|---------------|-------------|
| 1 | App Description | YES | All builds | 2 |
| 2 | UX Workflow & Wiring Spec | YES | User-facing builds; Wiring Spec Only for others | 3 |
| 3 | FRS | YES | All builds | 4 |
| 4 | TRS | YES | All builds | 5 |
| 5 | Architecture | YES | All builds | 6 |
| 6 | QA-to-Red | YES | All builds | 7 |
| 7 | PBFAG | YES | All builds | 8 |
| 8 | Implementation Plan | YES | All builds | 9 |
| 9 | Builder Checklist | YES | All builds | 10 |
| 10 | IAA Pre-Brief | YES | All builds | 11 |
| 11 | Builder Appointment | YES | All builds | 12 |
| 12 | Build | N/A | All builds | — |

---

## 7. Mandatory Supporting Controls

The following three supporting controls are **required** and must be completed as part of the pre-build sequence. They are integrated into PBFAG (Stage 7) as explicit gate checks.

### 7.1 Change-Propagation Audit

**Trigger**: Any new or changed item in App Description, UX Workflow & Wiring Spec, FRS, TRS, or Architecture.

**Requirement**: The change must be reconciled across **all** of the following before build continues:

- [ ] QA-to-Red suite (Stage 6)
- [ ] PBFAG checklist (Stage 7)
- [ ] Implementation Plan (Stage 8)
- [ ] Build tracker
- [ ] Builder scope declaration
- [ ] IAA governance flow (Stage 10)

**Enforcement**: If any upstream change is not propagated to all downstream artifacts listed above, build is **BLOCKED** until propagation is complete and re-verified.

**Evidence Required**: Change-Propagation Audit log entry for each change event, filed in the module's build-readiness folder.

---

### 7.2 Runtime / Deployment Contract

**Trigger**: Before any build wave begins.

**Requirement**: The module must explicitly define:

- [ ] Deployment target (environment, infrastructure, hosting)
- [ ] Environment variables and secrets (names, expected sources, not values)
- [ ] Authentication assumptions (provider, token model, session handling)
- [ ] Schema/table/function prerequisites (what must pre-exist in the database)
- [ ] External dependency assumptions (third-party services, APIs, SDKs)
- [ ] Health and runtime verification expectations (liveness, readiness, smoke tests)
- [ ] Seeded user/role conditions where needed (test users, roles, permissions required)

**Evidence Required**: Runtime/Deployment Contract document filed in the module's build-readiness folder before first build wave begins.

**Enforcement**: Absence of a filed Runtime/Deployment Contract is a PBFAG FAIL condition.

---

### 7.3 Golden Path Verification Pack

**Trigger**: Before any build wave begins.

**Requirement**: The product must define the specific user-visible journeys that will later prove the build is correct end-to-end. This is essential because the product owner validates quality via the final product, not by reviewing code.

**Mandatory Content**:
- Named golden paths (e.g., "GP-01: New user registers, completes onboarding, creates first record")
- Step-by-step description of each golden path from the product owner's perspective
- Expected observable outcome at each step
- Pass/fail criteria for each golden path
- Mapping from each golden path to the QA-to-Red test scenarios that cover it

**Evidence Required**: Golden Path Verification Pack document filed in the module's build-readiness folder before first build wave begins.

**Enforcement**: Absence of a Golden Path Verification Pack is a PBFAG FAIL condition.

---

## 8. Canonization Mandates

This canon establishes the following as **binding governance mandates**:

1. **UX Workflow & Wiring Spec** is mandatory for all user-facing builds and is **not optional**
2. **PBFAG** is a hard pre-build gate and is **not a situational review step**
3. **Builder Checklist** is a distinct governance stage and is **not buried implicitly** inside architecture or implementation planning
4. **IAA Pre-Brief** is a mandatory enforcement and readiness stage before builder appointment
5. **Change-Propagation Audit** is a required supporting control; any upstream change not propagated blocks build
6. **Runtime/Deployment Contract** must be filed before the first build wave begins
7. **Golden Path Verification Pack** must be defined before the first build wave begins
8. **No build may start** if real user-verifiable functional delivery has not already been defined in advance

---

## 9. Prohibitions

- **❌ NEVER** begin any build wave before all 12 stages are complete and gate-passed
- **❌ NEVER** omit Stage 2 (UX Workflow & Wiring Spec) for user-facing builds
- **❌ NEVER** treat PBFAG as optional or situational
- **❌ NEVER** appoint a builder without a passed Builder Checklist (Stage 9)
- **❌ NEVER** appoint a builder without IAA Pre-Brief (Stage 10)
- **❌ NEVER** allow an upstream change to propagate into build without a Change-Propagation Audit
- **❌ NEVER** begin build without a filed Runtime/Deployment Contract
- **❌ NEVER** begin build without a Golden Path Verification Pack
- **❌ NEVER** treat CI-green or passing tests as proof of functional delivery without Golden Path Verification

---

## 10. Downstream Actions Required After Canonization

Once this canon is approved and registered, the following downstream follow-on actions are identified:

1. **Governance canon and operating standards** — update to reflect the full 12-stage sequence (ongoing via ripple)
2. **Consumer repo pre-build templates** — update stage structure and sequence in all consumer repos
3. **Agent contract files** — scan and revise tiered agent contract files where stage assumptions changed
4. **IAA tier 1, tier 2, and tier 3 logic** — upgrade so these stages are enforced during QA and pre-build governance sessions
5. **Implementation-plan templates** — update to reflect Stage 8 requirements
6. **Builder-checklist templates** — create/update to reflect Stage 9 requirements
7. **QA session protocols** — update to enforce Stage 6 requirements

These follow-on actions should be tracked as separate governance issues in the consumer repositories.

---

## 11. Cross-Repository Layer-Down Requirements

**MANDATORY**: When this canon is approved, the following layer-down actions must be executed:

1. **Update CANON_INVENTORY.json** — add this file with full SHA256 hash (REQ-CM-001)
2. **Update GOVERNANCE_CANON_MANIFEST.md** — add entry under Section 3.2 (Architecture & Build Models)
3. **Update CHANGELOG.md** — add versioned change log entry
4. **Create layer-down issues in consumer repos** — per GOVERNANCE_RIPPLE_MODEL.md
5. **Create ripple evidence artifact** in `.agent-admin/governance/ripple-logs/`

---

## 12. Acceptance Criteria

This canon is complete and accepted when:

- [x] Canonical pre-build stage model is formally approved
- [x] Governance documents are updated to reflect the full 12-stage sequence
- [x] UX Workflow & Wiring Spec, PBFAG, Builder Checklist, and IAA Pre-Brief are explicitly mandated
- [x] Change-Propagation Audit, Runtime/Deployment Contract, and Golden Path Verification Pack are recognized as required supporting controls
- [x] Downstream repo/template/agent updates are identified and linked as follow-on implementation tasks

---

## 13. Version History

**v1.0.0** (2026-04-05): Initial canon creation. Formalises the 12-stage End-to-End Pre-Build Stage Model as mandatory governance for all governed builds under the 100% one-time build philosophy. Establishes UX Workflow & Wiring Spec, PBFAG, Builder Checklist, and IAA Pre-Brief as explicit mandatory stages. Establishes Change-Propagation Audit, Runtime/Deployment Contract, and Golden Path Verification Pack as required supporting controls. Authority: CS2. Issue: APGI-cmy/maturion-foreman-governance#1319.

---

**Document Metadata**:  
Canon ID: PRE_BUILD_STAGE_MODEL_CANON  
Authority: CS2 (Johan Ras / Maturion)  
Maintained By: Governance Administrator  
Required By: GOVERNANCE_PURPOSE_AND_SCOPE.md, BUILD_PHILOSOPHY.md, PRE_BUILD_REALITY_CHECK_CANON.md
