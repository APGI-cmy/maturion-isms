# IAA Prebrief - PIT W8.2 Supabase Evidence

IAA_PREFLIGHT_BRIEF: true
PR: TBD
ISSUE: 1774
WAVE: PIT_W8_2_SUPABASE_EVIDENCE
WAVE_TASKS_PATH: modules/pit/12-build/w82-supabase-rls-verification-evidence.md
CURRENT_HEAD_SHA: CURRENT_HEAD

## PRE-BRIEF

Scope is limited to recording Supabase table/RLS and policy inventory evidence after the W8.2 schema foundation migration.

## EXPECTED_QA_SCOPE

- Verify the evidence file records the table/RLS query and policy inventory query.
- Verify all five W8.2 checked tables have RLS enabled.
- Verify the evidence does not claim full W8.2 exit.
- Verify remaining role-matrix and deployed denied-path evidence is still listed as open.

## EXPECTED_FAILURE_MODES

- Evidence claims actor-behavior testing without actor query output.
- Evidence claims deployed denied-path screenshots without attached proof.
- Evidence claims W8.2 completion or FUNCTIONAL_PASS.

## FOREMAN_INSTRUCTIONS

Keep this PR evidence-only and report CI/Vercel status honestly.

## IAA_WILL_QA

IAA will review the evidence artifact and non-overclaim posture.

RESULT: PREFLIGHT_BRIEF_COMPLETE
