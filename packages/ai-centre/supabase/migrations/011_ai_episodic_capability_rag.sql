-- Migration: 011_ai_episodic_capability_rag
-- Table: ai_episodic_events
-- Purpose: Add 'rag' to the capability CHECK constraint to match Capability.RAG in the TypeScript enum
-- References: GAP-009 / F-D4-001 remediation — CL-11-D4 audit | APS §7.4 (RAG pipeline) | Capability enum
--
-- Background:
--   Migration 004_ai_episodic_memory.sql defined the capability CHECK constraint with 8 values.
--   The TypeScript Capability enum includes Capability.RAG = 'rag' (added for Wave 5 RAG pipeline,
--   APS §7.4). Without 'rag' in the CHECK constraint, any INSERT with capability='rag' will be
--   rejected by the database — silently causing data loss for RAG requests via EpisodicMemoryAdapter.
--
--   PostgreSQL does not support ALTER CONSTRAINT for inline (anonymous) CHECK constraints.
--   The fix is: drop the anonymous constraint and add a named replacement with 'rag' included.
--   The constraint is identified by its auto-generated name: ai_episodic_events_capability_check.

-- Step 1: Drop the anonymous capability CHECK constraint created in migration 004
ALTER TABLE ai_episodic_events
  DROP CONSTRAINT IF EXISTS ai_episodic_events_capability_check;

-- Step 2: Add a named replacement CHECK constraint that includes all 9 Capability enum values
ALTER TABLE ai_episodic_events
  ADD CONSTRAINT ai_episodic_events_capability_check
  CHECK (capability IN (
    'advisory',
    'analysis',
    'embeddings',
    'document-generation',
    'image-generation',
    'deep-search',
    'video-generation',
    'algorithm-execution',
    'rag'
  ));
