ERM_QA_IMPLEMENTATION_PLAN_v1.1.md

Enterprise Risk Management — Quality Assurance & Implementation Plan
Version 1.1
Aligned with:

ERM_TRUE_NORTH_v1.0.md

ERM_DATABASE_SCHEMA_v1.1.md

ERM_EDGE_FUNCTIONS_v1.1.md

ERM_FRONTEND_COMPONENT_MAP_v1.1.md

ERM_WIREFRAMES_v1.1.md

Maturion One-Time Build & Zero-Regression Standards

SRMF Risk Governance Requirements

0. PURPOSE

The purpose of this QA plan is to guarantee accuracy, stability, and governance integrity of all ERM functions across:

Backend logic

Data schema

UI

AI-assisted suggestions

Role & permission enforcement

Integration with RA, WRAC, PIT, Bowtie, Incident, Audit, Remote Assurance

ERM is the supreme authority for all risk scoring.
No module may override or deviate from ERM rules.

This QA plan ensures:

Functional correctness

Deterministic outputs

Compliance

Zero regression

Auditability

Traceability

Security & RLS correctness

ERM errors propagate into every risk module.
Therefore ERM QA must exceed typical QA rigor.

1. QA PHILOSOPHY

ERM QA must follow these guiding principles:

ERM must be unbreakable
A single mistake at ERM cascades into RA, WRAC, PIT, Bowtie, etc.

Profiles must be mathematically consistent
Likelihood + Impact → Heatmap must always resolve to a valid cell.

All scales must be deterministic
Exact same input = exact same output.

Version immutability is mandatory
Published ERM profiles cannot be altered.

Hierarchy inheritance must be predictable
Overrides cannot conflict with parent logic.

AI cannot modify ERM directly
All AI output must go through human approval and logging.

Integration consistency
ERM outputs must match RA scoring, WRAC mapping, PIT prioritisation, etc.

2. QA SCOPE

QA covers the following components:

2.1 Backend

Edge Functions

Access control & RLS

Database constraints

Versioning

Validation logic

Integration endpoints

AI suggestion endpoints (read-only)

2.2 Frontend

UI components

Navigation / routing

Validations

Error states

Role-based guards

Draft/publish lifecycle

Comparison and diff visualisation

2.3 Data

Likelihood levels

Impact scales

Heatmap geometry

Appetite thresholds

Overrides & inheritance

Profiles version integrity

2.4 Integrations

Risk Assessment Engine

WRAC

Controls Engine

PIT

Bowtie

Incident

Audit

Remote Assurance

2.5 Governance

Approvals

Audit trail

Change tracking

Export bundles

Parent/child sign-off logic

3. QA ENVIRONMENTS

ERM requires the following environments:

3.1 Development

Used by Builders for component construction.

3.2 Integration Test

Where ERM is tested in combination with:

Threat Module

Vulnerability Module

RA Engine

PIT

WRAC

Incident

Audit

3.3 Pre-Production (Approval Only)

Used for:

Profile approval

Parent sign-off

Audit validation

3.4 Production

Contains only published profiles.
Only ERM Admins can activate new versions.

4. QA CHECKLISTS
4.1 Likelihood Scale QA

Goals:

Levels contiguous (1..N)

Scores unique

Scores > 0

Descriptors non-empty

Guidance text present

Colour valid

Tests:

Create likelihood with missing level → FAIL expected

Duplicate score → FAIL expected

Missing descriptor → FAIL

Non-contiguous levels → FAIL

Update a published profile → FAIL (immutability test)

Save valid scale → PASS

Load in Threat Module → PASS

4.2 Impact Scale QA

Goals:

Domain-specific

Levels contiguous

Financial thresholds non-overlapping

Colours valid

Tests:

Overlapping thresholds → FAIL

Missing domain definition → FAIL

Duplicate levels → FAIL

Update in draft → PASS

Update on published → FAIL

RA Engine consumption → PASS

4.3 Heatmap QA

Goals:

Full NxN grid

All cells assigned risk levels

No conflicting risk levels

Colour gradients correct

Numeric ranges consistent

Appetite default correctly mapped

Tests:

Generate 5x5 matrix → PASS

Remove a cell → FAIL

Set invalid colour → FAIL

Modify heatmap in published profile → FAIL

Validate RA classification mapping → PASS

4.4 Appetite Rules QA

Goals:

One appetite per domain

Appetite must be valid ERM risk level

Trigger ranges must not conflict

Must integrate cleanly with PIT escalation

Tests:

Appetite level not in risk_level_enum → FAIL

Trigger scoring overlaps across domains → FAIL

Appetite > Extreme → FAIL

Appetite < Very Low → FAIL

RA → Appetite → PIT escalation → PASS

4.5 Hierarchy & Inheritance QA

Goals:

Inheritance works

Overrides within allowed bounds

Parent approval required

No circular recursion

Tests:

Parent override without approval → FAIL

Cycle detection → FAIL

Inherited vs overridden domains test → PASS

Child profile effective resolution test → PASS

4.6 Approval Workflow QA

Goals:

Draft → Pending → Approved → Published

Reject returns to draft

Only authorised roles can approve

Audit logging correct

Tests:

Reviewer approves → PASS

Non-reviewer approves → FAIL

Publish without approval → FAIL

Publish with approval → PASS

Change after publish → FAIL

4.7 Integration QA
RA Engine

Likelihood mapping correct

Impact mapping correct

Residual → heatmap → appetite flow correct

WRAC

Heatmap colours & descriptors load correctly

Appetite flags displayed

PIT

Appetite → priority mapping correct

Escalation levels correct

Bowtie

Risk severity → barrier criticality correct

Incident

Incident severity → ERM risk mapping correct

Remote Assurance

Control degradation → appetite breach → PIT auto-task correct

Audit

NCR → appetite level → escalation correct

5. FORMAL TEST CASES (SELECTED)

Below are illustrative examples; full list will be in the automated test suite.

TC-ERM-001

Test: Create ERM profile with incomplete likelihood scale
Expected: Error ERM003
Result: PASS/FAIL

TC-ERM-012

Test: Generate heatmap with missing cell
Expected: Error ERM004
Result: PASS/FAIL

TC-ERM-027

Test: Attempt to modify published profile
Expected: Error ERM008
Result: PASS/FAIL

TC-ERM-055

Test: Child override exceeding parent appetite
Expected: Error ERM009
Result: PASS/FAIL

TC-ERM-088

Test: RA engine → appetite classification
Expected: Correct appetite_condition returned
Result: PASS/FAIL

TC-ERM-123

Test: PIT escalation correctly triggered when appetite breached
Expected: PIT priority = Critical
Result: PASS/FAIL

6. REGRESSION TEST SUITE

Regression must execute whenever ANY ERM change occurs:

All CRUD tests

All validation tests

All heatmap generation tests

Appetite evaluation tests

All integration API tests

UI smoke tests

AI suggestion sanity checks

No ERM update may be deployed without passing ALL regression cases.

7. AI QA

AI suggestions must be tested for:

Non-authoritative behaviour

No auto-writes

Rationale clarity

Confidence reporting

Alignment with ERM version

No hallucination of risk levels or colours

Test cases:

AI proposes invalid levels → FAIL

AI proposes missing descriptors → FAIL

AI proposes appetite beyond allowed → FAIL

AI suggests valid improvements → PASS

8. SECURITY QA (RLS, RBAC)

Tests include:

ERM_REVIEWER can approve but not publish

ERM_MANAGER can edit drafts only

ERM_ADMIN can publish

CHILD_ORG users cannot change parent ERM

Auditors can read all but edit none

AI cannot bypass RLS

All events logged

9. EXPORT QA

Exports must:

Be identical to live profile

Pass schema validation

Match heatmap geometry

Include version and signature metadata

Use checksums for integrity

Test export → re-import → identical result.

10. PERFORMANCE QA

ERM requires high read performance:

Heatmap fetch < 100ms

Appetite evaluation < 100ms

Profile bundle fetch < 150ms

These are critical because RA, PIT, WRAC, Incident, Bowtie all depend on them.

11. FAILURE MODE TESTING

Corrupted likelihood scale → system must refuse publish

Incomplete heatmap → system must block publish

Appetite missing domain → block publish

Inheritance override conflicts → block publish

AI suggestion low confidence → warn, allow reject

DB index corruption → system enters safe mode

12. QA SIGN-OFF REQUIREMENTS

ERM module may be signed off ONLY after:

100% automated tests passing

Full regression success

Manual UX tests validated

Audit trail verification

Parent/child inheritance tests

Integration tests across RA, WRAC, PIT, Bowtie, Incident

AI behaviour tests passed

Security (RLS & RBAC) verified

Documentation complete

No outstanding critical bugs

13. IMPLEMENTATION PHASES
Phase 1 — Foundations

Database tables

CRUD APIs

Likelihood/Impact editor

Heatmap generator

Phase 2 — Appetite & Hierarchy

Appetite rules

Inheritance engine

Overrides

Phase 3 — Approvals & Publishing

Workflow engine

Audit log

Status lifecycles

Phase 4 — Integrations

RA mapping

WRAC colour mapping

PIT prioritisation

Remote Assurance hooks

Phase 5 — AI

Scales

Heatmap

Appetite

Profile diff explanation

Phase 6 — Regression & Hardening

Full automated test suite

Security testing

Performance testing

Phase 7 — Release Candidate

Final validation

Governance sign-off

Publish to production

✔ END OF ERM_QA_IMPLEMENTATION_PLAN_v1.1.md