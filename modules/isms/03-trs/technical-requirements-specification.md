# ISMS — Technical Requirements Specification

## Stage 4 — Technical Requirements Specification

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact Type | Technical Requirements Specification |
| Status | DRAFT — For review |
| Version | v0.1.0 |
| Date | 2026-05-29 |
| Location | `modules/isms/03-trs/technical-requirements-specification.md` |
| Upstream App Description | `modules/isms/00-app-description/ISMS_app_description.md` v1.2.0 |
| Upstream UX Spec | `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.1.0 |
| Upstream FRS | `modules/isms/02-frs/functional-requirements.md` v0.1.0 |

---

## 0. Derivation

This TRS derives from the ISMS App Description, UX Workflow & Wiring Spec, and FRS. It converts the functional baseline into technical constraints for the ISMS portal public front door, module discovery, subscription, onboarding, shared context, route protection, and module handoff layer.

No technical requirement in this document may contradict the App Description, UX Spec, or FRS. If conflict is discovered, the upstream artifact prevails until formally amended.

---

## 1. Purpose and Scope

This TRS bridges the Stage 3 FRS and Stage 5 Architecture by defining the technical requirements that the ISMS portal implementation and architecture must satisfy.

In scope:

- frontend route architecture;
- public and protected route behavior;
- module discovery data model;
- public marketing page pattern;
- free assessment technical boundary;
- subscription and checkout transition contracts;
- auth and onboarding route contracts;
- shared context envelope;
- module entitlement checks;
- module handoff contract;
- Ask Maturion public/private context boundary;
- audit event requirements;
- build, test, and CI requirements for implementation waves.

Out of scope:

- deep MMM Domain/MPS/Criteria internals;
- PIT execution internals;
- Risk register internals;
- Incident lifecycle internals;
- RADAM connector internals;
- Skills training internals;
- production payment-provider implementation details until a provider is selected.

---

## 2. Technology Stack Baseline

The current app target is `apps/isms-portal`, a Vite React TypeScript application.

| Component | Technology | Constraint |
|---|---|---|
| Frontend runtime | React | `^18.3.1` |
| Build tool | Vite | `^5.4.1` |
| Language | TypeScript | `^5.5.3` |
| Routing | React Router DOM | `^6.26.0` |
| Server state/query | TanStack React Query | `^5.0.0` |
| UI primitives | Radix UI | Package versions in `apps/isms-portal/package.json` |
| Icons | lucide-react | `^0.462.0` |
| Toasts | Radix Toast / Sonner | Must not show broad welcome toast on public landing load |
| Tests | Vitest | `^1.6.0` |
| Styling | Tailwind CSS | `^3.4.0` |
| AI package | `@maturion/ai-centre` | workspace package |

### TR-ISMS-001 — Stack consistency

The implementation SHALL remain compatible with the declared Vite + React + TypeScript stack unless a later TRS amendment approves a stack change.

Acceptance:

- `npm run build` or package-equivalent build uses `tsc && vite build`.
- `npm run test:run` or equivalent Vitest command is available.
- Route implementation uses React Router DOM route configuration.

---

## 3. Route and Navigation Technical Requirements

### TR-ISMS-002 — Central route registry

The implementation SHALL define canonical ISMS route constants in `apps/isms-portal/src/lib/routes.ts` or an equivalent centralized route registry.

Acceptance:

- Public routes and private routes are named constants.
- Legacy redirects reference canonical constants rather than string duplication where practical.
- Module card configuration consumes canonical route constants.

### TR-ISMS-003 — Public route guard exclusion

The router SHALL NOT wrap public pre-subscription routes in `ProtectedRoute`.

Public routes:

- `/`
- `/modules`
- `/journey`
- `/free-assessment`
- `/subscribe`
- `/subscribe/checkout`
- `/auth`
- `/accept-invitation`
- `/marketing/maturity-roadmap`
- `/marketing/risk-management`
- `/marketing/project-implementation`
- `/marketing/data-analytics-assurance`
- `/marketing/systems-integration`
- `/marketing/skills-development`
- `/marketing/incident-intelligence`

Acceptance:

- Static route inspection shows no `ProtectedRoute` around the public route elements.
- Manual verification can open each route without authentication.

### TR-ISMS-004 — Protected route enforcement

Private workspace routes SHALL be wrapped in `ProtectedRoute` or an equivalent auth/permission guard.

Private routes include:

- `/dashboard`
- `/assessment`
- `/maturity/setup`
- `/team`
- `/organization/settings`
- `/admin/*`
- future private module workspace routes.

Acceptance:

- Unauthenticated users cannot access private workspace content.
- Private route access redirects to `/auth` or a governed auth flow.

### TR-ISMS-005 — Legacy marketing redirects

Legacy flat marketing routes SHOULD redirect to canonical `/marketing/*` routes.

Acceptance:

- `/risk-management-info` redirects to `/marketing/risk-management`.
- `/pit-info` redirects to `/marketing/project-implementation`.
- `/data-analytics-info` redirects to `/marketing/data-analytics-assurance`.
- `/data-extraction-info` redirects to `/marketing/systems-integration`.
- `/skills-development-info` redirects to `/marketing/skills-development`.
- `/incident-management-info` redirects to `/marketing/incident-intelligence`.

---

## 4. Module Discovery Technical Requirements

### TR-ISMS-006 — Module card configuration model

The implementation SHOULD define a central module card configuration object or array used by the landing page and module overview page.

Minimum fields:

- module id;
- canonical name;
- short value proposition;
- preview detail;
- marketing route;
- subscription state key;
- optional practical exercise route;
- Ask Maturion prompt seed.

Acceptance:

- Seven required module cards are defined once or kept demonstrably consistent.
- MMM routes to `/marketing/maturity-roadmap`.
- No public card routes directly to a private workspace.

### TR-ISMS-007 — Marketing page data contract

Each module marketing page SHALL expose a consistent technical page pattern.

Minimum fields/sections:

- badge/status marker;
- icon identifier;
- module name;
- summary paragraph;
- key feature list;
- benefit cards;
- primary subscribe CTA;
- secondary navigation back to landing/modules;
- optional practical exercise CTA;
- optional Ask Maturion prompt seed.

Acceptance:

- All required `/marketing/*` routes render consistent page structure.
- Page-specific content may differ, but CTA behavior is consistent.

---

## 5. Free Assessment Technical Requirements

### TR-ISMS-008 — Public free assessment boundary

The free assessment SHALL be public and SHALL remain technically distinct from authenticated MMM assessment execution.

Acceptance:

- `/free-assessment` loads without authentication.
- Free assessment does not require access to private MMM assessment routes.
- Any transition into authenticated assessment must pass through `/auth` and onboarding or an explicit handoff.

### TR-ISMS-009 — Free assessment result state

The free assessment SHOULD create a lightweight result state that can be carried into subscription/onboarding where technically feasible.

Minimum result fields:

- assessment id or local session id;
- timestamp;
- indicative maturity level;
- domain-level summary where available;
- selected next action.

Acceptance:

- Result view or CTA does not dead-end.
- If persistence is not yet available, the implementation clearly uses session/local state and records the limitation.

---

## 6. Subscription, Checkout, Auth, and Onboarding Requirements

### TR-ISMS-010 — Subscription route contract

The `/subscribe` route SHALL accept optional journey context from module marketing pages or free assessment.

Context may include:

- source module id;
- selected package id;
- free assessment result reference;
- return route.

Acceptance:

- Missing context does not break the page.
- Selection continues to `/subscribe/checkout`.

### TR-ISMS-011 — Checkout completion contract

Checkout SHALL have a deterministic post-completion transition.

Required decision for implementation:

- unauthenticated checkout completion routes to `/auth`; or
- authenticated checkout completion routes to `/onboarding`; or
- payment/auth provider callback routes to a documented callback then `/onboarding`.

Acceptance:

- No checkout path ends at NotFound.
- Failure state is visible.
- Success state routes to auth/onboarding path.

### TR-ISMS-012 — Onboarding route contract

The implementation SHALL provide or explicitly defer a route for get-to-know-you onboarding.

Default route:

- `/onboarding`

Minimum context fields:

- org name;
- user role;
- industry;
- region;
- organisation size;
- threat/risk profile;
- selected package;
- enabled modules;
- preferred starting module;
- maturity baseline reference;
- AI personalisation preference.

Acceptance:

- New signed-up users have a deterministic next route.
- Onboarding completion produces shared context or a documented mock/context placeholder for early implementation waves.

---

## 7. Shared Context and Entitlement Requirements

### TR-ISMS-013 — Shared context provider

The app SHALL provide a shared context mechanism for user, organisation, tenant, role, subscription, enabled modules, active route, and active module.

Acceptance:

- Context ownership is centralized through providers/hooks or a documented state mechanism.
- Module pages consume context rather than redefining tenant identity.

### TR-ISMS-014 — Module entitlement checks

Private module entry SHALL check subscription entitlement and permission state before rendering workspace content.

Acceptance:

- Subscribed modules are navigable.
- Unsubscribed modules route to explanation/upgrade flow.
- Unauthorized access attempts are blocked and recordable.

---

## 8. Module Handoff Requirements

### TR-ISMS-015 — Standard handoff payload

Module handoff SHALL use a standard payload.

Minimum fields:

- user id;
- org id;
- subscription id or package key;
- source route;
- target module id;
- target route;
- maturity baseline reference where applicable;
- timestamp.

Acceptance:

- MMM handoff can be implemented using this payload.
- Future PIT/Risk/Incident/RADAM/Skills handoffs can extend it without changing the core shape.

### TR-ISMS-016 — MMM handoff decision

Before implementation handover, TRS/Architecture SHALL decide whether MMM is entered through an internal route or separate deployment handoff.

Provisional route for ISMS portal integration:

- `/maturity/setup`

Acceptance:

- Architecture records final decision.
- Route implementation does not conflict with public marketing route `/marketing/maturity-roadmap`.

---

## 9. Ask Maturion Technical Boundary

### TR-ISMS-017 — Public Ask Maturion affordance

Public Ask Maturion affordances SHALL be educational and non-sensitive.

Acceptance:

- Public prompts do not require tenant data.
- Public answers may route users to public pages, courses, free assessment, or subscription.

### TR-ISMS-018 — Authenticated Ask Maturion context

Authenticated Ask Maturion usage SHALL receive only permitted context based on user, org, role, subscription, active route, and active module.

Acceptance:

- Assistant context is built from shared context provider data.
- Assistant cannot bypass module route or permission boundaries.

---

## 10. Audit and Observability Requirements

### TR-ISMS-019 — Handoff audit event contract

The implementation SHALL define an audit event for material handoffs and permission-sensitive route attempts.

Minimum fields:

- event id;
- event type;
- actor user id;
- org id;
- source route;
- target route;
- target module id;
- permission decision;
- timestamp;
- metadata object.

Acceptance:

- Event contract is defined before implementation handover.
- Storage destination may be a future architecture decision, but the field contract must exist.

### TR-ISMS-020 — Error state observability

Public conversion flows SHALL expose user-visible error states and implementation-level diagnostics sufficient for debugging.

Acceptance:

- Failed checkout, failed onboarding, failed auth handoff, and missing entitlement states show visible user messages.
- Implementation logs must not leak sensitive data.

---

## 11. Data, Schema, and Security Requirements

### TR-ISMS-021 — Schema-to-hook validation gate

Any implementation wave adding database tables or columns SHALL file a schema-to-hook validation artifact.

Acceptance:

- Every new table/column has a consuming hook/query or documented reason.
- No hook references a missing table/column.

### TR-ISMS-022 — RLS and tenant isolation gate

Any persistent tenant/org/user/subscription data SHALL require RLS or equivalent access-control design before production deployment.

Acceptance:

- Tenant-scoped tables have explicit access policy design.
- No cross-tenant data exposure path is accepted.

### TR-ISMS-023 — Environment and secret registry

Any implementation requiring external services SHALL update `.env.example` or equivalent environment documentation.

Acceptance:

- Environment variable names are uppercase with underscores.
- No required runtime secret is undocumented.

---

## 12. Build, Test, and CI Requirements

### TR-ISMS-024 — Implementation build gate

Implementation handover SHALL require build evidence for `apps/isms-portal`.

Minimum commands:

- `npm run build`
- `npm run lint`
- `npm run test:run`

Acceptance:

- Successful output or explicit failure logs are attached to build evidence.
- CI unavailable must not be reported as CI passing.

### TR-ISMS-025 — Route verification test set

Implementation QA SHALL verify all public routes, protected routes, and legacy redirects.

Acceptance:

- Public routes load without auth.
- Private routes require auth.
- Legacy routes redirect to canonical marketing routes.
- All module card CTAs route to valid pages.

---

## 13. Open Issues Disposition

| Issue | Stage 4 Disposition |
|---|---|
| ISMS-OI-001 Stage-number mismatch | Resolved. Repo canon preserved. |
| ISMS-OI-002 Canonical App Description path mismatch | Still open. Architecture/governance cleanup must decide whether to mirror or rename canonical file. |
| ISMS-OI-003 `/onboarding` route missing | TRS defines `/onboarding` as default route; implementation must create it or record explicit deferment. |
| ISMS-OI-004 Post-checkout destination unresolved | TRS requires deterministic transition to `/auth`, `/onboarding`, or callback. Final choice required in Architecture/Implementation Plan. |
| ISMS-OI-005 MMM handoff unresolved | TRS defines provisional `/maturity/setup`; Architecture must confirm internal vs external deployment. |
| ISMS-OI-006 Free assessment result flow unresolved | TRS requires no dead-end and defines public/auth handoff boundary. Final UX implementation still needed. |
| ISMS-OI-007 `MATURITY_SETUP` route decision | Provisional private MMM route remains `/maturity/setup`; Architecture must confirm. |
| ISMS-OI-008 PIT future entry route | Still open. Architecture should reserve `/pit` or governed alternative. |
| ISMS-OI-009 Non-MMM practical exercises | Deferred. Not required for initial public landing harvest. |
| ISMS-OI-010 Ask Maturion boundary | TRS defines public/private boundary; Architecture must define implementation. |
| ISMS-OI-011 Subscription entitlement model | TRS defines entitlement checks; Architecture must define data source. |
| ISMS-OI-012 Audit event contract | TRS defines minimum audit event fields; Architecture must define storage/integration. |
| ISMS-OI-013 Legacy source read-only | Carried forward to implementation plan/builder checklist. |
| ISMS-OI-014 CI/build gates | TRS defines implementation build/test commands and honesty rule. |

---

## 14. Approval Status

This TRS is drafted for review and proxy approval. It does not authorize implementation handover. Stage 5 Architecture reconciliation is the next canonical stage after TRS approval.
