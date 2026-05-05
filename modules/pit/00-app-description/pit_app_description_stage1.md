# PIT - Project Implementation Tracker - App Description

## Status Header

| Field | Value |
|---|---|
| Module | PIT |
| Application Name | Project Implementation Tracker |
| Module Slug | `pit` |
| Artifact Type | App Description - Stage 1 upstream authority |
| Version | v1.0-draft |
| Status | Draft - pending CS2/Johan approval |
| Owner | Johan Ras - Product Owner / Human Authority |
| Authority | CS2 / Johan Ras |
| Approval Date | N/A - Draft |
| Last Updated | 2026-05-05 |
| Module Filing Location | `modules/pit/00-app-description/app-description.md` |
| Policy Authority | `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` v2.0 |
| Pre-Build Authority | `governance/canon/PRE_BUILD_STAGE_MODEL_CANON.md` v1.0.0 |
| Supersedes | Existing PIT retrofit stub that incorrectly described PIT as "Penetration Intelligence Tool" |
| Source Inputs | User legacy requirement document; `modules/pit/04-architecture/`; `Maturion/PIT/`; `apps/pit/Legacy/`; Maturion True North |

---

## 0. Document Purpose

This document defines PIT - the Project Implementation Tracker - as the governed Stage 1 App Description for the PIT build project.

It establishes the authoritative product intent, scope, success criteria, build governance obligations, technology baseline, security expectations, audit obligations, QA obligations, and future evolution path from which the PIT UX Workflow & Wiring Spec, FRS, TRS, Architecture, QA-to-Red, PBFAG, Implementation Plan, Builder Checklist, IAA Pre-Brief, Builder Appointment, and Build must derive.

This document replaces the current retrofit stub and corrects the module identity from "Penetration Intelligence Tool" to "Project Implementation Tracker".

---

## 1. Application Identity

### 1.1 Application Name

PIT - Project Implementation Tracker.

### 1.2 Purpose Statement

PIT is the Maturion ISMS execution engine that turns risks, controls, audit findings, incidents, roadmap outputs, operational streams, and manually created initiatives into governed, scheduled, assigned, evidence-backed, auditable work.

### 1.3 Product Vision

PIT is not merely a task list. It is the execution nerve-centre of the Maturion ecosystem.

Where other modules identify, assess, quantify, recommend, or govern, PIT makes the work real by converting intentions into projects, milestones, deliverables, action items, tasks, responsibilities, evidence, progress, approvals, escalation, and measurable outcomes.

### 1.4 Target Users

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

### 1.5 Core Value Proposition

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

### 1.6 Product Terminology and Technical Mapping

PIT must preserve the user's preferred business terminology while allowing architecture and database design to use normalized technical names.

| User-facing term | Meaning | Technical architecture equivalent |
|---|---|---|
| Project | Formal initiative, programme, implementation plan, or operational stream | `project` |
| Milestone | High-level checkpoint or phase within a project | `phase` |
| Deliverable | Concrete output or work package feeding a milestone | `work_package` |
| Action Item | Action statement or task-heading requiring one measurable outcome and evidence requirement | `task` or `task_cluster` depending on whether it has child tasks |
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

- `modules/pit/` is the canonical module location.
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
2. Stage 2 UX Workflow & Wiring Spec derives from this document.
3. Stage 3 FRS derives from this document and the UX Workflow & Wiring Spec.
4. Stage 4 TRS derives from the FRS and resolves all technical constraints.
5. Stage 5 Architecture is updated to align with the approved upstream artifacts.
6. Stage 6 QA-to-Red is written before implementation.
7. Stage 7 PBFAG passes before builder allocation.
8. All build waves remain test-first and evidence-backed.
9. `modules/pit/BUILD_PROGRESS_TRACKER.md` is updated at every wave closure.
10. The incorrect "Penetration Intelligence Tool" label is removed from all PIT governance artifacts.

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
modules/pit/00-app-description/app-description.md
    -> modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md
    -> modules/pit/02-frs/functional-requirements.md
    -> modules/pit/03-trs/technical-requirements-specification.md
    -> modules/pit/04-architecture/architecture.md and sub-artifacts
    -> modules/pit/05-qa-to-red/qa-to-red-catalog.md
    -> modules/pit/06-pbfag/pbfag-checklist.md
    -> modules/pit/07-implementation-plan/implementation-plan.md
    -> modules/pit/08-builder-checklist/
    -> modules/pit/09-iaa-pre-brief/
    -> modules/pit/10-builder-appointment/
    -> modules/pit/11-build/
```

Each downstream artifact must contain a "Derived from" statement referencing the immediately upstream artifact and this App Description.

Existing architecture files in `modules/pit/04-architecture/` must be treated as valuable legacy/upstream evidence until back-traced and reconciled through the required chain.

---

## 7. Technology Stack - AD-03

The TRS is responsible for final version and deployment constraints. The App Description establishes the following upstream baseline.

| Layer | Baseline Technology / Pattern | Notes |
|---|---|---|
| Frontend | React + TypeScript, aligned to current Maturion ISMS frontend standards | Exact framework/build tooling confirmed in TRS |
| Styling / UI | Maturion UI kit, Tailwind-style utility system where aligned, accessible component patterns | Must match broader Maturion visual language |
| State Management | Server state via query/cache layer; UI state via approved lightweight store/context | Exact library confirmed in TRS |
| Database | Supabase PostgreSQL or approved PostgreSQL equivalent | Must support RLS and JSONB |
| Auth | Supabase Auth / JWT or approved Maturion auth standard | No mock auth in production |
| Edge/API | Supabase Edge Functions or approved ISMS serverless API layer | Registry required before PREHANDOVER |
| AI Integration | AIMC Gateway, PIT Advisor / `pit-advisor`, endpoint `/api/ai/request` | Direct provider calls prohibited |
| Evidence Storage | Supabase Storage or approved secure object storage | Signed access, metadata, hashes, RLS-aware records |
| Testing | Vitest/unit where appropriate, Playwright/E2E, schema/security/integration tests, GitHub Actions | QA-to-Red before implementation |
| QA Dashboard | In-app QA dashboard connected to real QA execution/report artifacts | Simulation-only QA is not acceptable for final handover |
| Notifications | Maturion toast/notification layer; email/internal/push/webhook as specified | `alert()` prohibited |
| Deployment | ISMS standard deployment target, confirmed in TRS and deployment wave | Runbook and smoke test required |

Any discrepancy between this baseline and TRS is a blocking defect until resolved.

---

## 8. Deliverable Artifacts - AD-04

"Is the deployable app a non-negotiable deliverable?" - YES.

Required deliverables:

- [ ] Deployable PIT application.
- [ ] App Description - this document.
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

QA Agent / Role: designated QA builder under Foreman supervision.

Expected pre-build state: RED tests exist and fail because implementation is not yet present or not yet aligned. Builders then build to GREEN.

---

## 11. Physical Verification Gate - AD-07

Every UI wave requires browser-based physical verification.

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

Screenshots or screen recordings must be filed before wave closure.

---

## 12. PBFAG Checklist Requirements - AD-08

PIT PBFAG must pass before builder allocation.

Minimum required checks:

1. App Description approved and complete.
2. UX Workflow & Wiring Spec approved, with all user journeys wired.
3. FRS approved with no TBDs.
4. TRS approved with technical constraints resolved.
5. Architecture updated and back-traced to upstream artifacts.
6. QA-to-Red complete and signed off.
7. Legacy build audit complete: useful requirements harvested; dead code not ported blindly.
8. Runtime/Deployment Contract filed.
9. Golden Path Verification Pack filed.
10. Auth wiring readiness confirmed.
11. Schema alignment confirmed.
12. RLS coverage confirmed.
13. Edge Function Registry drafted and aligned.
14. AIMC routing confirmed.
15. Timeline math/alignment design verified.
16. QA dashboard real-execution plan confirmed.
17. Build tracker current.
18. No build-blocking unknowns remain.

Any FAIL blocks build.

---

## 13. Agent Authority Chain - AD-09

| Role | Authority | PIT Gate Point |
|---|---|---|
| CS2 / Johan Ras | Final product, governance, and override authority | App Description approval, major scope changes, final handover |
| Foreman | Governs pre-build flow, allocates builders, validates gate readiness | Stages 2-11 |
| IAA | Independent assurance, pre-brief and assurance token controls | Stage 10 and applicable wave assurance |
| QA Agent | Writes/maintains QA-to-Red and reports failures | Stage 6 and every wave |
| Builder Agent | Implements approved wave scope only | Stage 12 after appointment |
| AIMC / PIT Advisor | Provides governed AI assistance through gateway | During planning, execution, analysis, evidence, watchdog |
| Product Owner / UI Reviewer | Verifies running product and user experience | Physical verification and final acceptance |

Builders may not modify governance artifacts unless explicitly authorised by the approved issue/scope.

---

## 14. Schema-to-Hook Validation - AD-10

Every PIT schema change must be validated column-by-column against consuming hooks, API calls, edge functions, UI components, tests, and reports.

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

No migration may merge without schema-to-hook validation.

---

## 15. Table Pathway Audit - AD-11

Any wave touching the database must file a Table Pathway Audit listing every table used by the wave and every `.from()` or equivalent query path.

The audit must confirm:

- migration exists,
- RLS exists,
- query/hook exists,
- tests exist,
- UI route or service usage exists where applicable,
- no orphan tables or unused columns are introduced.

---

## 16. RLS Audit Gate - AD-12

PIT must enforce organisation and assignment-based isolation.

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

Production deployment is blocked until RLS audit passes.

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

Every invocation must be authenticated, registered, tested, and audit-logged where mutating.

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

No module completion may be declared without deployment wave closure.

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

---

## 22. Deployment Runbook - AD-18

Deployment runbooks must be filed before the deployment wave closes.

Required runbooks:

- PIT application deployment runbook.
- PIT database migration runbook.
- PIT edge function deployment runbook.
- PIT storage/evidence runbook.
- PIT AIMC connectivity runbook.
- PIT rollback runbook.
- PIT smoke-test runbook.

Each runbook must include deployment, rollback, redeploy, health check, and environment-specific notes.

---

## 23. Notification / UX Patterns - AD-19

`alert()` is prohibited for user-facing notifications.

PIT must use the approved Maturion notification/toast pattern.

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

---

## 24. Shared State Architecture - AD-20

PIT must explicitly define state ownership.

Minimum state inventory:

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

Ambiguous global state is a blocking architecture defect.

---

## 25. API Authentication - AD-21

Every user/session-context PIT endpoint must require JWT or equivalent authenticated context.

Unauthenticated endpoints: none by default.

Possible exceptions such as invite acceptance links must use tokenized, time-limited, auditable access and must be explicitly listed in TRS.

PREHANDOVER proof must include API authentication audit.

---

## 26. Audit Log Design - AD-22

PIT audit logging is mandatory.

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

Logs must be append-only or tamper-evident according to TRS.

---

## 27. Tracker Update Requirement - AD-23

`modules/pit/BUILD_PROGRESS_TRACKER.md` must be updated at every wave closure.

Known tracker corrections required after this App Description is approved:

1. Correct module name from "Penetration Intelligence Tool" to "Project Implementation Tracker".
2. Mark Stage 1 according to CS2 approval status.
3. Record this document as the Stage 1 artifact.
4. Record the existing architecture as pre-stage evidence requiring reconciliation.
5. Add next action: Stage 2 UX Workflow & Wiring Spec.

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

---

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
11. View a person’s workload across projects.
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
4. Existing PIT architecture uses both legacy user-facing terms and newer technical terms. Stage 2 and Stage 3 must reconcile these terms explicitly.
5. The legacy build in `apps/pit/Legacy/` contains valuable requirements and QA philosophy, but it is not the governed production baseline.
6. Legacy QA dashboard notes show a useful UI direction, but final PIT QA must execute real tests and cannot remain simulated.
7. The user-provided requirement document is authoritative product-intent evidence for Stage 1 drafting and must be harvested into downstream UX/FRS artifacts.

---

## Approval Record

| Action | By | Date | Notes |
|---|---|---|---|
| Draft created | GPT-5.5 Pro / assistant | 2026-05-05 | Drafted from user-provided requirements, PIT architecture, Maturion/PIT True North, legacy build, and governance canon |
| Review completed | Pending | N/A | Pending CS2 review |
| Authoritative status granted | Pending Johan Ras | N/A | Required before Stage 2 proceeds |

---

**End of PIT App Description**
