# RCA Operational Guidance (Tier 2)

## Purpose

Operational guidance for applying `governance/canon/ROOT_CAUSE_CORRECTIVE_ACTION_AGENT_CANON.md` in consumer-repo layer-down work without introducing unnecessary hard gating.

## Trigger Handling

- Mandatory triggers: execute RCA assessment and route corrective action.
- Optional triggers: use RCA only when it improves learning quality.
- Non-triggers: do not create RCA ceremony for clean or cosmetic-only reviews.

## Lowest-Effective-Layer Routing

Select the smallest correction layer that prevents recurrence:

1. Existing guidance (no new artifact)
2. Tier 2 guidance/checklist
3. Tier 2 discoverability pointer
4. Template update
5. Gate update (only for objective/repeatable failures)
6. Canon issue / contract review / product backlog (as required)

## Discoverability Pointers

- Canon source: `governance/canon/ROOT_CAUSE_CORRECTIVE_ACTION_AGENT_CANON.md`
- Local strategy reference: `Maturion/strategy/AGENT_ADVISOR_CONTINUOUS_IMPROVEMENT_STRATEGY.md`
- Templates:
  - `governance/templates/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT.template.md`
  - `governance/templates/IAA_RCA_REVIEW.template.md`
  - `governance/templates/RCA_HANDOFF_OR_ROUTING.template.md`

## Guardrail

Do not introduce a hard-blocking RCA gate unless explicit CS2 approval is provided after observed signal quality.
