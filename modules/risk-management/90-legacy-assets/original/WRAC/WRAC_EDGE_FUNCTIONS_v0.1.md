WRAC_EDGE_FUNCTIONS_v0.1.md

Workplace Risk Assessment & Control – Edge Function Specification
Version 0.1 — aligned with:

RISK_ASSESSMENT_TRUE_NORTH_v0.1 

RISK_ASSESSMENT_TRUE_NORTH_v0.1

MATURION_TRUE_NORTH_v1.2 (Supabase + Edge Functions + AI gateway) 

MATURION_TRUE_NORTH_v1.2

CONTROL_LIBRARY_v0.1 

CONTROL_LIBRARY_v0.1

Risk Management LRG (WRAC as final baseline output, 4-layer ORM)

Maturion Build Philosophy v1.1 (Architecture → QA → Build, wiring, watchdog) 

Maturion_Build_Philosophy_v1.1

0. Purpose

This document defines the Supabase Edge Functions required for the WRAC & Control Management module.

These functions:

Read risk outputs from the Risk Assessment Engine

Read control definitions from the Control Library

Read/write control instances, CCR status, performance, and implementation progress

Compute live risk values (design efficacy × implementation completeness × operational performance)

Compute ROI, remaining risk, and strategy metrics

Orchestrate PIT exports and report exports

Provide APIs for the WRAC UI (risk view + control view)

Enforce security, RLS, and watchdog monitoring as per Maturion True North

All WRAC logic must live in these functions or the RA Engine—not in the frontend.

1. Technology Stack & Conventions

Platform: Supabase Edge Functions (Deno/TypeScript)

Database: PostgreSQL (same cluster as RA Engine & PIT)

Routing:

/wrac/* namespace

Auth via Supabase JWT

AI:

All AI calls route via maturion-ai function (central AI gateway) as per True North model routing rules. 

MATURION_TRUE_NORTH_v1.2

Logging & Watchdog:

Each function writes to:

system_logs (success/failure, latency)

ai_logs (for AI-using endpoints)

Watchdog monitors for anomalies, cost spikes, and mis-wiring. 

Maturion_Build_Philosophy_v1.1

2. Function Overview (Categories)

WRAC edge functions are grouped by purpose:

Risk View Functions (WRAC / risk-centric)

Control View Functions (control-centric)

Computation & Metrics Functions (risk, ROI, CCR, live scores)

Strategy Functions (grouping, short/medium/long term)

Integration Functions (PIT, Remote Assurance, Bowtie)

Export Functions (WRAC sheets, strategy reports)

AI Assistance Functions (via maturion-ai)

Watchdog & QA Functions (consistency, cross-checks)

Each subsection specifies:

Function name (path)

Purpose

Inputs

Outputs

Triggers (REST / scheduled / event)

Security & RLS notes

3. Risk View Functions (WRAC)
3.1 GET /wrac/risks

Purpose
Fetches a paged, filterable list of risks for the WRAC risk table, including inherent, residual, projected, and live risk values, with appetite status.

Inputs (query params)

node_id (required)

Filters: architecture_component, threat_category, vulnerability_category, pue_only, above_appetite_only, control_group, search

Sorting: sort_by (e.g. live_risk_score, residual_risk_score, roi, pue_flag)

Pagination: page, page_size

Behaviour

Joins:

ra_risks (RA Engine output) 

RISK_ASSESSMENT_TRUE_NORTH_v0.1

wrac_risk_view

risk_live_scores

risk_control_map (for aggregated ROI and control data)

Computes or pulls:

inherent_risk_score, residual_risk_score, projected_risk_score

live_risk_score, live_risk_level, live_ale

appetite_status

aggregated roi_value (or defers to computation function – see 4.x)

Respects RLS (user only sees nodes they have access to).

Returns a JSON structure optimised for WRAC table.

Outputs

risks[] with:

IDs, descriptors, heatmap levels

PUE status, appetite status

Key numeric values (risk scores, ALE, ROI)

meta:

total, page, page_size

3.2 GET /wrac/risk/:risk_id

Purpose
Fetches full details for one risk (for side panel / detail view).

Behaviour

Pulls RA Engine fields, WRAC extensions, live scores, related controls, CCR status, PIT projects, strategy membership.

Does not use AI itself; this is raw data.

Outputs

risk object with:

RA data (threat, vulnerability, unwanted event, scoring inputs) 

RISK_ASSESSMENT_TRUE_NORTH_v0.1

All risk states (inherent/residual/projected/live)

Appetite, PUE, Bowtie flags

Control list:

For each control: design efficacy, implementation %, performance %, CCR status, contribution to mitigation.

PIT summary (projects, milestones, progress)

Strategy flags (short/medium/long-term).

3.3 POST /wrac/risk/:risk_id/decision

Purpose
Records risk owner’s or custodian’s decision and sign-off workflow.

Inputs (JSON)

decision ("accept" | "treat" | "escalate")

comment

role ("owner" | "custodian")

Behaviour

Validates that user is:

Owner → can approve or accept

Custodian → can propose and sign off from their side

Updates wrac_risk_view fields: decision, owner_signoff, custodian_signoff, signoff_timestamp.

Writes to wrac_signoff_log.

If decision = "treat" and appetite still above threshold → may trigger strategy builder or PIT export step (but not automatically commit).

4. Control View Functions (Control-Centric)
4.1 GET /wrac/controls

Purpose
Returns a list of controls with optional filters and aggregated impact metrics.

Inputs

node_id

Filters: domain, control_type, group_id, critical_only, monitoring_method, ccr_status

Optionally: risk_id to limit to controls on a specific risk.

Behaviour

Joins:

control_library (definitions) 

CONTROL_LIBRARY_v0.1

control_instances

control_implementation

control_performance

control_ccr_status

Computes:

Implementation completeness (from PIT)

Operational performance (Remote Assurance)

A simple Control Health Index = availability × monitoring_quality_factor × CCR factor

Aggregates:

Number of risks mitigated

Risk score impact across all risks

ROI across all risks (sum of avoided risk vs total cost)

4.2 GET /wrac/controls/impact

Purpose
Given a set of selected controls, returns the risks they mitigate and the combined impact.

Inputs (query or JSON)

control_instance_ids[] (required; or control_definition_ids[] for high-level view)

Optional node_id and filters.

Behaviour

Fetch all risk_control_map entries where control in selected set.

For each risk:

Recompute combined projected risk if only these controls are implemented (or use precomputed if available).

Compute combined ROI for these controls vs that risk.

Aggregate metrics:

Total number of risks impacted

Sum of risk reduction (by ALE and score)

Combined ROI.

Output

risks[] with before/after metrics

summary with aggregated metrics (for strategy builder and scenario analysis).

5. Computation & Metrics Functions
5.1 POST /wrac/compute/live-risk/:risk_id

Purpose
Computes and persists live risk score based on:

Design efficacy (RA Engine + Control Library)

Implementation progress (PIT)

Operational performance & monitoring quality (Remote Assurance)

Weighted contribution of each control (from risk_control_map)

Formula (conceptual)

For each control_instance linked to the risk:

effective_efficacy = design_efficacy × implementation_progress × availability × monitoring_quality_factor

Then:

Combine all effective_efficacy using your control hierarchy logic (no > 90% total, diminishing returns, etc.).

Recalculate likelihood and/or impact for the risk as RA Engine does:

live_likelihood = base_likelihood × (1 – combined_efficacy_factor)

Map to:

live_risk_score (heatmap cell)

live_risk_level (descriptor)

live_ale (if quantification present)

Behaviour

Writes result to risk_live_scores.

Optionally called:

On demand for one risk

By scheduled batch job (see 5.2).

5.2 POST /wrac/compute/live-risk/batch

Purpose
Scheduled background function to keep all live risk scores fresh.

Trigger

Scheduled (e.g. every 15 minutes or hourly).

Behaviour

Fetches all risks with:

Active controls

Active PIT projects

Or active control performance data

Streaming/batched computation of live risk for each (via same logic as 5.1).

Writes to risk_live_scores.

Logs performance metrics for Watchdog.

5.3 POST /wrac/compute/roi/:risk_id

Purpose
Computes ROI per risk for the bundle of proposed controls.

Inputs

risk_id

Optional override: selected_control_instance_ids[] (for scenario / what-if).

Conceptual formula

Using ALE from RA Engine 

RISK_ASSESSMENT_TRUE_NORTH_v0.1

:

risk_reduction_value = ale_residual – ale_projected

total_control_cost = sum(control_instance.design_cost or pit budget)

ro_si = (risk_reduction_value – total_control_cost) / total_control_cost

Behaviour

Reads RA Engine ALE values.

Reads cost from:

Control design / cost range (preliminary)

PIT budgets / quotations (accurate).

Calculates ROI and writes to:

wrac_risk_view (for convenience) and/or a separate metrics table.

5.4 POST /wrac/compute/strategy-metrics/:strategy_group_id

Purpose
Computes metrics for a strategy bundle (short, medium, long term).

Behaviour

For all risks & controls in the strategy group:

Sum expected risk reduction

Sum expected ROI

Sum costs

Aggregate timeline from PIT projects.

Returns metrics for use in UI and exports.

6. Strategy & Planning Functions
6.1 POST /wrac/strategy/group

Purpose
Create a strategy group (short/medium/long) for a node.

Inputs

node_id

strategy_type ("short" | "medium" | "long")

name (optional)

description

Behaviour

Creates record in wrac_strategy_groups.

Returns strategy_group_id.

6.2 POST /wrac/strategy/group/:strategy_group_id/items

Purpose
Add risks or controls to a strategy group.

Inputs

items[] each with:

item_type ("risk" | "control")

risk_id or control_instance_id

Behaviour

For each item, insert into wrac_strategy_items.

Optionally calls /wrac/compute/strategy-metrics/:strategy_group_id.

6.3 GET /wrac/strategy/group/:strategy_group_id

Purpose
Fetch complete detail for a strategy group (for strategy detail view).

Outputs

group meta

items[] with:

Risk/control details

Risk improvement & ROI (from computation)

7. Integration Functions
7.1 POST /wrac/pit/export

Purpose
Export selected controls / risks into PIT projects.

Inputs

node_id

strategy_group_id or explicit list of risk_id + control_instance_ids

project_type (e.g. "Baseline Risk Mitigation", "Bowtie Implementation")

Behaviour

For each risk/control:

Creates or updates PIT projects & tasks (via PIT API/edge functions). 

RISK_ASSESSMENT_TRUE_NORTH_v0.1

Links pit_project_id back into control_implementation.

Writes export event into wrac_exports.

7.2 POST /wrac/bowtie/trigger

Purpose
Trigger Bowtie setup for PUE risks.

Inputs

Either risk_id or filter: pue_only = true & above_appetite_only = true.

Behaviour

Marks bowtie_required = true on WRAC.

Calls Bowtie module edge function (future) to:

Create Bowtie RA context for that risk/unwanted event. 

Risk Management - LRG - APGI 1

Logs linkage for traceability.

7.3 POST /wrac/performance/ingest

Purpose
Ingest control performance data from Remote Assurance/Data Analytics.

Inputs

Array of records:

control_instance_id

data_source

availability

fault_count

override_count

monitoring_quality_factor

period_start, period_end

evidence (URL or JSON)

Behaviour

Writes into control_performance.

Optionally updates control_ccr_status based on thresholds.

Optionally triggers compute/live-risk/batch for impacted risks.

8. Export Functions
8.1 POST /wrac/export/wrac

Purpose
Generate an exportable WRAC sheet (Excel/CSV/JSON → PDF via front-end).

Inputs

node_id

Optional filters: same as WRAC view

Optional top_n (10 / 20 / 50 / 100 / custom)

Behaviour

Fetches all relevant risks and metrics from WRAC and RA.

Constructs a row-based structure similar to your Excel WRAC (LRG baseline WRAC format). 

Risk Management - LRG - APGI 1

Saves to storage; writes record to wrac_exports.

Output

file_url

export_id

8.2 POST /wrac/export/strategy

Purpose
Generate the risk mitigation strategy report, similar in structure to the final tables in the JUP RA report.

Inputs

strategy_group_id (or node_id + type)

Behaviour

Builds:

Narrative of methodology used

Table per control / control group showing all risks mitigated

Short/medium/long-term split

Planned vs actual graph inputs

Saves structure and returns file_url.

8.3 POST /wrac/export/ccr

Purpose
Generate a Critical Control Register export for audit and oversight.

Behaviour

Extracts all controls where is_critical_control = true.

Includes design vs implementation vs performance vs monitoring method.

Provides risk linkage.

Outputs CSV/Excel-compatible data.

9. AI Assistance Functions (via maturion-ai)

Note: these are call patterns, not standalone servers. All go through maturion-ai as mandated by True North. 

MATURION_TRUE_NORTH_v1.2

9.1 POST /wrac/ai/risk-summary

Purpose
Generate a plain-language explanation of a specific risk or a set of risks.

Inputs

risk_id (or array)

Desired tone ("board", "technical", "supervisor")

Behaviour

Calls maturion-ai with:

RA data + WRAC data + control status

Instruction template

Returns text for UI display or email draft.

9.2 POST /wrac/ai/strategy-suggestion

Purpose
Suggest a short/medium/long-term control bundle for a set of risks.

Inputs

node_id

Optional filters (risks above appetite, PUEs, etc.)

Optional constraints (budget, time horizon)

Behaviour

Gathers risk and control data.

Asks AI to propose:

Which controls belong in which time bucket

Rationale

Priority ordering.

Human must review & confirm before committing to strategy.

10. Watchdog & QA Hooks
10.1 POST /wrac/qa/check-wiring

Purpose
QA-only function to verify that all declared WRAC edge functions and integrations exist and are wired to the right tables and foreign keys (Build Philosophy wiring checks). 

Maturion_Build_Philosophy_v1.1

Checks

Every RA risk in scope has a WRAC record.

Every WRAC risk above appetite has:

Either strategy or explicit “accept” → else flag.

Every critical control has:

Control instance, CCR status, implementation record.

PIT exports: all referenced pit_project_id actually exist.

Remote Assurance: all control_performance entries refer to valid control instances.

10.2 POST /wrac/qa/check-consistency

Purpose
Detect logical inconsistencies, e.g.:

PUE flagged but no Bowtie requirement.

Control with high design efficacy but 0 monitoring quality.

Risk with projected risk still above appetite but no escalation.

11. Security, RLS & Permissions

All functions:

Use Supabase JWT to identify user & org.

Enforce node-based RLS: user only sees and modifies risks/controls under nodes they have access to.

Enforce role constraints:

Only risk owners can sign off.

Only custodians can propose controls.

Only Remote Assurance role can push performance data.

Only PIT role can push implementation updates.

12. Error Handling & Resilience

All functions return standard error envelope:

error_code, message, details

Critical errors logged to Watchdog with:

Function name

Context (risk_id, control_instance_id)

User id

No partial updates: multi-step operations wrap in DB transaction where appropriate.

13. Success Criteria (Edge Layer)

The WRAC Edge Function layer is “done” when:

All functions above exist, are wired, and pass QA wiring checks. 

Maturion_Build_Philosophy_v1.1

Live risk scores update correctly on schedule and on demand.

Controls can be selected and mapped to all mitigated risks.

Strategy bundles can be created, computed, exported, and pushed to PIT.

CCR integration correctly adjusts live risk when controls fail.

Exports match the conceptual structure of your WRAC and mitigation tables (LRG & JUP RA).