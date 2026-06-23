# Builder Appointment — PIT Navigation Copy Fix

| Field | Value |
|---|---|
| Wave ID | `pit-nav-copy` |
| Governing issue | `#1810` |
| Appointed builder | `pit-specialist` |
| Builder resource | `copilot-builder-resource` |
| Appointment status | `APPOINTED` |
| Posture | `IMPLEMENTATION_FOR_REVIEW` |

## Preconditions

IAA pre-brief is recorded in:

```text
.agent-admin/assurance/iaa-wave-record-pit-nav-copy.md
```

## Builder task

- Change PIT wording from Process Integrity Testing to Project Implementation Tracker.
- Route entitled dashboard Project Implementation clicks to `/pit/tracker`.
- Keep non-entitled Project Implementation users on subscription/upgrade path.
- Update PIT marketing CTA so authenticated entitled users can open Project Implementation Tracker.
- Preserve public marketing/subscription flow.

## Boundaries

- No Supabase changes.
- No billing or subscription fixture changes.
- No W8.2 completion claim.

RESULT: BUILDER_APPOINTED
