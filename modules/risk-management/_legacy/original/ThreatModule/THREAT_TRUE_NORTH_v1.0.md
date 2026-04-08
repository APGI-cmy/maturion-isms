Below is the complete THREAT_TRUE_NORTH_v1.0.md, fully rewritten to match the same engineering depth, precision, and governance quality as:

WRAC_TRUE_NORTH_v1.1.md

PIT_TRUE_NORTH_v1.0.md

ERM_TRUE_NORTH_v1.0.md

It elevates your earlier v0.1 Threat Module into a world-class, enterprise-grade, AI-enhanced architecture that ties perfectly into:

ERM

Vulnerability

Risk Assessment Engine

WRAC

PIT

Bowtie

Incident & Intelligence

Remote Assurance

This is now the authoritative blueprint for the Threat Module.

Place in your structure:
/Modules/Risk Management/ThreatModule/THREAT_TRUE_NORTH_v1.0.md

THREAT_TRUE_NORTH_v1.0.md

Threat Module — True North Architecture
Version 1.0
Aligned with:

ERM_TRUE_NORTH_v1.0.md

VULNERABILITY_MODULE_TRUE_NORTH_v1.0.md

RISK_ASSESSMENT_TRUE_NORTH_v1.0.md

SRMF Architecture v1.1

Maturion Build Philosophy (One-Time Build, Zero Regression)

0. PURPOSE

The Threat Module forms the first pillar of the SRMF Risk Lifecycle:

THREAT → VULNERABILITY → UNWANTED EVENT → RISK → MITIGATION → PIT → REMOTE ASSURANCE


The purpose of the Threat Module is to:

Standardize threat intake (adversarial & non-adversarial).

Classify and characterise threats using global taxonomies (NIST 800-30, MITRE, ASIS).

Model Threat Actor Profiles (TAP) with AI-assisted behaviour prediction.

Link threats to processes, facilities, and vulnerabilities.

Feed the Risk Assessment Engine with accurate threat likelihood data.

Enable dynamic threat drift, based on:

incidents

intel

seasonality

social, economic, criminal, geopolitical drivers

Prepare Threat Intelligence for analytics, including cross-company anonymised models.

Provide full auditability and governance compliance.

This module must deliver perfect data integrity, because threat intake errors cascade downstream into risk scoring, mitigation, cost planning, and PIT implementation.

1. HIGH-LEVEL ARCHITECTURE
1.1 Core Subsystems (Threat Module)
1. Threat Intake Engine
2. Threat Classification Engine
3. Threat Actor Modelling Engine (TAP)
4. TTP Mapping Engine (MITRE/NIST)
5. Threat Drift & Dynamic Risk Engine
6. Threat–Process–Facility Linking Engine
7. Threat Intelligence Dashboard
8. Threat Governance, Approvals & Audit
9. Export System (JSON/YAML/PDF)
10. Integration Layer (RA, Vulnerability, Incident, Pit, Remote Assurance)

2. UNIFYING PRINCIPLES
2.1 SRMF Integration First

Threats cannot exist in isolation.
Everything feeds downstream with deterministic rules.

2.2 AI-Assisted, Human-Approved

AI can classify, cluster, assess TTPs, predict drift, but:

AI may not create or modify threats without explicit human approval.

2.3 Global Taxonomy Compliance

Threats must use:

NIST 800-30 Threat Sources

MITRE ATT&CK (for adversarial)

ASIS/ISO/ANSI definitions

Maturion proprietary classification layer

2.4 Multi-Company Isolation

Threat data is single-company unless anonymised and used for modelling.

2.5 Version Control & Immutability

No threat classification can change after a threat has been used in a risk.

2.6 Zero Regression

Threat level data must pass validation every time the module changes.

3. THREAT LIFECYCLE (END-TO-END FLOW)
1. Threat Intake
2. Validation & De-duplication
3. Classification & Characterisation
4. Threat Actor Profiling (optional)
5. TTP Mapping
6. Assignment to Processes / Facilities / Zones
7. Likelihood Calibration (aligned to ERM)
8. Threat Drift Monitoring (real-time)
9. Workflow & Approval
10. Publishing (Immutable)
11. Distribution to Downstream Modules

4. THREAT INTAKE ENGINE
4.1 Input Sources

Manual user input

Historical threat libraries

Enterprise logs / incidents

Intelligence feeds

CCTV analytics

Access control anomalies

Crime statistics

Nodal (facility) risk submissions

4.2 Input Structure

Every intake must include:

Threat Name

Category (adversarial / non-adversarial)

Subcategory

Description

Indicators of Interest (IoI)

Attachments (PDF, images, reports)

Location / facility

Optional: threat actor details

4.3 AI Assistance

Models:

Normalisation

Categorisation

Validation (duplicate detection)

TTP mapping (auto-suggest)

Threat actor completeness check

Context expansion

User must approve all AI suggestions.

5. THREAT CLASSIFICATION ENGINE
5.1 Classification Hierarchy
Adversarial

Criminal

Opportunistic

Syndicate / organised crime

Insider

Cyber adversary

Terrorist

Rival groups

Hostile competitors

Sabotage agents

Non-Adversarial

Natural

Environmental

Technical

Mechanical

Process failure

System error

Health/Safety

Societal events

5.2 Mandatory Threat Attributes

Category / Subcategory

Threat Description

Capability Level (AI-calculated + human editable)

Motivation Level

Opportunity Level

Access Characteristics

Resource Level

Historical Frequency (per site & global model)

Domain Relevance (security, safety, operational, environmental)

6. THREAT ACTOR PROFILE (TAP) ENGINE

Creates profiles for adversarial threats:

Actor Type

Skill Level

Resources

TTP package (techniques, tactics, procedures)

Known patterns (linked incidents)

Predictive behaviour vector (12-month forecast)

Pathway-to-Harm model

Insider risk flags

TAP feeds:

RA Engine (likelihood calculation)

Remote Assurance (critical controls)

Bowtie centre-event causality inputs

7. TTP MAPPING ENGINE

Maps threat events to MITRE/NIST frameworks:

MITRE ATT&CK (physical + cyber)

Kill-chain classification

Entry points

Attack vectors

Targeted assets

Typical detection methods

Typical controls required

Outputs:

Control environment recommendations

RA Engine threat relevance score

Evidence requirements (for Remote Assurance)

8. THREAT DRIFT ENGINE

Dynamic engine monitors:

Criminal trends

Incident patterns

AI-detected anomalies

Seasonal patterns

Geographic risks

Socio-economic trends

Control degradation (from Remote Assurance)

Outputs:

Threat Drift Score (TDS)

Updated likelihood projection

Trigger points for re-assessment

Alerts to Risk Owners

9. THREAT–PROCESS–FACILITY LINKING ENGINE

Threats can be linked to:

Processes

Facilities

Zones

Workflows

Tasks

Lifecycles

Link Types:

Direct

Contextual

Propagated (inheritance)

This linkage determines which vulnerabilities can intersect with which threats → forming Unwanted Events.

10. THREAT GOVERNANCE
10.1 Workflow
Draft → Pending Review → Approved → Published (Immutable)


Only Threat Analysts or Risk Team can approve.

10.2 Auditability

All events logged:

Creation

Edits

Reclassification

Category changes

TTP changes

TAP updates

AI interactions

Approval events

Deactivation

10.3 Data Immutability

Once a threat is used in:

RA Engine

WRAC

Bowtie

Incident

PIT

…it cannot be changed — only cloned.

11. EXPORTS

Matching ERM standards:

JSON

YAML

CSV

PDF (Threat Profile Report)

ZIP Bundle (all threat details + linked entities)

12. INTEGRATIONS
12.1 Vulnerability Module

Threats map to vulnerabilities via allowed threat–vulnerability matrix.

12.2 Risk Assessment Engine

Initial likelihood

Threat relevance

Threat capability

Drift-adjusted likelihood

TAP behaviour modelling

12.3 WRAC

Threat name, category, and post-control likelihood populate WRAC.

12.4 PIT

Threat-driven projects

Mandatory controls

Critical controls

Trend-based priority changes

12.5 Incident & Intelligence

Real-time threat model updates from incidents.

12.6 Remote Assurance

Control availability → threat drift updates

System failures → increased threat likelihood

12.7 Bowtie

Threat = causal pathway to top event.

13. DATA MODELLING PRINCIPLES

All threat entities are fully normalised.

Versioning mandatory.

Org boundaries enforced.

Multi-hierarchy inheritance supported.

Each threat has globally unique GUID.

Threat actor profiles reuse structured canonical templates.

14. UI PRINCIPLES

Threat UI must be simple, despite complexity:

Step-based wizard for intake

Dual-pane layout for classification

Threat actor profile timeline

TTP checklist & search

Colour-coded drift indicators

AI panels always marked

Tooltip-heavy (education built-in)

Zero cognitive overload

15. AI USAGE

Allowed:

Classification suggestions

Threat clustering

TTP mapping

TAP generation

Drift detection

Deduplication

Summaries

Trend analysis

Not allowed:

Auto-creating threats

Auto-editing published threats

Changing threat classification without explicit human confirmation

AI must always record:

confidence score

model used

data input summary

16. SECURITY & COMPLIANCE

Strict RLS boundary enforcement

No cross-company threat access except anonymised analytics

GDPR/POPIA-compliant data handling

Full encryption at rest and in transit

Immutable audit log (append-only)

All AI data subject to audit

Provider isolation for intel feeds

17. DEPLOYMENT STRATEGY

Use feature flags for drift engine (v1 = partial, v2 = full automation)

Progressive rollout

Automated regression on every change

Shadow mode for threat likelihood recalibration

Kill-switch on AI drift if anomaly detected

18. SUCCESS CRITERIA

Threat Module is considered “correctly implemented” when:

Threats can be created, classified, and approved.

TTP mapping works flawlessly.

TAP generation passes QA.

Threat drift delivers reliable forecasts.

Threats link to processes, facilities, and vulnerabilities.

All data flows into RA Engine and WRAC.

PIT auto-generates mitigation tasks when drift thresholds are exceeded.

Exports validate with checksums.

QA plan passes 100%.

Governance approves the module.