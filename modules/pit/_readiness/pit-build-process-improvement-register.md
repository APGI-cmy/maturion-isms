# PIT Build Process Improvement Register

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Created | 2026-05-06 |
| Created By | pit-specialist (delegated by Foreman — maturion-isms#1537) |
| Related Issue | [maturion-isms#1537](https://github.com/APGI-cmy/maturion-isms/issues/1537) |
| Authority | Foreman v2 governance directive — maturion-isms#1537 |
| Source Register | `modules/MMM/_readiness/build-process-improvement-register.md` |

---

## Purpose

This register records build-process oversights observed during the MMM module build (Waves B1–B9 and post-build corrections) that have been promoted as **PIT pre-build controls**. Each entry:

1. Describes the original MMM observation
2. States the PIT control that prevents the same escape class
3. Identifies the gate condition that enforces the control
4. References the App Description section where the control is locked in

These controls are **pre-build** — they must be applied before Stage 2 (UX Wiring Spec) through Stage 7 (PBFAG) are completed. They are not post-build remediations.

Any new oversights discovered during PIT Stages 2–7 must be added to this register and propagated back to the appropriate upstream artifact before the affected wave proceeds (confirmed by Foreman).

---

## Oversight Register

### OVS-001 — Build-Complete vs. Operational Closure (L1/L2/L3 Model)

| Field | Value |
|---|---|
| Source | MMM Build Tracker — L1/L2/L3 closure model observation |
| Promoted As | L-001 in PIT App Description §MMM Lessons Promoted Into PIT |
| Status | PROMOTED — control locked in App Description v1.0-draft |
| App Description Section | L-001 |

**Observation**: The MMM tracker distinguishes L1 build-complete (code passing tests) from L2 deployment commissioned (live on target environment) from L3 operationally closed (end-to-end verified in production by CS2). These levels were not consistently enforced across all waves.

**PIT Control**: PIT's Implementation Plan, PBFAG, PREHANDOVER proofs, and final handover gate must explicitly carry the L1/L2/L3 closure model. A wave is not closed until L2 (deployed and commissioned) is confirmed. PIT is not done until L3 (CS2 verified live E2E workflow) is confirmed.

**Gate Condition**: Each relevant wave PREHANDOVER must distinguish L1/L2/L3 status. L3 closure requires CS2 sign-off with live evidence.

**Applies To Stages**: Stage 8 (Implementation Plan), Stage 12 (Build), Deployment Wave

---

### OVS-002 — UI Rendering Completeness (Global Styles, App Shell)

| Field | Value |
|---|---|
| Source | MMM OVS-001 / OVS-004 — B3 UI passed tests but rendered as bare HTML |
| Promoted As | L-002 in PIT App Description §MMM Lessons Promoted Into PIT |
| Status | PROMOTED — control locked in App Description v1.0-draft |
| App Description Section | L-002 |

**Observation**: The MMM B3 UI passed all automated tests but was delivered without global CSS, causing bare/unstyled HTML in production. Tests verified file existence, headings, and query calls, but not visual rendering completeness.

**PIT Control**:
- Every UI wave must require: global stylesheet present and imported at app root; app shell present and styled; primary pages visually rendered (no bare HTML).
- QA-to-Red for every UI wave must include visual/rendering tests or equivalent assertions — not only string-existence or file-existence tests.
- Physical verification screenshots must confirm all pages are visually styled before wave closure.

**Gate Condition**: UI wave closure blocked unless visual rendering confirmed.

**Applies To Stages**: Stage 6 (QA-to-Red), Stage 12 (Build — every UI wave)

---

### OVS-003 — Post-Login Page State Completeness (Empty/Error/Permission)

| Field | Value |
|---|---|
| Source | MMM OVS-002 / OVS-003 — dashboard showed sparse headings and blank metric labels after login |
| Promoted As | L-003 in PIT App Description §MMM Lessons Promoted Into PIT |
| Status | PROMOTED — control locked in App Description v1.0-draft |
| App Description Section | L-003 |

**Observation**: After login, the MMM dashboard showed sparse headings and blank metric labels. There was no app shell, no navigation, no empty-state explanation, no CTA, and no error distinction between permission failure and network failure.

**PIT Control**: All PIT primary pages must define and implement all 5 states before wave closure:
1. Loading state
2. Empty data state (with useful message and CTA to next action)
3. Permission-denied state (distinct from network/server failure)
4. Network/server error state (with user guidance)
5. Data state (with real data rendering)

Each state must be covered by a QA-to-Red test. HTTP response status must be checked before `res.json()` in every data-fetching component.

**Gate Condition**: No page is complete unless all 5 states are implemented and tested.

**Applies To Stages**: Stage 2 (UX Wiring Spec — state definitions), Stage 6 (QA-to-Red), Stage 12 (Build)

---

### OVS-004 — Auth Route Discoverability

| Field | Value |
|---|---|
| Source | MMM — post-build fixes required for missing /login, forgot-password, reset, onboarding |
| Promoted As | L-004 in PIT App Description §MMM Lessons Promoted Into PIT |
| Status | PROMOTED — control locked in App Description v1.0-draft |
| App Description Section | L-004 |

**Observation**: MMM required post-build fixes for missing `/login` registration, login route discoverability, forgot-password, reset callback, direct SPA route fallback, and signup/onboarding handling. These were not specified up front.

**PIT Control**: PIT Stage 2 (UX Workflow & Wiring Spec) and Stage 3 (FRS) must explicitly specify all auth and onboarding routes including: public entry route, Sign In/Sign Up nav links, `/login` route, signup/onboarding flow, forgot-password, password-reset, protected route redirect, SPA deep-link fallback, access-denied state.

**Gate Condition**: Stage 2 carry-forward — all auth/onboarding routes must be specified in UX Wiring Spec before Stage 3 FRS approval.

**Applies To Stages**: Stage 2 (UX Wiring Spec — HARD REQUIREMENT), Stage 3 (FRS), Stage 6 (QA-to-Red)

---

### OVS-005 — Runtime vs. File-Existence Test Gap

| Field | Value |
|---|---|
| Source | MMM OVS-004 — file-existence tests passed for operationally non-functional pages |
| Promoted As | L-005 in PIT App Description §MMM Lessons Promoted Into PIT |
| Status | PROMOTED — control locked in App Description v1.0-draft |
| App Description Section | L-005 |

**Observation**: File-existence and string-presence tests passed for pages that were not operationally useful. Tests verified file exists, heading present, fetch called — not that the user could actually use the page.

**PIT Control**: QA-to-Red for every PIT wave must require executable/runtime checks. Required per-wave QA evidence types: TypeScript compile check, route coverage, CSS/rendering checks, structural completeness per-page, E2E/golden-path test, live browser physical verification.

**Gate Condition**: Builder Checklist must confirm QA includes runtime/UI behaviour tests, not only static checks. Waves with only string/file-existence tests are insufficient.

**Applies To Stages**: Stage 6 (QA-to-Red), Stage 9 (Builder Checklist), Stage 12 (Build — every wave)

---

### OVS-006 — Deployment Execution Contract

| Field | Value |
|---|---|
| Source | MMM — deployment required later hardening around Vercel, Supabase migrations, secrets, live E2E |
| Promoted As | L-006 in PIT App Description §MMM Lessons Promoted Into PIT |
| Status | PROMOTED — control locked in App Description v1.0-draft |
| App Description Section | L-006 |

**Observation**: MMM deployment required later hardening around Vercel deployment, Supabase migration execution, schema verification, environment/secrets validation, live end-to-end validation, and CWT sign-off. These were not first-class contracts in the build plan.

**PIT Control**: A Runtime/Deployment Contract must be filed before PBFAG passes (see AD-08, item 9). The Deployment Wave (AD-16) must include as hard gates: schema migration execution, Edge Function deployment, storage bucket verification, AIMC connectivity check, QA-to-Green full run, production smoke test, rollback verification, and CWT closure report. Deployment evidence must be LIVE_RUNTIME or LIVE_E2E typed.

**Gate Condition**: PBFAG blocked until Runtime/Deployment Contract is filed. Deployment wave blocked until all live evidence is filed.

**Applies To Stages**: Stage 7 (PBFAG — HARD GATE), Stage 12 (Build — Deployment Wave)

---

### OVS-007 — Operational Closure Live Evidence

| Field | Value |
|---|---|
| Source | MMM — static code review and CI GREEN insufficient to close live operational items |
| Promoted As | L-007 in PIT App Description §MMM Lessons Promoted Into PIT |
| Status | PROMOTED — control locked in App Description v1.0-draft |
| App Description Section | L-007 |

**Observation**: Static code review, CI GREEN, and provisioning confirmations are insufficient to close live operational items. Real end-to-end workflows in the deployed environment are required.

**PIT Control**: L3 operational closure requires: one live end-to-end workflow demonstrated on the deployed PIT environment, CS2 sign-off, physical evidence filed at `.agent-admin/evidence/physical-verification/pit/`, all primary user journeys working. Declaring PIT "done" without L3 closure is a governance violation.

**Gate Condition**: L3 closure is blocked until CS2 verifies the live deployed PIT environment.

**Applies To Stages**: Stage 12 (Build — final closure), Deployment Wave

---

### OVS-008 — Continuous Improvement Recording

| Field | Value |
|---|---|
| Source | MMM — build-process oversights captured reactively; pre-build design could prevent entire escape classes |
| Promoted As | L-008 in PIT App Description §MMM Lessons Promoted Into PIT |
| Status | PROMOTED — control locked in App Description v1.0-draft |
| App Description Section | L-008 |

**Observation**: Build-process oversights discovered after initial delivery were captured reactively. Pre-build design could prevent entire escape classes if identified and locked in before build starts.

**PIT Control**: Any PIT design/build oversight discovered during Stages 2–7 must be:
1. Recorded in this register (`modules/pit/_readiness/pit-build-process-improvement-register.md`)
2. Propagated back to the appropriate upstream artifact before the affected wave proceeds
3. Confirmed by Foreman before builder allocation for the affected wave

**Gate Condition**: This register must be current before each stage gate. Any open OVS entry that has not been propagated to upstream artifacts blocks its affected stage gate.

**Applies To Stages**: All stages (continuous)

---

## Governance Controls Added to PIT App Description

The following section was added to `modules/pit/00-app-description/app-description.md` (v1.0-draft) as a result of these promoted lessons:

**Section**: `## MMM Lessons Promoted Into PIT`  
**Authority**: Foreman v2 governance directive — maturion-isms#1537  
**Controls**: L-001 through L-008  
**Stage 2 Carry-Forward**: Auth routes, UI state definitions, Implementation page indicators, app shell/navigation, deployment surface map

All 8 controls (OVS-001 through OVS-008) map 1:1 to lessons L-001 through L-008 in the App Description MMM Lessons section.

---

## Register Maintenance

| Field | Value |
|---|---|
| Owner | Foreman / pit-specialist |
| Update Trigger | Any new build-process oversight discovered during PIT Stages 2–7 |
| Propagation Required | Yes — each entry must be propagated to affected upstream artifacts |
| Foreman Confirmation | Required before affected wave proceeds |
| Next Review | Before Stage 2 (UX Wiring Spec) begins |

---

**Register Authority**: Foreman v2 governance directive — maturion-isms#1537  
**Source**: MMM Build Process Improvement Register (`modules/MMM/_readiness/build-process-improvement-register.md`)  
**Created**: 2026-05-06  
**Version**: 1.0
