# ERM Risk Matrix v0.1

## 1. Purpose

Define the **mapping logic** between:

- Likelihood levels
- Impact levels
- Risk scores
- Risk bands

This document ties together ERM_LIKELIHOOD_SCALE, ERM_IMPACT_SCALE, and ERM_HEATMAP_CONFIG.

---

## 2. Basic Structure

For each ERM profile, the risk matrix is defined as:

- `likelihood_level_id` (row)
- `impact_level_id` (column)
- `risk_score` (numeric)
- `risk_band_id`

This information directly feeds the heatmap cell configuration.

---

## 3. Matrix Construction Methods

### 3.1 Method A – Derived from L×I

- Likelihood levels are given indices (e.g. 1–5).
- Impact levels are given indices (e.g. 1–5).
- `risk_score = L_index × I_index`.
- Risk bands defined by score ranges.

### 3.2 Method B – Manually Configured Matrix

- Each cell is individually written with:
  - Risk score
  - Band (Low/Medium/High/Extreme).
- Allows non-linear mapping (e.g. some cells in mid-zone considered High because of ERM requirements).

### 3.3 Method C – Hybrid

- Start from Method A.
- Override specific cells with custom scores or bands.

The chosen method is stored in ERM_GLOBAL_SETTINGS or here as `matrix_method`.

---

## 4. Integration with Appetite

- Risk bands are linked to appetite thresholds (see ERM_RISK_APPETITE_v0.1).
- Each band should indicate:
  - Default treatment requirement.
  - Appetite compatibility.

---

## 5. Integration with Risk Assessment

The Risk Assessment engine will:

- Calculate aggregated likelihood and impact levels for each risk.
- Use this matrix to:
  - Determine risk score.
  - Determine risk band.
  - Place the risk in the correct heatmap cell.
- Apply this both for:
  - Inherent risk (before controls).
  - Residual risk (after controls).
  - Projected residual risk (after proposed controls).

---

## 6. Governance & Change Control

- Changes to the matrix must not be taken lightly.
- Any modification:
  - Must be documented and justified.
  - Requires ERM governance approval.
  - May require re-evaluation of certain key risks.

