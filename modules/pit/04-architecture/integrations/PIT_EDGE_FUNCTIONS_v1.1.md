PIT_EDGE_FUNCTIONS_v1.1.md

Project Implementation Tracker — Edge Function Specification
Version 1.1
Supersedes: PIT_EDGE_FUNCTIONS_v0.1.md
Aligned with: PIT_TRUE_NORTH_v1.0.md & PIT_DATABASE_SCHEMA_v1.1.md

0. PURPOSE

This document defines all backend APIs, edge functions, triggers, and processing logic required for PIT v1.1:

Project creation

Task/phase/work-package CRUD

Task clusters & templates

Evidence uploads

Progress and status updates

Dependencies & scheduling

Watchdog scanning

Notifications

Integrations

AI task generation & AI evaluation

No backend development may proceed without adhering strictly to this specification.

1. ARCHITECTURAL PRINCIPLES
1. One-Time Build

APIs must be future-proof, stable, and extensible.

2. Zero Regression

Any change requires QA test updates and changelog modifications.

3. AI-First

Edge functions should use the AI gateway where indicated.

4. Multi-Module Integration

Every PIT action must support risk, WRAC, controls, audit, incident, and RA integration.

5. RLS-Strict

All endpoints must enforce organisation-level visibility.

2. ENDPOINT SUMMARY

PIT’s edge functions are grouped into 11 domains:

1. Projects
2. Phases
3. Work Packages
4. Tasks
5. Subtasks
6. Task Clusters & Templates
7. Dependencies & Scheduling
8. Evidence
9. Progress Logs
10. Watchdog & QA
11. Integrations (Risk, WRAC, Controls, Audit, Incident, Skills)
12. Timeline Rendering
13. Notifications
14. AI Assistants (Task Generation, Planning, Scheduling, Evidence Review)


Each domain appears below with full endpoint definitions.

3. STANDARD ENDPOINT FORMAT

Each endpoint must specify:

Route:
Method:
Auth:
RLS:
Inputs:
Outputs:
Errors:
Side Effects:
Linked Modules:
Audit Logging:

4. PROJECT ENDPOINTS
4.1 Create Project

POST /pit/project/create

Auth: ProjectCreator | Admin
RLS: Must validate org_id of creator

Input:

{
  "name": "...",
  "code": "...",
  "description": "...",
  "type": "project|program|operational_stream",
  "owner_id": "...",
  "sponsor_id": "...",
  "quick_class": "...",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD"
}


Output:

{ "project_id": "uuid" }


Side Effects:

Create default phase “Initiation”

Create default work package “General”

Log project_created

4.2 Get Project

GET /pit/project/:project_id

Returns full project details with:

Phases

Work Packages

Tasks

Dependencies

Progress summary

Cost summary

4.3 Update Project

POST /pit/project/update

Side Effects:

Recalculate rollup %

Trigger risk mitigation recalculation

4.4 Soft Delete Project

POST /pit/project/delete

Note: Set deleted_at, do NOT hard delete.

5. PHASE ENDPOINTS
5.1 Create Phase

POST /pit/phase/create

Input:
Phase details + order_index.

Output:
phase_id

5.2 Update Phase

POST /pit/phase/update

Side Effects:

Recalculate project-level progress

Update critical path if needed

5.3 Delete Phase

POST /pit/phase/delete

Only allowed if phase contains no tasks.

6. WORK PACKAGE ENDPOINTS
6.1 Create Work Package

POST /pit/work_package/create

6.2 Update Work Package

POST /pit/work_package/update

6.3 Delete Work Package

POST /pit/work_package/delete

7. TASK ENDPOINTS

Tasks are the heart of PIT — must be robust, flexible, future-proof.

7.1 Create Task

POST /pit/task/create

Input:

{
  "project_id": "...",
  "phase_id": "...",
  "work_package_id": "...",
  "name": "...",
  "description": "...",
  "owner_id": "...",
  "assignees": ["..."],
  "priority": "low|normal|high|critical",
  "requires_evidence": true/false,
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "capex_cost": 0,
  "opex_cost": 0,
  "linked_risk_mitigation_pct": 0,
  "linked_control_set_id": "uuid",
  "source_module": "wrac|risk_assessment|incident|bowtie|audit|..."
}


Output:
task_id

Side Effects:

Insert entry into risk_link or control_link if provided

Trigger AI task refinement if configured

Trigger scheduling engine

Audit:
task_created

7.2 Update Task

POST /pit/task/update

Side Effects

Recalculate rollup progress

Update risk mitigation %

Trigger watchdog checks

7.3 Delete Task

POST /pit/task/delete

Only allowed if:

No subtasks

No evidence

Not part of a mandatory WRAC control plan

7.4 Assign Task

POST /pit/task/assign

Updates assignees.

7.5 Change Task Status

POST /pit/task/set_status

Allowed transitions:

not_started → active
active → completed
active → blocked
blocked → active
active → overdue (auto)
completed → reopened

8. SUBTASK ENDPOINTS (NEW)
8.1 Create Subtask

POST /pit/subtask/create

8.2 Update Subtask

POST /pit/subtask/update

8.3 Set Subtask Status

POST /pit/subtask/set_status

8.4 Delete Subtask

POST /pit/subtask/delete

9. TASK CLUSTERS & TEMPLATES

Taken from v0.1 (cluster model) and extended.

9.1 Generate Cluster from Template

POST /pit/cluster/generate

AI-assisted.
Used when WRAC control-set → PIT tasks.

9.2 Create Template

POST /pit/template/create

9.3 Get Template

GET /pit/template/:id

9.4 Update Template

POST /pit/template/update

9.5 Delete Template

POST /pit/template/delete

10. DEPENDENCY & SCHEDULING ENGINE ENDPOINTS
10.1 Create Dependency

POST /pit/dependency/create

Input:
Predecessor, successor, type, lag.

10.2 Remove Dependency

POST /pit/dependency/delete

10.3 Run Scheduling Engine

POST /pit/schedule/run

Uses:

Dependencies

Phase & task dates

AI scheduling model

Resource availability

Computes:

Critical path

Slack

Updated dates

Overlaps

Delay propagation

11. EVIDENCE ENDPOINTS

Matches v0.1, extended for subtask-level evidence.

11.1 Upload Evidence

POST /pit/evidence/upload

Uploads file, stores metadata, ties to task/subtask.

11.2 Review Evidence

POST /pit/evidence/review

Input: reviewer’s decision + comments.

AI evidence scoring is optional and can be toggled.

12. PROGRESS LOGS
12.1 Update Progress

POST /pit/task/progress/update

Input:

Task or subtask

New %

Optional comment

Optional evidence reference

Source (manual | ai_suggested | auto)

Side Effects:

Update project progress

Trigger risk mitigation recalculation

Trigger watchdog scoring

Append log entry

13. WATCHDOG ENGINE & QA
13.1 Run Watchdog Scan

POST /pit/watchdog/scan

Checks for:

Overdue tasks

Missing evidence

No updates over X days

Cost spikes

Risk mitigation mismatch

Critical controls unimplemented

13.2 Get Watchdog Alerts

GET /pit/watchdog/:project_id

Returns unresolved alerts.

13.3 Clear Alert

POST /pit/watchdog/resolve

14. INTEGRATION ENDPOINTS
14.1 Link Task to Risk

POST /pit/integration/link_risk

14.2 Link Task to Control

POST /pit/integration/link_control

14.3 Link Task to Incident

POST /pit/integration/link_incident

14.4 Link Task to Audit Finding

POST /pit/integration/link_audit

14.5 Add Skills Credit

POST /pit/integration/add_skill_credit

15. TIMELINE & GANTT ENDPOINTS
15.1 Get Timeline Data

GET /pit/timeline/:project_id

Uses:

timeline_cache

Bars, zoom, grouping

GIST queries on tasks

15.2 Refresh Timeline Cache

POST /pit/timeline/cache/refresh

16. NOTIFICATION ENDPOINTS
16.1 Send Notification

POST /pit/notify/send

Supports:

email

push

internal message

webhook (NEW)

16.2 Get Notifications

GET /pit/notify/list

17. AI ENGINE ENDPOINTS
17.1 AI Task Generation

POST /pit/ai/generate_tasks

Input sources:

WRAC control-set

Risk

Incident

Audit

Bowtie

Remote Assurance

Manual

Output:

Task list

Suggested subtasks

Dependencies

Durations

CAPEX/OPEX estimates

17.2 AI Scheduling

POST /pit/ai/schedule

Predicts:

Delays

Date shifts

Resource conflicts

Optimised schedule

17.3 AI Evidence Review

POST /pit/ai/review_evidence

Evaluates:

Authenticity

Completeness

Control effectiveness relevance

17.4 AI Weekly Summary

POST /pit/ai/weekly_summary

Generates:

Highlights

Risks

Bottlenecks

Recommended actions

Forecasts

18. RLS REQUIREMENTS

All edge functions must enforce:

Visibility restricted to org_id

No cross-organisational leakage

PIT Administrator override actions must be logged

19. AUDIT LOGGING

Every mutating endpoint logs to audit_log with:

before_state

after_state

performed_by

timestamp

20. ERROR HANDLING & CODES

Standard PIT error codes:

PIT001 – Permission denied
PIT002 – Invalid reference
PIT003 – Orphaned dependency
PIT004 – Cannot delete (children exist)
PIT005 – RLS violation
PIT006 – Invalid date range
PIT007 – AI generation failure
PIT008 – Evidence upload failed
PIT009 – Watchdog conflict
PIT010 – Export error

✔ END OF PIT_EDGE_FUNCTIONS_v1.1.md