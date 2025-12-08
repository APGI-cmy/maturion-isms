# ERM Heatmap Configuration v0.1

## 1. Purpose

Define a fully customisable heatmap configuration for each company’s ERM profile, used to:

- Visualise risks based on likelihood and impact.
- Align Security RM, Safety RM and other domains to a single grid.
- Support different 3×3, 4×4 or 5×5 scales as required.

---

## 2. Grid Definition

Each ERM profile defines:

- `grid_rows` (typically 5)
- `grid_cols` (typically 5)
- `likelihood_levels` (list of level IDs ordered from lowest to highest)
- `impact_levels` (list of level IDs ordered from lowest to highest)

Example (5×5):

- Likelihood: Rare, Unlikely, Possible, Likely, Almost Certain
- Impact: Insignificant, Minor, Moderate, Major, Catastrophic

---

## 3. Cell Configuration

Each cell in the grid is defined by:

- `cell_id`
- `likelihood_level_id`
- `impact_level_id`
- `risk_score` (numeric; may be computed as L×I or custom)
- `risk_band` (e.g. Low, Medium, High, Extreme)
- `colour_code` (e.g. #00FF00, #FFFF00, #FFA500, #FF0000)
- `treatment_guidance` (e.g. “Monitor”, “Mitigate”, “Immediate action required”)
- `automatic_escalation` (boolean)
- `escalation_target_role` (e.g. “EXCO”, “Site Manager”, “Security Director”)

This allows full customisation per company.

---

## 4. Colour Schemes

The ERM profile may:

- Use a default colour palette (e.g. green → yellow → orange → red).
- Override colours for branding or legacy reasons.
- Store palette presets (e.g. “Standard”, “Corporate A”, “High-Contrast”).

---

## 5. Risk Bands

Risk bands group ranges of cells:

- `band_id`
- `name` (e.g. Low, Moderate, High, Extreme)
- `description`
- `min_score`, `max_score` (if risk_score numeric)
- `colour_code` (optional override)
- `default_treatment` (e.g. “Accept and monitor”, “Plan mitigation”, “Urgent mitigation”)

Security and other risk domains use the same band definitions.

---

## 6. Score Calculation Methods

The ERM profile should allow selecting:

- **Method A – L×I Product**  
  `risk_score = likelihood_index × impact_index`

- **Method B – Custom score matrix**  
  Each cell has a manually defined `risk_score`.

- **Method C – Hybrid**  
  Use L×I as base, but allow overriding specific cells (e.g. particular corners considered “Extreme” for compliance reasons).

The chosen method is stored as:

- `score_method` (A, B, or C)

---

## 7. Security-Specific Notes

The Security Risk Assessment module must:

- Use the ERM heatmap without modification.
- Place Security risks into the same grid as all other risks.
- Use the heatmap colour and banding for:
  - Inherent risk
  - Residual risk
  - Target residual risk (after additional controls).

---

## 8. UI Requirements

The configuration UI must:

- Render the full grid visually.
- Allow clicking a cell to configure:
  - Colour
  - Band
  - Score
  - Treatment guidance
  - Escalation flags
- Provide presets (e.g. “Standard 5×5 ISO-like heatmap”).
- Provide a “Preview” of how example risks would appear.

---

## 9. Versioning

Change to the heatmap configuration must:

- Create a new ERM profile version or sub-version, or:
- Log a configuration change with timestamp, user, and reason.

Risks assessed under old configurations must:

- Either retain their original classification, or:
- Be re-evaluated using a controlled, auditable process.

Implementation detail to be defined later in RA module design.

