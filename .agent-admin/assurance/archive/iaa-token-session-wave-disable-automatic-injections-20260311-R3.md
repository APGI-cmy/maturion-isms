# IAA Session Token — wave-disable-automatic-injections-20260311-R3

**Token Type**: REJECTION-PACKAGE
**Session**: wave-disable-automatic-injections-20260311-R3
**Date**: 2026-03-11
**IAA Agent Version**: 6.2.0 / Contract v2.2.0
**PR**: branch: copilot/disable-automatic-injections-yet-again / commit: b475d0d
**Producing Agent**: copilot-swe-agent[bot] (CodexAdvisor proxy per CS2 issue #1061 assignment)
**Invoking Agent**: foreman-v2-agent
**Adoption Phase**: PHASE_B_BLOCKING
PHASE_B_BLOCKING_TOKEN: IAA-session-wave-disable-automatic-injections-20260311-R3-REJECTION
**Authority**: CS2 ONLY (@APGI-cmy)
**Re-invocation**: R3 (resolving R2 REJECTION-PACKAGE from commit e5bd632)

---

## ═══════════════════════════════════════════════════════════
## REJECTION-PACKAGE
## PR: copilot/disable-automatic-injections-yet-again (commit b475d0d, R3)
## Wave: wave-disable-automatic-injections-and-reinforce-contract
## 1 check FAILED (root). 3 cascade failures (merge gate). Merge blocked.
## ═══════════════════════════════════════════════════════════

### R1 + R2 STATUS: All 14 R1 findings and 1 R2 finding confirmed RESOLVED ✅

All substantive work verified correct (unchanged from R2 PASS confirmation):
- All 5 injection workflows correctly deactivated (workflow_dispatch only + DISABLED comment) ✅
- foreman-v2-agent.md: 5 re-anchor reminders (lines 250, 315, 370, 509, 522) ✅
- iaa-prebrief-inject.yml references fully removed from foreman contract Steps 1.8/2.7 ✅
- advisory_phase → PHASE_B_BLOCKING ✅
- contract_version → 2.7.0 ✅
- CANON_INVENTORY SHA256 verified exact match (5ec59f5d...) ✅
- S-033 exception documented in PREHANDOVER with all 3 required substitutes ✅
- polc-boundary-gate.yml gate logic intact (error message only change) ✅
- Character count 29,994 ≤ 30,000 ✅
- PREHANDOVER proof present ✅
- Foreman session memory present ✅
- foreman parking station row added to SCOPE_DECLARATION.md (R2 fix) ✅

---

### R3 FAILURE (1 root + 3 cascade)

**A-026 / CORE-021: SCOPE_DECLARATION.md incomplete — A-031 carve-out note absent**

**Finding**: 2 IAA ceremony artifacts from the R2 rejection ceremony (commit e5bd632) are
present in the branch diff (`git diff --name-only 39983aa..HEAD`) but not declared in
SCOPE_DECLARATION.md, and no A-031 carve-out note is present.

**Undeclared files:**
1. `.agent-admin/assurance/iaa-token-session-wave-disable-automatic-injections-20260311-R2.md`
   (IAA R2 rejection token — NEW file, committed by IAA in e5bd632)
2. `.agent-workspace/independent-assurance-agent/memory/session-wave-disable-automatic-injections-20260311-R2.md`
   (IAA R2 session memory — NEW file, committed by IAA in e5bd632)

Both files match the IAA ceremony artifact patterns eligible for A-031 carve-out:
- `.agent-admin/assurance/iaa-token-*.md` ✓
- `.agent-workspace/independent-assurance-agent/` ✓

The A-031 carve-out WOULD apply — but only when the A-031 carve-out note is explicitly
present in SCOPE_DECLARATION.md. The note is absent.

Per A-031: "If YES [matches IAA ceremony pattern] but carve-out note is absent →
A-026 FAIL (add carve-out note or declare the files)."
Per CORE-021: Any finding = REJECTION-PACKAGE. No CS2 waiver present.

**Why this appeared in R3 and not R2:**
At R2 review time (commit b591923), the R2 ceremony artifacts did not yet exist — they were
created by IAA as part of issuing the R2 rejection ceremony (commit e5bd632). This finding
is only visible in R3.

---

### Fix Required

**Option B — STRONGLY RECOMMENDED (breaks the perpetual cycle):**

Add the following A-031 carve-out note to `SCOPE_DECLARATION.md`, appended after the
scope table, before the Authority line:

```markdown
---

**A-031 Carve-Out Note:**
> IAA ceremony artifacts from R1 rejection (commit de3ceaf) and R2 rejection (commit
> e5bd632) committed on this branch (IAA session memory files, IAA rejection token files,
> IAA parking station updates) are excluded from the scope table above per A-031 carve-out.
> These are IAA-owned files committed by IAA after PREHANDOVER was committed; producing
> agent deliverables are fully declared above. Any R3 IAA artifacts written during this
> invocation are also excluded per this carve-out.
```

Commit and re-invoke IAA as R4. No other changes required.

**Option A (not recommended — creates new undeclared files with each round):**
Declare both files explicitly in the SCOPE_DECLARATION table. R4 invocation will then
introduce new IAA R3 artifacts (session memory + rejection token from this invocation)
requiring another round unless Option B carve-out is also added.

---

### Merge Gate Parity Result (§4.3)

| Check | Local | Reason |
|-------|-------|--------|
| Merge Gate Interface / merge-gate/verdict | FAIL ❌ | A-026 root finding |
| Merge Gate Interface / governance/alignment | FAIL ❌ | BL-027 (SCOPE_DECLARATION mismatch) |
| Merge Gate Interface / stop-and-fix/enforcement | FAIL ❌ | Cascade from A-026 |

---

### Full Check Summary (R3)

| Category | PASS | FAIL |
|----------|------|------|
| FAIL-ONLY-ONCE learning (A-001, A-002, A-021, A-022, A-023, A-024, A-025, A-026, A-028, A-029, A-030) | 10 | 1 (A-026) |
| Core invariants CORE-001 to CORE-022 | 21 | 1 (CORE-021 cascade) |
| AGENT_CONTRACT overlay (OVL-AC-001 to OVL-AC-ADM-004) | 11 | 0 |
| CANON_GOVERNANCE overlay (OVL-CG-001 to OVL-CG-ADM-002) | 7 | 0 |
| CI_WORKFLOW overlay (OVL-CI-001 to OVL-CI-005) | 5 | 0 |
| KNOWLEDGE_GOVERNANCE overlay (OVL-KG-001 to OVL-KG-005) | 5 | 0 |
| PRE_BRIEF_ASSURANCE overlay (OVL-INJ-001 to OVL-INJ-ADM-002) | 3 | 0 |
| Merge gate parity (§4.3) | 0 | 3 (cascade from A-026) |
| **TOTAL** | **62** | **5** (1 root + 4 cascade) |

Root cause: 1 finding — A-026 (SCOPE_DECLARATION missing A-031 carve-out note for R2 IAA ceremony artifacts).
Fix: 5-line addition to SCOPE_DECLARATION.md (A-031 carve-out note). No substantive re-work.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Session**: wave-disable-automatic-injections-20260311-R3
**Token Reference**: IAA-session-wave-disable-automatic-injections-20260311-R3-REJECTION
**Adoption Phase**: PHASE_B_BLOCKING
PHASE_B_BLOCKING_TOKEN: IAA-session-wave-disable-automatic-injections-20260311-R3-REJECTION
