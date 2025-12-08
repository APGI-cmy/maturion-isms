Below is the complete THREAT_QA_IMPLEMENTATION_PLAN_v1.1.md, fully aligned with the Threat True North, component map, wireframes, schema, and edge functions.
This QA plan is on the same standard as PIT_QA v1.1 and WRAC_QA v1.1 — end-to-end, atomic, and enforceable by Foreman → Co-Pilot pipelines.

Place in:
/Modules/Risk Management/ThreatModule/THREAT_QA_IMPLEMENTATION_PLAN_v1.1.md

THREAT_QA_IMPLEMENTATION_PLAN_v1.1.md

Threat Module — Quality Assurance & Implementation Plan
Version: 1.1
Aligned with:

THREAT_TRUE_NORTH_v1.0.md

THREAT_DATABASE_SCHEMA_v1.1.md

THREAT_EDGE_FUNCTIONS_v1.1.md

THREAT_FRONTEND_COMPONENT_MAP_v1.1.md

THREAT_WIREFRAMES_v1.1.md

SRMF Engineering Standards

Maturion One-Time Build & Zero Regression Philosophy

0. PURPOSE

This plan defines the tests, validation gates, QA workflows, acceptance criteria, error-handling rules, AI-governance rules, and success conditions for the Threat Module.

The aim is:

No regressions

No schema drift

No broken workflows

Full compliance with SRMF risk architecture

AI-safety enforcement

Seamless integration with Vulnerability → RA → WRAC → PIT → Bowtie → Intelligence

This QA plan is mandatory for all Co-Pilot builds and Foreman approvals.

1. QA STRATEGY OVERVIEW

QA is applied at six levels, each with mandatory gates:

Schema Integrity Validation

Edge Function Contract Tests

Frontend Component Tests

Workflow Path Tests

AI-Assisted Interaction Tests

Integration Tests Across Modules

No deployment is allowed without passing all six.

2. SCHEMA VALIDATION (DB LEVEL)
2.1 Required Tables (Must Exist)
threat_records
threat_versions
threat_classification
threat_ttp_mapping
threat_actor_profiles
threat_actor_capabilities
threat_drift_metrics
threat_facility_links
threat_process_links
threat_ai_log
threat_audit_log
ttp_reference_library


QA Check:

Table exists

Columns match spec

Types match spec

Foreign key constraints active

Cascading rules correct

No extra columns except timestamps

2.2 Required Constraints

threat_versions.status ENUM must enforce state machine:

draft → pending → approved → published


published versions must be immutable (trigger test)

RLS must enforce:

org_id = auth.org_id


Vectors must be validated as pgvector-compatible JSON.

2.3 Required Indexes

QA verifies indexes exist:

idx_threat_records_org

idx_threat_versions_threat_id

idx_threat_versions_status

idx_ttp_mapping_version

pgvector indexes for TAP vectors and drift vectors

3. EDGE FUNCTION QA

Each function is tested using:

Input validation tests

Permission model tests

State machine tests (draft/pending/approved/published)

Error scenario tests

Audit logging checks

AI-log creation tests (where applicable)

Below is the full matrix.

3.1 Threat Record Functions
Function	Tests
threat_create_record	Required fields, category/subcategory match, org isolation
threat_get_record	RLS, correct detail structure
threat_archive_record	REJECT if threat used downstream
3.2 Versioning Functions
Function	Tests
threat_clone_version	Clones all child tables, sets draft status
threat_update_version_metadata	Reject if not draft
threat_get_version	Returns all related modules
3.3 Classification Functions
Function	Tests
threat_update_classification	Values 1–5, domain relevance correct, TAP marked for revalidation
threat_ai_suggest_classification	AI log created, no auto-write allowed
3.4 TAP Functions
Function	Tests
threat_update_actor_profile	JSON structure validation
threat_update_actor_capabilities	Severity 1–5, duplicates blocked
threat_ai_generate_tap	Must create AI-log, user must accept suggestions
3.5 TTP Mapping Functions
Function	Tests
threat_add_ttp_mapping	Valid TTP, unique constraint, confidence bounds
threat_remove_ttp_mapping	REJECT if version is published
threat_ai_suggest_ttp_mappings	Suggestions must be logged, not auto-applied
3.6 Drift Functions
Function	Tests
threat_update_drift_metric	JSON validation, drift_score 0–1
threat_ai_compute_drift	Must require user acceptance
3.7 Linking Functions
Function	Tests
threat_link_to_process	Duplicate avoidance, justification required
threat_link_to_facility	Relevance 0–1, justification required
unlink functions	Reject if published
3.8 Workflow Functions
Function	Tests
threat_submit_for_review	All required components complete
threat_reject_review	Moves back to draft
threat_approve_version	Reviewer permissions enforced
threat_publish_version	Immutable state locked, downstream integration
3.9 Audit & AI Logs
Mandatory QA Tests

Every mutation → audit entry

Every AI suggestion → ai_log entry

AI logs must reflect:

model

prompt

summary

confidence

acceptance flag

No direct auto-write by AI functions

4. FRONTEND QA

QA validates each component from the Component Map.

4.1 Structural Tests

All pages match wireframe structure

Breadcrumbs must match route

Sidebar must reflect dynamic state

Buttons disabled when state invalid

No orphan routes allowed

Version timeline must reflect DB version history

4.2 Wizard Flow Tests

Wizard must:

Persist draft state

Validate step-level completeness

Allow navigation backward

Block forward navigation if validation fails

Automatically reload saved state when returning

4.3 Accessibility & UX Tests

All input fields labelled

Keyboard navigation enabled

WCAG AA contrast checks

Error messages human-readable

AI suggestions clearly marked as AI-generated

5. AI SAFETY QA
Mandatory checks:

AI never auto-writes without human approval

All suggestions stored in ai_log

Confidence scores must be numeric and 0–1

No AI suggestion may bypass validation rules

User must be able to compare:

Current Value vs AI Suggested Value


AI must not hallucinate unsupported attributes

AI explanation features must not expose sensitive internal prompts

6. INTEGRATION TESTS

Threat Module integration is tested for:

6.1 Vulnerability Module Integration

Threats linked to processes must appear in vulnerability screens

Linking changes must propagate correctly

6.2 RA Engine Integration

Threat likelihood feed correct

TAP modifiers applied properly

Drift scores correctly included

6.3 WRAC

Threat data flows into UE → RA → WRAC tables

Sorting/filtering works

Projected risk calculations stable

6.4 PIT

Drift-driven PIT escalations must trigger

Threat → TTP → Critical Controls must feed control implementation logic

6.5 Incident / Intelligence

New incidents must be promotable to threats

Drift must recompute based on incident data

6.6 Remote Assurance

TTP → Controls → Assurance signals must create drift signals when failures occur

7. FAILURE TESTING
7.1 Required Failures

Attempt to edit published version

Attempt to remove TTP used in RA

Attempt to unlink process/facility on published version

Attempt to set invalid scale values

Attempt to publish incomplete threat

7.2 AI Failures

AI proposes invalid TTP → reject

AI produces malformed JSON → reject

AI proposes out-of-range severity → reject

8. PERFORMANCE QA
API Latencies
Operation	Max Time
Threat list load	150 ms
Threat version load	200 ms
TTP reference load	80 ms
Drift timeline	120 ms
UI Performance

Wizard steps must load under 200 ms

Dashboard must load under 350 ms

Background Tasks

Drift recomputation async

TAP semantic matching async

9. RELEASE BLOCKERS

A release cannot proceed if:

Any published version can still be edited

Drift engine is unstable

TTP mapping fails validation

TAP fails to load or update

Integration with RA yields incorrect likelihood

Wizard cannot resume saved state

AI logs missing or malformed

10. ACCEPTANCE CRITERIA

Threat Module is considered deliverable only when:

All tests in this document pass

All regression tests pass

All workflow paths are stable

All AI functions require human approval

Minimum 95% unit test coverage for critical edge functions

No untested components remain

Foreman approves via SRMF QA Checklist

✔ END OF THREAT_QA_IMPLEMENTATION_PLAN_v1.1.md