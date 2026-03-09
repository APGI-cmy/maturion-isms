-- Wave 15R: Create audit_logs table referenced by useCriteria.ts useUploadedDocuments()
-- Source: modules/mat/frontend/src/lib/hooks/useCriteria.ts
--   useUploadedDocuments() queries audit_logs filtered by audit_id and action
--   IN ('criteria_parsed', 'criteria_parse_failed').
-- Incident: T-W13-SCH-11 schema drift guard — audit_logs had no CREATE TABLE migration.
-- Idempotent: CREATE TABLE IF NOT EXISTS

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id        UUID        NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id UUID        NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  action          TEXT        NOT NULL,
  file_path       TEXT,
  details         JSONB,
  created_by      UUID        REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by audit
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'audit_logs'
      AND indexname  = 'audit_logs_audit_id_idx'
  ) THEN
    CREATE INDEX audit_logs_audit_id_idx ON public.audit_logs (audit_id);
  END IF;
END $$;

-- Index: filter by action (criteria_parsed, criteria_parse_failed)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'audit_logs'
      AND indexname  = 'audit_logs_action_idx'
  ) THEN
    CREATE INDEX audit_logs_action_idx ON public.audit_logs (action);
  END IF;
END $$;

-- RLS: org-isolation SELECT policy — users may only see logs for their own organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_logs'
      AND policyname = 'audit_logs_org_isolation'
  ) THEN
    CREATE POLICY audit_logs_org_isolation ON public.audit_logs
      FOR SELECT
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;

-- INSERT: service role / edge functions insert log entries on behalf of the org
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_logs'
      AND policyname = 'audit_logs_insert_authenticated'
  ) THEN
    CREATE POLICY audit_logs_insert_authenticated ON public.audit_logs
      FOR INSERT
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;
