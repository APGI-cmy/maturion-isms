# Foreman Session Memory — PIT W8.2 Protected Operational Route

session_id: pit-w82-protected-operational-route-20260616
governing_issue: #1810
reference_pr: #1813
governed_role: FOREMAN
execution_mode: implementation_wave_supervision
agents_delegated_to:
  - pit-specialist: implement the protected PIT operational route using the pre-briefed scope
  - copilot-builder-resource: execute the minimal code patch if direct pit-specialist execution is unavailable

## Gate model refresh

`AGENT_GATE_SYSTEM_TRANSITION_NOTICE.md` was reloaded after PR #1800.

Implementation-only work is not handover. Handover, completion, readiness, and merge-readiness wording remain gated.

## Delegation order

1. IAA pre-brief artifact committed: `.agent-admin/assurance/iaa-prebrief-pit-w82-protected-operational-route.md`.
2. Builder appointment recorded in this session memory.
3. First implementation commit may follow this record.
4. Foreman QP will occur after builder implementation.

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
- No handover or merge-readiness claim in this implementation-only stage.

## Current posture

PROTECTED_PIT_ROUTE_FIX_IN_PROGRESS
W8.2_NOT_READY
