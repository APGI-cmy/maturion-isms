-- Migration: 007_ai_requests
-- Table: ai_requests
-- Purpose: Org-scoped AI gateway request log for tracking capability calls, provider
--          routing, token usage, latency, and request outcomes.
-- References: GRS-012, GRS-013 | APS §9.1, §9.2 | AAD §9.3 | CL-4 audit (DB-GAP-001)
--
-- DB-GAP-001 — Add Supabase migration and RLS policies for ai_requests table
-- Authority: schema-builder session — gap item CL-4 / DB-GAP-001

CREATE TABLE IF NOT EXISTS ai_requests (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id TEXT        NOT NULL,
  session_id      TEXT,
  capability      TEXT        NOT NULL
                              CHECK (capability IN (
                                'analysis',
                                'advisory',
                                'embeddings',
                                'rag',
                                'image_generation',
                                'algorithm_execution'
                              )),
  provider        TEXT,
  model           TEXT,
  input_tokens    INTEGER,
  output_tokens   INTEGER,
  latency_ms      INTEGER,
  status          TEXT        NOT NULL DEFAULT 'success'
                              CHECK (status IN ('success', 'error', 'degraded')),
  error_code      TEXT,
  persona_id      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- updated_at mirrors created_at for append-only rows; included for schema
  -- consistency with mutable-table conventions and to support future soft-edit
  -- workflows (e.g., status correction by service role) without a DDL change.
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index: organisation-scoped queries (primary tenant isolation filter)
CREATE INDEX IF NOT EXISTS idx_ai_requests_organisation_id
  ON ai_requests (organisation_id);

-- Index: time-ordered retrieval (most recent first)
CREATE INDEX IF NOT EXISTS idx_ai_requests_created_at
  ON ai_requests (created_at DESC);

-- Index: capability-filtered queries (usage analytics per capability)
CREATE INDEX IF NOT EXISTS idx_ai_requests_capability
  ON ai_requests (capability);

-- Index: session correlation (partial — only rows that carry a session_id)
CREATE INDEX IF NOT EXISTS idx_ai_requests_session_id
  ON ai_requests (session_id)
  WHERE session_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE ai_requests ENABLE ROW LEVEL SECURITY;

-- Policy: ai_requests_insert
-- Authenticated users may INSERT request rows for their own organisation.
-- WITH CHECK ensures the inserted organisation_id matches the session-scoped org.
CREATE POLICY ai_requests_insert ON ai_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (organisation_id = current_setting('app.current_organisation_id', true));

-- Policy: ai_requests_select
-- Authenticated users may SELECT only rows belonging to their organisation.
CREATE POLICY ai_requests_select ON ai_requests
  FOR SELECT
  TO authenticated
  USING (organisation_id = current_setting('app.current_organisation_id', true));

-- Note: No UPDATE/DELETE policies are defined.
-- ai_requests is effectively append-only from the application layer.
-- The service role bypasses RLS by default (standard Supabase behaviour),
-- allowing server-side telemetry writers full access without a separate policy.
