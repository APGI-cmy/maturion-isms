# PR #1952 Wave Current Tasks

| Field | Value |
|---|---|
| Issue | #1943 |
| PR | #1952 |
| Wave | `pit-stage12-slice4-supabase-project-persistence` |
| Builder | `pit-specialist` |
| Status | IMPLEMENTATION / DATABASE / RPC-ONLY RLS BOUNDARY / DEPLOYMENT / AUTHENTICATED LFV / REVIEW GREEN — REBASE WITH CURRENT MAIN REQUIRED |
| Governed baseline | `eb2348fd317bcdc513c5398b646e596c4a0cf56e` |
| Supabase project | `ujucvyyspfxlxlfdamda` |
| PR-specific prebrief | `80a3a5b911f6a41f0a0885dd666758a9d5595493` |
| Builder appointment | `8f8c1662f9aee3c2aa1b6ac1e5ac08a6e3880585` |
| First implementation commit | `155b42e141c78a9fcd28ee9beefca0d104271d34` |
| Authenticated LFV run | `30006074390` — PASS |
| LFV evidence | `modules/pit/12-build/slice-4/authenticated-deployed-lfv-evidence-20260723.md` |
| Final reviewed head before rebase | `ad77f38b7e276bfac16dcd04d5f8195092c1b0ce` — all gates GREEN |

- [x] PIT-S4-IMP-000 — Branch aligned to the reconciled baseline.
- [x] PIT-S4-IMP-001 — Target Supabase and auth/organisation contract bound.
- [x] PIT-S4-IMP-002 — Implementation PR opened.
- [x] PIT-S4-IMP-003 — PR scope declaration filed.
- [x] PIT-S4-IMP-004 — Strict PR-specific prebrief → appointment → first implementation ancestry repaired and gate-verified.
- [x] PIT-S4-IMP-005 — QA-to-RED first implementation commit recorded.
- [x] PIT-S4-IMP-006 — RED failure condition captured before implementation.
- [x] PIT-S4-IMP-007 — Schema, privilege hardening and RLS implemented and applied.
- [x] PIT-S4-IMP-008 — Stable Supabase repository implemented.
- [x] PIT-S4-IMP-009 — Create/register/detail workspace implemented.
- [x] PIT-S4-IMP-010 — RED-to-GREEN, compiler and RLS evidence filed.
- [x] PIT-S4-IMP-011 — Implementation-plan and active progress alignment filed.
- [x] PIT-S4-IMP-012 — Governance, CodeQL, preview deployment and route-smoke gates GREEN.
- [x] PIT-S4-IMP-013 — Authenticated LFV identity and deployment protection controls established.
- [x] PIT-S4-DEP-001 — Governed project-manager identity confirmed with one active membership and role.
- [x] PIT-S4-DEP-002 — Governed identity and portal automation-bypass secrets configured.
- [x] PIT-S4-DEP-003 — Authenticated create → detail → update → reload → register LFV passed.
- [x] PIT-S4-DEP-004 — LFV project/source-link fixture removed with zero residue.
- [x] PIT-S4-DEP-005 — PR-specific LFV workflow removed after durable evidence filing.
- [x] PIT-S4-SEC-001 — Direct authenticated project/source-link mutation removed; writes are checked RPC-only.
- [x] PIT-S4-SEC-002 — Immutable organisation/audit binding protected at the database boundary.
- [x] PIT-S4-REV-001 — All Copilot/reviewer threads reconciled and resolved.
- [x] PIT-S4-REV-002 — Final reviewed head `ad77f38b...` passed all governance, CodeQL and deployment checks.
- [ ] PIT-S4-ADM-001 — Rebase/merge current `main` into the PR branch and re-run final checks; `main` is three unrelated commits ahead.
- [ ] PIT-S4-IMP-016 — CS2 merge and post-merge verification.

Slice 4 is not merged. This task record does not claim `FUNCTIONAL_PASS`, Stage 12 completion, PIT completion, production/release readiness or Issue #1944 completion.
