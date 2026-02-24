# Prehandover Proof — Wave 5: PersistentMemoryAdapter Supabase Integration

**Agent**: copilot
**Session**: wave5-persistentmemory-supabase-20260224
**Date**: 2026-02-24T10:40:00Z
**Priority**: FM_H (mandatory for every governed PR)
**Status**: COMPLETE

---

## AAWP Deliverable Table — Wave 5 Diff vs. Specification

| AAWP Deliverable | Required | File in Diff | Status |
|---|---|---|---|
| PersistentMemoryAdapter — Supabase | Implements persistence via Supabase client; tenant isolation in all queries | `packages/ai-centre/src/memory/PersistentMemoryAdapter.ts` | ✅ PRESENT — in-memory store replaced with Supabase client |
| Adapter Constructor Update | Accepts required SupabaseClient (AAD §8.2); throws when absent/null | `packages/ai-centre/src/memory/PersistentMemoryAdapter.ts` | ✅ PRESENT — constructor requires SupabaseClient |
| Unit & Integration Tests | All test cases run against Supabase-backed adapter via mock; covers persist/retrieve/prune isolation | `packages/ai-centre/src/__tests__/memory/PersistentMemoryAdapter.test.ts`, `wave4-cst.test.ts` | ✅ PRESENT — all 48 tests GREEN |
| Mock Supabase Client helper | Enables tests to run against adapter without a live DB | `packages/ai-centre/src/__tests__/helpers/mockSupabaseClient.ts` | ✅ PRESENT — fluent builder mock with in-memory backing |
| Migration consistency check | `supabase/migrations/001_ai_memory.sql` aligned with adapter column mapping | `packages/ai-centre/supabase/migrations/001_ai_memory.sql` (unchanged — consistent) | ✅ VERIFIED — adapter maps snake_case ↔ camelCase correctly |
| Parking station update | Supabase deferral removed from active list, completion recorded | `.agent-workspace/parking-station/suggestions-log.md` | ✅ PRESENT — entry added |
| PREHANDOVER proof | Evidence bundle for final merge | `.agent-admin/prehandover/proof-wave5-persistentmemory-supabase.md` | ✅ THIS FILE |
| Package dependency | `@supabase/supabase-js` added to `packages/ai-centre/package.json` | `packages/ai-centre/package.json` | ✅ PRESENT — ^2.95.3 |

---

## Implementation Summary

### PersistentMemoryAdapter (Wave 5)

- **File**: `packages/ai-centre/src/memory/PersistentMemoryAdapter.ts`
- In-memory `store` array **fully replaced** by Supabase client calls to the `ai_memory` table.
- Constructor signature: `constructor(supabaseClient?: SupabaseClient)` — throws `'SupabaseClient is required for PersistentMemoryAdapter'` when `undefined` or `null` is passed.
- **`retrieve()`**: issues `.from('ai_memory').select('*').eq('organisation_id', params.organisationId)` — explicit query-layer tenant isolation (GRS-008); applies optional `session_id` eq-filter and `limit`.
- **`persist()`**: issues `.from('ai_memory').insert(...)` with snake_case column mapping.
- **`pruneExpired()`**: issues `.from('ai_memory').delete().eq(...).lt('expires_at', ...).not('expires_at', 'is', null).select('id')` — returns count of deleted rows.
- All methods throw descriptive errors on Supabase client error responses.

### Column Mapping (PersistedMemoryEntry ↔ ai_memory table)

| TypeScript field | DB column |
|---|---|
| `organisationId` | `organisation_id` |
| `sessionId` | `session_id` |
| `userId` | `user_id` |
| `role` | `role` |
| `content` | `content` |
| `capability` | `capability` |
| `timestamp` | `timestamp` |
| `expiresAt` | `expires_at` |

### Mock Supabase Client

- **File**: `packages/ai-centre/src/__tests__/helpers/mockSupabaseClient.ts`
- `createMockSupabaseClient()` returns a SupabaseClient-compatible mock backed by an in-memory array.
- Supports all builder methods used by the adapter: `from / select / insert / delete / eq / lt / not / limit`.
- Used by `PersistentMemoryAdapter.test.ts` and `wave4-cst.test.ts`.

---

## Test Run Evidence

```
Test Files  11 passed (11)
     Tests  48 passed (48)
  Start at  10:40:08
  Duration  1.36s
```

- Zero test failures: ✅
- Zero skipped/todo/stub tests: ✅
- Zero deprecation warnings: ✅
- Zero compiler/linter warnings: ✅

---

## Acceptance Criteria

- [x] In-memory logic fully replaced by Supabase-backed implementation.
- [x] Adapter constructor requires SupabaseClient; throws on undefined/null.
- [x] Organisation-level tenant isolation enforced at query layer (`organisation_id` eq-filter in every query, not RLS alone).
- [x] All persist/retrieve/prune operations interact with `ai_memory` only via Supabase client.
- [x] Wave 4 and 5 CST tests pass using Supabase-backed adapter (via mock).
- [x] Migration file (`001_ai_memory.sql`) verified consistent with adapter column mapping.
- [x] PREHANDOVER proof exists; parking station updated to record Wave 5 completion.

---

## OPOJD Gate

- [x] Zero test failures
- [x] Zero skipped/todo/stub tests
- [x] Zero deprecation warnings
- [x] Zero compiler/linter warnings
- [x] Merge gate parity check: all required_checks match CI — PASS

---

Authority: EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md
References: GRS-008 | APS §7.2 | AAD §5.6, §8.2
Generated: 2026-02-24T10:40:00Z
