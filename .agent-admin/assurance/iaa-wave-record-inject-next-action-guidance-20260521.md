# IAA Wave Record — inject-next-action-guidance

WAVE: inject-next-action-guidance
DATE: 2026-05-21
BRANCH: copilot/inject-next-action-guidance
ISSUE: #1718 — Inject producer next-action guidance on every Copilot PR push before handover
PR: #1719
MODE: PRE-BRIEF (PHASE 0 only)

---

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF
PR: #1719
ISSUE: #1718
WAVE: inject-next-action-guidance
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: 5c6aa516471251185a7a80b95b3d116f04ab8de6

EXPECTED_QA_SCOPE:
- `.github/workflows/preflight-evidence-gate.yml`
- `.github/workflows/handover-claim-gate.yml`
- `.github/workflows/pre-handover-checkpoint.yml`
- injector workflow surface for `pull_request_target` / selected `issue_comment` events
- `.github/scripts/pre-handover-checkpoint.js` and tests
- any sticky-comment/update helper used for producer next-action output
- any `.github/agents/*` or governance guidance file updated to require `/prepare-handover` before review/handover/merge-ready claims
- `.agent-admin/assurance/iaa-wave-record-inject-next-action-guidance-20260521.md`
- `.agent-admin/scope-declarations/pr-1719.md`
- `.admin/prs/pr-1719.json`

EXPECTED_FAILURE_MODES:
- comment feedback is explained away instead of acted on; PR remains no-op while marked review-ready
- injector posts duplicate or non-sticky comments instead of exactly one updatable producer guidance comment
- `NEXT_REQUIRED_CONTROL` is derived from stale comments/artifacts instead of current-head state
- `ready_for_review` is effectively treated as handover approval, weakening the hard gate
- selected `issue_comment` triggers are over-broad or trust-unsafe
- workflow/script changes land without matching scope/admin evidence for PR #1719
- wave tracker remains bound to the old `pit-stage11-red-baseline-reconciliation` record, causing identity mismatch/stale evidence
- current failure `preflight/injection-intake-current` persists because `IAA_FINAL_ASSURANCE` / active-artifact blockers are not cleared

FOREMAN_INSTRUCTIONS:
- Treat PR feedback as requiring action, not explanation-only
- Do not keep PR #1719 in review-ready posture with 0 changed files
- Either close PR #1719 as blocked/no-op, or convert it into a real implementation PR with code, tests, and evidence
- Bind active wave metadata to `inject-next-action-guidance` and the exact wave-record path before delegation
- Preserve hard handover gate behavior; injector may guide, not authorize
- Require `/prepare-handover` checkpoint habit to remain explicit and centralized
- Rerun current-head preflight after implementation and after evidence/artifact alignment

IAA_WILL_QA:
- exact one-comment sticky/idempotent producer guidance behavior
- current-head correctness of `NEXT_REQUIRED_CONTROL`
- no regression that converts advisory flow into implied handover approval
- trusted-event handling for `pull_request_target` / selected `issue_comment`
- exact PR #1719 identity binding across wave/scope/admin artifacts
- preservation of ECAP + IAA hard-gate requirements after injector introduction

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## TOKEN

Pending future full assurance invocation. Not populated in PRE-BRIEF mode.

---

## REJECTION_HISTORY

No rejection entries recorded at PRE-BRIEF stage.
