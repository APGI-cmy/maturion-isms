# IAA Wave Record - MMM Vercel Workflow Ownership Split

| Field | Value |
|---|---|
| Wave ID | `mmm-vercel-workflow-ownership-1815` |
| Governing issue | `#1815` |
| Implementation PR | `#1828` |
| Scope | MMM-owned Vercel workflow split |
| Posture | `IMPLEMENTATION_FOR_REVIEW` |

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF

PR: #1828
WAVE: mmm-vercel-workflow-ownership-1815
WAVE_TASKS_PATH: .agent-admin/prs/pr-1828/wave-current-tasks.md
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA

EXPECTED_QA_SCOPE:
- MMM workflow uses MMM-specific paths and secrets.
- MMM workflow smoke-tests MMM routes only.
- ISMS and PIT workflows are not edited.
- Broad api/** and packages/** changes do not automatically trigger MMM preview deployment.
- Protected-preview responses are distinguished from route/runtime failures.

EXPECTED_FAILURE_MODES:
- MMM workflow triggers on unrelated ISMS or PIT paths.
- MMM workflow uses generic Vercel secrets.
- MMM smoke test treats protected-preview posture as route failure.
- MMM workflow silently reclaims broad shared API/package ownership.
- MMM production deploy proceeds with placeholder Supabase environment values.

FOREMAN_INSTRUCTIONS:
- Confirm trigger paths exclude apps/isms-portal/**, modules/pit/**, broad api/**, and broad packages/**.
- Confirm MMM_VERCEL_PROJECT_ID, MMM_VERCEL_ORG_ID, and MMM_VERCEL_TOKEN are used.
- Confirm smoke routes are MMM routes only.
- Confirm preview-protection behavior is handled deliberately.
- Confirm bundle environment validation runs before preview and production deploys.

IAA_WILL_QA:
- Verify MMM-only workflow ownership and secret namespace.
- Verify deployment evidence exists under modules/MMM/12-deployment/.
- Verify no handover, completion, or merge-readiness claim is made before final checks complete.
- Verify all PR #1800 governance gates and MMM deployment gate pass before merge recommendation.

RESULT: PREFLIGHT_BRIEF_COMPLETE

## FINAL ASSURANCE

PENDING. No final assurance, completion, or merge-readiness claim is made by this artifact.
