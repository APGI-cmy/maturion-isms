# PIT — Stage 9 Builder Checklist

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Stage | Stage 9 — Builder Checklist |
| Version | v1.0 |
| Status | ACTIVE — INITIATED |
| Initiating Issue | maturion-isms#1679 |
| Prerequisite Gate | Stage 8 GATE_PASSED (stage8-gate-pass-review.md — 2026-05-19) |
| Build Authorization | **NOT CLEARED** |
| Builder Appointment | **NOT APPOINTED** (Stage 11 only) |
| Date | 2026-05-19 |
| Authority | foreman-v2-agent (POLC Supervisor; CS2-authorized via maturion-isms#1679) |

> **Purpose**: This checklist ensures any future builder candidate reads and acknowledges the full governed PIT scope **before** appointment. Completion of this checklist does **not** appoint a builder, does **not** clear Build Authorization, and does **not** start build execution. Builder appointment occurs at Stage 11 only, after Stages 9 and 10 are gate-passed and CS2 explicitly clears Build Authorization.

> **Scope lock**: Stage 9 is checklist/readiness only. No runtime code, database migrations, deployment configuration, active workflow installation, or build execution may begin under Stage 9.

---

## 1. Authority Chain Acknowledgement

The builder candidate must confirm they have read and understood each of the following artifacts **in full** before Stage 11 appointment is considered:

| # | Artifact | Path | Acknowledged |
|---|----------|------|-------------|
| 1.1 | App Description v1.0 | `modules/pit/00-app-description/app-description.md` | [ ] |
| 1.2 | UX Workflow & Wiring Spec v0.2-draft | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` | [ ] |
| 1.3 | Functional Requirements Specification (FRS) v0.2-hardened | `modules/pit/02-frs/functional-requirements.md` | [ ] |
| 1.4 | Technical Requirements Specification (TRS) v0.2-draft | `modules/pit/03-trs/technical-requirements-specification.md` | [ ] |
| 1.5 | Architecture v1.0 | `modules/pit/04-architecture/architecture.md` | [ ] |
| 1.6 | LFV Package (all 10 artifacts) | `modules/pit/05-live-functional-verification/` | [ ] |
| 1.7 | QA-to-Red artifacts (all 11 artifacts) | `modules/pit/06-qa-to-red/` | [ ] |
| 1.8 | PBFAG artifacts (all 10 artifacts) | `modules/pit/07-pbfag/` | [ ] |
| 1.9 | Stage 8 Implementation Plan | `modules/pit/08-implementation-plan/implementation-plan.md` | [ ] |
| 1.10 | Stage 8 Gate-Pass Review | `modules/pit/08-implementation-plan/stage8-gate-pass-review.md` | [ ] |
| 1.11 | Build Progress Tracker (current state) | `modules/pit/BUILD_PROGRESS_TRACKER.md` | [ ] |

**Section 1 Acknowledgement**: The builder candidate confirms having read all 11 artifacts above and understands the full authority chain.

Builder candidate signature/acknowledgement: _______________ Date: _______________

---

## 2. Functional Scope Acknowledgement

The builder candidate must acknowledge the following functional scope obligations. Each item must be ticked before Stage 11 appointment.

### 2.1 Route and Screen Coverage

- [ ] **All 27 routes** are within build scope. The builder can enumerate all 27 routes as listed in `modules/pit/08-implementation-plan/implementation-plan.md` §4 and `modules/pit/02-frs/functional-requirements.md` Appendix A.
  - Routes include: `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/invite/:token`, `/dashboard`, `/projects`, `/projects/new`, `/projects/:id`, `/projects/:id/timeline`, `/projects/:id/milestones`, `/projects/:id/deliverables`, `/projects/:id/tasks`, `/projects/:id/evidence`, `/projects/:id/reports`, `/projects/:id/settings`, `/my-work`, `/notifications`, `/profile`, `/onboarding`, `/admin/org`, `/admin/users`, `/admin/settings`, `/admin/audit-log`, `/qa-dashboard`, `*` (404).
- [ ] **All 22 screens** are within build scope, as documented in `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` Section 2.
- [ ] **All 23 primary journeys** are within build scope, as documented in `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` Section 1.

### 2.2 Five-State UI Outcome Obligations

- [ ] The builder acknowledges that **every primary screen** must implement all **five UI states**: `loading`, `empty`, `permission-denied`, `network-error`, and `data`.
- [ ] The five-state matrix from Stage 2 (`modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` Section 4) and the route-screen-state RED matrix (`modules/pit/06-qa-to-red/route-screen-state-red-matrix.md`) are binding delivery obligations.
- [ ] A screen that does not implement all five states is an incomplete deliverable regardless of other test results.

### 2.3 Role-Denied and Permission-Negative Paths

- [ ] The builder acknowledges that **all role-denied and permission-negative paths** are within build scope.
- [ ] This includes all denied-path test cases in `modules/pit/06-qa-to-red/role-denied-path-red-matrix.md` and the negative-path verification plan in `modules/pit/07-pbfag/role-negative-path-verification-plan.md`.
- [ ] PIT-FR-113 (Permission Negative-Path Contract) and PIT-TR-116 apply to every protected action group. Denied paths are not optional and not deferred.
- [ ] At minimum, one denied-path test per protected action group must be GREEN before the applicable wave closes.

### 2.4 Evidence, Report, Audit, and Notification Obligations

- [ ] **Evidence workflow**: upload → review → approve/return → task status blocking is a first-class wave deliverable (W8.5). Evidence write, approval, and blocking logic are mandatory.
- [ ] **Audit log**: all designated audit events must be recorded immutably. Audit export must be functional (W8.5).
- [ ] **Report generation/download/history/permission-denied**: report functionality and permission-denied states are first-class deliverables (W8.8). Report history is mandatory per PIT-FR-118–119.
- [ ] **Notifications**: notification trigger, bell badge, mark-as-read, history, and preferences are first-class deliverables (W8.4). All notification events per PIT-FR-115–117 must be implemented.

### 2.5 Timeline / Date-Grid Engine Obligations

- [ ] The timeline/date-grid engine (W8.6) is **HIGH RISK** and is isolated in a dedicated wave. The builder acknowledges this risk designation.
- [ ] The builder has reviewed `modules/pit/04-architecture/timeline-engine-architecture-decision.md` (ADR-PIT-001) and `modules/pit/06-qa-to-red/timeline-engine-red-tests.md`.
- [ ] Timeline obligations include: exact date-to-pixel mapping, all denominators (year/quarter/month/week/day), hover exact date, drag handles, whole-bar drag, progress overlay, horizontal scrolling, resizable date columns, proportional denominator resizing, dependency/date recalculation, and no date drift.
- [ ] Browser and visual verification is required in the deployed environment.

### 2.6 AIMC-Only AI Restrictions

- [ ] The builder acknowledges the **no-direct-provider-call rule** (PIT-TR-083): all AI calls must go through the AIMC gateway. No frontend or backend component may call an AI provider directly.
- [ ] AIMC touchpoints are scoped to W8.9. The builder has reviewed PIT-FR-095–099 and PIT-TR-052–055.
- [ ] A HAR trace proving AIMC-only endpoints is required as handover evidence for W8.9.

### 2.7 Distributed Accountability and Self-Maintaining Project Posture

- [ ] The builder acknowledges that PIT's design requires distributed accountability: accountable users update their own assignments, evidence, and status in their own workflow context.
- [ ] System operation must not depend on a dedicated project administrator to keep status current.
- [ ] The builder has reviewed `modules/pit/08-implementation-plan/implementation-plan.md` §7 (Distributed accountability preservation) and understands this is a first-class design obligation, not an optional enhancement.

**Section 2 Acknowledgement**: The builder candidate confirms understanding of all functional scope obligations listed above.

Builder candidate signature/acknowledgement: _______________ Date: _______________

---

## 3. RED Suite Acknowledgement

The builder candidate must acknowledge the following RED suite obligations:

### 3.1 Source of Truth

- [ ] The Stage 6 RED suite (`modules/pit/06-qa-to-red/red-test-suite-catalog.md`, Version v1.0, 144 tests) is the **source of truth** for build completion. No wave can be closed without its allocated tests going GREEN.
- [ ] The RED suite was derived from Stages 1–7 (App Description, UX, FRS, TRS, Architecture, LFV, PBFAG). Changes to the RED suite require CS2 approval.

### 3.2 Test Allocation

- [ ] The builder acknowledges that all **144 RED tests** are allocated to functional-slice waves (W8.1–W8.10) per `modules/pit/08-implementation-plan/implementation-plan.md` §5.
- [ ] The wave-to-test allocation is binding. Tests may not be re-allocated between waves without CS2 approval.
- [ ] Before each build wave begins, the builder must verify the RED catalog still reports 144 tests with no unallocated P1 rows.

### 3.3 Completion Criteria

- [ ] **No skipped, todo, or pending tests count as completion evidence**. A test that is skipped, marked `.todo`, or produces a conditional pass is an incomplete test.
- [ ] Wave closure requires that **all allocated RED tests for that wave are GREEN** — zero failures, zero skipped, zero todo.
- [ ] FUNCTIONAL_PASS cannot be claimed without live deployed evidence collected per the LFV workflow at Stage 12 or later. Stage 9 initiation does not bring FUNCTIONAL_PASS closer.

### 3.4 Anti-Regression Obligations

- [ ] The builder acknowledges that passing new tests must not regress previously GREEN tests. Each wave must demonstrate continued GREEN status of all prior-wave tests.
- [ ] The QA dashboard (`/qa-dashboard`) is a first-class build deliverable and must show wave evidence to `cs2_admin`-role users.

**Section 3 Acknowledgement**: The builder candidate confirms understanding of all RED suite obligations listed above.

Builder candidate signature/acknowledgement: _______________ Date: _______________

---

## 4. Build Boundary Acknowledgement

The builder candidate must acknowledge the following build boundary obligations:

### 4.1 Stage 9 Does Not Start Build

- [ ] Stage 9 is the **Builder Checklist** stage. It is checklist/readiness preparation only.
- [ ] Stage 9 initiation (this document being filed) does **not** appoint a builder.
- [ ] Stage 9 initiation does **not** clear Build Authorization.
- [ ] Stage 9 initiation does **not** start implementation or build execution.
- [ ] Stage 9 completion (gate-pass, separate future review) also does **not** appoint a builder or start implementation.

### 4.2 Stage 11 is the Builder Appointment Stage

- [ ] **Stage 11 (Builder Appointment)** is the correct stage for appointing a builder.
- [ ] Builder appointment at Stage 11 requires: all Stages 1–10 gate-passed; CS2 explicit Build Authorization clearance; and formal Foreman delegation with this checklist's acknowledgements on record.
- [ ] No builder may begin implementation before Stage 11 appointment is on record in `modules/pit/BUILD_PROGRESS_TRACKER.md`.

### 4.3 Build Authorization

- [ ] Build Authorization is currently and must remain **NOT CLEARED** until CS2 (@APGI-cmy) explicitly clears it in the tracker.
- [ ] **No runtime/source code, database migrations, deployment configuration, active GitHub workflow installation, or build execution may begin** while Build Authorization is NOT CLEARED.
- [ ] The builder acknowledges that a misunderstanding of authorization state is not an exemption from this requirement.

### 4.4 Prohibited Actions Under Stage 9

The following actions are **prohibited** under Stage 9 initiation and until Build Authorization is cleared at Stage 11:
- [ ] Writing any application code (TypeScript, React, SQL, Edge Function, test files, etc.)
- [ ] Creating or modifying database migrations
- [ ] Creating or modifying deployment configuration
- [ ] Activating or installing GitHub workflows (including `pit-live-verification-workflow.yml`)
- [ ] Claiming FUNCTIONAL_PASS or GREEN tests for PIT
- [ ] Opening any implementation-scoped PR

**Section 4 Acknowledgement**: The builder candidate confirms understanding of all build boundary obligations listed above.

Builder candidate signature/acknowledgement: _______________ Date: _______________

---

## 5. Functional-Delivery Guardrails (Stage 9 Tracker Items)

The following 8 guardrail items correspond to the Stage 9 Functional-Delivery Guardrails in `modules/pit/BUILD_PROGRESS_TRACKER.md`. Each must be ticked before Stage 9 can be gate-passed (in a future review):

| # | Guardrail | Status |
|---|-----------|--------|
| 5.1 | Stage 1–4 authority chain read and understood: builder has read App Description v1.0, UX Spec v0.2-draft, FRS v0.2-hardened, TRS v0.2-draft | [ ] Pending builder acknowledgement |
| 5.2 | All route/screen/state obligations enumerated: builder can enumerate all 27 routes and all 5 UI states for primary screens | [ ] Pending builder acknowledgement |
| 5.3 | RLS/access model understood: builder understands RLS-first enforcement and the role hierarchy (PIT-TR-023–026) | [ ] Pending builder acknowledgement |
| 5.4 | Visual rendering and app-shell obligations acknowledged: builder acknowledges L-002 (app shell in all states, no white screen) | [ ] Pending builder acknowledgement |
| 5.5 | Evidence/report/audit/notification obligations understood: builder understands all evidence, report, audit, and notification requirements | [ ] Pending builder acknowledgement |
| 5.6 | QA-to-Red expectations understood and accepted: builder understands and accepts the RED test suite as the source of truth | [ ] Pending builder acknowledgement |
| 5.7 | No direct AIMC provider calls acknowledged: builder acknowledges the no-direct-provider-call rule (PIT-TR-083) | [ ] Pending builder acknowledgement |
| 5.8 | No build without Stage 11 appointment and Build Authorization: builder acknowledges Build Authorization is NOT CLEARED unless explicitly cleared by CS2 | [ ] Pending builder acknowledgement |

> **Note**: These guardrail checkboxes will be ticked as part of the Stage 9 gate-pass review (a future wave). They are listed here unchecked per issue #1679 requirements: Stage 9 is only initiated in this wave; a full Stage 9 gate-pass review is a separate future activity.

---

## 6. Additional High-Risk Obligations

### 6.1 Accessibility

- [ ] The builder acknowledges PIT-FR-122 (Minimum Accessibility Outcomes): axe-core zero violations and Lighthouse accessibility ≥ 90 are required in the deployed environment.
- [ ] Accessibility testing is not optional and not deferred. It is part of the W8.10 LFV/NFR wave acceptance criteria.

### 6.2 Progress Roll-Up

- [ ] The builder acknowledges PIT-FR-114 and PIT-TR-117: progress roll-up computation (via Edge Function or database trigger) is a first-class deliverable. Unit tests for computation logic and E2E tests for project-level update are required.

### 6.3 Lifecycle Removal Semantics

- [ ] The builder acknowledges PIT-FR-121 and PIT-TR-124: archive/restore/cancel lifecycle semantics must be confirmed to exclude/include correctly in roll-up calculations. These are not edge cases — they are first-class test scenarios.

### 6.4 QA Dashboard Visibility

- [ ] The builder acknowledges PIT-FR-120 and PIT-TR-123: the QA dashboard (`/qa-dashboard`) must show wave evidence to `cs2_admin`-role users. Non-`cs2_admin` users must be denied access. This is first-class build scope.

### 6.5 MMM Lessons Carry-Forward (L-001 through L-008)

- [ ] The builder has reviewed the MMM-derived build-process controls in the App Description (§ MMM Lessons Promoted Into PIT) and `modules/pit/_readiness/pit-build-process-improvement-register.md`.
- [ ] The builder acknowledges that L-001 (L1/L2/L3 closure model), L-002 (UI rendering completeness), L-003 (five-state post-login pages), L-005 (runtime/UI behaviour tests), L-006 (deployment execution contract), and L-007 (operational closure requires live evidence) are binding delivery obligations.

---

## 7. Tracker and Handover Obligations

- [ ] The builder acknowledges that `modules/pit/BUILD_PROGRESS_TRACKER.md` is the authoritative state record for PIT. All stage transitions, gate-passes, and build-start authorizations must be reflected there before work proceeds.
- [ ] Wave handover evidence contracts are defined in `modules/pit/08-implementation-plan/implementation-plan.md` §3 (per-wave handover evidence section). These contracts are binding — incomplete handover evidence is a build-wave blocker.
- [ ] The builder acknowledges the PREHANDOVER proof and IAA audit token requirements that apply to each build wave at Stage 12.

---

## Completion Note

> **Stage 9 Gate-Pass**: This checklist has been filed (ACTIVE — INITIATED). Stage 9 gate-pass requires a future separate review where a builder candidate has completed all acknowledgement sections and ticked all guardrail items. Only after Stage 9 gate-pass AND Stage 10 (IAA Pre-Brief) completion AND CS2 Build Authorization clearance may Stage 11 Builder Appointment proceed.

**Filed by**: foreman-v2-agent
**Filing date**: 2026-05-19
**Governing issue**: maturion-isms#1679
**Build Authorization**: NOT CLEARED
