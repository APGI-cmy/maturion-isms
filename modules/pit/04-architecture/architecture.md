PROJECT IMPLEMENTATION TRACKER (PIT) – ARCHITECTURE v0.1
0. Purpose

The Project Implementation Tracker (PIT) is the Maturion module that:

Tracks all organisational work – from strategic programmes to day-to-day tasks.

Provides management visibility at every level (organisation, project, team, individual).

Links directly to the Maturity Roadmap, Risk Assessments, and other modules.

Becomes a core data source for:

Remote assurance

Insider threat detection

Budgeting (CAPEX/OPEX)

HR and performance management

The PIT is designed to replace the complex Excel workbooks you’ve been using with a scalable, AI-driven, multi-user web application.

1. Role in the Maturion Ecosystem

PIT sits in the centre of the ISMS as the execution engine:

Maturity Roadmap → generates required actions → tracked in PIT

Risk Management → improvement plans → tracked in PIT

Incident Management → corrective/preventive actions → tracked in PIT

Analytics & Remote Assurance → reads from PIT to see “who is really doing what”

Skills Development → actions for training and development → tracked in PIT

HR / KPIs (future) → use PIT as evidence of performance and workload

Every meaningful change initiative or ongoing responsibility should be represented in PIT.

2. Core Concepts
2.1 Hierarchy

The PIT hierarchy has four structural levels plus organisational context:

Project / Stream

A formal initiative (e.g. “Barloworld Security Optimisation”)

OR an ongoing stream like “Day-to-day Operations – Karowe”

Milestones

Major checkpoints within a project/stream

Typically with a defined time boundary

Deliverables

Concrete pieces of work that must be produced

Can be documents, systems, processes, behaviours

Tasks / Action Items

Atomic pieces of work

The level at which people actually act

May be single tasks or task clusters (templates with subtasks)

Additional context:

Organisation → Division → Department → Team → Individual
Projects and tasks are linked into this org tree.

2.2 Work Types

To support both projects and daily work, PIT recognises:

Project Work – finite, goal-driven initiatives.

Operational Work – day-to-day, recurring responsibilities.

Improvement Work – actions arising from risk assessments, audits, incidents.

Operational work can be modelled as “Operational Streams” (project type = operational) so that:

An individual can have a continuous personal board.

Managers can see both “project work” and “BAU work” in the same interface.

2.3 Time Horizons

Every project/stream/cluster can be classified as:

Quick Win – implement within current year / short-term window.

Medium Term – implement in 2–3 years.

Long Term – 3–10 years or more.

These map to your Excel logic where:

Items that can’t be done now due to budget/time are not lost – they move into future time horizons and are auto-scheduled.

2.4 Cost Dimensions

Tasks and deliverables can carry cost fields:

CAPEX flag + amount

OPEX flag + amount

Currency and fiscal year

Aggregation across PIT enables:

Forward-looking CAPEX/OPEX projections

“Based on actual planned work, what is next year’s realistic budget?”

3. Data Model (Conceptual)
3.1 Organisational Entities

organisations – company / group

divisions

departments

teams

users – linked to above

3.2 PIT Entities

projects

name, type (project/operational), owner, organisation context, start, end

quick_win_type (quick / medium / long)

milestones

project_id, name, start, end, description

deliverables

milestone_id, name, description

tasks

deliverable_id or project_id (for ad hoc tasks)

name, description

start_date, end_date, duration

status, progress_percent

quick_win_type

responsible_user_id

evidence_required (bool)

capex_amount, opex_amount, fiscal_year

linked_kpi_id (future)

linked_risk_id / incident_id / mps_id (integration hooks)

task_clusters

template definitions (e.g. “Implement New CCTV System” with sub-tasks)

evidence_items

task_id, uploaded files, comments, AI evaluation outputs

timeline_settings

user preferences for zoom levels, display windows

status_logs

task_id, old_status, new_status, actor, timestamp

4. Status & Progress Logic
4.1 Task Status

Status is primarily date-driven, with some manual override:

not_active – future start date, outside warning window

upcoming – within X days of start (e.g. 5 days) – countdown

active – between start and end dates

due_today

overdue_minor – 1–9 days late

overdue_critical – 10+ days late (escalated)

completed – evidence accepted and status closed

4.2 Progress Percent

For simple tasks: manually updated by owner (0–100%) or auto-set to 100% on completion.

For clusters: derived from sub-tasks.

For deliverables: average of child tasks.

For milestones: average of deliverables.

For projects/streams: weighted based on milestones or direct tasks.

This allows org-level:

“Project progress: 80%, 5 milestones, 10 deliverables, 50 tasks.”

(Exactly as in your screenshot.)

5. Timeline Engine

The PIT uses a rich timeline/Gantt engine:

Zoom levels:

Year / Quarter / Month / Week / Day

Horizontal scroll (infinite left/right).

Bars representing:

Projects (dark blue)

Milestones (blue)

Deliverables (light blue)

Tasks (white / colour-coded by status)

Key behaviours:

Resizing the width of days automatically scales weeks/months/years.

Bars snap to date grid (no drifting).

Hover shows exact date at cursor.

Changing a task duration recalculates:

Task end date

Deliverable/milestone/project boundaries

Quick filters:

Show only this project

Show only tasks for person X

Show only overdue items

Show specific date range

6. Views & Dashboards
6.1 Organisation Management Dashboard

Audience: EXCO / senior management.

Shows:

Overall project portfolio:

List of top projects/streams

Duration, milestones, deliverables, tasks

Progress %, risk flags

Heatmap of:

Overdue items by department

Load per department

Budget summary:

CAPEX/OPEX by year, project, division

Drill-down:

Click a project → project dashboard

Click a department → filtered task view

Click an overdue indicator → list of problem tasks

6.2 Project Dashboard

Audience: project owner / project team.

Shows:

Project timeline + Gantt

Milestones & deliverables list

Task table (like your Excel):

Descriptor column (indented)

Status, colour coding

Start / end / duration

Responsible person

Progress

Evidence management button

Filters:

Status filter

Date range filter

Duration filter

Responsible person filter

Progress filter

6.3 Personal Workboard

Audience: individual user.

This is critical for your “day-to-day management” requirement.

Features:

All tasks assigned to that user (across all projects & streams).

Can be viewed as:

Kanban (To do / Active / Due today / Overdue / Completed).

Timeline (mini personal Gantt).

Quick actions:

Update progress

Add evidence

Request help / reassign / escalate

AI assistant:

“Help me prioritise today.”

“What must I do before Friday?”

This turns PIT into a personal productivity tool, not just management reporting.

6.4 HR / Performance (Future)

Later, PIT will:

Link tasks to KPIs (per individual).

Provide performance evidence:

Completed tasks

Complexity / effort

Timeliness

Feed into:

Appraisals

Promotions

Bonus decisions

Talent identification

This is NOT v1, but is baked into the architecture via linked_kpi_id and evidence data.

7. AI Usage in PIT
7.1 Planning & Structuring

Suggest milestones based on project description.

Suggest deliverables from risk reports, maturity standards, incident analyses.

Suggest task clusters from templates.

Suggest timelines: quick wins vs medium vs long term.

7.2 Workload & Responsibility

Recommend responsible persons based on:

Role

Skill

Existing load

Alert when individuals or teams are overloaded.

7.3 Evidence & Progress

Evaluate uploaded evidence vs expected outcomes.

Suggest realistic progress % based on evidence.

Highlight tasks that appear “stuck” (no activity but in active window).

7.4 Analytics & Budgeting

Scan PIT data to produce:

CAPEX/OPEX forecast for next year(s).

“What if” scenarios (e.g. if we defer these long-term items).

8. Mobile Use Case

The system must support:

Mobile web / app view for managers.

Ability to:

View dashboards at high level.

Drill down quickly.

Add or assign tasks on the go:

“New idea → create task in correct project with minimal fields.”

Tasks added via mobile become visible instantly on desktop.

9. Permissions & Roles (Summary)

Roles (refining what we captured before):

Org Super Admin – whole platform.

PIT Admin – config, templates, global settings.

Project Owner – full control within project.

Milestone Owner – manage deliverables/tasks in milestone.

Deliverable Owner – manage tasks.

Task Owner – update status & evidence.

Viewer – read-only.

Permission rules:

Lower-level roles cannot change structure above them.

Overrides require approvals (and create an audit log).

10. Integration Hooks

Important cross-module links:

tasks.linked_mps_id → Maturity Roadmap

tasks.linked_risk_id → Risk Management

tasks.linked_incident_id → Incident module

tasks.linked_evidence_id → Evidence library

tasks.linked_training_id → Skills Development

This allows:

“Show me all PIT tasks created from Risk Assessment X.”

“Show me all tasks linked to MPS Y in domain ‘Protection’.”

11. QA & Watchdog (High-Level – details in QA doc)

PIT must have QA tests for:

Structure integrity (project/milestone/deliverable/task links).

Date logic (no impossible ranges; calendars consistent).

Status logic (no nonsense states).

Progress aggregation correctness.

Evidence links valid.

Permissions enforced.

Timeline UI behaviour consistent (grid snap, scaling).

Watchdog monitors:

Jobs that fail (bulk operations, imports).

Unusual spikes in overdue tasks.

Repeated overrides.

Data anomalies.

Detailed test list will live in PIT_QA_IMPLEMENTATION_PLAN_v0.1.md.

12. Versioning

This is PIT_ARCHITECTURE_v0.1.

v0.2 – after we formalise QA and timeline engine details.

v1.0 – after initial implementation & feedback.