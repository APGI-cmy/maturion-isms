# ECAP - PIT Stage 12 W8.1 Completion

Issue: maturion-isms#1775

## Scope authority

This wave follows PR #1772 and completes the in-repo W8.1 route/auth evidence gap before W8.2 begins.

## Primary artifacts touched

- apps/isms-portal/src/components/auth/ProtectedRoute.tsx
- apps/isms-portal/src/components/auth/ProtectedRoute.test.ts
- modules/pit/12-build/w81-route-coverage-ledger.md
- modules/pit/12-build/w81-auth-journey-pass-matrix.md
- .agent-admin/scope-declarations/pit-stage12-w81-completion.md
- .agent-admin/builder-appointments/pit-stage12-w81-completion-builder-confirmation.md

## Decisions made

- Extracted a small auth redirect helper so canonical login redirect behavior can be tested without introducing broad browser-test machinery.
- Added tests for protected W8.1 redirect destinations and query/hash preservation.
- Filed route coverage and auth journey matrices as W8.1 evidence artifacts.
- Kept deployed screenshots/HAR evidence as an explicit remaining runtime-evidence dependency unless preview/live evidence is attached later.

## Open risks

- CI must validate TypeScript/test compatibility.
- Vercel preview must be checked for deployed status.
- W8.1 remains not fully LFV-evidenced until deployed route/auth captures are filed.

## ECAP disposition

Administrative trail is sufficient for PR review. Merge depends on CI/review status and IAA disposition.
