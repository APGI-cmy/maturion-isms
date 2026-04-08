# BUILD PROGRESS TRACKER

**Module**: xDetect  
**Module Slug**: xdetect  
**Last Updated**: 2026-04-08  
**Updated By**: governance-liaison-isms-agent (wave: normalize-maturion-isms-directory-structure)

> **Classification**: ACTIVE — FRESH START ON NEXT STAGE  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05)  
> **Issue**: [maturion-isms#1255](https://github.com/APGI-cmy/maturion-isms/issues/1255)

---

## Stage Migration Note

This tracker was migrated from the legacy 6-stage format to the canonical 12-stage format
per wave `align-12stage-prebuild-20260406` (2026-04-06).

**Classification Rationale**: xDetect has App Description (`app-description.md`) and an AIMC
wiring service (`src/services/aimc-wiring.ts`) from Wave 9.6. However, the Architecture and
FRS folders are empty. The AIMC service is an integration artifact from a pre-12-stage-model
integration wave, not a core xDetect build stage deliverable. The module adopts the 12-stage
model as a fresh start from Stage 2.

**Old → New Stage Mapping**:
| Old Stage | Old Name | New Stage | New Name | Status |
|-----------|----------|-----------|----------|--------|
| Stage 0 | App Description | Stage 1 | App Description | COMPLETE |
| Stage 1 | FRS | Stage 3 | FRS | NOT_STARTED |
| Stage 1.5 | TRS | Stage 4 | TRS | NOT_STARTED |
| Stage 2 | Architecture | Stage 5 | Architecture | NOT_STARTED |
| Stage 3 | Implementation Plan | Stage 8 | Implementation Plan | NOT_STARTED |
| Stage 4 | Builder Appointment | Stage 11 | Builder Appointment | NOT_STARTED |
| Stage 5 | Build | Stage 12 | Build | NOT_STARTED (partial AIMC artifact) |

All future work proceeds through the 12-stage model in order.

---

## Module Lifecycle Progress

Track the progression through the canonical module lifecycle stages per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0.

### Stage 1: App Description
**Status**: [x] COMPLETE  
**Location**: `modules/xdetect/00-app-description/`  
**Key Artifacts**:
- [x] `app-description.md` — App Description document exists
- [ ] App Description approved by designated authority

**Completion Date**: 2026-02-13 (approximate)  
**Notes**: `app-description.md` exists in `00-app-description/`. Approval formalisation required.

---

### Stage 2: UX Workflow & Wiring Spec
**Status**: [ ] NOT_STARTED  
**Location**: `modules/xdetect/01-ux-workflow-wiring-spec/`  
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
**Location**: `modules/xdetect/02-frs/`  
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
**Location**: `modules/xdetect/03-trs/`  
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
**Location**: `modules/xdetect/04-architecture/`  
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
**Location**: `modules/xdetect/05-qa-to-red/`  
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
**Location**: `modules/xdetect/06-pbfag/`  
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
**Location**: `modules/xdetect/07-implementation-plan/`  
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
**Location**: `modules/xdetect/08-builder-checklist/`  
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
**Location**: `modules/xdetect/09-iaa-pre-brief/`  
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
**Location**: `modules/xdetect/10-builder-appointment/`  
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
**Location**: `modules/xdetect/11-build/`  
**Key Artifacts**:
- [ ] Implementation code in `apps/` or `packages/`
- [ ] Test evidence (QA-to-Green per wave)
- [ ] QA validation results
- [ ] Build completion evidence
- [ ] Handover documentation

**Completion Date**: N/A  
**Notes**: Core build not yet started. As an artifact of Wave 9.6 AIMC integration
(pre-12-stage), `src/services/aimc-wiring.ts` exists as an AIMC integration component and
`xdetect-advisor.md` persona exists in `packages/ai-centre/src/agents/`. 8 AIMC wiring tests
GREEN (XDETECT-AIMC-T-001 to T-008). These are integration artifacts, not core xDetect
build deliverables.

---

## Current Stage Summary

**Current Stage**: Stage 1 COMPLETE — Stage 2 (UX Workflow & Wiring Spec) next  
**Overall Progress**: ~5% complete (Stage 1 done; Stages 2–12 not started)  
**Blockers**: None currently — Stage 2 awaits CS2 wave-start  
**Next Steps**:
1. Formalise Stage 1 (App Description) approval
2. Develop Stage 2 (UX Workflow & Wiring Spec)
3. Proceed through stages in order per `PRE_BUILD_STAGE_MODEL_CANON.md`

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

**AI Integration**: AIMC wiring (Wave 9.6) complete. `xdetect-advisor.md` persona delivered.
8 AIMC wiring tests GREEN. See `tests/wiring-invariants/` and `tests/ai-gateway-smoke/` for
test evidence. These integration artifacts predate the 12-stage model and are preserved.

---

**Template Version**: 1.0.0 (12-stage model per PRE_BUILD_STAGE_MODEL_CANON.md v1.0.0)  
**Template Authority**: `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`  
**Last Template Update**: 2026-04-06
