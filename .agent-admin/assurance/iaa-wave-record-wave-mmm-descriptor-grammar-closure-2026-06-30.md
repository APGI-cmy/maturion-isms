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
