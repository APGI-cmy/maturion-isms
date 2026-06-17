# Builder Appointment — PIT W8.2 Protected Operational Route

| Field | Value |
|---|---|
| Wave ID | `pit-w82-protected-operational-route` |
| Governing issue | `#1810` |
| Implementation PR | `#1824` |
| Appointed builder | `pit-specialist` |
| Builder resource | `copilot-builder-resource` |
| Appointment status | `APPOINTED` |
| W8.2 posture | `W8.2_NOT_READY` |

## Preconditions

IAA pre-brief is recorded in:

```text
.agent-admin/assurance/iaa-wave-record-pit-w82-protected-operational-route.md
```

## Builder task

Implement only the following route patch:

- Add `ROUTES.PIT = /pit`.
- Add `ROUTES.PIT_TRACKER = /pit/tracker`.
- Add `/pit` redirect to `/pit/tracker`.
- Add protected `/pit/tracker` shell route using the existing `ProtectedRoute`, `PitErrorBoundary`, and `PitShell` pattern.
- Preserve `/subscribe` and `/subscribe/checkout` unchanged.

## Boundaries

- No Supabase writes.
- No fake subscription state.
- No billing fixtures.
- No auth user creation.
- No W8.2 completion claim.
- No handover or merge-readiness claim.

## Expected builder output

- Route constants patch.
- Router patch.
- No subscription or checkout behavior change.
- No additional product scope.

RESULT: BUILDER_APPOINTED
