# PIT Build Progress Tracker — Stage 12 Slices Addendum

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Artifact type | Authoritative Stage 12 slice-status addendum |
| Stage | Stage 12 - Build Execution & Evidence |
| Date | 2026-07-22 |
| Status | ACTIVE — SLICE 4 IMPLEMENTATION/GATES/DEPLOYMENT GREEN / AUTHENTICATED LFV EXTERNALLY BLOCKED |
| Reconciliation authority | Issue #1946; implementation Issue #1943 |
| Applies to | `modules/pit/BUILD_PROGRESS_TRACKER.md` until incorporated into a later direct tracker revision |

## Operating controls

- CS2 authority remains Johan Ras.
- Foreman orchestrates, delegates, verifies and controls; appointed builders implement.
- No QA-to-RED means no build.
- ECAP remains administrative only.
- Final assurance and CS2 merge authority remain separate from builder output.
- No slice status may be interpreted as full PIT, Stage 12, production or release completion.

## Current Stage 12 slice status

| Slice | Status | Reference |
|---|---|---|
| Stage 12 kickoff | Authorized / incomplete | Issue #1767, PR #1768 |
| Slice 1 / W8.2 boundary evidence | Accepted for boundary/linkup only | PR #1869 |
| Slice 2 — Project Workspace Foundation | Implemented and merged; formal browser evidence still pending | PR #1877 |
| Slice 2.1 — Entry journey specification | Specification merged | PR #1888 |
| Slice 2.2 — Entry planning | Completed and issue closed | Issue #1891, PR #1894, PR #1925 |
| Slice 2.3 — Entry implementation | Completed for authorized boundary and issue closed; uncaptured browser evidence remains outstanding | Issue #1896, PR #1910, PR #1925 |
| Slice 3 — Project Register / Project Creation Persistence Foundation | Implemented and merged for the authorized browser-local boundary; formal authenticated browser evidence remains outstanding | Issue #1934, PR #1935, merge commit `bd2c35545e1884bf5a450e892f46689e1c5570bd` |
| Slice 3 browser evidence | Open evidence-only action; no runtime expansion authorized | Issue #1944 |
| Slice 4 — Supabase Project Persistence and Project Detail Workspace Foundation | Runtime, database, RLS, governance, CodeQL and preview deployment GREEN; authenticated browser LFV blocked by missing governed identity seed and Action secrets | Issue #1943, draft PR #1952 |

## Slice 4 governance and implementation ordering

The active PR history now proves:

1. PR-specific prebrief `80a3a5b911f6a41f0a0885dd666758a9d5595493`;
2. `pit-specialist` appointment `8f8c1662f9aee3c2aa1b6ac1e5ac08a6e3880585`;
3. first implementation/QA-to-RED commit `155b42e141c78a9fcd28ee9beefca0d104271d34`;
4. Build-to-GREEN implementation;
5. applied migration and RLS verification;
6. current-head governance, CodeQL and deployment verification.

The Builder Delegation Order Gate passes. The pre-repair branch state is preserved at `backup/pr-1952-before-delegation-history-repair`.

## Supabase target and delivered database boundary

Slice 4 is bound to `APGI-cmy's Project` (`ujucvyyspfxlxlfdamda`).

Delivered and applied:

- `projects` and `source_links` tables;
- transactional `pit_create_project` and `pit_update_project` functions;
- organisation-member read policies;
- creator-capable insert policies;
- authorised update policies;
- parent-constrained source-link access;
- anonymous denial;
- authenticated privilege hardening to `SELECT`, `INSERT`, `UPDATE` only.

Transactional RLS verification returned:

```json
{"creator_project_persisted":true,"viewer_denied":true,"cross_org_visible":0,"residual_projects":0}
```

## Delivered application boundary

- real Supabase password session restoration;
- single active organisation membership and role resolution;
- stable asynchronous PIT project repository;
- validation and fail-closed authentication behavior;
- Supabase Project Register;
- transactional Create Project route;
- `/projects/:id` overview/update workspace;
- deterministic loading, denied, error, not-found and data states;
- truthful non-migration treatment of browser-local records;
- publishable browser credential only; no service-role client boundary.

## Evidence and implementation status

Completed:

- strict PR-specific delegation ancestry and gate proof;
- QA-to-RED commit;
- repository/validation tests GREEN;
- TypeScript compiler exit `0`, empty diagnostics;
- migrations applied;
- RLS and privilege verification;
- RED-to-GREEN evidence filed;
- implementation-plan alignment filed;
- all current-head governance and security gates GREEN;
- CodeQL GREEN;
- ISMS Portal and PIT preview deployment/smoke GREEN;
- review-thread inventory complete with no threads or submitted reviews.

## Authenticated LFV dependency

The canonical LFV package requires a seeded PIT test organisation and confirmed role identities before browser execution. Current verification found:

- `PIT_TEST_PROJECT_MANAGER_EMAIL` and `PIT_TEST_PROJECT_MANAGER_PASSWORD` are not configured in the GitHub Actions environment;
- the documented design identity `pit.pm@test.maturion.dev` is not present in the bound Supabase Auth project;
- public signup cannot be used as a substitute because Supabase confirmation-email delivery returns `unexpected_failure: Error sending confirmation email`;
- no credential was invented, committed or bypassed.

Required administrator actions:

1. seed or confirm the governed project-manager test identity;
2. assign exactly one active organisation membership and `project_manager` role;
3. configure the two canonical Action secrets;
4. execute and evidence create → detail → update → register LFV;
5. clean up the LFV-created project.

This is the sole Slice 4 merge-readiness blocker and is environment/secret administration rather than remaining product implementation.

## Outstanding

- Issue #1944 formal authenticated browser evidence for Slice 3;
- Slice 4 governed identity/secret provisioning and authenticated browser LFV;
- final proxy/IAA review after LFV;
- merge, post-merge verification and Issue #1943 closure;
- broader Stage 12 closure evidence, full route coverage, CS2 L3 verification and handover.

## Supersession notice

The W8.2 addenda remain preserved for audit history but are superseded for current-state interpretation by this addendum:

- `modules/pit/BUILD_PROGRESS_TRACKER_PR1850_ALIGNMENT.md`;
- `modules/pit/BUILD_PROGRESS_TRACKER_W8_2_DISPOSITION_ADDENDUM.md`.

## Non-completion notice

This addendum does not claim authenticated browser LFV completion, PR #1952 merge readiness, full PIT or Stage 12 completion, production/release readiness, `FUNCTIONAL_PASS` or handover completion.

PIT Stage 12 remains **AUTHORIZED_TO_START / INCOMPLETE**.
