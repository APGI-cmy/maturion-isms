# Wave Current Tasks — foreman-v2-agent

**Wave**: Wave 14 Final — Apply Final Supabase Migrations (000000–000008) with PREHANDOVER Proof and IAA Token
**Wave**: Wave 14 IBWR — Formal In-Between Wave Reconciliation & Progress Tracker Update
**Session**: session-143
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
**Wave**: Wave 14 Batch C — Finalise MAT Remaining Gap Closure and QA Acceptance
**Session**: session-142
**Date**: 2026-03-05
**Issue**: Wave 14 Final Migrations (apply-wave-14-migrations branch)
**Branch**: copilot/apply-wave-14-migrations
**CS2 Authorization**: Issue assigned to foreman-v2-agent by CS2-directed automation
**Source authority**: modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md v1.0
**FRS/TRS**: FR-089 to FR-102 / TR-089 to TR-102
**Depends on**: Wave 14 Batch A (session-140), Wave 14 Batch B (session-141), Wave 14 Batch C (session-142)
**Issue**: Wave 14 IBWR
**Branch**: copilot/update-wave-14-ibwr-tracker
**CS2 Authorization**: Issue opened by @APGI-cmy (CS2 direct)
**Prior wave**: Wave 14 Batch C (session-142, copilot/finalise-mat-gap-closure)

## IBWR Task List

| Task | Description | Owner | Status |
|------|-------------|-------|--------|
| IBWR-001 | Create Wave 14 IBWR artifact | foreman | ✅ DONE |
| IBWR-002 | Update BUILD_PROGRESS_TRACKER.md | foreman | ✅ DONE |
| IBWR-003 | Create PREHANDOVER proof (session-143) | foreman | ✅ DONE |
| IBWR-004 | Create session memory (session-143) | foreman | ✅ DONE |
| IBWR-005 | Update SCOPE_DECLARATION.md | foreman | ✅ DONE |
| IBWR-006 | Invoke IAA for independent audit | IAA | 🔴 PENDING |

---

## Wave 14 Batch C — Task List

### Gap Status from Batches A & B

| Gap | Status | Batch | Evidence |
|-----|--------|-------|---------|
| GAP-W01 (Onboarding Guard) | ✅ CLOSED | Batch A | 20260305000000_wave14_onboarding_support.sql + OnboardingGuardPage.tsx |
| GAP-W02 (Invite Auditor) | ✅ CLOSED | Batch A | 20260305000001_wave14_invitations_assignments.sql + InviteAuditorModal.tsx |
| GAP-W03 (Toggle Exclude) | ✅ CLOSED | Batch A | 20260305000002_wave14_excluded_columns.sql |
| GAP-W04 (Invite Evidence Submitter) | ✅ CLOSED | Batch A | 20260305000001 |
| GAP-W05 (Evidence Card) | ✅ CLOSED | Batch B | 20260305000003_wave14_evidence_schema.sql + EvidenceUploadPanel.tsx |
| GAP-W06 (AI Evaluation Trigger) | ✅ CLOSED | Batch B | 20260305000004_wave14_evaluations.sql + CriteriaCard.tsx |
| GAP-W07 (AI Next-Level Guidance) | ✅ CLOSED | Batch B | CriteriaCard.tsx |
| GAP-W08 (AI Chat Context) | ✅ CLOSED | Batch B | EmbeddedAIAssistant.tsx |
| GAP-W09 (Audit Results Table) | ✅ CLOSED | Batch B | AuditResultsTable.tsx + AuditManagementPage.tsx |
| GAP-W10 (Dashboard Drill-Down + Create Report Gate) | ✅ CLOSED | Batch B | DashboardPage.tsx |
| GAP-W11 (Report Generation) | ✅ CLOSED | Batch B | 20260305000006_wave14_audit_reports.sql + ReportGenerationPage.tsx |
| GAP-W12 (Level Descriptors) | 🔴 OPEN — migration missing | Batch C | TASK-W14-BC-001 |
| GAP-W13 (Scoring Tables + Default Rule) | 🔴 OPEN — migration missing | Batch C | TASK-W14-BC-002 |
| GAP-W14 (Responsibility Cascade) | ✅ CLOSED | Batch A | 20260305000001 |
| GAP-W15 (RLS for all new tables) | ✅ CLOSED | Batch A | 20260305000008_wave14_new_tables_rls.sql |

---

## Batch C Task List

### Subwave 14.C.1 — Level Descriptor Tables (GAP-W12)
**Test ID**: T-W14-UX-012
**RED tests failing**: T-W14-UX-012a through T-W14-UX-012f (6 tests in level-descriptor-tables.test.ts)

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 1 | TASK-W14-BC-001 | Create migration `20260305000005_wave14_level_descriptors.sql`: CREATE TABLE public.criteria_level_descriptors (id UUID PK, criteria_id UUID FK NOT NULL, level INTEGER NOT NULL, descriptor_text TEXT NOT NULL, UNIQUE(criteria_id, level)); CREATE TABLE public.mps_level_descriptors (id UUID PK, mps_id UUID FK NOT NULL, level INTEGER NOT NULL, descriptor_text TEXT NOT NULL, UNIQUE(mps_id, level)); CREATE TABLE public.domain_level_descriptors (id UUID PK, domain_id UUID FK NOT NULL, level INTEGER NOT NULL, descriptor_text TEXT NOT NULL, UNIQUE(domain_id, level)); RLS: org-isolation SELECT policies for all 3 tables | schema-builder | 🟢 DONE |

### Subwave 14.C.2 — Scoring Tables and Default Rule (GAP-W13)
**Test ID**: T-W14-UX-013 + T-W14-UX-016
**RED tests failing**: T-W14-UX-013a through T-W14-UX-013g (7 tests), T-W14-UX-016a through T-W14-UX-016g (7 tests) — all pointing to same migration file

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 2 | TASK-W14-BC-002 | Create migration `20260305000007_wave14_scoring_tables.sql`: CREATE TABLE public.maturity_levels (id UUID PK, name TEXT NOT NULL, level_number INTEGER NOT NULL UNIQUE, description TEXT); INSERT 5 seed rows (Basic=1, Reactive=2, Compliant=3, Proactive=4, Resilient=5); CREATE TABLE public.scoring_rules (id UUID PK, organisation_id UUID NULLABLE FK organisations, aggregation_method TEXT NOT NULL DEFAULT 'weighted_average'); INSERT global default seed (organisation_id=NULL, aggregation_method='weighted_average'); CREATE TABLE public.aggregate_scores (id UUID PK, audit_id UUID FK NOT NULL, level_type TEXT NOT NULL, scope_id UUID, score NUMERIC, UNIQUE(audit_id, level_type, scope_id)); RLS: maturity_levels and scoring_rules publicly readable (global reference); aggregate_scores org-isolated; fallback COALESCE for missing scoring rule | schema-builder | 🟢 DONE |

### Subwave 14.C.3 — Post-Implementation Assurance Report (Issue Scope)
**Test ID**: N/A (governance/documentation artifact)

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 3 | TASK-W14-BC-003 | Create `modules/mat/05-build-evidence/wave14-postimplementation-assurance-report.md` — full UX workflow green/red tick-list against all 15 GAPs (W01–W15), screenshot references (placeholder), drill-down capability attestation, signed-off QA acceptance | mat-specialist | 🟢 DONE |

### Subwave 14.C.4 — App Management Centre Watchdog Readiness (Issue Scope)

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 4 | TASK-W14-BC-004 | Create `modules/mat/05-build-evidence/app-management-centre-watchdog-readiness.md` — document MAT readiness for future watchdog/monitoring integration: health check endpoints, key event hooks, monitoring surfaces, integration interface contract | mat-specialist | 🟢 DONE |

---

## IAA Tokens (to be populated post-IAA)

| PR # | Token | Date |
|------|-------|------|
| — | PENDING | — |

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
- [ ] IAA Pre-Brief exists at `.agent-admin/assurance/iaa-prebrief-wave14-batchC.md`
- [ ] TASK-W14-BC-001 complete: `20260305000005_wave14_level_descriptors.sql` exists, T-W14-UX-012a–012f GREEN
- [ ] TASK-W14-BC-002 complete: `20260305000007_wave14_scoring_tables.sql` exists, T-W14-UX-013a–013g GREEN, T-W14-UX-016a–016g GREEN
- [ ] TASK-W14-BC-003 complete: post-implementation assurance report committed
- [ ] TASK-W14-BC-004 complete: watchdog readiness document committed
- [ ] 0 pre-existing test regressions introduced
- [ ] All tasks show 🟢 DONE
- [ ] IAA ASSURANCE-TOKEN received
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval

---

## Wave 14 Batch C — COMPLETE

**All 4 tasks 🟢 DONE**
**IAA ASSURANCE-TOKEN**: `IAA-session-142-v3-wave14-batchC-20260305-PASS` (IAA session-149)
**Token file**: `.agent-admin/assurance/iaa-token-session-142-v3-wave14-batchC-20260305.md`
**Wave 14 Status**: ✅ ALL 15 GAPs CLOSED — One-time build milestone ACHIEVED for MAT
