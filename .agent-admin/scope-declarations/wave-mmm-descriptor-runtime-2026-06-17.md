# MMM Descriptor Runtime Wave Scope

Wave: `wave-mmm-descriptor-runtime-2026-06-17`
Date: 2026-06-17
Repository: `APGI-cmy/maturion-isms`
Module scope: MMM-only
Lane: implementation lane
CS2 Authority: Johan Ras
Foreman role: orchestration, governance sequencing, and review only
Builder role: appointed implementation only after IAA pre-brief

## Objective

Recover the MMM descriptor-runtime correction from current `main` without reusing polluted PR history.

The product objective is to correct descriptor generation and descriptor editing behavior in the MMM criteria management flow:

1. Generate coherent grammatical evidence sentences instead of mechanically joining criterion text and maturity-level descriptor text.
2. Integrate contextual qualifier sentences naturally where supported by the criterion text.
3. Trigger descriptor learning consent independently per maturity level.
4. Preserve descriptor editor availability after save unless a future explicit second-level sign-off lock is introduced.

## Bounded product file scope

Implementation file scope is limited to:

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

No deployment workflow, dashboard, PIT, CodeQL, shell, subscription, onboarding, or unrelated governance behavior is in scope for this wave.

## Pre-build and QA-to-red basis

The behavioral regression coverage for this wave is the MMM B4 framework domain-workflow behavior test file listed above. The builder must preserve the QA-to-red intent from the prior clean two-file attempt and build only against the bounded product behavior.

## Governance sequencing

This wave follows the PR #1800 Foreman v2 sequence:

1. wave scope/context record;
2. canonical IAA wave record with `## PRE-BRIEF` and `IAA_PREFLIGHT_BRIEF`;
3. separate builder appointment commit;
4. first implementation commit limited to the two product files;
5. delegation-order control recording strict commit SHA ordering.

## Lane constraint

This branch carries implementation-lane work only. It does not invoke later assurance or CS2 disposition stages in this commit.
