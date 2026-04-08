Below is the complete THREAT_EDGE_FUNCTIONS_v1.1.md, upgraded to full WRAC/PIT/ERM standard.
This document defines all serverless backend functions, validation logic, AI safety rules, versioning constraints, RLS enforcement, and integration surfaces.

Place in:
/Modules/Risk Management/ThreatModule/THREAT_EDGE_FUNCTIONS_v1.1.md

THREAT_EDGE_FUNCTIONS_v1.1.md

Threat Module — Edge Functions Specification
Version 1.1
Aligned with:

THREAT_TRUE_NORTH_v1.0.md

THREAT_DATABASE_SCHEMA_v1.1.md

THREAT_FRONTEND_COMPONENT_MAP_v1.1.md

THREAT_QA_IMPLEMENTATION_PLAN_v1.1.md

ERM_EDGE_FUNCTIONS_v1.1.md

SRMF Governance & One-Time Build Philosophy

0. PURPOSE

This specification defines all backend logic for the Threat Module, including:

Threat creation

Versioning

Classification

TTP mapping

Threat actor modelling

Drift updates

Linking to Processes/Facilities

Approvals & publishing

Audit logging

AI interaction logging

Integration endpoints

All functions must:

Enforce strict validation

Guarantee immutability of published versions

Maintain full audit trails

Respect multi-company RLS boundaries

Conform to Zero Regression and True North design

1. NAMING STANDARDS

All functions follow:

threat_<action>_<object>


Example:

threat_create_record
threat_update_classification
threat_publish_version


Each function must:

Validate RLS

Validate permissions

Log audit changes

Log AI interactions (if applicable)

Reject invalid state changes

2. FUNCTION CATEGORIES
A. Threat Record Management
B. Threat Version Management
C. Threat Classification Engine
D. Threat Actor Profile (TAP)
E. TTP Mapping
F. Threat Drift Engine
G. Threat Linking Engine
H. Approval & Publishing Workflow
I. Audit & AI Logs
J. Search, Filters, & Intelligence
K. Integration Endpoints (RA, WRAC, PIT)

3. EDGE FUNCTIONS (DETAILED SPECIFICATIONS)
A. THREAT RECORD MANAGEMENT
1. threat_create_record

Purpose:
Create a new threat container (master record).

Input:

org_id
name
description
category_code
subcategory_code
created_by


Validation:

Required fields cannot be empty

Category must exist in enum

Subcategory must match category

Organisation must match user org

Output:

{ threat_id, version_id }


Side Effects:

Creates threat_records row

Creates initial version in threat_versions

Logs to audit

2. threat_get_record

Retrieve summary or detailed threat record.

Modes:

summary

full

3. threat_archive_record

Soft delete threat (only if NOT used downstream).

Reject if threat is referenced in:

RA Engine

WRAC

PIT

Bowtie

Incident

B. THREAT VERSION MANAGEMENT
1. threat_clone_version

Purpose:
Duplicate a threat’s published version into a new draft for editing.

Rules:

Only published → draft clone allowed

Creates:

new version row

cloned classification

cloned TAP

cloned TTP

cloned drift baseline

cloned links

2. threat_update_version_metadata

Allows editing fields:

name

description

category

subcategory

Only when version is in draft state.

3. threat_get_version

Fetches full structure of a specific version:

Classification

TAP

TTP

Links

Drift metrics

C. THREAT CLASSIFICATION ENGINE
1. threat_update_classification

Input:

threat_version_id
threat_type
capability_level
motivation_level
opportunity_level
resource_level
historical_frequency
domain_relevance


Validation Rules:

Version must be in draft

Levels must be 1–5

domain_relevance JSON validated against ERM domains

category/subcategory must match threat_type

Output:

Updated classification row

Side Effects:

Recompute likelihood baseline

Mark TAP for revalidation

Mark drift metrics retired

Log audit

2. threat_ai_suggest_classification

Purpose:
AI recommends classification attributes.

AI Input:

Description

Attachments

Historical data

Incident patterns

TTPs

Facility/Process links

Rules:

AI CANNOT modify data directly

Must store:

prompt

output

confidence

user acceptance

Output:
AI suggestion package for UI.

D. THREAT ACTOR PROFILE (TAP)
1. threat_update_actor_profile

Input:

threat_version_id
actor_type
skill_level
resources
risk_factor_vector


Rules:

Version must be draft

Vector fields validated as JSON

2. threat_update_actor_capabilities

Allows editing or adding capabilities.

Input:

capability (text)

severity (scale 1–5)

evidence

ai_suggested (boolean)

3. threat_ai_generate_tap

AI creates or updates full TAP.

Rules:

Draft only

Requires user approval

Logged in threat_ai_log

E. TTP MAPPING
1. threat_add_ttp_mapping

Input:

threat_version_id
ttp_id
confidence
ai_generated


Validation:

ttp_id must exist

confidence 0–1

2. threat_remove_ttp_mapping

Draft only.

3. threat_ai_suggest_ttp_mappings

AI suggests relevant MITRE/NIST TTPs.

Logged in threat_ai_log.

F. THREAT DRIFT ENGINE
1. threat_update_drift_metric

Input:

threat_version_id
drift_score
drift_reason
drift_vector
source


Rules:

drift_score 0–1

drift_vector JSONB validated

source ∈ (“incident”, “intel”, “ai”, “manual”)

2. threat_ai_compute_drift

AI generates drift metrics from:

incidents

intel

Remote Assurance signals

seasonality

crime stats

User must approve.

G. THREAT–PROCESS–FACILITY LINKING
1. threat_link_to_process

Input:

threat_version_id
process_id
relevance
justification

2. threat_link_to_facility

Same structure as above.

3. threat_unlink_process
4. threat_unlink_facility

Only drafts can unlink.

H. APPROVAL & PUBLISHING WORKFLOW
1. threat_submit_for_review

Moves status:

draft → pending


Validation:

All mandatory fields must be complete

2. threat_reject_review

Moves back to draft.

3. threat_approve_version

Moves status:

pending → approved


Records approver & timestamp.

4. threat_publish_version

Moves status:

approved → published


Critical Rules:

Published versions are immutable.

Downstream modules now reference this version.

previous published versions archived but preserved.

I. AUDIT & AI LOGGING
1. threat_log_audit_event

Every mutating action triggers:

old_value (JSON)
new_value (JSON)
action
user_id
timestamp


Stored in:

threat_audit_log

2. threat_log_ai_interaction

Stores:

ai_model
prompt_summary
output_summary
confidence
accepted
timestamp


Stored in:

threat_ai_log


Required for governance & transparency.

J. SEARCH, FILTERS & INTELLIGENCE
1. threat_search

Full-text search across:

threat_records

threat_versions

classification fields

TTP mappings

TAP

Supports:

FTS ranking

pgvector semantic search

Filters (category, facility, process, TTP, drift score, severity)

2. threat_get_intelligence_overview

Provides threat landscape overview:

Most active threats

Highest drift

Highest capability

TTP clusters

Geographical heatmaps

Facility exposure

3. threat_trend_analysis

Outputs:

Trend vector (12 months)

Threat velocity

Seasonal risk curves

Likelihood projection for RA Engine

K. INTEGRATION ENDPOINTS
1. RA Engine Integration

threat_get_likelihood_data
Returns:

capability

motivation

opportunity

historical frequency

drift score

TAP-derived modifiers

final likelihood (ERM-aligned)

2. Vulnerability Module Integration

threat_get_valid_threats_for_process(process_id)
threat_get_valid_threats_for_facility(facility_id)

3. WRAC Integration

threat_get_profile_for_wrac(threat_version_id)

4. PIT Integration

Drift triggers → PIT escalation

Threat-driven projects → PIT auto-generation

5. Incident/Intel Integration

threat_update_from_incident(incident_id)
threat_update_from_intel(source_id)

4. PERMISSION MODEL (RBAC)
Role	Create	Edit	Approve	Publish	Delete	AI Accept
Threat Analyst	✔	✔	✖	✖	✔	✔
Threat Reviewer	✖	✔	✔	✖	✖	✔
Threat Manager	✔	✔	✔	✔	✔	✔
Org Readonly	✖	✖	✖	✖	✖	✖
5. RLS RULES

Key isolation:

threat_records.org_id = auth.org_id
threat_versions.org_id = auth.org_id
threat_links.org_id = auth.org_id


No cross-company visibility except anonymised analytics.

6. VALIDATION RULES SUMMARY
Must validate:

No edits to published versions

Category/subcategory compatibility

Classification scale boundaries

TTP references valid

Drift score valid

All audit events recorded

Must reject:

Missing mandatory fields

Threat used in RA being edited

Invalid TTP

AI modifying without approval

7. FAILURE MODES & PROTECTION
Hard failures:

Schema mismatch

Invalid threat version state

Missing classification

Zero TTPs for adversarial threats (warning)

Soft failures:

AI low confidence

Conflicting drift signals

Unlinked threat used in RA

8. PERFORMANCE & SECURITY
Performance Targets:

Threat search < 150ms

TTP mapping fetch < 50ms

TAP load < 80ms

Security:

Encrypted storage

AI logs protected

Audit logs append-only

Strict RLS enforcement

✔ END OF THREAT_EDGE_FUNCTIONS_v1.1.md