# Wave Current Tasks — foreman-v2-agent

**Wave**: layer-down-2026-05-08-481a57b1
**Session ID**: session-layer-down-2026-05-08-481a57b1-20260510
**Date**: 2026-05-10
**Branch**: copilot/layer-down-propagate-governance-changes-f67f5da7-5091-4c9b-97bf-41d34bda41fd
**PR**: #1591
**CS2 Authorization**: issue #1587 opened by @APGI-cmy with explicit CS2 RCA operationalization directive in issue comments
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-layer-down-2026-05-08-481a57b1-20260510.md
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-layer-down-2026-05-08-481a57b1-20260510.md
ceremony_admin_appointed: execution-ceremony-admin-agent
appointment_timestamp: 2026-05-10T12:35:00Z
assigned_scope:
  - Layer down canonical governance updates from commit 481a57b127484ecf5bdbf2b1d876f71e47aeb6ae
  - Operationalize RCA model with Tier 1, Tier 2, and Tier 3 artifacts
  - Keep activation in Phase A/soft mode only (no hard RCA merge gate)
expected_return_artifact_paths:
  - .github/agents/root-cause-corrective-action-agent.md
  - .agent-admin/assurance/codexadvisor-proof-pr-1591.md
  - .agent-admin/prehandover/proof-pr-1591-rca-operationalization-20260510.md
  - .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1591-rca-operationalization-20260510.md
  - governance/canon/ROOT_CAUSE_CORRECTIVE_ACTION_AGENT_CANON.md
  - governance/templates/ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT.template.md
  - governance/templates/IAA_RCA_REVIEW.template.md
  - governance/templates/RCA_HANDOFF_OR_ROUTING.template.md
  - .agent-workspace/root-cause-corrective-action-agent/knowledge/index.md

---

## Outstanding Tasks (update as each is completed)

| # | Task | Executor | Status | Evidence |
|---|------|----------|--------|----------|
| T-1 | Tier 1 RCA agent contract creation via Codex Advisor | CodexAdvisor-agent | 🟢 DONE | `.github/agents/root-cause-corrective-action-agent.md` |
| T-2 | Canon + alignment + sync-state layer-down for commit 481a57b1 | governance-liaison-isms-agent | 🟢 DONE | `governance/canon/*`, `governance/alignment/GOVERNANCE_ALIGNMENT_INVENTORY.json`, `governance/sync_state.json` |
| T-3 | Tier 2/Tier 3 RCA operational artifacts | governance-liaison-isms-agent + foreman-v2-agent | 🟢 DONE | `.agent-workspace/root-cause-corrective-action-agent/knowledge/**`, `governance/templates/*RCA*` |
| T-4 | PR governance hygiene artifacts for preflight gates (ECAP bundle + codex proof) | foreman-v2-agent | 🟢 DONE | `.agent-admin/prehandover/proof-pr-1591-rca-operationalization-20260510.md`, `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1591-rca-operationalization-20260510.md`, `.agent-admin/assurance/codexadvisor-proof-pr-1591.md` |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE | ❌ BLOCKED

---

## Governance Notes

- **Wave type**: MIXED — AGENT_CONTRACT + CANON_GOVERNANCE + KNOWLEDGE_GOVERNANCE + TEMPLATE
- **Protected paths expected**: `.github/agents/**`, `governance/**`, `.agent-workspace/**/knowledge/**`
- **Build Authorization**: Governance-only wave; no product-code implementation delegated
- **IAA pre-brief status**: CLEAR — wave record committed for this wave
