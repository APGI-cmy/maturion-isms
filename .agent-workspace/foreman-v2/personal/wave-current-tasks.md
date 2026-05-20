# Wave Current Tasks — foreman-v2-agent

Wave: admin-control-router
Session ID: session-pr-1692-admin-control-router-20260520
Date: 2026-05-20
Branch: copilot/add-admin-control-router
Issue: #1684 — Add admin-control router to sequence governance routines and alert agents before handover
PR: #1692
CS2 Authorization: Delegated by foreman-v2-agent under CS2-governed governance hardening scope
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-admin-control-router-20260520.md
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-admin-control-router-20260520.md
ceremony_admin_appointed: PENDING

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-admin-control-router-20260520.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-05-20T06:39:42Z
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: no
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md

---

## Outstanding Tasks

| # | Task | Owner | Status | Evidence |
|---|------|-------|--------|----------|
| 1 | Add deterministic PR-context + diff-based admin-control router script output | foreman-v2-agent delegate | 🟢 DONE | `.github/scripts/admin-control-router.js` |
| 2 | Add regression coverage for product/protected/gate/agent-contract/mixed/draft/identity-mismatch scenarios | foreman-v2-agent delegate | 🟢 DONE | `.github/scripts/admin-control-router.test.sh` |
| 3 | Integrate router into preflight workflow as `preflight/admin-control-router` and artifact output | foreman-v2-agent delegate | 🟢 DONE | `.github/workflows/preflight-evidence-gate.yml` |
| 4 | Ensure handover/checkpoint required checks include `preflight/admin-control-router` | foreman-v2-agent delegate | 🟢 DONE | `.github/scripts/pre-handover-checkpoint.js`, `.github/workflows/handover-claim-gate.yml` |
| 5 | Align PR-1692 admin/scope/preflight artifacts and strict gate-change evidence references | foreman-v2-agent delegate | 🟡 IN_PROGRESS | `.admin/prs/pr-1692.json`, `.agent-admin/scope-declarations/pr-1692.md`, `.agent-admin/assurance/iaa-wave-record-admin-control-router-20260520.md` |

---

## Wave Completion Gate

- [x] Governance/script/workflow scope declared
- [x] Router classified as orchestration/alert layer (no gate weakening)
- [x] Existing enforcement gates retained as authoritative
- [x] Current wave tracks pre-brief consumption linkage for PR #1692
