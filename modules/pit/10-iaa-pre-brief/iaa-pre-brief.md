# PIT — Stage 10 IAA Pre-Brief

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Stage | Stage 10 — IAA Pre-Brief |
| Version | v1.1 |
| Status | **ACTIVE — INITIATED** |
| Initiating Issue | maturion-isms#1687 |
| Prerequisite Gate | Stage 9 GATE_PASSED (stage9-gate-pass-review.md — 2026-05-19) |
| Build Authorization | **NOT CLEARED** |
| Builder Appointment | **NOT APPOINTED** (Stage 11 only) |
| Date | 2026-05-19 |
| Authority | foreman-v2-agent (POLC Supervisor; CS2-authorized via maturion-isms#1687) |
| Repair Amendment | v1.1 — Stage 8 hardening artifacts added to §1.9; 144-vs-147 RED test reconciliation pre-build blocker declared as IAA Challenge §7.8 (issue #1694, PR #1695, 2026-05-20) |

> **Purpose**: This pre-brief prepares the Independent Assurance Agent (IAA) to challenge the full PIT pre-build package before builder appointment. It declares the complete Stage 1–9 artifact pack, known delivery risks, risk controls, and evidence expectations. It does **not** constitute IAA acceptance or approval of the package — IAA must independently review the package and issue its response artifact before Stage 10 can be gate-passed.

> **Scope lock**: Stage 10 is IAA pre-brief/readiness preparation only. Stage 10 initiation does not appoint a builder, clear Build Authorization, start build execution, or advance Stages 11 or 12.

> **Acknowledgement posture**: This document is Foreman's pre-brief initiation. The IAA response artifact must be separately filed before Stage 10 guardrails can be ticked or Stage 10 gate-pass declared. This document does NOT falsely claim that IAA has accepted or approved the package.

---

## 1. Complete Stage 1–9 Artifact Pack

The following Stage 1–9 artifacts are submitted for IAA review. All paths are canonical and current as of 2026-05-20 (v1.1 repair: Stage 8 hardening artifacts added per issue #1694 / PR #1695). IAA is reviewing the **hardened Stage 8 package**, which includes the original implementation plan plus the Stage 8 builder-executable hardening artifacts added by PR #1693.

### 1.1 Stage 1 — App Description

| Artifact | Path | Status |
|----------|------|--------|
| App Description v1.0 | `modules/pit/00-app-description/app-description.md` | ✅ CS2_APPROVED_AUTHORITATIVE |
| Authoritative copy | `docs/governance/PIT_APP_DESCRIPTION.md` | ✅ CS2_APPROVED_AUTHORITATIVE |
| Evidence | `.agent-admin/evidence/app-description-checklist/pit-20260506.md` | ✅ Filed |

### 1.2 Stage 2 — UX Workflow & Wiring Spec

| Artifact | Path | Status |
|----------|------|--------|
| UX Workflow & Wiring Spec v0.2-draft | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` | ✅ CS2_APPROVED_RECONFIRMED |
| Stage 2 Completion Evidence | `.agent-admin/evidence/stage2-completion-checklist/pit-stage2-20260506.md` | ✅ Filed |

### 1.3 Stage 3 — Functional Requirements Specification (FRS)

| Artifact | Path | Status |
|----------|------|--------|
| FRS v0.2-hardened | `modules/pit/02-frs/functional-requirements.md` | ✅ DRAFT_HARDENED_CS2_RECONFIRMED |

### 1.4 Stage 4 — Technical Requirements Specification (TRS)

| Artifact | Path | Status |
|----------|------|--------|
| TRS v0.2-draft | `modules/pit/03-trs/technical-requirements-specification.md` | ✅ CS2_APPROVED |
| FRS-to-TRS Traceability | `modules/pit/03-trs/frs-to-trs-traceability.md` | ✅ Filed |
| Timeline Engine Technical Validation | `modules/pit/03-trs/timeline-engine-technical-validation.md` | ✅ Filed |

### 1.5 Stage 5 — Architecture

| Artifact | Path | Status |
|----------|------|--------|
| Architecture v1.0 | `modules/pit/04-architecture/architecture.md` | ✅ GATE_PASSED |
| Timeline Engine ADR (ADR-PIT-001) | `modules/pit/04-architecture/timeline-engine-architecture-decision.md` | ✅ Filed |
| TRS-to-Architecture Traceability | `modules/pit/04-architecture/trs-to-architecture-traceability.md` | ✅ Filed |
| App Description-to-Architecture Traceability | `modules/pit/04-architecture/app-description-to-architecture-traceability.md` | ✅ Filed |
| Stage 5 Architecture Reconciliation | `modules/pit/04-architecture/stage5-architecture-reconciliation.md` | ✅ Filed |

### 1.6 Stage 5b — Live Functional Verification (LFV) Package (10 artifacts)

| Artifact | Path | Status |
|----------|------|--------|
| Functional User Journey Contract | `modules/pit/05-live-functional-verification/01_FUNCTIONAL_USER_JOURNEY_CONTRACT.md` | ✅ Filed |
| Agent Access Matrix | `modules/pit/05-live-functional-verification/02_AGENT_ACCESS_MATRIX.md` | ✅ Filed |
| Deployed Verification Plan | `modules/pit/05-live-functional-verification/03_DEPLOYED_VERIFICATION_PLAN.md` | ✅ Filed |
| CTA Backend State Map | `modules/pit/05-live-functional-verification/04_CTA_BACKEND_STATE_MAP.md` | ✅ Filed |
| Test Identity and Role Matrix | `modules/pit/05-live-functional-verification/05_TEST_IDENTITY_AND_ROLE_MATRIX.md` | ✅ Filed |
| Live Verification Workflow Spec | `modules/pit/05-live-functional-verification/06_LIVE_VERIFICATION_WORKFLOW_SPEC.md` | ✅ Filed |
| Dashboard State Reflection Gate | `modules/pit/05-live-functional-verification/07_DASHBOARD_STATE_REFLECTION_GATE.md` | ✅ Filed |
| Handover Evidence Requirements | `modules/pit/05-live-functional-verification/08_HANDOVER_EVIDENCE_REQUIREMENTS.md` | ✅ Filed |
| CS2 UI Acceptance Checklist | `modules/pit/05-live-functional-verification/09_CS2_UI_ACCEPTANCE_CHECKLIST.md` | ✅ Filed |
| LFV Automation Workflow Design | `modules/pit/05-live-functional-verification/pit-live-verification-workflow.yml` | ✅ Filed (Design Artifact) |

### 1.7 Stage 6 — QA-to-Red (11 artifacts)

| Artifact | Path | Status |
|----------|------|--------|
| RED Test Suite Catalog (144 tests) | `modules/pit/06-qa-to-red/red-test-suite-catalog.md` | ✅ GATE_PASSED |
| QA-to-Red Plan | `modules/pit/06-qa-to-red/qa-to-red-plan.md` | ✅ Filed |
| Route-Screen-State RED Matrix | `modules/pit/06-qa-to-red/route-screen-state-red-matrix.md` | ✅ Filed |
| Role-Denied Path RED Matrix | `modules/pit/06-qa-to-red/role-denied-path-red-matrix.md` | ✅ Filed |
| Timeline Engine RED Tests | `modules/pit/06-qa-to-red/timeline-engine-red-tests.md` | ✅ Filed |
| Live Functional RED Gates | `modules/pit/06-qa-to-red/live-functional-red-gates.md` | ✅ Filed |
| FRS-to-RED Traceability | `modules/pit/06-qa-to-red/frs-to-red-traceability.md` | ✅ Filed |
| TRS-to-RED Traceability | `modules/pit/06-qa-to-red/trs-to-red-traceability.md` | ✅ Filed |
| Architecture-to-RED Traceability | `modules/pit/06-qa-to-red/architecture-to-red-traceability.md` | ✅ Filed |
| LFV-to-RED Traceability | `modules/pit/06-qa-to-red/lfv-to-red-traceability.md` | ✅ Filed |
| Stage 6 Gate Readiness Checklist | `modules/pit/06-qa-to-red/stage6-gate-readiness-checklist.md` | ✅ Filed |

### 1.8 Stage 7 — PBFAG (10 artifacts)

| Artifact | Path | Status |
|----------|------|--------|
| PBFAG Plan | `modules/pit/07-pbfag/pbfag-plan.md` | ✅ GATE_PASSED |
| PBFAG Checklist | `modules/pit/07-pbfag/pbfag-checklist.md` | ✅ Filed |
| Change Propagation Audit | `modules/pit/07-pbfag/change-propagation-audit.md` | ✅ Filed |
| Runtime Deployment Contract | `modules/pit/07-pbfag/runtime-deployment-contract.md` | ✅ Filed |
| Golden Path Verification Pack | `modules/pit/07-pbfag/golden-path-verification-pack.md` | ✅ Filed |
| Stage 6 RED Suite Assessment | `modules/pit/07-pbfag/stage6-red-suite-assessment.md` | ✅ Filed |
| LFV Readiness Assessment | `modules/pit/07-pbfag/lfv-readiness-assessment.md` | ✅ Filed |
| Route Render Verification Plan | `modules/pit/07-pbfag/route-render-verification-plan.md` | ✅ Filed |
| Role-Negative Path Verification Plan | `modules/pit/07-pbfag/role-negative-path-verification-plan.md` | ✅ Filed |
| Stage 7 Gate Readiness Checklist | `modules/pit/07-pbfag/stage7-gate-readiness-checklist.md` | ✅ Filed |

### 1.9 Stage 8 — Implementation Plan (hardened package)

> **v1.1 note**: This section has been expanded by issue #1694 / PR #1695 to list the full Stage 8 hardened package. The Stage 8 gate-pass (maturion-isms#1679) remains intact. IAA is reviewing the hardened Stage 8 package, not only the original implementation plan.

| Artifact | Path | Status |
|----------|------|--------|
| Implementation Plan | `modules/pit/08-implementation-plan/implementation-plan.md` | ✅ GATE_PASSED |
| Stage 8 Gate-Pass Review | `modules/pit/08-implementation-plan/stage8-gate-pass-review.md` | ✅ Filed |
| Wave-to-RED-Test Manifest ⚠️ | `modules/pit/08-implementation-plan/wave-to-red-test-manifest.md` | ✅ Filed — **CONTAINS PRE-BUILD BLOCKER: 144-vs-147 delta (see §7.8)** |
| Wave Data-API Contract Matrix | `modules/pit/08-implementation-plan/wave-data-api-contract-matrix.md` | ✅ Filed |
| Route-Screen-State Acceptance Matrix | `modules/pit/08-implementation-plan/route-screen-state-acceptance-matrix.md` | ✅ Filed |
| Timeline Engine Builder Contract | `modules/pit/08-implementation-plan/timeline-engine-builder-contract.md` | ✅ Filed |
| Implementation Dependency Graph | `modules/pit/08-implementation-plan/implementation-dependency-graph.md` | ✅ Filed |
| Wave Definition-of-Done Template | `modules/pit/08-implementation-plan/wave-definition-of-done-template.md` | ✅ Filed |
| Builder Execution Responsibility Model | `modules/pit/08-implementation-plan/builder-execution-responsibility-model.md` | ✅ Filed |
| Build Authorization Clearance Path | `modules/pit/08-implementation-plan/build-authorization-clearance-path.md` | ✅ Filed |

### 1.10 Stage 9 — Builder Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Builder Checklist v1.0 | `modules/pit/09-builder-checklist/builder-checklist.md` | ✅ GATE_PASSED |
| Stage 9 Gate-Pass Review | `modules/pit/09-builder-checklist/stage9-gate-pass-review.md` | ✅ Filed (2026-05-19) |

### 1.11 Supporting Evidence and Readiness Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Functional Delivery Gap Register | `modules/pit/_readiness/pit-functional-delivery-gap-register.md` | ✅ All gaps RESOLVED |
| Build Process Improvement Register | `modules/pit/_readiness/pit-build-process-improvement-register.md` | ✅ Filed |
| Build Progress Tracker | `modules/pit/BUILD_PROGRESS_TRACKER.md` | ✅ Current — Stage 9 GATE_PASSED, Stage 10 ACTIVE |

---

## 2. Known Delivery Risks Declaration

The following known MMM/PIT delivery risks are declared for IAA review. These risks are documented in `modules/pit/_readiness/pit-functional-delivery-gap-register.md` and `modules/pit/08-implementation-plan/stage8-gate-pass-review.md`.

### 2.1 UI Rendering / App Shell Failures (HIGH RISK)

**Risk**: The builder may deliver functional routes without ensuring the global app shell (navigation, layout, global CSS) renders correctly in all five UI states. MMM Lesson L-002 was specifically created because of prior white-screen and layout-flash failures in MMM builds. A PIT build that delivers individual route components but leaves the app shell broken in any state is an incomplete delivery.

**Affected requirement**: L-002, PIT-FR-122, UX Spec Section 5.
**Risk severity**: HIGH — visual completeness failures block user acceptance.
**Pre-build mitigation**: L-002 is a binding delivery obligation in the builder checklist (Section 5 guardrail 5.4). The PBFAG route-render-verification-plan.md defines verification scope.

### 2.2 Route / Auth / Onboarding Gaps (HIGH RISK)

**Risk**: The builder may deliver core project management routes but leave auth-related routes (login, signup, forgot-password, reset-password, invite acceptance) or onboarding routes in incomplete or stub state. All 27 routes are in scope — there is no route that can be deferred.

**Affected requirement**: PIT-FR-001–010 (auth), PIT-FR-012–013 (onboarding), all 27 routes in FRS Appendix A.
**Risk severity**: HIGH — incomplete auth/onboarding creates security gaps and blocks user journeys.
**Pre-build mitigation**: Builder checklist Section 2.1 lists all 27 routes explicitly. Stage 6 RED matrix covers all routes with test coverage.

### 2.3 Denied-Path and Permission-Negative Gaps (HIGH RISK)

**Risk**: The builder may deliver the happy-path flows without confirming that permission-denied states are actually rendered for all protected action groups. A route that renders data when it should show `permission-denied` is a security defect, not just a UX gap.

**Affected requirement**: PIT-TR-116, PIT-FR-113, role-denied-path-red-matrix.md.
**Risk severity**: HIGH — permission leakage is a security risk and deployment blocker.
**Pre-build mitigation**: Builder checklist Section 2.3 requires all denied-path test cases to be GREEN before applicable wave closes. At minimum one denied-path test per protected action group must be GREEN.

### 2.4 Timeline / Date-Grid High-Risk Implementation

**Risk**: The timeline/date-grid engine (W8.6) carries the highest visual/interaction complexity in PIT. Date-to-pixel mapping, denominator resizing, drag-handle behaviour, dependency recalculation, and no date drift are all required. Builder may deliver a non-functional or visually broken timeline that passes functional tests but fails visual/browser verification.

**Affected requirement**: ADR-PIT-001, timeline-engine-red-tests.md, PIT-TR-080–090.
**Risk severity**: HIGH — timeline failures directly impact the core PIT use case.
**Pre-build mitigation**: Builder checklist Section 2.5 explicitly designates W8.6 as HIGH RISK and requires browser and visual verification in the deployed environment.

### 2.5 Evidence / Report / Audit / Notification Runtime Gaps

**Risk**: Evidence upload/review/approval workflows, audit log recording/export, report generation/download, and notification trigger/delivery are all first-class deliverables but may be deferred or stubbed in favour of core project data management.

**Affected requirement**: PIT-FR-109–119, Sections 2.4 and 6.
**Risk severity**: MEDIUM-HIGH — gaps here make the system unusable for compliance or accountability workflows.
**Pre-build mitigation**: Builder checklist Section 2.4 requires all four workflow types to be explicitly implemented per their wave allocation (W8.4, W8.5, W8.8).

### 2.6 Build-Authorisation Leakage

**Risk**: A builder or agent may begin implementation before Build Authorization is cleared by CS2, or may misread a Stage 9 or Stage 10 completion as implicit Build Authorization.

**Affected requirement**: BUILD_PROGRESS_TRACKER.md Build Authorization field; builder checklist Section 4.
**Risk severity**: CRITICAL — building without authorization is a POLC violation.
**Pre-build mitigation**: Build Authorization field in tracker is explicitly maintained as NOT CLEARED. Builder checklist Section 4.3 requires explicit CS2 clearance. Stage 9 gate-pass and Stage 10 initiation explicitly do not clear Build Authorization.

### 2.7 False FUNCTIONAL_PASS Claims

**Risk**: A builder or QA agent may claim FUNCTIONAL_PASS based on test suite results without obtaining live deployed environment verification per the LFV workflow.

**Affected requirement**: FULLY_FUNCTIONAL_DELIVERY_STANDARD.md, LFV Package, PIT Stage 5b.
**Risk severity**: CRITICAL — false FUNCTIONAL_PASS claims are governance violations (A-037, A-003, A-004).
**Pre-build mitigation**: Builder checklist Section 3.3 explicitly states FUNCTIONAL_PASS cannot be claimed without live deployed evidence. RED suite does not become GREEN until actual tests pass in deployed environment.

### 2.8 Insufficient Deployed-Environment Evidence

**Risk**: A builder may deliver GREEN tests in CI/local environment but provide no deployed-environment evidence. PIT requires browser-based visual verification, deployed URL smoke checks, and role-permission confirmation in the deployed environment — not just in CI.

**Affected requirement**: LFV Package (Stage 5b), PBFAG evidence contracts, Stage 12 guardrails.
**Risk severity**: HIGH — CI-only delivery is incomplete delivery.
**Pre-build mitigation**: PBFAG route-render-verification-plan.md, golden-path-verification-pack.md, and role-negative-path-verification-plan.md define the deployed-environment evidence contracts.

---

## 3. Visual / Rendering Risk Controls

The following controls address how app shell completeness, global CSS, no white-screen behaviour, five UI states, and route rendering will be verified.

### 3.1 Verification Framework

All visual/rendering verification happens in the **deployed environment** (not CI-only). Pre-build verification contracts are defined in:
- `modules/pit/07-pbfag/route-render-verification-plan.md` — all 27 routes × verification method
- `modules/pit/07-pbfag/golden-path-verification-pack.md` — all 23 primary journeys × evidence type
- `modules/pit/05-live-functional-verification/03_DEPLOYED_VERIFICATION_PLAN.md` — deployed verification workflow

### 3.2 App Shell Completeness Verification

- **L-002 obligation**: The builder must confirm the app shell renders correctly in all 5 UI states (loading, empty, permission-denied, network-error, data) before wave closure.
- **Verification method**: Browser-based visual inspection of each state in the deployed environment; screenshots required as handover evidence.
- **Gate**: PBFAG golden-path verification pack includes app shell verification. Stage 12 guardrail requires "screenshots of key screens confirming no white screens, correct app shell, correct styling."

### 3.3 Five UI States Verification

- **Obligation**: Every primary screen must implement all five states: loading (skeleton/spinner), empty (empty state message), permission-denied (403 component), network-error (retry CTA), data (populated content).
- **Verification method**: Route-Screen-State RED Matrix (`06-qa-to-red/route-screen-state-red-matrix.md`) maps every state to a specific RED test. All mapped tests must be GREEN.
- **Gate**: Stage 6 RED matrix is the binding test allocation. Stage 12 guardrail requires "role/permission evidence: confirmed that permission-denied state is rendered for at least 3 protected routes/actions."

### 3.4 Route Rendering Verification

- **Obligation**: All 27 routes must return the correct component in the deployed environment. Direct route loads (not just client-side navigation) must be verified.
- **Verification method**: PBFAG route-render-verification-plan.md defines the verification approach for all 27 routes. Stage 12 guardrail requires "route coverage evidence: all 27 routes return the correct component in the deployed environment."
- **Gate**: PBFAG route-render-verification-plan.md (Stage 7 artifact).

---

## 4. Route / Auth / Onboarding Risk Controls

The following controls address how all 27 routes, all auth routes, invite acceptance, reset, onboarding, and direct route loads will be verified in the deployed environment.

### 4.1 All 27 Routes Coverage

All 27 PIT routes are in scope and must be verified:
1. `/` — Landing/redirect
2. `/login` — Authentication
3. `/signup` — Registration
4. `/forgot-password` — Password reset request
5. `/reset-password` — Password reset form
6. `/invite/:token` — Invitation acceptance
7. `/dashboard` — Main dashboard
8. `/projects` — Project list
9. `/projects/new` — Create project
10. `/projects/:id` — Project detail
11. `/projects/:id/timeline` — Timeline view
12. `/projects/:id/milestones` — Milestones
13. `/projects/:id/deliverables` — Deliverables
14. `/projects/:id/tasks` — Tasks
15. `/projects/:id/evidence` — Evidence
16. `/projects/:id/reports` — Reports
17. `/projects/:id/settings` — Settings
18. `/my-work` — My Work view
19. `/notifications` — Notification history
20. `/profile` — User profile
21. `/onboarding` — Onboarding flow
22. `/admin/org` — Org admin
23. `/admin/users` — User admin
24. `/admin/settings` — Admin settings
25. `/admin/audit-log` — Audit log
26. `/qa-dashboard` — QA dashboard
27. `*` — 404 catch-all

### 4.2 Auth Route Verification

- **Auth routes** (`/login`, `/signup`, `/forgot-password`, `/reset-password`, `/invite/:token`) must be verified as functional in the deployed environment.
- **Direct load verification**: All auth routes must render correctly on direct URL load (not only via client-side navigation).
- **Redirect behaviour**: Unauthenticated access to protected routes must redirect to `/login`. Authenticated access to auth routes must redirect to `/dashboard`.
- **Gate**: LFV Agent Access Matrix (02_AGENT_ACCESS_MATRIX.md) defines auth access patterns. Stage 6 RED tests cover auth route requirements.

### 4.3 Invite Acceptance and Onboarding

- **Invite token flow** (`/invite/:token`): Token validation, role assignment, and onboarding redirect must all function correctly.
- **Onboarding flow** (`/onboarding`): Onboarding completion check must gate dashboard access correctly.
- **Gate**: FRS PIT-FR-011–013 define the invite/onboarding requirements. QA-to-Red coverage maps these to specific RED tests.

### 4.4 Direct Route Load Verification

All routes must be tested via direct URL entry (browser address bar), not just by navigating from within the app. Client-side navigation may mask routing failures that only appear on direct load.
- **Gate**: PBFAG route-render-verification-plan.md explicitly addresses direct-load verification.

---

## 5. Denied-Path Risk Controls

The following controls address how denied-path failures will be detected before handover, including protected action groups and role-negative tests.

### 5.1 Protected Action Groups

The following action groups require denied-path tests:
- Project creation/modification (project managers and above only)
- Task assignment modification (team leads and above in context)
- Evidence approval (reviewers and above only)
- Report generation (managers and above only)
- Admin actions (`/admin/*` routes: cs2_admin only)
- Audit log access (`/admin/audit-log`: cs2_admin only)
- QA dashboard access (`/qa-dashboard`: cs2_admin only)

### 5.2 Denied-Path Detection Method

- **Role-Denied Path RED Matrix** (`06-qa-to-red/role-denied-path-red-matrix.md`): Maps all protected routes to their role requirements and corresponding RED test cases.
- **Role-Negative Path Verification Plan** (`07-pbfag/role-negative-path-verification-plan.md`): Defines the deployed-environment spot-check plan for denied-path verification.
- **Gate**: At minimum one denied-path test per protected action group must be GREEN before the applicable wave closes (PIT-TR-116, builder checklist Section 2.3).

### 5.3 RLS-Level Protection

- Row-Level Security (RLS) policies enforce data isolation at the database level. Bypassing RLS is not possible via application-level permission checks alone.
- **Gate**: PIT-TR-023–026 define the RLS enforcement contract. Builder must confirm RLS policies exist and function correctly before wave closure.

### 5.4 What Would Cause IAA to Issue a REJECTION-PACKAGE (denied-path specific)

IAA will issue a REJECTION-PACKAGE if:
- Any protected route returns data or an action completes for a user who should be denied
- The `permission-denied` UI state is not rendered when it should be
- RLS policies are absent or non-functional for any protected table
- Denied-path RED tests are skipped, marked todo, or conditionally passing

---

## 6. Live Deployment / PBFAG Evidence Expectations

The following section aligns IAA and Foreman expectations for pre-build vs. post-build evidence.

### 6.1 Pre-Build Evidence (Available Now)

The following evidence is pre-build — available now and included in the Stage 1–9 artifact pack:

| Evidence Type | Artifact | Status |
|---------------|----------|--------|
| Verification contracts | PBFAG verification plans (Stages 7) | ✅ Defined |
| Evidence contracts | LFV handover evidence requirements | ✅ Defined |
| RED test definitions | Stage 6 RED test suite catalog (144 tests) | ✅ Filed |
| Architecture decision records | ADR-PIT-001 (timeline engine) | ✅ Filed |
| Functional gap register | All UX/TRS gaps resolved | ✅ Resolved |
| Deployment contract | PBFAG runtime-deployment-contract.md | ✅ Filed |

### 6.2 Post-Build Evidence (Required at Stage 12)

The following evidence CANNOT exist before build execution and must wait until Stage 12:

| Evidence Type | Required at | Notes |
|---------------|-------------|-------|
| GREEN test results | Stage 12 wave completion | Each wave must show all allocated RED tests GREEN |
| Deployed URL screenshots | Stage 12 each wave | Visual evidence in deployed environment |
| Browser-based visual inspection | Stage 12 each wave | No white screens, correct app shell, all 5 states |
| Role/permission confirmation | Stage 12 each wave | Denied-path rendered for ≥3 protected routes |
| Route coverage smoke test | Stage 12 each wave | All 27 routes verified in deployed environment |
| LFV workflow execution | Stage 12 final | Per LFV verification workflow spec |
| FUNCTIONAL_PASS declaration | Stage 12 final (CS2) | CS2 decision after all evidence collected |

### 6.3 PBFAG Alignment Expectations

IAA should note that the PBFAG (Stage 7) gate-pass verified the **definition** of evidence contracts and verification plans — it did NOT execute any live deployed verification. The PBFAG gate-pass is a pre-build assessment of readiness, not a claim of functional delivery.

### 6.4 IAA's Role at Stage 10

At Stage 10 initiation:
- IAA reviews this pre-brief and the full Stage 1–9 artifact pack
- IAA identifies any gaps, risks, or REJECTION-PACKAGE triggers before builder appointment
- IAA does NOT issue an ASSURANCE-TOKEN at this stage (that happens at Stage 12 handover)
- IAA issues a PRE-BRIEF acknowledgement or requests changes/clarifications

---

## 7. IAA Challenge Questions

The following explicit IAA challenge questions are posed for Stage 10 review. IAA should address each question and state what would cause it to issue a REJECTION-PACKAGE.

### 7.1 Artifact Completeness Challenge

**Question**: Are all Stage 1–9 artifacts present, cross-referenced, and consistent? Are there any gaps, contradictions, or missing derivation chains between upstream (App Description, UX Spec, FRS) and downstream (TRS, Architecture, RED tests, Implementation Plan)?

**IAA REJECTION-PACKAGE trigger**: Missing mandatory artifact from Stage 1–9; internal contradiction between FRS requirement and RED test coverage; undocumented assumption in any specification that would require a builder to guess scope.

### 7.2 RED Test Coverage Challenge

**Question**: Does the 144-test RED suite provide complete coverage of all 27 routes, all 22 screens, all 23 journeys, and all 5 UI states for every primary page? Are there any P1 functional requirements not covered by at least one RED test?

**IAA REJECTION-PACKAGE trigger**: Uncovered P1 FRS requirement; missing state coverage for any primary screen; denied-path missing from RED matrix for any protected action group; FUNCTIONAL_PASS claimed without full RED suite GREEN.

### 7.3 Visual / App Shell Challenge

**Question**: Is there a binding, specific, verifiable obligation for app shell completeness in the build scope? Does the builder checklist make L-002 unambiguous — including what "no white screen" means in practice?

**IAA REJECTION-PACKAGE trigger**: L-002 treated as aspirational rather than blocking; no specific verification method for app shell in each wave; "no white screen" not defined as a concrete failing criterion.

### 7.4 Denied-Path Challenge

**Question**: Does the implementation plan allocate explicit denied-path verification work to specific waves? Is it possible for a builder to close a wave without confirming denied-path behaviour?

**IAA REJECTION-PACKAGE trigger**: Implementation plan wave without any denied-path test allocation; denied-path test skipped or conditionally passing; wave closure claimed without denied-path verification in a wave that contains protected routes.

### 7.5 Timeline Engine Challenge

**Question**: Is the timeline engine (W8.6) risk adequately mitigated in the implementation plan? Is there a specific wave that owns timeline implementation and verification with clear acceptance criteria?

**IAA REJECTION-PACKAGE trigger**: Timeline wave without browser-based visual verification requirement; date drift not explicitly tested; timeline RED tests not allocated to a specific wave; timeline HIGH RISK designation not reflected in wave scope definition.

### 7.6 Build Authorization Challenge

**Question**: Is Build Authorization unambiguously NOT CLEARED at the time of this pre-brief? Is the path to Build Authorization clearance correctly defined as requiring CS2 explicit clearance AFTER all Stages 1–10 are gate-passed?

**IAA REJECTION-PACKAGE trigger**: Any artifact that implies Build Authorization is conditionally cleared; any reference to builder appointment in Stage 9 or Stage 10 artifacts; Stage 11 or Stage 12 advanced without CS2 explicit clearance.

### 7.7 Functional Delivery Completeness Challenge

**Question**: Given the MMM Lessons Promoted Into PIT (L-001 through L-008), are all lessons explicitly bound to builder delivery obligations in the implementation plan? What prevents a PIT builder from repeating the MMM delivery failures?

**IAA REJECTION-PACKAGE trigger**: MMM lesson L-001 (L1/L2/L3 closure model) not reflected in wave acceptance criteria; L-005 (runtime/UI behaviour tests) not covering deployed-environment verification; L-007 (operational closure requires live evidence) not binding for each wave; progress roll-up not tested per L-001/PIT-FR-114.

### 7.8 RED Test Catalog Count Reconciliation (Pre-Build Blocker — v1.1 addition)

> **Added by repair amendment v1.1 — issue #1694, PR #1695, 2026-05-20**

**Question**: The Stage 8 `wave-to-red-test-manifest.md` explicitly identifies a 3-row delta between the Stage 8 declared allocation baseline (144 tests) and the currently enumerated catalog rows (147 rows). The delta rows identified are: `PIT-RED-ROUTE-029`, `PIT-RED-TIMELINE-011`, `PIT-RED-TIMELINE-012`. Has this delta been formally reconciled before Stage 11 builder appointment? The Stage 6 gate-pass review cited 144 RED tests defined. The catalog table enumeration identifies 147 rows. This discrepancy must be resolved before a builder can receive a definitive allocation baseline.

**Pre-build blocker status**: This is a **blocking data gap** — it must be resolved before Stage 11 builder appointment proceeds. The reconciliation decision is: (a) retire or reclassify the 3 delta rows to confirm the 144 declared baseline remains correct, OR (b) obtain CS2 approval to update the allocation baseline from 144 to 147. Either path requires an explicit CS2 decision and a corresponding update to the Stage 6 and Stage 8 gate-pass evidence chain.

**IAA REJECTION-PACKAGE trigger**: Stage 11 builder appointment proceeds while the 144-vs-147 catalog count delta remains unresolved and undocumented. Any wave that begins build execution without a confirmed RED test allocation count is building against an undefined acceptance baseline, which is a POLC violation (CORE-021 — missing acceptance criterion at build start).

---

## Appendix: Stage-Readiness View (Stages 1–12)

| Stage | Name | Status | Gate Authority |
|-------|------|--------|---------------|
| 1 | App Description | CS2_APPROVED_AUTHORITATIVE | CS2 (2026-05-06) |
| 2 | UX Workflow & Wiring Spec | CS2_APPROVED_RECONFIRMED | CS2/Foreman (2026-05-11) |
| 3 | FRS | DRAFT_HARDENED_CS2_RECONFIRMED | CS2/Foreman |
| 4 | TRS | CS2_APPROVED | CS2 |
| 5 | Architecture | GATE_PASSED | CS2/Foreman |
| 5b | LFV Package | MERGED | Foreman/CS2 |
| 6 | QA-to-Red | GATE_PASSED | CS2/Foreman (2026-05-18) |
| 7 | PBFAG | GATE_PASSED | Foreman (2026-05-19) |
| 8 | Implementation Plan | GATE_PASSED + hardening addendum | Foreman (2026-05-19; maturion-isms#1679 + PR #1693 hardening) |
| 9 | Builder Checklist | GATE_PASSED | Foreman (2026-05-19; maturion-isms#1687; reconfirmed 2026-05-20 per stage9-post-stage8-hardening-reconfirmation.md) |
| 10 | IAA Pre-Brief | **ACTIVE — INITIATED** (pre-brief repaired v1.1 — 2026-05-20) | Foreman (2026-05-19 initiation; 2026-05-20 repair — issue #1694, PR #1695) |
| 11 | Builder Appointment | NOT_STARTED | Requires Stages 1–10 GATE_PASSED + CS2 Build Authorization clearance |
| 12 | Build Execution | NOT_STARTED | Requires Stage 11 builder appointment |

**Build Authorization**: NOT CLEARED — blocked until CS2 (@APGI-cmy) explicitly clears it after all Stages 1–10 are gate-passed.

---

**Filed by**: foreman-v2-agent
**Filing date**: 2026-05-19 (original) | 2026-05-20 (v1.1 repair — issue #1694, PR #1695)
**Governing issue**: maturion-isms#1687 (initiation) | maturion-isms#1694 (repair)
**Stage 10 Status**: ACTIVE — INITIATED
**Acknowledgement posture**: This pre-brief is Foreman's initiation document. IAA must separately review and issue a response artifact before Stage 10 guardrails can be ticked or gate-pass declared. This document does **not** claim IAA has accepted, approved, or reviewed the package.
**Build Authorization**: NOT CLEARED
