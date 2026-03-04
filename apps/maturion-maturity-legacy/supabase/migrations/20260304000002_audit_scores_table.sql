-- Wave 14 Addendum A: Extend audit_scores table with criterion-level columns
-- Incident: INC-W13-AUDIT-SCORES-001 (carry-forward from Wave 13)
-- Architecture: TR-081 (Wave 14 Addendum A TRS)
-- Note: The audit_scores table was created by migration 20260303000006 without criterion_id.
-- This migration adds the missing columns idempotently via ADD COLUMN IF NOT EXISTS.

ALTER TABLE public.audit_scores
  ADD COLUMN IF NOT EXISTS criterion_id  UUID REFERENCES public.criteria(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS score_source  TEXT NOT NULL DEFAULT 'ai' CHECK (score_source IN ('ai', 'human', 'override')),
  ADD COLUMN IF NOT EXISTS confirmed     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS confirmed_by  UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS confirmed_at  TIMESTAMPTZ;

-- Index: fast lookup by audit
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'audit_scores'
      AND indexname  = 'audit_scores_audit_id_idx'
  ) THEN
    CREATE INDEX audit_scores_audit_id_idx ON public.audit_scores (audit_id);
  END IF;
END $$;

-- Index: fast lookup by criterion
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'audit_scores'
      AND indexname  = 'audit_scores_criterion_id_idx'
  ) THEN
    CREATE INDEX audit_scores_criterion_id_idx ON public.audit_scores (criterion_id);
  END IF;
END $$;

-- Index: organisation isolation queries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'audit_scores'
      AND indexname  = 'audit_scores_organisation_id_idx'
  ) THEN
    CREATE INDEX audit_scores_organisation_id_idx ON public.audit_scores (organisation_id);
  END IF;
END $$;

-- RLS policy: users may only see audit_scores belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_scores'
      AND policyname = 'audit_scores_org_isolation'
  ) THEN
    CREATE POLICY audit_scores_org_isolation ON public.audit_scores
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;
