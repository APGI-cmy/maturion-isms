PIT_FRONTEND_COMPONENT_MAP_v0.1.md
Project Implementation Tracker
React Frontend Component Specification
Version 0.1
0. PURPOSE OF THIS DOCUMENT

This defines the complete set of React components for the PIT module, including:

Page-level components

Layout components

Reusable UI blocks

Timeline components (SVG + D3)

Form modals

Evidence manager

QA + Watchdog panels

Personal workboard

Builders will receive their instructions from Foreman using this spec.
Any component not matching this mapping fails QA.

1. TECHNOLOGY STACK (FRONTEND)

React 18

Vite

TailwindCSS

shadcn/ui components

Lucide icons

Zustand or React Context for state

React Query for data fetching

SVG + D3 for all timeline visuals

Headless UI patterns for modals

Mobile-first responsive layout

2. DIRECTORY STRUCTURE

Strict, enforced, no deviation:

/pit/
   pages/
   components/
      project/
      milestone/
      deliverable/
      task/
      evidence/
      timeline/
      qa/
      watchdog/
      shared/
   hooks/
   services/
   state/
   utils/

3. PAGE LEVEL COMPONENTS

Each route corresponds to a page component.

3.1 PITHomePage

Route: /pit

Purpose

Org-level view: portfolio summary + project table.

Props

None.

Uses

<PortfolioSummaryCards />

<ProjectTable />

<ProjectFilterBar />

<WatchdogButton />

Events

onSelectProject(projectId)

onRunGlobalQA()

3.2 ProjectDashboardPage

Route: /pit/projects/:projectId

Purpose

Top-level project dashboard.

Props

projectId

Uses

<ProjectHeader />

<ProjectTabs />

<ProjectHierarchyTree />

<ProjectSummaryCards />

Events

onRunQA()

onOpenTimeline()

onOpenTasks()

3.3 ProjectTimelinePage

Route: /pit/projects/:projectId/timeline

Purpose

SVG Gantt timeline.

Props

projectId

Uses

<TimelineHeader />

<TimelineSVG />

<TimelineLegend />

Events

onDragBar(taskId, newStart, newEnd)

onZoom(level)

onViewportChange(start, end)

onBarClick(entity)

onRunQA()

3.4 ProjectTasksPage

Route: /pit/projects/:projectId/tasks

Purpose

Table of all tasks with filters.

Props

projectId

Uses

<TasksFilterBar />

<TasksTable />

<TaskRow />

Events

onEditTask(taskId)

onOpenEvidence(taskId)

3.5 PersonalWorkboardPage

Route: /pit/my-work

Purpose

Individual dashboard: Kanban + personal timeline.

Uses

<WorkboardHeader />

<KanbanBoard />

<PersonalTimeline />

4. COMPONENT MAP (DETAILED)
4.1 Headers & Controls
4.1.1 ProjectHeader
Props
project: ProjectRecord
onRunQA()
onOpenSettings()

State

None.

Functionality

Displays project name, dates, owner, buttons.

4.1.2 ProjectTabs

Tabs:

Overview | Timeline | Tasks | Evidence | Reports | Audit Log

Props
activeTab
onTabChange(tab)

4.2 Hierarchy Components
4.2.1 ProjectHierarchyTree
Props
projectId
hierarchyData (Project → Milestones → Deliverables → Tasks)
onSelectNode(node)
onEditNode(node)

Interactions

Expand/collapse

Select/edit node

Right-click → open contextual menu

4.3 Summary Components
4.3.1 ProjectSummaryCards
Data Displayed

Milestone count

Deliverable count

Task count

Overdue tasks

Progress bar

Props
summary

Events

None.

4.4 Timeline Components (SVG)

These follow the structure:

TimelineSVG
├── TimelineGrid
├── TimelineBars
│    ├── ProjectBar
│    ├── MilestoneBar
│    ├── DeliverableBar
│    └── TaskBar
├── TimelineCursor
└── TimelineInteractions

4.4.1 TimelineSVG
Props
bars
zoomLevel
viewport
onDragBar(...)
onZoom(...)
onBarClick(...)

State

D3 scale functions

Pan/zoom transform

Events

Emits bar drag/resize events.

4.4.2 TimelineGrid

Draws:

Year → Quarter → Month → Week → Day lines

Labels

Weekend shading (if enabled)

Quick-win overlays

Props:

scaleX
viewport
zoomLevel

4.4.3 TimelineBars
Props
entities (project, milestones, deliverables, tasks)
scaleX
viewport

Contains

<ProjectBar />

<MilestoneBar />

<DeliverableBar />

<TaskBar />

4.4.4 TimelineInteractions (Hit-Box Layer)

Invisible rectangles that manage:

Clicking

Dragging

Resizing

Hover events

Props:

onDragStart
onDragMove
onDragEnd
onHover
onClick

4.5 Task Components
4.5.1 TasksTable
Props
taskList
filters
onEditTask()
onOpenEvidence()

Contains

<TaskRow />

4.5.2 TaskRow
Props
task
onEdit(taskId)
onOpenEvidence(taskId)

State

None.

4.5.3 TaskModal
Props
taskId (optional)
deliverableId
milestoneId
projectId
onSave()
onCancel()


Contains all fields from database schema.

4.6 Evidence Components
4.6.1 EvidenceModal
Props
taskId
onClose()


Contains:

File list

Upload button

AI evaluation section

Reviewer decision panel

4.6.2 EvidenceItem

Shows individual evidence entry.

Props:

evidence
onEvaluate()
onDelete()

4.7 QA Components
4.7.1 QAPanel
Props
projectId
qaResults
onRunQA()
onAutofix()

Shows:

Summary

Passed/Failed tests

Fix suggestions

4.8 Watchdog Components
4.8.1 WatchdogPanel

Props:

alerts
onResolveAlert(id)
onExplainAlert(id)


Shows:

Severity-coded alerts

AI explanation button

4.9 Personal Workboard Components
4.9.1 KanbanBoard

Cols:

To Do | Active | Due Today | Overdue | Completed


Props:

tasks
onEditTask()
onMoveTask()

4.9.2 PersonalTimeline

Shows only the user’s tasks for the next X days.

Props:

tasks
zoomLevel

5. SHARED COMPONENTS
5.1 DatePicker
5.2 UserPicker
5.3 MultiUserPicker
5.4 ProgressBar
5.5 StatusBadge
5.6 QuickWinBadge
5.7 CAPEXOPEXCard
5.8 EvidenceBadge
5.9 SearchBar
5.10 DropdownMenu
5.11 ErrorBanner
5.12 EmptyState
6. STATE MANAGEMENT

Zustand stores:

usePitStore:
   selectedProject
   timelineZoom
   timelineViewport
   selectedTask
   filters


React Query handles:

Fetch projects

Fetch timeline

Fetch tasks

Evidence

QA

Watchdog

CAPEX/OPEX summary

7. FRONTEND → EDGE FUNCTION MAPPINGS
Project

create → EF_PIT_CREATE_PROJECT

update → EF_PIT_UPDATE_PROJECT

Milestone

create → EF_PIT_CREATE_MILESTONE

Deliverable

create → EF_PIT_CREATE_DELIVERABLE

Task

create → EF_PIT_CREATE_TASK

update → EF_PIT_UPDATE_TASK

Evidence

upload → EF_PIT_UPLOAD_EVIDENCE

AI eval → EF_PIT_AI_EVALUATE_EVIDENCE

Timeline

get data → EF_PIT_TIMELINE_GET_DATA

drag → EF_PIT_TIMELINE_APPLY_DRAG

QA

run → EF_PIT_RUN_QA

autofix → EF_PIT_QA_AUTOFIX

Watchdog

list → EF_PIT_WATCHDOG_REPORT

explain → EF_PIT_WATCHDOG_EXPLAIN

8. FOREMAN QA CHECKLIST (FRONTEND)

Every component must:

Use correct props & event signatures

Match naming 1:1

Use correct shadcn variants

No inline styles (Tailwind only)

No business logic inside components

All logic placed in:

/services

/hooks

/utils

Timeline must be SVG-driven only

No HTML tables for timeline

Modals must be headless

Every form must use Zod validation

No unused components

No ad-hoc components

9. VERSIONING

This file is:

PIT_FRONTEND_COMPONENT_MAP_v0.1

Next versions:

v0.2 after implementation feedback

v1.0 after full PIT MVP

v2.0 after predictive scheduling integration