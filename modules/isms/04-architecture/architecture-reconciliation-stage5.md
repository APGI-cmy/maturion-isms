# ISMS — Stage 5 Architecture Reconciliation

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact Type | Stage 5 Architecture Reconciliation |
| Status | DRAFT — For review |
| Version | v0.1.0 |
| Date | 2026-05-29 |
| Existing Architecture | `modules/isms/04-architecture/architecture.md` |
| Upstream TRS | `modules/isms/03-trs/technical-requirements-specification.md` v0.1.0 |

---

## 1. Purpose

The existing ISMS architecture document is retained as the original high-level ecosystem architecture. This reconciliation artifact aligns it with the approved Stage 1–4 baseline and defines the concrete architecture decisions required before QA-to-Red, PBFAG, and implementation planning.

---

## 2. Architecture Disposition

The existing `architecture.md` is useful but not sufficient on its own for implementation because it predates the reconciled App Description, UX Workflow & Wiring Spec, FRS, and TRS.

Disposition:

- retain existing architecture as strategic ecosystem architecture;
- treat this reconciliation artifact as the Stage 5 bridge to implementation architecture;
- require future implementation plans to derive from both `architecture.md` and this reconciliation file;
- do not authorize implementation handover from architecture alone.

---

## 3. Target Application Boundary

The primary application target is:

```text
apps/isms-portal/
```

The portal is a Vite React TypeScript application with React Router, TanStack Query, Radix UI, Tailwind CSS, Vitest, and workspace AI integration through `@maturion/ai-centre`.

ISMS portal owns:

- public landing;
- module discovery;
- module marketing pages;
- public free assessment entry;
- subscription and checkout path;
- auth entry route;
- get-to-know-you onboarding shell;
- shared ISMS context envelope;
- module handoff routing;
- entitlement-aware module navigation;
- public/private route boundaries.

ISMS portal does not own deep domain internals of MMM, PIT, Risk, Incident, RADAM, Data Assurance, or Skills.

---

## 4. Route Architecture

### 4.1 Public routes

The following routes are public and must not be wrapped in `ProtectedRoute`:

```text
/
/modules
/journey
/free-assessment
/subscribe
/subscribe/checkout
/auth
/accept-invitation
/marketing/maturity-roadmap
/marketing/risk-management
/marketing/project-implementation
/marketing/data-analytics-assurance
/marketing/systems-integration
/marketing/skills-development
/marketing/incident-intelligence
```

### 4.2 Protected routes

The following routes are protected or reserved for protected implementation:

```text
/dashboard
/assessment
/maturity/setup
/team
/organization/settings
/admin/*
/pit
/risk
/incidents
/analytics
/integrations
/skills
```

### 4.3 Legacy redirects

Legacy flat marketing routes should redirect to canonical routes:

| Legacy | Canonical |
|---|---|
| `/risk-management-info` | `/marketing/risk-management` |
| `/pit-info` | `/marketing/project-implementation` |
| `/data-analytics-info` | `/marketing/data-analytics-assurance` |
| `/data-extraction-info` | `/marketing/systems-integration` |
| `/skills-development-info` | `/marketing/skills-development` |
| `/incident-management-info` | `/marketing/incident-intelligence` |

---

## 5. Component Architecture

Recommended component/file ownership for implementation:

| Architecture Area | Target Pattern |
|---|---|
| Route constants | `apps/isms-portal/src/lib/routes.ts` |
| Module card config | `apps/isms-portal/src/lib/moduleCards.ts` or equivalent |
| Public landing | `apps/isms-portal/src/pages/Index.tsx` |
| Module catalogue | `apps/isms-portal/src/pages/ModulesOverview.tsx` |
| Journey / house model | `apps/isms-portal/src/pages/Journey.tsx` |
| Free assessment | `apps/isms-portal/src/pages/FreeAssessment.tsx` |
| Subscription | `apps/isms-portal/src/pages/Subscribe.tsx` |
| Checkout | `apps/isms-portal/src/pages/SubscribeCheckout.tsx` |
| Auth entry | existing or new `Auth` page/route |
| Onboarding | `apps/isms-portal/src/pages/Onboarding.tsx` |
| Marketing pages | one page per canonical route or data-driven shared template |
| Shared shell | layout components under `src/components` or `src/layouts` |
| Protected route | existing/new `ProtectedRoute` wrapper |
| Shared context | providers/hooks under `src/context` or `src/lib/context` |

---

## 6. Shared Context Architecture

The implementation should define a shared ISMS context layer.

Minimum context domains:

| Context Domain | Responsibility |
|---|---|
| Auth context | current user/session state |
| Organisation context | org/tenant identity and profile |
| Subscription context | package, enabled modules, entitlement state |
| Route context | active route, source route, target route |
| Module context | active module id and target handoff module |
| Maturity baseline context | free assessment result reference where available |
| Assistant context | safe Ask Maturion public/private context |
| Audit context | material route and handoff event metadata |

Early implementation may use local/mock context only if the limitation is documented and does not pretend persistence exists.

---

## 7. Subscription and Onboarding Architecture Decisions

### Decision A — Post-checkout routing

Architecture decision:

```text
Unauthenticated checkout completion -> /auth
Authenticated checkout completion -> /onboarding
Auth callback after checkout -> /onboarding
```

Rationale: this preserves the public-to-private boundary and keeps get-to-know-you as an authenticated context initialization step.

### Decision B — Onboarding route

Architecture decision:

```text
/onboarding
```

The onboarding page is the canonical get-to-know-you route.

Minimum onboarding data:

- organisation name;
- role;
- industry;
- region;
- organisation size;
- threat/risk profile;
- package;
- enabled modules;
- preferred starting module;
- maturity baseline reference;
- AI preference.

---

## 8. Module Handoff Architecture

### Decision C — MMM handoff

Architecture decision for initial portal implementation:

```text
/maturity/setup
```

This is the provisional private MMM entry route inside the ISMS portal. If MMM later becomes a separate deployment, this route should become the handoff bridge, not a public marketing page.

### Standard handoff payload

| Field | Required |
|---|---|
| userId | yes |
| orgId | yes |
| subscriptionKey | yes |
| sourceRoute | yes |
| targetModuleId | yes |
| targetRoute | yes |
| maturityBaselineRef | optional |
| timestamp | yes |

Future module route reservations:

| Module | Reserved Private Route |
|---|---|
| PIT | `/pit` |
| Risk | `/risk` |
| Incident & Intelligence | `/incidents` |
| Data Analytics & Remote Assurance | `/analytics` |
| Systems Integration / RADAM | `/integrations` |
| Skills Development | `/skills` |

---

## 9. Entitlement Architecture

Module access should be evaluated through a subscription entitlement model.

Minimum entitlement record shape:

| Field | Purpose |
|---|---|
| subscriptionKey | package identifier |
| enabledModules | allowed modules |
| trialModules | temporary access modules |
| expiredModules | modules previously available |
| upgradeRoute | route to subscription/upgrade |

Behavior:

- subscribed modules route to private workspace;
- unsubscribed modules route to explanation or upgrade path;
- public pages remain available regardless of subscription;
- unauthorized private access is blocked and recordable.

---

## 10. Ask Maturion Architecture Boundary

Public Ask Maturion:

- educational prompts only;
- no tenant data required;
- may route to public pages, course references, free assessment, or subscribe.

Authenticated Ask Maturion:

- may use user, org, role, active module, subscription, and maturity baseline context;
- may not bypass module permissions;
- must respect module ownership boundaries.

Implementation should use the workspace AI package only through a defined context adapter.

---

## 11. Audit Event Architecture

Minimum event contract:

| Field | Required |
|---|---|
| eventId | yes |
| eventType | yes |
| actorUserId | yes where authenticated |
| orgId | yes where available |
| sourceRoute | yes |
| targetRoute | yes |
| targetModuleId | yes where applicable |
| permissionDecision | yes for protected routes |
| timestamp | yes |
| metadata | optional |

Early implementation may write audit events to a placeholder service only if the limitation is documented. Production implementation requires persistent storage with tenant isolation.

---

## 12. Architecture-to-TRS Mapping

| TRS ID | Architecture Realization |
|---|---|
| TR-ISMS-001 | Stack constrained to `apps/isms-portal` Vite React TypeScript app. |
| TR-ISMS-002 | Central route registry in `src/lib/routes.ts`. |
| TR-ISMS-003 | Router excludes `ProtectedRoute` from public routes. |
| TR-ISMS-004 | ProtectedRoute wraps private routes. |
| TR-ISMS-005 | Legacy redirect routes map to canonical `/marketing/*` routes. |
| TR-ISMS-006 | Central module card config. |
| TR-ISMS-007 | Shared or consistent marketing page pattern. |
| TR-ISMS-008 | Free assessment public route separated from private `/assessment`. |
| TR-ISMS-009 | Free assessment result context/session state. |
| TR-ISMS-010 | Subscribe route accepts optional journey context. |
| TR-ISMS-011 | Checkout routes to `/auth` or `/onboarding` based on auth state. |
| TR-ISMS-012 | `/onboarding` route captures get-to-know-you context. |
| TR-ISMS-013 | Shared context providers/hooks. |
| TR-ISMS-014 | Entitlement checks before private module entry. |
| TR-ISMS-015 | Standard handoff payload. |
| TR-ISMS-016 | MMM initial private handoff via `/maturity/setup`. |
| TR-ISMS-017 | Public Ask Maturion as educational prompt surface. |
| TR-ISMS-018 | Authenticated Ask Maturion uses shared context adapter. |
| TR-ISMS-019 | Handoff audit event contract. |
| TR-ISMS-020 | User-visible error states and safe diagnostics. |
| TR-ISMS-021 | Future schema-to-hook validation gate for DB waves. |
| TR-ISMS-022 | Future RLS/tenant isolation gate for persistent data. |
| TR-ISMS-023 | Future env/secret registry for external integrations. |
| TR-ISMS-024 | Build, lint, and test commands required for implementation handover. |
| TR-ISMS-025 | Route verification test set required in QA-to-Red. |

---

## 13. Stage 5 Open Conditions

Architecture reconciliation resolves or narrows several open issues but does not authorize implementation.

| Issue | Stage 5 Disposition |
|---|---|
| Canonical App Description path mismatch | Still open; governance cleanup needed. |
| Onboarding route | Resolved architecturally as `/onboarding`. |
| Post-checkout destination | Resolved architecturally: unauthenticated -> `/auth`; authenticated/callback -> `/onboarding`. |
| MMM handoff | Resolved architecturally for initial portal as `/maturity/setup`; future separate deployment can bridge from this route. |
| Free assessment result flow | Partially resolved: public result/session state; implementation must avoid dead-end to private `/assessment`. |
| PIT entry route | Reserved as `/pit`. |
| Non-MMM practical exercises | Deferred; not required for initial harvest. |
| Ask Maturion boundary | Resolved at architecture boundary level; implementation adapter still required. |
| Entitlement data source | Defined conceptually; persistent source deferred to implementation/data architecture. |
| Audit storage | Event contract defined; production storage deferred to data architecture. |
| CI/build evidence | Defined as implementation handover requirement. |

---

## 14. Architecture Disposition

Stage 5 Architecture Reconciliation is sufficient to proceed to Stage 6 QA-to-Red planning.

It does not authorize implementation handover.
