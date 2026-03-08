# Wave Current Tasks — foreman-v2-agent

**Wave**: Patch-T075-Isolation — Fix T-075 test isolation: buildPersistentMemory() shared state contamination
**Session**: session-patch-T075-20260308
**Date**: 2026-03-08
**Issue**: [Agent Task] fix(test): Isolate buildPersistentMemory() test (T-075) from shared state contamination
**Branch**: copilot/fix-isolate-build-persistent-memory-test
**CS2 Authorization**: Issue opened and assigned by @APGI-cmy directly
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-patch-T075-isolation.md` — PENDING

---

## Wave Context

**Wave Slug**: patch-T075-isolation
**Root cause**: T-075-1 "non-null behaviour" test in `api/ai/request.test.ts` calls `buildPersistentMemory()` directly, which uses the real Supabase client when env vars are set. The fixed `organisationId: 'org-red-001'` causes entries from concurrent/parallel workflow runs to accumulate, producing up to 9 results when the test expects exactly 1.

**Failing test:**
- T-075-1: `buildPersistentMemory() stores and retrieves entries (non-null behaviour)` — AssertionError: expected array to have length 1 but got 9

**Scope (single file change):**
1. `api/ai/request.test.ts` — update T-075-1 test to use a unique `organisationId` per run (`org-red-${Date.now()}`) and a fresh `makeTestSupabaseClient()` backed `SupabasePersistentMemoryAdapter` instead of calling `buildPersistentMemory()` with the real Supabase client

---

## Outstanding Tasks

| # | Task ID | Task | Builder | Status | PR / Evidence |
|---|---------|------|---------|--------|---------------|
| 1 | T-T075-ISO-001 | Update T-075-1 test in `api/ai/request.test.ts`: use fresh `makeTestSupabaseClient()` + unique `organisationId` (`org-red-${Date.now()}-${random}`) to isolate from cross-run contamination | qa-builder | 🟢 DONE | IAA ASSURANCE-TOKEN: IAA-session-patch-T075-isolation-20260308-PASS |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| copilot/fix-isolate-build-persistent-memory-test | IAA-session-patch-T075-isolation-20260308-PASS | 2026-03-08 |

---

## Wave Completion Gate

- [x] T-T075-ISO-001: T-075-1 test updated — unique org ID + fresh test client
- [x] `expect(results).toHaveLength(1)` passes consistently regardless of workflow concurrency
- [x] IAA ASSURANCE-TOKEN received: IAA-session-patch-T075-isolation-20260308-PASS
- [x] Session memory written
- [x] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval

