# PIT — Stage 8 Implementation Plan

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Stage | Stage 8 — Implementation Plan |
| Version | v1.0 |
| Status | ACTIVE — INITIATED |
| Initiating Issue | maturion-isms#1677 |
| Prerequisite Gate | Stage 7 GATE_PASSED (PR #1674 merged to `main`) |
| Build Authorization | **NOT CLEARED** |
| Builder Appointment | **NOT APPOINTED** |
| Date | 2026-05-19 |
| Authority Chain | Stage 1–7 approved/gate-passed artifacts listed in `modules/pit/BUILD_PROGRESS_TRACKER.md` |
| Prerequisite Verification Evidence | PR #1674 merged to `main` at 2026-05-19T09:08:17Z (GitHub PR record) and `modules/pit/BUILD_PROGRESS_TRACKER.md` on `main` shows Stage 7 gate-passed, Stage 8 NOT_STARTED, Build Authorization NOT CLEARED before this wave |

> **Boundary lock**: This Stage 8 artifact is planning-only. It does **not** start implementation/build execution, does **not** appoint a builder, does **not** clear Build Authorization, does **not** claim tests are GREEN, does **not** claim live deployed proof, and does **not** start Stages 9–12.

---

## 1) Authority chain and scope boundary

1. This plan derives from Stage 1–7 approved/gate-passed artifacts (App Description, UX, FRS, TRS, Architecture, LFV package, QA-to-RED, PBFAG).
2. PIT v1 scope remains **Project Implementation Tracker** (current governed module scope).
3. `Maturion/strategy/managed-work-execution-platform-strategy.md` defines future product-family direction; it does not expand PIT v1 scope in this wave.
4. Stage 8 is implementation planning only; Stage 11 builder appointment and explicit CS2 Build Authorization clearance are still required before build execution.

---

## 2) Functional-slice wave sequence (build-ready planning)

Wave ordering is functional-slice first (journeys, routes, states, behaviours), not file/component-first.

| Wave ID | Functional slice | Primary outcome |
|---|---|---|
| W8.1 | App shell, routing, auth/signup/invite/reset/onboarding foundation | Route reachability + auth journey baseline + five-state shell contract |
| W8.2 | Org/user/role foundations + RLS-first access model + denied paths | Permission-safe tenancy and role gating |
| W8.3 | Project/programme/operational-stream + hierarchy (milestone/deliverable/action-item/task) | Core managed-work structure operational |
| W8.4 | Assignment lifecycle + invitation acceptance/edit/reject/reassign + My Work/team visibility | Distributed accountability execution loops active |
| W8.5 | Evidence workflow + approval/return/blocking + audit log/export | Proof-driven completion and immutable accountability |
| W8.6 | Timeline/date-grid engine (high risk) + dependency/date recalculation | Deterministic schedule engine without date drift |
| W8.7 | Progress roll-up, RAG/lifecycle semantics, watchdog/exception detection | Operational health and escalation logic active |
| W8.8 | Notifications/history/preferences + reporting/export + permission-negative/report-denied paths + QA dashboard | Communication, reporting, visibility, and denied-path closure |
| W8.9 | AIMC-only AI touchpoints + no-direct-provider-call enforcement | Governed AI assistance with auditability |
| W8.10 | Deployment/runtime contract readiness + smoke verification + LFV evidence collection and anti-regression closure | Build handover readiness package for post-Stage-11 build wave |

---

## 3) Detailed wave acceptance evidence contracts

### W8.1 — App shell, routing, auth foundation
- **Functional scope**: app shell/global layout, protected routing, public auth routes, login/signup/invite/reset/onboarding flows.
- **Routes/screens/states completed**: `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/invite/:token`, `/dashboard`, `/projects`, `/projects/new`, `/onboarding` + five-state contract baseline from Stage 2/6 matrices.
- **FRS IDs covered**: PIT-FR-003–021, PIT-FR-103–105, PIT-FR-110.
- **TRS IDs covered**: PIT-TR-006–022, PIT-TR-089, PIT-TR-091–094.
- **Architecture/PBFAG refs**: `04-architecture/architecture.md` §§2–4, `07-pbfag/route-render-verification-plan.md`.
- **RED tests to GREEN**: ROUTE-001..009, AUTH-001..015, ROUTE-028, ROUTE-029.
- **Role/permission checks**: unauth redirect, intended-destination redirect, auth-only/public separation.
- **Evidence to file**: deep-link screenshots, HAR for auth redirects, shell-state screenshots.
- **Deployment/runtime smoke**: direct-load and refresh checks in deployed environment for all W8.1 routes.
- **Rollback**: revert to previous stable auth/router bundle; disable broken route segments behind feature flag.
- **Handover evidence**: route coverage ledger + auth journey pass matrix.
- **Exit criteria**: all listed W8.1 RED tests GREEN; no skipped/todo tests.

### W8.2 — RLS-first access model and denied paths
- **Functional scope**: org/user/role foundations, role hierarchy enforcement, denied actions, admin-route scope control.
- **Routes/screens/states completed**: `/admin/org`, `/admin/users`, `/admin/settings`, `/admin/audit-log`, `/qa-dashboard`, `*` (404 denied-path behaviour included).
- **FRS IDs covered**: PIT-FR-001–002, PIT-FR-087, PIT-FR-093, PIT-FR-113.
- **TRS IDs covered**: PIT-TR-023–047, PIT-TR-082.
- **Architecture/PBFAG refs**: `04-architecture/architecture.md` §§5–7, `07-pbfag/role-negative-path-verification-plan.md`.
- **RED tests to GREEN**: RLS-001..013, ROUTE-022..027.
- **Role/permission checks**: cross-org denial, admin-nav visibility gating, role-denied route handling.
- **Evidence to file**: role matrix execution logs, denied HAR payloads, RLS query outputs.
- **Deployment/runtime smoke**: deployed denied-path spot checks per Stage 7 plan.
- **Rollback**: revert policy layer + role-guard wiring to last passing baseline.
- **Handover evidence**: role-negative-path checklist with actor/result trace.
- **Exit criteria**: all RLS P1 tests GREEN; no unauthorised data exposure.

### W8.3 — Project/programme/operational-stream and hierarchy management
- **Functional scope**: project creation/management, milestone/deliverable/task hierarchy, lifecycle semantics baseline.
- **Routes/screens/states completed**: `/projects/:id`, `/projects/:id/milestones`, `/projects/:id/deliverables`, `/projects/:id/tasks`, `/projects/:id/settings`.
- **FRS IDs covered**: PIT-FR-031–057, PIT-FR-121.
- **TRS IDs covered**: PIT-TR-029–040, PIT-TR-117, PIT-TR-124.
- **Architecture/PBFAG refs**: `04-architecture/architecture.md` §§6, 10, 17.
- **RED tests to GREEN**: PROJECT-001..016, ROUTE-010, ROUTE-012..014, ROUTE-017.
- **Role/permission checks**: creator/leader/owner action boundaries on hierarchy CRUD.
- **Evidence to file**: hierarchy create-edit-delete traces, lifecycle transition logs.
- **Deployment/runtime smoke**: project CRUD + hierarchy render smoke in deployed app.
- **Rollback**: disable mutating hierarchy operations and revert schema-bound contracts to prior release.
- **Handover evidence**: hierarchy scenario matrix with before/after snapshots.
- **Exit criteria**: hierarchy CRUD and lifecycle tests GREEN; roll-up inputs structurally valid.

### W8.4 — Assignment lifecycle and distributed accountability loops
- **Functional scope**: assignment, invitation, acceptance/edit/reject/reassign, My Work and team/manager visibility.
- **Routes/screens/states completed**: `/my-work`, `/notifications`, `/profile` (assignment visibility states).
- **FRS IDs covered**: PIT-FR-058–061, PIT-FR-111–112, PIT-FR-115–117.
- **TRS IDs covered**: PIT-TR-056–059, PIT-TR-118–120.
- **Architecture/PBFAG refs**: `04-architecture/architecture.md` §§12, 18; Stage 2 journey coverage.
- **RED tests to GREEN**: ROUTE-018..020, NOTIFICATION-001..007.
- **Role/permission checks**: assignment ownership scope, notification visibility scoping.
- **Evidence to file**: assignment event timeline, notification bell/history traces.
- **Deployment/runtime smoke**: assignment→notification→My Work reflection cycle.
- **Rollback**: revert assignment mutation endpoints and notification subscription changes.
- **Handover evidence**: distributed-accountability walkthrough artifact.
- **Exit criteria**: assignment and visibility loops stable with denied-path protections intact.

### W8.5 — Evidence workflow and audit export
- **Functional scope**: evidence upload/review/approve-return/blocking logic, audit eventing, audit export.
- **Routes/screens/states completed**: `/projects/:id/evidence`, `/admin/audit-log`.
- **FRS IDs covered**: PIT-FR-062–067, PIT-FR-087–089.
- **TRS IDs covered**: PIT-TR-060–063, PIT-TR-073–075, PIT-TR-085.
- **Architecture/PBFAG refs**: `04-architecture/architecture.md` §§11, 15.
- **RED tests to GREEN**: EVIDENCE-001..010, AUDIT-001..007, ROUTE-015.
- **Role/permission checks**: reviewer-only approval, viewer denied evidence write, audit visibility constraints.
- **Evidence to file**: file upload artifacts, approval/return logs, audit CSV export samples.
- **Deployment/runtime smoke**: upload→review→approve/return→task status blocking in deployed env.
- **Rollback**: revert evidence write path and approval gate logic while preserving immutable audit records.
- **Handover evidence**: chain-of-custody and audit trace dossier.
- **Exit criteria**: evidence gating and audit immutability proven; all P1 tests GREEN.

### W8.6 — Timeline/date-grid engine (high-risk dedicated wave)
- **Functional scope**: exact date-to-pixel mapping, denominators (year/quarter/month/week/day), hover exact date, drag handles, whole-bar drag, progress overlay, horizontal scrolling, resizable date columns, proportional denominator resizing, dependency/date recalculation, no date drift, browser + visual verification.
- **Routes/screens/states completed**: `/projects/:id/timeline` full interaction and five-state behaviour.
- **FRS IDs covered**: PIT-FR-068–076.
- **TRS IDs covered**: PIT-TR-064–067, PIT-TR-079–080, PIT-TR-087.
- **Architecture/PBFAG refs**: `04-architecture/timeline-engine-architecture-decision.md`, `06-qa-to-red/timeline-engine-red-tests.md`.
- **RED tests to GREEN**: TIMELINE-001..012, ROUTE-011.
- **Role/permission checks**: edit-capable roles can mutate timeline; others view-only or denied.
- **Evidence to file**: pixel/date math assertions, drag/resize HARs, performance traces, visual regression baselines.
- **Deployment/runtime smoke**: deployed timeline render + interaction smoke on representative project sizes.
- **Rollback**: revert to read-only timeline rendering and disable interactive mutations if regressions detected.
- **Handover evidence**: timeline ADR conformance checklist + browser visual pack.
- **Exit criteria**: no date drift, dependency recalculation stable, timeline high-risk acceptance set GREEN.

### W8.7 — Progress roll-up, RAG, lifecycle and watchdog exceptions
- **Functional scope**: progress roll-up logic, RAG semantics, overdue/stalled/unsupported/unassigned detection and escalation visibility.
- **Routes/screens/states completed**: `/dashboard`, `/projects/:id`, `/qa-dashboard` health views.
- **FRS IDs covered**: PIT-FR-077–079, PIT-FR-114, PIT-FR-120.
- **TRS IDs covered**: PIT-TR-117, PIT-TR-076–077.
- **Architecture/PBFAG refs**: `04-architecture/architecture.md` §§16–17, `07-pbfag/golden-path-verification-pack.md`.
- **RED tests to GREEN**: PROJECT-013..014, QA-001..005.
- **Role/permission checks**: cs2_admin QA visibility; non-cs2 denied.
- **Evidence to file**: roll-up formula assertions, watchdog event traces, QA dashboard snapshots.
- **Deployment/runtime smoke**: status-change→dashboard reflection cycle.
- **Rollback**: revert roll-up/watchdog engine changes, freeze derived status indicators.
- **Handover evidence**: RAG/roll-up validation bundle.
- **Exit criteria**: roll-up/watchdog tests GREEN and escalation pathways observable.

### W8.8 — Reporting/export + permission-negative/report-denied states
- **Functional scope**: report generation/download/history, permission-denied report paths, report audit integration.
- **Routes/screens/states completed**: `/projects/:id/reports`, `/notifications` (report notification hooks).
- **FRS IDs covered**: PIT-FR-080–084, PIT-FR-118–119.
- **TRS IDs covered**: PIT-TR-068–072, PIT-TR-121–122.
- **Architecture/PBFAG refs**: `04-architecture/architecture.md` §14, `07-pbfag/runtime-deployment-contract.md`.
- **RED tests to GREEN**: REPORT-001..008, ROUTE-016.
- **Role/permission checks**: reporter allowed; viewer denied generation/export.
- **Evidence to file**: generated report artifacts (PDF/XLSX/CSV), denied-path screenshots, audit entry proofs.
- **Deployment/runtime smoke**: deployed report generation and signed-download checks.
- **Rollback**: disable export endpoints and revert report storage writes on failure.
- **Handover evidence**: report permission matrix + export validation pack.
- **Exit criteria**: report/denied/audit report tests GREEN.

### W8.9 — AIMC-only AI touchpoints and provider-call enforcement
- **Functional scope**: AI suggestion touchpoints, human acceptance/rejection flow, strict AIMC gateway enforcement (no direct provider calls).
- **Routes/screens/states completed**: AI-enabled screens in `/projects/:id/tasks`, `/dashboard`, `/projects/:id` contexts.
- **FRS IDs covered**: PIT-FR-095–099.
- **TRS IDs covered**: PIT-TR-052–055, PIT-TR-083, PIT-TR-090.
- **Architecture/PBFAG refs**: `04-architecture/architecture.md` §9.
- **RED tests to GREEN**: AIMC-001..007.
- **Role/permission checks**: governed AI access by role and explicit human action requirement.
- **Evidence to file**: HAR proving AIMC-only endpoints, audit entries for AI interactions.
- **Deployment/runtime smoke**: AI assist request/response in deployed env with fallback handling.
- **Rollback**: disable AI invocation paths while preserving non-AI workflows.
- **Handover evidence**: AIMC enforcement verification artifact.
- **Exit criteria**: no direct provider calls; all AIMC and human-approval tests GREEN.

### W8.10 — Deployment/runtime smoke and LFV anti-regression closure
- **Functional scope**: runtime contract readiness, smoke verifications, LFV evidence pipeline, anti-regression non-functional gates.
- **Routes/screens/states completed**: full-route smoke sample set across all 27 routes; LFV journey coverage references.
- **FRS IDs covered**: PIT-FR-103–105, PIT-FR-122.
- **TRS IDs covered**: PIT-TR-095–107, PIT-TR-114, PIT-TR-125.
- **Architecture/PBFAG refs**: `05-live-functional-verification/*`, `07-pbfag/runtime-deployment-contract.md`.
- **RED tests to GREEN**: LFV-001..010, NFR-001..008.
- **Role/permission checks**: test-identity matrix and environment-scoped access controls.
- **Evidence to file**: LFV artifact bundle (screenshots/HAR/traces), build and lint outputs, accessibility report, secret scan report.
- **Deployment/runtime smoke**: deployed SHA parity, Vercel bypass, identity readiness, CTA-backend reflection.
- **Rollback**: release rollback to prior stable deployment + disable failing smoke gates.
- **Handover evidence**: LFV readiness and anti-regression closure package.
- **Exit criteria**: all LFV/NFR tests allocated to wave and required evidence contract satisfied.

---

## 4) Route/page/state coverage allocation (all 27 routes)

Cross-reference sources:
- Stage 2 route/screen design: `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md`
- Stage 6 route/state matrix: `modules/pit/06-qa-to-red/route-screen-state-red-matrix.md`
- Stage 7 route verification plan: `modules/pit/07-pbfag/route-render-verification-plan.md`

| Route | Completing wave |
|---|---|
| `/` | W8.1 |
| `/login` | W8.1 |
| `/signup` | W8.1 |
| `/forgot-password` | W8.1 |
| `/reset-password` | W8.1 |
| `/invite/:token` | W8.1 |
| `/dashboard` | W8.1 (foundation), W8.7 (roll-up/watchdog completion) |
| `/projects` | W8.1 |
| `/projects/new` | W8.1 |
| `/projects/:id` | W8.3 |
| `/projects/:id/timeline` | W8.6 |
| `/projects/:id/milestones` | W8.3 |
| `/projects/:id/deliverables` | W8.3 |
| `/projects/:id/tasks` | W8.3 (base), W8.9 (AIMC touchpoints) |
| `/projects/:id/evidence` | W8.5 |
| `/projects/:id/reports` | W8.8 |
| `/projects/:id/settings` | W8.3 |
| `/my-work` | W8.4 |
| `/notifications` | W8.4 |
| `/profile` | W8.4 |
| `/onboarding` | W8.1 |
| `/admin/org` | W8.2 |
| `/admin/users` | W8.2 |
| `/admin/settings` | W8.2 |
| `/admin/audit-log` | W8.2 (access), W8.5 (audit behaviour) |
| `/qa-dashboard` | W8.2 (access), W8.7 (wave data visibility) |
| `*` (404) | W8.2 |

Five-state enforcement for primary pages remains mandatory per Stage 2/6 matrices and is verified per-wave in acceptance evidence.

---

## 5) RED-to-GREEN allocation (Stage 6 RED suite)

Authoritative baseline: `modules/pit/06-qa-to-red/red-test-suite-catalog.md` (declared total: **147 RED tests**).
Baseline reference snapshot: catalog `Version v1.0`, `Date 2026-05-13`, `Issue maturion-isms#1625` (as recorded in the catalog status header).

| RED category | Declared count | Allocated wave |
|---|---:|---|
| ROUTE | 28 | W8.1, W8.2, W8.3, W8.5, W8.6, W8.8 |
| AUTH | 15 | W8.1 |
| RLS | 13 | W8.2 |
| PROJECT | 16 | W8.3, W8.7 |
| TIMELINE | 10 | W8.6 |
| EVIDENCE | 10 | W8.5 |
| NOTIFICATION | 7 | W8.4 |
| REPORT | 8 | W8.8 |
| AUDIT | 7 | W8.5 |
| QA | 5 | W8.7 |
| AIMC | 7 | W8.9 |
| LFV | 10 | W8.10 |
| NFR | 8 | W8.10 |
| **TOTAL** | **147** | **Allocated** |

### P0/P1 assurance
- Stage 6 catalog uses P1–P4 (no explicit P0 rows).
- All P1 tests are allocated in the wave matrix above.
- No skipped/todo tests are allowed as completion evidence for any wave.
- At implementation-wave start, re-run a catalog parity check to confirm the RED catalog still reports 147 tests and no unallocated P1 rows before claiming wave entry.

---

## 6) Functional-delivery guardrails compliance (Stage 8)

| Guardrail | Plan status |
|---|---|
| Functional-slice sequencing (not file-only) | SATISFIED (W8.1–W8.10 by journeys/domains) |
| Acceptance evidence per wave | SATISFIED (explicit wave cards) |
| Route/page/state coverage per wave | SATISFIED (Section 4, all 27 routes) |
| UI/runtime verification per wave | SATISFIED (deployment smoke per wave) |
| Negative/denied paths included | SATISFIED (W8.2, W8.5, W8.8, W8.9) |
| Data/notification/audit/report as first-class scope | SATISFIED (W8.4, W8.5, W8.8) |
| No placeholder/TBD scope | SATISFIED |
| Rollback expectation documented | SATISFIED (per wave) |
| Handover evidence documented | SATISFIED (per wave) |

---

## 7) Distributed accountability / self-maintaining posture preservation

This Stage 8 plan preserves PIT’s accountability model:
1. Accountable users update their own assignments/evidence in their workflow context.
2. Assignment, invitation, acceptance/rejection/reassignment, and My Work views are first-class wave deliverables (W8.4).
3. Evidence approval/return and completion blocking logic are first-class deliverables (W8.5).
4. Notifications/history/preferences and watchdog exception surfacing are first-class deliverables (W8.4, W8.7, W8.8).
5. System operation is not dependent on one dedicated project administrator to keep status current.

---

## 8) Non-overclaim lock

This Stage 8 artifact does **not** claim any of the following:
- implementation has started;
- build is authorised;
- builder has been appointed;
- tests are GREEN;
- live deployed proof exists;
- FUNCTIONAL_PASS exists;
- Stage 9/10/11/12 has started.

Build Authorization remains **NOT CLEARED**.

---

## 9) Wave handover baseline (for future implementation waves)

Each build wave handover must include, at minimum:
- RED-to-GREEN evidence for that wave’s allocated test subset;
- route/screen/state evidence for wave scope;
- denied-path evidence where applicable;
- runtime smoke evidence;
- rollback validation result;
- explicit statement of remaining RED tests and downstream dependencies.
