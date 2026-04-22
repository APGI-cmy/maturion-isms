# WAVE-CURRENT-TASKS-PROTOCOL

**Version**: 1.2.0
**Date**: 2026-04-22
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
11. **Execute the Wave Reconciliation Checklist** (`wave-reconciliation-checklist.md`) — mandatory
    before PR open. Covers: post-wave incident → NBR entry, liveness verification, and evidence
    completeness. Record result in PREHANDOVER proof under `## Wave Reconciliation Checklist`.
12. The `wave-current-tasks.md` file is part of the wave evidence bundle

---

## Stage 10 Ceremony Contract Integration

Stage 10 (IAA Pre-Brief) in the Pre-Build Stage Model now defines TWO sets of expectations that Foreman must acknowledge before proceeding:

### Task-Level Assurance Expectations
The Pre-Brief declares per-task assurance requirements (trigger category, required phases, evidence artifacts, overlays). These are the criteria the IAA will verify for each qualifying task individually.

### Wave-Level Ceremony Contract
The Pre-Brief also declares the wave-level Admin Ceremony Contract — a set of governance expectations that apply to the wave as a whole, not to individual tasks:

| Contract Field | What Foreman Must Ensure |
|---------------|--------------------------|
| `required_admin_ceremony_artifacts` | All listed artifacts are committed on the branch before handover |
| `required_final_state_conditions` | All listed conditions are true in the final state at handover |
| `required_cross_artifact_consistency_checks` | All listed consistency checks pass across the artifact bundle |
| `required_acknowledgements` | All listed acknowledgements are documented with correct owner |
| `required_role_boundaries` | All listed role boundaries are respected (no wrong-agent artifact authorship) |
| `required_handover_references` | All listed references are present and correctly populated in the handover package |

**Enforcement**: Unmet declared ceremony-contract items are explicit IAA rejection triggers (ACR-18 through ACR-21 in `INDEPENDENT_ASSURANCE_AGENT_CANON.md`). Foreman must self-verify all ceremony-contract items before invoking IAA at handover.

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
| 1.2.0 | 2026-04-22 | Added §Stage 10 Ceremony Contract Integration — documents the wave-level Admin Ceremony Contract alongside task-level assurance expectations; ACR-18 through ACR-21 enforcement references; CS2 mandate from maturion-isms#1447 |
| 1.1.0 | 2026-03-18 | Added mandatory Step 11 — Wave Reconciliation Checklist (`wave-reconciliation-checklist.md`) at wave close before PR open; CS2 mandate from wave 19/20 retrospective |
| 1.0.0 | 2026-03-03 | Initial protocol — wave-current-tasks.md creation mandate, Re-Anchor Pulse integration, absence behaviour |

---

*Authority: CS2 (Johan Ras) | Living Agent System v6.2.0*
