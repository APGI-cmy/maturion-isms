# STOP_AND_FIX: Supabase Credentials Invalid for RED Harness Execution

**Status:** BLOCKER — RED test execution halted
**Severity:** BLOCKING
**Responsible:** User/Operator
**Scope:** PR #1981 / Issue #1974
**Date:** 2026-08-11T13:58:48Z

---

## Summary

All 25 RED test IDs from the Supabase integration harness (`pit-w83-supabase.red.test.mjs`) are failing with `401 Unauthorized` error when attempting to authenticate against the Supabase project `ujucvyyspfxlxlfdamda`.

The Supabase URL is now correct (`https://ujucvyyspfxlxlfdamda.supabase.co`), but the anon key and service role key in `.env` are invalid/expired/mismatched.

---

## Failure Evidence

**Test Harness:** `modules/pit/06-qa-to-red/executable/pit-w83-supabase.red.test.mjs`
**Total Test IDs:** 25 (W83-001, W83-002, W83-003, W83-004, W83-005, W83-009, W83-017, W83-019, W83-020, W83-021, W83-022, W83-023, W83-024, W83-025, W83-026, W83-027, W83-028, W83-029, W83-031, W83-033, W83-034, W83-035, W83-036 + HARNESS-001, HARNESS-002)
**Pass Count:** 0/25
**Fail Count:** 25/25

**Error:**
```
AssertionError [ERR_ASSERTION]: Harness health check failed: 401 Unauthorized. 
Start disposable/local Supabase before running RED suite.
```

**Root Cause:** Invalid Supabase credentials
- **What succeeded:** URL resolution (ujucvyyspfxlxlfdamda.supabase.co is reachable)
- **What failed:** Authentication (anon key and/or service role key rejected by Supabase API)

---

## Remediation Required

**Action:** Retrieve and update Supabase credentials

1. Log into **Supabase Dashboard** → https://supabase.com/dashboard/project/ujucvyyspfxlxlfdamda
2. Navigate to **Project Settings → API** (or **Settings → API Keys**)
3. Locate and copy:
   - **Anon/Public Key** (JWT-based API key for client-side use)
   - **Service Role/Secret Key** (confidential key for server-side operations)
4. Update `.env` file in worktree root with:
   ```
   PIT_W83_SUPABASE_URL=https://ujucvyyspfxlxlfdamda.supabase.co
   PIT_W83_SUPABASE_ANON_KEY=<actual_anon_key>
   PIT_W83_SUPABASE_SERVICE_ROLE_KEY=<actual_service_role_key>
   PIT_W83_APP_URL=https://maturion-h1anow8vh-rassie-ras-projects.vercel.app
   ```
5. Notify when complete.

---

## Impact

- **Browser RED tests:** Ready (auth fix committed in commit 7577e57b)
- **Supabase RED tests:** Blocked (25 tests cannot execute)
- **Contract/unit RED tests:** Ready (awaiting Supabase readiness)
- **Handover readiness:** Cannot claim QP PASS until all 36 RED IDs execute with baseline evidence

---

## Notes

- Project `ujucvyyspfxlxlfdamda` exists and is `ACTIVE_HEALTHY` (verified via Supabase API)
- `.env` file is local-only and not committed to repo (correct)
- Dependencies installed successfully (pnpm@9.12.0, node@v24.19.0)
- No DNS or network issues (ujucvyyspfxlxlfdamda.supabase.co resolves and responds)

---

**Assigned to:** @APGI-cmy / User / Operator
**Next step:** Update `.env` with valid Supabase credentials and rerun harness
