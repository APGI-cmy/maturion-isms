# IAA Prebrief - PIT Stage 12 W8.1 Completion

IAA_PREFLIGHT_BRIEF: true
PR: 1777
ISSUE: 1775
WAVE: PIT_STAGE12_W8_1_COMPLETION
WAVE_TASKS_PATH: modules/pit/12-build/w81-auth-journey-pass-matrix.md
CURRENT_HEAD_SHA: CURRENT_HEAD

## PRE-BRIEF

Scope is limited to W8.1 route/auth completion evidence after PR #1772.

## EXPECTED_QA_SCOPE

- Verify W8.1 protected-route redirect tests exist and are meaningful.
- Verify canonical /login redirect behavior.
- Verify intended destination preserves pathname, query string, and hash.
- Verify W8.1 route coverage ledger and auth journey pass matrix are filed.
- Verify no W8.2 implementation is introduced.

## EXPECTED_FAILURE_MODES

- Protected route redirects to legacy /auth instead of /login.
- Redirect state drops search or hash fragments.
- Evidence claims deployed LFV without preview/live proof.
- PR starts W8.2 scope before W8.1 is exited.
- Placeholder tests or skipped/todo tests are introduced.

## FOREMAN_INSTRUCTIONS

Foreman must keep this PR limited to W8.1 in-repo route/auth evidence closure, report CI and Vercel statuses honestly, and preserve the no-FUNCTIONAL_PASS posture.

## IAA_WILL_QA

IAA will review the route/auth tests, route coverage ledger, auth journey pass matrix, ECAP, Foreman QP, and functional-delivery profile before handover.

RESULT: PREFLIGHT_BRIEF_COMPLETE
