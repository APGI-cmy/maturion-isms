Below is the complete ERM_SPRINT_PLAN_v1.0.md, engineered at the same depth, clarity, and build-readiness as the PIT and WRAC sprint plans.
This sprint plan assumes the same One-Time Build, Zero Regression, True North governance used throughout the Maturion ISMS.

Place in:
/Modules/Risk Management/ERM framework/ERM_SPRINT_PLAN_v1.0.md

ERM_SPRINT_PLAN_v1.0.md

Enterprise Risk Management — Development Sprint Plan
Version 1.0
Aligned with:

ERM_TRUE_NORTH_v1.0.md

ERM_DATABASE_SCHEMA_v1.1.md

ERM_EDGE_FUNCTIONS_v1.1.md

ERM_FRONTEND_COMPONENT_MAP_v1.1.md

ERM_WIREFRAMES_v1.1.md

ERM_QA_IMPLEMENTATION_PLAN_v1.1.md

ERM_EXPORT_SPEC_v1.0.md

Maturion Build Philosophy

SRMF Governance Framework

0. PURPOSE

This sprint plan defines the end-to-end implementation roadmap for the ERM module, structured across 7 sprints.
It ensures:

Controlled, disciplined development

Predictable delivery sequencing

No missing dependencies

Continuous QA alignment

Stable integration with the entire Risk Management suite

ERM is the foundation for everything in the SRMF.
Therefore, this sprint plan includes extensive validation, governance, and integration steps.

1. HIGH-LEVEL IMPLEMENTATION SEQUENCE
SPRINT 1 — Baseline Infrastructure & Profile Engine
SPRINT 2 — Likelihood & Impact Scales
SPRINT 3 — Heatmap Engine & Risk Matrix
SPRINT 4 — Appetite Rules & Domain Governance
SPRINT 5 — Hierarchy, Inheritance & Approvals
SPRINT 6 — Exports, Comparison, Audit, AI Assist
SPRINT 7 — Integration, Hardening, Governance Sign-Off


Each sprint contains:

Objectives

Tasks

Deliverables

Acceptance Criteria

Dependencies

Risks & Mitigations

2. SPRINT 1 — ERM BASE INFRASTRUCTURE & PROFILE ENGINE

Duration: 2 weeks
Focus: Database, profile lifecycle, core contracts

2.1 Objectives

Create foundational DB tables

Implement profile CRUD lifecycle

Build versioning logic

Implement RLS and RBAC

Create profile list/view/create pages

Implement audit logging foundational layer

2.2 Tasks

Create tables: erm_profiles, erm_audit_log, erm_approval_records

Implement API:

erm_create_profile

erm_clone_profile

erm_get_profiles_for_org

erm_get_active_profile

Implement versioning & immutability rules

Build UI pages:

Profiles list

Create profile

View profile summary

Implement audit scaffolding

Add ERM RoleGuard logic

Unit test: DB, RBAC, versioning

2.3 Deliverables

Working ERM profile system

Immutable versioning logic

Audit trail foundation

2.4 Acceptance Criteria

Profile creation works across organisations

Draft profiles editable, published are immutable

Audit events logged correctly

2.5 Sprint Risks

Misconfigured versioning → regression

Incorrect RLS → security risk

Mitigation: strict QA from ERM_QA_IMPLEMENTATION_PLAN_v1.1.md

3. SPRINT 2 — LIKELIHOOD & IMPACT SCALES

Duration: 2 weeks

3.1 Objectives

Implement likelihood scale editor

Implement impact scale editor (multi-domain)

Validation rules for contiguous levels & unique scores

Domain tabs

ARO & ALE mapping compatibility

3.2 Tasks

DB: erm_likelihood_levels, erm_impact_levels, erm_domain_config

API:

erm_set_likelihood_levels

erm_set_impact_levels

erm_get_likelihood_scale

erm_get_impact_scale

UI:

Likelihood Editor

Impact Editor

Domain Tabs

Preview panels

AI: Suggest Likelihood/Impact (read-only)

Validation tests

3.3 Deliverables

Full scale editor

AI-assisted suggestions (modal)

Domain configuration

3.4 Acceptance Criteria

All test cases from QA plan for scales pass

No duplicate scores

No non-contiguous scale levels

4. SPRINT 3 — HEATMAP ENGINE & RISK MATRIX

Duration: 2 weeks

4.1 Objectives

Build heatmap generator

Implement NxN matrix editor

Create heatmap UI and colour legend

Validate mapping strategy

4.2 Tasks

DB: erm_risk_matrix_cells

API:

erm_generate_risk_matrix

erm_get_risk_matrix

erm_get_risk_cell

UI:

Heatmap matrix grid

Cell editor panel

Heatmap preview

Validation:

Full NxN coverage

Risk levels mapped

AI Suggest Heatmap mapping

4.3 Deliverables

Fully functioning heatmap system

Editable cells (draft-only)

Colour-coded matrix

4.4 Acceptance Criteria

Heatmap generation matches configuration

All cells have valid risk levels

Editing forbidden after publish

5. SPRINT 4 — APPETITE ENGINE & DOMAIN GOVERNANCE

Duration: 2 weeks

5.1 Objectives

Implement appetite engine

Configure domain-level appetite rules

Add workflow routing rules

Add appetite previews and warnings

5.2 Tasks

DB: erm_appetite_rules

API:

erm_set_appetite_rules

erm_get_appetite_rules

erm_evaluate_appetite

UI:

Appetite cards

Trigger range inputs

Workflow rule selector

Appetite summary

AI Suggest Appetite

5.3 Deliverables

Appetite framework

Compliance with ERM appetite constraints

System-level appetite integration

5.4 Acceptance Criteria

Appetite fully aligns with risk levels

Appetite incompatibilities flagged

Appetite applied correctly downstream

6. SPRINT 5 — HIERARCHY, INHERITANCE & APPROVALS

Duration: 2 weeks

6.1 Objectives

Implement parent-child inheritance engine

Allow overrides with approval

Implement approval workflow

Complete profile lifecycle

6.2 Tasks

DB: erm_hierarchy_link

API:

erm_link_profile_to_hierarchy

erm_resolve_effective_profile_for_org

erm_submit_profile_for_approval

erm_review_profile

erm_publish_profile

UI:

Hierarchy tree

Override editor

Parent approval banner

Approvals page

QA:

Hierarchy conflict detection

Approval lifecycle tests

6.3 Deliverables

Full inheritance control

Approval workflow

Publish pipeline

6.4 Acceptance Criteria

Correct effective profile resolution

Parent approval enforced

Immutability after publish

7. SPRINT 6 — EXPORTS, COMPARISON, AUDIT & AI ASSIST

Duration: 2 weeks

7.1 Objectives

Export system (JSON/YAML/PDF/CSV/Bundle)

AI diff explanation

Audit log UI

Profile comparison tools

7.2 Tasks

Export APIs

PDF rendering pipeline

ZIP bundle generation

Comparison engine

Audit log table

AI Explain Changes

7.3 Deliverables

Complete export system

Full diff comparison

Full audit view

AI governance transparency

7.4 Acceptance Criteria

All export formats validate correctly

Checksum verification works

Finished bundle identical to live configuration

8. SPRINT 7 — INTEGRATION & HARDENING

Duration: 3 weeks

8.1 Objectives

Integrate ERM with:

Threat Module

Vulnerability Module

RA Engine

WRAC

PIT

Bowtie

Incident

Audit

Remote Assurance

Harden all ERM subsystems

Conduct full regression testing

Prepare governance sign-off

8.2 Tasks

Integration endpoints consumption test

RA → Heatmap → Appetite pipeline validation

Appetite → PIT priority mapping

Remote Assurance → Appetite Breach → PIT task creation

Bowtie barrier criticality mapping

Incident severity mapping

Audit NCR → appetite linkage

Documentation review

Governance verification on all profiles

8.3 Deliverables

Fully integrated ERM module

Predictable cross-module behaviour

Zero regression certification

8.4 Acceptance Criteria

All integration tests pass

All regression tests pass

All QA gates met

ERM declared “Ready for Production”

9. RISKS & MITIGATIONS
Risk	Impact	Mitigation
Misconfigured heatmap	Catastrophic	Strict validation + automated test suite
Improper appetite settings	Severe	Appetite constraints + AI warning
Incorrect hierarchy inheritance	Severe	Automated conflict detection
Role-based access failure	High	RBAC & RLS QA tests
AI hallucination	Moderate	AI read-only mode + human validation
Export format error	High	Schema validation + checksum
10. SPRINT SUCCESS INDICATORS

ERM v1.0 is successful when:

All 7 sprints completed

All test cases pass (100%)

All exports match live configuration

ERM becomes authoritative for all risk scoring

RA/WRAC/PIT/Bowtie/Incident/Audit integrate flawlessly

Governance approves the module

Zero regression risk demonstrated

✔ END OF ERM_SPRINT_PLAN_v1.0.md