# Wave Current Tasks — foreman-v2-agent

**Wave**: issue-1660-trigger-injection-intake-classification
**Session ID**: session-issue-1660-trigger-injection-intake-classification-20260518
**Date**: 2026-05-18
**Branch**: copilot/trigger-injection-intake-classification
**Issue**: #1660 — Trigger injection intake and ECAP/IAA classification before review or handover
**PR**: #1661
**CS2 Authorization**: Issue #1660 opened by CS2 (@APGI-cmy) and assigned to Copilot
**iaa_prebrief_path**: .agent-admin/assurance/iaa-wave-record-issue-1660-trigger-injection-intake-classification-2026-05-18.md
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-issue-1660-trigger-injection-intake-classification-2026-05-18.md
**ceremony_admin_appointed**: PENDING (required at Phase 4 handover; ECAP expected for workflow/governance scope)

---

## Outstanding Tasks (update as each is completed)

| # | Task | Builder | Status | PR / Evidence |
|---|------|---------|--------|---------------|
| 1 | Establish issue-1660 wave scope, manifest, and checkpoint evidence paths for PR #1661 | foreman-v2-agent | 🟢 DONE | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`, `.agent-admin/scope-declarations/pr-1661.md`, `.admin/prs/pr-1661.json` |
| 2 | Implement early injection intake, freshness tracking, ECAP/IAA classification timing, review-ready blocking, and focused preflight coverage using existing checkpoint/workflow paths | qa-builder | 🔴 PENDING | Issue #1660 / PR #1661 |
| 3 | Add and verify regression coverage for stale intake, failed-gate dirtying, review-ready posture blocking, and PR #1653-style current-head enforcement | qa-builder | 🔴 PENDING | `.github/scripts/pre-handover-checkpoint.test.sh` + relevant workflow validation |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received or governance setup complete) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| 1661 | PENDING | — |

---

## Wave Completion Gate

- [ ] All tasks above show 🟢 DONE
- [ ] All PRs have ASSURANCE-TOKEN
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval
