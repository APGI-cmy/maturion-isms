# IAA Session Memory — session-wave-mat-gov-process-20260309-R2

| Field | Value |
|-------|-------|
| `session_id` | session-wave-mat-gov-process-20260309-R2 |
| `date` | 2026-03-09 |
| `pr_reviewed` | copilot/implement-governance-process-mat (wave-mat-gov-process) — R2 re-invocation |
| `invoking_agent` | foreman-v2-agent |
| `producing_agent` | mat-specialist (T-MGP-GOV-001–004), foreman-v2-agent (T-MGP-FM-001) |
| `producing_agent_class` | specialist / foreman |
| `pr_category` | AAWP_MAT |
| `checks_executed` | 22 (FAIL-ONLY-ONCE + CORE + AAWP_MAT overlay) |
| `checks_passed` | 20 |
| `checks_failed` | 2 |
| `merge_gate_parity_result` | FAIL |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-wave-mat-gov-process-20260309-R2-REJECTION |
| `token_file_path` | `.agent-admin/assurance/iaa-token-session-wave-mat-gov-process-20260309-R2-REJECTION.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-wave15r-gov-20260308-R2, session-wave15r-impl-R2-20260308, session-wave-session-refresh-auth-fix-20260309-R2, session-wave-session-refresh-auth-fix-20260309, session-waveOVLINJ-20260307 |

---

## R1 Failures and R2 Status

| R1 Failure | R2 Status |
|------------|-----------|
| CORE-013 / A-001 — PREHANDOVER not committed | ✅ RESOLVED |
| CORE-015 — Session memory not committed | ✅ RESOLVED |
| CORE-018 — Evidence sweep conditions fail | ✅ RESOLVED |
| A-021 — Staged not committed | ✅ RESOLVED |
| A-026 / BL-027 — SCOPE_DECLARATION mismatch | ❌ NOT RESOLVED — NEW ANALYSIS |

---

## Failures Cited (R2)

| Failure | Finding | Fix Required |
|---------|---------|-------------|
| A-026 / BL-027 | SCOPE_DECLARATION.md at HEAD references wave-OVL-INJ. `git diff 5344fcf HEAD -- SCOPE_DECLARATION.md` = empty. File was NEVER committed on this branch — only appears in grafted base commit. R1 diagnosis was incomplete: stated "SCOPE_DECLARATION will then match exactly after committing 2 staged files" but SCOPE_DECLARATION.md itself was also staged at R1 time and not committed in the fix (5271a5b). | Rewrite SCOPE_DECLARATION.md for wave-mat-gov-process listing all current diff files; add A-031 carve-out note; trim prior-wave entries; commit; re-invoke as R3 |
| A-028 | Prior-wave entries (OVL-INJ, session-refresh-auth-fix) not trimmed | Same fix as A-026 |

---

## fail_only_once_rules_applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 — IAA invocation evidence | YES | PASS — PREHANDOVER committed (5271a5b) |
| A-002 — No class exceptions | YES | PASS |
| A-021 — Commit before invocation | YES | PASS — git status clean |
| A-026 — SCOPE_DECLARATION matches diff | YES | **FAIL** — SCOPE_DECLARATION not updated |
| A-028 — SCOPE_DECLARATION format | YES | **FAIL** — prior-wave entries present |
| A-030 — CORE-019 re-invocation carve-out | YES | PASS — R1 rejection token committed |
| A-031 — IAA ceremony artifact carve-out | YES | Evaluated — carve-out does NOT help A-026 (producer deliverables must still be declared) |
| A-032 — Schema column compliance | YES | PASS — N/A (no INSERT/SELECT) |

---

## learning_notes

1. **Root cause pattern confirmed**: R1 REJECTION-PACKAGE diagnosis was incomplete. It correctly identified that PREHANDOVER + session memory were staged-not-committed, but missed that SCOPE_DECLARATION.md was ALSO staged at R1 time. The R1 fix (5271a5b) corrected 4 of 5 failures but omitted SCOPE_DECLARATION.md.

2. **A-026 verification must be direct**: IAA must always run `git diff 5344fcf HEAD -- SCOPE_DECLARATION.md` directly rather than accepting invoking agent's claim. The R2 invoking agent claimed "All 9 SCOPE_DECLARATION files confirmed" — this was incorrect. SCOPE_DECLARATION.md was never in the diff.

3. **Staged files require exhaustive enumeration**: When a R1 REJECTION-PACKAGE cites staged-not-committed files, the next invocation should enumerate ALL staged files explicitly to confirm ALL were committed (not just the named ceremony files). If `git stash list` or `git diff --cached --name-only` showed SCOPE_DECLARATION.md at R1 time, it should have been committed.

4. **SCOPE_DECLARATION fix is a single-action fix**: Producing agent only needs to write and commit one file (SCOPE_DECLARATION.md) to resolve both A-026 and A-028. R3 should pass all checks.

---

## Suggestions for Improvement

**Foreman workflow improvement**: The PREHANDOVER template should include a Pre-IAA Commit Gate step that explicitly checks `git diff --cached --name-only` (staged files) — not just `git status --porcelain` (which shows `?? untracked` but not staged state). If `git diff --cached` shows any files, they must be committed first. This would prevent future SCOPE_DECLARATION-staged-not-committed scenarios.

**IAA diagnosis improvement**: When citing "Commit the staged files. SCOPE_DECLARATION will then match exactly," IAA should enumerate EVERY staged file individually by running `git diff --cached --name-only` and listing each one. A catch-all "commit the staged files" instruction without exhaustive enumeration creates risk of partial fix.

---

## fail_only_once_updates

No new FAIL-ONLY-ONCE rule added this session. The pattern is covered by A-021 (commit before invocation) and A-026 (exact diff match). However, a learning note is recorded: when A-021 is cited, IAA should enumerate all staged files explicitly to prevent incomplete fix.

---

## Parking Station Entry

Entry appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`.

---

*Authority: CS2 ONLY (@APGI-cmy)*
*independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING*
