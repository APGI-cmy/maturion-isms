# BUILD PROGRESS TRACKER

**Module**: PIT (Project Implementation Tracker)  
**Module Slug**: pit  
**Last Updated**: 2026-05-07
**Updated By**: foreman-v2-agent (wave: pit-stage4-trs — maturion-isms#1554)
> **Classification**: ACTIVE — RETROFIT NOW  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05)  
> **Issue**: [maturion-isms#1255](https://github.com/APGI-cmy/maturion-isms/issues/1255)

---

## Stage Migration Note

This tracker was migrated from the legacy 6-stage format to the canonical 12-stage format
per wave `align-12stage-prebuild-20260406` (2026-04-06).

**Anomaly Flagged (RESOLVED)**: At migration time (2026-04-06), the `00-app-description/` folder was empty (no `app-description.md` found). This has since been resolved: App Description v1.0 was created per maturion-isms#1534 and approved by CS2/Johan Ras on 2026-05-06 per maturion-isms#1540. The Architecture work (`architecture.md`, `data-contracts/`, `exports/`, `integrations/`, `qa/`, `ui-ux/`, `watchdog/`, `_legacy/`) is preserved and will be gate-passed after the canonical upstream stages are completed.

**Old → New Stage Mapping**:
| Old Stage | Old Name | New Stage | New Name | Status |
|-----------|----------|-----------|----------|--------|
| Stage 0 | App Description | Stage 1 | App Description | CS2_APPROVED_AUTHORITATIVE |
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
**Status**: [x] CS2_APPROVED_AUTHORITATIVE  
**Location**: `modules/pit/00-app-description/`  
**Key Artifacts**:
- [x] `app-description.md` — Full App Description v1.0 (Authoritative; 1750 lines; §AD-01–§AD-24 complete + MMM Lessons Promoted section)
- [x] All §AD-01–§AD-24 sections per `APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 complete
- [x] App Description approved by CS2/Johan Ras — **APPROVED 2026-05-06** (ref: maturion-isms#1540)

**Artifact Paths**:
- Authoritative (canonical per policy §4.1): `docs/governance/PIT_APP_DESCRIPTION.md`
- Module-stage copy: `modules/pit/00-app-description/app-description.md`
- Checklist Evidence: `.agent-admin/evidence/app-description-checklist/pit-20260506.md`

**Checklist Result**: PASS — Authoritative / CS2 Approved  
**Build Authorization**: NOT CLEARED — implementation blocked until Stages 2–11 completed and gate-passed  
**Completion Date**: 2026-05-06 (CS2 approval)  
**Notes**: App Description v1.0 filed per maturion-isms#1534 (Draft), approved per maturion-isms#1540.
Module name corrected from "Penetration Intelligence Tool" to "Project Implementation Tracker".
Source document was prepared by CS2/Johan + assistant-assisted drafting under Johan Ras direction.
MMM Lessons Promoted Into PIT section added per Foreman governance directive (L-001 through L-008 +
Stage 2 carry-forward requirements). Draft files deleted. Authoritative canonical location:
`docs/governance/PIT_APP_DESCRIPTION.md`. Synchronised module-stage copy:
`modules/pit/00-app-description/app-description.md`.

---

### Stage 2: UX Workflow & Wiring Spec
**Status**: [x] STAGE_2_COMPLETE_FOREMAN_REVIEWED — pending CS2 approval (maturion-isms#1548)  
**Location**: `modules/pit/01-ux-workflow-wiring-spec/`  
**Key Artifacts**:
- [x] `ux-workflow-wiring-spec.md` — Complete user journey maps, screen interactions, data flows, wiring (v0.2-draft)
- [x] All primary and secondary user paths documented (23 journeys including all auth flows, My Work journey, and Invitation Acceptance)
- [x] Explicit wiring between UI elements, API endpoints, schema tables, and reporting outputs (Section 7 wiring table)
- [x] All 5 UI states for every primary page (Section 4 state matrix)
- [x] All 7 Implementation Page top indicators (Section 3)
- [x] App shell/navigation and root-level notification pattern (Section 5)
- [x] Timeline creator interactions and date-alignment expectations (Section 6)
- [x] AIMC-only AI touchpoints documented (Section 8)
- [x] Deployment surface map (Section 9)
- [x] Approved by CS2 (pending review — maturion-isms#1548)

**Completion Date**: N/A — Foreman-reviewed 2026-05-06, pending CS2 approval  
**Stage 2 Completion Evidence**: `.agent-admin/evidence/stage2-completion-checklist/pit-stage2-20260506.md`  
**Notes**: Stage 2 UX Workflow & Wiring Spec v0.2-draft satisfies all 13 completion criteria per maturion-isms#1548 verification. All required sections present: derivation statement, L-001–L-008 carry-forward, 23 user journeys (including My Work and Invitation Acceptance), 21 screens, 5-state UI matrix, 7 top indicators, app shell, timeline wiring, screen-to-data wiring table, AIMC touchpoints, deployment surface map. Open items from Stage 2 Section 10 are resolved in Stage 3 FRS. Build Authorization remains NOT CLEARED.
---

### Stage 3: Functional Requirements Specification (FRS)
**Status**: [x] DRAFT_CREATED — pending CS2 approval (maturion-isms#1548)  
**Location**: `modules/pit/02-frs/`  
**Key Artifacts**:
- [x] `functional-requirements.md` — Stage 3 FRS v0.1-draft, derived from App Description v1.0 + UX Workflow & Wiring Spec v0.2-draft
- [x] Derivation statements from both upstream artifacts included
- [x] Numbered functional requirements (PIT-FR-001 through PIT-FR-112) — testable, phrased as "The system shall..."
- [x] Auth/onboarding, all primary screens, 5 UI states, project hierarchy, timeline, evidence, assignment, watchdog, reporting, audit, QA dashboard, AIMC, cross-module integrations covered
- [x] Acceptance criteria for every requirement or requirement group
- [x] Traceability matrix (App Description → Stage 2 → FRS requirement ID → future stage placeholder)
- [x] Approved by CS2 (pending review — maturion-isms#1548)

**Completion Date**: N/A — Draft created 2026-05-06, pending CS2 approval  
**Notes**: FRS v0.1-draft created per maturion-isms#1548. Derived from docs/governance/PIT_APP_DESCRIPTION.md v1.0 and modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md v0.2-draft. 112 functional requirements (PIT-FR-001 through PIT-FR-105, PIT-FR-106 through PIT-FR-112) with acceptance criteria and traceability matrix covering 23 journeys and 21 screens. Traceability updated to v0.2 baseline. Open items from Stage 2 Section 10 are resolved in FRS. Stage 4 TRS remains blocked until Stage 3 FRS is approved by CS2. Build Authorization remains NOT CLEARED.

---

### Stage 4: Technical Requirements Specification (TRS)
**Status**: [x] DRAFT_CREATED — pending upstream CS2 approvals (Stage 2 and Stage 3, ref: maturion-isms#1548)
**Location**: `modules/pit/03-trs/`
**Key Artifacts**:
- [x] `technical-requirements-specification.md` — Technical constraints, performance requirements, integration requirements, AIMC contracts, RLS design, table definitions, Edge Function contracts (PIT-TR-001 to PIT-TR-115)
- [x] `frs-to-trs-traceability.md` — Traceability matrix linking all 112 FRS requirements and 10 NF placeholders to TRS requirements across 28 domains
- [x] Tool validation and quality gate definitions — included in `technical-requirements-specification.md` (Section 25, PIT-TR-100 to PIT-TR-107)
- [ ] TRS approved by designated authority — **BLOCKED**: pending CS2 approval of Stage 3 FRS and Stage 2 UX Spec (maturion-isms#1548)

**Completion Date**: N/A — Draft created 2026-05-07, pending upstream CS2 approvals
**Notes**: TRS v0.1-draft created per maturion-isms#1554 (wave: pit-stage4-trs). Derived from `docs/governance/PIT_APP_DESCRIPTION.md` v1.0, `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.2-draft, and `modules/pit/02-frs/functional-requirements.md` v0.1-draft. 115 technical requirements (PIT-TR-001 through PIT-TR-115) covering runtime baseline, frontend architecture, routing, auth/session, RBAC, data model (21 canonical tables), RLS design, API/Edge Functions (8 functions), AIMC (4 capabilities), notifications, evidence storage, Gantt, reporting, audit log, QA dashboard, performance, security, observability, error handling, deployment/secrets, tool validation, and MMM controls L-001–L-008. FRS-to-TRS traceability covers all 112 FRS requirements, 10 NF placeholders, and 8 MMM controls. Stage 4 approval is BLOCKED until Stage 3 and Stage 2 are CS2-approved. Stage 5 Architecture remains blocked. Build Authorization remains NOT CLEARED.

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

**Current Stage**: Stage 4 ACTIVE — TRS Draft Created (maturion-isms#1554); Stage 3 FRS DRAFT_CREATED pending CS2 approval; Stage 2 FOREMAN_REVIEWED pending CS2 approval
**Overall Progress**: ~35% complete (Stage 1 App Description approved; Stage 2 Foreman-reviewed pending CS2; Stage 3 FRS draft created pending CS2; Stage 4 TRS draft created pending upstream CS2 approvals; Architecture substantially IN_PROGRESS)
**Blockers**: Stage 4 TRS approval BLOCKED until Stage 2 UX Spec and Stage 3 FRS are CS2-approved (maturion-isms#1548). Stage 5 Architecture gate-pass BLOCKED until Stage 4 TRS is approved. Build Authorization NOT CLEARED — implementation blocked until Stages 4–11 completed and gate-passed.
**Next Steps**:
1. CS2 review and approval of Stage 2 UX Workflow & Wiring Spec (maturion-isms#1548)
2. CS2 review and approval of Stage 3 FRS (maturion-isms#1548)
3. CS2 review and approval of Stage 4 TRS (maturion-isms#1554) — after upstream approvals
4. Formally gate-pass Stage 5 (Architecture — rich content already exists, needs upstream approvals first)
5. Complete Stages 6–11 before Build Authorization can be requested
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

- [x] Stage 1 App Description: CS2_APPROVED_AUTHORITATIVE (2026-05-06)
- [x] Stage 2 UX Workflow & Wiring Spec: STAGE_2_COMPLETE_FOREMAN_REVIEWED (maturion-isms#1548) — pending CS2 approval
- [x] Stage 3 FRS: DRAFT_CREATED (maturion-isms#1548) — pending CS2 approval
- [x] Stage 4 TRS: DRAFT_CREATED (maturion-isms#1554) — pending upstream CS2 approvals (Stage 2 and Stage 3)
- [ ] Traceability chain: App Description ✅ → UX Workflow (FOREMAN_REVIEWED) → FRS (DRAFT_CREATED) → TRS (DRAFT_CREATED) → Architecture (gate-pass pending)
- [x] Stage 1 approval obtained — Johan Ras / CS2 approved 2026-05-06 (ref: maturion-isms#1540)
- [x] Build Authorization: NOT CLEARED — implementation blocked until Stages 3–11 complete
- [x] Evidence artifacts created for Stage 1 (checklist at `.agent-admin/evidence/app-description-checklist/pit-20260506.md`)
- [x] Stage 2 completion evidence: `.agent-admin/evidence/stage2-completion-checklist/pit-stage2-20260506.md`
- [x] Stage 3 FRS artifact created: `modules/pit/02-frs/functional-requirements.md`
- [x] Module manifest updated (module_name corrected to "PIT (Project Implementation Tracker)")
- [x] Stage 2 upgrade checklist evidence at `.agent-admin/evidence/stage2-upgrade-checklist/pit-stage2-20260506.md`

---

## Notes and Observations

**Stage 2 Foreman-Reviewed (2026-05-06)**: All 13 Stage 2 completion criteria verified per maturion-isms#1548. UX Workflow & Wiring Spec v0.2-draft satisfies all requirements: derivation statement, L-001–L-008 carry-forward, 23 user journeys including all auth flows, My Work and Invitation Acceptance, 21 primary screens, 5-state UI matrix, 7 top indicators, app shell, timeline wiring, screen-to-data wiring table, AIMC touchpoints, deployment surface map. Status: STAGE_2_COMPLETE_FOREMAN_REVIEWED pending CS2 approval.

**Stage 3 FRS Draft Created (2026-05-06)**: Stage 3 FRS v0.1-draft created per maturion-isms#1548. Derived from App Description v1.0 and UX Workflow & Wiring Spec v0.2-draft. 112 functional requirements (PIT-FR-001 through PIT-FR-112) with acceptance criteria and traceability matrix. PIT-FR-106–109 add admin sub-screen coverage (Role Management, Notification Templates, Task Cluster Templates, Invitation Settings). PIT-FR-110 adds Invitation Acceptance screen (§UX-S-20). PIT-FR-111–112 add My Work screen and task actions (§UX-J-23, §UX-S-21). PIT-FR-088 updated to include `cs2_admin` in audit export permission. PIT-FR-101 updated to use `cs2_admin` for cross-org visibility. Prescriptive Supabase/RLS/Vercel wording softened to functional outcomes; implementation details deferred to TRS. Status: DRAFT_CREATED pending CS2 approval. Stage 4 TRS remains blocked until Stage 3 FRS is approved.

**Stage 1 App Description Filed (2026-05-06)**: App Description v1.0-draft created per
maturion-isms#1534 delegation from Foreman to pit-specialist. Module name corrected from
"Penetration Intelligence Tool" to "Project Implementation Tracker". Source prepared by
CS2/Johan + assistant-assisted drafting under Johan Ras direction. MMM Lessons Promoted Into PIT
section added (L-001–L-008 + Stage 2 carry-forward requirements).
Improvement register created at `modules/pit/_readiness/pit-build-process-improvement-register.md`.

**Stage 1 App Description CS2 Approved (2026-05-06)**: CS2/Johan Ras reviewed and approved Stage 1
App Description per maturion-isms#1540. Status changed from Draft to Authoritative (v1.0). Stage 2
(UX Workflow & Wiring Spec) authorised. Build Authorization remains NOT CLEARED — implementation
blocked until Stages 2–11 completed and gate-passed.

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
