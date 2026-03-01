# LKIAC Wave 2 — Legacy Knowledge Inventory

**Document ID**: CL-2-D1  
**Wave**: CL-2 (LKIAC Wave 2 — Legacy Knowledge Inventory and Domain Tagging Plan)  
**Status**: DRAFT — Awaiting CS2 Review (CP-2)  
**Version**: 1.0.0  
**Date**: 2026-03-01  
**Produced By**: mat-specialist (delegated via foreman-v2-agent session-078, Wave CL-2)  
**Triggering Issue**: [maturion-isms#[CL-2 issue]](https://github.com/APGI-cmy/maturion-isms/issues)  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Source Reference**: LKIAC-001 §5 Wave 2; Combined Plan §CL-2  
**Legacy Supabase Project**: `dmhlxhatogrrrvuruayv`

---

## 1. Inventory Scope

This document records the full schema inventory of all legacy knowledge tables in the Maturion Maturity legacy Supabase project (`dmhlxhatogrrrvuruayv`). The inventory is derived from migration files in `apps/maturion-maturity-legacy/supabase/migrations.bak.20250926-095649/` as no live database access is available at document authoring time.

> **Live Count Note**: Actual row counts require live database access via the Supabase service role key for project `dmhlxhatogrrrvuruayv`. Row count estimates are annotated below. CS2 should validate live counts before authorising CL-5 (migration wave).

---

## 2. Legacy Knowledge Tables

The legacy project contains four knowledge-bearing tables (plus one deprecated predecessor). They are listed in order of priority for migration:

### 2.1 Primary Knowledge Table: `ai_document_chunks`

**Role**: Primary vector knowledge store. Contains chunked document content with embeddings. This is the main migration target for LKIAC Wave 3 (CL-5/CL-6).

**Status**: ACTIVE — actively written to and queried by legacy application.

**Schema** (as reconstructed from migrations):

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `UUID` | NOT NULL | Primary key |
| `document_id` | `UUID` | NOT NULL | FK → `ai_documents.id` ON DELETE CASCADE |
| `organization_id` | `UUID` | NOT NULL | Organisation isolation key |
| `chunk_index` | `INTEGER` | NOT NULL | Positional index of chunk within document |
| `content` | `TEXT` | NOT NULL | Chunk text content |
| `content_hash` | `TEXT` | NOT NULL | SHA hash for deduplication |
| `embedding` | `VECTOR(1536)` | NULLABLE | OpenAI `text-embedding-3-small` embedding |
| `metadata` | `JSONB` | DEFAULT `{}` | Flexible metadata payload |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | Creation timestamp |
| `tokens` | `INTEGER` | NULLABLE | Token count (added migration 20250915) |
| `page` | `INTEGER` | NULLABLE | Source page number |
| `section` | `TEXT` | NULLABLE | Source section label |
| `equipment_slugs` | `TEXT[]` | NULLABLE | Equipment tag array |
| `stage` | `TEXT` | NULLABLE | Lifecycle stage |
| `layer` | `SMALLINT` | NULLABLE | Hierarchy layer (1=org profile, 2=knowledge pack, 3=training) |
| `tags` | `TEXT[]` | NULLABLE | Free-form tag array |

**Indexes**:
- `ai_chunks_org_idx` on `(organization_id)`
- `ai_chunks_layer_idx` on `(layer)` WHERE layer IS NOT NULL
- `ai_chunks_stage_idx` on `(stage)` WHERE stage IS NOT NULL
- ivfflat vector index on `embedding` (cosine similarity)

**RLS**: Enabled. Organisation-scoped via `organization_id` membership check.

**Estimated Row Count**: Unknown — requires live query. May range from hundreds to thousands depending on number of organisations onboarded to the legacy app. CS2 to confirm.

---

### 2.2 Parent Table: `ai_documents`

**Role**: Document registry — parent to `ai_document_chunks`. Tracks uploaded files and their processing state.

**Status**: ACTIVE.

**Schema** (as reconstructed from migrations, including all amendments):

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `UUID` | NOT NULL | Primary key |
| `organization_id` | `UUID` | NOT NULL | Organisation isolation key |
| `file_name` | `TEXT` | NOT NULL | Original filename |
| `file_path` | `TEXT` | NOT NULL | Storage path |
| `file_size` | `BIGINT` | NOT NULL | File size in bytes |
| `mime_type` | `TEXT` | NOT NULL | MIME type |
| `document_type` | `TEXT` | NOT NULL | Primary classification label (see §3.1 for all values) |
| `processing_status` | `TEXT` | NOT NULL | `pending` \| `processing` \| `completed` \| `failed` |
| `total_chunks` | `INTEGER` | DEFAULT 0 | Count of child chunks |
| `metadata` | `JSONB` | DEFAULT `{}` | Flexible metadata |
| `uploaded_by` | `UUID` | NOT NULL | Uploading user |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | Last update timestamp |
| `processed_at` | `TIMESTAMPTZ` | NULLABLE | Processing completion timestamp |
| `domain` | `TEXT` | NULLABLE | Domain tag (added migration 20250717) |
| `title` | `TEXT` | NULLABLE | Display title |
| `doc_type` | `TEXT` | NULLABLE | Secondary type classification (added migration 20250915) |
| `layer` | `SMALLINT` | NULLABLE | Knowledge hierarchy layer |
| `stage` | `TEXT` | NULLABLE | Lifecycle stage |
| `source` | `TEXT` | DEFAULT `upload` | Ingestion source (`upload` \| `crawl`) |
| `bucket_id` | `TEXT` | NULLABLE | Storage bucket ID |
| `object_path` | `TEXT` | NULLABLE | Storage object path |
| `size_bytes` | `BIGINT` | NULLABLE | Alternate size column |
| `error` | `TEXT` | NULLABLE | Processing error message |

**`document_type` constraint** (final state after all migrations):
```sql
CHECK (document_type IN (
  'maturity_model',
  'sector_context',
  'scoring_logic',
  'sop_template',
  'general',
  'mps_document',
  'iso_alignment',
  'assessment_framework_component'
))
```

**`doc_type` values** (derived from migration 20250915 UPDATE logic):
- `organization_profile`
- `diamond_knowledge_pack`
- `web_crawl`
- `training_slide`
- `general`

**Indexes**: `ai_docs_org_idx`, `ai_docs_stage_idx`, `ai_docs_layer_idx`, `ai_docs_doc_type_idx`, `ai_docs_processing_status_idx`, `ai_docs_metadata_gin` (GIN on metadata JSONB).

**Estimated Row Count**: Unknown — requires live query. CS2 to confirm.

---

### 2.3 Web Crawl Table: `org_page_chunks`

**Role**: Chunked content from organisation domain web crawls. Secondary knowledge source.

**Status**: ACTIVE — populated by `org_ingest_jobs` background workers.

**Schema**:

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `UUID` | NOT NULL | Primary key |
| `org_id` | `UUID` | NOT NULL | Organisation isolation key |
| `page_id` | `UUID` | NOT NULL | FK → `org_pages.id` ON DELETE CASCADE |
| `chunk_idx` | `INTEGER` | NOT NULL | Positional index |
| `text` | `TEXT` | NOT NULL | Chunk text |
| `tokens` | `INTEGER` | NULLABLE | Token count |
| `embedding` | `VECTOR(1536)` | NULLABLE | OpenAI ada-002 embedding |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | Creation timestamp |

**Unique constraint**: `(page_id, chunk_idx)`.

**Parent tables**: `org_pages` (crawled page records), `org_domains` (domain crawl configuration), `org_ingest_jobs` (job tracking).

**Estimated Row Count**: Unknown. Depends on crawl depth and org domain footprint.

**Migration note**: These chunks carry no `document_type` or `doc_type` label — they are classified exclusively by their parent `org_pages.domain` and `org_pages.url`. Tagging plan must account for this (see domain mapping document §5).

---

### 2.4 Deprecated Table: `criteria_chunks`

**Role**: Original vector knowledge store predating `ai_document_chunks`. Replaced during migration `criteria_chunks_to_ai_document_chunks` (migration 20250730).

**Status**: DEPRECATED — preserved for fallback/debug only. All production code uses `ai_document_chunks`.

**Migration status**: `completed` (recorded in `migration_status` table).

**Comment on table** (per migration):
> "DEPRECATED: This table has been replaced by ai_document_chunks. Use ai_document_chunks for all new development. This table is preserved for fallback/debug purposes only."

**Action required**: Verify whether any residual rows exist in `criteria_chunks` that were not migrated to `ai_document_chunks`. If rows exist, they must be included in the CL-5 migration scope.

---

## 3. Label Distribution

### 3.1 `document_type` — Primary Label Set

All `ai_documents` rows carry exactly one of the following `document_type` values:

| `document_type` Label | Introduced | Description (from codebase context) | Estimated Volume |
|---|---|---|---|
| `maturity_model` | 2025-07-17 (initial) | Maturion LDCS maturity model content | **Likely HIGH** — core use case |
| `sector_context` | 2025-07-17 (initial) | Industry sector context documents | **MEDIUM** |
| `scoring_logic` | 2025-07-17 (initial) | Scoring algorithm and logic documents | **LOW** — internal tooling |
| `sop_template` | 2025-07-17 (initial) | Standard Operating Procedure templates | **MEDIUM** |
| `general` | 2025-07-17 (initial) | Generic/uncategorised documents | **HIGH** — default fallback |
| `mps_document` | 2025-07-17 (amendment) | Maturity Practice Statement documents | **HIGH** — core use case |
| `iso_alignment` | 2025-07-17 (amendment) | ISO standard alignment content | **MEDIUM** |
| `assessment_framework_component` | 2025-07-17 (amendment) | Assessment framework building blocks | **MEDIUM** |

> **Live count required**: Exact distribution by `document_type` must be retrieved via SQL:
> ```sql
> SELECT document_type, COUNT(*) as doc_count, SUM(total_chunks) as total_chunks
> FROM ai_documents
> GROUP BY document_type
> ORDER BY doc_count DESC;
> ```

### 3.2 `doc_type` — Secondary Label Set (added 2025-09-15)

A secondary `doc_type` column was added to `ai_documents` in migration `20250915110358`. It provides finer classification, derived via pattern matching on filenames:

| `doc_type` Label | Derivation Rule | Description |
|---|---|---|
| `organization_profile` | filename/title contains "organization profile" | Organisation profile document |
| `diamond_knowledge_pack` | filename/title contains "diamond knowledge" | Diamond industry knowledge pack |
| `web_crawl` | `document_type = 'web_crawl'` | Web-crawled content |
| `training_slide` | `.ppt%` or `powerpoint` MIME | Training presentation |
| `general` | fallback | Unclassified |

> **Note**: `doc_type` may be NULL for rows created before migration 20250915. The UPDATE in that migration populated `doc_type` for existing rows, but NULL safety should be confirmed.

### 3.3 `source` — Ingestion Source Label

| `source` Value | Meaning |
|---|---|
| `upload` | User-uploaded document (default) |
| `crawl` | Ingested via web crawl pipeline |

### 3.4 `tags` — Free-Form Tag Array

`ai_document_chunks.tags` is a `TEXT[]` column with no enumerated constraints. Actual tag values in the live database are unknown. CS2 must authorise a live query to enumerate distinct tag values before the domain mapping in CL-2-D2 can be considered exhaustive.

> **SQL to enumerate tags**:
> ```sql
> SELECT DISTINCT UNNEST(tags) as tag, COUNT(*) as chunk_count
> FROM ai_document_chunks
> WHERE tags IS NOT NULL
> GROUP BY tag
> ORDER BY chunk_count DESC;
> ```

### 3.5 `org_page_chunks` — No Label Field

Web crawl chunks carry no classification label. They are implicitly tagged by their parent page URL domain. A mapping strategy is proposed in CL-2-D2 §5 (domain tag map companion document).

---

## 4. Schema Summary

| Table | Row Count (live required) | Classification Column(s) | Embedding | Migration Target |
|---|---|---|---|---|
| `ai_document_chunks` | ❓ (live query required) | `tags TEXT[]`, `layer`, `stage` | `embedding VECTOR(1536)` | ✅ CL-5 primary target |
| `ai_documents` | ❓ (live query required) | `document_type`, `doc_type`, `source`, `domain` | N/A (parent record only) | ✅ CL-5 (as parent metadata) |
| `org_page_chunks` | ❓ (live query required) | None (URL-based only) | `embedding VECTOR(1536)` | ⚠️ CL-5 scope: CS2 decision required |
| `criteria_chunks` | ❓ (deprecated — residual rows?) | Unknown | Unknown | ⚠️ Verify residual rows |

---

## 5. Prerequisite Live Database Queries

The following queries must be executed against project `dmhlxhatogrrrvuruayv` by CS2 or a delegated operator before CP-2 sign-off:

```sql
-- Q1: Total chunk count and embedding coverage
SELECT
  COUNT(*) AS total_chunks,
  COUNT(embedding) AS chunks_with_embeddings,
  COUNT(*) - COUNT(embedding) AS chunks_without_embeddings,
  ROUND(100.0 * COUNT(embedding) / NULLIF(COUNT(*), 0), 2) AS embedding_pct
FROM ai_document_chunks;

-- Q2: Document count by document_type
SELECT document_type, COUNT(*) AS doc_count, SUM(total_chunks) AS total_chunks
FROM ai_documents
GROUP BY document_type ORDER BY doc_count DESC;

-- Q3: Document count by doc_type
SELECT doc_type, COUNT(*) AS doc_count
FROM ai_documents
GROUP BY doc_type ORDER BY doc_count DESC;

-- Q4: Distinct tags in ai_document_chunks
SELECT DISTINCT UNNEST(tags) AS tag, COUNT(*) AS chunk_count
FROM ai_document_chunks WHERE tags IS NOT NULL
GROUP BY tag ORDER BY chunk_count DESC;

-- Q5: Web crawl chunk count
SELECT COUNT(*) AS total_page_chunks FROM org_page_chunks;

-- Q6: Residual rows in deprecated criteria_chunks
SELECT COUNT(*) AS residual_rows FROM criteria_chunks;

-- Q7: Chunks per organisation
SELECT organisation_id, COUNT(*) AS chunk_count
FROM ai_document_chunks
GROUP BY organisation_id ORDER BY chunk_count DESC;
```

---

## 6. Inventory Status

| Check | Status |
|---|---|
| Schema documented from migration files | ✅ COMPLETE |
| Legacy label set enumerated | ✅ COMPLETE (see §3) |
| Live row counts obtained | ❌ PENDING — requires live DB access |
| Distinct `tags` values enumerated | ❌ PENDING — requires live DB access |
| `criteria_chunks` residual rows confirmed | ❌ PENDING — requires live DB access |
| `org_page_chunks` migration scope decided | ❌ PENDING — CS2 decision required |

---

## 7. Handover

**Deliverable**: CL-2-D1 ✅  
**Next step**: Domain tagging mapping document (CL-2-D2) is produced in `LKIAC-W2-domain-tag-map-20260301.md`.  
**CS2 Checkpoint (CP-2)**: CS2 must review and sign off both CL-2-D1 and CL-2-D2 before CL-5 (re-ingestion wave) may begin.  
**Escalation**: Live database queries (§5) require CS2-authorised DB access. If access cannot be delegated, CS2 should run queries directly.

---

*End of CL-2-D1 — Legacy Knowledge Inventory*
