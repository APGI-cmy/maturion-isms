# Scope Declaration - PIT Host Policy Redirect

Wave: `wave-pit-host-policy-redirect-20260626`
Date: 2026-06-26
Repository: `APGI-cmy/maturion-isms`
Module scope: ISMS-owned platform host policy with PIT deployment host boundary
Lane: implementation build-to-green
CS2 Authority: Johan Ras
Foreman role: orchestration, governance sequencing, and review only
Builder role: appointed implementation only after IAA pre-brief

## Objective

Resolve remaining PIT-RED-BND-007 by preventing `maturion-pit.vercel.app` from acting as a duplicate public ISMS acquisition surface.

## Required host behavior

```text
maturion-pit.vercel.app/*
  -> https://maturion-isms-portal.vercel.app/*
```

The redirect must preserve path, query string, and hash so deep links such as `/pit/tracker` become canonical ISMS-host links.

## Bounded implementation scope

Allowed implementation files:

- `apps/isms-portal/src/App.tsx`
- `apps/isms-portal/src/lib/pitHostPolicy.ts`
- `apps/isms-portal/src/lib/pitHostPolicy.test.ts`

Allowed evidence file:

- `modules/isms/11-build/pit-host-policy-redirect-build-to-green-20260626.md`

Allowed governance files:

- `.agent-admin/assurance/iaa-wave-record-wave-pit-host-policy-redirect-20260626.md`
- `.agent-admin/builder-appointments/wave-pit-host-policy-redirect-20260626.md`
- `.agent-admin/scope-declarations/wave-pit-host-policy-redirect-20260626.md`
- `.agent-admin/control/delegation-order.json`

## Boundaries

- ISMS remains the canonical public acquisition host.
- PIT runtime remains canonical at `https://maturion-isms-portal.vercel.app/pit/tracker`.
- Do not implement PIT runtime behavior.
- Do not change Supabase, payment, billing provider, Vercel workflow, subscription pricing, entitlement storage, or unrelated module behavior.
- Do not claim W8.2 closure from this PR alone; production browser evidence must verify the host redirect.

## Required RED-to-GREEN intent

- PIT-RED-BND-007: `maturion-pit.vercel.app` root must no longer expose duplicate ISMS public acquisition journey.
- Public and runtime paths on `maturion-pit.vercel.app` must redirect to canonical ISMS host equivalents.
- Canonical ISMS host behavior must not redirect away from itself.
