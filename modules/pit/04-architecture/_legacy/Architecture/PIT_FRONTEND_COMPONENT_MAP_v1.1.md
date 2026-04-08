PIT_FRONTEND_COMPONENT_MAP_v1.1.md

Project Implementation Tracker – Frontend Component Architecture Map
Version 1.1
Aligned with PIT_TRUE_NORTH_v1.0.md & PIT_DATABASE_SCHEMA_v1.1.md
Supersedes: PIT_FRONTEND_COMPONENT_MAP_v0.1.md (UI too shallow, old hierarchy)

0. PURPOSE

This document defines all frontend components required to implement the Project Implementation Tracker (PIT) module in alignment with:

True North v1.0

Database Schema v1.1

Edge Functions v1.1

Wireframes v1.1

QA v1.1

Export Spec v1.0

The frontend must:

Present a clean, minimalistic UI

Hide system/AI complexity behind intuitive components

Allow rapid navigation & data visibility

Support task-heavy workflows

Allow multi-module integration

Maintain a consistent ISMS-wide visual language

Enable AI assistance everywhere

This is a non-negotiable blueprint for Builders.
Every PIT UI element must correspond to a component described here.

1. GLOBAL COMPONENT GROUPINGS

PIT’s UI consists of 8 major component groups:

1. Shell & Layout Components
2. Project Selection & Overview Components
3. Hierarchy Navigation Components
4. Task/Work Interface Components
5. Evidence & Review Components
6. Timeline / Gantt Components
7. Watchdog & Health Components
8. AI Assistant Components
9. Integration Components (Risk, Controls, Incidents, Audit)


Each grouping is broken down below.

2. SHELL & LAYOUT COMPONENTS
2.1 <PITAppShell>

Top-level container.

Responsibilities:

Global navigation

RLS-based view filtering

Context providers (project, user, AI model routing)

Error boundary

Notification controller

Subcomponents:

<PITTopNavBar>

<PITSideNavigation>

<PITHotkeyManager>

<PITGlobalSearchBar>

2.2 <PITTopNavBar>

Displays:

Breadcrumb (System → Module → Project)

Active project name

Notification bell

Watchdog indicators

AI assistant toggle

User menu

2.3 <PITSideNavigation>

Contains navigation items:

Dashboard
Hierarchy
Tasks
Timeline (Gantt)
Evidence
Clusters
Watchdog
Reports
Settings


Items appear/disappear based on role.

3. PROJECT SELECTION & OVERVIEW
3.1 <ProjectSelectorPanel>

Responsibilities:

List all accessible PIT projects (org_id RLS)

Search + filter

“Create Project” modal

3.2 <ProjectOverviewDashboard>

Provides a high-level summary:

Project metadata

Progress rings (project, phases, work packages)

Risk mitigation %

CAPEX/OPEX usage

Overdue tasks

Critical path visualization

Watchdog alerts summary

AI health commentary

Subcomponents:

<ProjectProgressCard>

<RiskMitigationCard>

<CostSummaryCard>

<OverdueTaskList>

<CriticalPathCard>

<WatchdogAlertBadge>

4. HIERARCHY NAVIGATION COMPONENTS

These reflect the new True North hierarchy:

Project → Phase → Work Package → Task → Subtask

4.1 <HierarchyTreeView>

Left-pane tree component.

Shows nested structure:

Project
 ├── Phase 1
 │    ├── Work Package A
 │    │      ├── Task…
 │    └── Work Package B
 ├── Phase 2
 │    └── Work Package C
 ...


Features:

Expand/Collapse

Drag-and-drop re-ordering (with confirmation)

Right-click context menu: Add / Edit / Delete

4.2 <PhaseCard>

Displays phase metadata & quick metrics.

4.3 <WorkPackageCard>

Displays work package details, progress, task summary.

5. TASK & WORK INTERFACE COMPONENTS

This group contains the components users will use most heavily.

5.1 <TaskTableView>

Full table of tasks with:

Priority

Status

Owner

Progress %

Dates

Linked risk/controls

Evidence requirement

Source module

Features:

Multi-column filtering

Quick search

Bulk actions (assign, set status, export)

AI-sort: relevance, risk impact, dependency criticality

5.2 <TaskDetailPanel>

Right-panel drawer displaying full task metadata.

Tabs:

Details (name, description, owners, dates, costing)

Subtasks

Evidence

Progress Log

Risk & Control Links

Dependencies

AI Assistant (contextual guidance)

5.3 <TaskFormModal>

Used for Create / Edit / Duplicate.

Includes:

Task name

Description

Owner & assignees

Cost fields

Dates

Priority

Evidence toggle

Linked control set (via <ControlSelector>)

Linked risks

Source module metadata

5.4 <SubtaskList>

Nested under task:

Status

Title

Quick % slider

Evidence badge

“Add subtask”

5.5 <DependencyEditor>

Visual interface for:

Adding predecessors

Viewing successors

Setting lag days

Selecting dependency type

Graph representation:

[Task A] → (FS +2 days) → [Task B]

6. EVIDENCE & REVIEW COMPONENTS
6.1 <EvidenceUploadPanel>

Supports:

Files

Images

PDFs

External logs

Drag-and-drop

Automatic metadata:

Hash

File size

Uploaded by

Source system

6.2 <EvidenceReviewPanel>

Reviewer actions:

Accept

Reject

Require clarification

AI-assisted features:

Auto-scoring

Auto-summary

Risk relevance mapping

Suggested comments

6.3 <EvidenceGallery>

Grid of evidence items with:

Filter by type

Filter by task

Filter by subtask

Date filtering

7. TIMELINE / GANTT COMPONENTS
7.1 <GanttContainer>

Main timeline interface.

7.2 <GanttBarRenderer>

Renders:

Phases

Work Packages

Tasks

Dependencies

Critical path highlight

Today marker

Uses precomputed timeline_cache.

7.3 <GanttMiniMap>

Zoomed-out view used for navigation.

7.4 <TimelineControls>

Controls:

Zoom in/out

Date range

Grouping (phase, WP, owner, status)

Filter overlays

8. WATCHDOG & HEALTH COMPONENTS
8.1 <WatchdogDashboard>

Shows:

Active alerts

Severity counts

Affected tasks/projects

RCA suggestions from AI

8.2 <AlertDetailPanel>

Displays:

Alert message

Suggested fix actions

“Auto-Fix via AI” (if applicable)

Mark as resolved

8.3 <WatchdogStatusCard>

Used throughout the UI to show current health.

Green

Yellow

Red

9. AI ASSISTANT & AUTOMATION COMPONENTS
9.1 <PITAssistantToolbar>

Floating panel for:

Generate tasks from input

Analyse schedule

Rewrite task descriptions

Auto-split tasks

Predict delays

Forecast completion

Cross-link controls

9.2 <AITaskGeneratorPanel>

Used when tasks originate from:

WRAC

Bowtie

Incident

Audit

Data analytics

Shows proposed WBS with:

Tasks

Subtasks

Dependencies

Estimated durations

Suggested owners

Risk-mitigation mapping

9.3 <AISchedulingPanel>

Shows:

Predicted delay

Optimal reschedule

Critical path adjustments

Suggested assignments

9.4 <AIEvidenceReviewPanel>

Auto-reviews uploaded evidence for:

Validity

Relevance

Control effectiveness contribution

Risk mitigation effect

10. INTEGRATION COMPONENTS
10.1 <RiskLinkPanel>

Shows linked risks:

Inherent

Residual

Projected

WRAC priority

Control sets

10.2 <ControlLinkPanel>

Lists controls & control groups from Control Library.

10.3 <IncidentLinkPanel>

Shows linked Incident tasks or PUEs.

10.4 <AuditLinkPanel>

Shows audit findings, NCR statuses, follow-ups.

10.5 <SkillsCreditPanel>

Assign skills credit for PIT tasks.

11. REPORTING & EXPORT COMPONENTS
11.1 <ReportDashboard>

Contains:

Task exports

Gantt exports

Project summary reports

Mitigation summary

Cost summary

11.2 <ExportMenu>

Exports:

PDF summary

CSV tasks

Excel project pack

JSON (API-friendly)

Timeline snapshot

Maps to PIT_EXPORT_SPEC_v1.0.md.

12. SETTINGS & ADMIN COMPONENTS
12.1 <PITSettingsPanel>

Contains:

Notifications

AI model selection

Watchdog thresholds

CAPEX/OPEX categories

12.2 <UserPermissionsEditor>

Role-based controls.

12.3 <ClusterTemplateManager>

Manage templates for repeatable task clusters.

13. COMPONENT RELATION MAP
PITAppShell
 ├── PITTopNavBar
 ├── PITSideNavigation
 └── PITPageContainer
      ├── ProjectSelectorPanel
      ├── ProjectOverviewDashboard
      ├── HierarchyTreeView
      ├── TaskTableView
      │     └── TaskDetailPanel
      │           ├── SubtaskList
      │           ├── EvidenceUploadPanel
      │           ├── EvidenceReviewPanel
      │           ├── DependencyEditor
      │           ├── AITaskGeneratorPanel
      │           └── RiskLinkPanel
      ├── GanttContainer
      │     ├── GanttBarRenderer
      │     └── GanttMiniMap
      ├── WatchdogDashboard
      ├── ReportDashboard
      └── PITSettingsPanel

14. UX / DESIGN SYSTEM RULES

All components must use the global Maturion UI Kit (same for WRAC, RA, Course Crafter).

Icons from lucide-react.

Tailwind for layout.

AI interaction uses sliding panel or modal.

Use consistent ISMS status colors:

Green (#2ECC71)
Yellow (#F1C40F)
Red (#E74C3C)
Blue (#2980B9)
Grey (#7F8C8D)


Avoid clutter; hide advanced options behind toggles.

15. PERFORMANCE REQUIREMENTS

All tables must support >10,000 tasks smoothly using virtualization.

Gantt rendering must use cached timeline data.

AI panels must maintain session context.

Evidence gallery must lazy-load thumbnails.

16. ACCESSIBILITY REQUIREMENTS

Keyboard navigation

ARIA labels for hierarchy and task lists

High-contrast mode

Screen-reader-compatible notifications

✔ END OF PIT_FRONTEND_COMPONENT_MAP_v1.1.md