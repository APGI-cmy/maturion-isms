# ECAP Bundle — PREHANDOVER PR #1717

ecap_session: ecap-pr-1717-20260521
pr: 1717
branch: copilot/tune-governance-preflight
current_head_sha: 6030f874034728f4eda1829957a5929fff3fd025
protected_path_touched: true
ecap_required: true
ecap_invoked: true
ecap_verdict: PASS
wave_tasks_path: .agent-admin/prs/pr-1717/wave-current-tasks.md
scope_path: .agent-admin/scope-declarations/pr-1717.md
wave_record_path: .agent-admin/assurance/iaa-wave-record-pr1717-stop-and-fix-ecap-gate-evidence-20260521.md
handover_allowed: no
result_state: REMEDIATION_EVIDENCE_PREPARED

ECAP_IDENTITY_BINDING_CHECK
ACTUAL_PR: #1717
BUNDLE_PR: #1717
SCOPE_DECLARATION_PR: #1717
WAVE_CURRENT_TASKS_PR: #1717
WAVE_RECORD_PR: #1717
BRANCH: copilot/tune-governance-preflight
HEAD_SHA: 6030f874034728f4eda1829957a5929fff3fd025
ALL_MATCH: yes
RESULT: PASS

## Strict Gate-Change Evidence

### Changed gate/workflow list
- `.github/scripts/iaa-final-assurance-gate.sh`
- `.github/scripts/validate-product-delivery-gates.sh`
- `.github/scripts/pre-handover-checkpoint.js`
- `.github/workflows/iaa-prebrief-inject.yml`
- `.github/scripts/classify-pr-delta.sh`
- `.github/scripts/iaa-preflight-contract-gate.sh`
- `.github/scripts/iaa-final-assurance-gate.test.sh`
- `.github/scripts/pre-handover-checkpoint.test.sh`
- `.github/scripts/validate-product-delivery-gates.test.sh`
- `.agent-workspace/foreman-v2/knowledge/WAVE-CURRENT-TASKS-PROTOCOL.md`
- `governance/templates/iaa-wave-record.template.md`

### Before/after behavior summary
- Before: strict-governance flow could misread non-active artifacts in some PR synchronization states.
- After: resolver-first active PR state is used for gate decisions and prebrief routing.
- Before: ECAP protected-path evidence was missing for this active PR.
- After: ECAP proof + bundle artifacts exist and are identity-bound to PR #1717 / branch / HEAD.
- Before: `iaa-preflight-contract-gate.sh` defaulted to the legacy wave-tasks path unconditionally, even when a PR-scoped file existed.
- After: gate initializes `WAVE_TASKS_PATH` with the PR-scoped path (`.agent-admin/prs/pr-<PR_NUMBER>/wave-current-tasks.md`) when `PR_NUMBER` is set and the file exists, before falling back to the legacy path — consistent with the resolver-first model.

### No-weakening statement
Gate behavior is tightened only; no existing assurance gate was relaxed or bypassed.

### Tests run and results for affected gate scripts
- resolve-active-pr-state.test.sh: Passed 5, Failed 0
- admin-control-router.test.sh: Passed 10, Failed 0
- iaa-preflight-contract-gate.test.sh: Passed 19, Failed 0
- iaa-final-assurance-gate.test.sh: Passed 39, Failed 0
- validate-product-delivery-gates.test.sh: Passed 40, Failed 0
- pre-handover-checkpoint.test.sh: Passed 48, Failed 0

### Regression coverage summary
- Active artifact resolution: covered.
- Admin control routing: covered.
- Preflight contract checks: covered.
- Final assurance gate checks: covered.
- Product delivery gate checks: covered.
- Pre-handover checkpoint checks: covered.

## Posture

Remediation evidence assembled for STOP_AND_FIX only.  
No merge-ready and no handover-ready claim is made in this bundle.
