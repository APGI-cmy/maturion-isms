# MMM UX / Workflow / Wiring Addendum - ISMS Boundary Linkup

Status: pre-build boundary alignment
Authority: PR #1850 and paired ISMS/MMM platform-module boundary artifacts
Date: 2026-06-24

## Authority references

- `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md`
- `modules/MMM/04-architecture/platform-module-boundary-linkup-strategy.md`

## UX ownership boundary

ISMS owns UX/wiring for:

- public landing;
- modules overview;
- public free assessment entry;
- public marketing routes;
- subscription / checkout;
- authentication shell;
- onboarding;
- dashboard;
- entitlement and journey-state handoff.

MMM owns UX/wiring only after the approved ISMS handoff into Maturity Roadmap runtime.

## Canonical journey to preserve

```text
ISMS public landing
  -> ISMS-owned module card / public assessment / marketing route
  -> ISMS subscription/auth/onboarding/dashboard as applicable
  -> approved entitlement or journey-state handoff
  -> MMM-owned maturity roadmap runtime/workflow
```

## UX anti-patterns prohibited

MMM UX/wiring must not:

- expose a second ISMS public landing experience;
- create duplicate public free-assessment acquisition loops;
- route eligible users back to subscription/auth/onboarding/public assessment after valid handoff;
- use cross-origin local storage as proof of journey continuity;
- alter PIT, Risk Management, RADAM / Systems Integration, or other module routes;
- make MMM the platform shell by accident.

## Pre-build consequence

Any MMM UX or wiring change touching public entry, subscription, auth, onboarding, dashboard, entitlement, journey-state handoff, or runtime navigation must be classified as governed cross-module linkup before build.
