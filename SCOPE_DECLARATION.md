# Scope Declaration

**Issue**: feat: Foreman Re-Anchor Pulse — mid-wave context recovery workflow
**Date**: 2026-03-03
**Agent**: copilot-swe-agent (CS2-direct, co-authored: @APGI-cmy)
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

---

## Purpose

This PR delivers the Foreman Re-Anchor Pulse — an automated mid-wave context recovery mechanism that injects a mandate reminder on every wave PR push and on-demand via `/foreman-anchor`.

1. New GitHub Actions workflow: `.github/workflows/foreman-reanchor.yml`
2. New wave task tracker template: `.agent-workspace/foreman-v2/personal/wave-current-tasks-template.md`
3. New Tier 2 knowledge document: `.agent-workspace/foreman-v2/knowledge/WAVE-CURRENT-TASKS-PROTOCOL.md`
4. Updated knowledge index: `.agent-workspace/foreman-v2/knowledge/index.md` (v1.7.0)

Plus ceremony artifacts and IAA session memory.

---

## Files Changed

**Total Files**: 11

All files in this PR are explicitly listed below (required by BL-027):

- `SCOPE_DECLARATION.md` — this file (reset for re-anchor workflow PR)
- `.github/workflows/foreman-reanchor.yml` — NEW Re-Anchor Pulse workflow
- `.agent-workspace/foreman-v2/personal/wave-current-tasks-template.md` — NEW wave task tracker template
- `.agent-workspace/foreman-v2/knowledge/WAVE-CURRENT-TASKS-PROTOCOL.md` — NEW Tier 2 knowledge doc (v1.0.0)
- `.agent-workspace/foreman-v2/knowledge/index.md` — UPDATED to v1.7.0 (adds WAVE-CURRENT-TASKS-PROTOCOL entry)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-reanchor-workflow-20260303.md` — PREHANDOVER proof (iaa_audit_token: PENDING → session-121)
- `.agent-workspace/foreman-v2/memory/session-reanchor-workflow-20260303.md` — session memory for this PR
- `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` — A-027 codified by IAA (session-120)
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` — version bump by IAA (session-120)
- `.agent-workspace/independent-assurance-agent/memory/session-120-20260303.md` — IAA session-120 memory (REJECTION-PACKAGE)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` — IAA parking station append (session-120)

---

## POLC Attestation

No production code modified. No schema changes. No test changes. All deliverables are governance/CI tooling and documentation.

---

## Signature

**Scope Declared By**: copilot-swe-agent (CS2-direct, co-authored: @APGI-cmy)
**Date**: 2026-03-03
**Issue**: feat: Foreman Re-Anchor Pulse — mid-wave context recovery workflow

---

*END OF SCOPE DECLARATION*
