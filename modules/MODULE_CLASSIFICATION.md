# Module Classification — Canonical 12-Stage Pre-Build Stage Model

**Document Type**: Governance Alignment Artifact  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Version**: 1.1.0  
**Effective Date**: 2026-04-06  
**Last Amended**: 2026-04-07 (CS2 Direction — MAT and Maturity Roadmap classified CLOSED)  
**Produced By**: governance-liaison-isms-agent (wave: align-12stage-prebuild-20260406)  
**Issue Reference**: [maturion-isms#1255](https://github.com/APGI-cmy/maturion-isms/issues/1255)  
**Canon Reference**: [`governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md`](../governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md) v1.0.0

---

## 1. Purpose

This document classifies every Maturion module against the canonical 12-Stage Pre-Build Stage
Model defined in `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05).

All non-MAT module `BUILD_PROGRESS_TRACKER.md` files were migrated from the legacy 6-stage
format to the canonical 12-stage format as part of wave **align-12stage-prebuild-20260406**.
`modules/mat/BUILD_PROGRESS_TRACKER.md` is left as a legacy artefact — MAT is formally CLOSED
per CS2 Direction 2026-04-07 (see §8). `modules/maturity-roadmap/BUILD_PROGRESS_TRACKER.md`
was migrated to 12-stage in this wave prior to the CS2 Direction; no further stages will be
progressed as Maturity Roadmap is also CLOSED.

---

## 2. The Canonical 12-Stage Pre-Build Model

Per [`governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md`](../governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md) v1.0.0:

> **App Description → UX Workflow & Wiring Spec → FRS → TRS → Architecture → QA-to-Red → PBFAG → Implementation Plan → Builder Checklist → IAA Pre-Brief → Builder Appointment → Build**

| Stage | Name | Gate Type |
|-------|------|-----------|
| 1 | App Description | Deliverable |
| 2 | UX Workflow & Wiring Spec | Deliverable |
| 3 | Functional Requirements Specification (FRS) | Deliverable |
| 4 | Technical Requirements Specification (TRS) | Deliverable |
| 5 | Architecture | Deliverable |
| 6 | QA-to-Red | Deliverable |
| 7 | PBFAG (Pre-Build Functionality Assessment Gate) | Hard Gate |
| 8 | Implementation Plan | Deliverable |
| 9 | Builder Checklist | Hard Gate |
| 10 | IAA Pre-Brief | Deliverable |
| 11 | Builder Appointment | Appointment |
| 12 | Build | Execution |

No stage may be skipped. Stage order must be respected unless explicitly documented and CS2-approved.

---

## 3. Module Classification Table

| Module | Classification | Reason | Retrofit Scope |
|--------|----------------|--------|----------------|
| MAT | CLOSED | MAT (Manual Audit Tool) is formally closed. Superseded by MMM (Maturity Model Management), which is the convergence of MAT + Maturity Roadmap. MAT survives as a harvest source and decommission reference only. No new build work will be performed. Authority: CS2 Direction 2026-04-07. | Legacy artefacts preserved as-is. `modules/mat/BUILD_PROGRESS_TRACKER.md` is not modified — left as legacy artefact. No further stage progression required. |
| MMM | ACTIVE — RETROFIT NOW | MMM has App Description (`MMM_app_description.md`), Architecture (`architecture.md` + `capabilities/`), and AIMC wiring service (`src/services/aimc-wiring.ts`). Significant pre-build and integration work exists. Header anomaly corrected (tracker was wrongly labeled "Risk Management"). | Old stages 0–5 mapped to 12-stage. Stage 1 COMPLETE (App Description). Stage 5 IN_PROGRESS (Architecture). Stages 2, 3, 4, 6, 7, 8, 9, 10 NOT_STARTED. Stage 12 has partial AIMC integration artifact. |
| amc | ACTIVE — FRESH START ON NEXT STAGE | AMC has App Description and governance foundation complete. Build waves defined but not started. No FRS or Architecture content populated. | Stage 1 COMPLETE. All other stages NOT_STARTED. 12-stage lifecycle section added above existing Build Waves section (waves preserved). |
| course-crafter | ACTIVE — RETROFIT NOW | Course Crafter has substantial Architecture content (`architecture.md`, `data-contracts/`, `exports/`, `integrations/`, `qa/`, `ui-ux/` folders). Full architecture structure is the most complete outside MAT/PIT. App Description folder is empty — anomaly noted. | Old stages mapped to 12-stage. Stage 1 NOT_STARTED (no app-description.md found — anomaly). Stage 5 IN_PROGRESS (Architecture populated). All other stages NOT_STARTED. |
| incident-intelligence | ACTIVE — FRESH START ON NEXT STAGE | Incident Intelligence has App Description (`app-description.md`) but FRS and Architecture folders contain only stub content. No implementation work. | Stage 1 COMPLETE. All other stages NOT_STARTED. |
| isms | ACTIVE — RETROFIT NOW | ISMS has Architecture content (`architecture.md` + `integrations/` folder). Architecture work is in progress. App Description folder is empty — anomaly noted. | Old stages mapped to 12-stage. Stage 1 NOT_STARTED (no app-description.md found). Stage 5 IN_PROGRESS (Architecture populated). All other stages NOT_STARTED. |
| maturity-roadmap | CLOSED | Maturity Roadmap is formally closed. Superseded by MMM (Maturity Model Management), which is the convergence of MAT + Maturity Roadmap. Maturity Roadmap survives as a harvest source and decommission reference only. No new build work will be performed. `BUILD_PROGRESS_TRACKER.md` was migrated to 12-stage in this wave prior to CS2 Direction 2026-04-07. Authority: CS2 Direction 2026-04-07. | `BUILD_PROGRESS_TRACKER.md` migrated to 12-stage format in this wave (prior to CS2 Direction). No further stage progression required. |
| pit | ACTIVE — RETROFIT NOW | PIT has the most complete architecture outside MAT: `architecture.md`, `data-contracts/`, `exports/`, `integrations/`, `qa/`, `ui-ux/`, `watchdog/`, `_legacy/`. Also has AIMC wiring service and governance notes. App Description folder is empty — anomaly noted. | Old stages mapped to 12-stage. Stage 1 NOT_STARTED (no app-description.md found). Stage 5 IN_PROGRESS (full Architecture structure). All other stages NOT_STARTED. Stage 12 has AIMC integration artifact. |
| risk-management | ACTIVE — RETROFIT NOW | Risk Management has Architecture (`architecture.md` + `capabilities/`) and AIMC wiring service from Wave 9.6. App Description folder is empty — anomaly noted. Note: MMM tracker was wrongly assigned risk-management content — anomaly corrected. | Old stages mapped to 12-stage. Stage 1 NOT_STARTED (no app-description.md found). Stage 5 IN_PROGRESS (Architecture populated). All other stages NOT_STARTED. Stage 12 has AIMC integration artifact. |
| xdetect | ACTIVE — FRESH START ON NEXT STAGE | xDetect has App Description (`app-description.md`) and AIMC wiring service from Wave 9.6, but Architecture and FRS folders are empty. AIMC service is an integration artifact, not a core build stage deliverable. | Stage 1 COMPLETE. All other stages NOT_STARTED. Stage 12 notes AIMC integration artifact. |
| ai-centre (packages) | ACTIVE — RETROFIT NOW | AI Centre has multiple completed build waves (1–5, 7, 9.1–9.7) with GREEN tests. Most advanced package in the ecosystem. Build was executed prior to 12-stage model formalisation. | 12-stage lifecycle section added at top. Stages 1–11 COMPLETE (retrospective mapping of pre-model build). Stage 12 IN_PROGRESS (Waves 1–5, 7, 9.1–9.7 complete; Waves 9.8, 9.9, 9.10 pending). Existing Build Waves section preserved. |

---

## 4. Classification Definitions

### ACTIVE — RETROFIT NOW

The module has work in progress across one or more pre-build stages that must be mapped to the
12-stage model immediately. The module's `BUILD_PROGRESS_TRACKER.md` has been updated to reflect
the new stage numbers with a Stage Migration Note documenting the mapping.

**What was done**: Old stages mapped to new stage numbers. Stages with existing content are
marked COMPLETE or IN_PROGRESS with notes identifying the artifacts. Stages without corresponding
work are marked NOT_STARTED. New stages introduced by the 12-stage model (Stages 2, 6, 7, 9, 10)
are marked NOT_STARTED.

### ACTIVE — FRESH START ON NEXT STAGE

The module has an App Description (or equivalent early-stage work) but limited further
development. The module adopts the 12-stage model from this point forward.

**What was done**: Stage 1 (App Description) marked COMPLETE if `app-description.md` (or
equivalent) exists. All subsequent stages marked NOT_STARTED. Future work proceeds through
stages in order per `PRE_BUILD_STAGE_MODEL_CANON.md`.

### HISTORICAL/FROZEN

No modules were classified as HISTORICAL/FROZEN in this wave. All modules in the Maturion
ecosystem are active, in early-stage planning, or formally CLOSED.

### CLOSED

The module has been formally closed by CS2 authority and will not receive further build work.
The module survives as a harvest source and decommission reference only.

**What was done**: Module classified CLOSED. `BUILD_PROGRESS_TRACKER.md` is left as a legacy
artefact (or migrated to 12-stage if migration occurred prior to the closure decision). No
further stage progression will be performed.

---

## 5. Anomalies Resolved in This Wave

### Anomaly 1: MMM Module Tracker Had Wrong Header (CORRECTED)

**Issue**: `modules/MMM/BUILD_PROGRESS_TRACKER.md` contained content referencing "Risk Management"
as the module name and `risk-management` as the module slug. This was a copy-paste error from
the original governance layer-down when the MMM module was first created.

**Resolution**: MMM tracker header corrected to reference "MMM (Maturity Model Management)" as
the module name and `mmm` as the module slug. The separate
`modules/risk-management/BUILD_PROGRESS_TRACKER.md` (correct version) is unaffected.

### Anomaly 2: Old Stage Model (6-Stage) Used Across All Non-MAT/Non-AMC/Non-ai-centre Modules (CORRECTED)

**Issue**: All non-MAT, non-AMC, non-ai-centre module trackers used a 6-stage model (Stage 0–5)
that predates `PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05).

**Resolution**: All affected trackers migrated to the canonical 12-stage format. Stage migration
notes in each tracker document the old-to-new stage mapping.

### Anomaly 3: App Description Files Missing for RETROFIT NOW Modules (FLAGGED — NOT YET RESOLVED)

**Issue**: Several RETROFIT NOW modules have Architecture content but no App Description file in
their `00-app-description/` folder. This violates the requirement that Stage 1 (App Description)
precedes Stage 5 (Architecture) in the canonical sequence.

**Affected modules**: course-crafter, isms, pit, risk-management.

**Action Required**: These modules must create App Description files (`app-description.md`) in
their `00-app-description/` folder before proceeding to Stage 2 (UX Workflow & Wiring Spec).
The existing Architecture work will be preserved but the sequence gap must be closed.

**Owner**: Foreman — escalate to CS2 if App Description production scope requires builder delegation.

---

## 6. Instructions for Future Work

All future work on any Maturion module MUST use the 12-stage model defined in
[`governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md`](../governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md) v1.0.0.

1. **New modules**: Start at Stage 1 (App Description). Progress in order. No skipping.
2. **RETROFIT NOW modules**: Continue from the current stage. Stages already marked COMPLETE or
   IN_PROGRESS remain at that status.
3. **FRESH START modules**: Next work item is Stage 1 completion (App Description) if NOT_STARTED,
   or Stage 2 (UX Workflow & Wiring Spec) if Stage 1 is COMPLETE.
4. **Template**: Use `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md` for any new
   module trackers.
5. **Stage completion**: All stage completions require approval by the designated authority per
   individual stage requirements in `PRE_BUILD_STAGE_MODEL_CANON.md`.
6. **Tracker updates**: Update the module `BUILD_PROGRESS_TRACKER.md` at each stage gate. Do
   not mark a stage COMPLETE until the gate conditions in `PRE_BUILD_STAGE_MODEL_CANON.md` are met.

---

## 7. Related Governance Documents

- [`governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md`](../governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md) v1.0.0 — Canonical stage model definition
- [`governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`](../governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md) — Template for new trackers
- [`modules/MODULE_MIGRATION_MAP.md`](MODULE_MIGRATION_MAP.md) — Legacy module migration map
- [maturion-isms#1255](https://github.com/APGI-cmy/maturion-isms/issues/1255) — CS2 authorization for this alignment wave

---

## 8. CS2 Direction — 2026-04-07

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Date**: 2026-04-07  
**Reference**: PR comment — maturion-isms PR (copilot/align-live-maturation-artifacts)

MAT (Manual Audit Tool) is formally closed. It is superseded by MMM (Maturity Model Management),
which is the convergence of MAT + Maturity Roadmap. MAT and Maturity Roadmap survive as harvest
sources and decommission references only. No new build work will be performed in either module.

**Directives applied in v1.1.0:**

1. MAT classified as **CLOSED** in this document (§3 table).
2. Maturity Roadmap classified as **CLOSED** in this document (§3 table).
3. Task B (MAT `BUILD_PROGRESS_TRACKER.md` update) cancelled — not required for a closing module.
4. MAT tracker files left as legacy artefacts — not modified.
5. All other tracker updates and `MODULE_CLASSIFICATION.md` proceed as specified.

---

*Produced by governance-liaison-isms-agent | Wave: align-12stage-prebuild-20260406 | 2026-04-06*  
*Amended 2026-04-07: CS2 Direction — MAT and Maturity Roadmap classified CLOSED (v1.1.0)*  
*Authority: CS2 (Johan Ras / @APGI-cmy) | Canon: PRE_BUILD_STAGE_MODEL_CANON.md v1.0.0*
