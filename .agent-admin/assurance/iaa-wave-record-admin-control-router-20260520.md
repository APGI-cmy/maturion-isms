# IAA Wave Record — admin-control-router

**Wave ID**: admin-control-router
**Date**: 2026-05-20
**Branch**: copilot/add-admin-control-router
**PR**: #1692
**Authority**: CS2 (@APGI-cmy)
**Mode**: PRE-BRIEF

---

IAA_PREFLIGHT_BRIEF
PR: #1692
ISSUE: #1684 — Add admin-control router to sequence governance routines and alert agents before handover
WAVE: admin-control-router
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: CURRENT_HEAD

EXPECTED_QA_SCOPE:
- `.github/scripts/admin-control-router.js`
- `.github/scripts/admin-control-router.test.sh`
- `.github/workflows/preflight-evidence-gate.yml`
- `.github/scripts/pre-handover-checkpoint.js`
- `.github/scripts/pre-handover-checkpoint.test.sh`
- `.github/workflows/handover-claim-gate.yml`
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
- `.agent-admin/assurance/iaa-wave-record-admin-control-router-20260520.md`
- `.admin/prs/pr-1692.json`
- `.agent-admin/scope-declarations/pr-1692.md`

EXPECTED_FAILURE_MODES:
- Router misclassifies protected/gate/agent-contract changes and omits required controls
- next_required_control does not represent the earliest missing control in sequence
- router output allows review/handover/merge posture while required controls remain missing
- strict gate-change evidence remains absent for workflow/script changes
- prebrief/scope artifacts mismatch active PR identity (#1692)

FOREMAN_INSTRUCTIONS:
- Keep `iaa_prebrief_path` and `IAA_PREFLIGHT_BRIEF_PATH` synchronized to this file for PR #1692.
- Preserve existing enforcement gates; router must remain orchestration/alert-only.
- Ensure strict gate-change evidence and scope/admin artifacts are aligned to the active diff.
- Keep handover posture blocked until current-head required checks are green.

ECAP_REQUIRED / ECAP_EXPECTED_ARTIFACTS:
- ECAP_REQUIRED: yes
- ECAP_EXPECTED_ARTIFACTS:
  - `.agent-admin/prehandover/proof-pr-1692-*.md`
  - `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-*.md`

CURRENT_HEAD_CI_EXPECTATIONS:
- `preflight/gate-changing-pr-rule`: GREEN
- `preflight/iaa-prebrief-existence`: GREEN
- `preflight/scope-declaration-parity`: GREEN
- `Actions Deprecation Gate / Scan for deprecated Actions versions`: GREEN

POLC_AND_BUILDER_DELEGATION_EXPECTATIONS:
- Foreman orchestrates and verifies; implementation artifacts are delegated and evidenced.
- Builder delegation preflight scope remains explicit for `.github/scripts/**` and `.github/workflows/**` changes.

IAA_WILL_QA:
- Verify router control-state output is deterministic from PR context + diff and does not replace detailed gates.
- Verify required controls include strict gate-change evidence and current-head parity for this wave.
- Verify prebrief/scope/admin artifacts reference PR #1692 and current active wave tasks path.
- Verify no handover allowance appears while required controls are missing.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## PRE-BRIEF

Pre-brief prepared for governance/workflow hardening wave introducing admin-control routing.
The wave remains blocked from handover posture until strict gate-change evidence, identity-linked
artifacts, and current-head parity requirements are all GREEN.
