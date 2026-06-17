# MMM Descriptor Runtime Build Appointment

Wave: `wave-mmm-descriptor-runtime-2026-06-17`
Date: 2026-06-17
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-descriptor-runtime-clean`
CS2 Authority: Johan Ras

## Scope

This appointment covers only the MMM descriptor-runtime correction described by the wave scope record and IAA pre-brief.

Allowed product files:

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

## Work package

Implement the descriptor sentence reconstruction and per-level descriptor learning behavior from the clean PR #1798 product diff.

The work must preserve MMM B4 framework behavioral coverage for:

- contextual qualifier descriptor sentence reconstruction;
- independent Basic and Reactive prompt triggering;
- descriptor editing after save.

## Boundary

Do not include workflow, deployment, dashboard, PIT, CodeQL, shell, subscription, onboarding, unrelated module, or later-lane assurance files in the implementation commit.

## Evidence requested

Record changed files, behavior changed, test command, observed result, and any unrun-test disclosure.
