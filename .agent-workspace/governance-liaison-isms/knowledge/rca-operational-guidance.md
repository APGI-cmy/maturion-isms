# RCA Operational Guidance (Tier 2)

## Purpose

Operational guidance for applying `governance/canon/ROOT_CAUSE_CORRECTIVE_ACTION_AGENT_CANON.md` in consumer-repo execution without turning clean delivery into mandatory ceremony.

## Trigger and Non-Trigger Checklist

### RCA is Required

- Substantive `REQUEST_CHANGES` from CS2 or appointed advisor.
- Required CI gate fails after handover/merge-ready/ready-for-review/complete claim.
- Handover claim gate posts `HANDOVER BLOCKED`.
- Same failure class repeats in one PR after attempted correction.
- Same failure class repeats across two PRs in same workflow/project area.
- IAA verdict is `FAIL`, `ADMIN_ONLY`, or `PARTIAL_FUNCTIONAL_DELIVERY` where full delivery was expected.
- ECAP detects stale evidence after final push or handover claim.
- Gate is stale, paradoxical, over-broad, or under-enforcing.
- CS2 explicitly posts `RCA_REQUIRED`, `ROOT_CAUSE_REQUIRED`, or `CONTINUOUS_IMPROVEMENT_REQUIRED`.

### RCA is Optional

- CS2 requests learning capture even when wave can proceed.
- Repeat-risk is emerging but not yet severe.
- Discoverability/guidance ambiguity contributed to avoidable friction.

### RCA is Prohibited

- Clean PRs with no meaningful failure signal.
- Typo/wording-only cleanup.
- Normal first-pass comments already covered by existing guidance.
- Straightforward gate failure where existing standards already prescribe the fix.

## Failure Classification Taxonomy

Use one primary class and optional secondary classes:

1. Knowledge / guidance gap
2. Role-boundary violation
3. Admin evidence failure
4. Gate correctly blocked
5. Gate logic gap
6. Gate false-positive / over-broad
7. Product behavior failure
8. IAA assurance quality failure
9. ECAP stale-evidence failure
10. Discoverability/index failure
11. Canon conflict
12. Tooling limitation
13. Product backlog gap

## Lowest-Effective-Layer Routing Matrix

Select the minimal corrective layer that prevents recurrence:

1. Existing standard application (no system change)
2. Tier 2 guidance/checklist clarification
3. Tier 2 discoverability/index pointer update
4. Template update
5. Gate update (objective/repeatable failures only)
6. Canon issue or agent-contract review
7. Product backlog implementation item

## Foreman Orchestration Guidance

- Foreman classifies invocation as mandatory/optional/prohibited before assignment.
- Foreman routes RCA assessment ownership; RCA output is routing intent, not remediation completion.
- Foreman assigns implementation owner (builder/specialist/governance liaison/ECAP/CodexAdvisor) based on selected layer.
- Foreman tracks recurrence-prevention proof to closure.

## IAA RCA Review Guidance

- Mandatory RCA invocations require IAA review using `governance/templates/IAA_RCA_REVIEW.template.md`.
- `RCA_REVIEW: REFER_BACK` is blocking for RCA closure.
- IAA confirms root cause quality, layer selection, anti-burden compliance, and recurrence prevention.

## ECAP Interaction Guidance

- If trigger involves stale evidence or handover-state mismatch, RCA must include ECAP artifact references.
- RCA routes evidence correction to ECAP/ceremony owner and verifies refreshed current-head evidence before closure.

## Builder / Specialist Handoff Guidance

- For product or code corrections, RCA produces routing package using `governance/templates/RCA_HANDOFF_OR_ROUTING.template.md`.
- Handoff must name owner, target artifacts, regression obligations, and due signal.

## Discoverability Pointers

- Canon source: `governance/canon/ROOT_CAUSE_CORRECTIVE_ACTION_AGENT_CANON.md`
- Local strategy reference: `Maturion/strategy/AGENT_ADVISOR_CONTINUOUS_IMPROVEMENT_STRATEGY.md`
- Templates:
  - `governance/templates/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT.template.md`
  - `governance/templates/IAA_RCA_REVIEW.template.md`
  - `governance/templates/RCA_HANDOFF_OR_ROUTING.template.md`

## Guardrail

Do not introduce a hard-blocking RCA gate unless explicit CS2 approval is provided after signal-quality observation.
