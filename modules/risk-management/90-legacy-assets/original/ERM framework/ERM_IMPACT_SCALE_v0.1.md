# ERM Impact Scale v0.1

## 1. Purpose

Define the **impact scale** used to express severity of consequences across all risk domains (Security, Safety, Environmental, Financial, etc.), including both:

- Quantitative (financial) impacts.
- Qualitative impacts (reputation, legal, people, environment).

---

## 2. Impact Level Structure

Each impact level includes:

- `impact_level_id`
- `order` (1 = lowest impact, N = highest)
- `name` (e.g. Insignificant, Minor, Moderate, Major, Catastrophic)
- `short_code` (I1–I5)
- `description`
- `financial_range` (linked to EBITDA or other metric)
- `people_impact` (e.g. injuries/fatalities descriptors)
- `reputational_impact`
- `operational_impact` (downtime, production loss)
- `legal_regulatory_impact`
- `environmental_impact`
- Example scenarios

---

## 3. Financial Mapping (Quantitative)

Impact level is mapped against financial impact, using the reference metric defined in ERM Global Settings (e.g. EBITDA):

Example:

- I1 (Insignificant): <0.1% of EBITDA
- I2 (Minor): 0.1–0.5% of EBITDA
- I3 (Moderate): 0.5–2% of EBITDA
- I4 (Major): 2–5% of EBITDA
- I5 (Catastrophic): >5% of EBITDA

These ranges are **company-specific** and must be configurable.

---

## 4. Non-Financial Dimensions

For each impact level, describe:

- **People**: No injury / first aid / medical treatment / permanent disability / fatalities.
- **Reputation**: Internal concern / local media / national media / international exposure.
- **Legal**: No breach / minor non-compliance / major non-compliance / regulatory action / license withdrawal.
- **Environment**: No damage / minor local / major local / regional / long-term extensive.

Security-focused risks (e.g. diamond theft, insider threat, sabotage) may impact multiple dimensions simultaneously.

---

## 5. Mapping from Quantified Risk to Impact Level

When a risk is **quantified** (ALE calculated):

- The ALE is mapped into one of the financial ranges.
- The corresponding Impact Level is selected as the primary impact indicator.
- Other dimensions (reputation, legal, environment) can lift the impact to a higher level if required (e.g. fatality always ≥ level 4).

The mapping rules must be:

- Explicitly documented.
- Consistent.
- Approved by ERM governance.

---

## 6. Use in Security Risk Assessment

Security Risk Assessment will:

- Use this impact scale when:
  - Quantitative impact is calculated (via ALE).
  - NIST assessment of adverse impact is performed.
- Recognise that **Likelihood of Adverse Impacts** contributes to both:
  - Overall likelihood (probability that the impact will fully materialise).
  - The classification of which impact **level** is appropriate (depending on depth of consequences).

The detailed rules will be captured in the Risk Assessment module specification.

---

## 7. Governance and Change Control

- Only ERM administrators can change impact level descriptions or thresholds.
- Changes require:
  - Justification
  - Approval workflow
  - Impact analysis on existing risk assessments

Historic risk records must maintain the impact level used at the time of assessment, or be re-evaluated using a formal process.

