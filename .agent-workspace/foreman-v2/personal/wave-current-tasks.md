# Wave Current Tasks — Wave UX-Alert-Fix
# Session: session-156
# Date: 2026-03-06
# Branch: copilot/fix-ux-alert-issue
# Issue: Fix UX: alert fires on AI parsing failure in CriteriaUpload.tsx
# Authority: CS2 (@APGI-cmy) — Foreman re-alignment directive (new_requirement comment)
# Protocol Reference: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger

---

## Wave Identity

| Field | Value |
|---|---|
| Wave ID | wave-ux-alert-fix |
| Session | session-156 |
| Date | 2026-03-06 |
| Branch | copilot/fix-ux-alert-issue |
| Issue | Fix UX: alert fires on AI parsing failure in CriteriaUpload.tsx |
| Triggering Incident | INC-POST-FCWT-EDGE-FN-001 (UX advisory observation from PR #955) |
| IAA Pre-Brief | PENDING — awaiting IAA Pre-Brief artifact |

---

## Wave Tasks

### TASK-UX-001 — Write Red QA Test (T-PFCWT-006)
**Builder**: qa-builder
**File**: `modules/mat/tests/postfcwt/ai-parsing-graceful.test.ts`
**Description**: Add test T-PFCWT-006 that asserts the alert in CriteriaUpload.tsx is conditional — it must only fire when parsing succeeded (no aiParsingWarning set). The test must read CriteriaUpload.tsx source and assert the pattern. Must be RED before ui-builder begins.
**Acceptance criteria**:
- Test file-reads CriteriaUpload.tsx source
- Asserts alert call is inside a conditional guard checking parsing success
- Test FAILS before the fix is applied (RED gate confirmed)
- No modifications to CriteriaUpload.tsx in this task

**Qualifying for IAA**: YES
**Evidence required**: test file diff, RED run result

---

### TASK-UX-002 — Fix CriteriaUpload.tsx alert pattern
**Builder**: ui-builder
**File**: `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx`
**Description**: Fix handleUpload so alert only fires when AI parsing succeeded. If inner catch is taken (aiParsingWarning set), skip the alert — warning element is the only user feedback.
**Acceptance criteria**:
- Alert fires ONLY when parsing succeeded (parsingSucceeded === true after inner try/catch)
- If AI parsing fails (inner catch taken), alert is NOT called
- data-testid="criteria-upload-ai-parsing-warning" remains visible when parsing fails
- T-PFCWT-006 turns GREEN
- T-PFCWT-004 and T-PFCWT-005 remain GREEN (no regression)
- No other tests broken

**Qualifying for IAA**: YES
**Evidence required**: component diff, test run (all GREEN including T-PFCWT-006)
**DEPENDENCY**: TASK-UX-001 must be complete and RED-confirmed before this task begins.

---

## Qualifying Tasks (IAA Gate Required)

| Task | Category | Qualifying? | Reason |
|------|----------|-------------|--------|
| TASK-UX-001 | AAWP_MAT | YES | RED gate test for MAT module |
| TASK-UX-002 | AAWP_MAT | YES | Production frontend component change |

---

## Expected Artifacts for IAA Handover

| # | Artifact | Builder | Status |
|---|---------|---------|--------|
| 1 | `modules/mat/tests/postfcwt/ai-parsing-graceful.test.ts` (T-PFCWT-006 GREEN) | qa-builder | PENDING |
| 2 | `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` (conditional alert) | ui-builder | PENDING |
| 3 | PREHANDOVER proof | foreman | PENDING |
| 4 | IAA ASSURANCE-TOKEN | IAA | PENDING |

---

## Re-Anchor Pulse Data

| Field | Value |
|---|---|
| wave_id | wave-ux-alert-fix |
| session_id | session-156 |
| total_tasks | 2 |
| qualifying_tasks | 2 |
| exempt_tasks | 0 |
| builders_required | qa-builder, ui-builder |
| iaa_prebrief_required | YES |
| estimated_test_delta | +1 (T-PFCWT-006) |
| files_modified | modules/mat/tests/postfcwt/ai-parsing-graceful.test.ts, modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx |

---

## Wave Completion Gate

- [ ] IAA Pre-Brief invoked
- [ ] IAA Pre-Brief artifact received at `.agent-admin/assurance/iaa-prebrief-wave-ux-alert-fix.md`
- [ ] TASK-UX-001 complete: T-PFCWT-006 written and RED-confirmed
- [ ] TASK-UX-002 complete: CriteriaUpload.tsx conditional alert fix
- [ ] QP Evaluation: PASS
- [ ] §4.3 Merge gate parity check: executed
- [ ] IAA ASSURANCE-TOKEN received
- [ ] PREHANDOVER proof committed
- [ ] Session memory written
- [ ] CS2 notified for merge approval
