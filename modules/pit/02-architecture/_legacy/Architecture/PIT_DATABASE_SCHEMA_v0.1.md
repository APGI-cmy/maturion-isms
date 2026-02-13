PIT_DATABASE_SCHEMA_v0.1.md
Project Implementation Tracker
Database Schema Specification
Version 0.1
0. PURPOSE

This schema defines all database tables required for:

Organisation-level project tracking

Milestones → Deliverables → Tasks hierarchy

Evidence management

Timeline engine (SVG/Gantt)

Watchdog alert detection

QA test storage

PIT AI routing and evaluation

CAPEX/OPEX forecasting

Performance integration

Mobile task management

Notifications

Audit logs

This is the canonical data model. All Foreman QA checks will enforce strict compliance with this schema to avoid regressions, miswiring, and design drift.

1. NAMING CONVENTIONS

snake_case

Singular table names

All timestamps are TIMESTAMPTZ

Soft deletes use deleted_at

Foreign keys use *_id

Enums are implemented using Postgres ENUM types

2. ENUM DEFINITIONS
2.1 Task Status
task_status_enum:
  - not_started
  - upcoming
  - active
  - due_today
  - overdue
  - completed
  - blocked

2.2 Quick-Win Classification
quick_class_enum:
  - quick_win
  - medium_term
  - long_term

2.3 Project Type
project_type_enum:
  - project
  - operational_stream

2.4 Evidence Type
evidence_type_enum:
  - document
  - photo
  - video
  - other

2.5 Evidence Review Decision
review_decision_enum:
  - pending
  - accepted
  - rejected
  - needs_clarification

2.6 Notification Type
notification_type_enum:
  - email
  - push
  - internal_message

2.7 Alert Severity
alert_severity_enum:
  - green
  - yellow
  - red

2.8 AI Model Type
ai_model_enum:
  - gpt4o_mini
  - gpt4_1
  - gpt4o_large
  - evidence_model
  - scheduling_model

3. CORE TABLES

These represent the hierarchy:
Project → Milestone → Deliverable → Task

3.1 project
id                  PK
org_id              FK → organisation.id
division_id         FK → division.id (nullable)
name                TEXT
description         TEXT
type                project_type_enum
owner_id            FK → user.id
start_date          DATE
end_date            DATE
quick_class         quick_class_enum
progress_percent    INT (0–100)
capex_total         NUMERIC(12,2)
opex_total          NUMERIC(12,2)
status              TEXT (calculated)
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
deleted_at          TIMESTAMPTZ


Indexes:

(org_id)

(owner_id)

(status)

(start_date, end_date)

3.2 milestone
id                  PK
project_id          FK → project.id
name                TEXT
description         TEXT
owner_id            FK → user.id
start_date          DATE
end_date            DATE
progress_percent    INT
capex_total         NUMERIC(12,2)
opex_total          NUMERIC(12,2)
order_index         INT (for ordering)
created_at
updated_at
deleted_at


Indexes:

(project_id)

(start_date, end_date)

3.3 deliverable
id                  PK
milestone_id        FK → milestone.id
project_id          FK → project.id
name                TEXT
description         TEXT
owner_id            FK → user.id
start_date          DATE
end_date            DATE
progress_percent    INT
order_index         INT
created_at
updated_at
deleted_at


Indexes:

(milestone_id)

(project_id)

3.4 task

This is the core work unit.

id                  PK
deliverable_id      FK → deliverable.id
milestone_id        FK → milestone.id
project_id          FK → project.id
name                TEXT
description         TEXT
task_type           TEXT (simple | cluster_item)
cluster_id          FK → task_cluster.id (nullable)
owner_id            FK → user.id
assignees           JSONB (array of users)
status              task_status_enum
start_date          DATE
end_date            DATE
duration_days       INT
progress_percent    INT
quick_class         quick_class_enum
requires_evidence   BOOLEAN
capex_cost          NUMERIC(12,2)
opex_cost           NUMERIC(12,2)
fy_allocation       INT (financial year)
order_index         INT
created_at
updated_at
deleted_at


Indexes:

(project_id, status)

(owner_id)

(start_date)

(end_date)

GIST index on date ranges for timeline queries:

daterange(start_date, end_date)

4. TASK CLUSTER TABLES
4.1 task_cluster

Used when a template generates multiple tasks.

id                  PK
project_id          FK
name                TEXT
description         TEXT
created_by          FK → user.id
created_at
updated_at

4.2 task_cluster_template
id                  PK
name                TEXT
description         TEXT
template_json       JSONB (defines auto-generated tasks)
created_at
updated_at

5. EVIDENCE TABLES
5.1 evidence
id                  PK
task_id             FK → task.id
uploaded_by         FK → user.id
file_url            TEXT
file_type           evidence_type_enum
metadata            JSONB
created_at
updated_at
deleted_at

5.2 evidence_review
id                  PK
evidence_id         FK → evidence.id
reviewer_id         FK → user.id
decision            review_decision_enum
comment             TEXT
ai_score            INT
ai_feedback         TEXT
created_at
updated_at

6. TIMELINE TABLES

These are crucial for the SVG timeline engine.

6.1 timeline_cache

Stores precomputed positions for fast rendering.

id                  PK
project_id          FK
data                JSONB  (bars, x/y positions, zoom levels)
zoom_level          TEXT
created_at
updated_at

6.2 gantt_state

Stores last-used view state for each user.

id                  PK
user_id             FK
project_id          FK
zoom_level          TEXT
viewport_start      DATE
viewport_end        DATE
created_at
updated_at

7. WATCHDOG TABLES
7.1 watchdog_alert
id                  PK
project_id          FK
severity            alert_severity_enum
code                TEXT
message             TEXT
data                JSONB
detected_at         TIMESTAMPTZ
resolved_at         TIMESTAMPTZ

7.2 watchdog_scan_log
id                  PK
started_at
finished_at
projects_scanned    INT
issues_detected     INT
ai_summary          TEXT

8. QA TABLES
8.1 qa_result
id                  PK
project_id          FK
run_at              TIMESTAMPTZ
overall_status      TEXT
passed_tests        JSONB
failed_tests        JSONB
autofix_actions     JSONB
model_used          ai_model_enum

9. INTEGRATION TABLES
9.1 isms_link

Links PIT tasks to ISMS criteria.

id                  PK
task_id             FK
criteria_code       TEXT
criteria_version    TEXT
created_at

9.2 risk_link

Links PIT tasks to Risk Management treatment plans.

id                  PK
task_id
risk_id
created_at

9.3 skills_credit

Earned credits for completing PIT tasks.

id                  PK
task_id             FK
user_id             FK
credit_value        INT
created_at

10. USER & TEAM TABLES
10.1 user

Minimal excerpt; full schema is elsewhere.

id
name
email
role
org_id

10.2 team
id
name
org_id
manager_id

10.3 team_membership
id
team_id
user_id
role

11. NOTIFICATIONS
11.1 notification
id                  PK
user_id             FK
type                notification_type_enum
title               TEXT
message             TEXT
link                TEXT
is_read             BOOLEAN
created_at

12. AUDIT LOGS
12.1 audit_log
id                  PK
user_id             FK
action              TEXT
table_name          TEXT
record_id           TEXT
before_state        JSONB
after_state         JSONB
created_at

13. INDEXING STRATEGY
Mandatory indexes:

Tasks by project/date

Tasks by owner

Tasks by status

Milestones by project

Deliverables by milestone

Evidence by task

Watchdog alerts by severity

QA results by project

Optional for scaling:

Materialized views for timeline rollups

Partition tables by financial year

14. FOREMAN QA REQUIREMENTS

The Foreman must verify:

Every table exists

Every FK enforced

No nullable FKs except explicitly allowed

All enums defined

No snake-case violations

All timestamp fields present

No missing audit logging

No orphan tasks (task without deliverable)

No misaligned hierarchy (must always have → project → milestone → deliverable → task)

15. VERSIONING

This document is:

PIT_DATABASE_SCHEMA_v0.1

Next versions:

v0.2 — Add task recurrence + scheduling

v0.3 — AI predictive planning

v1.0 — After PIT MVP implementation

v2.0 — After integration with Risk, ISMS, and Skills Portal

SCHEMA COMPLETE

You now have:

True North Architecture

QA Spec

UI Wireframes

Edge Functions

Database Schema

This is a full backend blueprint ready for Foreman + Copilot once your GitHub access is restored.