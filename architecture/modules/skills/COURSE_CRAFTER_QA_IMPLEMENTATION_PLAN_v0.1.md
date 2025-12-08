✅ COURSE CRAFTER – QA IMPLEMENTATION PLAN (v0.1)
Backoffice Integration + Foreman Execution Blueprint
0. Purpose of This Document

This blueprint describes:

How QA is embedded inside the Backoffice QA Dashboard

How Foreman triggers and interprets QA checks

How automated + manual QA interact

How QA integrates with project status, rendering, assets, and AI routing

How Watchdog health monitoring works

UI / component details for the admin QA dashboard

Developer guidance for Copilot + Foreman enforcement

Once implemented, Course Crafter gets:

Zero regression behaviour

Clear identification of broken steps

Real-time debugging visibility

Executable health checks

Human-readable failure explanations for Johan

The QA Implementation Plan is the final layer that turns Course Crafter architecture into a self-governing system.

1. QA Architecture Overview

QA is composed of:

1.1 QA Engine (Server-side)

Runs a suite of tests:

Engine 1 QA Suite

Engine 2 QA Suite

Shared QA Suite

Model Routing QA

Security QA

Template QA

Render QA

Each test:

Runs independently

Returns:

PASS / FAIL

message (user-friendly)

tech_detail (developer detail)

fix_suggestion (English explanation)

severity (INFO/WARNING/ERROR)

1.2 Foreman QA Controller

Foreman:

Triggers QA for a given lesson/project

Evaluates results

Flags architecture deviations

Suggests fixes

Sends tasks to Builder agents

Prevents invalid merges/publishes

Foreman enforces:

No lesson can be marked “Rendered” unless QA passes

No project can be “Complete” unless all lessons are QA Green

1.3 QA Dashboard (Backoffice UI)

Visible to Johan and Foreman.

Displays:

Projects

Lessons

QA status

Failures

Fix recommendations

Auto-repair options

Watchdog alerts

Includes:

High-level overview

Drill-down

Failure detail

Evidence panel for debugging

“Run QA again” button

History of changes

1.4 Watchdog Subsystem

Monitors:

Failed render jobs

Missing assets

Long API response times

Incorrect model routing

Storage anomalies

Worker crashes

Displays in:

QA Dashboard

Watchdog panel inside Course Crafter

Foreman logs

2. QA Categories → Dashboard Representation

QA categories appear as Segments inside the dashboard.

For any lesson, dashboard shows:

2.1 High-Level QA Score

Displayed as:

🟢 Green – Fully Compliant
🟡 Amber – Warnings Detected
🔴 Red – Blocker / Cannot Render
2.2 Category Breakdown
A – Structure

Project hierarchy, assets, templates, etc.

B – Engine 1 Workflow

Segment plan, script extraction, TTS, sync, final video integrity.

C – Engine 2 Workflow

Script generation, images, branding, transitions, render validity.

D – AI Model Routing

Ensures correct models used (GPT-4o vs GPT-5 vs free image models).

E – Security Checks

Uploads, sanitisation, allowed file types.

F – Watchdog

Repeated errors, failed jobs, anomalies.

Each category shows:

Number of checks passed

Number failed

Severity weighting

Last execution time

Links to fix suggestions

3. QA Execution Flow (Technical)

Below is exactly how QA executes inside the system.
This is what Foreman uses internally.

3.1 Triggering QA
QA can be triggered in three ways:
1. Manual trigger

From UI:

“Run QA now” at project level

“Run QA for this lesson” inside Engine screen

2. Automatic trigger

When:

Lesson planning saved

Images generated

Voice selected

Render request initiated

Final video produced

3. Scheduled trigger

Nightly QA runs on:

All in-progress lessons

Recently updated lessons

Projects with failed watchdog alerts

3.2 QA Execution Sequence

Validate project hierarchy

Detect required assets

Run Engine-specific checks (Engine 1 or 2)

Segment integrity

Script validity

Image validity

Template validity

Timing alignment

Run Model Routing QA

Run Security checks

Run Watchdog anomaly detection

Aggregate results

Update dashboard

Notify Foreman

If configured → create Builder tasks

3.3 QA Outputs
Per test:
{
  "test_id": "E1.B3-ScriptExtractionIntegrity",
  "status": "FAIL",
  "severity": "ERROR",
  "message": "Script text missing for segment 4",
  "technical": "OCR extracted 0 chars, PPT text not found.",
  "suggestion": "Re-upload PPT file or adjust script manually.",
  "related_asset": "ppt_asset_id"
}


Stored in:

qa_test_results table

Last 100 executions stored per lesson

4. Backoffice QA Dashboard (UI Spec)

Located at:

/admin/course-crafter/qa-dashboard

4.1 Layout Overview
Left Column – Filter Panel

Filter by:

Project

Engine

QA Status

Date range

Severity

Toggle:

Show only FAIL

Show warnings

Middle Column – QA Summary Table

Columns:

Project

Lesson

Engine

Last QA Result (Green/Amber/Red)

Pass %

Last run time

Run QA button

Example:

Project	Lesson	Engine	Status	Pass	Last Run	Actions
Human Rights Course	Lesson 1	E1	🟡	87%	2m ago	Run QA
Security Leadership	Module 2	E2	🔴	64%	12m ago	Run QA
Right Column – Drill-down Panel

When clicking a row:

Shows:

Category Summary

Structure

Engine Workflow

AI Routing

Security

Watchdog

Each has pass/fail count.

Failure Detail

Test ID

Human explanation

Technical detail

Suggested fix

Button: “Auto-fix” (if possible)

Auto-fix can:

Regenerate missing thumbnails

Re-run TTS

Re-sync durations

Re-generate missing images

Re-parse PPT

Foreman also sees:

“Create Builder Task” button

Opens task form

Automatically links test failure

Visual Evidence Panel

Thumbnails

Script text

Audio waveform

Render logs

Timing charts

Allows Johan to understand exactly what failed.

5. Watchdog Integration

The Watchdog is separate from QA but feeds into it.

Watchdog logs:

Repeated render failures

Unusual latency from an AI model

Routing errors

Asset storage corruption

Edge function crashes

Missing expected assets

Long-running tasks (> 30 seconds)

In Dashboard:

“Watchdog Alerts” section

List of alerts + severity

Foreman gets pinged automatically

6. Integration With Foreman Automation

Foreman receives QA results and:

If 🟢 All Pass:

Mark lesson as “QA Passed”

Allow rendering or publishing

Allow next workflow stage

If 🟡 Some Warnings:

Proceed but with caution

Create warnings for Builder

Suggest improvements

If 🔴 Failure:

Block rendering or publishing

Alert Johan

Provide fixes

Create Builder tasks

Ask for additional files (if needed)