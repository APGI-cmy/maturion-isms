# IAA Session Memory — session-wave-mat-gov-process-20260309

| Field | Value |
|-------|-------|
| `session_id` | session-wave-mat-gov-process-20260309 |
| `date` | 2026-03-09 |
| `pr_reviewed` | wave-mat-gov-process / branch `copilot/implement-governance-process-mat` |
| `invoking_agent` | foreman-v2-agent |
| `producing_agent` | mat-specialist (T-MGP-GOV-001 through T-MGP-GOV-004), foreman-v2-agent (T-MGP-FM-001) |
| `producing_agent_class` | specialist + foreman |
| `pr_category` | AAWP_MAT |
| `checks_executed` | 30 (22 CORE + 4 FAIL-ONLY-ONCE learning + 4 AAWP_MAT overlay) |
| `checks_passed` | 25 |
| `checks_failed` | 5 |
| `merge_gate_parity_result` | FAIL |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-wave-mat-gov-process-20260309-REJECTION |
| `token_file_path` | `.agent-admin/assurance/iaa-token-session-wave-mat-gov-process-20260309-REJECTION.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-wave-session-refresh-auth-fix-20260309-R2 (PASS), session-wave-session-refresh-auth-fix-20260309 (REJECTION), session-wave15r-impl-R2-20260308, session-wave15r-impl-20260308, session-wave15r-gov-20260308-R2 |

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (invocation evidence present) | YES | FAIL — PREHANDOVER proof staged (`A`), not committed; not in committed PR artifacts |
| A-002 (no class exceptions) | YES | PASS — no exemption claimed |
| A-021 (commit before invoking) | YES | FAIL — PREHANDOVER proof and session memory are staged (`A` in git status), not committed. Pre-IAA Commit Gate misinterpreted `A` as equivalent to committed. |
| A-026 (SCOPE_DECLARATION matches committed diff) | YES | FAIL — SCOPE_DECLARATION lists 9 files; committed diff shows 7; 2 staged-only files (#3, #4) not in committed diff. A-031 carve-out does not apply. |
| A-032 (Schema Column Compliance) | YES | PASS — no INSERT/SELECT on named Supabase tables |

---

## Failures Cited

| Failure | Fix Required |
|---------|-------------|
| CORE-013: PREHANDOVER not committed | `git commit` including PREHANDOVER proof and session memory |
| CORE-015: Session memory not committed | Same commit as CORE-013 fix |
| CORE-018: Evidence sweep conditions (a)+(b) fail | Same commit as above |
| A-021: Staged-before-IAA | Commit files; update Pre-IAA Commit Gate to check `git log` for file existence in commit history |
| A-026/BL-027: SCOPE_DECLARATION mismatch | After committing 2 files, SCOPE_DECLARATION will match exactly |

---

## Positive Substantive Observations

1. **FRS v2.2.0 (FR-104–111)**: High quality — each FR has source gap reference, priority, dependencies, test ID reference, and acceptance criteria. Derivation chain from completeness review is clean.
2. **TRS v2.0.0 (TR-103–110)**: High quality — clean FR→TR derivation, specific Deno runtime details, table/component names, correct dependency ordering.
3. **Implementation plan v2.7.0 (Wave 16.1–16.9)**: Well-structured — correct dependency graph (16.3/16.4 blocked on 16.5/AIMC), builder assignments, RED QA gate requirements per subwave.
4. **Traceability matrix**: 8 clean bidirectional FR→TR pairs.
5. **Doc-only confirmed**: No code, schema, test, or CI changes in any commit or staged diff.
6. **CS2 authorization confirmed**: Issue opened by @APGI-cmy, CS2 re-alignment directive posted.
7. **IAA Pre-Brief committed** at 7d7e624.
8. **A-029 compliance**: `iaa_audit_token` uses expected reference format (not PENDING).

---

## Advisory Notes (Non-Rejection)

1. **GAP-017 (JWT auth) and GAP-019 (evidence_submissions migration)**: Tracked in Wave 16.6 acceptance criteria but lack dedicated FRs. JWT auth is a security concern — recommend adding TR entries for cleaner security traceability in future waves.
2. **PREHANDOVER template `## IAA Agent Response (verbatim)` section**: Currently says "[AWAITING IAA ASSURANCE-TOKEN — will be populated before commit]". Under §4.3b, this section is NOT required in the PREHANDOVER proof (verbatim response lives in dedicated token file). Template phrasing should be updated to clarify §4.3b architecture to prevent future confusion about post-commit editing intent.

---

## Learning Notes

1. **A-021 RECURRING PATTERN**: This is the SECOND recent occurrence of the staged-vs-committed confusion (prior: session-wave-session-refresh-auth-fix-20260309 R1). The Pre-IAA Commit Gate in the PREHANDOVER template checks for absence of `??` (untracked) entries but NOT for `A` (staged/not-committed) entries. This gap causes repeated A-021 failures across different waves. **Systemic fix needed**: Pre-IAA Commit Gate should explicitly check `git status --porcelain | grep -v "^$"` — ANY output (not just `??`) should block IAA invocation. The presence of `A` entries means the PREHANDOVER ceremony was not fully committed. This pattern is now two occurrences in recent sessions and warrants escalation to the PREHANDOVER template update.

2. **SCOPE_DECLARATION declared-vs-committed delta**: When foreman stages-but-does-not-commit ceremony files before IAA invocation, SCOPE_DECLARATION will always list those files but they won't appear in the committed diff. This is a cascading failure from A-021. Both issues resolve with a single commit.

3. **Substantive quality was not the issue**: The wave deliverables (FRS, TRS, impl-plan, tracker) are genuinely high quality. The rejection is entirely ceremony-procedural, not substantive. This is a good signal that the producing agents understand the governance architecture well — the gap is strictly in the Pre-IAA Commit Gate interpretation.

---

## FAIL-ONLY-ONCE Updates

| Update | Action |
|--------|--------|
| A-021 recurring (2nd occurrence, different PRs) | Consider strengthening A-027 (third-consecutive rule) to also apply cross-wave when the SAME Root Cause (staged-vs-committed confusion) recurs within N sessions. Not yet third consecutive on same PR, but pattern is systemic. |

---

## Suggestions for Improvement

1. **Pre-IAA Commit Gate template fix (MANDATORY — immediate)**: The PREHANDOVER template's Pre-IAA Commit Gate section should be updated to require that `git status --porcelain` produces **empty output** (not just no `??` entries). The current check "No untracked (`??`) ceremony files" passes on `A` staged entries, which are NOT committed. The gate should read: "git status --porcelain must show no output at all — any entry (including `A` staged entries) indicates uncommitted files and blocks IAA invocation." This is a concrete, actionable template change that would have prevented both the session-wave-session-refresh-auth-fix R1 and this rejection.

2. **Advisory: Add dedicated FR for security gap GAP-017 (JWT auth)**: In the next TRS/FRS revision, consider adding `FR-112: JWT Authentication for AI Endpoints` and `TR-111: JWT Enforcement on POST /api/ai/request` for cleaner security traceability. Currently tracked only as Wave 16.6 acceptance criteria — which may cause downstream test traceability issues.

---

## Parking Station Entry

Appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`.

---

*Authority: CS2 (Johan Ras / @APGI-cmy)*
*independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING | SELF-MOD-IAA-001 ACTIVE*
