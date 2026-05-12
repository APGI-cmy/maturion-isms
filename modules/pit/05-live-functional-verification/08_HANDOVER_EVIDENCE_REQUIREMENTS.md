# 08 — Handover Evidence Requirements
<!-- LFV Template v1.0.0 | Authority: LIVE_FUNCTIONAL_VERIFICATION_CANON.md §4 | Issue: maturion-isms#1617 -->
<!-- PIT instantiation | Issue: maturion-isms#1619 | PR: #1624 -->

## Header

| Field | Value |
|-------|-------|
| Module | PIT (Project Implementation Tracker) |
| Wave | pit-lfv-package-20260512 |
| PR | #1624 |
| Issue | maturion-isms#1619 |
| Date | 2026-05-12 |
| Author | foreman-v2-agent |
| Status | DESIGN ARTIFACT — not a deployment claim |

---

## Purpose

This document defines the complete set of evidence artifacts required for PIT handover, the 8 LFV gates each artifact satisfies, and the IAA Three-Tier Verdict criteria. No handover is complete without all evidence categories present.

---

## Critical Note: FUNCTIONAL_PASS Status of This Wave

> **This wave (PR #1624) does NOT claim FUNCTIONAL_PASS.**  
> This wave creates the LFV *requirements* — it does not execute them against a deployed application.  
> FUNCTIONAL_PASS: yes CANNOT be claimed until:
> 1. PIT is fully built and deployed to a live Vercel environment
> 2. All 8 gates below PASS in the deployed environment
> 3. CS2 (Johan Ras) has performed live E2E manual verification
> 4. `pit-live-verification.yml` workflow has run successfully with all 5 artifacts present

---

## Required Evidence Artifacts

### Artifact 1: Test Run Evidence (GREEN)

| Field | Value |
|-------|-------|
| **Artifact Name** | `pit-test-results-{wave}-{sha}.json` |
| **Type** | CI_TEST |
| **Source** | Vitest / Playwright unit + integration test runner |
| **Content** | Full test results: pass/fail counts, test names, durations, zero failures, zero skipped, zero todo |
| **Location** | GitHub Actions artifact + `.agent-admin/evidence/test-results/pit-{wave}/` |
| **Gate Satisfied** | `USER_JOURNEY_COMPLETE` (test coverage), `FAILING_REQUEST` (no test failures) |
| **Acceptance Criteria** | 100% passing (zero failures, zero skips, zero todo items); minimum 80% line coverage for PIT-specific modules |

---

### Artifact 2: Live Verification Screenshot Bundle

| Field | Value |
|-------|-------|
| **Artifact Name** | `pit-screenshots-{sha}.zip` |
| **Type** | LIVE_RUNTIME |
| **Source** | Playwright `screenshot.png` (and per-step screenshots) from `pit-live-verification.yml` run |
| **Content** | Full-page screenshots of: /login, /dashboard, /projects, /projects/:id, /projects/:id/tasks, /projects/:id/evidence (before + after upload), /projects/:id/reports (before + after generate), /notifications, /admin/audit-log, /qa-dashboard (cs2_admin), /qa-dashboard (viewer — permission-denied) |
| **Location** | GitHub Actions artifact from live verification workflow run |
| **Gate Satisfied** | `DEPLOYMENT_ACCESS`, `DASHBOARD_OR_PAGE_LOAD`, `USER_JOURNEY_COMPLETE` |
| **Acceptance Criteria** | No white screens; all key screens show correct content; permission-denied states confirmed |

---

### Artifact 3: Network HAR Archive

| Field | Value |
|-------|-------|
| **Artifact Name** | `network-{sha}.har` |
| **Type** | LIVE_RUNTIME |
| **Source** | Playwright `network.har` from `pit-live-verification.yml` run |
| **Content** | Full HTTP Archive of all network requests/responses during LFV session: API calls, storage calls, Edge Function calls, Supabase Realtime WebSocket frames |
| **Location** | GitHub Actions artifact from live verification workflow run |
| **Gate Satisfied** | `FAILING_REQUEST`, `HTTP_STATUS`, `DEPLOYED_SHA_MATCH` (via deployment metadata request) |
| **Acceptance Criteria** | Zero unexpected non-2xx responses on happy-path; expected 403s present for permission-denied paths; Supabase Realtime WebSocket connection visible |

---

### Artifact 4: Playwright Trace Archive

| Field | Value |
|-------|-------|
| **Artifact Name** | `trace-{sha}.zip` |
| **Type** | LIVE_E2E |
| **Source** | Playwright trace from `pit-live-verification.yml` run |
| **Content** | Step-by-step Playwright trace: DOM snapshots at each step, screenshots, network calls, console output, timing — viewable in `playwright show-trace trace-{sha}.zip` |
| **Location** | GitHub Actions artifact from live verification workflow run |
| **Gate Satisfied** | `USER_JOURNEY_COMPLETE`, `CONSOLE_ERROR` |
| **Acceptance Criteria** | All 16 journey steps traceable; no uncaught exceptions visible; console error count = 0 on happy-path steps |

---

### Artifact 5: Browser Console Log

| Field | Value |
|-------|-------|
| **Artifact Name** | `console-{sha}.log` |
| **Type** | LIVE_RUNTIME |
| **Source** | Playwright console capture from `pit-live-verification.yml` run |
| **Content** | All browser console output: log, info, warn, error, debug; unhandled promise rejections |
| **Location** | GitHub Actions artifact from live verification workflow run |
| **Gate Satisfied** | `CONSOLE_ERROR` |
| **Acceptance Criteria** | Zero `console.error` calls from application code on happy-path flows; zero unhandled promise rejections |

---

### Artifact 6: Verification Report

| Field | Value |
|-------|-------|
| **Artifact Name** | `verification-report.txt` |
| **Type** | LIVE_RUNTIME |
| **Source** | Generated by `report` job in `pit-live-verification.yml` |
| **Content** | All 10 output fields; timestamp; deployment URL; git SHA; deployed SHA; gate summary table; LIKELY_ROOT_CAUSE (if any failures); artifact links |
| **Location** | GitHub Actions artifact from live verification workflow run; also written to `$GITHUB_STEP_SUMMARY` |
| **Gate Satisfied** | All 8 gates (summary); `ARTIFACT_LINKS` |
| **Acceptance Criteria** | All 10 fields present; all 8 gates show PASS; LIKELY_ROOT_CAUSE is blank; ARTIFACT_LINKS lists all 5 artifact names |

---

### Artifact 7: Supabase Table Evidence (Screenshots or Query Results)

| Field | Value |
|-------|-------|
| **Artifact Name** | `supabase-state-evidence-{wave}.md` |
| **Type** | LIVE_RUNTIME |
| **Source** | CS2 manual screenshots from Supabase dashboard, OR automated query results from CI |
| **Content** | Query results confirming: project row created, milestone row, deliverable row, task row with `assigned_to`, `evidence_items` row with `status = 'approved'`, `report_history` row, `audit_log` rows for all event types, `notifications` rows with `read_at` set |
| **Location** | `.agent-admin/evidence/pit-lfv-supabase-state/{wave}/` |
| **Gate Satisfied** | `USER_JOURNEY_COMPLETE`, `FAILING_REQUEST` |
| **Acceptance Criteria** | All expected table rows present; all expected status fields correct; all `audit_log` events present |

---

### Artifact 8: CS2 Manual Verification Sign-Off

| Field | Value |
|-------|-------|
| **Artifact Name** | `cs2-verification-sign-off-{wave}.md` |
| **Type** | LIVE_E2E |
| **Source** | Johan Ras (@APGI-cmy) manual verification against live deployed URL |
| **Content** | Completed `09_CS2_UI_ACCEPTANCE_CHECKLIST.md` with all items checked; CS2 signature; deployment URL tested; date of verification |
| **Location** | `.agent-admin/evidence/pit-lfv-cs2/{wave}/` or filed as PR comment/review approval |
| **Gate Satisfied** | All 8 gates (CS2 authority) — this is the L3 closure artifact |
| **Acceptance Criteria** | All 9 checklist sections completed; FUNCTIONAL_PASS: yes signed by Johan Ras; date within 7 days of deployment |

---

## 8 LFV Gates with Evidence Type

| # | Gate | Evidence Type | Satisfied By | Current Status (this wave) |
|---|------|--------------|-------------|---------------------------|
| 1 | `DEPLOYMENT_ACCESS` | LIVE_RUNTIME | Artifacts 2 (screenshot of /login), 3 (HAR with HTTP 200) | NOT CLAIMABLE — PIT not yet deployed |
| 2 | `DEPLOYED_SHA_MATCH` | CONFIG | Artifact 6 (`verification-report.txt` SHA fields) | NOT CLAIMABLE — no deployment |
| 3 | `LOGIN_SUCCESS` | LIVE_RUNTIME | Artifacts 2 (dashboard screenshot), 4 (Playwright trace showing login step) | NOT CLAIMABLE — no deployment |
| 4 | `DASHBOARD_OR_PAGE_LOAD` | LIVE_RUNTIME | Artifact 2 (dashboard screenshot), 4 (trace), 5 (console log — zero errors) | NOT CLAIMABLE — no deployment |
| 5 | `USER_JOURNEY_COMPLETE` | LIVE_E2E | Artifacts 2, 3, 4, 7 (table evidence), 8 (CS2 sign-off) | NOT CLAIMABLE — no deployment |
| 6 | `FAILING_REQUEST` | LIVE_RUNTIME | Artifact 3 (HAR — zero unexpected non-2xx), 6 (report) | NOT CLAIMABLE — no deployment |
| 7 | `CONSOLE_ERROR` | LIVE_RUNTIME | Artifact 5 (console log), 4 (Playwright trace) | NOT CLAIMABLE — no deployment |
| 8 | `ARTIFACT_LINKS` | ARTIFACT | Artifact 6 (`verification-report.txt`) listing all 5 artifacts | NOT CLAIMABLE — no deployment |

---

## IAA Three-Tier Verdict

The Independent Assurance Agent (IAA) issues verdicts across three tiers:

### ADMIN_PASS

**Definition**: All governance ceremony artifacts are present and correctly structured.

**Evidence Required**:
- [ ] `01_FUNCTIONAL_USER_JOURNEY_CONTRACT.md` exists and covers all 16 journeys
- [ ] `02_AGENT_ACCESS_MATRIX.md` exists and covers all 18 secrets
- [ ] `03_DEPLOYED_VERIFICATION_PLAN.md` exists with 8-gate table
- [ ] `04_CTA_BACKEND_STATE_MAP.md` exists and covers all 17 CTAs
- [ ] `05_TEST_IDENTITY_AND_ROLE_MATRIX.md` exists covering all 7 roles
- [ ] `06_LIVE_VERIFICATION_WORKFLOW_SPEC.md` exists with all 10 output fields
- [ ] `07_DASHBOARD_STATE_REFLECTION_GATE.md` exists covering all 11 reflections
- [ ] `08_HANDOVER_EVIDENCE_REQUIREMENTS.md` exists (this file)
- [ ] `09_CS2_UI_ACCEPTANCE_CHECKLIST.md` exists
- [ ] `pit-live-verification-workflow.yml` design artifact exists
- [ ] `BUILD_PROGRESS_TRACKER.md` updated with Stage 5b: LFV Package entry

**ADMIN_PASS: This wave (PR #1624) CAN claim ADMIN_PASS** — all governance artifacts created.

---

### CODE_PASS

**Definition**: CI tests pass, TypeScript compiles without errors, build succeeds, no lint failures.

**Evidence Required**:
- [ ] `npm run build` exits 0 for PIT module (or relevant build command)
- [ ] TypeScript `tsc --noEmit` exits 0
- [ ] ESLint passes with zero errors on PIT module code
- [ ] Vitest test suite passes 100% (zero failures, zero skips)
- [ ] GitHub Actions CI workflow `pit-ci.yml` (or equivalent) shows green

**CODE_PASS: This wave (PR #1624) claims CODE_PASS for governance artifacts only** (no application code in this wave). Application CODE_PASS is deferred to the build wave (Stage 12).

---

### FUNCTIONAL_PASS

**Definition**: Deployed LFV workflow evidence collected AND CS2 UI acceptance completed against a live URL.

**Evidence Required**:
- [ ] `pit-live-verification.yml` workflow run completed with all 8 gates PASS
- [ ] All 5 required artifacts present from the workflow run
- [ ] All 8 Artifact categories (this document) collected
- [ ] CS2 (Johan Ras) completed `09_CS2_UI_ACCEPTANCE_CHECKLIST.md` with sign-off
- [ ] Deployment URL accessible at time of verification
- [ ] Deployed SHA matches PR head SHA

> **FUNCTIONAL_PASS: yes CANNOT be claimed for this wave (PR #1624).**  
> This wave defines the requirements; it does not execute them.  
> FUNCTIONAL_PASS will be claimable only after Stage 12 (Build Execution) is complete and  
> a live deployment exists for verification.

---

## Handover Readiness Checklist

Use this checklist before declaring any wave ready for CS2 handover review:

**Governance Artifacts (ADMIN_PASS prerequisite)**:
- [ ] All 9 LFV markdown files present in `modules/pit/05-live-functional-verification/`
- [ ] `pit-live-verification-workflow.yml` design artifact present
- [ ] `BUILD_PROGRESS_TRACKER.md` updated
- [ ] No placeholder text remaining in LFV artifacts (all content is PIT-specific)

**CI Evidence (CODE_PASS prerequisite)**:
- [ ] Build succeeds on PR branch
- [ ] All tests passing (zero failures, zero skips)
- [ ] TypeScript compilation clean
- [ ] Lint clean

**Live Evidence (FUNCTIONAL_PASS prerequisite — deferred to Stage 12)**:
- [ ] PIT deployed to Vercel preview or production
- [ ] `pit-live-verification.yml` workflow has been activated in `.github/workflows/`
- [ ] Workflow run completed with `PASS` for all 8 gates
- [ ] All 5 artifacts uploaded and accessible
- [ ] CS2 manual verification sign-off filed (`08_HANDOVER_EVIDENCE_REQUIREMENTS.md` Artifact 8)
- [ ] IAA verdict issued: FUNCTIONAL_PASS: yes

---

*LFV Template v1.0.0 | PIT Module | Wave pit-lfv-package-20260512 | 2026-05-12*
