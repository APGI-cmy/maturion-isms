# ISMS Pre-Build Boundary Alignment Index

Date: 2026-06-24
Authority PR: #1850
Authority artifact: `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md`

## Purpose

This index records that the ISMS pre-build stack has been aligned to the platform/module boundary strategy introduced by PR #1850.

This is documentation and pre-build governance alignment only. It does not implement P2 runtime persistence, PIT linkup, MMM linkup, Risk Management linkup, RADAM / Systems Integration linkup, or any future module runtime work.

## Boundary authority adopted

The adopted operating principle is:

- ISMS owns the public front door, modules overview, public marketing routes, subscription, authentication, onboarding, dashboard, entitlement summary, and entitlement handoff.
- Modules own their runtime surfaces after the entitled handoff.
- ISMS agent must not build PIT, MMM, Risk Management, RADAM / Systems Integration, or future module runtime surfaces.
- Module agents must not build the ISMS platform shell, subscription, authentication, onboarding, dashboard, or shared entitlement handoff.
- Cross-module linkup must be governed before build.

## Implementation block

P2 runtime persistence, PIT/MMM/Risk/RADAM linkup, and future module-linkup implementation are blocked until this pre-build boundary alignment is merged and downstream implementation slices are separately appointed.

## Stage addenda

| Stage artifact | Alignment addendum |
|---|---|
| App Description | `modules/isms/00-app-description/boundary-linkup-alignment-20260624.md` |
| UX / Workflow / Wiring Spec | `modules/isms/prebuild-harvest-package/stage2-ux-wiring-boundary-alignment-20260624.md` |
| FRS | `modules/isms/02-frs/boundary-linkup-alignment-20260624.md` |
| TRS | `modules/isms/03-trs/boundary-linkup-alignment-20260624.md` |
| Architecture | `modules/isms/04-architecture/boundary-linkup-alignment-20260624.md` |
| QA-to-Red | `modules/isms/05-qa-to-red/boundary-linkup-alignment-20260624.md` |
| PBFAG | `modules/isms/06-pbfag/boundary-linkup-alignment-20260624.md` |
| Implementation Plan | `modules/isms/07-implementation-plan/boundary-linkup-alignment-20260624.md` |
| Builder Checklist | `modules/isms/08-builder-checklist/boundary-linkup-alignment-20260624.md` |
| IAA Pre-Brief / record | `modules/isms/prebuild-harvest-package/stage10-iaa-boundary-alignment-20260624.md` |
| Tracker | `modules/isms/BUILD_PROGRESS_TRACKER.md` |

## Result

The ISMS pre-build stack now uses `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md` as the shared boundary authority for all module linkups, including PIT, MMM, Risk Management, RADAM / Systems Integration, and future apps.
