# Foreman Session Memory - PIT Public Card Routing

session_id: pit-public-card-routing
wave_id: pit-public-card-routing
governing_issue: #1810
governed_role: FOREMAN
execution_mode: implementation_wave_supervision

agents_delegated_to:
  - pit-specialist: implement public module card copy and entitlement-aware PIT card routing
  - copilot-builder-resource: execute bounded code patch under pit-specialist delegation if direct specialist execution is unavailable

## Gate model

Implementation-only work is not handover. Handover, completion, release, and merge-readiness language remain gated.

## Delegation order

1. IAA pre-brief recorded in `.agent-admin/assurance/iaa-wave-record-pit-public-card-routing.md`.
2. Builder appointment recorded in `.agent-admin/builder-appointments/pit-public-card-routing-builder.md`.
3. Builder implementation commits follow the pre-brief and appointment.
4. Foreman/QP review follows implementation and checks.

## Implementation scope

- Correct the public PIT card name and description.
- Entitled users clicking the public PIT card route to `/pit/tracker`.
- Non-entitled users clicking the public PIT card route to `/marketing/project-implementation`.

## Explicit exclusions

- No Supabase changes.
- No billing or subscription fixture changes.
- No W8.2 completion claim.

Current posture: IMPLEMENTATION_FOR_REVIEW; W8.2_NOT_READY.
