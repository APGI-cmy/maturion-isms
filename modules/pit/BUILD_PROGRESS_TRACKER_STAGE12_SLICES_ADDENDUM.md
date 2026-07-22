# PIT Build Progress Tracker — Stage 12 Slices Addendum

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Artifact type | Authoritative Stage 12 slice-status addendum |
| Stage | Stage 12 - Build Execution & Evidence |
| Date | 2026-07-22 |
| Status | ACTIVE — SLICE 4 CODE/DATABASE GREEN / DEPLOYED LFV OPEN |
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
| Slice 4 — Supabase Project Persistence and Project Detail Workspace Foundation | Implementation PR active; QA-to-RED satisfied; code/database/RLS GREEN; final deployment, authenticated browser LFV and review open | Issue #1943, PR #1952 |

## Slice 4 governance and implementation ordering

The canonical ordering is recorded as:

1. governance wave task declaration;
2. QA-to-RED and Supabase/RLS contract;
3. canonical IAA preflight brief;
4. `pit-specialist` appointment and delegation;
5. PR-scoped delegation record;
6. first implementation/RED commit `4f31c3a1648357aee6c45f3e6e286eeab3f1a46a`;
7. Build-to-GREEN implementation;
8. applied migration and RLS verification;
9. deployed browser LFV and final review, still open.

The controlled implementation branch was aligned to PR #1947 merge commit `eb2348fd317bcdc513c5398b646e596c4a0cf56e` before implementation.

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

- QA-to-RED commit and delegation proof;
- repository/validation tests GREEN;
- TypeScript compiler exit `0`, empty diagnostics;
- migrations applied;
- RLS and privilege verification;
- RED-to-GREEN evidence filed;
- implementation-plan alignment filed.

Outstanding:

- Issue #1944 formal authenticated browser evidence for Slice 3;
- final current-head deployment and route-smoke evidence for PR #1952;
- authenticated Slice 4 browser create → register → detail → update trace;
- final review-conversation closure and independent/proxy review;
- merge, post-merge verification and Issue #1943 closure;
- Stage 12 closure evidence, full route coverage, LFV closure, CS2 L3 verification and handover.

## Supersession notice

The W8.2 addenda remain preserved for audit history but are superseded for current-state interpretation by this addendum:

- `modules/pit/BUILD_PROGRESS_TRACKER_PR1850_ALIGNMENT.md`;
- `modules/pit/BUILD_PROGRESS_TRACKER_W8_2_DISPOSITION_ADDENDUM.md`.

## Non-completion notice

This addendum does not claim:

- Slice 4 deployed browser LFV completion;
- PR #1952 merge readiness before final checks/review;
- full PIT or Stage 12 completion;
- production or release readiness;
- `FUNCTIONAL_PASS`;
- handover completion.

PIT Stage 12 remains **AUTHORIZED_TO_START / INCOMPLETE**.
