# IAA Wave Record — MMM Descriptor Grammar Closure

| Field | Value |
|---|---|
| Wave ID | `wave-mmm-descriptor-grammar-closure-2026-06-30` |
| Issue | #1871 |
| Module | MMM |
| CS2 Authority | Johan Ras |
| Status | PRE-BRIEF ONLY |

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF

EXPECTED_QA_SCOPE:
- Verify that MMM descriptor generation reconstructs criterion wording into grammatically correct auditable evidence clauses before maturity-level state wording is attached.
- Verify the two CS2-observed runtime examples: RACI wording normalization and incentive-scheme gerund normalization.
- Verify instruction phrasing such as `are to be`, `should be`, `will be`, `shall be`, and `must be` is normalized into evidence-state phrasing.
- Verify criterion-specific actor/action/object wording remains visible and is not collapsed into generic policy/control wording.
- Verify accepted descriptor corrections are usable as generation examples where learning records are available, or deterministic grammar normalization covers the observed examples until retrieval is separately wired.
- Verify descriptor editing remains available until a future explicit signoff lock exists.

EXPECTED_FAILURE_MODES:
- Descriptor output preserves mechanical criterion copy/paste such as `Evidence that ... are to be clearly defined ... is absent`.
- Descriptor output begins with gerund wording such as `Evidence that Assessing incentive schemes...` instead of a reconstructed evidence clause.
- Descriptor output strips specific criterion context and replaces it with generic policy/control wording.
- Builder widens scope into ISMS public journey, subscription, onboarding, dashboard, entitlement handoff, signoff routes, Vercel workflows, PIT, Risk, RADAM, or other module runtime.
- Builder records descriptor learning events but does not prove how they influence future generation or disclose the retrieval gap.
- Builder reintroduces descriptor edit lockout before a future explicit signoff-lock state exists.

FOREMAN_INSTRUCTIONS:
- Keep this wave focused on issue #1871 and MMM descriptor grammar closure only.
- Do not permit implementation before canonical pre-brief and builder appointment are present in strict commit order.
- Require executable tests for the CS2 examples before accepting product runtime changes, unless the builder explicitly justifies a combined RED-to-GREEN commit for Foreman QP review.
- Treat any Supabase edge-function or descriptor-learning retrieval change as conditional scope expansion that requires builder justification.
- Do not use handover, complete, ready-for-review, merge-ready, released, or equivalent language until the relevant lane permits it.

IAA_WILL_QA:
- IAA will check that the wave remains inside MMM descriptor grammar closure scope.
- IAA will check that the QA-to-red expectations are traceable to executable tests or explicit builder evidence.
- IAA will check that descriptor grammar examples are corrected without losing criterion-specific meaning.
- IAA will check that governance order remains pre-brief -> builder appointment -> first implementation commit.
- IAA will check that any later implementation does not make signoff-route or ISMS boundary claims.

RESULT: PREFLIGHT_BRIEF_COMPLETE

### Scope

Focused MMM descriptor grammar closure before signoff-route implementation.

The wave addresses runtime maturity descriptor wording where Maturion still produces mechanical criterion-text concatenation instead of a grammatically reconstructed auditable evidence clause.

### Authority Inputs

- CS2 runtime screenshots and examples supplied by Johan Ras on 2026-06-30.
- Issue #1871.
- Scope declaration: `.agent-admin/scope-declarations/wave-mmm-descriptor-grammar-closure-2026-06-30.md`.
- QA-to-RED artifact: `modules/MMM/05-qa-to-red/descriptor-grammar-closure-qa-to-red.md`.
- Current PR #1800 Foreman v2 gate model.

### Product Risk

If this wave is skipped, the MMM criteria/descriptors layer may continue to look AI-generated and mechanically pasted, undermining audit confidence before the Level 1 / Level 2 / Level 3 signoff route is finalized.

The key quality risk is not descriptor coverage count; it is whether each descriptor reads like a defensible evidence state.

### Required Builder Boundary

Builder may work only on MMM descriptor runtime grammar closure.

Primary implementation boundary:

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

Potential extension requires explicit builder justification:

- Supabase edge-function or descriptor-learning retrieval logic, only if needed to prove usable learning examples.

### Prohibited Scope

Builder may not modify:

- ISMS public landing, marketing, subscription, checkout, onboarding, dashboard, or handoff routes;
- Level 1 / Level 2 / Level 3 signoff routes;
- Vercel workflow ownership;
- PIT, Risk Management, RADAM, Systems Integration, or other module runtime;
- deployment/gate repair outside this wave.

### RED Expectations

The builder must satisfy the QA-to-RED expectations for:

1. RACI wording normalization;
2. incentive-scheme gerund normalization;
3. instruction-word normalization;
4. criterion-specific actor/action/object preservation;
5. usable learning examples or deterministic grammar fallback proof;
6. continued descriptor edit availability until future explicit signoff lock.

### Governance Order Requirement

The first implementation commit must occur only after this pre-brief commit and the builder appointment commit.

Retroactive delegation is invalid. Same-commit prebrief/builder/implementation proof is not accepted under the current delegation-order gate.

### IAA Preflight Disposition

PRE-BRIEF ISSUED.

This artifact does not assert implementation completion, handover readiness, final assurance, or merge readiness.

## FINAL ASSURANCE

Not yet performed. Final IAA must be recorded only after builder implementation, Foreman QP, and any required ECAP/admin checks are complete.
