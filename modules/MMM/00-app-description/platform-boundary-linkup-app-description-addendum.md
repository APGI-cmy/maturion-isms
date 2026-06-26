# MMM App Description Addendum - ISMS Platform Boundary Linkup

Status: pre-build boundary alignment
Authority: PR #1850 and paired ISMS/MMM platform-module boundary artifacts
Date: 2026-06-24

## Authority

This addendum must be read together with:

- `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md`
- `modules/MMM/04-architecture/platform-module-boundary-linkup-strategy.md`

## App description alignment

MMM is the Maturity Roadmap module. MMM owns maturity roadmap runtime behavior after an approved ISMS handoff.

MMM may power maturity assessment, scoring, roadmap logic, evidence workflows, approval workflows, and module-specific runtime journeys.

MMM does not own:

- ISMS public landing;
- ISMS modules overview;
- ISMS public free-assessment entry;
- ISMS marketing routes;
- ISMS subscription or checkout;
- ISMS authentication;
- ISMS onboarding;
- ISMS dashboard;
- shared entitlement or journey-state handoff;
- PIT, Risk Management, RADAM / Systems Integration, or other module runtime.

## Operating principle

ISMS owns the public platform shell and handoff. MMM owns only the post-handoff Maturity Roadmap runtime.

MMM must not become the ISMS platform shell by accident. MMM-specific hosts must not expose duplicate public acquisition, subscription, authentication, onboarding, dashboard, or public assessment loops.

## Build implication

No build, release, completion, production-readiness, or fully functional claim is authorized from this addendum or PR #1850 alone.

Any future MMM/ISMS linkup implementation requires separate QA-to-red and governed build appointment.
