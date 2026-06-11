# MMM QA-to-Red Addendum — Issue 1797 Descriptor Reconstruction Restart

Module: MMM
Issue: #1797
Wave: mmm-dmc-descriptor-reconstruction-restart-20260611
Status: RED definition artifact

## Purpose

This addendum restarts the issue #1797 descriptor correction after PR #1788 was closed without merge due to unrelated gate-repair churn.

The scope is intentionally narrow: MMM DMC descriptor generation and descriptor editing only.

## RED Gates

### T-MMM-DMC-044R — Global Descriptor Sentence Reconstruction

RED condition: maturity descriptors are produced by copying the full accepted criterion and appending maturity-level posture text.

GREEN condition: every Basic, Reactive, Compliant, Proactive, and Resilient descriptor is reconstructed as one grammatical audit-evidence sentence that preserves criterion meaning without copying the full criterion verbatim.

### T-MMM-DMC-045R — Contextual Clause Integration

RED condition: criteria with contextual clauses such as `especially during high-risk / high-exposure activities` generate malformed pasted text.

GREEN condition: contextual clauses are integrated grammatically into the descriptor sentence.

Example target class:

```text
Evidence that Leadership teams assess security culture and protocol adherence during high-risk or high-exposure activities is absent, weak, outdated, inconsistent, fragmented, or person-dependent.
```

Exact wording may vary, but it must read naturally and preserve the criterion meaning.

### T-MMM-DMC-046R — Per-Level Learning Prompt

RED condition: learning consent is captured once per criterion, causing Reactive or later descriptor edits to skip the learning prompt after Basic was edited.

GREEN condition: learning consent is tracked per criterion and maturity level. Basic, Reactive, Compliant, Proactive, and Resilient edits can each trigger a learning prompt when that level has not yet been consented.

### T-MMM-DMC-047R — Repeat Editing Before Sign-Off

RED condition: after one descriptor save or close, the user cannot perform a second edit before second-level/final sign-off.

GREEN condition: edit controls remain available and usable after save/close until second-level/final descriptor sign-off locks the criterion.

### T-MMM-DMC-048R — Sign-Off Lock Seam

RED condition: editing disappears or locks without an explicit sign-off state.

GREEN condition: if formal sign-off state is not yet represented in runtime data, editing remains available and the future sign-off lock seam is documented/tested. Once sign-off state exists, editing must lock only after explicit second-level/final sign-off.

## Guardrails

- Do not modify live-dashboard workflows.
- Do not modify Vercel/deployment workflows.
- Do not create duplicate assurance records.
- Do not mix CI infrastructure repair into this product-fix PR.
- Keep Copilot, if used, as runtime builder only.

## Expected Build Surfaces

Primary runtime surface:

```text
apps/mmm/src/components/assessment/CriteriaManagement.tsx
```

Expected test surface:

```text
modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx
```

Additional narrow descriptor-specific tests may be added if cleaner.
