# PR #1986 Wave Current Tasks

PR: #1986
WAVE: SUPABASE-MIGRATION-SOURCE-BASELINE-RECOVERY-20260728
GOVERNING_ISSUE: #1987
BASE_BRANCH: main
STATUS: GOVERNANCE_NORMALIZATION — QP_WITHHELD — ECAP_WITHHELD — IAA_WITHHELD — PENDING_CLEAN_MIGRATION_VALIDATION
CS2_AUTHORITY: Johan Ras
DATE: 2026-07-28

iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-supabase-migration-source-baseline-recovery-v01.md

IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-prebrief-supabase-migration-source-baseline-recovery-v01.md
IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-07-28T11:15:00Z
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: no

## Wave identity

This wave is `supabase-migration-source-baseline-recovery-20260728` governed by Issue #1987 and PR #1986.

The obsolete MMM descriptor-hardening wave (`wave-mmm-descriptor-hardening-retry-2026-07-01`, Issue #1883, PR #1893) is **not active for this PR** and must not be used for any pre-brief, QP, ECAP, or IAA action on PR #1986.

## Objective

Source-only reconciliation of four already-applied migration sources absent from `main`:

1. `20260722102655_pit_stage12_slice4_project_persistence` — PIT Slice 4 provenance (PR #1952).
2. `20260722104224_pit_slice4_privilege_hardening` — PIT Slice 4 provenance (PR #1952).
3. `20260723141559_pit_slice4_rpc_only_mutation_boundary` — PIT Slice 4 provenance (PR #1952).
4. `20260728070417_mmm_rls_private_helper_policy_reconciliation` — MMM policy provenance (Issue #1959).

## Artifact references

- IAA pre-brief: `.agent-admin/assurance/iaa-prebrief-supabase-migration-source-baseline-recovery-v01.md`
- Scope declaration: `.agent-admin/scope-declarations/pr-1986.md`
- Delegation order: `.agent-admin/control/delegation-orders/pr-1986.json`
- PR manifest: `.admin/prs/pr-1986.json`

## Phase sequence

1. `GOVERNANCE_NORMALIZATION` (current) — create correct wave identity, scope, and pre-brief bindings; override stale MMM wave.
2. `CLEAN_MIGRATION_VALIDATION` (next, requires Foreman acceptance of normalized head) — run supported Supabase CLI migration validation in a clean, disposable/local environment; preserve raw command/result evidence.
3. `QP_ECAP_IAA_DISPOSITION` (withheld) — requires clean-environment validation result accepted by Foreman; no self-certification.
4. `CS2_MERGE_REVIEW` — explicit CS2 merge gate after all governed dispositions.

## Isolation prohibitions

- No `db push`, `apply_migration`, `execute_sql`, rebase, reset, or merge on `ujucvyyspfxlxlfdamda`.
- No PR merge, state change, or PR #1981 resumption until CS2 merge gate is reached.
- No credential sharing or secret material in any commit.

## Active tasks

- [x] Recover four already-applied migration sources as source-only commits.
- [x] Governance normalization: create wave identity, pre-brief, scope declaration, and delegation order for PR #1986 / Issue #1987.
- [x] Override stale MMM wave identity in this PR's artifacts.
- [ ] Obtain Foreman acceptance of the normalized current head.
- [ ] Run Supabase CLI migration validation in clean, disposable/local environment.
- [ ] Preserve raw clean-environment validation evidence.
- [ ] Complete Foreman QP.
- [ ] Complete ECAP.
- [ ] Obtain independent IAA.
- [ ] Return `READY FOR CS2 MERGE REVIEW`.
