📘 RISK_THREAT_SPRINT_PLAN_v0.1.md

Module: Risk Assessment Engine — Threat Module
Version: 0.1
Scope: MVP (adversarial + non-adversarial threat engine with dynamic AI scoring)

0. Delivery Philosophy

All sprints adhere to:

True North Architecture (TN file governs all rules)

QA-First Build (pass QA = done)

No Legacy Policy (delete → rebuild; no patching)

Foreman Oversight (Builder agents execute; Foreman enforces standards)

“Green Build or No Build” rule

Atomic, testable increments

Total delivery timeline: 3–4 sprints (2 weeks each).

Total MVP time: 6–8 weeks fully automated.

Actual AI-agent execution time: much faster.

SPRINT 0 — FOUNDATIONS (Architecture + Scaffolding)

Duration: 3–4 days
Status: Required before Sprint 1

🎯 Goals

Set the system infrastructure so all future builds integrate seamlessly.

✔ Deliverables

Threat Module Folder Structure

/Modules/Risk/ThreatModule/…

Architecture/, Frontend/, Backend/, State/, QA/, etc.

Create baseline Next.js routes

/risk/threats

/risk/threats/[id]

/risk/threats/qa

Install dependencies

Zustand

shadcn/ui

React Query

Zod

Tailwind

Lucide icons

Framer Motion

Charting (Recharts)

Implement global Risk store “riskStore”
handles org/site/context selection.

Wiring & QA bootstrap

Install QA runner

Create first wiring checks

Register Threat Module under global QA

Database migration script (initial tables)

threat

threat_characterisation

🧪 QA Tests

Directory checks

Endpoint tests compile

No missing imports

Basic pages load

Initial schema deployed

SPRINT 1 — THREAT LIST + CREATION FLOW

Duration: 2 weeks**

🎯 Goals

Implement operational Threat Overview, with full CRUD, filtering, and navigation.

✔ Deliverables
🧩 Backend

EF_RISK_LIST_THREATS

EF_RISK_CREATE_THREAT

EF_RISK_UPDATE_THREAT

EF_RISK_GET_THREAT_DETAIL (minimal payload)

🖥 Frontend

ThreatListPage.tsx

ThreatSummaryCards.tsx

ThreatFilterBar.tsx

ThreatTable.tsx

ThreatRow.tsx

ThreatCreateModal.tsx

🔗 State

useThreatStore

useThreatList react-query hook

🎨 UI

Filtering

Sorting

Table hover interactions

Status badges

Priority indicators

Type & category tags

📡 Data

Integrate API → UI round trip

Render summary KPIs from backend

🧪 QA Tests

Wiring Tests:

EF_RISK_LIST_THREATS responds

Data shape correct

Filters applied correctly

Trends visible

UI Tests:

Page loads

Sort/filter work

Create threat modal validates inputs

Duplicate threats blocked

SPRINT 2 — THREAT DETAIL (Overview + Characterisation)

Duration: 2 weeks**

🎯 Goals

Finish the Threat Detail Page with two active tabs:

Overview

Characterisation

✔ Deliverables
🧩 Backend

EF_RISK_GET_THREAT_DETAIL (full version)

EF_RISK_UPDATE_THREAT_CHARACTERISATION

EF_RISK_AI_SUGGEST_CHARACTERISATION

🖥 Frontend

ThreatDetailPage.tsx

ThreatDetailHeader.tsx

ThreatTabs.tsx

ThreatOverviewTab.tsx

ThreatCharacterisationTab.tsx

Optional: ThreatEditModal

🔗 State

useThreatDetail

Substores for activeTab

🤖 AI

AI characterisation generator

AI rewrite options

AI explanations

Guardrails (cannot hallucinate facts)

🧪 QA Tests

Wiring Tests:

Threat detail loads

Characterisation saved

AI suggestions respond

Character count limits enforced

UI Tests:

Proper tab switching

Characterisation edits persist

All mandatory fields validated

Reasoning text visible

SPRINT 3 — SCORING ENGINE (Adversarial + Non-Adversarial)

Duration: 2 weeks**

🎯 Goals

Complete the full rating pipeline:

Capability

Intent

Targeting

Occurrence

Effects

AI proposals

Approval workflow

✔ Deliverables
🧩 Backend

EF_RISK_SUBMIT_THREAT_RATING

EF_RISK_AI_PROPOSE_THREAT_RATING

EF_RISK_APPROVE_THREAT_RATING

EF_RISK_RECALCULATE_RATING

🖥 Frontend

ThreatScoringTab.tsx

Adversarial layout

Non-adversarial layout

AI proposed rating preview

Supervisor approval panel

🔐 Validation

All scores must be within scales

Adversarial = 3-dimension logic

Non-adversarial = 2-dimension logic

No empty fields

User cannot approve his own rating

Formula consistency checks

🧪 QA Tests

Wiring Tests:

Formula validation

All dimensions required

AI proposal matches recorded evidence

UI Tests:

Values persist

Band calculation correct

Approval disabled until fully valid

Change explanation required on overrides

SPRINT 4 — DYNAMIC DATA SIGNALS + HISTORY (“Threat Shifting”)

Duration: 2 weeks

🎯 Goals

Implement internal/external data collection:

Incident trends

External crime stats

News sentiment

HR patterns

Surveillance anomalies

Access logs

✔ Deliverables
🧩 Backend

EF_RISK_COLLECT_SIGNAL

EF_RISK_LIST_SIGNALS

EF_RISK_ANALYSE_TRENDS

EF_RISK_LOG_HISTORY

🖥 Frontend

ThreatDataAITab.tsx

Charts (Recharts):

Last 12 months pattern

Signal contribution breakdown

Trend arrow logic

Buttons:

“Recalculate Rating”

“Explain AI Logic”

🤖 AI

Model: reasoning-level risk model

Logic:

Normalization

Trend detection

Trigger thresholds

Explanation chain

🧪 QA Tests

Threshold validation

Trend detection accuracy

History table correctness

Drift detection

No hallucination in explanations

SPRINT 5 — LINKS + EVIDENCE SNAPSHOTS + QA PAGE

Duration: 2 weeks

🎯 Goals

Add integration features:

BES

Unwanted Events

PIT

Evidence Snapshots

QA Dashboard

✔ Deliverables
🧩 Backend

EF_RISK_CREATE_THREAT_EVIDENCE_SNAPSHOT

EF_RISK_LINK_PIT

EF_RISK_LINK_BES

EF_RISK_LINK_UNWANTED_EVENT

EF_RISK_RUN_THREAT_QA

EF_RISK_LIST_THREAT_QA_RESULTS

🖥 Frontend

ThreatLinksTab.tsx

PIT linking modal

Evidence snapshot modal

ThreatQADashboardPage.tsx

ThreatQASummary.tsx

ThreatQAFailuresTable.tsx

🧪 QA Tests

Link creation & deletion

Snapshot JSON integrity

All QA tests in green before signoff

Missing wiring triggers QA warning

SPRINT COMPLETION CONDITION (Definition of Done)

The Threat Module is complete when:

✔ All 5 sprints produce green QA

✔ No missing wiring

✔ AI proposals pass accuracy tests

✔ Data signals properly influence ratings

✔ Threat shifting fully logged

✔ GUI works across desktop + mobile

✔ PIT integration functional

✔ Evidence snapshots export cleanly

✔ Foreman approves the PR

✔ No regressions detected by global QA