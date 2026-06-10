# IAA Prebrief - PIT W8.2 Schema

IAA_PREFLIGHT_BRIEF: true
PR: 1785
ISSUE: 1774
WAVE: PIT_W8_2_SCHEMA
WAVE_TASKS_PATH: modules/pit/12-build/w82-rls-schema-policy-evidence.md
CURRENT_HEAD_SHA: CURRENT_HEAD

## PRE-BRIEF

Scope is limited to W8.2 schema continuation after PR 1782.

## EXPECTED_QA_SCOPE

- Verify role names match PIT architecture.
- Verify migration artifact exists.
- Verify no full W8.2 exit claim.
- Verify no Stage 12 completion claim.

## EXPECTED_FAILURE_MODES

- Stale role vocabulary remains.
- Evidence claims live query output without proof.
- Later W8 waves are included.

## FOREMAN_INSTRUCTIONS

Keep the PR limited and report CI honestly.

## IAA_WILL_QA

IAA will review changed code, migration artifact, and evidence file.

RESULT: PREFLIGHT_BRIEF_COMPLETE
