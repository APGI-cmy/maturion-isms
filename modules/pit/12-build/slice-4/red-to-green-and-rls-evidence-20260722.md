# PIT Stage 12 Slice 4 — RED-to-GREEN and RLS Evidence

| Field | Value |
|---|---|
| Issue | #1943 |
| PR | #1952 |
| Target | Supabase `ujucvyyspfxlxlfdamda` |
| First implementation commit | `4f31c3a1648357aee6c45f3e6e286eeab3f1a46a` |
| Date | 2026-07-22 |
| Status | CODE AND DATABASE GREEN — BROWSER LFV / FINAL REVIEW OUTSTANDING |

## QA-to-RED ordering

The first implementation commit contained the Slice 4 repository contract tests and referenced the intentionally absent `pitProjectRepository` implementation. The PR-scoped delegation order records this exact SHA and the repository gate verifies the prebrief → appointment → implementation ancestry.

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

Observed result:

```json
{
  "creator_project_persisted": true,
  "viewer_denied": true,
  "cross_org_visible": 0,
  "residual_projects": 0
}
```

This proves:

- a project-manager member can create one project and source record;
- a viewer cannot create;
- a member of another organisation cannot see the project;
- no test project remained after verification.

## Compiler evidence

A temporary artifact-producing diagnostic workflow captured the portal TypeScript result after corrections:

- exit code: `0`;
- diagnostics: empty.

The temporary workflow was removed immediately after proof and is not retained as test debt.

## Security boundary

- Browser runtime uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` only.
- No service-role key is committed or required by the frontend.
- `org_id`, `created_by`, `updated_by` and project leader actor binding are derived from the authenticated session/database contract rather than editable form inputs.

## Outstanding evidence

The following remain open before this PR can be recommended for merge:

- current-head deployment and route-smoke success after all documentation commits;
- authenticated browser create → register → detail → update evidence using an approved test account;
- review conversation closure;
- final proxy/IAA review;
- post-merge verification and Issue #1943 closure.

## Non-completion notice

This evidence does not claim full PIT, Stage 12, production readiness, release readiness, browser LFV completion, `FUNCTIONAL_PASS` or handover completion.
