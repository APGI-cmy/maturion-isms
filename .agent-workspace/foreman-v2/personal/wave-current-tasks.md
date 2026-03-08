# Wave Current Tasks — foreman-v2-agent — fix-e2e-w13-liveness

**Wave**: fix-e2e-w13-liveness
**Branch**: copilot/fix-e2e-liveness-failures
**Issue**: maturion-isms — E2E liveness failures T-W13-E2E-1 and T-W13-E2E-4
**Date**: 2026-03-08
**Session**: session-fix-e2e-w13-liveness-20260308
**CS2 Authorization**: Issue assigned by @APGI-cmy directly
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-fix-e2e-w13-liveness.md` — PENDING

---

## Wave Context

**Wave Slug**: fix-e2e-w13-liveness
**Summary**: Two E2E test failures in `modules/mat/tests/wave13/e2e-live-deployment.test.ts`:
1. T-W13-E2E-1 fails in CI because live production URLs are network-blocked unless E2E_ENABLED is set
2. T-W13-E2E-4 fails because the audits insert lacks `organisation_id` required by RLS policy

**Delegated to**: qa-builder

---

## Outstanding Tasks

| # | Task ID | Task | Builder | Status |
|---|---------|------|---------|--------|
| 1 | T-001 | Add `if (!process.env.E2E_ENABLED) return;` guard to T-W13-E2E-1 | qa-builder | 🔴 PENDING |
| 2 | T-002 | Query profiles for organisation_id after signIn; include in audits insert in T-W13-E2E-4 | qa-builder | 🔴 PENDING |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE | ❌ BLOCKED

---

## Wave Completion Gate

- [ ] IAA Pre-Brief committed
- [ ] T-001: T-W13-E2E-1 guard added
- [ ] T-002: T-W13-E2E-4 organisation_id fixed
- [ ] QP evaluation: PASS
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] IAA ASSURANCE-TOKEN received
- [ ] CS2 notified for merge approval
