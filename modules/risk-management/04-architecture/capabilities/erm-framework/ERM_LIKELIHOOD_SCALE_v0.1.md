# ERM Likelihood Scale v0.1

## 1. Purpose

Define the company-specific **likelihood scale** used across all risk domains, including Security Risk Management. This ensures consistent interpretation of probability across the organisation.

---

## 2. Likelihood Level Structure

Each likelihood level includes:

- `likelihood_level_id`
- `order` (1 = lowest likelihood, N = highest)
- `name` (e.g. Rare, Unlikely, Possible, Likely, Almost Certain)
- `short_code` (e.g. L1, L2, L3, L4, L5)
- `description` (narrative definition)
- `frequency_range` (e.g. “Once every 10+ years”)
- `probability_range` (optional, e.g. “<5%”, “5–20%”)
- `example_scenarios` (for guidance)

---

## 3. Quantitative Mappings

The ERM likelihood scale should support:

- **Frequency-based mapping**  
  e.g.  
  - L1: once in >10 years  
  - L2: once in 5–10 years  
  - L3: once in 1–5 years  
  - L4: multiple times per year  
  - L5: daily/weekly.

- **Probability-based mapping** (optional)
  - L1: <1%
  - L2: 1–5%
  - L3: 5–20%
  - L4: 20–50%
  - L5: >50%

- **Custom mapping table** to align with NIST-like scales if needed.

These mappings are stored as part of the ERM configuration and referenced by the Risk Assessment engine.

---

## 4. Use in Security Risk Assessment

The Security Risk engine uses this likelihood scale to aggregate:

- Relevance of Threat Events (TTP relevance)
- Likelihood of Threat Event Initiation
- Likelihood of Event Occurrence (non-adversarial)
- Likelihood of Adverse Impacts (considered both in likelihood and impact aggregation, as per design)

The Risk Assessment module will define the exact aggregation logic, but all probability values map back to these ERM-defined likelihood levels.

---

## 5. Dynamic Updates and Data-Driven Adjustment

The ERM scale can be gradually refined by:

- Incident frequencies
- Near-miss data
- External threat intelligence
- Remote assurance indicators

When adjustments are made:

- Changes must be documented.
- A rationale must be recorded.
- Impact on previously assessed risks must be considered.

---

## 6. UI and Governance

- Only authorised ERM/Risk Governance roles may edit the likelihood scale.
- Changes require an approval workflow.
- A change log must be maintained.

---

## 7. Local Guidance for Users

Each level’s description should be clear and operational:

- “Rare”: Event has not occurred in the last X years and is not expected in normal circumstances.  
- “Likely”: Has occurred repeatedly in the last Y months and is expected to recur.

Security, Safety, and other domains can add **domain-specific examples** beneath each level to support training and internalisation, without changing the underlying scale.

