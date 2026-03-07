# Wave Current Tasks — foreman-v2-agent

**Wave**: Wave CWT-EnvVars — Fix CWT: Pass Supabase env vars + MAT_E2E_TEST_TOKEN to test runner
**Session**: session-cwt-envvars-20260307
**Date**: 2026-03-07
**Issue**: [Foreman] Fix CWT: Pass Supabase env vars to test runner + Setup MAT_E2E_TEST_TOKEN to clear 9 RED tests in FCWT
**Branch**: copilot/fix-supabase-env-vars-for-tests
**CS2 Authorization**: Issue opened and assigned to foreman-v2-agent by @APGI-cmy directly
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-cwt-envvars.md` — PENDING

---

## Wave Context

**Wave Slug**: wave-cwt-envvars
**Oversight ID**: INC-CWT-ENVVARS-001
**Detected**: 2026-03-07 (FCWT Final session-144, 2026-03-05)
**Root cause**: CWT workflow (`deploy-mat-ai-gateway.yml`, `cwt` job) `Run Combined Wave Tests` step lacks `env:` block. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `MAT_E2E_TEST_TOKEN` are not exported to the pnpm/vitest test runner, causing 9 tests to fail.

**Failing tests (9 EXPECTED RED → must become GREEN):**
- T-W13-SCH-1: public.audits table exists in production schema
- T-W13-SCH-2: public.criteria table exists in production schema
- T-W13-SCH-3: public.domains table exists in production schema
- T-W13-SCH-4: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars are set
- T-W13-E2E-1: Live deployment health check (separate /health route fix needed)
- T-W13-E2E-2: Schema probe — audits table reachable via API
- T-W13-E2E-3: Auth flow — Supabase auth API reachable
- T-W13-E2E-4: Full audit creation flow (requires MAT_E2E_TEST_TOKEN)
- T-W13-E2E-5: All major tables accessible after token auth (requires MAT_E2E_TEST_TOKEN)

**Scope**:
1. `.github/workflows/deploy-mat-ai-gateway.yml` — add `env:` block to `Run Combined Wave Tests` step
2. `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` — document setup

---

## Outstanding Tasks

| # | Task ID | Task | Builder | Status | PR / Evidence |
|---|---------|------|---------|--------|---------------|
| 1 | T-CWT-EV-001 | Update `deploy-mat-ai-gateway.yml` CWT job: add `env:` to `Run Combined Wave Tests` step with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `MAT_E2E_TEST_TOKEN` from secrets | integration-builder | 🔴 PENDING | — |
| 2 | T-CWT-EV-002 | Update `BUILD_PROGRESS_TRACKER.md` — add section documenting CWT env var wiring: how to generate Supabase JWT token, where to add GitHub secret, expected result | integration-builder | 🔴 PENDING | — |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| — | PENDING | — |

---

## Wave Completion Gate

- [ ] T-CWT-EV-001: CWT workflow `env:` block added (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, MAT_E2E_TEST_TOKEN)
- [ ] T-CWT-EV-002: BUILD_PROGRESS_TRACKER.md updated with setup documentation
- [ ] All 9 previously EXPECTED RED tests pass when correct env vars + token are provided
- [ ] IAA ASSURANCE-TOKEN received
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval

