# BUILD PROGRESS TRACKER

**Module**: Maturity Roadmap  
**Module Slug**: maturity-roadmap  
**Last Updated**: 2026-04-06  
**Updated By**: governance-liaison-isms-agent (wave: align-12stage-prebuild-20260406)

> **Classification**: ACTIVE — FRESH START ON NEXT STAGE  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05)  
> **Issue**: [maturion-isms#1255](https://github.com/APGI-cmy/maturion-isms/issues/1255)

---

## Stage Migration Note

This tracker was migrated from the legacy 6-stage format to the canonical 12-stage format
per wave `align-12stage-prebuild-20260406` (2026-04-06).

**Classification Rationale**: Maturity Roadmap has two versions of App Description
(`ROADMAP_APP_DESCRIPTION_v2.0.md`, `ROADMAP_APP_DESCRIPTION_v3.0.md`) in `00-app-description/`,
indicating significant investment in Stage 1. However, the Architecture folder is empty and
FRS folder is empty. The module adopts the 12-stage model as a fresh start from Stage 2.

**Note on MMM Convergence Strategy**: The `MMM_strategy.md` document (in `modules/MMM/`) describes
a future convergence of MAT, Maturity Roadmap, and legacy maturity capabilities into the MMM
(Maturity Model Management) product. The convergence strategy is in DRAFT status. Until CS2
formally canonises the convergence and supersedes this module, Maturity Roadmap remains an
active independent module.

**Old → New Stage Mapping**:
| Old Stage | Old Name | New Stage | New Name | Status |
|-----------|----------|-----------|----------|--------|
| Stage 0 | App Description | Stage 1 | App Description | COMPLETE |
| Stage 1 | FRS | Stage 3 | FRS | NOT_STARTED |
| Stage 1.5 | TRS | Stage 4 | TRS | NOT_STARTED |
| Stage 2 | Architecture | Stage 5 | Architecture | NOT_STARTED |
| Stage 3 | Implementation Plan | Stage 8 | Implementation Plan | NOT_STARTED |
| Stage 4 | Builder Appointment | Stage 11 | Builder Appointment | NOT_STARTED |
| Stage 5 | Build | Stage 12 | Build | NOT_STARTED |

All future work proceeds through the 12-stage model in order.

---

## Module Lifecycle Progress

Track the progression through the canonical module lifecycle stages per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0.

### Stage 1: App Description
**Status**: [x] COMPLETE  
**Location**: `modules/maturity-roadmap/00-app-description/`  
**Key Artifacts**:
- [x] `ROADMAP_APP_DESCRIPTION_v2.0.md` — App Description version 2.0
- [x] `ROADMAP_APP_DESCRIPTION_v3.0.md` — App Description version 3.0 (canonical)
- [ ] App Description approved by designated authority

**Completion Date**: 2026-02-13 (approximate; v3.0 is the canonical version)  
**Notes**: Two versions of the App Description exist. `ROADMAP_APP_DESCRIPTION_v3.0.md` is
the current canonical version. Also contains `Lucara_Diamond_Control_Standard_V4.md` as
a reference document. Approval formalisation required.

---

### Stage 2: UX Workflow & Wiring Spec
**Status**: [ ] NOT_STARTED  
**Location**: `modules/maturity-roadmap/02-ux-workflow-wiring-spec/`  
**Key Artifacts**:
- [ ] `ux-workflow-wiring-spec.md` — Complete user journey maps, screen interactions, data flows, wiring
- [ ] All primary and secondary user paths documented
- [ ] Explicit wiring between UI elements, API endpoints, schema tables, and reporting outputs
- [ ] Approved by Foreman and client/user representative

**Completion Date**: N/A  
**Notes**: Not started. This is the next stage after Stage 1 is formally approved.

---

### Stage 3: Functional Requirements Specification (FRS)
**Status**: [ ] NOT_STARTED  
**Location**: `modules/maturity-roadmap/01-frs/`  
**Key Artifacts**:
- [ ] `functional-requirements.md` — Verifiable requirements derived from App Description + UX Workflow & Wiring Spec
- [ ] Derivation statements from both upstream artifacts included
- [ ] 100% §AD traceability confirmed; no TBD items
- [ ] FRS approved by designated authority

**Completion Date**: N/A  
**Notes**: FRS folder exists but is empty.

---

### Stage 4: Technical Requirements Specification (TRS)
**Status**: [ ] NOT_STARTED  
**Location**: `modules/maturity-roadmap/04-trs/`  
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
**Location**: `modules/maturity-roadmap/02-architecture/`  
**Key Artifacts**:
- [ ] `architecture.md` — Structures and decisions that satisfy FRS and TRS
- [ ] All TRS requirements traceable to architecture components
- [ ] Architecture completeness checklist per `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` PASS
- [ ] Architecture approved by designated authority

**Completion Date**: N/A  
**Notes**: Architecture folder exists but is empty.

---

### Stage 6: QA-to-Red
**Status**: [ ] NOT_STARTED  
**Location**: `modules/maturity-roadmap/06-qa-to-red/`  
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
**Location**: `modules/maturity-roadmap/07-pbfag/`  
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
**Location**: `modules/maturity-roadmap/03-implementation-plan/`  
**Key Artifacts**:
- [ ] `implementation-plan.md` — Delivery wave breakdown with explicit scope per wave
- [ ] Wave sequencing with dependency declarations
- [ ] No placeholder waves or TBD scope entries
- [ ] Implementation Plan approved by Foreman

**Completion Date**: N/A  
**Notes**: Folder exists but not populated.

---

### Stage 9: Builder Checklist
**Status**: [ ] NOT_STARTED  
**Location**: `modules/maturity-roadmap/09-builder-checklist/`  
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
**Location**: `modules/maturity-roadmap/10-iaa-pre-brief/`  
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
**Location**: `modules/maturity-roadmap/04-builder-appointment/`  
**Key Artifacts**:
- [ ] `builder-contract.md` — Explicit builder agent contract
- [ ] Formal appointment issued by Foreman after all Stages 1–10 gate-passed
- [ ] Appointment recorded in module tracker
- [ ] Builder appointed by FM

**Completion Date**: N/A  
**Notes**: Folder exists but not populated.

---

### Stage 12: Build Execution & Evidence
**Status**: [ ] NOT_STARTED  
**Location**: `modules/maturity-roadmap/05-build-evidence/`  
**Key Artifacts**:
- [ ] Implementation code in `apps/` or `packages/`
- [ ] Test evidence (QA-to-Green per wave)
- [ ] QA validation results
- [ ] Build completion evidence
- [ ] Handover documentation

**Completion Date**: N/A  
**Notes**: Build not yet started. Note: Wave 9.9 AIMC integration for this module is pending
Wave 9.10 delivery of `maturity-roadmap-advisor.md` persona.

---

## Current Stage Summary

**Current Stage**: Stage 1 COMPLETE — Stage 2 (UX Workflow & Wiring Spec) next  
**Overall Progress**: ~8% complete (Stage 1 done; rich App Description in two versions; Stages 2–12 not started)  
**Blockers**: MMM convergence strategy is DRAFT — await CS2 decision before investing in Stage 2  
**Next Steps**:
1. Await CS2 decision on MMM convergence (does this module proceed independently or merge into MMM?)
2. If proceeding independently: formalise Stage 1 (App Description v3.0) approval
3. Develop Stage 2 (UX Workflow & Wiring Spec)
4. Proceed through stages in order per `PRE_BUILD_STAGE_MODEL_CANON.md`

---

## Governance Compliance

- [x] Stage 1 complete
- [ ] All subsequent stages proceeding in order
- [ ] Traceability maintained (App Description → UX Workflow → FRS → TRS → Architecture)
- [ ] All required approvals obtained
- [ ] Evidence artifacts created for each stage
- [ ] Module manifest up to date

---

## Notes and Observations

**Governance Upgrade (2026-04-06)**: This module adopts the canonical 12-stage model per
`PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 as a fresh start. All future work proceeds through
the 12-stage sequence in order.

**Prior Note (2026-02-13)**: TRS stage introduced per governance upgrade. Now formalised
as Stage 4 in the 12-stage model.

**MMM Convergence**: The MMM strategy (`modules/MMM/MMM_strategy.md`) describes convergence
of MAT + Maturity Roadmap → MMM. This module's path forward is subject to CS2's decision on
whether to proceed independently or integrate into MMM. See `modules/MMM/` for context.

---

**Template Version**: 1.0.0 (12-stage model per PRE_BUILD_STAGE_MODEL_CANON.md v1.0.0)  
**Template Authority**: `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`  
**Last Template Update**: 2026-04-06
