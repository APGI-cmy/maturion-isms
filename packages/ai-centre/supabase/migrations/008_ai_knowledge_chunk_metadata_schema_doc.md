# Schema Documentation: 008_ai_knowledge_chunk_metadata

**Migration**: `008_ai_knowledge_chunk_metadata.sql`  
**Table**: `ai_knowledge` (amendment)  
**Wave**: DCKIS-SCH-001  
**Authority**: CS2 (@APGI-cmy) via foreman-v2-agent  
**References**: DCKIS-SCH-001, AIMC-P1-upload-arch-review-20260319.md §2.4, system-architecture.md §4.6.3

---

## 1. Columns Added

| Column Name          | Type          | Nullable | Default  | Purpose                                                          |
|----------------------|---------------|----------|----------|------------------------------------------------------------------|
| `chunk_index`        | `INTEGER`     | YES      | —        | 0-based chunk position within source document; required for ordering |
| `chunk_size`         | `INTEGER`     | YES      | `2000`   | Chunk size parameter used during ingestion                       |
| `chunk_overlap`      | `INTEGER`     | YES      | `200`    | Overlap parameter used during ingestion                          |
| `source_document_name` | `TEXT`      | YES      | —        | Original filename stored with every chunk for traceability       |
| `document_id`        | `TEXT`        | YES      | —        | Chunk-to-document linkage for traceability                        |
| `content_hash`       | `TEXT`        | YES      | —        | Deterministic hash for deduplication / Smart Chunk Reuse         |
| `metadata`           | `JSONB`       | YES      | `'{}'::jsonb` | Processing provenance (ingestion params, model info, etc.)       |

All new columns are nullable to preserve backward compatibility with existing rows.

---

## 2. Index Added

| Index Name                       | Column         | Purpose                                      |
|----------------------------------|----------------|----------------------------------------------|
| `idx_ai_knowledge_content_hash`  | `content_hash` | Efficient deduplication lookups (Smart Chunk Reuse) |

---

## 3. RLS Policy Added

| Policy Name                  | Operation | Check Clause                                                           | Purpose                           |
|------------------------------|-----------|------------------------------------------------------------------------|-----------------------------------|
| `ai_knowledge_org_insert`    | INSERT    | `organisation_id = current_setting('app.current_organisation_id', true)` | Enforce org-isolation on writes |

Prior state (from `003_ai_knowledge.sql`): SELECT USING policy only — no INSERT WITH CHECK existed.

---

## 4. Column-by-Column SQL Delta: `document_chunks` → `ai_knowledge` (updated)

This table shows the gap between a typical `document_chunks` table in legacy ingestion pipelines and the updated `ai_knowledge` table after this migration.

```sql
-- LEGACY document_chunks (notional — not a table in this codebase)
CREATE TABLE document_chunks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     TEXT NOT NULL,          -- ← now present in ai_knowledge (gap 1 resolved)
  chunk_index     INTEGER NOT NULL,       -- ← now present in ai_knowledge (§4.6.3)
  chunk_size      INTEGER,                -- ← now present in ai_knowledge (§4.6.3)
  chunk_overlap   INTEGER,                -- ← now present in ai_knowledge (§4.6.3)
  source_document_name TEXT,             -- ← now present in ai_knowledge (§4.6.3)
  content         TEXT NOT NULL,
  content_hash    TEXT,                  -- ← now present in ai_knowledge (gap 3 resolved)
  metadata        JSONB DEFAULT '{}'::jsonb,    -- ← now present in ai_knowledge (gap 4 resolved)
  organisation_id TEXT NOT NULL,
  embedding       vector(1536),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- UPDATED ai_knowledge (after 008 migration)
-- All document_chunks parity columns now exist:
ALTER TABLE ai_knowledge
  ADD COLUMN IF NOT EXISTS chunk_index            INTEGER,
  ADD COLUMN IF NOT EXISTS chunk_size             INTEGER DEFAULT 2000,
  ADD COLUMN IF NOT EXISTS chunk_overlap          INTEGER DEFAULT 200,
  ADD COLUMN IF NOT EXISTS source_document_name   TEXT,
  ADD COLUMN IF NOT EXISTS document_id            TEXT,
  ADD COLUMN IF NOT EXISTS content_hash           TEXT,
  ADD COLUMN IF NOT EXISTS metadata               JSONB DEFAULT '{}'::jsonb;
```

---

## 5. AIMC-P1-upload-arch-review-20260319.md §2.4 Gap Resolution

| Gap ID | Description                              | Resolution                                              |
|--------|------------------------------------------|---------------------------------------------------------|
| Gap 1  | Missing chunk-to-document linkage        | `document_id TEXT` column added ✅                       |
| Gap 2  | No chunk ordering field                  | `chunk_index INTEGER` column added (§4.6.3) ✅          |
| Gap 3  | No deduplication / Smart Chunk Reuse hash | `content_hash TEXT` + `idx_ai_knowledge_content_hash` index ✅ |
| Gap 4  | No processing provenance store           | `metadata JSONB DEFAULT '{}'::jsonb` column added ✅    |

**Additional §4.6.3 columns** also resolved in this migration:
- `chunk_size INTEGER DEFAULT 2000`
- `chunk_overlap INTEGER DEFAULT 200`
- `source_document_name TEXT`

**RLS gap** (from security review): INSERT policy with `WITH CHECK` clause added to enforce org-isolation on write path ✅

---

## 6. Pre-existing Columns (unchanged)

From `003_ai_knowledge.sql`:
- `id UUID PRIMARY KEY`
- `organisation_id TEXT NOT NULL`
- `content TEXT NOT NULL`
- `source TEXT`
- `embedding vector(1536)`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`

From `006_ai_knowledge_metadata.sql`:
- `domain TEXT`
- `module TEXT`
- `standard_ref TEXT`
- `freshness_date TIMESTAMPTZ`
- `approval_status TEXT DEFAULT 'pending' CHECK (...)`
