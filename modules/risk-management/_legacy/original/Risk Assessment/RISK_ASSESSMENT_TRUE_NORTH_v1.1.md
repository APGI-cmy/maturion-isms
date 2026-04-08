Below is the complete, upgraded RISK_ASSESSMENT_TRUE_NORTH_v1.1.md — built to the same architectural standard as WRAC v1.1, PIT v1.1, ERM v1.1, Threat v1.1, and Vulnerability v1.1.

This is the definitive blueprint for the SRMF Risk Assessment Engine, fully aligned with:

ERM Framework (likelihood, impact, appetite, heatmap, bands)

Threat Module v1.1 (TTPs, drift)

Vulnerability Module v1.1 (Exploitability, TVRE, UE derivation)

WRAC v1.1

PIT v1.1

Control Library v1.1 + Control Efficacy v1.1

Remote Assurance (future)

Cross-company + multi-hierarchy governance

One-Time Build + Zero Regression

Place in:
/Modules/Risk Management/Risk Assessment/RISK_ASSESSMENT_TRUE_NORTH_v1.1.md

RISK_ASSESSMENT_TRUE_NORTH_v1.1.md

SRMF Risk Assessment Engine — True North Blueprint
Version: 1.1
Prepared for: Maturion ISMS / SRMF Architecture
Role: Authoritative RA Engine Architectural Definition

0. PURPOSE

The Risk Assessment (RA) Engine is the central computational intelligence layer of the SRMF.
It converts:

Threat × Vulnerability → Unwanted Event (UE) → Likelihood → Impact → Inherent Risk → Controls → Residual Risk → Projected Risk → Implementation Signal (PIT)


This True North document defines:

Conceptual architecture

Data contracts

Rules, formulas, scoring engines

RA lifecycle workflows

Inter-module dependencies

UI/UX layout principles

AI involvement & constraints

Validation, governance, and state transitions

Hooks for WRAC, PIT, Controls, Remote Assurance

It unifies security, operational, safety, environmental, and enterprise risk into one deterministic model.

1. ARCHITECTURE OVERVIEW

The RA Engine is composed of eight sub-engines, each deterministic:

1. UE Intake Engine
2. Likelihood Engine (NIST-aligned)
3. Impact Engine (ERM-aligned)
4. ALE Engine (quantification)
5. Control Environment Engine
6. Risk Matrix Engine (ERM heatmap)
7. Residual Risk Engine
8. Projected Risk Engine (future control sets)


All of the above feed into:

WRAC Module
PIT Module
Remote Assurance
Risk Dashboard & Trend Analytics

2. END-TO-END DATA FLOW (MASTER DIAGRAM)
Threat Module (v1.1)
      │
      ▼
TVRE (Threat–Vulnerability Relevance Engine)
      │  Valid pairs only
      ▼
Vulnerability Module (v1.1)
      │  Generates/approves UE
      ▼
UE Intake → RA Engine (this module)
      │
      ├── Likelihood Engine
      ├── Impact Engine
      ├── ALE Engine
      ├── Control Environment Engine
      │
      ▼
Inherent Risk → Residual Risk → Projected Risk
      │
      ├── WRAC
      ├── PIT
      └── Live RA Dashboard (v1.0)

3. CORE RA CONCEPTS (UNIFIED SRMF LOGIC)
3.1 Unwanted Event (UE)

UE is a synthetic event produced from:

Threat + Vulnerability + Location Context


It is the “risk object” of the RA Engine.

3.2 Inherent Risk

Risk before any controls.

Inherent Likelihood × Inherent Impact

3.3 Residual Risk

Risk after existing implemented controls.

3.4 Projected Risk

Risk after recommended future controls, based on:

Control Efficacy (max 90%)

Control completeness

Control dependencies

Cost–benefit (ROI)

Projected risk is essential for:

WRAC

Budgeting

PIT project formation

Long-term mitigation strategy

4. ENGINE 1 — UE INTAKE ENGINE

Trigger:
Approved UE from Vulnerability Module.

Validations:

UE must have associated threat version

UE must have associated vulnerability version

UE must have valid relevancy score

UE location must be resolvable to architecture node

No conflicting UE versions

Output Contract:

{
  "ue_id": "...",
  "threat_id": "...",
  "vulnerability_id": "...",
  "relevance_score": 0–1,
  "location_path": "...",
  "ue_sentence": "..."
}

5. ENGINE 2 — LIKELIHOOD ENGINE (NIST 800-30)

Likelihood is decomposed into three parts:

1. Likelihood of Initiation (adversarial)
2. Likelihood of Occurrence (non-adversarial)
3. Likelihood of Adverse Impacts (context)


Each is influenced by:

threat capability

vulnerability exploitability

historical data

asset exposure

TVRE-derived modifiers

threat drift score

current controls (for residual)

Outputs:

likelihood_numeric (0–1)
likelihood_level (ERM scale)
likelihood_descriptor (“Almost Certain”, “Likely”, etc.)


Mapping:

Maps to ERM likelihood scale

Deterministic mapping via calibrated thresholds

6. ENGINE 3 — IMPACT ENGINE (ERM IMPACT SCALE)

Impact is derived from:

Financial impact → EBITDA mapping

Safety impact

Environmental impact

Operational impact

Reputational impact

Regulatory impact

Impact feeds:

ERM Impact Matrix (configured per company)


Final Output:

impact_numeric (0–1)
impact_level
impact_descriptor

7. ENGINE 4 — ALE ENGINE (Annual Loss Expectancy)

For quantifiable risks, RA Engine will compute:

ALE = Asset Value × Exposure Rate × ARO


Where:

Asset Value = financial or replacement value

Exposure Rate = % of time asset is exposed

ARO = Annual Rate of Occurrence

Outputs:

ale_value (currency)
ale_to_impact_level (mapped to ERM)


If ALE exists:

It overrides qualitative impact mapping

But is capped by organisational pre-defined max loss

8. ENGINE 5 — CONTROL ENVIRONMENT ENGINE

This consumes:

Control Library (v1.1)

Control Efficacy Engine (v1.1)

Control Completeness

Control Dependencies

Control Categories (Eliminate→Substitute→Engineer→Admin→PPE)

Calculates:

8.1 Total Control Efficacy (%)

Max 90%.

8.2 Availability (0–1)

Fed by Remote Assurance (system uptime, CCTV availability, access control availability, etc.)

8.3 Implementation Progress (0–1)

Fed by PIT integration.

8.4 Combined Mitigation %
CONTROL_EFFECTIVENESS = DESIGN × IMPLEMENTATION × AVAILABILITY


This feeds directly into:

Residual risk

Projected risk

9. ENGINE 6 — RISK MATRIX ENGINE (ERM HEATMAP)

Takes:

likelihood_level
impact_level


Produces:

matrix coordinates

heatmap color

risk band

appetite comparison

Uses company-specific ERM settings.

10. ENGINE 7 — RESIDUAL RISK ENGINE
Residual Likelihood = Inherent Likelihood × (1 − Control_Effectiveness)
Residual Impact     = Inherent Impact × (1 − Control_Impact_Effectiveness)
Residual Risk       = Matrix(Lres, Ires)


Existing controls only.

Outputs:

Residual rating

Residual heatmap color

Within/above/below appetite

11. ENGINE 8 — PROJECTED RISK ENGINE

(for future controls / what-if analysis)

Uses:

Future control sets

Cost estimates

Implementation complexity

Expected efficacy

Dependencies on other controls

Produces:

Projected Residual Likelihood
Projected Residual Impact
Projected Risk
Projected Remaining Risk (%)
Projected ROI

ROI Formula:
ROI = (Expected Loss Prevented − Control Cost) / Control Cost


This feeds directly into:

WRAC projected columns

PIT project prioritisation

RA Live Dashboard

12. RA WORKFLOW (STATE MACHINE)
UE approved → RA draft
RA draft → RA pending (requires completeness)
RA pending → RA approved (custodian/owner approval)
RA approved → RA archived (control implemented / obsolete)


RA draft must include:

UE link

likelihood analysis

impact analysis

inherent rating

Pending must include:

control assessment

residual rating

projected rating (if controls proposed)

Approved must include:

workflow sign-off

audit integrity

13. INTEGRATION MAP (HIGH-LEVEL)
Module	Consumes	Produces
Threat Module	threat profiles, TTPs, drift	TVRE modifiers
Vulnerability	UE + exploitability	RA records
ERM	Likelihood, impact scales	Mapped ratings
Control Library	control sets	Mitigation calculators
PIT	RA controls → PIT projects	Mitigation progress
WRAC	RA ratings	risk prioritisation
Remote Assurance	control availability	Real-time residual risk
14. AI INTEGRATION (SAFE MODE)

AI assists in:

summarising UE context

supporting likelihood reasoning

refining impact descriptions

validating control relevance

estimating future mitigation scenarios

AI never:

assigns final ratings

modifies matrix values

changes ERM definitions

bypasses approval workflows

All AI output must be staged and user-approved.

15. WATCHDOG OVERSIGHT (RA-SPECIFIC)

Watchdog monitors:

missing likelihood analysis

missing impact mapping

invalid ALE computations

control sets with >90% efficacy

projected controls with missing cost or efficacy

RA stuck in pending >7 days

inconsistencies between Threat/Vulnerability versions

drift changes requiring RA recalculation

16. UI/UX PRINCIPLES (SUMMARY)

The RA engine UI includes:

UE header

Likelihood panel

Impact panel

ALE panel (optional)

Control environment panel

Residual heatmap

Projected heatmap

ROI card

Appetite indicator

Workflow approvals

PIT export panel

All displayed in a three-column adaptive layout used across SRMF.

17. PERFORMANCE TARGETS

RA calculation < 120 ms

Full RA record load < 200 ms

What-if scenario generation < 250 ms

Batch recalculation (10,000 RAs) < 2 seconds

18. ACCEPTANCE CRITERIA (v1.1)

RA Engine is complete when:

All eight sub-engines implemented

Deterministic scoring across all companies

RA → WRAC → PIT pipeline stable

Projected risk and ROI fully functional

Control Library v1.1 fully integrated

Full Watchdog logic active

Exports validated

Foreman signs off

✔ END OF RISK_ASSESSMENT_TRUE_NORTH_v1.1.md