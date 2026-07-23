# PIT Build Progress Tracker — Stage 12 Slices Addendum

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Artifact type | Authoritative Stage 12 slice-status addendum |
| Stage | Stage 12 - Build Execution & Evidence |
| Date | 2026-07-23 |
| Status | ACTIVE — SLICE 4 MERGED / POST-MERGE VERIFIED / AUTHORISED BOUNDARY COMPLETE — STAGE 12 INCOMPLETE |
| Reconciliation authority | Issue #1964; implementation Issue #1943 |
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
| Slice 4 — Supabase Project Persistence and Project Detail Workspace Foundation | **MERGED / POST-MERGE VERIFIED / AUTHORISED BOUNDARY COMPLETE** | Issue #1943, PR #1952, merge `61ef3795d953ae11e0c153705729bff52aa3dc9f`, reconciliation #1964 |
| Next product wave — W8.3 Project Hierarchy | Not started; new governed scope required | Project → Milestones → Deliverables → Tasks / Action Items |

## Slice 4 governance and implementation ordering

The merged PR history proves:

1. PR-specific prebrief `80a3a5b911f6a41f0a0885dd666758a9d5595493`;
2. `pit-specialist` appointment `8f8c1662f9aee3c2aa1b6ac1e5ac08a6e3880585`;
3. first implementation/QA-to-RED commit `155b42e141c78a9fcd28ee9beefca0d104271d34`;
4. Build-to-GREEN implementation;
5. applied schema, privilege hardening and RPC-only mutation boundary;
6. authenticated deployed LFV;
7. fixture cleanup and temporary workflow removal;
8. final review closure and CS2 merge;
9. post-merge deployment verification.

The Builder Delegation Order Gate passed. The pre-repair branch state remains preserved at `backup/pr-1952-before-delegation-history-repair`.

## Supabase target and delivered database boundary

Slice 4 is bound to `APGI-cmy's Project` (`ujucvyyspfxlxlfdamda`).

Delivered and applied:

- `projects` and `source_links` tables;
- transactional `pit_create_project` and `pit_update_project` functions;
- organisation-member authenticated read policies;
- anonymous denial;
- authenticated table privileges restricted to `SELECT`;
- no authenticated direct `INSERT`, `UPDATE`, `DELETE` or `TRUNCATE` table path;
- mutation available only through checked `SECURITY DEFINER` RPCs;
- actor, active membership, role and immutable organisation/audit binding enforced in the mutation contract.

Transactional verification returned creator persistence, viewer denial, zero cross-organisation visibility and zero residual test projects.

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
- publishable/anonymous browser credential compatibility only; no service-role client boundary;
- app-owned cross-platform build launcher providing governed public client configuration when deployment variables are absent.

## Evidence and closure status

Completed:

- strict PR-specific delegation ancestry and gate proof;
- QA-to-RED commit;
- repository/validation tests GREEN;
- TypeScript compiler exit `0`, empty diagnostics;
- three migrations applied, ending with RPC-only hardening;
- RLS and privilege verification;
- RED-to-GREEN evidence;
- implementation-plan alignment;
- governance, security and CodeQL GREEN;
- ISMS Portal and PIT deployment/smoke GREEN;
- authenticated LFV run `30006074390` PASS;
- create → detail → update → reload → register and API verification PASS;
- LFV evidence at `modules/pit/12-build/slice-4/authenticated-deployed-lfv-evidence-20260723.md`;
- LFV project and source-link fixture removed with zero residual rows;
- PR-specific LFV workflow removed after evidence capture;
- PR #1952 merged at `61ef3795d953ae11e0c153705729bff52aa3dc9f`;
- post-merge deployment statuses GREEN;
- closure record at `modules/pit/12-build/slice-4/post-merge-verification-and-closure-20260723.md`.

## Outstanding programme work

- merge this reconciliation PR and close Issues #1964 and #1943;
- Issue #1944 formal authenticated browser evidence for Slice 3;
- next W8.3 hierarchy wave for milestones, deliverables and tasks/action items;
- later assignments, evidence, timeline, roll-up, reporting, notifications and AIMC waves;
- broader Stage 12 route/evidence coverage, CS2 L3 verification, handover and closure evidence.

## Supersession notice

The W8.2 addenda remain preserved for audit history but are superseded for current-state interpretation by this addendum:

- `modules/pit/BUILD_PROGRESS_TRACKER_PR1850_ALIGNMENT.md`;
- `modules/pit/BUILD_PROGRESS_TRACKER_W8_2_DISPOSITION_ADDENDUM.md`.

## Non-completion notice

Slice 4 is complete only for its authorised boundary. This addendum does not claim full PIT or Stage 12 completion, production/release readiness, `FUNCTIONAL_PASS`, handover completion or Issue #1944 completion.

PIT Stage 12 remains **AUTHORIZED_TO_START / INCOMPLETE**.
