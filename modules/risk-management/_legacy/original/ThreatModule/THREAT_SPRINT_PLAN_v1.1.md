THREAT_SPRINT_PLAN_v1.1.md

Threat Module — Development Sprint Plan
Version: 1.1
Aligned with:

THREAT_TRUE_NORTH_v1.0.md

THREAT_DATABASE_SCHEMA_v1.1.md

THREAT_EDGE_FUNCTIONS_v1.1.md

THREAT_FRONTEND_COMPONENT_MAP_v1.1.md

THREAT_WIREFRAMES_v1.1.md

THREAT_QA_IMPLEMENTATION_PLAN_v1.1.md

THREAT_EXPORT_SPEC_v1.0.md

Maturion One-Time Build & Zero Regression Philosophy

0. PURPOSE

This Sprint Plan defines:

Sprint sequencing

Epics

Stories

Tasks

Acceptance criteria

Dependencies

QA gates

AI-assisted development responsibilities

The objective is to deliver a production-ready, zero-regression Threat Module within the SRMF/ISMS ecosystem.

1. SPRINT OVERVIEW

Development is divided into 6 sprints:

Sprint	Theme	Outcome
Sprint 1	Foundation & Schema	DB, RLS, enums, migrations
Sprint 2	Edge Functions	Full backend API with versioning engine
Sprint 3	Core UI	Library, create wizard steps 1–3
Sprint 4	Advanced UI	TTP, Drift, Linking, Review workflow
Sprint 5	Intelligence & Exports	Intelligence dashboards + export system
Sprint 6	QA, Hardening & Integration	Final testing, PIT/RA/Vulnerability integration

Each sprint is 1–2 weeks depending on resource allocation.

2. EPICS & USER STORIES
EPIC A — FOUNDATION (DB + RLS + ENUMS)
Story A1: Implement Threat Master Tables

Create threat_records

Create threat_versions

Create classification/TTP/TAP/drift/linking tables

Create audit + AI logs
Acceptance Criteria:

All tables exist & match schema spec

All FKs validated

DB migration runs clean

Story A2: Implement ENUM tables

threat_category_enum

threat_subcategory_enum

threat_severity_enum

ttp_reference_library
Acceptance Criteria:

ENUMs loaded with baseline values

Accessible via edge functions

Story A3: Implement RLS policies

org_id enforcement

No cross-company visibility
Acceptance Criteria:

RLS tests pass

Bypass only for anonymised analytics

EPIC B — BACKEND ENGINE (EDGE FUNCTIONS)
Story B1: Create Threat Record CRUD

Tasks:

create_record

get_record

archive_record
AC: Must pass edge function QA suite.

Story B2: Implement Versioning Engine

Tasks:

clone_version

update_metadata

state transitions
AC: Published versions immutable.

Story B3: Classification Engine

Tasks:

update_classification

ai_suggest_classification
AC: AI results logged, not auto-applied.

Story B4: TAP Engine

Tasks:

update_actor_profile

update_actor_capabilities

ai_generate_tap
AC: TAP loaded and validated end-to-end.

Story B5: TTP Mapping Engine

Tasks:

add_ttp_mapping

remove_ttp_mapping

ai_suggest_ttp_mappings
AC: TTP mapping complete and visible in UI.

Story B6: Drift Engine

Tasks:

update_drift

ai_compute_drift
AC: Drift timeline renders correctly.

Story B7: Linking Engine

Tasks:

link_to_facility

link_to_process

unlink functions
AC: RA Engine can use links to generate UEs.

Story B8: Review & Publish Engine

Tasks:

submit_for_review

approve_version

publish_version
AC: Workflow transitions enforced.

Story B9: Search & Intelligence APIs

Tasks:

full-text search

pgvector search

drift cluster analysis
AC: Intelligence screens powered.

EPIC C — CORE FRONTEND (LIBRARY + WIZARD STEPS 1–3)
Story C1: Threat Library

Tasks:

Data table

Filters

Drift slider

Category/subcategory UI
AC: List loads <150ms.

Story C2: Threat View Page

Tasks:

Version timeline

Summary cards

Usage stats
AC: Matches wireframes exactly.

Story C3: Wizard Step 1–3

Tasks:

Basics

Classification

TAP

AI suggestion banners
AC: Save draft persists state.

EPIC D — ADVANCED FRONTEND (TTP + DRIFT + LINKING + WORKFLOW)
Story D1: TTP Page

Tasks:

Reference browser

Selected list

AI suggestion modal
AC: Fully interactive.

Story D2: Drift Page

Tasks:

Drift line graph

Drift update form

AI drift computation
AC: Drift updates correctly stored & displayed.

Story D3: Linking Page

Tasks:

Facility tree

Process list

Relevance slider

Justification editor
AC: Links saved & reflected in RA Engine.

Story D4: Review/Approval Page

Tasks:

Review checklist

Approve/reject UI

Publish button (manager only)
AC: Workflow transitions validated.

EPIC E — EXPORTS + INTELLIGENCE
Story E1: Export Engine

Tasks:

JSON

YAML

PDF

CSVs

ZIP bundles
AC: pdf-export must include drift timeline.

Story E2: Intelligence Dashboard

Tasks:

Category heatmap

Drift clusters

Facility exposure map

AI narrative summary
AC: Matches wireframes.

EPIC F — QA + HARDENING + INTEGRATION
Story F1: QA Compliance

Tasks:

Schema validation tests

Edge function tests

UI functional tests

Accessibility tests
AC: All QA test suites green.

Story F2: Integration Tests

Tasks:

RA likelihood computation

Vulnerability threat linking

WRAC UE generator

PIT drift escalation

Incident/Intel integration
AC: Multi-module data consistency guaranteed.

Story F3: Regression Automation

Tasks:

Unit tests

Snapshot tests

Linting

SAST
AC: Zero backward-breaking changes.

Story F4: Foreman Approval

Tasks:

Review checklist

Architecture diff
AC: Foreman signs off the Threat Module.

3. SPRINT SEQUENCING (DETAILED)
SPRINT 1 — Foundation (DB + RLS + ENUMS)

Duration: 1 week
Deliverables:

All DB tables

ENUM reference values

RLS active

Migration scripts

Basic seed data (optional)

QA Gates:

Schema validation tests

Integrity tests

RLS tests

SPRINT 2 — Backend Engine (Edge Functions)

Duration: 2 weeks
Deliverables:

All create/update/clone/version functions

Classification/TAP/TTP/Drift/Linking functions

Workflow functions

Search + Intelligence base functions

QA Gates:

All edge function contract tests

State machine tests

Audit/AI log tests

SPRINT 3 — Core Frontend

Duration: 2 weeks
Deliverables:

Threat Library

Threat View

Wizard Steps 1–3
QA Gates:

UI functional tests

Draft persistence tests

SPRINT 4 — Advanced Frontend

Duration: 2–3 weeks
Deliverables:

TTP Page

Drift Page

Linking Page

Review/Approval Page

QA Gates:

TTP → DB integration

Drift timeline validation

Facility tree performance tests

SPRINT 5 — Exports + Intelligence

Duration: 1–2 weeks
Deliverables:

JSON/YAML/PDF/CSV/ZIP exports

Intelligence Dashboard

QA Gates:

Export format validation

PDF rendering tests

AI narrative generation tests

Search performance benchmarks

SPRINT 6 — QA + Hardening + ISMS Integration

Duration: 2 weeks
Deliverables:

Final QA

Integration with RA, Vulnerability, WRAC, PIT

Regression automation

QA Gates:

Full module QA checklist

Integration greenlights

Foreman approval

4. ACCEPTANCE CRITERIA FOR FULL MODULE DELIVERY

The Threat Module is complete when:

Technical

All features from True North implemented

All DB schemas validated

All edge functions tested

All UI screens operational

All exports correct and downloadable

All intelligence dashboards functional

QA

All functional tests passing

All workflow transitions validated

All published versions immutable

All AI logs complete

No security failures

RLS airtight

Integration

RA Engine pulls correct threat likelihood

WRAC sees correct threat values

Vulnerability module maps correctly

PIT receives drift escalations

Incidents update TAP/drift properly

Governance

Foreman validation checklist complete

ChangeLog created

Version tagged (v1.0.0 for release)

5. DEFINITION OF DONE (DoD)

A story is “Done” when:

Code written

Tests written

Tests pass

Reviewed by Foreman

Merged to main

No linting errors

No regressions

Documentation updated

ChangeLog updated

✔ END OF THREAT_SPRINT_PLAN_v1.1.md