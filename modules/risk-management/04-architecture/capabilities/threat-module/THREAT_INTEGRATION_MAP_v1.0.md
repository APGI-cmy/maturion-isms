THREAT_INTEGRATION_MAP_v1.0.md

Threat Module — Cross-Module Integration Map
Version: 1.0
Aligned with:**

THREAT_TRUE_NORTH_v1.0.md

THREAT_DATABASE_SCHEMA_v1.1.md

THREAT_EDGE_FUNCTIONS_v1.1.md

Vulnerability Module

RA Engine

WRAC

PIT

Incident & Intelligence

Remote Assurance

Control Library & Control Efficacy Model

Maturion Integrated ISMS Architecture

0. PURPOSE

This document defines the full integration blueprint for how the Threat Module interacts with every other major module in the Maturion ISMS.

It answers:

What data flows where?

When does data flow?

What edge functions are used?

What triggers integration?

What must be synchronized?

What downstream effects exist?

What guardrails prevent misalignment?

This is not optional.
Without this integration map, the entire SRMF pipeline can become inconsistent.

1. HIGH-LEVEL INTEGRATION VISUAL
 ┌──────────────┐  
 │ THREAT       │  
 │ (Identification, TAP, TTP, Drift)  
 └───────┬──────┘  
         │  
         ▼  
 ┌──────────────┐  
 │ VULNERABILITY│  
 │ (Mapping to processes/facilities)  
 └───────┬──────┘  
         │  
         ▼  
 ┌──────────────┐  
 │ RA ENGINE    │  
 │ Unwanted Events → Risk Scores  
 └───────┬──────┘  
         │  
         ▼  
 ┌──────────────┐  
 │ WRAC         │  
 │ (Priority ranking, risk tables)  
 └───────┬──────┘  
         │  
         ▼  
 ┌──────────────┐  
 │ PIT          │  
 │ (Mitigation Projects, Drift Escalation)  
 └───────┬──────┘  
         │  
         ▼  
 ┌──────────────┐  
 │ REMOTE ASSURANCE  
 │ (Critical control monitoring)  
 └───────┬──────┘  
         │  
         ▼  
 ┌──────────────┐  
 │ INTELLIGENCE │  
 │ (Forecasts, trends, clusters)  
 └──────────────┘  

2. INTEGRATION WITH VULNERABILITY MODULE
2.1 Data Flow INTO Vulnerability Module

Vulnerability module requires:

Valid threats linked to:

processes

lifecycles

facilities

Threat Module provides:

threat_id  
version_id  
threat_name  
category  
subcategory  
threat_type (adv/non-adv)  
TTP mappings  
Drift score  
Relevance (per facility/process)

2.2 Edge Functions Used

threat_get_version

threat_link_to_process

threat_link_to_facility

threat_search

2.3 Workflow Trigger

When user maps vulnerabilities → threats must be displayed as “available threats”.

2.4 Required Guards

Draft threat versions cannot be selectable.

Only published versions appear.

Orphaned links are disallowed (Watchdog monitors this).

3. INTEGRATION WITH RA ENGINE (Risk Assessment Engine)
3.1 Data Flow INTO RA Engine

Threat module provides:

Threat likelihood (computed):
  = base classification  
  + TAP modifiers  
  + TTP relevance  
  + drift modifiers  

Threat stability score  
Threat drift-score  
Behaviour vector  
Capability vector  
TTP influence vector  



These influence:

UE validity

Likelihood-of-initiating-event

Severity-of-event

ARO adjustments (via historical frequency)

3.2 Edge Functions Used

threat_get_likelihood_data

threat_get_version

threat_trend_analysis

3.3 RA Engine Consumption Flow
Threat → VULN → Unwanted Event → RA Score →
      → WRAC → PIT → Monitoring

3.4 Required Guards

Drift recalculation must invalidate RA caches.

RA cannot compute based on outdated threat version.

Only published threat versions used.

4. INTEGRATION WITH WRAC
4.1 Data Flow INTO WRAC

WRAC requires:

Threat descriptor

Threat likelihood

Threat TTPs (metadata only)

TAP summary

Drift score (helps prioritization)

Facility relevance

4.2 Use Cases

Automatic listing of threats in WRAC tables

Sorting by drift score

Ranking highest-risk threats

Dynamic recalculation when drift updates

4.3 Edge Functions

threat_get_profile_for_wrac

4.4 Guards

WRAC must auto-refresh when threat version changes.

Watchdog must catch WRAC referencing outdated threat versions.

5. INTEGRATION WITH PIT (Project Implementation Tracker)
5.1 Trigger Conditions

Threat triggers PIT projects when:

Drift score > 0.75

Threat classified as High Priority Adversarial

TTP changes reveal new control gaps

TAP update indicates increased capability

RA recommends mitigation project

WRAC flags risk above appetite

5.2 PIT Receives:
Threat name + version  
Drift reason  
TTP exposure summary  
Recommended controls  
Affected facilities  
Affected processes  
Urgency index  
Recommended priority  

5.3 Edge Functions

threat_ai_compute_drift

threat_trend_analysis

threat_update_drift_metric

PIT creates:

Mitigation project

Project linkage

Controls to implement

Status reporting

5.4 Guards

Threat → PIT linkage must be visible in Threat View

No project spawned from a draft threat

Watchdog ensures escalations execute correctly

6. INTEGRATION WITH REMOTE ASSURANCE

Remote Assurance monitors control performance, which feeds back into:

Drift updates

TAP adjustments

TTP confirmations or downgrades

6.1 Data Flow OUTBOUND (Threat → Remote Assurance)

Threat module provides:

Critical TTP list  
Critical Controls (via Control Library)
Threat actor capabilities  
Expected detection signatures  

6.2 Data Flow INBOUND (Remote Assurance → Threat)

Remote Assurance provides:

Control availability signal  
Control failure alerts  
False positive / false negative rates  
System uptime  

6.3 Watchdog Triggers

If control failure persists → drift increases

If critical controls fail → PIT escalation

If surveillance/monitoring fails → TAP adjustments

6.4 Required Guards

No direct override of threat version

Drift updates must be version-specific

7. INTEGRATION WITH INCIDENT & INTELLIGENCE MODULE
7.1 Incident → Threat Synchronization

When an incident occurs:

It may increase drift

It may confirm or contradict TAP elements

It may indicate a new TTP

It may reveal a false assumption

It may warrant new threat creation

It may strengthen or weaken capabilities

7.2 Intelligence → Threat Synchronization

Intelligence module provides:

Seasonal patterns

Crime statistics

Syndicate activity signals

Geopolitical risks

Local/regional trends

7.3 Edge Functions

threat_update_from_incident

threat_update_from_intel

threat_ai_compute_drift

7.4 Required Guards

All AI-driven updates require human approval.

All incident-driven drift must be logged.

Incident must reference an existing threat or create a new draft threat.

8. INTEGRATION WITH CONTROL LIBRARY

Control library provides:

Mappings between TTP → control(s)

Control criticality

Control failure modes

Maximum achievable mitigation

Control availability inputs

Threat module uses these to:

Detect TTP exposure gaps

Trigger PIT mitigation projects

Trigger drift updates when controls fail (via Remote Assurance)

9. INTEGRATION WITH AI CORE

Threat module uses 5 AI models:

1. Classification Model  
2. TAP Generator Model  
3. TTP Mapping Recommender  
4. Drift Forecasting Model  
5. Intelligence Narrative Model  


Integration rules:

All suggestions → ai_log

All updates → require human approval

All vector data → pgvector

10. CROSS-MODULE GOVERNANCE RULES
10.1 Published Version Rule

Only published threats may flow:

into Vulnerability

into RA

into WRAC

into PIT

into Remote Assurance

into Intelligence

10.2 Drift Propagation Rule

Any drift update must trigger recalculation in:

RA

WRAC

PIT (for escalation)

Intelligence

10.3 TAP Integrity Rule

TAP missing:

Blocks publishing for adversarial threats

10.4 TTP Integrity Rule

TTP deprecated/missing:

Blocks publishing

Auto-notify analyst

10.5 Facility/Process Mapping Rule

Threat must be mapped to at least one scenario:

facility

process
Or publishing is blocked.

11. CRITICAL PATH SUMMARY
Incident → Drift → RA → WRAC → PIT → Remote Assurance → Threat Updates → Intelligence → back to RA


This closed loop must remain intact.

12. ACCEPTANCE CRITERIA

Threat module integration is accepted only when:

All flows above work reliably

All downstream modules reference correct version

No drift event is missed

No control failure goes unreflected

No TTP mismatch exists

Threat → Vulnerability → RA → WRAC → PIT pipeline works end-to-end

Intelligence dashboards show correct live data

Watchdog raises appropriate alerts

Foreman validates end-to-end lifecycle

✔ END OF THREAT_INTEGRATION_MAP_v1.0.md