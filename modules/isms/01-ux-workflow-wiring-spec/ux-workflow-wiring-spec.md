# ISMS — UX Workflow & Wiring Spec

## Stage 2 — Pre-Build UX and Wiring Artifact

| Field | Value |
|---|---|
| Product / Module | ISMS — Integrated Security Management System |
| Artifact Type | UX Workflow & Wiring Spec |
| Status | APPROVED WITH CONDITIONS — AI-assisted CS2 proxy sign-off filed in alignment wave |
| Version | v0.1.0 |
| Date | 2026-05-29 |
| Owner / CS2 Authority | Johan Ras |
| Foreman | ChatGPT acting as Foreman for ISMS |
| Primary Location | `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` |
| Upstream Authority | `modules/isms/00-app-description/ISMS_app_description.md` v1.2.0 |
| Downstream Artifact | `modules/isms/02-frs/functional-requirements.md` v0.1.0 |

---

## 0. Derivation Statement

This UX Workflow & Wiring Spec is derived from the ISMS App Description v1.2.0, the user-provided original workflow map, the legacy pre-subscription harvest authority, and the ISMS FRS v0.1.0.

Its purpose is to backfill the missing Stage 2 artifact and provide enough UX/wiring structure for Stage 3 FRS, Stage 4 TRS, Architecture, QA-to-Red, PBFAG, and implementation planning.

---

## 1. Scope

This UX spec covers the ISMS top-level public and transition journey:

1. Public landing.
2. Module discovery.
3. Module explanation / marketing pages.
4. Journey / house-model learning page.
5. Maturity Roadmap / MMM free assessment.
6. Subscription package selection.
7. Checkout.
8. Sign-up / authentication entry.
9. Get-to-know-you onboarding.
10. Private subscribed-module entry.
11. Unsubscribed module learning / upgrade loop.
12. Shared Ask Maturion affordance.
13. Route handoff and context continuity.

Out of scope: deep MMM audit configuration, Domain→MPS→Criteria editing, evidence scoring, PIT execution, risk treatment workflows, incident workflows, RADAM connectors, data assurance internals, and skills/training internals.

---

## 2. Canonical Stage Alignment

Repo canon is reconciled as follows:

| Canonical Stage | Artifact | Status after this wave |
|---|---|---|
| Stage 1 | App Description | Approved with conditions |
| Stage 2 | UX Workflow & Wiring Spec | Approved with conditions |
| Stage 3 | FRS | Approved with conditions |
| Stage 4 | TRS | Next governed stage |

The earlier reference to “Stage 2 / FRS” is interpreted as user intent to proceed with requirements work, while the repo canonical model remains authoritative for file/folder sequencing.

---

## 3. Primary User Journeys

### J-01 — First-touch public landing

**Actor:** Unauthenticated visitor  
**Entry:** `/`  
**Goal:** Understand ISMS and choose a next exploration path.

Flow:

```text
/ -> hero narrative -> feature promises -> module discovery cards -> CTA decision
```

Required UI elements:

- platform hero;
- free assessment CTA;
- module cards;
- journey link;
- modules overview link;
- sign-in/sign-up entry;
- subscribe CTA;
- footer CTA.

Wiring:

| UI Action | Route |
|---|---|
| Start Free Assessment | `/free-assessment` |
| View Modules | `/modules` |
| Journey / Learn more | `/journey` |
| Sign in / Sign up | `/auth` |
| Subscribe / View Plans | `/subscribe` |
| Module card click | `/marketing/<module>` |

Acceptance:

- Page is public.
- No card routes directly to private workspace.
- No `ProtectedRoute` wrapper.

---

### J-02 — Module discovery card exploration

**Actor:** Unauthenticated visitor  
**Entry:** `/` or `/modules`  
**Goal:** Select a module to understand.

Required module cards:

1. Maturity Roadmap / MMM.
2. Risk Management.
3. Project Implementation Tracker / PIT.
4. Incident & Intelligence Hub.
5. Data Analytics & Remote Assurance.
6. Systems Integration / RADAM.
7. Skills Development Portal.

Wiring:

| Module | Route |
|---|---|
| Maturity Roadmap / MMM | `/marketing/maturity-roadmap` |
| Risk Management | `/marketing/risk-management` |
| Project Implementation Tracker / PIT | `/marketing/project-implementation` |
| Data Analytics & Remote Assurance | `/marketing/data-analytics-assurance` |
| Systems Integration / RADAM | `/marketing/systems-integration` |
| Skills Development Portal | `/marketing/skills-development` |
| Incident & Intelligence Hub | `/marketing/incident-intelligence` |

Acceptance:

- Canonical names are used.
- Cards may show hover/preview text.
- Ask Maturion affordance is present or reserved.

---

### J-03 — Module marketing / explanation page

**Actor:** Unauthenticated visitor  
**Entry:** `/marketing/<module>`  
**Goal:** Learn module purpose, benefits, and route to subscription.

Required sections:

1. Badge/status marker.
2. Icon and module name.
3. One-paragraph explanation.
4. Key features list.
5. Benefits cards.
6. Subscribe CTA.
7. Optional practical exercise CTA where available.
8. Back to landing or module catalogue.
9. Ask Maturion affordance where available.

Wiring:

| UI Action | Route |
|---|---|
| Subscribe / Get Started | `/subscribe` |
| Back home | `/` |
| View modules | `/modules` |
| Maturity free assessment where relevant | `/free-assessment` |

Acceptance:

- All marketing routes are public.
- No `ProtectedRoute` wrapping.

---

### J-04 — Journey / house-model learning

**Actor:** Unauthenticated visitor  
**Entry:** `/journey`  
**Goal:** Explore the Maturity Roadmap / house model before subscribing.

Flow:

```text
/journey -> domain/house model overview -> maturity explanation -> CTA to free assessment or subscribe
```

Wiring:

| UI Action | Route |
|---|---|
| Start Free Assessment | `/free-assessment` |
| Maturity Roadmap page | `/marketing/maturity-roadmap` |
| Subscribe | `/subscribe` |
| Back home | `/` |

Acceptance:

- `/journey` is public.
- It explains but does not implement private MMM configuration.

---

### J-05 — Free Maturity Roadmap assessment

**Actor:** Unauthenticated visitor  
**Entry:** `/free-assessment`  
**Goal:** Complete a lightweight practical maturity baseline exercise.

Flow:

```text
/free-assessment -> answer high-level maturity questions -> result / baseline -> subscribe CTA
```

Required behavior:

- capture high-level maturity responses;
- produce an indicative maturity baseline;
- explain current position and next steps;
- route to `/subscribe` or `/auth` as appropriate;
- preserve result for onboarding/MMM first-run when technically available.

Open wiring decision:

- Whether free assessment result remains public, routes to `/subscribe`, or creates an authenticated handoff to `/assessment` must be resolved before implementation handover.

Acceptance:

- `/free-assessment` is public.
- It does not dead-end at an unwired private route.

---

### J-06 — Subscription selection

**Actor:** Visitor or returning user  
**Entry:** `/subscribe`  
**Goal:** Select subscription package/module access.

Flow:

```text
/subscribe -> review plans -> select plan -> /subscribe/checkout
```

Wiring:

| UI Action | Route |
|---|---|
| Select plan | `/subscribe/checkout` |
| Back to modules | `/modules` |
| Sign in | `/auth` |

Acceptance:

- `/subscribe` is public.
- Journey context should be preserved where feasible.

---

### J-07 — Checkout

**Actor:** Visitor or newly registering customer  
**Entry:** `/subscribe/checkout`  
**Goal:** Complete payment/subscription intent and proceed to account creation or onboarding.

Flow:

```text
/subscribe/checkout -> payment/subscription details -> /auth or /onboarding
```

Open wiring decision:

- Final post-checkout destination must be explicitly resolved in TRS/implementation: `/auth` first, `/onboarding` first, or auth-provider callback.

Acceptance:

- Checkout has no dead-end.
- Failure states are visible.

---

### J-08 — Sign-up / authentication

**Actor:** New or returning user  
**Entry:** `/auth`  
**Goal:** Create or access authenticated account.

Flow:

```text
/auth -> login/signup -> session established -> /onboarding or private shell
```

Acceptance:

- `/auth` is public.
- Successful new sign-up routes to get-to-know-you onboarding unless an existing complete context is present.

---

### J-09 — Get-to-know-you onboarding

**Actor:** Authenticated subscribed user  
**Entry:** `/onboarding` or governed equivalent  
**Goal:** Initialise tenant/org/user/subscription/module context.

Required capture:

- tenant / organisation identity;
- user identity and primary role;
- organisation size and structure;
- industry and region;
- threat/risk profile;
- selected subscription package;
- enabled modules;
- preferred starting module;
- initial maturity baseline where available;
- AI personalisation preferences.

Flow:

```text
/onboarding -> org/user/module context -> subscribed module landing
```

Acceptance:

- The route is defined before implementation handover.
- Completion creates or confirms shared ISMS context.

---

### J-10 — Subscribed module landing

**Actor:** Authenticated onboarded user  
**Entry:** `/dashboard` or governed private landing  
**Goal:** See subscribed modules and enter available workspaces.

Behavior:

- subscribed modules are active/navigable;
- unsubscribed modules remain visible as learning/upgrade opportunities;
- private module entry is permission-checked;
- context is carried into module handoff.

Acceptance:

- No private module route is entered without authorization.
- Return path to ISMS shell is preserved.

---

### J-11 — Unsubscribed module upsell loop

**Actor:** Authenticated user without module entitlement  
**Entry:** Private landing module card or public marketing route  
**Goal:** Learn about a module and upgrade/subscribe.

Flow:

```text
unsubscribed module click -> explanation page -> subscribe/upgrade -> checkout -> get-to-know-you update -> module entry
```

Acceptance:

- No unauthorized workspace access occurs.
- User can continue into subscription/upgrade path.

---

## 4. Public / Private Route Wiring

### 4.1 Public routes

The following routes must remain public:

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

### 4.2 Private routes

The following routes must remain protected or deferred until protected implementation exists:

```text
/dashboard
/assessment
/maturity/setup
/team
/organization/settings
/admin/*
/pit or future module workspace routes
```

### 4.3 Legacy route redirects

Legacy marketing routes should redirect as follows:

| Legacy Route | Canonical Route |
|---|---|
| `/risk-management-info` | `/marketing/risk-management` |
| `/pit-info` | `/marketing/project-implementation` |
| `/data-analytics-info` | `/marketing/data-analytics-assurance` |
| `/data-extraction-info` | `/marketing/systems-integration` |
| `/skills-development-info` | `/marketing/skills-development` |
| `/incident-management-info` | `/marketing/incident-intelligence` |

---

## 5. Shared Context Wiring

The get-to-know-you flow must initialise the shared ISMS context envelope:

| Context Area | Source UX Step | Consumed By |
|---|---|---|
| User identity | `/auth` | ISMS shell, modules, audit log |
| Organisation identity | `/onboarding` | ISMS shell and all modules |
| Subscription package | `/subscribe` + checkout | Entitlement checks and module card states |
| Enabled modules | Checkout/subscription state | Private landing/module navigation |
| Preferred starting module | `/onboarding` | Post-onboarding redirect |
| Maturity baseline | `/free-assessment` or onboarding | MMM first-run / Ask Maturion context |
| AI preferences | `/onboarding` | Ask Maturion |
| Role/permission envelope | Auth/onboarding/admin | Route guards and module handoffs |

---

## 6. Ask Maturion UX Wiring

Ask Maturion is a shared platform affordance.

Public UX:

- module cards may expose suggested questions;
- marketing pages may expose “Ask Maturion about this module” affordances;
- responses should remain educational and route users to public pages, courses, subscription, or support paths.

Private UX:

- assistant receives authenticated context;
- assistant may reference current module, organisation, maturity baseline, and user role;
- assistant must not execute module workflows outside permission boundaries.

---

## 7. Open Issues Carried Forward

The following issues are deliberately not resolved in this UX spec and must carry into TRS/Architecture/Implementation Planning:

1. Post-checkout destination: `/auth`, `/onboarding`, or auth-provider callback.
2. `/onboarding` route/component design.
3. MMM handoff target: internal route vs separate deployment.
4. Free assessment public result flow vs authenticated `/assessment` handoff.
5. Future PIT authenticated entry route.
6. Non-MMM practical exercise definitions.
7. Tracker and canonical-file path reconciliation.

See:

```text
modules/isms/01-ux-workflow-wiring-spec/open-issues-carry-forward.md
```

---

## 8. Acceptance Checklist

- [x] Public landing journey documented.
- [x] Module discovery journey documented.
- [x] Marketing explanation page pattern documented.
- [x] Journey/house-model learning documented.
- [x] Free assessment journey documented.
- [x] Subscribe/checkout/auth/onboarding sequence documented.
- [x] Public/private route boundaries documented.
- [x] Shared context wiring documented.
- [x] Ask Maturion UX wiring documented.
- [x] Open issues carried forward.
- [x] Implementation handover not authorized by this artifact.

---

## 9. Approval

Approved with conditions by AI-assisted CS2 proxy evaluator for Johan Ras.
CS2 Authority: Johan Ras.

Conditions:

1. Open issues must be carried into TRS/Architecture.
2. Tracker must be reconciled.
3. Implementation handover remains blocked until downstream gates are complete or explicitly waived.

---

## 10. Change History

| Version | Date | Change | Changed By |
|---|---|---|---|
| v0.1.0 | 2026-05-29 | Initial Stage 2 UX Workflow & Wiring Spec backfill | ChatGPT acting as Foreman/UX Builder |
