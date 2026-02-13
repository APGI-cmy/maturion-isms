Below is the complete PIT_WIREFRAMES_v1.1.md, redesigned from the ground up to align with:

PIT_TRUE_NORTH_v1.0.md

PIT_DATABASE_SCHEMA_v1.1.md

PIT_EDGE_FUNCTIONS_v1.1.md

PIT_FRONTEND_COMPONENT_MAP_v1.1.md

Maturion’s unified layout, styling and IA standards (WRAC/Risk/CC alignment)

One-Time Build and Zero Regression principles

These wireframes are ASCII diagrams (framework-agnostic) but detailed enough for Co-Pilot Builder and UI Dev teams to implement pixel-perfect screens.

Place in:

/Modules/PIT/Architecture/PIT_WIREFRAMES_v1.1.md

PIT_WIREFRAMES_v1.1.md

Project Implementation Tracker — Wireframes
Version 1.1
Supersedes: PIT_UI_WIREFRAMES_v0.1.md (overhauled hierarchy, AI-first, unified UI)

0. PURPOSE

These wireframes define:

The exact UI layout

The navigation structure

Core PIT views

Interaction zones

Placement of all key components

Alignment with other modules (WRAC, RA, Course Crafter)

They are not final UI designs; they are the skeleton for building React components defined in the Component Map.

1. GLOBAL LAYOUT

This layout is identical across ISMS modules, ensuring consistency and muscle memory.

+-------------------------------------------------------------------------------------------+
|  TOP NAV (Breadcrumbs | Notifications | Watchdog | AI Assistant | User Menu)              |
+-------------------------------------------------------------------------------------------+
|  SIDE NAV (module)    |                                                   |               |
|  Dashboard             |                                                   |               |
|  Hierarchy             |                                                   |               |
|  Tasks                 |                    MAIN CONTENT AREA              |               |
|  Timeline (Gantt)      |                                                   |     RIGHT     |
|  Evidence              |                                                   |   DRAWER /    |
|  Clusters              |                                                   |   OVERLAY     |
|  Watchdog              |                                                   |               |
|  Reports               |                                                   |               |
|  Settings              |                                                   |               |
+------------------------+---------------------------------------------------+---------------+


The Right Drawer / Overlay opens for task detail, AI suggestions, evidence previews, etc.

2. PROJECT SELECTION SCREEN
(Home of PIT)
+-------------------------------------------------------------------------------------------+
| PROJECT SELECTOR                                                                          |
+-------------------------------------------------------------------------------------------+
| [New Project]  [Search Bar ..........................................]                    |
|                                                                                           |
| +------------------------------------------------------+   +----------------------------+ |
| | PROJECT CARD                                         |   | PROJECT CARD               | |
| | Name: Secure Logistics Upgrade                       |   | Name: Mine Perimeter Plan | |
| | Owner: John Doe                                      |   | Owner: A. Nkosi           | |
| | Progress: [#####-----] 54%                           |   | Progress: [##--------] 23%| |
| | Risk Mitigation: 31%                                 |   | Risk Mitigation: 12%      | |
| | Tasks: 87 | Overdue: 12                              |   | Tasks: 42 | Overdue: 6     | |
| +------------------------------------------------------+   +----------------------------+ |
|                                                                                           |
| (Scroll...)                                                                                 |
+-------------------------------------------------------------------------------------------+

3. PROJECT OVERVIEW DASHBOARD
+-------------------------------------------------------------------------------------------+
| PROJECT: Mine Perimeter Hardening (Breadcrumbs)                                           |
+-------------------------------------------------------------------------------------------+
| SUMMARY CARDS                                                                            |
+-------------------+--------------------+----------------------+---------------------------+
| PROGRESS          | RISK MITIGATION    | COST (CAPEX/OPEX)   | WATCHDOG STATUS          |
| 54%               | 31%                | R3.4m / R110k        | ● Green                  |
+-------------------+--------------------+----------------------+---------------------------+

| KEY METRICS ROW                                                                           |
+-------------------------+------------------------------+-------------------------------+
| Overdue Tasks: 12       | Critical Path Length: 38d    | Completion Forecast: 17 Mar   |
| Upcoming Deadlines: 8   | Next Review: 5 Feb           | AI Risk Projection: Stable    |
+-------------------------+------------------------------+-------------------------------+

| AI PROJECT SUMMARY                                                                         |
+-------------------------------------------------------------------------------------------+
|  “This week’s priority is the Camera Coverage Workstream.                                 |
|   3 tasks risk slipping due to resource conflict.                                         |
|   Estimated delay: 4 days. Recommended: assign B. Smith.”                                 |
+-------------------------------------------------------------------------------------------+


4. HIERARCHY VIEW
(Project → Phase → Work Package → Task → Subtask)
+----------------------------------+--------------------------------------------------------+
| HIERARCHY TREE                   | SELECTED NODE CONTENT                                   |
+----------------------------------+--------------------------------------------------------+
| > Phase 1: Planning              | +-----------------------------------------------------+|
|     > WP: Site Survey            | | PHASE / WP SUMMARY                                  ||
|        - Task: Initial Survey    | |                                                     ||
|        - Task: Drone Mapping     | | Name: Site Survey                                   ||
|                                  | | Owner: John Doe                                     ||
| > Phase 2: Installation          | | Progress: [###------] 37%                           ||
|     > WP: Camera Deployment      | | Duration: 15 Jan – 12 Feb                           ||
|        - Task: Install Poles     | | Tasks: 12 | Overdue: 3                              ||
|        - Task: Configure VMS     | |                                                     ||
|                                  | +-----------------------------------------------------+|
|                                  |                                                       |
+----------------------------------+--------------------------------------------------------+


Right-click menu per node:

Add Phase / Add Work Package / Add Task / Duplicate / Delete / Move

5. TASK LIST VIEW
+-------------------------------------------------------------------------------------------+
| TASK LIST (Table)                                                                         |
+-------------------------------------------------------------------------------------------+
| Filters: [Status ▼] [Priority ▼] [Owner ▼] [Source ▼] [Due ▼] [Search..................] |
+-------------------------------------------------------------------------------------------+
| Pri | Status     | Task Name                | Owner      | Start     | End       | %     |
|-----+------------+---------------------------+------------+-----------+-----------+-------|
| 🔴  | Overdue    | Install Camera Poles      | J. Smith   | 03 Jan    | 15 Jan    | 40%  |
| 🟡 | Active     | Configure VMS             | A. Khoza   | 10 Jan    | 22 Jan    | 10%  |
| 🔵  | NotStarted | Conduct Risk Briefing     | N. Baloyi  | 14 Jan    | 17 Jan    | 0%   |
| 🔴  | Critical   | Repair Power Redundancy   | D. Fourie  | 01 Jan    | 06 Jan    | 80%  |
+-------------------------------------------------------------------------------------------+

[Bulk Actions] [Export] [Group by: Phase ▼]

6. TASK DETAIL PANEL (RIGHT DRAWER)
+-------------------------------- RIGHT DRAWER --------------------------------------------+
| TASK DETAIL: Install Camera Poles                                                        |
+-------------------------------------------------------------------------------------------+
| Tabs: [Details] [Subtasks] [Evidence] [Progress Log] [Dependencies] [Risk/Controls] [AI] |
+-------------------------------------------------------------------------------------------+

DETAILS TAB:
+-------------------------------------------------------------------------------------------+
| Name: Install Camera Poles                                                                |
| Description: Deployment of poles in Sector A and B                                        |
| Owner: J. Smith                      Assignees: [Smith][Khoza][+Add]                      |
| Priority: 🔴 Critical                Requires Evidence: [x]                                |
| Dates:   Start: 03 Jan    End: 15 Jan                                                      |
| Cost: CAPEX: R120,000     OPEX: R1,200/month                                               |
+-------------------------------------------------------------------------------------------+

7. SUBTASKS TAB
SUBTASKS:
+-------------------------------------------------------------------------------------------+
| [ + Add Subtask ]                                                                         |
+-------------------------------------------------------------------------------------------+
| Status | Subtask Name               | Owner      | Due       | Progress %               |
|--------+----------------------------+------------+-----------+---------------------------|
| 🟡     | Excavate pole bases        | Khoza      | 07 Jan    | [######----] 60%         |
| 🔵     | Install steel poles        | Smith      | 10 Jan    | [###-------] 30%         |
| 🔵     | Concrete curing            | Smith      | 12 Jan    | [----------] 0%          |
+-------------------------------------------------------------------------------------------+

8. EVIDENCE TAB
EVIDENCE:
+-------------------------------------------------------------------------------------------+
| [ Upload Evidence ] (drag & drop area)                                                    |
+-------------------------------------------------------------------------------------------+
| Thumbnail | Type | Uploaded By | Date       | Status | AI Score | Actions                |
|-----------+------+-------------+------------+--------+----------+-------------------------|
| [img]     | Photo| J. Smith    | 4 Jan      | New    | 82%      | [Review] [Download]    |
| [pdf]     | Doc  | A. Khoza    | 6 Jan      | Accepted| 91%     | [View]                 |
+-------------------------------------------------------------------------------------------+

9. PROGRESS LOG TAB
PROGRESS LOG:
+-------------------------------------------------------------------------------------------+
| Date       | User      | From → To  | Status Change | Comment                           |
|------------+-----------+-------------+---------------+------------------------------------|
| 05 Jan     | J. Smith  | 20% → 40%   | Active        | Excavation halfway done            |
| 03 Jan     | AI        | 0% → 20%    | Started       | Initial schedule started            |
+-------------------------------------------------------------------------------------------+

10. DEPENDENCIES TAB
DEPENDENCIES:
+-------------------------------------------------------------------------------------------+
| [ + Add Dependency ]                                                                      |
+-------------------------------------------------------------------------------------------+
| Predecessor               | Type (FS/SS/FF/SF) | Lag | Successor                          |
|---------------------------+---------------------+-----+------------------------------------|
| Acquire Poles             | FS                  | 0d  | Install Camera Poles              |
| Install Poles             | FS                  | 2d  | Configure VMS                     |
+-------------------------------------------------------------------------------------------+


Graphical miniature:

[Acquire Poles] → [Install Poles] → (2 days lag) → [Configure VMS]

11. RISK/CONTROL LINKS TAB
RISK LINKS:
+-------------------------------------------------------------------------------------------+
| Risk: R-22 Sector A Blind Spots    | Type: WRAC Risk | Mitigation Expected: 30%          |
+-------------------------------------------------------------------------------------------+

CONTROL LINKS:
+-------------------------------------------------------------------------------------------+
| Control Set: CCTV Coverage Tier 3 (Pole Cameras, AI Analytics, Black Screen Monitoring)   |
| Controls: [Install poles] [Configure VMS] [Remote assurance integration]                  |
+-------------------------------------------------------------------------------------------+

12. AI TAB (TASK-LEVEL)
AI ASSISTANT:
+-------------------------------------------------------------------------------------------+
| Suggested Improvements:                                                                   |
|  - Break task into 4 subtasks (excavation, pole install, concrete, QA)                   |
|  - Predicted delay: 3 days due to weather forecast                                        |
|  - Recommended Assignee: K. Ndlovu                                                       |
|-------------------------------------------------------------------------------------------|
| [Apply Suggestions]   [Preview Changes]   [Ask AI...]                                     |
+-------------------------------------------------------------------------------------------+

13. GANTT VIEW
+-------------------------------------------------------------------------------------------+
| GANTT CHART                                                                               |
+-------------------------------------------------------------------------------------------+
| Controls: [Zoom +] [Zoom -] [Group by: Phase ▼] [Filter ▼] [Critical Path ON/OFF]         |
+-------------------------------------------------------------------------------------------+

Timeline:
| Jan 1     Jan 7     Jan 14    Jan 21    Jan 28    Feb 4                                  |

Phase 1: Planning
+----------Task A-----------+
               +---Task B----------+

Phase 2: Installation
+---------------WP1---------------+
|   +------Install Poles-------+  |
|             +---Configure VMS---+


Dependencies drawn with arrows.

14. WATCHDOG DASHBOARD
+-------------------------------------------------------------------------------------------+
| WATCHDOG DASHBOARD                                                                        |
+-------------------------------------------------------------------------------------------+
| ALERTS SUMMARY:   ● 2 Red   ● 5 Yellow   ● 12 Green                                       |
+-------------------------------------------------------------------------------------------+

RED ALERTS:
+-------------------------------------------------------------------------------------------+
| 1. Task “Repair Power Redundancy” is 6 days overdue.                                      |
|    AI Suggestion: Reassign to G. Mbatha, extend schedule by 3 days.                       |
| [Resolve] [Apply AI Fix]                                                                   |
+-------------------------------------------------------------------------------------------+

15. CLUSTERS SCREEN
+-------------------------------------------------------------------------------------------+
| TASK CLUSTERS                                                                              |
+-------------------------------------------------------------------------------------------+
| [ Create Cluster Template ]                                                                |
+-------------------------------------------------------------------------------------------+
| Cluster Name       | Source         | Tasks  | Linked Risks | Actions                     |
|--------------------+----------------+--------+---------------+-----------------------------|
| CCTV Camera Deploy | WRAC           | 14     | 3             | [Open] [Regenerate] [Delete]|
| Incident Actions   | Incident ID 44 | 6      | 0             | [Open] [Delete]             |
+-------------------------------------------------------------------------------------------+

16. REPORTS VIEW
+-------------------------------------------------------------------------------------------+
| REPORTS                                                                                    |
+-------------------------------------------------------------------------------------------+
| [Project Summary PDF] [Task CSV] [Timeline PDF] [Risk-Mitigation Report] [Cost Report]    |
+-------------------------------------------------------------------------------------------+

17. SETTINGS PANEL
+-------------------------------------------------------------------------------------------+
| PIT SETTINGS                                                                               |
+-------------------------------------------------------------------------------------------+
| Watchdog Thresholds: [Edit]                                                                |
| AI Model Selection:  [gpt4.1 ▼]                                                            |
| Notification Preferences: [Email] [Push] [Webhook]                                         |
| Default Task Durations: [Edit]                                                             |
| CAPEX/OPEX Categories: [Manage]                                                            |
+-------------------------------------------------------------------------------------------+

✔ END OF PIT_WIREFRAMES_v1.1.md