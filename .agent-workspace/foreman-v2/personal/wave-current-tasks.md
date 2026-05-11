# Wave Current Tasks — foreman-v2-agent

**Wave**: pr1607-rejection-first-handover-protocol
**Session ID**: session-pr1607-rejection-first-handover-protocol-20260511
**Date**: 2026-05-11
**Branch**: copilot/re-establish-failed-gate-protocol
**PR**: PR 1607
**CS2 Authorization**: issue #1606 opened by @APGI-cmy with explicit rejection-first handover protocol directive
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-pr1607-rejection-first-handover-protocol-20260511.md
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-pr1607-rejection-first-handover-protocol-20260511.md
ceremony_admin_appointed: execution-ceremony-admin-agent
appointment_timestamp: 2026-05-11T14:15:02Z
assigned_scope:
  - Reinstate rejection-first handover protocol across Foreman, ECAP, and IAA governance artifacts
  - Preserve current-head checkpoint enforcement and rejection-first semantics in workflow/script coverage
  - Produce per-PR scope and ECAP evidence artifacts required for PR 1607 protected-path preflight gates
expected_return_artifact_paths:
  - .agent-admin/prehandover/proof-pr-1607-ecap-admin-ceremony-20260511.md
  - .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1607-ecap-admin-ceremony-20260511.md

---

## Outstanding Tasks (update as each is completed)

| # | Task | Executor | Status | Evidence |
|---|------|----------|--------|----------|
| T-1 | Reinstate rejection-first contract/workflow/checklist changes for PR 1607 | CodexAdvisor-agent | 🟢 DONE | `.github/agents/*.md`, `.github/scripts/pre-handover-checkpoint.*`, `.github/workflows/handover-claim-gate.yml`, `governance/checklists/phase4-role-separation-operational-guidance.md` |
| T-2 | Maintain active per-wave scope for PR 1607 governance remediation | foreman-v2-agent | 🟢 DONE | `.agent-workspace/foreman-v2/personal/scope-declaration-wave-pr1607-rejection-first-handover-protocol-20260511.md`, `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` |
| T-3 | Add per-PR scope declaration for PR 1607 | foreman-v2-agent | 🟢 DONE | `.agent-admin/scope-declarations/pr-1607.md` |
| T-4 | Produce PR 1607 ECAP evidence bundle + proof for protected-path gates | execution-ceremony-admin-agent | 🟢 DONE | `.agent-admin/prehandover/proof-pr-1607-ecap-admin-ceremony-20260511.md`, `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1607-ecap-admin-ceremony-20260511.md` |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE | ❌ BLOCKED

---

## Governance Notes

- **Wave type**: MIXED — AGENT_CONTRACT + CI_WORKFLOW + CANON_GOVERNANCE
- **Protected paths expected**: `.github/agents/**`, `governance/checklists/**`
- **Build Authorization**: Governance-only wave; no product runtime implementation delegated
- **IAA pre-brief status**: CLEAR — wave record committed for this wave
