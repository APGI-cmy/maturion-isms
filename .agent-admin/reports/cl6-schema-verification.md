# CL-6 Schema Verification Report

**Task**: CL-6-D3 — Schema Verification
**Wave**: CL-6 — LKIAC Wave 3 — Knowledge Re-ingestion
**Agent**: schema-builder
**Date**: 2026-04-05
**Branch**: `copilot/cl-6-migrate-knowledge-embeddings`
**Issue**: maturion-isms#1225
**Migration File**: `packages/ai-centre/supabase/migrations/010_cl6_schema_verification.sql`
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-cl6-lkiac-wave3-knowledge-reingestion-20260405.md`

---

## 1. Column Verification — `ai_knowledge` Table

All 11 required columns verified against the cumulative migration history
(003 → 006 → 008 → 009 → 010).

| Column | Required Type | Source Migration | Status |
|--------|--------------|-----------------|--------|
| `id` | UUID PK DEFAULT gen_random_uuid() | 003_ai_knowledge | ✅ PRESENT |
| `organisation_id` | TEXT NOT NULL | 003_ai_knowledge | ✅ PRESENT |
| `content` | TEXT NOT NULL | 003_ai_knowledge | ✅ PRESENT |
| `source` | TEXT | 003_ai_knowledge | ✅ PRESENT |
| `embedding` | vector(1536) | 003_ai_knowledge | ✅ PRESENT |
| `created_at` | TIMESTAMPTZ DEFAULT now() | 003_ai_knowledge | ✅ PRESENT (NOT NULL + DEFAULT) |
| `domain` | TEXT | 006_ai_knowledge_metadata | ✅ PRESENT |
| `approval_status` | TEXT DEFAULT 'pending' CHECK (pending, approved, rejected) | 006 + 009_fix | ✅ PRESENT + CORRECT CHECK |
| `document_id` | TEXT | 008_ai_knowledge_chunk_metadata | ✅ PRESENT |
| `content_hash` | TEXT | 008_ai_knowledge_chunk_metadata | ✅ PRESENT |
| `chunk_index` | INTEGER | 008_ai_knowledge_chunk_metadata | ✅ PRESENT |

**Column verdict**: All 11 required columns **PRESENT**. No `ALTER TABLE` required.

**Note on `approval_status` check constraint**: Migration 006 originally used `CHECK (pending, approved, retired)`. Migration 009 (`009_ai_knowledge_approval_status_fix.sql`) corrected this to `CHECK (pending, approved, rejected)`, which aligns with the CL-6 spec and TypeScript types. ✅

---

## 2. `org_page_chunks` Source Table Spec

Per CL-6 spec, the source table in legacy project `dmhlxhatogrrrvuruayv`:

| `org_page_chunks` Column | Maps to `ai_knowledge` Column | Notes |
|--------------------------|-------------------------------|-------|
| `id` | *(deduplication key — not stored)* | Used for Smart Chunk Reuse (T-CL6-SCR-001) |
| `organisation_id` | `organisation_id` | Direct map ✅ |
| `page_id` | `document_id` | Mapped ✅ |
| `chunk_text` | `content` | Mapped ✅ |
| `embedding` | *(NOT carried forward — re-embedded)* | AIMC re-embeds at 1536-dim per T-CL6-CHUNK-002 ✅ |
| `source` | `source` | Direct map ✅ |
| `domain` | `domain` | Must be `ldcs` or `diamond-industry` per T-CL6-DOM-001/002 ✅ |

**Column mapping verdict**: All source columns map to present `ai_knowledge` columns. Schema is **fully compatible** with `org_page_chunks` migration. No schema gaps.

---

## 3. RLS Policy Verification

### 3.1 SELECT Policy

| Field | Value |
|-------|-------|
| Policy name | `ai_knowledge_org_isolation` |
| Command | ALL (USING clause applies to SELECT, UPDATE, DELETE) |
| Role | All roles |
| Restriction | `organisation_id = current_setting('app.current_organisation_id', true)` |
| Source | `003_ai_knowledge.sql` |
| Status | ✅ ORG ISOLATION ENFORCED |

### 3.2 INSERT Policy — Gap Found and Remediated

**Pre-migration state (from `008_ai_knowledge_chunk_metadata.sql`):**

```sql
CREATE POLICY ai_knowledge_org_insert ON ai_knowledge
  FOR INSERT
  WITH CHECK (organisation_id = current_setting('app.current_organisation_id', true));
```

> **Gap**: No `TO <role>` clause → policy applies to **all roles including `anon`**.
> If `app.current_organisation_id` is set in the request context, `anon` could INSERT.
> **This violates T-CL6-WRITE-002** (INSERT must be denied for anon).

**Fix applied in `010_cl6_schema_verification.sql`:**

```sql
DROP POLICY IF EXISTS ai_knowledge_org_insert ON ai_knowledge;

CREATE POLICY ai_knowledge_org_insert ON ai_knowledge
  FOR INSERT
  TO authenticated
  WITH CHECK (organisation_id = current_setting('app.current_organisation_id', true));
```

**Post-fix role matrix:**

| Role | INSERT | Mechanism |
|------|--------|-----------|
| `service_role` | ✅ ALLOWED | Bypasses RLS entirely — migration script has full access |
| `authenticated` | ✅ ALLOWED | New scoped INSERT policy with org isolation check |
| `anon` | ❌ DENIED | No INSERT policy exists for anon role |

**T-CL6-WRITE-002 status: SATISFIED ✅**

### 3.3 Complete RLS Policy Inventory (Post-010 State)

| Policy Name | Command | Role | Clause |
|-------------|---------|------|--------|
| `ai_knowledge_org_isolation` | ALL | ALL | USING: `org_id = app.current_organisation_id` |
| `ai_knowledge_org_insert` | INSERT | `authenticated` | WITH CHECK: `org_id = app.current_organisation_id` |

---

## 4. Migration Safety Assessment

| Check | Result |
|-------|--------|
| All 11 required columns present | ✅ YES |
| No `ALTER TABLE` needed | ✅ CONFIRMED — schema already complete |
| `approval_status` CHECK includes `rejected` | ✅ YES (009 fix applied) |
| `domain` column supports `ldcs` and `diamond-industry` | ✅ YES (TEXT, no restrictive CHECK) |
| `embedding` vector dimension = 1536 | ✅ YES (`vector(1536)` from 003) |
| `content_hash` present for T-CL6-SCR-001 dedup | ✅ YES (008) |
| `document_id` present for `page_id` mapping | ✅ YES (008) |
| `chunk_index` present for ordering | ✅ YES (008) |
| RLS SELECT: org isolation enforced | ✅ YES (003) |
| RLS INSERT: anon denied | ✅ FIXED IN 010 |
| RLS INSERT: service_role allowed | ✅ YES (bypasses RLS) |
| Migration file idempotent | ✅ YES (`DROP POLICY IF EXISTS`, `CREATE POLICY`) |
| Pipeline 1 tables untouched | ✅ YES (`criteria_documents` not referenced) |
| No hardcoded legacy credentials | ✅ YES (legacy project ID not in migration) |
| Architecture freeze observed | ✅ YES — verification + RLS fix only |

---

## 5. Gaps Identified

| Gap ID | Description | Resolution |
|--------|-------------|------------|
| GAP-001 | INSERT policy from `008` applied to ALL roles (including `anon`), violating T-CL6-WRITE-002 | **FIXED** in `010_cl6_schema_verification.sql` — policy narrowed to `authenticated` role; `anon` INSERT denied |

**Column gaps**: None.
**Other RLS gaps**: None.

---

## 6. Migration Safe to Proceed

> **YES ✅**

All 11 required columns are present in the `ai_knowledge` table. The single RLS gap
(T-CL6-WRITE-002 anon INSERT) has been remediated in migration `010`. The `org_page_chunks`
source column mapping is fully compatible with the current schema.

The CL-6 migration script (CL-6-D2, `api-builder`) may proceed against this schema.

---

## 7. Evidence References

| Artifact | Path |
|----------|------|
| Schema verification migration | `packages/ai-centre/supabase/migrations/010_cl6_schema_verification.sql` |
| Base table migration | `packages/ai-centre/supabase/migrations/003_ai_knowledge.sql` |
| Metadata amendment | `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql` |
| Chunk metadata + orig INSERT policy | `packages/ai-centre/supabase/migrations/008_ai_knowledge_chunk_metadata.sql` |
| Approval status constraint fix | `packages/ai-centre/supabase/migrations/009_ai_knowledge_approval_status_fix.sql` |
| IAA Pre-Brief | `.agent-admin/assurance/iaa-prebrief-cl6-lkiac-wave3-knowledge-reingestion-20260405.md` |

---

*schema-builder | CL-6-D3 | 2026-04-05*
