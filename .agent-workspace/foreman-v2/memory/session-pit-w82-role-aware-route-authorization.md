# Foreman Session Memory — PIT W8.2 Role-Aware Route Authorization

session_id: pit-w82-role-aware-route-authorization
wave_id: pit-w82-role-aware-route-authorization
governing_issue: #1810
implementation_pr: #1829
governed_role: FOREMAN
execution_mode: implementation_wave_supervision

agents_delegated_to:
  - pit-specialist: implement role-aware authorization guard and route wiring for PIT/admin/QA shell routes
  - copilot-builder-resource: execute bounded code patch under pit-specialist delegation if direct specialist execution is unavailable

## Gate model

Implementation-only work is not handover. Handover, completion, release, and merge-readiness language remain gated.

## Delegation order

1. IAA pre-brief recorded in `.agent-admin/assurance/iaa-wave-record-pit-w82-role-aware-route-authorization.md`.
2. Builder appointment recorded in `.agent-admin/builder-appointments/pit-w82-role-aware-route-authorization-builder.md`.
3. Builder implementation commits follow the pre-brief and appointment.
4. Foreman/QP review follows implementation and checks.

## Implementation scope

- Keep `/pit` and `/pit/tracker` available to authenticated PIT workspace users.
- Deny `/admin/org`, `/admin/users`, `/admin/settings`, `/admin/audit-log` to non-admin mock roles.
- Allow `org_admin` and `cs2_admin` for org-admin routes.
- Deny `/qa-dashboard` to `org_admin`.
- Allow `cs2_admin` for `/qa-dashboard` and admin routes.
- Preserve public marketing/subscription flow.

## Explicit exclusions

- No Supabase seed changes.
- No billing or subscription fixture changes.
- No W8.2 completion claim.
- No final route-evidence claim until deployed browser evidence is captured.

Current posture: IMPLEMENTATION_FOR_REVIEW; W8.2_NOT_READY.
