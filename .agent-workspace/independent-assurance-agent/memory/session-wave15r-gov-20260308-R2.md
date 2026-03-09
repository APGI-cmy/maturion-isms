# IAA Session Memory — session-wave15r-gov-20260308-R2

| Field | Value |
|-------|-------|
| `session_id` | session-wave15r-gov-20260308-R2 |
| `date` | 2026-03-08 |
| `pr_reviewed` | copilot/update-governance-orchestration-wave15 (Issue #996 — Wave 15R governance, second invocation) |
| `invoking_agent` | foreman-v2-agent — PHASE 4 HANDOVER AUDIT REQUEST (re-invocation after REJECTION-PACKAGE) |
| `producing_agent` | foreman-v2-agent |
| `producing_agent_class` | foreman |
| `pr_category` | MIXED — AAWP_MAT + KNOWLEDGE_GOVERNANCE + CI_WORKFLOW |
| `checks_executed` | 27 PASS / 1 FAIL / 14 N/A |
| `checks_passed` | 27 |
| `checks_failed` | 1 |
| `merge_gate_parity_result` | FAIL |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-wave15r-gov-20260308-R2-REJECTION |
| `token_file_path` | `.agent-admin/assurance/iaa-token-session-wave15r-gov-20260308-R2-REJECTION.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-wave15r-gov-20260308 (prior REJECTION), session-prebrief-wave15r-20260308, session-rca-breach-20260308-R2, session-patch-T075-isolation-20260308-R3, session-wave15-schemadrift-20260307 |

---

## Failures Cited

| # | Check | Finding | Fix |
|---|-------|---------|-----|
| 1 | CORE-007 | PREHANDOVER lines 98/100/106 contain unresolved template placeholders: `[commit hash]` not replaced with `034f7e4`; "to be populated at commit time" header; trailing template note. Fix #2 from prior rejection was claimed complete but was not. | Under A-029: commit correction addendum file documenting actual hash = 034f7e4 + request CS2 adjudication |

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied? | Outcome |
|------|----------|---------|
| A-001 | YES | Pre-Brief committed eeb48f1 — invocation evidence present. PASS. |
| A-002 | YES | Foreman class not exempt. CONFIRMED. |
| A-021 | YES | PASS — all 18 files committed in 034f7e4 prior to IAA invocation |
| A-026 | YES | PASS — 18 declared = 18 in diff, exact match |
| A-028 | YES | PASS — list format, backtick-wrapped, current wave only |
| A-029 | YES | PREHANDOVER immutable — IAA wrote dedicated token file, did NOT edit PREHANDOVER |
| A-030 | NOTED | Correction addendum path recommended for CORE-007 resolution (A-030 directly covers CORE-019; extension to CORE-007 requires CS2 adjudication) |

---

## fail_only_once_updates

None added this session. Noting: Fix #2 from a REJECTION-PACKAGE was claimed complete in re-invocation request but was not fully applied. This is a distinct failure pattern — partial fix misrepresented as complete. If this pattern recurs, a new A-rule should be proposed to CS2 requiring Foreman to verify each cited failure individually against the committed artifacts before claiming fix.

## Suggestions for Improvement

The A-030 correction addendum principle (currently scoped to CORE-019 only) should be formally extended by CS2 to cover CORE-007 placeholder scenarios where the PREHANDOVER is immutable under A-029. Without this extension, a partially-committed placeholder creates an unresolvable loop for governance-only PRs. Recommend CS2 issue an A-031+ rule formalising the correction addendum path for any CORE check where the PREHANDOVER is the immutable artifact.

## Parking Station Entry
| 2026-03-08 | independent-assurance-agent | session-wave15r-gov-20260308-R2 | Phase 3 | A-030 extension to CORE-007 needed for immutable-PREHANDOVER placeholder scenarios | session-wave15r-gov-20260308-R2.md |
