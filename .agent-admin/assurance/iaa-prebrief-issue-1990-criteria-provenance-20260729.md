# Refreshed IAA Pre-Brief — Issue #1990 `public.criteria` Provenance

**Action:** REFRESHED PRE-BRIEF  
**Issue / PR:** #1990 / draft #1992  
**Branch:** `fix/issue-1990-migration-baseline-reconciliation`  
**IAA role:** independent-assurance-agent  
**Authority:** Johan Ras, CS2 — bounded expansion recorded on Issue #1990 and PR #1992  
**Status:** PRE-BRIEF COMPLETE; implementation blocked pending executable RED record and appointment.

## Assurance question

Can the source baseline reproduce the production-equivalent `public.criteria` table at the correct ordered point—without altering `public.mmm_criteria`, the separate `mmm_native_migrations` ledger, production, or unrelated runtime behaviour?

## Proven production contract

- Four cascade foreign keys: `mini_performance_standards`, `domains`, `audits`, `organisations`.
- Unique `(audit_id, number)` constraint; no triggers or additional indexes beyond PK/unique.
- RLS enabled; SELECT to `authenticated`; INSERT and UPDATE to `public`, all using the existing profile-derived organisation predicate.
- Seven dependent tables and two replayed views require the table after it exists.

## QA-to-RED authority

`criteria-provenance-bootstrap.test.ts` was committed before implementation and included in the focused runner. The current source contains no `CREATE TABLE public.criteria`; consequently the suite must report RED until a single ordered source bootstrap exists.

Before creating a migration, the builder must execute:

`corepack pnpm vitest run --config modules/MMM/tests/vitest.migration-baseline-reconciliation.config.ts`

and post the exact RED count and failed controls on PR #1992. No inferred or unexecuted RED result is acceptable.

## Constraints

- Create any eventual migration through the discovered Supabase CLI command; do not invent a filename.
- Preserve the existing four reconciled bodies and the `profiles` bootstrap unchanged.
- Do not create or modify `mmm_native_migrations` in the criteria step.
- No production DDL/data, grants, functions, Edge Functions, Vercel, PR #1973, or application changes.
- Stop if a prerequisite is missing from replay or if criteria recovery reveals a material independent root migration.

## Required GREEN evidence

1. focused suite GREEN after a production-equivalent criteria bootstrap;
2. current-head delegation gate and hosted checks GREEN;
3. a fresh GitHub-backed disposable preview proves replay and schema parity for `criteria`;
4. only then analyse the remaining `mmm_native_migrations` parity gap.