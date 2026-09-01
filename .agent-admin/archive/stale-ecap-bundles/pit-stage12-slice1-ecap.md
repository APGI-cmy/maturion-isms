# ECAP - PIT Stage 12 Slice 1

Issue: maturion-isms#1770

## Scope authority

PIT Stage 12 is authorized by issue #1767 and PR #1768. This slice is limited to W8.1 runtime shell and route foundation.

## Primary artifacts touched

- apps/isms-portal/src/lib/routes.ts
- apps/isms-portal/src/lib/pitRoutes.ts
- apps/isms-portal/src/lib/pitRoutes.test.ts
- apps/isms-portal/src/components/PitErrorBoundary.tsx
- apps/isms-portal/src/components/auth/ProtectedRoute.tsx
- apps/isms-portal/src/pages/pit/PitShell.tsx
- apps/isms-portal/src/App.tsx
- modules/pit/12-build/slice1-runtime-shell-evidence.md
- .agent-admin/scope-declarations/pit-stage12-slice1-runtime-shell.md
- .agent-admin/builder-appointments/pit-stage12-slice1-builder-confirmation.md
- .agent-admin/quality/pit-stage12-slice1-foreman-qp.md

## Decisions made

- Use apps/isms-portal as the current PIT runtime host because the ISMS portal owns module routing and public/private route handoff.
- Keep the first slice narrow and route-shell focused.
- Preserve no-FUNCTIONAL_PASS posture.

## Evidence reviewed

- Stage 8 W8.1 implementation plan.
- Stage 12 kickoff authorization.
- Current PIT build tracker.

## Open risks

- CI must be verified after PR creation.
- Vercel/external status may fail due monorepo deployment configuration and must be disclosed if present.
- Stage 12 remains incomplete after this slice.

## ECAP disposition

Administrative trail is sufficient for PR review. Merge depends on CI/review status and IAA disposition.
