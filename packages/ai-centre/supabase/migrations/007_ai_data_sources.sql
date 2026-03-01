-- Migration: 007_ai_data_sources
-- Table: ai_data_sources
-- Purpose: Registry of external data sources connected to the AIMC,
--          with connection configuration, sync scheduling, and status tracking.
-- References: governance/aimc/CL3_5_DATA_MODEL_SPEC.md
-- Wave: CL-3.5 (AIMC Data Sources Registry)
-- Authority: CS2 (CP-3.5) via foreman-v2-agent session-082
--
-- Extensibility note: If additional source_type values are required in future
-- (e.g., 's3', 'notion'), the CHECK constraint must be altered via a new migration.

-- ---------------------------------------------------------------------------
-- Table: ai_data_sources
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_data_sources (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id         TEXT        NOT NULL,
  source_name             TEXT        NOT NULL,
  source_type             TEXT        NOT NULL CHECK (source_type IN ('supabase', 'google_drive', 'sharepoint', 'api')),
  status                  TEXT        NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'syncing', 'error')),
  connection_config       JSONB       NOT NULL DEFAULT '{}',
  credentials_encrypted   TEXT,
  last_synced_at          TIMESTAMPTZ,
  sync_frequency_minutes  INTEGER     DEFAULT 60,
  is_active               BOOLEAN     NOT NULL DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by              UUID        REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- Primary filter: all queries are scoped to organisation
CREATE INDEX IF NOT EXISTS idx_ai_data_sources_org ON ai_data_sources (organisation_id);

-- Filter by source type (e.g., list all 'supabase' sources)
CREATE INDEX IF NOT EXISTS idx_ai_data_sources_type ON ai_data_sources (source_type);

-- Filter by status (e.g., list all 'active' or 'error' sources)
CREATE INDEX IF NOT EXISTS idx_ai_data_sources_status ON ai_data_sources (status);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE ai_data_sources ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read data sources belonging to their organisation
-- Pattern follows 003_ai_knowledge.sql ai_knowledge_org_isolation convention
DROP POLICY IF EXISTS ai_data_sources_org_isolation ON ai_data_sources;
CREATE POLICY ai_data_sources_org_isolation ON ai_data_sources
  FOR SELECT
  USING (organisation_id = current_setting('app.current_organisation_id', true));

-- Policy: Data source administration (create, configure, delete) is exclusively
-- an admin operation executed via Edge Functions under the service_role key.
-- Direct row writes by authenticated users are not permitted.
DROP POLICY IF EXISTS ai_data_sources_service_role_writes ON ai_data_sources;
CREATE POLICY ai_data_sources_service_role_writes ON ai_data_sources
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at_ai_data_sources()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ai_data_sources_updated_at ON ai_data_sources;
CREATE TRIGGER trg_ai_data_sources_updated_at
  BEFORE UPDATE ON ai_data_sources
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_ai_data_sources();
