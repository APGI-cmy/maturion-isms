# Wave Current Tasks — Align live maturion-isms module artifacts to the canonical 12-stage pre-build model

## Active Wave: align-12stage-prebuild-20260406

wave: align-12stage-prebuild-20260406
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-align-12stage-prebuild-20260406.md

**Wave**: Align live maturion-isms module artifacts to the canonical 12-stage pre-build model
**Session ID**: session-align-12stage-prebuild-20260406
**Date**: 2026-04-06
**Branch**: copilot/align-live-maturation-artifacts
**CS2 Authorization**: maturion-isms#1255 — opened by CS2 (@APGI-cmy) on 2026-04-06, assigned to Copilot and APGI-cmy

---

## Wave Description

Align consumer-repo operating artifacts to the canonical 12-stage pre-build model defined in
`governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 (effective 2026-04-05).

The 12-stage model is:
App Description → UX Workflow & Wiring Spec → FRS → TRS → Architecture → QA-to-Red → PBFAG → Implementation Plan → Builder Checklist → IAA Pre-Brief → Builder Appointment → Build

Active module trackers currently use old shortened stage sequences (Stage 0, Stage 1, Stage 1.5, Stage 2, Stage 2.5, etc.) inconsistent with the canonical model.

### Architecture (FROZEN)
`governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 — canonical stage definitions (immutable).
`governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md` — canonical tracker format.

---

## Outstanding Tasks (update as each is completed)

| # | Task | Builder | Status | PR / Evidence |
|---|------|---------|--------|---------------|
| 1 | Create MODULE_CLASSIFICATION.md — classify all modules as retrofit/fresh-start/historical | governance-liaison-isms-agent | 🔴 PENDING | — |
| 2 | Update MAT BUILD_PROGRESS_TRACKER.md to 12-stage structure with stage mapping | mat-specialist | 🔴 PENDING | — |
| 3 | Update PIT BUILD_PROGRESS_TRACKER.md to 12-stage structure | governance-liaison-isms-agent | 🔴 PENDING | — |
| 4 | Update maturity-roadmap BUILD_PROGRESS_TRACKER.md to 12-stage structure | governance-liaison-isms-agent | 🔴 PENDING | — |
| 5 | Update remaining modules (MMM, amc, course-crafter, incident-intelligence, isms, risk-management, xdetect) BUILD_PROGRESS_TRACKER.md files | governance-liaison-isms-agent | 🔴 PENDING | — |
| 6 | Update packages/ai-centre BUILD_PROGRESS_TRACKER.md | governance-liaison-isms-agent | 🔴 PENDING | — |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| — | PENDING | — |

---

## Wave Completion Gate

- [ ] All tasks above show 🟢 DONE
- [ ] All PRs have ASSURANCE-TOKEN
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval

---

*Wave authorized by CS2 via maturion-isms#1255 (2026-04-06). PRE_BUILD_STAGE_MODEL_CANON.md v1.0.0 is the governing canon for this alignment wave.*
