# IAA Prebrief - PIT W8.2 Role Matrix

IAA_PREFLIGHT_BRIEF: true
PR: 1791
ISSUE: 1774
WAVE: PIT_W8_2_ROLE_MATRIX
WAVE_TASKS_PATH: modules/pit/12-build/w82-role-matrix-denied-path-verification.md
CURRENT_HEAD_SHA: CURRENT_HEAD

PRE-BRIEF:

Scope is limited to documenting the current W8.2 actor-verification blocker and required role-matrix evidence path.

EXPECTED_QA_SCOPE:

- Verify current data discovery is recorded.
- Verify actor-level proof is not claimed without role assignments.
- Verify remaining denied-path evidence stays open.
- Verify no full W8.2 exit claim.

EXPECTED_FAILURE_MODES:

- Actor behavior claimed without test actors.
- Browser evidence claimed without proof.
- W8.2 completion or FUNCTIONAL_PASS claimed prematurely.

FOREMAN_INSTRUCTIONS:

- Keep this PR evidence and planning only.
- Report CI and Vercel status honestly.
- Preserve the no-FUNCTIONAL_PASS posture.

IAA_WILL_QA:

- IAA will review the role matrix ledger.
- IAA will verify non-overclaim posture.
- IAA will verify all W8.2 role identifiers are canonical.

RESULT: PREFLIGHT_BRIEF_COMPLETE
