# Scope Declaration - ISMS to MMM Routing Handoff

Wave: `wave-isms-mmm-routing-handoff-20260630`
Date: 2026-06-30
Repository: `APGI-cmy/maturion-isms`
Module lane: ISMS platform shell
Runtime owner: MMM
CS2 Authority: Johan Ras

## Objective

Route entitled Maturity Roadmap users from ISMS-owned dashboard, landing-card, and `/modules` entry points to the MMM app host.

Target runtime host:

```text
https://maturion-isms-mmm.vercel.app
```

## Boundaries

- ISMS owns public shell, module cards, subscription/onboarding/dashboard, entitlement summary, and handoff navigation.
- MMM owns MMM runtime after handoff.
- Do not implement MMM runtime, scoring, assessment, descriptor, evidence, or deployment behavior.
- Do not change PIT runtime or PIT routing.

## Allowed files

- `apps/isms-portal/src/lib/moduleRuntimeRoutes.ts`
- `apps/isms-portal/src/lib/moduleRuntimeRoutes.test.ts`
- `apps/isms-portal/src/pages/Dashboard.tsx`
- `apps/isms-portal/src/pages/Index.tsx`
- `apps/isms-portal/src/pages/ModulesOverview.tsx`
- `modules/isms/prebuild-harvest-package/isms-mmm-routing-alignment-20260630.md`
- `modules/isms/05-qa-to-red/isms-mmm-routing-qa-to-red-20260630.md`
- `modules/isms/11-build/isms-mmm-routing-build-to-green-20260630.md`

RESULT: SCOPE_DECLARED
