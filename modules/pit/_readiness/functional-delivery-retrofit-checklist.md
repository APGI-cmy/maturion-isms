# PIT Functional Delivery Retrofit Checklist

**Module**: PIT (Project Implementation Tracker)  
**Wave**: pit-prebuilt-retrofit-20260508  
**Governing Issue**: maturion-isms#1575  
**PR**: #1576  
**Reviewed By**: foreman-v2-agent (POLC-Orchestration mode)  
**Date**: 2026-05-08  
**Status**: COMPLETE — pending CS2 re-confirmation of Stages 2–4

---

## Purpose

This checklist verifies that all PIT pre-build artifacts (Stages 1–12) have been reviewed against the functional-app-delivery hardening standard applied to MMM. It is the primary evidence artifact for maturion-isms#1575.

The retrofit question for each stage is:
> *Would a builder, QA-to-Red agent, PBFAG reviewer, and CS2 verifier be able to derive a complete, working, deployable, visually correct, permission-safe, and operationally verifiable app from this artifact without filling gaps by assumption?*

---

## Stage 1 — App Description

**Artifact**: `modules/pit/00-app-description/app-description.md` v1.0 (CS2-approved 2026-05-06)

| Check | Status | Notes |
|---|---|---|
| Fully functional runtime delivery target | ✅ PASS | §AD-09, §AD-18, L-007 |
| All primary route families | ✅ PASS | §AD-06; Stage 2 carry-forward requirement |
| Onboarding / auth completeness | ✅ PASS | §AD-05, §AD-11, L-004 carry-forward |
| App-shell and visual-rendering expectations | ✅ PASS | L-002; §AD-21 Stage 2 carry-forward |
| Role-gated behaviour and denied-path expectations | ✅ PASS | §AD-04 Role Hierarchy; §AD-22; L-003 |
| Deployment / live evidence expectation | ✅ PASS | L-006 deployment contract; L-007 live operational closure |
| Operational closure distinction from build completion | ✅ PASS | L-001 L1/L2/L3 closure model |
| MMM Lessons L-001 through L-008 | ✅ PASS | MMM Lessons Promoted Into PIT section — all 8 present |
| Downstream one-time-build guardrail propagation requirement | ✅ PASS | §AD-21, §AD-22; Stage 2 carry-forward requirements |

**Stage 1 Retrofit Verdict**: ✅ PASS — No material amendments required. CS2 authority preserved. Non-material retrofit annotation added.

**Proposed Amendments**: None.

---

## Stage 2 — UX Workflow & Wiring Spec

**Artifact**: `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.2-draft

| Check | Status | Notes |
|---|---|---|
| Route coverage — all public, auth, protected, admin, system, fallback | ✅ PASS | Section 9: all 27 routes enumerated |
| Screen-to-route-to-state-to-wiring traceability | ✅ PASS | Sections 2, 4, 7 — 21 screens × 5 states × data wiring |
| Five-state UI or equivalent auth/public state coverage for every route | ✅ PASS | Section 4: all 21 primary screens covered |
| App-shell and global layout rendering expectations | ✅ PASS | Section 5: exact rendering expectations |
| Notification, toast, and root-provider behaviour | ✅ PASS | Section 5: NotificationProvider spec |
| Denied-path UX for every role-gated route/action | ✅ PASS | Section 4 State 3 per screen; Section 2 role notes |
| Empty/loading/error/network/permission states as testable UI outcomes | ✅ PASS | Section 4: all 5 states defined with testable criteria |
| Direct browser route-load behaviour and SPA fallback expectations | ✅ PASS | Section 9: SPA fallback; vercel.json rewrite |
| Visual acceptance hints needed by QA-to-Red and PBFAG | ✅ PASS | Section 4 acceptance criteria; Section 7 data wiring |
| Mobile/responsive expectations | ✅ PASS — explicitly in scope | Sections 2, 5 note responsive layout requirements |
| 404 route state/wiring entries in Sections 4 and 7 | ⚠️ GAP — UX-GAP-001 | Non-blocking — see gap register |
| Notification history screen spec (`/notifications`) in Sections 2 and 4 | ❌ GAP — UX-GAP-002 | **BLOCKING for Stage 2 re-confirmation** — see gap register |

**Stage 2 Retrofit Verdict**: ⚠️ CONDITIONAL — Substantially complete. Two gaps identified:
- UX-GAP-001: non-blocking (404 route entries)
- UX-GAP-002: **blocking for Stage 2 re-confirmation** (notification history screen spec absent)

Stage 2 must not be re-confirmed until UX-GAP-002 is resolved. After UX-GAP-002 resolution, Stage 2 is ready for CS2 re-confirmation.

---

## Stage 3 — FRS v0.2-Hardened

**Artifact**: `modules/pit/02-frs/functional-requirements.md` v0.2-hardened (maturion-isms#1556)

| Check | Status | Notes |
|---|---|---|
| Build-completeness guardrails | ✅ PASS | §33 Build-Completeness Guardrails |
| QA-to-Red derivation requirements | ✅ PASS | §34 QA-to-Red Derivation Requirements |
| Route coverage appendix | ✅ PASS | Appendix A — all 27 routes |
| Role-scope and denied-path requirements | ✅ PASS | §3.1 Role-scope matrix; PIT-FR-113 |
| Lifecycle removal semantics | ✅ PASS | PIT-FR-121 |
| Evidence completion blocking rules | ✅ PASS | PIT-FR-052 |
| Progress roll-up and RAG rules | ✅ PASS | PIT-FR-114; §29 RAG thresholds |
| Notification read/history/preferences | ✅ PASS | PIT-FR-115, PIT-FR-116, PIT-FR-117 |
| Report generation states and history | ✅ PASS | PIT-FR-118, PIT-FR-119 |
| QA dashboard evidence visibility | ✅ PASS | PIT-FR-120 |
| Accessibility outcomes | ✅ PASS | PIT-FR-122 |
| Explicit bulk/import/templates non-scope | ✅ PASS | PIT-FR-123 |
| Functional persistence labels / entity caveat | ✅ PASS | §1.4 Table/Entity Naming Caveat |
| Alignment note — Stage 4 TRS must derive from FRS v0.2-hardened | ✅ PASS | §38 Stage 4 readiness wording |

**Stage 3 Retrofit Verdict**: ✅ PASS — FRS v0.2-hardened satisfies all functional-delivery standard requirements. No additional hardening required. No duplication of maturion-isms#1556 work.

---

## Stage 4 — TRS

**Artifact**: `modules/pit/03-trs/technical-requirements-specification.md` v0.2-draft (updated PR #1576)

| Check | Status | Notes |
|---|---|---|
| Derivation updated to FRS v0.2-hardened | ✅ PASS | Status Header and Section 0 updated in PR #1576 |
| PIT-FR-113 (Permission Negative-Path) propagated | ✅ PASS | PIT-TR-116 added (Section 31) |
| PIT-FR-114 (Progress Roll-Up) propagated | ✅ PASS | PIT-TR-117 added (Section 31) |
| PIT-FR-115–117 (Notification Read/History/Preferences) propagated | ✅ PASS | PIT-TR-118, PIT-TR-119, PIT-TR-120 added (Section 31) |
| PIT-FR-118–119 (Report Permissions/States/History) propagated | ✅ PASS | PIT-TR-121, PIT-TR-122 added (Section 31) |
| PIT-FR-120 (QA Dashboard Enhanced) propagated | ✅ PASS | PIT-TR-123 added (Section 31) |
| PIT-FR-121 (Lifecycle Removal Semantics) propagated | ✅ PASS | PIT-TR-124 added (Section 31) |
| PIT-FR-122 (Accessibility Outcomes) propagated | ✅ PASS | PIT-TR-125 added (Section 31) |
| PIT-FR-123 (Bulk Operations Non-Scope) propagated | ✅ PASS | PIT-TR-126 added (Section 31) |
| FRS-to-TRS traceability updated for 123 requirements | ✅ PASS | frs-to-trs-traceability.md Section 30 added in PR #1576 |
| Stale maturion-isms#1556 dependency notice removed | ✅ PASS | Replaced by Retrofit Note in Status Header |
| Open assumption A-011 added for FRS approval dependency | ✅ PASS | Section 28 updated in PR #1576 |

**Stage 4 Retrofit Verdict**: ✅ PASS — TRS updated to v0.2-draft with all 11 FRS v0.2-hardened requirements propagated. All 123 FRS requirements now traced. Stage 4 approval remains BLOCKED pending upstream CS2 approvals of Stages 2–3.

---

## Stage 5 — Architecture

**Artifact**: `modules/pit/04-architecture/` (existing content)

| Check | Status | Notes |
|---|---|---|
| Architecture formally gate-passed | ❌ NOT_GATED | Existing content; not gate-passed under 12-stage model |
| Reconciled against Stage 1 App Description v1.0 | ❌ BLOCKED | Blocked until upstream approvals |
| Reconciled against Stage 2 UX Spec | ❌ BLOCKED | Blocked until Stage 2 CS2-approved |
| Reconciled against Stage 3 FRS v0.2-hardened | ❌ BLOCKED | Blocked until Stage 3 CS2-approved |
| Reconciled against Stage 4 TRS v0.2-draft | ❌ BLOCKED | Blocked until Stage 4 CS2-approved |
| Stage 5 reconciliation checklist completed | ❌ PENDING | Checklist added to BUILD_PROGRESS_TRACKER.md in PR #1576 |

**Stage 5 Retrofit Verdict**: ❌ BLOCKED — Architecture exists but is not gate-passed. Stage 5 reconciliation requirements added to BUILD_PROGRESS_TRACKER.md. Stage 5 must be formally reconciled against the complete upgraded upstream chain before gate-pass.

---

## Stages 6–12 — Future Stages

| Stage | Status | Retrofit Action Taken |
|---|---|---|
| Stage 6 — QA-to-Red | NOT_STARTED | ✅ Full functional-delivery guardrails added to BUILD_PROGRESS_TRACKER.md Stage 6 entry (20 mandatory test categories) |
| Stage 7 — PBFAG | NOT_STARTED | ✅ Full PBFAG functional-delivery guardrails added to BUILD_PROGRESS_TRACKER.md Stage 7 entry (12 mandatory verifications) |
| Stage 8 — Implementation Plan | NOT_STARTED | ✅ Functional-slice sequencing and evidence requirements added to BUILD_PROGRESS_TRACKER.md Stage 8 entry |
| Stage 9 — Builder Checklist | NOT_STARTED | ✅ Builder acknowledgement requirements added to BUILD_PROGRESS_TRACKER.md Stage 9 entry |
| Stage 10 — IAA Pre-Brief | NOT_STARTED | ✅ Risk control and challenge question requirements added to BUILD_PROGRESS_TRACKER.md Stage 10 entry |
| Stage 11 — Builder Appointment | NOT_STARTED | ✅ Appointment gate conditions added to BUILD_PROGRESS_TRACKER.md Stage 11 entry |
| Stage 12 — Build Execution | NOT_STARTED | ✅ Full evidence category requirements added to BUILD_PROGRESS_TRACKER.md Stage 12 entry (10 mandatory categories) |

---

## Retrofit Summary

| Stage | Verdict | Blocking? |
|---|---|---|
| Stage 1 App Description | ✅ PASS | No gaps |
| Stage 2 UX Spec | ⚠️ CONDITIONAL | UX-GAP-002 blocks re-confirmation |
| Stage 3 FRS | ✅ PASS | Ready for CS2 re-confirmation |
| Stage 4 TRS | ✅ PASS (propagation complete) | Blocked by upstream CS2 approvals |
| Stage 5 Architecture | ❌ BLOCKED | Blocked until upstream approvals + reconciliation |
| Stages 6–12 | ✅ GUARDRAILS ADDED | Not started; functional-delivery guardrails installed in tracker |

**Overall Retrofit Status**: COMPLETE — All required actions from maturion-isms#1575 executed. Two gaps identified (UX-GAP-001, UX-GAP-002). Remaining blockers are upstream CS2 approvals, not retrofit work. Build Authorization remains NOT CLEARED.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Template Version**: 1.0.0  
**Last Updated**: 2026-05-08 (maturion-isms#1575 / PR #1576)
