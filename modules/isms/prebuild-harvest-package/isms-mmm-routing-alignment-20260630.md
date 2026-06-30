# ISMS to MMM Routing Alignment

Date: 2026-06-30
Module lane: ISMS platform shell
Related runtime owner: MMM
Authority: PR #1850 shared platform/module boundary strategy; PR #1854 MMM-side alignment; PR #1857 ISMS-side alignment
Status: Pre-build alignment for ISMS-owned MMM handoff routing

## Purpose

Record the ISMS-side routing rule for the Maturity Roadmap / MMM entry point.

ISMS owns the public platform shell, module cards, subscription, onboarding, dashboard, and entitlement handoff. MMM owns the MMM application once the user reaches the MMM app host.

## Required routing behavior

- Non-entitled users remain on ISMS-owned discovery, marketing, subscription, checkout, auth, onboarding, and dashboard routes.
- Entitled users opening Maturity Roadmap from the ISMS dashboard must leave the internal ISMS preview route and land on the MMM app.
- Entitled users opening Maturity Roadmap from the ISMS modules page must land on the MMM app.
- ISMS must not implement MMM runtime behavior.

Canonical MMM app host:

```text
https://maturion-isms-mmm.vercel.app
```

## Boundary statement

This change is an ISMS handoff/navigation correction only. It does not alter MMM runtime, MMM data model, MMM assessment logic, or MMM deployment ownership.
