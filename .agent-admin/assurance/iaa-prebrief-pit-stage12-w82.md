# IAA Prebrief - PIT Stage 12 W8.2

IAA_PREFLIGHT_BRIEF: true
PR: TBD
ISSUE: 1774
WAVE: PIT_STAGE12_W8_2_RLS_DENIED_PATHS
WAVE_TASKS_PATH: modules/pit/12-build/w82-rls-denied-path-evidence.md
CURRENT_HEAD_SHA: CURRENT_HEAD

## PRE-BRIEF

Scope is limited to the first W8.2 RLS-first access and denied-path foundation slice.

## EXPECTED_QA_SCOPE

- Verify admin routes are constants and wired through protected route shells.
- Verify access helper denies unauthenticated, cross-org, and role-denied cases.
- Verify tests are meaningful and not placeholder tests.
- Verify W8.2 does not claim live Supabase RLS policy execution.
- Verify no W8.3/W8.5/W8.6 scope expansion.

## EXPECTED_FAILURE_MODES

- Cross-org access allowed.
- Role-denied access allowed.
- Admin routes exposed as public routes.
- Live RLS or deployed denied-path evidence claimed without proof.
- FUNCTIONAL_PASS or Stage 12 completion claimed prematurely.

## FOREMAN_INSTRUCTIONS

Keep the PR limited to W8.2 foundation work, report CI and Vercel status honestly, and preserve the no-FUNCTIONAL_PASS posture.

## IAA_WILL_QA

IAA will review access-decision tests, admin route shell wiring, ECAP, Foreman QP, functional-delivery profile, and W8.2 evidence ledger before handover.

RESULT: PREFLIGHT_BRIEF_COMPLETE
