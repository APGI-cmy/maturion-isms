-- Migration: 003_ai_knowledge
-- Table: ai_knowledge
-- Purpose: Org-scoped vector knowledge store for AI retrieval-augmented generation
-- References: GRS-006, GRS-030 | AAWP Wave 5 | AAD §8.1

-- Enable pgvector extension for embedding support
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS ai_knowledge (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id TEXT        NOT NULL,
  content         TEXT        NOT NULL,
  source          TEXT,
  embedding       vector(1536),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for org-scoped queries
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_org ON ai_knowledge (organisation_id);

-- Index for pgvector cosine similarity nearest-neighbour search
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_embedding ON ai_knowledge
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Enable Row Level Security
ALTER TABLE ai_knowledge ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access knowledge belonging to their organisation
DROP POLICY IF EXISTS ai_knowledge_org_isolation ON ai_knowledge;
CREATE POLICY ai_knowledge_org_isolation ON ai_knowledge
  USING (organisation_id = current_setting('app.current_organisation_id', true));
