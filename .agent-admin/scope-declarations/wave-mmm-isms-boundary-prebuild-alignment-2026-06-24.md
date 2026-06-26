# MMM/ISMS Boundary Pre-Build Alignment Scope

Wave: `wave-mmm-isms-boundary-prebuild-alignment-2026-06-24`
Date: 2026-06-24
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-isms-boundary-prebuild-alignment`
Module scope: MMM pre-build artifact alignment to ISMS/platform module boundary strategy
Lane: Governance alignment / pre-build only
CS2 Authority: Johan Ras
Foreman role: scope, assurance, pre-build alignment, and build-boundary control

## Objective

Align MMM pre-build artifacts to PR #1850 shared platform/module boundary authority before any MMM/ISMS linkup implementation work begins.

## Authority inputs

Primary shared authority:

- PR #1850: `Docs: define ISMS/module boundary linkup strategy`
- `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md`
- `modules/MMM/04-architecture/platform-module-boundary-linkup-strategy.md`

MMM pre-build stack requiring alignment:

- MMM App Description
- `modules/MMM/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md`
- `modules/MMM/02-frs/functional-requirements.md`
- `modules/MMM/03-trs/technical-requirements-specification.md`
- `modules/MMM/04-architecture/architecture.md`
- MMM QA-to-Red
- `modules/MMM/06-pbfag/pbfag-checklist.md`
- `modules/MMM/07-implementation-plan/implementation-plan.md`
- `modules/MMM/08-builder-checklist/builder-checklist.md`
- `modules/MMM/10-builder-appointment/builder-contract.md`
- applicable IAA wave record
- `modules/MMM/BUILD_PROGRESS_TRACKER.md`

## Required alignment coverage

This wave must align MMM artifacts to these boundary rules:

1. ISMS owns public landing, modules overview, public free-assessment entry, marketing routes, subscription, authentication, onboarding, dashboard, and entitlement/journey handoff.
2. MMM owns Maturity Roadmap runtime behavior after approved ISMS handoff.
3. MMM may power assessment, scoring, roadmap logic, and module-specific runtime workflows but must not become the ISMS platform shell.
4. MMM agent must not build ISMS, PIT, Risk Management, RADAM/Systems Integration, or other module runtime.
5. ISMS agent must not build MMM runtime.
6. Cross-module linkup must be governed before build.
7. QA-to-red must cover public entry routing, free assessment ownership, entitlement/auth/onboarding/dashboard continuity, no duplicate acquisition loop, no cross-origin local-storage assumption, and no mutation of other module routes.
8. No completion, release, production readiness, or fully functional claim may be made from PR #1850 or the MMM boundary artifact alone.

## Out of scope

- Runtime implementation.
- Executable tests.
- Route changes.
- UI code.
- Database migrations.
- API/edge functions.
- Public landing, subscription, auth, onboarding, dashboard, PIT, Risk, RADAM, or other module runtime changes.

## Lane note

This is pre-build boundary alignment only. Build work must not start from this wave alone.
