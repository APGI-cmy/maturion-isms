-- Hotfix: Add criteria_documents table (if absent) and include 'processing' status value
-- Issue: #1019 — Edge Function EarlyDrop on Supabase free plan
--
-- The invoke-ai-parse-criteria Edge Function now writes status='processing' immediately
-- (before returning 202 Accepted) so the frontend can poll the transition to
-- 'pending_review' or 'parse_failed'.
--
-- This migration:
--   1. Creates criteria_documents table if it does not exist
--   2. Adds 'processing' to the CHECK constraint on the status column
-- Idempotent: uses CREATE TABLE IF NOT EXISTS and conditional DO blocks.

CREATE TABLE IF NOT EXISTS public.criteria_documents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id    UUID        NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  file_path   TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'pending_parse'
                          CHECK (status IN ('pending_parse', 'processing', 'pending_review', 'parse_failed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index: fast lookup by audit
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_documents'
      AND indexname  = 'criteria_documents_audit_id_idx'
  ) THEN
    CREATE INDEX criteria_documents_audit_id_idx ON public.criteria_documents (audit_id);
  END IF;
END $$;

-- Index: unique constraint on audit_id + file_path
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_documents'
      AND indexname  = 'criteria_documents_audit_file_path_idx'
  ) THEN
    CREATE UNIQUE INDEX criteria_documents_audit_file_path_idx
      ON public.criteria_documents (audit_id, file_path);
  END IF;
END $$;

-- If the table already existed (e.g. was created by a prior migration not in this repo),
-- update its CHECK constraint to include 'processing'.
DO $$ BEGIN
  ALTER TABLE public.criteria_documents
    DROP CONSTRAINT IF EXISTS criteria_documents_status_check;

  ALTER TABLE public.criteria_documents
    ADD CONSTRAINT criteria_documents_status_check
      CHECK (status IN ('pending_parse', 'processing', 'pending_review', 'parse_failed'));
EXCEPTION
  WHEN undefined_table THEN
    NULL; -- table does not exist; CREATE TABLE IF NOT EXISTS above handles creation
END $$;

ALTER TABLE public.criteria_documents ENABLE ROW LEVEL SECURITY;

-- RLS: org-isolation SELECT policy via audit membership
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_documents'
      AND policyname = 'criteria_documents_org_isolation'
  ) THEN
    CREATE POLICY criteria_documents_org_isolation ON public.criteria_documents
      FOR SELECT
      USING (
        audit_id IN (
          SELECT a.id FROM public.audits a
          JOIN public.profiles p ON p.organisation_id = a.organisation_id
          WHERE p.id = auth.uid()
        )
      );
  END IF;
END $$;
