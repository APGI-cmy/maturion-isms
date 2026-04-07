# CL-11-D4 Audit Report — Episodic Memory Write Path

**Audit ID**: CL-11-D4
**Gap Reference**: GAP-009
**Traceability Token**: T-G-003
**Programme**: AIMC/LKIAC — CL-11 completion
**Commissioned by**: foreman-v2-agent | Wave: mmm-mat-harvest-20260405
**CS2 Authorization**: maturion-isms#1221 (2026-04-05)
**Auditor**: qa-builder v6.2.0
**Date**: 2026-04-07
**Scope**: Audit-only — no code changes

---

## 1. Check Definition

**Requirement (T-G-003)**: Records must be confirmed written to `ai_episodic_events` in the
production flow via `EpisodicMemoryAdapter`.

**Expected schema columns**: `event_type`, `payload`, `created_at`, `org_id`, `session_id`

---

## 2. EpisodicMemoryAdapter — Location and Write Path

**File**: `packages/ai-centre/src/memory/EpisodicMemoryAdapter.ts`
**Interface**: Implements `IEpisodicMemoryAdapter` from `packages/ai-centre/src/types/index.ts`
**Methods**: `record(entry: EpisodicEventEntry): Promise<void>` and
`retrieve(params): Promise<EpisodicEventEntry[]>` — append-only contract

### 2.1 Current `record()` Implementation

```typescript
export class EpisodicMemoryAdapter implements IEpisodicMemoryAdapter {
  private readonly store: EpisodicEventEntry[] = [];

  constructor(supabaseClient?: any) {
    if (arguments.length > 0 && supabaseClient === undefined) {
      throw new Error('SupabaseClient is required for EpisodicMemoryAdapter');
    }
  }

  async record(entry: EpisodicEventEntry): Promise<void> {
    this.store.push({ ...entry });   // ← writes to in-memory array ONLY
  }
  // ...
}
```

**Finding**: `record()` pushes to `this.store` (an in-memory `EpisodicEventEntry[]` array).
There are **no Supabase client calls** in this implementation. Records are NOT persisted to
the `ai_episodic_events` database table in production.

### 2.2 Explicit Deferral Notice in Source

The file header explicitly documents this as a deferred implementation:

```
/**
 * EpisodicMemoryAdapter — Wave 9.3 in-memory foundation
 *
 * Supabase wiring is EXPLICITLY DEFERRED to a future wave.
 * The AAWP wave plan records this deferral:
 *   Wave 9.3 scope: in-memory implementation, correct interface, full test coverage.
 *   Future wave scope: replace in-memory store with real Supabase client writing
 *     to the ai_episodic_events table (see supabase/migrations/004_ai_episodic_memory.sql)
 *     with organisation_id tenant isolation enforced at the query layer (GRS-009).
 *
 * TODO(Future): Replace in-memory `store` array and all methods — record() and
 * retrieve() — with Supabase client calls to the `ai_episodic_events` table.
 */
```

This confirms the in-memory state is **by design for Wave 9.3** and that Supabase wiring
was acknowledged as deferred.

---

## 3. `ai_episodic_events` Table Schema — Confirmed

**Migration file**: `packages/ai-centre/supabase/migrations/004_ai_episodic_memory.sql`

Actual schema:

```sql
CREATE TABLE IF NOT EXISTS ai_episodic_events (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id TEXT        NOT NULL,
  session_id      TEXT,
  user_id         TEXT,
  agent_id        TEXT,
  event_type      TEXT        NOT NULL,
  capability      TEXT        NOT NULL,
  summary         TEXT,
  full_context    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  redacted_at      TIMESTAMPTZ,
  redacted_by      TEXT,
  redaction_reason TEXT
);
```

**RLS policies**: INSERT and SELECT scoped to `organisation_id = current_setting('app.current_organisation_id', true)`
**Append-only enforcement**: SQL rules `ai_episodic_events_no_update` and
`ai_episodic_events_no_delete` prevent UPDATE and DELETE.

---

## 4. Schema Discrepancy Analysis

The issue brief specified expected columns: `event_type, payload, created_at, org_id, session_id`

| Expected Column | Actual Column | Match |
|-----------------|---------------|-------|
| `event_type`    | `event_type`  | ✅ MATCH |
| `payload`       | NOT PRESENT (uses `summary` + `full_context` instead) | ❌ MISMATCH |
| `created_at`    | `created_at`  | ✅ MATCH |
| `org_id`        | `organisation_id` (not `org_id`) | ❌ MISMATCH (different column name) |
| `session_id`    | `session_id`  | ✅ MATCH |

**Finding F-D4-002**: The `ai_episodic_events` table does not have a `payload` column; the
schema uses `summary` (TEXT) and `full_context` (TEXT) to carry event content. The column for
organisation is named `organisation_id`, not `org_id`. The expected column specification in
the issue brief is inaccurate relative to the actual migration schema.

---

## 5. Test Coverage Assessment

**Test file**: `packages/ai-centre/src/__tests__/memory/EpisodicMemoryAdapter.test.ts`

Tests present:
- `record()` method exists and resolves without error for a valid entry (in-memory)
- `retrieve()` returns only entries for the specified `organisationId` (tenant isolation — in-memory)
- `retrieve()` returns empty array for unknown org
- Adapter must NOT have `delete()` method
- Constructor throws when no SupabaseClient provided

**Critical observation from test file header**:

```
 * ⚠️  WAVE 9.3 API BUILDER MANDATORY REQUIREMENTS:
 *
 * 1. SUPABASE BACKEND REQUIRED — GRS-009 mandates Supabase-backed storage with
 *    organisation-level RLS. An in-memory implementation silently violates tenant
 *    isolation and WILL NOT satisfy GRS-009.
```

The QA-to-Red tests explicitly flag that the in-memory implementation violates GRS-009
(Supabase-backed storage requirement). However, the tests themselves test against the
in-memory implementation (no Supabase client injected in test setup).

---

## 6. Findings

### F-D4-001 (FAIL — CRITICAL): Write path NOT connected to `ai_episodic_events`

`EpisodicMemoryAdapter.record()` writes to an in-memory array (`this.store`), not to the
`ai_episodic_events` Supabase table. The source file explicitly marks Supabase wiring as
deferred from Wave 9.3. In production, records submitted via `record()` are lost on process
restart and are never persisted to the database.

**Evidence**:
- Source: `packages/ai-centre/src/memory/EpisodicMemoryAdapter.ts` — `record()` body is
  `this.store.push({ ...entry })` with no Supabase call
- File header: "Supabase wiring is EXPLICITLY DEFERRED to a future wave"
- No Supabase client usage in the class despite constructor accepting one

### F-D4-002 (INFORMATIONAL): Schema column mismatch vs. issue brief

The actual `ai_episodic_events` migration has no `payload` column and uses `organisation_id`
(not `org_id`). The issue brief's expected column list is inaccurate. The table schema itself
is sound and purpose-fit; the discrepancy is in the audit brief specification, not in the
database design.

### F-D4-003 (INFORMATIONAL): QA-to-Red tests acknowledge GRS-009 violation

The RED gate test file explicitly states the in-memory implementation violates GRS-009. The
tests have been passing (GREEN) against the in-memory implementation. This means the tests
do NOT correctly enforce the Supabase backend requirement — they are passing against an
implementation that violates the specification they were written to validate.

---

## 7. Verdict

| Check | Result |
|-------|--------|
| `EpisodicMemoryAdapter` located | ✅ `packages/ai-centre/src/memory/EpisodicMemoryAdapter.ts` |
| Write path traced | ✅ `record()` → `this.store.push(...)` (in-memory array) |
| Records written to `ai_episodic_events` | ❌ NOT WRITTEN — in-memory only |
| `ai_episodic_events` schema confirmed | ✅ Migration exists at `004_ai_episodic_memory.sql` |
| Schema columns match brief spec | ⚠️ PARTIAL — no `payload`, no `org_id` (uses `organisation_id`) |
| Supabase wiring active | ❌ Explicitly deferred |
| Existing test coverage | ✅ Tests exist but test in-memory behaviour only |

**OVERALL VERDICT: FAIL**

Records are NOT written to `ai_episodic_events` in the production flow.
`EpisodicMemoryAdapter.record()` persists only to an in-memory array. The Supabase wiring
has been explicitly deferred since Wave 9.3 and has not been completed. GAP-009 is confirmed
open. Escalated to Foreman per audit-only mandate.

---

## 8. Escalation Record

**F-D4-001 — FAIL** escalated to foreman-v2-agent as per audit-only mandate:

> `EpisodicMemoryAdapter.record()` writes only to an in-memory array; no Supabase INSERT
> is executed. GAP-009 is confirmed OPEN. A remediation wave must be commissioned to:
>
> 1. Replace the in-memory `this.store` in `EpisodicMemoryAdapter.record()` with a
>    Supabase INSERT to `ai_episodic_events` using the injected `supabaseClient`
> 2. Add the `app.current_organisation_id` setting call before insert (RLS requirement)
> 3. Ensure the mandatory SupabaseClient constructor guard is retained
> 4. Update QA-to-Red tests to inject a real or mock Supabase client and assert DB writes
>
> References: GRS-009 | APS §7.6 | AAD §9.4 | migration `004_ai_episodic_memory.sql`

---

*Produced by qa-builder v6.2.0 | Wave mmm-mat-harvest-20260405 | Authority: CS2 maturion-isms#1221*
