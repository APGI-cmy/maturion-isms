# MMM Boundary Linkup Executable QA Scope

Wave: `wave-mmm-boundary-linkup-executable-qa-2026-06-26`
Date: 2026-06-26
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-boundary-linkup-executable-qa`
Module scope: MMM / ISMS boundary linkup executable QA and minimal boundary helper implementation
Lane: QA-to-red first, then minimal build-to-green
CS2 Authority: Johan Ras
Foreman role: scope, assurance, implementation sequencing, and verification
Builder classification: PR carries `copilot-builder-role`; no Foreman session memory is committed in this wave.
POLC release labels: PR carries `CS sign-off: approved` scoped to this PR only, after delegation-order and IAA pre-brief gates passed.

## Objective

Start the first executable QA wave after PR #1854 merged the MMM/ISMS boundary pre-build alignment baseline.

This wave converts the 10 MMM boundary linkup QA-to-red obligations into executable tests before any runtime helper code. Minimal helper code may be added only after the tests exist and only to turn the scoped tests green.

## Authority inputs

- PR #1850 shared boundary authority.
- PR #1854 MMM/ISMS boundary pre-build alignment baseline.
- `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md`
- `modules/MMM/04-architecture/platform-module-boundary-linkup-strategy.md`
- `modules/MMM/05-qa-to-red/platform-boundary-linkup-qa-to-red.md`
- `modules/MMM/BUILD_PROGRESS_TRACKER.md`

## Required executable test coverage

The builder must create executable tests for:

1. ISMS public landing owns MMM entry.
2. Free assessment remains ISMS-owned acquisition surface.
3. Subscription/auth/onboarding/dashboard state is preserved.
4. Dashboard or approved handoff shows MMM journey/entitlement state.
5. Eligible users reach MMM runtime without loopback.
6. Non-entitled or ineligible users route predictably to ISMS-owned surfaces.
7. MMM host does not duplicate public acquisition loop.
8. Cross-origin local-storage continuity assumptions are prohibited.
9. MMM runtime does not alter PIT, Risk Management, RADAM, or other module routes.
10. MMM does not become the ISMS platform shell.

## Allowed minimal implementation after tests exist

- Pure TypeScript boundary policy constants.
- Pure helper functions for evaluating MMM/ISMS boundary routing policy.
- Pure helper functions for identifying permitted handoff/routing outcomes.
- No UI, route, API, edge function, database, auth, subscription, dashboard, or other module runtime implementation.

## Out of scope

- ISMS public landing runtime.
- Free assessment runtime.
- Subscription, authentication, onboarding, dashboard runtime.
- Entitlement persistence or journey-state persistence.
- MMM public host runtime changes.
- PIT, Risk Management, RADAM / Systems Integration, or other module runtime.
- Database migrations.
- API or edge functions.
- Production-readiness or completion claims.

## Build law

Executable tests must be committed before minimal helper implementation.
