# Wave Current Tasks — foreman-v2-agent

**Wave**: Wave LV (MAT Liveness Test Suite) — 6 sub-waves (LV-RED, LV-1 through LV-5)
**Session**: session-142
**Date**: 2026-03-05
**Issue**: #932 (MAT Liveness Test Suite — Foreman Orchestration)
**Branch**: copilot/implement-mat-liveness-test-suite
**CS2 Authorization**: Issue #932 opened by @APGI-cmy (CS2 direct); assigns Copilot/foreman-v2-agent
**Source authority**: modules/mat/00-app-description/MAT_LIVENESS_TEST_SPEC.md v1.0
**Derived from**: MAT_UX_WORKFLOW_AND_WIRING.md v1.0
**Depends on**: Wave 14 (all batches complete)
**IAA Pre-Brief**: .agent-admin/assurance/iaa-prebrief-waveLV-20260305.md (PHASE_B_BLOCKING)

---

## BLOCKER RESOLUTIONS (IAA Pre-Brief PC-LV-001 through PC-LV-003)

**PC-LV-001 RESOLVED**: Correct path is `modules/mat/tests/liveness/` per spec §7. NOT `src/liveness/`.
**PC-LV-002 RESOLVED**: Explicit fixture PDF task added (TASK-LV-1-FIXTURES below).
**PC-LV-003 RESOLVED**: File structure follows spec §7 exactly — 3 main spec files only:
  - `mat-liveness.spec.ts` — ALL AUTO + AUTO+MANUAL checks (LV-00 to LV-10)
  - `mat-ai-health.spec.ts` — ALL AI health probes (LV-AI-01 to LV-AI-06)
  - `mat-visual.spec.ts` — ALL VISUAL screenshot checks (LV-02-05, LV-03-06, LV-05-08, LV-07-04, LV-08-06)

---

## Wave LV — Task List

### Wave LV-RED — Red QA Gate (MANDATORY FIRST — qa-builder)
**Purpose**: File-based meta-tests asserting liveness test files exist with correct structure.
**MUST be RED at delivery** (liveness spec files do not exist yet).
**Location**: `modules/mat/tests/wave-lv/liveness-gate.test.ts`

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-RED-001 | Create `modules/mat/tests/wave-lv/liveness-gate.test.ts` — file-existence + structure tests asserting: (1) `modules/mat/tests/liveness/mat-liveness.spec.ts` exists; (2) `modules/mat/tests/liveness/mat-ai-health.spec.ts` exists; (3) `modules/mat/tests/liveness/mat-visual.spec.ts` exists; (4) fixture PDFs exist; (5) README-LIVENESS.md exists. All tests MUST FAIL at delivery time (files don't exist yet). Use fs.existsSync pattern consistent with prior wave gate tests. | qa-builder | 🔴 PENDING |

---

### Wave LV-1 — AUTO Playwright Liveness Tests (qa-builder)
**Spec file**: `modules/mat/tests/liveness/mat-liveness.spec.ts`
**Covers**: ALL AUTO and AUTO+MANUAL checks — LV-00-01 to LV-10-04 (excluding AI and VISUAL checks)
**Check count**: 37 AUTO checks + 2 AUTO+MANUAL checks = 39 checks total

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-1-FIXTURES | Create `modules/mat/tests/liveness/fixtures/test-criteria-document.pdf` and `modules/mat/tests/liveness/fixtures/test-evidence.pdf` — minimal valid PDFs (not zero-byte). Use a minimal binary PDF structure. | qa-builder | 🔴 PENDING |
| TASK-LV-1-001 | Create `modules/mat/tests/liveness/mat-liveness.spec.ts` — implements all 39 AUTO/AUTO+MANUAL checks (LV-00-01 through LV-10-04, excluding AI and VISUAL). Each check: exports livenessCheckId, produces { id, description, type, result: PASS/FAIL/WARN, error?, screenshotPath? }. Uses LIVENESS_TEST_EMAIL, LIVENESS_TEST_PASSWORD, BASE_URL env vars. Cleans up created resources (delete audit, evidence) in afterAll. Takes screenshots per §4 manifest (liveness-evidence/). Manual runner note for LV-00-05 and LV-08-05 (SKIP conditions). | qa-builder | 🔴 PENDING |
| TASK-LV-1-CONFIG | Create `modules/mat/tests/liveness/README-LIVENESS.md` — documents how to run liveness tests locally and in CI, all required env vars (LIVENESS_TEST_EMAIL, LIVENESS_TEST_PASSWORD, BASE_URL, AI_GATEWAY_URL, AI_DOC_PARSER_URL, AI_SCORING_URL, AI_CHAT_URL, AI_REPORT_URL). Add liveness-evidence/ and reports/ to `.gitignore`. Add all 8 new env vars to `.env.example`. | qa-builder | 🔴 PENDING |

---

### Wave LV-2 — VISUAL Screenshot Liveness Checks (qa-builder, parallel with LV-1)
**Spec file**: `modules/mat/tests/liveness/mat-visual.spec.ts`
**Covers**: LV-02-05, LV-03-06, LV-05-08, LV-07-04, LV-08-06 (5 VISUAL checks)

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-2-001 | Create `modules/mat/tests/liveness/mat-visual.spec.ts` — implements 5 VISUAL checks. Each check: navigates to correct state, takes named screenshot `liveness-evidence/LV-XX-YY-{desc}.png` per §4 manifest, produces { id, type: 'VISUAL', screenshotPath, capturedAt }. Includes VISUAL_CHECKS_REQUIRE_HUMAN_REVIEW: true flag in result. | qa-builder | 🔴 PENDING |

---

### Wave LV-3 — AI Health Probe Tests (qa-builder, parallel with LV-1)
**Spec file**: `modules/mat/tests/liveness/mat-ai-health.spec.ts`
**Covers**: LV-AI-01 to LV-AI-06 (direct probes) + LV-02-03, LV-06-02/04/05/06/07/10, LV-10-01/02 (AI-layer checks)

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-3-001 | Create `modules/mat/tests/liveness/mat-ai-health.spec.ts` — implements all 12 AI checks. LV-AI-01–06: direct endpoint probes (HTTP 200, non-empty, no error field). LV-02-03, LV-06-02/04/05/06/07/10, LV-10-01/02: API call confirmation checks. LV-AI-06 WARN threshold: >15s = WARN, >30s = FAIL (>120s for report gen). Uses AI_GATEWAY_URL, AI_DOC_PARSER_URL, AI_SCORING_URL, AI_CHAT_URL, AI_REPORT_URL env vars. If any LV-AI-xx fails → dependent AI checks = SKIP. Records { id, type: 'AI', endpoint, statusCode, responseEmpty: bool, error? }. | qa-builder | 🔴 PENDING |

---

### Wave LV-4 — Liveness Runner + Report Assembler (integration-builder, after LV-1–3)
**Depends on**: Waves LV-1, LV-2, LV-3 all COMPLETE and GREEN
**CST REQUIRED before this wave begins** per IAA Pre-Brief

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-4-001 | Create `modules/mat/tests/liveness/runner.ts` — orchestrates all 3 spec files in sequence, collects JSON results, triggers report assembler. Entry point for `npm run liveness`. | integration-builder | 🔴 PENDING |
| TASK-LV-4-002 | Create `modules/mat/tests/liveness/report-assembler.ts` — assembles Machine Report (JSON: runId, baseUrl, timestamp, summary{total/pass/fail/warn/manual}, checks[]) and Human Summary (Markdown per §5 format). Generates Manual Checklist (Markdown per §3 template) to `liveness-evidence/run-{timestamp}/manual-checklist.md`. Writes all output to `liveness-evidence/run-{timestamp}/`. | integration-builder | 🔴 PENDING |
| TASK-LV-4-003 | Add npm scripts to `modules/mat/package.json`: `"liveness": "ts-node tests/liveness/runner.ts"` and `"liveness:report": "ts-node tests/liveness/report-assembler.ts --last-run"`. | integration-builder | 🔴 PENDING |

---

### Wave LV-5 — CI Post-Deploy Trigger (integration-builder, after LV-4)
**Depends on**: Wave LV-4 COMPLETE and GREEN
**CWT REQUIRED before IBWR per IAA Pre-Brief**

| # | Task | Builder | Status |
|---|------|---------|--------|
| TASK-LV-5-001 | Create `.github/workflows/liveness.yml` — workflow_run trigger (Vercel deploy success completion) + workflow_dispatch (base_url input). Installs deps, runs `npm run liveness` in `modules/mat/` against deployed URL, uploads `liveness-evidence/run-*/` as GitHub Actions artifact, posts summary comment. WARN = exit 0 (no deploy failure); only explicit FAIL on blocking checks = exit 1. Requires GitHub Actions secrets: LIVENESS_TEST_EMAIL, LIVENESS_TEST_PASSWORD, BASE_URL (from deploy context), AI_GATEWAY_URL, AI_DOC_PARSER_URL, AI_SCORING_URL, AI_CHAT_URL, AI_REPORT_URL. | integration-builder | 🔴 PENDING |

---

## Sequencing

```
Wave LV-RED (qa-builder) — meta gate tests, MUST be RED
  ↓ RED GATE VERIFIED by Foreman
Wave LV-1 (qa-builder)   ←─── parallel ──→ Wave LV-2 (qa-builder)
                          ←─── parallel ──→ Wave LV-3 (qa-builder)
  ↓ (all LV-1, LV-2, LV-3 complete — CST commissioned)
Wave LV-4 (integration-builder) — runner + assembler
  ↓
Wave LV-5 (integration-builder) — CI trigger
  ↓ CWT required before IBWR
```

## Governance
- IAA Category: AAWP_MAT
- IAA Overlays: BD-001–BD-024, OVL-CI-001–005, CERT-001–004, CORE-001–022
- Total tasks: 12 (1 RED gate + 11 implementation tasks)
- Each wave = separate PREHANDOVER proof + IAA gate
