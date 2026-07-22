# PIT Stage 12 Slice 4 — Supabase Target and Authentication Contract

| Field | Value |
|---|---|
| Issue | #1943 |
| Stage authority | #1767 |
| Governance baseline | PR #1945 |
| Tracker reconciliation | PR #1947 |
| Date | 2026-07-22 |
| Builder | `pit-specialist` |
| Status | TARGET BOUND — SCHEMA IMPLEMENTATION NOT STARTED |

## Target binding decision

Slice 4 is bound to the existing Supabase project `APGI-cmy's Project` with project reference `ujucvyyspfxlxlfdamda`.

This decision is based on read-only verification that this is the existing shared ISMS/MMM environment and already contains the organisation, profile, membership, role, audit and QA foundations required by the approved PIT architecture. The other available projects are learning-specific or contain no public schema suitable for PIT.

No new paid Supabase project or branch is created by this decision.

## Existing authenticated tenancy contract

The following existing public tables are authoritative for Slice 4 tenancy and role enforcement:

- `organisations(id, name, created_at, updated_at)`;
- `profiles(id -> auth.users.id, organisation_id, display_name, email, role, full_name, preferences, created_at, updated_at)`;
- `user_org_memberships(id, user_id -> auth.users.id, org_id -> organisations.id, status, created_at)` with one membership per user and organisation;
- `user_roles(id, user_id -> auth.users.id, org_id, project_id, role, created_at)`;
- `audit_log` and `qa_runs` as existing controlled evidence surfaces.

The existing role vocabulary is:

`cs2_admin`, `org_admin`, `project_manager`, `team_leader`, `contributor`, `viewer`.

## Existing RLS helper contract

Slice 4 must reuse, not duplicate, these existing `SECURITY DEFINER` helpers:

- `pit_is_org_member(target_org_id uuid)` — true for an active organisation member or global `cs2_admin`;
- `pit_has_org_role(target_org_id uuid, allowed_roles text[])` — true for an allowed organisation role, with the existing global `cs2_admin` rule;
- `pit_is_cs2_admin()` — true only for the global `cs2_admin` role record.

## Slice 4 actor and organisation resolution

- Browser operations use a publishable/anonymous Supabase credential plus the authenticated user session.
- The repository derives actor identity from `auth.uid()` and the session returned by Supabase Auth.
- The repository resolves an active organisation membership from `user_org_memberships`; editable form input may not select or override `org_id`.
- Project inserts use database defaults for `created_by` and `updated_by` based on `auth.uid()`.
- RLS remains the primary enforcement boundary; frontend role checks are supplementary.
- Missing session, missing active membership, ambiguous membership, or missing permitted role fails closed.

## Schema compatibility decisions

Slice 4 will add only the approved `projects` and `source_links` boundary. It will not add milestones, deliverables, tasks, evidence, notification, reporting, AIMC or timeline tables.

The `projects` table will retain the PIT-TR-029 fields and additionally include `created_by`, `updated_by` and `archived_at` required by the approved actor-binding and lifecycle architecture. `source_links` access will be derived through the parent project.

## Environment and credential boundary

The client will read:

- `VITE_SUPABASE_URL`;
- `VITE_SUPABASE_PUBLISHABLE_KEY`.

No service-role key may be added to the app package, Vite public variables, committed fixtures, browser bundles or screenshots.

## Implementation sequence

1. Open the Slice 4 implementation PR and file PR-scoped delegation controls.
2. Commit QA-to-RED tests before repository, route or schema implementation.
3. Record the first implementation commit SHA.
4. Add the repository and route implementation behind the stable interface.
5. Commit and apply the governed migration.
6. Execute positive and negative RLS verification.
7. Update pre-build alignment artifacts, implementation evidence and progress trackers.
8. Complete current-head gates, deployment evidence and final review.

## Non-completion notice

This target decision does not claim that the migration, repository, RLS policies, project detail route, browser evidence, Slice 4, Stage 12 or PIT is complete.
