# Refreshed IAA Pre-Brief — Issue #1990 Foundational `public.profiles` Bootstrap

**Action:** REFRESHED PRE-BRIEF  
**Issue / PR:** #1990 / #1992  
**Branch:** `fix/issue-1990-migration-baseline-reconciliation`  
**IAA role:** independent-assurance-agent  
**Authority:** CS2-authorised scope expansion recorded on Issue #1990  
**Status:** PREFLIGHT_BRIEF_COMPLETE — implementation not yet appointed

## Assurance question

Can the source baseline create `public.profiles` before the reconciled PIT projects migration, while reproducing the production-proven identity, organisation and own-row RLS posture without mutating production or expanding into application/runtime work?

## Refreshed QA-to-RED authority

Commit `a42fab96ae46dd2386ecc6b3ff7c33b7fbddde90` establishes the executable authority. On the current source baseline it returns **6 GREEN / 3 RED**:

- GREEN: all four prior filename/body identity reconciliation controls;
- RED: no ordered migration creates `public.profiles` before `20260722102655_pit_stage12_slice4_project_persistence.sql`;
- RED: no source definition provides the production-proven `auth.users(id)` cascade identity link and `public.organisations(id)` dependency;
- RED: no source definition enables RLS with own-row SELECT, INSERT and UPDATE protection.

## Builder constraints

- The builder may not create a bootstrap migration until after the separate appointment record is committed.
- Use the Supabase CLI's discovered migration-creation command to create any migration file; do not invent a filename.
- Reconstruct from production metadata and current source evidence only. Do not copy retired MAT legacy SQL wholesale.
- Keep the existing four migration-identity repairs byte-for-byte unchanged.
- Do not run DDL or data changes against production; do not alter PR #1973, Edge Functions, Vercel, grants, helper functions, or application code.

## Required GREEN evidence

1. All nine focused controls GREEN after implementation.
2. One ordered, replay-safe bootstrap with no duplicate `public.profiles` definition.
3. GitHub-backed disposable preview applies the full source migration chain and contains PIT, MMM and foundational profile schema.
4. Security/advisor review, frozen-head QP, ECAP, hosted checks, and independent IAA all PASS before merge consideration.

## Stop conditions

Stop and return to CS2 if production reveals additional direct prerequisites beyond `auth.users` and `public.organisations`, if a migration replay requires semantic change outside the stated scope, or if the preview fails for a different baseline defect.
