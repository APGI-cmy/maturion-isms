# Refreshed IAA Pre-Brief — Issue #1990 Audit-Model Prerequisites

**Issue / PR:** #1990 / draft #1992  
**Branch:** `fix/issue-1990-migration-baseline-reconciliation`  
**Authority:** Johan Ras, CS2 — bounded prerequisite-reconciliation expansion, 4 August 2026  
**Status:** PRE-BRIEF COMPLETE; implementation blocked pending the appointment recorded after this artifact.

## Assurance question

Can the active source baseline reproduce the proven `audits → domains →
mini_performance_standards → criteria` chain, including its RLS and exclusion-cascade
behaviour, without extending the scope into the separate `mmm_native_migrations` ledger or
any unrelated legacy model?

## Executable QA-to-RED evidence

Commit `b9b5422f750361394bdcd3751f0feef7b90fc3ec` added the inventory record and focused
test. Executed against that exact head, the focused suite reported **14 passed / 5 failed**:

1. missing `public.audits` source bootstrap;
2. missing `public.domains` source bootstrap;
3. missing `public.mini_performance_standards` source bootstrap;
4. missing post-criteria exclusion-cascade recovery;
5. the existing `criteria` ordering control remains red because those three predecessors are absent.

The RED result is source-structural, not a runner or production failure. No production DDL or
data query was executed.

## Bounded implementation conditions

- Use `supabase migration new` to create every new migration filename; never invent one.
- Reconstruct only the audited production contract: columns, nullability/defaults, constraints,
  RLS policy names/commands/roles/predicates, and the two exclusion-cascade triggers.
- Preserve order: existing organisations/profiles before the recovered tables; all three before
  the existing criteria bootstrap; cascade function/triggers only after criteria exists.
- Preserve the existing four migration identity reconciliations, profiles bootstrap, and
  criteria bootstrap unchanged unless a test-only correction is required.
- No grants, unproven functions, production mutation/data access, `mmm_native_migrations`,
  PR #1973, feature work, Edge Functions, Vercel/runtime change, QP/ECAP/IAA-PASS, merge, or closure.

## Required GREEN and replay proof

1. focused suite reaches GREEN at the builder's returned head;
2. current-head delegation/governance checks are GREEN;
3. a fresh GitHub-backed disposable preview applies the complete chain and confirms the three
   table contracts and criteria predecessors; and
4. the preview is deleted after evidence capture. Only then may the lane assess the remaining
   `mmm_native_migrations` gap.

