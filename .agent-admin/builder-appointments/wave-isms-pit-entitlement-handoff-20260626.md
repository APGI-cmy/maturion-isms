# Builder Appointment - ISMS PIT Entitlement Handoff

Wave: `wave-isms-pit-entitlement-handoff-20260626`
Date: 2026-06-26
Repository: `APGI-cmy/maturion-isms`
PR: #1861
CS2 Authority: Johan Ras
Appointed builder: `ui-builder`
Appointment status: `APPOINTED`

## Preconditions

IAA pre-brief is recorded in `.agent-admin/assurance/iaa-wave-record-wave-isms-pit-entitlement-handoff-20260626.md`.

## Builder task

Fix the canonical ISMS to PIT entitlement handoff loop so completed PIT checkout state is visible to the ISMS dashboard and entitled users can reach `/pit/tracker` without subscription loopback.

## Allowed files

- `apps/isms-portal/src/context/IsmsContext.tsx`
- `apps/isms-portal/src/hooks/useSubscriptionModules.ts`
- `apps/isms-portal/src/pages/PITInfo.tsx`
- `apps/isms-portal/src/lib/entitlements.test.ts`

RESULT: BUILDER_APPOINTED
