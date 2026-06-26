# ISMS to PIT Entitlement Handoff Build-to-Green Evidence

Wave: `wave-isms-pit-entitlement-handoff-20260626`
Date: 2026-06-26
PR: #1861
Boundary authority: PR #1850, PR #1853, PR #1857
Canonical evidence host: `https://maturion-isms-portal.vercel.app`

## Defect addressed

The canonical ISMS to PIT journey could loop back to subscription after checkout because PIT selection and live dashboard entitlement state were not reliably aligned.

Expected journey:

```text
ISMS landing or modules card
  -> PIT marketing
  -> project-implementation checkout
  -> auth and onboarding
  -> dashboard shows PIT entitlement
  -> /pit/tracker opens
```

## Implementation scope

Changed implementation surfaces:

- `apps/isms-portal/src/pages/PITInfo.tsx`
- `apps/isms-portal/src/context/IsmsContext.tsx`
- `apps/isms-portal/src/hooks/useSubscriptionModules.ts`
- `apps/isms-portal/src/lib/entitlements.test.ts`

No PIT runtime implementation was changed.

## Build-to-green actions

1. PIT marketing CTA carries `project-implementation` into checkout.
2. ISMS subscription module data includes the PIT module option.
3. ISMS entitlement context syncs from completed checkout storage.
4. Regression tests cover PIT entitlement mapping and stored checkout state.

## Verification expectation

After deployment, browser evidence on the canonical ISMS host must show dashboard PIT entitlement and `/pit/tracker` access without subscription loopback.
