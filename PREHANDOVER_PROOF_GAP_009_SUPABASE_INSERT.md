# PREHANDOVER PROOF — Wave gap-009-episodic-memory-remediation

```yaml
wave: gap-009-episodic-memory-remediation
branch: copilot/gap-009-wire-supabase-insert
issue: maturion-isms#1274
agent: api-builder
session_memory: .agent-workspace/api-builder/memory/session-gap009-20260407.md
iaa_audit_token: IAA-session-gap009-wave-gap-009-20260407-PASS
date: 2026-04-07
```

---

## Task T-01: Wire Supabase INSERT to `ai_episodic_events` in `EpisodicMemoryAdapter`

### Finding Remediated
**F-D4-001** (CL-11-D4): `EpisodicMemoryAdapter.record()` used `this.store.push()` (in-memory array)
instead of a real Supabase INSERT. GRS-009 organisation-level tenant isolation was silently violated.

---

## Deliverables

| Deliverable | Path | Status |
|-------------|------|--------|
| Supabase-backed `EpisodicMemoryAdapter.ts` | `packages/ai-centre/src/memory/EpisodicMemoryAdapter.ts` | ✅ COMMITTED |
| Updated test suite with mock Supabase client | `packages/ai-centre/src/__tests__/memory/EpisodicMemoryAdapter.test.ts` | ✅ COMMITTED |
| Session memory | `.agent-workspace/api-builder/memory/session-gap009-20260407.md` | ✅ COMMITTED |
| PREHANDOVER proof (this file) | `PREHANDOVER_PROOF_GAP_009_SUPABASE_INSERT.md` | ✅ COMMITTED |
| SCOPE_DECLARATION.md | `SCOPE_DECLARATION.md` | ✅ COMMITTED |
| wave-current-tasks.md updated | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | ✅ COMMITTED |

---

## Scope Blocker Compliance (SB-001 through SB-007)

### SB-001 — S-QA-001: Tests inject mock Supabase client, assert DB writes

✅ **RESOLVED**

All tests updated to inject `makeMockEpisodicSupabaseClient()`. Tests assert:
- `mock.rows` contains the inserted row (DB write happened, not in-memory push)
- `mock.rpcCalls` contains the `set_config` call (RLS enforcement verified)
- No test uses `new EpisodicMemoryAdapter()` with no args for the write/retrieve path tests

### SB-002 — Schema Column Completeness

✅ **RESOLVED**

`toRow()` maps all required/NOT NULL columns from `EpisodicEventEntry` to `ai_episodic_events`:
- `organisation_id` ← `entry.organisationId`
- `session_id` ← `entry.sessionId`
- `agent_id` ← `entry.agentId`
- `event_type` ← `entry.eventType`
- `capability` ← `entry.capability` (typed `Capability` enum — values match CHECK constraint)
- `summary` ← `entry.summary`
- `full_context` ← `entry.fullContext ?? null`

### SB-003 — RLS Setting Call Must Precede INSERT

✅ **RESOLVED**

`record()` calls `this.supabase.rpc('set_config', { parameter: 'app.current_organisation_id', value: entry.organisationId, is_local: true })` **before** the `.insert()` call.

Test: `'record() calls set_config rpc with app.current_organisation_id before INSERT'` asserts
`mock.rpcCalls[0].fn === 'set_config'` and `mock.rpcCalls[0].params` contains the correct fields.

### SB-004 — `retrieve()` Also Updated to Supabase SELECT

✅ **RESOLVED**

`retrieve()` now executes:
```
from('ai_episodic_events').select('*').eq('organisation_id', params.organisationId)[.eq('session_id', ...)].order('created_at', { ascending: false })
```

No `this.store` reference remains in the class. In-memory array removed entirely.

### SB-005 — Constructor Guard Retained

✅ **RESOLVED**

Constructor changed to `constructor(supabaseClient: SupabaseMinimalClient)` with:
```typescript
if (!supabaseClient) {
  throw new Error('SupabaseClient is required for EpisodicMemoryAdapter');
}
```

Existing test `'constructor throws when no SupabaseClient is provided'` passes GREEN.

### SB-006 — BD-000 User Journey Declaration

✅ **RESOLVED** — declared in session memory and repeated below:

**Write path**:
> Agent invokes `record(entry)` → adapter calls `rpc('set_config', { parameter: 'app.current_organisation_id', value: entry.organisationId, is_local: true })` → adapter executes `from('ai_episodic_events').insert(toRow(entry))` → Supabase enforces RLS policy → row persisted → returns without error.

**Read path**:
> Caller invokes `retrieve({ organisationId, sessionId?, limit? })` → adapter executes `from('ai_episodic_events').select('*').eq('organisation_id', organisationId)[.eq('session_id', sessionId)].order('created_at', { ascending: false })` → Supabase enforces RLS → rows mapped via `fromRow()` → optional limit applied → returns `EpisodicEventEntry[]`.

**Error path**:
> INSERT or SELECT fails → adapter receives `{ error }` → adapter throws → caller receives rejection (no silent swallowing).

### SB-007 — Error Handling: No Silent Swallow of Supabase Errors

✅ **RESOLVED**

Every Supabase call checks `{ error }` and throws if set:
- `rpc('set_config')` error → thrown (test: `'record() throws when the set_config rpc returns an error'`)
- `from(...).insert()` error → thrown (test: `'record() throws when the Supabase INSERT returns an error'`)
- `from(...).select().eq().order()` error → thrown (test: `'retrieve() throws when the Supabase SELECT returns an error'`)

---

## Test Evidence

| Test Suite | Result |
|------------|--------|
| `ai-centre` full suite (320 tests) | **320/320 GREEN** ✅ |

### Key test assertions confirming Supabase wiring:

| Test | Assertion |
|------|-----------|
| `record() writes to Supabase with correct snake_case column mapping` | `mock.rows[0].organisation_id === 'org-001'`, `mock.rows[0].agent_id === 'foreman-v2'`, etc. |
| `record() calls set_config rpc with app.current_organisation_id before INSERT` | `mock.rpcCalls[0].fn === 'set_config'`, `mock.rpcCalls[0].params.value === 'org-rls-test'` |
| `record() throws when the set_config rpc returns an error` | `rejects.toThrow('set_config failed')` |
| `record() throws when the Supabase INSERT returns an error` | `rejects.toThrow('db write failed')` |
| `retrieve() filters by sessionId when provided` | Returns only entries matching `session-A` |
| `retrieve() throws when the Supabase SELECT returns an error` | `rejects.toThrow('db read failed')` |
| `retrieve() returns only entries belonging to the specified organisationId` | `results.every(e => e.organisationId === 'org-001')` |
| `entries recorded contain all required fields` | Asserts `organisationId`, `sessionId`, `agentId`, `eventType`, `capability`, `summary` |

---

## IAA Invocation Request (Re-invocation after REJECTION-PACKAGE)

Builder received REJECTION-PACKAGE from first IAA invocation (2026-04-07) citing carry-forward
CF-001: `Capability.RAG = 'rag'` absent from `ai_episodic_events` CHECK constraint.

### Fix Applied (2026-04-08)

| File | Change |
|------|--------|
| `packages/ai-centre/supabase/migrations/011_ai_episodic_capability_rag.sql` | New migration: DROP old anonymous CHECK, ADD named CHECK with 'rag' included |
| `packages/ai-centre/src/__tests__/schema/gap009-episodic-capability-rag.test.ts` | New schema tests: 5 tests (GAP009-SCH-T-001 through T-005) |

- Test suite: **325/325 GREEN** (32 test files)
- Migration `011` drops `ai_episodic_events_capability_check` and recreates it with all 9 Capability enum values including `'rag'`

**Expected ASSURANCE-TOKEN**: `IAA-session-gap009-wave-gap-009-20260407-PASS`

---

*PREHANDOVER PROOF authored by api-builder v6.2.0 | 2026-04-07 (updated 2026-04-08)*
*Authority: CS2 (Johan Ras / @APGI-cmy)*
