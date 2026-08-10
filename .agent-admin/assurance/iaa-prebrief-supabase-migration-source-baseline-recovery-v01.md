IAA_PREFLIGHT_BRIEF

PR: #1986
WAVE: SUPABASE-MIGRATION-SOURCE-BASELINE-RECOVERY-20260728
BRANCH: recover-missing-applied-migration-sources
BASE_BRANCH: main
GOVERNING_ISSUE: #1987
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA
WAVE_TASKS_PATH: .agent-admin/prs/pr-1986/wave-current-tasks.md
AUTHORITY: CS2 — Johan Ras
DATE: 2026-07-28
PHASE: GOVERNANCE_NORMALIZATION

## Wave identity

This pre-brief is scoped exclusively to wave `supabase-migration-source-baseline-recovery-20260728`, governed by Issue #1987 and PR #1986. It does NOT inherit from, reference, or bind to wave `wave-mmm-descriptor-hardening-retry-2026-07-01`, Issue #1883, or PR #1893.

## Objective

Source-only reconciliation of four migration files already recorded as applied in the bound Supabase project `ujucvyyspfxlxlfdamda` but absent from the `main` branch commit history:

1. `20260722102655_pit_stage12_slice4_project_persistence` — recovered verbatim from merged PR #1952 (PIT Slice 4 provenance).
2. `20260722104224_pit_slice4_privilege_hardening` — recovered verbatim from merged PR #1952 (PIT Slice 4 provenance).
3. `20260723141559_pit_slice4_rpc_only_mutation_boundary` — recovered verbatim from merged PR #1952 (PIT Slice 4 provenance).
4. `20260728070417_mmm_rls_private_helper_policy_reconciliation` — recreates seven MMM RLS policies using `app_private.mmm_current_user_org_id()` per Issue #1959 (MMM policy provenance).

## Dependencies

- PIT Slice 4 provenance: merged PR #1952 (three migrations recovered verbatim under live-recorded version identifiers).
- MMM policy provenance: Issue #1959 (seven policies and `app_private.mmm_current_user_org_id()` definitions).

EXPECTED_QA_SCOPE:
- verify the four recovered migration file contents match the live Supabase project `ujucvyyspfxlxlfdamda` migration history;
- confirm the three PIT Slice 4 migrations are semantically identical to merged PR #1952 (only difference may be a missing trailing newline);
- confirm the seven MMM RLS policies in the fourth migration match the live database policy definitions and use `app_private.mmm_current_user_org_id()`;
- confirm no SQL is applied to the bound live project during validation;
- confirm migration bootstrap succeeds in a clean, disposable/local Supabase environment covering all 23 migrations;
- confirm no new migration is applied, no RLS is weakened, no service-role is exposed, and no credential is committed.

EXPECTED_FAILURE_MODES:
- clean-environment migration bootstrap failure if any migration source is materially incorrect or corrupted;
- Supabase CLI migration validation failure if the recovered filenames or version timestamps do not match the applied migration history;
- gate rejection if this prebrief is found bound to the wrong wave, issue, or PR identity.

FOREMAN_INSTRUCTIONS:
- do not apply any migration to `ujucvyyspfxlxlfdamda` or any other live environment;
- do not run `db push`, `apply_migration`, `execute_sql`, rebase, reset, or merge on `ujucvyyspfxlxlfdamda`;
- use only a new clean, disposable/local Supabase environment for migration bootstrap validation;
- record the clean-environment project/branch reference and lifecycle evidence but never secret material;
- require the clean migration bootstrap result before progressing to QP, ECAP, or IAA;
- QP, ECAP, and independent IAA are explicitly withheld until the migration validation result is accepted by Foreman;
- do not self-certify QP, ECAP, or IAA from this pre-brief alone;
- do not merge, change PR state, or resume PR #1981 until CS2 accepts the complete governed disposition.

IAA_WILL_QA:
- correct wave, issue, and PR identity binding (must be Issue #1987 / PR #1986 / wave `supabase-migration-source-baseline-recovery-20260728`; must not reference the stale MMM wave or Issue #1883 / PR #1893);
- four recovered migration filenames and version timestamps match the live `ujucvyyspfxlxlfdamda` migration history;
- three PIT Slice 4 migrations are semantically identical to merged PR #1952 provenance;
- four MMM RLS policies and `app_private.mmm_current_user_org_id()` match the live database policy definitions;
- clean-environment migration bootstrap raw command/result evidence is present;
- no migration was applied to the bound live project;
- no RLS weakening, no public-helper grants, no service-role exposure, no credential sharing.

RESULT: PREFLIGHT_BRIEF_COMPLETE
