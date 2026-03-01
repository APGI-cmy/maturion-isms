-- Migration: 002_ai_telemetry
-- Table: ai_telemetry
-- Purpose: Append-only telemetry for AI capability calls
-- References: GRS-012, GRS-013 | APS §9.1, §9.2 | AAD §9.3

CREATE TABLE IF NOT EXISTS ai_telemetry (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id   TEXT        NOT NULL,
  user_id           TEXT,
  capability        TEXT        NOT NULL,
  provider_used     TEXT        NOT NULL,
  prompt_tokens     INTEGER     NOT NULL DEFAULT 0,
  completion_tokens INTEGER     NOT NULL DEFAULT 0,
  latency_ms        INTEGER     NOT NULL DEFAULT 0,
  error_code        TEXT,
  recorded_at       BIGINT      NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for org-scoped telemetry queries
CREATE INDEX IF NOT EXISTS idx_ai_telemetry_org ON ai_telemetry (organisation_id);
CREATE INDEX IF NOT EXISTS idx_ai_telemetry_capability ON ai_telemetry (capability);
CREATE INDEX IF NOT EXISTS idx_ai_telemetry_recorded_at ON ai_telemetry (recorded_at);

-- Enable Row Level Security
ALTER TABLE ai_telemetry ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read telemetry belonging to their organisation
DROP POLICY IF EXISTS ai_telemetry_org_isolation ON ai_telemetry;
CREATE POLICY ai_telemetry_org_isolation ON ai_telemetry
  USING (organisation_id = current_setting('app.current_organisation_id', true));

-- Enforce append-only: prevent UPDATE and DELETE operations on this table
CREATE RULE ai_telemetry_no_update AS ON UPDATE TO ai_telemetry DO INSTEAD NOTHING;
CREATE RULE ai_telemetry_no_delete AS ON DELETE TO ai_telemetry DO INSTEAD NOTHING;
