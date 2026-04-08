RISK_THREAT_QA_IMPLEMENTATION_PLAN_v0.1.md

Module: Risk Assessment Engine – Threat Module
Version: 0.1

0. Purpose

This document defines:

All QA checks for the Threat Module

How QA is run, displayed and acted on in the Backoffice

How QA integrates with Foreman’s One-Build / No-Legacy philosophy

No Threat Module feature is “done” unless all applicable QA checks are green.

1. QA Philosophy (Threat Module)

Architecture-aligned:
QA checks must validate the Threat Module against the True North Architecture doc, not ad-hoc developer interpretations.

Wiring verification:
Every path from UI → state → services → edge function → DB is validated.

Data integrity:
No threat can exist without required structure, ratings, or history.

Explainability:
Every dynamic change to threat ratings must be traceable and explainable.

Non-regression:
Any new feature must not break existing threat views, ratings, or links.

2. QA Dimensions

QA is grouped into these dimensions:

Structure & Schema

Business Rules

Dynamic Scoring & Threat Shifting

Auditability & Evidence

Integration & Wiring

Performance & UX

Each dimension has tests with IDs: THR.<dimension>.<number>.

3. QA Tests
3.1 Structure & Schema

THR.STRUCT.1 – Threat completeness

Every row in threat must have:

type (adversarial / non_adversarial)

status (active / archived)

org_id and site_id

Fail if any active threat is missing required fields.

THR.STRUCT.2 – Characterisation presence

Every active threat must have one related threat_characterisation entry.

For adversarial threats: the following fields must be non-empty:

source_type, agent, motivation, goal_outcome, trust_level, tactics

Fail if any active threat lacks minimal characterisation.

THR.STRUCT.3 – Scales alignment

All scores in threat_rating and threat_rating_history must be:

integers 1–5

and must match a defined threat_scale record for that dimension.

Fail if any score is outside scale or refers to a non-existing dimension.

THR.STRUCT.4 – Context coverage

For each active assessment context (e.g. Karowe_2026_Baseline):

All priority threats (Top N) must have at least 1 threat_rating with rating_type = baseline.

Fail if context is marked “complete” but some top threats aren’t rated.

3.2 Business Rules

THR.BR.1 – Type ↔ dimension consistency

Adversarial threats:

must have capability_score, intent_score, targeting_score

must not have occurrence_score, effects_score populated.

Non-adversarial threats:

must have occurrence_score, effects_score

must not have adversarial dimensions populated.

Fail if any mismatch is found.

THR.BR.2 – Overall rating calculation

Recompute overall_likelihood and overall_band from underlying scores using the configured algorithm.

Pass if recomputed values match stored values.

Fail if there is a difference (indicates calculation bug or manual tampering).

THR.BR.3 – High/Extreme linkage

Any threat whose overall_band is High or Extreme must be:

linked to at least one unwanted event OR explicitly flagged as “to-be-mapped”.

Fail if critical threats have no downstream linkage and no documented reason.

3.3 Dynamic Scoring & Threat Shifting

THR.DYN.1 – Data-backed changes

For any threat_rating_history entry where driver_type = internal_data or external_data:

there must be at least one threat_data_signal record referencing the same threat_id and a recent collected_at.

Fail if dynamic change claims to be data-driven but no data signal exists.

THR.DYN.2 – AI explanation presence

For all threat_rating records with rating_type = dynamic:

ai_explanation must be non-empty and at least N characters (e.g. ≥ 50).

Fail if dynamic ratings have no explanation.

THR.DYN.3 – Human approval

No dynamic rating may be used operationally unless:

approved_score_by and approved_at are populated.

Fail if overall_band is dynamic but approval fields are empty.

THR.DYN.4 – Trend consistency

For each threat:

If last 3 changes in history are upward, trend must be ↑ or ↑↑.

If last 3 changes are downward, trend must be ↓ or ↓↓.

Fail if trend indicator contradicts rating history.

3.4 Auditability & Evidence

THR.AUD.1 – No silent rating changes

Any change to any rating dimension after baseline must create a threat_rating_history entry.

Fail if current values differ from previous snapshot and no history entry exists.

THR.AUD.2 – Justification for manual overrides

For history entries with driver_type = manual, change_reason must be non-empty.

Fail if humans overrode AI/data without rationale.

THR.AUD.3 – Review cadence

For each active threat, last_review_at must be:

within policy-defined period (e.g. ≤ 12 months) OR flagged overdue.

Fail if threats are marked “in use” but not reviewed in time.

3.5 Integration & Wiring

(These are validated using the Wiring Map – see next doc.)

THR.INT.1 – PIT linkage for Critical threats

For threats with overall_band = Extreme:

There must be at least one linked PIT project or an explicit “risk acceptance” decision.

Fail if Extreme threats have no treatment linkage.

THR.INT.2 – ISMS / Maturity evidence

For each completed annual threat assessment context:

there must be an evidence snapshot saved and linked to at least one MPS criterion.

Fail if assessment exists but is not discoverable as evidence.

THR.INT.3 – BES linkage

Each threat must reference at least one BES driver (e.g. economic, geopolitical, regulatory, crime stats).

Fail if threats float without any context anchors.

3.6 Performance & UX (Minimum)

THR.PERF.1 – Threat list load

Threat list view must load within configured threshold (e.g. < 2 seconds for 100 threats).

Fail if average exceeds threshold.

THR.UX.1 – No dead ends

From any Threat detail view:

user must be able to navigate:

back to Threat list

to linked unwanted events

to PIT actions

to evidence snapshot

Fail if any navigation path is missing.

4. QA Dashboard Layout (Admin Backoffice)

Admin Backoffice exposes QA as a single “Threat QA” dashboard, with:

Top summary cards

Total QA tests: 24

Passed: 20

Failed: 4

Overall QA health: 83%

Heatmap by dimension

Structure | Rules | Dynamic | Audit | Integration | Performance

Each with % pass, coloured (green/amber/red).

Table of failing tests

Test ID, Name, Impact, Count affected, “View details” link.

Drill-down

Clicking a test shows affected threats/contexts.

For each item:

direct link to fix page (e.g. Threat detail, Link manager, Evidence snapshot).

“Run full Threat QA” button

Executes all QA checks and updates dashboard.

Also callable via Foreman / edge function.

5. Automation & Scheduling

Nightly: full Threat QA run (for all orgs).

On-demand: when:

a threat rating changes

new BES is published

PIT action is created from a threat

new external crime data is ingested.

Results are persisted as qa_result records for historical comparison and audits.

6. Versioning

This document:
RISK_THREAT_QA_IMPLEMENTATION_PLAN_v0.1

Future versions will extend tests as new features appear.

2) RISK_THREAT_WIRING_MAP_v0.1.md

Path: /Modules/Risk/ThreatModule/Architecture/

RISK_THREAT_WIRING_MAP_v0.1.md

Module: Risk Assessment Engine – Threat Module
Version: 0.1

0. Purpose

This document defines all wiring for the Threat Module:

UI → State → Services → Edge Functions → DB

Background jobs

Integrations with other modules (BES, Vulnerabilities, PIT, Maturity)

Data ingestion from internal and external sources.

Foreman will use this map to ensure no “floating” logic or hidden side paths exist.

1. High-Level Data Flow
1. UI-facing flows

Threat list page

Threat detail page (tabs: Overview, Characterisation, Scoring, Data & AI, History, Links)

Threat creation wizard

Threat QA dashboard

2. Backend flows

Threat scoring pipeline (dynamic)

Data ingestion pipeline (internal and external)

Threat QA run

Threat → PIT action pipe

Threat evidence snapshot pipe

2. Frontend Wiring

All components assume React + Next.js + TS + Tailwind + Zustand.

2.1 Component → State → Service chain

Example for opening the Threat detail view:

ThreatListPage
  → onSelectThreat(threatId)
    → useThreatStore.setSelectedThreatId(threatId)
    → useQuery(threatService.getThreatDetail(threatId))
      → edge function: EF_RISK_GET_THREAT_DETAIL
        → DB: threat, threat_characterisation, threat_rating, threat_rating_history, threat_data_signal, links

2.1.1 ThreatListPage

Components:

<ThreatFilterBar />

<ThreatTable />

<ThreatSummaryCards />

Calls:

threatService.listThreats(contextId, filters)
→ EF_RISK_LIST_THREATS

2.1.2 ThreatDetailPage

Components:

<ThreatOverviewTab />

<ThreatCharacterisationTab />

<ThreatScoringTab />

<ThreatDataAITab />

<ThreatHistoryTab />

<ThreatLinksTab />

Calls:

threatService.getThreatDetail(threatId)
→ EF_RISK_GET_THREAT_DETAIL

threatService.updateCharacterisation()
→ EF_RISK_UPDATE_THREAT_CHARACTERISATION

threatService.submitRating()
→ EF_RISK_SUBMIT_THREAT_RATING

threatService.approveRating()
→ EF_RISK_APPROVE_THREAT_RATING

2.1.3 ThreatQADashboard

Components:

<ThreatQASummary />

<ThreatQADetailTable />

Calls:

qaService.runThreatQA(contextId)
→ EF_RISK_RUN_THREAT_QA

qaService.listThreatQAResults(contextId)
→ EF_RISK_LIST_THREAT_QA_RESULTS

3. Edge Functions (backend wiring points)

Each edge function is a clearly named entry point:

3.1 CRUD & retrieval

EF_RISK_LIST_THREATS

EF_RISK_GET_THREAT_DETAIL

EF_RISK_CREATE_THREAT

EF_RISK_UPDATE_THREAT

EF_RISK_ARCHIVE_THREAT

3.2 Characterisation

EF_RISK_UPDATE_THREAT_CHARACTERISATION

EF_RISK_AI_SUGGEST_CHARACTERISATION

3.3 Scoring & approvals

EF_RISK_SUBMIT_THREAT_RATING

Validates values vs threat_scale

Writes to threat_rating

Creates threat_rating_history if changed.

EF_RISK_AI_PROPOSE_THREAT_RATING

Reads threat_data_signal + BES + incidents.

Runs scoring algorithm.

Writes provisional rating with rating_type = dynamic and approved_* = null.

EF_RISK_APPROVE_THREAT_RATING

Sets approved_by, approved_at.

Updates trend field on threat.

3.4 Data ingestion

EF_RISK_INGEST_INTERNAL_EVENTS

Called by Incident module, PIT, etc.

Aggregates counts, stores in threat_data_signal.

EF_RISK_INGEST_EXTERNAL_DATA

Called by scheduled jobs hitting crime APIs, news feeds, etc.

3.5 QA

EF_RISK_RUN_THREAT_QA

Executes all tests defined in QA plan.

Stores results in qa_result.

EF_RISK_LIST_THREAT_QA_RESULTS

3.6 Integration

EF_RISK_LINK_THREAT_TO_PIT

Creates PIT project/milestone/task based on threat.

EF_RISK_CREATE_THREAT_EVIDENCE_SNAPSHOT

Freezes current ratings & characterisation to evidence artefact for Maturity.

4. Background Jobs & Schedulers

Threat Scoring Job (e.g. every night)

For each active context + threat:

read data signals

call EF_RISK_AI_PROPOSE_THREAT_RATING

Notify responsible users of proposed changes.

Data Ingestion Jobs

Crime API poller (e.g. daily)

Sector alert poller

Internal incident roll-up job

QA Job

Nightly:

EF_RISK_RUN_THREAT_QA for each context.

Review Reminder Job

Weekly:

find threats with last_review_at older than policy

send notifications.

5. Integration Wiring
5.1 BES → Threats

When BES is completed:

EF_RISK_UPDATE_THREATS_FROM_BES is called:

Suggests new threats

Updates threat descriptions with BES context

Adds BES drivers as references.

5.2 Threats → Unwanted Events

A separate Unwanted Events module consumes threat & threat_rating:

Many-to-many mapping threat ↔ vulnerability.

Threat module exposes EF_RISK_LIST_THREATS_FOR_MAPPING(context).

5.3 Threats → PIT

For threats with overall_band in {High, Extreme}:

UI shows “Create PIT action” button.

Calls EF_RISK_LINK_THREAT_TO_PIT.

PIT stores back reference to threat_id.

5.4 Threats → Maturity Evidence

On demand or periodically:

EF_RISK_CREATE_THREAT_EVIDENCE_SNAPSHOT exports:

Threat list + ratings + history + linkages

Signs snapshot with timestamp and context ID.

6. Error Handling & Logging Wiring

All edge functions log to a central log with:

request_id, user_id, org_id, threat_id, context_id

error codes (e.g. THR_INVALID_SCORE, THR_MISSING_SCALE, THR_QA_FAIL)

Critical errors (QA failures, algorithm inconsistencies) visible in:

Threat QA dashboard

Global Foreman console.

7. Versioning

This document:
RISK_THREAT_WIRING_MAP_v0.1

Future versions will extend wiring as new modules go online (e.g. Vulnerability, RCCR, advanced analytics).