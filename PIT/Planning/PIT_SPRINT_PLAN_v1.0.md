PIT_SPRINT_PLAN_v1.0.md

Project Implementation Tracker — Development Sprint Plan
Version 1.0
Aligned with: PIT_TRUE_NORTH_v1.0.md, PIT_DATABASE_SCHEMA_v1.1.md, PIT_EDGE_FUNCTIONS_v1.1.md, PIT_FRONTEND_COMPONENT_MAP_v1.1.md, PIT_WIREFRAMES_v1.1.md, PIT_QA_IMPLEMENTATION_PLAN_v1.1.md, PIT_EXPORT_SPEC_v1.0.md

0. PURPOSE

This sprint plan provides the full development roadmap for PIT v1.0 using a One-Time Build, Zero Regression, AI-First, Integration-Driven architecture.

Every sprint is self-contained, QA-aligned, and structured so that Co-Pilot Builders can execute under Foreman supervision without ambiguity.

This plan produces a fully functional PIT module, ready for beta deployment and ISMS-wide integration.

1. DELIVERY STRATEGY

PIT will be delivered in 6 sprints:

Sprint 1 → Foundation & Database
Sprint 2 → Backend Core (Edge Functions)
Sprint 3 → Frontend Core (Hierarchy, Tasks, Subtasks)
Sprint 4 → Advanced Engines (Dependencies, Scheduling, Watchdog)
Sprint 5 → Gantt, Evidence, Reporting, Exports
Sprint 6 → AI Engines, Optimisation & Full ISMS Integration


Each sprint contains:

Clear objectives

Deliverables

Success criteria

Dependencies

QA requirements

Regression rules

Risks & mitigations

2. SPRINT 1 — FOUNDATION & DATABASE

Duration: 1–1.5 weeks
Objective: Establish PIT’s foundations: DB schema, migrations, access control, core models.

2.1 Deliverables
1. Full Database Schema (v1.1)

Tables implemented:

pit_projects

pit_phases

pit_work_packages

pit_tasks

pit_subtasks

pit_dependencies

pit_progress_logs

pit_costs

pit_evidence

pit_notifications

pit_watchdog_alerts

pit_audit_log

pit_integrations

timeline_cache

2. Migration Scripts

Forward/backward migrations for every table.

3. RLS Implementation

Full row-level security with:

org_id isolation

role-based views

restricted update/delete paths

4. Schema Validators

Automated tests validating:

keys

constraints

indexes

data types

enums

2.2 Success Criteria

All tables created successfully

No orphan rows allowed

CRUD queries pass schema validation

RLS blocking unauthorized access

PIT app shell loads with project selector connected to DB

2.3 Risks & Mitigation

Risk: Schema complexity introduces migration errors.
Mitigation: Use schema validation tests from QA Plan.

Risk: RLS misconfiguration leaks data.
Mitigation: Automated RLS penetration tests.

3. SPRINT 2 — BACKEND CORE (EDGE FUNCTIONS)

Duration: 2 weeks
Objective: Implement the full backend layer exactly matching PIT_EDGE_FUNCTIONS_v1.1.md.

3.1 Deliverables
Core Edge Functions

project/create, update, delete

phase/create, update

work_package/create

task/create, update, delete

subtask CRUD

evidence upload endpoints

progress update

dependency CRUD

scheduling run engine

notifications

audit logging

Backend Infrastructure

Error code handling

Input validation

Side effect triggers

Integration hooks (stubs only)

Test Coverage

Full API test suite for:

Success cases

Failure cases

Authentication

Authorization

RLS enforcement

Data integrity

3.2 Success Criteria

All core APIs responsive and passing tests

API latency <150ms for standard queries

All endpoints enforce org-level RLS

Full audit logging functioning

3.3 Risks

Risk: Edge function chain-of-events misalignment.
Mitigation: Integration tests verifying side effects.

4. SPRINT 3 — FRONTEND CORE

Duration: 2–2.5 weeks
Objective: Implement frontend foundation + hierarchy views + task management.

4.1 Deliverables
1. PIT Shell

Top Nav

Side Navigation

Global Search

Notifications

AI Assistant button

2. Project Selector

List view

Project cards

Create project modal

3. Hierarchy Navigation

Tree view

Drag-and-drop ordering

Node context menus

4. Task Table

Virtualized table

Full filtering, sorting, grouping

Bulk actions

5. Task Detail Drawer

Details tab

Subtasks tab

Evidence tab (placeholder)

Progress log tab

Risk/control links

AI tab (placeholder)

4.2 Success Criteria

User can navigate full project tree

Tasks/Subtasks editable

0 UI blocking bugs

UX matches wireframes

Navigations <200ms response

5. SPRINT 4 — ADVANCED ENGINES

Duration: 2 weeks
Objective: Build the advanced PIT backbone: dependencies, scheduling, watchdog.

5.1 Deliverables
1. Dependency Builder

Graph view

Add/remove/validate dependencies

Conflict detection

2. Scheduling Engine

Critical path calculation

Date auto-adjustment

AI scheduling stubs

3. Watchdog Dashboard

Alert generation

Alert resolution

AI auto-fix suggestions

4. Progress Engine Enhancements

Real-time recalculation

Rollup logic

Risk mitigation callbacks

5.2 Success Criteria

Watchdog identifies overdue tasks

Scheduling engine produces valid date constraints

No circular dependencies allowed

Alerts properly logged

6. SPRINT 5 — GANTT, EXPORTS & EVIDENCE

Duration: 2–3 weeks
Objective: Build all heavy UI components: Gantt, Evidence, Clusters, Reporting.

6.1 Deliverables
1. Gantt Timeline

Zoom

Grouping

Critical path highlighting

Cached rendering

2. Evidence Module

Upload panel

Gallery view

Reviewer panel

Metadata extraction

3. Reporting UI

Report Dashboard

Export triggers

4. Export Implementations

All exports defined in PIT_EXPORT_SPEC_v1.0.md:

Project Summary PDF

Task List CSV

Excel Pack

Timeline PDF

JSON timeline

Evidence ZIP

Risk mitigation report

5. Clusters UI

Create, manage, generate clusters

6.2 Success Criteria

Gantt renders <300ms

Evidence uploads <5s for 20MB

Exports match spec exactly

Zero formatting errors

Cluster generation is stable

7. SPRINT 6 — AI ENGINES & FINAL INTEGRATION

Duration: 3+ weeks
Objective: Implement full AI pipeline + connect PIT to all upstream/downstream ISMS modules.

7.1 Deliverables
1. AI Task Generation

WRAC → PIT

RA → PIT

Bowtie → PIT

Incident → PIT

Audit → PIT

Remote Assurance → PIT

2. AI Scheduling Engine

Delay prediction

Optimal reschedule generator

3. AI Evidence Review

Scoring

Relevance detection

Risk/control mapping

4. Integration Endpoints

Update risk residuals

Update control effectiveness

Bowtie barrier updates

System availability risk mapping

5. AI Weekly Summary Generator

Bottlenecks

Risk trend

Forecasts

Escalations

7.2 Success Criteria

AI-generated tasks require <20% manual correction

Scheduling accuracy variance <15%

Evidence scoring consistent across tests

All integrations functional

Watchdog auto-fixes validated

8. RISKS & MITIGATION
8.1 High Complexity of Integrations

Mitigation: Build integration stubs during Sprint 2, connect later.

8.2 AI Instability

Mitigation: Use QA AI Stability Suite (defined in QA Plan).

8.3 Performance Under Load

Mitigation: Virtualized tables, Gantt caching.

8.4 Schema Drift

Mitigation: Schema validation tests on every push.

9. ACCEPTANCE CRITERIA (FINAL RELEASE)

PIT v1.0 is accepted when:

All sprints 1–6 deliverables are met

100% QA tests pass

No major defects remain

All ISMS modules integrate without errors

UI matches all wireframes

Exports match specifications exactly

AI engines pass stability tests

Watchdog operational with full auto-fix logic

Foreman signs off

✔ END OF PIT_SPRINT_PLAN_v1.0.md