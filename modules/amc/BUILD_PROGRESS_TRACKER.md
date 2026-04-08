# AMC Build Progress Tracker

## Module: App Management Centre (AMC)
**Module Slug**: amc  
**Last Updated**: 2026-04-08  
**Updated By**: governance-liaison-isms-agent (wave: align-12stage-prebuild-20260406)

> **Classification**: ACTIVE — FRESH START ON NEXT STAGE  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05)  
> **Issue**: [maturion-isms#1255](https://github.com/APGI-cmy/maturion-isms/issues/1255)

---

## Module Lifecycle Progress

Track the progression through the canonical module lifecycle stages per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0.

> **Note**: AMC uses a wave-based Build section below this lifecycle section. The Build Waves
> section (Section 2) is preserved from the original tracker and represents planned build
> work. The lifecycle section (this section) tracks the pre-build stage progression per the
> canonical 12-stage model.

### Stage 1: App Description
**Status**: [x] COMPLETE  
**Location**: `modules/amc/00-app-description/`  
**Key Artifacts**:
- [x] `app-description.md` — App Description document exists
- [ ] App Description approved by designated authority

**Completion Date**: 2026-03-01  
**Notes**: `app-description.md` exists. AMC scope established and canonised
(`governance/canon/AMC_SCOPE_DOCUMENT.md`). All "Foreman App" references updated (PR #736).

---

### Stage 2: UX Workflow & Wiring Spec
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/01-ux-workflow-wiring-spec/`  
**Key Artifacts**:
- [ ] `ux-workflow-wiring-spec.md` — Complete user journey maps, screen interactions, data flows, wiring
- [ ] All primary and secondary user paths documented
- [ ] Explicit wiring between UI elements, API endpoints, schema tables, and reporting outputs
- [ ] Approved by Foreman and client/user representative

**Completion Date**: N/A  
**Notes**: Not started. Required before FRS can proceed.

---

### Stage 3: Functional Requirements Specification (FRS)
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/02-frs/`  
**Key Artifacts**:
- [ ] `functional-requirements.md` — Verifiable requirements derived from App Description + UX Workflow & Wiring Spec
- [ ] Derivation statements from both upstream artifacts included
- [ ] 100% §AD traceability confirmed; no TBD items
- [ ] FRS approved by designated authority

**Completion Date**: N/A  
**Notes**: Not started.

---

### Stage 4: Technical Requirements Specification (TRS)
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/03-trs/`  
**Key Artifacts**:
- [ ] `technical-requirements-specification.md` — Technical constraints, performance requirements, integration requirements
- [ ] `frs-to-trs-traceability.md` — Traceability matrix linking FRS to TRS
- [ ] Tool validation and quality gate definitions
- [ ] TRS approved by designated authority

**Completion Date**: N/A  
**Notes**: Not started.

---

### Stage 5: Architecture
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/04-architecture/`  
**Key Artifacts**:
- [ ] `architecture.md` — Structures and decisions that satisfy FRS and TRS
- [ ] All TRS requirements traceable to architecture components
- [ ] Architecture completeness checklist per `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` PASS
- [ ] Architecture approved by designated authority

**Completion Date**: N/A  
**Notes**: Not started.

---

### Stage 6: QA-to-Red
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/05-qa-to-red/`  
**Key Artifacts**:
- [ ] Full RED test suite derived from FRS + TRS + Architecture
- [ ] Coverage of all user journeys from Stage 2
- [ ] QA Catalog alignment confirmed
- [ ] RED QA suite signed off by Foreman

**Completion Date**: N/A  
**Notes**: Not started.

---

### Stage 7: PBFAG (Pre-Build Functionality Assessment Gate)
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/06-pbfag/`  
**Key Artifacts**:
- [ ] PBFAG checklist completed — all checks PASS
- [ ] Change-Propagation Audit complete
- [ ] Runtime/Deployment Contract filed
- [ ] Golden Path Verification Pack defined
- [ ] PBFAG PASS recorded by Foreman

**Completion Date**: N/A  
**Notes**: Not started.

---

### Stage 8: Implementation Plan
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/07-implementation-plan/`  
**Key Artifacts**:
- [ ] `implementation-plan.md` — Delivery wave breakdown with explicit scope per wave
- [ ] Wave sequencing with dependency declarations
- [ ] No placeholder waves or TBD scope entries
- [ ] Implementation Plan approved by Foreman

**Completion Date**: N/A  
**Notes**: Build waves are defined in Section 2 below, but the formal 12-stage Implementation
Plan has not yet been authored. The Build Waves represent the intended implementation scope.

---

### Stage 9: Builder Checklist
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/08-builder-checklist/`  
**Key Artifacts**:
- [ ] Builder Checklist completed for each builder candidate
- [ ] Builder agent contracts verified as current
- [ ] Scope, RED QA, and architecture comprehension confirmed
- [ ] Builder Checklist PASS for all appointed builders

**Completion Date**: N/A  
**Notes**: Not started.

---

### Stage 10: IAA Pre-Brief
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/09-iaa-pre-brief/`  
**Key Artifacts**:
- [ ] IAA Pre-Brief invoked by Foreman with full context
- [ ] IAA Pre-Brief artifact filed
- [ ] ASSURANCE-TOKEN or PHASE_A_ADVISORY status recorded
- [ ] Pre-Brief acknowledged by Foreman and all designated builders

**Completion Date**: N/A  
**Notes**: Not started.

---

### Stage 11: Builder Appointment
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/10-builder-appointment/`  
**Key Artifacts**:
- [ ] `builder-contract.md` — Explicit builder agent contract
- [ ] Formal appointment issued by Foreman after all Stages 1–10 gate-passed
- [ ] Appointment recorded in module tracker
- [ ] Builder appointed by FM

**Completion Date**: N/A  
**Notes**: Not started.

---

### Stage 12: Build Execution & Evidence
**Status**: [ ] NOT_STARTED  
**Location**: `modules/amc/11-build/`  
**Key Artifacts**:
- [ ] Implementation code in `apps/` or `packages/`
- [ ] Test evidence (QA-to-Green per wave)
- [ ] QA validation results
- [ ] Build completion evidence
- [ ] Handover documentation

**Completion Date**: N/A  
**Notes**: Build waves defined below (Section 2) are pending CS2 wave-start authorization.

---

## Current Stage Summary

**Current Stage**: Stage 1 COMPLETE — Stage 2 (UX Workflow & Wiring Spec) next  
**Overall Progress**: ~5% complete (Stage 1 done; Stages 2–12 not started)  
**Blockers**: Stages 2–12 all require CS2 wave-start authorization per AMC wave structure  
**Next Steps**:
1. Formalise Stage 1 (App Description) approval
2. Complete Stages 2–11 before first build wave starts
3. Stage 12 will execute via the Build Waves defined in Section 2

---

## Governance Compliance

- [x] Stage 1 complete (App Description + AMC Scope Document canonised)
- [ ] All subsequent stages proceeding in order
- [ ] Traceability maintained (App Description → UX Workflow → FRS → TRS → Architecture)
- [ ] All required approvals obtained
- [ ] Evidence artifacts created for each stage
- [ ] Module manifest up to date

---

---

## Build Waves (Pending)

> **Original Section Preserved** — These build waves represent the intended AMC implementation
> scope. All waves require CS2 wave-start authorization AND completion of pre-build Stages 2–11
> above before any wave can begin.

| Wave | Feature | Status |
|---|---|---|
| AMC-W1 | ARC Option C Flow — Human-in-the-Loop trigger review | ⏳ PENDING — requires CS2 wave-start |
| AMC-W2 | Dynamic Quota Management | ⏳ PENDING — requires CS2 wave-start |
| AMC-W3 | Alert Dashboard | ⏳ PENDING — requires CS2 wave-start |
| AMC-W4 | Audit Trail | ⏳ PENDING — requires CS2 wave-start |
| AMC-W5 | Progressive Automation Control | ⏳ PENDING — requires CS2 wave-start |

---

## Governance Foundation (Original Section Preserved)

| Item | Status | Reference |
|---|---|---|
| AMC name established | ✅ COMPLETE | `governance/canon/AMC_SCOPE_DOCUMENT.md` |
| AMC scope document in CANON_INVENTORY | ✅ COMPLETE | `governance/CANON_INVENTORY.json` |
| All "Foreman App" references updated | ✅ COMPLETE | PR #736 |
| Module structure created | ✅ COMPLETE | `modules/amc/` |

---

**Template Version**: 1.0.0 (12-stage model per PRE_BUILD_STAGE_MODEL_CANON.md v1.0.0)  
**Template Authority**: `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`  
**Last Template Update**: 2026-04-06  
*Original wave section: Updated 2026-03-01. Authority: CS2 (Johan Ras / @APGI-cmy)*
