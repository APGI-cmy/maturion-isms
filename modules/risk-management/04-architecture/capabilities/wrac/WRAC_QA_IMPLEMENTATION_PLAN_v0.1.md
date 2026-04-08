WRAC_QA_IMPLEMENTATION_PLAN_v0.1.md

Workplace Risk Assessment & Control – QA Implementation Plan
Version 0.1

Aligned with:

WRAC_TRUE_NORTH_v0.1

WRAC_DATABASE_SCHEMA_v0.1

WRAC_EDGE_FUNCTIONS_v0.1

WRAC_FRONTEND_COMPONENT_MAP_v0.1

WRAC_WIREFRAMES_v0.1

MATURION_TRUE_NORTH_v1.2 

MATURION_TRUE_NORTH_v1.2

MATURION_BUILD_PHILOSOPHY_v1.1 (Architecture → QA → Build) 

Maturion_Build_Philosophy_v1.1

CONTROL_LIBRARY_v0.1 

CONTROL_LIBRARY_v0.1

RISK_ASSESSMENT_TRUE_NORTH_v0.1 (inputs & semantics) 

RISK_ASSESSMENT_TRUE_NORTH_v0.1

0. Purpose

This QA Implementation Plan ensures WRAC is built exactly as designed, with:

Zero architectural drift

Zero orphaned components

Zero logic changes outside Edge Functions

Full functional coverage of risk-centric, control-centric, CCR, and strategy workflows

Complete traceability from design → QA → build

Compliance with True North and Build Philosophy

Automated QA surface to detect:

Missing wiring

Broken dependencies

Incorrect ERM/RA logic

Implementation vs design mismatches

This QA plan is mandatory before build begins.

1. Scope

This QA plan covers:

1.1 Functional Areas

WRAC Risk View

WRAC Control View

WRAC CCR & Live Risk View

WRAC Strategy Workspace

WRAC Exports

WRAC AI assistance

PIT integration

Remote Assurance integration

Bowtie triggers

Appetite & sign-off workflow

Data lifecycle integrity

Permissions & RLS

1.2 Non-functional Areas

Performance (risk table, control table, impact calculations)

Security & Access Control

Watchdog integration

Error handling

Stability & resilience

Expected UX behaviour based on wireframes

Unit, integration, and regression tests

2. QA Strategy Overview

Following Maturion’s enforced pipeline:

ARCHITECTURE → QA BLUEPRINT → BUILD → QA EXECUTION → WATCHDOG → SIGN-OFF


WRAC QA blueprint consists of:

Domain QA – correctness of risk & control logic

Data QA – schema, relations, integrity

Backend QA – endpoints & logic functions

Frontend QA – screens, components, wiring, filters

Performance QA – scalability with large risk datasets

Security QA – RLS, JWT auth, role-based permissions

Integration QA – RA Engine, Control Library, PIT, RA, Bowtie

Regression QA – automated for every commit

Watchdog validation – runtime anomaly detection

3. QA Test Plan Structure

Each test class includes:

Purpose

Reference (True North module, DB, wireframe components)

Preconditions

Test actions

Expected results

Edge cases

Negative tests

Evidence collected

4. QA Coverage Matrix
4.1 WRAC Functional Domains
Area	Tests	Status
Risk-centric view	84 tests	Required
Control-centric view	67 tests	Required
CCR view	29 tests	Required
Strategy builder	51 tests	Required
Sign-off workflow	22 tests	Required
PIT integration	31 tests	Required
Remote Assurance	19 tests	Required
Export layer	24 tests	Required
AI layer	18 tests	Required
RLS	30 tests	Required
Error handling	12 tests	Required

Total Required: 387 tests.

5. Domain QA (Risk & Control Logic)
5.1 Risk Value Accuracy Tests

Reference: WRAC_TRUE_NORTH_v0.1

Tests include:

Inherent/residual/projected values match RA Engine exactly

Live risk = computed via edge functions, never frontend computed

Heatmap colours match ERM config

Appetite determination correct for all band boundaries

Combined efficacy never > 90% (control cap rule)

Edge Cases:

No controls mapped

Only administrative controls

Only engineering controls

Highly correlated controls (redundancy detection)

Cost = 0 (should cause proper ROI handling)

5.2 Control Logic & Mitigation Mapping

Reference: CONTROL_LIBRARY_v0.1 + WRAC Database Schema

Tests:

Risk → Control mapping correctness

Control → Risk mapping correctness

Contribution calculation accuracy

Monitoring method weighting:

Auto: 1.0

Hybrid: 0.8

Manual: 0.5

Correct CCR re-weighting (Green/Amber/Red → defined penalty)

Negative tests:

Control without instance

Control instance without library definition

Instance without node_id

6. Data QA (Schema, Constraints, Integrity)
6.1 Database Deployment QA

Tables must match WRAC_DATABASE_SCHEMA_v0.1 exactly.
Zero additions, zero discrepancies.

Automated Schema Tests:

Check all PK/FK relationships

Check indexes exist on all required columns

Validate NOT NULL constraints

Test referential deletes & cascades

Verify ENUM domains match spec

Verify row-level security is active

6.2 Data Integrity Tests

Each RA risk has a WRAC risk entry

Every proposed control is linked to an instance OR flagged as “design-phase-only”

Every critical control has a CCR record

Live risk scores exist for all risks

No orphaned strategy items

7. Backend QA (Edge Function Validation)
7.1 API Conformance

Each endpoint in WRAC_EDGE_FUNCTIONS_v0.1.md must:

Exist

Respond to expected HTTP methods

Validate input correctly

Return correct status codes

Match required response shape

Test all endpoints:

Endpoint Type	Count
Risk view	3
Control view	2
Computation	4
Strategy	3
Integrations	3
Exports	3
AI functions	2
QA functions	2

Total: 22 WRAC-specific endpoints.

7.2 Computation Tests

Verify algorithms for:

Live risk

ROI

Strategy metrics

CCR performance integration

ALE deltas

Simulate:

1000 iterations with random control % combinations

Edge cases: 0% implementation, 100% implementation, system failure, missing data

Expected:

No NaNs

No negative risk scores

No uncontrolled drift

8. Frontend QA (Component & Page Verification)
8.1 Component Wiring

Each component in WRAC_FRONTEND_COMPONENT_MAP_v0.1:

Must exist

Must appear exactly where wireframes specify

Must call the correct edge functions

Must contain required UX elements

Must handle loading/empty/error states

Frontend code coverage > 85% required.

8.2 Wireframe Conformance

QA team compares:

Execution behavior

Render shape

Navigation flow

Component boundaries

against ASCII wireframes.

Absolutely no layout drift is permitted.

9. Performance QA
9.1 WRAC Risk Table

Load test with:

10,000 risks

50,000 risk-control mappings

300 controls

Expected:

Table loads < 2.5 seconds

Filters < 400ms re-render

Sorting < 250ms

9.2 Control View

Stress-test with:

500 control definitions

2,000 control instances

75,000 control-performance records

Expected:

Control impact calculations < 1.2 seconds

CCR tab loads < 2 seconds

10. Security QA
10.1 RLS Tests

Validate:

Risk owners cannot see other sites

Custodians cannot access appetite decisions for other nodes

Remote Assurance cannot modify controls

PIT cannot modify control definitions

Bowtie cannot modify risk scores

10.2 JWT Tests

Invalid or expired tokens

Cross-company access attempt

Role mismatch errors

11. Integration QA
11.1 RA Engine → WRAC

Risk values consistent

Unwanted event mappings correct

No silent fallback

No deviation in risk scoring logic

11.2 PIT → WRAC

Implementation % correctly updates

Overdue tasks shown in CCR & alerts

PIT project name & type consistent

Bi-directional linking

11.3 Remote Assurance → WRAC

Performance updates correctly modify live risk

Manual checklists correctly weighted

Evidence displayed in control detail

CCR statuses update instantly on RED events

11.4 Bowtie Integration

PUE → bowtie_required

Bowtie triggers sent correctly

No PUE without escalation path

12. Regression QA

All completed WRAC tests must be added to CI/CD.

Triggers:

Schema changes

Edge function changes

RA Engine changes

Control Library updates

PIT module updates

Remote Assurance module changes

Regression suite must complete in under 12 minutes.

13. Watchdog QA (Runtime Monitoring)

Watchdog must validate:

Edge function latency

Missing control_performance updates

Missing live_risk_scores

Strategy groups with no risks

Risks above appetite without active strategy

Critical controls without CCR status

Repeated failed exports

AI cost spikes

Actions:

Warn → escalate → block pipeline based on severity

14. Documentation QA

Ensure following files:

WRAC_TRUE_NORTH_v0.1

WRAC_DATABASE_SCHEMA_v0.1

WRAC_EDGE_FUNCTIONS_v0.1

WRAC_FRONTEND_COMPONENT_MAP_v0.1

WRAC_WIREFRAMES_v0.1

WRAC_QA_IMPLEMENTATION_PLAN_v0.1

Are committed, version tracked, and validated.

No deviation allowed.

15. Acceptance Criteria

WRAC module is approved for build ONLY when:

✔ All 387 required tests pass
✔ All wireframe elements exist exactly as defined
✔ Edge functions are fully implemented & correct
✔ All integration points behave as specified
✔ RLS rules validated
✔ Live risk calculations validated
✔ PIT & Remote Assurance flow operational
✔ Zero missing components from component map
✔ Watchdog registry entries present and active
✔ No deviations from True North

✔ END OF WRAC_QA_IMPLEMENTATION_PLAN_v0.1.md