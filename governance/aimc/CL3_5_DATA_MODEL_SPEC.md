# CL-3.5 Data Model Specification — AIMC Data Sources Registry

**Document ID**: CL3.5-SPEC-001  
**Version**: v1.0.0  
**Date**: 2026-03-01  
**Status**: PROPOSED — Awaiting CS2 approval (CP-3.5)  
**Authority**: CS2 CP-3.5  
**Produced By**: governance-liaison-isms-agent v6.2.0 (contract v3.2.0) via foreman-v2-agent v6.2.0 (session-080)  
**Location**: `governance/aimc/CL3_5_DATA_MODEL_SPEC.md`  
**Feeds**: `packages/ai-centre/supabase/migrations/007_ai_data_sources.sql` (schema-builder — pending CP-3.5 approval)

---

## 1. Purpose

This document is the **CP-3.5 entry artifact** — the lightweight data model specification that CS2 must approve before `schema-builder` may create the `007_ai_data_sources.sql` migration. It records the agreed schema design so that CS2 can verify the data model is correct before implementation begins.

**Why this document exists**:

- Wave CL-3.5 (AIMC Data Sources Registry) was created by foreman-v2-agent session-079 to resolve GAP-004 from the LKIAC Deprecation Register (DEP-008: `DataSourcesManagement.tsx` — no confirmed AIMC equivalent).
- The legacy `DataSourcesManagement.tsx` is backed by four Edge Functions (`connect-data-source`, `sync-data-source`, `query-data-source`, `test-data-sources-api`) that reference an `ai_data_sources` concept not yet present in the AIMC Supabase schema.
- Before `schema-builder` produces the migration and `api-builder` begins Edge Function migration, CS2 must confirm the data model meets AIMC architectural conventions.

**Authority chain**:
- `governance/aimc/LKIAC_CL3_D2_GAP_RESOLUTION.md` v1.0.0 (foreman-v2-agent session-079) — source of CL-3.5 wave definition
- `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` (CL-3.5 wave section, CP-3.5 checkpoint)
- CS2 sign-off on this document → unlocks `schema-builder` to produce `007_ai_data_sources.sql`

---

## 2. Migration Plan

| Field | Value |
|---|---|
| Migration filename | `007_ai_data_sources.sql` |
| Migration path | `packages/ai-centre/supabase/migrations/` |
| Sequence position | Next in AIMC migration sequence — follows `006_ai_knowledge_metadata.sql` |
| Responsible agent | `schema-builder` (after CP-3.5 approval) |
| Prerequisite | CS2 approval of this spec document (CP-3.5) |

**Existing migration sequence** (confirmed from repository):

| File | Description |
|---|---|
| `001_ai_memory.sql` | AI memory table |
| `002_ai_telemetry.sql` | AI telemetry table |
| `003_ai_knowledge.sql` | AI knowledge table (RLS pattern reference) |
| `004_ai_episodic_memory.sql` | Episodic memory table |
| `005_ai_feedback_pipeline.sql` | Feedback pipeline table |
| `006_ai_knowledge_metadata.sql` | Knowledge metadata table |
| `007_ai_data_sources.sql` | **→ This spec. To be created by schema-builder post CP-3.5.** |

---

## 3. Table Definition — `ai_data_sources`

**Table name**: `ai_data_sources`  
**Schema**: `public`  
**Purpose**: Registry of external data sources connected to the AIMC, with connection configuration, sync scheduling, and status tracking.

### 3.1 Columns

| Column | Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY | `gen_random_uuid()` | Unique identifier for the data source record |
| `organisation_id` | `TEXT` | NOT NULL | — | Organisation scope — British spelling per AIMC convention (matches `ai_knowledge.organisation_id` in `003_ai_knowledge.sql`) |
| `source_name` | `TEXT` | NOT NULL | — | Human-readable display name for the data source |
| `source_type` | `TEXT` | NOT NULL, CHECK constraint | — | Source category — enum-constrained (see §3.2) |
| `status` | `TEXT` | NOT NULL, CHECK constraint | `'inactive'` | Operational status of the data source — enum-constrained (see §3.2) |
| `connection_config` | `JSONB` | NOT NULL | `'{}'` | Source-specific connection parameters (endpoint URL, API base, credentials reference, etc.) |
| `credentials_encrypted` | `TEXT` | nullable | — | AES-256-GCM encrypted credential blob; nullable (legacy encryption pattern) |
| `last_synced_at` | `TIMESTAMPTZ` | nullable | — | Timestamp of most recent completed sync; set by `sync-data-source` Edge Function |
| `sync_frequency_minutes` | `INTEGER` | — | `60` | Configurable sync interval in minutes |
| `is_active` | `BOOLEAN` | NOT NULL | `false` | Activation flag; separate from `status` to allow efficient filter queries on active sources |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | Record last-updated timestamp; should be maintained by trigger or application layer |
| `created_by` | `UUID` | nullable | — | Foreign key reference to `auth.users(id)`; nullable for system-created sources |

**Total columns**: 13

### 3.2 Enum Constraints (CHECK Clauses)

Two columns are enum-constrained via CHECK clauses. The permitted values derive from the legacy `DataSourcesManagement.tsx` implementation and operational requirements:

**`source_type` constraint**:

| Value | Description |
|---|---|
| `supabase` | Direct Supabase database connection within the AIMC schema |
| `google_drive` | Google Drive document store integration |
| `sharepoint` | Microsoft SharePoint document library integration |
| `api` | Generic REST API source (custom endpoint) |

**`status` constraint**:

| Value | Description |
|---|---|
| `active` | Source is connected and sync is operating normally |
| `inactive` | Source is registered but not currently syncing (default on creation) |
| `syncing` | Sync job is currently in progress (set by `sync-data-source` Edge Function) |
| `error` | Most recent sync attempt failed; error details stored in `connection_config` or via telemetry |

### 3.3 Design Notes

- **`organisation_id` spelling**: British spelling (`organisation_id`) is the established AIMC convention. All AIMC tables use this spelling. Do not use `organization_id`.
- **`is_active` vs `status`**: Both exist by design. `status` tracks operational sync state; `is_active` is a simple boolean activation flag for efficient WHERE-clause filtering in queries that do not need full status semantics.
- **`connection_config` JSONB**: Intentionally flexible. The shape of this object varies by `source_type`. Schema validation should be performed at the application/Edge Function layer, not in the database constraint.
- **`credentials_encrypted`**: Nullable to allow sources with no stored credentials (e.g., sources using service-account JWT handled externally). The AES-256-GCM pattern aligns with the legacy credential handling in `DataSourcesManagement.tsx`.
- **`updated_at`**: Should be maintained via a `BEFORE UPDATE` trigger or explicitly set by the Edge Functions on every write. `schema-builder` must implement the trigger pattern.

---

## 4. Row Level Security (RLS) Design

RLS must be enabled on `ai_data_sources`. The RLS pattern follows the established convention from `003_ai_knowledge.sql`.

### 4.1 Enable RLS

`schema-builder` must enable Row Level Security on `ai_data_sources` as the first step after creating the table.

### 4.2 SELECT Policy — Organisation Isolation

**Policy name**: `ai_data_sources_org_isolation`  
**Operation**: SELECT  
**Principle**: Users may only read data sources belonging to their organisation.  
**Pattern** (matches `003_ai_knowledge.sql` `ai_knowledge_org_isolation` policy):

The USING clause must evaluate `current_setting('app.current_organisation_id', true)` and compare it to the row's `organisation_id` column. The `true` second argument suppresses the error when the setting is not defined (returns NULL instead — prevents accidental cross-org reads).

> **Convention note**: This is the established AIMC pattern from `003_ai_knowledge.sql` and
> must be replicated exactly by `schema-builder`.

### 4.3 INSERT / UPDATE / DELETE Policies — Service Role Only

**Principle**: Data source administration (create, configure, delete sources) is exclusively an admin operation executed via Edge Functions under the `service_role` key. Direct row writes by authenticated users are not permitted.

**Operations**: INSERT, UPDATE, DELETE  
**Grant**: `service_role` only  
**Rationale**: Edge Functions (`connect-data-source`, `sync-data-source`) hold the Supabase service role key and manage all write operations. This prevents direct data source manipulation by end-users via the Supabase client.

> `schema-builder` must implement these policies using the appropriate Supabase RLS policy syntax
> with a `TO service_role` role binding or equivalent `WITH CHECK` clause.

---

## 5. Indexes

Three indexes are required for `ai_data_sources`:

| Index Name | Column(s) | Purpose |
|---|---|---|
| `idx_ai_data_sources_org` | `(organisation_id)` | Primary filter — all queries are scoped to organisation |
| `idx_ai_data_sources_type` | `(source_type)` | Filter by source type (e.g., list all `supabase` sources) |
| `idx_ai_data_sources_status` | `(status)` | Filter by status (e.g., list all `active` or `error` sources) |

> **Note**: A composite index `(organisation_id, is_active)` may be added by `schema-builder` if
> query patterns from the Edge Functions warrant it. This spec requires only the three indexes above
> as the minimum set.

---

## 6. Edge Function Interface Summary

> **SPEC ONLY — This section documents the interface contract for the four Edge Functions that will
> be migrated during CL-3.5-D3. It is NOT an implementation. `api-builder` will implement these
> functions in `packages/ai-centre/supabase/functions/` after CP-3.5 approval.**

All four Edge Functions are currently present in the legacy `apps/maturion-maturity-legacy/` code
and are referenced by `DataSourcesManagement.tsx`. They must be migrated to the AIMC Edge
Functions directory with full test coverage (CL-3.5-D1 RED gate before migration begins).

| Function Name | Method | Request Payload | Response | Description |
|---|---|---|---|---|
| `connect-data-source` | POST | `{ source_name, source_type, connection_config, credentials? }` | `{ id, status }` | Validates connection configuration, creates or updates `ai_data_sources` record, returns the record ID and initial status |
| `sync-data-source` | POST | `{ source_id }` | `{ job_id }` | Triggers a sync job for the specified source, updates the source `status` to `'syncing'`, returns a job identifier for status polling |
| `query-data-source` | POST | `{ source_id, query }` | `{ results }` | Executes a query against the connected external source (proxied via the Edge Function), returns structured results |
| `test-data-sources-api` | GET or POST | (optional filter params) | `{ sources: [{ id, status, last_tested }] }` | Health check endpoint — tests API connectivity for one or all configured sources, returns per-source connectivity status |

**Access pattern**: All four functions are called with the Supabase `service_role` key (admin operations). The `query-data-source` function may also be called with the anon/user key subject to RLS — `api-builder` must clarify the access model during implementation.

---

## 7. Constraints and Check Clauses Summary

| Constraint | Column | Rule |
|---|---|---|
| `chk_ai_data_sources_type` | `source_type` | `source_type IN ('supabase', 'google_drive', 'sharepoint', 'api')` |
| `chk_ai_data_sources_status` | `status` | `status IN ('active', 'inactive', 'syncing', 'error')` |
| `ai_data_sources_pkey` | `id` | PRIMARY KEY |
| FK to `auth.users` | `created_by` | REFERENCES `auth.users(id)` ON DELETE SET NULL (nullable) |

> **Extensibility note**: If additional `source_type` values are required in future (e.g., `s3`,
> `notion`), the CHECK constraint must be altered via a new migration. `schema-builder` should
> document this in the migration comments.

---

## 8. CP-3.5 Approval Gate

**This section is the formal CS2 precondition record for Wave CL-3.5.**

Per `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` (§10, CP-3.5):

> **CP-3.5**: CS2 approves the `ai_data_sources` schema specification before `schema-builder`
> builds the migration.

**Precondition status**: PROPOSED — awaiting CS2 review and sign-off.

**What CS2 is approving**:
1. The `ai_data_sources` table column definitions (§3.1)
2. The enum constraint values for `source_type` and `status` (§3.2)
3. The RLS design (organisation isolation SELECT; service_role-only writes) (§4)
4. The index set (§5)
5. The Edge Function interface summary (§6) — confirming the four functions are in scope for CL-3.5-D3

**What CS2 is NOT approving at this stage**:
- The actual SQL in `007_ai_data_sources.sql` (produced by `schema-builder` after this approval)
- The Edge Function implementations (produced by `api-builder` after `qa-builder` RED gate)
- The admin UI/panel (produced by `ui-builder` — CL-3.5-D4)

**Unlock action**: CS2 approves this document (comment on the kick-off issue or separate CS2 approval issue) → foreman-v2-agent authorises `qa-builder` to begin CL-3.5-D1 RED gate → `schema-builder` produces `007_ai_data_sources.sql` only after RED gate is in place.

---

## 9. Audit Trail

| Date | Version | Action | Actor |
|---|---|---|---|
| 2026-03-01 | v1.0.0 | Document produced | governance-liaison-isms-agent v6.2.0 (contract v3.2.0) via foreman-v2-agent v6.2.0 session-080 |

---

*Authority: CS2 (Johan Ras / @APGI-cmy) | Programme: LKIAC + AIMC | Wave: CL-3.5 | Checkpoint: CP-3.5*  
*Source: `governance/aimc/LKIAC_CL3_D2_GAP_RESOLUTION.md` v1.0.0 (GAP-004 / DEP-008)*  
*Location: `governance/aimc/CL3_5_DATA_MODEL_SPEC.md`*
