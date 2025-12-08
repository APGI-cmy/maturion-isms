PIT_QA_IMPLEMENTATION_PLAN_v0.1.md
Project Implementation Tracker — QA Integration Blueprint
Version 0.1 — First Release
0. Purpose

This document defines the QA implementation plan for the Project Implementation Tracker (PIT) module.

Its purpose is to:

Embed QA directly into the Maturion Backoffice Dashboard

Provide Foreman with a repeatable, enforceable validation system

Ensure PIT has zero regression, consistent logic, correct wiring

Give Johan user-friendly failure explanations

Produce reliable, auditable, stable project & performance tracking

This QA system makes PIT:

Trustworthy

Predictable

Error-resistant

Scalable

Safe for organisational decision-making

1. QA Architecture

PIT QA consists of five functional layers, each with dedicated test suites:

Structure QA

Timeline & Date Logic QA

Progress & Status QA

Evidence Workflow QA

Permissions & Role QA

Model Routing QA

Security QA

Watchdog Monitoring

Each layer produces:

PASS/FAIL

Human-readable summary

Technical error details

Suggested fix

Severity level

Link to failing entity

Results feed into:

Backoffice QA Dashboard

Foreman’s automated decision engine

Builder task creation workflows

2. QA Triggers

QA can run in three ways:

2.1 Automatic Triggers

Triggered when:

A project/milestone/deliverable/task is created

A date changes

A duration changes

A responsibility changes

Progress is updated

Evidence is uploaded

A task is completed

A milestone is closed

A project is published

2.2 Manual Triggers

Buttons available:

Run PIT QA for this Task

Run PIT QA for this Project

Run Global PIT QA

Run Full Platform QA (Foreman only)

2.3 Scheduled Triggers

Nightly at 01:00:

Re-scan all in-progress tasks

Recalculate date logic

Identify overdue/critical tasks

Check workload balance anomalies

Identify missing evidence for tasks near completion

3. QA Categories & Tests

Below is the complete PIT QA test matrix.

It is identical in structure to Course Crafter QA so Foreman can enforce consistency.

3.1 Structure QA

Ensures PIT hierarchy is valid.

Tests
Test ID	Description
PIT.STR.1	Each task must belong to a deliverable or project
PIT.STR.2	Each deliverable must belong to a milestone
PIT.STR.3	Each milestone must belong to a project
PIT.STR.4	No orphaned tasks / deliverables / milestones
PIT.STR.5	Organisation → project → milestone → deliverable → task chains valid
PIT.STR.6	No circular dependencies
PIT.STR.7	Task clusters correctly expand into tasks
PIT.STR.8	Deleted nodes cascade correctly (but leave audit history)

Fail Examples:

“Deliverable belongs to deleted milestone.”

“Task has no parent deliverable and no project link.”

Severity: HIGH

3.2 Timeline & Date Logic QA

Ensures PIT timelines are correct, realistic, and consistent.

Tests
Test ID	Description
PIT.TIME.1	Task end date = start date + duration
PIT.TIME.2	Deliverable start = minimum of its tasks
PIT.TIME.3	Deliverable end = maximum of its tasks
PIT.TIME.4	Milestone start/end boundaries align with deliverables
PIT.TIME.5	Project boundaries align with milestones
PIT.TIME.6	No task extends beyond milestone/project boundaries unless override approved
PIT.TIME.7	Status matches date window (not_active/upcoming/active/due/overdue/critical)
PIT.TIME.8	Quick-win vs medium vs long-term classification respected

Fail Examples:

“Task ends after milestone end. Override required.”

“Deliverable has tasks ending before they start.”

“Project duration inconsistent with milestone boundaries.”

Severity: HIGH

3.3 Progress & Status QA

Ensures progress calculations are mathematically correct.

Tests
Test ID	Description
PIT.PR.1	Task progress 0–100 only
PIT.PR.2	Deliverable progress average = mean(child tasks)
PIT.PR.3	Milestone progress = weighted average(child deliverables)
PIT.PR.4	Project progress = weighted average(child milestones)
PIT.PR.5	Status auto-switches when hitting deadlines
PIT.PR.6	Progress cannot be 100 without evidence when evidence required
PIT.PR.7	“Critical” overdue tasks escalate automatically

Fail Examples:

“Progress at deliverable level does not match calculated value.”

“Task marked complete without evidence.”

Severity: MEDIUM–HIGH

3.4 Evidence Workflow QA

Ensures evidence and audit chains are intact.

Tests
Test ID	Description
PIT.EV.1	Tasks requiring evidence have at least one uploaded item
PIT.EV.2	Evidence items stored correctly (hash + metadata)
PIT.EV.3	Evidence has reviewer + timestamp
PIT.EV.4	AI evaluation produced
PIT.EV.5	Evidence not editable after approval
PIT.EV.6	Audit trail exists for all evidence interactions
PIT.EV.7	Evidence linked to correct task

Fail Examples:

“No evidence for completed task.”

“Evidence uploaded but no reviewer assigned.”

Severity: HIGH

3.5 Permissions & Role QA

Check that only correct roles are performing actions.

Tests
Test ID	Description
PIT.PERM.1	Project Owner actions only by Project Owners
PIT.PERM.2	Milestone Owner cannot edit other milestones
PIT.PERM.3	Task Owner cannot change project hierarchy
PIT.PERM.4	Only Admin can override dates
PIT.PERM.5	Evidence approver must be above task owner

Fail Examples:

“Deliverable edited by unauthorised user.”

“Task deadline override attempted by non-admin.”

Severity: HIGH (Security implications)

3.6 Model Routing QA

Ensures PIT uses the correct models for AI functions.

Routing Rules
Task	Model
Suggesting milestones	GPT-5
Breaking deliverables into tasks	GPT-5
Evaluating evidence	GPT-4o / GPT-5
Workload analysis	GPT-4o
Budget forecasting	GPT-5
Email/notification text	GPT-4.1-mini
Simple Q&A	GPT-4.1-mini
Tests
Test ID	Description
PIT.AI.1	Simple Q&A not routed to GPT-5
PIT.AI.2	Evidence evaluation not routed to incorrect model
PIT.AI.3	Budget forecast using GPT-5 (not GPT-4o)
PIT.AI.4	Timeline suggestions use GPT-5
PIT.AI.5	No unnecessary high-cost model usage

Severity: MEDIUM–HIGH
(Incorrect model = incorrect logic or unnecessary cost.)

3.7 Security QA

Ensures PIT protects sensitive company data.

Tests
Test ID	Description
PIT.SEC.1	Evidence documents scanned & sanitized
PIT.SEC.2	No executable file uploads
PIT.SEC.3	Permissions enforced on evidence access
PIT.SEC.4	Role escalation logged
PIT.SEC.5	All PIT actions logged for audit trail

Severity: CRITICAL

3.8 Watchdog Monitoring

The Watchdog is PIT’s “always-on” health monitor.

Monitored Conditions

High volume of overdue tasks

Sudden spike in critical tasks

Repeated evidence-upload failures

AI evaluation errors

Render failures (timeline graphics)

Date logic loops

Missing parent entities

Extreme workload imbalance

Unusual CAPEX/OPEX spikes

Actions

Create Watchdog Alerts in dashboard

Notify Foreman

Recommend Builder tasks

Escalate “critical overdue” items

4. QA Dashboard (Backoffice UI)

The PIT QA Dashboard appears under:

/admin/pit/qa-dashboard

4.1 Left Sidebar Filters

Project

Organisation → division → team

Responsible person

Status

Progress %

Overdue (0–5 / 5–10 / 10+)

Evidence completeness

Quick-win vs medium vs long-term

4.2 Middle Table

Columns:

Project

Task/Milestone/Deliverable

QA status (Green / Amber / Red)

Last run

Failures

Evidence status

“Run QA” button

4.3 Right Panel (Drill-down)

Shows:

Category summaries

Detailed failures

Suggested fixes

Buttons:

Auto-Fix

Re-run QA

Create Builder Task

5. Watchdog UI

Watchdog appears:

In PIT sidebar

In global system dashboard

In Foreman console

Displays:

Alerts

Severity

Affected entities

Suggested actions

Auto-fix buttons

“Explain This Alert” (AI analysis)

6. QA Integration with Foreman

Foreman uses PIT QA to:

Block invalid timeline changes

Block project publishing with errors

Prevent regression

Ensure wiring stays intact

Ensure data model stays aligned

Create tasks for Builder agents

Foreman Rules

If RED → block action

If YELLOW → allow but warn

If GREEN → allow

Auto-fix available for most YELLOW cases

RED requires Builder intervention

7. File Versioning

This is:

PIT_QA_IMPLEMENTATION_PLAN_v0.1.md

v0.2 → After timeline engine is built

v1.0 → After PIT MVP is complete

v2.0 → After HR/KPI integration