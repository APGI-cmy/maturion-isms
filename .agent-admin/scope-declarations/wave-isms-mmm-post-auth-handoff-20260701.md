# Scope Declaration - ISMS MMM Post-Auth Handoff Fix

Wave: `wave-isms-mmm-post-auth-handoff-20260701`
Date: 2026-07-01
Repository: `APGI-cmy/maturion-isms`
Module lane: ISMS platform shell
Runtime owner: MMM
CS2 Authority: Johan Ras

## Objective

Fix the ISMS-owned post-checkout/post-auth route for the Maturity Roadmap acquisition journey so a Maturity Roadmap-only checkout hands the user to the MMM app host instead of the generic ISMS onboarding flow.

## Observed defect

After PR #1884, the Maturity Roadmap marketing CTA correctly opens checkout with `modules=maturity-roadmap`, but completing mock checkout and sign-in still routes to `/onboarding` instead of the MMM app host.

## Boundaries

- ISMS owns marketing, subscription, checkout, mock auth, onboarding choice, and handoff routing.
- MMM owns MMM runtime after handoff.
- Do not implement MMM runtime, scoring, assessment, descriptor, evidence, or deployment behavior.
- Do not change PIT runtime or PIT routing.

## Allowed files

- `apps/isms-portal/src/components/auth/LoginForm.tsx`
- `apps/isms-portal/src/pages/SubscribeCheckout.tsx`
- `modules/isms/prebuild-harvest-package/isms-mmm-post-auth-handoff-alignment-20260701.md`
- `modules/isms/05-qa-to-red/isms-mmm-post-auth-handoff-qa-to-red-20260701.md`
- `modules/isms/11-build/isms-mmm-post-auth-handoff-build-to-green-20260701.md`
- `.agent-admin/control/delegation-orders/pr-1885.json`
- `.agent-admin/scope-declarations/wave-isms-mmm-post-auth-handoff-20260701.md`
- `.agent-admin/assurance/iaa-wave-record-wave-isms-mmm-post-auth-handoff-20260701.md`
- `.agent-admin/builder-appointments/wave-isms-mmm-post-auth-handoff-20260701.md`

RESULT: SCOPE_DECLARED
