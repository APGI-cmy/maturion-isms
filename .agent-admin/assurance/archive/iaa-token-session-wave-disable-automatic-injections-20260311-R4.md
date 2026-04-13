# IAA Session Token — wave-disable-automatic-injections-20260311-R4

**Token Type**: ASSURANCE-TOKEN (PASS)
**Session**: wave-disable-automatic-injections-20260311-R4
**Date**: 2026-03-11
**IAA Agent Version**: 6.2.0 / Contract v2.2.0
**PR**: branch: copilot/disable-automatic-injections-yet-again / commit: ea0ccb1
**Producing Agent**: copilot-swe-agent[bot] (CodexAdvisor proxy per CS2 issue #1061 assignment)
**Invoking Agent**: foreman-v2-agent
**Adoption Phase**: PHASE_B_BLOCKING
PHASE_B_BLOCKING_TOKEN: IAA-session-wave-disable-automatic-injections-20260311-R4-PASS
**Authority**: CS2 ONLY (@APGI-cmy)
**Re-invocation**: R4 (resolving R3 REJECTION-PACKAGE from commit cdd1b99)

---

## ═══════════════════════════════════════════════════════════
## ASSURANCE-TOKEN (PASS)
## PR: copilot/disable-automatic-injections-yet-again (commit ea0ccb1, R4)
## Wave: wave-disable-automatic-injections-and-reinforce-contract
## All checks PASS. Merge permitted (subject to CS2 approval).
## Token reference: IAA-session-wave-disable-automatic-injections-20260311-R4-PASS
## ═══════════════════════════════════════════════════════════

---

## R1 + R2 + R3 Resolution Summary

All 14 R1 findings, 1 R2 finding, and 1 R3 finding confirmed RESOLVED ✅

### Substantive work verified correct (unchanged since R2 PASS confirmation):
- All 5 injection workflows correctly deactivated (workflow_dispatch only + DISABLED comment) ✅
- foreman-v2-agent.md: 5 re-anchor reminders (lines 250, 315, 370, 509, 522) ✅
- iaa-prebrief-inject.yml references fully removed from foreman contract Steps 1.8/2.7 ✅
- advisory_phase → PHASE_B_BLOCKING ✅
- contract_version → 2.7.0 ✅
- CANON_INVENTORY SHA256 verified exact match ✅
- S-033 exception documented in PREHANDOVER with all 3 required substitutes ✅
- polc-boundary-gate.yml gate logic intact ✅
- Character count 29,994 ≤ 30,000 ✅
- PREHANDOVER proof present ✅
- Foreman session memory present ✅
- Foreman parking station row added to SCOPE_DECLARATION.md (R2 fix) ✅
- SCOPE_DECLARATION.md A-031 carve-out note present (R3 fix, commit ea0ccb1) ✅

### R4 Verification — A-031 Carve-Out Note (commit ea0ccb1):
**Finding**: SCOPE_DECLARATION.md now contains the A-031 carve-out note appended after
the scope table. The note explicitly covers IAA ceremony artifacts from R1 (commit de3ceaf),
R2 (commit e5bd632), and any R3/R4 invocation artifacts.

**Evidence**: `git show ea0ccb1 -- SCOPE_DECLARATION.md` confirms 9 lines added:
```
---

**A-031 Carve-Out Note:**
> IAA ceremony artifacts committed on this branch by the IAA agent (IAA session memory files,
> IAA rejection token files, IAA parking station updates) from R1 rejection (commit de3ceaf),
> R2 rejection (commit e5bd632), and any R3/R4 IAA invocation artifacts are excluded from the
> scope table above per A-031 carve-out. These are IAA-owned files committed by IAA after
> PREHANDOVER was committed; producing agent deliverables are fully declared in the table above.
```

This satisfies A-031 per the FAIL-ONLY-ONCE rule: carve-out note is explicitly present,
all IAA ceremony files (R1+R2+R3 rejection tokens, session memory, parking station) are
now covered. R4 artifacts (this token file + session memory) are also covered by the
"any R3/R4 IAA invocation artifacts" clause.

---

## Merge Gate Parity (§4.3)

| Check | Result |
|-------|--------|
| SCOPE_DECLARATION.md completeness (A-026/CORE-021) | PASS ✅ |
| A-031 carve-out note present | PASS ✅ |
| All substantive deliverables verified (unchanged from R2) | PASS ✅ |
| Merge Gate Interface / merge-gate/verdict | PASS ✅ |
| Merge Gate Interface / governance/alignment | PASS ✅ |
| Merge Gate Interface / character-count | PASS ✅ (29,994 ≤ 30,000) |

---

## Final Check Tally

| Category | PASS | FAIL |
|----------|------|------|
| FAIL-ONLY-ONCE learning (A-001, A-002, A-031) | 3 | 0 |
| Core invariants CORE-001 to CORE-022 | 22 | 0 |
| AGENT_CONTRACT overlay | 11 | 0 |
| CANON_GOVERNANCE overlay | 7 | 0 |
| CI_WORKFLOW overlay | 5 | 0 |
| KNOWLEDGE_GOVERNANCE overlay | 5 | 0 |
| PRE_BRIEF_ASSURANCE overlay | 3 | 0 |
| Merge gate parity (§4.3) | 3 | 0 |
| **TOTAL** | **59** | **0** |

---

**Verdict**: ASSURANCE-TOKEN (PASS)
**Merge permitted**: Subject to CS2 approval (@APGI-cmy)
**PREHANDOVER proof**: Unchanged (immutable post-commit — per §4.3b)
**Token file**: `.agent-admin/assurance/iaa-token-session-wave-disable-automatic-injections-20260311-R4.md`

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Session**: wave-disable-automatic-injections-20260311-R4
**Token Reference**: IAA-session-wave-disable-automatic-injections-20260311-R4-PASS
**Adoption Phase**: PHASE_B_BLOCKING
PHASE_B_BLOCKING_TOKEN: IAA-session-wave-disable-automatic-injections-20260311-R4-PASS
