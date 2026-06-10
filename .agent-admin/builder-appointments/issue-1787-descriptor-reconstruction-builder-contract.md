# Builder Appointment — Issue 1787 Descriptor Reconstruction

Repository: APGI-cmy/maturion-isms
Module: modules/MMM
Issue: #1787
Wave ID: mmm-dmc-descriptor-reconstruction-20260610
Foreman: foreman-v2 governed orchestration
Builder class: ui-builder and qa-builder
Status: appointed after pre-build RED contract

## Authority

CS2 live testing identified a global descriptor-generation defect and authorized Foreman to proceed.

Pre-build authority:

- modules/MMM/04-architecture/issue-1787-descriptor-reconstruction-addendum.md
- modules/MMM/05-qa-to-red/issue-1787-descriptor-reconstruction-qa-to-red.md

## Builder Objective

Build issue #1787 to GREEN.

Maturity descriptor generation must reconstruct accepted criteria into grammatically correct audit-evidence sentences across all criteria, MPS rows, domains, source modes, and maturity levels.

This is a global correction. It must not be implemented as a one-off special case for the specific Leadership criterion shown during testing.

## Required Runtime Scope

Expected primary runtime file:

- apps/mmm/src/components/assessment/CriteriaManagement.tsx

The builder may add local helper functions or tests if needed, but must preserve existing DMC behavior outside the issue #1787 scope.

## Required QA Scope

The builder must add or update tests for:

- T-MMM-DMC-044
- T-MMM-DMC-045
- T-MMM-DMC-046
- T-MMM-DMC-047
- T-MMM-DMC-048

Expected test surfaces:

- modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx
- modules/MMM/tests/B4-framework/dmc-subject-knowledge-routing.test.ts

A narrower descriptor-specific test file may be added if that provides clearer evidence.

## Implementation Requirements

Descriptor sentence reconstruction:

- The descriptor must not be full criterion text plus a maturity suffix.
- The descriptor must preserve the criterion actor, action, object, and material context.
- Multi-clause criteria must be compressed into one readable auditable evidence clause.
- Contextual phrases such as especially during, where possible, and as applicable must be integrated grammatically.
- Explanatory Note, Guidance, and Reference material must not enter descriptor evidence clauses.
- The same validation must apply to AI-refined descriptors and deterministic fallback descriptors.

Learning consent:

- Learning consent must be triggered for any edited descriptor level where consent has not yet been captured.
- Basic, Reactive, Compliant, Proactive, and Resilient must use the same learning path.
- Closing or saving Reactive and later editors must not skip the prompt.

Persistent editing:

- Edit descriptor remains available after save or close until second-level or final descriptor sign-off.
- A user may edit the same level multiple times before sign-off.
- Sign-off lock must be explicit and visible when implemented.

## Prohibitions

- No one-criterion string replacement.
- No weakening of existing descriptor validation.
- No removal of learning or audit telemetry.
- No claimed test pass without honest execution or mapping.
- No hidden sign-off limitation. If sign-off state is not yet represented in runtime data, document the boundary and provide a future integration seam.

## Required Evidence For Foreman QP

- Files changed.
- Test IDs implemented or mapped.
- Local test command and result.
- CI status after PR creation.
- Remaining limitation, if any.
