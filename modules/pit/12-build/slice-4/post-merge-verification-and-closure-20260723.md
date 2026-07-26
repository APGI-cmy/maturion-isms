# PIT Stage 12 Slice 4 — Post-Merge Verification and Closure Record

| Field | Value |
|---|---|
| Implementation issue | #1943 |
| Reconciliation issue | #1964 |
| Implementation PR | #1952 |
| Merge commit | `61ef3795d953ae11e0c153705729bff52aa3dc9f` |
| Merged at | 2026-07-23T14:46:28Z |
| Supabase target | `ujucvyyspfxlxlfdamda` |
| Status | POST-MERGE VERIFIED — SLICE 4 AUTHORISED BOUNDARY COMPLETE |

## Purpose

This record closes the authorised Slice 4 implementation boundary after CS2 merged PR #1952. It reconciles implementation, security, deployment, LFV and tracker evidence without claiming that PIT or Stage 12 is complete.

## Merge verification

PR #1952 is merged into `main` at `61ef3795d953ae11e0c153705729bff52aa3dc9f`.

The merge contains:

- governed prebrief → appointment → QA-to-RED ancestry;
- the Supabase-backed project repository;
- `projects` and `source_links` migrations;
- RPC-only transactional mutation functions;
- organisation-scoped authenticated reads and denied paths;
- project creation, register and `/projects/:id` workspace;
- durable RED-to-GREEN, RLS and authenticated LFV evidence;
- final review hardening and resolved review threads.

## Post-merge deployment verification

The merged commit reports successful deployments for:

- `maturion-isms-portal`;
- `maturion-pit`;
- `maturion-isms-mmm`.

The final PR head before merge passed the required governance, delegation, POLC, routing, CodeQL, ISMS Portal deployment and PIT deployment checks.

## Database and security disposition

The final applied Slice 4 database boundary is:

- authenticated users have `SELECT` access to `projects` and `source_links` under RLS;
- authenticated direct `INSERT`, `UPDATE`, `DELETE` and `TRUNCATE` table privileges are absent;
- project and source-link mutations are available only through `pit_create_project` and `pit_update_project`;
- both mutation functions verify authenticated actor, active organisation membership and allowed role;
- organisation, creator and audit bindings are not editable through the project patch contract;
- project creation and its governed source link are transactional;
- anonymous mutation is denied;
- no service-role credential is exposed to the browser.

The final pre-merge privilege verification and hardened migration are recorded in:

- `supabase/migrations/20260723130000_pit_slice4_rpc_only_mutation_boundary.sql`;
- `modules/pit/12-build/slice-4/red-to-green-and-rls-evidence-20260722.md`.

## Authenticated LFV and cleanup

Authenticated protected-preview LFV passed in workflow run `30006074390`:

1. sign in as the governed `project_manager` identity;
2. create a project;
3. open `/projects/:id`;
4. update the project;
5. reload and confirm persistence;
6. confirm the updated project in the register;
7. verify the record through the authenticated Supabase boundary.

The generated LFV project and source link were removed after evidence capture. Cleanup returned zero residual project and source-link rows.

Durable evidence: `modules/pit/12-build/slice-4/authenticated-deployed-lfv-evidence-20260723.md`.

## Slice 4 closure disposition

The following Slice 4 acceptance boundary is complete:

- Supabase-backed project and source-link persistence;
- stable project repository;
- authenticated actor and organisation binding;
- RLS/read isolation and role-controlled mutation;
- Project Register and Create Project integration;
- first `/projects/:id` overview/update workspace;
- deterministic route states;
- truthful browser-local compatibility treatment;
- current-head build, security, deployment, review and LFV evidence.

Issue #1943 may be closed after this reconciliation PR is merged.

## Remaining programme work

Stage 12 remains `AUTHORIZED_TO_START / INCOMPLETE`.

Still open:

- Issue #1944 — separate Slice 3 browser evidence debt;
- W8.3 project hierarchy beyond the project foundation: milestones, deliverables and tasks/action items;
- later assignments, evidence, timeline, roll-up, reporting, notifications and AIMC waves;
- full route coverage, CS2 L3 verification, handover and Stage 12 closure evidence.

## Non-completion notice

This record closes only the authorised Slice 4 boundary. It does not claim `FUNCTIONAL_PASS`, full PIT completion, Stage 12 completion, production/release readiness, handover completion or Issue #1944 completion.
