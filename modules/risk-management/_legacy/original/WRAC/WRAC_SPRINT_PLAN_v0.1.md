WRAC_SPRINT_PLAN_v0.1.md

Workplace Risk Assessment & Control – Development Sprint Plan
Version 0.1

Aligned to:

WRAC_TRUE_NORTH_v0.1

WRAC_DATABASE_SCHEMA_v0.1

WRAC_EDGE_FUNCTIONS_v0.1

WRAC_FRONTEND_COMPONENT_MAP_v0.1

WRAC_WIREFRAMES_v0.1

WRAC_QA_IMPLEMENTATION_PLAN_v0.1

WRAC_EXPORT_SPEC_v0.1

MATURION_BUILD_PHILOSOPHY_v1.1

MATURION_TRUE_NORTH_v1.2

0. PURPOSE

This sprint plan defines:

Build sequence

Sprint breakdown

Deliverables per sprint

QA gates

Foreman oversight actions

Dependencies

End-of-sprint validation

Integration points and wiring sequence

The aim is to ensure WRAC is built once, cleanly, with no redundancy, no rewriting, and no rework, fully aligned to the wider Risk Management ecosystem.

1. DEVELOPMENT PRINCIPLES
1.1 True North Compliance

Every task must map to a True North section.
Every feature must have:

Architecture

QA

Implementation

Wiring test

Watchdog hook

1.2 One-Time-Build

No provisional components.
No untracked adjustments.
No incremental fixes without updating True North.

1.3 Foreman Governance

Foreman ensures:

No deviation from wireframes

No “UI improvisation”

No undocumented data fields

No hidden logic in the frontend

All logic in Edge Functions

All data flows validated by QA

1.4 Sprint Philosophy

Sprints are vertical slices, not horizontal layers.

Each sprint results in a demo-ready and testable slice of the system.

Sprints close only when QA suite passes.

2. HIGH-LEVEL SPRINT SEQUENCE

WRAC requires 8 sprints, logically sequenced:

Sprint 1 — Foundations & Schema
Sprint 2 — Risk View Backend
Sprint 3 — Risk View Frontend
Sprint 4 — Control View Backend
Sprint 5 — Control View Frontend
Sprint 6 — CCR + Live Risk (Backend + Frontend)
Sprint 7 — Strategy Builder + PIT Integration
Sprint 8 — Exports, AI Assistance & Final QA

3. SPRINT DETAIL
SPRINT 1 — FOUNDATIONS & SCHEMA
Objectives

Create all WRAC tables

Establish relationships

Implement RLS & permissions

Prepare mock data

Create WRAC API client scaffolding

Deliverables

wrac_risk_view

risk_control_map

control_instances

control_implementation

control_performance

control_ccr_status

risk_live_scores

wrac_strategy_groups

wrac_strategy_items

wrac_signoff_log

wrac_exports

QA

Schema → True North diff must be zero

PK/FK & constraints validated

All indexes present

RLS table-level tests

Exit Criteria

Schema matches WRAC_DATABASE_SCHEMA_v0.1.md

Backoffice tool can view all tables

Test records insert & query correctly

Ready for Edge Function implementation

SPRINT 2 — RISK VIEW BACKEND
Objectives

Build all backend logic for WRAC risk-centric view.

Edge Functions Completed

GET /wrac/risks

GET /wrac/risk/:risk_id

POST /wrac/risk/:risk_id/decision

POST /wrac/compute/live-risk/:risk_id

POST /wrac/compute/live-risk/batch

POST /wrac/compute/roi/:risk_id

Supporting Logic

Appetite calculation

CCR aggregation into risk

Control contribution aggregation

Cost/ROI calculations

Live risk pipeline

QA

100+ backend unit tests

Live risk calculation deep simulations

Appetite band boundary tests

Error handling tests

Performance tests on risk listing

Exit Criteria

All risk data flows correct

/wrac/risks fully operational

/wrac/risk/:id returns complete structure

Decision workflow functioning

No frontend yet

SPRINT 3 — RISK VIEW FRONTEND
Objectives

Implement the full WRAC Risk View frontend.

Components Built

<WracWorkspaceLayout>

<WracFiltersBar>

<WracMetricsBar>

<WracRiskTable>

<WracRiskDetailPanel>

<NodeSelector> (reuse)

<HeatmapBadge>

<RoiBadge>

<CcrStatusChip>

<AiAssistPanel> (risk context)

QA

UI matches ASCII wireframes exactly

80+ UI tests

Sorting, filtering, pagination tests

Decision workflow tests

Heatmap/colour tests

Narrative generation tests (AI optional, no auto-invocation)

Exit Criteria

Fully functional risk-centric view

Foreman sign-off on layout perfection

SPRINT 4 — CONTROL VIEW BACKEND
Objectives

Implement all backend logic for the control-centric view.

Edge Functions Completed

GET /wrac/controls

GET /wrac/controls/impact

POST /wrac/performance/ingest

Logic

Control efficacy aggregation

Impact matrix generation

Contribution breakdown

Monitoring method weighting

CCR health computation

QA

60 backend unit tests

Cross-check with control definitions

Multi-select control input tests

Exit Criteria

Backend complete for Control View

Accurate mitigation contribution logic

SPRINT 5 — CONTROL VIEW FRONTEND
Objectives

Build all UI components for the Control-centric workspace.

Components

<WracControlsTab>

<WracControlFiltersBar>

<WracControlList>

<WracSelectedControlsPanel>

<WracControlImpactPanel>

<WracControlDetailDrawer>

<AiAssistPanel> (control context)

QA

Validate wireframe layout

Performance: table loads < 2.5s

Filter behaviours

Multi-selection logic

Impact calculation display

Exit Criteria

End-to-end functional control view

Cross-navigation to risk detail stable

SPRINT 6 — CCR + LIVE RISK
Objectives

Implement full critical control monitoring and live risk behaviour.

Backend

Live risk batch engine

CCR rollups

Remote Assurance ingest integration

Alerts logic

Frontend

<WracCcrTab>

<CcrSummaryCards>

<CcrControlsTable>

<LiveRiskTrendChart>

<WracAlertsPanel>

QA

Simulated RA ingest tests

Live risk drift scenarios

CCR threshold tests

Red/Amber/Green validation

Trend chart correctness

Exit Criteria

Real-time WRAC fully functional

CCR & Live Risk operational

Watchdog integrated

SPRINT 7 — STRATEGY BUILDER + PIT INTEGRATION
Objectives

Develop full risk mitigation strategy tools.

Backend

/wrac/strategy/* endpoints

Strategy grouping & metrics computation

PIT export function

Frontend Components

<WracStrategyTab>

<WracStrategySummaryCards>

<WracStrategyList>

<WracStrategyDetailPanel>

<WracExportPanel>

Logic

Risk → control grouping

Combined ROI calculation

Combined ALE improvement

Project creation structures

QA

PIT integration simulations

Strategy correctness checks

Multi-risk multi-control scenarios

Export → PIT → return test

Exit Criteria

Strategy builder fully functional

PIT export accepted without modification

SPRINT 8 — EXPORTS, AI, & FINAL QA
Objectives

Deliver all export formats + AI assistance.

Backend

/wrac/export/wrac

/wrac/export/strategy

/wrac/export/ccr

Executive PDF/HTML builder

Frontend

Export modals

AI summary generation buttons

Download links

Export history list

QA

100+ export correctness tests

ERM colour validation

ALE & ROI field validation

Multi-sheet export validation

PDF/HTML alignment with specification

Cross-company anonymisation tests

Exit Criteria

WRAC module fully production-ready

Foreman sign-off

Watchdog baseline set

Zero open defects

4. DEPENDENCIES & BLOCKERS

WRAC depends on:

RA Engine outputs (must be stable)

Control Library definitions

PIT module v0.1 (already completed)

Remote Assurance endpoints (partial scaffolding acceptable)

ERM configuration per company

Organisational hierarchy module

No sprint may begin until all dependencies for that sprint are validated as available.

5. ROLES & RESPONSIBILITIES
Foreman

Approval of sprint readiness

Architecture enforcement

QA coverage monitoring

No build allowed without prior QA-complete status

Builder Teams

Frontend Builders

Backend Builders

Database Builders

QA Automation Builders

AI Prompt behaviour engineers

Assurance Team

Validate calculations

Validate appetite & governance flows

Validate PUE & Bowtie triggers

6. COMPLETION CRITERIA (DEFINITION OF DONE)

WRAC is considered DONE when:

All 8 sprints complete

All QA gates passed

All 387 WRAC QA tests passing

All UI matches wireframes exactly

All exports validated against spec

Live risk updates in real-time

PIT integration fully operational

Remote Assurance integration functional

AI assistance safe and contextual

Watchdog confirms no anomalies

Foreman signs off

✔ END OF WRAC_SPRINT_PLAN_v0.1.md