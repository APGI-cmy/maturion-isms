-- Migration: 004_ai_episodic_memory
-- Table: ai_episodic_events
-- Purpose: Immutable, append-only episodic event log for AI session history
-- References: GRS-009 | APS §7.6 | AAD §9.4

CREATE TABLE IF NOT EXISTS ai_episodic_events (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id TEXT        NOT NULL,
  session_id      TEXT,
  user_id         TEXT,
  agent_id        TEXT,
  event_type      TEXT        NOT NULL,
  capability      TEXT        NOT NULL,
  summary         TEXT,
  full_context    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_ai_episodic_events_org        ON ai_episodic_events (organisation_id);
CREATE INDEX IF NOT EXISTS idx_ai_episodic_events_session    ON ai_episodic_events (session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_episodic_events_event_type ON ai_episodic_events (event_type);
CREATE INDEX IF NOT EXISTS idx_ai_episodic_events_created_at ON ai_episodic_events (created_at);

-- Enable Row Level Security
ALTER TABLE ai_episodic_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts scoped to the current organisation
CREATE POLICY ai_episodic_events_insert_org_scope ON ai_episodic_events
  FOR INSERT
  WITH CHECK (organisation_id = current_setting('app.current_organisation_id', true));

-- Policy: Users can only read events belonging to their organisation
CREATE POLICY ai_episodic_events_select_org_scope ON ai_episodic_events
  FOR SELECT
  USING (organisation_id = current_setting('app.current_organisation_id', true));

-- Enforce append-only: prevent UPDATE and DELETE operations on this table
CREATE RULE ai_episodic_events_no_update AS ON UPDATE TO ai_episodic_events DO INSTEAD NOTHING;
CREATE RULE ai_episodic_events_no_delete AS ON DELETE TO ai_episodic_events DO INSTEAD NOTHING;
