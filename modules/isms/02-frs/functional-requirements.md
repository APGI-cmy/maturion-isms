# ISMS — Functional Requirements Specification (FRS)

## Stage 3 — Pre-Build Specification Artifact

> **Stage note:** The local ISMS operating model identifies FRS as Stage 3 (`modules/isms/02-frs`). Johan Ras requested “Stage 2, i.e. create the FRS.” This artifact implements the requested FRS while preserving the local canonical folder/stage model. The Stage 2 UX Workflow & Wiring Spec remains a follow-up/backfill requirement unless CS2 waives or reorders the stage sequence.

---

## Status Header

| Field | Value |
|---|---|
| Product / Module | ISMS — Integrated Security Management System |
| Artifact Type | Functional Requirements Specification |
| Status | DRAFT — For CS2 review and approval |
| Version | v0.1.0 |
| Date | 2026-05-29 |
| Owner / CS2 Authority | Johan Ras |
| Foreman | ChatGPT acting as Foreman for ISMS |
| Primary Location | `modules/isms/02-frs/functional-requirements.md` |
| Upstream Authority | `modules/isms/00-app-description/ISMS_app_description.md` v1.2.0 |
| Governance Model | `FOREMAN_OPERATING_MODEL.md` |
| Scope Declaration | `.agent-admin/scope-declarations/isms-stage-frs-20260529.md` |
| Builder Appointment | `.agent-admin/builder-appointments/isms-stage-frs-20260529-builder-contract.md` |

---

## 0. Derivation and upstream authority

### 0.1 Derivation statement

This Functional Requirements Specification is derived from the ISMS App Description v1.2.0 and its legacy pre-subscription harvest authority. It converts the platform intent, module-boundary rules, public workflow map, subscription/onboarding flow, route-boundary constraints, and downstream handoff requirements into verifiable functional requirements.

A formal ISMS UX Workflow & Wiring Spec is not yet present in the current stage sequence. Where this FRS depends on journey/wiring detail, it cites the workflow authority in App Description §16 and marks unresolved wiring detail as an open issue for Stage 2 backfill or TRS/UX follow-up.

### 0.2 Upstream references

| Artifact | Location | Version / Status | Role |
|---|---|---|---|
| ISMS App Description | `modules/isms/00-app-description/ISMS_app_description.md` | v1.2.0 | Primary product authority |
| Foreman Operating Model | `FOREMAN_OPERATING_MODEL.md` | Active | Governance and wave-control authority |
| Public Landing Discovery Report | `modules/isms/discovery-report/isms-public-landing-harvest-discovery-report.md` | Discovery complete | Legacy harvest/current-state evidence |
| Legacy Harvest Package | `modules/isms/prebuild-harvest-package/` | Active wave support | Public route, harvest, verification, and checklist support |
| FRS Template | `governance/templates/FRS_TEMPLATE.md` | v1.0 | Structural guidance |

### 0.3 Requirement ID convention

Requirements are identified as `FR-ISMS-NNN`. Non-functional and governance-adjacent requirements are listed separately as `NFR-ISMS-NNN` where they support functional delivery.

### 0.4 Functional delivery rule

Every functional requirement must eventually be satisfied live, not merely represented by UI placeholders. For implementation, satisfaction requires that the user can initiate the action, the route or workflow resolves, the system changes or retrieves the intended state, the UI reflects the outcome, and failure states are visible and recoverable.

---

## 1. Purpose and scope

### 1.1 Purpose

This FRS defines the functional baseline for ISMS as the top-level public front door, module discovery surface, shared context initializer, subscription/onboarding route, and governed module-handoff shell for the Maturion ecosystem.

### 1.2 In scope

This FRS covers:

- public ISMS landing and module discovery;
- public module marketing/explanation pages;
- public journey / house-model learning page;
- public Maturity Roadmap / MMM free assessment;
- subscription, checkout, sign-up, and get-to-know-you onboarding flow;
- shared user/org/tenant context initialization;
- public/private route boundaries;
- post-onboarding subscribed module entry and unsubscribed module upsell loops;
- platform-level Ask Maturion affordances;
- cross-module routing and handoff principles;
- legacy harvest requirements for pre-subscription components.

### 1.3 Out of scope

This FRS does not define deep module internals owned by MMM, PIT, Risk, Incident, Data Analytics & Remote Assurance, Systems Integration / RADAM, or Skills Development. In particular, it does not specify MMM Domain→MPS→Criteria configuration internals, evidence scoring, PIT execution workflows, risk register logic, incident lifecycle operations, RADAM connector behavior, or training/certification workflows except as ISMS-facing entry, routing, marketing, or handoff requirements.

This FRS does not implement code and does not approve deployment.

---

## 2. Functional requirement summary

| FR ID | Title | Priority | Source |
|---|---|---|---|
| FR-ISMS-001 | ISMS platform identity and front-door authority | Must | App Description §§1–3 |
| FR-ISMS-002 | Public landing page | Must | §§4, 16 |
| FR-ISMS-003 | Module discovery card set | Must | §5 |
| FR-ISMS-004 | Module card content contract | Must | §5 |
| FR-ISMS-005 | Public module marketing routes | Must | §16 |
| FR-ISMS-006 | Public journey / house-model learning page | Must | §16.6 |
| FR-ISMS-007 | Public free assessment | Must | §§6, 16.7 |
| FR-ISMS-008 | Subscription page | Must | §§6, 16.13 |
| FR-ISMS-009 | Checkout flow | Must | §§6, 16.13 |
| FR-ISMS-010 | Sign-up/auth entry | Must | §§6, 16.10 |
| FR-ISMS-011 | Get-to-know-you onboarding | Must | §§6, 16.14 |
| FR-ISMS-012 | Shared context envelope | Must | §9 |
| FR-ISMS-013 | Public/private route boundaries | Must | §§13, 16.10–16.11 |
| FR-ISMS-014 | Legacy route redirects | Should | §16 |
| FR-ISMS-015 | Subscribed module workspace entry | Must | §§12, 16.13–16.14 |
| FR-ISMS-016 | Unsubscribed module learning/upsell loop | Should | §16.14 |
| FR-ISMS-017 | MMM identity boundary | Must | §§7, 15, 16.15 |
| FR-ISMS-018 | Non-MMM module practical exercise extensibility | Should | §§14, 16.9 |
| FR-ISMS-019 | Ask Maturion shared affordance | Should | §§10, 16.2 |
| FR-ISMS-020 | Auditability of material actions and handoffs | Must | §§11–13 |
| FR-ISMS-021 | Module handoff contract | Must | §12 |
| FR-ISMS-022 | Legacy harvest discipline | Must | §16 |
| FR-ISMS-023 | Known-gap surfacing | Must | §16.16 |
| FR-ISMS-024 | Public landing fully functional delivery gate | Must | Foreman Operating Model §6 |

---

## 3. Functional requirements

### FR-ISMS-001 — ISMS platform identity and front-door authority

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§1–3, §7

The system SHALL present ISMS as the top-level integrated product, public front door, module discovery surface, and ecosystem spine for all Maturion security capabilities.

**Acceptance criteria:**

- Public landing content identifies ISMS as the platform shell rather than a single specialist module.
- MMM, Risk, PIT, Incident, Data Analytics & Remote Assurance, Systems Integration / RADAM, and Skills Development are represented as modules within ISMS.
- No public navigation or page copy positions MMM as the whole ISMS platform.

---

### FR-ISMS-002 — Public landing page

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§4, 16.1, 16.5

The system SHALL provide a public ISMS landing page at `/` that introduces the platform narrative, module discovery, free assessment entry, learning affordances, subscription path, and onward navigation.

**Acceptance criteria:**

- `/` is accessible without authentication.
- The page includes a hero narrative, feature promise cards, module discovery cards, journey/house-model entry, free assessment CTA, subscription CTA, and footer CTA.
- The page routes all module cards to canonical ISMS marketing routes.
- The page contains no production debug `console.log` statements and no broad welcome toast on load.

---

### FR-ISMS-003 — Module discovery card set

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §5

The system SHALL expose the minimum ISMS module discovery card set: Maturity Roadmap / MMM, Risk Management, Project Implementation Tracker / PIT, Incident & Intelligence Hub, Data Analytics & Remote Assurance, Systems Integration / RADAM, and Skills Development Portal.

**Acceptance criteria:**

- All seven cards appear on the landing page or module discovery surface.
- Card names match canonical ISMS names.
- The Maturity Roadmap / MMM card routes to `/marketing/maturity-roadmap`.
- No card routes directly to a private workspace from the public landing page.

---

### FR-ISMS-004 — Module card content contract

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §5

Each public module card SHALL provide a one-line value proposition, hover or compact preview detail where UI supports it, click-through behavior, Ask Maturion affordance or placeholder, and subscription/sign-up path note.

**Acceptance criteria:**

- Each module card has a concise value statement.
- Each card has a clear destination route.
- Each card exposes or reserves an Ask Maturion learning affordance.
- Each card makes clear whether subscription is required for workspace access.

---

### FR-ISMS-005 — Public module marketing routes

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§16.3, 16.8, 16.10

The system SHALL provide public marketing/explanation pages for all required modules under canonical `/marketing/*` routes.

**Acceptance criteria:**

- `/marketing/maturity-roadmap` is public.
- `/marketing/risk-management` is public.
- `/marketing/project-implementation` is public.
- `/marketing/data-analytics-assurance` is public.
- `/marketing/systems-integration` is public.
- `/marketing/skills-development` is public.
- `/marketing/incident-intelligence` is public.
- Each page includes module description, key features, benefit cards, subscribe CTA, and back navigation.

---

### FR-ISMS-006 — Public journey / house-model learning page

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §16.6

The system SHALL provide a public Journey page at `/journey` that lets unauthenticated visitors explore the maturity journey, domain/house model, and platform learning narrative before subscribing.

**Acceptance criteria:**

- `/journey` is public and not wrapped in `ProtectedRoute`.
- The page explains the Maturity Roadmap / house model at a public-friendly level.
- The page provides onward routes to Maturity Roadmap / MMM marketing, free assessment, subscription, and relevant module explanation pages.
- The page does not expose private MMM configuration workflows.

---

### FR-ISMS-007 — Public free assessment

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§6, 16.7

The system SHALL provide a public free assessment at `/free-assessment` as the pre-subscription practical exercise for the Maturity Roadmap / MMM branch.

**Acceptance criteria:**

- `/free-assessment` is public and not wrapped in `ProtectedRoute`.
- The assessment clearly states its relationship to Maturity Roadmap / MMM.
- The assessment captures high-level maturity information sufficient to produce an indicative baseline.
- Results or next-step messaging route the user toward subscription or sign-up.
- If the technical implementation stores or carries a baseline forward, the baseline can be reused by onboarding/MMM first-run context.

---

### FR-ISMS-008 — Subscription page

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§6, 16.13

The system SHALL provide a public subscription/package-selection page at `/subscribe`.

**Acceptance criteria:**

- `/subscribe` is public.
- The page communicates package options, included module access, and route to checkout.
- A user arriving from a module marketing page or free assessment can continue without losing journey context where technically available.
- The page does not require authentication before package review.

---

### FR-ISMS-009 — Checkout flow

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§6, 16.13, 16.16

The system SHALL provide a checkout flow at `/subscribe/checkout` that completes package selection and moves the user toward account creation and get-to-know-you onboarding.

**Acceptance criteria:**

- `/subscribe/checkout` is public until account creation/payment state requires authentication.
- Checkout completion has a defined next route: `/auth`, `/onboarding`, or another governed route.
- Failure states are visible and recoverable.
- The implementation must not dead-end after checkout.

---

### FR-ISMS-010 — Sign-up/auth entry

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§6, 16.10, 16.13

The system SHALL provide a public authentication/sign-up entry at `/auth` for users transitioning from subscription or invitation flows into the private ISMS context.

**Acceptance criteria:**

- `/auth` is public.
- The page supports sign-in/sign-up or routes to the configured auth provider.
- Successful sign-up routes the user to get-to-know-you onboarding unless an existing org/session state already exists.
- Authentication does not block pre-subscription browsing, free assessment entry, or module marketing pages.

---

### FR-ISMS-011 — Get-to-know-you onboarding

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§6, 16.14

The system SHALL provide an ISMS-owned get-to-know-you onboarding flow after subscription/sign-up to initialize organisation, user, role, subscription, module, and AI-personalisation context.

**Acceptance criteria:**

- The onboarding route is defined and reachable after sign-up or checkout.
- The flow captures or confirms organisation identity, user role, organisation size/structure, industry/region, threat/risk profile, selected package, enabled modules, preferred starting module, initial maturity baseline where available, and AI personalisation preferences.
- The flow initializes tenant/org context before private module entry.
- The flow has a clear completion route to the subscribed module landing or dashboard.

---

### FR-ISMS-012 — Shared context envelope

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §9

The system SHALL maintain a shared context envelope across ISMS and downstream modules containing tenant/org identity, user identity, role graph, organisational hierarchy, active journey context, permission envelope, and auditability context.

**Acceptance criteria:**

- Modules consume top-level ISMS context rather than redefining tenant identity.
- Context includes who/what/when/where audit details for material handoffs and actions.
- Active module and active journey context are available to shared navigation and Ask Maturion surfaces.

---

### FR-ISMS-013 — Public/private route boundaries

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§13, 16.10–16.11

The system SHALL enforce public/private route boundaries exactly as governed by the ISMS authority model.

**Acceptance criteria:**

- `/`, `/modules`, `/journey`, `/free-assessment`, `/subscribe`, `/subscribe/checkout`, `/auth`, `/accept-invitation`, and `/marketing/*` routes are public.
- `/dashboard`, `/assessment`, `/maturity/setup`, `/team`, `/organization/settings`, admin routes, and module workspaces are protected.
- No public pre-subscription route is wrapped in `ProtectedRoute`.
- Attempts to access private routes unauthenticated route to auth or a governed access flow.

---

### FR-ISMS-014 — Legacy route redirects

**Priority:** Should Have  
**Status:** Draft  
**Source:** App Description §16

The system SHOULD redirect legacy flat marketing routes to canonical ISMS `/marketing/*` routes.

**Acceptance criteria:**

- `/risk-management-info` redirects to `/marketing/risk-management`.
- `/pit-info` redirects to `/marketing/project-implementation`.
- `/data-analytics-info` redirects to `/marketing/data-analytics-assurance`.
- `/data-extraction-info` redirects to `/marketing/systems-integration`.
- `/skills-development-info` redirects to `/marketing/skills-development`.
- `/incident-management-info` redirects to `/marketing/incident-intelligence`.

---

### FR-ISMS-015 — Subscribed module workspace entry

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§12, 16.13–16.14

After get-to-know-you onboarding, the system SHALL provide a governed private entry into subscribed module workspaces while preserving ISMS context and return-path continuity.

**Acceptance criteria:**

- Subscribed modules are available for navigation after onboarding.
- Module entry is permission-checked.
- Route handoff includes org/user/subscription context.
- The user can return to the ISMS shell without losing context.

---

### FR-ISMS-016 — Unsubscribed module learning/upsell loop

**Priority:** Should Have  
**Status:** Draft  
**Source:** App Description §16.14

Within the private shell, unsubscribed modules SHALL remain visible as learning or upsell surfaces rather than disappearing entirely.

**Acceptance criteria:**

- Unsubscribed modules are distinguishable from subscribed modules.
- Attempting to enter an unsubscribed module routes to explanation, subscription, upgrade, or get-to-know-you update flow.
- Access is not granted to unsubscribed private module workspaces.

---

### FR-ISMS-017 — MMM identity boundary

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§7, 15, 16.15

The system SHALL preserve MMM as the Maturity Roadmap module inside ISMS and SHALL NOT represent MMM as the ISMS landing page or full platform shell.

**Acceptance criteria:**

- Public MMM content lives under `/marketing/maturity-roadmap`.
- Private MMM entry uses `/maturity/setup` or another governed MMM entry route.
- Deep MMM workflows remain downstream MMM responsibilities.
- ISMS pages may route to MMM but do not own Domain→MPS→Criteria configuration or evidence scoring internals.

---

### FR-ISMS-018 — Non-MMM module practical exercise extensibility

**Priority:** Should Have  
**Status:** Draft  
**Source:** App Description §§14, 16.9

The system SHOULD support future practical pre-subscription exercises for non-MMM modules without changing the ISMS public module pattern.

**Acceptance criteria:**

- Module marketing routes can add a practical exercise CTA where governed.
- Missing non-MMM practical exercises do not block initial marketing-page harvest.
- Future exercises route back into the common subscribe/sign-up/get-to-know-you sequence.

---

### FR-ISMS-019 — Ask Maturion shared affordance

**Priority:** Should Have  
**Status:** Draft  
**Source:** App Description §§10, 16.2

The system SHOULD expose Ask Maturion as a shared assistant affordance across public learning surfaces and private module contexts, with responses aware of route, module, user, org, role, and active journey where available.

**Acceptance criteria:**

- Public surfaces can expose Ask Maturion learning prompts or reserved affordances.
- Authenticated surfaces provide richer context where permitted.
- Assistant routing does not execute module workflows outside module ownership boundaries.
- Assistant guidance may route users to courses, module pages, subscription paths, or relevant workspaces.

---

### FR-ISMS-020 — Auditability of material actions and handoffs

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §§11–13

The system SHALL log material cross-module handoffs, subscription transitions, onboarding completion, permission-sensitive access attempts, and module workspace entries.

**Acceptance criteria:**

- Handoff events capture actor, organisation, source route, target module, timestamp, and permission decision.
- Material actions can be reviewed for governance visibility.
- Audit logging does not transfer domain data ownership from modules to ISMS.

---

### FR-ISMS-021 — Module handoff contract

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §12, §16.16

The system SHALL define module handoff contracts for subscribed module entry, beginning with MMM and reserving future PIT/Risk/Incident/RADAM/Skills/Data Assurance entry points.

**Acceptance criteria:**

- MMM handoff target is defined as either an internal route or separate deployment redirect before implementation handover.
- Handoff payload includes user, org, subscription, source route, and relevant initial context.
- Handoff is permission-checked and logged.
- Future module routes can register through a standardised route-handoff pattern.

---

### FR-ISMS-022 — Legacy harvest discipline

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §16

The system SHALL harvest legacy pre-subscription UI/content concepts from `apps/maturion-maturity-legacy/src/` without modifying the legacy source and while correcting legacy route-protection defects.

**Acceptance criteria:**

- Legacy source files remain unchanged unless CS2 explicitly authorizes otherwise.
- Harvested pages are modernized for canonical ISMS route names and module names.
- Legacy ProtectedRoute wrapping of marketing/exploration pages is not carried forward.
- Discarded legacy patterns include debug logging and broad welcome toast on public landing load.

---

### FR-ISMS-023 — Known-gap surfacing

**Priority:** Must Have  
**Status:** Draft  
**Source:** App Description §16.16

The system and downstream artifacts SHALL preserve known gaps as explicit planning items rather than hiding them behind placeholder routes or vague future work.

**Acceptance criteria:**

- `/onboarding` route decision is recorded and resolved before implementation completion.
- MMM handoff contract is resolved before private MMM entry implementation.
- Free assessment result route vs authenticated `/assessment` is resolved before public launch.
- PIT future authenticated entry is reserved or deferred explicitly.
- Non-MMM practical exercises remain recorded as future governed enhancements.

---

### FR-ISMS-024 — Public landing fully functional delivery gate

**Priority:** Must Have  
**Status:** Draft  
**Source:** Foreman Operating Model §6; App Description §16

The system SHALL treat the public landing harvest as fully functional only when all public routes, CTAs, redirects, and subscription/onboarding transitions either work live or disclose a governed placeholder with no broken path.

**Acceptance criteria:**

- Public routes load without authentication.
- All CTAs route to valid pages.
- No user journey dead-ends at NotFound unless intentionally invalid.
- Build/typecheck/test/CI evidence is recorded honestly.
- Known placeholders are visible and tracked, not hidden.

---

## 4. Non-functional and governance-adjacent requirements

| NFR ID | Category | Requirement | Acceptance Criteria |
|---|---|---|---|
| NFR-ISMS-001 | Accessibility | Public pages SHALL be navigable by keyboard and use accessible semantic structure. | Keyboard route through major CTAs and cards works; headings and controls are meaningful. |
| NFR-ISMS-002 | Responsiveness | Public pre-subscription pages SHALL be usable on desktop, tablet, and mobile widths. | Module cards, CTAs, and pricing/subscription content remain readable and navigable. |
| NFR-ISMS-003 | Security | Private workspace routes SHALL require authentication and permission checks. | Unauthenticated users cannot access private module pages. |
| NFR-ISMS-004 | Observability | Material handoffs and route decisions SHOULD produce inspectable event/audit records. | Handoff/audit schema or event contract is defined in TRS. |
| NFR-ISMS-005 | Maintainability | Module card data SHOULD be centralized or otherwise kept consistent across landing and module overview surfaces. | Canonical module names and routes are not duplicated inconsistently. |

---

## 5. Open issues and risks

| Issue ID | Description | Impact | Required Resolution |
|---|---|---|---|
| OI-ISMS-001 | Stage-number mismatch: user referred to FRS as Stage 2; local canon defines FRS as Stage 3. | Tracker and governance confusion. | Reconcile tracker/stage model or record CS2 waiver. |
| OI-ISMS-002 | Formal ISMS UX Workflow & Wiring Spec is absent. | FRS derives directly from App Description and workflow authority, but Stage 2 backfill remains needed. | Create `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` or record waiver. |
| OI-ISMS-003 | `/onboarding` route missing. | Subscribe/sign-up/get-to-know-you loop incomplete. | Define onboarding route and context contract. |
| OI-ISMS-004 | MMM handoff contract undefined. | Private MMM entry ambiguous. | Decide internal route vs separate deployment handoff. |
| OI-ISMS-005 | Free assessment may route to `/assessment`, which is private/unwired in portal state. | Broken public-to-private path risk. | Define public result flow vs authenticated assessment handoff. |
| OI-ISMS-006 | PIT future authenticated entry not reserved in all route constants. | Future module handoff ambiguity. | Reserve `/pit` or another governed PIT entry route. |
| OI-ISMS-007 | Non-MMM practical exercises are conceptual only. | Other module branches have marketing pages but no practical teaser exercises. | Define future module-specific practical exercise specs. |
| OI-ISMS-008 | Tracker may be stale relative to App Description. | Stage state confusion. | Run tracker reconciliation wave. |

No open issue above blocks creation of this draft FRS. They do block final build handover unless resolved or explicitly deferred by CS2.

---

## 6. FR-to-App-Description coverage matrix

| App Description Area | Coverage | FRs |
|---|---|---|
| Product identity and platform authority | Covered | FR-ISMS-001, FR-ISMS-017 |
| Public landing funnel | Covered | FR-ISMS-002, FR-ISMS-024 |
| Module discovery cards | Covered | FR-ISMS-003, FR-ISMS-004 |
| Subscription/sign-up/get-to-know-you | Covered | FR-ISMS-008, FR-ISMS-009, FR-ISMS-010, FR-ISMS-011 |
| Module ownership boundaries | Covered | FR-ISMS-017, FR-ISMS-021 |
| Shared context | Covered | FR-ISMS-012 |
| Shared AI | Covered | FR-ISMS-019 |
| Evidence/audit/dashboard concepts | Covered at platform level | FR-ISMS-020, NFR-ISMS-004 |
| Routing and handoff model | Covered | FR-ISMS-013, FR-ISMS-015, FR-ISMS-021 |
| Legacy harvest authority | Covered | FR-ISMS-005, FR-ISMS-006, FR-ISMS-007, FR-ISMS-014, FR-ISMS-022, FR-ISMS-023 |
| Future expansion hooks | Covered | FR-ISMS-018, FR-ISMS-021 |

---

## 7. Completeness checklist

- [x] Derived from current ISMS App Description v1.2.0.
- [x] Preserves ISMS as platform front door.
- [x] Preserves MMM as module inside ISMS.
- [x] Captures public pre-subscription workflow.
- [x] Captures required public routes.
- [x] Captures private route boundary.
- [x] Captures legacy harvest discipline.
- [x] Captures onboarding/shared context requirements.
- [x] Captures module handoff requirements.
- [x] Records known gaps as open issues.
- [ ] CS2 approval recorded.
- [ ] Formal Stage 2 UX Workflow & Wiring Spec exists or waiver recorded.
- [ ] Tracker reconciled.

---

## 8. Approval and sign-off

| Role | Status |
|---|---|
| Foreman QP | Pending companion artifact |
| IAA Review | Pending companion artifact |
| CS2 / Authorized Proxy Approval | Not yet recorded |

This FRS is a draft suitable for review and downstream discussion. It must not be treated as CS2-approved until Johan Ras or an explicitly authorized AI-assisted CS2 proxy records approval.

---

## 9. Change history

| Version | Date | Change | Changed By |
|---|---|---|---|
| v0.1.0 | 2026-05-29 | Initial ISMS FRS draft derived from App Description v1.2.0 | ChatGPT acting as Foreman/Requirements Builder |

---

**End of FRS Document**
