# PIT - Project Implementation Tracker - App Description

## Status Header

| Field | Value |
|---|---|
| Module | PIT |
| Application Name | Project Implementation Tracker |
| Module Slug | `pit` |
| Artifact Type | App Description - Stage 1 upstream authority |
| Version | v1.0-draft |
| Status | Draft |
| Approval Status | Pending CS2 / Johan Ras approval |
| Owner | Johan Ras - Product Owner / Human Authority |
| Authority | CS2 / Johan Ras |
| Approval Date | Pending |
| Last Updated | 2026-05-05 |
| Module Filing Location | `modules/pit/00-app-description/app-description.md` |
| Governance Mirror / Pointer Location | `docs/governance/PIT_APP_DESCRIPTION.md` |
| Policy Authority | `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 |
| Pre-Build Authority | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 |
| Supersedes | Existing PIT retrofit stub that incorrectly described PIT as "Penetration Intelligence Tool" |
| Source Inputs | User legacy requirement document; `modules/pit/04-architecture/`; `Maturion/PIT/`; `apps/pit/Legacy/`; Maturion True North |

---

## 0. Document Purpose

This document defines PIT - the Project Implementation Tracker - as the governed Stage 1 App Description for the PIT build project.

It establishes the authoritative product intent, scope, success criteria, business logic, build governance obligations, technology baseline, security expectations, audit obligations, QA obligations, physical verification requirements, evidence requirements, state-management expectations, deployment readiness rules, and future evolution path from which all downstream PIT artifacts must derive.

This document replaces the current retrofit stub and corrects the module identity from "Penetration Intelligence Tool" to "Project Implementation Tracker".

Downstream PIT artifacts must treat this document as their upstream source once CS2 / Johan Ras grants Authoritative status. Until then, it remains a Draft and cannot by itself authorize Stage 2, Stage 3, architecture, builder appointment, or implementation.

---

## 0.1 Canonical Filing Strategy

The current module-stage filing location for this artifact is:

```text
modules/pit/00-app-description/app-description.md
```

The App Description policy also requires a governance-discoverable App Description at:

```text
docs/governance/PIT_APP_DESCRIPTION.md
```

Therefore, PIT must use the following filing strategy unless CS2 approves a different repository-wide convention:

1. The full Stage 1 module artifact is filed at `modules/pit/00-app-description/app-description.md`.
2. A governance mirror or pointer must be filed at `docs/governance/PIT_APP_DESCRIPTION.md`.
3. The mirror/pointer must either contain the same content or clearly point to the module-stage artifact.
4. If both files contain full content, they must be kept in sync.
5. If the repository canon is later updated to recognise `modules/{module}/00-app-description/app-description.md` as the canonical location for 12-stage module builds, this section may be superseded.

No downstream artifact may cite an ambiguous or stale App Description path. Every FRS, TRS, Architecture, QA-to-Red, PBFAG, Implementation Plan, Builder Checklist, IAA Pre-Brief, Builder Appointment, and Build artifact must identify which App Description version and path it derives from.

---

## 1. Application Identity

### 1.1 Application Name

PIT - Project Implementation Tracker.

### 1.2 Purpose Statement

PIT is the Maturion ISMS execution engine that turns risks, controls, audit findings, incidents, roadmap outputs, operational streams, and manually created initiatives into governed, scheduled, assigned, evidence-backed, auditable work.

### 1.3 Business Logic Summary

PIT converts upstream implementation drivers into hierarchical governed work, calculates and monitors timelines, assigns accountable owners, requires evidence-backed completion, escalates exceptions, and rolls progress back up to projects, departments, companies, source modules, portfolios, and executive dashboards.

### 1.4 Product Vision

PIT is not merely a task list. It is the execution nerve-centre of the Maturion ecosystem.

Where other modules identify, assess, quantify, recommend, or govern, PIT makes the work real by converting intentions into projects, milestones, deliverables, action items, tasks, responsibilities, evidence, progress, approvals, escalation, and measurable outcomes.

### 1.5 Target Users

PIT must serve the following user groups:

1. CS2 / Johan / platform super administrator.
2. Org Super Admins with whole-organisation visibility.
3. PIT Admins who configure templates, settings, permissions, and integration behaviour.
4. Executive and senior management viewers who need portfolio roll-up visibility.
5. Project Leaders responsible for full project delivery.
6. Milestone Leaders responsible for milestone delivery.
7. Deliverable Leaders responsible for delivery packages.
8. Task Owners responsible for execution, progress updates, and evidence submission.
9. Reviewers and approvers responsible for evidence, overrides, and escalation decisions.
10. Auditors and assurance users who need evidence and audit-trail review.
11. AI Assistant / Maturion / PIT Advisor acting within governed AIMC boundaries.

### 1.6 Core Value Proposition

PIT replaces fragmented spreadsheet trackers, disconnected project plans, manual follow-ups, and invisible task ownership with a governed, AI-assisted, multi-user implementation platform that gives organisations full situational awareness across:

- companies,
- departments,
- persons,
- projects,
- milestones,
- deliverables,
- action items,
- tasks,
- evidence,
- progress,
- timelines,
- delays,
- costs,
- workload, and
- risk/control mitigation outcomes.

### 1.7 Product Terminology and Technical Mapping

PIT must preserve the user's preferred business terminology while allowing architecture and database design to use normalized technical names.

| User-facing term | Meaning | Technical architecture equivalent |
|---|---|---|
| Project | Formal initiative, programme, implementation plan, or operational stream | `project` |
| Milestone | High-level checkpoint or phase within a project | `phase` |
| Deliverable | Concrete output or work package feeding a milestone | `work_package` |
| Action Item | Action statement or task-heading requiring one measurable outcome and evidence requirement | `task` or `task_cluster`, depending on whether it has child tasks |
| Task | Atomic executable unit of work with duration, owner, progress, due state, and evidence | `task` or `subtask` |
| Task Cluster | Reusable group of repeatable tasks, for example "Implement employee onboarding procedure" | `task_cluster_template` and generated `task_cluster` |
| Evidence Item | File, image, video, document, log, feedback, or record proving work completion | `evidence` and `evidence_review` |
| Timeline / Gantt | Date-aligned project/milestone/deliverable/task visualization | `timeline_cache`, `gantt_state`, and timeline UI components |

The Stage 2 UX Workflow & Wiring Spec and Stage 3 FRS must explicitly reconcile this mapping. User-facing screens should use the business language unless CS2 approves different labels.

---

## 2. Scope Definition

### 2.1 In Scope

PIT v1 includes the following major scope areas.

#### A. Project and Implementation Hierarchy

PIT must allow users to create, view, manage, filter, and report on a hierarchy of:

1. Project / Programme / Operational Stream.
2. Milestone.
3. Deliverable.
4. Action Item / Task Cluster.
5. Task / Subtask.
6. Evidence and progress logs.

The hierarchy must support indentation, numbering, roll-up, drill-down, and filtering.

#### B. Project Creation

The user must be able to create a project from multiple entry points, including:

1. the Implementation page,
2. the Timeline page, and
3. the relevant project creation modal or project selector entry point.

Project creation must capture at minimum:

- project name,
- project outcome,
- project description,
- project leader / responsible person,
- optional invited members,
- project type,
- organisational context,
- status context,
- timeline start and end dates via the timeline creator engine, not a simple date-only field.

#### C. Timeline Creator and Timeline Management

PIT must include a visual timeline creator and timeline management engine.

The timeline engine must support:

- year, quarter, month, week, and day denominators,
- readable date headers,
- exact date hover display,
- slider bars that align exactly with the date grid,
- draggable start and end handles,
- draggable whole bars,
- progress overlay inside bars,
- horizontal scrolling beyond the visible page,
- resizable date columns,
- proportional resizing of date denominations,
- filters for project, milestone, deliverable, task, responsible person, company, department, status, and date range,
- snapshot/report-friendly zoom-to-fit behaviour.

The timeline must not drift from its dates. If a bar starts on 1 January 2026, it must visibly align with 1 January 2026.

#### D. Implementation Page

The main work page must be named "Implementation" unless changed through later approved UX governance.

It must display:

- selected project summary indicators,
- filters,
- a hierarchy table,
- project rows,
- milestone rows,
- deliverable rows,
- task rows,
- planned versus actual timing,
- responsible person,
- progress,
- evidence management entry point,
- colour-coded hierarchy levels.

Required colour logic:

| Level | Colour |
|---|---|
| Column header and Project level | `#0D2850` |
| Milestone level | `#006B92` |
| Deliverable level | `#4C95B0` |
| Task level | white or status-coded neutral row |

#### E. Filters and Drill-Down

PIT must support multi-select filters for:

- projects,
- project status,
- milestones,
- deliverables,
- tasks,
- start date,
- end date,
- duration with operators (`>`, `<`, `=`, `>=`, `<=`, between),
- responsible person,
- progress,
- company,
- department,
- evidence status,
- overdue state.

If no filter is selected, the system displays the full available hierarchy in the authorised scope.

#### F. Milestone Management

Milestones must:

- belong to a project,
- support reuse through searchable dropdowns,
- allow new milestone names to be added,
- prevent or warn on duplicates,
- support spelling/duplicate-awareness,
- define planned duration inside project boundaries,
- display actual implementation range from child deliverables,
- default responsibility to the project leader when no milestone owner is assigned,
- trigger creation of deliverables underneath.

Milestone dates must support relative selection from the project timeline, for example:

- same start date as project,
- X days/weeks/months/years after project start,
- explicit picked date,
- duration in days/weeks/months/years,
- explicit end date.

#### G. Deliverable Management

Deliverables must:

- belong to a milestone,
- appear indented under the milestone,
- support assignment to a deliverable owner,
- default responsibility to the milestone owner when no deliverable owner is assigned,
- derive actual start/end from child tasks,
- display "No tasks assigned yet" or equivalent when no task dates exist,
- support evidence and task creation underneath.

#### H. Task and Action Item Management

Tasks and action items must support:

- deliverable assignment,
- task cluster selection or single-task creation,
- reusable task-cluster templates,
- task numbering,
- predecessor selection,
- dependency relationships,
- day/hour/minute offset from predecessor or milestone start,
- day/hour/minute duration,
- calculated start and end date,
- responsible person,
- invite/assign workflow,
- acceptance, edit-and-accept, or rejection by assignee,
- progress update,
- evidence requirement,
- evidence upload,
- audit trail.

Atomic tasks should normally carry one measurable outcome and one evidence requirement to prevent ambiguity.

#### I. Task Cluster Templates

PIT must include a reusable task cluster/template system.

Example: "Implement employee onboarding procedure" may generate tasks such as:

1. Draft procedure with stakeholders.
2. Obtain approval/sign-off.
3. Communicate procedure to relevant persons.
4. Obtain communication/consumption record.
5. Place procedure in accessible repository.

Users must be able to select, edit, save, and reuse clusters.

#### J. Assignment, Invitations, and Workload

PIT must support:

- selecting existing members,
- inviting new members by name and email,
- signup/link-in from invitation,
- assigning responsibility at project, milestone, deliverable, and task level,
- defaulting responsibility to the next higher responsible person when none is assigned lower down,
- assignee review before acceptance,
- audit trail for acceptance, edit-and-accept, rejection, reassignment, and escalation,
- future AI workload analysis based on competency, bio, job description, current workload, and availability.

#### K. Evidence Management

PIT must support evidence requirements and evidence uploads for tasks.

Evidence may include:

- documents,
- PDFs,
- Word files,
- spreadsheets,
- PowerPoint files,
- images,
- photographs,
- videos,
- logs,
- comments,
- verbal feedback records,
- links,
- system telemetry or export files.

Future versions may include AI evidence scoring, but AI evidence decisions must remain auditable and subject to human review where required.

#### L. Progress and Status Logic

PIT must include date-driven and evidence-driven status logic.

Examples:

- not yet active,
- starting soon / countdown,
- active,
- due today,
- overdue minor,
- overdue critical,
- completed,
- blocked,
- evidence pending,
- evidence accepted,
- evidence rejected,
- escalation required.

Progress must roll up from task to deliverable, milestone, project, department, company, and portfolio views.

#### M. Dashboards

PIT must include dashboard views for:

- organisation/portfolio management,
- project overview,
- implementation hierarchy,
- personal workboard,
- timeline/Gantt,
- evidence,
- watchdog,
- reports,
- audit log,
- QA/system health.

Dashboards must provide drill-down, roll-up, and filtered situational awareness.

#### N. Organisation Roll-Up

PIT must allow the same underlying work to be viewed by:

- entire organisation,
- company,
- division,
- department,
- team,
- person,
- project,
- milestone,
- deliverable,
- action item,
- task,
- date range,
- status,
- evidence state.

This is a core requirement, not an optional reporting add-on.

#### O. Permissions, Approvals, and Overrides

PIT must support role-based access and approval workflows.

Structural changes after lock-in must require approval and audit trail. Project-level changes require elevated approval and may require dual authorization where defined in UX/FRS/TRS.

#### P. Activity Feed and Audit Log

Every material activity must be logged and viewable/exportable by authorised users.

#### Q. QA Dashboard

PIT must include a one-click QA dashboard that runs actual QA checks and shows:

- total tests,
- passed tests,
- failed tests,
- system health percentage,
- category breakdown,
- failed-only drill-down,
- layman's-language failure descriptions,
- corrective action guidance,
- visual green tick / red X indicators.

QA must validate real functionality and wiring, not merely file existence.

#### R. AI Assistance

PIT must support governed AI assistance through AIMC only.

AI must assist with:

- suggesting milestones,
- suggesting deliverables,
- suggesting tasks,
- decomposing action items,
- improving task wording,
- detecting ambiguity,
- proposing responsible persons,
- workload analysis,
- schedule suggestions,
- evidence review assistance,
- status and risk insight summaries,
- watchdog recommendations,
- report summaries.

All AI calls must route through the approved AIMC gateway.

#### S. Cross-Module Integrations

PIT must integrate with Maturion modules including:

- MAT,
- MMM / Maturity Roadmap,
- Risk Assessment,
- WRAC,
- Control Library,
- Incident and Intelligence,
- Audit,
- Remote Assurance,
- Bowtie Builder,
- Data Analytics,
- Skills Development (future).

PIT receives work from upstream modules and feeds progress/evidence/mitigation status back downstream.

### 2.2 Explicitly Out of Scope for v1

The following are not part of the first governed build unless later approved through change control:

1. Direct calls from PIT to OpenAI, Anthropic, or any model provider outside AIMC.
2. AI auto-approval of evidence without human review rules.
3. Fully autonomous project restructuring without approval.
4. Native mobile apps; v1 may deliver responsive web, with native mobile deferred.
5. HR performance contract/KPA integration as a production feature; v1 must preserve hooks only.
6. Full WhatsApp/SMS production integration unless explicitly added in TRS and implementation plan.
7. Cross-tenant benchmarking using identifiable tenant data.
8. Uncontrolled self-learning or memory writes.
9. Treating the legacy static app as the production architecture.
10. Treating GitHub Pages legacy deployment as the mandatory future deployment model.
11. Treating the existing architecture as build-authorised until Stage 1 through Stage 7 are completed and aligned.

### 2.3 Boundaries and Constraints

- `modules/pit/` is the canonical module location for the governed PIT module-stage artifacts.
- `docs/governance/PIT_APP_DESCRIPTION.md` must exist as a governance mirror or pointer unless canon is updated to recognise only the module-stage path.
- `Maturion/PIT/` is legacy/reference material unless explicitly promoted.
- `apps/pit/Legacy/` is reference material only and must be mined for requirements, not blindly ported.
- Existing PIT architecture is valuable but was created before the current 12-stage governance model. It must be reconciled after this App Description through UX, FRS, TRS, Architecture, QA-to-Red, and PBFAG.
- All build work must follow the canonical 12-stage pre-build model.
- All significant upstream changes trigger Change-Propagation Audit.
- Architecture, QA, and implementation must remain aligned at all times.

---

## 3. Success Criteria

PIT succeeds when all of the following are true.

### 3.1 Product Success Criteria

1. Users can create projects, define outcomes, set timelines visually, invite responsible persons, and save a governed project record.
2. Users can create milestones, deliverables, action items, task clusters, and tasks in the required hierarchy.
3. Task dates are calculated from project/milestone/deliverable context, predecessor links, offsets, and duration.
4. Timeline bars align exactly with date grids and remain usable across long project horizons.
5. Users can assign work to existing or invited users and receive an auditable acceptance/rejection/edit response.
6. Tasks can require evidence and users can submit evidence before or at completion.
7. Progress rolls up from task to deliverable to milestone to project to organisation.
8. Managers can view work by project, company, department, person, status, progress, evidence, and date range.
9. Watchdog logic detects overdue, stalled, unsupported, unassigned, or inconsistent work.
10. QA dashboard can run real tests and expose failures in understandable terms.
11. AI can assist planning and analysis through AIMC while preserving auditability and human authority.
12. PIT can receive structured work from other Maturion modules and return progress/evidence/mitigation updates.

### 3.2 Governance Success Criteria

1. This App Description is approved by CS2 and marked Authoritative.
2. The governance mirror or pointer at `docs/governance/PIT_APP_DESCRIPTION.md` exists and is synchronized with this module artifact.
3. Stage 2 UX Workflow & Wiring Spec derives from this document.
4. Stage 3 FRS derives from this document and the UX Workflow & Wiring Spec.
5. Stage 4 TRS derives from the FRS and resolves all technical constraints.
6. Stage 5 Architecture is updated to align with the approved upstream artifacts.
7. Stage 6 QA-to-Red is written before implementation.
8. Stage 7 PBFAG passes before builder allocation.
9. All build waves remain test-first and evidence-backed.
10. `modules/pit/BUILD_PROGRESS_TRACKER.md` is updated at every wave closure.
11. The incorrect "Penetration Intelligence Tool" label is removed from all PIT governance artifacts.

### 3.3 Definition of Done for the Application

PIT is done only when:

- the deployable application exists,
- all approved user journeys work in the running app,
- all architecture-defined components are wired,
- all QA-to-Green tests pass,
- all browser physical verification evidence is filed,
- all security, RLS, auth, audit, and deployment gates pass,
- all legacy/dead components are removed,
- all required runbooks and evidence artifacts are filed,
- CS2 has verified the UI and product behaviour.

"Code exists" is not enough. PIT must work.

---

## 4. Strategic Context

### 4.1 Why PIT Exists

Maturion identifies risks, vulnerabilities, controls, findings, maturity gaps, incidents, and improvement actions. Without a governed execution engine, those insights remain plans rather than operational change.

PIT exists to close that gap.

It turns:

- risks into mitigation,
- controls into implementation,
- findings into closure,
- incidents into corrective/preventive action,
- maturity gaps into tasks,
- project intentions into measurable outcomes.

### 4.2 Relationship to Other Applications

PIT is downstream from assessment and intelligence modules and upstream from real-world implementation evidence.

| Source / Related Module | Relationship to PIT |
|---|---|
| MAT | MAT findings and recommendations can generate PIT projects/tasks; PIT can provide implementation closure evidence |
| MMM / Maturity Roadmap | Roadmap outputs can become PIT implementation plans |
| Risk Assessment | Treatment actions and mitigation plans flow into PIT; PIT progress feeds projected/residual risk updates |
| WRAC / Controls | Controls requiring implementation create PIT tasks; PIT returns implementation and evidence status |
| Incident / Intelligence | Corrective and preventive actions flow into PIT |
| Audit | Findings/NCRs create PIT tasks; evidence and closure flow back |
| Remote Assurance | System availability failures create PIT tasks; restoration evidence feeds control status |
| AIMC | PIT AI assistance routes through AIMC only |
| Evidence Library | PIT produces and consumes evidence records |
| Skills / HR future modules | PIT task completion and skills credit can later support performance and capability views |

### 4.3 Replacement / Extension Of

PIT replaces and extends:

- complex Excel trackers,
- manual project progress spreadsheets,
- isolated task trackers,
- static legacy PIT prototype,
- ad hoc follow-up lists,
- disconnected evidence folders.

---

## 5. Build Lifecycle Stages - AD-01

The PIT build must follow the canonical 12-stage model in order. Skipping, reordering, or beginning build early is prohibited without documented CS2 approval.

1. App Description - this document.
2. UX Workflow & Wiring Spec.
3. Functional Requirements Specification (FRS).
4. Technical Requirements Specification (TRS).
5. Architecture.
6. QA-to-Red.
7. PBFAG.
8. Implementation Plan.
9. Builder Checklist.
10. IAA Pre-Brief.
11. Builder Appointment.
12. Build.

No implementation wave may begin until Stages 1 through 11 are complete and gate-passed.

---

## 6. Requirements Derivation Chain - AD-02

The required derivation chain for PIT is:

```text
modules/pit/00-app-description/app-description.md v1.0-draft
    -> modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md vTBD
    -> modules/pit/02-frs/functional-requirements.md vTBD
    -> modules/pit/03-trs/technical-requirements-specification.md vTBD
    -> modules/pit/04-architecture/architecture.md and sub-artifacts vTBD
    -> modules/pit/05-qa-to-red/qa-to-red-catalog.md vTBD
    -> modules/pit/06-pbfag/pbfag-checklist.md vTBD
    -> modules/pit/07-implementation-plan/implementation-plan.md vTBD
    -> modules/pit/08-builder-checklist/ vTBD
    -> modules/pit/09-iaa-pre-brief/ vTBD
    -> modules/pit/10-builder-appointment/ vTBD
    -> modules/pit/11-build/ vTBD
```

Governance mirror / pointer:

```text
docs/governance/PIT_APP_DESCRIPTION.md
```

Each downstream artifact must contain a "Derived from" statement referencing the immediately upstream artifact and this App Description.

Existing architecture files in `modules/pit/04-architecture/` must be treated as valuable legacy/upstream evidence until back-traced and reconciled through the required chain.

Gaps in the derivation chain are blocking defects. No FRS, TRS, Architecture, QA-to-Red, PBFAG, Implementation Plan, Builder Checklist, IAA Pre-Brief, Builder Appointment, or Build artifact may proceed as if authoritative if its upstream derivation statement is missing or stale.

---

## 7. Technology Stack - AD-03

The TRS is responsible for final version and deployment constraints. The App Description establishes the following upstream baseline.

| Layer | Baseline Technology / Pattern | Notes |
|---|---|---|
| Frontend | React + TypeScript, aligned to current Maturion ISMS frontend standards | Exact framework/build tooling confirmed in TRS |
| Styling / UI | Maturion UI kit, Tailwind-style utility system where aligned, accessible component patterns | Must match broader Maturion visual language |
| State Management | React Context or approved Maturion auth provider for auth/session; approved query/cache layer for server state; Zustand or approved lightweight store for complex cross-page UI state | Final library/version confirmed in TRS |
| Database | Supabase PostgreSQL or approved PostgreSQL equivalent | Must support RLS and JSONB |
| Auth | Supabase Auth / JWT or approved Maturion auth standard | No mock auth in production |
| Edge/API | Supabase Edge Functions or approved ISMS serverless API layer | Registry required before PREHANDOVER |
| AI Integration | AIMC Gateway, PIT Advisor / `pit-advisor`, endpoint `/api/ai/request` | Direct provider calls prohibited |
| Evidence Storage | Supabase Storage or approved secure object storage | Signed access, metadata, hashes, RLS-aware records |
| Testing | Vitest/unit where appropriate, Playwright/E2E, schema/security/integration tests, GitHub Actions | QA-to-Red before implementation |
| QA Dashboard | In-app QA dashboard connected to real QA execution/report artifacts | Simulation-only QA is not acceptable for final handover |
| Notifications | Maturion Toast Notification Service / approved notification provider | `alert()` prohibited |
| Deployment | ISMS standard deployment target, confirmed in TRS and deployment wave | Runbook and smoke test required |

Any discrepancy between this baseline and TRS is a blocking defect until resolved. TRS may refine versions, deployment details, and technical constraints, but it may not contradict the App Description without updating the App Description through approved governance.

---

## 8. Deliverable Artifacts - AD-04

"Is the deployable app a non-negotiable deliverable?" - YES.

Required deliverables:

- [ ] Deployable PIT application.
- [ ] App Description - this document.
- [ ] Governance mirror or pointer at `docs/governance/PIT_APP_DESCRIPTION.md`.
- [ ] UX Workflow & Wiring Spec.
- [ ] FRS.
- [ ] TRS.
- [ ] Updated Architecture.
- [ ] QA-to-Red suite.
- [ ] PBFAG artifacts.
- [ ] Implementation Plan.
- [ ] Builder Checklist artifacts.
- [ ] IAA Pre-Brief artifact.
- [ ] Build wave evidence.
- [ ] PREHANDOVER proofs per wave.
- [ ] Physical verification screenshots/walkthroughs for all UI waves.
- [ ] Schema migrations.
- [ ] Schema-to-hook validation artifacts.
- [ ] Table Pathway Audit artifacts.
- [ ] RLS Audit Gate artifact.
- [ ] Auth Wiring Checklist artifacts.
- [ ] Edge Function Registry.
- [ ] AIMC routing evidence.
- [ ] QA dashboard with real test execution.
- [ ] Watchdog rules and test evidence.
- [ ] Deployment runbook.
- [ ] CWT closure report.
- [ ] Updated `BUILD_PROGRESS_TRACKER.md` per wave.
- [ ] Legacy migration/removal audit.
- [ ] Final CS2 UI verification evidence.

---

## 9. Component Definition of Done - AD-05

A component is done only when it exists and works in the running application.

| Component | Definition of Done |
|---|---|
| App shell and navigation | Implemented, role-aware, all routes wired, physical verification complete |
| Implementation hierarchy page | Project/milestone/deliverable/task hierarchy renders, filters work, colours match spec, CRUD actions wired |
| Project creation workflow | Create project modal, timeline setting, member invite, save, display, audit log, validation, and tests all pass |
| Milestone workflow | Project association, reusable dropdown, duplicate handling, relative duration logic, owner/default rules, display roll-up all pass |
| Deliverable workflow | Milestone association, owner/default rules, derived date display, task creation entry, roll-up all pass |
| Task/action workflow | Cluster/single task creation, predecessor linking, duration calculation, owner assignment, evidence requirement, progress, audit all pass |
| Timeline engine | Grid dates, slider bars, progress overlay, hover exact date, drag/resize, scroll, zoom, filters, and alignment tests all pass |
| Evidence management | Upload/review/accept/reject/clarify flows work with storage, metadata, audit, permissions, and tests |
| Assignment and invitation | Existing user assignment, new user invite, signup/link-in, accept/edit/reject, notification, audit all pass |
| Permissions and overrides | Role inheritance, read-up/write-down, approval workflows, dual approval where required, RLS and UI tests pass |
| Dashboards and reports | Portfolio/project/person/department roll-ups, drill-down, exports, and performance tests pass |
| Watchdog | Scheduled/demand scans, rules, severity, alerts, escalation, audit, and QA tests pass |
| AI assistant | All AI calls route through AIMC, suggestions are auditable, human approval enforced, direct provider checks pass |
| QA dashboard | Real QA execution/reporting, categories, pass/fail drill-down, corrective guidance, and no simulated-only status |
| Audit log | All material actions logged with before/after where applicable, immutable/append-only behavior verified |
| Deployment | Production deployment, smoke tests, runbook, rollback, CWT closure, and final URL verification pass |

---

## 10. Test-First Guarantee - AD-06

Code-first development is prohibited.

Every PIT build wave, including remediation waves, must have QA-to-Red tests before implementation begins.

### 10.1 QA Role

QA Agent / Role: designated QA builder under Foreman supervision.

Foreman is responsible for validating that QA-to-Red exists before builder allocation. The QA role is responsible for authoring, maintaining, and reporting the QA-to-Red suite. Builders may not write implementation first and then backfill QA.

### 10.2 Expected Pre-Build Threshold

Minimum threshold before builder allocation:

1. 100% of required QA-to-Red tests for the wave must be authored.
2. 100% of required QA-to-Red tests for the wave must be reviewed and accepted by Foreman or the delegated QA authority.
3. The expected pre-build result is RED where implementation does not yet exist or does not yet meet the approved specification.
4. QA-to-Red coverage must map to the App Description, UX Workflow & Wiring Spec, FRS, TRS, Architecture, and implementation wave scope.
5. PBFAG cannot pass until QA-to-Red coverage is complete.

### 10.3 Remediation Wave Rule

Every remediation wave requires a new or updated QA-to-Red test that reproduces the defect before remediation begins. Reusing prior passing tests alone is insufficient. If a UI defect, wiring defect, timeline defect, schema defect, auth defect, AI-routing defect, evidence defect, audit defect, or deployment defect is found after handover, the correct response is:

1. update the upstream artifact if the requirement was missing or ambiguous,
2. update the QA-to-Red suite so the defect fails,
3. build/remediate to GREEN,
4. physically verify the fix,
5. update PREHANDOVER evidence and tracker state.

### 10.4 Required PIT QA-to-Red Coverage

Required PIT QA-to-Red coverage includes at least:

- hierarchy creation,
- project timeline creation,
- milestone/deliverable/task creation,
- date calculation,
- dependency validation,
- filters,
- assignment/invitation acceptance,
- evidence upload/review,
- progress roll-up,
- permissions/RLS,
- audit logging,
- AIMC routing,
- timeline alignment,
- watchdog,
- QA dashboard,
- deployment smoke.

Expected pre-build state: RED tests exist and fail because implementation is not yet present or not yet aligned. Builders then build to GREEN.

---

## 11. Physical Verification Gate - AD-07

Every UI wave requires browser-based physical verification.

### 11.1 Responsible Role

Role responsible: Foreman or Foreman-designated physical verification agent.

CS2 / Johan Ras remains the final product verification authority for the user-visible experience.

### 11.2 Evidence Filing Location

Physical verification evidence must be filed at:

```text
.agent-admin/evidence/physical-verification/pit/wave-{N}-{YYYYMMDD}/
```

Where repository policy requires module-local evidence, the wave must also link or mirror the evidence from the relevant PIT wave folder.

### 11.3 Minimum Physical Verification Journeys

Minimum physical verification journeys:

1. Create project and set timeline.
2. Invite or select a project leader.
3. Add milestone.
4. Add deliverable.
5. Add task cluster.
6. Add single task.
7. Link task to predecessor and verify calculated start/end.
8. Assign task and accept/edit/reject assignment.
9. Upload evidence.
10. Review/accept/reject evidence.
11. Update progress and verify roll-up.
12. Verify implementation table filters.
13. Verify timeline bar/date alignment.
14. Run QA dashboard.
15. View audit log entry for actions.

### 11.4 Gate Condition

No UI wave may close unless browser-based verification evidence is filed and linked from PREHANDOVER proof. Screenshots or screen recordings must show the actual running PIT app, not static mockups.

---

## 12. PBFAG Checklist Requirements - AD-08

PIT PBFAG must pass before builder allocation.

Minimum required checks:

1. App Description approved and complete.
2. Governance mirror or pointer at `docs/governance/PIT_APP_DESCRIPTION.md` exists.
3. UX Workflow & Wiring Spec approved, with all user journeys wired.
4. FRS approved with no TBDs.
5. TRS approved with technical constraints resolved.
6. Architecture updated and back-traced to upstream artifacts.
7. QA-to-Red complete and signed off.
8. Legacy build audit complete: useful requirements harvested; dead code not ported blindly.
9. Runtime/Deployment Contract filed.
10. Golden Path Verification Pack filed.
11. Change-Propagation Audit complete for all upstream changes.
12. Prior-wave defects are closed or formally deferred with CS2/Foreman approval.
13. PREHANDOVER proof from the prior wave is filed and linked.
14. Auth wiring readiness confirmed.
15. Schema alignment confirmed.
16. RLS coverage confirmed.
17. Edge Function Registry drafted and aligned.
18. AIMC routing confirmed.
19. Timeline math/alignment design verified.
20. QA dashboard real-execution plan confirmed.
21. External dependencies are confirmed available.
22. Build tracker current.
23. No build-blocking unknowns remain.

Any FAIL blocks build. PBFAG is a hard gate, not a discussion checklist. No builder allocation may occur until PBFAG is formally PASS.

---

## 13. Agent Authority Chain - AD-09

| Role | Authority | PIT Gate Point |
|---|---|---|
| CS2 / Johan Ras | Final product, governance, and override authority | App Description approval, major scope changes, final handover |
| CodexAdvisor | Sole authority to create or modify PIT agent contract files, subject to approved issue/scope | Before any agent contract is created or modified |
| Foreman | Governs pre-build flow, allocates builders, validates gate readiness | Stages 2-11 |
| IAA | Independent assurance, pre-brief and assurance token controls | Stage 10 and applicable wave assurance |
| QA Agent | Writes/maintains QA-to-Red and reports failures | Stage 6 and every wave |
| Builder Agent | Implements approved wave scope only | Stage 12 after appointment |
| AIMC / PIT Advisor | Provides governed AI assistance through gateway | During planning, execution, analysis, evidence, watchdog |
| Product Owner / UI Reviewer | Verifies running product and user experience | Physical verification and final acceptance |

### 13.1 Agent Contract Rule

CodexAdvisor is the sole role authorised to create or modify PIT agent contract files. No Foreman, Builder, QA agent, automation, or human may edit PIT agent contracts unless explicitly authorised through the applicable CS2-approved issue and governance protocol.

### 13.2 Builder Governance Boundary

Builders may not modify governance artifacts unless explicitly authorised by the approved issue/scope. Builders implement approved wave scope only. If implementation reveals a governance or architecture issue, the builder must stop, escalate, and wait for Foreman/CS2 disposition.

### 13.3 Authority Transition Gate Points

- App Description Draft -> Authoritative: CS2 / Johan Ras.
- Stage 2-7 pre-build progression: Foreman validates gates.
- Builder allocation: Foreman only, after PBFAG PASS, Builder Checklist PASS, and IAA Pre-Brief.
- Assurance acceptance: IAA controls assurance token / pre-brief expectations.
- Final product handover: CS2 / Johan Ras verifies running UI and product behaviour.

---

## 14. Schema-to-Hook Validation - AD-10

Every PIT schema change must be validated column-by-column against consuming hooks, API calls, edge functions, UI components, tests, and reports.

### 14.1 Evidence Filing Location

Schema-to-hook validation artifacts must be filed at:

```text
.agent-admin/evidence/schema-to-hook/pit/wave-{N}-{YYYYMMDD}.md
```

Where a module-local evidence structure is required, the wave must also link or mirror the artifact from the applicable PIT wave folder.

### 14.2 Required High-Risk Schema Areas

Required high-risk schema areas:

- project,
- phase/milestone,
- work_package/deliverable,
- task,
- subtask,
- task_cluster,
- task_dependency,
- evidence,
- evidence_review,
- task_progress_log,
- timeline_cache,
- gantt_state,
- watchdog_alert,
- qa_result,
- integration link tables,
- notification,
- audit_log.

### 14.3 No-Merge Rule

No migration may merge without schema-to-hook validation. The validation must confirm that every added/changed column is consumed or intentionally reserved, and that no consuming hook/query references missing columns.

---

## 15. Table Pathway Audit - AD-11

Any wave touching the database must file a Table Pathway Audit listing every table used by the wave and every `.from()` or equivalent query path.

### 15.1 Evidence Filing Location

Table Pathway Audit artifacts must be filed at:

```text
.agent-admin/evidence/table-pathway/pit/wave-{N}-{YYYYMMDD}.md
```

Where a module-local evidence structure is required, the wave must also link or mirror the artifact from the applicable PIT wave folder.

### 15.2 Audit Requirements

The audit must confirm:

- migration exists,
- RLS exists,
- query/hook exists,
- tests exist,
- UI route or service usage exists where applicable,
- no orphan tables or unused columns are introduced.

### 15.3 Gate Condition

Any database-touching wave is blocked from closure until the Table Pathway Audit is filed and approved.

---

## 16. RLS Audit Gate - AD-12

PIT must enforce organisation and assignment-based isolation.

### 16.1 Evidence Filing Location

RLS Audit artifacts must be filed at:

```text
.agent-admin/evidence/rls-audit/pit/wave-{N}-{YYYYMMDD}.md
```

Where a module-local evidence structure is required, the wave must also link or mirror the artifact from the applicable PIT wave folder.

### 16.2 Sign-Off Authority

Foreman validates RLS audit completion. CS2 approval is required before production deployment.

### 16.3 Minimum RLS Rules

Minimum RLS rules:

1. Users must not see records from another organisation.
2. Project members see only projects they are authorised to access.
3. Higher-level authorised users can read down within their scope.
4. Lower-level users cannot modify higher-level structures.
5. Task owners can update task progress and evidence for assigned tasks only.
6. Overrides require authorised approvers and audit trail.
7. Admin overrides are allowed only inside explicit authority and must be logged.
8. Evidence storage access must follow task/project/org permissions.
9. AI context must not include cross-tenant data.
10. Integration callbacks must respect org boundaries.

### 16.4 Deployment Gate Condition

Production deployment is blocked until RLS audit passes and sign-off is recorded.

---

## 17. Auth Wiring Checklist - AD-13

Auth wiring is mandatory for every wave.

Required items:

- [ ] Auth provider wraps the PIT app.
- [ ] Protected routes enforce login/session.
- [ ] User role and org context available to UI and API.
- [ ] Login flow tested.
- [ ] Logout flow tested.
- [ ] Session refresh/expiry tested.
- [ ] JWT passed to session-scoped API calls.
- [ ] No mock auth in production.
- [ ] Access-denied states are user-friendly and audited where relevant.

---

## 18. AI Integration Requirements - AD-14

All AI/LLM calls in PIT must route through AIMC.

Authoritative AI routing baseline:

- Endpoint: `/api/ai/request`
- Capability: `analysis`
- Agent: `pit-advisor`

Direct provider SDK calls or direct API keys in PIT are prohibited.

### 18.1 Testability Requirement

QA must include a static or runtime check confirming that PIT contains:

- no direct OpenAI SDK/API calls,
- no direct Anthropic SDK/API calls,
- no direct provider SDK/API calls to any non-AIMC model provider,
- no direct provider API keys outside approved gateway code,
- no client-side model provider credentials,
- no AI call path that bypasses `/api/ai/request`.

Any direct provider call or direct provider key in PIT is a blocking defect.

### 18.2 AI Audit Requirement

AI must be auditable. For AI-assisted actions, PIT must record:

- triggering user/action,
- prompt or prompt hash where appropriate,
- model/gateway metadata available from AIMC,
- input summary,
- output summary,
- confidence or advisory status where available,
- whether the suggestion was applied,
- approving user where human approval is required.

AI may suggest, draft, prioritise, schedule, decompose, analyse, and warn. AI must not silently approve structural changes, evidence decisions, permission changes, or project-level overrides unless later explicitly authorised through governance.

---

## 19. Edge Function Registry - AD-15

An Edge Function Registry must be filed before PREHANDOVER.

### 19.1 Registry Location

The PIT Edge Function Registry must be filed at:

```text
modules/pit/03-trs/edge-function-registry.md
```

and/or, if architecture keeps the function implementation map:

```text
modules/pit/04-architecture/integrations/edge-function-registry.md
```

TRS must nominate the binding registry location before architecture approval.

### 19.2 Expected PIT Function Domains

Expected PIT function domains include:

- `/pit/project/create`
- `/pit/project/update`
- `/pit/project/delete`
- `/pit/phase/create`
- `/pit/phase/update`
- `/pit/work_package/create`
- `/pit/work_package/update`
- `/pit/task/create`
- `/pit/task/update`
- `/pit/task/assign`
- `/pit/task/set_status`
- `/pit/subtask/create`
- `/pit/subtask/update`
- `/pit/cluster/generate`
- `/pit/template/create`
- `/pit/dependency/create`
- `/pit/schedule/run`
- `/pit/evidence/upload`
- `/pit/evidence/review`
- `/pit/task/progress/update`
- `/pit/watchdog/scan`
- `/pit/watchdog/resolve`
- `/pit/timeline/cache/refresh`
- `/pit/notify/send`
- `/pit/ai/generate_tasks`
- `/pit/ai/schedule`
- `/pit/ai/review_evidence`
- `/pit/ai/weekly_summary`

### 19.3 Blocking Rule

Every invocation must be authenticated, registered, tested, and audit-logged where mutating.

Any unregistered, undeployed, unauthenticated, or untested PIT edge-function invocation is a blocking defect.

### 19.4 PREHANDOVER Rule

Every PREHANDOVER proof must confirm that all invoked functions appear in the Edge Function Registry and that the function name/path used by the implementation exactly matches the registered function.

---

## 20. Deployment Wave - AD-16

The final implementation wave must be Deployment & Commissioning.

Required deployment wave contents:

- production environment provisioning,
- configuration injection,
- secret validation,
- migration execution,
- RLS verification,
- Edge Function deployment,
- AIMC gateway connectivity verification,
- storage bucket verification,
- QA-to-Green full run,
- Combined Wave Test,
- production smoke testing,
- rollback verification,
- CWT closure report,
- CS2 final UI verification.

No module completion may be declared without deployment wave closure and CWT closure report.

---

## 21. Secret Naming Convention - AD-17

All environment variables and secrets must use `UPPERCASE_SNAKE_CASE`.

`.env.example` is the canonical reference for required environment variables.

Expected variables may include, subject to TRS confirmation:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AIMC_GATEWAY_URL`
- `AIMC_GATEWAY_TOKEN`
- `PIT_STORAGE_BUCKET`
- `PIT_NOTIFICATION_FROM_EMAIL`
- `PIT_WEBHOOK_SECRET`
- `APP_BASE_URL`

No undocumented production environment variables are allowed.

Deployment wave must validate `.env.example` against all runtime code paths and deployment configuration.

---

## 22. Deployment Runbook - AD-18

Deployment runbooks must be filed before the deployment wave closes.

### 22.1 Runbook Filing Location

PIT runbooks must be filed at:

```text
modules/pit/11-build/deployment/runbooks/
```

If repository-level runbooks are required, a mirror or pointer must also be filed at:

```text
docs/runbooks/pit/
```

TRS must nominate the binding runbook location before architecture approval.

### 22.2 Required Runbooks

Required runbooks:

- PIT application deployment runbook.
- PIT database migration runbook.
- PIT edge function deployment runbook.
- PIT storage/evidence runbook.
- PIT AIMC connectivity runbook.
- PIT rollback runbook.
- PIT smoke-test runbook.

Each runbook must include deployment, rollback, redeploy, health check, and environment-specific notes.

### 22.3 Deployment Gate

Deployment wave closure is blocked until all required runbooks are filed and linked from PREHANDOVER evidence.

---

## 23. Notification / UX Patterns - AD-19

`alert()` is prohibited for user-facing notifications.

PIT must use the Maturion Toast Notification Service or the approved Maturion notification provider nominated in TRS.

### 23.1 Root-Level Integration

The notification provider must be mounted once at the PIT app root. Notifications must not be implemented ad hoc inside individual components without using the approved notification service.

### 23.2 Notification Types

Notification types include:

- new assignment,
- assignment accepted,
- assignment edited and accepted,
- assignment rejected,
- due soon,
- due today,
- overdue,
- critical overdue escalation,
- evidence submitted,
- evidence accepted/rejected/clarification required,
- approval requested,
- override approved/rejected,
- watchdog alert,
- QA failure,
- import/export completion.

Notifications must be understandable, actionable, and linked to the relevant project/task/evidence/approval record.

### 23.3 Physical Verification

Physical verification must confirm visible working notifications for at least:

- assignment,
- evidence,
- overdue,
- approval,
- QA failure.

No production `alert()` calls are allowed.

---

## 24. Shared State Architecture - AD-20

PIT must explicitly define state ownership.

### 24.1 State Management Approach

Baseline state-management approach:

- Auth/session state: React Context or approved Maturion auth provider.
- Server state: approved query/cache layer.
- Complex cross-page UI state: Zustand or approved lightweight store.
- Form draft state: component/form state unless TRS approves persisted drafts.
- Timeline viewport state: persisted through `gantt_state` or approved user settings.
- QA run state: QA service and `qa_result` records/artifacts.

TRS must confirm exact implementation libraries and patterns before Architecture approval.

### 24.2 Minimum State Inventory

| State Area | Authoritative Owner | Persistence |
|---|---|---|
| Auth/session | Auth provider | Session/JWT |
| Organisation context | User profile / membership records | Database/session |
| Active project selection | User preference/service | Database or local storage, finalized in TRS |
| Implementation filters | UI state with optional saved views | Local storage or DB preferences |
| Timeline zoom/date settings | `gantt_state` / user settings | Database |
| Sidebar collapse/expand | UI preference | Local storage |
| Draft modal data | UI form state | Session/local draft if required |
| Evidence upload progress | Upload service + DB metadata | Session until committed, DB after upload |
| QA run results | QA service / `qa_result` | Database/artifact |
| Notification read state | Notification table | Database |

### 24.3 Cross-Page State Flows

The following state flows must survive page navigation according to AD-24 persistence rules:

- active project,
- selected filters,
- selected timeline denominator,
- visible timeline date range,
- notification read state,
- QA run status,
- evidence upload status where upload is in progress,
- unsaved modal drafts only where explicitly approved.

### 24.4 Pre-Architecture Gate

Architecture may not commence until TRS confirms the state-management approach and no ambiguous global state remains. Ambiguous global state is a blocking architecture defect.

---

## 25. API Authentication - AD-21

Every user/session-context PIT endpoint must require JWT or equivalent authenticated context.

Unauthenticated endpoints: none by default.

Possible exceptions such as invite acceptance links must use tokenized, time-limited, auditable access and must be explicitly listed in TRS.

PREHANDOVER proof must include API authentication audit.

---

## 26. Audit Log Design - AD-22

PIT audit logging is mandatory.

### 26.1 Actions to Log

Actions to log include:

- login/logout where surfaced to PIT,
- project create/update/delete,
- milestone create/update/delete,
- deliverable create/update/delete,
- task create/update/delete,
- dependency create/update/delete,
- timeline drag/resize changes,
- owner assignment/reassignment,
- invite sent/accepted/expired,
- assignee accepted/edited/rejected,
- progress updates,
- status changes,
- evidence upload/review/delete/clarification,
- approval and override requests,
- approvals/rejections,
- permission changes,
- AI suggestion generated/applied/rejected,
- watchdog alert generated/resolved,
- QA run executed,
- import/export actions,
- deployment/health checks where applicable.

### 26.2 Minimum Audit Fields

Audit logs must include at minimum:

- event ID,
- actor,
- timestamp,
- action type,
- target record/table,
- before state where applicable,
- after state where applicable,
- reason/justification where required,
- source (manual, AI-assisted, import, integration, watchdog),
- idempotency key where applicable.

### 26.3 Surfacing and Export

Audit logs must be surfaced through an authorised PIT Audit Log page and exportable by authorised admin/audit users. Audit export must respect organisation, project, role, and RLS boundaries.

### 26.4 Deduplication Strategy

Each audit event must carry a unique `event_id`. Mutating API calls should use `idempotency_key` where duplicate submissions are possible, including timeline drag/resize, assignment, evidence review, approval, import, and integration callbacks.

### 26.5 Retention

Audit logs must be retained for the applicable compliance retention period defined in TRS. Deletion, anonymisation, archival, or retention expiry must follow approved retention governance. Audit logs must be append-only or tamper-evident according to TRS.

### 26.6 Pre-Architecture Gate

Architecture may not commence until audit log action types, schema, surfacing, retention, and deduplication design are approved.

---

## 27. Tracker Update Requirement - AD-23

`modules/pit/BUILD_PROGRESS_TRACKER.md` must be updated at every wave closure.

### 27.1 Known Tracker Corrections Required

Known tracker corrections required after this App Description is approved:

1. Correct module name from "Penetration Intelligence Tool" to "Project Implementation Tracker".
2. Mark Stage 1 according to CS2 approval status.
3. Record this document as the Stage 1 artifact.
4. Record the governance mirror/pointer at `docs/governance/PIT_APP_DESCRIPTION.md`.
5. Record the existing architecture as pre-stage evidence requiring reconciliation.
6. Add next action: Stage 2 UX Workflow & Wiring Spec.

### 27.2 Foreman Validation Step

Foreman must validate tracker currency before wave closure sign-off. Tracker update is not optional and must be linked from PREHANDOVER proof for each wave.

### 27.3 Gate Condition

Wave closure is prohibited unless the tracker is current.

---

## 28. State Persistence Specification - AD-24

| State Item | Storage Location | Retention Policy | Ownership |
|---|---|---|---|
| Projects | Database | Permanent until soft-deleted | Project service |
| Milestones / phases | Database | Permanent until soft-deleted | Hierarchy service |
| Deliverables / work packages | Database | Permanent until soft-deleted | Hierarchy service |
| Tasks/subtasks | Database | Permanent until soft-deleted | Task service |
| Task clusters/templates | Database | Permanent until soft-deleted | Template service |
| Dependencies | Database | Permanent until soft-deleted | Scheduling service |
| Timeline viewport/user settings | `gantt_state` or user settings table | Persistent per user | Timeline service |
| Timeline cache | `timeline_cache` | Rebuildable cache | Timeline service |
| Filters/saved views | User preference table or local storage | Persistent or device-specific per TRS | UI state service |
| Evidence files | Secure object storage | Per retention policy | Evidence service |
| Evidence metadata/review | Database | Permanent/auditable | Evidence service |
| Progress logs | Database | Append-only | Progress service |
| Watchdog alerts | Database | Permanent/soft-closed | Watchdog service |
| Notifications | Database | Until retention expiry | Notification service |
| Audit logs | Database/log store | Minimum retention per compliance requirements | Audit service |
| QA run results | `qa_result` table and CI artifacts | Per QA retention policy | QA service |
| AI request metadata | AIMC log / PIT AI log reference | Per AIMC retention policy | AIMC/PIT advisor service |
| Physical verification evidence | `.agent-admin/evidence/physical-verification/pit/` and/or linked module evidence folder | Permanent build evidence unless retention policy supersedes | Foreman / physical verification agent |
| Schema-to-hook validation evidence | `.agent-admin/evidence/schema-to-hook/pit/` | Permanent build evidence unless retention policy supersedes | Foreman / QA / data architecture role |
| Table Pathway Audit evidence | `.agent-admin/evidence/table-pathway/pit/` | Permanent build evidence unless retention policy supersedes | Foreman / QA / data architecture role |
| RLS Audit evidence | `.agent-admin/evidence/rls-audit/pit/` | Permanent build evidence unless retention policy supersedes | Foreman with CS2 deployment approval |

---


## MMM Lessons Promoted Into PIT

**Source**: MMM Build Process — Improvement Register (`modules/MMM/_readiness/build-process-improvement-register.md`)
**Authority**: Foreman v2 governance directive — maturion-isms#1537
**Purpose**: These lessons were observed during the MMM build (Waves B1–B9 and post-build corrections) and are promoted into PIT pre-build controls to prevent the same escape classes in PIT.

---

### L-001 — Build-Complete Is Not Operationally Closed

**MMM Observation**: MMM tracker distinguishes L1 build-complete (code passing tests) from L2 deployment commissioned (live on target environment) from L3 operationally closed (end-to-end verified in production by CS2).

**PIT Control**: PIT's Implementation Plan, PBFAG, PREHANDOVER proofs, and final handover gate must explicitly carry the L1/L2/L3 closure model. A wave is not closed until L2 (deployed and commissioned) is confirmed. PIT is not done until L3 (CS2 verified live E2E workflow) is confirmed.

**Evidence required**: Each relevant wave PREHANDOVER must distinguish L1/L2/L3 status. L3 closure requires CS2 sign-off with live evidence.

---

### L-002 — UI Can Pass Code/File Tests and Still Render Incorrectly

**MMM Observation** (OVS-001 / OVS-004): The MMM B3 UI passed all automated tests but was delivered without global CSS, causing bare/unstyled HTML in production. Tests verified file existence, headings, and query calls, but not visual rendering completeness.

**PIT Control**:
- Every UI wave must require: global stylesheet present and imported at app root; app shell present and styled; primary pages visually rendered (no bare HTML).
- QA-to-Red for every UI wave must include visual/rendering tests or equivalent assertions — not only string-existence or file-existence tests.
- Physical verification screenshots must confirm all pages are visually styled before wave closure.

**Gate condition**: UI wave closure blocked unless visual rendering confirmed.

---

### L-003 — Dashboard and Landing Pages Require Real Empty/Error/Permission States

**MMM Observation** (OVS-002 / OVS-003): After login, the MMM dashboard showed sparse headings and blank metric labels. There was no app shell, no navigation, no empty-state explanation, no CTA, and no error distinction between permission failure and network failure.

**PIT Control**:
- All PIT primary pages (Dashboard, Implementation, Timeline, Evidence, Watchdog, Audit Log, QA Dashboard) must define and implement all of the following states before wave closure:
  - Loading state
  - Empty data state (with useful message and CTA to next action)
  - Permission-denied state (distinct from network/server failure)
  - Network/server error state (with user guidance)
  - Data state (with real data rendering)
- Each state must be covered by a QA-to-Red test.
- HTTP response status (`res.ok` / `res.status`) must be checked before `res.json()` in every component that fetches data.

**Gate condition**: No page is complete unless all 5 states are implemented and tested.

---

### L-004 — Signup/Onboarding and Auth Route Discoverability Must Be Designed Up Front

**MMM Observation**: MMM required post-build fixes for missing `/login` registration, login route discoverability, forgot-password, reset callback, direct SPA route fallback, and signup/onboarding handling.

**PIT Control**: PIT Stage 2 (UX Workflow & Wiring Spec) and Stage 3 (FRS) must explicitly specify:
- Public entry route and visible Sign In / Sign Up navigation links from the landing page
- `/login` route registration and page implementation
- Signup/onboarding flow including invitation acceptance
- Forgot-password and password-reset routes and pages
- Protected route redirect to login when unauthenticated
- Direct SPA route fallback (deep-link support)
- Access-denied state for authenticated users without required roles

All of the above must be in QA-to-Red before implementation begins.

**Gate condition**: Stage 2 carry-forward — all auth/onboarding routes must be specified in UX Wiring Spec before Stage 3 FRS approval.

---

### L-005 — Tests Must Prove Runtime and UI Behaviour, Not Only File Existence

**MMM Observation** (OVS-004): File-existence and string-presence tests passed for pages that were not operationally useful. Tests verified file exists, heading present, fetch called — not that the user could actually use the page.

**PIT Control**:
- QA-to-Red for every PIT wave must require executable/runtime checks, not only file-existence or string-presence checks.
- Required per-wave QA evidence types:
  - TypeScript compile check (`tsc --noEmit` or equivalent)
  - Route coverage (all registered routes reachable)
  - CSS/rendering checks (global stylesheet imported, app shell present)
  - Structural completeness per-page (nav, empty state, error state, CTA present)
  - E2E/golden-path test for primary user journey
  - Live browser physical verification (screenshot/recording evidence)
- Any wave with only string/file-existence tests as QA evidence is insufficient and must be remediated.

**Gate condition**: Builder Checklist must confirm QA includes runtime/UI behaviour tests, not only static checks.

---

### L-006 — Deployment Execution Must Be a First-Class Contract

**MMM Observation**: MMM deployment required later hardening around Vercel deployment, Supabase migration execution, schema verification, environment/secrets validation, live end-to-end validation, and CWT sign-off.

**PIT Control**:
- A Runtime/Deployment Contract must be filed before PBFAG passes (see AD-08, item 9).
- The Deployment Wave (AD-16) must include as a hard gate: schema migration execution, Edge Function deployment, storage bucket verification, AIMC connectivity check, QA-to-Green full run, production smoke test, rollback verification, and CWT closure report.
- Deployment evidence must be LIVE_RUNTIME or LIVE_E2E typed — merged-PR references or static code review alone are insufficient.

**Gate condition**: PBFAG blocked until Runtime/Deployment Contract is filed. Deployment wave blocked until all live evidence is filed.

---

### L-007 — Operational Closure Requires Live Evidence

**MMM Observation**: Static code review, CI GREEN, and provisioning confirmations are insufficient to close live operational items. Real end-to-end workflows in the deployed environment are required.

**PIT Control**:
- L3 operational closure requires at minimum:
  - One live end-to-end workflow demonstrated on the deployed PIT environment
  - CS2 sign-off on the live product
  - Physical evidence (screenshot or recording) filed at `.agent-admin/evidence/physical-verification/pit/`
  - All primary user journeys working (see AD-07 §11.3)
- Declaring PIT "done" without L3 closure is a governance violation.

**Gate condition**: L3 closure is blocked until CS2 verifies the live deployed PIT environment.

---

### L-008 — Continuous Improvement Must Be Recorded and Promoted

**MMM Observation**: Build-process oversights discovered after initial delivery were captured reactively. Pre-build design could prevent entire escape classes if identified and locked in before build starts.

**PIT Control**:
- Any PIT design/build oversight discovered during Stages 2–7 must be:
  1. Recorded in `modules/pit/_readiness/pit-build-process-improvement-register.md`
  2. Propagated back to the appropriate upstream artifact (App Description, UX Wiring Spec, FRS, TRS, Architecture, QA-to-Red) before the affected wave proceeds
  3. Confirmed by Foreman before builder allocation for the affected wave

**Register location**: `modules/pit/_readiness/pit-build-process-improvement-register.md`

---

### Stage 2 Carry-Forward Requirements (From MMM Lessons)

The following must be explicitly present in the PIT Stage 2 UX Workflow & Wiring Spec before Stage 3 FRS is approved:

1. **Authentication and onboarding routes**: All routes listed in L-004 must be wired.
2. **UI state definitions**: All 5 states (loading, empty, error/permission, network-error, data) must be specified for every primary page.
3. **Implementation page top indicators**: The Implementation page (primary project hierarchy view) must display at the top:
   - Project duration with progress indicator
   - Number of milestones
   - Number of deliverables
   - Number of tasks
   - Number of team members
   - Progress against plan percentage
   - Overall progress percentage
4. **App shell/navigation**: Navigation must be visible on all authenticated pages across all UI states.
5. **Deployment surface map**: A deployment surface map must be included in Stage 2 wiring to confirm all pages and routes are covered by the Deployment Wave plan.


## Optional Section A - High-Level Feature List

1. Portfolio dashboard.
2. Implementation hierarchy table.
3. Project creation workflow.
4. Visual project timeline creator.
5. Milestone management.
6. Deliverable management.
7. Task/action item management.
8. Task cluster templates.
9. Assignment/invitation workflow.
10. Evidence upload and review.
11. Progress roll-up.
12. Responsible-person workload view.
13. Company/department/person roll-up.
14. Timeline/Gantt page.
15. Reports and exports.
16. Permissions and overrides.
17. Audit log.
18. Notifications.
19. Watchdog.
20. QA dashboard.
21. AI assistant.
22. Cross-module integration.

---

## Optional Section B - User Personas

| Persona | Description |
|---|---|
| CS2 / Product Owner | Final authority; verifies product outcomes and approves scope/overrides |
| Executive Viewer | Needs high-level project, department, company, and risk-mitigation visibility |
| PIT Admin | Configures templates, users, permissions, settings, and system behaviour |
| Project Leader | Owns full project outcome and manages milestones, deliverables, task owners |
| Milestone Leader | Owns a milestone and manages deliverables/tasks below it |
| Deliverable Leader | Owns a deliverable and manages tasks below it |
| Task Owner | Executes task, updates progress, uploads evidence |
| Reviewer / Approver | Reviews evidence or override requests |
| Auditor / Assurance User | Reviews work, evidence, and audit trails |
| AI Assistant | Provides governed assistance through AIMC |

---

## Optional Section C - Key Use Cases

1. Create a project and visually set its timeline.
2. Add milestones within the project timeline.
3. Add deliverables under milestones.
4. Generate or manually create task clusters.
5. Link tasks to predecessor tasks and calculate start/end dates.
6. Assign tasks and obtain assignee acceptance.
7. Upload evidence for task completion.
8. Review evidence and close tasks.
9. Monitor project progress and overdue work.
10. Escalate timeline or scope changes for approval.
11. View a person's workload across projects.
12. View all overdue tasks across a department.
13. Generate a report for executives.
14. Run QA dashboard and inspect failures.
15. Receive tasks from MAT/Risk/WRAC and update source modules with progress.

---

## Optional Section D - Non-Functional Priorities

| Priority | Requirement |
|---|---|
| Security | No cross-tenant leakage; RLS enforced; API auth mandatory |
| Auditability | Every material action logged and exportable |
| Performance | Tables and timelines must scale to thousands of tasks |
| Usability | Complex project logic hidden behind clear workflows |
| Accessibility | Keyboard and screen-reader compatible; no colour-only indicators |
| Reliability | Watchdog detects silent failures and data anomalies |
| Maintainability | Architecture-QA-code alignment; no legacy drift |
| AI safety | AIMC-only, logged, human authority preserved |
| Deployment | Deployable, smoke-tested, rollback-ready |

---

## Optional Section E - Future Evolution Considerations

Future PIT versions may include:

- native mobile app,
- AI evidence scoring at scale,
- autonomous schedule optimisation,
- AI-driven workload balancing,
- HR/KPA/performance contract integration,
- skills crediting,
- predictive CAPEX/OPEX forecasting,
- live telemetry from Remote Assurance,
- cross-project critical path analysis,
- anonymised benchmarking under strict privacy rules,
- advanced AI watchdog auto-remediation with approval controls.

---

## Source Reconciliation Notes

1. The current `modules/pit/00-app-description/app-description.md` is a retrofit stub and uses the incorrect identity "Penetration Intelligence Tool".
2. The architecture in `modules/pit/04-architecture/architecture.md` correctly identifies PIT as "Project Implementation Tracker".
3. `Maturion/PIT/CANONICAL_MODULE_POINTER.md` confirms that canonical PIT artifacts belong under `modules/pit/`.
4. The App Description policy also expects a `docs/governance/{APP}_APP_DESCRIPTION.md` location; PIT resolves this by requiring a `docs/governance/PIT_APP_DESCRIPTION.md` mirror or pointer unless canon is updated.
5. Existing PIT architecture uses both legacy user-facing terms and newer technical terms. Stage 2 and Stage 3 must reconcile these terms explicitly.
6. The legacy build in `apps/pit/Legacy/` contains valuable requirements and QA philosophy, but it is not the governed production baseline.
7. Legacy QA dashboard notes show a useful UI direction, but final PIT QA must execute real tests and cannot remain simulated.
8. The user-provided requirement document is authoritative product-intent evidence for Stage 1 drafting and must be harvested into downstream UX/FRS artifacts.

---

## Approval Record

| Action | By | Date | Notes |
|---|---|---|---|
| Draft created | GPT-5.5 Pro / assistant | 2026-05-05 | Drafted from user-provided requirements, PIT architecture, Maturion/PIT True North, legacy build, and governance canon |
| Governance hardening pass | GPT-5.5 Pro / assistant | 2026-05-05 | Added 16 canon-readiness improvements identified during checklist review |
| Review completed | Pending | Pending | Pending CS2 review |
| Authoritative status granted | Pending Johan Ras | Pending | Required before Stage 2 proceeds |

---

## Pre-Approval Checklist Result

| Area | Draft Status | Notes |
|---|---|---|
| Status Header | Draft-ready | Uses exact `Draft` status and `Pending` approval date |
| Core App Description Sections | Draft-ready | Identity, scope, success criteria, strategic context present |
| AD-01 to AD-24 | Draft-ready for CS2 review | All sections present with governance gate language and evidence locations |
| Canonical Filing | Draft-ready with open follow-through | Requires `docs/governance/PIT_APP_DESCRIPTION.md` mirror or pointer |
| Build Authorization | Not cleared | Requires CS2 approval, Stage 2 onward, and all downstream gates |
| Next Stage | Stage 2 after approval | UX Workflow & Wiring Spec |

---

**End of PIT App Description**
