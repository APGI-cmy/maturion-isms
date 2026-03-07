# IAA Session Memory — Wave 15 Schema Drift Remediation

| Field | Value |
|-------|-------|
| `session_id` | session-wave15-schemadrift-20260307 |
| `date` | 2026-03-07 |
| `pr_reviewed` | Branch: copilot/add-migration-for-parse-tasks-table / Issue #971 |
| `invoking_agent` | foreman-v2-agent (CS2-authorised, Issue #971) |
| `producing_agent` | schema-builder (T-W15-SCH-001) + foreman-v2-agent (T-W15-SCH-002) |
| `producing_agent_class` | builder + foreman |
| `pr_category` | AAWP_MAT |
| `checks_executed` | 39 |
| `checks_passed` | 33 |
| `checks_failed` | 5 |
| `merge_gate_parity_result` | FAIL (validate-scope-to-diff.sh EXIT 1 — BL-027) |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-wave15-schemadrift-wave15-20260307-REJECTION |
| `token_file_path` | `.agent-admin/assurance/iaa-token-session-wave15-schemadrift-wave15-20260307.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-157-wave-wf-dispatch-20260306, session-158-govliaison-051-reaudit-20260306, session-postfcwt-prodfails-20260306, session-postfcwt-prodfails-v2-20260306 |

---

## Failures Cited

| # | Check | Finding | Fix Required |
|---|-------|---------|-------------|
| F-1 | CORE-018 / CORE-013 | PREHANDOVER proof untracked — not committed to branch | `git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15-schemadrift-wave15-20260307.md && git commit && git push` |
| F-2 | BD-001 / A-021 | BUILD_PROGRESS_TRACKER.md staged but not committed | Already staged — `git commit -m "gov: add Wave 15 Schema Drift RCA to BUILD_PROGRESS_TRACKER" && git push` |
| F-3 | CORE-015 | Foreman session memory untracked — not in PR bundle | `git add .agent-workspace/foreman-v2/memory/session-wave15-schemadrift-20260307.md && git commit && git push` |
| F-4 | A-026 / BL-027 (parity) | SCOPE_DECLARATION.md stale — references prior Wave 15 impl PR, not schema drift hotfix | Update SCOPE_DECLARATION.md to list files for branch `copilot/add-migration-for-parse-tasks-table`; `git commit && git push` |
| F-5 | CORE-018 (condition b) | Session memory not on branch (same root as F-3) | Same as F-3 |

---

## Migration SQL Assessment

All 19 pre-brief technical checks PASS. The migration SQL is correct, complete, and production-ready.
No SQL changes required. This REJECTION-PACKAGE is purely for uncommitted ceremony artifacts.

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (IAA invocation evidence) | YES — PREHANDOVER proof not committed | FAIL (F-1) |
| A-002 (no class exceptions) | YES — foreman correctly invoked IAA | PASS |
| A-021 (commit before IAA invocation) | YES — BUILD_PROGRESS_TRACKER staged; PREHANDOVER untracked | FAIL (F-1, F-2, F-3) |
| A-026 (SCOPE_DECLARATION match) | YES — stale SCOPE_DECLARATION confirmed by validate-scope-to-diff.sh EXIT 1 | FAIL (F-4) |
| A-029 (PREHANDOVER immutability §4.3b) | YES — PREHANDOVER not edited; token written to dedicated file | PASS |
| A-030 (CORE-019 first invocation carve-out) | YES — first invocation; token file created this session | PASS (carve-out applied) |

---

## fail_only_once_updates

None this session. All findings are covered by existing rules (A-021, A-026, CORE-013, CORE-015, CORE-018).

No new rules warranted. Existing rules are functioning correctly and caught all failures.

---

## Learning Notes

1. **A-021 remains the most common ceremony failure**: This is now the 4th+ instance of A-021 failures (PREHANDOVER and session memory untracked, BUILD artifact staged-not-committed). The pattern is consistent: producers commit implementation artifacts but forget to commit ceremony artifacts in the same commit sequence. The fix is always the same: bundle all ceremony files in one commit before IAA invocation. A-021 is well-codified; no new rule needed.

2. **SCOPE_DECLARATION.md hotfix PR discipline**: When creating a hotfix branch on top of an existing wave PR branch, the SCOPE_DECLARATION.md from the parent wave remains in the working tree and will fail A-026 unless explicitly updated. Hotfix PRs must ALWAYS update SCOPE_DECLARATION.md to reflect the hotfix scope. This is a known pattern — A-026 is working as designed.

3. **git status `M ` (staged) vs `??` (untracked) vs committed**: IAA must always confirm committed state via `git diff --name-only origin/main...HEAD`, NOT via `git status`. PREHANDOVER proofs that claim "✅ Committed" must be verified against the actual git diff before IAA can accept the claim. Local file existence ≠ committed.

4. **Migration SQL quality is excellent**: The schema-builder produced a migration that satisfies all 19 pre-brief checks including correct FK design, idempotent guards, RLS with org-isolation, and no stubs. The quality of the build deliverable is high. This pattern (high-quality SQL, ceremony artifact failures) should inform future waves to ensure ceremonial completeness is handled with the same care as build quality.

5. **First invocation carve-outs (CORE-016, CORE-019) working correctly**: Both carve-outs applied cleanly. Pre-populated `iaa_audit_token` format is valid. A-029/A-030 architecture is stable.

---

## Suggestions for Improvement (MANDATORY)

**Primary suggestion (actionable)**: Foreman and builder agents should integrate a mandatory pre-IAA commit gate into their PREHANDOVER ceremony. Specifically, before invoking IAA, the producing agent must run:
```
git status --short
git diff --name-only origin/main...HEAD
```
...and verify that ALL declared evidence artifacts appear in the committed diff (not just staged or untracked). If any declared artifact is staged (`M`) or untracked (`??`), the agent must commit it BEFORE invoking IAA. This could be added as a mandatory checklist step in the PREHANDOVER template. **Recommendation: add this as a standard PREHANDOVER ceremony step for all future waves.**

**Secondary suggestion (informational)**: For hotfix/addendum branches, SCOPE_DECLARATION.md should be the FIRST file updated in the first commit (not last), to ensure it tracks the correct scope from the start of the branch lifecycle. Currently it's often updated last, leading to stale scope declarations at IAA invocation time.

---

## Parking Station

Entry appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`.

---

## Open Items Carried Forward

1. governance-liaison-isms contract `advisory_phase: PHASE_A_ADVISORY` stale (IAA PHASE_B_BLOCKING) — requires CS2/CodexAdvisor update via AGCFPP-001. Status: OPEN (carried from session-157).

---

*Authority: CS2 (@APGI-cmy) | independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING*
