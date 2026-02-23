-- Migration: 001_ai_memory
-- Table: ai_memory
-- Purpose: Org-scoped persistent memory for AI sessions
-- References: GRS-008 | APS §7.2 | AAD §7.4

CREATE TABLE IF NOT EXISTS ai_memory (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id TEXT    NOT NULL,
  session_id  TEXT,
  user_id     TEXT,
  role        TEXT        NOT NULL CHECK (role IN ('user', 'assistant')),
  content     TEXT        NOT NULL,
  capability  TEXT        NOT NULL,
  timestamp   BIGINT      NOT NULL,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for org-scoped queries
CREATE INDEX IF NOT EXISTS idx_ai_memory_org ON ai_memory (organisation_id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_session ON ai_memory (session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_memory_expires ON ai_memory (expires_at) WHERE expires_at IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE ai_memory ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access memory belonging to their organisation
CREATE POLICY ai_memory_org_isolation ON ai_memory
  USING (organisation_id = current_setting('app.current_organisation_id', true));
