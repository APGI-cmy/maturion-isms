# MMM QA-to-RED Addendum — Issue 1787 Descriptor Reconstruction

- **Module**: MMM
- **Stage**: 6 QA-to-RED Addendum
- **Issue**: #1787
- **Wave**: `mmm-dmc-descriptor-reconstruction-20260610`
- **Status**: RED definition artifact

## Purpose

This artifact defines the RED obligations for the global maturity descriptor reconstruction defect raised during CS2 live testing.

No runtime implementation may be marked complete until these RED conditions are turned GREEN with evidence.

## Test Catalog

### T-MMM-DMC-044 — Descriptors Must Globally Reconstruct Criteria Into Grammatical Evidence Sentences

- **Source**: Issue #1787; architecture addendum `issue-1787-descriptor-reconstruction-addendum.md`.
- **Layer**: Unit/component + operational UX review.
- **RED Condition**: Descriptor generation creates text by copying the full accepted criterion and appending Basic/Reactive/Compliant/Proactive/Resilient posture wording.
- **GREEN Acceptance**: For every generated criterion and every maturity level, descriptor text preserves the actor/action/object/context anchor but compiles it into one grammatical audit-evidence sentence. The output must not match the `criterion copy + level suffix` pattern.

### T-MMM-DMC-045 — Descriptor Reconstruction Must Preserve Contextual Clauses Without Awkward Paste Fragments

- **Source**: CS2 screenshot comparison, 2026-06-10.
- **Layer**: Unit/component.
- **RED Condition**: Criteria containing contextual clauses such as `especially during high risk / high exposure activities...` generate malformed descriptor text where the source clause is pasted into the descriptor without grammatical integration.
- **GREEN Acceptance**: Descriptor generation integrates contextual clauses into a readable sentence. Example class: the descriptor reads as one coherent sentence about leadership teams assessing security culture/adherence to protocols during high-risk/high-exposure activities, with the maturity-level evidence state attached naturally.

### T-MMM-DMC-046 — Learning Consent Must Trigger For Every Edited Descriptor Level

- **Source**: Issue #1787 live testing.
- **Layer**: Component.
- **RED Condition**: The Maturion learning prompt appears for Basic descriptor edits but does not appear when Reactive or later level editors are closed/saved after an edit.
- **GREEN Acceptance**: Basic, Reactive, Compliant, Proactive, and Resilient descriptor edits all enter the same learning-consent pathway. Closing or saving any edited level triggers the prompt when learning consent has not yet been captured for the edited level or criterion.

### T-MMM-DMC-047 — Descriptor Editing Must Remain Available Until Sign-Off

- **Source**: Issue #1787 live testing.
- **Layer**: Component + UX.
- **RED Condition**: After one descriptor edit/save/close, the same descriptor cannot be edited again even though second-level/final descriptor sign-off has not occurred.
- **GREEN Acceptance**: `Edit descriptor` remains visible and usable after save/close for every level until second-level/final descriptor sign-off locks the criterion. Multiple edits to the same descriptor are allowed before sign-off.

### T-MMM-DMC-048 — Descriptor Sign-Off Lock Must Be Explicit

- **Source**: Issue #1787 persistent-edit rule.
- **Layer**: Component + future sign-off integration.
- **RED Condition**: Descriptor editing disappears or locks without an explicit sign-off state, or remains editable after second-level/final descriptor sign-off.
- **GREEN Acceptance**: Before sign-off, descriptors remain editable. After sign-off, editing is locked with visible locked/sign-off state and approved descriptor text is preserved.

## Execution Mapping

Expected runtime/test surfaces:

```text
apps/mmm/src/components/assessment/CriteriaManagement.tsx
modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx
modules/MMM/tests/B4-framework/dmc-subject-knowledge-routing.test.ts
```

The builder may add a narrower descriptor-generation unit test file if needed, but test IDs above must be referenced in the evidence.

## Build-to-Green Gate

The wave remains RED until:

- T-MMM-DMC-044 through T-MMM-DMC-048 are implemented or explicitly mapped to existing passing tests;
- local/unit tests are run and reported honestly;
- CI status for the PR is inspected and recorded;
- Foreman QP confirms no hidden test debt or one-off criterion patching.
