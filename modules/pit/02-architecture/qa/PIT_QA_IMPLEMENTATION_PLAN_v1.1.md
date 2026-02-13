Below is the fully upgraded, comprehensive, enterprise-grade PIT_QA_IMPLEMENTATION_PLAN_v1.1.md, aligned with:

PIT_TRUE_NORTH_v1.0.md

PIT_DATABASE_SCHEMA_v1.1.md

PIT_EDGE_FUNCTIONS_v1.1.md

PIT_FRONTEND_COMPONENT_MAP_v1.1.md

PIT_WIREFRAMES_v1.1.md

Maturion True North & One-Time Build Philosophy

This is the QA command manual the Foreman and Builders will use to validate PIT functionality throughout all cycles: development → integration → production.

Place in:

/Modules/PIT/Architecture/PIT_QA_IMPLEMENTATION_PLAN_v1.1.md

PIT_QA_IMPLEMENTATION_PLAN_v1.1.md

Project Implementation Tracker — Quality Assurance & Implementation Plan
Version 1.1
Supersedes: PIT_QA_IMPLEMENTATION_PLAN_v0.1.md
Scope: Full lifecycle QA, Zero Regression testing, automated AI QA, integration tests, performance tests, and UI/UX QA.

0. PURPOSE

This QA plan ensures that the PIT module is:

Functionally correct

Architecturally compliant

Integrates with all ISMS modules

Stable under load

AI-driven but fully auditable

Aligned to True North and One-Time Build

Never regresses

This QA plan is the single source of truth governing PIT verification.

1. QA PRINCIPLES

Zero Regression

No change is permitted unless corresponding regression tests are updated.

All tests must be automated where possible.

One-Time Build

PIT must be built cleanly and fully once, with no patchwork.

Holistic Testing

Every PIT component must be validated with its upstream and downstream integrations.

AI-Assisted QA

The PIT AI agents must be used for test case expansion, edge-case generation, and automated scenario validation.

Shift-Left QA

QA begins at design level, not after development.

Continuous QA Pipeline

Every push triggers:

Linting

Unit tests

Integration tests

Schema validation

UI snapshot check

AI simulation tests

Watchdog risk checks

2. QA SCOPE
2.1 Functional QA

Covers all PIT features:

Projects

Phases

Work Packages

Tasks

Subtasks

Dependencies

Evidence

Progress logs

AI assistants

Watchdog logic

Gantt view

Clusters

Integrations

Exports

Notifications

2.2 Non-Functional QA

Performance (task tables, Gantt)

Load testing

Latency thresholds

Edge function timeout behaviour

File upload stability

P95 AI inference times

2.3 Security QA

RLS validation

Access control

API misuse tests

Audit trail immutability

2.4 Integration QA

Risk → PIT

WRAC → PIT

Controls → PIT

Incident → PIT

Audit → PIT

Bowtie → PIT

Remote Assurance → PIT

2.5 AI QA

Task generation accuracy

Scheduling recommendations

Evidence scoring correctness

Predictive modelling

Drift monitoring

3. QA ENVIRONMENTS
ENV 1: Local Dev
ENV 2: Staging (seeded with synthetic tasks)
ENV 3: Pre-Production (full integrations)
ENV 4: Production


Each environment must maintain:

RLS boundaries

Tenant isolation

Feature flags

Version tracking

4. TEST CATEGORIES (MASTER OVERVIEW)

PIT QA uses 11 categories:

1. Unit Tests
2. API Tests (Edge Functions)
3. DB Schema Validations
4. Integration Tests (Cross-module)
5. AI Behaviour Tests
6. UI/UX Snapshot Tests
7. Performance Tests
8. Watchdog Tests
9. Security Tests
10. Export Tests
11. End-to-End Scenarios


Each is defined below.

5. UNIT TESTS

Unit tests validate individual PIT components.

5.1 Task Creation

Valid inputs

Invalid inputs

Missing fields

RLS violations

Cost parsing

Risk/control linking

5.2 Dependency Builder

FS/SS/FF/SF logic

Lag validation

Circular dependency detection

5.3 Progress Calculation

Rollup logic

Subtask integration

100% verification

Status transitions

5.4 Evidence Processor

File type validation

Size limits

Hash consistency

Metadata extraction

Coverage target: 95%+
6. API TESTS (EDGE FUNCTIONS)

Tests must cover:

Authentication

Authorization

RLS enforcement

Payload validation

Error codes (PIT001–PIT010)

Side effects (task rollups, risk updates)

Example tests:

/pit/task/create

Should create task with required fields

Should reject unauthorized users

Should auto-generate audit log

Should generate AI suggestions if enabled

/pit/schedule/run

Must compute critical path

Must handle lag and constraints

Must detect invalid date ranges

7. DATABASE SCHEMA TESTS
Validations:

Primary/foreign key integrity

Index existence

Soft-delete fields required

Versioning fields present

Full-text search indexes exist

Check constraints (priority, status, evidence type)

Migration Testing

Each migration requires:

Forward migration test

Backward migration test

Data consistency test

No orphan rows

8. INTEGRATION TESTS

These tests ensure PIT interacts correctly with every module.

8.1 WRAC → PIT

Task cluster creation

Correct linked control set

Correct risk mitigation % seeds

Cost mapping

AI validation of cluster completeness

8.2 Risk Assessment → PIT

Projected risk update after PIT progress

Correct residual risk recalculation

Mitigation % feedback

8.3 Control Library → PIT

Control selection

Work package auto-generation

Evidence requirements passed correctly

8.4 Incident Module → PIT

Correct mapping of corrective actions

Enforcement of evidence requirements

Auto-prioritisation (severity → task priority)

8.5 Audit Module → PIT

NCR mapping

Task grouping by NCR

Correct closure requirements

8.6 Remote Assurance → PIT

System availability failures produce tasks

Severity → priority mapping

Control-effectiveness feedback

8.7 Bowtie → PIT

Barrier degradation → tasks created

Dependency pre-mapping (barriers sequence)

9. AI BEHAVIOUR TESTS

AI-related QA tests ensure consistency and explainability.

9.1 AI Task Generation

Test set:

Should generate consistent WBS

Should not hallucinate controls

Should correctly interpret WRAC control sets

Should generate dependency graph

Should assign durations within realistic ranges

9.2 AI Scheduling

Must predict delays correctly

Must not shorten durations below min-days

Must generate valid recommended reschedule

9.3 AI Evidence Review

Validate image/document recognition

Consistent scoring

No false accept of invalid evidence

9.4 AI Drift Detection

AI output must remain consistent across time → drift monitoring.

10. UI / UX TESTS

UI tests include:

Component render tests

Navigation flow tests

Form validation

Drawer open/close

Table virtualization

Gantt rendering

Snapshot Testing

All major views must have snapshot tests to detect unintended UI changes.

11. PERFORMANCE TESTS
11.1 Task Table

Must support:

10,000+ tasks

Smooth scrolling

Instant filtering (<150ms)

11.2 Gantt

Pre-cached timeline

Render under 200ms

No lag when zooming

11.3 Evidence Upload

200MB max file stability

Upload <5 seconds for 20MB file

12. WATCHDOG TEST SUITE
Must detect:

Overdue tasks

Missing evidence

Stalled tasks

Risk mismatch

Cost overruns

Critical control failures

Must support AI auto-fix:

Reassign

Extend schedule

Add buffer

Suggest workflow correction

13. SECURITY TESTS
13.1 RLS

User should NEVER see tasks from another org

User should only manage projects they own or are assigned to

13.2 Privilege Escalation Tests

Cannot approve own tasks if forbidden

Cannot override Watchdog if not admin

13.3 File Security

Evidence must not be publicly accessible

Signed URLs required

13.4 SQL Injection / API Misuse

Inputs sanitized

Error codes returned properly

14. EXPORT TESTS

Verify compliance with PIT_EXPORT_SPEC_v1.0.md.

Tests include:

PDF content correctness

Table formatting

Accurate dates

Accurate dependencies

Accurate progress %

Acceptable file size (<5MB for PDFs)

15. END-TO-END SCENARIOS

These scenarios simulate real-world flows.

E2E Scenario 1: WRAC → PIT → RA Feedback Loop

Approve WRAC controls

PIT auto-creates project & tasks

User updates progress

RA heatmap updates automatically

E2E Scenario 2: Incident → PIT → Watchdog → Escalation

Incident generates corrective actions

Task overdue → Watchdog alerts

Escalation email triggers

Resolution closes alert

E2E Scenario 3: Audit Finding → PIT → Evidence → Closure

Auditor creates NCR

PIT tasks loaded

Evidence uploaded

Reviewer approves

Audit module updates status

E2E Scenario 4: Remote Assurance → PIT → Control Effectiveness

Camera offline detected

Task auto-created

Evidence: system restored

Control-effectiveness recalculated

E2E Scenario 5: Full Project Lifecycle

Create project

Add phases

Add tasks/subtasks

Set dependencies

Update progress

Gantt updates

Export final report

16. QA AUTOMATION PIPELINE
Steps:
1. Lint (TS/React)
2. Run Unit Tests
3. Run API Tests
4. Run Integration Tests
5. Run Schema Validators
6. Run AI Stability Tests
7. Run Security Tests
8. Run UI Snapshot Tests
9. Run Performance Benchmarks
10. Generate QA Report

All must pass → deploy allowed.

If ANY fails → block deployment.

17. QA SIGN-OFF CRITERIA

All criteria below must pass:

100% mandatory test coverage

0 unresolved critical defects

All integrations stable

All exports correct

AI behaviour validated

Performance thresholds met

Watchdog active & stable

Security checks passed

Only then can PIT advance to production.

✔ END OF PIT_QA_IMPLEMENTATION_PLAN_v1.1.md