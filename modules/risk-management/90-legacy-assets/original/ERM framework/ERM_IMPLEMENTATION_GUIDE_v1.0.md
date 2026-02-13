Below is the complete ERM_IMPLEMENTATION_GUIDE_v1.0.md, built to the same engineering standard as PIT and WRAC.
This document is for Builders, Foremen, QA reviewers, and governance stakeholders. It describes EXACTLY how ERM must be implemented, step by step, with no ambiguity and no freedom for misinterpretation.

Place in:
/Modules/Risk Management/ERM framework/ERM_IMPLEMENTATION_GUIDE_v1.0.md

ERM_IMPLEMENTATION_GUIDE_v1.0.md

Enterprise Risk Management — Implementation Guide
Version 1.0
Aligned with:

ERM_TRUE_NORTH_v1.0.md

ERM_DATABASE_SCHEMA_v1.1.md

ERM_EDGE_FUNCTIONS_v1.1.md

ERM_FRONTEND_COMPONENT_MAP_v1.1.md

ERM_WIREFRAMES_v1.1.md

ERM_QA_IMPLEMENTATION_PLAN_v1.1.md

ERM_EXPORT_SPEC_v1.0.md

Maturion One-Time Build / Zero Regression Philosophy

0. INTRODUCTION

This guide provides a complete, step-by-step engineering manual for building the ERM module.

It ensures:

Predictable implementation

Strict alignment to governance

Zero regression

Accurate risk scoring

Seamless integration with all SRMF modules

Audit-ready behaviour

AI safety and explainability

The intended audience:

Frontend engineers

Backend engineers

Database engineers

System integrators

QA analysts

Senior governance

AI orchestration specialists

This guide assumes:

Maturion’s technology stack (Next.js, React, Tailwind, Zustand/Redux, Supabase/Postgres, Serverless edge functions)

Centralised authentication & RBAC

Multi-company, multi-hierarchy architecture

1. IMPLEMENTATION PHASE SEQUENCE

ERM implementation follows 7 phases:

Phase 1 — DB Foundations & Profile Lifecycle
Phase 2 — Likelihood & Impact Scales
Phase 3 — Heatmap Engine
Phase 4 — Appetite & Domain Governance
Phase 5 — Hierarchy & Approvals
Phase 6 — Exports, Comparison, Audit & AI Assistance
Phase 7 — Integration & Hardening


Each phase contains:

Objectives

Implementation steps

Required validations

Code-level notes

UI notes

QA hooks

2. PHASE 1 — DATABASE & PROFILE LIFECYCLE
2.1 Objectives

Build core ERM tables

Implement RLS and RBAC

Create profile lifecycle (draft → approved → published)

Enforce immutability after publish

Build audit infrastructure

2.2 Steps
Step 1 — Create Tables

Implement all tables from ERM_DATABASE_SCHEMA_v1.1.md:

erm_profiles

erm_likelihood_levels

erm_impact_levels

erm_risk_matrix_cells

erm_appetite_rules

erm_domain_config

erm_hierarchy_link

erm_approval_records

erm_audit_log

erm_ai_log

Step 2 — Implement RLS

Rules must enforce:

Org boundary isolation

Profile immutability

Child org cannot override parent’s active profile

Only ERM_ADMIN can publish

Step 3 — Implement Edge Functions

Implement functions in ERM_EDGE_FUNCTIONS_v1.1.md:

erm_create_profile

erm_clone_profile

erm_get_profiles_for_org

erm_get_active_profile

Step 4 — Implement Audit Logging

All mutating endpoints MUST log:

user_id

previous_value

new_value

timestamp

action

Step 5 — Build UI Pages

Implement pages from ERM_FRONTEND_COMPONENT_MAP_v1.1.md:

Profile list

Profile create

Profile view

Step 6 — QA & Validation

Run “Phase 1 Tests” from QA plan.

3. PHASE 2 — LIKELIHOOD & IMPACT SCALES
3.1 Objectives

Implement editors for all scales

Ensure deterministic scoring

Enforce scale consistency

Add AI suggestion engine (read-only)

3.2 Steps
Step 1 — Build Likelihood API

erm_set_likelihood_levels

erm_get_likelihood_scale

Rules:

Levels contiguous

Numeric scores unique

Editable only in draft

Step 2 — Build Impact API

erm_set_impact_levels

erm_get_impact_scale

Rules:

Domain-level isolation

No gaps in thresholds

All domains must be defined

Step 3 — UI Implementation

Follow wireframes:

Drag/reorder

Level edit modal

Guidance tooltips

Domain tabs

Step 4 — AI Assistant

Implement:

erm_ai_suggest_likelihood_scale

erm_ai_suggest_impact_scale

Rules:

AI cannot modify levels

AI output must be human-reviewed

Step 5 — QA

From QA plan:

Scale completeness test

Duplicate level test

Score uniqueness test

4. PHASE 3 — HEATMAP ENGINE
4.1 Objectives

Generate full NxN heatmap

Enable cell-level editing

Ensure full matrix coverage

Ensure consistency with scales

4.2 Steps
Step 1 — Matrix Computation

Implement:

erm_generate_risk_matrix

Rules:

Must fill ALL likelihood × impact combinations

Must apply default mapping

Must assign valid risk_level_enum

Step 2 — Matrix Querying

Implement:

erm_get_risk_matrix

erm_get_risk_cell

Step 3 — UI: Heatmap Builder

Implement:

Colour-coded matrix

Cell editor panel

Live preview

Legend

Step 4 — AI Heatmap Suggestion

Implement:

erm_ai_suggest_heatmap_mapping

Step 5 — QA

Missing cell → ERROR

Duplicate cell → ERROR

Matrix mismatch → ERROR

5. PHASE 4 — APPETITE & DOMAIN GOVERNANCE
5.1 Objectives

Implement appetite engine

Domain/threshold-based controls

Workflow integration rules

5.2 Steps
Step 1 — Implement Appetite API

erm_set_appetite_rules

erm_get_appetite_rules

erm_evaluate_appetite

Step 2 — Build UI

Implement:

Appetite cards

Trigger range validation

Workflow selector

Domain preview

Step 3 — QA Validation

Appetite invalid → reject

Appetite must match ERM levels

Appetite must map to heatmap

6. PHASE 5 — HIERARCHY & APPROVAL WORKFLOWS
6.1 Objectives

Implement hierarchical inheritance

Implement overrides

Build full approval workflow

6.2 Steps
Step 1 — Hierarchy API

erm_link_profile_to_hierarchy

erm_resolve_effective_profile_for_org

Step 2 — Approval API

erm_submit_profile_for_approval

erm_review_profile

erm_publish_profile

Step 3 — UI: Tree & Overrides

Hierarchy tree viewer

Node override editor

Parent approval banner

Step 4 — QA:

Override conflicts

Approval chain tests

Publish immutability checks

7. PHASE 6 — EXPORTS, COMPARISON, AUDIT & AI
7.1 Objectives

Complete all exports

Implement diff comparison

Build audit log UI

Add AI explanation features

7.2 Steps
Step 1 — Export API

Implement endpoints:

JSON

YAML

PDF

CSV

Bundle (ZIP)

Step 2 — Comparison Engine

UI implementation:

Side-by-side comparisons

Highlight differences

Risk level changes

Appetite changes

Step 3 — Audit UI

Log table

Diff viewer

AI explain change module

Step 4 — QA

Export checksum

Export validation

Compare logic correctness

8. PHASE 7 — SYSTEM INTEGRATION & HARDENING
8.1 Integrations

ERM must integrate flawlessly with:

Threat Module

Likelihood scaling

Vulnerability Module

Impact domains

Risk Assessment Engine

Risk classification

Appetite evaluation

WRAC

Heatmap colours and descriptors

Controls Module

Appetite-based gating

PIT

Appetite → priority mapping

Appetite breach → escalated task creation

Bowtie

Severity → barrier criticality

Audit Module

NCR mapping to appetite

Remote Assurance

Control degradation mapping

8.2 Hardening Steps

Regression test full suite

Validate ERM profile resolution in hierarchy

Validate appetite edge cases

Validate heatmap logic in all downstream modules

Run security audit

Verify RLS constraints

9. MASTER IMPLEMENTATION ORDER (FOR FOREMAN)

Below is the exact sequence Builders must follow:

1. Create DB structures
2. Implement profile lifecycle
3. Implement scales (likelihood, impact)
4. Implement heatmap engine
5. Implement appetite engine
6. Implement hierarchy engine & approvals
7. Build exports & comparison
8. Build audit layers
9. Integrate with RA/WRAC/PIT/Bowtie/Incident/Audit
10. AI suggestion endpoints
11. Final QA & Regression
12. Governance sign-off
13. Publish ERM v1.0 baseline

10. GOVERNANCE CHECKLIST FOR SIGN-OFF

ERM v1.0 may be approved ONLY if:

 All scales defined correctly

 Heatmap complete

 Appetite valid across all domains

 Hierarchy inheritance conflict-free

 Approval workflow functional

 Profile publish process validated

 Export bundles validated

 Integration tests passed

 Full regression passed

 Audit-ready

 Zero outstanding critical bugs

 Satisfies SRMF governance criteria

11. FINAL NOTE FOR BUILDERS

ERM is the core governance engine for the entire SRMF / ISMS.
An error here cascades into every risk scoring operation across the enterprise.

Therefore:

No shortcuts

All validations mandatory

Zero regression required

No “best guesses” — Only deterministic logic

AI must NEVER override rules

This guide MUST be followed exactly.

✔ END OF ERM_IMPLEMENTATION_GUIDE_v1.0.md