# Builder Appointment - PIT Public Card Routing

| Field | Value |
|---|---|
| Wave ID | `pit-public-card-routing` |
| Governing issue | `#1810` |
| Appointed builder | `pit-specialist` |
| Builder resource | `copilot-builder-resource` |
| Appointment status | `APPOINTED` |
| Posture | `IMPLEMENTATION_FOR_REVIEW` |

## Preconditions

IAA pre-brief is recorded in:

```text
.agent-admin/assurance/iaa-wave-record-pit-public-card-routing.md
```

## Builder task

- Change the public PIT card wording to Project Implementation Tracker.
- Remove stale process-testing language from the public card description.
- Route entitled Project Implementation users from the public card to `/pit/tracker`.
- Keep non-entitled users on `/marketing/project-implementation`.
- Preserve public marketing and subscription routes.

## Boundaries

- No Supabase changes.
- No billing or subscription fixture changes.
- No W8.2 completion claim.

RESULT: BUILDER_APPOINTED
