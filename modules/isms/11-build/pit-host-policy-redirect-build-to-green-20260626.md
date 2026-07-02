# PIT Host Policy Redirect Build-to-Green Evidence

Wave: `wave-pit-host-policy-redirect-20260626`
Date: 2026-06-26
Boundary authority: PR #1850 and PR #1853
Related correction: PR #1861 canonical entitlement handoff
Canonical host: `maturion-isms-portal.vercel.app`
PIT deployment host: `maturion-pit.vercel.app`

## Defect addressed

PIT-RED-BND-007 remained red after the canonical ISMS entitlement handoff was fixed.

Observed production evidence showed that the PIT deployment host rendered the duplicate ISMS public acquisition landing page. That violated the platform/module boundary strategy unless a separately governed host model explicitly allowed the PIT host to act as a public acquisition surface.

## Expected behavior

```text
maturion-pit.vercel.app/*
  -> maturion-isms-portal.vercel.app/*
```

The redirect preserves path, query string, and hash. This means PIT runtime deep links become canonical ISMS-host runtime links, for example:

```text
maturion-pit.vercel.app/pit/tracker
  -> maturion-isms-portal.vercel.app/pit/tracker
```

## Implementation scope

Changed implementation surfaces:

- `apps/isms-portal/src/App.tsx`
- `apps/isms-portal/src/lib/pitHostPolicy.ts`
- `apps/isms-portal/src/lib/pitHostPolicy.test.ts`

No PIT runtime implementation was changed.

## Build-to-green actions

1. Added a PIT host policy helper that identifies the PIT deployment host.
2. Added canonical ISMS URL construction that preserves path, query string, and hash.
3. Added an early app-level redirect guard before router rendering on the PIT deployment host.
4. Added regression tests for host recognition and canonical URL preservation.

## Verification expectation

After deployment, browser evidence must show:

1. Visiting the PIT deployment host root redirects to the canonical ISMS host root.
2. Visiting PIT deployment host `/pit/tracker` redirects to canonical ISMS `/pit/tracker`.
3. Visiting the canonical ISMS host root does not redirect away from itself.
4. Canonical ISMS `/pit/tracker` keeps the PR #1861 non-entitled and entitled behavior.

## Disposition

This PR addresses the remaining PIT-RED-BND-007 host-policy defect. It does not close W8.2 by itself. W8.2 closure still requires production browser evidence and QP/IAA/CS2 disposition.
