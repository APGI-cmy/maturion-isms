-- Wave 15 — parse_tasks Table Migration
-- Schema Drift Fix: RCA Schema Drift — Wave 15 (issue #971)
-- CWT RED gate: T-W13-SCH-11
--
-- The frontend hook useCriteria.ts (useParseStatus, line 183) polls parse_tasks
-- to track AI criteria parsing status per audit. No migration existed for this
-- table, causing the T-W13-SCH-11 table-name drift guard to fail.
--
-- Columns:
--   id            — surrogate PK (uuid)
--   audit_id      — FK to public.audits (org-isolation anchor)
--   status        — parse lifecycle state; CHECK constrained to known values
--   error_message — nullable; populated on 'failed' status
--   created_at    — insert timestamp
--   updated_at    — last-modified timestamp
--
-- RLS:
--   SELECT: org-isolation via audit_id → audits.organisation_id → profiles.organisation_id

CREATE TABLE IF NOT EXISTS public.parse_tasks (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id      uuid        NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  status        text        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.parse_tasks ENABLE ROW LEVEL SECURITY;

-- RLS SELECT policy: restrict to audits the user's organisation has access to
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'parse_tasks'
      AND policyname = 'parse_tasks_select'
  ) THEN
    CREATE POLICY parse_tasks_select
      ON public.parse_tasks
      FOR SELECT
      USING (
        audit_id IN (
          SELECT a.id
          FROM public.audits a
          WHERE a.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      );
  END IF;
END $$;
