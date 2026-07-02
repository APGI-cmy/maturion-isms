# Scope Declaration — MMM Descriptor Grammar Closure

| Field | Value |
|---|---|
| Wave ID | `wave-mmm-descriptor-grammar-closure-2026-06-30` |
| Issue | #1871 |
| Module | MMM |
| Scope Type | MMM-only descriptor runtime grammar closure |
| CS2 Authority | Johan Ras |
| Foreman Role | Scope, QA-to-red, delegation, and review orchestration only |
| Builder Status | Not yet implemented in this commit |

## Purpose

Close the remaining descriptor grammar gap before Level 1 / Level 2 / Level 3 signoff-route implementation proceeds.

Runtime observation shows that generated maturity descriptors still sometimes preserve criterion instruction phrasing or gerund starts in a way that reads like mechanical copy/paste rather than a reconstructed auditable evidence clause.

## User Examples To Drive QA

### RACI wording

Source criterion pattern:

> Security roles and responsibilities are to be clearly defined and presented in the form of a RACI chart...

Required Basic descriptor lead:

> Evidence that Security roles and responsibilities are clearly defined and presented in the form of a RACI chart is absent, weak, outdated, inconsistent, fragmented, or person-dependent.

### Incentive scheme wording

Source criterion pattern:

> Assessing incentive schemes and measures for their impact on Security;

Required Basic descriptor lead:

> Evidence that incentive schemes and measures are assessed for their impact on Security is absent, weak, outdated, inconsistent, fragmented, or person-dependent.

## Intended Product Boundary

Primary implementation files, if the builder proceeds:

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

Possible extension only if the builder proves that stored descriptor-learning events are not available to future generation:

- Supabase edge-function logic for `mmm-level-descriptor-save` or descriptor-learning retrieval.

Any such extension must be justified in the builder output and reviewed before widening scope.

## Explicit Exclusions

This wave must not implement or modify:

- ISMS public landing, marketing, subscription, checkout, onboarding, dashboard, or handoff routing;
- Level 1 / Level 2 / Level 3 signoff routes;
- Vercel workflow ownership;
- PIT, Risk Management, RADAM, Systems Integration, or other module runtime;
- general deployment, CodeQL, or unrelated gate repair.

## Required Product Outcome

Maturion must convert each criterion into a grammatically correct auditable evidence clause before maturity-level wording is attached.

The descriptor grammar layer must:

1. remove or normalize requirement wording that breaks evidence clauses, including `are to be`, `should be`, `will be`, `shall be`, `must be`, and similar phrasing;
2. convert gerund/action openings into evidence-state clauses where needed, for example `Assessing incentive schemes...` -> `incentive schemes ... are assessed...`;
3. preserve the actual criterion actor/action/object;
4. avoid replacing specific criteria with generic policy/control wording;
5. keep descriptor editing available until a future explicit signoff lock is implemented separately;
6. use accepted descriptor corrections as reusable generation examples if learning records are available.

## Governance Order

Implementation must follow the PR #1800 order:

IAA pre-brief -> builder appointment -> first implementation commit -> Foreman QP -> ECAP if required -> pre-handover -> IAA final -> CS2 review.

Retroactive delegation is invalid. This commit is scope declaration only and contains no implementation change.
