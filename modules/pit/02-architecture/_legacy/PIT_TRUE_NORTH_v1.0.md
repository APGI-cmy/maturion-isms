This is the master blueprint for the Project Implementation Tracker (PIT) and defines:

Purpose & vision

PIT’s position inside the ISMS

Engines, workflows, lifecycle

Data flows, ontologies, and standards

Integration with all other modules

AI-driven automation logic

One-Time-Build & Zero Regression alignment

Future-ready design

Foreman & Builder guidance

This is the single authoritative architecture file for PIT v1.0.

PIT_TRUE_NORTH_v1.0.md

Project Implementation Tracker (PIT) – Enterprise Architecture Blueprint
Version 1.0
Aligned with Maturion ISMS True North (v1.2)
Aligned with Maturion One-Time Build Philosophy (v1.1)

0. PURPOSE

The PIT (Project Implementation Tracker) is the central orchestration engine of the entire Maturion ISMS.

Where other modules identify, assess, quantify, or recommend actions, the PIT is the module that executes reality.

PIT exists to:

Move risks → into mitigation

Move controls → into implementation

Move findings → into closure

Move plans → into projects

Move intentions → into measurable outcomes

It provides:

Task management

Project management

Costing

Scheduling

Workflows

Dependencies

Real-time progress

Automated updates to other ISMS modules

PIT is not just a tracker.
It is the execution nerve-center of the entire SRMF/ISMS ecosystem.

This True North ensures PIT is designed correctly the first time, remains stable permanently, and never accumulates technical debt.

1. POSITION OF PIT IN THE ISMS ARCHITECTURE

PIT sits downstream from:

Threat Module

Vulnerability Module

Risk Assessment Engine

WRAC & Control Views

Bowtie Builder (future)

Incident & Intelligence

Audit & Assurance

Remote Assurance (Systems Availability)

Data Analytics Engines

Skills Development Portal (future task allocation)

And upstream of:

Actual physical and digital task execution

Implementation of controls

CAPEX/OPEX spending

Continuous assurance

Resource allocation

Real-time risk mitigation % updates

PIT is the place where “identified tasks” become “real-world work.”
2. CORE OBJECTIVES OF PIT
2.1 Convert risks → into action

Every approved recommendation becomes a trackable, measurable project or task.

2.2 Convert control requirements → into implementation

Every control identified in WRAC or Risk Assessment becomes a PIT project.

2.3 Provide a universal task/project management system

All ISMS modules feed tasks into PIT.

2.4 Provide real-time progress tracking

Task progress directly affects:

Residual risk

Control effectiveness

Assurance dashboards

System availability heatmaps

Bowtie barrier health

Risk mitigation %

2.5 Provide CAPEX/OPEX control

Cost → budget → ROI → PIT → RA feedback loop.

2.6 Provide governance, workflows, and audit trail

Everything must be logged, timestamped, and traceable.

3. PRINCIPLES & PHILOSOPHIES

PIT adheres to Maturion’s core doctrines:

✔ 3.1 One-Time Build

No rework, no redesign, no technical debt.

✔ 3.2 Zero Regression

Every feature must have automated QA enforcement.

✔ 3.3 Data immutability

Audit trails cannot be edited without recorded justification.

✔ 3.4 Integration-first architecture

Every component must have an upstream and downstream.

✔ 3.5 AI-first execution

AI performs the heavy lifting:

Suggesting tasks

Auto-splitting tasks

Auto-generating WBS structures

Auto-prioritizing

Auto-scheduling

Auto-assigning

Auto-writing descriptions

Auto-escalating overdue items

Auto-reporting to risk modules

✔ 3.6 Minimalistic UI

Complexity must be invisible to the user;
intelligence happens behind the scenes.

4. PIT OBJECT MODEL (ONTOLOGY)

PIT has a hierarchical ontology that all other ISMS modules reference.

Project
   └── Phase (optional)
       └── Task
           └── Subtask (optional)
               └── Action Logs

4.1 Project

A project is a container for:

Risk treatment plans

Control implementation

Audit corrective actions

Incident corrective/preventive actions

Assurance follow-up items

Bowtie barrier recovery tasks

Skills assignments (future)

System availability repairs

4.2 Task

Atomic unit of work. Can contain:

Assignment

Due dates

Priority

Cost estimation

Dependencies

4.3 Subtask

Optional but useful for describing multi-step action items.

4.4 Action Logs

Auto-generated or manual updates.

5. KEY PIT ENGINES

PIT has 8 primary engines:

1. Task Generation Engine (TGE)
2. Scheduling Engine (SCE)
3. Dependency Engine (DPE)
4. Costing & ROI Engine (CRE)
5. Resource & Assignment Engine (RAE)
6. Progress Engine (PE)
7. Risk Mitigation Engine (RME)
8. Reporting & Dashboard Engine (RDE)

5.1 Task Generation Engine (TGE)

Receives tasks from:

WRAC

RA

Control Assessment

Bowtie

Incident

Audit

Assurance

Data Analytics

Manual creation

AI breaks tasks into:

Steps

Work packages

Time estimates

Costing

Dependencies

5.2 Scheduling Engine (SCE)

Auto-calculates:

Start/end dates

Critical path

Delays

Reminders

Escalations

5.3 Dependency Engine (DPE)

Understands:

Task A must finish before B starts

Parallelizable items

Bottlenecks

Slack

Dynamic rescheduling

5.4 Costing & ROI Engine (CRE)

Mirrors WRAC’s costing and ROI logic:

CAPEX/OPEX

Current cost

Future cost

Mitigation value

ROI %

5.5 Resource & Assignment Engine (RAE)

Includes:

Custodians

Approvers

Reviewers

Multi-team assignments

Skills matrix (future integration)

5.6 Progress Engine (PE)

Maps:

Updates

Evidence uploads

Photos, PDFs

Checklists

Approvals

Meetings

5.7 Risk Mitigation Engine (RME)

Feeds back into:

Residual risk

Control effectiveness

PUE status

Bowtie barrier health

Real-time risk models

5.8 Reporting & Dashboard Engine (RDE)

Generates:

Project dashboards

Risk mitigation dashboards

Control readiness dashboards

RA-updated heatmaps

Weekly/monthly summaries

6. PIT WORKFLOW (GLOBAL)

PIT follows a unified, deterministic workflow:

1. Trigger (from any ISMS module)
2. AI interprets & creates task structure
3. Supervisor approves hierarchy
4. PIT schedules project
5. Work proceeds & evidence is uploaded
6. PIT updates risk/control modules automatically
7. Delays trigger escalation logic
8. Completion updates RA/WRAC/Bowtie dashboards


This workflow guarantees permanent synchronization between PIT and the rest of the ISMS.

7. INTEGRATIONS WITH OTHER MODULES

PIT integrates with all major modules.
Below are the primary activation paths:

7.1 Integration with WRAC

When controls are approved, PIT receives:

Control group

Associated risks

Mitigation %

Cost estimate

Priority

7.2 Integration with Risk Assessment

Inherent → Residual → Projected risk all update based on PIT progress.

7.3 Integration with Controls

“Critical controls” feed tasks automatically.

7.4 Integration with Bowtie

Barrier actions automatically become PIT tasks.

7.5 Integration with Incident Module

Corrective actions → tasks
Preventive actions → tasks

7.6 Integration with Audit Module

Findings → NCRs → Tasks → Corrective actions

7.7 Integration with Remote Assurance

System availability failures → PIT tasks
Camera offline, alarm failure, VMS down, etc.

7.8 Integration with Data Analytics

Patterns trigger PIT tasks automatically.

8. USER ROLES & GOVERNANCE

Roles:

1. PIT Administrator
2. Project Owner
3. Task Owner
4. Approver
5. Reviewer
6. Observer
7. AI Assistant (embedded)


Each role has:

RLS isolation

Action-level permissions

Audit trails

Escalation authority

9. DATA MODEL (SUMMARY)

Tables (detailed in PIT_DATABASE_SCHEMA_v1.1.md):

pit_projects

pit_phases

pit_tasks

pit_subtasks

pit_dependencies

pit_costs

pit_progress_logs

pit_files

pit_notifications

pit_escalations

pit_metrics

pit_integrations

Every row is:

Orgranization-bound

Audit-protected

Version-tracked

10. AI AGENTS IN PIT

AI has three levels inside PIT:

1. Reactive AI (task generation)
2. Proactive AI (pattern spotting)
3. Predictive AI (risk trajectory forecasting)

Reactive AI

Triggered by incoming data.

Proactive AI

Monitors:

Delays

Cost overruns

Implementation bottlenecks

Predictive AI

Uses:

Historical progress

Control type

Resource availability

To predict:

Completion date

Residual risk trajectory

ROI performance

11. AUDIT TRAIL & LOGIC

Every action inside PIT is logged:

Created

Updated

Completed

Reopened

Delayed

Escalated

Reassigned

Commented

Evidence uploaded

Logs are immutable and signed by user ID.

12. WATCHDOG LOGIC (HIGH-LEVEL)

Defined fully in PIT_WATCHDOG_LOGIC_v1.0.md, but summarized here:

Missed deadlines

Missing evidence

Unassigned tasks

Stalled tasks (>x days without update)

Cost threshold exceeded

Mitigation % mismatch

Critical control downtime

PUE risk status degradation

Barrier deep-dive overdue

Watchdog triggers:

Notifications

Escalations

Automated rescheduling

Risk updates

Weekly summary reports

13. FUTURE EXPANSION HOOKS

PIT is future-proofed for:

Mobile auditor app

Skills-to-task mapping

Autonomous scheduling

Live surveillance/video telemetry

Resource optimisation algorithm

Predictive CAPEX planning

Adverse scenario simulation

14. CONSTRAINTS & NON-NEGOTIABLES

100% alignment with Maturion True North

No duplication of logic across engines

No deviation from PIT ontology

No UI variations between modules

Every action must be auditable

Every task must have a measurable outcome

15. PIT IN ONE SENTENCE

PIT is the ISMS engine that turns risk, intelligence, audit, incident, and control insights into executable, trackable, measurable action — and updates the entire ISMS as tasks progress.

✔ END OF PIT_TRUE_NORTH_v1.0.md