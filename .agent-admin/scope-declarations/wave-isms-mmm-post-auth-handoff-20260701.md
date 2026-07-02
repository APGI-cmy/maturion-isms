# Scope Declaration - ISMS MMM Post Auth Handoff Fix

Wave: `wave-isms-mmm-post-auth-handoff-20260701`
Date: 2026-07-01
Repository: `APGI-cmy/maturion-isms`
Module lane: ISMS platform shell
Runtime owner: MMM
CS2 Authority: Johan Ras

## Objective

Fix the ISMS post-checkout and mock sign-in route for the Maturity Roadmap journey so it continues to the MMM app host instead of generic ISMS onboarding.

## Boundaries

- ISMS owns checkout and mock auth routing.
- MMM owns MMM runtime after handoff.
- PIT runtime and PIT routing are out of scope.

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
