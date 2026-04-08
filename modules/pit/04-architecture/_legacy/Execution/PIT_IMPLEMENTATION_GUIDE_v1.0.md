Below is the full PIT_IMPLEMENTATION_GUIDE_v1.0.md, written to the same master standard as the WRAC, Course Crafter, and all prior PIT deliverables.
This document is your foreman-level execution guide — the operational manual that instructs Co-Pilot builders exactly how to build, deploy, verify, and maintain PIT v1.0 with:

Zero Regression

One-Time Build discipline

ISMS-wide integration compliance

Full modular traceability

AI-first, automation-driven workflows

Place in:

/Modules/PIT/Execution/PIT_IMPLEMENTATION_GUIDE_v1.0.md

PIT_IMPLEMENTATION_GUIDE_v1.0.md

Project Implementation Tracker — Implementation Guide
Version 1.0
Aligned with: All PIT v1.1 architecture documents
Audience: Foreman, Builders, Integration Engineers, QA Analysts
Stage: Ready for immediate implementation

0. PURPOSE

This guide describes exactly how PIT v1.0 must be built, integrated, and deployed into the Maturion ISMS ecosystem. It governs:

Setup & environment preparation

Backend & schemas

Frontend installation

AI model routing

Integrations with other modules

QA & regression enforcement

Deployment workflow

Governance & sign-off

No deviation is permitted without updating this guide and the PIT_CHANGELOG.

1. IMPLEMENTATION PRINCIPLES (NON-NEGOTIABLE)
1. One-Time Build

PIT must be built correctly the first time.
No patchwork, no "fix later", no shortcuts.

2. Zero Regression

Once a component passes QA, it may never break again.
All changes must update:

Tests

Migrations

Documentation

Changelog

3. Interoperability

PIT must work with every ISMS module:

WRAC

Risk Assessment

Controls

Bowtie

Incident & Intelligence

Audit

Remote Assurance

Data Analytics

Skills Portal (future)

4. RLS & Security First

Tenant isolation is absolute and immutable.

5. AI-First

AI automation is native, not an add-on.

6. Predictability

The system must behave consistently across:

Environments

Users

Data loads

Versions

2. IMPLEMENTATION ROADMAP

PIT development proceeds in phases:

1. Environment Setup
2. Database Deployment (Schema v1.1)
3. Backend (Edge Functions)
4. Frontend Components
5. Gantt & Timeline
6. Evidence Pipeline
7. Watchdog Engine
8. AI Agents
9. Module Integrations
10. Export Infrastructure
11. QA & Regression Lockdown
12. Deployment & Sign-off


Each step below describes:

What to do

How to do it

Expected outputs

Risks

Validation tests

3. ENVIRONMENT SETUP
3.1 Repository Structure

Create:

/ISMS
   /PIT
      /architecture
      /schema
      /backend
      /frontend
      /AI
      /exports
      /QA
      /tests
      /deployment

3.2 Install Dependencies
Backend:

supabase-js

zod

node 18+

typescript

openai client (for AI tasks)

Frontend:

React + Vite / Next.js

Tailwind CSS

Lucide icons

Zustand (for state)

TanStack tables

D3 or Recharts (timeline)

3.3 AI Dependencies

For now:

OpenAI GPT-4.1 / GPT-4.1-mini

Whisper for audio (optional)

Embedding model for task similarity

Future-ready for:

Local inference

Model routing layer

4. DATABASE IMPLEMENTATION
4.1 Create all tables per schema v1.1

Apply in order:

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

pit_integrations

pit_audit_log

timeline_cache

4.2 Apply RLS policies

Enforce:

org_id check

role-based permissions

restricted updates

4.3 Install DB Tests

Run:

npm run test:schema


Must pass:

PK/FK integrity

Enum constraints

No orphan rows

Rollup constraints

5. BACKEND IMPLEMENTATION

Backend is implemented exactly as described in PIT_EDGE_FUNCTIONS_v1.1.md.

5.1 Create Edge Functions:
createProject
getProject
updateProject
deleteProject
createPhase
updatePhase
deletePhase
createWorkPackage
updateWorkPackage
createTask
updateTask
deleteTask
assignTask
setTaskStatus
createSubtask
updateSubtask
deleteSubtask
uploadEvidence
reviewEvidence
updateProgress
createDependency
deleteDependency
runScheduler
runWatchdog
resolveAlert
linkRisk
linkControl
linkIncident
linkAudit
getTimeline
refreshTimeline
sendNotification
aiGenerateTasks
aiSchedule
aiReviewEvidence
aiWeeklySummary

5.2 Implement Audit Logs for Each Function

No function may mutate state without producing an audit entry.

5.3 Validate using API tests

Run:

npm run test:api


All must pass before frontend work begins.

6. FRONTEND IMPLEMENTATION

Follow PIT_FRONTEND_COMPONENT_MAP_v1.1.md and PIT_WIREFRAMES_v1.1.md.

6.1 Build Shell Components

Top Nav

Side Nav

Notifications Bell

Global Search

AI Assistant Toggle

6.2 Project Selector Screen

Cards

Search

Create modal

6.3 Hierarchy

Implement:

Tree navigation

Drag-and-drop

Right-click context menus

6.4 Task Manager

Main task table (virtualized)

Filters

Grouping

Sorters

Bulk actions

6.5 Task Detail Drawer

Details

Subtasks

Evidence (scaffold)

Progress logs

Dependencies

Links

AI panel

6.6 Validate with UI snapshots

Run:

npm run test:ui

7. ADVANCED PIT COMPONENTS
7.1 Dependency Builder

Graph UI for FS/SS/FF/SF.

7.2 Scheduling Engine

Implement critical path logic per spec.

7.3 Watchdog Engine

Alerts for:

Overdue tasks

Missing evidence

Stalled tasks

Cost anomalies

Risk mismatch

7.4 Progress Engine

Ensure rollup function works per spec.

8. EVIDENCE PIPELINE
Requirements:

Upload

Preview

Metadata extraction

AI review

Reviewer approval

Secure URL access

Evidence logs

Evidence must:

Map to task or subtask

Be immutable

Record reviewer decisions

9. GANTT & TIMELINE IMPLEMENTATION
Steps:

Implement timeline_cache

Create API for timeline

Render Gantt in UI

Add zoom, scroll, grouping

Add dependency arrows

Add critical path highlighting

Performance Requirements:

Render <300ms

Virtualize long timelines

Precompute bars in backend

10. EXPORT INFRASTRUCTURE

Implement exports per PIT_EXPORT_SPEC_v1.0.md.

Exports to implement:

Project Summary PDF

Task List CSV

Excel Pack

Gantt PDF

JSON timeline

Evidence ZIP

Risk-Mitigation PDF

Project Archive ZIP

Each export must:

Follow defined schema

Match formatting rules

Include metadata

Produce stable output

11. AI ENGINE IMPLEMENTATION
11.1 AI Task Generator

Interpret WRAC control sets

Interpret Risk Assessment

Interpret Bowtie

Generate WBS

Generate subtasks

Generate dependencies

Estimate durations and costs

11.2 AI Scheduler

Predict delays

Recommend rescheduling

Update dependencies

11.3 AI Evidence Review

Validate authenticity

Score relevance

Provide risk/control fit

Generate summary

11.4 AI Weekly Summary

Forecast risks

Highlight bottlenecks

Summarize progress

Recommend actions

12. INTEGRATIONS

PIT must integrate with:

WRAC                 → Task clusters, control sets
Risk Assessment      → Mitigation feedback
Control Library      → Control health
Incident Module      → Corrective actions
Bowtie               → Barrier tasks
Audit Module         → NCR tasks
Remote Assurance     → System availability tasks
Analytics            → Predictive triggers


Each integration requires:

API endpoint compliance

Data mapping

Regression tests

Version annotation

13. QA & REGRESSION LOCK
Requirements:

100% of PIT QA tests must pass

Snapshot tests must pass

API tests must pass

Export tests must pass

Watchdog tests must pass

AI behaviour tests must pass

Integration tests must pass

After passing, PIT v1.0 is locked.

No changes allowed without:

Updating

Documentation

Schema

Tests

Changelog

Foreman approval

14. DEPLOYMENT
14.1 Staging Deployment

Steps:

Deploy DB

Deploy backend functions

Deploy frontend

Run regression suite

Conduct integration smoke tests

14.2 Pre-Production

Load synthetic tasks (10,000 tasks)

Load example WRAC dataset

Load example control sets

Run performance tests

Validate watchdog & AI

14.3 Production Deployment

Only after 100% success in both previous environments.

15. GOVERNANCE
15.1 PIT Owner

Responsible for:

Final sign-off

Acceptance testing

Change control

15.2 Foreman

Responsible for:

Architectural compliance

QA alignment

Regression enforcement

Developer supervision

15.3 Builders

Responsible for:

Code delivery

Self-testing

Documentation updates

16. SIGN-OFF CHECKLIST

Before PIT v1.0 goes live:

 All migrations applied

 All backend APIs functional

 Full frontend implemented

 Evidence pipeline stable

 Gantt view stable

 Watchdog alerts correct

 AI engines verified

 Exports validated

 Integrations tested end-to-end

 0 critical or major defects

 Changelog updated

 Foreman approval granted

Only when all items are marked “complete” does PIT v1.0 reach production-ready status.

✔ END OF PIT_IMPLEMENTATION_GUIDE_v1.0.md