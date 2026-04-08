PIT_DEVELOPMENT_SPRINT_PLAN_v0.1.md
Project Implementation Tracker (PIT)
Development Sprint Plan
Version 0.1
0. PURPOSE

This sprint plan defines the exact implementation sequence for building the PIT module.
The plan is written for:

Foreman (supervisor agent – QA + architecture enforcement)

Builder Agents (repo-level implementers)

You (UX oversight + approval + non-technical validation)

It integrates:

Frontend components

Edge functions

Database schema

State handling

Timeline engine (SVG + D3)

QA + Watchdog

AI routing

Evidence management

CAPEX/OPEX forecasting

Personal workboards

1. DEVELOPMENT PRINCIPLES

These rules are mandatory:

1. QA-first

Every sprint starts with QA specs → architecture → build → re-run QA.

2. No legacy carryover

If a component is misbuilt, it is nuked and rebuilt to spec.

3. Wiring verification

Foreman checks every connection:

UI → hook

hook → service

service → edge function

edge → DB

4. Vertical slicing

Each sprint delivers a fully functional slice, not a horizontal partial.

5. Stable front-end shell

UI skeleton must exist before logic is attached.

6. Foreman signs off every sprint

No sprint closes without a Green QA result.

2. HIGH-LEVEL SPRINT ROADMAP (7 Sprints)
Sprint	Title	Outcome
1	PIT Shell + Routing + Layout	All screens + navigation skeleton
2	Project Layer	Project CRUD + overview
3	Timeline Engine v1	SVG engine + basic bars
4	Tasks Layer	Tasks + Kanban + personal workboard
5	Evidence Layer	Evidence uploading + AI evidence scoring
6	QA & Watchdog	Full QA + alerts
7	CAPEX/OPEX + Reporting	Budgets + reports + predictive hooks
3. DETAILED SPRINTS
SPRINT 1 — PIT Shell & Routing (7–10 days)

Objective: Create the complete UI framework skeleton without data.

Deliverables:

PIT navigation in sidebar

All Page components created as empty shells:

PITHomePage

ProjectDashboardPage

ProjectTimelinePage

ProjectTasksPage

PersonalWorkboardPage

Tabs system

Placeholder for:

TimelineSVG

TaskTable

EvidenceModal

QA Panel

Watchdog panel

Technical:

React Router routes set up

Folder structure created exactly as per Component Map

Shadcn installed + configured

Tailwind theme

Zustand stores skeleton

React Query configuration

Mock data layer

QA Checks:

All components exist

All routes load

No missing imports

No logic inside components

Component naming conventions correct

Outcome:

Framework ready — but no data, no functionality yet.

SPRINT 2 — Project Layer (10–14 days)

Objective: Make projects fully functional.

Deliverables:

Project table

Project creation modal

Project update modal

Project summary cards

Project hierarchy tree (static version)

Project header

API integration:

EF_PIT_CREATE_PROJECT

EF_PIT_UPDATE_PROJECT

EF_PIT_GET_PROJECT

Technical:

Database tables: project

Services: projectService.ts

Zustand project store

React Query hooks

Validation (Zod)

Initial QA tests for:

PIT.STRUCTURE.1–3

PIT.PROJECT.1

QA Checks:

Creating project stores correct dates

Parent-child integrity

No empty names

Owner assignment correct

Outcome:

Projects working end-to-end.
Still no timeline, tasks, or evidence.

SPRINT 3 — Timeline Engine v1 (12–20 days)

Objective: Build the SVG + D3 Gantt timeline.

Deliverables:

SVG grid engine

D3 scales

Year/Quarter/Month/Week/Day zoom

Bars rendered for:

Project

Milestones

Deliverables

Tasks (placeholder rectangles)

Scroll/pan

Zoom smooth transitions

Bar click → open modal

Timeline cache tables

Technical:

D3 setup

hit-box interactions

timelineService.ts

EF_PIT_TIMELINE_GET_DATA

EF_PIT_TIMELINE_APPLY_DRAG (stub version)

QA:

PIT.TIME.1

PIT.TIME.2

PIT.TIME.3

PIT.TIME.4

PIT.TIMELINE.1

Outcome:

Timeline view fully functional, except:

Drag-resizing

Evidence colors

Status coloring

These will come in Sprint 4/5.

SPRINT 4 — Tasks Layer (10–14 days)

Objective: Full task CRUD + personal workboard.

Deliverables:

Task modal

Tasks table

Filtering

Task row coloring

Kanban board

Personal Timeline (subset of timeline engine)

Technical:

taskService.ts

EF_PIT_CREATE_TASK

EF_PIT_UPDATE_TASK

EF_PIT_DELETE_TASK

Integrations:

project → milestone → deliverable → task mapping

Auto-calculations:

duration

status based on dates

QA:

PIT.TASK.1

PIT.TASK.2

PIT.TASK.3

PIT.TASK.4

Outcome:

Tasks working completely

users can see their own work

managers can run a Kanban

SPRINT 5 — Evidence Layer (10–15 days)

Objective: Evidence uploads + AI evaluation.

Deliverables:

Evidence modal

Evidence item component

AI evaluation section

File storage integration

Signed URL uploads

Evidence review workflow

Technical:

evidenceService.ts

EF_PIT_UPLOAD_EVIDENCE

EF_PIT_AI_EVALUATE_EVIDENCE

Virus scanning hook (optional)

Mapping evidence to tasks

Evidence required flag logic

QA:

PIT.EVIDENCE.1

PIT.EVIDENCE.2

PIT.EVIDENCE.3

Outcome:

Tasks can carry proof, AI can evaluate it, and managers can approve it.

SPRINT 6 — QA & Watchdog Layer (10–14 days)

Objective: Internal QA + anomaly detection.

Deliverables:

QA Panel

Watchdog Panel

Alert listing

Alert explanations

Auto-fix suggestions

Technical:

qaService.ts

watchdogService.ts

EF_PIT_RUN_QA

EF_PIT_QA_AUTOFIX

EF_PIT_WATCHDOG_SCAN

EF_PIT_WATCHDOG_REPORT

EF_PIT_WATCHDOG_EXPLAIN

QA:

Whole PIT QA suite

Regression suite

Outcome:

PIT becomes self-diagnosing
No regression possible.

SPRINT 7 — CAPEX/OPEX + Reporting (8–12 days)

Objective: Financials + exporting reports.

Deliverables:

CAPEX/OPEX calculator

Org forecasting report

Project cost summary

Export PDF

CSV export

Integration with PIT dashboard

Technical:

costService.ts

EF_PIT_CALCULATE_COSTS

EF_PIT_FORECAST_COSTS

QA:

PIT.COST.1

PIT.COST.2

PIT.COST.3

Outcome:

Managers can see:

Financial commitments

Multi-year forecasts

Budget-alignment

This completes PIT MVP.

4. FINAL MVP COMPLETION CRITERIA

The PIT module is MVP-complete when:

✔ Timeline fully functional

Zoom

Pan

Bars

Accurate dates

Good performance

✔ Tasks fully functional

CRUD

Status

Color coding

Reasonable performance

✔ Evidence functional

Upload

AI eval

Review

Link to tasks

✔ QA works

Tests all PIT rules

Autofix options

✔ Watchdog works

Alerts

Explanations

✔ Reporting works

CAPEX

OPEX

Forecasting

✔ User-level workboard works

Kanban

Personal timeline

5. POST-MVP (NOT IN THIS SPRINT PLAN)

These are future sprints:

Predictive scheduling

PIT mobile app

Meeting → task auto-extraction

PIT → performance management dashboards

PIT → HR integration

PIT → training credits (Skills Portal)

PIT → ISMS cross-domain impact

PIT → analytics for insider threat

6. VERSIONING

This file is:

PIT_DEVELOPMENT_SPRINT_PLAN_v0.1

Next versions:

v0.2 after builder feedback

v1.0 after first production release

v2.0 when predictive modeling is added

SPRINT PLAN COMPLETE

You now have ALL PIT documents:

True North Architecture

UI Wireframes

Edge Functions

Database Schema

QA Plan

Frontend Component Map

Sprint Plan

The PIT module is now fully documented at a world-class engineering level.