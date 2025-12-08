Below is the complete RISK_ASSESSMENT_WIREFRAMES_v1.1.md, upgraded to the new Maturion/SRMF visual standard and fully aligned with:

Risk Assessment True North v1.1

RA Frontend Component Map v1.1

RA Edge Functions v1.1

WRAC v1.1

PIT v1.1

ERM v1.1

Threat & Vulnerability Modules v1.1

Control Library v1.1 / Control Efficacy v1.1

Live RA Dashboard (future)

This file includes ASCII wireframes that act as the universal, framework-agnostic layout blueprint for Foreman, CoPilot and the UI dev teams.

Place in:
/Modules/Risk Management/Risk Assessment/RISK_ASSESSMENT_WIREFRAMES_v1.1.md

RISK_ASSESSMENT_WIREFRAMES_v1.1.md

SRMF Risk Assessment Engine — UI Wireframes (ASCII)
Version: 1.1
Prepared for: Maturion ISMS / SRMF Architecture
Purpose: Define all UI layout blueprints for RA Engine

0. WIREFRAME GUIDING PRINCIPLES

Minimalistic

Deterministic

Same design language as WRAC/PIT/ERM

Three-column layout on desktop

Two-column layout on tablet

Stacked layout on mobile

Designed for data-heavy clarity

All Watchdog flags visible inline

All AI-assisted elements appear in small “AI Suggestion” bubbles

Consistent banners, tags, heatmaps, and progress meters

1. RA LANDING PAGE — LIST VIEW
┌──────────────────────────────────────────────────────────────────────────┐
│ RISK ASSESSMENT — ALL RECORDS                                           │
├──────────────────────────────────────────────────────────────────────────┤
│ Filters: [Company] [Hierarchy Node] [State] [Risk Level] [PUE] [Search] │
├──────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ UE Sentence: "…might result in … "                                   │ │
│ │ Threat: [Cyber Intrusion]   Vulnerability: [Weak Access Controls]     │ │
│ │ Node: Plant A → Zone 3 → Access Gate                                  │ │
│ │ Inherent:  High  Residual: Medium  Projected: Low                     │ │
│ │ [OPEN] [EXPORT] [PIT STATUS]                                          │
│ │ Inherent:  High  Residual: Medium  Projected: Low                     │
│ │ [OPEN] [EXPORT] [PIT STATUS]                                          │
│ └──────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ (Repeat for all RA records…)                                         │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
2. RA DETAIL VIEW — MASTER LAYOUT
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ <RAHeader>                                                                   │
│ UE: "Unauthorized access… may cause…"                                        │
│ Threat: [Adversarial]   Vulnerability: [Physical Security Breach]           │
│ Node: Mine → Plant 1 → Processing → Conveyor Room                            │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────────────────────────┐
│ <RASidebarNav>           │  │ <RAWorkArea>                                  │
│  1. UE Review            │  │   (Dynamic based on selected step)            │
│  2. Likelihood           │  └──────────────────────────────────────────────┘
│  3. Impact               │
│  4. ALE                  │
│  5. Controls             │
│  6. Inherent Risk        │
│  7. Residual Risk        │
│  8. Projected Risk       │
│  9. Workflow             │
│ 10. Export / PIT         │
└──────────────────────────┘
3. STEP 1 — UE REVIEW WIREFRAME
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ UE CONTEXT                                                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ "An intruder exploiting inadequate door control at the conveyor room…"       │
│                                                                              │
│ Threat Summary:                                                              │
│   [Icon] Type: Adversarial                                                   │
│   Capability: High                                                           │
│   Drift Score: 0.21 ↑                                                        │
│   Relevant TTPs: T109, T122, T105                                            │
│                                                                              │
│ Vulnerability Summary:                                                       │
│   Category: Physical Security → Access Control                               │
│   Exploitability: 0.83                                                       │
│   Evidence: [img][img][pdf]                                                  │
│   Location: Mine → Plant 1 → Processing → Conveyor Room                      │
│                                                                              │
│ TVRE Score: 0.72 (High)                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
4. STEP 2 — LIKELIHOOD WIREFRAME
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ LIKELIHOOD ASSESSMENT (NIST 800-30)                                          │
├──────────────────────────────────────────────────────────────────────────────┤

Initiation (Adversarial):
┌──────────────────────────┐
│ ● Capability: High       │
│ ● Intent: Medium         │
│ ● Opportunity: High      │
└──────────────────────────┘  Score: 0.72

Occurrence (Non-Adversarial):
┌──────────────────────────┐
│ ● Frequency: Medium      │
│ ● Exposure: High         │
└──────────────────────────┘  Score: 0.48

Adverse Impact Likelihood:
┌──────────────────────────┐
│ ● Environmental factors  │
│ ● Human presence         │
└──────────────────────────┘  Score: 0.61

Modifiers:
  TVRE: 0.72  
  Drift: +0.18  

───────────────────────────────────────────────────────────────────────────────

Inherent Likelihood:
┌─────────────────────────────────────┐
│   ●──────────────────────────────●  │
│   0                               1 │
└─────────────────────────────────────┘
Level: Likely  
Descriptor: Could occur several times per year
└──────────────────────────────────────────────────────────────────────────────┘
5. STEP 3 — IMPACT WIREFRAME
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ IMPACT ASSESSMENT (ERM)                                                     │
├──────────────────────────────────────────────────────────────────────────────┤

Financial Impact (ZAR):
  [ 350 000 ]

Safety Impact:
  [ Moderate injury (Level 3) ]

Environmental Impact:
  [ Minor / contained (Level 2) ]

Operational Impact:
  [ Production interruption < 4 hours ]

Regulatory Impact:
  [ None ]

───────────────────────────────────────────────────────────────────────────────

Inherent Impact:
  Normalized Numeric: 0.62
  ERM Impact Level: Medium
  Descriptor: Operational disruption without long-term consequences

Heatmap Preview:
┌───────────┬───────────┬───────────┐
│   Low     │  Medium   │   High    │
├───────────┼───────────┼───────────┤
│           │   ●       │           │
└───────────┴───────────┴───────────┘
└──────────────────────────────────────────────────────────────────────────────┘
6. STEP 4 — ALE WIREFRAME (OPTIONAL)
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ QUANTIFICATION (ALE)                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
Asset Value:          [ 2 500 000 ]
Exposure Rate:        [ 0.48 ]
Annual Rate Occur:    [ 0.33 ]

ALE Calculation:
  2 500 000 × 0.48 × 0.33 = 396 000 ZAR

Override Impact Level:
  ALE maps to ERM impact level = "Major"

Heatmap Override Applied: YES
└──────────────────────────────────────────────────────────────────────────────┘
7. STEP 5 — CONTROL ASSESSMENT WIREFRAMES
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ CONTROL ASSESSMENT                                                          │
├──────────────────────────────────────────────────────────────────────────────┤

Existing Controls:
┌─────────────────────────────────────────────────────────────────────────────┐
│ [●] Physical Access Control      Design: 0.40  Impl: 0.30  Avail: 0.70      │
│ [●] CCTV Coverage (limited)      Design: 0.30  Impl: 0.20  Avail: 0.40      │
└─────────────────────────────────────────────────────────────────────────────┘

Total Current Effectiveness: 0.252 (25.2%)
(Note: Capped at 0.90 by SRMF)

───────────────────────────────────────────────────────────────────────────────

Proposed Controls:
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ ] Camera Expansion (Tier 1)        Cost: 480 000 ZAR                      │
│ [ ] 3-Tier Surveillance Model        Cost: 180 000 ZAR                      │
│ [ ] Black Screen Algorithm AI        Cost: 210 000 ZAR                      │
│ [ ] Access Control Upgrade           Cost: 350 000 ZAR                      │
└─────────────────────────────────────────────────────────────────────────────┘

Projected Effectiveness: 0.78 (78%)
Dependencies: All satisfied
Accuracy: 75% preliminary costing
└──────────────────────────────────────────────────────────────────────────────┘
8. STEP 6 — INHERENT RISK WIREFRAME
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ INHERENT RISK                                                               │
├──────────────────────────────────────────────────────────────────────────────┤

Likelihood: Likely (0.72)  
Impact:     Medium (0.62)

Heatmap Position:
┌───────────────────────HEATMAP────────────────────────┐
│ Low   │ Medium │ High │ Very High │ Extreme         │
│————————————————————————————————————————————————————————│
│       │   ●    │       │           │                │
└──────────────────────────────────────────────────────┘

Inherent Risk Level: HIGH  
Color Band: Orange  
Within Appetite: NO  
└──────────────────────────────────────────────────────────────────────────────┘
9. STEP 7 — RESIDUAL RISK WIREFRAME
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ RESIDUAL RISK                                                               │
├──────────────────────────────────────────────────────────────────────────────┤

Residual Likelihood: 0.54  
Residual Impact:     0.41

Heatmap Position:
┌───────────────HEATMAP───────────────┐
│ Low │ Medium │ High │ Very High      │
│—————————│—————————│—————————│——————————│
│     │  ●     │       │               │
└──────────────────────────────────────┘

Residual Risk Level: MEDIUM  
Within Appetite: NO  
Watchdog: Auto-escalation candidate  
└──────────────────────────────────────────────────────────────────────────────┘
10. STEP 8 — PROJECTED RISK & ROI WIREFRAME
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ PROJECTED RISK                                                              │
├──────────────────────────────────────────────────────────────────────────────┤

Projected Likelihood: 0.22  
Projected Impact:     0.30

Heatmap:
┌───────────────────────────────────────────────────┐
│ Low    ●                                           │
│ Medium                                             │
│ High                                               │
│ Very High                                          │
└───────────────────────────────────────────────────┘

Projected Remaining Risk: 14%  
Projected Risk Level: LOW  
Heatmap Band: Green

ROI Panel:
───────────────────────────────────────────────────────
Expected Loss Prevented: 280 000 ZAR  
Control Cost:            210 000 ZAR  
ROI:                     +33.3%  
Priority: HIGH (Recommend PIT Export)
───────────────────────────────────────────────────────

Timeline:
[✓] Mitigate Now: Access Control Upgrade  
[✓] Medium Term: Camera Expansion  
[✓] Future: 3-Tier Surveillance → AI  
└──────────────────────────────────────────────────────────────────────────────┘
11. STEP 9 — WORKFLOW & APPROVAL WIREFRAME
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ WORKFLOW                                                                    │
├──────────────────────────────────────────────────────────────────────────────┤

Workflow State: PENDING APPROVAL  
───────────────────────────────────────────────────────────────────────────────

[ SUBMIT FOR REVIEW ]  [ APPROVE ]  [ REJECT ]  [ ARCHIVE ]

History:
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2025-01-21 12:22 — Draft created by Analyst                                 │
│ 2025-01-21 13:10 — Submitted for review                                     │
│ 2025-01-22 09:40 — (Pending manager approval)                               │
└─────────────────────────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────────────────────────┘
12. STEP 10 — EXPORT & PIT WIREFRAME
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ EXPORT & PROJECT CREATION                                                   │
├──────────────────────────────────────────────────────────────────────────────┤

Export Options:
[ WRAC ROW ] [ FULL RA REPORT PDF ] [ RAW JSON ] [ CONTROL SET EXPORT ]

PIT Project Preview:
───────────────────────────────────────────────────────────────────────────────
Project Name: "Access Control Upgrade – Conveyor Room"  
Estimated Cost: 540 000 ZAR  
Expected Risk Reduction: High → Low  
Projected Delivery: 6 weeks  
───────────────────────────────────────────────────────────────────────────────

[ EXPORT TO PIT ]    [ VIEW PIT PROJECT ]
└──────────────────────────────────────────────────────────────────────────────┘
13. WATCHDOG PANELS WIREFRAME
yaml
Copy code
┌──────────────────────────────────────────────────────────────────────────────┐
│ WATCHDOG ALERTS                                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ CRITICAL: Drift Score updated — Likelihood recalculation required           │
│ HIGH: Control dependency missing (Black Screen AI requires Tier 2 CCTV)     │
│ MEDIUM: Residual impact not aligned with ALE override                       │
│ LOW: AI confidence < 0.34 for UE sentence refinement                        │
└──────────────────────────────────────────────────────────────────────────────┘
14. MOBILE LAYOUT WIREFRAMES (CONDENSED)
csharp
Copy code
[UE Summary]
↓
[Likelihood Accordion]
↓
[Impact Accordion]
↓
[Controls Accordion]
↓
[Risk Heatmaps (swipe left/right)]
↓
[Approvals]
15. ACCEPTANCE CRITERIA
Wireframes complete when:

All 10 RA workflow steps included

Conforms to SRMF UI design language

Includes Watchdog positions

Matches frontend component map 1-to-1

Approved by Foreman

✔ END OF RISK_ASSESSMENT_WIREFRAMES_v1.1.md