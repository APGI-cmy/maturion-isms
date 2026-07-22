# PIT Stage 12 Slice 4 — RED-to-GREEN and RLS Evidence

| Field | Value |
|---|---|
| Issue | #1943 |
| PR | #1952 |
| Target | Supabase `ujucvyyspfxlxlfdamda` |
| PR-specific prebrief commit | `80a3a5b911f6a41f0a0885dd666758a9d5595493` |
| Builder appointment commit | `8f8c1662f9aee3c2aa1b6ac1e5ac08a6e3880585` |
| First implementation commit | `155b42e141c78a9fcd28ee9beefca0d104271d34` |
| Date | 2026-07-22 |
| Status | CODE, DATABASE, RLS, GOVERNANCE AND DEPLOYMENT GREEN — AUTHENTICATED BROWSER LFV BLOCKED BY MISSING TEST IDENTITY SECRETS/SEED |

## QA-to-RED ordering

The branch history was repaired after the earlier governance baseline had been squash-merged. The active PR now proves a strict PR-specific sequence:

1. prebrief `80a3a5b911f6a41f0a0885dd666758a9d5595493`;
2. builder appointment `8f8c1662f9aee3c2aa1b6ac1e5ac08a6e3880585`;
3. first implementation-like QA-to-RED test commit `155b42e141c78a9fcd28ee9beefca0d104271d34`;
4. reviewed GREEN implementation tree.

The Builder Delegation Order Gate passes on this ancestry. The original branch state remains preserved at `backup/pr-1952-before-delegation-history-repair` for audit recovery.

## GREEN implementation delivered

- stable asynchronous `PitProjectRepository` interface;
- input/date/source/financial validation before writes;
- Supabase database adapter and transactional create/update RPCs;
- authenticated session, single active organisation membership and role resolution;
- organisation-bound `projects` and `source_links` tables;
- RLS helper reuse without parallel tenancy logic;
- creator-capable create enforcement;
- viewer mutation denial;
- authorised update enforcement;
- Project Register Supabase loading states;
- transactional Create Project route;
- `/projects/:id` loading, denied, error, not-found and data states;
- permitted project overview updates;
- truthful read-only browser-local compatibility notice;
- public publishable credential boundary only.

## Applied migrations

1. `20260722090000_pit_stage12_slice4_project_persistence.sql`
2. `20260722105000_pit_slice4_privilege_hardening.sql`

Both were applied successfully to the bound project.

## Privilege verification

Post-hardening inspection confirms:

- `authenticated`: `SELECT`, `INSERT`, `UPDATE` only on `projects` and `source_links`;
- `anon`: no table privileges;
- no authenticated `DELETE` or `TRUNCATE` privilege remains;
- RLS is enabled on both tables;
- six authenticated policies exist for member read, creator insert and authorised update across project and source records.

## Transactional RLS scenario

A self-cleaning database scenario used synthetic users and two synthetic organisations, then removed all fixtures.

```json
{
  "creator_project_persisted": true,
  "viewer_denied": true,
  "cross_org_visible": 0,
  "residual_projects": 0
}
```

This proves creator persistence, viewer denial, cross-organisation isolation and zero residual test projects.

## Compiler and current-head gate evidence

- TypeScript exit code: `0`; diagnostics empty.
- Builder Delegation Order Gate: GREEN.
- POLC Boundary Validation: GREEN.
- CodeQL: GREEN.
- Preflight Evidence, IAA alignment, ECAP, routing, Wave 7, stub detection and merge-check alignment: GREEN.
- ISMS Portal preview build/deployment and SPA smoke: GREEN.
- PIT preview build/deployment: GREEN.

## Security boundary

- Browser runtime uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` only.
- No service-role key is committed or required by the frontend.
- `org_id`, `created_by`, `updated_by` and project-leader actor binding derive from the authenticated session/database contract rather than editable form inputs.

## Authenticated browser LFV attempts and blocker

A temporary Playwright workflow was used only to diagnose the remaining deployed LFV control and was removed afterward to prevent permanent failing workflow debt.

Observed controls:

1. Public Supabase signup reached Auth but failed with `unexpected_failure: Error sending confirmation email`; no disposable identity was created.
2. The canonical LFV matrix requires `PIT_TEST_PROJECT_MANAGER_EMAIL` and `PIT_TEST_PROJECT_MANAGER_PASSWORD` in GitHub Actions.
3. Both canonical secrets resolve as empty in the PR workflow environment.
4. The documented design identity `pit.pm@test.maturion.dev` is not present in the bound Supabase Auth project.
5. The LFV matrix itself requires the test organisation and six confirmed test users to be seeded before LFV.

Consequently, authenticated create → detail → update → register browser evidence cannot be truthfully completed from this PR until an authorised administrator:

- seeds or confirms the governed PIT test organisation and project-manager identity in Supabase Auth;
- assigns exactly one active organisation membership and the `project_manager` role; and
- configures `PIT_TEST_PROJECT_MANAGER_EMAIL` and `PIT_TEST_PROJECT_MANAGER_PASSWORD` as repository/action secrets.

No credential was guessed, exposed or bypassed.

## Review state

- Inline review threads: none.
- Review submissions: none.
- Product and governance implementation review can proceed, but merge recommendation remains blocked by authenticated deployed LFV.

## Remaining external control

The sole Slice 4 merge-readiness blocker is the governed LFV identity/secret seed followed by one authenticated browser run. Post-merge verification and Issue #1943 closure remain later actions.

## Non-completion notice

This evidence does not claim full PIT, Stage 12, production readiness, release readiness, browser LFV completion, `FUNCTIONAL_PASS`, merge readiness or handover completion.
