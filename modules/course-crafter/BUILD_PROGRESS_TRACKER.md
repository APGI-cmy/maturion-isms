# BUILD PROGRESS TRACKER

**Module**: Course Crafter  
**Module Slug**: course-crafter  
**Last Updated**: 2026-04-08  
**Updated By**: governance-liaison-isms-agent (wave: align-12stage-prebuild-20260406)

> **Classification**: ACTIVE — RETROFIT NOW  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05)  
> **Issue**: [maturion-isms#1255](https://github.com/APGI-cmy/maturion-isms/issues/1255)

---

## Stage Migration Note

This tracker was migrated from the legacy 6-stage format to the canonical 12-stage format
per wave `align-12stage-prebuild-20260406` (2026-04-06).

**Anomaly Flagged**: The `00-app-description/` folder is empty (no `app-description.md` found),
yet the Architecture stage contains substantial work (`architecture.md`, `data-contracts/`,
`exports/`, `integrations/`, `qa/`, `ui-ux/`). This creates a gap in the canonical sequence —
Architecture must not proceed without an approved App Description. App Description must be
created before Stage 2 work begins.

**Old → New Stage Mapping**:
| Old Stage | Old Name | New Stage | New Name | Status |
|-----------|----------|-----------|----------|--------|
| Stage 0 | App Description | Stage 1 | App Description | RETROFIT_STUB_CREATED — pending CS2 approval |
| Stage 1 | FRS | Stage 3 | FRS | NOT_STARTED (folder empty) |
| Stage 1.5 | TRS | Stage 4 | TRS | NOT_STARTED |
| Stage 2 | Architecture | Stage 5 | Architecture | IN_PROGRESS |
| Stage 3 | Implementation Plan | Stage 8 | Implementation Plan | NOT_STARTED |
| Stage 4 | Builder Appointment | Stage 11 | Builder Appointment | NOT_STARTED |
| Stage 5 | Build | Stage 12 | Build | NOT_STARTED |
| — | (new stage) | Stage 2 | UX Workflow & Wiring Spec | NOT_STARTED |
| — | (new stage) | Stage 6 | QA-to-Red | NOT_STARTED |
| — | (new stage) | Stage 7 | PBFAG | NOT_STARTED |
| — | (new stage) | Stage 9 | Builder Checklist | NOT_STARTED |
| — | (new stage) | Stage 10 | IAA Pre-Brief | NOT_STARTED |

---

## Module Lifecycle Progress

Track the progression through the canonical module lifecycle stages per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0.

### Stage 1: App Description
**Status**: [ ] NOT_STARTED  
**Location**: `modules/course-crafter/00-app-description/`  
**Key Artifacts**:
- [ ] `app-description.md` — Authoritative intent, scope, users, outputs, constraints
- [ ] All §AD-01–§AD-24 sections per `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 complete
- [ ] App Description approved by designated authority

**Completion Date**: N/A  
**Notes**: ⚠️ **ANOMALY**: App Description folder exists but is empty. The old tracker
incorrectly marked this as COMPLETE. An App Description must be created before this module
can proceed through Stages 2–12 in the canonical sequence.

---

### Stage 2: UX Workflow & Wiring Spec
**Status**: [ ] NOT_STARTED  
**Location**: `modules/course-crafter/01-ux-workflow-wiring-spec/`  
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
**Location**: `modules/course-crafter/02-frs/`  
**Key Artifacts**:
- [ ] `functional-requirements.md` — Verifiable requirements derived from App Description + UX Workflow & Wiring Spec
- [ ] Derivation statements from both upstream artifacts included
- [ ] 100% §AD traceability confirmed; no TBD items
- [ ] FRS approved by designated authority

**Completion Date**: N/A  
**Notes**: FRS folder exists but is empty. Mapped from old Stage 1.

---

### Stage 4: Technical Requirements Specification (TRS)
**Status**: [ ] NOT_STARTED  
**Location**: `modules/course-crafter/03-trs/`  
**Key Artifacts**:
- [ ] `technical-requirements-specification.md` — Technical constraints, performance requirements, integration requirements
- [ ] `frs-to-trs-traceability.md` — Traceability matrix linking FRS to TRS
- [ ] Tool validation and quality gate definitions
- [ ] TRS approved by designated authority

**Completion Date**: N/A  
**Notes**: Not started. Mapped from old Stage 1.5.

---

### Stage 5: Architecture
**Status**: [ ] IN_PROGRESS  
**Location**: `modules/course-crafter/04-architecture/`  
**Key Artifacts**:
- [x] `architecture.md` — Architecture document exists
- [x] `data-contracts/` — Data contracts folder exists
- [x] `exports/` — Exports folder exists
- [x] `integrations/` — Integrations folder exists
- [x] `qa/` — QA strategy folder exists
- [x] `ui-ux/` — UI/UX specifications folder exists
- [ ] All TRS requirements traceable to architecture components
- [ ] Architecture completeness checklist per `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` PASS
- [ ] Architecture approved by designated authority

**Completion Date**: N/A  
**Notes**: Architecture is substantially populated. Course Crafter has one of the most complete
architecture structures in the ecosystem (alongside PIT). Formal gate-pass requires upstream
stages (App Description → UX → FRS → TRS) to be completed first. Mapped from old Stage 2.

---

### Stage 6: QA-to-Red
**Status**: [ ] NOT_STARTED  
**Location**: `modules/course-crafter/05-qa-to-red/`  
**Key Artifacts**:
- [ ] Full RED test suite derived from FRS + TRS + Architecture
- [ ] Coverage of all user journeys from Stage 2
- [ ] QA Catalog alignment confirmed
- [ ] RED QA suite signed off by Foreman (no implementation started)

**Completion Date**: N/A  
**Notes**: Not started. New stage in 12-stage model.

---

### Stage 7: PBFAG (Pre-Build Functionality Assessment Gate)
**Status**: [ ] NOT_STARTED  
**Location**: `modules/course-crafter/06-pbfag/`  
**Key Artifacts**:
- [ ] PBFAG checklist completed — all checks PASS
- [ ] Change-Propagation Audit complete
- [ ] Runtime/Deployment Contract filed
- [ ] Golden Path Verification Pack defined
- [ ] All external dependencies confirmed available
- [ ] PBFAG PASS recorded by Foreman

**Completion Date**: N/A  
**Notes**: Not started. New hard gate in 12-stage model.

---

### Stage 8: Implementation Plan
**Status**: [ ] NOT_STARTED  
**Location**: `modules/course-crafter/07-implementation-plan/`  
**Key Artifacts**:
- [ ] `implementation-plan.md` — Delivery wave breakdown with explicit scope per wave
- [ ] Wave sequencing with dependency declarations
- [ ] No placeholder waves or TBD scope entries
- [ ] Implementation Plan approved by Foreman

**Completion Date**: N/A  
**Notes**: Folder exists but not yet populated. Mapped from old Stage 3.

---

### Stage 9: Builder Checklist
**Status**: [ ] NOT_STARTED  
**Location**: `modules/course-crafter/08-builder-checklist/`  
**Key Artifacts**:
- [ ] Builder Checklist completed for each builder candidate
- [ ] Builder agent contracts verified as current
- [ ] Scope, RED QA, and architecture comprehension confirmed
- [ ] Foreman role-fit confirmation recorded
- [ ] Builder Checklist PASS for all appointed builders

**Completion Date**: N/A  
**Notes**: Not started. New hard gate in 12-stage model.

---

### Stage 10: IAA Pre-Brief
**Status**: [ ] NOT_STARTED  
**Location**: `modules/course-crafter/09-iaa-pre-brief/`  
**Key Artifacts**:
- [ ] IAA Pre-Brief invoked by Foreman with full context
- [ ] IAA Pre-Brief artifact filed
- [ ] ASSURANCE-TOKEN or PHASE_A_ADVISORY status recorded
- [ ] Pre-Brief acknowledged by Foreman and all designated builders

**Completion Date**: N/A  
**Notes**: Not started. New stage in 12-stage model.

---

### Stage 11: Builder Appointment
**Status**: [ ] NOT_STARTED  
**Location**: `modules/course-crafter/10-builder-appointment/`  
**Key Artifacts**:
- [ ] `builder-contract.md` — Explicit builder agent contract
- [ ] Formal appointment issued by Foreman after all Stages 1–10 gate-passed
- [ ] Appointment recorded in module tracker
- [ ] Builder appointed by FM

**Completion Date**: N/A  
**Notes**: Folder exists but not yet populated. Mapped from old Stage 4.

---

### Stage 12: Build Execution & Evidence
**Status**: [ ] NOT_STARTED  
**Location**: `modules/course-crafter/11-build/`  
**Key Artifacts**:
- [ ] Implementation code in `apps/` or `packages/`
- [ ] Test evidence (QA-to-Green per wave)
- [ ] QA validation results
- [ ] Build completion evidence
- [ ] Handover documentation

**Completion Date**: N/A  
**Notes**: Build not yet started. Mapped from old Stage 5.

---

## Current Stage Summary

**Current Stage**: Stage 1 NOT_STARTED — App Description required first (see anomaly above)  
**Overall Progress**: ~8% complete (Architecture IN_PROGRESS but App Description gap exists)  
**Blockers**: App Description must be created before canonical stage progression can resume  
**Next Steps**:
1. Create `app-description.md` in `modules/course-crafter/00-app-description/`
2. Complete Stage 2 (UX Workflow & Wiring Spec)
3. Complete Stage 3 (FRS) building on App Description + UX Workflow
4. Complete Stage 4 (TRS)
5. Formally gate-pass Stage 5 (Architecture — content already exists, needs approval after upstream stages)

---

## Governance Compliance

- [ ] All stages proceeding in order — **GAP: Architecture exists without App Description**
- [ ] Traceability maintained (App Description → UX Workflow → FRS → TRS → Architecture)
- [ ] All required approvals obtained
- [ ] Evidence artifacts created for each stage
- [ ] Module manifest up to date

---

## Notes and Observations

**Governance Upgrade (2026-04-06)**: Stage model migrated from legacy 6-stage (Stage 0–5) to
canonical 12-stage per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0. See Stage Migration Note above.

**Prior Note (2026-02-13)**: TRS stage introduced per governance upgrade "Governance Upgrade:
Insert Technical Requirements Specification (TRS) Step". This stage prevents downstream
implementation failures by capturing technical constraints, performance requirements, and tool
validation rules between FRS and Architecture.

**Governance Notes**: See `10-governance-notes/` for additional governance context.

---

**Template Version**: 1.0.0 (12-stage model per PRE_BUILD_STAGE_MODEL_CANON.md v1.0.0)  
**Template Authority**: `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`  
**Last Template Update**: 2026-04-06
