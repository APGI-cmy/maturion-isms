# Scope Declaration — foreman-v2-agent Session 142 — Wave LV (MAT Liveness Test Suite)

**PR**: `copilot/implement-mat-liveness-test-suite`
**Sessions**: session-142 (foreman)
**Wave**: Wave LV — MAT Liveness Test Suite
**Issue**: #932
**Date**: 2026-03-05
**Authority**: BL-027 (MERGE_GATE_PHILOSOPHY.md)

## Files Declared

### Added

- `.agent-admin/assurance/iaa-prebrief-waveLV-20260305.md` - IAA Pre-Brief artifact for Wave LV (PHASE_B_BLOCKING)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-142-waveLV-20260305.md` - PREHANDOVER proof session-142
- `.agent-workspace/foreman-v2/memory/session-142-waveLV-20260305.md` - Foreman session-142 memory
- `.env.example` - All 8 liveness env vars documented (LIVENESS_TEST_EMAIL, LIVENESS_TEST_PASSWORD, BASE_URL, AI_*_URL, AI_*_MS)
- `.github/workflows/liveness.yml` - CI post-deploy trigger (workflow_run + workflow_dispatch; WARN=exit0; secrets via GitHub secrets)
- `modules/mat/tests/liveness/.gitignore` - Excludes liveness-evidence/ and reports/
- `modules/mat/tests/liveness/README-LIVENESS.md` - Usage docs with env vars and run instructions
- `modules/mat/tests/liveness/fixtures/test-criteria-document.pdf` - Minimal valid PDF fixture for criteria upload tests
- `modules/mat/tests/liveness/fixtures/test-evidence.pdf` - Minimal valid PDF fixture for evidence upload tests
- `modules/mat/tests/liveness/mat-ai-health.spec.ts` - AI health probes LV-AI-01..06 + AI-layer checks (15 checks)
- `modules/mat/tests/liveness/mat-liveness.spec.ts` - ALL AUTO/AUTO+MANUAL Playwright liveness checks (LV-00 to LV-10, 41 checks)
- `modules/mat/tests/liveness/mat-visual.spec.ts` - 5 VISUAL screenshot checks
- `modules/mat/tests/liveness/report-assembler.ts` - Report assembler (machine JSON + human Markdown + manual checklist per spec §3/§5)
- `modules/mat/tests/liveness/runner.ts` - Liveness runner (orchestrates 3 spec files, exit 0 on WARN, exit 1 on blocking FAIL)
- `modules/mat/tests/wave-lv/liveness-gate.test.ts` - Wave LV Red QA gate (T-LV-GATE-001..009): 9 file-existence meta-tests

### Modified

- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated with Wave 14 Batch C tasks
- `SCOPE_DECLARATION.md` - This file — scope declaration for session-142 Wave 14 Batch C

### STOP-AND-FIX Additions (IAA REJECTION-PACKAGE remediation)

- `modules/mat/05-build-evidence/wave14-cwt-evidence-20260305.md` - FINDING-BC-002 fix: Wave 14 Combined Wave Test evidence — formal CWT PASS verdict, 104/104 Wave 14 tests GREEN, 15/15 GAPs closed (OVL-AM-CWT-01)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-142-v2-wave14-batchC-20260305.md` - PREHANDOVER proof v2 (STOP-AND-FIX resolutions: FINDING-BC-001 partial index + FINDING-BC-002 CWT evidence)

### IAA Session-147 Governance Artifacts (REJECTION-PACKAGE ceremony record)

- `.agent-admin/assurance/iaa-token-session-142-wave14-batchC-20260305.md` - IAA session-147 REJECTION-PACKAGE token (FINDING-BC-001: aggregate_scores partial index; FINDING-BC-002: CWT evidence missing)
- `.agent-workspace/independent-assurance-agent/memory/session-147-wave14-batchC-20260305.md` - IAA session-147 session memory (first rejection invocation for Wave 14 Batch C)

### PREHANDOVER v3 Correction Addendum (A-030 pattern)

- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-142-v3-wave14-batchC-20260305.md` - PREHANDOVER proof v3: correction addendum acknowledging all prior IAA findings resolved; complete bundle with IAA ceremony artifacts

### IAA Session-149 Governance Artifacts (ASSURANCE-TOKEN ceremony record)

- `.agent-admin/assurance/iaa-token-session-142-v3-wave14-batchC-20260305.md` - IAA ASSURANCE-TOKEN (session-149) — Wave 14 Batch C v3 PASS — all 35+ checks PASS — merge gate released
- `.agent-workspace/independent-assurance-agent/memory/session-149-wave14-batchC-v3-20260305.md` - IAA session-149 session memory (ASSURANCE-TOKEN invocation)

---

# Scope Declaration — foreman-v2-agent Session 143 — Wave 14 IBWR

**PR**: `copilot/update-wave-14-ibwr-tracker`
**Session**: session-143
**Wave**: Wave 14 IBWR — In-Between Wave Reconciliation (Final)
**Issue**: Wave 14 IBWR: Formal In-Between Wave Reconciliation & Progress Tracker Update
**Date**: 2026-03-05
**Authority**: A-026, A-028 (FAIL-ONLY-ONCE v2.6.0)

## Files Declared

### Added

- `.agent-admin/assurance/ibwr-wave14-session-143-20260305.md` - Formal Wave 14 IBWR artifact: 15/15 GAPs closed, 104/104 tests GREEN, 4 IAA tokens referenced, CWT PASS, FCWT readiness declared
- `.agent-workspace/foreman-v2/memory/session-143-wave14-ibwr-20260305.md` - Foreman session memory for IBWR session-143
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-143-wave14-ibwr-20260305.md` - PREHANDOVER proof for session-143 IBWR

### Modified

- `modules/mat/BUILD_PROGRESS_TRACKER.md` - Wave 14 Batch A/B/C sections added; IBWR section added; postbuild-fails-02 closed; Current Stage updated to FCWT READY
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated for IBWR session-143 task list
- `SCOPE_DECLARATION.md` - This file — scope declaration for session-143 IBWR (A-026 compliance)

---

# Scope Declaration — foreman-v2-agent Session 143 v2 — Wave 14 IBWR Correction (A-030)

**PR**: `copilot/update-wave-14-ibwr-tracker`
**Session**: session-143 v2 (correction addendum — A-030 pattern)
**Correction Type**: A-030 — CWT Batch C test count corrected (20→27) per IAA REJECTION-PACKAGE (session-150)
**Date**: 2026-03-05

## Correction Summary

IAA session-150 issued REJECTION-PACKAGE FINDING-IBWR-001: CWT tally arithmetic inconsistency.
IBWR §3 and BUILD_PROGRESS_TRACKER CWT tally both stated Batch C = 20 tests.
Correct count = 27 (37+40+27=104 ✓ per CWT runner output and state machine entry).
Fix: "20" → "27" in both documents.

## Files Corrected

- `.agent-admin/assurance/ibwr-wave14-session-143-20260305.md` - §3 CWT Tally: Batch C 20→27; 20/20→27/27
- `modules/mat/BUILD_PROGRESS_TRACKER.md` - IBWR CWT tally: Batch C 20→27; Batch C section test results 20→27
- `SCOPE_DECLARATION.md` - This correction addendum
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Session-142 suggestion appended
- `.gitignore` - Added liveness-evidence/ and reports/ exclusions
- `modules/mat/package.json` - Added npm scripts: liveness and liveness:report
