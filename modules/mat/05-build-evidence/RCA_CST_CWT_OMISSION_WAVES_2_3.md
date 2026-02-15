# RCA: CST/CWT Integration Testing Omitted from Waves 2 and 3

**RCA ID**: RCA-CST-CWT-OMISSION-001  
**Date**: 2026-02-15  
**Author**: Builder Agent (PR #168)  
**Severity**: High (Governance Compliance Failure)  
**Module**: mat  
**Waves Affected**: 2, 3  

---

## Deviation

Combined Subwave Testing (CST) and Combined Wave Testing (CWT) were not executed for Wave 2 or Wave 3, violating `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0 and Implementation Plan v1.1.0 Section 4 requirements.

Specifically:
1. Wave 2 convergence point (Tasks 2.1 + 2.3) did not receive CST validation
2. Wave 2 → Wave 3 gate did not receive CWT cross-wave integration validation
3. Test count reconciliation was not performed during IBWR (test debt undetected until PR #168 RCA)

---

## Impact

- **Wave 2 convergence point (Tasks 2.1 + 2.3)**: Evidence Collection API (Task 2.1) and Evidence Management UI (Task 2.3) converged without CST to validate their integration. Any integration issues between API and UI layers would have gone undetected until later waves.
- **Wave 2 → Wave 3 gate**: The transition from evidence collection to AI scoring lacked CWT to validate that evidence data structures correctly fed the scoring engine.
- **Test count reconciliation**: Without CWT requiring explicit test count verification, the BUILD_PROGRESS_TRACKER.md became stale (Wave 2 omitted entirely), undetected until the PR #168 review.
- **Audit trail gap**: No CWT evidence artifacts exist for Waves 2 and 3, creating a gap in the governance evidence chain.

---

## Root Cause

### 1. Implementation Plan v1.0.0 Omitted CST/CWT Section

**Finding**: The initial Implementation Plan (v1.0.0) was compiled from Architecture, FRS, TRS, and Test Registry but did not include `governance/canon/COMBINED_TESTING_PATTERN.md` as a derivation input. The canonical testing hierarchy (Unit → Subwave QA → Wave QA → CST → CWT → E2E) was not referenced.

**Correction**: Implementation Plan updated to v1.1.0 on 2026-02-14 with new Section 4 (CST/CWT requirements). However, this correction came after Wave 2 was already in progress.

### 2. IBWR Template Does Not Include CST/CWT Execution Checklist

**Finding**: The IBWR (In-Between Wave Reconciliation) template does not include explicit checklist items for:
- CST execution at convergence points
- CWT execution before wave closure
- Test count reconciliation (sum of wave tests = total GREEN)
- CST/CWT evidence artifact filing

**Impact**: Even with Implementation Plan v1.1.0 specifying CST/CWT, the IBWR template (the operational checklist used during wave closure) does not enforce it.

### 3. Merge Gate Automation Does Not Enforce CST/CWT Evidence

**Finding**: The merge gate interface workflow (`.github/workflows/merge-gate-interface.yml`) validates governance alignment, evidence artifacts, and stop-and-fix compliance, but does not check for:
- `*-CWT.md` file existence in `.agent-workspace/` for wave completion PRs
- Test count reconciliation mismatch between tracker and test suite
- CST evidence for waves with convergence points

---

## Corrective Action

1. **Retrospective CWT executed for Waves 0–3**:
   - Evidence: `.agent-workspace/foreman-isms/evidence/waves-0-3-retrospective-CWT.md`
   - Result: ✅ ALL 5 cross-wave scenarios PASS
   - Test count reconciled: 76 GREEN = 31 (W0) + 10 (W1) + 20 (W2) + 15 (W3)

2. **This RCA filed**:
   - Location: `modules/mat/05-build-evidence/RCA_CST_CWT_OMISSION_WAVES_2_3.md`

3. **BUILD_PROGRESS_TRACKER.md updated**:
   - CST/CWT deviation record added to Stage 5 (Build Execution)

---

## Preventive Action

### Priority 1: IBWR Template Enhancement

Add mandatory checklist items to IBWR template:
- [ ] CST executed at convergence points (if applicable for wave with concurrent tasks)
- [ ] CWT executed before IBWR closure (mandatory for all waves)
- [ ] Test count reconciliation completed (sum of wave tests = total GREEN)
- [ ] CST/CWT evidence artifacts filed in `.agent-workspace/{builder}/evidence/`

### Priority 2: Foreman Contract Update

Add explicit CST/CWT execution obligation:
> FM MUST execute CWT before approving IBWR completion. FM MUST NOT permit wave N+1 to begin without CWT PASS from wave N.

### Priority 3: Merge Gate Automation

Add validation rules:
- Check for `*-CWT.md` file existence in `.agent-workspace/` for IBWR/wave-completion PRs
- Block merge if test count reconciliation mismatch detected (tracker count ≠ vitest count)

---

## Lessons Learned (BL-030 Candidate)

**Title**: CST/CWT Execution Enforcement Gap  
**Type**: Policy / QA Execution  
**Severity**: High  

**Lesson**: CST/CWT requirements were documented in canonical governance artifacts (`COMBINED_TESTING_PATTERN.md`) but were not enforced during execution because:
1. The implementation plan initially omitted them (derivation chain gap)
2. The IBWR template does not include CST/CWT as checklist items
3. Merge gate automation does not validate CWT evidence existence

**Preventive**: 
- Update IBWR template with CST/CWT checklist
- Add merge gate automation for CWT evidence validation
- Update Foreman contract with CWT execution obligation
- Ensure implementation plan derivation chain always includes `COMBINED_TESTING_PATTERN.md`

**Propagation to Canon**:
- `governance/canon/COMBINED_TESTING_PATTERN.md` → Add enforcement clause (Section 8)
- IBWR template → Add CST/CWT checklist items

---

## Governance References

- `governance/canon/COMBINED_TESTING_PATTERN.md` v1.0.0
- `governance/canon/IN_BETWEEN_WAVE_RECONCILIATION.md`
- `modules/mat/03-implementation-plan/implementation-plan.md` v1.1.0 Section 4
- `governance/canon/BOOTSTRAP_EXECUTION_LEARNINGS.md` BL-025 (Combined Testing Pattern)
- `modules/mat/05-build-evidence/RCA_WAVE_3_TRACKER_UPDATE_FAILURE.md` (related RCA)

---

**RCA Status**: ✅ FINAL — All investigation complete, corrective action taken, preventive actions proposed.
