# Foreman Session Memory — PIT Navigation Copy Fix

session_id: pit-nav-copy
wave_id: pit-nav-copy
governing_issue: #1810
governed_role: FOREMAN
execution_mode: implementation_wave_supervision

agents_delegated_to:
  - pit-specialist: implement dashboard navigation and PIT wording correction for Project Implementation Tracker routing
  - copilot-builder-resource: execute bounded code patch under pit-specialist delegation if direct specialist execution is unavailable

## Gate model

Implementation-only work is not handover. Handover, completion, release, and merge-readiness language remain gated.

## Delegation order

1. IAA pre-brief recorded in `.agent-admin/assurance/iaa-wave-record-pit-nav-copy.md`.
2. Builder appointment recorded in `.agent-admin/builder-appointments/pit-nav-copy-builder.md`.
3. Builder implementation commits follow the pre-brief and appointment.
4. Foreman/QP review follows implementation and checks.

## Implementation scope

- Correct PIT wording to Project Implementation Tracker.
- Route entitled dashboard Project Implementation clicks to `/pit/tracker`.
- Keep non-entitled users on the subscription upgrade path.
- Preserve public marketing and subscription routes.

## Explicit exclusions

- No Supabase changes.
- No billing or subscription fixture changes.
- No W8.2 completion claim.

Current posture: IMPLEMENTATION_FOR_REVIEW; W8.2_NOT_READY.
