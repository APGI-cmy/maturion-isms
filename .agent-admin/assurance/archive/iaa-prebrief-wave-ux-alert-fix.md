# IAA Pre-Brief — Wave UX-Alert-Fix

**Artifact Type**: PRE-BRIEF  
**IAA Session**: session-156  
**Wave**: wave-ux-alert-fix  
**Date**: 2026-03-06  
**Branch**: copilot/fix-ux-alert-issue  
**Issue**: Fix UX: alert fires on AI parsing failure in CriteriaUpload.tsx  
**Triggering Incident**: INC-POST-FCWT-EDGE-FN-001 (UX advisory observation from PR #955)  
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE. Verdicts are blocking.

---

## Step 0.2 — Wave Tasks Extracted from wave-current-tasks.md

Source: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (branch 2bc4713)

| Task ID | Builder | File(s) | Description |
|---------|---------|---------|-------------|
| TASK-UX-001 | qa-builder | `modules/mat/tests/postfcwt/ai-parsing-graceful.test.ts` | Add T-PFCWT-006 — RED gate test asserting alert conditionality |
| TASK-UX-002 | ui-builder | `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` | Fix `handleUpload` so alert fires ONLY when parsing succeeded |

---

## Step 0.3 — Task Classification (IAA Trigger Table v2.1.0)

| Task ID | Category | IAA Qualifying? | Classification Basis |
|---------|----------|-----------------|---------------------|
| TASK-UX-001 | AAWP_MAT | **YES — MANDATORY** | MAT module test deliverable. Files match `modules/mat/` path pattern. Executable behaviour gate. |
| TASK-UX-002 | AAWP_MAT | **YES — MANDATORY** | Production frontend component change in `modules/mat/`. Directly affects user-facing behaviour in MAT app. |

**Total qualifying tasks**: 2  
**Exempt tasks**: 0  
**Ambiguity check**: CLEAR — both tasks unambiguously match AAWP_MAT trigger. No AMBIGUITY RULE invocation needed.

---

## Step 0.4 — Per-Task IAA Pre-Brief Declarations

---

### TASK-UX-001 — Write Red QA Test (T-PFCWT-006)

**task_id**: TASK-UX-001  
**task_summary**: qa-builder adds test T-PFCWT-006 to `ai-parsing-graceful.test.ts` asserting that the `alert()` call in CriteriaUpload.tsx is conditionally guarded. Test must be RED before TASK-UX-002 begins.

**iaa_trigger_category**: AAWP_MAT

**required_phases**:

| Phase | Required? | Notes |
|-------|-----------|-------|
| Phase 1 — IAA Identity & Preflight | YES | Always required |
| Phase 2 — Alignment & Classification | YES | PR category confirmed as AAWP_MAT |
| Phase 3 — Assurance Work (core + overlay) | YES | Full AAWP_MAT overlay applied |
| Phase 4 — Merge Gate Parity, Verdict & Handover | YES | PHASE_B_BLOCKING — hard gate active |

**required_evidence_artifacts** (must be present at IAA handover):

| # | Artifact | Required State | Hard-Block if Absent? |
|---|---------|---------------|----------------------|
| 1 | `modules/mat/tests/postfcwt/ai-parsing-graceful.test.ts` (containing T-PFCWT-006) | Present, non-stub, complete test body | YES — BD-002, BD-012 |
| 2 | T-PFCWT-006 test run output showing **RED** (FAIL) | Test log demonstrating failure before fix | YES — RED gate is the entire purpose of this task; pass without RED evidence = test dodging (BD-013) |
| 3 | Confirmation that CriteriaUpload.tsx was **NOT** modified in TASK-UX-001 | Diff or explicit declaration | YES — task scope boundary |
| 4 | PREHANDOVER proof | Present on branch with `iaa_audit_token` field pre-populated (non-blank, non-TBD) | YES — CORE-018 |
| 5 | Session memory artifact | Present on branch (builder's own session memory) | YES — CORE-015 |
| 6 | No `.skip()`, `.only()`, `test.todo()`, or commented-out tests | Inspection of test file | YES — BD-012 |

**applicable_overlays**:
- **Core Invariants** (CORE-005, CORE-006, CORE-007, CORE-013, CORE-014, CORE-015, CORE-016, CORE-017, CORE-018, CORE-019, CORE-020, CORE-021)
  - Note: CORE-001 through CORE-004, CORE-008 through CORE-012, CORE-022 are AGENT_CONTRACT-specific and do NOT apply to this AAWP_MAT task.
- **AAWP_MAT Overlay** (BD-001 through BD-024 + FFA-01 through FFA-06)

**specific_rules**:

1. **RED Gate is Non-Negotiable (BD-013 — No Test Dodging)**  
   T-PFCWT-006 must demonstrably FAIL when run against the unfixed CriteriaUpload.tsx. A test that passes before the fix is structurally vacuous — it does not assert the intended behaviour. IAA will inspect the test body to confirm it genuinely asserts alert conditionality, not merely that the file exists. Evidence required: test run output log showing `FAIL` for T-PFCWT-006.

2. **Test Must Read Source and Assert Pattern (BD-001)**  
   Per acceptance criteria: test file-reads CriteriaUpload.tsx source and asserts the alert call is inside a conditional guard. IAA will verify the test body contains this structural assertion.

3. **Scope Isolation (BD-001)**  
   CriteriaUpload.tsx must appear in zero hunks of TASK-UX-001's diff. Any modification to that file in this task = immediate REJECTION-PACKAGE.

4. **No test debt (BD-012)**  
   Test file must have no `.skip()`, `.only()`, `test.todo()`, or incomplete assertion blocks.

5. **Zero-Severity-Tolerance (CORE-021)**  
   Any finding in T-PFCWT-006 — regardless of size — triggers REJECTION-PACKAGE. No soft passes.

---

### TASK-UX-002 — Fix CriteriaUpload.tsx Alert Pattern

**task_id**: TASK-UX-002  
**task_summary**: ui-builder modifies `handleUpload` in CriteriaUpload.tsx to guard the `alert()` call behind a `parsingSucceeded` boolean. Alert fires only when AI parsing succeeded; warning element remains the sole user feedback when parsing fails.

**iaa_trigger_category**: AAWP_MAT

**required_phases**:

| Phase | Required? | Notes |
|-------|-----------|-------|
| Phase 1 — IAA Identity & Preflight | YES | Always required |
| Phase 2 — Alignment & Classification | YES | PR category confirmed as AAWP_MAT |
| Phase 3 — Assurance Work (core + overlay) | YES | Full AAWP_MAT overlay applied |
| Phase 4 — Merge Gate Parity, Verdict & Handover | YES | PHASE_B_BLOCKING — hard gate active |

**required_evidence_artifacts** (must be present at IAA handover):

| # | Artifact | Required State | Hard-Block if Absent? |
|---|---------|---------------|----------------------|
| 1 | `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` | Diff present; `alert()` call wrapped in `if (parsingSucceeded)` or equivalent conditional guard | YES — BD-001, BD-003 |
| 2 | T-PFCWT-006 test run output showing **GREEN** (PASS) | Test log confirming fix works | YES — BD-011 |
| 3 | T-PFCWT-004 and T-PFCWT-005 test run output showing **GREEN** (no regression) | Test log confirming no regression | YES — BD-011, BD-009 |
| 4 | Full test suite run output (all post-FCWT tests pass) | Zero failures across all related tests | YES — BD-011 |
| 5 | `data-testid="criteria-upload-ai-parsing-warning"` still present and visible in failure path | Code inspection or test assertion | YES — BD-001 scope completeness |
| 6 | PREHANDOVER proof | Present on branch with `iaa_audit_token` field pre-populated (non-blank, non-TBD) | YES — CORE-018 |
| 7 | Session memory artifact | Present on branch (builder's own session memory) | YES — CORE-015 |
| 8 | IAA token file from TASK-UX-001 assurance (if tasks share a single PR) OR separate evidence declaration | Confirmation TASK-UX-001 was RED-confirmed before this task began | YES — dependency gate |

**applicable_overlays**:
- **Core Invariants** (CORE-005, CORE-006, CORE-007, CORE-013, CORE-014, CORE-015, CORE-016, CORE-017, CORE-018, CORE-019, CORE-020, CORE-021)
- **AAWP_MAT Overlay** (BD-001 through BD-024 + FFA-01 through FFA-06)

**specific_rules**:

1. **Conditionality of the Fix (BD-001 — Full Scope Delivered)**  
   The fix must introduce an explicit boolean (`parsingSucceeded` or semantically equivalent) set to `true` inside the inner `try` block and defaulted to `false` before the try. The `alert()` call must be wrapped in `if (parsingSucceeded)`. IAA will read the diff and verify the guard pattern is structurally correct — not merely that the alert moved.

2. **Warning Element Preserved (BD-001 — Scope Completeness)**  
   `data-testid="criteria-upload-ai-parsing-warning"` must remain visible when parsing fails. IAA will verify the warning element rendering path is unchanged.

3. **No New Side Effects (BD-009 — Cross-Component Integration Fit)**  
   The fix must not alter the function signature, return type, or any other behaviour of `handleUpload`. No side-effects introduced. IAA will confirm diff is minimal and surgical.

4. **Dependency Gate: TASK-UX-001 must be RED-confirmed first**  
   IAA will verify that T-PFCWT-006 was confirmed RED before ui-builder began. Evidence: RED run log from TASK-UX-001. If absent, REJECTION-PACKAGE citing premature execution.

5. **T-PFCWT-004 and T-PFCWT-005 must remain GREEN (BD-009 — No Regression)**  
   Existing post-FCWT tests must not be broken. Green evidence required.

6. **One-Time Build Standard (BD-003)**  
   After merge, the UX fix must work end-to-end without requiring further follow-up. IAA will assess whether the fix is complete and deployable as-is.

7. **No stub, TODO, or placeholder in the fix (BD-002 / CORE-007)**  
   No `// TODO: add guard later` or partial implementation in the production path.

8. **Zero-Severity-Tolerance (CORE-021)**  
   Any finding — regardless of perceived triviality — triggers REJECTION-PACKAGE.

---

## Step 0.4 — Wave-Level IAA Requirements

### Single PR vs Dual PR Strategy

This wave touches two files by two different builders. IAA confirms:
- If Foreman submits a **single combined PR**: IAA assures the combined PR once, after both tasks complete. Evidence for both tasks must be present.
- If Foreman submits **two separate PRs**: IAA assures each PR independently. TASK-UX-001's RED evidence must be included in TASK-UX-002's PR bundle to prove the dependency gate was honoured.

Foreman must declare the PR strategy in the PREHANDOVER proof.

### PREHANDOVER Proof Requirements (All Tasks)

Per `AGENT_HANDOVER_AUTOMATION.md` v1.1.3 §4.3b, the PREHANDOVER proof submitted for IAA assurance must:
- Be a **new file** (not edited post-commit — immutable per A-029)
- Contain `iaa_audit_token` field pre-populated with `IAA-session-156-wave-ux-alert-fix-YYYYMMDD-PASS` reference format (not blank, not TBD)
- List all evidence artifacts with file paths
- Declare dependency gate honoured (T-PFCWT-006 RED before TASK-UX-002 began)
- Reference this Pre-Brief at `.agent-admin/assurance/iaa-prebrief-wave-ux-alert-fix.md`

### Canon Overlays Applicable to this Wave

| Canon | Relevance |
|-------|-----------|
| `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` | Primary IAA governance — all checks derive authority from this |
| `governance/canon/COMBINED_TESTING_PATTERN.md` | Authority for PFCWT test pattern; T-PFCWT-006 must conform |
| `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` | Evidence bundle completeness standard |
| `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.1.3 | PREHANDOVER proof format and §4.3b token file architecture |
| `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 | System-level agent authority and class definitions |

### IAA-Specific Wave Notes

1. **PHASE_B_BLOCKING is ACTIVE**: All IAA verdicts for this wave are hard-blocking. There is no advisory mode. A REJECTION-PACKAGE prevents the PR from being opened.

2. **90/10 Orientation Mandate applies**: IAA will spend 90% of review effort on whether the fix is functionally correct, safe, and complete (BD-001 through BD-024). IAA will spend 10% on ceremony existence checks (CORE-013, CORE-015, CORE-016, CORE-018). IAA will NOT audit session numbering, version history, or cross-reference consistency.

3. **RED gate evidence is treated as functional evidence, not ceremony**: The RED run log for T-PFCWT-006 is a primary engineering deliverable. Its absence blocks TASK-UX-002, not as an administrative ceremony failure, but as a functional gate failure — the entire purpose of TASK-UX-001 is to prove the fix is needed and measurable.

4. **Scope isolation is a hard check**: CriteriaUpload.tsx must not appear in TASK-UX-001's diff. This is a zero-tolerance check (BD-001 scope violation).

5. **No carry-forward mandates expected**: This is a targeted, self-contained fix. IAA does not anticipate carry-forward mandates. If any broader issues are discovered during assurance (e.g., other unconditional alerts in the same component), IAA will issue specific findings.

---

## Summary

| # | Task | Category | IAA Required? | Red Evidence Required? | PREHANDOVER Required? | Session Memory Required? |
|---|------|----------|--------------|----------------------|----------------------|------------------------|
| 1 | TASK-UX-001 | AAWP_MAT | YES — BLOCKING | YES — T-PFCWT-006 RED log | YES | YES |
| 2 | TASK-UX-002 | AAWP_MAT | YES — BLOCKING | NO (GREEN required) | YES | YES |

**IAA Pre-Brief status**: COMPLETE  
**Wave may proceed to builder execution**: YES — after this artifact is read and acknowledged by Foreman.  
**IAA re-invocation trigger**: Upon Foreman PREHANDOVER proof submission.  
**Token file will be created at**: `.agent-admin/assurance/iaa-token-session-156-wave-ux-alert-fix-YYYYMMDD.md`

---

*Generated by independent-assurance-agent | session-156 | 2026-03-06 | PHASE_B_BLOCKING*  
*Source: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (commit 2bc4713)*  
*Pre-Brief Mode — Phase 2–4 assurance NOT executed. Phases 2–4 execute upon PREHANDOVER handover.*
