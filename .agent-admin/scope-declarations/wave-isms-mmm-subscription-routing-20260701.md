# Scope Declaration - ISMS MMM Subscription Routing Fix

Wave: `wave-isms-mmm-subscription-routing-20260701`
Date: 2026-07-01
Repository: `APGI-cmy/maturion-isms`
PR: #1884
Module lane: ISMS platform shell
Runtime owner: MMM
CS2 Authority: Johan Ras

## Objective

Fix the ISMS-owned Maturity Roadmap subscription/acquisition route so a non-entitled user selecting Maturity Roadmap does not enter the Project Implementation Tracker checkout flow.

## Boundaries

- ISMS owns the public marketing page, subscription module catalogue, checkout selection, onboarding, dashboard, and entitlement handoff.
- MMM owns MMM runtime after an entitled handoff.
- Do not implement MMM runtime, scoring, assessment, descriptor, evidence, or deployment behavior.
- Do not change PIT runtime or PIT routing.

## Allowed files

- `apps/isms-portal/src/pages/MaturityRoadmapInfo.tsx`
- `apps/isms-portal/src/hooks/useSubscriptionModules.ts`
- `modules/isms/11-build/isms-mmm-subscription-routing-fix-20260630.md`
- `.agent-admin/control/delegation-order.json`
- `.agent-admin/scope-declarations/wave-isms-mmm-subscription-routing-20260701.md`
- `.agent-admin/assurance/iaa-wave-record-wave-isms-mmm-subscription-routing-20260701.md`
- `.agent-admin/builder-appointments/wave-isms-mmm-subscription-routing-20260701.md`

RESULT: SCOPE_DECLARED
