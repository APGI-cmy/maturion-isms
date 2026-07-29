# PR #1994 Wave Current Tasks

PR: #1994
WAVE: PUBLIC-PROFILES-ROOT-PROVENANCE-RECOVERY-20260729
GOVERNING_ISSUE: #1993
BASE_BRANCH: main
STATUS: SOURCE_RECOVERY_DRAFT — FOREMAN_INTAKE_PENDING — QP_WITHHELD — ECAP_WITHHELD — IAA_WITHHELD — MERGE_NO_GO
CS2_AUTHORITY: Johan Ras
DATE: 2026-07-29

## Required sequence and evidence

1. [x] Commit the PR-specific QA-to-RED guard first.
   - Intended RED against `main`: the expected root migration source file is absent.
   - The guard checks migration ordering, 11 columns/defaults, both foreign keys, RLS, three self-only policies, and prohibited unrelated legacy objects.
2. [x] Add exactly one idempotent root migration, ordered after `20260610180000_isms_w6_persistence_audit.sql` and before `20260722102655_pit_stage12_slice4_project_persistence.sql`.
3. [x] Record scope, appointment, source/live comparison, and ancestry.
4. [ ] Foreman intake of the exact draft-PR head.
5. [ ] Independent source review.
6. [ ] Fresh isolated clean-bootstrap validation of the eventually reconciled inventory.
7. [ ] Foreman QP, ECAP, and independent IAA.
8. [ ] CS2 merge review.

## Isolation prohibitions

- No `db push`, `apply_migration`, `execute_sql`, project/branch creation, rebase, reset, or merge on any Supabase resource.
- No change to APGI-cmy’s Project, PR #1986, PR #1981, runtime code, workflows, credentials, or deployment configuration.
- No claim that this draft has passed clean bootstrap or is ready to merge.
