📄 WRAC_TRUE_NORTH_v0.1.md

Workplace Risk Assessment & Control (WRAC) + Control Management True North
Version 0.1 — Architectural Specification
Aligned to Maturion True North v1.2, Build Philosophy v1.1, RA Engine True North, Control Library v0.1

0. Purpose

The WRAC & Control Management module provides the risk-centric and control-centric operational layer of the Risk Assessment Engine.
It transforms Threats + Vulnerabilities + Unwanted Events + Controls into:

A prioritised, actionable risk view (WRAC)

A control dependency view showing which controls mitigate which risks

A risk mitigation strategy builder

A control implementation tracker (PIT integration)

A real-time risk monitoring platform (via CCR and Remote Assurance)

A governance environment for appetite, escalation, and sign-off

Exportable reports for operational, tactical, and strategic consumption

The WRAC module is not another risk assessment method.
It is the presentation, decision-making, and execution environment built on top of the fully completed RA Engine.

It must strictly follow:

The Maturion True North

One Build philosophy

RA Engine’s data outputs

Control Library standards

PIT integration architecture

Remote Assurance architecture for real-time control performance

1. Role in the ISMS Ecosystem

WRAC sits downstream of:

Threat Module (defines threats).

Vulnerability Module (maps processes/lifecycles/facilities).

Risk Assessment Engine (calculates risks, links controls, quantifies ALE).

And upstream of:

Risk Mitigation Strategy Engine

PIT (Project Implementation Tracker)

Remote Assurance & Data Analytics

Control Effectiveness Monitoring (CCR)

Dashboard & Reporting Engine

The WRAC is therefore the bridge between assessment and action.

2. Objectives

The WRAC module must:

2.1 Risk-Centric Objectives (WRAC View)

Provide a complete, filterable, prioritised list of all risks.

Display inherent, residual, projected, and real-time live risk.

Show ALE values and ROI for proposed controls.

Enable appetite decisions and sign-off workflows.

Identify PUEs and trigger Bowtie assessments.

Provide exportable WRAC reports for governance.

2.2 Control-Centric Objectives (Control Management View)

Allow selection of controls to see all risks mitigated by them.

Allow selection of risks to see all controls required for mitigation.

Track implementation progress of each control (via PIT).

Track operational performance of each control (via Remote Assurance).

Provide a CCR health index for each control and each risk.

2.3 Strategic Objectives

Enable bundling of controls into short-, medium-, and long-term strategies.

Produce a complete mitigation strategy report (similar to JUP RA tables).

Automate exporting of selected controls to PIT for implementation.

Provide a risk-driven roadmap for security improvement.

3. Fundamental Concepts
3.1 Five Risk States

The RA Engine gives us:

Inherent Risk

Residual Risk (current controls)

Projected Risk (after proposed controls)

WRAC adds:

Actual Live Risk (implementation progress × operational performance)

Appetite Status (within / above / far above threshold)

3.2 Two Structural Views

Risk → Controls (WRAC)

Controls → Risks (Control Management)

These are two sides of the same relational graph.

3.3 Three Control Layers

From Control Library: 

CONTROL_LIBRARY_v0.1

Control Definition (generic)

Control Instance (site-specific design package)

Control Implementation Tasks (PIT)

3.4 Control Performance

Two dimensions:

Implementation Completeness (PIT progress)

Operational Performance

Automated from integrated systems (CCTV uptime, alarms, access control, etc.)

Manual checks using electronic checklists

Hybrid monitoring

Weighted by quality of monitoring method

3.5 CCR: Critical Control Register

Controls critical to preventing high-consequence events.
CCR evaluates:

Availability

Correct functioning

Monitoring reliability

Last validation

Faults

Overrides

Manual bypasses

4. Functional Scope
4.1 WRAC View (Risk-Centric)

Full risk listing (priority sorted, with flexible Top-N selection).

Filters by:

Architecture component

Threat category

Vulnerability category

Control type

PUE status

Appetite status

Data columns:

Inherent/Residual/Projected risk ratings + levels

Heatmap descriptors

ALE values

ROI

Cost type & cost accuracy

Appetite threshold comparison

Sign-off workflow

Embedded side panel provides:

AI narrative

Control contributions

Implementation overview

CCR status

PUE logic explanation

4.2 Control Management View (Control-Centric)

List of all controls from Control Library.

Control selector with multi-select (checkbox) capability.

When controls selected → risks filtered to those mitigated by those controls.

When risks selected → controls filtered to those required for mitigation.

Individual controls show:

Design efficacy

Implementation progress (PIT)

Operational performance (Remote Assurance)

Live contribution to risk reduction

Dependencies between controls

4.3 Strategy Builder

Define:

Immediate (quick wins)

Medium-term

Long-term

Auto-generate:

Mitigation bundles

Required budgets

Expected risk improvements

Implementation workload

PIT project creation commands

Export into:

PIT

PDF Strategy Report

HTML Executive Summary

4.4 Real-Time Risk Monitoring

Dashboard showing:

Live risk heatmap

Control performance index

Implementation progress index

Risks drifting upward

PUEs at risk due to control failures

Overdue tasks impacting risk group

Alerts:

CCR failure

Implementation delay

Appetite breach

PUE uncontrolled

5. User Journeys
5.1 Custodian

Enters WRAC → reviews assigned risks → proposes controls.

Uses strategy builder for bundle selection.

Sends to owner for sign-off.

5.2 Risk Owner

Reviews WRAC rows, appetite status, AI summaries.

Approves / rejects mitigation proposals.

Assigns PUE → Bowtie.

Approves export to PIT.

5.3 Security Manager

In Control Management:

Selects controls for design packages.

Tracks implementation progress.

Monitors control health.

Uses dashboard to see which risks are improving or worsening.

5.4 Remote Assurance Specialist

Monitors operational performance.

Ensures manual checklists completed.

Uploads evidence.

5.5 Executive

Sees high-level dashboards.

Receives AI-generated summaries.

Reviews ROI on major implementations.

6. Data Model (High Level)

Entities:

6.1 Risk Entity

risk_id

threat_id (link to Threat Module)

vulnerability_id

unwanted_event_id

inherent_risk_score

residual_risk_score

projected_risk_score

live_risk_score

ale_inherent

ale_residual

ale_projected

appetite_threshold

appetite_status

owner_id

custodian_id

pue_flag

bowtie_required

mitigation_decision

signoff_status

6.2 Control Entity

control_id

control_group_id

definition_id (from Control Library)

efficacy_design (%)

required_domain

evidence_requirements

6.3 Control Instance

instance_id

control_id

site/facility

design_package_details

required_monitoring_method (electronic/manual/hybrid)

monitoring_frequency

criticality (critical / important / supportive)

6.4 Control Performance (from Remote Assurance)

availability (%)

fault_rate

override_count

evidence_snapshot

last_verified_timestamp

monitoring_quality_factor (electronic = 1.0, manual = 0.5, hybrid = 0.8)

6.5 Implementation (PIT)

pit_project_id

milestones

progress (%)

due_dates

responsible_persons

budget

6.6 Relationships

risk → controls = many-to-many

control → risks = many-to-many

control → control instance → PIT & CCR

7. AI Behaviour Specification

AI must:

Suggest controls based on Threat and Vulnerability patterns.

Explain why certain controls are critical.

Draft mitigation strategies.

Detect anomalies or inconsistencies.

Draft communication to risk owners.

Assist in Bowtie preparation.

Provide simplified executive summaries.

AI must NOT:

Change risk ratings.

Change efficacy values outside library bounds.

Auto-approve.

Remove evidence requirements.

Fabricate missing fields.

8. Integrations & Wiring
8.1 With RA Engine

All risk values are read-only outputs from RA Engine.

WRAC does not compute risk; it displays and contextualises it.

8.2 With Control Library

All control definitions, types, domains sourced here.

Proposed controls must map to existing library items.

8.3 With PIT

When controls selected for implementation → PIT project created.

Implementation progress fed back into live risk scoring.

8.4 With Remote Assurance

Automated system availability → CCTV uptime, access control, alarm monitoring, etc.

Manual checks → electronic checklists with evidence uploads.

Hybrid → weighted algorithm.

8.5 With PUE / Bowtie

If PUE logic triggered, matter escalated to Bowtie workflow.

Bowtie outputs fed back into WRAC.

8.6 With Reporting Engine

WRAC reports, strategy reports, CCR reports.

Dashboard-level summaries.

9. UI & UX Requirements
9.1 Minimalistic UI

Two main tabs:

WRAC (Risk View)

Controls (Control View)

9.2 Visual Elements

Clean tables

Colour-coded heatmap cells

Green/Amber/Red CCR indicators

Progress bars for implementation

Toggle for “Live Risk” vs “Residual/Projected”

Side panel for expanded details

9.3 Filtering & Multi-Select

Wide filter capabilities (domain, threat, vulnerability, control group).

Checkbox selection of controls or risks.

Dynamic updates.

9.4 AI Assistance Button

Context-aware help

Summarise

Suggest actions

Explain risk

Suggest strategies

10. Governance & Workflow

Custodian proposes.

Risk owner approves or escalates.

If > appetite → mandatory mitigation.

If PUE → mandatory Bowtie.

If control is critical → mandatory CCR monitoring.

All sign-offs logged with timestamps.

11. QA Requirements (summary)

Architecture conformity

Correct mapping to RA Engine outputs

Correct wiring to Control Library

Correct integration into PIT

Correct integration to Remote Assurance

UI behaviour, filters, toggles

CCR health calculation correctness

PUE logic correctness

Strategy builder correctness

Export formats

Full regression tests

12. Versioning

This is WRAC_TRUE_NORTH_v0.1.
Any update must reflect:

Architecture

QA

Control Library

PIT

Remote Assurance integration

And be versioned under /True North.

✔ End of WRAC_TRUE_NORTH_v0.1.md