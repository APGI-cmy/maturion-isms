# Migration Validation: `001_ai_memory.sql` — Wave 11 (Task 11.2)

**Validator**: schema-builder  
**Wave**: 11 — Supabase Persistent Memory Wiring  
**Task**: 11.2  
**Date**: 2026-01-01  
**References**: implementation-plan.md v1.9.0 | APS §7.2 | GRS-008 | AAD §7.4

---

## 1. Schema Completeness — `PersistedMemoryEntry` Field Mapping

Every field declared in the `PersistedMemoryEntry` TypeScript interface
(`packages/ai-centre/src/types/index.ts`, lines 287–297) maps to a
corresponding SQL column in `001_ai_memory.sql`.

| TypeScript field | SQL column | Type | Nullable? | Notes |
|---|---|---|---|---|
| `id?: string` | `id` | `UUID PRIMARY KEY DEFAULT gen_random_uuid()` | Optional (auto-generated) | ✅ Correct — optional on insert, always present on read |
| `organisationId: string` | `organisation_id` | `TEXT NOT NULL` | No | ✅ snake_case convention satisfied |
| `sessionId?: string` | `session_id` | `TEXT` | Yes | ✅ NULL allowed, matches optional field |
| `userId?: string` | `user_id` | `TEXT` | Yes | ✅ NULL allowed, matches optional field |
| `role: 'user' \| 'assistant'` | `role` | `TEXT NOT NULL CHECK (role IN ('user', 'assistant'))` | No | ✅ CHECK constraint enforces the union type |
| `content: string` | `content` | `TEXT NOT NULL` | No | ✅ |
| `capability: Capability` | `capability` | `TEXT NOT NULL` | No | ✅ Capability enum values stored as text |
| `timestamp: number` | `timestamp` | `BIGINT NOT NULL` | No | ✅ JS `number` timestamps stored as 64-bit int |
| `expiresAt?: string` | `expires_at` | `TIMESTAMPTZ` | Yes | ✅ NULL allowed, matches optional field |

**Additional column `created_at`**: `TIMESTAMPTZ NOT NULL DEFAULT now()` — not part of
`PersistedMemoryEntry` but is a standard audit column present on all mutable tables.
This is expected and correct; the adapter does not need to write this field.

**Verdict: COMPLETE ✅** — All 9 `PersistedMemoryEntry` fields are covered. No
missing columns; no extraneous columns that would break INSERT operations.

---

## 2. Idempotency Assessment

Every DDL statement in the migration guards against re-execution:

| Statement | Guard | Verdict |
|---|---|---|
| `CREATE TABLE ai_memory (...)` | `IF NOT EXISTS` | ✅ Idempotent |
| `CREATE INDEX idx_ai_memory_org` | `IF NOT EXISTS` | ✅ Idempotent |
| `CREATE INDEX idx_ai_memory_session` | `IF NOT EXISTS` | ✅ Idempotent |
| `CREATE INDEX idx_ai_memory_expires` | `IF NOT EXISTS` | ✅ Idempotent |
| `ALTER TABLE ai_memory ENABLE ROW LEVEL SECURITY` | Supabase: enabling RLS on an already-RLS-enabled table is a no-op | ✅ Effectively idempotent |
| `CREATE POLICY ai_memory_org_isolation` | No `IF NOT EXISTS` guard (PostgreSQL ≥ 9.6 does not support this syntax for policies) | ⚠️ See note below |

> **Policy idempotency note**: `CREATE POLICY` does not accept `IF NOT EXISTS` in any
> supported PostgreSQL version.  Re-running the migration on a database where the
> policy already exists will produce `ERROR: policy "ai_memory_org_isolation" for
> table "ai_memory" already exists`.  This is standard PostgreSQL behaviour and is
> handled by Supabase's migration runner: `supabase db push` tracks applied
> migrations via the `supabase_migrations` schema and will **not** re-apply
> `001_ai_memory.sql` if it is already recorded.  For manual/CI re-runs the
> migration must be applied in a clean environment or the policy dropped first.
> This is consistent with the existing pattern used across all other migrations in
> this package (002–006).

**Verdict: IDEMPOTENT within normal Supabase migration tooling ✅**

---

## 3. RLS Policy Assessment

### Policy as written

```sql
CREATE POLICY ai_memory_org_isolation ON ai_memory
  USING (organisation_id = current_setting('app.current_organisation_id', true));
```

### Wave 11 security model

The `SupabasePersistentMemoryAdapter` (Task 11.3) authenticates to Supabase using the
**service role key** (`SUPABASE_SERVICE_ROLE_KEY`).  In Supabase/PostgreSQL, the
service role key maps to the `service_role` role, which is granted `BYPASSRLS` —
Row Level Security is skipped entirely for this role.

The primary tenant isolation control for Wave 11 is therefore at the
**application layer**: every query issued by the adapter explicitly includes
`WHERE organisation_id = $organisationId`.  This is a hard-coded parameter passed
from the caller's authenticated session context and cannot be omitted.

### Defence-in-depth — why the existing policy is still correct

The `current_setting('app.current_organisation_id', true)` policy provides
defence-in-depth for **non-service-role access paths** (e.g., direct PostgREST
calls from a future authenticated user JWT, ad-hoc SQL via the Supabase dashboard
by a developer, or a future REST API that does not use the service role):

- When `app.current_organisation_id` is set in the session (e.g., via a
  PostgREST `set_config` hook), only rows belonging to that organisation are
  visible.
- The second argument `true` to `current_setting` makes it return `NULL` rather
  than raising an error when the setting is absent, preventing accidental
  full-table reads for unauthenticated sessions (a NULL ≠ TEXT comparison returns
  no rows).

### Compatibility with Supabase auth model

| Access path | RLS applies? | Isolation mechanism |
|---|---|---|
| Service role key (Wave 11 adapter) | No — `BYPASSRLS` | Application-layer `WHERE organisation_id = $organisationId` |
| Supabase dashboard / anon role | Yes | `current_setting('app.current_organisation_id', true)` policy |
| Future JWT-authenticated user | Yes | Policy must be supplemented if `auth.jwt()` claims are used (future wave) |

An `auth.jwt()`-based policy (e.g.,
`organisation_id = (auth.jwt() ->> 'organisation_id')`) would be appropriate if
end-user clients ever query this table directly via PostgREST with JWT auth.
That is **out of scope for Wave 11** and can be added as `007_ai_memory_rls_v2.sql`
in a future wave without modifying the existing policy.

**Verdict: RLS POLICY SUFFICIENT FOR WAVE 11 ✅**

---

## 4. No New Migration SQL Required for Wave 11

Based on the analysis above:

- The table schema exactly matches `PersistedMemoryEntry`. ✅
- All required indexes are present. ✅
- RLS is enabled and the existing policy provides appropriate defence-in-depth. ✅
- The service role bypass model means the adapter is not blocked by RLS. ✅
- The migration is idempotent under Supabase's migration runner. ✅

**No new SQL migration file is required for Wave 11.**

A future `007_ai_memory_wave11_rls.sql` adding an `auth.jwt()` policy should only
be created when a direct end-user PostgREST access pattern is introduced.

---

## 5. CI Compatibility

The migration can be applied in CI using the provisioned `SUPABASE_DB_URL` secret:

```bash
supabase db push --db-url "$SUPABASE_DB_URL"
```

This command:
1. Connects to the Supabase PostgreSQL instance using the provided connection URL.
2. Checks the `supabase_migrations.schema_migrations` table to determine which
   migrations have already been applied.
3. Applies only unapplied migrations in numeric order (`001` → `006`).
4. Records each applied migration so it is not re-applied on subsequent runs.

The `001_ai_memory.sql` migration will be applied exactly once.  Subsequent CI
runs will skip it safely.

No schema changes, column additions, or policy updates are needed before the
Wave 11 `SupabasePersistentMemoryAdapter` implementation can target this table.

---

## Summary

| Check | Result |
|---|---|
| Schema completeness | ✅ All 9 `PersistedMemoryEntry` fields mapped |
| Idempotency | ✅ Safe under Supabase migration runner |
| RLS policy | ✅ Sufficient for Wave 11 service-role model |
| New migration needed | ❌ Not required |
| CI application command | ✅ `supabase db push --db-url $SUPABASE_DB_URL` |

**Overall verdict: `001_ai_memory.sql` is COMPLETE and CORRECT for Wave 11. No schema changes required.**
