# BUILD PROGRESS TRACKER

**Module**: PIT (Project Implementation Tracker)  
**Module Slug**: pit  
**Last Updated**: 2026-05-06  
**Updated By**: pit-specialist (wave: pit-stage1-app-description-hardening — maturion-isms#1534)

> **Classification**: ACTIVE — RETROFIT NOW  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05)  
> **Issue**: [maturion-isms#1255](https://github.com/APGI-cmy/maturion-isms/issues/1255)

---

## Stage Migration Note

This tracker was migrated from the legacy 6-stage format to the canonical 12-stage format
per wave `align-12stage-prebuild-20260406` (2026-04-06).

**Anomaly Flagged**: The `00-app-description/` folder is empty (no `app-description.md` found),
yet Architecture contains extensive work (one of the most complete architectures outside MAT):
`architecture.md`, `data-contracts/`, `exports/`, `integrations/`, `qa/`, `ui-ux/`, `watchdog/`,
`_legacy/`. App Description must be created before this module can proceed through the canonical
stage sequence. The existing Architecture work is valuable and will be preserved.

**Old → New Stage Mapping**:
| Old Stage | Old Name | New Stage | New Name | Status |
|-----------|----------|-----------|----------|--------|
| Stage 0 | App Description | Stage 1 | App Description | DRAFT_PENDING_CS2_APPROVAL |
| Stage 1 | FRS | Stage 3 | FRS | NOT_STARTED (folder empty) |
| Stage 1.5 | TRS | Stage 4 | TRS | NOT_STARTED |
| Stage 2 | Architecture | Stage 5 | Architecture | IN_PROGRESS |
| Stage 3 | Implementation Plan | Stage 8 | Implementation Plan | NOT_STARTED |
| Stage 4 | Builder Appointment | Stage 11 | Builder Appointment | NOT_STARTED |
| Stage 5 | Build | Stage 12 | Build | NOT_STARTED (partial AIMC artifact) |
| — | (new stage) | Stage 2 | UX Workflow & Wiring Spec | NOT_STARTED |
| — | (new stage) | Stage 6 | QA-to-Red | NOT_STARTED |
| — | (new stage) | Stage 7 | PBFAG | NOT_STARTED |
| — | (new stage) | Stage 9 | Builder Checklist | NOT_STARTED |
| — | (new stage) | Stage 10 | IAA Pre-Brief | NOT_STARTED |

---

## Module Lifecycle Progress

Track the progression through the canonical module lifecycle stages per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0.

### Stage 1: App Description
**Status**: [x] DRAFT_PENDING_CS2_APPROVAL  
**Location**: `modules/pit/00-app-description/`  
**Key Artifacts**:
- [x] `app-description.md` — Full App Description v1.0-draft (1750 lines; §AD-01–§AD-24 complete + MMM Lessons Promoted section)
- [x] All §AD-01–§AD-24 sections per `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 complete
- [ ] App Description approved by CS2/Johan Ras — **PENDING**

**Artifact Paths**:
- Authoritative (canonical per policy §4.1): `docs/governance/PIT_APP_DESCRIPTION.md`
- Module-stage copy: `modules/pit/00-app-description/app-description.md`
- Checklist Evidence: `.agent-admin/evidence/app-description-checklist/pit-20260506.md`

**Checklist Result**: PASS as Draft — pending CS2 approval  
**Build Authorization**: NOT CLEARED — pending CS2 approval  
**Completion Date**: N/A — Draft filed 2026-05-06  
**Notes**: App Description v1.0-draft filed per maturion-isms#1534. Module name corrected from
"Penetration Intelligence Tool" to "Project Implementation Tracker". Source document was
`pit_app_description_stage1_rewritten_v1.md` (prepared by CS2/Johan + ChatGPT). MMM Lessons
Promoted Into PIT section added per Foreman governance directive (L-001 through L-008 + Stage 2
carry-forward requirements). Draft files deleted. Governance mirror created at
`docs/governance/PIT_APP_DESCRIPTION.md`.

---

### Stage 2: UX Workflow & Wiring Spec
**Status**: [ ] NOT_STARTED — **BLOCKED: awaiting CS2 approval of Stage 1**  
**Location**: `modules/pit/01-ux-workflow-wiring-spec/`  
**Key Artifacts**:
- [ ] `ux-workflow-wiring-spec.md` — Complete user journey maps, screen interactions, data flows, wiring
- [ ] All primary and secondary user paths documented
- [ ] Explicit wiring between UI elements, API endpoints, schema tables, and reporting outputs
- [ ] Approved by Foreman and client/user representative

**Completion Date**: N/A  
**Notes**: Not started. BLOCKED until CS2 approves Stage 1 App Description. Stage 2 must
incorporate all Stage 2 carry-forward requirements from MMM Lessons (see app-description.md
§ MMM Lessons Promoted Into PIT): auth/onboarding routes (L-004), UI state definitions (L-003),
Implementation page top indicators, app shell/navigation, and deployment surface map.

---

### Stage 3: Functional Requirements Specification (FRS)
**Status**: [ ] NOT_STARTED  
**Location**: `modules/pit/02-frs/`  
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
**Location**: `modules/pit/03-trs/`  
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
**Location**: `modules/pit/04-architecture/`  
**Key Artifacts**:
- [x] `architecture.md` — Architecture document exists
- [x] `data-contracts/` — Data contracts folder exists
- [x] `exports/` — Exports folder exists
- [x] `integrations/` — Integrations folder exists
- [x] `qa/` — QA strategy folder exists
- [x] `ui-ux/` — UI/UX specifications folder exists
- [x] `watchdog/` — Watchdog/monitoring folder exists
- [x] `_legacy/` — Legacy architecture reference folder exists
- [ ] All TRS requirements traceable to architecture components
- [ ] Architecture completeness checklist per `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` PASS
- [ ] Architecture approved by designated authority

**Completion Date**: N/A  
**Notes**: PIT has the most complete architecture structure alongside Course Crafter. Full
architecture structure is populated. Formal gate-pass requires upstream stages (App Description
→ UX → FRS → TRS) to be completed first. Mapped from old Stage 2.

---

### Stage 6: QA-to-Red
**Status**: [ ] NOT_STARTED  
**Location**: `modules/pit/05-qa-to-red/`  
**Key Artifacts**:
- [ ] Full RED test suite derived from FRS + TRS + Architecture
- [ ] Coverage of all user journeys from Stage 2
- [ ] QA Catalog alignment confirmed
- [ ] RED QA suite signed off by Foreman

**Completion Date**: N/A  
**Notes**: Not started. New stage in 12-stage model.

---

### Stage 7: PBFAG (Pre-Build Functionality Assessment Gate)
**Status**: [ ] NOT_STARTED  
**Location**: `modules/pit/06-pbfag/`  
**Key Artifacts**:
- [ ] PBFAG checklist completed — all checks PASS
- [ ] Change-Propagation Audit complete
- [ ] Runtime/Deployment Contract filed
- [ ] Golden Path Verification Pack defined
- [ ] PBFAG PASS recorded by Foreman

**Completion Date**: N/A  
**Notes**: Not started. New hard gate in 12-stage model.

---

### Stage 8: Implementation Plan
**Status**: [ ] NOT_STARTED  
**Location**: `modules/pit/07-implementation-plan/`  
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
**Location**: `modules/pit/08-builder-checklist/`  
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
**Location**: `modules/pit/09-iaa-pre-brief/`  
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
**Location**: `modules/pit/10-builder-appointment/`  
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
**Location**: `modules/pit/11-build/`  
**Key Artifacts**:
- [ ] Implementation code in `apps/` or `packages/`
- [ ] Test evidence (QA-to-Green per wave)
- [ ] QA validation results
- [ ] Build completion evidence
- [ ] Handover documentation

**Completion Date**: N/A  
**Notes**: Core build not yet started. However, as an artifact of Wave 9.7 AIMC integration
(pre-12-stage), `src/services/aimc-wiring.ts` exists as an AIMC integration component and
`pit-advisor.md` persona exists in `packages/ai-centre/src/agents/`. These are integration
artifacts, not core PIT module build deliverables. Mapped from old Stage 5.

---

## Current Stage Summary

**Current Stage**: Stage 1 DRAFT_PENDING_CS2_APPROVAL — App Description filed 2026-05-06, awaiting CS2/Johan Ras approval  
**Overall Progress**: ~15% complete (App Description draft filed; Architecture substantially IN_PROGRESS)  
**Blockers**: CS2/Johan Ras approval of Stage 1 App Description required before Stage 2 can begin  
**Next Steps**:
1. CS2/Johan Ras approves Stage 1 App Description (`modules/pit/00-app-description/app-description.md`)
2. Begin Stage 2 (UX Workflow & Wiring Spec) — must incorporate all MMM carry-forward requirements
3. Complete Stage 3 (FRS) building on App Description + UX Workflow
4. Complete Stage 4 (TRS)
5. Formally gate-pass Stage 5 (Architecture — rich content already exists, needs approval)

**MMM-Derived Learning Controls (Carry-Forward)**:
PIT carries forward 8 build-process improvement controls from the MMM module build. These are
documented in the App Description (§ MMM Lessons Promoted Into PIT) and the improvement register:
`modules/pit/_readiness/pit-build-process-improvement-register.md`
- L-001: L1/L2/L3 closure model (build-complete ≠ operationally closed)
- L-002: UI rendering completeness (global styles, app shell) must be tested
- L-003: Post-login pages require all 5 states (loading/empty/permission-denied/network-error/data)
- L-004: Auth route discoverability must be designed up front in Stage 2
- L-005: Tests must prove runtime/UI behaviour, not only file existence
- L-006: Deployment execution must be a first-class contract (filed before PBFAG)
- L-007: Operational closure requires live evidence (L3 = CS2 verified live E2E)
- L-008: Continuous improvement must be recorded in the improvement register

---

## Governance Compliance

- [ ] All stages proceeding in order — App Description draft filed; Stage 2 blocked until CS2 approval
- [ ] Traceability maintained (App Description → UX Workflow → FRS → TRS → Architecture)
- [ ] All required approvals obtained — **Stage 1 pending CS2 approval**
- [x] Evidence artifacts created for Stage 1 (checklist at `.agent-admin/evidence/app-description-checklist/pit-20260506.md`)
- [x] Module manifest updated (module_name corrected to "PIT (Project Implementation Tracker)")

---

## Notes and Observations

**Stage 1 App Description Filed (2026-05-06)**: App Description v1.0-draft created per
maturion-isms#1534 delegation from Foreman to pit-specialist. Module name corrected from
"Penetration Intelligence Tool" to "Project Implementation Tracker". Source:
`pit_app_description_stage1_rewritten_v1.md` (prepared by CS2/Johan + ChatGPT). MMM Lessons
Promoted Into PIT section added (L-001–L-008 + Stage 2 carry-forward requirements).
Improvement register created at `modules/pit/_readiness/pit-build-process-improvement-register.md`.

**Governance Upgrade (2026-04-06)**: Stage model migrated from legacy 6-stage (Stage 0–5) to
canonical 12-stage per `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0. See Stage Migration Note above.

**Prior Note (2026-02-13)**: TRS stage introduced per governance upgrade "Governance Upgrade:
Insert Technical Requirements Specification (TRS) Step".

**PIT Integration Contract**: `PIT_INTEGRATION_CONTRACT_v0.1.md` exists in the module root and
provides useful context for App Description authoring.

**AI Integration**: AIMC wiring (Wave 9.7) complete. `pit-advisor.md` persona delivered.
See `10-governance-notes/` and `20-ai/` for AI integration governance context.

---

**Template Version**: 1.0.0 (12-stage model per PRE_BUILD_STAGE_MODEL_CANON.md v1.0.0)  
**Template Authority**: `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`  
**Last Template Update**: 2026-04-06
