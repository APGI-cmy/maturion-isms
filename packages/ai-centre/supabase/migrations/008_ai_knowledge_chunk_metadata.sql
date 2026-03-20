-- Migration: 008_ai_knowledge_chunk_metadata
-- Table: ai_knowledge (amendment)
-- Purpose: Add Pipeline 2 chunk metadata columns and INSERT RLS policy
-- References: DCKIS-SCH-001, AIMC-P1-upload-arch-review-20260319.md §2.4, system-architecture.md §4.6.3
-- Wave: DCKIS-SCH-001
-- Authority: CS2 (@APGI-cmy) via foreman-v2-agent

-- Add chunk metadata columns required for Pipeline 2 (Knowledge Ingestion) per system-architecture.md §4.6.3.
-- All new columns are nullable for backward compatibility with existing rows.

ALTER TABLE ai_knowledge
  -- 0-based chunk position within source document (required for ordering)
  ADD COLUMN IF NOT EXISTS chunk_index            INTEGER,
  -- Chunk size parameter used during ingestion (default 2000)
  ADD COLUMN IF NOT EXISTS chunk_size             INTEGER DEFAULT 2000,
  -- Overlap parameter used during ingestion (default 200)
  ADD COLUMN IF NOT EXISTS chunk_overlap          INTEGER DEFAULT 200,
  -- Original filename stored with every chunk for traceability
  ADD COLUMN IF NOT EXISTS source_document_name   TEXT,
  -- Chunk-to-document linkage for traceability (AIMC-P1-upload-arch-review-20260319.md §2.4 gap 1)
  ADD COLUMN IF NOT EXISTS document_id            TEXT,
  -- Deterministic hash for deduplication / Smart Chunk Reuse (AIMC-P1-upload-arch-review-20260319.md §2.4 gap 3)
  ADD COLUMN IF NOT EXISTS content_hash           TEXT,
  -- Processing provenance — stores ingestion parameters, model info, etc. (AIMC-P1-upload-arch-review-20260319.md §2.4 gap 4)
  ADD COLUMN IF NOT EXISTS metadata               JSONB DEFAULT '{}';

-- Index on content_hash for efficient deduplication lookups (Smart Chunk Reuse)
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_content_hash
  ON ai_knowledge (content_hash);

-- INSERT RLS policy: enforce organisation_id isolation on write.
-- Existing 003_ai_knowledge.sql has a SELECT USING policy only.
-- This policy adds the WITH CHECK clause so inserts are scoped to the caller's organisation.
DROP POLICY IF EXISTS ai_knowledge_org_insert ON ai_knowledge;
CREATE POLICY ai_knowledge_org_insert ON ai_knowledge
  FOR INSERT
  WITH CHECK (organisation_id = current_setting('app.current_organisation_id', true));
