WRAC_EXPORT_SPEC_v0.1.md

Workplace Risk Assessment & Control – Export Specifications
Version 0.1

Aligned to:

WRAC_TRUE_NORTH_v0.1

WRAC_DATABASE_SCHEMA_v0.1

WRAC_EDGE_FUNCTIONS_v0.1

WRAC_FRONTEND_COMPONENT_MAP_v0.1

WRAC_WIREFRAMES_v0.1

CONTROL_LIBRARY_v0.1

RISK_ASSESSMENT_TRUE_NORTH_v0.1

PIT Architecture & Export Specs

LRG Training Unit 8 (Risk Appetite & WRAC formatting)

JUP RA final tables & formatting principles

0. PURPOSE

This specification defines the format, structure, fields, layout, styling, and export rules for all WRAC-related outputs. These outputs must be:

Consistent across companies and projects

Machine-readable for PIT, RA Engine, BI tools

Human-readable for executives, governance committees, assurance teams

Aligned with ERM heatmaps, risk scoring, appetite rules, and control evaluation models

The exports include:

WRAC Sheet (baseline WRAC output)

Risk Mitigation Strategy Report

CCR Report (Critical Control Register)

Live Risk & Control Performance Dashboard Export

PIT Export Package (project creation format)

HTML/PDF Summary (Executive Risk Briefing)

All exports can be generated in:

Excel (.xlsx)

CSV (data only)

JSON (API consumption)

PDF/HTML (via frontend renderer)

1. GENERAL EXPORT PRINCIPLES
1.1 Data Must Match Canonical Truth

Exports must not recompute values.
All numeric fields come from:

RA Engine (inherent/residual/projected risk, ALE)

WRAC Edge Functions (live risk, ROI, CCR-weighted performance)

Control Library (design efficacy)

PIT (implementation progress)

Remote Assurance (operational performance)

1.2 ERM Colours & Styling

Heatmap-based fields use ERM colours and labels exactly.
(Example: Low = green, Medium = yellow, Significant = orange, High = red, Extreme = dark red.)

1.3 Fixed Column Naming

Column headers must be exact, for automated PIT import and BI ingestion.

1.4 Export Timestamp & Metadata Block

Every export must include:

Export type

Node name

Date/time

User name

Version identifiers (ERM vX, RA Engine vX, WRAC vX)

2. EXPORT TYPE 1 — WRAC SHEET

(Workplace Risk Assessment & Control Sheet)

This mirrors the conceptual Excel file you provided — but improved & standardised.

2.1 Sheet Name

WRAC_<NodeCode>_<YYYYMMDD>

2.2 Column Structure (Left → Right)
Section A — Identification
Column	Label	Source
A	Risk ID	ra_risks.id
B	Architecture Component	mapped from org hierarchy
C	Process / Facility	vulnerability source
D	Unwanted Event	RA Engine NLP output
E	Threat Description	threat module
F	Vulnerability Description	vulnerability module
Section B — Risk Scoring
Column	Label	Description
G	Inherent Risk Rating	heatmap descriptor
H	Inherent Risk Score	numeric
I	Residual Risk Rating	descriptor
J	Residual Risk Score	numeric
K	Projected Risk Rating	descriptor
L	Projected Risk Score	numeric
M	Live Risk Rating	descriptor
N	Live Risk Score	numeric
Section C — Financials
Column	Label
O	ALE Inherent
P	ALE Residual
Q	ALE Projected
R	Remaining Risk %
S	ROI %
Section D — Controls
Column	Label	Notes
T	Existing Controls	comma-separated list + hyperlink to control instances
U	Proposed Controls	list + hyperlink
V	Control Contribution (%)	total
W	Critical Controls	list
Section E — CCR & Performance
Column	Label
X	CCR Status (G/A/R)
Y	Implementation Progress (%)
Z	Operational Performance (%)
Section F — Governance
Column	Label
AA	Appetite Threshold
AB	Appetite Status
AC	Decision
AD	Custodian Sign-off
AE	Risk Owner Sign-off
AF	Bowtie Required
AG	PUE Flag
Section G — Export Metadata

(Appended at bottom automatically)

Export Type: WRAC Sheet
Node: <Node Name>
Date: <YYYY-MM-DD HH:mm>
User: <Full Name>
Version: ERM vX, RA Engine vX, WRAC v0.1

3. EXPORT TYPE 2 — RISK MITIGATION STRATEGY REPORT

(Equivalent to the final JUP RA tables + improved)

3.1 Document Structure (PDF/HTML)
1. Cover Page  
2. Executive Summary  
3. Methodology  
4. Top Risks (Before Controls)  
5. Proposed Controls & Mitigation Logic  
6. Strategy (Short/Mid/Long Term)  
7. Control Set → Risk Mapping  
8. Financial Analysis (ALE, ROI, Cost)  
9. PIT Implementation Plan  
10. Appendices (Risk detail sheets)

3.2 Detailed Section Specifications
3.2.1 Section 4 — Top Risks Table

Similar format to WRAC, but only top N (configurable).

Columns:

Risk ID

Event

Residual Risk

Projected Risk

ALE → delta

Controls responsible

ROI

3.2.2 Section 6 — Strategy Tables (Short/Mid/Long)

Each table has:

Control / Control Group	Risks Mitigated	Risk Improvement (%)	Cost	ROI	Priority
3.2.3 Section 7 — Control-to-Risk Matrix

A binary table:

               R1   R2   R3   R4   ...
Control A       X         X
Control B       X    X
Control C                 X
...

3.2.4 Section 9 — PIT Implementation Plan Export

Contains:

Project Name

Description

Node

Controls included

Expected completion time

Priority grouping

Linked risks

Exported PIT task list

4. EXPORT TYPE 3 — CCR REPORT (Critical Control Register)
4.1 Sheet Name

CCR_<NodeCode>_<YYYYMMDD>

4.2 Columns
Column	Label
A	Control ID
B	Control Name
C	Control Group
D	Node / Facility
E	Criticality
F	Monitoring Method
G	Availability %
H	Performance %
I	CCR Status
J	Linked Risks
K	Fault Count
L	Override Count
M	Last Verified
N	Next Due
O	Evidence Links
4.3 Summary Metrics (top rows)
Critical Controls

% Green / Amber / Red

Top 10 failing controls

Risks impacted by CCR failures

5. EXPORT TYPE 4 — LIVE RISK & CONTROL PERFORMANCE DASHBOARD EXPORT
5.1 Purpose

Allows BI teams to import data into dashboards or PowerBI/Tableau.

5.2 Columns
Field	Meaning
risk_id	Link to RA Engine
live_risk_score	numeric
live_risk_level	descriptor
implementation_progress	%
operational_performance	%
ccr_status	G/A/R
availability	%
monitoring_quality_factor	1.0/0.8/0.5
control_instance_id	per-control contribution
effective_efficacy	computed value
6. EXPORT TYPE 5 — PIT EXPORT PACKAGE
6.1 Format

JSON + Excel workbook.

6.2 Fields
project_name
project_type
node_id
controls[]
    control_instance_id
    required_actions[]
        - action
        - due_date
        - role
        - priority
linked_risks[]
budget_estimate
priority_level
created_by
timestamp


This must align with PIT’s API spec and import format.

7. EXPORT TYPE 6 — EXECUTIVE HTML/PDF SUMMARY
7.1 Purpose

High-level summary suitable for ExCo and board-level use.

7.2 Sections
1. Executive Summary
2. Top 10 Risks (Live Risk)
3. Top 10 Risks by ROI
4. PUE Summary & Bowtie Requirements
5. Critical Controls (CCR Red/Amber)
6. Implementation Status (PIT)
7. Strategy Summary


Each section must include:

A short, AI-generated narrative

A clear graphic representation (heatmap/graphs)

A “What needs attention now” page

8. EXPORT FORMATTING RULES
8.1 Column Widths

Auto-fit columns, but apply min widths:

Descriptions: min 35

IDs: min 12

Numerical columns: right-aligned

Percentages: two decimal places

8.2 Colour Rules

Applied exactly per ERM profile:

Low = #A0D995

Medium = #F7F28C

Significant = #F7C26C

High = #EF6B6B

Extreme = #B22222

8.3 Conditional Formatting

Live risk changes direction (increased/decreased) must show arrow icons

CCR status uses coloured circles

Appetite violations highlight row background (pale red)

8.4 Hyperlinks

Controls & Risks link back to WRAC or Control Detail pages

Evidence links open Remote Assurance files

PIT links open project pages

9. EXPORT LOGGING & AUDIT TRAIL

Every export must be logged in:

wrac_exports table

Contents:

export_id

export_type

user_id

node_id

filters applied

version metadata

file URL

timestamp

This is mandatory for governance.

10. TEST CASES (QA REQUIREMENTS)

Verify field-by-field mapping for each export type

Verify formulas do not appear in final exports (raw values only)

Verify colour coding matches ERM config

Verify PIT import accepts exported PIT package without modification

Verify Hyperlinks resolve correctly

Verify large datasets export without truncation (≥ 50k rows)

Verify PDF/HTML alignment with wireframes & executive style guide

Verify cross-company anonymisation works when required

✔ END OF WRAC_EXPORT_SPEC_v0.1.md