# Session Memory — PIT Stage 12 W8.2 Actor-Map Discovery

Session date: 2026-06-15
Issue: APGI-cmy/maturion-isms#1803
Builder: pit-specialist (Copilot last-resort resource)
Foreman delegation: Foreman tasking comment on issue #1803
Task type: DISCOVERY_ONLY

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

Three existing auth users and three existing organisations are candidate material for the W8.2 actor map. Actual UUIDs not held in code artifacts.

## Output artifact

`modules/pit/12-build/w82-actor-map-discovery.md`

Proposed actor map:
- `actor_cs2_admin` → `user_ref_A` (to receive global `cs2_admin` role, org_id IS NULL)
- `actor_org_admin` → `user_ref_B` (to receive `org_admin` role in `org_a`)
- `actor_non_admin` → `user_ref_C` (no role assignment — denied-path subject)
- `org_a` → `org_ref_1`
- `org_b` → `org_ref_2`

## Blocking requirements before seed execution

1. CS2 must supply confirmed user refs and confirm which is safe for each actor role.
2. CS2 must supply confirmed org refs.
3. CS2 must confirm current table counts with a fresh read-only query.
4. CS2 must issue explicit seed-plan authorization.
5. CS2 must confirm cleanup/retention posture.

## Final posture

W8.2_NOT_READY — discovery complete, seed-plan authorization pending CS2 decision.
