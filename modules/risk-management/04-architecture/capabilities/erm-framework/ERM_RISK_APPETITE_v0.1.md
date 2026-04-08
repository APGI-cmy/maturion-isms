# ERM Risk Appetite v0.1

## 1. Purpose

Define the **risk appetite and tolerance** for the organisation, per company, to guide:

- What level of risk is considered acceptable.
- When mitigation is mandatory.
- When escalation to higher decision-making levels is required.
- How Security, Safety, and other domains interpret residual risk results.

---

## 2. Core Concepts

- **Risk Appetite**: The amount and type of risk an organisation is willing to pursue or retain.
- **Risk Tolerance**: The acceptable variation around an appetite level.
- **Risk Capacity**: Upper bound of risk the organisation can bear without threatening its survival (for reference only; not directly configured here).

---

## 3. Appetite Dimensions

Risk appetite may be defined in terms of:

- **Heatmap bands** (e.g. Low/Medium acceptable, High monitor, Extreme unacceptable).
- **Risk categories** (e.g. Zero appetite for fatalities, low appetite for diamond losses, moderate for minor operational delays).
- **Financial thresholds** (e.g. accept risks with ALE < X).
- **Compliance levels** (e.g. no appetite for breach of law or regulatory requirements).

---

## 4. Appetite Configuration Structure

For each **risk category** (e.g. Security, Safety, Environmental), allow:

- `category_id`
- `max_acceptable_band` (e.g. Medium)
- `zero_tolerance_conditions` (e.g. fatalities, child labour, human rights violations, systemic fraud)
- `treatment_mandatory_for_bands` (e.g. High and Extreme must have mitigation plans)
- `escalation_threshold_band` (e.g. Extreme must be reported to EXCO/Board)
- `monitor_only_band` (e.g. Low, Medium)

Additionally, allow a **global appetite setting** for all domains where needed.

---

## 5. Integration with Risk Assessment

The Risk Assessment module must:

- Compare **Residual Risk Band** to **Risk Appetite**:
  - If residual band ≤ max_acceptable_band: risk may be accepted (with monitoring).
  - If residual band > appetite: mitigation or transfer required.
- Mark risks exceeding appetite as:
  - `above_appetite = true`
  - Automatically flagged in dashboards.
  - Included in “Top Risks” views.

Security RM uses the same appetite logic, but may have more explicit rules (e.g. zero appetite for certain event types).

---

## 6. Escalation Rules

For risks exceeding appetite:

- Automatically determine:
  - Required approver role(s) (e.g. Risk Owner, Site Manager, EXCO)
  - Escalation path (local → regional → group)
- Support time-based escalation:
  - If risk remains untreated after N days, escalate to next level.

Escalation rules are configurable per company.

---

## 7. UI Guidelines

The ERM UI should:

- Show appetite overlay on the heatmap.
- Indicate which bands are:
  - Acceptable
  - Monitor
  - Unacceptable
- Allow simulations:
  - “What happens if we lower appetite for this category?”
  - “How many current risks would become above-appetite?”

---

## 8. Governance

- Appetite changes must be approved at appropriate governance level (e.g. EXCO or Board).
- Changes must be logged, versioned, and auditable.

