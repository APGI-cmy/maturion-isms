# IAA Pre-Flight Brief — APW Private-Request Classifier Hardening v0.1

IAA_PREFLIGHT_BRIEF
PR: PENDING
ISSUE: APW-PRODUCTION-ACTIVATION-BLOCKER-001
WAVE: APW-PRIVATE-REQUEST-CLASSIFIER-HARDENING-V01
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA

EXPECTED_QA_SCOPE:
- Align public-chat and APW Specialist private-request classification through one shared fail-closed policy.
- Add regression coverage for private, confidential, customer, client, account and record wording.
- Preserve public onboarding, restricted configuration/token routing and flag-off rollback behaviour.

EXPECTED_FAILURE_MODES:
- Broad private wording still enters the APW draft route.
- Over-broad matching blocks ordinary public APW onboarding questions.
- Configuration/token restrictions regress.
- Flag-off rollback route changes.

FOREMAN_INSTRUCTIONS:
- Keep this wave limited to classifier code, tests and PR governance evidence.
- Do not change any environment, feature flag, deployment or production activation state.

IAA_WILL_QA:
- Verify shared policy use by both classifiers.
- Verify positive and negative regression tests.
- Verify no runtime environment or activation changes.

RESULT: PREFLIGHT_BRIEF_COMPLETE
