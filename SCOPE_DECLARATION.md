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

- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` - Session-142 suggestion appended
- `.gitignore` - Added liveness-evidence/ and reports/ exclusions
- `modules/mat/package.json` - Added npm scripts: liveness and liveness:report
