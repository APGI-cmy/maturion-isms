-- Wave 14 — Audit Reports Table & Reports Storage Bucket (FR-099 / TR-099)
-- Issue #909 — TASK-W14-BB-009
-- Architecture ref: modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W11
--
-- Creates:
--   public.audit_reports  — stores metadata for each AI-generated PDF audit report
--   storage.buckets       — inserts the 'reports' private storage bucket (ON CONFLICT DO NOTHING)
--
-- RLS policies: SELECT + INSERT (IAA-flagged — both required; SELECT for viewers,
--   INSERT for AI-triggered generation pipeline writes).
-- Migration is idempotent: CREATE TABLE IF NOT EXISTS, DO $$ IF NOT EXISTS for policies,
--   ON CONFLICT DO NOTHING for storage bucket insert.

-- ---------------------------------------------------------------------------
-- STORAGE BUCKET: reports (private)
-- PDF files are stored at reports/{organisation_id}/{audit_id}/<filename>.
-- public = false: bucket is private; signed URLs used for downloads.
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
  VALUES ('reports', 'reports', false)
  ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- TABLE: public.audit_reports
-- One row per report generation event for an audit.
-- storage_path NOT NULL: every row must reference a valid Storage object path.
-- status lifecycle: 'generating' → 'final' | 'failed'
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_reports (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id        UUID        NOT NULL REFERENCES public.audits(id)        ON DELETE CASCADE,
  organisation_id UUID        NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  storage_path    TEXT        NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'generating'
                              CHECK (status IN ('generating', 'final', 'failed')),
  generated_at    TIMESTAMPTZ,
  triggered_by    UUID        REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by audit
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'audit_reports'
      AND indexname  = 'audit_reports_audit_id_idx'
  ) THEN
    CREATE INDEX audit_reports_audit_id_idx
      ON public.audit_reports (audit_id);
  END IF;
END $$;

-- Index: org isolation queries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'audit_reports'
      AND indexname  = 'audit_reports_organisation_id_idx'
  ) THEN
    CREATE INDEX audit_reports_organisation_id_idx
      ON public.audit_reports (organisation_id);
  END IF;
END $$;

-- RLS SELECT policy: org isolation — users see only their own org's reports
-- NOTE: Migration 20260305000008 defines an additional `audit_reports_org_select`
-- policy with identical USING logic (activated when table exists). This policy
-- coexists with that one; PostgreSQL combines multiple SELECT policies with OR
-- (functionally equivalent to a single policy when conditions are identical).
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_reports'
      AND policyname = 'audit_reports_select_policy'
  ) THEN
    CREATE POLICY audit_reports_select_policy
      ON public.audit_reports
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

-- RLS INSERT policy: org isolation — AI generation pipeline inserts for authenticated user's org
-- (IAA-flagged requirement: INSERT policy required for AI-triggered report generation writes)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_reports'
      AND policyname = 'audit_reports_insert'
  ) THEN
    CREATE POLICY audit_reports_insert
      ON public.audit_reports
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
