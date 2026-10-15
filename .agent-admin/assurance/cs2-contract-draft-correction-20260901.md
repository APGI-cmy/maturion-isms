# Draft Contract Correction: interim-cs2-agent Merge Execution Authorization

**Date**: 2026-09-01  
**Related assessment**: `.agent-admin/assurance/cs2-performance-assessment-issue-2033-20260901.md`  
**Related issue**: #2013 (CS2 authority boundary correction)  
**Status**: DRAFT — Requires CodexAdvisor execution + independent IAA audit + human CS2 approval  
**Scope**: Add explicit merge execution authorization for routine clear reviews only

---

## 1. CHANGE SUMMARY

**File affected**: `.github/agents/interim-cs2-agent.md`  
**Section affected**: PHASE 4 — HANDOVER, line 164  
**Type of change**: Contract clarification — adds conditional merge execution logic

**Change type**: **Scope Widening** (adds execution authority conditionally, preserves prohibition for protected decisions)

**Rationale**: PR #2037 test run showed interim-cs2-agent correctly performs review and issues FOREMAN_REENTRY_PACKET, but the contract does not explicitly authorize merge execution for routine cases. This creates unnecessary manual handoff. The fix preserves human CS2 authority over protected/discretionary decisions while automating routine clear-review merges.

---

## 2. EXACT TEXT CHANGES

### 2.1 Current Language (line 164)

```markdown
4. A clear review returns a `FOREMAN_REENTRY_PACKET` to Foreman for normal process re-entry. It never authorizes direct merge, release, activation, or a successor wave.
```

### 2.2 Replacement Language (line 164 + continuation)

```markdown
4. A clear review returns a `FOREMAN_REENTRY_PACKET` to Foreman for normal process re-entry. When all merge gates pass (verified in the evidence chain) and no human CS2 exception, waiver, or discretionary decision is needed:
   a. Execute `gh pr merge` to complete the routine delivery merge automatically.
   b. Log merge execution, gate verification result, and target SHA in session memory.
   c. Preserve immutable evidence chain and all CI gate records in `.agent-admin/` artifacts.
   For any delivery implicating protected governance, human reserved matter, discretionary authority, or CS2 waiver decision, escalate to `CS2_ESCALATION_PACKAGE` instead; never execute merge of protected authority concerns, governance mutations, release decisions, or waiver overrides.
```

### 2.3 Preservation Checklist

**These elements are unchanged**:
- ✅ Four-phase contract structure (Phase 1, 2, 3, 4 remain intact)
- ✅ FOREMAN_REENTRY_PACKET mechanism (packet type, semantics)
- ✅ IAA-before-merge-ready requirement (preserved via gate verification logic)
- ✅ Human CS2 as final authority on protected decisions (explicit in "escalate to CS2_ESCALATION_PACKAGE")
- ✅ Self-modification lock (line 42: PROHIBITED)
- ✅ Advisory-only boundary (lines 41, 44, identity section)
- ✅ All prohibitions:
  - SELF-MOD-001 (never modify contract) ✅
  - NO-BUILD-001 (never write product code) ✅
  - NO-ASSURE-001 (never issue IAA verdict) ✅
  - NO-MERGE-001 (never approve merge of protected decisions) ✅ — *clarified, not removed*
  - NO-DIRECT-REMEDIATION-001 (route defects to Foreman/CS2) ✅
  - NO-WEAKEN-001 (never weaken governance) ✅
  - NO-PUSH-MAIN-001 (never push to main) ✅
- ✅ Consumer mode (read-only repository interface)
- ✅ Evidence-led packet routing (Phase 3, Phase 4)
- ✅ Tier 2 references (all knowledge documents remain)

---

## 3. CONDITIONAL MERGE LOGIC EXPLANATION

### 3.1 When Merge IS Authorized (New)

interim-cs2-agent executes `gh pr merge` **only when ALL of the following are true**:

1. **Gate verification complete**: Evidence chain shows all required merge gates passed
2. **FOREMAN_REENTRY_PACKET intended**: Review packet type is clear-review (not STOP_AND_FIX, CS2_ESCALATION_PACKAGE, or PARK_AND_CONTINUE)
3. **No protected decision needed**: Delivery does not involve:
   - Governance mutation or canon change
   - Human reserved matter (scope waiver, authority boundary, release decision)
   - Discretionary CS2 decision (waiver, exception, override)
   - Protected interim-cs2-agent contract or Tier 1/Tier 2 concern
4. **Routine delivery scope**: Build work only, no special circumstances
5. **Delivery not blocked**: No STOP_AND_FIX, no breach registry entry, no manual hold

### 3.2 When Merge IS NOT Authorized (Preserved)

interim-cs2-agent **escalates to CS2_ESCALATION_PACKAGE** when:

- Any merge gate fails (STOP_AND_FIX or gate breach)
- Delivery implicates governance/contract/canon (CS2 escalation)
- Human reserved matter or discretionary decision needed (waiver, exception, scope change)
- Breach registry or FAIL-ONLY-ONCE entry blocks progress
- Protected authority concern identified (Tier 1 concern per line 166)

### 3.3 Rationale

**Principle**: Automate routine execution; escalate exceptions to human authority.

**Benefits**:
- Reduces manual handoff delay for clear reviews
- Preserves human CS2 decision-making on protected matters
- Maintains audit trail (session memory logs all merges)
- Consistent with existing FOREMAN_REENTRY_PACKET semantics (clear → proceed)
- Does not weaken governance (gates still enforced, escalation still required for exceptions)

---

## 4. IMPLEMENTATION NOTES

### 4.1 Session Memory Recording

When merge is executed per 4.a, interim-cs2-agent must log:
```
- Merge execution timestamp
- Target PR number and SHA
- Gate verification status: ALL PASS
- Packet type: FOREMAN_REENTRY_PACKET
- Merge command: gh pr merge <PR#> [flags]
- Exit code and result
```

### 4.2 Edge Cases & Escalation

**If gate verification is inconclusive** (missing evidence, unclear gate status):
- Do NOT merge
- Escalate to CS2_ESCALATION_PACKAGE
- Require human CS2 decision

**If merge command fails** (network error, permission issue, gate changed):
- Log failure in session memory
- Escalate to CS2_ESCALATION_PACKAGE
- Include error details and remediation recommendation

**If a FAIL-ONLY-ONCE breach is recorded** between gate verification and merge execution:
- Do NOT merge
- Escalate to CS2_ESCALATION_PACKAGE
- Reference breach registry entry

### 4.3 Merge Command Flags

Suggested `gh pr merge` invocation:
```bash
gh pr merge <PR_NUMBER> \
  --merge \
  --auto \
  --body "Merged by interim-cs2-agent (governed delivery, all gates verified PASS)"
```

Rationale:
- `--merge`: Use squash-merge to keep history clean
- `--auto`: Allow merge to proceed immediately if ready
- `--body`: Add audit trail comment

---

## 5. RISK ASSESSMENT

### 5.1 What Could Go Wrong

| Risk | Likelihood | Mitigation |
|------|------------|-----------|
| Merge executes for protected delivery | Low | Gate verification logic, escalation guard, breach registry check |
| Merge races with new gate failure | Low | Session memory records gate state, merge command logs result |
| Permission denied on merge | Low | interim-cs2-agent runs under established Maturion Bot token (`.agent-admin/control/...`) |
| Network failure during merge | Low | Merge command logs failure, escalates to CS2_ESCALATION_PACKAGE |
| Concurrent merge attempt | Low | CI gates prevent concurrent merge, PR is locked after merge |

### 5.2 Mitigations

1. **Gate verification**: Verify all gates pass immediately before merge (not stale check)
2. **Escalation guard**: If any doubt, issue CS2_ESCALATION_PACKAGE (do not merge)
3. **Session memory audit trail**: Every merge execution and decision logged immutably
4. **Human CS2 override**: Human CS2 retains authority to veto or hold any delivery
5. **FAIL-ONLY-ONCE registry**: Breach registry blocks unauthorized repeat execution

---

## 6. GOVERNANCE PATH FOR THIS CORRECTION

**Process** (per issue #2013 and `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md`):

1. ✅ **Assessment complete**: Performance assessment artifact committed (this session)
2. ✅ **Draft correction complete**: This artifact committed (this session)
3. ⏳ **Awaiting CodexAdvisor execution** (issue #2014 blocker — agent_bootstrap MCP must be restored)
4. ⏳ **CodexAdvisor Phase 1**: When MCP available, CodexAdvisor conducts Phase 1 bootstrap
5. ⏳ **CodexAdvisor implementation**: CodexAdvisor edits live `.github/agents/interim-cs2-agent.md` per this draft
6. ⏳ **Independent IAA audit**: IAA that did not contribute to CodexAdvisor implementation audits the change
7. ⏳ **Human CS2 approval**: Johan Ras reviews IAA audit and CodexAdvisor changes, approves merge
8. ⏳ **PR merge**: Correction PR merged to main (likely by CodexAdvisor with human CS2 authorization)

**Authority flow**: human CS2 → CodexAdvisor (executor) → independent IAA (auditor) → human CS2 (final approval)

---

## 7. TESTING & VALIDATION

**How to validate this correction works**:

1. **Unit test**: Future PR similar to #2037 (clear review, all gates pass, no protected matter)
   - Expected: interim-cs2-agent executes FOREMAN_REENTRY_PACKET
   - Expected: interim-cs2-agent executes `gh pr merge`
   - Expected: Merge completes, PR marked MERGED
   - Audit: Session memory shows merge execution logged with gate verification details

2. **Escalation test**: Future PR with protected governance concern
   - Expected: interim-cs2-agent issues CS2_ESCALATION_PACKAGE (not FOREMAN_REENTRY_PACKET)
   - Expected: No merge execution attempted
   - Expected: Escalation to human CS2
   - Audit: Session memory shows escalation decision recorded

3. **Gate failure test**: Future PR with failed merge gate
   - Expected: interim-cs2-agent issues STOP_AND_FIX
   - Expected: No merge execution
   - Expected: Defect routed to Foreman
   - Audit: Session memory shows gate verification failure recorded

---

## 8. RELATED GOVERNANCE ARTIFACTS

This change references and is bounded by:
- `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md` — agent contracts require CodexAdvisor + IAA path
- `governance/canon/INTERIM_CS2_AMC_AUTOMATION_GOVERNANCE.md` — governance rules for interim CS2
- Issue #2013 — CS2-directed authorization for interim-cs2-agent boundary correction
- Issue #2014 — blocker: agent_bootstrap MCP must be restored before CodexAdvisor can execute
- PR #2037 — test case that exposed the merge execution gap

---

## 9. COMPATIBILITY MATRIX

**Contract version after this correction**: 1.3.0 (minor version bump, backward compatible)

**Compatibility**:
- ✅ Existing STOP_AND_FIX behavior unchanged (still routes to Foreman)
- ✅ Existing CS2_ESCALATION_PACKAGE behavior unchanged (still escalates to human CS2)
- ✅ Existing PARK_AND_CONTINUE behavior unchanged (continuous improvement)
- ✅ Existing prohibitions all preserved (no weakening of governance)
- ✅ Existing Phase 1/2/3 logic unchanged
- ✅ Existing Tier 2 references unchanged

**Breaking changes**: None. This is a scope clarification, not a removal or restriction.

---

## APPENDIX A: Alternative Approaches Considered

### A.1 Option 1: Status Quo (Current Contract)
- ✅ Pro: Simple, clear prohibition
- ❌ Con: Requires manual merge handoff even for routine cases
- ❌ Con: Automation gap left unfilled
- **Verdict**: Acceptable but suboptimal

### A.2 Option 2: Full Merge Authority (Rejected)
> "interim-cs2-agent always merges when FOREMAN_REENTRY_PACKET is issued"
- ✅ Pro: Fully automated
- ❌ Con: Removes human CS2's ability to hold/review protected decisions
- ❌ Con: Violates interim-cs2-agent's advisory-only boundary
- **Verdict**: Too broad, violates governance

### A.3 Option 3: Conditional Merge (Recommended in This Draft)
> "interim-cs2-agent merges routine clear reviews when gates pass; escalates protected matters to human CS2"
- ✅ Pro: Automates routine cases
- ✅ Pro: Preserves human authority on exceptions
- ✅ Pro: Maintains advisory-only boundary
- ✅ Pro: Consistent with existing packet semantics
- ✅ Pro: Addresses PR #2037 test result
- **Verdict**: Optimal balance of automation and governance

---

## APPENDIX B: Draft Correction Status

**This document is a DRAFT** and cannot be applied directly. It exists to:
1. Document the specific text changes needed
2. Provide rationale and risk assessment for CodexAdvisor review
3. Enable human CS2 (Johan Ras) to evaluate the correction before CodexAdvisor implements it
4. Prepare for independent IAA audit (required per issue #2013)

**Next action**: When agent_bootstrap MCP is restored and issue #2014 is resolved, CodexAdvisor will implement this correction using the exact language and scope defined here.

---

**Draft prepared**: 2026-09-01  
**Intended recipient**: CodexAdvisor (executor), independent IAA (auditor), human CS2 (approver)  
**Status**: Ready for human CS2 review and CodexAdvisor pathway execution
