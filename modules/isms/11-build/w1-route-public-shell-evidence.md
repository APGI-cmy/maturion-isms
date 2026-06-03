# ISMS Stage 12 — W1 Build Evidence: Route Registry, Public Pages, Redirects

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Stage | Stage 12 — Build Execution & Evidence |
| Wave | W1 — Route Registry, Public Pages, Redirects |
| Branch | `foreman/w1-route-public-shell` |
| Status | IMPLEMENTED — PR CI PENDING |
| Date | 2026-06-02 |

---

## 1. Scope Executed

W1 implementation was limited to route registry, public pages, module-card wiring, redirects, and protected private placeholders.

Implemented scope:

- created shared ISMS module-card registry;
- wired landing page module cards to shared registry;
- wired modules overview cards to shared registry;
- preserved public marketing routes;
- preserved legacy route redirects to canonical `/marketing/*` routes;
- added protected placeholders for private `/assessment` and `/maturity/setup` routes;
- kept W2-W8 runtime implementation out of scope.

---

## 2. Files Changed

| File | Change |
|---|---|
| `apps/isms-portal/src/lib/moduleCards.ts` | New shared module card registry for public module discovery routes |
| `apps/isms-portal/src/pages/Index.tsx` | Uses shared module card registry for landing page module cards |
| `apps/isms-portal/src/pages/ModulesOverview.tsx` | Uses shared module card registry for modules overview |
| `apps/isms-portal/src/App.tsx` | Adds protected placeholders for `/assessment` and `/maturity/setup`; keeps public routes public and legacy redirects intact |

---

## 3. Route/Wiring Evidence

| Route/Path | Expected W1 behavior | Evidence status |
|---|---|---|
| `/` | Public landing page renders without auth | Code wired in `App.tsx` |
| `/modules` | Public modules overview renders without auth | Code wired in `App.tsx` |
| `/journey` | Public journey page renders without auth | Code preserved in `App.tsx` |
| `/free-assessment` | Public free assessment entry renders without auth | Code preserved in `App.tsx` |
| `/subscribe` | Public subscribe page renders without auth | Code preserved in `App.tsx` |
| `/subscribe/checkout` | Public checkout route renders without auth | Code preserved in `App.tsx` |
| `/marketing/*` | Public marketing pages render without auth | Code preserved in `App.tsx` |
| Legacy info routes | Redirect to canonical `/marketing/*` routes | Code preserved in `App.tsx` |
| `/dashboard` | Protected placeholder requires auth | Code preserved via `ProtectedRoute` |
| `/assessment` | Protected placeholder requires auth | Added in W1 |
| `/maturity/setup` | Protected placeholder requires auth | Added in W1 |

---

## 4. QA-to-Red Mapping

| Stage 6 QA Domain | W1 response |
|---|---|
| D1 Public Route and Navigation Wiring | Public route set preserved and private placeholder routes protected |
| D2 Module Cards and Marketing Pages | Landing and modules overview now use shared module card registry routed to public marketing pages |

---

## 5. Out-of-Scope Confirmation

Not implemented in W1:

- W2 free assessment result engine;
- W3 subscribe/checkout/auth/onboarding runtime flow;
- W4 entitlement, shared context, MMM handoff;
- W5 Ask Maturion adapter;
- W6 Supabase/RLS/edge/audit implementation;
- W7 deployment workflow;
- W8 cumulative regression/PBFAG rerun.

---

## 6. Command Evidence

Local commands were not run in this connector environment.

Required PR/CI evidence before merge:

- PR checks must pass;
- Copilot/Codex conversations must be resolved or dispositioned;
- any runtime build/typecheck failures must be fixed before handover recommendation.

---

## 7. Evidence Disposition

```text
W1 IMPLEMENTATION: COMPLETE FOR PR REVIEW
LOCAL BUILD/LINT/TEST: NOT RUN
CI GATES: PENDING PR
HANDOVER: NOT AUTHORIZED
```
