# ISMS — Open Issues Carry-Forward Register

| Field | Value |
|---|---|
| Product / Module | ISMS — Integrated Security Management System |
| Artifact Type | Open Issues Carry-Forward Register |
| Status | ACTIVE |
| Version | v0.1.0 |
| Date | 2026-05-29 |
| Owner / CS2 Authority | Johan Ras |
| Location | `modules/isms/01-ux-workflow-wiring-spec/open-issues-carry-forward.md` |

---

## 1. Purpose

This register preserves unresolved issues from the App Description, UX Workflow & Wiring Spec, and FRS so they are carried into TRS, Architecture, QA-to-Red, PBFAG, Implementation Plan, and Builder Checklist.

No item in this register may be silently dropped. Each must be resolved, explicitly deferred, or waived by CS2 before implementation handover.

---

## 2. Open Issues

| ID | Issue | Source | Impact | Required Next Artifact Treatment |
|---|---|---|---|---|
| ISMS-OI-001 | Stage-number mismatch: user referred to FRS as Stage 2; repo canon defines Stage 2 UX and Stage 3 FRS. | FRS/QP/Signoff | Governance confusion. | Tracker now reconciles to repo canon; TRS must cite Stage 4 as next stage. |
| ISMS-OI-002 | Canonical App Description path mismatch: reviewed file is `modules/isms/00-app-description/ISMS_app_description.md`, but it references `docs/governance/ISMS_APP_DESCRIPTION.md`. | App Description signoff | Source-of-truth ambiguity. | TRS or tracker reconciliation should either create canonical copy or update authority wording. |
| ISMS-OI-003 | `/onboarding` route/component not yet implemented. | App Description §16.16, FRS OI | Subscription/sign-up/get-to-know-you loop incomplete. | TRS must define route, state, data contract, auth behavior, and post-completion redirect. |
| ISMS-OI-004 | Post-checkout destination unresolved. | UX J-07 | Checkout may dead-end or fork inconsistently. | TRS must define checkout completion transition: `/auth`, `/onboarding`, or provider callback. |
| ISMS-OI-005 | MMM handoff contract unresolved. | App Description §16.16, FRS FR-ISMS-021 | Private MMM entry ambiguous. | TRS/Architecture must decide internal route vs external deployment and handoff payload. |
| ISMS-OI-006 | Free assessment public result flow vs private `/assessment` handoff unresolved. | UX J-05, FRS OI | Public assessment could route to NotFound/private wall. | TRS must define public result route and authenticated MMM assessment boundary. |
| ISMS-OI-007 | `MATURITY_SETUP` route/private MMM entry needs implementation decision. | Discovery report / FRS OI | MMM first-run could be unwired. | TRS/Architecture must align route with MMM deployment decision. |
| ISMS-OI-008 | PIT future authenticated entry route not reserved consistently. | Discovery report / FRS OI | Future PIT handoff ambiguity. | TRS should reserve `/pit` or a governed PIT route constant. |
| ISMS-OI-009 | Non-MMM practical exercises are conceptual only. | App Description §16.9 | Other module branches lack teaser/practical exercises. | FRS/TRS may defer; future module-specific UX specs should define if required. |
| ISMS-OI-010 | Ask Maturion public/private capability boundary needs technical specification. | UX §6, FRS FR-ISMS-019 | Risk of overpromising assistant behavior. | TRS must specify public prompt affordance vs authenticated AI context. |
| ISMS-OI-011 | Subscription entitlements and module card states need data model. | UX J-10/J-11 | Private landing cannot reliably show subscribed/unsubscribed modules. | TRS must define entitlement source and route-guard behavior. |
| ISMS-OI-012 | Audit logging for handoffs needs schema/event contract. | FRS FR-ISMS-020 | Governance visibility not implementable. | TRS must define minimal event fields and storage/integration contract. |
| ISMS-OI-013 | Legacy harvest source must remain read-only. | App Description §16, Foreman Operating Model | Risk of accidental legacy modification. | Implementation plan/builder checklist must include explicit no-touch invariant. |
| ISMS-OI-014 | CI/build gates not yet applicable to documentation-only waves. | QP/ECAP | Risk of overclaiming pass status. | Implementation PRs must include build/typecheck/test/CI evidence before handover. |

---

## 3. Carry-Forward Rule

Each downstream artifact must include an “Open Issues Carried Forward” section referencing this register and declaring the status of each issue.

Valid statuses:

- `Resolved`
- `Deferred with rationale`
- `Waived by CS2`
- `Still open — blocks implementation handover`

---

## 4. Current Gate Position

Stages 1–3 may be treated as approved with conditions for pre-build progression.

Implementation handover remains blocked until downstream gates are complete or explicitly waived.
