Project Implementation Tracker – UI & Screen Wireframes
Version 0.1

These wireframes describe the visual layout and behaviour of the PIT module, including:

Org-level dashboards

Project dashboards

Personal workboards

Timeline/Gantt views (SVG-based)

Modals for project, milestone, deliverable, task, evidence

QA & Watchdog integration

Mobile summary views

They are not pixel-perfect designs, but structural blueprints for Foreman + builders.

0. Shared UI Principles

Built with React + Tailwind + shadcn.

Timeline & Gantt implemented using SVG + D3 (no HTML tables).

Dark text on light background, with your existing PIT colors:

Project: #0D2850 (dark blue)

Milestone: #006B92

Deliverable: #4C95B0

Tasks: white rows with status color accents

Icons for:

QA status

Watchdog alerts

Evidence

Overdue flags

1. Global Navigation & Entry Point
1.1 Main Sidebar (Maturion Backoffice)
+---------------------------------+
| Maturion Backoffice             |
+---------------------------------+
| [ Dashboard ]                   |
| [ ISMS Overview ]               |
| [ Maturity Roadmap ]           |
| [ Risk Management ]             |
| [ Project Implementation (PIT) ] <-- HERE
| [ Incident & Intelligence ]     |
| [ Skills Development ]          |
| [ Analytics & Remote Assurance ]|
| [ Settings ]                    |
+---------------------------------+


Clicking Project Implementation (PIT) opens the PIT Home:

2. PIT Home – Portfolio Overview

Route: /pit

2.1 Wireframe
+-----------------------------------------------------------------------------------+
|  PIT – Project Implementation Tracker                                             |
+-----------------------------------------------------------------------------------+
|  [ Org selector ▼ ]  [ Division ▼ ]  [ Department ▼ ]  [ Team ▼ ]   [ Filters ⚙ ] |
|  [ View: Projects ▼ ]  [ Time: This year ▼ ]  [ Run Global PIT QA ] [ Watchdog ⚠ ]|
+-----------------------------------------------------------------------------------+
|                      Portfolio Summary Cards                                      |
|  +-----------------+  +-------------------+  +-------------------+               |
|  | Active projects |  | Overdue tasks     |  | Critical alerts   |               |
|  |        12       |  |        87         |  |        8          |               |
|  +-----------------+  +-------------------+  +-------------------+               |
+-----------------------------------------------------------------------------------+
|  Projects Table                                                                   |
|  +--------------------------------------------------------------------------------+
|  | Project Name        | Owner        | Type    | Prog | Tasks | Overdue | QA   | |
|  |---------------------+-------------+---------+------+-------+---------+------| |
|  | Barloworld OPT      | J. Ras      | Project |  72% |   56  |   9     | 🟡   | |
|  | Karowe Day-to-day   | Site Supv   | Stream  |  48% |  120  |   22    | 🔴   | |
|  | Gabs Action Tracker | Manager X   | Stream  |  65% |   90  |   3     | 🟢   | |
|  +--------------------------------------------------------------------------------+
|  [ + New Project ]                                                                |
+-----------------------------------------------------------------------------------+


Interactions:

Click row → go to Project Dashboard.

QA icon coloured (Green/Amber/Red).

Watchdog ⚠ button → open PIT Watchdog panel.

3. Project Dashboard

Route: /pit/projects/:projectId

3.1 Wireframe
+-----------------------------------------------------------------------------------+
|  Project: Barloworld Security Optimisation                      [ Settings ⚙ ]   |
|  Type: Strategic Project    | Owner: J. Ras                     [ Run QA ]       |
|  Duration: 700 days         | Progress: ███████░ 68%            [ Watchdog ⚠ ]   |
+-----------------------------------------------------------------------------------+
| Tabs: [ Overview ] [ Timeline ] [ Tasks ] [ Evidence ] [ Reports ] [ Audit Log ]  |
+-----------------------------------------------------------------------------------+
| Overview Tab                                                                       |
|                                                                                   |
|  Left: Hierarchy Tree                 |  Right: Project Summary Cards             |
|  + Project                             |  +---------------------+  +------------+ |
|    + Milestone 1                       |  | Milestones:  5      |  | Deliver. 10| |
|      + Deliverable 1                   |  +---------------------+  +------------+ |
|        - Task 1                        |  +---------------------+  +------------+ |
|        - Task 2                        |  | Tasks:      56      |  | Overdue: 9 | |
|      + Deliverable 2                   |  +---------------------+  +------------+ |
|    + Milestone 2                       |                                           |
|      ...                               |  [ Open Timeline View ]                   |
|                                        |  [ Open Tasks Table ]                     |
+-----------------------------------------------------------------------------------+

4. Timeline View (SVG Gantt)

Route: /pit/projects/:projectId/timeline

4.1 Wireframe – Desktop
+-----------------------------------------------------------------------------------+
|  Project Timeline – Barloworld Security Optimisation                              |
+-----------------------------------------------------------------------------------+
| [ Zoom: Year ▼ ] [ Display from: Jan 2026 ▼ ] [ Filters ] [ QA Status: 🟡 ]      |
+-----------------------------------------------------------------------------------+
|  Time Axis (SVG)                                                                  |
|  +-------------------------------------------------------------------------------+|
|  | 2026              | 2027                                                      ||
|  | Jan |Feb|...|Dec  | Jan |Feb|...|Dec                                          ||
|  +-------------------------------------------------------------------------------+|
|  Timeline (SVG)                                                                   |
|  +-------------------------------------------------------------------------------+|
|  | [========== Overall Technical Optimisation timeline =======================]  ||
|  |    [==== Milestone 1 =====]                                                   ||
|  |       [-- Deliverable 1 --]                                                   ||
|  |           [ Task 1        ]                                                  ||
|  |           [ Task 2 ====   ]                                                  ||
|  |       [-- Deliverable 2 --]                                                   ||
|  |           [ Task 3             ]                                             ||
|  |    [==== Milestone 2 =====]                                                   ||
|  |       ...                                                                    ||
|  +-------------------------------------------------------------------------------+|
|                                                                                   |
| Legend: ■ Project   ■ Milestone   ■ Deliverable   ■ Task (colour by status)      |
+-----------------------------------------------------------------------------------+


Interactions:

Scroll horizontally → pan timeline.

CTRL+scroll or pinch → zoom between Year/Quarter/Month/Week/Day.

Drag right edge of bar → change duration (with confirmation modal if override).

Hover bar → tooltip (name, dates, progress, responsible, status).

Click bar → open detail panel or edit modal.

5. Tasks Table View

Route: /pit/projects/:projectId/tasks

This mirrors your Excel table layout.

5.1 Wireframe
+-----------------------------------------------------------------------------------+
| Tasks View – Barloworld Security Optimisation                                     |
+-----------------------------------------------------------------------------------+
| [ Status filter ▼ ] [ Start/End filter ▼ ] [ Duration filter ▼ ]                  |
| [ Responsible filter ▼ ] [ Progress filter ▼ ] [ Clear filters ]                  |
+-----------------------------------------------------------------------------------+
|  +--------------------------------------------------------------------------------+
|  | Project descriptors         | Status     | Start | End   | Dur | Resp | Prog | |
|  |---------------------------- +-----------+-------+-------+-----+------+------| |
|  | Barloworld Security Opt ... |           |       |       |     |      |      | |
|  |   Milestone 1               |           |       |       |     |      |      | |
|  |     Deliverable 1           |           |       |       |     |      |      | |
|  |       Task 1                | Not active|  ...  |  ...  |  5d | Name |  0%  | |
|  |       Task 2                | Upcoming  |  ...  |  ...  |  3d | Name |  0%  | |
|  |       Task 3                | Active    |  ...  |  ...  | 10d | Name | 40%  | |
|  |     Deliverable 2           |           |       |       |     |      |      | |
|  |       Task 1                | Due today |  ...  |  ...  |  1d | Name | 80%  | |
|  |       Task 2                | Overdue   |  ...  |  ...  |  4d | Name | 60%  | |
|  +--------------------------------------------------------------------------------+


Color-coded rows for status (e.g., red background for critical overdue).

“Manage evidence” button in last column for tasks that require evidence.

6. Personal Workboard (Individual View)

Route: /pit/my-work

6.1 Wireframe – Kanban View
+-----------------------------------------------------------------------------------+
|  My Workboard – Logged in as: Johan                                               |
+-----------------------------------------------------------------------------------+
| [ View: Kanban ▼ ]  [ Time: This week ▼ ]  [ Filters ]  [ Ask PIT AI ]           |
+-----------------------------------------------------------------------------------+
|  +----------------+ +----------------+ +----------------+ +---------------------+ |
|  |  To Do         | |  Active        | |  Due Today     | |  Overdue           | |
|  | (10)           | | (5)            | | (2)            | | (4)                | |
|  +----------------+ +----------------+ +----------------+ +---------------------+ |
|  | [ ] Task A     | | [ ] Task D     | | [ ] Task F ⚠   | | [ ] Task H 🔴      | |
|  | Project X      | | Project Y      | | Project Z      | | Project Q          | |
|  | 3d duration    | | 5d duration    | | Due today      | | 5 days overdue     | |
|  +----------------+ +----------------+ +----------------+ +---------------------+ |
|  | [ ] Task B     | ...              | ...              | ...                   |
+-----------------------------------------------------------------------------------+


Interactions:

Drag cards between columns to change status (with confirmation for deadlines).

Click task → open task modal.

“Ask PIT AI”:

“Help me prioritise today’s work.”

“Which tasks are at risk this week?”

6.2 Personal Timeline View
+-----------------------------------------------------------------------------------+
| My Timeline – Next 30 Days                                                        |
+-----------------------------------------------------------------------------------+
| [ Day view ] [ Week view ] [ Month view ]                                        |
+-----------------------------------------------------------------------------------+
|  Time axis: Today … +30 days                                                     |
|  +-------------------------------------------------------------------------+      |
|  | [ Task A ]       [ Task D ===== ]    [ Task F ]                        |      |
|  | [ Task B ==== ]                            [ Task H (overdue) ]       |      |
|  +-------------------------------------------------------------------------+      |
+-----------------------------------------------------------------------------------+

7. Modals
7.1 Project Modal

Triggered from: PIT Home → “+ New Project”.

+------------------------------------------+
| New Project                              |
+------------------------------------------+
| Project name: [______________________]   |
| Type:  (• Project  • Operational stream) |
| Organisation: [_______]  Division: [__] |
| Description: [ multiline text area   ]  |
|                                         |
| Timeline: [ Start date  ▾ ] [ End ▾ ]   |
| Quick-win classification:               |
|   (• Quick Win  • Medium Term • Long )  |
|                                         |
| Owner: [ user picker ]                  |
| Invite members: [ multi-select users ]  |
|                                         |
| [ Cancel ]                 [ Save ]     |
+------------------------------------------+

7.2 Milestone Modal
+------------------------------------------+
| New Milestone                            |
+------------------------------------------+
| Project: [ Barloworld Security Opt ▼ ]   |
| Milestone name: [____________________]   |
| Description: [ multiline ]               |
|                                         |
| Set dates:                               |
|   (• Match project duration)             |
|   (• Custom: Start [date] End [date])    |
|                                         |
| Milestone owner: [ user picker ]         |
|                                         |
| [ Cancel ]                 [ Save ]     |
+------------------------------------------+

7.3 Deliverable Modal
+------------------------------------------+
| New Deliverable                          |
+------------------------------------------+
| Project:   [ Barloworld Opt ▼ ]          |
| Milestone: [ Milestone 1 ▼ ]             |
| Deliverable name: [__________________]   |
| Description: [ multiline ]               |
| Deliverable owner: [ user picker ]       |
|                                         |
| [ Cancel ]                 [ Save ]     |
+------------------------------------------+

7.4 Task / Action Item Modal

The core work unit.

+-----------------------------------------------+
| Task Details                                  |
+-----------------------------------------------+
| Task name: [______________________________]   |
| Belongs to:                                  |
|   Project:   [ Barloworld Opt ▼ ]            |
|   Milestone: [ Milestone 1 ▼ ]               |
|   Deliverable:[ Deliverable 1 ▼ ]            |
|                                               |
| Task type:  (• Single task  • Task cluster)   |
|   If cluster: [ select template ▼ ]           |
|                                               |
| Start date: [ 2026-03-01 ▾ ]                 |
| End date:   [ 2026-03-05 ▾ ]                 |
| Duration:   [ 4 days ] (auto-calculated)     |
|                                               |
| Quick-win classification:                     |
|   (• Quick Win  • Medium  • Long Term )      |
|                                               |
| Responsible person: [ user picker ]          |
| Additional participants: [ multi-select ]     |
|                                               |
| Evidence required? [x] Yes                    |
|   Evidence type: [ Document / Photo / Other ] |
|                                               |
| CAPEX: [  0.00 ]   OPEX: [  0.00 ]           |
| Fiscal year: [ 2026 ▼ ]                       |
|                                               |
| Progress: [ 40% ▾ ]                           |
| Status:   [ Active ▾ ] (read-only if date)   |
|                                               |
| [ Delete ]     [ Cancel ]       [ Save ]     |
+-----------------------------------------------+

7.5 Evidence Modal

Triggered from “Manage evidence” button in tasks table or timeline.

+------------------------------------------+
| Evidence – Task: Implement body scanner  |
+------------------------------------------+
| Required evidence:                       |
|  - Photo of installation                 |
|  - SOP document                          |
|  - Commissioning report                  |
+------------------------------------------+
| Uploaded items:                          |
|  [📄 SOP_v3.pdf]   [View] [AI Evaluate]  |
|  [🖼 photo1.jpg]   [View] [AI Evaluate]  |
|  [📄 report.docx] [View] [AI Evaluate]   |
+------------------------------------------+
| AI Evaluation Summary:                   |
|  "Evidence meets 2/3 required items.     |
|   Missing commissioning report."         |
|  [ View full evaluation ]                |
+------------------------------------------+
| Reviewer: [ Supervisor X ]               |
| Decision: (• Accept  • Reject  • Query)  |
| Comment: [ __________________________ ]  |
|                                          |
| [ Close ]                [ Save review ] |
+------------------------------------------+

8. QA & Watchdog Panels (Project Level)
8.1 QA Panel

Accessible from Project Dashboard → “Run QA” or QA icon.

+---------------------------------------------+
| PIT QA – Project: Barloworld Security Opt   |
+---------------------------------------------+
| Overall status: 🟡  21/24 tests passed      |
+---------------------------------------------+
| Category              | Status | Passed/All |
|-----------------------+--------+-----------|
| Structure             | 🟢     | 8 / 8     |
| Timeline & Dates      | 🟡     | 5 / 7     |
| Progress & Status     | 🟢     | 4 / 4     |
| Evidence              | 🔴     | 2 / 4     |
| Permissions           | 🟢     | 3 / 3     |
| Model Routing         | 🟢     | 3 / 3     |
+---------------------------------------------+
| Failures:                                   |
| 1) PIT.TIME.6 – Task "T-009" ends after     |
|    Milestone 1 end date.                    |
|    Suggestion: Move task into Milestone 2   |
|    or extend Milestone 1 (approval needed). |
|    [ Auto-fix suggestion ] [ Open task ]    |
|                                             |
| 2) PIT.EV.1 – Task "T-013" marked complete  |
|    but has no evidence.                     |
|    Suggestion: Upload evidence or unmark    |
|    as complete.                             |
|    [ Open evidence modal ]                  |
+---------------------------------------------+
| [ Re-run QA ]                               |
+---------------------------------------------+

8.2 Watchdog Panel

Accessible from PIT Home → “Watchdog ⚠”.

+------------------------------------------------+
| PIT Watchdog – Alerts                          |
+------------------------------------------------+
| Severity | Alert                                   | Affected | Actions     |
|----------+-----------------------------------------+----------+------------|
| 🔴       | 12 tasks overdue >10 days in Division A | 3 proj   | [View]     |
| 🟡       | Sudden CAPEX spike in FY2027            | 1 proj   | [Explain]  |
| 🟢       | All AI models responding within limits  | -        |            |
+------------------------------------------------+
| Click [Explain] → opens AI chat summarising cause |
+------------------------------------------------+

9. Mobile Views (Key Screens)
9.1 Mobile – Manager Quick Overview
+--------------------------------+
|  PIT – Manager Snapshot        |
+--------------------------------+
| Org: [ Karowe Site ▼ ]         |
+--------------------------------+
| Active projects: 3             |
| Overdue tasks:   12            |
| Critical:        3             |
+--------------------------------+
| [ View Projects ]              |
| [ My team's tasks ]            |
| [ Create quick task ]          |
+--------------------------------+

9.2 Mobile – Quick Task Create

Used for “on holiday, I remember something…”

+-----------------------------+
| New Quick Task              |
+-----------------------------+
| Task title: [___________]   |
| Project:    [▼ select ]     |
| Due date:   [ 2026-03-05 ]  |
| Assign to:  [ user picker ] |
| Notes: [ multiline ]        |
|                             |
| [ Cancel ]    [ Save ]      |
+-----------------------------+

10. Component List (for Foreman & Builders)

Key React components to implement from these wireframes:

PitHomePage

ProjectDashboard

ProjectTimelineView (SVG + D3)

ProjectTasksTable

PersonalWorkboard (Kanban + timeline)

ProjectHierarchyTree

ProjectSummaryCards

ProjectModal

MilestoneModal

DeliverableModal

TaskModal

EvidenceModal

PitQaPanel

PitWatchdogPanel

All components should be stateless UI shells first, then connected to data via hooks and services.

11. Versioning

This document is:

PIT_UI_WIREFRAMES_v0.1

v0.2 – after initial implementation feedback.

v1.0 – after PIT MVP is stable and regression-free.