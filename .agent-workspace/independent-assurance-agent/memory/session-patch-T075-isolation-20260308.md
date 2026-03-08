# IAA Session Memory — session-patch-T075-isolation-20260308

| Field | Value |
|-------|-------|
| `session_id` | session-patch-T075-isolation-20260308 |
| `date` | 2026-03-08 |
| `pr_reviewed` | Branch: copilot/fix-isolate-build-persistent-memory-test — fix(test): Isolate buildPersistentMemory() test (T-075) from shared state contamination |
| `invoking_agent` | foreman-v2-agent v6.2.0 |
| `producing_agent` | qa-builder (T-T075-ISO-001), foreman-v2-agent (coordination) |
| `producing_agent_class` | builder + foreman |
| `pr_category` | AAWP_MAT / BUILD_DELIVERABLE |
| `checks_executed` | 39 |
| `checks_passed` | 33 |
| `checks_failed` | 6 |
| `merge_gate_parity_result` | FAIL (committed artifact sweep — PREHANDOVER untracked, session memory absent) |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-patch-T075-isolation-20260308-REJECTION |
| `token_file_path` | `.agent-admin/assurance/iaa-token-session-patch-T075-isolation-20260308.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-wave15-schemadrift-20260307, session-cwt-envvars-20260307, session-postfcwt-prodfails-v2-20260306, session-postfcwt-prodfails-20260306, session-158-govliaison-051-reaudit-20260306 |

---

## Failures Cited

| # | Check | Finding | Fix Required |
|---|-------|---------|-------------|
| F-1 | CORE-018 (a) / A-021 | PREHANDOVER proof untracked — not committed. `git status` shows `??` for `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-patch-T075-isolation-20260308.md` | `git add` + `git commit` + `git push` |
| F-2 | CORE-015 | No session memory for qa-builder in PR bundle. Not in diff, not listed in PREHANDOVER bundle table. | Create `.agent-workspace/qa-builder/memory/session-patch-T075-isolation-20260308.md` and commit |
| F-3–F-6 | CERT-001 to CERT-004 | All derived from F-1 and F-2. Resolved by committing the two missing artifacts. | Same as F-1 + F-2 |

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (IAA invocation evidence) | YES — `iaa_audit_token` in untracked PREHANDOVER; verified per working tree | PASS (committed IAA pre-brief = invocation evidence; PREHANDOVER itself the issue) |
| A-002 (no class exceptions) | YES — foreman correctly invoked IAA | PASS |
| A-021 (commit before IAA invocation) | YES — PREHANDOVER untracked (working-tree-only) | FAIL → REJECTION-PACKAGE |
| A-026 (SCOPE_DECLARATION accuracy) | YES — validate-scope-to-diff.sh EXIT 0, exact match confirmed | PASS |
| A-028 (SCOPE_DECLARATION format) | YES — list format correct, no prior-wave entries | PASS |
| A-029 (PREHANDOVER immutability §4.3b) | YES — `iaa_audit_token` pre-populated with expected reference format | PASS (field present; underlying issue is uncommitted file, not format) |
| A-030 (CORE-019 re-invocation carve-out) | NOTED — on re-invocation, this rejection token serves as correction addendum | PENDING (applicable on re-invocation) |

---

## Substantive Assessment Summary

The test fix itself is CORRECT. BD-001 through BD-024 all PASS.
BD-013 anti-dodging: PASS — `SupabasePersistentMemoryAdapter` directly instantiated; real persist()/retrieve() round-trip; `toHaveLength(1)` + content assertion ensures non-vacuous test.
This REJECTION-PACKAGE requires ZERO code changes — only two uncommitted ceremony artifacts.

---

## Learning Notes

1. **A-021 recurrence (third wave in a row)**: Wave 15 schema drift, CWT env vars, and now patch-T075 all had A-021 violations. This is now a confirmed systemic pattern across foreman and builder classes. IAA should flag this pattern prominently at the start of every future review — check `git status` for untracked artifacts BEFORE running any other checks.

2. **Session memory omission pattern**: This is the first time IAA has observed a PREHANDOVER proof that does not list a session memory artifact at all (as opposed to having it untracked). The producing agent (qa-builder) did not create session memory for this wave. This suggests the session memory requirement may not be sufficiently prominent in the PREHANDOVER template for patch/hotfix waves. Consider a carry-forward note to foreman to review PREHANDOVER template for patch waves.

3. **Positive observation**: The substantive delivery quality is high. The BD-013 anti-dodging design is explicit and well-documented. The FFA passed 6/6. Once ceremony is corrected, this should ASSURANCE-TOKEN on re-invocation.

---

## Suggestions for Improvement (MANDATORY — must not be blank)

1. **Pre-IAA Commit Gate hardening**: Given three consecutive A-021 violations across different agents and waves, consider adding a `pre-iaa-commit-check.sh` script to the merge gate that validates all ceremony artifacts (PREHANDOVER proof, session memory) are tracked (`git ls-files`) before IAA is invokeable. This would surface the error before IAA rather than inside IAA.

2. **Patch wave PREHANDOVER template**: The PREHANDOVER template may lack explicit guidance for patch/hotfix waves on the session memory requirement. Consider adding a dedicated patch-wave checklist section that explicitly includes "qa-builder session memory committed to branch" as a mandatory checkbox.

---

## Parking Station Entry

Appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`:
`| 2026-03-08 | independent-assurance-agent | session-patch-T075-isolation-20260308 | Phase 3/4 | Pre-IAA commit gate script to catch untracked PREHANDOVER artifacts before IAA invocation — A-021 systemic pattern (3 consecutive violations) | session-patch-T075-isolation-20260308.md |`

---

## fail_only_once_updates

**A-021 recurrence pattern (third consecutive)**: Per learning note 1, this is a systemic pattern. Per FAIL-ONLY-ONCE rule A-027: "Third-consecutive A-021 failure on same PR/branch = systemic workflow gap — producing agent must add Pre-IAA Commit Gate to PREHANDOVER template with git status + git log evidence."

**A-027 TRIGGERED**: This is (at minimum) the third consecutive PR where A-021 was violated (wave15-schemadrift, cwt-envvars, patch-T075-isolation). A-027 is now triggered. The producing agent (foreman-v2-agent) must add a Pre-IAA Commit Gate section to the PREHANDOVER template showing `git status` and `git log` evidence before IAA is invoked. This must be present on the next PREHANDOVER proof.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Merge authority**: CS2 ONLY (@APGI-cmy)
