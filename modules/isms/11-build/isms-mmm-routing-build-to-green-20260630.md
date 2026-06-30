# ISMS to MMM Routing Build-to-Green Evidence

Date: 2026-06-30
Module lane: ISMS platform shell
Runtime owner: MMM
Status: Build-to-green evidence

## Defect addressed

Entitled users opening Maturity Roadmap from the ISMS dashboard were routed to the internal ISMS preview route `/maturity/setup` instead of the MMM app landing at `https://maturion-isms-mmm.vercel.app`.

The same runtime handoff behavior also needed to be available from the ISMS `/modules` page.

## Implementation summary

- Added a shared MMM runtime URL helper.
- Updated ISMS dashboard Maturity Roadmap handoff to store ISMS handoff context and then open the MMM app host.
- Updated ISMS `/modules` card routing so entitled Maturity Roadmap users open the MMM app.
- Added regression tests for MMM external route classification.

## Boundary discipline

- ISMS owns the public/platform shell and entitlement/handoff navigation.
- MMM owns the MMM app once reached at `https://maturion-isms-mmm.vercel.app`.
- No MMM runtime code, scoring, assessment, evidence, descriptor, or deployment behavior was changed.
- PIT runtime and PIT routing were not changed.

## QA-to-red coverage

QA-to-red artifact:

```text
modules/isms/05-qa-to-red/isms-mmm-routing-qa-to-red-20260630.md
```

Pre-build alignment artifact:

```text
modules/isms/prebuild-harvest-package/isms-mmm-routing-alignment-20260630.md
```

## Verification expectation

After deployment, CS2 browser evidence should confirm:

1. non-entitled Maturity Roadmap users remain on ISMS marketing/subscription paths;
2. entitled dashboard Maturity Roadmap `Open module` routes to `https://maturion-isms-mmm.vercel.app`;
3. entitled `/modules` Maturity Roadmap card routes to `https://maturion-isms-mmm.vercel.app`;
4. MMM app host renders its own MMM landing/app shell.
