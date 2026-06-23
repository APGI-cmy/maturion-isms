# Foreman Session Memory — PIT Project Implementation Tracker Routing

session_id: pit-project-implementation-tracker-routing
wave_id: pit-project-implementation-tracker-routing
governing_issue: #1810
governed_role: FOREMAN
execution_mode: implementation_wave_supervision

agents_delegated_to:
  - pit-specialist: implement dashboard navigation and PIT copy correction for Project Implementation Tracker routing
  - copilot-builder-resource: execute bounded code patch under pit-specialist delegation if direct specialist execution is unavailable

## Gate model

Implementation-only work is not handover. Handover, completion, release, and merge-readiness language remain gated.

## Delegation order

1. IAA pre-brief recorded in `.agent-admin/assurance/iaa-wave-record-pit-project-implementation-tracker-routing.md`.
2. Builder appointment recorded in `.agent-admin/builder-appointments/pit-project-implementation-tracker-routing-builder.md`.
3. Builder implementation commits follow the pre-brief and appointment.
4. Foreman/QP review follows implementation and checks.

## Implementation scope

- Change PIT wording from Process Integrity Testing to Project Implementation Tracker.
- Route entitled dashboard Project Implementation clicks to `/pit/tracker`.
- Keep non-entitled Project Implementation users on subscription/upgrade path.
- Update PIT marketing CTA so authenticated entitled users can open Project Implementation Tracker.
- Preserve public marketing/subscription flow.

## Explicit exclusions

- No Supabase changes.
- No billing or subscription fixture changes.
- No W8.2 completion claim.

Current posture: IMPLEMENTATION_FOR_REVIEW; W8.2_NOT_READY.
