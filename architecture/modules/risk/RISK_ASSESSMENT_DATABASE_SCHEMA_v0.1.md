# Risk Assessment Database Schema v0.1

## 1. Overview
This schema defines all tables required for full RA functionality, including:
- Threats
- Vulnerabilities
- Unwanted Events
- NIST scoring
- Quantification
- Controls
- Residual risk
- Workflow
- PIT integration

All tables include:
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

---

# 2. Core Tables

## 2.1 risk_assessments
Represents one assessment session for a process/lifecycle/facility.

Columns:
- id
- company_id
- org_node_id
- ra_type (baseline, issue_based, combined)
- status (draft, pending_approval, approved, closed)
- inherent_complete (bool)
- residual_complete (bool)
- quantification_method (ale, qualitative)
- created_by

---

## 2.2 unwanted_events
Generated from Threat × Vulnerability.

Columns:
- id
- risk_assessment_id
- threat_id
- vulnerability_id
- statement_text
- is_valid_pair (bool)
- rejected_reason (nullable)

---

# 3. NIST Scoring

## 3.1 nist_scores
Columns:
- id
- unwanted_event_id
- ttp_relevance_score
- likelihood_initiation (adversarial)
- likelihood_occurrence (non-adversarial)
- likelihood_adverse_impacts
- aggregated_likelihood_level (FK → ERM likelihood)
- aggregated_impact_level (initial impact before quantification)

---

# 4. Quantification

## 4.1 risk_assets
Columns:
- id
- unwanted_event_id
- asset_type
- asset_class
- asset_value
- exposure_rate
- single_loss_expectancy
- annual_rate_of_occurrence
- annual_loss_expectancy
- mapped_impact_level (FK → ERM impact)

---

# 5. Controls

## 5.1 existing_controls
Columns:
- id
- unwanted_event_id
- control_id (FK → control_library)
- control_design_effectiveness (1–5)
- control_implementation_effectiveness (1–3)
- control_efficacy_pct (0–90)

---

## 5.2 proposed_controls
Columns:
- id
- unwanted_event_id
- control_id
- justification
- predicted_efficacy_pct
- projected_likelihood_level
- projected_impact_level

---

# 6. Risk Calculations

## 6.1 inherent_risk
Columns:
- id
- unwanted_event_id
- likelihood_level_id (FK ERM)
- impact_level_id (FK ERM)
- heatmap_cell_id
- risk_band_id

---

## 6.2 residual_risk
Columns:
- id
- unwanted_event_id
- residual_likelihood_level_id
- residual_impact_level_id
- residual_heatmap_cell_id
- residual_band_id
- above_appetite (bool)

---

# 7. Workflow Tables

## 7.1 risk_approval_workflow
Columns:
- id
- unwanted_event_id
- current_step (custodian_review, owner_review, exco_review)
- required_roles
- approval_status
- approved_by
- approved_at

---

# 8. PIT Integration

## 8.1 risk_pit_link
Columns:
- id
- unwanted_event_id
- pit_project_id
- last_sync_at

