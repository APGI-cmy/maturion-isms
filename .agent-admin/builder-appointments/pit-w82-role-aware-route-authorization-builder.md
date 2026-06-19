# Builder Appointment — PIT W8.2 Role-Aware Route Authorization

| Field | Value |
|---|---|
| Wave ID | `pit-w82-role-aware-route-authorization` |
| Governing issue | `#1810` |
| Appointed builder | `pit-specialist` |
| Builder resource | `copilot-builder-resource` |
| Appointment status | `APPOINTED` |
| Posture | `IMPLEMENTATION_FOR_REVIEW` |

## Preconditions

IAA pre-brief is recorded in:

```text
.agent-admin/assurance/iaa-wave-record-pit-w82-role-aware-route-authorization.md
```

## Builder task

Implement role-aware route authorization for the current PIT shell routes:

- Keep `/pit` and `/pit/tracker` available to authenticated PIT workspace users.
- Deny `/admin/org`, `/admin/users`, `/admin/settings`, `/admin/audit-log` to non-admin roles.
- Allow `org_admin` for org-admin routes.
- Deny `/qa-dashboard` to `org_admin` unless intentionally changed later.
- Allow `cs2_admin` for `/qa-dashboard` and admin routes.
- Preserve public marketing/subscription flow.

## Boundaries

- No Supabase seed changes.
- No billing or subscription fixture changes.
- No claim that this completes W8.2 RLS.
- No claim that W8.2 route evidence is complete before deployed browser evidence is captured.

RESULT: BUILDER_APPOINTED
