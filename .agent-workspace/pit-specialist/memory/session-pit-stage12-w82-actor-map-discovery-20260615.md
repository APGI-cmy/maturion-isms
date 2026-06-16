# Session Memory — PIT Stage 12 W8.2 Actor-Map Discovery

Session date: 2026-06-15
Issue: APGI-cmy/maturion-isms#1803
Builder: pit-specialist (Copilot last-resort resource)
Foreman delegation: Foreman tasking comment on issue #1803
Task type: DISCOVERY_ONLY

## phase_1_preflight

PREFLIGHT COMPLETE.

Phase 1 output:
- Confirmed issue #1803 scope is discovery-only.
- Confirmed no Supabase seed is authorized.
- Confirmed no database writes, auth-user creation, migration changes, app-code changes, or W8.2 completion claim are allowed.
- Confirmed required output is an actor-map proposal and blocker list for CS2 review.
- Confirmed W8.2 final status must remain NOT_READY until current Supabase discovery, CS2 seed-plan approval, evidence capture, Foreman/QP, ECAP, IAA, and gates complete.

## What was done

Performed discovery-only actor-map preparation for W8.2 verification planning.

No writes, no seeds, no user creation, no code changes, no migration changes.

## Key finding

Last-known state from PR #1791 evidence:
- auth users: 3
- organisations: 3
- user_org_memberships: 0
- user_roles: 0
- audit_log: 0
- qa_runs: 0

Foreman retried current read-only Supabase discovery on 2026-06-15, but the chat executor did not return a usable result payload. Current live counts and actor refs therefore remain required before seed-plan approval.

Three existing auth users and three existing organisations are candidate material for the W8.2 actor map. Actual UUIDs not held in code artifacts.

## Output artifact

`modules/pit/12-build/w82-actor-map-discovery.md`

Proposed planning map:
- `actor_cs2_admin` → `user_ref_A` (to receive global `cs2_admin` role, org_id IS NULL)
- `actor_org_admin` → `user_ref_B` (to receive `org_admin` role in `org_a`)
- `actor_non_admin_rotation` → `user_ref_C` (to rotate through `viewer`, `contributor`, `team_leader`, and `project_manager` with active membership in `org_a`)
- `actor_no_membership_optional` → `user_ref_C` after cleanup, or separate CS2-approved test user if available
- `org_a` → `org_ref_1`
- `org_b` → `org_ref_2`

## Blocking requirements before seed execution

1. CS2 must supply confirmed user refs and confirm which is safe for each actor role.
2. CS2 must supply confirmed org refs.
3. CS2 must confirm current table counts with a fresh read-only query.
4. CS2 must issue explicit seed-plan authorization.
5. CS2 must confirm cleanup/retention posture.

## Final posture

W8.2_NOT_READY — discovery remains blocked on current Supabase counts and actor/org confirmation; seed-plan authorization pending CS2 decision.
