# Scope Declaration - ISMS to PIT Entitlement Handoff

Wave: `wave-isms-pit-entitlement-handoff-20260626`
Date: 2026-06-26
Repository: `APGI-cmy/maturion-isms`
PR: #1861
Module scope: ISMS-owned platform journey with PIT runtime handoff
Lane: implementation build-to-green
CS2 Authority: Johan Ras
Foreman role: orchestration, governance sequencing, and review only
Builder role: appointed implementation only after IAA pre-brief

## Objective

Fix the canonical ISMS to PIT entitlement handoff loop so an entitled user reaches `/pit/tracker` from the ISMS portal without being returned to subscription.

Expected canonical journey:

```text
ISMS landing or modules card
  -> PIT marketing
  -> subscription / checkout with project-implementation selected
  -> auth / onboarding
  -> dashboard shows PIT entitlement
  -> /pit/tracker opens for entitled user
```

## Bounded implementation scope

Allowed implementation files:

- `apps/isms-portal/src/context/IsmsContext.tsx`
- `apps/isms-portal/src/hooks/useSubscriptionModules.ts`
- `apps/isms-portal/src/pages/PITInfo.tsx`
- `apps/isms-portal/src/lib/entitlements.test.ts`

Allowed evidence file:

- `modules/isms/11-build/isms-pit-entitlement-handoff-build-to-green-20260626.md`

## Boundaries

- ISMS owns public acquisition, PIT marketing entry, subscription/checkout, auth/onboarding, dashboard entitlement state, and runtime handoff.
- PIT owns `/pit/tracker` runtime after entitlement handoff.
- Do not implement PIT runtime behavior.
- Do not change Supabase, payment, billing provider, Vercel workflow, deployment ownership, or unrelated module behavior.
- Do not turn `maturion-pit.vercel.app` into a duplicate public acquisition journey.

## Required RED-to-GREEN intent

- Non-entitled PIT users enter the ISMS-owned PIT subscription path.
- Completed PIT checkout produces a project-implementation entitlement.
- ISMS dashboard can see the completed PIT entitlement.
- Entitled users reach `/pit/tracker` without looping back to subscription.

## Governance sequence

1. Scope declaration and IAA pre-brief are recorded.
2. Builder appointment and Foreman delegation memory are recorded.
3. Builder implementation follows appointment.
4. Delegation-order control records strict sequencing.
5. Foreman/QP and IAA review follow implementation evidence.
