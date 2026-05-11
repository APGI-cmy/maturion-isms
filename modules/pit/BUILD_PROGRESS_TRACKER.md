# BUILD PROGRESS TRACKER

**Module**: PIT (Project Implementation Tracker)  
**Module Slug**: pit  
**Last Updated**: 2026-05-11
**Updated By**: foreman-v2-agent (issue #1604 Stage 4 TRS re-confirmation wave)
> **Classification**: ACTIVE — RETROFIT COMPLETE — PENDING CS2 RE-CONFIRMATION  
> **Canon Reference**: `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05)  
> **Governing Issue**: [maturion-isms#1255](https://github.com/APGI-cmy/maturion-isms/issues/1255)
> **Retrofit Issue**: [maturion-isms#1575](https://github.com/APGI-cmy/maturion-isms/issues/1575) — PIT pre-build functional delivery retrofit (PR #1576)

---

## Stage Migration Note

This tracker was migrated from the legacy 6-stage format to the canonical 12-stage format
per wave `align-12stage-prebuild-20260406` (2026-04-06).

**Anomaly Flagged (RESOLVED)**: At migration time (2026-04-06), the `00-app-description/` folder was empty (no `app-description.md` found). This has since been resolved: App Description v1.0 was created per maturion-isms#1534 and approved by CS2/Johan Ras on 2026-05-06 per maturion-isms#1540. The Architecture work (`architecture.md`, `data-contracts/`, `exports/`, `integrations/`, `qa/`, `ui-ux/`, `watchdog/`, `_legacy/`) is preserved and will be gate-passed after the canonical upstream stages are completed.

**Old → New Stage Mapping**:
| Old Stage | Old Name | New Stage | New Name | Status |
|-----------|----------|-----------|----------|--------|
| Stage 0 | App Description | Stage 1 | App Description | CS2_APPROVED_AUTHORITATIVE |
| Stage 1 | FRS | Stage 3 | FRS | DRAFT_HARDENED v0.2 (pending CS2 approval) |
| Stage 1.5 | TRS | Stage 4 | TRS | DRAFT_CREATED |
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
**Status**: [x] CS2_APPROVED_RECONFIRMED (Johan/CS2) — baseline locked for Stage 4/5 derivation  
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
- [x] Functional delivery retrofit verification added (Section 12 — maturion-isms#1575)
- [x] UX-GAP-001 resolved (404 route state/wiring entries present in Section 4 and Section 7)
- [x] UX-GAP-002 resolved (notification history screen spec `/notifications` added in Section 2, Section 4, Section 7, and Section 9 — PR #1594)
- [x] CS2 approval/re-confirmation recorded by Johan/CS2 in tracker context
- [x] Stage 2 re-confirmed after retrofit review (maturion-isms#1575)

**Completion Date**: 2026-05-11 (CS2 re-confirmation recorded; originally Foreman-reviewed 2026-05-06)  
**Stage 2 Completion Evidence**: `.agent-admin/evidence/stage2-completion-checklist/pit-stage2-20260506.md`  
**Retrofit Gap Register**: `modules/pit/_readiness/pit-functional-delivery-gap-register.md` (UX-GAP-001, UX-GAP-002)  
**Notes**: Stage 2 UX Workflow & Wiring Spec v0.2-draft reviewed in retrofit wave (maturion-isms#1575). UX-GAP-001 and UX-GAP-002 resolved in PR #1594. CS2/Johan re-confirmation is now recorded. Build Authorization remains NOT CLEARED.
---

### Stage 3: Functional Requirements Specification (FRS)
**Status**: [x] DRAFT_HARDENED_CS2_RECONFIRMED — baseline locked for Stage 4/5 derivation  
**Location**: `modules/pit/02-frs/`  
**Key Artifacts**:
- [x] `functional-requirements.md` — Stage 3 FRS **v0.2-hardened**, derived from App Description v1.0 + UX Workflow & Wiring Spec v0.2-draft
- [x] Derivation statements from both upstream artifacts included
- [x] Numbered functional requirements (PIT-FR-001 through PIT-FR-123) — testable, phrased as "The system shall..."
- [x] Auth/onboarding, all primary screens, 5 UI states, project hierarchy, timeline, evidence, assignment, watchdog, reporting, audit, QA dashboard, AIMC, cross-module integrations covered
- [x] Acceptance criteria for every requirement or requirement group
- [x] Traceability matrix (App Description → Stage 2 → FRS requirement ID → future stage placeholder)
- [x] Domain-based Requirement Index added (§1.5)
- [x] Table/entity naming caveat added (§1.4)
- [x] Role-scope matrix added (§3.1)
- [x] PIT-FR-113 Permission Negative-Path Contract added
- [x] PIT-FR-121 Lifecycle Removal Semantics (archive/delete/restore/cancel) added
- [x] PIT-FR-054 task status lifecycle updated (added `cancelled`)
- [x] PIT-FR-052 evidence completion logic clarified (task-level and deliverable-level paths)
- [x] PIT-FR-114 Progress Roll-Up Method added
- [x] RAG Threshold Central Table added (§29)
- [x] PIT-FR-115–117 Notification read/history/preference requirements added
- [x] PIT-FR-118–119 Report permissions/states/history scope hardened (report history now mandatory)
- [x] PIT-FR-120 QA Dashboard expanded requirements added
- [x] AIMC endpoint candidate wording added (§24)
- [x] Route Coverage Appendix added (Appendix A — all 27 routes)
- [x] PIT-FR-122 Minimum Accessibility Outcomes added
- [x] PIT-FR-123 Bulk Operations Non-Scope Declaration added
- [x] Section 33 Build-Completeness Guardrails added
- [x] Section 34 QA-to-Red Derivation Requirements added
- [x] Section 38 Stage 4 readiness wording aligned with draft-only TRS governance
- [x] Functional delivery retrofit verification note added (maturion-isms#1575)
- [x] CS2 approval/re-confirmation recorded by Johan/CS2 in tracker context
- [x] Stage 3 re-confirmed after retrofit review (maturion-isms#1575)

**Completion Date**: 2026-05-11 (CS2 re-confirmation recorded; draft hardened 2026-05-07)  
**Notes**: FRS v0.2-hardened verified in retrofit wave (maturion-isms#1575). All 19 hardening areas confirmed present. CS2/Johan re-confirmation now recorded. Build Authorization remains NOT CLEARED.

---

### Stage 4: Technical Requirements Specification (TRS)
**Status**: [x] DRAFT_UPDATED — timeline-engine technical feasibility validation completed; **READY_FOR_CS2_REVIEW**  
**Location**: `modules/pit/03-trs/`  
**Key Artifacts**:
- [x] `technical-requirements-specification.md` — Technical constraints, performance requirements, integration requirements, AIMC contracts, RLS design, table definitions, Edge Function contracts (PIT-TR-001 to PIT-TR-126)
- [x] `frs-to-trs-traceability.md` — Traceability matrix linking all **123 FRS requirements** and 10 NF placeholders to TRS requirements across 32 domains
- [x] `timeline-engine-technical-validation.md` — Stage 4 timeline engine technical validation + legacy Action tracker coverage/gap classification evidence
- [x] FRS v0.2-hardened propagation complete — PIT-TR-116 through PIT-TR-126 added (Section 31 of TRS) — covers PIT-FR-113 to PIT-FR-123
- [x] TRS derivation updated to reference FRS v0.2-hardened (maturion-isms#1556) — no longer derives from v0.1-draft
- [x] FRS-to-TRS traceability Section 30 added — all 123 FRS requirements now traced
- [x] Tool validation and quality gate definitions — included in `technical-requirements-specification.md` (Section 25, PIT-TR-100 to PIT-TR-107)
- [x] Stale maturion-isms#1556 dependency notice resolved in retrofit wave (maturion-isms#1575 / PR #1576)
- [ ] TRS approved by designated authority — pending CS2 Stage 4 approval/re-confirmation
- [x] TRS re-confirmation preparation completed after retrofit review (maturion-isms#1575) with explicit timeline-engine feasibility validation (maturion-isms#1604)

**Completion Date**: N/A — Draft updated 2026-05-11 for Stage 4 CS2 review package  
**Notes**: TRS v0.1-draft created per maturion-isms#1554 (wave: pit-stage4-trs). Updated to v0.2-draft in retrofit wave (maturion-isms#1575 / PR #1576): derivation updated to FRS v0.2-hardened; Section 31 added with PIT-TR-116 through PIT-TR-126 covering all FRS v0.2-hardened additions (PIT-FR-113 to PIT-FR-123); FRS-to-TRS traceability updated to cover all 123 FRS requirements. This wave adds explicit timeline-engine technical feasibility contracts (rendering model constraints, tool-selection criteria, date-math/alignment, interaction/persistence, performance, and Stage 6 QA obligations) plus legacy Action tracker requirement coverage/gap classification evidence. Stage 5 Architecture remains blocked until Stage 4 is CS2-approved/gate-passed. Build Authorization remains NOT CLEARED.

---

### Stage 5: Architecture
**Status**: [ ] BLOCKED — awaiting upstream Stage 2, 3, and 4 approvals  
**Location**: `modules/pit/04-architecture/`  
**Key Artifacts**:
- [x] `architecture.md` — Architecture document exists (legacy content — not gate-passed)
- [x] `data-contracts/` — Data contracts folder exists
- [x] `exports/` — Exports folder exists
- [x] `integrations/` — Integrations folder exists
- [x] `qa/` — QA strategy folder exists
- [x] `ui-ux/` — UI/UX specifications folder exists
- [x] `watchdog/` — Watchdog/monitoring folder exists
- [x] `_legacy/` — Legacy architecture reference folder exists
- [ ] Architecture formally reconciled against all upstream approved artifacts (see reconciliation checklist below)
- [ ] All TRS requirements (PIT-TR-001 to PIT-TR-126) traceable to architecture components
- [ ] Architecture completeness checklist per `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` PASS
- [ ] Architecture approved by designated authority

**Stage 5 Reconciliation Requirements (added in retrofit wave maturion-isms#1575)**:

Before Stage 5 Architecture can be gate-passed, it must be formally reconciled against ALL of the following:

- [ ] Approved Stage 1 App Description (`docs/governance/PIT_APP_DESCRIPTION.md` v1.0)
- [ ] CS2-approved Stage 2 UX Workflow & Wiring Spec (including UX-GAP-001 and UX-GAP-002 resolved)
- [ ] CS2-approved Stage 3 FRS v0.2-hardened (all 123 requirements, including PIT-FR-113 to PIT-FR-123)
- [ ] Updated Stage 4 TRS v0.2-draft (including PIT-TR-116 to PIT-TR-126)
- [ ] Route Coverage Appendix A (all 27 routes — component-level architecture for each route)
- [ ] RLS / access-control model (all tables with RLS policies per PIT-TR-026; negative-path enforcement per PIT-TR-116)
- [ ] Evidence upload / storage model (Supabase Storage per PIT-TR-060; retention per PIT-TR-122)
- [ ] Notification / report / audit / QA dashboard model (system-level component architecture for each domain)
- [ ] Deployment / runtime delivery contract (per PIT-TR-095, PIT-TR-098, PIT-TR-113)
- [ ] MMM-derived functional delivery controls (L-001 through L-008 mapped to architecture components)
- [ ] Lifecycle removal semantics architecture (soft-delete, archive, restore, cancel — per PIT-TR-124)
- [ ] Accessibility compliance architecture (Axe-core integration per PIT-TR-125)
- [ ] Progress roll-up computation architecture (Edge Function or trigger per PIT-TR-117)

**Completion Date**: N/A  
**Notes**: PIT has the most complete architecture structure alongside Course Crafter. Full architecture structure is populated. The existing content is rich but was created under the legacy 6-stage model and has not been gate-passed under the canonical 12-stage chain. Formal gate-pass requires upstream stages (App Description → UX → FRS → TRS) to be completed and CS2-approved first, followed by formal reconciliation against all Stage 5 reconciliation requirements listed above. Mapped from old Stage 2. Build Authorization remains NOT CLEARED.

---

### Stage 6: QA-to-Red
**Status**: [ ] NOT_STARTED  
**Location**: `modules/pit/05-qa-to-red/`  
**Key Artifacts**:
- [ ] Full RED test suite derived from all 123 FRS requirements + all 126 TRS requirements + Architecture
- [ ] Coverage of all user journeys from Stage 2 (23 journeys)
- [ ] QA Catalog alignment confirmed
- [ ] RED QA suite signed off by Foreman

**Functional-Delivery Guardrails (added maturion-isms#1575 — MANDATORY for Stage 6 gate-pass)**:

Stage 6 must derive RED tests for each of the following categories. Gaps in any category are a Stage 6 gate-fail:

- [ ] Every functional requirement (PIT-FR-001 through PIT-FR-123)
- [ ] Every TRS requirement that specifies a testable contract (PIT-TR-001 through PIT-TR-126)
- [ ] Every route (all 27 routes in Appendix A / Section 9) — direct browser load test per route
- [ ] Every screen (all 22 screens from Stage 2 Section 2)
- [ ] Every primary user journey (all 23 journeys from Stage 2 Section 1)
- [ ] Every five-state UI outcome on every primary screen (loading/empty/permission-denied/network-error/data)
- [ ] Every role-denied path (per PIT-FR-113 / PIT-TR-116): at least one denied-path test per protected action group
- [ ] Every create/edit/delete/archive/cancel/status transition (per PIT-FR-121 / PIT-TR-124)
- [ ] Evidence submission/review/blocking flows (per PIT-FR-062–067 / PIT-TR-060–063)
- [ ] All notification events, mark-as-read, history, preferences (per PIT-FR-115–117 / PIT-TR-118–120)
- [ ] Report export generation/download/history/failure (per PIT-FR-118–119 / PIT-TR-121–122), including denied-path tests
- [ ] All AIMC touchpoints and no-direct-provider-call rule (per PIT-FR-095 / PIT-TR-083)
- [ ] Direct SPA route loads (navigate directly to URL in deployed environment — not just file existence)
- [ ] App-shell and global-style visual rendering checks (per L-002 / PIT-TR-009, PIT-TR-092)
- [ ] Live deployment smoke checks (per L-007 / PIT-TR-114 — in deployed environment, not localhost only)
- [ ] Minimum accessibility outcomes (per PIT-FR-122 / PIT-TR-125): axe-core zero violations, keyboard navigation
- [ ] QA Dashboard evidence visibility (per PIT-FR-120 / PIT-TR-123): cs2_admin can see wave evidence; others denied
- [ ] Progress roll-up computation (per PIT-FR-114 / PIT-TR-117): unit test for computation; E2E for project-level update
- [ ] Lifecycle removal semantics (per PIT-FR-121 / PIT-TR-124): archive/restore/cancel confirmed excluded/included in roll-up

**Completion Date**: N/A  
**Notes**: Not started. New stage in 12-stage model. Stage 6 may not commence until Stage 5 Architecture is gate-passed. All functional-delivery guardrails above are mandatory — not optional extensions.

---

### Stage 7: PBFAG (Pre-Build Functionality Assessment Gate)
**Status**: [ ] NOT_STARTED  
**Location**: `modules/pit/06-pbfag/`  
**Key Artifacts**:
- [ ] PBFAG checklist completed — all checks PASS
- [ ] Change-Propagation Audit complete
- [ ] Runtime/Deployment Contract filed (PIT-TR-098, PIT-TR-113)
- [ ] Golden Path Verification Pack defined

**Functional-Delivery Guardrails (added maturion-isms#1575 — MANDATORY for Stage 7 gate-pass)**:

PBFAG must include all of the following verifications. Any FAIL is a PBFAG gate-fail:

- [ ] Deployed route render verification: all 27 routes render correct component in deployed environment
- [ ] Golden path verification pack: happy-path E2E for all primary journeys (Stage 2 journeys 1–23)
- [ ] Visual rendering / app-shell / global CSS checks: no white screens, no layout flash, app shell renders in all 5 states
- [ ] Auth / signup / invite / reset / onboarding checks: all auth routes functional in deployed environment
- [ ] Role permission negative-path spot checks (per PIT-TR-116): at least 3 denied-path verifications in deployed environment
- [ ] Evidence workflow check: upload → review → approve/return cycle functional end-to-end
- [ ] Report export check: at least one report type can be generated, downloaded, and permission-denied verified
- [ ] Notification check: trigger notification → bell badge → mark-as-read cycle functional
- [ ] Audit evidence check: audit log records a representative event; export functional
- [ ] Deployment contract check (per PIT-TR-113): deployment contract document filed and current
- [ ] No unresolved FRS/TRS open assumptions that would block functionality
- [ ] No build-authorisation leakage: confirm Build Authorization is NOT CLEARED unless CS2 has explicitly cleared it

**Completion Date**: N/A  
**Notes**: Not started. New hard gate in 12-stage model. PBFAG cannot commence until Stages 1–6 are gate-passed.

---

### Stage 8: Implementation Plan
**Status**: [ ] NOT_STARTED  
**Location**: `modules/pit/07-implementation-plan/`  
**Key Artifacts**:
- [ ] `implementation-plan.md` — Delivery wave breakdown with explicit scope per wave

**Functional-Delivery Guardrails (added maturion-isms#1575 — MANDATORY for Stage 8 gate-pass)**:

The implementation plan must satisfy all of the following. Any gap is a Stage 8 gate-fail:

- [ ] Work sequenced by functional slices (screens/journeys/domains), not only files/components
- [ ] Acceptance evidence defined per wave: what must be demonstrably GREEN before the wave is closed
- [ ] Route/page/state coverage identified per wave: which routes and screens are completed per wave
- [ ] UI/runtime verification required per wave: each wave must include a deployed-environment smoke check
- [ ] Negative-path and denied-path work explicitly included in at least one wave per protected domain
- [ ] Data/notification/audit/report evidence work explicitly scheduled as first-class wave scope
- [ ] No placeholder/TBD scope: every wave has fully specified acceptance criteria before the wave begins
- [ ] Rollback expectations documented: what is the rollback plan if a wave fails
- [ ] Handover expectations documented: what evidence must be filed at the end of each wave

**Completion Date**: N/A  
**Notes**: Folder exists but not yet populated. Mapped from old Stage 3.

---

### Stage 9: Builder Checklist
**Status**: [ ] NOT_STARTED  
**Location**: `modules/pit/08-builder-checklist/`  
**Key Artifacts**:
- [ ] Builder Checklist completed for each builder candidate

**Functional-Delivery Guardrails (added maturion-isms#1575 — MANDATORY for Stage 9 gate-pass)**:

The builder checklist must verify that each builder candidate understands and acknowledges:

- [ ] Stage 1–4 authority chain: builder has read App Description v1.0, UX Spec v0.2-draft, FRS v0.2-hardened, TRS v0.2-draft
- [ ] All route/screen/state obligations: builder can enumerate all 27 routes and all 5 UI states for primary screens
- [ ] RLS/access model: builder understands RLS-first enforcement and the role hierarchy (PIT-TR-023–026)
- [ ] Visual rendering and app-shell obligations: builder acknowledges L-002 (app shell in all states, no white screen)
- [ ] Evidence/report/audit/notification obligations: builder understands all evidence, report, audit, and notification requirements
- [ ] QA-to-Red expectations: builder understands and accepts the RED test suite as the source of truth
- [ ] No direct AIMC provider calls: builder acknowledges the no-direct-provider-call rule (PIT-TR-083)
- [ ] No build without Stage 11 appointment and Build Authorization: builder acknowledges Build Authorization is NOT CLEARED unless explicitly cleared by CS2

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

**Functional-Delivery Guardrails (added maturion-isms#1575 — MANDATORY for Stage 10)**:

The IAA Pre-Brief must include:

- [ ] Complete Stage 1–9 artifact pack submitted to IAA
- [ ] Known MMM/PIT delivery risks declared (see `modules/pit/_readiness/pit-functional-delivery-gap-register.md`)
- [ ] Visual/rendering risk controls declared: how will app shell completeness and white-screen prevention be verified?
- [ ] Route/auth/onboarding risk controls declared: how will all 27 routes be verified in deployed environment?
- [ ] Denied-path risk controls declared: how will negative-path failures be detected before handover?
- [ ] Live deployment/PBFAG evidence expectations agreed between IAA and Foreman
- [ ] IAA challenge questions for one-time functional delivery: IAA must state what would cause it to issue a REJECTION-PACKAGE

**Completion Date**: N/A  
**Notes**: Not started. New stage in 12-stage model. Stage 10 IAA Pre-Brief is distinct from the Stage 10 IAA Pre-Brief wave record filed in `.agent-admin/assurance/` — both are required.

---

### Stage 11: Builder Appointment
**Status**: [ ] NOT_STARTED  
**Location**: `modules/pit/10-builder-appointment/`  
**Key Artifacts**:
- [ ] `builder-contract.md` — Explicit builder agent contract
- [ ] Formal appointment issued by Foreman after all Stages 1–10 gate-passed
- [ ] Appointment recorded in module tracker
- [ ] Builder appointed by FM

**Functional-Delivery Guardrails (added maturion-isms#1575 — MANDATORY for Stage 11)**:

Builder appointment must NOT occur unless ALL of the following are satisfied:

- [ ] Stages 1–10 are approved/gate-passed by their respective authorities (CS2 for Stages 1–4; Foreman+CS2 for Stages 5–10)
- [ ] Builder has acknowledged the full functional scope (all 27 routes, all 5 UI states, all role-denied paths)
- [ ] RED tests exist and are understood by the builder (Stage 6 RED suite filed and reviewed)
- [ ] PBFAG has passed (Stage 7 PBFAG PASS recorded)
- [ ] Handover evidence requirements are accepted by the builder (per Stage 12 guardrails below)
- [ ] Build wave scope is frozen: no scope changes after appointment without CS2 approval and new appointment cycle
- [ ] Build Authorization has been explicitly cleared by CS2 (confirmation recorded in this tracker)

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

**Functional-Delivery Guardrails (added maturion-isms#1575 — MANDATORY for Stage 12 completion)**:

Build completion requires ALL of the following evidence categories. Missing any category is a build-completion blocker:

- [ ] GREEN test evidence: 100% passing tests (zero failures, zero skipped, zero todo)
- [ ] Visual runtime evidence: screenshots of key screens in deployed environment confirming no white screens, correct app shell, correct styling
- [ ] Deployed URL evidence: the app is accessible at its deployed URL from outside the development environment
- [ ] Role/permission evidence: confirmed that permission-denied state is rendered for at least 3 protected routes/actions in deployed environment
- [ ] Route coverage evidence: all 27 routes return the correct component in the deployed environment (deployment smoke test)
- [ ] Evidence/report/notification/audit evidence: demonstrated that each of these features is functional in the deployed environment
- [ ] Accessibility smoke evidence: axe-core zero violations and Lighthouse accessibility ≥ 90 in deployed environment
- [ ] CS2 live verification pack: CS2 / Johan Ras has performed live E2E verification in the deployed environment (L3 closure)
- [ ] L1/L2/L3 closure status declared: L1 (tests GREEN), L2 (builder-verified deployed), L3 (CS2-verified deployed) all confirmed
- [ ] No unresolved critical functional gaps: all P0 and P1 FRS requirements verified functional in deployed environment

**Completion Date**: N/A  
**Notes**: Core build not yet started. However, as an artifact of Wave 9.7 AIMC integration
(pre-12-stage), `src/services/aimc-wiring.ts` exists as an AIMC integration component and
`pit-advisor.md` persona exists in `packages/ai-centre/src/agents/`. These are integration
artifacts, not core PIT module build deliverables. Mapped from old Stage 5. Build Authorization
remains NOT CLEARED — Stage 12 cannot begin until Stage 11 Builder Appointment is complete and CS2 has explicitly cleared Build Authorization.

---

## Current Stage Summary

**Current Stage**: Stage 4 ACTIVE — TRS DRAFT_UPDATED and **READY_FOR_CS2_REVIEW** (maturion-isms#1604); Stage 2 UX Workflow & Wiring Spec CS2 re-confirmed; Stage 3 FRS baseline CS2 re-confirmed  
**Retrofit Status**: COMPLETE — maturion-isms#1575 / PR #1576 (2026-05-08)  
**Overall Progress**: ~38% complete (Stage 1 App Description approved; Stage 2 baseline re-confirmed by CS2; Stage 3 baseline re-confirmed by CS2; Stage 4 TRS updated with timeline-engine technical validation and ready for CS2 review; Stage 5 Architecture remains blocked pending Stage 4 gate-pass)  
**Blockers**: Stage 5 Architecture gate-pass BLOCKED until Stage 4 TRS is CS2-approved/gate-passed. Build Authorization NOT CLEARED — implementation blocked until Stages 2–11 are completed, approved, and gate-passed.  
**Next Steps**:
1. CS2 review and approval of Stage 4 TRS package (maturion-isms#1554 / maturion-isms#1575 / maturion-isms#1604)
2. Formally gate-pass Stage 5 Architecture after Stage 4 approval and Stage 5 reconciliation checklist completion
3. Complete Stages 6–11 before Build Authorization can be requested
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

- [x] Stage 1 App Description: CS2_APPROVED_AUTHORITATIVE (2026-05-06) — Functional delivery retrofit review: PASS (no material gaps; retrofit annotation added)
- [x] Stage 2 UX Workflow & Wiring Spec: STAGE_2_COMPLETE_FOREMAN_REVIEWED (maturion-isms#1548) — ready for CS2 re-confirmation after PR #1594 gap closure
- [x] Stage 3 FRS: DRAFT_HARDENED (maturion-isms#1556) — v0.2-hardened, pending CS2 approval; retrofit verification: PASS
- [x] Stage 4 TRS: DRAFT_UPDATED (maturion-isms#1554 + maturion-isms#1575) — v0.2-draft with FRS v0.2-hardened propagation, pending upstream CS2 approvals
- [ ] Traceability chain: App Description ✅ → UX Workflow (FOREMAN_REVIEWED) → FRS (DRAFT_HARDENED) → TRS (DRAFT_UPDATED v0.2) → Architecture (gate-pass pending)
- [x] Stage 1 approval obtained — Johan Ras / CS2 approved 2026-05-06 (ref: maturion-isms#1540)
- [x] Build Authorization: NOT CLEARED — implementation blocked until Stages 2–11 are completed, approved, and gate-passed
- [x] Evidence artifacts created for Stage 1 (checklist at `.agent-admin/evidence/app-description-checklist/pit-20260506.md`)
- [x] Stage 2 completion evidence: `.agent-admin/evidence/stage2-completion-checklist/pit-stage2-20260506.md`
- [x] Stage 3 FRS artifact updated: `modules/pit/02-frs/functional-requirements.md` (v0.2-hardened per maturion-isms#1556)
- [x] Stage 4 TRS artifact updated: `modules/pit/03-trs/technical-requirements-specification.md` (v0.2-draft per maturion-isms#1575 / PR #1576 — PIT-TR-116 to PIT-TR-126 added)
- [x] FRS-to-TRS traceability updated: all 123 FRS requirements now traced (per maturion-isms#1575 / PR #1576)
- [x] Module manifest updated (module_name corrected to "PIT (Project Implementation Tracker)")
- [x] Stage 2 upgrade checklist evidence at `.agent-admin/evidence/stage2-upgrade-checklist/pit-stage2-20260506.md`
- [x] Functional delivery retrofit checklist: `modules/pit/_readiness/functional-delivery-retrofit-checklist.md`
- [x] Functional delivery gap register: `modules/pit/_readiness/pit-functional-delivery-gap-register.md`

**Re-Confirmation Policy (maturion-isms#1575)**: Stages 2, 3, and 4 were reviewed in the functional delivery retrofit wave (maturion-isms#1575 / PR #1576). Any previously confirmed stage must be re-signed only after the retrofit review confirms it meets the upgraded functional-delivery standard. Specifically:
- Stage 2: UX-GAP-001 and UX-GAP-002 resolved in PR #1594; ready for CS2 re-confirmation (not yet approved)
- Stage 3: retrofit verified PASS; DRAFT_HARDENED and ready for CS2 approval after Stage 2 re-confirmation
- Stage 4: retrofit updated to v0.2-draft; re-confirmation requires CS2 approval of upstream stages first

---

## Notes and Observations

**Stage 2 Foreman-Reviewed (2026-05-06)**: All 13 Stage 2 completion criteria verified per maturion-isms#1548. UX Workflow & Wiring Spec v0.2-draft satisfies all requirements: derivation statement, L-001–L-008 carry-forward, 23 user journeys including all auth flows, My Work, and Invitation Acceptance, 22 primary screens, 5-state UI matrix, 7 top indicators, app shell, timeline wiring, screen-to-data wiring table, AIMC touchpoints, deployment surface map, and Notification History coverage as a screen/route/global flow rather than a dedicated journey. Status: STAGE_2_COMPLETE_FOREMAN_REVIEWED and ready for CS2 re-confirmation (not yet approved).

**Stage 3 FRS v0.2-hardened (2026-05-07)**: FRS upgraded from v0.1-draft to v0.2-hardened per maturion-isms#1556 (PR #1557). 19 hardening areas applied: domain-based requirement index, table/entity naming caveat, role-scope matrix, PIT-FR-113 permission negative-path contract, PIT-FR-121 lifecycle removal semantics, PIT-FR-054 task status lifecycle (added `cancelled`), PIT-FR-052 evidence completion logic clarified, PIT-FR-114 progress roll-up method, RAG threshold central table (§29), PIT-FR-115–117 notification read/history/preference, PIT-FR-118–119 report permissions/states/history (history now mandatory), PIT-FR-120 QA Dashboard expanded, AIMC candidate wording (§24), Route Coverage Appendix A (all 27 routes), PIT-FR-122 accessibility outcomes, PIT-FR-123 bulk ops non-scope, §33 Build-Completeness Guardrails, §34 QA-to-Red Derivation Requirements, §38 Stage 4 readiness wording aligned. Total: 123 functional requirements. Stage status: DRAFT_HARDENED pending CS2 approval. Build Authorization remains NOT CLEARED.

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
