# PIT Stage 12 Slice 4 — Supabase Target and Authentication Contract

| Field | Value |
|---|---|
| Issue | #1943 |
| Stage authority | #1767 |
| Governance baseline | PR #1945 |
| Tracker reconciliation | PR #1947 |
| Date | 2026-07-22; reconciled 2026-07-23 |
| Builder | `pit-specialist` |
| Status | TARGET BOUND — SCHEMA/RLS/RPC IMPLEMENTED AND APPLIED — AUTHENTICATED LFV GREEN — FINAL REVIEW OPEN |

## Target binding decision

Slice 4 is bound to Supabase project `APGI-cmy's Project`, reference `ujucvyyspfxlxlfdamda`.

The project contains the existing organisation, profile, membership, role, audit and QA foundations required by the approved PIT architecture. No new paid Supabase project or branch was created.

## Existing authenticated tenancy contract

Authoritative existing tables:

- `organisations`;
- `profiles`;
- `user_org_memberships`;
- `user_roles`;
- `audit_log` and `qa_runs`.

Role vocabulary:

`cs2_admin`, `org_admin`, `project_manager`, `team_leader`, `contributor`, `viewer`.

## Existing helper contract reused

- `pit_is_org_member(target_org_id uuid)`;
- `pit_has_org_role(target_org_id uuid, allowed_roles text[])`;
- `pit_is_cs2_admin()`.

No parallel tenancy helper set was introduced.

## Final actor and organisation resolution

- Browser operations use a publishable/anonymous Supabase credential plus an authenticated user session.
- Actor identity derives from `auth.uid()`.
- The repository resolves exactly one active organisation membership.
- Editable inputs cannot set or override `org_id`, `created_by`, `updated_by` or `project_leader_id`.
- Missing session, active membership or allowed role fails closed.
- RLS governs reads; checked transactional RPCs govern writes.

## Delivered schema boundary

Slice 4 adds only:

- `projects`;
- `source_links`;
- `pit_create_project(...)`;
- `pit_update_project(...)`.

Milestones, deliverables, tasks, evidence, notification, reporting, AIMC and timeline tables remain excluded.

## Final mutation boundary

The final hardening migration `20260723130000_pit_slice4_rpc_only_mutation_boundary.sql` establishes:

- authenticated `SELECT` on `projects` and `source_links`;
- no authenticated direct `INSERT`, `UPDATE`, `DELETE` or `TRUNCATE` privileges;
- no anonymous table privileges;
- authenticated/service-role execution of the two checked RPCs only;
- active membership and role checks inside each `SECURITY DEFINER` RPC;
- atomic project/source-link creation;
- immutable organisation and audit binding;
- update rejection when the governed source link is absent.

## Environment and credential boundary

The client reads:

- `VITE_SUPABASE_URL`;
- `VITE_SUPABASE_PUBLISHABLE_KEY`, with backward-compatible fallback to `VITE_SUPABASE_ANON_KEY`.

Only browser-safe Supabase credentials are accepted. No service-role key is committed, bundled or required by the portal.

## Verification

- migration application: successful;
- authenticated table privileges: read-only;
- anonymous table privileges: none;
- transactional RLS scenario: GREEN;
- protected-preview authenticated LFV workflow run `30006074390`: GREEN;
- LFV fixture cleanup: zero project and source-link residue.

## Remaining boundary

Final current-head checks, review-thread closure, CS2 merge and post-merge verification remain open. Slice 4 does not claim Stage 12, PIT, release or `FUNCTIONAL_PASS` completion.
