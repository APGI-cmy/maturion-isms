# ISMS Stage 6 — QA-to-Red Catalog

| Field | Value |
|---|---|
| Module | ISMS — Integrated Security Management System |
| Artifact | QA-to-Red Catalog |
| Stage | Stage 6 |
| Version | v0.1.0 |
| Wave | `isms-stage6-qa-to-red-20260530` |
| Status | RED — Implementation is not yet complete. These tests are expected to fail until implementation satisfies them. |

---

## 1. Purpose

This catalog defines the RED QA suite required before ISMS can proceed toward PBFAG and implementation planning. It is intentionally written as a failing specification: each test describes the observable behavior that must become GREEN only after implementation.

This catalog uses the Stage 5 architecture completeness gap analysis as a mandatory input. It therefore includes not only visible UI tests but also wiring, AI, edge function, Supabase, RLS, audit, deployment, and CI/build gates.

---

## 2. Domain Summary

| Domain | Description | Test Range | Count |
|---|---|---|---|
| D1 | Public route and navigation wiring | T-ISMS-S6-001–010 | 10 |
| D2 | Module cards and marketing pages | T-ISMS-S6-011–020 | 10 |
| D3 | Free assessment and maturity baseline | T-ISMS-S6-021–030 | 10 |
| D4 | Subscribe, checkout, auth, onboarding | T-ISMS-S6-031–042 | 12 |
| D5 | Shared context, entitlement, module handoff | T-ISMS-S6-043–055 | 13 |
| D6 | Ask Maturion AI capability boundary | T-ISMS-S6-056–064 | 9 |
| D7 | Edge functions and backend execution registry | T-ISMS-S6-065–072 | 8 |
| D8 | Supabase schema, migrations, RLS, schema-to-hook | T-ISMS-S6-073–086 | 14 |
| D9 | Audit, error handling, observability | T-ISMS-S6-087–096 | 10 |
| D10 | Deployment, runtime, env, CI/build gates | T-ISMS-S6-097–108 | 12 |
| D11 | Architecture completeness and wave regression gates | T-ISMS-S6-109–120 | 12 |
| **TOTAL** | | **T-ISMS-S6-001–120** | **120** |

---

## 3. RED Test Catalog

## D1 — Public Route and Navigation Wiring

### T-ISMS-S6-001 — Public Landing Route Loads Without Authentication
- **Source**: FR-ISMS-002; TR-ISMS-003; Architecture §4.1
- **Layer**: E2E
- **RED Condition**: `/` returns 404, blank page, or auth redirect.
- **Acceptance Criteria**: Unauthenticated visit to `/` renders ISMS landing page with hero, module discovery, free assessment CTA, and subscribe CTA.

### T-ISMS-S6-002 — Modules Overview Route Loads Without Authentication
- **Source**: UX J-02; TR-ISMS-003
- **Layer**: E2E
- **RED Condition**: `/modules` is missing, protected, or blank.
- **Acceptance Criteria**: `/modules` renders all required module cards without authentication.

### T-ISMS-S6-003 — Journey Route Loads Without Authentication
- **Source**: FR-ISMS-006; UX J-04
- **Layer**: E2E
- **RED Condition**: `/journey` redirects to auth or does not render learning content.
- **Acceptance Criteria**: `/journey` renders the house-model/maturity journey content and onward CTAs.

### T-ISMS-S6-004 — Free Assessment Route Loads Without Authentication
- **Source**: FR-ISMS-007; TR-ISMS-008
- **Layer**: E2E
- **RED Condition**: `/free-assessment` redirects to login or fails to render assessment entry.
- **Acceptance Criteria**: `/free-assessment` renders the public assessment start screen unauthenticated.

### T-ISMS-S6-005 — Subscribe Route Loads Without Authentication
- **Source**: FR-ISMS-008; TR-ISMS-010
- **Layer**: E2E
- **RED Condition**: `/subscribe` fails to render plan selection unauthenticated.
- **Acceptance Criteria**: `/subscribe` renders package options and checkout CTA.

### T-ISMS-S6-006 — Checkout Route Loads Without Authentication Until Auth Required
- **Source**: FR-ISMS-009; TR-ISMS-011
- **Layer**: E2E
- **RED Condition**: `/subscribe/checkout` dead-ends or immediately fails without clear auth/payment state.
- **Acceptance Criteria**: `/subscribe/checkout` renders checkout state or clear route to auth/onboarding.

### T-ISMS-S6-007 — Auth Route Loads Without Authentication
- **Source**: FR-ISMS-010; TR-ISMS-003
- **Layer**: E2E
- **RED Condition**: `/auth` is missing or protected.
- **Acceptance Criteria**: `/auth` renders sign-in/sign-up entry unauthenticated.

### T-ISMS-S6-008 — Accept Invitation Route Loads Without Authentication
- **Source**: FR-ISMS-013; TR-ISMS-003
- **Layer**: E2E
- **RED Condition**: `/accept-invitation` is missing or protected.
- **Acceptance Criteria**: `/accept-invitation` renders invitation handling entry or governed placeholder.

### T-ISMS-S6-009 — Private Routes Require Authentication
- **Source**: FR-ISMS-013; TR-ISMS-004
- **Layer**: E2E/Auth
- **RED Condition**: `/dashboard`, `/assessment`, or `/maturity/setup` render private content unauthenticated.
- **Acceptance Criteria**: Private routes redirect to `/auth` or equivalent auth flow.

### T-ISMS-S6-010 — Legacy Marketing Redirects Resolve
- **Source**: FR-ISMS-014; TR-ISMS-005
- **Layer**: E2E/Routing
- **RED Condition**: Legacy routes return 404 or private auth wall.
- **Acceptance Criteria**: Legacy routes redirect to canonical `/marketing/*` pages.

---

## D2 — Module Cards and Marketing Pages

### T-ISMS-S6-011 — Required Module Card Set Renders
- **Source**: FR-ISMS-003; TR-ISMS-006
- **Layer**: E2E
- **RED Condition**: Any required module card is missing.
- **Acceptance Criteria**: Seven required cards render with canonical names.

### T-ISMS-S6-012 — Module Card Configuration Is Centralized
- **Source**: TR-ISMS-006; Architecture §5
- **Layer**: Static/Integration
- **RED Condition**: Module names/routes are duplicated inconsistently across pages.
- **Acceptance Criteria**: Landing and modules overview consume a shared module-card configuration or equivalent tested source.

### T-ISMS-S6-013 — MMM Card Routes to Maturity Marketing Page
- **Source**: FR-ISMS-017
- **Layer**: E2E
- **RED Condition**: MMM card routes to `/`, `/maturity/setup`, or private workspace.
- **Acceptance Criteria**: MMM card routes to `/marketing/maturity-roadmap`.

### T-ISMS-S6-014 — Risk Card Routes to Risk Marketing Page
- **Source**: FR-ISMS-005
- **Layer**: E2E
- **RED Condition**: Risk card route missing or private.
- **Acceptance Criteria**: Risk card routes to `/marketing/risk-management`.

### T-ISMS-S6-015 — PIT Card Routes to PIT Marketing Page
- **Source**: FR-ISMS-005
- **Layer**: E2E
- **RED Condition**: PIT card route missing or private.
- **Acceptance Criteria**: PIT card routes to `/marketing/project-implementation`.

### T-ISMS-S6-016 — Data Assurance Card Routes to Marketing Page
- **Source**: FR-ISMS-005
- **Layer**: E2E
- **RED Condition**: Data card route missing or private.
- **Acceptance Criteria**: Data card routes to `/marketing/data-analytics-assurance`.

### T-ISMS-S6-017 — Systems/RADAM Card Routes to Marketing Page
- **Source**: FR-ISMS-005
- **Layer**: E2E
- **RED Condition**: Systems card route missing or private.
- **Acceptance Criteria**: Systems card routes to `/marketing/systems-integration`.

### T-ISMS-S6-018 — Skills Card Routes to Marketing Page
- **Source**: FR-ISMS-005
- **Layer**: E2E
- **RED Condition**: Skills card route missing or private.
- **Acceptance Criteria**: Skills card routes to `/marketing/skills-development`.

### T-ISMS-S6-019 — Incident Card Routes to Marketing Page
- **Source**: FR-ISMS-005
- **Layer**: E2E
- **RED Condition**: Incident card route missing or private.
- **Acceptance Criteria**: Incident card routes to `/marketing/incident-intelligence`.

### T-ISMS-S6-020 — Marketing Page Pattern Includes Required Sections
- **Source**: FR-ISMS-005; TR-ISMS-007
- **Layer**: E2E/Visual-Content
- **RED Condition**: Marketing pages omit features, benefits, subscribe CTA, or back navigation.
- **Acceptance Criteria**: Each marketing page renders header, summary, features, benefits, subscribe CTA, and back navigation.

---

## D3 — Free Assessment and Maturity Baseline

### T-ISMS-S6-021 — Free Assessment Starts From Landing CTA
- **Source**: UX J-05
- **Layer**: E2E
- **RED Condition**: Landing CTA missing or broken.
- **Acceptance Criteria**: Start Free Assessment CTA routes to `/free-assessment`.

### T-ISMS-S6-022 — Assessment Captures High-Level Responses
- **Source**: FR-ISMS-007
- **Layer**: Integration
- **RED Condition**: Assessment has no response capture mechanism.
- **Acceptance Criteria**: User can answer high-level maturity questions and continue.

### T-ISMS-S6-023 — Assessment Computes Indicative Baseline
- **Source**: TR-ISMS-009
- **Layer**: Integration
- **RED Condition**: Completion produces no baseline result.
- **Acceptance Criteria**: Completion yields indicative maturity level and summary.

### T-ISMS-S6-024 — Assessment Result Does Not Dead-End
- **Source**: Architecture Completeness Gap Analysis FFD-GAP-008
- **Layer**: E2E
- **RED Condition**: Result routes to 404 or private `/assessment` without auth handoff.
- **Acceptance Criteria**: Result page offers subscribe/auth/onboarding path and avoids dead-end.

### T-ISMS-S6-025 — Assessment Result Can Carry Context Forward
- **Source**: TR-ISMS-009
- **Layer**: Integration
- **RED Condition**: Baseline cannot be referenced by subscribe/onboarding.
- **Acceptance Criteria**: Result state has stable session/reference key or documented local/session strategy.

### T-ISMS-S6-026 — Free Assessment Remains Distinct From Private MMM Assessment
- **Source**: FR-ISMS-017; TR-ISMS-008
- **Layer**: Architecture/E2E
- **RED Condition**: Public assessment directly exposes private MMM execution.
- **Acceptance Criteria**: Public result handoff to private MMM requires auth and onboarding.

### T-ISMS-S6-027 — Free Assessment Handles Incomplete Answers
- **Source**: TR-ISMS-020
- **Layer**: E2E/Error
- **RED Condition**: Incomplete answers crash or submit invalid state.
- **Acceptance Criteria**: User receives validation guidance and can recover.

### T-ISMS-S6-028 — Free Assessment Handles Refresh/Back Navigation
- **Source**: TR-ISMS-020
- **Layer**: E2E/Error
- **RED Condition**: Refresh loses state without warning or breaks page.
- **Acceptance Criteria**: State is preserved or user receives clear restart/recovery option.

### T-ISMS-S6-029 — Free Assessment Accessibility
- **Source**: NFR-ISMS-001
- **Layer**: Accessibility
- **RED Condition**: Questions cannot be completed by keyboard or labels are missing.
- **Acceptance Criteria**: Assessment controls have labels and keyboard navigation works.

### T-ISMS-S6-030 — Free Assessment Telemetry/Audit Hook Exists
- **Source**: TR-ISMS-019
- **Layer**: Integration/Observability
- **RED Condition**: Completion has no event/audit contract.
- **Acceptance Criteria**: Assessment completion event can be emitted or logged through defined audit contract.

---

## D4 — Subscribe, Checkout, Auth, Onboarding

### T-ISMS-S6-031 — Subscribe Presents Plans
- **Source**: FR-ISMS-008
- **Layer**: E2E
- **RED Condition**: No package options render.
- **Acceptance Criteria**: `/subscribe` renders at least one package with clear CTA.

### T-ISMS-S6-032 — Subscribe Accepts Source Journey Context
- **Source**: TR-ISMS-010
- **Layer**: Integration
- **RED Condition**: Source module/free-assessment context is discarded silently.
- **Acceptance Criteria**: Source context is accepted or explicitly ignored with documented fallback.

### T-ISMS-S6-033 — Checkout Success Routes Deterministically
- **Source**: TR-ISMS-011; Architecture §7
- **Layer**: E2E
- **RED Condition**: Checkout success has no deterministic next route.
- **Acceptance Criteria**: Unauthenticated completion routes to `/auth`; authenticated/callback completion routes to `/onboarding`.

### T-ISMS-S6-034 — Checkout Failure Is Recoverable
- **Source**: TR-ISMS-020
- **Layer**: E2E/Error
- **RED Condition**: Failed checkout shows blank page or unrecoverable error.
- **Acceptance Criteria**: User sees failure message and can retry or return to subscribe.

### T-ISMS-S6-035 — Auth Success Routes New Users to Onboarding
- **Source**: FR-ISMS-010; TR-ISMS-012
- **Layer**: E2E/Auth
- **RED Condition**: New user lands on generic dashboard without context initialization.
- **Acceptance Criteria**: New user signs up and routes to `/onboarding`.

### T-ISMS-S6-036 — Onboarding Route Exists
- **Source**: FR-ISMS-011; Architecture §7
- **Layer**: E2E
- **RED Condition**: `/onboarding` returns 404 or private dead-end.
- **Acceptance Criteria**: `/onboarding` renders authenticated onboarding shell.

### T-ISMS-S6-037 — Onboarding Captures Required Fields
- **Source**: TR-ISMS-012
- **Layer**: E2E/Integration
- **RED Condition**: Required org/user/package fields missing.
- **Acceptance Criteria**: Onboarding captures org, role, industry, region, size, threat profile, package, modules, starting module, baseline ref, AI preference.

### T-ISMS-S6-038 — Onboarding Validates Mandatory Fields
- **Source**: TR-ISMS-020
- **Layer**: Integration
- **RED Condition**: User can complete onboarding with required fields null.
- **Acceptance Criteria**: Missing required fields block completion with visible errors.

### T-ISMS-S6-039 — Onboarding Initializes Shared Context
- **Source**: FR-ISMS-012; TR-ISMS-013
- **Layer**: Integration
- **RED Condition**: Completion creates no shared context.
- **Acceptance Criteria**: Shared context contains user, org, subscription, role, enabled modules, active module, AI preference.

### T-ISMS-S6-040 — Onboarding Completion Routes to Preferred Module or Dashboard
- **Source**: FR-ISMS-015
- **Layer**: E2E
- **RED Condition**: Completion dead-ends.
- **Acceptance Criteria**: Completion routes to preferred subscribed module or private dashboard.

### T-ISMS-S6-041 — Invitation Acceptance Initializes Correct Flow
- **Source**: FR-ISMS-010
- **Layer**: E2E/Auth
- **RED Condition**: Invitation route cannot establish auth/org context.
- **Acceptance Criteria**: Accepted invitation routes through auth and context initialization.

### T-ISMS-S6-042 — Existing Users Skip Completed Onboarding
- **Source**: UX J-08/J-09
- **Layer**: Integration
- **RED Condition**: Completed users are forced through onboarding every session.
- **Acceptance Criteria**: Completed users route to dashboard/module unless profile is incomplete.

---

## D5 — Shared Context, Entitlement, Module Handoff

### T-ISMS-S6-043 — Shared Context Provider Exists
- **Source**: TR-ISMS-013
- **Layer**: Static/Integration
- **RED Condition**: Context is scattered across pages with no provider/hook.
- **Acceptance Criteria**: Central context provider/hook exposes auth, org, subscription, role, active module, and route context.

### T-ISMS-S6-044 — Entitlement Model Controls Module Access
- **Source**: TR-ISMS-014
- **Layer**: Integration/Auth
- **RED Condition**: Unsubscribed users can access private module routes.
- **Acceptance Criteria**: Entitlement check blocks unsubscribed private module access.

### T-ISMS-S6-045 — Unsubscribed Module Routes to Upsell Loop
- **Source**: FR-ISMS-016
- **Layer**: E2E
- **RED Condition**: Unsubscribed module click dead-ends or grants access.
- **Acceptance Criteria**: User sees explanation/upgrade path.

### T-ISMS-S6-046 — MMM Handoff Uses Standard Payload
- **Source**: TR-ISMS-015; Architecture §8
- **Layer**: Integration
- **RED Condition**: `/maturity/setup` receives no user/org/subscription/source context.
- **Acceptance Criteria**: Handoff payload includes userId, orgId, subscriptionKey, sourceRoute, targetModuleId, targetRoute, timestamp.

### T-ISMS-S6-047 — Future PIT Route Is Reserved and Protected
- **Source**: Architecture §8
- **Layer**: Static/E2E
- **RED Condition**: `/pit` not reserved or publicly exposes private content.
- **Acceptance Criteria**: `/pit` is reserved/protected or routes to governed placeholder.

### T-ISMS-S6-048 — Future Risk Route Is Reserved and Protected
- **Source**: Architecture §8
- **Layer**: Static/E2E
- **RED Condition**: `/risk` not reserved or publicly exposes private content.
- **Acceptance Criteria**: `/risk` is reserved/protected or routes to governed placeholder.

### T-ISMS-S6-049 — Future Incidents Route Is Reserved and Protected
- **Source**: Architecture §8
- **Layer**: Static/E2E
- **RED Condition**: `/incidents` not reserved or publicly exposes private content.
- **Acceptance Criteria**: `/incidents` is reserved/protected or routes to governed placeholder.

### T-ISMS-S6-050 — Future Analytics Route Is Reserved and Protected
- **Source**: Architecture §8
- **Layer**: Static/E2E
- **RED Condition**: `/analytics` not reserved or publicly exposes private content.
- **Acceptance Criteria**: `/analytics` is reserved/protected or routes to governed placeholder.

### T-ISMS-S6-051 — Future Integrations Route Is Reserved and Protected
- **Source**: Architecture §8
- **Layer**: Static/E2E
- **RED Condition**: `/integrations` not reserved or publicly exposes private content.
- **Acceptance Criteria**: `/integrations` is reserved/protected or routes to governed placeholder.

### T-ISMS-S6-052 — Future Skills Route Is Reserved and Protected
- **Source**: Architecture §8
- **Layer**: Static/E2E
- **RED Condition**: `/skills` not reserved or publicly exposes private content.
- **Acceptance Criteria**: `/skills` is reserved/protected or routes to governed placeholder.

### T-ISMS-S6-053 — Handoff Events Are Recordable
- **Source**: TR-ISMS-019
- **Layer**: Integration
- **RED Condition**: Module handoff has no audit event hook.
- **Acceptance Criteria**: Handoff can emit event with eventId, eventType, actor, org, sourceRoute, targetRoute, module, decision, timestamp.

### T-ISMS-S6-054 — Context Survives Return to ISMS Shell
- **Source**: FR-ISMS-015
- **Layer**: E2E
- **RED Condition**: Returning from module loses org/module context.
- **Acceptance Criteria**: User returns to shell with active org/subscription/module state intact.

### T-ISMS-S6-055 — Unauthorized Module Attempt Is Visible and Recoverable
- **Source**: TR-ISMS-020
- **Layer**: E2E/Error
- **RED Condition**: Unauthorized access shows blank or raw error.
- **Acceptance Criteria**: User sees clear access message and routes to subscribe/upgrade or home.

---

## D6 — Ask Maturion AI Capability Boundary

### T-ISMS-S6-056 — Public Ask Maturion Uses Safe Public Prompt Contract
- **Source**: TR-ISMS-017
- **Layer**: Integration/AI
- **RED Condition**: Public AI prompt requests tenant/user data or unrestricted context.
- **Acceptance Criteria**: Public prompts are educational and require no tenant context.

### T-ISMS-S6-057 — Authenticated Ask Maturion Receives Filtered Context
- **Source**: TR-ISMS-018
- **Layer**: Integration/AI
- **RED Condition**: AI receives unfiltered org/module data or no context.
- **Acceptance Criteria**: AI context adapter sends only permitted user/org/role/subscription/active-module fields.

### T-ISMS-S6-058 — AI Adapter Contract Exists
- **Source**: Architecture Completeness Gap Analysis FFD-GAP-004
- **Layer**: Static/Contract
- **RED Condition**: UI calls AI package directly with ad hoc payload.
- **Acceptance Criteria**: A defined adapter contract mediates Ask Maturion requests.

### T-ISMS-S6-059 — AI Permission Filter Blocks Unauthorized Module Context
- **Source**: TR-ISMS-018
- **Layer**: Integration/Security
- **RED Condition**: User can ask about unsubscribed private module data.
- **Acceptance Criteria**: Context filter omits unauthorized module data and routes to upgrade/learning guidance.

### T-ISMS-S6-060 — AI Failure Has Non-Blocking Fallback
- **Source**: TR-ISMS-020
- **Layer**: E2E/Error
- **RED Condition**: AI failure breaks page or blocks core navigation.
- **Acceptance Criteria**: User sees non-blocking fallback and can continue.

### T-ISMS-S6-061 — AI Prompt Seeds Exist for Module Cards
- **Source**: FR-ISMS-004
- **Layer**: Static/Content
- **RED Condition**: Module cards lack Ask Maturion seed prompts.
- **Acceptance Criteria**: Each module card has a prompt seed or explicit deferred marker.

### T-ISMS-S6-062 — AI Requests Are Observable Without Sensitive Leakage
- **Source**: TR-ISMS-020
- **Layer**: Observability/Security
- **RED Condition**: AI errors are unlogged or logs expose secrets.
- **Acceptance Criteria**: AI request failure logs contain non-sensitive diagnostic metadata.

### T-ISMS-S6-063 — Public AI Does Not Execute Private Workflows
- **Source**: FR-ISMS-019
- **Layer**: Security/E2E
- **RED Condition**: Public AI triggers module workflow action.
- **Acceptance Criteria**: Public AI only explains and routes.

### T-ISMS-S6-064 — Authenticated AI Does Not Bypass Route Guards
- **Source**: FR-ISMS-019
- **Layer**: Security/Integration
- **RED Condition**: AI action grants access without entitlement.
- **Acceptance Criteria**: AI capability checks same entitlement/permission model as UI routes.

---

## D7 — Edge Functions and Backend Execution Registry

### T-ISMS-S6-065 — Edge Function Registry Exists
- **Source**: Architecture Completeness Gap Analysis FFD-GAP-005
- **Layer**: Static/Governance
- **RED Condition**: ISMS invokes or expects backend functions without registry.
- **Acceptance Criteria**: Registry lists each function or explicitly states none used for initial wave.

### T-ISMS-S6-066 — Function Invocation Map Exists
- **Source**: Architecture Completeness Gap Analysis FFD-GAP-005
- **Layer**: Static/Contract
- **RED Condition**: UI/service calls functions with no mapped invocation contract.
- **Acceptance Criteria**: Each function has caller, input, output, auth, error, deploy status.

### T-ISMS-S6-067 — Free Assessment Backend Boundary Registered
- **Source**: TR-ISMS-008/009
- **Layer**: Contract
- **RED Condition**: Assessment persistence/calculation has no backend boundary decision.
- **Acceptance Criteria**: Registry records client-only, API route, Supabase, or edge function strategy.

### T-ISMS-S6-068 — Checkout Backend Boundary Registered
- **Source**: TR-ISMS-011
- **Layer**: Contract
- **RED Condition**: Checkout provider/callback logic has no function/API boundary.
- **Acceptance Criteria**: Registry records checkout provider integration point and callback route/function.

### T-ISMS-S6-069 — Onboarding Backend Boundary Registered
- **Source**: TR-ISMS-012
- **Layer**: Contract
- **RED Condition**: Onboarding writes have no backend/data boundary.
- **Acceptance Criteria**: Registry records where onboarding data is validated and persisted.

### T-ISMS-S6-070 — Audit Backend Boundary Registered
- **Source**: TR-ISMS-019
- **Layer**: Contract
- **RED Condition**: Audit events have no write path.
- **Acceptance Criteria**: Registry records audit write mechanism.

### T-ISMS-S6-071 — AI Backend Boundary Registered
- **Source**: TR-ISMS-017/018
- **Layer**: Contract
- **RED Condition**: AI calls bypass defined boundary.
- **Acceptance Criteria**: Registry records AI adapter/function/package boundary.

### T-ISMS-S6-072 — No Unregistered Function Invocation
- **Source**: Architecture Completeness Requirements §3.16
- **Layer**: Static
- **RED Condition**: Code references function names not in registry.
- **Acceptance Criteria**: Static scan finds no unregistered function invocation.

---

## D8 — Supabase Schema, Migrations, RLS, Schema-to-Hook

### T-ISMS-S6-073 — Supabase Data Architecture Exists
- **Source**: Architecture Completeness Gap Analysis FFD-GAP-003
- **Layer**: Governance/Data
- **RED Condition**: No table/model list exists for ISMS persistence.
- **Acceptance Criteria**: Data architecture lists all tables/models or explicitly declares no persistence for initial wave.

### T-ISMS-S6-074 — Onboarding Schema Defined
- **Source**: TR-ISMS-012
- **Layer**: Data
- **RED Condition**: No schema for org/user onboarding context.
- **Acceptance Criteria**: Schema includes org, role, industry, region, size, risk profile, package, modules, AI preference.

### T-ISMS-S6-075 — Entitlement Schema Defined
- **Source**: TR-ISMS-014
- **Layer**: Data/Security
- **RED Condition**: No data source for enabled modules.
- **Acceptance Criteria**: Entitlement model stores subscriptionKey, enabledModules, trialModules, expiredModules, upgradeRoute.

### T-ISMS-S6-076 — Free Assessment Result Schema Defined
- **Source**: TR-ISMS-009
- **Layer**: Data
- **RED Condition**: No schema/result state for baseline reference.
- **Acceptance Criteria**: Result model includes assessment/session id, timestamp, maturity level, domain summary, next action.

### T-ISMS-S6-077 — Handoff Event Schema Defined
- **Source**: TR-ISMS-015/019
- **Layer**: Data/Audit
- **RED Condition**: No schema for handoff/audit event.
- **Acceptance Criteria**: Event schema includes required audit fields.

### T-ISMS-S6-078 — Migration Plan Exists
- **Source**: Architecture Completeness Requirements §3.4
- **Layer**: Data/Governance
- **RED Condition**: Tables are described but no migration plan exists.
- **Acceptance Criteria**: Migration location, order, rollback, and seed/mock policy are defined.

### T-ISMS-S6-079 — Schema-to-Hook Matrix Exists
- **Source**: TR-ISMS-021
- **Layer**: Static/Data
- **RED Condition**: Tables/columns have no consuming hooks or queries.
- **Acceptance Criteria**: Each table/column maps to hook/query or explicit no-use rationale.

### T-ISMS-S6-080 — RLS Matrix Exists
- **Source**: TR-ISMS-022
- **Layer**: Security/Data
- **RED Condition**: No table-level RLS/access matrix.
- **Acceptance Criteria**: Each persistent table has CRUD policy by actor and tenant boundary.

### T-ISMS-S6-081 — Tenant Isolation Tests Defined
- **Source**: TR-ISMS-022
- **Layer**: Security/Test
- **RED Condition**: No tests prevent cross-tenant reads/writes.
- **Acceptance Criteria**: RED tests cover cross-tenant read/write denial.

### T-ISMS-S6-082 — Public Data Access Boundaries Defined
- **Source**: TR-ISMS-003/022
- **Layer**: Security/Data
- **RED Condition**: Public pages require private DB access or expose tenant data.
- **Acceptance Criteria**: Public pages use public/static data or safe read policies only.

### T-ISMS-S6-083 — Supabase Env Variables Declared
- **Source**: TR-ISMS-023
- **Layer**: Config
- **RED Condition**: Supabase URL/key vars missing from env registry where Supabase is used.
- **Acceptance Criteria**: Env registry declares required Supabase vars and public/secret classification.

### T-ISMS-S6-084 — Seed/Mock Data Strategy Exists
- **Source**: Architecture Completeness Requirements §3.10
- **Layer**: Test Data
- **RED Condition**: Tests rely on unknown production data.
- **Acceptance Criteria**: Test data strategy defines seeds, factories, or mocked providers.

### T-ISMS-S6-085 — Data Rollback Strategy Exists
- **Source**: Architecture Completeness Requirements §3.4
- **Layer**: Data/Ops
- **RED Condition**: Migration failure has no rollback path.
- **Acceptance Criteria**: Rollback/recovery procedure exists for migration failures.

### T-ISMS-S6-086 — No Missing Table/Column References
- **Source**: TR-ISMS-021
- **Layer**: Static/Data
- **RED Condition**: Hooks reference missing tables/columns.
- **Acceptance Criteria**: Schema-to-hook validation passes.

---

## D9 — Audit, Error Handling, Observability

### T-ISMS-S6-087 — Audit Event Writer Exists or Is Explicitly Stubbed
- **Source**: TR-ISMS-019
- **Layer**: Integration
- **RED Condition**: Material events cannot be recorded.
- **Acceptance Criteria**: Audit writer contract exists; stub is explicitly marked non-production if used.

### T-ISMS-S6-088 — Handoff Audit Event Emits Required Fields
- **Source**: Architecture §11
- **Layer**: Integration
- **RED Condition**: Handoff event missing required fields.
- **Acceptance Criteria**: Event includes eventId, eventType, actor, org, routes, target module, decision, timestamp.

### T-ISMS-S6-089 — Route Guard Denial Emits Audit/Telemetry Event
- **Source**: TR-ISMS-019
- **Layer**: Integration/Security
- **RED Condition**: Unauthorized attempts are invisible.
- **Acceptance Criteria**: Denial event includes user/session, route, decision, timestamp.

### T-ISMS-S6-090 — Error Taxonomy Exists
- **Source**: Architecture Completeness Requirements §3.9
- **Layer**: Governance/Observability
- **RED Condition**: Errors are not classified.
- **Acceptance Criteria**: User error, auth error, validation error, dependency error, system error classes exist.

### T-ISMS-S6-091 — User Error Responses Are Friendly and Recoverable
- **Source**: TR-ISMS-020
- **Layer**: E2E/Error
- **RED Condition**: User sees raw stack/raw JSON/blank page.
- **Acceptance Criteria**: Error message explains issue and provides recovery action.

### T-ISMS-S6-092 — Logging Strategy Is Defined
- **Source**: Architecture Completeness Requirements §3.9
- **Layer**: Observability
- **RED Condition**: No log levels or destinations defined.
- **Acceptance Criteria**: Logging strategy defines levels, destinations, redaction, and production diagnostics.

### T-ISMS-S6-093 — Monitoring/Health Checks Are Defined
- **Source**: Architecture Completeness Requirements §3.9
- **Layer**: Operations
- **RED Condition**: No health/readiness checks.
- **Acceptance Criteria**: Health checks cover frontend, auth, data, edge/API, AI, checkout where applicable.

### T-ISMS-S6-094 — Degraded Mode Behavior Is Defined
- **Source**: Architecture Completeness Requirements §3.12
- **Layer**: E2E/Error
- **RED Condition**: Dependency outage causes unexplained failure.
- **Acceptance Criteria**: AI, checkout, Supabase, and audit dependency failures have degraded behavior.

### T-ISMS-S6-095 — Sensitive Data Is Redacted in Logs
- **Source**: TR-ISMS-020
- **Layer**: Security/Observability
- **RED Condition**: Logs include tokens, secrets, PII beyond policy.
- **Acceptance Criteria**: Redaction rule covers tokens, secrets, payment data, sensitive org profile fields.

### T-ISMS-S6-096 — Observability Events Map to E2E Paths
- **Source**: Architecture Completeness Requirements §3.12
- **Layer**: Observability/Traceability
- **RED Condition**: E2E paths cannot be diagnosed from logs/events.
- **Acceptance Criteria**: Each primary path has at least one observable event or diagnostic marker.

---

## D10 — Deployment, Runtime, Env, CI/Build Gates

### T-ISMS-S6-097 — Deployment Target Declared
- **Source**: Architecture Completeness Requirements §3.1
- **Layer**: Governance/Deployment
- **RED Condition**: Hosting platform is unknown.
- **Acceptance Criteria**: Frontend deployment target, preview behavior, and production behavior are named.

### T-ISMS-S6-098 — Runtime Entrypoints Declared
- **Source**: Architecture Completeness Requirements §3.2
- **Layer**: Static/Runtime
- **RED Condition**: Builder must infer entrypoints/build output.
- **Acceptance Criteria**: `index.html`, `src/main.tsx`, build output, static assets, config file locations documented.

### T-ISMS-S6-099 — Environment Variable Registry Exists
- **Source**: Architecture Completeness Requirements §3.3
- **Layer**: Config
- **RED Condition**: Required env vars unknown.
- **Acceptance Criteria**: Env registry lists name, purpose, public/secret status, default, required env, validation.

### T-ISMS-S6-100 — `.env.example` Is Current
- **Source**: TR-ISMS-023
- **Layer**: Config/Static
- **RED Condition**: Required env vars not documented in `.env.example`.
- **Acceptance Criteria**: `.env.example` matches env registry.

### T-ISMS-S6-101 — Provisioning Sequence Exists
- **Source**: Architecture Completeness Requirements §3.15
- **Layer**: Deployment/Ops
- **RED Condition**: Infrastructure setup requires external discovery.
- **Acceptance Criteria**: Provisioning sequence covers frontend, backend/data, env, health, rollback.

### T-ISMS-S6-102 — Rollback/Redeploy Strategy Exists
- **Source**: Architecture Completeness Requirements §3.15
- **Layer**: Deployment/Ops
- **RED Condition**: Failed deploy has no recovery plan.
- **Acceptance Criteria**: Rollback or redeploy strategy is documented.

### T-ISMS-S6-103 — Build Command Passes
- **Source**: TR-ISMS-024
- **Layer**: CI/Build
- **RED Condition**: `npm run build` fails for `apps/isms-portal`.
- **Acceptance Criteria**: Build completes successfully in CI or documented local evidence.

### T-ISMS-S6-104 — Lint Command Passes
- **Source**: TR-ISMS-024
- **Layer**: CI/Lint
- **RED Condition**: `npm run lint` fails for `apps/isms-portal`.
- **Acceptance Criteria**: Lint completes successfully.

### T-ISMS-S6-105 — Test Command Passes After Implementation
- **Source**: TR-ISMS-024
- **Layer**: CI/Test
- **RED Condition**: `npm run test:run` fails after implementation should satisfy tests.
- **Acceptance Criteria**: Test run passes when implementation is complete.

### T-ISMS-S6-106 — CI Status Is Inspected Before Merge
- **Source**: Foreman Operating Model
- **Layer**: Governance/CI
- **RED Condition**: PR is merged without CI inspection.
- **Acceptance Criteria**: Foreman records CI status before merge recommendation.

### T-ISMS-S6-107 — Governance Watchdog Gates Pass
- **Source**: Repo CI
- **Layer**: Governance/CI
- **RED Condition**: Watchdog gates fail or are ignored.
- **Acceptance Criteria**: POLC, routing, stub detection, preflight evidence, CodeQL and applicable gates pass or are explicitly waived.

### T-ISMS-S6-108 — Documentation-Only PRs Do Not Claim Runtime Passes
- **Source**: Foreman Operating Model
- **Layer**: Governance
- **RED Condition**: Docs PR claims build/test pass without running.
- **Acceptance Criteria**: Docs PR states local build/typecheck/tests not run unless actually executed.

---

## D11 — Architecture Completeness and Wave Regression Gates

### T-ISMS-S6-109 — Architecture Completeness Checklist Is GREEN Before Implementation
- **Source**: Architecture Completeness Requirements §4
- **Layer**: Governance
- **RED Condition**: Architecture completeness gap analysis remains RED.
- **Acceptance Criteria**: All architecture completeness domains are addressed or explicitly waived.

### T-ISMS-S6-110 — System Wiring Diagram Exists
- **Source**: Architecture Completeness Requirements §3.11
- **Layer**: Architecture/Testability
- **RED Condition**: No complete wiring diagram.
- **Acceptance Criteria**: Diagram maps UI, routes, context, auth, Supabase, edge functions, AI, audit, checkout, module handoff.

### T-ISMS-S6-111 — Every Wiring Path Maps to a Test
- **Source**: Architecture Completeness Requirements §3.11
- **Layer**: QA/Traceability
- **RED Condition**: Wiring path has no test.
- **Acceptance Criteria**: Each path maps to integration, E2E, or contract test.

### T-ISMS-S6-112 — E2E Functional Path Traces Exist
- **Source**: Architecture Completeness Requirements §3.12
- **Layer**: Architecture/QA
- **RED Condition**: Paths do not trace UI -> API -> domain -> data -> dependency -> response -> observability.
- **Acceptance Criteria**: Primary, secondary, failure, and degraded paths are traced.

### T-ISMS-S6-113 — Wave Plan Exists
- **Source**: Architecture Completeness Requirements §3.13
- **Layer**: Governance/Build Planning
- **RED Condition**: Implementation waves are not defined.
- **Acceptance Criteria**: Wave plan lists scope, included/excluded components, wiring, and tests for each wave.

### T-ISMS-S6-114 — Wave-Isolated QA Is Defined
- **Source**: Architecture Completeness Requirements §3.13
- **Layer**: QA/Regression
- **RED Condition**: Wave N cannot be tested independently.
- **Acceptance Criteria**: Each wave has isolated RED/GREEN QA set.

### T-ISMS-S6-115 — Cumulative Regression QA Is Defined
- **Source**: Architecture Completeness Requirements §3.13
- **Layer**: QA/Regression
- **RED Condition**: Prior wave regressions are not tested.
- **Acceptance Criteria**: All prior-wave QA runs cumulatively for wave N.

### T-ISMS-S6-116 — No Future Wiring Is Accepted For Handover
- **Source**: Architecture Completeness Requirements §3.13
- **Layer**: Governance
- **RED Condition**: Handover includes TODO/future wiring in wave scope.
- **Acceptance Criteria**: Each handed-over wave is fully wired within scope.

### T-ISMS-S6-117 — QA Can Be Derived Without Interpretation
- **Source**: Architecture Completeness Requirements §4.3
- **Layer**: Governance/QA
- **RED Condition**: QA engineer must infer requirements.
- **Acceptance Criteria**: Architecture provides enough specificity for direct QA derivation.

### T-ISMS-S6-118 — Builder Can Implement Without Additional Research
- **Source**: Architecture Completeness Requirements §4.2
- **Layer**: Governance/Build Readiness
- **RED Condition**: Builder must ask unresolved platform/env/schema questions.
- **Acceptance Criteria**: Architecture answers deployment, env, data, wiring, tests, and handoff questions.

### T-ISMS-S6-119 — PBFAG Blocks Until Architecture Completeness Is GREEN
- **Source**: Architecture Completeness Requirements §7
- **Layer**: Governance
- **RED Condition**: PBFAG passes with RED architecture gaps.
- **Acceptance Criteria**: PBFAG requires GREEN architecture completeness or explicit CS2 waiver.

### T-ISMS-S6-120 — Implementation Handover Requires 100 Percent Wave Scope GREEN
- **Source**: Architecture Completeness Requirements §3.13
- **Layer**: Governance
- **RED Condition**: Partial wave is handed over.
- **Acceptance Criteria**: Implementation handover requires wave-scope QA GREEN and cumulative regression GREEN.

---

## 4. QA-to-Red Disposition

This catalog is RED by design. It is complete enough to guide architecture remediation, PBFAG preparation, implementation planning, and eventual automated test creation.

It does not authorize implementation handover.
