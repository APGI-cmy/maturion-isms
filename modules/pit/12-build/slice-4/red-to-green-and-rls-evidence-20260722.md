# PIT Stage 12 Slice 4 — RED-to-GREEN and RLS Evidence

| Field | Value |
|---|---|
| Issue | #1943 |
| PR | #1952 |
| Target | Supabase `ujucvyyspfxlxlfdamda` |
| PR-specific prebrief commit | `80a3a5b911f6a41f0a0885dd666758a9d5595493` |
| Builder appointment commit | `8f8c1662f9aee3c2aa1b6ac1e5ac08a6e3880585` |
| First implementation commit | `155b42e141c78a9fcd28ee9beefca0d104271d34` |
| Date | 2026-07-22; reconciled 2026-07-23 |
| Status | CODE, DATABASE, RLS, GOVERNANCE, DEPLOYMENT AND AUTHENTICATED LFV GREEN — FINAL CURRENT-HEAD REVIEW OPEN |

## QA-to-RED ordering

The active PR history proves:

1. prebrief `80a3a5b911f6a41f0a0885dd666758a9d5595493`;
2. builder appointment `8f8c1662f9aee3c2aa1b6ac1e5ac08a6e3880585`;
3. first implementation-like QA-to-RED test commit `155b42e141c78a9fcd28ee9beefca0d104271d34`;
4. reviewed GREEN implementation.

The earlier pre-repair branch is preserved at `backup/pr-1952-before-delegation-history-repair`.

## GREEN implementation delivered

- stable asynchronous project repository;
- Supabase session, active membership and role resolution;
- organisation-scoped project/source-link reads;
- transactional checked create/update RPCs;
- RPC-only mutation boundary;
- immutable organisation and audit binding;
- creator-capable creation and viewer denial;
- Project Register, Create Project and `/projects/:id` workspace;
- deterministic route states;
- truthful browser-local compatibility boundary;
- publishable/anonymous browser credential compatibility.

## Applied migrations

1. `20260722090000_pit_stage12_slice4_project_persistence.sql`;
2. `20260722105000_pit_slice4_privilege_hardening.sql`;
3. `20260723130000_pit_slice4_rpc_only_mutation_boundary.sql`.

All three were applied successfully to the bound project.

## Final privilege verification

Live inspection after the final migration confirms:

```json
{
  "projects_select": true,
  "projects_insert": false,
  "projects_update": false,
  "projects_delete": false,
  "source_links_select": true,
  "source_links_insert": false,
  "source_links_update": false,
  "source_links_delete": false,
  "anon_any_projects": false,
  "anon_any_source_links": false
}
```

Both mutation RPCs are `SECURITY DEFINER`, have fixed search paths, execute active membership/role checks internally, and are executable only by `authenticated` and `service_role` in addition to their owner. Direct authenticated table writes cannot create orphan projects or alter immutable binding/audit columns.

## Transactional RLS scenario

```json
{
  "creator_project_persisted": true,
  "viewer_denied": true,
  "cross_org_visible": 0,
  "residual_projects": 0
}
```

## Authenticated deployed LFV

Protected-preview workflow run `30006074390` passed:

- governed identity validation;
- ISMS Vercel protection bypass;
- password authentication;
- project creation;
- project detail load;
- update and save;
- update persistence after reload;
- Project Register visibility;
- direct Supabase API verification.

The generated project `ae89ddd2-1656-4dd0-a1bc-dc8743a9b723` and its source link were removed after evidence capture. Verification returned zero residual rows.

The temporary PR-specific LFV workflow was removed after the durable evidence file `authenticated-deployed-lfv-evidence-20260723.md` was committed. No permanent hard-coded preview workflow remains.

## Client environment compatibility

The portal accepts:

- `VITE_SUPABASE_URL`;
- preferred `VITE_SUPABASE_PUBLISHABLE_KEY`;
- established `VITE_SUPABASE_ANON_KEY` as a backward-compatible browser-safe fallback.

The app-owned build launcher supplies the governed public configuration for the current portal deployment. No service-role key is present in the client boundary.

## Compiler and gate evidence

Before final review fixes, TypeScript, delegation, POLC, CodeQL, routing, ECAP, Wave 7, merge-check alignment, ISMS Portal deployment/smoke and PIT deployment were GREEN. All final-head checks must be re-read after the review-hardening commits before merge recommendation.

## Review reconciliation

Review findings concerning direct table mutation, immutable-column updates, environment-key compatibility and evidence inconsistencies were accepted and corrected. Final thread resolution is recorded on PR #1952.

## Non-completion notice

This evidence supports Slice 4 merge-readiness review only. It does not claim Stage 12 completion, full PIT completion, release readiness, `FUNCTIONAL_PASS` or handover completion.
