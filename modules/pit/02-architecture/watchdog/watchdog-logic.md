Below is the full PIT_WATCHDOG_LOGIC_v1.0.md, written to the same level of precision and completeness as the other PIT v1.0 documents (True North, Schema, Edge Functions, Component Map, Wireframes, QA, Export Spec, Sprint Plan, Implementation Guide, Changelog).

This is the master logic file for the PIT Watchdog, which is a central quality-control, governance, and early-warning mechanism inside the ISMS.

Place in:

/Modules/PIT/Architecture/PIT_WATCHDOG_LOGIC_v1.0.md

PIT_WATCHDOG_LOGIC_v1.0.md

Project Implementation Tracker — Automated Watchdog Logic Specification
Version 1.0
Aligned with PIT_TRUE_NORTH_v1.0.md, PIT_EDGE_FUNCTIONS_v1.1.md, PIT_DATABASE_SCHEMA_v1.1.md, PIT_QA_IMPLEMENTATION_PLAN_v1.1.md

0. PURPOSE

The PIT Watchdog is the automated supervisory brain of the Project Implementation Tracker.
Its role is to:

Detect deviations

Flag risks early

Trigger escalations

Suggest AI-driven corrections

Maintain project health and reliability

Protect against silent failures

Enforce Zero Regression and Non-Negotiable Controls

It ensures that PIT, and the broader ISMS ecosystem, never drifts, never silently fails, and never allows critical risks to go unmanaged.

This file defines:

All Watchdog triggers

Severity levels

AI auto-fix behaviors

Notification and escalation rules

Interaction with all ISMS modules

Audit requirements

Performance expectations

Daily/weekly/monthly execution cycles

No PIT deployment is complete without this Watchdog.

1. WATCHDOG ARCHITECTURE OVERVIEW

The Watchdog is made of three engines:

1. Rule Engine (Deterministic)
2. AI Insights Engine (Predictive)
3. Escalation Engine (Action)

1.1 Rule Engine

Monitors:

Tasks

Subtasks

Dependencies

Evidence

Progress

Costs

Dates

Risk/Control links

1.2 AI Insights Engine

Uses AI to detect:

Patterns

Early failures

Inconsistent data

Delays

Incorrect risk mapping

Wrong cost trends

Missing evidence quality

1.3 Escalation Engine

Executes:

Alerts

Notifications

Auto-fixes

Rescheduling

Reassignments

Escalations to supervisors

2. WATCHDOG SCAN SCHEDULE
2.1 Every 5 minutes

Overdue tasks

Status mismatches

Required evidence missing

2.2 Hourly

Critical path shifts

AI delay prediction

Stalled tasks

No-updates-trigger

2.3 Daily (00:00 local time)

Risk mitigation recalculation

Control effectiveness updates

Task distribution imbalance

Resource over-allocation

Cost overruns

Data integrity scans

2.4 Weekly

Full AI project health report

Risk trajectory analysis

Mitigation vs progress variance

2.5 Monthly

Cross-project dependency review

Drift analysis for AI models

Compliance health report

3. WATCHDOG ALERT SEVERITY LEVELS
Severity 1 (CRITICAL)
Severity 2 (HIGH)
Severity 3 (MEDIUM)
Severity 4 (LOW)
Severity 5 (INFO)

3.1 Severity 1 (CRITICAL)

Conditions:

Task overdue > 5 days AND critical path

Evidence missing for mandatory tasks past due

Control critical for risk mitigation not implemented

System availability issue (Remote Assurance) unresolved > 24 hours

Cost overrun > 50% on critical tasks

Dependency deadlock

Actions:

Immediate notification to owner & sponsor

Escalate to supervisor

AI auto-fix suggestions

Generate Watchdog alert entry

Option to auto-correct

3.2 Severity 2 (HIGH)

Conditions:

Task overdue > 2 days

Risk mitigation trajectory dropping

High-priority control stalled

Critical subtask stuck > 3 days

Incorrect status (e.g., progress > 0 but marked “Not Started”)

Evidence rejected twice

Scheduling conflict

Actions:

Notification to task owner

AI recommendation

Escalation if unresolved in 48 hours

3.3 Severity 3 (MEDIUM)

Conditions:

No updates for > 7 days

Upcoming deadline < 48 hours

Work package behind schedule

Task owner overloaded (> 10 in-progress tasks)

Moderate cost overrun

3.4 Severity 4 (LOW)

Conditions:

Low impact delays

Minor inconsistencies

Cosmetic issues (bad dates, formatting)

3.5 Severity 5 (INFO)

Conditions:

"Heads up" changes

New tasks assigned

Non-critical updates

4. WATCHDOG RULE SETS

Below is the complete formalized ruleset per category.

4.1 Time-Based Rules
Rule: Task Overdue
IF task.end_date < NOW AND task.status != 'completed'
THEN ALERT (severity based on priority)

Rule: No Activity
IF task.last_update > 7 days
THEN ALERT (MEDIUM)

Rule: Stalled Subtask
IF subtask.progress < 10% AND age > 5 days
THEN ALERT (MEDIUM)

4.2 Dependency Rules
Rule: Circular Dependency
IF dependency graph contains a loop
THEN ALERT (CRITICAL)

Rule: Early Successor Start
IF successor.start_date < predecessor.end_date AND dependency.type = 'FS'
THEN ALERT (HIGH)

Rule: Cascading Delay
IF predecessor delayed
THEN propagate and alert

4.3 Evidence Rules
Rule: Missing Required Evidence
IF task.requires_evidence AND no evidence AND task.status='completed'
THEN ALERT (CRITICAL)

Rule: Rejected Evidence
IF evidence.status = 'rejected' x 2
THEN ALERT (HIGH)

Rule: Evidence Not Reviewed
IF evidence.age > 7 days
THEN ALERT (MEDIUM)

4.4 Risk Mitigation Rules
Rule: Mitigation Drop
IF mitigation_current < mitigation_expected - 10%
THEN ALERT (HIGH)

Rule: Risk Above Appetite
IF linked risk.residual_rating > appetite_level
THEN ALERT (CRITICAL)

Rule: Control Incomplete
IF control effectiveness < required threshold
THEN ALERT (HIGH)

4.5 Cost Rules
Rule: CAPEX/OPEX Overrun
IF task.cost_actual > cost_estimate * 1.5
THEN ALERT (CRITICAL)

Rule: Burn Rate Out Of Range
IF project.burn_rate deviates > 20%
THEN ALERT (MEDIUM)

4.6 Scheduling Rules
Rule: Critical Path Drift
IF task is on critical path AND delayed
THEN ALERT (CRITICAL)

Rule: Duration Mismatch
IF progress < 20% AND duration > 70% elapsed
THEN ALERT (HIGH)

Rule: Overlapping Tasks (Invalid)
IF task A and B assigned to same owner AND overlap > threshold
THEN ALERT (MEDIUM)

4.7 Integration Rules
WRAC Integration

Unimplemented control → risk not being mitigated

New WRAC items requiring PIT tasks ignored → alert

Risk Assessment Integration

Residual rating incorrect → alert

Projected risk not updated → alert

Incident Integration

NCR/corrective action not completed → alert

Bowtie Integration

Barrier effectiveness below threshold → alert

Remote Assurance

System availability < threshold → alert

Control Library

Critical control not implemented → alert

5. AI AUTO-FIX LOGIC

The AI Watchdog can propose or execute auto-corrections.

5.1 Auto-Scheduling

AI will:

Reorder tasks

Extend deadlines

Reduce scope

Redistribute workload

Suggest resource swaps

5.2 Auto-Reassignment

Conditions:

Owner overloaded

Stalled tasks

Multiple overdue items

5.3 Auto-Cluster Expansion

AI may generate:

Additional subtasks

Missing dependencies

5.4 Auto-Risk Updates

If PIT progress moves mitigation, AI updates RA.

5.5 Auto-Control Effectiveness

If evidence validates control function, AI updates Control Library.

5.6 Auto-Escalation

If unresolved after threshold → escalate to supervisor or director.

6. NOTIFICATION LOGIC

Every alert follows a structured escalation path:

Owner → Supervisor → Project Sponsor → Org Admin


Delivery channels:

Email

Push notifications

ISMS messaging

Webhooks

Critical alerts require:

Read receipt

Reminder after 6 hours

Escalation if no acknowledgement

7. WATCHDOG STORAGE & AUDIT

All alerts stored in table:

pit_watchdog_alerts

Each alert includes:

UID

Severity

Category

Linked task

Linked risk/control

Recommended action

AI auto-fix available (Y/N)

Escalation history

Resolved_by

Resolved_at

Resolution type (manual/auto)

Audit snapshot (state before & after)

No alert may be deleted.
Only soft-close permitted.

8. PERFORMANCE REQUIREMENTS

Watchdog scan must complete < 4 seconds (project with 10,000 tasks).

DB load must stay < 50% for scheduled scans.

AI inference must remain < 3 seconds for auto-fix generation.

Must scale up to 100 concurrent projects.

9. QA REQUIREMENTS

Per PIT_QA_IMPLEMENTATION_PLAN_v1.1.md:

Watchdog test suite must pass

Pattern-based tests must pass

AI consistency must be validated

Escalation logic must pass integration tests

Zero false negatives for critical alerts

10. FUTURE UPGRADES

Planned for PIT v2.0+:

Continuous observability metrics

Real-time monitoring dashboards

Cross-project risk propagation logic

Reinforcement learning for schedule optimisation

Predictive cost overrun engine

Live telemetry integration with Remote Assurance

✔ END OF PIT_WATCHDOG_LOGIC_v1.0.md