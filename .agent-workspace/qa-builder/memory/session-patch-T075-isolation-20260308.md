# Session Memory — qa-builder — patch-T075-isolation — 2026-03-08

## Agent Metadata
- **Agent Type**: qa-builder
- **Class**: Builder
- **Version**: v6.2.0
- **Session ID**: session-patch-T075-isolation-20260308
- **Contract**: `.github/agents/qa-builder.md` (Four-Phase Canonical Contract v4.0.0)
- **Session Start**: 2026-03-08
- **Branch**: copilot/fix-isolate-build-persistent-memory-test

---

## Task Description

T-T075-ISO-001: Fix T-075-1 "non-null behaviour" test isolation in `api/ai/request.test.ts`.

Root cause: T-075-1 called `buildPersistentMemory()` which uses the real Supabase client when env vars are set. Fixed `organisationId: 'org-red-001'` caused entries from concurrent workflow runs to accumulate, producing up to 9 results when `toHaveLength(1)` expected.

**Fix**: Updated T-075-1 to use fresh `makeTestSupabaseClient()` (in-memory) and unique `organisationId` per run.

---

## Files Modified

| File | Action | Notes |
|------|--------|-------|
| `api/ai/request.test.ts` | UPDATED | T-075-1 test: fresh makeTestSupabaseClient() + unique org-red-${Date.now()}-${random} |
| `SCOPE_DECLARATION.md` | UPDATED | Updated for patch-T075-isolation wave |
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | UPDATED | Updated for this wave |
| `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-patch-T075-isolation-20260308.md` | CREATED | PREHANDOVER proof |
| `.agent-workspace/qa-builder/memory/session-patch-T075-isolation-20260308.md` | CREATED | This file |

---

## Actions Taken

1. Called `agent_bootstrap(agent_id: "qa-builder")` — Phase 1 preflight complete
2. Read IAA Pre-Brief: `.agent-admin/assurance/iaa-prebrief-patch-T075-isolation.md`
3. Located T-075-1 test at line 529–558 of `api/ai/request.test.ts`
4. Changed T-075-1 to use `makeTestSupabaseClient()` + `SupabasePersistentMemoryAdapter` directly (matching T-075-SUP-2 pattern)
5. Used `org-red-${Date.now()}-${Math.random().toString(36).slice(2)}` for unique org ID per run
6. Ran tests — 25/25 GREEN (including T-075-1)
7. CodeQL: 0 alerts
8. Code review addressed — uniqueness suffix added
9. Created PREHANDOVER proof and session memory

---

## Test Results

- **25/25 tests pass** in `api/ai/request.test.ts`
- T-075-1 "buildPersistentMemory() stores and retrieves entries (non-null behaviour)": ✅ PASS
- 0 skipped, 0 todo, 0 stub tests
- CodeQL: 0 alerts

---

## IAA Pre-Brief Reference

Pre-Brief: `.agent-admin/assurance/iaa-prebrief-patch-T075-isolation.md`
Trigger category: AAWP_MAT / BUILD_DELIVERABLE
IAA Verdict: PENDING (handover invocation in progress)

---

## Explicitly UNCHANGED

- `api/ai/request.ts` (production code) — NOT TOUCHED
- All other test files — NOT TOUCHED
- `makeTestSupabaseClient.ts` — NOT TOUCHED (existing utility used as-is)
