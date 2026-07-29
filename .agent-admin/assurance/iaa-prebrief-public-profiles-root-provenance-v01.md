IAA_PREFLIGHT_BRIEF

PR: #1994
WAVE: PUBLIC-PROFILES-ROOT-PROVENANCE-RECOVERY-20260729
BRANCH: copilot/recover-public-profiles-root-migration-20260729
BASE_BRANCH: main
GOVERNING_ISSUE: #1993
AUTHORITY: CS2 — Johan Ras
DATE: 2026-07-29
PHASE: SOURCE_RECOVERY_DRAFT

## Objective

Review the source-only recovery of the missing `public.profiles` foundation. The required source must be ordered after ISMS W6 persistence audit and before the recovered PIT Slice 4 project-persistence source.

## Automation-boundary fact

The pre-existing repository-managed Supabase Git integration automatically created a non-production preview branch for this draft and processed the new migration. This is not an authorised clean-bootstrap run. IAA must treat it only as an automation-boundary exception requiring explicit disposition; it cannot be used to certify source correctness, bootstrap success, QP, ECAP, or merge readiness.

The production migration ledger remains without version `20260615000000`.

## IAA must verify

- Exactly one root migration is added.
- The migration contains only the 11 stated live-compatible columns and defaults.
- It defines only the two stated foreign keys, RLS, and `profiles_select_own`, `profiles_insert_own`, and `profiles_update_own`.
- The policies are self-only using `auth.uid() = id`.
- No legacy MAT object, trigger, storage operation, broad grant, runtime code, workflow, credential, or production change is introduced.
- The first commit’s QA guard is an honest intended-RED guard against prior `main`.
- PR #1986 and PR #1981 remain unchanged.

## Withheld decisions

This is not an IAA disposition. QP, ECAP, independent IAA, clean-bootstrap validation, merge recommendation, production migration, and downstream QA resumption remain withheld.

RESULT: PREFLIGHT_BRIEF_COMPLETE
