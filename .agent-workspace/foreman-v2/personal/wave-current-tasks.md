# Wave Current Tasks — foreman-v2-agent

**Wave**: pre-handover-checkpoint-hardening-20260508 — Deliberate pre-handover checkpoint hardening
**Session ID**: session-pre-handover-checkpoint-hardening-20260508
**Date**: 2026-05-08
**Branch**: copilot/harden-pre-handover-checkpoint-trigger
**PR**: #1586
**CS2 Authorization**: issue #1583 opened by @APGI-cmy and assigned to Copilot/@APGI-cmy
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-pre-handover-checkpoint-hardening-20260508-20260508.md
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-pre-handover-checkpoint-hardening-20260508-20260508.md
ceremony_admin_appointed: NO — only required after QP PASS in Phase 4

---

## Outstanding Tasks (update as each is completed)

| # | Task | Executor | Status | Evidence |
|---|------|----------|--------|----------|
| T-1 | Correct wave admin artifacts for issue #1583 / PR #1586 and secure IAA pre-brief wave record | foreman-v2-agent (POLC-Orchestration) | 🟡 IN PROGRESS | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`, `.agent-workspace/foreman-v2/personal/scope-declaration-wave-pre-handover-checkpoint-hardening-20260508.md`, `.agent-admin/scope-declarations/pr-1586.md` |
| T-2 | Implement deliberate pre-handover checkpoint workflow, gate integration, workflow classification audit, regression coverage, and required guidance updates | governance-liaison-isms-agent | 🔴 PENDING | PR #1586 |
| T-3 | Review builder handback, verify validations/evidence, and prepare final ceremony path | foreman-v2-agent (Quality Professor) | 🔴 PENDING | PR #1586 evidence bundle |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## Governance Notes

- **Wave type**: MIXED — CI_WORKFLOW + KNOWLEDGE_GOVERNANCE
- **Protected paths expected**: `.github/workflows/**`, `.github/scripts/**`, `governance/**`, `.agent-workspace/**/knowledge/**`
- **Build Authorization**: NOT CLEARED — Foreman orchestration only; implementation delegated
- **Planned builder**: `governance-liaison-isms-agent`
- **IAA pre-brief status**: BLOCKED pending correct wave artifacts and committed wave record

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| 1586 | PENDING (pre-brief/final assurance outstanding) | — |

---

## Wave Completion Gate

- [ ] All tasks above show 🟢 DONE
- [ ] IAA wave record committed for this wave
- [ ] Builder implementation handback reviewed by Foreman
- [ ] Validation evidence recorded for workflow/script/test changes
- [ ] PREHANDOVER proof committed
- [ ] Session memory committed
- [ ] IAA final audit invoked and ASSURANCE-TOKEN received
- [ ] CS2 notified for merge approval

---

*Wave: pre-handover-checkpoint-hardening-20260508 | Branch: copilot/harden-pre-handover-checkpoint-trigger | PR: #1586*
