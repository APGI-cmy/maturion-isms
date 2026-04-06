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
| 1 | Create MODULE_CLASSIFICATION.md — classify all modules as retrofit/fresh-start/historical | governance-liaison-isms-agent | ❌ BLOCKED | governance-liaison hit 429 rate limit; escalate to CS2 |
| 2 | Update MAT BUILD_PROGRESS_TRACKER.md to 12-stage structure with stage mapping | mat-specialist | ❌ BLOCKED | mat-specialist hit session time limit; research findings documented below |
| 3 | Update PIT BUILD_PROGRESS_TRACKER.md to 12-stage structure | governance-liaison-isms-agent | ❌ BLOCKED | blocked by governance-liaison rate limit |
| 4 | Update maturity-roadmap BUILD_PROGRESS_TRACKER.md to 12-stage structure | governance-liaison-isms-agent | ❌ BLOCKED | blocked by governance-liaison rate limit |
| 5 | Update remaining modules (MMM, amc, course-crafter, incident-intelligence, isms, risk-management, xdetect) BUILD_PROGRESS_TRACKER.md files | governance-liaison-isms-agent | ❌ BLOCKED | blocked by governance-liaison rate limit |
| 6 | Update packages/ai-centre BUILD_PROGRESS_TRACKER.md | governance-liaison-isms-agent | ❌ BLOCKED | blocked by governance-liaison rate limit |

## A-007 HALT — Builder Agents Unavailable

**Status: BLOCKED — HALT-006 TRIGGERED**

Per A-007: governance-liaison-isms-agent hit 429 rate limit; mat-specialist hit session time limit. Self-implementation is not a permitted fallback. Wave is halted pending CS2 resolution.

## mat-specialist Research Findings (for next session)

mat-specialist completed research before timing out. No files were modified. Key findings:
- **Stage 7 (PBFAG)**: COMPLETE — `modules/mat/05-build-evidence/PBFAG-mat-20260313.md` exists, all 13 checks PASSED (2026-03-13)
- **Stage 9 (Builder Checklist)**: COMPLETE (retroactive) — `governance/artifacts/BUILDER_AGENT_FILE_COMPLIANCE_CHECKLIST.md` v1.1.0 created 2026-02-14
- **Stage 10 (IAA Pre-Brief)**: COMPLETE — multiple wave-level pre-briefs exist
- **Stage 11 (Builder Appointment)**: COMPLETE — builder contracts recorded 2026-02-13/14
- **Stage 2 (UX Workflow & Wiring Spec)**: NOT_STARTED — no artifact; MAT predated this stage mandate
- **Stage 12 (Build)**: ACTIVE — multiple waves delivered

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
