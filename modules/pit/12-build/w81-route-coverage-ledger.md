# PIT Stage 12 W8.1 Route Coverage Ledger

Issue: maturion-isms#1775
Branch: pit-stage12-w81-completion

## Scope

This ledger maps the Stage 8 W8.1 routes to the runtime route registry and the expected access boundary.

## Route coverage

| Route | Access | Runtime source | Evidence status |
|---|---|---|---|
| `/` | public | `ROUTES.HOME`; `PIT_STAGE12_W8_1_ROUTES` | covered by route registry test |
| `/login` | public | `ROUTES.LOGIN`; `PIT_STAGE12_W8_1_ROUTES` | covered by route registry and redirect tests |
| `/signup` | public | `ROUTES.SIGNUP`; `PIT_STAGE12_W8_1_ROUTES` | covered by route registry test |
| `/forgot-password` | public | `ROUTES.FORGOT_PASSWORD`; `PIT_STAGE12_W8_1_ROUTES` | covered by route registry test |
| `/reset-password` | public | `ROUTES.RESET_PASSWORD`; `PIT_STAGE12_W8_1_ROUTES` | covered by route registry test |
| `/invite/:token` | public | `ROUTES.INVITE`; `PIT_STAGE12_W8_1_ROUTES` | covered by route registry test |
| `/dashboard` | protected | `ROUTES.DASHBOARD`; `PIT_STAGE12_W8_1_ROUTES`; `ProtectedRoute` | covered by route registry and redirect tests |
| `/projects` | protected | `ROUTES.PROJECTS`; `PIT_STAGE12_W8_1_ROUTES`; `ProtectedRoute` | covered by route registry and redirect tests |
| `/projects/new` | protected | `ROUTES.PROJECTS_NEW`; `PIT_STAGE12_W8_1_ROUTES`; `ProtectedRoute` | covered by route registry and redirect tests |
| `/onboarding` | protected | `ROUTES.ONBOARDING`; `PIT_STAGE12_W8_1_ROUTES`; `ProtectedRoute` | covered by route registry and redirect tests |

## RED mapping

| RED family | W8.1 coverage note |
|---|---|
| ROUTE-001..009 | mapped to W8.1 route reachability and public/protected route registry coverage |
| AUTH-001..015 | partially covered by unauthenticated redirect and intended-destination preservation tests; deeper auth journey evidence remains deployment/runtime dependent |
| ROUTE-028 | covered by public/auth separation design evidence and route registry checks |
| ROUTE-029 | covered at route-boundary foundation level; deployed smoke remains required for full W8.1 exit |

## Remaining deployed evidence required

This file does not claim deployed LFV closure. Deployed direct-load/refresh checks, screenshots, and HAR evidence must be collected from a PR preview or live deployment before W8.1 is fully exited.
