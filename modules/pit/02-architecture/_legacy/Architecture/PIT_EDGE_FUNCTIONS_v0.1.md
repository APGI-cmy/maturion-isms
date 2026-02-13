PIT_EDGE_FUNCTIONS_v0.1.md
Project Implementation Tracker
Edge Function & Backend Architecture Specification
Version 0.1
0. PURPOSE OF THIS DOCUMENT

This document defines all backend logic for the PIT module.
It contains:

Edge functions

APIs

Webhooks

PIT automations

Database triggers

AI routing

Validation pipelines

QA integration

Watchdog logic

Model selection logic

PIT → ISMS → Risk → Skills → Evidence integration

This is the canonical backend architecture for PIT and is mandatory for all Foreman and Builder operations.

1. TECHNOLOGY STACK (BACKEND)

The PIT backend is implemented using:

Compute

Edge Functions (e.g., Vercel, Cloudflare Workers, AWS Lambda@Edge)

Optional background jobs queue (e.g., Upstash Redis Q, Supabase Queue, or custom)

Database

Postgres (primary)

Timescale or partitioned tables for timeline data (optional)

Storage

Object storage for evidence:

PDF, XML, DOCX, images, videos, zipped clusters of evidence

Signed URL upload/download

AI

OpenAI Routing Layer (multi-model, cost optimized)

GPT-4o mini / o3-mini for fast tasks

GPT-4.1 / GPT-o-large for reasoning

Sora/Video model (future)

Dedicated image/video models for rendering previews

Identity

JWT session tokens

RBAC with org/project/role scoping

Access filters for:

Org Admin

Division Owner

Project Manager

Milestone Owner

Deliverable Owner

Task Owner

Evidence Manager

External Auditor

2. MODULE OVERVIEW

PIT requires the following backend domains:

Projects

Milestones

Deliverables

Tasks

Evidence

Timeline Engine

Filters/Search

Alerts & Watchdog

QA execution

AI assistants

Templates (task clusters, project creation templates)

User profiles (for performance KPIs integration)

CAPEX/OPEX calculation engine

Calendar & capacity planner

Notifications (email, mobile, internal messaging)

Integration with:

Risk Management

Maturity Roadmap (Evidence → Criteria)

Incident & Investigation (task hand-off)

Skills Development Portal (task learner credits)

Analytics & Assurance (threat detection via PIT anomalies)

3. PIT EDGE FUNCTIONS — MASTER LIST

These are the absolute canonical backend functions.

3.1 PROJECT FUNCTIONS
EF_PIT_CREATE_PROJECT

Creates a new PIT project.

Inputs:

name, description, orgId, divisionId, ownerId, startDate, endDate, type, quickWinClassification


Outputs:

projectId


Side effects:

Add to org timeline

Generate default dashboard cards

Trigger project-level QA scan (initial)

Notify owner

EF_PIT_UPDATE_PROJECT

Updates project metadata including dates.

Triggers:

Recalculate all child durations

QA: PIT.TIME.1, PIT.STRUCTURE.2

EF_PIT_ARCHIVE_PROJECT

Soft delete (never hard delete).

3.2 MILESTONE FUNCTIONS
EF_PIT_CREATE_MILESTONE

Creates milestone under a project.

Auto-validations:

Start >= project.start

End <= project.end

Triggers:

Recalculate timeline

QA

EF_PIT_UPDATE_MILESTONE

Self-explanatory.

EF_PIT_DELETE_MILESTONE

Allowed only if milestone has:

No deliverables
OR

User uses “cascade delete” (with audit trail)

3.3 DELIVERABLE FUNCTIONS
EF_PIT_CREATE_DELIVERABLE

Inputs:

projectId, milestoneId, name, ownerId, description


Triggers:

QA structural update

Timeline recalculation

3.4 TASK FUNCTIONS (CORE OF PIT)
EF_PIT_CREATE_TASK

Validations needed:

Task must fit inside deliverable and milestone date range

If task cluster used → auto-generate tasks

Triggers:

Update project counters

Watchdog risk scoring

CAPEX/OPEX update

QA

EF_PIT_UPDATE_TASK

Fields:

name, description, owner, startDate, endDate, progress, status,
quickWinClass, capex, opex


Validations:

Status auto-updates based on dates unless overridden by manager

Evidence required → flag incomplete if progress=100 but no evidence

Triggers:

AI evaluation (“task health”)

Timeline update

Watchdog anomaly detection

EF_PIT_DELETE_TASK

Soft delete.

EF_PIT_TASK_HIERARCHY_RECALC

Used after cluster creation, or date changes.

3.5 EVIDENCE FUNCTIONS
EF_PIT_UPLOAD_EVIDENCE

Signed URL creation → file upload → metadata save.

EF_PIT_AI_EVALUATE_EVIDENCE

Uses AI to evaluate completeness.

Outputs:

criteriaMet (0-100%)
missingItems[]
riskScore
recommendedFixes[]

EF_PIT_DELETE_EVIDENCE
EF_PIT_ASSIGN_EVIDENCE_MANAGER
3.6 TIMELINE & GANTT FUNCTIONS (SVG ENGINE)
EF_PIT_TIMELINE_GET_DATA

Returns:

All bars

Hierarchy structure

Precomputed X,Y coordinates

Colors

Status

Zoom presets

Quick-win overlays

CAPEX/OPEX overlays

EF_PIT_TIMELINE_GENERATE_SVG

Server-side render for mobile previews.

EF_PIT_TIMELINE_APPLY_DRAG

When user drags a bar → update task/deliverable/milestone.

Validations:

Cannot violate parent dates

Suggestion system triggered if violation

3.7 WATCHDOG FUNCTIONS
EF_PIT_WATCHDOG_SCAN

Runs automatically every:

1 hour

or on-demand

Detects:

Overdue > X days

CAPEX/OPEX spikes

Unbalanced workloads

Inactive managers

Missing evidence

AI risk patterns (e.g., many short tasks, repeated delays)

EF_PIT_WATCHDOG_REPORT

Returns anomaly list.

EF_PIT_WATCHDOG_EXPLAIN

AI explanation using higher-tier model.

3.8 QA FUNCTIONS
EF_PIT_RUN_QA

Executes QA suite:

Categories:

PIT.STRUCTURE

PIT.TIME

PIT.PROGRESS

PIT.EVIDENCE

PIT.ROLES

PIT.MODEL_ROUTING

Returns:

overallStatus
passedTests[]
failedTests[]
autoFixSuggestions[]

EF_PIT_QA_AUTOFIX

Automatically applies safe fixes.

3.9 AI ROUTING FUNCTIONS
EF_PIT_AI_ROUTER

Selects correct AI model for:

Task	Model
Quick triage	GPT-4o mini
Reasoning: schedule alignment	GPT-4.1
Evidence analysis	GPT-4.1
Predictive risk scoring	GPT-o-large or similar
Timeline explanation	GPT-4.1
Workload/delay prediction	GPT-4.1 w/ custom embeddings
3.10 CAPEX/OPEX ENGINE FUNCTIONS
EF_PIT_CALCULATE_COSTS

Rolls up task cost → deliverable → milestone → project → org.

EF_PIT_FORECAST_COSTS

Predicts future year budgets based on:

Planned tasks

Quick-win/Mid/Long-term classification

Risk data from other modules

Historical patterns

3.11 USER & TEAM FUNCTIONS
EF_PIT_GET_MY_TASKS

Kanban.

EF_PIT_GET_TEAM_TASKS
EF_PIT_DELEGATE_TASK
3.12 NOTIFICATION FUNCTIONS
EF_PIT_SEND_EMAIL
EF_PIT_SEND_MOBILE_PUSH
EF_PIT_SEND_INTERNAL_MESSAGE
EF_PIT_NOTIFY_MANAGER_OF_ESCALATION
4. INTEGRATIONS WITH OTHER MODULES
ISMS → PIT

Approved criteria generate PIT tasks automatically.

Risk Management → PIT

Risk treatment plans create tasks/deliverables.

Skills Portal → PIT

Completing PIT tasks earns learner credits.

Incident & Intelligence → PIT

Investigations spawn PIT action items.

Remote Assurance → PIT

Anomalies → corrective action tasks.

5. SECURITY REQUIREMENTS

Edge functions must enforce:

JWT + RBAC

Org scoping

Access validation

Input sanitization

Evidence files virus scan

Rate limiting

Audit logging for all data writes

No cross-org data leakage

6. FOREMAN QA REQUIREMENTS

Foreman must ensure:

Every edge function has a unit test

Full integration test suite

No missing functions

No incorrect naming

No ad-hoc endpoints

All logic matches this blueprint exactly

No legacy endpoints allowed

Every new function must:

Follow naming

Follow routing

Include logging

Include permission checks

Include PIT QA tags

7. FUTURE EXPANSION HOOKS

Predictive AI scheduling (like Asana or ClickUp AI)

Full capacity planning module

Headless mobile PIT rendering

PIT → SCORM linkup for training evidence

Time-tracking integration

AI auto-generate tasks from meetings/audio

PIT templates marketplace

PIT smart clustering engine

8. VERSIONING

This file is:

PIT_EDGE_FUNCTIONS_v0.1

Next versions:

v0.2 after Foreman review

v1.0 after PIT MVP build

v1.5 after Evidence AI integration

v2.0 after Analytics/Assurance integration