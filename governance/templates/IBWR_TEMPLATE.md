# Wave [N] Task [N.N] — IBWR (In-Between Wave Reconciliation) Report

**Wave**: [N]  
**Task**: [N.N] — [Task Name]  
**Builder**: [builder-name]  
**Date**: [YYYY-MM-DD]  
**Status**: ⏳ IN_PROGRESS | ✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED

---

## 1. What Was Accomplished

### Deliverables
[List all code artifacts, components, services, or features delivered]

1. **[Component/Feature Name]** (`path/to/artifact`)
   - Key capability 1
   - Key capability 2
   - Key capability 3

### Tests Turned GREEN
[List all tests that transitioned from RED to GREEN in this wave/task]

- **[TEST-ID]**: [Test Name] → ✅ GREEN
- **[TEST-ID]**: [Test Name] → ✅ GREEN

### Evidence Artifacts Produced
[List all evidence artifacts created during this wave/task]

- CST (Criteria Scenario Testing) report (if applicable)
- CWT (Component Wiring Test) report (if applicable)
- PREHANDOVER_PROOF.md
- SCOPE_DECLARATION.md
- This IBWR report

---

## 2. Scope Compliance

### In Scope (Wave [N] Task [N.N])
[List what was explicitly in scope for this wave/task]

- ✅ [Scope item 1]
- ✅ [Scope item 2]
- ✅ [Scope item 3]

### Out of Scope (Correctly Excluded)
[List what was correctly excluded from this wave/task]

- ❌ [Out of scope item 1] — [Why excluded]
- ❌ [Out of scope item 2] — [Why excluded]

### Scope Deviations (If Any)
[Document any deviations from planned scope with justification]

- None | [Deviation description with justification]

---

## 3. Learnings

### What Went Well
[Document successes and effective practices]

- [Success 1]
- [Success 2]

### What Was Challenging
[Document challenges encountered and how they were resolved]

- [Challenge 1] — [Resolution]
- [Challenge 2] — [Resolution]

### Recommendations for Future Sessions
[Actionable recommendations for future waves/tasks]

- [Recommendation 1]
- [Recommendation 2]

---

## 4. Governance Compliance

**Zero Test Debt**: ✅ PASS | ⚠️ DEBT_FOUND | ❌ FAIL  
- [ ] No skipped tests (`.skip()`, `.todo()`)
- [ ] No commented tests
- [ ] No incomplete tests
- [ ] All tests in scope turned GREEN (100%)

**Zero Warnings**: ✅ PASS | ⚠️ WARNINGS_FOUND | ❌ FAIL  
- [ ] Linting passes with zero warnings
- [ ] Build passes with zero warnings
- [ ] Type checking passes with zero warnings

**Scope-to-Diff Alignment**: ✅ PASS | ⚠️ DRIFT | ❌ FAIL  
- [ ] All code changes match SCOPE_DECLARATION.md
- [ ] No out-of-scope changes included
- [ ] Git diff reviewed and validated

**Evidence Requirements**: ✅ PASS | ⚠️ INCOMPLETE | ❌ FAIL  
- [ ] PREHANDOVER_PROOF.md created with gate validation evidence
- [ ] SCOPE_DECLARATION.md created and matches git diff
- [ ] CST/CWT reports created (if applicable per wave convergence)
- [ ] IBWR report created (this file)

**BUILD_PROGRESS_TRACKER Update**: ✅ PASS | ❌ FAIL  
- [ ] BUILD_PROGRESS_TRACKER.md updated with wave/task completion
- [ ] Completion date recorded
- [ ] Deliverables listed
- [ ] Tests turned GREEN documented
- [ ] Evidence artifacts referenced
- [ ] Any process deviations or lessons learned recorded

---

## 5. Wave Closure Checklist

**Pre-Handover Validation**:
- [ ] All tests in scope turned GREEN (100%)
- [ ] Zero test debt verified
- [ ] Zero warnings verified
- [ ] Build succeeds locally
- [ ] Linting passes locally
- [ ] All merge gates validated locally (see PREHANDOVER_PROOF.md)
- [ ] SCOPE_DECLARATION.md created and matches git diff
- [ ] BUILD_PROGRESS_TRACKER.md updated
- [ ] CST/CWT completed (if wave convergence point)
- [ ] IBWR report completed (this file)

**Handover Readiness**:
- [ ] All artifacts committed and pushed
- [ ] PR created with evidence bundle
- [ ] PR description references all evidence artifacts
- [ ] Ready for FM review and merge gate validation

---

## 6. Next Steps

[Document what should happen next — next wave/task assignment, blockers to resolve, dependencies to wait for, etc.]

- [Next step 1]
- [Next step 2]

---

**Template Version**: 1.0.0  
**Template Authority**: LIVING_AGENT_SYSTEM.md v6.2.0, IN_BETWEEN_WAVE_RECONCILIATION.md, BUILD_PHILOSOPHY.md  
**Mandatory Requirement**: BUILD_PROGRESS_TRACKER.md MUST be updated as part of wave completion (Section 4)  
**Created**: 2026-02-15  
**Issue Reference**: [Governance] Enforce BUILD_PROGRESS_TRACKER updates in wave completion PRs
