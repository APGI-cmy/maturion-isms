# IAA Wave Record — identity-binding-hardening-1685-r3 — 2026-05-19

## PRE-BRIEF

Qualifying tasks: [PR #1685 identity-binding hardening refresh for active head SHA `dc2a4e5bf39ba0dc04b4eb502d4943bb829e8a28`, including ECAP + IAA evidence rebinding and full Preflight Evidence Gate re-validation]
Applicable overlay: [CI_WORKFLOW]
Anti-regression obligations: [no — FUNCTIONAL-BEHAVIOUR-REGISTRY mandatory behavioural checks apply to BUILD/AAWP_MAT PRs; this wave is governance/workflow assurance only]
Ceremony-admin appointed: [YES — execution-ceremony-admin-agent]

IAA_PREFLIGHT_BRIEF
PR: #1685
ISSUE: #1684
WAVE: identity-binding-hardening-1685-r3
BRANCH: copilot/harden-active-pr-identity-binding
CURRENT_HEAD_SHA: dc2a4e5bf39ba0dc04b4eb502d4943bb829e8a28
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md

EXPECTED_QA_SCOPE:
- .admin/prs/pr-1685.json
- .agent-admin/scope-declarations/pr-1685.md
- .agent-admin/prehandover/proof-pr-1685-identity-binding-hardening-20260519.md
- .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1685-identity-binding-hardening-20260519.md
- .agent-workspace/foreman-v2/personal/wave-current-tasks.md
- .github/workflows/preflight-evidence-gate.yml
- .github/scripts/identity-binding-gate.sh
- .github/scripts/pre-handover-checkpoint.js
- .github/scripts/iaa-final-assurance-gate.sh
- .github/scripts/ecap-admin-ceremony-gate.sh
- governance/templates/execution-ceremony-admin/ECAP_RECONCILIATION_SUMMARY.template.md
- governance/templates/execution-ceremony-admin/PREHANDOVER.template.md
- governance/templates/iaa-wave-record.template.md

EXPECTED_FAILURE_MODES:
- Active artifacts still bound to stale SHA `61462c0eaa957393b9348da11ab9e8c7ed86a6b8` instead of current head `dc2a4e5bf39ba0dc04b4eb502d4943bb829e8a28`
- PR/branch/issue identity mismatch across admin manifest, scope declaration, PREHANDOVER proof, ECAP bundle, and IAA wave record
- Required preflight gate jobs not re-validated on the active head
- ECAP required artifacts missing, stale, or cross-referencing non-active wave/token paths

FOREMAN_INSTRUCTIONS:
- Treat GitHub PR #1685 context (PR/branch/head/base) as source of truth for active identity
- Regenerate/refresh ECAP + IAA evidence only for active current head SHA `dc2a4e5bf39ba0dc04b4eb502d4943bb829e8a28`
- Ensure all identity-bearing artifacts present exact parity before handover claims
- Re-run and confirm all required Preflight Evidence Gate jobs on current head

ECAP_REQUIRED: yes
ECAP_EXPECTED_ARTIFACTS:
- .agent-admin/prehandover/proof-pr-1685-identity-binding-hardening-20260519.md
- .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1685-identity-binding-hardening-20260519.md
- governance/templates/execution-ceremony-admin/ECAP_RECONCILIATION_SUMMARY.template.md

CURRENT_HEAD_CI_EXPECTATIONS:
- Workflow: .github/workflows/preflight-evidence-gate.yml
- Head SHA under test: dc2a4e5bf39ba0dc04b4eb502d4943bb829e8a28
- Required jobs expected GREEN on current head:
  - iaa-prebrief-check
  - identity-binding-check
  - evidence-exactness-check
  - iaa-final-assurance-gate
  - ecap-admin-ceremony-gate
  - scope-declaration-parity

POLC_AND_BUILDER_DELEGATION_EXPECTATIONS:
- POLC boundary maintained: IAA performs assurance only; no implementation artifact production
- Builder/delegation package must explicitly include preflight identity-binding scope and current-head refresh objective
- Any omission of active-head identity binding requirements in delegation or ceremony artifacts is a stop-and-fix failure

IAA_WILL_QA:
- Trigger classification and overlay applicability (CI_WORKFLOW) with ambiguity-default safeguard
- Identity-binding parity across all active artifacts (PR/issue/branch/head)
- Stale-reference detection (old wave record path / old SHA / stale token cross-link)
- Required ECAP artifact presence and coherence
- Current-head gate parity evidence for required Preflight jobs

RESULT: PREFLIGHT_BRIEF_COMPLETE
