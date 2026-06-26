# MMM Builder Checklist Addendum - ISMS Platform Boundary Linkup

Status: pre-build boundary alignment
Authority: PR #1850 and paired ISMS/MMM platform-module boundary artifacts
Date: 2026-06-24

## Builder checklist additions

Before any MMM/ISMS linkup build, the builder must confirm:

- the wave is classified as MMM runtime, ISMS platform shell, or governed cross-module linkup;
- ISMS owns public landing, modules overview, public free assessment entry, marketing, subscription, auth, onboarding, dashboard, and handoff;
- MMM owns only post-handoff Maturity Roadmap runtime;
- QA-to-red includes the boundary linkup obligations;
- no MMM code changes alter PIT, Risk Management, RADAM / Systems Integration, or other module routes;
- no cross-origin local-storage assumption is used as evidence of entitlement or journey continuity;
- no completion, release, production-readiness, or fully functional claim is made from boundary authority alone.

## Stop-work triggers

The builder must stop and request Foreman/CS2 clarification if the requested work:

- touches ISMS shell ownership;
- modifies subscription/auth/onboarding/dashboard flow;
- changes public free-assessment routing;
- changes runtime navigation into other modules;
- requires cross-module entitlement or journey-state handoff not already governed.
