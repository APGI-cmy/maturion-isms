# Wave Current Tasks — foreman-v2-agent

**Wave**: Wave LV (MAT Liveness Test Suite) — 6 sub-waves (LV-1 through LV-6)
**Session**: session-142
**Date**: 2026-03-05
**Issue**: #932 (MAT Liveness Test Suite — Foreman Orchestration)
**Branch**: copilot/implement-mat-liveness-test-suite
**CS2 Authorization**: Issue #932 opened by @APGI-cmy (CS2 direct); assigns Copilot/foreman-v2-agent
**Source authority**: modules/mat/00-app-description/MAT_LIVENESS_TEST_SPEC.md v1.0
**Derived from**: MAT_UX_WORKFLOW_AND_WIRING.md v1.0
**Depends on**: Wave 14 (all batches complete)

---

## Wave LV — Task List

### Wave LV-RED — Red QA Gate (MANDATORY FIRST — qa-builder)
**Purpose**: File-based meta-tests asserting liveness test files exist with correct structure. MUST be RED at delivery.

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-RED-001 | Create `modules/mat/tests/wave-lv/liveness-gate.test.ts` — file-existence + structure tests for all 11 liveness step files + runner + assembler. Tests must assert: file exists, exports livenessCheckId, result shape. All tests MUST FAIL at delivery (files don't exist yet). | qa-builder | 🔴 PENDING |

---

### Wave LV-1 — AUTO Playwright Liveness Tests (qa-builder)
**Scope**: All AUTO and AUTO+MANUAL checks (LV-00 to LV-10)
**Checks**: LV-00-01–05, LV-01-01–04, LV-02-01/02/04, LV-03-01–05, LV-04-01–04/06, LV-05-01–07, LV-06-01/03/08/09, LV-07-01–03, LV-08-01–05, LV-09-01–03, LV-10-03/04

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-1-001 | Create `src/liveness/types.ts` — LivenessCheckResult, LivenessCheckType, LivenessResultRecord interfaces + VISUAL_CHECKS_REQUIRE_HUMAN_REVIEW constant | qa-builder | 🔴 PENDING |
| TASK-LV-1-002 | Create `src/liveness/step-00-signup.liveness.ts` — LV-00-01 to LV-00-05 (sign-up & onboarding AUTO checks) | qa-builder | 🔴 PENDING |
| TASK-LV-1-003 | Create `src/liveness/step-01-create-audit.liveness.ts` — LV-01-01 to LV-01-04 | qa-builder | 🔴 PENDING |
| TASK-LV-1-004 | Create `src/liveness/step-02-upload-criteria.liveness.ts` — LV-02-01, LV-02-02, LV-02-04 (non-AI AUTO checks) | qa-builder | 🔴 PENDING |
| TASK-LV-1-005 | Create `src/liveness/step-03-domain-cards.liveness.ts` — LV-03-01 to LV-03-05 | qa-builder | 🔴 PENDING |
| TASK-LV-1-006 | Create `src/liveness/step-04-invitations.liveness.ts` — LV-04-01 to LV-04-04, LV-04-06 | qa-builder | 🔴 PENDING |
| TASK-LV-1-007 | Create `src/liveness/step-05-evidence-upload.liveness.ts` — LV-05-01 to LV-05-07 | qa-builder | 🔴 PENDING |
| TASK-LV-1-008 | Create `src/liveness/step-06-submit-ai.liveness.ts` — LV-06-01, LV-06-03, LV-06-08, LV-06-09 (UI-layer AUTO only) | qa-builder | 🔴 PENDING |
| TASK-LV-1-009 | Create `src/liveness/step-07-results-table.liveness.ts` — LV-07-01 to LV-07-03 | qa-builder | 🔴 PENDING |
| TASK-LV-1-010 | Create `src/liveness/step-08-dashboard.liveness.ts` — LV-08-01 to LV-08-05 | qa-builder | 🔴 PENDING |
| TASK-LV-1-011 | Create `src/liveness/step-09-descriptors.liveness.ts` — LV-09-01 to LV-09-03 | qa-builder | 🔴 PENDING |
| TASK-LV-1-012 | Create `src/liveness/step-10-report.liveness.ts` — LV-10-03, LV-10-04 | qa-builder | 🔴 PENDING |
| TASK-LV-1-013 | Add `liveness-evidence/` to `.gitignore` root; add all new liveness env vars to `.env.example`; add `README-LIVENESS.md` to `src/liveness/` | qa-builder | 🔴 PENDING |

---

### Wave LV-2 — VISUAL Screenshot Liveness Checks (qa-builder, parallel with LV-1)
**Checks**: LV-02-05, LV-03-06, LV-05-08, LV-07-04, LV-08-06

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-2-001 | Create `src/liveness/step-visual.liveness.ts` — LV-02-05, LV-03-06, LV-05-08, LV-07-04, LV-08-06 VISUAL screenshot captures; named screenshots `liveness-{ID}-{timestamp}.png` to `liveness-evidence/screenshots/`; JSON result with VISUAL_CHECKS_REQUIRE_HUMAN_REVIEW flag | qa-builder | 🔴 PENDING |

---

### Wave LV-3 — AI Health Probe Tests (qa-builder, parallel with LV-1)
**Checks**: LV-AI-01–06, LV-02-03, LV-06-02/04/05/06/07/10, LV-10-01/02

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-3-001 | Create `src/liveness/ai-health.liveness.ts` — LV-AI-01 to LV-AI-06 direct AI endpoint probes; confirm HTTP 200, non-empty response, no error field; record endpoint, statusCode, responseEmpty | qa-builder | 🔴 PENDING |
| TASK-LV-3-002 | Create `src/liveness/step-06-ai-probes.liveness.ts` — LV-06-02/04/05/06/07/10 AI scoring + chat checks (part of LV-3 not LV-1) | qa-builder | 🔴 PENDING |
| TASK-LV-3-003 | Add AI checks to step-02 file (LV-02-03 AI doc parser) and step-10 file (LV-10-01/02 AI report gen) | qa-builder | 🔴 PENDING |

---

### Wave LV-4 — Manual Checklist Generator (qa-builder, parallel with LV-1)
**Manual checks**: LV-00-05, LV-04-05, LV-06-11, LV-10-05, LV-10-06

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-4-001 | Create `src/liveness/manual-checklist-generator.ts` — generates `liveness-evidence/manual-checklist-{timestamp}.md` with all 5 MANUAL check IDs and descriptions pre-populated; human fills ✅/❌ | qa-builder | 🔴 PENDING |

---

### Wave LV-5 — Liveness Runner + Report Assembler (integration-builder, after LV-1–4)
**Depends on**: All of LV-1, LV-2, LV-3, LV-4 complete

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-5-001 | Create `src/liveness/runner.ts` — top-level runner: runs all step modules in sequence, collects JSON results, calls assembler | integration-builder | 🔴 PENDING |
| TASK-LV-5-002 | Create `src/liveness/report-assembler.ts` — assembles Machine Report (JSON: runId, baseUrl, timestamp, summary{total/pass/fail/warn/manual}, checks[]) and Human Summary (Markdown with grouped PASS/FAIL/WARN/MANUAL per step); writes to `liveness-evidence/run-{timestamp}/` | integration-builder | 🔴 PENDING |
| TASK-LV-5-003 | Add npm scripts: `"liveness": "ts-node src/liveness/runner.ts"` and `"liveness:report": "ts-node src/liveness/report-assembler.ts --last-run"` | integration-builder | 🔴 PENDING |

---

### Wave LV-6 — CI Post-Deploy Trigger (integration-builder, after LV-5)
**Depends on**: Wave LV-5 complete

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-6-001 | Create `.github/workflows/liveness.yml` — workflow_run trigger on Vercel deploy completion + workflow_dispatch with base_url input; runs npm run liveness against deployed URL; uploads liveness-evidence/ as artifact; posts summary; does NOT fail deploy on WARN; only explicit FAIL on blocking checks triggers CI failure | integration-builder | 🔴 PENDING |

---

## Sequencing

```
Wave LV-RED (qa-builder) → RED GATE VERIFIED
  ↓
Wave LV-1 (qa-builder)   ←─── parallel ──→ Wave LV-2 (qa-builder)
                          ←─── parallel ──→ Wave LV-3 (qa-builder)
                          ←─── parallel ──→ Wave LV-4 (qa-builder)
  ↓ (all LV-1 to LV-4 complete)
Wave LV-5 (integration-builder)
  ↓
Wave LV-6 (integration-builder)
```

## IAA Category: AAWP_MAT
## Total tasks: 23 (1 RED gate + 22 implementation tasks)
