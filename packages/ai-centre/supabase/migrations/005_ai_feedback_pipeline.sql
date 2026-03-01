-- Migration: 005_ai_feedback_pipeline
-- Table: ai_feedback_events
-- Purpose: AIMC-governed AI feedback pipeline with ARC (Adaptive Review Committee) approval gate
-- References:
--   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.1 (schema specification)
--   Issue #613 — Wave 9.2: AI Feedback Pipeline (Self-Learning Loop Migration to AIMC)
--   GRS-011 | APS §10 | AAD §10.1
--
-- Wave 9.2 — Schema: AI Feedback Pipeline
-- Authority: CS2 (@APGI-cmy) via foreman-v2-agent session-060-20260226

CREATE TABLE IF NOT EXISTS ai_feedback_events (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id   UUID        NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  session_id        TEXT        NOT NULL,
  user_id           UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  interaction_id    TEXT        NOT NULL,
  feedback_type     TEXT        NOT NULL CHECK (feedback_type IN ('positive', 'negative', 'correction', 'flag')),
  rating            INTEGER     CHECK (rating BETWEEN 1 AND 5),
  comment           TEXT,
  correction_text   TEXT,
  capability        TEXT        NOT NULL,
  agent_id          TEXT        NOT NULL,
  arc_status        TEXT        NOT NULL DEFAULT 'pending' CHECK (arc_status IN ('pending', 'approved', 'rejected')),
  arc_reviewed_by   TEXT,
  arc_reviewed_at   TIMESTAMPTZ,
  arc_notes         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_ai_feedback_events_org
  ON ai_feedback_events (organisation_id);

CREATE INDEX IF NOT EXISTS idx_ai_feedback_events_session
  ON ai_feedback_events (session_id);

CREATE INDEX IF NOT EXISTS idx_ai_feedback_events_arc_status
  ON ai_feedback_events (arc_status) WHERE arc_status = 'pending';

CREATE INDEX IF NOT EXISTS idx_ai_feedback_events_created_at
  ON ai_feedback_events (created_at);

-- Enable Row Level Security
ALTER TABLE ai_feedback_events ENABLE ROW LEVEL SECURITY;

-- Policy: ai_feedback_events_insert
-- Authenticated users can INSERT feedback rows for their own user_id.
CREATE POLICY ai_feedback_events_insert ON ai_feedback_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: ai_feedback_events_org_select
-- Org members can SELECT feedback rows belonging to their organisation.
-- Organisation membership is determined by the app.current_organisation_id
-- session variable (consistent with all other AIMC table policies).
CREATE POLICY ai_feedback_events_org_select ON ai_feedback_events
  FOR SELECT
  USING (organisation_id::text = current_setting('app.current_organisation_id', true));

-- Policy: ai_feedback_events_arc_update
-- ARC approval fields (arc_status, arc_reviewed_by, arc_reviewed_at, arc_notes)
-- may ONLY be updated by the service_role (CS2-gated ARC endpoint).
-- No direct user-facing UPDATE is permitted.
CREATE POLICY ai_feedback_events_arc_update ON ai_feedback_events
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
