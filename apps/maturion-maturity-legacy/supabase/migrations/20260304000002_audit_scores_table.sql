-- Wave 14 Addendum A: Create audit_scores table
-- Incident: INC-W13-AUDIT-SCORES-001 (carry-forward from Wave 13)
-- Architecture: TR-081 (Wave 14 Addendum A TRS)
-- Idempotent: CREATE TABLE IF NOT EXISTS and DO $$ guards

CREATE TABLE IF NOT EXISTS public.audit_scores (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id        UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  criterion_id    UUID NOT NULL REFERENCES public.criteria(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  maturity_level  NUMERIC(3,1) NOT NULL CHECK (maturity_level >= 0 AND maturity_level <= 5),
  score_source    TEXT NOT NULL DEFAULT 'ai' CHECK (score_source IN ('ai', 'human', 'override')),
  confirmed       BOOLEAN NOT NULL DEFAULT false,
  confirmed_by    UUID REFERENCES auth.users(id),
  confirmed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
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
