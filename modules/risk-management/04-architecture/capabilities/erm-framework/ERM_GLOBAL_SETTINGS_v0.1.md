# ERM Global Settings v0.1

## 1. Purpose

Define the global, company-level configuration for Enterprise Risk Management (ERM), which:

- Applies to the entire organisation hierarchy (group → company → division → site → department → process → component).
- Is inherited by all child organisational units.
- Provides a single source of truth for:
  - Risk categories
  - Scales (likelihood, impact)
  - Heatmap settings
  - Appetite & tolerance thresholds
  - Currency and financial conventions
  - Governance rules

Security Risk Management and all other risk domains (Safety, Operational, IT, etc.) must align with these settings.

---

## 2. Scope

These settings apply per **company** (or group) as the top-level ERM entity.

- Each **company** has its own ERM profile.
- All nodes inside the company’s hierarchy **inherit** this profile.
- ERM profiles are **isolated** between companies, but anonymised statistical data may be aggregated across companies for predictive analytics.

---

## 3. Core Concepts

### 3.1 Company ERM Profile

Each ERM profile includes:

- `company_id`
- `profile_id` (versionable)
- `profile_name`
- `effective_from`, `effective_to`
- `status` (draft, active, retired)
- `created_by`, `approved_by`

### 3.2 Inheritance

- ERM profile is defined at the **top node** of a company.
- All organisations in the hierarchy (children, grandchildren, etc.) use the same:
  - Likelihood scale
  - Impact scale
  - Heatmap grid
  - Appetite thresholds
  - Colour schemes
- Local units can add **context notes**, but cannot override the ERM definition.

---

## 4. Global Settings

The ERM profile must capture at least:

### 4.1 Currency & Financial Conventions

- `currency_code` (e.g. USD, BWP, ZAR)
- `monetary_format` (e.g. 1 234 567.89)
- `financial_reference_metric` (e.g. EBITDA, Revenue, Profit)
- `financial_reference_value` (e.g. annual EBITDA amount)
- Rationale: allows mapping ALE → impact classes.

### 4.2 Risk Categories

- List of risk categories (e.g. Security, Safety, Environmental, Operational, Financial, Reputational, IT/Cyber, HR/People).
- Each category has:
  - `category_id`
  - `name`
  - `description`
  - `is_security_specific` flag (for SRMF).

### 4.3 Time Horizon

Define default time horizons for risk assessments:

- `short_term` (e.g. 0–12 months)
- `medium_term` (e.g. 1–3 years)
- `long_term` (e.g. 3–10 years)

Used by risk assessments when scoring likelihood and impact.

---

## 5. Governance Rules

### 5.1 Single Unified Hierarchy per Company

- Each company has **one organisational risk hierarchy tree**.
- Nodes represent organisational units or logical risk aggregation points:
  - Example: Group → Company → Mine → Plant → Zone → Process → Component Interface.
- Operations are free to choose *what* they represent at each level, as long as hierarchy rules are respected.

### 5.2 Node Management (Parent / Child / Sibling)

At any node:

- `Add Child`: create a lower-level unit under current node (allowed with appropriate permissions).
- `Add Sibling`: create a same-level unit (allowed if user has peer modification permission).
- `Add Parent`: propose a parent above the current node (requires approval from that parent level).

### 5.3 Approval Rules

- Adding a **parent** requires approval from a user at that parent level (one level up).
- Adding a **child** or **sibling** may be auto-approved if the user has sufficient role rights, else requires escalation.

---

## 6. Conflict Detection Rules

The system must:

- Prevent circular hierarchies (no node may be its own ancestor/descendant).
- Prevent children under nodes designated as terminal (e.g. component interface node type).
- Prevent siblings at the root level when not allowed (e.g. only one “Group” node).
- Validate type compatibility (e.g. a “Component Interface” should not have children of type “Group”).
- Block changes that would orphan existing risk data without a valid parent.

Any blocked operation must:

- Provide a human-readable error.
- Log an audit record with attempted change, user, and reason.

---

## 7. AI-Assisted Hierarchy Mapping

The ERM system should support optional AI-assisted suggestions:

- Inputs:
  - Uploaded organograms (PDF, image, PPT)
  - Structured exports (CSV/XML) from HR or ERP systems
- AI proposes:
  - Node hierarchy
  - Node type suggestions (e.g. “this looks like a Mine”, “this looks like a Division”)
- Human must review and approve before import.

---

## 8. ERM Bundle Export

The system must support exporting an ERM bundle for each company, including:

- ERM Global Settings
- Likelihood scale
- Impact scale
- Heatmap config
- Appetite thresholds
- Risk matrix mapping
- Roles & responsibilities
- Node hierarchy outline (without sensitive risk data)
- Version metadata

Use cases:

- Sharing with auditors
- Backup and migration
- Replicating configuration to subsidiaries
- Using Security RM as the baseline ERM model in organisations that lack an ERM framework.

---

## 9. Security as a Sub-Framework

Security Risk Management must:

- Fully align with ERM scales and heatmap.
- Use ERM currency and financial reference.
- Roll up its risks into the same risk register, with `risk_category = Security`.
- Respect ERM-defined appetite and escalation thresholds.

---

## 10. Future Extensions (Placeholders)

- Multiple domain-specific overlays (Safety, Environmental, IT) that reuse ERM settings.
- Cross-company anonymised analytics (using only aggregated & non-identifying data).
- Multi-ERM-profile per holding group (when companies have entirely separate ERM philosophies).
