# IAA Wave Record — wave-identity-binding-hardening-1684-r2 — 2026-05-19

## PRE-BRIEF

IAA_PREFLIGHT_BRIEF
PR: #1685
ISSUE: #1684
WAVE: wave-identity-binding-hardening-1684-r2
BRANCH: copilot/harden-active-pr-identity-binding
CURRENT_HEAD_SHA: CURRENT_HEAD
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
EXPECTED_QA_SCOPE:
- .github/scripts/identity-binding-gate.sh
- .github/workflows/preflight-evidence-gate.yml
- .github/scripts/pre-handover-checkpoint.js
- .github/scripts/iaa-final-assurance-gate.sh
- .github/scripts/ecap-admin-ceremony-gate.sh
EXPECTED_FAILURE_MODES:
- Active artifacts bound to wrong PR number
- Scope/admin manifest mismatch with active PR identity
- IAA/ECAP/prehandover artifacts stale against current head
FOREMAN_INSTRUCTIONS:
- Use GitHub PR context as source of truth for active identity
- Fail closed on any PR/branch/head mismatch in active artifacts
- Regenerate artifacts for active PR only before any handover claim
IAA_WILL_QA:
- Identity parity across admin/scope/wave/ECAP/IAA/prehandover artifacts
- Current-head validity and no wrong-PR active references
RESULT: PREFLIGHT_BRIEF_COMPLETE

## TOKEN
PHASE_B_BLOCKING_TOKEN: IAA-PR1685-IDENTITY-BINDING-HARDENING-20260519-PASS
**PR**: #1685
**Issue**: maturion-isms#1684
**Reviewed SHA**: 61462c0eaa957393b9348da11ab9e8c7ed86a6b8
PREFLIGHT_BRIEF_REVIEWED: yes
PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-wave-identity-binding-hardening-1684-r2-20260519.md
PREFLIGHT_EXPECTATIONS_MET: yes
UNMET_PREFLIGHT_EXPECTATIONS: none
FINAL_IAA_RESULT: PASS

IAA_IDENTITY_BINDING_VERDICT
ACTUAL_PR: #1685
ACTIVE_PREFLIGHT_PR: #1685
ADMIN_MANIFEST_PR: #1685
SCOPE_DECLARATION_PR: #1685
ECAP_BUNDLE_PR: #1685
IAA_TOKEN_PR: #1685
BRANCH: copilot/harden-active-pr-identity-binding
HEAD_SHA: 61462c0eaa957393b9348da11ab9e8c7ed86a6b8
ALL_MATCH: yes
