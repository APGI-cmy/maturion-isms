# PIT Stage 7 — Role Negative-Path Verification Plan (Deployed Environment)

## Plan Purpose

Define deployed-environment denied-path spot checks for protected PIT actions, including direct URL denial, backend/API denial, permission-denied UI behavior, and network payload isolation.

## Role Set (Required + Mapping Note)

| Required Role Label | PIT Role Mapping Used in Current Artifacts | Status |
|---|---|---|
| cs2_admin | cs2_admin | PASS |
| org_admin | org_admin | PASS |
| project_manager | project_leader (mapping note) | PASS_WITH_NON_BLOCKING_NOTES |
| team_leader | task_owner/reviewer (mapping note by action domain) | PASS_WITH_NON_BLOCKING_NOTES |
| contributor | reviewer/task_owner (mapping note by action domain) | PASS_WITH_NON_BLOCKING_NOTES |
| viewer | viewer | PASS |
| unauthenticated user | unauthenticated user | PASS |

Mapping note: `project_manager`, `team_leader`, and `contributor` are currently represented in PIT artifacts via semantically equivalent role/action mappings (`project_leader`, `task_owner`, `reviewer`). This equivalence must be re-validated against the final implementation-time role matrix before any Stage 7 gate-pass claim.

## Protected Action Group Coverage Plan

| Action Group | Minimum Denied Checks | Planned Deployed Checks |
|---|---|---|
| Project creation | 1+ denied check | Direct URL deny + API 403 + PermissionDenied UI |
| Milestone/Deliverable/Task write | 1+ denied check | API 403 + UI denial + scoped data check |
| Evidence approval/upload restrictions | 1+ denied check | API deny + storage denial + UI feedback |
| Audit log access | 1+ denied check | Direct URL deny + backend query scope deny |
| QA dashboard visibility | 1+ denied check | Role-denied UI + payload no-leak check |
| Report generation/export permissions | 1+ denied check | UI deny + backend deny |
| Admin settings/users/org pages | 1+ denied check | Direct URL deny + PermissionDenied UI |

## Mandatory Negative-Path Assertions

| Assertion | Status |
|---|---|
| At least three denied-role deployed verifications | PASS (planned) |
| At least one denied test per protected action group | PASS (planned) |
| Direct URL denial validated | PASS (planned) |
| Backend/API denial validated | PASS (planned) |
| UI permission-denied state validated | PASS (planned) |
| Network payload isolation (no leakage) validated | PASS (planned) |

## Gate Note

This plan defines coverage only. Execution evidence is required later; Stage 7 gate-pass is already recorded for pre-build package/evidence-contract scope only.
