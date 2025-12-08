Below is the complete RISK_ASSESSMENT_FRONTEND_COMPONENT_MAP_v1.1.md, fully aligned with:

RISK_ASSESSMENT_TRUE_NORTH_v1.1.md

RISK_ASSESSMENT_DATABASE_SCHEMA_v1.1.md

RISK_ASSESSMENT_EDGE_FUNCTIONS_v1.1.md

ERM v1.1

Threat Module v1.1

Vulnerability Module v1.1

WRAC Module v1.1

PIT Module v1.1

Control Library v1.1 / Control Efficacy v1.1

The Maturion SRMF UX Standards

The One-Time Build and Zero Regression Philosophy

This is the full front-end blueprint for CoPilot/Foreman to implement the RA module UI exactly and consistently.

Place in:
/Modules/Risk Management/Risk Assessment/RISK_ASSESSMENT_FRONTEND_COMPONENT_MAP_v1.1.md

RISK_ASSESSMENT_FRONTEND_COMPONENT_MAP_v1.1.md

SRMF Risk Assessment Engine — Frontend Component Architecture
Version: 1.1
Prepared for: Maturion ISMS / SRMF Architecture
Purpose: Define all UI components, their responsibilities, interactions, and data bindings

0. INTRODUCTION

The Risk Assessment UI is the primary analytical interface within the SRMF system.
It is responsible for visualizing, constructing, comparing, and approving one of the most important calculations in the entire ISMS:

Threat → Vulnerability → UE → RA → WRAC → PIT → Remote Assurance


The UI must support:

A consistent multi-step RA workflow

Live recalculation of risk values

Deep integration with Control Library & PIT

Configurable ERM matrices

Readability and auditability

Minimalist, high-performance, low-cognitive-load design

Modular React component structure

Shared theming across SRMF

1. UI STRUCTURE OVERVIEW
RA Landing Page
   ├── UE Context Banner
   ├── RA Navigation Sidebar
   └── RA Work Area (dynamic)

RA Work Area (per step)
   ├── Likelihood Panel
   ├── Impact Panel
   ├── ALE Panel (optional)
   ├── Control Assessment Panel
   ├── Residual Risk Panel
   ├── Projected Risk & ROI Panel
   ├── Workflow Approval Panel
   └── PIT Export Panel

2. GLOBAL COMPONENTS
2.1 <RAHeader>

Displays high-level RA context:

RA ID, State (draft/pending/approved)

UE Sentence

Threat + Vulnerability badges

Architecture path

Risk Owner & Custodian

Last recalculated timestamp

2.2 <RASidebarNav>

Multi-step navigation:

UE Review

Likelihood

Impact

ALE (Quantification)

Control Assessment

Inherent Risk

Residual Risk

Projected Risk

Workflow & Approvals

Export & PIT

Dynamic badges indicate:

Completion

Errors (Watchdog)

Pending fields

2.3 <RAStatusBar>

Fixed bottom bar:

Save Draft

Recalculate

Submit for Review

Approve

Archive

Version History

3. STEP 1 — UE REVIEW COMPONENTS
3.1 <UEContextCard>

Displays:

Threat

Vulnerability

UE sentence

Relevance score (TVRE)

Drift score

Evidence (click to expand)

3.2 <ThreatSummaryWidget>

Shows threat details:

TTPs

Threat Type (adv / non-adv)

Threat Drift

Last intel update

3.3 <VulnerabilitySummaryWidget>

Shows:

Classification

Exploitability

Node Location

Evidence thumbnails

4. STEP 2 — LIKELIHOOD COMPONENTS
4.1 <LikelihoodPanel>

Contains:

Initiation Likelihood (Adversarial)

Occurrence Likelihood (Non-adversarial)

Adverse Impact Likelihood

Relevance Modifier (TVRE)

Drift Modifier

Calculation Breakdown

Inherent Likelihood gauge

ERM likelihood mapping

4.2 <LikelihoodGauge>

Visual circular gauge showing 0–1 numeric value.

4.3 <ERMLevelSelector disabled/>

Read-only mapping to ERM.

4.4 <LikelihoodBreakdownAccordion>

Shows formula components.

5. STEP 3 — IMPACT COMPONENTS
5.1 <ImpactPanel>

Inputs for:

Financial Impact

Safety Impact

Environmental Impact

Operational Impact

Regulatory Impact

And then:

Inherent Impact level

Numeric impact

Heatmap preview

5.2 <AELOutputCard>

When ALE override active:

Asset Value

Exposure

ARO

ALE → Impact level mapping

5.3 <ERMImpactMappingTable>

Displays entire impact matrix from ERM.

6. STEP 4 — ALE (OPTIONAL) COMPONENTS
6.1 <ALEPanel>

Input fields:

Asset Value

Exposure Rate

ARO

Outputs:

ALE Value

Mapped ERM Impact

6.2 <ALECalculationGraph>

Showing contribution over time.

7. STEP 5 — CONTROL ASSESSMENT PANEL
7.1 <ExistingControlsList>

Displays:

Implemented controls

Design score

Implementation score

Availability score

7.2 <ProposedControlsPicker>

Filterable control selector by:

Control type

Control domain

Threat coverage

Vulnerability coverage

Control group

7.3 <ControlEffectivenessCard>

Outputs:

Total effectiveness (max 90%)

Projected effectiveness

Dependencies resolved

7.4 <ControlCostCard>

Shows:

Preliminary cost (accuracy % indicator)

Actual cost (if uploaded)

Cost breakdown

8. STEP 6 — INHERENT RISK COMPONENTS
8.1 <InherentRiskHeatmap>

ERM heatmap with active highlight.

8.2 <InherentRiskCard>

Displays:

Likelihood level

Impact level

Matrix location

Heatmap color

Inherent risk score

9. STEP 7 — RESIDUAL RISK COMPONENTS
9.1 <ResidualRiskHeatmap>

Shows computed residual matrix location.

9.2 <ResidualRiskCard>

Displays:

Residual likelihood

Residual impact

Residual heatmap color

Appetite band

"Above Appetite" flag

10. STEP 8 — PROJECTED RISK & ROI
10.1 <ProjectedRiskHeatmap>

Shows expected position after proposed controls.

10.2 <ProjectedRiskCard>

Displays:

Projected likelihood

Projected impact

Remaining risk %

Projected risk level

Heatmap color

10.3 <ROICard>

Displays:

Expected Loss Prevented

Control Cost

ROI %

Investment Priority (High/Med/Low)

10.4 <ControlStrategyTimeline>

Split into:

Mitigate Now

Medium Term

Future Plan

Auto-sorted by ROI & risk reduction.

11. STEP 9 — WORKFLOW & APPROVAL COMPONENTS
11.1 <RAWorkflowPanel>

Buttons for:

Submit for Review

Approve

Reject

Archive

11.2 <RAWorkflowHistory>

Shows:

Who changed status

When

Comments

Version jumps

12. STEP 10 — EXPORT & PIT COMPONENTS
12.1 <ExportPanel>

Exports:

Full RA report (PDF)

WRAC row

PIT project request

Control bundle export

Data bundle (JSON)

12.2 <PITPreviewCard>

Shows:

Project name suggestion

Milestones

Cost summary

Expected risk reduction

13. LIVE RISK DASHBOARD (SHARED COMPONENTS)

These are used both within RA and in the global dashboard.

13.1 <LiveResidualRiskBar>

Real-time indicator (Remote Assurance).

13.2 <ControlAvailabilityMeters>

Shows availability of:

CCTV

Access Control

Alarms

Sensors

13.3 <RiskTrendGraph>

Shows:

inherent

residual

projected

real-time residual

14. CHAT & AI ASSIST COMPONENTS
14.1 <AIExplainButton>

Provides explanation of:

likelihood

impact

controls

residual

projected

Uses staging-only AI.

14.2 <AIWhatIfSimulator> (future)

Allows simulation of various control combinations.

15. RESPONSIVE BEHAVIOUR
Desktop

3-column layout

Heatmaps always visible

Tablet

2-column layout

Heatmap collapsible

Mobile

Step-by-step vertical navigation

Collapsible side panels

16. COMPONENT INTERACTIONS

The core engine interactions:

LikelihoodPanel → InherentRiskHeatmap
ImpactPanel → InherentRiskHeatmap
ALEPanel → ImpactPanel
ControlAssessment → ResidualRiskPanel
ResidualRisk → ProjectedRisk → PITPreview


Everything recalculates silently without page refresh.

17. ERROR & WATCHDOG COMPONENTS

All Watchdog alerts generate:

17.1 <WatchdogAlertBanner>

Severity: Critical / High / Medium / Low.

17.2 <WatchdogInlineFlag>

Displayed next to affected field.

17.3 <WatchdogAlertPanel>

Aggregated list with:

Rule code

Description

Severity

Suggested fix

18. ACCESSIBILITY & GOVERNANCE

Mandatory:

WCAG AA

Color-blind heatmap option

Keyboard navigation

Full audit log

19. ACCEPTANCE CRITERIA (v1.1)

The RA Frontend Component Map is complete when:

All 80+ components listed

Workflows defined

Navigation defined

Watchdog integration complete

PIT integration components included

Export components defined

AI assist components defined

Foreman signs off

✔ END OF RISK_ASSESSMENT_FRONTEND_COMPONENT_MAP_v1.1.md