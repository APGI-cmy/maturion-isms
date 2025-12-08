📄 WRAC_DATABASE_SCHEMA_v0.1.md

Workplace Risk Assessment & Control — Database Schema
Version 0.1 — Fully Aligned with True North Architecture

0. Purpose

This document defines the complete logical and physical database schema for the WRAC & Control Management module, which sits downstream of:

Threat Module

Vulnerability Module

Risk Assessment Engine

Control Library

PIT (implementation tracking)

Remote Assurance (performance monitoring)

The schema ensures that the WRAC module:

Displays all risk states

Tracks control implementation and performance

Produces real-time risk values

Generates mitigation strategies

Supports reporting & export

Ensures governance, audit trails, and sign-off workflows

The schema must comply with:

Maturion True North Architecture

Build Philosophy (Architecture → QA → Build)

Uniform shared data models/standards

Supabase RLS

PostgreSQL constraints & performance principles

1. Data Model Overview

The WRAC module requires the following major entity groups:

A. Risk Entities

(Extends RA Engine risk outputs with WRAC-specific metadata)

B. Control Entities

(Instances, implementation, CCR, monitoring)

C. Relationships

(Risk → Controls, Controls → Risks, Strategies)

D. Monitoring & Operational Performance

(Real-time/Manual/Hybrid monitoring based on Remote Assurance architecture)

E. Workflow & Governance

(Sign-off, decisions, appetite outcomes, escalations, PUE flags)

F. Exports & Reporting

(PDF/HTML exports, WRAC snapshots, strategy exports)

2. Schema Definitions (Tables)

Below are the canonical tables.

2.1 wrac_risk_view

Purpose:
Stores WRAC-specific extensions to the RA Engine’s risk table.
This is NOT the RA source table — it references the RA Engine output.

Columns:

Field	Type	Description
id	uuid (pk)	WRAC record ID
risk_id	uuid (fk → ra_risks.id)	Link to RA Engine
node_id	uuid (fk → org_structure.id)	Company/Plant/Facility
pue_flag	boolean	Priority Unwanted Event
bowtie_required	boolean	Auto if pue_flag = true
appetite_threshold	integer	Risk level from ERM
appetite_status	text	"within" / "above" / "far_above"
decision	text	"accept" / "treat" / "escalate"
owner_signoff	boolean	Owner approval flag
custodian_signoff	boolean	Custodian approval flag
signoff_timestamp	timestamptz	Time of sign-off
strategy_short_term	boolean	Part of short-term plan
strategy_medium_term	boolean	Part of medium-term plan
strategy_long_term	boolean	Part of long-term plan
export_group_id	uuid	For grouping in WRAC/Strategy export
last_updated	timestamptz	Audit timestamp

Notes:

Inherent/residual/projected risk scores come from RA Engine → read-only here.

Appetite status is computed; stored for reporting.

Strategy flags control what goes into PIT export.

2.2 risk_control_map

Purpose:
Defines mapping of each risk to each control (proposed or existing).
This is the fundamental many-to-many table.

Columns:

Field	Type	Description
id	uuid pk	Mapping ID
risk_id	uuid fk	Risk reference
control_definition_id	uuid fk → control_library.id	Generic control
control_instance_id	uuid fk → control_instances.id	Site-specific instance
mitigation_weight	numeric	% contribution to mitigation
is_current_control	boolean	True if existing control
is_proposed_control	boolean	True if proposed
is_critical_control	boolean	For CCR classification
order_index	integer	UI ordering
created_at	timestamptz	Audit
updated_at	timestamptz	Audit

Notes:

mitigation_weight = proportion of total mitigation for that risk (optional; can be algorithmic).

control_instance_id is optional for high-level planning; required once PIT begins.

2.3 control_instances

Purpose:
Represents a specific, site-level design package derived from a Control Library definition.

Columns:

Field	Type	Description
id	uuid pk	Instance ID
control_definition_id	uuid fk → control_library.id	Generic control
node_id	uuid fk → org_structure.id	Site/facility
design_package	jsonb	Details: design docs, tiers, tech stack
monitoring_method	text	"automatic" / "manual" / "hybrid"
expected_availability	numeric	Target % (from design)
criticality	text	"critical" / "important" / "supportive"
created_by	uuid fk → users.id	
created_at	timestamptz	
updated_at	timestamptz	
2.4 control_implementation (PIT Integration)

Purpose:
Holds implementation progress so WRAC can calculate live risk.

Columns:

Field	Type	Description
id	uuid pk	
control_instance_id	uuid fk	
pit_project_id	uuid fk → pit_projects.id	
implementation_progress	numeric	0–1.00 (percentage)
expected_completion	date	
last_progress_update	timestamptz	
budget_allocated	numeric	
budget_spent	numeric	
status	text	"on_track" / "delayed" / "completed"
2.5 control_performance (Remote Assurance Integration)

Purpose:
Stores operational performance of controls (availability, correctness).

Integrates with:

Surveillance system uptime

Access control system health

Alarm monitoring reliability

Electronic checklist submissions

Manual inspection evidence

Columns:

Field	Type	Description
id	uuid pk	
control_instance_id	uuid fk	
data_source	text	"surveillance" / "access" / "alarm" / "manual"
availability	numeric	0–1.00
fault_count	integer	
override_count	integer	
monitoring_quality_factor	numeric	0.5 manual, 0.8 hybrid, 1.0 automatic
evidence	jsonb	e.g., logs, checklists, screenshots
period_start	timestamptz	
period_end	timestamptz	
updated_at	timestamptz	
2.6 control_ccr_status

Purpose:
Tracks CCR classification & performance effects on risk reduction.

Columns:

Field	Type	Description
id	uuid pk	
control_instance_id	uuid fk	
ccr_status	text	"green" / "amber" / "red"
reason	text	
last_verified	timestamptz	
next_due	timestamptz	
2.7 risk_live_scores

Purpose:
Stores computed real-time risk values from:

Design efficacy

Implementation completeness

Operational performance

Monitoring quality

Columns:

Field	Type	Description
id	uuid pk	
risk_id	uuid fk	
live_risk_score	numeric	1–25
live_risk_level	text	heatmap descriptor
live_ale	numeric	
drivers	jsonb	breakdown by control
updated_at	timestamptz	
2.8 wrac_strategy_groups

Purpose:
Groups controls or risks into short, medium, or long-term strategy bundles.

Columns:

Field	Type	Description
id	uuid pk	
node_id	uuid fk	
strategy_type	text	"short" / "medium" / "long"
created_by	uuid	
created_at	timestamptz	
2.9 wrac_strategy_items

Purpose:
Items (controls or risks) inside each strategy bundle.

Columns:

Field	Type	Description
id	uuid pk	
strategy_group_id	uuid fk	
item_type	text	"risk" / "control"
risk_id	uuid fk	
control_instance_id	uuid fk	
expected_risk_improvement	numeric	delta
expected_roi	numeric	
created_at	timestamptz	
2.10 wrac_signoff_log

Purpose:
Captures approval history and governance trail.

Columns:

Field	Type	Description
id	uuid pk	
risk_id	uuid fk	
action	text	"custodian_proposed" / "owner_approved" / etc.
actor_id	uuid fk → users.id	
comment	text	
timestamp	timestamptz	
2.11 wrac_exports

Purpose:
Stores exports of:

WRAC reports

Mitigation strategies

Control bundle reports

Evidence packages

Columns:

Field	Type	Description
id	uuid pk	
export_type	text	"WRAC" / "Strategy" / "CCR"
node_id	uuid	
exported_by	uuid	
file_url	text	
exported_at	timestamptz	
3. Computed Fields (Not Stored)

The following values are computed by Edge Functions, not stored:

projected_risk_score

projected_ale

remaining_risk_percentage

roi_value

aggregated_control_performance

weighted_control_mitigation

live_risk_score (before write-back to risk_live_scores)

4. Indexing Strategy

Index risk_control_map(risk_id)

Index risk_control_map(control_definition_id)

Index control_performance(control_instance_id)

Index control_implementation(control_instance_id)

Index risk_live_scores(risk_id)

Index wrac_risk_view(node_id)

Index wrac_signoff_log(risk_id)

All tables include implicit RLS partitions per company.

5. RLS Requirements

Users restricted to nodes they have access to.

Risk owners may approve only their risks.

Custodians may update only proposed controls and comments.

Remote Assurance may update performance tables.

PIT may update implementation tables.

No role except system may update RA Engine values.

6. Integration Summary
System	Reads	Writes
Threat Module	none	none
Vulnerability Module	none	none
RA Engine	WRAC reads inherent/residual/projected	none
Control Library	WRAC reads control definitions	none
PIT	WRAC reads progress	WRAC writes project submissions
Remote Assurance	WRAC reads performance	RA updates control_performance
Bowtie	WRAC reads bowtie_required	none
Reporting	WRAC provides exports	none
✔ End of WRAC_DATABASE_SCHEMA_v0.1.md