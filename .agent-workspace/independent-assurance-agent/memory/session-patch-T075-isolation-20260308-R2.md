# IAA Session Memory — session-patch-T075-isolation-20260308-R2

| Field | Value |
|-------|-------|
| `session_id` | session-patch-T075-isolation-20260308-R2 |
| `date` | 2026-03-08 |
| `pr_reviewed` | Branch: copilot/fix-isolate-build-persistent-memory-test — fix(test): Isolate buildPersistentMemory() test (T-075) from shared state contamination |
| `invoking_agent` | foreman-v2-agent v6.2.0 |
| `producing_agent` | qa-builder (T-T075-ISO-001), foreman-v2-agent (coordination) |
| `producing_agent_class` | builder + foreman |
| `pr_category` | AAWP_MAT / BUILD_DELIVERABLE |
| `checks_executed` | 45 |
| `checks_passed` | 43 |
| `checks_failed` | 2 |
| `merge_gate_parity_result` | FAIL — validate-scope-to-diff.sh EXIT 1 (BL-027) |
| `verdict` | REJECTION-PACKAGE (R2) |
| `token_reference` | IAA-session-patch-T075-isolation-20260308-R2-REJECTION |
| `token_file_path` | `.agent-admin/assurance/iaa-token-session-patch-T075-isolation-20260308-R2-REJECTION.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-patch-T075-isolation-20260308 (R1 REJECTION), session-wave15-schemadrift-20260307, session-cwt-envvars-20260307, session-postfcwt-prodfails-v2-20260306, session-postfcwt-prodfails-20260306 |

---

## R1 Findings Re-verification

| R1 Finding | R1 Fix Claimed | R2 Verification | Outcome |
|------------|---------------|-----------------|---------|
| F-1: PREHANDOVER untracked (A-021) | SHA fe3f1af: PREHANDOVER committed | `git show fe3f1af --stat` confirms PREHANDOVER as new file ✅ | RESOLVED ✅ |
| F-2: qa-builder session memory absent (CORE-015) | SHA fe3f1af: qa-builder session memory committed | Confirmed at `.agent-workspace/qa-builder/memory/session-patch-T075-isolation-20260308.md` ✅ | RESOLVED ✅ |
| A-027: Pre-IAA Commit Gate section absent | Added to PREHANDOVER proof | Confirmed — Pre-IAA Commit Gate section present with git status + git log evidence ✅ | RESOLVED ✅ |

---

## New Finding (R2)

| # | Check | Finding | Fix Required |
|---|-------|---------|-------------|
| F-1 (R2) | A-026 / BL-027 | SCOPE_DECLARATION.md stale. validate-scope-to-diff.sh EXIT 1. 4 files in PR diff not declared: `.agent-admin/assurance/iaa-token-session-patch-T075-isolation-20260308.md`, `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-patch-T075-isolation-20260308.md`, `.agent-workspace/independent-assurance-agent/memory/session-patch-T075-isolation-20260308.md`, `.agent-workspace/qa-builder/memory/session-patch-T075-isolation-20260308.md` | Update SCOPE_DECLARATION.md to list all 8 PR diff files. Commit. Re-invoke IAA. |

---

## Substantive Assessment Summary

The test fix (T-T075-ISO-001) is correct, complete, and high quality. BD-001 through BD-024 all PASS. FFA: all 6 dimensions PASS. 25/25 tests GREEN. This REJECTION-PACKAGE requires zero code changes — only SCOPE_DECLARATION.md update needed.

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (IAA invocation evidence) | YES | PASS |
| A-002 (no class exceptions) | YES | PASS |
| A-021 (commit before IAA invocation) | YES — R1 primary finding | PASS (R1 remediated) |
| A-026 (SCOPE_DECLARATION accuracy) | YES | FAIL → REJECTION-PACKAGE R2 |
| A-027 (Pre-IAA Commit Gate section) | YES — R1 finding | PASS (R1 remediated) |
| A-028 (SCOPE_DECLARATION format) | YES | FAIL — derived from A-026; stale scope declaration |
| A-029 (PREHANDOVER immutability §4.3b) | YES | PASS |
| A-030 (CORE-019 re-invocation carve-out) | YES | PASS — R1 REJECTION token serves as correction addendum |

---

## Learning Notes

1. **A-026 staleness after remediation commits**: The producing agent updated SCOPE_DECLARATION.md for the initial wave commit but did not update it when remediation commits (PREHANDOVER, session memory, REJECTION token) were added to the branch. Pattern: SCOPE_DECLARATION.md must be updated whenever ANY commit is added to the branch — not just the initial deliverable commit. This is a recurring pattern where ceremony commits are treated as exempt from scope declaration.

2. **Remediation commit → scope declaration update coupling**: When a REJECTION-PACKAGE requires adding new files (PREHANDOVER proof, session memory), the foreman must ALSO update SCOPE_DECLARATION.md to include those files in the SAME remediation commit. This is not currently explicit in the PREHANDOVER template. Recommendation: add a checklist item to the Pre-IAA Commit Gate section: "SCOPE_DECLARATION.md updated to include ALL files currently in `git diff --name-only origin/main...HEAD`."

3. **Positive observation**: All R1 substantive findings (F-1, F-2, A-027) were correctly remediated. The underlying delivery quality remains high. This is the fourth consecutive invocation (wave15, cwt-envvars, patch-T075 R1, patch-T075 R2) where a ceremony-level finding blocked an otherwise-passing substantive delivery.

4. **Pattern observation — scope declaration as living document**: SCOPE_DECLARATION.md is treated as written once at wave start, but A-026 requires it to match the full PR diff at the time IAA is invoked. Any post-initial-commit additions require a scope declaration update. This pattern is NOT causing systemic failures if the producing agent treats scope declaration as a living document updated with each commit.

---

## Suggestions for Improvement (MANDATORY — must not be blank)

1. **SCOPE_DECLARATION.md update step in Pre-IAA Commit Gate section**: The Pre-IAA Commit Gate section (added per A-027) should include a step: "Run `.github/scripts/validate-scope-to-diff.sh` and confirm EXIT 0 before invoking IAA." This would catch A-026 failures before IAA is called. Currently the gate section shows `git status` and `git log` but does not run the scope validation script.

2. **Remediation commit template guidance**: Add to the foreman PREHANDOVER template (patch/hotfix variant): "When committing remediation artifacts (PREHANDOVER, session memory, REJECTION addendum), also update SCOPE_DECLARATION.md to include these new files in the same commit."

---

## Parking Station Entry

Appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`:
`| 2026-03-08 | independent-assurance-agent | session-patch-T075-isolation-20260308-R2 | Phase 4 | Add validate-scope-to-diff.sh invocation to Pre-IAA Commit Gate section of PREHANDOVER template — catches A-026 before IAA invocation | session-patch-T075-isolation-20260308-R2.md |`
`| 2026-03-08 | independent-assurance-agent | session-patch-T075-isolation-20260308-R2 | Phase 4 | Add SCOPE_DECLARATION update step to remediation commit guidance in PREHANDOVER template | session-patch-T075-isolation-20260308-R2.md |`

---

## fail_only_once_updates

**New pattern observed — scope declaration not updated after remediation commits**: This is a learnable pattern. Recommendation: add a new FAIL-ONLY-ONCE rule (A-031 candidate) — "When committing remediation artifacts to a branch after a REJECTION-PACKAGE, SCOPE_DECLARATION.md must be updated to include ALL newly committed files before re-invoking IAA." Escalate to foreman for PREHANDOVER template update in next governance wave.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Merge authority**: CS2 ONLY (@APGI-cmy)
