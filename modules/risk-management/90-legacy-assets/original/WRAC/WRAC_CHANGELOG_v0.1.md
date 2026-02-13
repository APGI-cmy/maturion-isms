📄 WRAC_CHANGELOG_v0.1.md

Workplace Risk Assessment & Control – Changelog & Version History
Version 0.1

0. Purpose

This changelog documents all structural, architectural, functional, and design updates to the WRAC module.
It is intended for:

Foreman oversight

Developer reference

QA traceability

Governance auditability

Change-control compliance

Every update to WRAC must be added here before being merged into the main branch.

1. Version Summary
Version	Date	Type	Description
0.1	Initial	Major	Initial full module definition, architecture, schema, wiring, QA & sprint plan
2. v0.1 – Initial WRAC Module Release
2.1 Architecture

Added:

WRAC_TRUE_NORTH_v0.1.md

Full domain definitions:

Risk-centric WRAC

Control-centric WRAC

CCR integration

Live Risk pipeline

Strategy builder

PIT integration

Remote Assurance integration

Alignment to RA Engine, Control Library, ERM, PIT, Bowtie

2.2 Database Layer

Added:

All WRAC tables

Risk–Control mapping schema

Control Instance & CCR tables

Live Risk & Strategy tables

Full RLS model

Indexing strategy

Matches: WRAC_DATABASE_SCHEMA_v0.1.md

2.3 Edge Functions

Added:

22 WRAC endpoints

Live risk computation (individual + batch)

Control impact calculations

Strategy grouping logic

PIT export function

Remote Assurance ingest function

Export generators

AI assistance routing

Matches: WRAC_EDGE_FUNCTIONS_v0.1.md

2.4 Frontend Components

Added:

WRAC master layout

Risk-centric UI

Control-centric UI

CCR UI

Strategy builder UI

Export UI

Shared components

AI assistance panels

Matches: WRAC_FRONTEND_COMPONENT_MAP_v0.1.md

2.5 Wireframes

Added:

Full ASCII wireframes

Four UI tabs

Strategy panels

Control impact layout

CCR dashboard

Alerts section

Matches: WRAC_WIREFRAMES_v0.1.md

2.6 QA Blueprint

Added:

387 test requirements

Domain → Data → Backend → UI → Integration → Regression → Watchdog

Full dependency checks

Foreman sign-off conditions

Matches: WRAC_QA_IMPLEMENTATION_PLAN_v0.1.md

2.7 Export Specifications

Added:

WRAC sheet

Strategy report

CCR report

Live risk dashboard export

PIT export package

Executive PDF/HTML summary

Formatting & colouring rules

Hyperlink rules

Anonymisation options

Matches: WRAC_EXPORT_SPEC_v0.1.md

2.8 Sprint Plan

Added:

8 sprints

Dependencies

QA gates

Completion criteria

Roles and responsibilities

Matches: WRAC_SPRINT_PLAN_v0.1.md

3. Next Version (v0.2) Scope – Planned Enhancements

(These are not yet implemented; they track proposed changes.)

3.1 Additional Features to Consider

Control Dependency Graphs

Bowtie Integration UI

Real-time alert streams (WebSocket)

Multi-company cross-risk benchmarking

Predictive risk forecasting model

Adaptive risk appetite based on trend signals

3.2 Documentation to Add

WRAC user manual

Remote Assurance plug-in manual

Control instance template library

✔ End of WRAC_CHANGELOG_v0.1.md