# PIT Stage 12 Slice 4 — Implementation Plan Execution Alignment

| Field | Value |
|---|---|
| Issue | #1943 |
| Reconciliation issue | #1964 |
| Implementation PR | #1952 |
| Merge commit | `61ef3795d953ae11e0c153705729bff52aa3dc9f` |
| Parent plan | `modules/pit/08-implementation-plan/implementation-plan.md` |
| Governance baseline | PR #1945 |
| Tracker baseline | PR #1947 |
| Date | 2026-07-23 |
| Status | MERGED / POST-MERGE VERIFIED — AUTHORISED SLICE 4 BOUNDARY COMPLETE |

## Purpose

This execution addendum narrows the broader W8.3 project-hierarchy plan to the completed Slice 4 project-persistence and project-detail foundation. It does not claim delivery of milestones, deliverables, tasks or timeline functionality.

## Executed sequence

| Step | Planned control | Final evidence |
|---|---|---|
| 1 | Bind target environment and tenancy contract | `supabase-target-and-auth-contract-20260722.md` |
| 2 | Commit PR-specific prebrief | `80a3a5b911f6a41f0a0885dd666758a9d5595493` |
| 3 | Appoint `pit-specialist` after prebrief | `8f8c1662f9aee3c2aa1b6ac1e5ac08a6e3880585` |
| 4 | Commit QA-to-RED before implementation | first implementation commit `155b42e141c78a9fcd28ee9beefca0d104271d34` |
| 5 | Build stable repository and validation | `pitProjectRepository.ts` and Slice 4 tests |
| 6 | Add Supabase tables, RPCs and RLS | three applied Slice 4 migrations, ending in RPC-only mutation hardening |
| 7 | Wire authenticated session and organisation role context | `AuthContext.tsx`, `LoginForm.tsx`, Supabase client |
| 8 | Wire create/register/detail surfaces | `/projects/new`, `/projects`, `/projects/:id` |
| 9 | Prove compiler, RLS and Build-to-GREEN evidence | `red-to-green-and-rls-evidence-20260722.md` |
| 10 | Deploy and smoke-test | ISMS Portal and PIT deployment workflows GREEN |
| 11 | Complete deployed authenticated LFV | workflow run `30006074390` PASS; durable evidence filed |
| 12 | Remove LFV fixture and temporary runner | zero project/source-link residue; PR-specific workflow removed |
| 13 | Complete final assurance and review | all review threads resolved; governance, CodeQL and deployments GREEN |
| 14 | CS2 merge | PR #1952 merged at `61ef3795d953ae11e0c153705729bff52aa3dc9f` |
| 15 | Post-merge verification | `post-merge-verification-and-closure-20260723.md` |

## Delivered scope

- `projects` and `source_links` persistence;
- stable repository abstraction;
- session-bound actor and organisation resolution;
- organisation-scoped authenticated reads;
- RPC-only controlled create and update mutation boundary;
- immutable organisation/creator/audit binding through the RPC contract;
- deterministic detail states;
- browser-local compatibility boundary without false migration claims;
- strict delegation ancestry and QA-to-RED ordering;
- deployed public Supabase client configuration through the app-owned build launcher;
- authenticated create → detail → update → reload → register LFV;
- successful merge and post-merge deployment verification.

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

The generated project and its source link were deleted after capture, with zero residual rows verified.

## Slice 4 closure

Slice 4 is complete for its authorised foundation boundary. Issue #1943 may be closed after the reconciliation PR for Issue #1964 is merged.

## Next implementation boundary

The next product build remains within approved **W8.3 — Project Hierarchy** and should add the hierarchy beneath the now-persisted project:

`Project → Milestones → Deliverables → Tasks / Action Items`

The next governed wave must begin with its own scope, prebrief, builder appointment/delegation and QA-to-RED contract. It should not be combined with Issue #1944, which remains a separate Slice 3 evidence-only action.

## Explicit exclusions retained

- dependency/timeline engines;
- evidence uploads and approvals;
- notifications and reports;
- AIMC integration;
- full lifecycle or full PIT completion.

## Non-completion notice

This addendum closes Slice 4 only. It does not claim `FUNCTIONAL_PASS`, Stage 12 completion, PIT completion, release readiness, handover completion or completion of separate Issue #1944.
