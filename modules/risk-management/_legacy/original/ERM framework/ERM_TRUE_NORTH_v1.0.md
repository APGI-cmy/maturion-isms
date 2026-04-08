Below is the full ERM_TRUE_NORTH_v1.0.md, built to the same depth, structure, and engineering discipline as the WRAC, PIT, and Course Crafter True North documents.

This is the master architecture for the Enterprise Risk Management module inside the Maturion ISMS.
All engineering documents, schemas, UI files, QA plans, integrations, and AI logic will derive from this blueprint.

Place in:

/Modules/Risk Management/ERM framework/ERM_TRUE_NORTH_v1.0.md

ERM_TRUE_NORTH_v1.0.md

Enterprise Risk Management — True North Architecture Specification
Version 1.0
Alignment: Maturion ISMS, SRMF, One-Time Build, Zero Regression
Scope: Architecture, principles, data logic, workflows, integrations, and governance for the full ERM module.

0. PURPOSE

The ERM module is the governance core of the SRMF Risk Management System.

It defines:

How risk is measured

How risk is classified

The appetite and tolerance thresholds

Likelihood and impact scales

Heatmap geometries

Organisational roles and responsibilities

Versioning discipline for risk parameters

Company-level hierarchical adoption

How every downstream risk-related module must behave

Nothing in the SRMF may contradict or override ERM logic.

ERM is the single source of truth for risk scoring across:

Threat Module

Vulnerability Module

Risk Assessment Engine

WRAC

Controls

PIT

Bowtie

Audit

Incident & Intelligence

Remote Assurance

Forecasting Analytics

The purpose of this True North document is to architect ERM at the same professional standard as the PIT and WRAC True Norths. It establishes a complete engineering blueprint, enabling Builders to implement ERM once, correctly, without regressions.

1. ARCHITECTURE OVERVIEW

ERM’s architecture consists of 6 primary layers:

1. Governance & Roles Layer
2. Scales & Scoring Layer (Likelihood ∙ Impact)
3. Heatmap Engine
4. Risk Appetite Engine
5. ERM Profile Engine (per Company)
6. Integration & Enforcement Layer


And 3 cross-cutting pillars:

A. Version Control & Overrides
B. Permissions & Hierarchy Inheritance
C. AI Calibration & Interpretation


The ERM module does not perform assessments.
It defines the rules that other modules must follow.

2. CORE ERM PRINCIPLES (NON-NEGOTIABLE)

ERM governs the entire ISMS
No module may implement custom scoring.

One ERM profile per company
Children (plants, divisions, mines, regions) inherit everything.

Parent approval required
For any change affecting child entities.

Versioning is strict
Changes produce ERM_vX.Y profiles.

Risk scoring must be deterministic
If input = A, output must always = B.

Colour → Descriptor → Band mapping is locked
No duplicate or overlapping ranges.

AI must adopt ERM logic (no hallucinated scoring)
The AI routing layer consults ERM tables directly.

Heatmap geometry must remain standardised
Likelihood × Impact → Cell → Level → Colour → Descriptor.

Appetite must be configurable but bounded
No appetite may exceed ERM-defined maximum values.

Approvals must be auditable
All changes require a digital signature & audit log.

3. ERM MODULE SCOPE

The ERM module provides:

3.1 Likelihood Scale

Adversarial

Non-Adversarial

Impact occurrence scale

Fully customizable

3.2 Impact Scale

Multi-domain:

Safety

Security

Environmental

Operational

Financial

Reputation

Can use EBITDA or company metric for financial mapping.

3.3 Risk Matrix Geometry

NxN configurable (3×3, 4×4, 5×5, 6×6)

Contains:

Heatmap colour

Level

Descriptor

Numeric range

Appetite band

3.4 Appetite & Threshold Engine

Appetite per company

Thresholds for:

Escalation

Approval

Workflow routing

3.5 ERM Profile Bundles

Exportable (JSON, PDF, YAML)

Version-controlled

Signed by authorised owner

3.6 Integration Layer

RA engine auto-maps scores

WRAC inherits ERM-defined bands

Controls map to appetite logic

PIT escalates above-appetite items

Bowtie uses ERM for barrier criticality

Audit flags NCRs tied to appetite breaches

Remote Assurance flags control degradation → appetite deviation

4. ERM SUBSYSTEM ARCHITECTURE

ERM contains the following subsystems:

4.1 Likelihood Subsystem
Inputs

Threat relevance

Adversarial TTP sophistication

Historical occurrences

ARO (Annualised Rate of Occurrence)

AI-calculated probability

Configuration

Up to 7 levels

Each level includes:

Numeric score

Descriptor

Colour (optional)

Guidance text

Output

Always produces:

Likelihood Level → Likelihood Score

4.2 Impact Subsystem
Inputs

ALE (Annual Loss Expectancy)

Damage severity

Operational downtime

Human safety severity

Environmental impact

AI-modified severity (optional but audited)

Configuration

Multi-domain impacts

5–7 levels

Numeric & descriptor values

Colour optional but allowed

Output

Impact Level → Impact Score

4.3 Heatmap Engine

Heatmap engine performs the final classification:

Likelihood Score × Impact Score → Cell Index


Cell has:

Risk Level (e.g., Extreme, High, Moderate, Low)

Colour

Descriptor

Mandatory workflow behaviour

Required approvals

Reporting visibility rules

Heatmap geometry must be precomputed at ERM profile creation.

4.4 Appetite Engine

Every company has:

Appetite Level
Appetite Threshold (per domain)
Escalation Rules
Approval Rules


ERM defines:

Baseline appetite

Allowed override ranges

Mandatory responses when appetite is exceeded

Appetite influences:

RA escalation

WRAC sign-off

PIT critical action prioritisation

Bowtie barrier monitoring

Remote Assurance urgency

4.5 ERM Profile Engine

Each company has one and only one ERM profile:

ERM_PROFILE_{company_id}_{version}


Profile contains:

Likelihood Scale

Impact Scale

Heatmap

Appetite thresholds

Audit metadata

Parent approvals

Active/Inactive status

Profiles are immutable once activated.

5. ERM DATA MODEL (HIGH-LEVEL)

ERM requires the following logical entities:

ERM_PROFILE
ERM_LIKELIHOOD_LEVEL
ERM_IMPACT_LEVEL
ERM_RISK_MATRIX_CELL
ERM_APPETITE_RULE
ERM_APPROVAL_RECORD
ERM_DOMAIN_CONFIG
ERM_HIERARCHY_LINK
ERM_AUDIT_LOG


Detailed schema will be created in ERM_DATABASE_SCHEMA_v1.1.md.

6. ERM WORKFLOWS
6.1 ERM Profile Creation Workflow

Create new ERM profile (draft)

Configure likelihood levels

Configure impact levels

Generate heatmap

Define appetite

Assign roles

Request approval

Parent approval required

Publish → profile becomes active

Child entities inherit automatically

6.2 Appetite Breach Workflow

Triggered when:

RA residual risk > appetite

WRAC risk > appetite

Remote Assurance signals control failure

PIT task delays create escalating risk

Bowtie barrier degradation

Workflow:

Auto-alert to risk owner

Auto-alert to company risk manager

Required justification

Required action plan (PIT tasks)

Escalation to senior management

ERM audit entry created

6.3 Parameter Update Workflow

Updates must:

Be made in draft

Undergo validation

Require parent approval

Rebuild heatmap

Rebuild appetite thresholds

Version bump (major or minor)

Publish

Risk assessments must adopt new version automatically unless version locking is configured.

7. ERM INTEGRATION ARCHITECTURE

ERM integrates at core with all modules:

7.1 Threat Module

Maps adversarial likelihood scores → ERM likelihood scale.

7.2 Vulnerability Module

Impact scaling for assets & processes reflect ERM impact domains.

7.3 Risk Assessment Engine

ERM defines the mathematical model for:

Inherent risk

Residual risk

Projected risk

Appetite comparison

7.4 WRAC

Uses ERM heatmap and colour descriptors.

7.5 PIT

Appetite determines:

Task criticality

Scheduling rules

Watchdog severity

Auto-escalations

7.6 Bowtie

Barrier criticality is derived from ERM-level severity.

7.7 Incident

Severity → appetite → escalation.

7.8 Audit

NCRs tied to appetite breaches.

7.9 Remote Assurance

Control degradation → appetite breach → PIT tasks created.

8. AI IN ERM

AI is used for:

Auto-suggested likelihood levels

Auto-suggested impact levels

Heatmap calibration

Appetite recommendations

Version comparison

Pattern detection across companies (anonymised)

Auto-generation of profile bundles

AI cannot override ERM rules.
It must conform to ERM, not the other way around.

A detailed routing file will be created:

ERM_MODEL_ROUTING_SPEC_v1.0.md

9. UI/UX PRINCIPLES FOR ERM

ERM UI follows:

Minimalist design

Colour discipline

Step-driven configuration

Preview panels for heatmap

Approval flows with visual indicators

Version timeline

Comparison view (side-by-side profiles)

Export options for compliance

Detailed layouts will be defined in:

ERM_WIREFRAMES_v1.1.md
ERM_FRONTEND_COMPONENT_MAP_v1.1.md

10. QA & ZERO REGRESSION

ERM has stricter QA than any module due to governance role.

Tests must validate:

Heatmap correctness

Appetite thresholds

Scoring determinism

Inheritance rules

Approval workflows

Version locking

Integration enforcement

AI stability (no drift)

Will be captured in:

ERM_QA_IMPLEMENTATION_PLAN_v1.1.md

11. FUTURE EXPANSION (v2.0+)

Industry-aligned ERM templates

Federated multi-company comparisons (anonymised)

Risk appetite simulation models

Intelligent calibration engine

Auto-detection of anomalous scoring patterns

Continuous dynamic ERM adaptive mode (experimental)

✔ END OF ERM_TRUE_NORTH_v1.0.md