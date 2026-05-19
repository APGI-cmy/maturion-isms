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
ceremony_admin_appointed: execution-ceremony-admin-agent

NOTE_ACTIVE_PREFLIGHT_PATH_BASIS: Carry-forward active path anchor retained for deterministic pre-flight timing provenance; content inside the referenced artifact is updated for issue-1671 / PR-1672.
PREFLIGHT_PATH_ANCHOR_INTENTIONAL: yes — retained issue-1660 filename is intentional; file content is the authority for issue-1671 / PR-1672.

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-issue-1660-trigger-injection-intake-classification-2026-05-18.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-05-19T07:00:00Z
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes

---

## Outstanding Tasks (STOP_AND_FIX)

| # | Task | Owner | Status | Evidence |
|---|------|-------|--------|----------|
| 1 | Add per-PR scope declaration for PR #1672 with exact diff parity | foreman-v2-agent | 🟢 DONE | `.agent-admin/scope-declarations/pr-1672.md` |
| 2 | Add PR admin manifest for PR #1672 with strict gate evidence references | foreman-v2-agent | 🟢 DONE | `.admin/prs/pr-1672.json` |
| 3 | Add strict gate logic change evidence bundle (before/after behavior, impacted gates, no-weakening statement, local regression output, current-head preflight proof) | foreman-v2-agent | 🟢 DONE | `.agent-admin/evidence/pr-1672-strict-gate-change-evidence.md` |
| 4 | Re-run required regressions and full preflight evidence gate on current HEAD | foreman-v2-agent | 🟢 DONE | `https://github.com/APGI-cmy/maturion-isms/actions/runs/26087697991` (success, head `8dd1c3d6eb1d09cff78652b3d395b1335264fd0b`) |

---

## Wave Completion Gate

- [x] All STOP_AND_FIX tasks above show 🟢 DONE
- [x] Required local regressions are GREEN
- [x] Full `Preflight Evidence Gate` workflow run on current HEAD is GREEN
- [x] Session memory and PREHANDOVER evidence updated before merge-ready claim
