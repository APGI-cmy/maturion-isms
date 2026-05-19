# Wave Current Tasks — foreman-v2-agent

Wave: issue-1671-stop-and-fix-pr-1672
Session ID: session-issue-1671-stop-and-fix-pr-1672-20260519
Date: 2026-05-19
Branch: copilot/restore-iaa-pre-flight-briefing
Issue: #1671 — Restore IAA pre-flight briefing as proactive QA contract
PR: #1672
CS2 Authorization: Issue #1671 opened by CS2 (@APGI-cmy) and assigned to Copilot
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-issue-1660-trigger-injection-intake-classification-2026-05-18.md
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-issue-1660-trigger-injection-intake-classification-2026-05-18.md
ceremony_admin_appointed: PENDING

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-issue-1660-trigger-injection-intake-classification-2026-05-18.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-05-19T07:00:00Z
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes

---

## Outstanding Tasks (STOP_AND_FIX)

| # | Task | Owner | Status | Evidence |
|---|------|-------|--------|----------|
| 1 | Add per-PR scope declaration for PR #1672 with exact diff parity | foreman-v2-agent | 🔴 PENDING | `.agent-admin/scope-declarations/pr-1672.md` |
| 2 | Add PR admin manifest for PR #1672 with strict gate evidence references | foreman-v2-agent | 🔴 PENDING | `.admin/prs/pr-1672.json` |
| 3 | Add strict gate logic change evidence bundle (before/after behavior, impacted gates, no-weakening statement, local regression output, current-head preflight proof) | foreman-v2-agent | 🔴 PENDING | `.agent-admin/evidence/pr-1672-strict-gate-change-evidence.md` |
| 4 | Re-run required regressions and full preflight evidence gate on current HEAD | foreman-v2-agent | 🔴 PENDING | local command outputs + GitHub Actions run URL |

---

## Wave Completion Gate

- [ ] All STOP_AND_FIX tasks above show 🟢 DONE
- [ ] Required local regressions are GREEN
- [ ] Full `Preflight Evidence Gate` workflow run on current HEAD is GREEN
- [ ] Session memory and PREHANDOVER evidence updated before merge-ready claim
