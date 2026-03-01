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
  capability      TEXT        NOT NULL
                              CHECK (capability IN (
                                'advisory',
                                'analysis',
                                'embeddings',
                                'document-generation',
                                'image-generation',
                                'deep-search',
                                'video-generation',
                                'algorithm-execution'
                              )),
  summary         TEXT,
  full_context    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- GDPR Art. 17 / POPIA §24 — Soft-redaction support
  -- These columns are nullable. Soft-redaction marks records as redacted
  -- but does NOT delete them. Append-only immutability is preserved via
  -- the ai_episodic_events_no_update and ai_episodic_events_no_delete rules.
  -- Redaction is governance-controlled via the ARC process, not via SQL
  -- UPDATE/DELETE policies. A redacted record remains in the log with its
  -- sensitive content replaced at the application layer under ARC oversight.
  redacted_at      TIMESTAMPTZ,
  redacted_by      TEXT,
  redaction_reason TEXT
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_ai_episodic_events_org        ON ai_episodic_events (organisation_id);
CREATE INDEX IF NOT EXISTS idx_ai_episodic_events_session    ON ai_episodic_events (session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_episodic_events_event_type ON ai_episodic_events (event_type);
CREATE INDEX IF NOT EXISTS idx_ai_episodic_events_created_at ON ai_episodic_events (created_at);

-- GDPR Art. 17 / POPIA §24 — Partial index for efficient ARC redaction queries
-- Only ~1% of rows will have redacted_at set; partial index avoids bloating main index
CREATE INDEX IF NOT EXISTS idx_ai_episodic_events_redacted_at
  ON ai_episodic_events (redacted_at)
  WHERE redacted_at IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE ai_episodic_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts scoped to the current organisation
DROP POLICY IF EXISTS ai_episodic_events_insert_org_scope ON ai_episodic_events;
CREATE POLICY ai_episodic_events_insert_org_scope ON ai_episodic_events
  FOR INSERT
  WITH CHECK (organisation_id = current_setting('app.current_organisation_id', true));

-- Policy: Users can only read events belonging to their organisation
DROP POLICY IF EXISTS ai_episodic_events_select_org_scope ON ai_episodic_events;
CREATE POLICY ai_episodic_events_select_org_scope ON ai_episodic_events
  FOR SELECT
  USING (organisation_id = current_setting('app.current_organisation_id', true));

-- Enforce append-only: prevent UPDATE and DELETE operations on this table
CREATE RULE ai_episodic_events_no_update AS ON UPDATE TO ai_episodic_events DO INSTEAD NOTHING;
CREATE RULE ai_episodic_events_no_delete AS ON DELETE TO ai_episodic_events DO INSTEAD NOTHING;
