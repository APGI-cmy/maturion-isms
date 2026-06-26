# MMM Architecture Addendum - ISMS Platform Boundary Linkup

Status: pre-build boundary alignment
Authority: PR #1850 and paired ISMS/MMM platform-module boundary artifacts
Date: 2026-06-24

## Authority references

- `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md`
- `modules/MMM/04-architecture/platform-module-boundary-linkup-strategy.md`

## Architecture boundary

MMM architecture must preserve ISMS as the canonical public platform shell and MMM as the post-handoff Maturity Roadmap runtime owner.

## Route/capability implications

MMM architecture may authorize MMM-owned runtime routes only after approved ISMS entitlement/journey-state handoff.

MMM architecture must not authorize MMM to implement or modify:

- ISMS public landing;
- ISMS modules overview;
- ISMS marketing routes;
- ISMS free-assessment public entry;
- subscription / checkout;
- authentication;
- onboarding;
- dashboard / entitlement summary;
- PIT, Risk Management, RADAM / Systems Integration, or other module runtime routes.

## Host policy

MMM-specific hosts must not become duplicate public acquisition front doors. They must follow one of the governed models defined in `platform-module-boundary-linkup-strategy.md`: redirect-only, deep-link-only, canonical-host-only, or explicitly approved standalone runtime.

## Evidence policy

Architecture evidence for MMM linkup must demonstrate canonical ISMS-host journey continuity. Cross-origin local-storage state is not valid proof of continuity.
