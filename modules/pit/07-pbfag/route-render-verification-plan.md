# PIT Stage 7 — Route Render Verification Plan (27 Routes, Deployed Environment)

## Plan Constraints

- Verification target is deployed environment (not local-only)
- Each route requires direct deep-link load and refresh validation
- Include unauth redirect, permission-denied behavior, and 404 handling
- No white-screen/app-shell failure allowed

## Route Coverage Plan

| # | Route | Type | Required Checks |
|---|---|---|---|
| 1 | `/` | Public | Direct load, refresh, app-shell render |
| 2 | `/login` | Auth/Public | Direct load, refresh, visible auth form |
| 3 | `/signup` | Auth/Public | Direct load, refresh, visible auth form |
| 4 | `/forgot-password` | Auth/Public | Direct load, refresh |
| 5 | `/reset-password` | Auth/Public | Direct load, refresh |
| 6 | `/invite/:token` | Auth/Public | Direct load with token, error/invalid-token handling |
| 7 | `/dashboard` | Protected | Direct load, refresh, unauth redirect, permission state checks |
| 8 | `/projects` | Protected | Direct load, refresh, state matrix checks |
| 9 | `/projects/new` | Protected | Direct load, refresh, permission-denied coverage |
| 10 | `/projects/:id` | Protected | Direct load, refresh, loading/empty/error/data |
| 11 | `/projects/:id/timeline` | Protected | Direct load, refresh, timeline render stability |
| 12 | `/projects/:id/milestones` | Protected | Direct load, refresh, state matrix checks |
| 13 | `/projects/:id/deliverables` | Protected | Direct load, refresh, state matrix checks |
| 14 | `/projects/:id/tasks` | Protected | Direct load, refresh, state matrix checks |
| 15 | `/projects/:id/evidence` | Protected | Direct load, refresh, state matrix checks |
| 16 | `/projects/:id/reports` | Protected | Direct load, refresh, state matrix checks |
| 17 | `/projects/:id/settings` | Protected | Direct load, refresh, permission checks |
| 18 | `/my-work` | Protected | Direct load, refresh, state matrix checks |
| 19 | `/notifications` | Protected | Direct load, refresh, state matrix checks |
| 20 | `/profile` | Protected | Direct load, refresh, state matrix checks |
| 21 | `/onboarding` | Protected/Auth flow | Direct load, refresh, auth/role flow checks |
| 22 | `/admin/org` | Protected/Admin | Direct load, refresh, denied-role check |
| 23 | `/admin/users` | Protected/Admin | Direct load, refresh, denied-role check |
| 24 | `/admin/settings` | Protected/Admin | Direct load, refresh, denied-role check |
| 25 | `/admin/audit-log` | Protected/Admin | Direct load, refresh, denied-role + data isolation check |
| 26 | `/qa-dashboard` | Protected/Admin-like | Direct load, refresh, cs2_admin visibility and denied-role checks |
| 27 | `*` | 404 | Unknown-route render, refresh, no white screen |

## Verification Assertions (All Routes as Applicable)

| Assertion | Status |
|---|---|
| Direct deep-link load works in deployed environment | PASS (planned) |
| Refresh behavior preserves expected routing/auth behavior | PASS (planned) |
| Unauthenticated access redirects for protected routes | PASS (planned) |
| Permission-denied UI appears where role lacks access | PASS (planned) |
| Loading/empty/error/data states verified on data routes | PASS (planned) |
| No white-screen/app-shell render failure | PASS (planned) |

## Gate Note

Stage 7 route-render plan is defined; execution evidence is deferred to authorized downstream stages. This does not constitute Stage 7 gate-pass.

