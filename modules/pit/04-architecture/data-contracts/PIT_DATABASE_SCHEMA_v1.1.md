PIT_DATABASE_SCHEMA_v1.1.md

Project Implementation Tracker – Database Schema Specification
Version 1.1

Supersedes: PIT_DATABASE_SCHEMA_v0.1.md 

PIT_DATABASE_SCHEMA_v0.1


Aligned with: PIT_TRUE_NORTH_v1.0.md

0. PURPOSE

This schema defines all database structures required for the Project Implementation Tracker (PIT) in its v1.0+ architecture:

Organisation-level project / programme tracking

Unified hierarchy: Project → Phase → Work Package → Task → Subtask

Evidence & audit trails

Timeline (Gantt / milestone) rendering

Watchdog & QA

AI task generation, scheduling and evaluation

CAPEX / OPEX tracking and ROI linkage

Integration with Risk, WRAC, Bowtie, Incident, Audit, Remote Assurance, Skills

This v1.1 schema:

Is backwards compatible in spirit with v0.1 (project/milestone/deliverable/task) 

PIT_DATABASE_SCHEMA_v0.1

But updates naming and adds new tables to align with the new PIT True North (phases, subtasks, deeper integrations).

Is the canonical reference for Foreman QA and Builder implementation.

1. NAMING CONVENTIONS

snake_case for all table and column names

Singular table names (e.g. project, phase, task)

Primary key: id UUID PRIMARY KEY (unless otherwise agreed)

Foreign keys: <entity>_id

All timestamps: TIMESTAMPTZ

Soft deletes: deleted_at TIMESTAMPTZ NULL

Enums via PostgreSQL ENUM types

Monetary fields as NUMERIC(12,2)

Booleans default to FALSE

2. ENUM DEFINITIONS

All enums are global to the PIT schema.

2.1 Task Status

task_status_enum:

not_started

upcoming

active

due_today

overdue

completed

blocked

(unchanged from v0.1) 

PIT_DATABASE_SCHEMA_v0.1

2.2 Quick-Win Classification

quick_class_enum:

quick_win

medium_term

long_term

(unchanged) 

PIT_DATABASE_SCHEMA_v0.1

2.3 Project Type

project_type_enum:

project

operational_stream

program (NEW – for grouping related projects)

(v0.1 had first two only) 

PIT_DATABASE_SCHEMA_v0.1

2.4 Evidence Type

evidence_type_enum:

document

photo

video

log_export

other

(extends v0.1 with log_export) 

PIT_DATABASE_SCHEMA_v0.1

2.5 Evidence Review Decision

review_decision_enum:

pending

accepted

rejected

needs_clarification

(unchanged) 

PIT_DATABASE_SCHEMA_v0.1

2.6 Notification Type

notification_type_enum:

email

push

internal_message

webhook (NEW – for outbound integration)

2.7 Alert Severity

alert_severity_enum:

green

yellow

red

(unchanged) 

PIT_DATABASE_SCHEMA_v0.1

2.8 AI Model Type

ai_model_enum:

gpt4o_mini

gpt4_1

gpt4o_large

evidence_model

scheduling_model

risk_mitigation_model (NEW)

2.9 Task Priority

task_priority_enum (NEW):

low

normal

high

critical

2.10 Integration Source Module

pit_source_module_enum (NEW):

risk_assessment

wrac

bowtie

incident

audit

remote_assurance

data_analytics

skills

manual

2.11 Dependency Type

dependency_type_enum (NEW):

finish_to_start

start_to_start

finish_to_finish

start_to_finish

3. CORE HIERARCHY TABLES

v0.1: project → milestone → deliverable → task 

PIT_DATABASE_SCHEMA_v0.1


v1.1: project → phase → work_package → task → subtask

We strongly recommend implementing with the new names. If you must keep old names physically, maintain a mapping in the implementation guide.

3.1 project

Represents a PIT project / stream / programme.

id – PK (UUID)

org_id – FK → organisation.id

division_id – FK → division.id (nullable)

name – TEXT

code – TEXT (optional short code, e.g. “PIT-2025-001”)

description – TEXT

type – project_type_enum

owner_id – FK → user.id

sponsor_id – FK → user.id (nullable)

start_date – DATE

end_date – DATE

quick_class – quick_class_enum

progress_percent – INT (0–100)

capex_total – NUMERIC(12,2)

opex_total – NUMERIC(12,2)

status – TEXT or future project_status_enum (calculated by logic; stored for performance)

risk_impact_score – NUMERIC(10,2) (aggregated from linked risks)

risk_mitigation_percent – NUMERIC(5,2) (0–100, input to RA/WRAC feedback)

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

deleted_at – TIMESTAMPTZ NULL

Indexes:

(org_id)

(owner_id)

(status)

(start_date, end_date)

(based on v0.1 project design) 

PIT_DATABASE_SCHEMA_v0.1

3.2 phase

Replaces / generalises milestone from v0.1.

id – PK

project_id – FK → project.id

name – TEXT

description – TEXT

owner_id – FK → user.id

start_date – DATE

end_date – DATE

progress_percent – INT

capex_total – NUMERIC(12,2)

opex_total – NUMERIC(12,2)

order_index – INT

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

deleted_at – TIMESTAMPTZ NULL

Indexes:

(project_id)

(start_date, end_date)

(based on milestone v0.1) 

PIT_DATABASE_SCHEMA_v0.1

3.3 work_package

Generalises deliverable from v0.1; can represent logical workstreams.

id – PK

phase_id – FK → phase.id

project_id – FK → project.id

name – TEXT

description – TEXT

owner_id – FK → user.id

start_date – DATE

end_date – DATE

progress_percent – INT

capex_total – NUMERIC(12,2)

opex_total – NUMERIC(12,2)

order_index – INT

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

deleted_at – TIMESTAMPTZ NULL

Indexes:

(phase_id)

(project_id)

(based on deliverable v0.1) 

PIT_DATABASE_SCHEMA_v0.1

3.4 task

Core work unit; extended for PIT v1.0 True North.

id – PK

work_package_id – FK → work_package.id (nullable if only phase-level)

phase_id – FK → phase.id

project_id – FK → project.id

name – TEXT

description – TEXT

task_type – TEXT (simple | cluster_item | milestone_marker etc.)

cluster_id – FK → task_cluster.id (nullable)

owner_id – FK → user.id

assignees – JSONB (array of user IDs; matches v0.1) 

PIT_DATABASE_SCHEMA_v0.1

priority – task_priority_enum

status – task_status_enum

start_date – DATE

end_date – DATE

duration_days – INT

progress_percent – INT

quick_class – quick_class_enum

requires_evidence – BOOLEAN

capex_cost – NUMERIC(12,2)

opex_cost – NUMERIC(12,2)

fy_allocation – INT (financial year)

linked_risk_mitigation_pct – NUMERIC(5,2) (expected mitigation once complete)

linked_control_set_id – UUID (links to control bundles from WRAC / Control Library)

source_module – pit_source_module_enum

source_reference_id – UUID or TEXT (e.g. risk_id, incident_id)

order_index – INT

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

deleted_at – TIMESTAMPTZ NULL

Indexes:

(project_id, status)

(owner_id)

(start_date)

(end_date)

GIST index on daterange(start_date, end_date) for timeline queries (as in v0.1) 

PIT_DATABASE_SCHEMA_v0.1

3.5 subtask (NEW)

Finer-grained steps under a task; key for CCR-style tracking and granular progress.

id – PK

task_id – FK → task.id

name – TEXT

description – TEXT

owner_id – FK → user.id (nullable; otherwise inherits from task)

status – task_status_enum

priority – task_priority_enum

start_date – DATE (nullable)

end_date – DATE (nullable)

progress_percent – INT

requires_evidence – BOOLEAN

ordered_index – INT

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

deleted_at – TIMESTAMPTZ NULL

Indexes:

(task_id)

(status)

4. TASK CLUSTER TABLES (TEMPLATES & BATCHES)

(From v0.1, extended) 

PIT_DATABASE_SCHEMA_v0.1

4.1 task_cluster

Groups tasks that were generated together from templates (e.g. WRAC control set → many PIT tasks).

id – PK

project_id – FK → project.id

name – TEXT

description – TEXT

created_by – FK → user.id

source_module – pit_source_module_enum

source_reference_id – UUID or TEXT

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

4.2 task_cluster_template

Reusable blueprints for tasks.

id – PK

name – TEXT

description – TEXT

template_json – JSONB (defines auto-generated tasks, phases, work packages)

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

5. DEPENDENCY TABLES (NEW)

To support critical path, slack, and advanced scheduling.

5.1 task_dependency

id – PK

project_id – FK → project.id

predecessor_task_id – FK → task.id

successor_task_id – FK → task.id

dependency_type – dependency_type_enum

lag_days – INT (positive/negative allowed)

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

Indexes:

(project_id)

(predecessor_task_id)

(successor_task_id)

6. EVIDENCE TABLES

From v0.1, with minor extensions for remote assurance and telemetry. 

PIT_DATABASE_SCHEMA_v0.1

6.1 evidence

id – PK

task_id – FK → task.id (nullable if attached to subtask)

subtask_id – FK → subtask.id (nullable)

uploaded_by – FK → user.id

file_url – TEXT

file_type – evidence_type_enum

metadata – JSONB (source system, hashes, signatures, etc.)

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

deleted_at – TIMESTAMPTZ NULL

6.2 evidence_review

id – PK

evidence_id – FK → evidence.id

reviewer_id – FK → user.id

decision – review_decision_enum

comment – TEXT

ai_score – INT

ai_feedback – TEXT

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

7. PROGRESS & LOGGING TABLES (NEW)
7.1 task_progress_log

Captures time-stamped progress events.

id – PK

task_id – FK → task.id

subtask_id – FK → subtask.id (nullable)

user_id – FK → user.id

old_progress_percent – INT

new_progress_percent – INT

old_status – task_status_enum

new_status – task_status_enum

comment – TEXT

source – TEXT (manual, ai_suggested, auto_from_evidence, import)

created_at – TIMESTAMPTZ

7.2 cost_snapshot (optional but recommended)

For CAPEX/OPEX trajectory analysis.

id – PK

project_id – FK → project.id

captured_at – TIMESTAMPTZ

capex_committed – NUMERIC(12,2)

capex_spent – NUMERIC(12,2)

opex_committed – NUMERIC(12,2)

opex_spent – NUMERIC(12,2)

ai_forecast_json – JSONB

8. TIMELINE TABLES

As per v0.1, retained and extended for multi-level timeline caching. 

PIT_DATABASE_SCHEMA_v0.1

8.1 timeline_cache

Precomputed positions for fast rendering (Gantt bars, zoom levels).

id – PK

project_id – FK → project.id

data – JSONB (bars, x/y positions, zoom levels, row ordering)

zoom_level – TEXT

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

8.2 gantt_state

Last-used view state per user.

id – PK

user_id – FK → user.id

project_id – FK → project.id

zoom_level – TEXT

viewport_start – DATE

viewport_end – DATE

grouping_mode – TEXT (by_phase, by_work_package, by_assignee, etc.)

created_at – TIMESTAMPTZ

updated_at – TIMESTAMPTZ

9. WATCHDOG TABLES

From v0.1, still central to PIT. 

PIT_DATABASE_SCHEMA_v0.1

9.1 watchdog_alert

id – PK

project_id – FK → project.id

severity – alert_severity_enum

code – TEXT (e.g. overdue_cluster, cost_spike, risk_not_mitigating)

message – TEXT

data – JSONB (task IDs, metrics, debug info)

detected_at – TIMESTAMPTZ

resolved_at – TIMESTAMPTZ NULL

9.2 watchdog_scan_log

id – PK

started_at – TIMESTAMPTZ

finished_at – TIMESTAMPTZ

projects_scanned – INT

issues_detected – INT

ai_summary – TEXT

10. QA TABLES

From v0.1, dedicated to PIT QA system. 

PIT_DATABASE_SCHEMA_v0.1

10.1 qa_result

id – PK

project_id – FK → project.id

run_at – TIMESTAMPTZ

overall_status – TEXT (green, amber, red)

passed_tests – JSONB

failed_tests – JSONB

autofix_actions – JSONB

model_used – ai_model_enum

11. INTEGRATION TABLES

v0.1 already defined integration tables, now extended. 

PIT_DATABASE_SCHEMA_v0.1

11.1 isms_link

Links PIT tasks to ISMS criteria / clauses.

id – PK

task_id – FK → task.id

criteria_code – TEXT (e.g. ISO27001-A.8.2.1)

criteria_version – TEXT

created_at – TIMESTAMPTZ

11.2 risk_link

Links PIT tasks to Risk Management / WRAC / Bowtie items.

id – PK

task_id – FK → task.id

risk_id – UUID (Risk Assessment id / WRAC id / PUE id)

link_type – TEXT (inherent, residual, projected, control_set)

created_at – TIMESTAMPTZ

11.3 control_link (NEW)

Connects tasks to specific controls or control sets from CONTROL_LIBRARY. 

CONTROL_LIBRARY_v0.1

id – PK

task_id – FK → task.id

control_id – UUID (from global control library)

control_group – TEXT (optional grouping: camera_surveillance, alarm_systems)

created_at – TIMESTAMPTZ

11.4 incident_link (NEW)

id – PK

task_id – FK → task.id

incident_id – UUID

created_at – TIMESTAMPTZ

11.5 audit_link (NEW)

id – PK

task_id – FK → task.id

audit_finding_id – UUID

created_at – TIMESTAMPTZ

11.6 skills_credit

From v0.1; links PIT tasks to Skills Portal credit. 

PIT_DATABASE_SCHEMA_v0.1

id – PK

task_id – FK → task.id

user_id – FK → user.id

credit_value – INT

created_at – TIMESTAMPTZ

12. USER, TEAM & NOTIFICATIONS

User and team tables are typically central to the platform; PIT references them.

12.1 user (excerpt)

id – PK

name – TEXT

email – TEXT

role – TEXT

org_id – FK → organisation.id

(as per v0.1 note) 

PIT_DATABASE_SCHEMA_v0.1

12.2 team

id – PK

name – TEXT

org_id – FK

manager_id – FK → user.id

12.3 team_membership

id – PK

team_id – FK → team.id

user_id – FK → user.id

role – TEXT

12.4 notification

From v0.1, extended with webhook support. 

PIT_DATABASE_SCHEMA_v0.1

id – PK

user_id – FK → user.id

type – notification_type_enum

title – TEXT

message – TEXT

link – TEXT

is_read – BOOLEAN

created_at – TIMESTAMPTZ

13. AUDIT LOGS

From v0.1. 

PIT_DATABASE_SCHEMA_v0.1

13.1 audit_log

id – PK

user_id – FK → user.id

action – TEXT

table_name – TEXT

record_id – TEXT

before_state – JSONB

after_state – JSONB

created_at – TIMESTAMPTZ

14. INDEXING STRATEGY

Mandatory indexes (minimum):

task(project_id, status)

task(owner_id)

task(start_date)

task(end_date)

task(daterange(start_date, end_date)) (GIST)

phase(project_id)

work_package(phase_id)

evidence(task_id)

watchdog_alert(project_id, severity)

qa_result(project_id)

Optional for scale:

Materialized views for:

Project progress rollups

Risk mitigation % by project

CAPEX/OPEX per FY

Partition task and task_progress_log by financial year. 

PIT_DATABASE_SCHEMA_v0.1

15. RLS & SECURITY (SUMMARY)

Final RLS policies will be detailed in the edge functions and implementation guide, but schema must support:

Every row scoped by org_id or indirectly by project.org_id.

No cross-org visibility.

Task visibility controlled by:

Membership in project’s organisation/division

Role (project owner / team member / viewer)

Special Foreman/Admin overrides (audited)

16. FOREMAN QA REQUIREMENTS FOR SCHEMA

The Foreman must verify that:

Every table listed here exists in the DB.

All FKs are declared and enforced.

All timestamp columns exist and are used consistently.

Enums are created with the exact values specified.

No snake_case violations.

No nullable FKs except where explicitly allowed.

No orphan phase, work_package, task, or subtask.

Audit logging is enabled for all mutating PIT operations.

All PIT data is RLS-protected at the org level.

17. VERSIONING

This document is:

PIT_DATABASE_SCHEMA_v1.1

v0.1 – Original PIT schema (pre–True North refactor) 

PIT_DATABASE_SCHEMA_v0.1

v1.1 – First schema aligned with PIT_TRUE_NORTH_v1.0

v1.2 – Reserved (after real-world implementation feedback)

v2.0 – Reserved (after deep integration with Skills, Incident, Bowtie, full CCR engine)

Schema Complete.
This blueprint is now ready for Foreman + Co-Pilot builder implementation.