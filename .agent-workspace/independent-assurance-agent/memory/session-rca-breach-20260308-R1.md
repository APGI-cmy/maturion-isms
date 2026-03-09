# IAA Session Memory — session-rca-breach-20260308 (R1)

| Field | Value |
|-------|-------|
| `session_id` | session-rca-breach-20260308-R1 |
| `date` | 2026-03-08 |
| `pr_reviewed` | Branch copilot/fix-foreman-bootstrap-issue (pre-open) — wave breach-rca-20260308 |
| `invoking_agent` | foreman-v2-agent (handover audit invocation via issue #1013 comment) |
| `producing_agent` | foreman-v2-agent |
| `producing_agent_class` | FOREMAN |
| `pr_category` | KNOWLEDGE_GOVERNANCE |
| `checks_executed` | 24 applicable |
| `checks_passed` | 20 |
| `checks_failed` | 4 |
| `merge_gate_parity_result` | FAIL — 4/6 parity checks failed |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | N/A — REJECTION-PACKAGE issued; reference IAA-session-rca-breach-20260308-wavebreachRCA-20260308-R1-REJECTION |
| `rejection_file` | `.agent-admin/assurance/iaa-rejection-session-rca-breach-20260308-R1.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-iaa-prebrief-breach-rca-20260308, session-patch-T075-isolation-20260308-R3, R2, R1, session-cwt-envvars-20260307, session-wave15-schemadrift-20260307 |

---

## Failures Cited

| Failure | Rule | Fix |
|---------|------|-----|
| CORE-018 / A-021 PRIMARY | Deliverables not committed before IAA invocation — PREHANDOVER proof and session memory UNTRACKED; FAIL-ONLY-ONCE.md, index.md, parking-station, SCOPE_DECLARATION.md all MODIFIED-UNSTAGED | `git add` all deliverables + `git commit` before re-invoking IAA |
| CORE-007 / A-027 | PREHANDOVER Pre-IAA Commit Gate section has `[to be populated at commit time]` placeholder — never populated | Populate git log section in PREHANDOVER proof before its initial commit |
| CORE-015 | Session memory not committed (untracked) | Resolved by CORE-018 fix |
| A-026 / BL-027 | SCOPE_DECLARATION.md on HEAD contains prior T075 wave content (13 files from different branch) | Resolved by CORE-018 fix |

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 | IAA invocation evidence | PREHANDOVER present (filesystem) — governs; commit failure caught at CORE-018 |
| A-002 | No class exceptions | CONFIRMED — Foreman subject to IAA |
| A-015 | Tier 2 knowledge requires full ceremony | CONFIRMED — ceremony content sound but not committed |
| A-021 | Commit before invocation | FAIL — primary finding |
| A-026 | SCOPE_DECLARATION must match diff exactly | FAIL — stale T075 content on HEAD |
| A-027 | Pre-IAA commit gate with git log evidence | FAIL — placeholder unfilled |
| A-029 | PREHANDOVER immutability (§4.3b) | N/A — PREHANDOVER not yet committed; A-029 does not yet apply (not subject to immutability until first commit) |

---

## Substantive Assessment

All substantive deliverable content (FAIL-ONLY-ONCE.md v2.9.0, A-031 rule, INC-BOOTSTRAP-IMPL-001, session memory, ripple assessment) is SOUND in the working tree. OVL-KG-001 through OVL-KG-ADM-003 substantive checks all PASS. The REJECTION-PACKAGE is exclusively due to ceremony/commit-gate failures.

---

## Learning Notes

1. **Recurring A-021 pattern**: This is the THIRD consecutive instance of A-021 violation on this branch (PR #986 also had multiple A-021 violations — two REJECTION-PACKAGEs before R3 PASS). Per A-027, a third consecutive A-021 failure on the same PR/branch is a systemic workflow gap. The Foreman must add a Pre-IAA Commit Gate enforcement note to its PREHANDOVER template (S-009/prehandover-template.md) with explicit git status + git log evidence requirement as a mandatory pre-write step.

2. **PREHANDOVER proof written before commit**: The Foreman wrote the PREHANDOVER proof (including the Pre-IAA Commit Gate section) and left `[to be populated at commit time]` as the git log placeholder — then invoked IAA without completing the commit. The correct sequence is: stage all other deliverables → run git log → populate PREHANDOVER proof → commit everything together in one operation. The PREHANDOVER proof should be the LAST artifact written (and populated with real git log output) before the commit.

3. **Substantive content quality**: Despite the ceremony failures, the governance content (A-031, INC-BOOTSTRAP-IMPL-001, ripple assessment) is substantively sound. This is a good signal — the Foreman understands the RCA correctly. The workflow gap is purely in the commit sequencing.

---

## Suggestions for Improvement (MANDATORY — must not be blank)

**S-024 (new)**: The PREHANDOVER template (`prehandover-template.md`) should have the Pre-IAA Commit Gate section formatted as a MANDATORY CHECKPOINT with explicit instructions: "STOP HERE. Do NOT proceed to write this section until you have staged all deliverables AND obtained the actual git log output. Copy-paste the actual `git log --oneline -5` output here. If this section contains `[to be populated]` or any placeholder, the PREHANDOVER proof is NOT ready to commit."

This would prevent the recurring pattern where the PREHANDOVER proof is written speculatively before the commit is executed.

---

## Parking Station Entry

Appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`:
| 2026-03-08 | independent-assurance-agent | session-rca-breach-20260308-R1 | Phase 4 | Pre-IAA Commit Gate in PREHANDOVER template needs MANDATORY CHECKPOINT formatting with git log paste requirement (S-024) | session-rca-breach-20260308-R1.md |

---

## FAIL-ONLY-ONCE Registry Updates

**New pattern identified (A-027 threshold reached)**:
A-021 has now failed THREE consecutive invocations on branch `copilot/fix-foreman-bootstrap-issue`:
- PR #986 R1 (REJECTION — PREHANDOVER untracked)
- PR #986 R2 (REJECTION — PREHANDOVER + session memory absent)  
- This session (REJECTION — all primary deliverables uncommitted)

Per A-027: Third-consecutive A-021 failure on same PR/branch = systemic workflow gap. The Foreman MUST add Pre-IAA Commit Gate to PREHANDOVER template with git status + git log evidence. This should be flagged to the Foreman in the REJECTION-PACKAGE and carried forward as a learning note for the next IAA session.

No new FAIL-ONLY-ONCE entry required for IAA itself — A-021 and A-027 already cover this pattern. The obligation to update the PREHANDOVER template falls on the Foreman (per A-027).

---

*Authority: CS2 only (@APGI-cmy)*
*IAA adoption phase: PHASE_B_BLOCKING*
