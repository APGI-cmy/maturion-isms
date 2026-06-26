# PIT Stage 3 Addendum — PR #1850 Boundary Alignment

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 3 - Functional Requirements Specification alignment addendum |
| Status | ACTIVE PRE-BUILD ALIGNMENT ADDENDUM |
| Date | 2026-06-24 |
| Trigger | PR #1850 merged; W8.2 navigation/entitlement loop requires functional boundary clarification |
| Applies to | `modules/pit/02-frs/functional-requirements.md` |
| Authority consumed | `modules/pit/04-architecture/platform-module-boundary-linkup-strategy.md`; `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md` |

---

## 1. Purpose

This addendum aligns the PIT FRS with the PR #1850 ISMS/module boundary strategy.

It defines functional requirements that must be treated as binding overlays for PIT linkup and W8.2 correction work until the full FRS is formally revised.

---

## 2. Boundary functional requirements

### PIT-FR-BND-001 — ISMS-owned public journey

PIT shall not own or duplicate the ISMS public platform journey.

The public landing page, modules overview, PIT marketing page, subscription, checkout, authentication, onboarding, dashboard entitlement summary, and first runtime handoff are ISMS-owned platform functions.

### PIT-FR-BND-002 — PIT runtime after handoff

PIT shall own the Project Implementation Tracker runtime surfaces after ISMS has established an eligible/entitled handoff.

The canonical runtime entry route is `/pit/tracker` unless superseded by a governed route contract.

### PIT-FR-BND-003 — Descriptor-driven linkup

PIT shall expose or maintain module descriptor expectations for ISMS consumption:

- module id: `project-implementation`;
- display name: `Project Implementation Tracker`;
- marketing route: `/marketing/project-implementation`;
- runtime entry route: `/pit/tracker`;
- entitlement key: `project-implementation`.

ISMS shall render public and dashboard navigation from the descriptor and current platform state.

### PIT-FR-BND-004 — Canonical entitlement continuity

PIT runtime access shall rely on the canonical ISMS entitlement result, not on independent browser-origin local storage on a module host.

The user journey must preserve entitlement from ISMS checkout/auth/onboarding through ISMS dashboard to `/pit/tracker`.

### PIT-FR-BND-005 — No subscription loop after entitlement

After a user completes the canonical ISMS subscription/auth/onboarding path and obtains the Project Implementation entitlement, selecting the PIT card or direct runtime entry shall not return the user to subscription.

Returning an entitled user to subscription is a P1 functional defect.

### PIT-FR-BND-006 — Non-entitled behavior

A non-entitled user who selects the Project Implementation Tracker public card or navigates directly to `/pit/tracker` shall be routed predictably to the ISMS-owned marketing or subscription path.

### PIT-FR-BND-007 — Module-host public surface restriction

A PIT-specific deployment host shall not present itself as a duplicate public ISMS acquisition journey unless a governed host strategy explicitly approves that behavior and provides entitlement/session continuity.

### PIT-FR-BND-008 — Cross-agent build boundary

PIT implementation work shall not modify ISMS-owned subscription, auth, onboarding, dashboard, or public-shell behavior unless the wave is explicitly classified as cross-module and the builder is appointed for that scope.

---

## 3. Acceptance interpretation

Any PIT FRS requirement about entry, authentication, onboarding, dashboard, routing, or deployment must be interpreted through these boundary requirements.

A PIT runtime shell rendering at `/pit/tracker` is insufficient evidence unless the canonical ISMS journey can reach it with entitlement intact.

---

## 4. Non-completion notice

This addendum adds functional boundary constraints only. It does not implement code, does not make any RED test green, and does not support W8.2 completion or production readiness language.
