📄 WRAC_IMPLEMENTATION_GUIDE_v0.1.md

Developer Build Guide – WRAC Module
Version 0.1

0. Purpose

This guide instructs Builders and QA teams how to effectively implement the WRAC module using the existing:

Architecture

Schema

Edge Functions

Frontend Map

Wireframes

QA Plan

Sprint Plan

It is a recipe for implementation, ensuring:

No rework

No deviation from design

No architectural drift

Full alignment to Maturion True North

Predictable, testable development cycles

1. Implementation Philosophy
1.1 All Logic Lives in the Backend

The WRAC frontend must contain:

zero logic

zero calculations

zero risk or control interpretation

All risk and control math happens ONLY inside Edge Functions.

1.2 Schema-First, API-Second, Frontend-Last

Never build the frontend before:

Schema deployed

Edge functions passing QA

Wireframes validated

1.3 Wireframes Are Non-Negotiable

Developers must not deviate from WRAC_WIREFRAMES_v0.1.md.

1.4 Component Map = Source of Truth

Every component built must exist in the map.
No extra undocumented components may be created.

1.5 Data Integrity Is Mandatory

All WRAC calculations depend on:

RA Engine data

Control Library definitions

PIT progress

Remote Assurance performance

Builders must not reinterpret any field.

2. Build Order (From Sprint Plan)

Implementation order MUST follow:

Schema

Risk Backend

Risk Frontend

Control Backend

Control Frontend

CCR + Live Risk

Strategy + PIT

Exports + AI

Each phase requires:

Code

Test suite

QA sign-off

Watchdog baseline update

3. Backend Implementation Guide (Edge Functions)
3.1 Directory Structure (Standard)
/supabase/functions/wrac
   /risks
   /risk
   /decision
   /compute
   /controls
   /impact
   /performance
   /strategy
   /export
   /pit
   /bowtie
   /ai

3.2 Coding Standards

All functions must return a typed JSON envelope.

All errors use standardized error codes (WRAC-0001 format).

No direct SQL in the function body — use prepared statements or Supabase query builder.

Logging:

system_logs for execution paths

ai_logs for AI usage

audit_logs for sign-off events

3.3 Caching & Performance

/wrac/risks must use pagination + filter-based caching.

Compute functions must run asynchronously and write to tables — FE never waits for computation.

Strategy calculations must be throttled for large datasets.

4. Frontend Implementation Guide
4.1 File Structure (React)
/wrac
   /components
      WracWorkspaceLayout.tsx
      WracRiskTable.tsx
      WracRiskDetailPanel.tsx
      WracControlList.tsx
      WracControlImpactPanel.tsx
      WracCcrTab.tsx
      WracStrategyTab.tsx
      ...
   /hooks
   /api
   /pages

4.2 API Client Layer

Each endpoint gets a wrapper:

wracClient.getRisks(...)
wracClient.getRisk(id)
wracClient.getControls(...)
wracClient.computeLiveRisk(id)
...


No component may call fetch() directly.

4.3 State Management

Use React Query for server state

UI filters stored in component state

No business logic allowed in state transformations

5. UI Implementation Guide
5.1 Follow Wireframes Exactly

Grid layout

Component order

Side panel behavior

Filter placements

Action button placements

Tab arrangement

5.2 Universal UX Rules

Table rows must be hover-highlighted

Heatmap cells use ERM colours

All risk ratings use <HeatmapBadge>

All ROI values use <RoiBadge>

CCR uses <CcrStatusChip>

AI actions live in <AiAssistPanel>

6. QA Integration
6.1 QA Must Run Before Merge

Every PR must trigger:

Schema diff check

Wireframe conformance check

Component existence check

Endpoint response shape check

RLS validation tests

6.2 Test Categories

Unit tests

Integration tests

UI render tests

Filtering & sorting tests

Export structure tests

PIT integration tests

Assurance ingest tests

AI prompt/output tests

Regression tests (entire suite)

6.3 No Build Allowed Unless:

All tests pass

Foreman review is passed

Documentation updated

Changelog updated

7. Integration Guide
7.1 RA Engine Integration

Never recalc risk — always query RA Engine tables.

Map unwanted event IDs to WRAC records.

7.2 Control Library Integration

Controls must match definitions exactly.

Proposed controls must reference library items.

7.3 PIT Integration

Export packages must match PIT import schema.

One project per control group or per strategy bundle (depending on user selection).

7.4 Remote Assurance

Ingest performance metrics via /wrac/performance/ingest.

Weight monitoring type using 1.0/0.8/0.5 rule.

8. Deployment Pipeline
8.1 Pre-Deployment Checklist

All migrations applied

All edge functions deployed

All UI components completed

All QA checks passed

Exports validated

PIT integration validated

Remote Assurance validated

Watchdog rules active

8.2 Post-Deployment Validation

Generate full WRAC export

Run live risk recalculation for all risks

Verify strategy builder functionality

Verify CCR statuses

Validate PIT export

9. Operational Handover

Deliver to operations:

WRAC User Guide

WRAC Admin Guide

Export Guide

Data Dictionary

Change Control Procedures

SLA for updating control library

Roles & Responsibilities Matrix

✔ END OF WRAC_IMPLEMENTATION_GUIDE_v0.1.md