# Control Library v0.1

## Purpose
Master library of all controls usable across organisations & risks.

---

## Control Structure
- control_id
- name
- description
- control_type (Elimination, Substitution, Engineering, Admin, PPE)
- domain (Security/Safety/etc.)
- default_design_score (1–5)
- default_implementation_score (1–3)
- default_efficacy_pct (max 90%)
- evidence_requirements
- typical_failure_modes
- cost_range
- suitable_for (risk types)

---

## Example Controls
- **Elimination**: Remove access to diamonds
- **Engineering**: Turnstiles, X-ray machines, SEID, biometrics
- **Admin**: Policies, Standard Procedures
- **PPE**: Body-worn tags (low efficacy)

---

## AI Integration
AI recommends controls based on:
- risk type
- threat model
- vulnerability type
- historical effectiveness
