THREAT_CHANGELOG_v1.0.md

Threat Module — Changelog & Version Governance Log
Version: 1.0
Lifecycle Governance: SRMF / Maturion One-Time Build Philosophy
Scope: Threat Identification → TAP → TTP → Drift → Linking → Publishing → Intelligence → Export

0. PURPOSE

This changelog tracks all module changes, including:

Version increments

Schema updates

Edge function adjustments

Frontend modifications

Workflow rule changes

AI-behaviour updates

Export structure updates

Integration constraints

It forms part of the SRMF Governance Pack, required for:

Audit

Forensics

Release management

Safety certification

Code lifetime traceability

1. VERSIONING MODEL

The Threat Module follows a strict semantic versioning:

MAJOR.MINOR.PATCH


Example usage:

MAJOR — Incompatible structural change

MINOR — New feature added that is backward compatible

PATCH — Bug fix or non-breaking improvement

All changes MUST be logged here.
No unlogged change may be deployed.

2. CHANGELOG HISTORY

Below is version 1.0, representing the complete, initial production-ready build.

VERSION 1.0.0

Release Date: YYYY-MM-DD
Status: Initial Full Release (Production-Ready)
Approved By: Foreman (SRMF)
Built By: Co-Pilot AI Pipeline
Aligned Documentation: v1.0/v1.1 files for all Threat Module sections

2.1 ARCHITECTURE (TRUE NORTH)
Added

Full Threat Architecture Map, covering:

Threat identification flow

Multi-version threat entity structure

TAP (Threat Actor Profile) model

TTP Mapping engine

Drift evolution model

Facility/Process relevance model

Approval workflow

Integration map across RA, Vuln, WRAC, PIT, Incident/Intel, Remote Assurance

Immutable versioning system integrated into lifecycle

AI Safety framework for all threat-related models

2.2 DATABASE SCHEMA (v1.1)
Added

All core tables (threat_records, threat_versions, etc.)

All supporting tables (actor_capabilities, drift, linking, TTPs…)

AI log table with full auditability

pgvector support for behaviour vectors & drift vectors

Enum tables for:

Category

Subcategory

Severity

Full indexing strategy

RLS enforcement across all tables

Migration rules from v0.1 → v1.1

Modified

None (initial release)

Removed

None

2.3 EDGE FUNCTIONS (v1.1)
Added

Complete CRUD + versioning engine

Threat classification engine

TAP engine

TTP mapping engine

Drift engine (manual + AI)

Linking engine (process/facility)

Threat workflow engine:

draft → pending → approved → published

Search + intelligence endpoints

Audit logging functions

AI logging functions

Modified

Strengthened workflow state machine from v0.1

Improved AI-safety enforcement

Removed

Deprecated “simple threat create” API from v0.1

2.4 FRONTEND (v1.1)
Added

Threat Dashboard

Threat Library interface

Threat View page

Threat Creation Wizard (Steps 1–7):

Basics

Classification

TAP

TTP

Drift

Linking

Review & Approvals

Audit log page

Export page

Intelligence dashboard

Modified

Simplified TTP selector from v0.1

Added AI suggestion banners & panels

Updated navigation to SRMF/ISMS standard

Integrated org switcher

Removed

Old v0.1 minimal UI sketches

2.5 WIREFRAMES (v1.1)
Added

Full high-fidelity ASCII wireframes for:

Dashboard

Library

View

Wizard (all steps)

Drift

TTP

Linking

Review

Audit

Exports

Intelligence

Modified

Replaced v0.1 wireframes with SRMF-aligned UX

Enhanced clarity and routing consistency

2.6 QA IMPLEMENTATION PLAN (v1.1)
Added

Full QA matrix:

Schema tests

Edge function tests

Workflow tests

UI tests

AI safety tests

RLS tests

Integration tests across RA, Vuln, WRAC, PIT

Release blockers

Acceptance criteria

Regression standards

DoD (Definition of Done)

2.7 EXPORT SPEC (v1.0)
Added

JSON

YAML

CSV (classification, TTP, audit)

PDF (full brief)

ZIP bundle (complete threat version pack)

Intelligence Snapshot export specification

Deterministic ordering rules

Export checksum standard

2.8 SPRINT PLAN (v1.1)
Added

6-sprint delivery roadmap

Epics, Stories, Tasks

Acceptance criteria

Required sequence

Foreman gate checks

Integration testing steps

2.9 IMPLEMENTATION GUIDE (v1.0)
Added

Implementation sequence

Architectural constraints

Step-by-step build plan

DB, backend, frontend rollout steps

AI behaviour enforcement

Export engine integration

Intelligence view construction

Deployment & governance

3. GOVERNANCE NOTES
3.1 AI Safety Enforcement

All AI operations must remain:

Transparent

Logged

Human-approved

Non-destructive

3.2 Versioning Discipline

No function may modify published threat versions.
All updates must occur via cloning.

3.3 RLS Validation

All exports and queries must remain org-isolated unless anonymised.

3.4 Integration Stability

Downstream effects (RA/WRAC/PIT) must be tested before any MAJOR version increment.

4. FUTURE RELEASE PLANS

Planned enhancements for future versions:

v1.1

Automated threat trend forecasting

Seasonal drift modelling

AI-assisted category/subcategory classifier

Automated linking recommendations for processes/facilities

Remote Assurance signals auto-drift integration

v1.2

TTP-to-Control predictive mapping

Real-time drift dashboards

Threat correlation with incidents

v2.0

Full cross-company anonymised threat intelligence

Predictive threat clustering across industries

Federated machine learning (optional)

5. VERSION TAGGING REQUIREMENTS

When changes occur:

Update ChangeLog

Update relevant docs

Update module version tag

Stamp Foreman approval

Package & deploy

No release may occur without a corresponding Changelog entry.

✔ END OF THREAT_CHANGELOG_v1.0.md