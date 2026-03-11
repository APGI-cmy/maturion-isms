# IAA Session Memory — session-wave-disable-automatic-injections-20260311-R3

```yaml
session_id: session-wave-disable-automatic-injections-20260311-R3
date: 2026-03-11
agent_version: independent-assurance-agent v6.2.0 / Contract v2.2.0
pr_reviewed: "branch copilot/disable-automatic-injections-yet-again / commit b475d0d (R3)"
invoking_agent: foreman-v2-agent
producing_agent: "copilot-swe-agent[bot] (CodexAdvisor proxy, CS2 issue #1061)"
producing_agent_class: foreman/overseer
pr_category: MULTI-CATEGORY (AGENT_CONTRACT + CANON_GOVERNANCE + CI_WORKFLOW + KNOWLEDGE_GOVERNANCE)
checks_executed: 67
checks_passed: 62
checks_failed: 5
root_failures: 1
cascade_failures: 4
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: IAA-session-wave-disable-automatic-injections-20260311-R3-REJECTION
token_file: .agent-admin/assurance/iaa-token-session-wave-disable-automatic-injections-20260311-R3.md
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave16-full-batch-20260310
  - session-wave-wf-contract-audit-20260310
  - session-wave16-orchestration-20260309-R2
  - session-wave16-orchestration-20260309
  - session-waveOVLINJ-20260307
prior_rejection_tokens_on_branch:
  - R1: .agent-admin/assurance/iaa-token-session-wave-disable-automatic-injections-20260311.md (de3ceaf)
  - R2: .agent-admin/assurance/iaa-token-session-wave-disable-automatic-injections-20260311-R2.md (e5bd632)
```

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 | IAA invocation evidence | PASS — PREHANDOVER proof has anticipated token reference (§4.3b compliant) |
| A-002 | No class exceptions | PASS — AGENT_CONTRACT PR, IAA mandatory |
| A-021 | Commit before invocation | PASS — R3 fix committed at b475d0d before this invocation |
| A-022 | Re-evaluate trigger categories | PASS — all categories re-evaluated; MULTI-CATEGORY confirmed |
| A-026 | SCOPE_DECLARATION completeness | FAIL ❌ — 2 IAA R2 ceremony artifacts undeclared; A-031 carve-out note absent |
| A-029 | PREHANDOVER immutability §4.3b | PASS — PREHANDOVER READ-ONLY post-commit; token written to dedicated file |
| A-030 | CORE-019 re-invocation carve-out | PASS — R1 and R2 correction addenda satisfy CORE-019 for immutable PREHANDOVER |
| A-031 | IAA ceremony artifact carve-out | TRIGGERED — undeclared files match IAA ceremony pattern; carve-out note absent → A-026 FAIL |

## Phase 3 Findings Summary

| Category | Pass | Fail |
|----------|------|------|
| FAIL-ONLY-ONCE learning | 10 | 1 (A-026/A-031) |
| Core invariants | 21 | 1 (CORE-021 cascade) |
| AGENT_CONTRACT overlay | 11 | 0 |
| CANON_GOVERNANCE overlay | 7 | 0 |
| CI_WORKFLOW overlay | 5 | 0 |
| KNOWLEDGE_GOVERNANCE overlay | 5 | 0 |
| PRE_BRIEF_ASSURANCE overlay | 3 | 0 |
| Merge gate parity | 0 | 3 (cascade) |
| **TOTAL** | **62** | **5** |

## Substantive Quality Confirmation (unchanged from R2)

All wave deliverables verified correct and unchanged in R3 (R3 only modified SCOPE_DECLARATION.md):
- 5 injection workflows deactivated to workflow_dispatch only with DISABLED comment ✅
- foreman-v2-agent.md v2.7.0: 5 re-anchor reminders at lines 250/315/370/509/522 ✅
- iaa-prebrief-inject.yml references removed from foreman Steps 1.8/2.7 ✅
- contract_version: 2.7.0, advisory_phase: PHASE_B_BLOCKING ✅
- INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.5.0 ✅
- CANON_INVENTORY SHA256 5ec59f5d... ✅
- Character count: 29,994 ≤ 30,000 ✅
- OVL-CI-005 S-033 exception with 3 required substitutes ✅
- OVL-INJ-001 artifact-existence-only model ✅
- A-031 carve-out note absent from SCOPE_DECLARATION → FAIL ❌

## Root Finding

**A-026 — SCOPE_DECLARATION.md incomplete (A-031 carve-out note absent)**

Two IAA R2 ceremony artifact files (committed by IAA in e5bd632) appear in `git diff --name-only 39983aa..HEAD` but are not declared in SCOPE_DECLARATION.md:
1. `.agent-admin/assurance/iaa-token-session-wave-disable-automatic-injections-20260311-R2.md`
2. `.agent-workspace/independent-assurance-agent/memory/session-wave-disable-automatic-injections-20260311-R2.md`

Both files match the A-031 carve-out pattern. The carve-out WOULD apply but the carve-out note is absent from SCOPE_DECLARATION.md. Per A-031: A-026 FAIL.

**Fix**: Add A-031 carve-out note to SCOPE_DECLARATION.md (Option B). This covers R1, R2, and R3 IAA artifacts. Commit and re-invoke as R4.

## Learning Notes

1. **A-031 carve-out note timing**: When a REJECTION-PACKAGE is issued, IAA commits its own ceremony artifacts (session memory + rejection token) to the branch. These become undeclared in SCOPE_DECLARATION for the NEXT invocation round. The producing agent must remember to add either an A-031 carve-out note OR explicitly declare these files in the next fix commit. The R2 rejection specified only the 1 finding (parking station) without reminding the foreman about this upcoming A-031 issue. Future REJECTION-PACKAGEs should proactively remind the foreman: "Also add A-031 carve-out note to cover these IAA ceremony artifacts that will appear in the diff after this rejection is committed."

2. **REJECTION-PACKAGE fix guidance improvement**: When IAA issues a REJECTION-PACKAGE in a re-invocation context, it should proactively flag that IAA's own ceremony artifacts from the current rejection will appear in the next round's diff, and recommend adding the A-031 carve-out note in the same fix commit.

3. **This finding was undetectable at R2 time**: The R2 artifacts (token + session) did not exist when R2 reviewed the branch. They were created by IAA during the R2 rejection ceremony and committed afterwards. This is the inherent timing gap that A-031 was designed to address — but A-031 requires the explicit note to invoke the carve-out.

## Suggestions for Improvement (MANDATORY — never blank)

1. **IAA REJECTION-PACKAGE should proactively warn about A-031 timing**: When issuing a REJECTION-PACKAGE in a re-invocation scenario, IAA should include a standard advisory: "NOTE: This rejection ceremony will commit IAA artifacts (session memory + rejection token) to the branch. In the next invocation, these files will appear in the diff. Add an A-031 carve-out note to SCOPE_DECLARATION.md in the same fix commit to prevent a new A-026 finding." Add this as a standard advisory block in all re-invocation REJECTION-PACKAGEs.

2. **Consider codifying A-031 proactive advisory as a FAIL-ONLY-ONCE rule**: Add A-033 rule: "When IAA issues a REJECTION-PACKAGE that commits ceremony artifacts to a shared branch, the REJECTION-PACKAGE must include a proactive A-031 advisory reminding the foreman to add the carve-out note in the next fix commit."

## Parking Station Entry

Appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`.

## fail_only_once_updates

Candidate for A-033: IAA REJECTION-PACKAGE proactive A-031 advisory rule (see learning notes above). To be added in next session if pattern recurs.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 / Contract v2.2.0
**Session**: session-wave-disable-automatic-injections-20260311-R3
**Date**: 2026-03-11
