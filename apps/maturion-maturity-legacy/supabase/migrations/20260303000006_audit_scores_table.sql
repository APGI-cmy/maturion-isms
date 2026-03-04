-- INC-W13-AUDIT-SCORES-001: Create audit_scores table referenced by useAuditMetrics.ts
-- Source: modules/mat/frontend/src/lib/hooks/useAuditMetrics.ts uses .from('audit_scores').select('maturity_level')
-- The table was previously guarded only by a try/catch in useAuditMetrics.ts and marked OPTIONAL.
-- This migration brings it under full schema coverage and CI gate parity.
-- Migration is idempotent (CREATE TABLE IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS public.audit_scores (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id          UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id   UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  maturity_level    NUMERIC(3,1) NOT NULL CHECK (maturity_level >= 0 AND maturity_level <= 5),
  scoring_method    TEXT NOT NULL DEFAULT 'aggregated' CHECK (scoring_method IN ('aggregated', 'manual', 'ai')),
  scored_by         UUID REFERENCES auth.users(id),
  scored_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_scores ENABLE ROW LEVEL SECURITY;

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

-- RLS policy: users may only see scores belonging to their organisation
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
