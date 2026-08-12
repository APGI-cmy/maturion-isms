# IAA Preflight Brief — PIT W8.3 QA-to-RED Correction 2 (PR #1981)

IAA_PREFLIGHT_BRIEF: bounded-pr-admin-normalization
PR: #1981
ISSUE: #1974
PARENT_ISSUE: #1968
BASE_PULL_REQUEST: #1972
WAVE: pit-w83-qa-to-red-correction-2-issue-1974
WAVE_TASKS_PATH: .agent-admin/prs/pr-1981/wave-current-tasks.md
CURRENT_HEAD_SHA: ACTIVE_HEAD_RESOLVED_BY_GATE
BASE_SHA: e18eb8c1f70fcdd96c6b8dea4ad8b4a2e676c966
BRANCH: copilot/pit-w83-pre-build-strategy-alignment
BASE_BRANCH: pit-w83-prebuild-strategy-alignment-1968
APPOINTMENT_START_HEAD: 4b30c140b6767cf345b9ca9ca5f6c0558f6703d3

EXPECTED_QA_SCOPE:
- Normalize only PR-scoped administrative identity artifacts required for PR #1981 resolver/gate alignment.
- Preserve existing QA-builder appointment authority at `.agent-admin/builder-appointments/pit-w83-qa-to-red-completion-issue-1974.md` without replacing it.
- Keep future QA payload authorization narrowed to PIT W8.3 executable harness/test paths only.

EXPECTED_FAILURE_MODES:
- Resolver continues selecting stale legacy MMM wave artifacts instead of PR #1981 scoped records.
- Identity binding fails due to PR/branch/base mismatch across manifest, scope, wave-task, and preflight files.
- Bootstrap state persists because PR-scoped manifest/scope/wave-task records are missing.

FOREMAN_INSTRUCTIONS:
- Treat this lane as administration-only correction; do not authorize QA/runtime implementation from this delta.
- Verify base SHA remains `e18eb8c1f70fcdd96c6b8dea4ad8b4a2e676c966` and ancestry remains stacked on PR #1972.
- After admin normalization verification, decide whether to return branch control to the already-appointed qa-builder.

IAA_WILL_QA:
- Confirm active identity binds to PR #1981, Issue #1974, PIT W8.3 correction-2 wave, and stated base/head branches.
- Confirm no QA test-body, runtime, schema/migration, deployment, workflow, canon, or agent-contract modifications are present.
- Confirm resolver and preflight gates can evaluate this PR without falling back to stale legacy MMM identity.

RESULT: PREFLIGHT_BRIEF_COMPLETE
