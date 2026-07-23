# PIT Stage 12 Slice 4 — Implementation Plan Execution Alignment

| Field | Value |
|---|---|
| Issue | #1943 |
| Implementation PR | #1952 |
| Parent plan | `modules/pit/08-implementation-plan/implementation-plan.md` |
| Governance baseline | PR #1945 |
| Tracker baseline | PR #1947 |
| Date | 2026-07-23 |
| Status | IMPLEMENTATION, DATABASE, RLS, DEPLOYMENT AND AUTHENTICATED LFV GREEN — FINAL CURRENT-HEAD REVIEW OPEN |

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
| 9 | Prove compiler, RLS and Build-to-GREEN evidence | `red-to-green-and-rls-evidence-20260722.md` |
| 10 | Deploy and smoke-test | ISMS Portal and PIT deployment workflows GREEN |
| 11 | Complete deployed authenticated LFV | workflow run `30006074390` PASS; durable evidence filed |
| 12 | Remove LFV fixture and temporary runner | zero project/source-link residue; PR-specific workflow removed |
| 13 | Final assurance and merge disposition | current-head checks and review inventory pending |
| 14 | Post-merge verification | waits for CS2 merge authority |

## Delivered scope

- `projects` and `source_links` persistence;
- stable repository abstraction;
- session-bound actor and organisation resolution;
- organisation-scoped RLS;
- controlled create and update roles;
- deterministic detail states;
- browser-local compatibility boundary without false migration claims;
- strict delegation ancestry repaired and verified;
- deployed public Supabase client configuration through the app-owned build launcher;
- authenticated create → detail → update → reload → register LFV.

## Authenticated deployed LFV result

The governed `project_manager` identity passed the complete protected-preview journey:

- authentication;
- valid project creation;
- Supabase persistence;
- project-detail rendering;
- authorised update;
- update survival after reload;
- Project Register visibility;
- authenticated API verification.

Evidence: `modules/pit/12-build/slice-4/authenticated-deployed-lfv-evidence-20260723.md`.

The generated project `ae89ddd2-1656-4dd0-a1bc-dc8743a9b723` and its source link were deleted after capture, with zero residual rows verified.

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

- final current-head governance, security, CodeQL and deployment checks GREEN after evidence/workflow cleanup;
- final review-thread inventory and proxy/IAA disposition;
- CS2 merge;
- post-merge verification and Issue #1943 closure.

## Non-completion notice

This addendum records Slice 4 execution and LFV progress only. It does not claim merge completion, `FUNCTIONAL_PASS`, Stage 12 completion, PIT completion, release readiness or completion of separate Issue #1944.
