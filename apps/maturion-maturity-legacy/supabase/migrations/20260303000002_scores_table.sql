-- INC-W13-SCORES-TABLE-001: pragmatic 'scores' table (frontend uses this name);
-- architecture drift from ai_scoring_results documented in BUILD_PROGRESS_TRACKER.md
-- Source: modules/mat/frontend/src/lib/hooks/useScoring.ts uses .from('scores')
-- Architecture ref: modules/mat/02-architecture/data-architecture.md §1.1.8 (ai_scoring_results)
-- Migration is idempotent (CREATE TABLE IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS public.scores (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criterion_id           UUID NOT NULL REFERENCES public.criteria(id) ON DELETE CASCADE,
  audit_id               UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id        UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  maturity_level         NUMERIC(3,1) NOT NULL CHECK (maturity_level >= 0 AND maturity_level <= 5),
  confidence             NUMERIC(3,2),
  rationale              TEXT,
  gap_analysis           JSONB NOT NULL DEFAULT '{}'::jsonb,
  confirmed              BOOLEAN NOT NULL DEFAULT false,
  confirmed_by           UUID REFERENCES auth.users(id),
  confirmed_at           TIMESTAMPTZ,
  override_score         NUMERIC(3,1),
  override_justification TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by audit
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'scores'
      AND indexname  = 'scores_audit_id_idx'
  ) THEN
    CREATE INDEX scores_audit_id_idx ON public.scores (audit_id);
  END IF;
END $$;

-- Index: fast lookup by criterion
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'scores'
      AND indexname  = 'scores_criterion_id_idx'
  ) THEN
    CREATE INDEX scores_criterion_id_idx ON public.scores (criterion_id);
  END IF;
END $$;

-- Index: organisation isolation queries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'scores'
      AND indexname  = 'scores_organisation_id_idx'
  ) THEN
    CREATE INDEX scores_organisation_id_idx ON public.scores (organisation_id);
  END IF;
END $$;

-- Partial index: quickly find unconfirmed scores
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'scores'
      AND indexname  = 'scores_unconfirmed_idx'
  ) THEN
    CREATE INDEX scores_unconfirmed_idx ON public.scores (audit_id)
      WHERE confirmed = false;
  END IF;
END $$;

-- RLS policy: users may only see scores belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'scores'
      AND policyname = 'scores_org_isolation'
  ) THEN
    CREATE POLICY scores_org_isolation ON public.scores
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;
