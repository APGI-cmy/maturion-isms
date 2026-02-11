# DOMAIN OWNERSHIP ACCOUNTABILITY

## Status
Canonical Governance Law  
Version: v1  
Authority: Governance  
Applies To: Responsibility Domains, Architecture Governance

---

## 1. Purpose

This document defines how responsibility domains are held accountable
for architectural completeness and build correctness over time.

Accountability is assigned to domains — not individuals.

The purpose is to:
- Detect weak or overloaded domains
- Drive governance and architecture improvement
- Quantify whether the system is being built better over time

---

## 2. Core Principles

1. Domains are accountable for failures attributed to them
2. Accountability is evidence-based, not opinion-based
3. Improvements do not penalize domains
4. Failures reduce domain effectiveness
5. Repeated failures trigger governance intervention

---

## 3. Domain Ownership Definition

Each responsibility domain MUST declare:

- Domain Owner (governance role, not person)
- Review Authority (usually Foreman)
- Accountability Scope (what the domain is responsible for)

This information is declared in the Responsibility Domain Registry.

---

## 4. Failure Attribution Rules

Each failure record MUST include domain attribution.

### Required Field in Failure Record
ATTRIBUTED_DOMAIN: <DOMAIN_NAME>

yaml
Copy code

Rules:
- Exactly one domain must be attributed
- If multiple domains are involved, attribution MUST be MIXED and escalated
- Ambiguous attribution is a governance violation

---

## 5. Domain Effectiveness Metrics

Each domain has an effectiveness score computed over time.

### Initial State
- `DOMAIN_EFFECTIVENESS: 100`

### Degradation Rule
For each failure attributed to the domain:

- Deduct `PENALTY_POINTS` from the domain’s effectiveness

Improvements do not affect this score.

Effectiveness is bounded:
- Minimum: 0
- Maximum: 100

---

## 6. Required Domain Metrics (Normative)

Governance MUST track the following per domain:

### 6.1 Failure Count
- Total failures attributed to the domain

### 6.2 Distinct Failure Signatures
- Number of unique failure signatures
- Used to detect structural weaknesses

### 6.3 Governance Escalation Count
- Number of failures requiring governance updates

### 6.4 Domain Effectiveness Score
- Current effectiveness value (0–100)

### 6.5 Trend Direction
- Improving / Stable / Degrading

---

## 7. Thresholds & Mandatory Actions

### 7.1 Degradation Threshold
If a domain’s effectiveness drops below:
- **80** → Mandatory domain review
- **65** → Domain split evaluation REQUIRED
- **50** → Domain declared structurally unfit

### 7.2 Failure Density Threshold
If a domain accumulates:
- More than 3 distinct failure signatures → Review required
- More than 5 → Split or redesign REQUIRED

---

## 8. Governance Actions

When thresholds are crossed, governance MUST perform one or more of:

- Architecture checklist refinement
- Domain scope reduction
- Domain split
- CI gate strengthening
- Builder contract adjustment

No silent remediation is permitted.

---

## 9. Reporting Cadence

Governance MUST produce:
- Per-build domain effectiveness snapshot
- Cross-build historical trends

These reports are governance artifacts, not runtime telemetry.

---

## 10. Precedence

This policy supersedes:
- Informal assessments
- Anecdotal evidence
- Builder explanations

Only recorded failures and governance artifacts are authoritative.

---

End of DOMAIN OWNERSHIP ACCOUNTABILITY
