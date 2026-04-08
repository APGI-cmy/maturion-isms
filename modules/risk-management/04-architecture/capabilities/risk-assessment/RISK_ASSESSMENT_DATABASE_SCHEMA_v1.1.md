Below is the complete, upgraded, and SRMF-aligned RISK_ASSESSMENT_DATABASE_SCHEMA_v1.1.md.

It incorporates:

Full ERM alignment (likelihood, impact, appetite, heatmap)

Threat v1.1 & Vulnerability v1.1 (TVRE, UE)

WRAC v1.1 integration (projected risk, ROI)

PIT v1.1 linkage (mitigation progress, dependency mapping)

Control Library v1.1 & Control Efficacy v1.1

Remote Assurance (future-ready)

Multi-company, multi-hierarchy architecture

AI-assisted fields (with audit logging)

Watchdog oversight fields

Versioning, immutability, and rollback

Zero Regression & One-Time Build doctrine

Place in your repo under:
/Modules/Risk Management/Risk Assessment/RISK_ASSESSMENT_DATABASE_SCHEMA_v1.1.md

RISK_ASSESSMENT_DATABASE_SCHEMA_v1.1.md

SRMF Risk Assessment Engine — Database Schema Specification
Version: 1.1
Prepared for: Maturion Integrated Security Management System (ISMS)
Purpose: Provide the authoritative database schema for all RA entities

0. ARCHITECTURAL PRINCIPLES

This schema follows the SRMF and Maturion architectural doctrines:

1. One-Time Build

No short-cuts, no tech debt accepted.

2. Zero Regression

All values are version-safe and immutable in historical context.

3. Multi-Company Segmentation (RLS)

Every record is tied to company_id.

4. Pipeline Stability

Threat → Vulnerability → UE → RA → WRAC → PIT → RA Live Dashboard.

5. AI-Safe Fields

All AI outputs stored in parallel staging tables.

6. Deterministic Computation

All scoring is rule-based, never probabilistic.

1. ENTITY MAP (HIGH-LEVEL)

The RA Engine uses 11 primary tables:

risk_assessment (RA core)

risk_likelihood_analysis

risk_impact_analysis

risk_ale_quantification

risk_control_assessment

risk_residual_risk

risk_projected_risk

risk_ra_workflow

risk_ra_history

risk_ra_ai_log

risk_ra_watchdog_event

Foreign tables referenced from other modules:

unwanted_event

vulnerability

threat

control_library

pit_project

wrac_row

architecture_node

erm_settings

2. FULL TABLE SCHEMAS
2.1 risk_assessment
(Master table for every RA record)
Field	Type	Description
id	UUID	Primary key
company_id	UUID	RLS
ue_id	UUID (FK)	UE being assessed
threat_id	UUID (FK)	Sourced from UE
vulnerability_id	UUID (FK)	Sourced from UE
architecture_node_id	UUID (FK)	Context of risk
ra_version	int	Incremented per recalculation
ra_state	enum(draft,pending,approved,archived)	Workflow state
created_by	UUID	User
updated_by	UUID	User
created_at	timestamp	
updated_at	timestamp	

Indexes:

(company_id, ue_id)

(architecture_node_id)

(ra_state)

2.2 risk_likelihood_analysis
Field	Type
id	UUID
ra_id	UUID (FK risk_assessment)
initiation_score	numeric(3,2)
occurrence_score	numeric(3,2)
adverse_impact_likelihood	numeric(3,2)
tvre_modifier	numeric(3,2)
drift_modifier	numeric(3,2)
inherent_likelihood_numeric	numeric(4,3)
inherent_likelihood_level	text
inherent_likelihood_descriptor	text
residual_likelihood_numeric	numeric(4,3)
residual_likelihood_level	text
projected_likelihood_numeric	numeric(4,3)
projected_likelihood_level	text
notes	text
created_at	timestamp
2.3 risk_impact_analysis
Field	Type
id	UUID
ra_id	UUID (FK)
impact_financial	numeric(14,2)
impact_safety	int
impact_environmental	int
impact_operational	int
impact_regulatory	int
qualitative_impact_level	text
ale_override_active	boolean
ale_mapped_impact_level	text
inherent_impact_numeric	numeric(4,3)
inherent_impact_level	text
residual_impact_numeric	numeric(4,3)
residual_impact_level	text
projected_impact_numeric	numeric(4,3)
projected_impact_level	text
created_at	timestamp
2.4 risk_ale_quantification
Field	Type
id	UUID
ra_id	UUID (FK)
asset_value	numeric(14,2)
exposure_rate	numeric(4,3)
aro	numeric(4,3)
ale_value	numeric(14,2)
ale_to_erm_impact_level	text
created_at	timestamp

ALE impact overrides qualitative.

2.5 risk_control_assessment

Contains all control-based calculations.

Field	Type
id	UUID
ra_id	UUID (FK)
existing_controls	jsonb
proposed_controls	jsonb
control_dependencies	jsonb
control_design_score	numeric(4,3)
control_implementation_score	numeric(4,3)
control_availability_score	numeric(4,3)
total_control_effectiveness	numeric(4,3)
projected_effectiveness	numeric(4,3)
estimated_cost	numeric(14,2)
estimated_cost_accuracy	int
created_at	timestamp
2.6 risk_residual_risk
Field	Type
id	UUID
ra_id	UUID
residual_risk_numeric	numeric(4,3)
residual_risk_level	text
residual_heatmap_color	text
within_appetite	boolean
created_at	timestamp
2.7 risk_projected_risk
Field	Type
id	UUID
ra_id	UUID
projected_risk_numeric	numeric(4,3)
projected_risk_level	text
projected_heatmap_color	text
projected_remaining_risk_pct	numeric(5,2)
projected_roi	numeric(6,3)
implementation_complexity	text
created_at	timestamp
2.8 risk_ra_workflow

Workflow transitions for each RA.

Field	Type
id	UUID
ra_id	UUID
previous_state	text
new_state	text
action_by	UUID
action	text
comment	text
created_at	timestamp
2.9 risk_ra_history

Full snapshot versioning.

Field	Type
id	UUID
ra_id	UUID
ra_version	int
snapshot	jsonb
created_at	timestamp

Snapshots store full RA structure immutably.

2.10 risk_ra_ai_log

AI assistance log.

Field	Type
id	UUID
ra_id	UUID
ai_task	text
input_hash	text
output_hash	text
model_used	text
confidence	numeric(4,3)
user_action	text
created_at	timestamp

Mandatory for SRMF auditability.

2.11 risk_ra_watchdog_event

Contains alerts generated by RA Watchdog Logic.

Field	Type
id	UUID
ra_id	UUID
rule_code	text
severity	enum(critical,high,medium,low)
message	text
details	jsonb
resolved	boolean
resolved_by	UUID
resolved_at	timestamp
created_at	timestamp
3. REFERENCE TABLES (EXTERNAL)
3.1 unwanted_event

(Sourced from Vulnerability Module)

3.2 erm_settings

Contains:

likelihood scale

impact scale

appetite bands

heatmap structure

risk color codes

3.3 control_library

Contains:

control type

hierarchy level

failure modes

cost

dependencies

3.4 pit_project

Contains:

implementation progress

budget

milestones

Used to update “real-time residual risk.”

4. DERIVED FIELDS & MATERIALIZED VIEWS
4.1 mv_risk_assessment_dashboard

For RA Live Dashboard.

Fields:

ra_id

ue_sentence

inherent risk

residual risk

projected risk

ROI

control progress

control availability

appetite flag

PUE flag

4.2 mv_risk_heatmap_by_node

Summarizes risk distribution across the architecture tree.

4.3 mv_risk_for_wrac

Feeds the WRAC table generation.

5. STATE MACHINE ENFORCEMENT (DB LEVEL)

Triggers enforce:

draft cannot be approved if fields missing

approved RA cannot be modified

version increment on any recalculation

snapshot store before state change

6. WATCHDOG HOOKS (DB LEVEL)

Triggers call:

ra_watchdog_likelihood_check()

ra_watchdog_impact_check()

ra_watchdog_control_check()

ra_watchdog_roi_check()

ra_watchdog_pit_integration_check()

ra_watchdog_matrix_consistency_check()

7. AI SAFETY

All AI-assisted fields must:

be stored in risk_ra_ai_log

pass structure validation

not override deterministic scores

never change severity or appetite rating

8. PERFORMANCE TARGETS

Single RA load < 150 ms

10k RA batch read < 2s

Recalc of a single RA < 200 ms

UE → RA creation < 120 ms

9. ACCEPTANCE CRITERIA

Database schema is complete when:

All tables implemented

All FKs valid

All triggers functional

All Watchdog rules active

All MV views generate correctly

Foreman signs off

✔ END OF RISK_ASSESSMENT_DATABASE_SCHEMA_v1.1.md