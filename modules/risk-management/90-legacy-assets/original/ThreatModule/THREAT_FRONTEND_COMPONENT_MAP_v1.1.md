THREAT_FRONTEND_COMPONENT_MAP_v1.1.md

Threat Module — Frontend Component Map
Version 1.1
Aligned with:

THREAT_TRUE_NORTH_v1.0.md

THREAT_DATABASE_SCHEMA_v1.1.md

THREAT_EDGE_FUNCTIONS_v1.1.md

Maturion ISMS Shell & Design Language

SRMF One-Time Build, Zero Regression Standards

Framework assumptions:

React + Next.js

TailwindCSS

Zustand/Redux for state

Standard Maturion layout shell

0. PURPOSE

This document defines all UI components and pages required to implement the Threat Module:

Page structure & routing

Component responsibilities

State stores & data flow

AI-assist UX patterns

Integration hooks (RA, Vulnerability, WRAC, PIT, Incident, Remote Assurance)

The goal: a minimalistic, high-signal UI that hides complexity behind a wizard-like flow, while giving the SRMF engine all the detail it needs.

1. TOP-LEVEL ROUTES

All Threat Module pages live under:

/threats

Route map:

/threats
  ├── dashboard
  ├── library
  │     ├── list
  │     └── view/:threat_id
  ├── create
  ├── edit/:threat_id/:version_id
  ├── review/:version_id
  ├── classify/:version_id
  ├── tap/:version_id
  ├── ttp/:version_id
  ├── drift/:version_id
  ├── linking/:version_id
  ├── audit/:version_id
  ├── exports/:version_id
  └── intelligence

2. GLOBAL / SHARED COMPONENTS
2.1 <ThreatShellLayout />

Wraps all Threat pages inside ISMS shell:

Top nav (module selector)

Left nav (Threat sub-pages)

Main content area

2.2 <ThreatOrgSelector />

Company selector

Applies org-wide filter and RLS to all threat queries.

2.3 <ThreatProfileHeader />

Used at top of all detail pages:

Threat name

Threat code

Version & status badge

Category/subcategory chips

Buttons: [View Library] [Audit] [Exports]

2.4 <ThreatStatusBadge />

Status: draft, pending, approved, published, archived.

2.5 <ThreatVersionChip />

Shows version vX.Y.Z and indicates if it’s the latest / published.

2.6 <ThreatRoleGuard />

Client-side enforcement for:

THREAT_ANALYST

THREAT_REVIEWER

THREAT_MANAGER

ORG_READONLY

Wraps sensitive buttons: Approve, Publish, Delete, AI Accept.

2.7 <AISuggestionBanner />

Reusable banner to show AI proposals:

“AI suggestion available”

Confidence score

[View suggestion] / [Discard]

3. PAGE GROUP: DASHBOARD
3.1 /threats/dashboard

Purpose: High-level Threat landscape overview.

Components:

<ThreatDashboardHeader />

<ThreatMetricsCards />

Total Active Threats

Threats by category (adversarial/non)

Top 10 by drift score

Top 10 by capability

<ThreatDriftOverviewChart />

<ThreatCategoryHeatmap />

<ThreatAlertList />

<ThreatQuickActions />

[ + New Threat ]

[ View Library ]

[ Go to Intelligence ]

4. PAGE GROUP: THREAT LIBRARY
4.1 /threats/library

Components:

<ThreatLibraryFilterBar />

Search box

Category filter

Subcategory filter

Status filter

Facility/process filter

Drift severity slider

<ThreatLibraryTable />

Threat Code

Name

Category/Subcategory

Latest Version & Status

Drift score

Linked facilities count

Actions: [View], [Edit Draft], [Clone]

4.2 /threats/library/view/:threat_id

Components:

<ThreatProfileHeader />

<ThreatVersionTimeline />

v1.0 (Published)

v1.1 (Approved)

v1.2 (Draft)

<ThreatVersionSummaryPanel />

<ThreatKeyAttributesCard />

Category, Type, Capability/Motivation/Opportunity, Historical frequency

<ThreatTAPSummaryCard />

<ThreatTTPBadgeList />

<ThreatDriftSummaryCard />

<ThreatLinksSummaryCard /> (Processes + Facilities)

<ThreatUsageImpactCard />

“Used in 13 RA records, 2 WRAC sheets, 4 PIT projects”

5. PAGE GROUP: CREATE / EDIT (WIZARD)
5.1 /threats/create

Wizard-style flow:

Step 1: Basics
Step 2: Classification
Step 3: Actor Profile (TAP)
Step 4: TTP Mapping
Step 5: Drift & Trend
Step 6: Linking (Processes / Facilities)
Step 7: Review & Submit


Components:

<ThreatCreationWizard />

<ThreatWizardStepBar />

<ThreatBasicsForm />

Name

Description

Category/Subcategory

Threat Type (adversarial/non)

<ThreatWizardNavigation />

[Back] [Next] [Save Draft]

5.2 /threats/edit/:threat_id/:version_id

Uses the same wizard but loads existing draft version.

6. PAGE GROUP: CLASSIFICATION
6.1 /threats/classify/:version_id

Components:

<ThreatProfileHeader />

<ThreatClassificationForm />

Threat Type (adversarial/non)

Capability Level (1–5)

Motivation Level (1–5)

Opportunity Level (1–5)

Resource Level (1–5)

Historical frequency (numeric)

Domain relevance (checkboxes: security, safety, etc.)

<ThreatClassificationScorePreview />

Visual representation of capability/motivation/opportunity as radar chart or bar segments.

<ThreatClassificationAIBar />

[AI Suggest Classification] button

Shows AI proposal, compare view:

Current vs AI suggestion

[Accept suggestions] [Reject]

7. PAGE GROUP: THREAT ACTOR PROFILE (TAP)
7.1 /threats/tap/:version_id

Components:

<ThreatProfileHeader />

<ThreatActorProfileForm />

Actor Type selector (insider, syndicate, criminal, competitor, etc.)

Skill level slider

Resources (free text)

<ThreatCapabilitiesList />

Each row: capability name, severity (1–5), evidence, AI tag

[Add capability] button (modal)

<ThreatBehaviourVectorPreview />

Simple visual of behaviour_vector (e.g., heatbar / radar)

<ThreatTAPAIControls />

[AI Generate TAP] [AI Suggest Capabilities]

Modal with suggestion list + checkboxes to accept items.

8. PAGE GROUP: TTP MAPPING
8.1 /threats/ttp/:version_id

Components:

<ThreatProfileHeader />

<TTPFilterBar />

Domain filter (physical, cyber, hybrid)

Technique search

<ThreatTTPSelectedList />

Selected TTPs for this threat

Confidence

AI/Manual flag

Actions: [Edit], [Remove]

<TTPReferenceGrid />

All available TTPs from ttp_reference_library

Columns: Code, Name, Domain, Default Controls, Default Detection

Buttons: [Add to Threat]

<TTPAISuggestionPanel />

[AI Suggest TTPs] opens modal

Suggestion list with confidence & explanation

9. PAGE GROUP: DRIFT & DYNAMIC RISK
9.1 /threats/drift/:version_id

Components:

<ThreatProfileHeader />

<ThreatDriftTimelineChart />

Drift score over time

Markers for incidents/intel updates

<ThreatDriftDetailsPanel />

Current drift score

Source (incident / intel / AI / manual)

Drift reason

<ThreatDriftUpdateForm />

Manual update of drift metrics (for Threat Manager)

<ThreatAIDriftPanel />

[AI Compute Drift from Incidents]

[AI Compute Drift from Remote Assurance]

<ThreatReassessmentIndicators />

When drift score > threshold, show RA/WRAC reassessment flags.

10. PAGE GROUP: LINKING (PROCESSES & FACILITIES)
10.1 /threats/linking/:version_id

Split layout:

+----------------+----------------------------------------------+
| Left: Scope    | Right: Linked Entities                      |
+----------------+----------------------------------------------+


Components:

<ThreatProfileHeader />

<ThreatLinkingTabs />

[Facilities] [Processes]

<FacilityTreeSelector />

Hierarchical view of org → sites → facilities → zones

Checkboxes to link/unlink

<ProcessListSelector />

List of processes/lifecycles

<ThreatLinkRelevanceSlider />

For each link: relevance 0–1

<ThreatLinkJustificationEditor />

Text area for why this threat is relevant

<ThreatLinkSummaryPanel />

Totals:

Facilities linked
Processes linked

Impact on RA (count of potential UE combinations if vulnerability exists)

11. PAGE GROUP: REVIEW & WORKFLOW
11.1 /threats/review/:version_id

Components:

<ThreatProfileHeader />

<ThreatReviewChecklist />

Basics complete

Classification complete

TAP present (if adversarial)

TTP mapping present

Drift initialised

Links to at least one facility or process

<ThreatReviewSummaryCards />

Summary of main attributes

<ThreatReviewActions />

[Submit for Review] (Analyst)

[Approve] / [Reject] (Reviewer)

[Publish] (Manager only)

<ThreatReviewCommentsTimeline />

Reviewer comments

Rejection reasons

Sign-off records

12. PAGE GROUP: AUDIT & EXPORTS
12.1 /threats/audit/:version_id

Components:

<ThreatProfileHeader />

<ThreatAuditFilterBar />

Date range

Action type

User

<ThreatAuditTable />

Date/Time

User

Action

“View diff” button

<ThreatAuditDiffModal />

Old vs new values (JSON pretty diff)

[AI Explain Change] button

AI explanation panel (read-only)

12.2 /threats/exports/:version_id

Components:

<ThreatProfileHeader />

<ThreatExportOptions />

 JSON

 YAML

 PDF

 CSV (classification)

 CSV (TTP)

 Full ZIP bundle

<ThreatExportGenerateButton />

<ThreatExportResultPanel />

Download links

Checksum display

“Copy hash to clipboard”

13. PAGE GROUP: INTELLIGENCE
13.1 /threats/intelligence

Components:

<ThreatIntelligenceHeader />

<ThreatCategoryStats />

<ThreatTopDriftTable />

<ThreatClusterVisualization />

Threats grouped by pattern / TAP similarity

<ThreatFacilityExposureMap />

<ThreatIntelligenceFilterBar />

<ThreatAIInsightsPanel />

AI summary: “Key threat themes for last 90 days”

[Regenerate] button (role-guarded)

14. SUPPORTING UI COMPONENTS
14.1 Common Inputs

<ThreatCategorySelector />

<ThreatSubcategorySelector /> (dependent on Category)

<ThreatTypeToggle /> (Adversarial / Non-Adversarial)

<ThreatScaleSlider /> (1–5 with labels)

<ThreatScoreBadge /> (capability/motivation/opportunity)

<ThreatDomainRelevanceSelector />

Security / Safety / Environmental / Operational / Financial / Reputation

14.2 Layout Helpers

<SplitPane /> (for side-by-side views)

<DrawerPanel /> (for mobile & small screens)

<StickyActionBar /> (Save/Submit buttons anchored at bottom)

15. STATE MANAGEMENT (Zustand/Redux Stores)
15.1 useThreatWizardStore

currentStep

draftThreatId

draftVersionId

partial form data per step

dirty state flag

15.2 useThreatClassificationStore

classification data

AI suggestions

validation errors

15.3 useThreatTAPStore

actor profile data

capabilities array

AI suggestions

15.4 useThreatTTPStore

selected TTPs

available TTPs

AI suggestions

15.5 useThreatDriftStore

drift history

current drift metrics

AI-suggested drift adjustments

15.6 useThreatLinksStore

linked facilities

linked processes

relevance scores

pending operations

15.7 useThreatWorkflowStore

status

review comments

approvals

15.8 useThreatAuditStore

audit events

diff details

16. ROUTING SUMMARY
/threats/dashboard
/threats/library
/threats/library/view/:threat_id
/threats/create
/threats/edit/:threat_id/:version_id
/threats/classify/:version_id
/threats/tap/:version_id
/threats/ttp/:version_id
/threats/drift/:version_id
/threats/linking/:version_id
/threats/review/:version_id
/threats/audit/:version_id
/threats/exports/:version_id
/threats/intelligence


Each route is wrapped in <ThreatShellLayout /> and uses <ThreatOrgSelector /> and <ThreatProfileHeader /> where applicable.

17. ACCESS CONTROL (UI LEVEL)
Role	Create	Edit (Draft)	Approve	Publish	Delete	Use AI
THREAT_ANALYST	✔	✔	✖	✖	✔*	✔
THREAT_REVIEWER	✖	✔*	✔	✖	✖	✔
THREAT_MANAGER	✔	✔	✔	✔	✔	✔
ORG_READONLY	✖	✖	✖	✖	✖	✖

* Within limits and state rules.

Guarding is implemented with <ThreatRoleGuard />.

18. INTEGRATION TOUCHPOINTS (UI SIDE)

From RA / WRAC: “View Threat Details” deep link opens /threats/library/view/:threat_id

From PIT: threat-driven project links back to corresponding threat’s drift or TTP page

From Incident: “Promote to Threat” opens threat creation wizard preloaded with incident data

From Remote Assurance: TTP-driven control gaps highlight relevant threats in library view

19. IMPLEMENTATION PRIORITY (UI)

Threat Library (list + view)

Create/Edit wizard (Steps 1–3)

TTP Mapping page

Drift & Linking pages

Review & Workflow page

Audit & Exports

Dashboard & Intelligence

AI helper surfaces

✔ END OF THREAT_FRONTEND_COMPONENT_MAP_v1.1.md