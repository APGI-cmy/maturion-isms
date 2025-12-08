RISK_THREAT_MODULE_TRUE_NORTH_v0.1.md
Risk Assessment Engine – Threat Module
Version 0.1
0. Scope & Purpose

This document defines the Threat Module for the Risk Assessment Engine.

It covers:

Threat environment UI & workflows

Adversarial and non-adversarial threat modelling

Scales (capability, intent, targeting, occurrence, range of effects)

Dynamic, data-driven scoring

AI assistance & human oversight

Audit trail & “threat shifting” history

Integration with:

Business Environment Scan (BES)

Vulnerability module

Risk module (unwanted events & risk scoring)

PIT (Project Implementation Tracker)

Maturity roadmap (evidence)

This module does not cover vulnerabilities, unwanted events, RCCR, or treatment projects – those are separate modules that consume threat outputs.

1. Design Principles

Standards-aligned

Based on ISO 31000 & NIST SP 800-30 threat concepts.

Compatible with your SRM/ORM model.

Dynamic & data-driven

Threat ratings adjust over time using internal & external data feeds.

Annual reviews become a checkpoint, not the only update.

Explainable & auditable

Every rating has a clear explanation and a change history.

Human overrides are logged with rationale.

Human-in-the-loop by default

AI proposes; humans approve and can override.

The system never silently changes critical ratings.

Separation of concerns

Risk Management module defines scales, algorithms, and policy.

Threat Module executes assessments using those definitions.

2. Key Concepts & Entities
2.1 Threat Types

Adversarial threats

Malicious actors: criminals, insiders, hacktivists, nation states, etc.

Rated via: Capability, Intent, Targeting (+ optional Tactics/Trust/Motivation as descriptors).

Non-adversarial threats

Accidents, process failures, natural hazards, system failures, etc.

Rated via: Likelihood of occurrence, Range of effects.

2.2 Threat Records

Each threat is a structured record:

Identity (name, description, category, sector)

Type (adversarial / non-adversarial)

Characterisation (who, why, how, what)

Scores (core dimensions, overall likelihood & impact)

Data links (internal incidents, external feeds)

History (how ratings changed over time)

2.3 Dynamic Threat Environment

For each organisation/site:

There is a Threat Portfolio (top N threats, plus tail).

Each threat has:

Baseline rating (human-set, policy-based)

Current dynamic rating (adjusted via data & AI)

Trend (increasing, stable, decreasing)

Last review and next review due

3. Threat Module – User Roles

Risk Governance / Security Leadership

Approve scales and algorithms (from Risk Management module).

Approve baseline ratings for key threats.

Approve major rating changes.

Risk Practitioner / Analyst

Run threat assessments.

Review AI suggestions and data summaries.

Propose new threats or retire obsolete ones.

Operational Manager / Supervisor

Consume threat summaries.

Use threat info to prioritise local actions (via PIT).

External Auditor / Consultant

Read-only view of methodology, evidence and history.

4. UI & Workflow (Threat Module only)
4.1 Entry from SRMF Landing Page

From the SRMF interactive diagram:

Click “Understand the threats & vulnerabilities” →
opens page with two cards:

Threat Environment (this module)

Vulnerability Environment (separate module)

4.2 Threat Environment Page Layout

High-level wireframe:

+--------------------------------------------------------------------------------+
|  Threat Environment – [Org / Site selector ▼]                                  |
+--------------------------------------------------------------------------------+
|  [Adversarial threats] [Non-adversarial threats] [All]  [Filters ⚙] [Run QA]  |
+--------------------------------------------------------------------------------+
|  Summary tiles:                                                                |
|   - Active threats: 24   - Increasing risk: 5   - High/Extreme: 7             |
+--------------------------------------------------------------------------------+
|  Threat table                                                                  |
|  +---------------------------------------------------------------------------+ |
|  | Name          | Type        | Category   | Overall | Trend | Last review | |
|  |---------------+------------ +----------- +-------- +-------+------------ | |
|  | Diamond theft | Adversarial | Crime      | High    | ↑     | 2026-01-10 | |
|  | Collusion     | Adversarial | Insider    | Extreme | →     | 2025-11-02 | |
|  | Power outage  | Non-adv.    | Utility    | High    | ↑↑    | 2026-02-01 | |
|  +---------------------------------------------------------------------------+ |
|  [ + Add new threat ]                                                         |
+--------------------------------------------------------------------------------+
|  Side panel (when a threat is selected):                                      |
|   - Quick description                                                          |
|   - Latest ratings (radar chart)                                              |
|   - "View details"  [Open Threat Detail]                                      |
+--------------------------------------------------------------------------------+

4.3 Threat Detail View – Adversarial Threat

Wireframe:

+--------------------------------------------------------------------------------+
| Threat: Diamond theft               Type: Adversarial    Status: Active       |
+--------------------------------------------------------------------------------+
| Tabs: [Overview] [Characterisation] [Scoring] [Data & AI] [History] [Links]   |
+--------------------------------------------------------------------------------+
| Overview tab                                                                 |
|  - Narrative summary (AI assist)                                              |
|  - Category, sector, example scenarios                                       |
|  - Overall risk level badge (Low/Mod/High/Extreme)                           |
|  - Trend indicator (sparkline over time)                                     |
+--------------------------------------------------------------------------------+

Characterisation tab

Fields (many from your Excel examples):

Threat source (Malicious / Non-malicious / Accidental / Environmental)

Threat source detail

Threat agent (e.g. “Disgruntled employee”, “Organised crime group”)

Threat motivation (financial gain, ideology, revenge, etc.)

Threat goal/outcome (theft, sabotage, disruption, etc.)

Threat trust level (user, admin, unauthorised, outsider)

Threat tactics (exfiltration, social engineering, physical infiltration, etc.)

Threat tactics detail (free text / AI assisted)

AI assists by drafting characterisation from:

BES info

Internal incidents

External sources

Scoring tab (Adversarial)

Each dimension is scored using a scale card:

Capability (1–5)

Intent (1–5)

Targeting (1–5)
Optional:

Tactics sophistication, Trust exploitation, etc. (as descriptors only).

UI behaviour:

Each scale shows:

Qualitative label (Rare → Almost certain)

Semi-quant band (e.g. 96–100)

Full description text (from Risk Management scales)

User can:

Accept AI suggestion

Manually choose value

Add comment.

The module computes:

adversarial_likelihood_score = weighted_avg(capability, intent, targeting)
adversarial_likelihood_band  → mapped to 1–5


Security impact dimension (for this threat alone) can come from:

A default “threat impact profile”

Or from later mapping to specific assets/unwanted events (in another module).

Data & AI tab

Shows:

Internal data signals (charts):

incidents over time relating to this threat

related near misses

anomalies from surveillance/access/log systems

External signals:

regional crime stats

sector alerts

curated OSINT items

AI generates:

A written “Threat brief” (what changed, why it matters).

A recommended score for each dimension:

“Based on X, Y, Z, suggested Capability: 4 → Intent: 4 → Targeting: 3.”

User sees both:

Baseline (policy-level) rating

Current proposed dynamic rating

Delta (change) and reason.

History tab (“Threat shifting log”)

Shows every rating change:

Date       Dimension   Old  New  Driver           Approved by   Notes
2026-01-10 Capability  3    4    Incidents ↑70%   Risk Manager  ...
2026-03-05 Targeting   2    3    Regional crime   CISO          ...


Exportable as evidence.

Links tab

Shows:

Linked unwanted events / PUEs

Linked vulnerabilities

Linked PIT actions/projects

Linked incidents

4.4 Threat Detail View – Non-adversarial Threat

Similar layout, but on Scoring tab, instead of capability/intent/targeting:

Likelihood of occurrence (1–5)

Range of effects (1–5)

Using your NIST-style descriptors and semi-quant bands.

The combined “threat rating” for non-adversarial threats is computed from:

likelihood_score = f(occurrence_frequency, signals)
impact_score     = range_of_effects


The rest (Data & AI tab, History, Links) works identically.

5. Data Model (Threat Module)

High-level entities (pseudo-DB, not full schema):

5.1 threat

id

org_id, site_id

name, description

type (adversarial | non_adversarial)

category (crime, insider, utility, natural, technology, etc.)

status (active, archived)

created_at, updated_at

5.2 threat_characterisation

threat_id

source_type (malicious, non_malicious, accidental, environmental, etc.)

source_detail

agent

motivation

goal_outcome

trust_level

tactics

tactics_detail

created_at, updated_at

5.3 threat_scale (from Risk Management module)

Defines the global scales – one record per dimension and per value.

id

dimension (capability | intent | targeting | occurrence | effects)

qualitative (Rare → Almost certain, etc.)

value (1–5)

range_min, range_max (semi-quant)

description (full narrative)

is_adversarial boolean

5.4 threat_rating

For each threat and assessment context (site/year).

id

threat_id

context_id (e.g. “Karowe 2026 Baseline”)

rating_type (baseline | dynamic)

capability_score (nullable)

intent_score (nullable)

targeting_score (nullable)

occurrence_score (nullable)

effects_score (nullable)

overall_likelihood

overall_severity (if used here, or later at risk level)

overall_band (Low/Mod/High/Extreme)

ai_explanation (text)

approved_score_by (user id)

approved_at

created_at

5.5 threat_rating_history

Every change:

id

threat_rating_id

dimension

old_value, new_value

change_reason (auto, manual, data_trigger_x, etc.)

driver_type (internal_data | external_data | manual)

driver_reference_id (e.g. incident id, alert id)

approved_by, approved_at

created_at

5.6 threat_data_signal

Aggregates internal/external data used for scoring:

id

threat_id

source (incident_db, crime_api, news_api, etc.)

metric_name (e.g. num_incidents_last_12m)

metric_value

metric_window (e.g. “12m”, “3m”)

collected_at

6. Scoring & Algorithm Logic (v0.1)
6.1 Adversarial threats

Baseline rating (captured during initial threat assessment):

Practitioner uses the NIST-style tables to choose 1–5 for each dimension.

Stored in threat_rating where rating_type = baseline.

Dynamic adjustments (automatic proposals):

For each threat, on a schedule (e.g. daily/weekly), the engine:

pulls internal & external threat_data_signal records

computes indices: incident frequency, trend, severity mix, etc.

maps indices to recommended changes:

E.g. “if incidents increased >X% vs baseline window → +1 to likelihood or capability (up to max 5).”

AI summarises why a change is suggested.

Combining values:

Use a simple weighted average, configurable in Risk Management module, e.g.:

adversarial_likelihood = 
    0.4 * capability + 0.35 * intent + 0.25 * targeting


Map numeric result to 1–5 band and Low/Mod/High/Extreme.

Human approval:

New proposed scores appear as “pending” in the UI.

Risk practitioner/manager approves or overrides.

Result logged in threat_rating_history.

6.2 Non-adversarial threats

Baseline:

Occurrence frequency band chosen based on process failure data and descriptor table.

Range of effects chosen based on potential consequences.

Dynamic:

Use internal operations data: number of failures per year, downtime, near misses, etc.

Use external environment changes (e.g. climate risk mapping if relevant).

Combination:

Standard risk matrix: Likelihood (1–5) × Impact (1–5) → risk level

Again, AI explains any suggested shift.

7. AI Responsibilities & Limits

AI is used for:

Interpreting BES outcomes, incident records, and external feeds.

Drafting threat characterisations based on structured + unstructured data.

Suggesting scores and writing natural-language explanations.

Summarising history (“Threat X has been trending upward for 18 months…”).

Generating board-level/executive summaries.

AI is not allowed to:

Approve final ratings.

Directly change scores without logging and human approval.

Delete or hide threat history.

If AI misses an important factor and a human adjusts the rating, the override rationale becomes training feedback for future prompts and can be added to a “considerations” knowledge base for that threat.

8. QA Rules for Threat Module

Foreman should enforce the following QA checks (examples, not exhaustive):

Structure

Every threat must have at least one threat_characterisation.

Every active threat must have at least one threat_rating for each active context.

Scale alignment

All scores must be within defined threat_scale values (1–5).

No threat may have a score in a dimension not applicable to its type (e.g. capability for non-adversarial).

History completeness

Any change to a score after initial baseline must create a threat_rating_history entry.

No rating in dynamic mode without ai_explanation or change_reason.

Data consistency

Any dynamic change must reference at least one threat_data_signal OR explicit manual rationale.

Integration checks

High/Extreme threats must be linked to at least one unwanted event (or flagged as needing mapping).

Where applicable, high threats must have at least one linked PIT action or a recorded “risk acceptance” decision.

Failure of any QA test → red flag in Threat QA dashboard.

9. Integration Points (for other modules)

BES module

Supplies context & key drivers for threats.

Threat module can suggest threats based on BES outputs.

Vulnerability module

Threats are later combined with vulnerabilities to derive unwanted events and risks.

Risk (Unwanted Events/Risk Register) module

Consumes threat_rating as input to risk calculations.

PIT module

High/Extreme threats with action plans spawn PIT projects/milestones/tasks.

Maturity Roadmap

Evidence of:

Completed threat assessments

Threat portfolios

Dynamic update logs

Links to actions

10. Versioning & Future Enhancements

This document is:

RISK_THREAT_MODULE_TRUE_NORTH_v0.1

Planned future enhancements:

v0.2 – add sector-specific default threat libraries.

v0.3 – more advanced ML-based anomaly detection in data signals.

v1.0 – full integration with Vulnerability & RCCR modules.

v1.5 – predictive threat scenarios (what-if modelling).