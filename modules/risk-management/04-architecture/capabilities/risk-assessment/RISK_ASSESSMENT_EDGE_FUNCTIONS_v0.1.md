# Risk Assessment Edge Function Spec v0.1

Edge functions compute:

- Unwanted events
- NIST scores
- ALE
- Control efficacy
- Inherent & residual risk
- Appetite comparisons
- PIT export preparation

---

## 1. generate_unwanted_events(threats, vulnerabilities)
Loops all threat–vulnerability pairs:
- Reject illogical ones using NLP classifier
- Construct meaningful description
- Return list of unwanted events

---

## 2. compute_nist_scores(unwanted_event_id)
Steps:
- Check threat type (adversarial or non)
- Apply correct NIST scales
- Convert numeric to ERM likelihood levels
- Return aggregated likelihood & impact

---

## 3. calculate_ale(asset_value, exposure_rate, aro)
- SLE = asset_value × exposure_rate
- ALE = SLE × ARO
- Map ALE → impact level using ERM financial mapping

---

## 4. evaluate_controls(existing_controls)
- Look up control hierarchy value
- Compute design effectiveness factor
- Compute implementation factor
- Combine into efficacy % (capped at 90%)
- Apply remote assurance availability %
- Return final efficacy %

---

## 5. calculate_residual_risk(inherent, controls)
- New likelihood = inherent L × (1 - efficacy)
- New impact: adjust if controls reduce severity
- Map to ERM heatmap
- Compare to appetite

---

## 6. prepare_pit_export(unwanted_event_id)
Generates:
- Milestones
- Tasks
- Control implementation plan
- Risk context summary

