-- Migration: 006_ai_knowledge_metadata
-- Table: ai_knowledge (amendment)
-- Purpose: Add domain metadata and ARC approval status columns to the ai_knowledge table,
--          required for the Knowledge Base Inventory and ARC Knowledge Promotion Protocol.
-- References:
--   ARCH_FREEZE-wave9-knowledge-base-inventory-arc-protocol-20260227.md §4.1
--   Issue #658 — Wave 9.2: ai_knowledge Amendment
--   GRS-011 | APS §8.1 | AAD §8.1
--
-- Wave 9.2 — Schema: ai_knowledge Amendment
-- Authority: CS2 (@APGI-cmy) via foreman-v2-agent session-069-20260227

-- Add domain metadata and ARC approval status columns to the existing ai_knowledge table.
-- All new columns are nullable for backward compatibility with existing rows.
-- approval_status defaults to 'pending' so all new knowledge enters the ARC review lifecycle.

ALTER TABLE ai_knowledge
  ADD COLUMN IF NOT EXISTS domain          TEXT,
  ADD COLUMN IF NOT EXISTS module          TEXT,
  ADD COLUMN IF NOT EXISTS standard_ref    TEXT,
  ADD COLUMN IF NOT EXISTS freshness_date  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending'
    CHECK (approval_status IN ('pending', 'approved', 'retired'));

-- Index for efficient ARC-status filtered queries (Wave 9.5 KnowledgeRetriever approval filter)
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_approval_status
  ON ai_knowledge (approval_status);
