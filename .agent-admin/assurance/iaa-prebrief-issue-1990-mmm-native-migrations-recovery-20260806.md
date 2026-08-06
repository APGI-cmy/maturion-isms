# Refreshed IAA Pre-Brief — Issue #1990 `mmm_native_migrations` Recovery

**Issue:** #1990  
**Replacement PR:** #2002 (apgi-cmy-mmm-2000-replacement-lane)  
**Branch:** `apgi-cmy-mmm-2000-replacement-lane`  
**IAA role:** independent-assurance-agent  
**Authority:** Johan Ras, CS2 — bounded follow-on recovery lane after merged #1992 baseline  
**Status:** PRE-BRIEF COMPLETE; implemented in PR #2002

## Assurance question

Can the repository source baseline recover the minimum replay-safe provenance for
`public.mmm_native_migrations` before `20260530000002_mmm_security_advisor_hardening.sql`
references it, without mutating production, reopening the already-merged Issue #1990 baseline
repairs, or expanding into PR #1973 / approval-runtime work?

## Executable QA-to-RED authority

The candidate RED authority for this bounded lane is the focused guard already identified in the
abandoned PR #2000 scope:

- `modules/MMM/tests/B4-framework/mmm-native-migrations-bootstrap.test.ts`

That guard expresses the lawful recovery target:

1. exactly one ordered source bootstrap for `public.mmm_native_migrations`;
2. bootstrap ordered before `20260530000002_mmm_security_advisor_hardening.sql`;
3. production-equivalent column contract (`name` PK, `applied_at default now()`);
4. RLS enabled with no extra policies, triggers, foreign keys, or client-role grants;
5. no pre-populated production ledger rows; and
6. no mutation of pre-existing migration bodies or workflow files.

No implementation-like change may be committed for this lane until the post-prebrief appointment
commit exists.

## Bounded implementation conditions

- Start from current `main` / merged #1992 head only.
- Recreate the lane lawfully: **pre-brief commit → builder appointment commit → first
  implementation commit**.
- Reconstruct only the minimum ordered bootstrap needed for `public.mmm_native_migrations`.
- Preserve all previously merged Issue #1990 migrations and governance artifacts unchanged unless a
  narrow test-only correction is required by this lane.
- Do not alter PR #1973 logic, approval-runtime work, application/runtime code, Edge Functions,
  Vercel, unrelated grants, or unrelated RLS semantics.
- Do not mutate production data or schema and do not treat the replacement lane as authority to
  merge or close Issue #1990 early.

## Required GREEN and replay proof

1. focused `mmm_native_migrations` controls GREEN on the replacement lane head;
2. current-head delegation/governance checks GREEN, including PR-scoped delegation evidence;
3. fresh GitHub-backed disposable preview replay proves the ordered source migration chain; and
4. frozen-head QP, ECAP, hosted checks, and independent IAA all PASS before merge consideration.

## Stop conditions

Stop and return to Foreman / CS2 if:

- replay requires prerequisites beyond the bounded `mmm_native_migrations` bootstrap;
- the recovery would require semantic changes to already-merged Issue #1990 migrations;
- the preview exposes a different baseline defect outside this lane; or
- a replacement PR number is unavailable for PR-scoped delegation evidence after the first lawful
  implementation commit is prepared.
