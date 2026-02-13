THREAT_IMPLEMENTATION_GUIDE_v1.0.md

Threat Module — Implementation Guide
Version: 1.0
Aligned with:

THREAT_TRUE_NORTH_v1.0.md

THREAT_DATABASE_SCHEMA_v1.1.md

THREAT_EDGE_FUNCTIONS_v1.1.md

THREAT_FRONTEND_COMPONENT_MAP_v1.1.md

THREAT_WIREFRAMES_v1.1.md

THREAT_QA_IMPLEMENTATION_PLAN_v1.1.md

THREAT_EXPORT_SPEC_v1.0.md

THREAT_SPRINT_PLAN_v1.1.md

Maturion True North & One-Time Build Philosophy

SRMF Threat → Vuln → RA → WRAC → PIT Pipeline

0. PURPOSE

This guide provides a step-by-step implementation blueprint for the Threat Module, ensuring:

Architectural consistency

Zero regression

Framework alignment

Seamless integration with the entire Risk ecosystem

Smooth delivery by Foreman → Co-Pilot agent pipeline

Clear handoff instructions

Proper sequencing

Validation checkpoints

This document must be read and executed linearly.

It is the Foreman’s master plan for implementation.

1. SYSTEM CONTEXT

The Threat Module feeds:

Threat Module → Vulnerability Module → RA Engine → WRAC → PIT → Remote Assurance → Intelligence


Threat data is the first structured input in the SRMF risk lifecycle.

This module therefore sets:

Threat classification quality

Actor modeling accuracy

TTP relevance

Drift sensitivity

Downstream RA score accuracy

WRAC completeness

PIT prioritization logic

Intelligence forecasting accuracy

Any defect here propagates downstream.
Hence the strict implementation controls.

2. IMPLEMENTATION SEQUENCE OVERVIEW

Implementation must follow this exact order:

1. DB Layer
2. RLS & Security
3. Edge Functions
4. Frontend Scaffolding
5. Wizard Core (Steps 1–3)
6. TTP Engine
7. Drift Engine
8. Linking Engine
9. Workflow / Publishing Engine
10. Intelligence Views
11. Export Engine
12. Full QA & Regression Automation
13. Integration Validation (RA, Vuln, WRAC, PIT, Incident)
14. Release Packaging & Deployment


Deviation from this order is not allowed.

3. DATABASE IMPLEMENTATION STEPS
3.1 Create Master Tables

Implement according to THREAT_DATABASE_SCHEMA_v1.1:

threat_records

threat_versions

threat_classification

threat_actor_profiles

threat_actor_capabilities

threat_ttp_mapping

threat_drift_metrics

threat_facility_links

threat_process_links

threat_ai_log

threat_audit_log

Required: Enable pgvector extension for embedding fields.

3.2 Create ENUM Tables

Populate:

threat_category_enum

threat_subcategory_enum

threat_severity_enum

ttp_reference_library

Required: Populate MITRE baseline TTPs.

3.3 Implement RLS Policies

Must enforce:

row.org_id = auth.org_id


except for anonymised intelligence endpoints.

3.4 Indexes

Add required indexes exactly as listed in the schema doc.

4. EDGE FUNCTION IMPLEMENTATION

Implement each function exactly as in THREAT_EDGE_FUNCTIONS_v1.1.

4.1 Essential Guidelines

Every mutation triggers audit logging

AI functions must not write without human approval

Published versions must be immutable

Version cloning must copy all subordinate data

Threat classifications must trigger recalculation flags

Drift metrics must be append-only

4.2 Mandatory Edge Functions (Summary)
Record-level:

threat_create_record

threat_get_record

threat_archive_record

Versioning-level:

threat_clone_version

threat_update_version_metadata

threat_get_version

Classification:

threat_update_classification

threat_ai_suggest_classification

TAP:

threat_update_actor_profile

threat_update_actor_capabilities

threat_ai_generate_tap

TTP:

threat_add_ttp_mapping

threat_remove_ttp_mapping

threat_ai_suggest_ttp_mappings

Drift:

threat_update_drift_metric

threat_ai_compute_drift

Linking:

threat_link_to_facility

threat_link_to_process

threat_unlink_facility

threat_unlink_process

Workflow:

threat_submit_for_review

threat_reject_review

threat_approve_version

threat_publish_version

Intelligence:

threat_search

threat_get_intelligence_overview

threat_trend_analysis

Logging:

threat_log_audit_event

threat_log_ai_interaction

Must all pass QA contract tests.

5. FRONTEND IMPLEMENTATION GUIDE

Follow THREAT_FRONTEND_COMPONENT_MAP_v1.1.

5.1 Scaffolding

Create base route structure:

/threats
   /dashboard
   /library
   /library/view/:id
   /create
   /edit/:id/:version_id
   /classify/:version_id
   /tap/:version_id
   /ttp/:version_id
   /drift/:version_id
   /linking/:version_id
   /review/:version_id
   /audit/:version_id
   /exports/:version_id
   /intelligence

5.2 Implement UI in this order:
Threat Library
Threat View
Wizard Steps 1–3
TTP Page
Drift Page
Linking Page
Review Page
Audit Page
Exports Page
Intelligence Dashboard

5.3 Follow Wireframes EXACTLY

Use:

Split panes

Left sidebar wizard

Sticky bottom action bars

Clean, minimalistic layouts

Consistent spacing

6. WORKFLOW IMPLEMENTATION

Threat workflow state machine:

draft → pending_review → approved → published


Rules:

Only analysts can submit for review

Only reviewers can approve or reject

Only managers can publish

Published versions = immutable

Cloning creates new draft version

Downstream modules use published versions only

Failure to enforce this breaks the SRMF risk lifecycle.

7. AI BEHAVIOUR IMPLEMENTATION
7.1 All AI Suggestions Must:

require explicit acceptance

be logged in threat_ai_log

store prompt summary

store output summary

store confidence

store user who accepted

never directly modify DB

7.2 AI Models Required

Models:

Classification Model

TAP Generator

TTP Mapping Suggestion Model

Drift Forecasting Model

Intelligence Narrative Generator

All run via Foreman-managed AI model routing.

8. EXPORT ENGINE IMPLEMENTATION

Follow THREAT_EXPORT_SPEC_v1.0.

Required:

JSON

YAML

PDF

CSVs

ZIP Bundle

Intelligence Snapshot

PDF must include:

Drift timeline

TAP summary

TTP summary

Links summary

RA/WRAC/PIT usage indicators

9. INTELLIGENCE IMPLEMENTATION

Build these dashboards:

Threat Category Heatmap

Drift Over Time Graph

Cluster Visualization (TAP vector similarity)

Facility Exposure Map

AI Insights Panel

Use pgvector for clustering.

10. QA & REGRESSION
10.1 Mandatory QA Checklists

Follow THREAT_QA_IMPLEMENTATION_PLAN_v1.1.

Covers:

DB schema tests

Edge function tests

UI tests

Workflow tests

AI safety tests

Integration tests

11. MODULE INTEGRATION REQUIREMENTS
11.1 Vulnerability Module

Threats must be selectable when linking vulnerabilities to threats.

11.2 RA Engine

Must accept threat likelihood values produced via:

classification + TAP + TTP + drift → final likelihood → ERM mapping

11.3 WRAC

Threats must flow into unwanted event generation.

11.4 PIT

Drift spikes must trigger project recommendations.

11.5 Incident / Intelligence

Incidents may be promoted to threats

Intelligence updates drift & TAP

12. PERFORMANCE TARGETS

Threat list loads <150ms

Threat detail loads <200ms

Drift timeline loads <120ms

Export generation <250ms (ZIP <500ms)

Intelligence queries <400ms

13. DEPLOYMENT STEPS

Migrate DB

Deploy RLS rules

Deploy edge functions

Deploy frontend

Run QA suite

Run integration suite

Foreman reviews

Version tagging

Deploy to staging

Sanity test

Deploy to production

14. MAINTENANCE & GOVERNANCE
14.1 Change Control

All changes must update:

ChangeLog

Version tag

Migration scripts

QA tests

14.2 Error Monitoring

Monitor drift errors

Monitor AI suggestion failures

Monitor broken TTP references

Monitor workflow transitions

14.3 Continuous Improvement

Threat intel improves through:

Incident feedback

Remote Assurance signals

Seasonal trend analysis

Facility/process evolution

✔ END OF THREAT_IMPLEMENTATION_GUIDE_v1.0.md