INTEGRATED_ISMS_MODULE_INTEGRATION_MAP_v1.0.md

Maturion Integrated Security Management System (ISMS)
Module Integration Map — Architecture + Workflow
Version 1.0

❇️ 0. PURPOSE

This document defines the master integration blueprint for the entire Maturion ISMS ecosystem.

It contains both:

Hub-and-Spoke Architecture Map
(Enterprise structural integration of modules)

Linear End-to-End Workflow Map
(Operational process and navigation flow)

This map is the master reference for:

Foreman build orchestration

Multi-agent development

Module boundaries & dependencies

Data governance and RLS

UI routing architecture

API and edge-function interfaces

Change-control

Integration QA

Training & onboarding

Every module (Threat, Vulnerability, RA, WRAC, Controls, PIT, Remote Assurance, Bowtie, Incident/Intel, etc.) connects to this master map.

🌐 1. HUB-AND-SPOKE ARCHITECTURE MAP

“ISMS Core as the Central Risk Brain”

This is the enterprise system-wide structural integration map.

                                                +-------------------------+
                                                |  Remote Assurance       |
                                                |  (Systems, Checklists,  |
                                                |   Performance, CCR)     |
                                                +------------+------------+
                                                             |
                                                             v
                 +------------------+           +------------+------------+           +------------------+
                 |  Threat Module   +----------->   ISMS CORE (Risk Brain) <----------+ Incident & Intel |
                 | (Adversarial &   |           |  (Data, AI, RA Engine,  |           |  (Signals, Drift)|
                 | Non-Adversarial) |           |   Governance, Controls) |           +------------------+
                 +---------+--------+           +------------+------------+
                           |                                |
                           v                                v
                 +---------+--------+           +------------+------------+
                 | Vulnerability    +----------->  Controls & CCR Module  |
                 | Module           |           | (Library, Efficacy,     |
                 | (Process,        |           |  Availability, Health)  |
                 | Lifecycle, Site) |           +------------+------------+
                 +---------+--------+                        |
                           |                                 |
                           v                                 v
                 +---------+--------+           +------------+------------+
                 | Risk Assessment |----------->   WRAC (Risk Workspace)  |
                 | Engine (UE,     |           |  (Risk Analysis, MIT,    |
                 | Quantification) |           |   Strategy, ROI, Export) |
                 +---------+--------+           +------------+------------+
                           |                                 |
                           v                                 v
                 +---------+--------+           +------------+------------+
                 |  Bowtie Builder  |<----------+     PIT (Implementation)|
                 |  (PUE Analysis)  |           | (Tasks, Progress, Audit)|
                 +------------------+           +--------------------------+

🔍 1.1 MODULE RESPONSIBILITY BOUNDARIES
Threat Module owns:

Threat taxonomy

Threat events

TTP relevance

Drift indicators

Threat confidence

Adversarial vs non-adversarial initiation rates

Vulnerability Module owns:

Site maps

Process maps

Lifecycle libraries

Vulnerability severity scoring

Vulnerability-to-facility mapping

Risk Assessment Engine owns:

UE generation

Threat × Vulnerability evaluation

NIST scoring

ARO, ALE, impact mapping

Inherent/residual calculations

Controls Module owns:

Control library

Control efficacy model

Design vs implementation vs performance scoring

CCR (Critical Control Register)

WRAC Module owns:

Risk visualisation

Filtering, ranking

ROI & strategy formulation

Exporting

Preparing for PIT

PIT Module owns:

Project creation

Task allocation

Progress tracking

Audit trail

Procurement references

Remote Assurance owns:

Systems availability signals

Manual & electronic checklists

Performance scoring

Alerts → CCR

Continuous evidence

Incident & Intelligence Module owns:

Triggering threat drift

Feeding anomalies

Enhancing situational risk picture

Bowtie Builder owns:

PUE deep analysis

Barrier identification

Scenario pathways

▶️ 2. LINEAR END-TO-END WORKFLOW MAP

“How the entire ISMS flows operationally.”

This is the user-facing and systems-facing process map.

2.1 High-Level Linear Flow
1. Identify Threats →
2. Map Vulnerabilities →
3. Generate Unwanted Events →
4. Perform Risk Assessment →
5. Quantify ALE & risk values →
6. Evaluate controls & propose new ones →
7. Populate WRAC →
8. Derive Strategy & ROI →
9. Export to PIT →
10. Implement controls →
11. Remote Assurance monitors controls →
12. CCR updates live risk →
13. WRAC displays live risk changes →
14. Executive dashboards & appetite reporting →
15. Maturity cycle feedback →
16. Threat/Vulnerability drift triggers updates →
17. Continuous improvement loop restarts

📊 2.2 Detailed Step-by-Step Process Map (ASCII)
+--------------------+
|  THREAT INTAKE     |
|  (Threat Module)   |
+---------+----------+
          |
          v
+---------+----------+
| VULNERABILITY MAP  |
|  (Processes, Sites)|
+---------+----------+
          |
          v
+---------+----------+
| UNWANTED EVENTS    |
|  (Auto-generated)  |
+---------+----------+
          |
          v
+---------+----------+
| RISK ASSESSMENT    |
| (NIST, ALE, ROI)   |
+---------+----------+
          |
          v
+---------+----------+
|    WRAC             |
| (Prioritisation,    |
|  projected risk,    |
|  control proposals) |
+---------+----------+
          |
          v
+---------------------+
| STRATEGY BUILDER    |
| (Short/Mid/Long)    |
+---------+-----------+
          |
          v
+---------------------+
| EXPORT TO PIT       |
| (Project Creation)  |
+---------+-----------+
          |
          v
+---------------------+
| IMPLEMENTATION      |
|  (PIT Tasks, QA)    |
+---------+-----------+
          |
          v
+---------------------------+
| REMOTE ASSURANCE & CCR   |
| (Availability, Perf, RA) |
+---------+-----------------+
          |
          v
+---------------------------+
| LIVE RISK & DASHBOARDS   |
| (Trend, appetite, KPI)   |
+---------+------------------+
          |
          v
+---------------------------+
| MATURITY ROADMAP         |
| (Annual ISMS cycle)      |
+---------------------------+

🔄 2.3 Continuous Intelligence Feedback Loops
Threat drift → triggers vulnerability rechecks
Incident signals → adjust threat relevance
Remote assurance failures → increase risk values
CCR failures → increase live risk
PIT delays → reduce projected mitigation
New controls → reduce residual
Bowtie analysis → reprioritise PUE risks

All loops update:

WRAC

RA Engine

Strategy

Dashboards

Continuously.

📡 3. DATA FLOW MAP (System-to-System Interfaces)
Threat Module
    ↓ threats, TTP, drift
Vulnerability Module
    ↓ vulnerabilities, severity
Risk Assessment Engine
    ↓ inherent/residual/projected values, ALE
WRAC
    ↓ strategy, ROI, prioritisation
Controls Module
    ↔ control efficacy, CCR, performance
PIT
    ↔ implementation progress, audit logs
Remote Assurance
    ↔ system availability, manual/auto checks
Incident & Intelligence
    ↓ anomaly indicators → threat drift
Dashboarding Layer
    ↓ reporting
Maturity Module
    ↑ evidence collection

🔐 4. GOVERNANCE & SIGN-OFF FLOW
Custodian → Risk Owner → Senior Risk Owner → ExCo
      ↳   → PIT Manager → Implementation Teams → Remote Assurance


All sign-offs are logged into:

WRAC

PIT

ISMS Activity Log

🧭 5. UI ROUTING / WIZARD FLOW (Navigation Backbone)
ISMS Home
   → Threats
   → Vulnerabilities
   → Risk Assessment
   → WRAC
       → Risk Detail
       → Strategy
       → Controls
       → CCR
   → PIT
       → Projects
       → Tasks
   → Remote Assurance
   → Incident/Intel
   → Bowtie
   → Maturity Roadmap
   → Dashboards


This becomes your core navigation architecture.

🧱 6. MODULE INTEGRATION – AUTHORITY MODEL

Defines what each module is “the single source of truth” for, preventing overlap.

I will include this in the next version if needed.

✔ END OF INTEGRATED_ISMS_MODULE_INTEGRATION_MAP_v1.0.md