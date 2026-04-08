Below is the full PIT_INTEGRATION_MAP_v1.0.md, completing the PIT module suite.
This document shows exactly how PIT connects to every other ISMS module, creating a unified, deterministic, and AI-driven ecosystem.

It is written with the same level of depth and architectural precision as:

PIT_TRUE_NORTH_v1.0

PIT_DATABASE_SCHEMA_v1.1

PIT_EDGE_FUNCTIONS_v1.1

PIT_FRONTEND_COMPONENT_MAP_v1.1

PIT_WIREFRAMES_v1.1

PIT_QA_IMPLEMENTATION_PLAN_v1.1

PIT_EXPORT_SPEC_v1.0

PIT_SPRINT_PLAN_v1.0

PIT_IMPLEMENTATION_GUIDE_v1.0

PIT_WATCHDOG_LOGIC_v1.0

PIT_CHANGELOG_v1.0

Place in:

/Modules/PIT/Architecture/PIT_INTEGRATION_MAP_v1.0.md

PIT_INTEGRATION_MAP_v1.0.md

Project Implementation Tracker — ISMS Integration Architecture
Version 1.0
Scope: Cross-module data flows, triggers, callbacks, API interfaces, events, risk-feedback loops, and AI-dependent routing.

0. PURPOSE

This document defines the end-to-end integration architecture for PIT inside the Maturion ISMS.

It ensures:

Every module communicates reliably with PIT

No duplicated logic

No orphan tasks

No inconsistencies in risk/control evaluations

AI routing is unified across systems

All downstream and upstream updates happen automatically

PIT is the execution arm of the ISMS — all modules feed into PIT, and PIT feeds back into them.

This document governs every interaction.

1. HIGH-LEVEL INTEGRATION MAP

(Top-level architecture view)

                           ┌─────────────────────────┐
                           │      Threat Module      │
                           └─────────────┬───────────┘
                                         │
                                         ▼
                           ┌─────────────────────────┐
                           │   Vulnerability Module  │
                           └─────────────┬───────────┘
                                         │
                                         ▼
                           ┌─────────────────────────┐
                           │  Risk Assessment Engine │
                           └─────────────┬───────────┘
                                         │
                                         ▼
                           ┌─────────────────────────┐
                           │          WRAC           │
                           └─────────────┬───────────┘
                                         │
                                         ▼
                             ┌──────────────────┐
                             │       PIT        │
                             │ (Execution Hub)  │
                             └──────┬───────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────────────────┐
        ▼                           ▼                                       ▼
┌───────────────┐        ┌─────────────────────┐                 ┌──────────────────┐
│   Controls    │        │ Incident & Intel     │                 │      Audit       │
│  Module       │        │ Module               │                 │    Module        │
└───────────────┘        └─────────────────────┘                 └──────────────────┘
        │                           │                                       │
        ▼                           ▼                                       ▼
┌───────────────┐        ┌─────────────────────┐                 ┌──────────────────┐
│ Remote         │        │   Bowtie Builder    │                 │  Data Analytics  │
│ Assurance      │        └─────────────────────┘                 └──────────────────┘
└───────────────┘


Everything eventually flows into PIT, and PIT outputs:

Residual risk updates

Control effectiveness updates

PUE/Bowtie barrier updates

Incident follow-up status

NCR corrective action status

Analytics signals

Assurance dashboards

2. MODULE-BY-MODULE INTEGRATION SPECIFICATIONS

We now describe each integration:

Trigger conditions

API endpoints

Data structures

Expected PIT behaviour

Upstream & downstream callbacks

AI involvement

2.1 WRAC → PIT Integration

Trigger:
When new controls are approved for implementation.

Data sent to PIT:

{
  "control_set_id": "...",
  "control_items": [...],
  "linked_risks": [...],
  "expected_mitigation_pct": X,
  "project_template": "default" | "camera_deployment" | ...
}


PIT Behaviour:

Create new PIT project or attach tasks to an existing one

Create task cluster (via AI)

Auto-generate subtasks

Auto-create dependencies

Pre-seed mitigation %

Assign owners based on control groups

Link to risks

Downstream callback:
Residual mitigation recalculation → Risk Assessment Engine

2.2 Risk Assessment → PIT Integration

Trigger:
Any risk requiring treatment (above appetite or high severity).

Data sent:

risk_id
inherent_rating
residual_rating
projected_residual
required_controls


PIT Behaviour:

Flag risks requiring tasks

Generate work packages

Link tasks to risks

Continuously update “mitigation achieved %”

Downstream callback:
Updated residual rating sent back.

2.3 Controls Module → PIT Integration

Trigger:

Control gaps detected

Control failures

Control effectiveness below threshold

Data sent:

control_id
control_set_id
effectiveness_current
effectiveness_required
risk_ids


PIT Behaviour:

Create tasks for remediation

Assign to responsible custodian

Watchdog checks effectiveness improvements

Evidence required for control recovery

Downstream callback:
Control effectiveness updated in Control Library.

2.4 Incident & Intelligence Module → PIT

Trigger:

Corrective actions identified

Preventive actions required

Root cause analysis demands follow-up

Data sent:

incident_id
corrective_actions
preventive_actions
severity
due_date


PIT Behaviour:

Task creation per NCR

Prioritize based on severity

Evidence required for closure

Watchdog monitors closures

Upstream callback:
Incident status updated once PIT tasks are complete.

2.5 Audit Module → PIT

Trigger:

Audit finding

NCR creation

Non-conformance detected

Expected PIT Behaviour:

Create PIT tasks

Require evidence for closure

Map tasks to audit categories

Provide progress tracking

Downstream callback:
NCR closure updates sent back to the Audit Module.

2.6 Bowtie Builder → PIT

Trigger:

Barrier degradation detected

Bowtie outputs requiring treatment

Critical control failure

Data sent to PIT:

barrier_id
current_health
required_actions
linked_risks
criticality


PIT Behaviour:

Generate barrier recovery tasks

Link to risk and control data

Update barrier health as tasks progress

Downstream callback:
Barrier health recalculated in Bowtie Module.

2.7 Remote Assurance → PIT

(System Availability → Task Creation)

Trigger:

CCTV offline

Access control system down

Alarm sensor failed

VMS degraded

Network monitoring failure

Data sent:

system_name
availability_pct
outage_start
severity
recommended_actions


PIT Behaviour:

Create urgent tasks

High severity = immediate alerts

Evidence required: screenshot, logs, telemetry

Downstream callback:

Control effectiveness updated

RA real-time risk updates

2.8 Data Analytics → PIT

(Predictive → Preventive Tasks)

Triggers:

Trend analysis

Risk correlation

Suspicious patterns

Predictive risk detection

Example output:

{
  "trigger_type": "trend_anomaly",
  "reason": "increasing access PIN failures at Gate D",
  "recommended_task": "Review access logs and reset PIN thresholds"
}


PIT Behaviour:

Generates AI-driven task clusters

Watchdog monitors for correlation patterns

2.9 Skills Development Portal → PIT (Future)

PIT outputs:

Skill credits

Training tasks

Competency-based work assignments

3. DOWNSTREAM INTEGRATIONS (PIT → MODULES)

PIT outputs drive many other ISMS modules.

3.1 PIT → Risk Assessment

Updated fields:

mitigation_current_pct
evidence_status
projected_residual_rating
actual_residual_rating
risk_owner_comments

3.2 PIT → Control Library

Updated for each control:

implementation_pct
evidence_complete
effectiveness_estimate
effectiveness_actual

3.3 PIT → WRAC

Updated for each risk:

control_set_implemented
mitigation_achieved_pct
projected_vs_actual_gap
priority_order_new

3.4 PIT → Incident Module

Updated fields:

corrective_actions_complete: true/false
preventive_actions_complete: true/false
closure_evidence

3.5 PIT → Audit Module

Updated:

ncr_status
evidence
close_ready

3.6 PIT → Bowtie

Updated barrier health:

barrier_effectiveness
evidence
degradation_score

3.7 PIT → Remote Assurance

Updated via:

control_status:
   - operational
   - partially operational
   - failed

4. AI ROUTING MAP

AI is used heavily across modules.

4.1 AI Task Generator Routing

Inputs from:

WRAC

RA

Bowtie

Control gaps

Incidents

Audits

Telemetry

Analytics

AI SUGGESTIONS:

WBS

Subtasks

Durations

Dependencies

Owners

4.2 AI Scheduling Routing

Triggered by:

Delays

Conflicts

Incorrect resource load

Critical path drift

Outputs:

Optimised schedules

Reassignments

Suggest splitting large tasks

4.3 AI Evidence Review Routing

Triggered when:

Evidence is uploaded

Reviewer requests AI interpretation

Watchdog calls validation

Outputs:

Score

Authenticity rating

Relevant control mapping

Suggested acceptance/rejection

4.4 AI Weekly Summary Routing

Inputs from:

PIT tasks

Risks

Controls

Incidents

Bowtie

Remote Assurance

Outputs:

Risk trajectory

Workload alerts

Top 10 delays

AI-recommended actions

5. EVENT-DRIVEN INTEGRATION MODEL

Events are broadcast via:

pit.task.created
pit.task.updated
pit.task.completed
pit.subtask.updated
pit.dependency.updated
pit.evidence.uploaded
pit.evidence.accepted
pit.evidence.rejected
pit.progress.updated
pit.watchdog.alert
pit.export.generated
pit.integration.update


Modules subscribe selectively.

6. ERROR HANDLING IN CROSS-MODULE INTEGRATIONS

Standard PIT integration error codes:

INT001 - Missing linked risk
INT002 - Missing control mapping
INT003 - Invalid WRAC reference
INT004 - Broken audit linkage
INT005 - Incident task mismatch
INT006 - Bowtie health mismatch
INT007 - Remote Assurance feed offline
INT008 - AI processing failure


PIT must surface integration alerts to Watchdog automatically.

7. INTER-MODULE RISK PROPAGATION

If a single PIT task is delayed →
this may degrade:

Multiple risks

Multiple controls

Multiple barriers

Multiple incidents

Multiple NCRs

Propagation rules are encoded in:

PIT_CAT_RISK_LINK

PIT_CAT_CONTROL_LINK

PIT_CAT_BOWTIE_LINK

(new metadata tables introduced in Schema v1.1)

8. SECURITY & ACCESS CONTROL IN INTEGRATIONS

Strict RLS isolation

Cross-module data restricted by organisation

Integration endpoints validated by API keys

All cross-module calls logged

No module may pull or push data across org boundaries.

9. QA REQUIREMENTS FOR INTEGRATIONS

Per PIT_QA_IMPLEMENTATION_PLAN_v1.1.md:

All integrations must have tests

All edge cases must be validated

AI suggestions near-boundary cases must be evaluated

Cross-module regression tests mandatory

10. FUTURE ENHANCEMENTS

Planned for PIT v2.0+:

Live telemetry integration

Full predictive cross-risk modelling

Reinforcement learning for automated scheduling

Cross-company anonymised benchmarking

Self-healing workflows

✔ END OF PIT_INTEGRATION_MAP_v1.0.md