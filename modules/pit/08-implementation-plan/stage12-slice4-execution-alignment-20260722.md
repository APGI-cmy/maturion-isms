# PIT Stage 12 Slice 4 — Implementation Plan Execution Alignment

| Field | Value |
|---|---|
| Issue | #1943 |
| Implementation PR | #1952 |
| Parent plan | `modules/pit/08-implementation-plan/implementation-plan.md` |
| Governance baseline | PR #1945 |
| Tracker baseline | PR #1947 |
| Date | 2026-07-22 |
| Status | IMPLEMENTATION, GOVERNANCE AND DEPLOYMENT GREEN — AUTHENTICATED LFV EXTERNALLY BLOCKED |

## Purpose

This execution addendum narrows the broader W8.3 hierarchy plan to the authorised Slice 4 foundation. It does not expand into milestones, deliverables, tasks or timeline functionality.

## Executed sequence

| Step | Planned control | Current evidence |
|---|---|---|
| 1 | Bind target environment and tenancy contract | `supabase-target-and-auth-contract-20260722.md` |
| 2 | Commit PR-specific prebrief | `80a3a5b911f6a41f0a0885dd666758a9d5595493` |
| 3 | Appoint `pit-specialist` after prebrief | `8f8c1662f9aee3c2aa1b6ac1e5ac08a6e3880585` |
| 4 | Commit QA-to-RED before implementation | first implementation commit `155b42e141c78a9fcd28ee9beefca0d104271d34` |
| 5 | Build stable repository and validation | `pitProjectRepository.ts` and Slice 4 tests |
| 6 | Add Supabase tables, RPCs and RLS | two applied Slice 4 migrations |
| 7 | Wire authenticated session and organisation role context | `AuthContext.tsx`, `LoginForm.tsx`, Supabase client |
| 8 | Wire create/register/detail surfaces | `/projects/new`, `/projects`, `/projects/:id` |
| 9 | Prove compiler, RLS and current-head gates GREEN | `red-to-green-and-rls-evidence-20260722.md` |
| 10 | Deploy and smoke-test current head | ISMS Portal and PIT deployment workflows GREEN |
| 11 | Complete deployed authenticated LFV | BLOCKED: canonical Action secrets empty; documented identity unseeded; public signup email delivery failing |
| 12 | Final assurance, merge and post-merge verification | waits for Step 11 and CS2 action |

## Delivered scope

- `projects` and `source_links` persistence;
- stable repository abstraction;
- session-bound actor and organisation resolution;
- organisation-scoped RLS;
- controlled create and update roles;
- deterministic detail states;
- browser-local compatibility boundary without false migration claims;
- strict delegation ancestry repaired and verified;
- current-head governance, CodeQL, deployment and route-smoke evidence.

## External LFV dependency

The canonical LFV package requires the PIT test organisation and confirmed role identities to be seeded before execution. For the project-manager happy path, an authorised administrator must:

1. seed or confirm a Supabase Auth user for the governed project-manager test identity;
2. give it exactly one active organisation membership and `project_manager` role in the bound project;
3. configure `PIT_TEST_PROJECT_MANAGER_EMAIL` and `PIT_TEST_PROJECT_MANAGER_PASSWORD` as GitHub Actions secrets;
4. execute the authenticated create → detail → update → register browser journey;
5. remove the LFV-created project after evidence capture.

This is environment administration and secret provisioning, not remaining product implementation. Credentials may not be invented, committed or bypassed.

## Explicit exclusions retained

- milestones;
- deliverables;
- tasks;
- dependency/timeline engines;
- evidence uploads and approvals;
- notifications and reports;
- AIMC integration;
- full lifecycle or full PIT completion.

## Remaining exit criteria

- governed LFV identity and Action secrets provisioned;
- authenticated browser journey evidence completed and fixture cleaned;
- final proxy/IAA review;
- CS2 merge and post-merge verification.

No inline review threads or submitted reviews currently exist.

## Non-completion notice

This addendum aligns execution progress only. It does not claim authenticated browser LFV, merge readiness, `FUNCTIONAL_PASS`, Stage 12 completion, PIT completion or release readiness.
