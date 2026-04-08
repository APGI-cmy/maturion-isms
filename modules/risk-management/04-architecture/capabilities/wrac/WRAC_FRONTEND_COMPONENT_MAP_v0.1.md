WRAC_FRONTEND_COMPONENT_MAP_v0.1.md

Workplace Risk Assessment & Control – Frontend Component Map
Version 0.1

Aligned to:

WRAC_TRUE_NORTH_v0.1 (this module’s system law)

WRAC_DATABASE_SCHEMA_v0.1

WRAC_EDGE_FUNCTIONS_v0.1

RISK_ASSESSMENT_TRUE_NORTH_v0.1 

RISK_ASSESSMENT_TRUE_NORTH_v0.1

CONTROL_LIBRARY_v0.1 

CONTROL_LIBRARY_v0.1

VULNERABILITY_MODULE_TRUE_NORTH_ARCHITECTURE_v0.1 (module layout & Foreman patterns) 

VULNERABILITY_MODULE_TRUE_NORTH…

Maturion_Build_Philosophy_v1.1 (UI/UX, AI & QA rules)

MATURION_TRUE_NORTH_v1.2 (AI routing, model selection, watchdog) 

MATURION_TRUE_NORTH_v1.2

0. Purpose

This document specifies the React frontend architecture for the WRAC & Control Management module:

Screens / routes

Page-level containers

Reusable components

State management boundaries

API wiring to WRAC Edge Functions

AI integration points (front office)

Admin/Foreman views (back office)

Foreman uses this map to:

Brief frontend Builder agents

Run front-end QA wiring checks

Detect legacy/unused components

All components must be:

Minimal in visual clutter

Maximal in information value and explainability

Consistent with Maturion styling and UX guidelines

1. Technology Stack & Layout

Frontend framework: React

Styling: TailwindCSS

Component library: ShadCN UI / internal Maturion components

Charts: Recharts (heatmaps, trend lines, stacked bars)

State:

React Query (server state, caching)

Local component state for filters/sort

Routing: React Router (or Next.js pages, depending on global architecture)

Auth: Supabase Auth (JWT)

API calls: via wracClient abstraction targeting /wrac/* edge functions

2. High-Level Navigation & Routes

Under the Risk Management → Risk Assessment section, WRAC introduces:

/risk/wrac — WRAC Workspace Layout

Default tab: [Risks]

Second tab: [Controls]

Third tab: [CCR & Live Risk]

Fourth tab: [Strategy]

Internally:

/Risk Management
  /Risk Assessment
    /WRAC
      ├─ [Tab] Risks (WRAC View)
      ├─ [Tab] Controls (Control-Centric View)
      ├─ [Tab] CCR & Live Risk
      └─ [Tab] Strategy & Exports

3. Layout Components
3.1 <WracWorkspaceLayout>

Purpose
Shell component for all WRAC tabs.

Responsibilities

Render navigation tabs: Risks, Controls, CCR & Live Risk, Strategy.

Provide:

Node selector (Company / Mine / Process / Facility)

Context banner with ERM profile & RA context

Global AI assistant entry point (WRAC help bot)

Manage shared filters that apply across tabs:

Architecture component filter

Threat category filter

Vulnerability category filter

Time range filter

Children

<WracRisksTab>

<WracControlsTab>

<WracCcrTab>

<WracStrategyTab>

API Integration

Uses /wrac/risks params for filters where relevant.

Uses RA Engine and ERM info for header context. 

RISK_ASSESSMENT_TRUE_NORTH_v0.1

4. WRAC – Risk-Centric View Components
4.1 <WracRisksTab>

Purpose
Main risk-centric WRAC table and interactions.

Layout

Top: quick filters and metrics bar.

Middle: table of risks.

Right: detail side panel (<WracRiskDetailPanel>) showing selected risk.

Child Components

<NodeSelector> (shared with other modules)

<WracFiltersBar>

<WracMetricsBar>

<WracRiskTable>

<WracRiskDetailPanel>

4.2 <WracFiltersBar>

Purpose
Filter strip across the top of WRAC.

Controls

Architecture component dropdown

Threat category dropdown

Vulnerability category dropdown

Appetite status chips: All / Above Appetite / Far Above

PUE toggle: Show only PUEs

Text search (risk description, ID)

Top-N selector: 10 / 20 / 50 / 100 / Custom

Wiring

Updates local filter state.

Triggers refetch of /wrac/risks with query params.

4.3 <WracMetricsBar>

Purpose
Top-level indicators summarising current filtered view.

Metrics

Total risks

Average inherent risk

Average residual risk

Average live risk

% above appetite

of PUEs
of risks in active mitigation strategies

Data Source

Derived from aggregated response of /wrac/risks (meta).

Optionally calls a dedicated /wrac/summary endpoint in future.

4.4 <WracRiskTable>

Purpose
Main WRAC grid (risk-centric).

Columns (visual)

Left (frozen):

Risk ID

Architecture Component

Unwanted Event (short sentence – truncated)

PUE badge

Risk states:

Inherent risk (badge + colour)

Residual risk (badge + colour)

Projected risk (badge + colour)

Live risk (badge + colour)

Financial & performance:

ALE (inherent, residual, projected) – collapsed into hover tooltip or stacked mini-bar

Remaining risk %

ROI %

Governance:

Appetite status (chip: Within / Above / Far Above)

Decision (Accept / Treat / Escalate)

Owner sign-off status (icon)

Custodian sign-off status (icon)

Actions:

View (opens side panel)

Add to strategy (opens strategy selection modal)

Behaviour

Single-row selection triggers <WracRiskDetailPanel> update.

Multi-select via checkboxes for bulk adding to strategy or export.

Sortable headers on risk metrics & ROI.

API

Uses data from GET /wrac/risks.

4.5 <WracRiskDetailPanel>

Purpose
Detailed view for a selected risk on the right-hand side.

Tabs

Overview

Controls & Contributions

Implementation & PIT

CCR & Monitoring

Appetite & Sign-Off

AI Explain

Key Elements by Tab

Overview

Full unwanted event description.

Threat + Vulnerability context (from RA Engine).

Heatmap chips for inherent/residual/projected/live.

Simple narrative explanation (from AI on demand, not auto).

Controls & Contributions

List of current controls and proposed controls.

For each control:

Name, type, domain (from Control Library). 

CONTROL_LIBRARY_v0.1

Design efficacy %

Implementation progress %

Operational performance %

Effective contribution to risk reduction.

Mini-bar or donut chart showing contribution distribution.

Implementation & PIT

Associated PIT projects and key milestones.

Gantt-style mini view (progress over time).

Links to open PIT project in PIT module.

CCR & Monitoring

List of critical controls.

CCR status (Green/Amber/Red).

Monitoring method (auto/manual/hybrid).

Evidence snapshots (checklist completions, system logs).

Appetite & Sign-Off

Appetite threshold vs actual risk (gauge).

Dropdown for Decision: Accept / Treat / Escalate.

Comment textarea.

Submit decision button → calls POST /wrac/risk/:risk_id/decision.

AI Explain

Explain this risk to a board member.

Explain why live risk is still high despite controls.

Suggest 3 possible mitigation bundles with ROI.

API

Data from GET /wrac/risk/:risk_id.

Decisions posted to /wrac/risk/:risk_id/decision.

AI prompts forwarded to /wrac/ai/risk-summary and /wrac/ai/strategy-suggestion.

5. Controls – Control-Centric View Components
5.1 <WracControlsTab>

Purpose
Main control-centric workspace.

Layout

Left: control filters + control list.

Middle: selected control list (basket).

Right: impact on risks.

Child Components

<WracControlFiltersBar>

<WracControlList>

<WracSelectedControlsPanel>

<WracControlImpactPanel>

5.2 <WracControlFiltersBar>

Filters

Control domain (e.g., CCTV, Access control, Recruitment, etc.).

Control type (Elimination, Engineering, Admin, etc.). 

CONTROL_LIBRARY_v0.1

Group (e.g., Surveillance controls, Detective controls).

Monitoring method (Auto / Manual / Hybrid).

CCR status filter (All / Critical only / Red only).

5.3 <WracControlList>

Purpose
List of controls (definitions and/or instances) filtered by <WracControlFiltersBar>.

Rows show:

Control name

Domain & type

of risks mitigated

Design efficacy %

Avg implementation progress %

Avg operational performance %

Overall control health indicator

Interactions

Checkbox per control to add to Selected Controls basket.

Click row to open <WracControlDetailDrawer> (similar to risk detail but for control).

API

Uses GET /wrac/controls.

5.4 <WracSelectedControlsPanel>

Purpose
Shows the basket of controls selected for scenario analysis or strategy proposals.

Features

List of selected controls, with ability to remove.

Summary metrics:

Total number of risks impacted

Estimated aggregate risk reduction (heatmap & ALE)

Estimated combined ROI

Action buttons:

Analyse impact → /wrac/controls/impact

Add all to strategy → opens strategy modal

5.5 <WracControlImpactPanel>

Purpose
Shows risk impact when certain controls are selected.

Visuals

Table of risks with “before” vs “after” for:

residual risk vs projected risk (with just the selected controls)

ALE change

ROI per risk.

Heatmap showing distribution of impacted risks.

Optional bar chart: risk_id vs risk_reduction_value.

API

Uses GET /wrac/controls/impact.

5.6 <WracControlDetailDrawer>

Purpose
Side drawer that opens when clicking a control in <WracControlList>.

Content

Control definition (from Control Library). 

CONTROL_LIBRARY_v0.1

All instances across nodes (if user has permission).

For each instance:

Node, CCR status, PIT project, progress, performance metrics.

Risk list impacted by this control.

AI suggestions:

How to improve performance.

How to prioritise implementation across sites.

6. CCR & Live Risk Components
6.1 <WracCcrTab>

Purpose
Dedicated page to view Critical Control performance and live risk behaviour.

Sections

CCR Summary Cards

critical controls Green / Amber / Red

% of risk reduction delivered vs design potential

Top 10 controls at risk

CCR Controls Table

A focused table of only critical controls with:

Health status

Availability

Faults/overrides

Linked risks and their live risk states

Live Risk Trend Chart

Graph of live risk level over time for:

Top N risks

Or a selected architecture component

Alerts Panel

CCR failures

Appetite breaches

Overdue PIT tasks affecting high risks

Components

<CcrSummaryCards>

<CcrControlsTable>

<LiveRiskTrendChart>

<WracAlertsPanel>

APIs

GET /wrac/controls?critical_only=true

GET /wrac/risks with top_n and date filter (if trend history tracked)

Potential dedicated /wrac/alerts endpoint later.

7. Strategy & Export Components
7.1 <WracStrategyTab>

Purpose
Workspace for:

Short/Medium/Long term strategies

Scenario planning

Exports to PIT and report generation

Sections

Strategy summary cards

Strategy list grouped by horizon

Selected strategy detail view

Child Components

<WracStrategySummaryCards>

<WracStrategyList>

<WracStrategyDetailPanel>

<WracExportPanel>

7.2 <WracStrategySummaryCards>

Metrics

short-term strategies
medium-term strategies
long-term strategies

Total risk reduction potential (ALE and score) by horizon

ROI band distribution

Data

Uses /wrac/strategy/group lists & /wrac/compute/strategy-metrics/:id.

7.3 <WracStrategyList>

Purpose
Lists all strategy groups for the node.

Grouping

Columns: Name, Type, # risks, # controls, total cost, total risk reduction, ROI.

Sections per type: Short / Medium / Long.

Actions

View → <WracStrategyDetailPanel>

Export to PIT → triggers /wrac/pit/export.

Export report → triggers /wrac/export/strategy.

7.4 <WracStrategyDetailPanel>

Purpose
Detailed breakdown of a single strategy bundle.

Layout

Left: list of risks in strategy with their before/after risk levels.

Middle: list of controls in strategy with implementation state.

Right: charts:

Planned vs actual mitigation

Timeline of implementation completion

ROI distribution

AI

Button: Summarise this strategy for ExCo

Calls /wrac/ai/strategy-suggestion in “summary” mode (no changes, just narrative).

7.5 <WracExportPanel>

Purpose
Provides export options for:

WRAC sheet

Strategy report

CCR report

Controls

Pick format (Excel / CSV / JSON / PDF).

Pick scope (current filters / full node / specific strategy).

“Generate export” → calls relevant /wrac/export/* function.

After generation:

Shows download link

Option: “Save to document store” or “Attach to meeting pack”.

8. Shared & Supporting Components
8.1 <NodeSelector>

Standardised across modules (uses organisation hierarchy).
Ensures WRAC filters always apply at the right hierarchy level.

8.2 <TopNSelector>

Reused in:

WRAC risk table

CCR tab

Strategy tab

Options: 10 / 20 / 50 / 100 / Custom.

8.3 <HeatmapBadge>

Displays:

Risk value (1–25 or custom scale).

Heatmap colour.

Level descriptor (Low, Moderate, Significant, High, Extreme).

Used in:

Risk table

Detail view

Strategy view

Configured using ERM heatmap config from ERM module.

8.4 <RoiBadge>

Shows ROI as:

% value

Band: Negative / Low / Medium / High / Exceptional.

Used in risk and control tables, strategy view.

8.5 <CcrStatusChip>

For CCR status: Green / Amber / Red, with explanation tooltip.

8.6 <AiAssistPanel>

Standard AI front-office component (per Build Philosophy). 

Maturion_Build_Philosophy_v1.1

Used in:

Risk detail

Control detail

Strategy detail

Behaviours

Takes context object (risk, control, strategy).

Offers pre-configured prompt buttons.

Sends requests to maturion-ai via WRAC AI endpoints.

Displays answer with copy-to-clipboard.

9. Admin & Backoffice Components (Foreman / QA)
9.1 <WracAdminDashboard>

Route

/admin/wrac or under global Admin → Risk.

Purpose

Dedicated backoffice QA & health view for WRAC.

Sections

Architecture wiring status (which WRAC edge functions responsive).

QA test coverage for WRAC (front-end and back-end).

List of failing QA checks.

Watchdog alerts specific to WRAC:

Missing live risk scores

PUE without Bowtie

Critical controls without CCR entries

Risks above appetite with no active strategy

APIs

QA & Watchdog endpoints (global, not WRAC-specific docs here).

10. Wiring & QA Expectations

Per Maturion Build Philosophy and Vulnerability module patterns:

Each component above must:

Have a route or higher-level container.

Have at least one QA test verifying:

It renders

It calls the correct WRAC edge function(s)

It handles loading, empty, and error states.

No “floating” components:

If a component is defined here, it must be wired and testable.

If something is built that isn’t declared here, it must either:

Be added to this map; or

Be safely removed.

Foreman uses this component map to:

Generate test scaffolding

Check for dead routes and unused components

Ensure alignment with WRAC_TRUE_NORTH_v0.1.md

11. Success Criteria (Frontend)

WRAC frontend is considered complete (v0.1) when:

All components listed here exist and are wired.

Filters, sorting, and selection behave as described.

Risk-centric and control-centric views cross-filter correctly.

Live risk and CCR states are reflected and understandable at a glance.

Strategy builder can assemble bundles and export them to PIT & reports.

AI assistance is available but never silently changes data or decisions.

Admin dashboard shows wiring, health, and QA status for WRAC.