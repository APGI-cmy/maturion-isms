# WAVE-CURRENT-TASKS-PROTOCOL

**Version**: 1.0.0
**Date**: 2026-03-03
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Status**: ACTIVE

---

## Purpose

Codifies the `wave-current-tasks.md` creation and maintenance requirement for foreman-v2-agent. This file is both a live task tracker AND the data source for the automated Foreman Re-Anchor Pulse workflow (`.github/workflows/foreman-reanchor.yml`).

---

## Mandate

**At the start of every wave (Phase 2 — Alignment, after CS2 wave-start authorization is confirmed):**

1. Copy `.agent-workspace/foreman-v2/personal/wave-current-tasks-template.md` to `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
2. Populate the header fields: Wave, Session ID, Date, Branch, CS2 Authorization link
3. List every task to be delegated in the task table with status 🔴 PENDING
4. Commit this file to the working branch **before delegating to any builder**

**During the wave (Phase 3 — after each delegation and each IAA verdict):**

5. Update the task table row for each completed delegation: 🔴 → 🟡 IN PROGRESS
6. Update to 🟢 DONE when IAA ASSURANCE-TOKEN is received for that PR
7. Record the IAA token in the IAA Tokens table
8. Commit the updated file after each status change

**At wave close (Phase 4 — Handover):**

9. Confirm all tasks show 🟢 DONE
10. Check the Wave Completion Gate checklist
11. The `wave-current-tasks.md` file is part of the wave evidence bundle

---

## Why This Matters

The Re-Anchor Pulse workflow (`.github/workflows/foreman-reanchor.yml`) reads the first 500 characters of `wave-current-tasks.md` and injects it into every automated re-anchor comment. This means:

- When context pressure causes the Foreman to lose track of outstanding tasks, the re-anchor comment restores awareness using the Foreman's own written task list
- The task list is Foreman-authored (not injected externally), so it carries full authority in the Foreman's reasoning
- The workflow fires on every PR push to a wave PR — the Foreman receives a pulse reminder automatically without CS2 intervention

---

## Absence Behaviour

**Mid-wave (Phase 3 — Re-Anchor Pulse fires during active wave):** If `wave-current-tasks.md` does not exist, the workflow posts a fallback message directing the Foreman to read the latest session memory file. This is sub-optimal and the Foreman must create `wave-current-tasks.md` immediately — but wave execution may continue.

**At handover (Phase 4):** A missing `wave-current-tasks.md` is a **HANDOVER BLOCKER** — it is a required wave evidence artifact from knowledge version 1.7.0 onward. Handover must not proceed until the file is produced and committed.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-03 | Initial protocol — wave-current-tasks.md creation mandate, Re-Anchor Pulse integration, absence behaviour |

---

*Authority: CS2 (Johan Ras) | Living Agent System v6.2.0*
