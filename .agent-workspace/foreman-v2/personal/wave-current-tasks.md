# Wave Current Tasks — foreman-v2-agent

**Wave**: fix-e2e-test-auth-method — Replace setSession with signInWithPassword in T-W13-E2E-4/5 for stable CI auth
**Session**: session-fix-e2e-auth-20260308
**Date**: 2026-03-08
**Issue**: fix(test/e2e): Replace setSession with signInWithPassword in T-W13-E2E-4 for stable auth
**Branch**: copilot/fix-e2e-test-auth-method
**CS2 Authorization**: Issue opened and assigned by @APGI-cmy directly
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-fix-e2e-test-auth-method.md` — COMMITTED

---

## Wave Context

**Wave Slug**: fix-e2e-test-auth-method
**Root cause**: `T-W13-E2E-4` and `T-W13-E2E-5` use `client.auth.setSession({ access_token, refresh_token })` with the secrets `MAT_E2E_TEST_TOKEN` and `MAT_E2E_REFRESH_TOKEN`. Refresh tokens are single-use and expire after each run, requiring operator intervention and manual rotation for every CI test run.

**Failing tests (expected in CI without manual rotation):**
- T-W13-E2E-4: Full audit creation flow — fails because `MAT_E2E_REFRESH_TOKEN` is consumed after first use
- T-W13-E2E-5: All major tables accessible after token auth — same root cause

**Solution**: Replace `setSession` with `signInWithPassword({ email, password })` using `LIVENESS_TEST_EMAIL` and `LIVENESS_TEST_PASSWORD` — secrets already in GitHub Actions that do not expire or get consumed.

**Scope (files changed):**
1. `modules/mat/tests/wave13/e2e-live-deployment.test.ts` — replace `setSession` with `signInWithPassword` in T-W13-E2E-4 and T-W13-E2E-5, switch env vars from `MAT_E2E_TEST_TOKEN`/`MAT_E2E_REFRESH_TOKEN` to `LIVENESS_TEST_EMAIL`/`LIVENESS_TEST_PASSWORD`
2. `.github/workflows/deploy-mat-ai-gateway.yml` — remove `MAT_E2E_TEST_TOKEN` and `MAT_E2E_REFRESH_TOKEN` from CWT job env block, add `LIVENESS_TEST_EMAIL` and `LIVENESS_TEST_PASSWORD`

---

## Outstanding Tasks

| # | Task ID | Task | Builder | Status | PR / Evidence |
|---|---------|------|---------|--------|---------------|
| 1 | T-E2E-AUTH-001 | Replace `setSession` with `signInWithPassword` in T-W13-E2E-4 and T-W13-E2E-5; update CI workflow env vars | integration-builder | 🟢 DONE | Committed: `9f118d3` |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| copilot/fix-e2e-test-auth-method | PENDING | — |

---

## Wave Completion Gate

- [x] T-E2E-AUTH-001: `setSession` replaced with `signInWithPassword` in both T-W13-E2E-4 and T-W13-E2E-5
- [x] CI workflow env vars updated — removed expiring token secrets, added stable credential secrets
- [ ] IAA ASSURANCE-TOKEN received
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval
