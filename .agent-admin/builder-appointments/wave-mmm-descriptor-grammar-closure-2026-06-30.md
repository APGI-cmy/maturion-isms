# Builder Appointment — MMM Descriptor Grammar Closure

| Field | Value |
|---|---|
| Wave ID | `wave-mmm-descriptor-grammar-closure-2026-06-30` |
| Issue | #1871 |
| Module | MMM |
| Appointed Builder | `mmm-runtime-builder` |
| Appointed By | Foreman v2 |
| Appointment Status | Authorized for bounded implementation after this commit |

## Assignment

Implement the MMM Descriptor Grammar Closure fix so generated maturity descriptors reconstruct criterion wording into grammatically correct auditable evidence clauses before Basic, Reactive, Compliant, Proactive, and Resilient maturity-state wording is attached.

## Mandatory QA Inputs

Builder must work against:

- `modules/MMM/05-qa-to-red/descriptor-grammar-closure-qa-to-red.md`
- Issue #1871
- User examples from 2026-06-30 runtime screenshots

## Primary Implementation Boundary

Builder may modify:

- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`
- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`

## Conditional Extension Boundary

Builder may propose a justified extension to Supabase edge-function or descriptor-learning retrieval code only if necessary to prove that accepted descriptor corrections are reusable during future generation.

Any such extension must be narrow, explained in the builder output, and reviewed by Foreman before handover language is used.

## Required Behavioral Outputs

The implementation must prove:

1. `are to be clearly defined` becomes `are clearly defined` in evidence clauses;
2. `Assessing incentive schemes...` becomes `incentive schemes ... are assessed...`;
3. `should be`, `will be`, `shall be`, `must be`, and similar instruction phrasing are normalized into evidence-state phrasing;
4. criterion-specific actor/action/object wording is preserved;
5. accepted descriptor edits are either retrieved as generation examples or the current retrieval limitation is disclosed while deterministic grammar normalization covers the observed examples;
6. descriptor editing remains available after save until future explicit signoff lock.

## Prohibited Work

Do not modify:

- ISMS public journey routes;
- subscription, checkout, onboarding, dashboard, or module handoff logic;
- Level 1 / Level 2 / Level 3 signoff routes;
- Vercel workflows;
- PIT, Risk, RADAM, Systems Integration, or other module runtime;
- unrelated governance/gate repair.

## Build Discipline

- Start with executable tests for the issue #1871 examples.
- Keep implementation narrow.
- Do not use completion, handover, ready-for-review, merge-ready, released, or equivalent language until the lane allows it.
- Report any unavoidable scope expansion before making it.

## Delegation Order

This builder appointment follows the canonical IAA pre-brief commit and precedes any implementation commit.

The later implementation branch must record `.agent-admin/control/delegation-order.json` with strict SHA proof once the first implementation commit exists.
