# PIT Stage 12 W8.1 Auth Journey Pass Matrix

Issue: maturion-isms#1775
Branch: pit-stage12-w81-completion

## Scope

This matrix records W8.1 auth and route-boundary journey expectations. It separates in-repo test evidence from deployed evidence still required for final W8.1 exit.

## Journey matrix

| Journey | Expected result | Evidence status |
|---|---|---|
| Public user opens `/login` | Login route is public and not wrapped in protected routing | route registry coverage |
| Public user opens `/signup` | Signup route foundation is reachable | route registry coverage |
| Public user opens `/forgot-password` | Password recovery route foundation is reachable | route registry coverage |
| Public user opens `/reset-password` | Reset password route foundation is reachable | route registry coverage |
| Public user opens `/invite/:token` | Invitation route foundation is reachable | route registry coverage |
| Unauthenticated user opens `/dashboard` | Redirects to `/login` with intended destination `/dashboard` | `ProtectedRoute.test.ts` |
| Unauthenticated user opens `/projects` | Redirects to `/login` with intended destination `/projects` | `ProtectedRoute.test.ts` |
| Unauthenticated user opens `/projects/new` | Redirects to `/login` with intended destination `/projects/new` | `ProtectedRoute.test.ts` |
| Unauthenticated user opens `/onboarding` | Redirects to `/login` with intended destination `/onboarding` | `ProtectedRoute.test.ts` |
| Unauthenticated user opens protected route with query/hash | Redirect state preserves path, query, and hash | `ProtectedRoute.test.ts` |

## Five-state shell baseline

`PitShell` exposes the W8.1 state labels: data, empty, loading, permission-denied, and network-error. Runtime visual capture for these states remains deployed-evidence work.

## Remaining deployment evidence

W8.1 cannot be marked fully exited until preview/live environment evidence is filed for:

- direct-load and refresh checks for all W8.1 routes
- screenshots for deep-link and shell states
- HAR or equivalent auth redirect evidence
- CI/status summary for the final W8.1 completion PR

## Verdict

This matrix supports W8.1 completion PR review. It does not by itself claim FUNCTIONAL_PASS or Stage 12 completion.
