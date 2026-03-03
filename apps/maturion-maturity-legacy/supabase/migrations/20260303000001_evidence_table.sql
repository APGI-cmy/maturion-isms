-- INC-W13-EVIDENCE-TABLE-001: evidence table for audit criterion evidence
-- Source: modules/mat/frontend/src/lib/hooks/useEvidence.ts uses .from('evidence')
-- Architecture ref: modules/mat/02-architecture/data-architecture.md §1.1.7
-- Migration is idempotent (CREATE TABLE IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS public.evidence (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criterion_id     UUID NOT NULL REFERENCES public.criteria(id) ON DELETE CASCADE,
  audit_id         UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id  UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  type             TEXT NOT NULL CHECK (type IN ('text', 'photo', 'audio', 'video', 'document', 'interview')),
  content          TEXT,
  file_path        TEXT,
  file_name        TEXT,
  file_size        BIGINT,
  mime_type        TEXT,
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by       UUID REFERENCES auth.users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMPTZ
);

ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by audit
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'evidence'
      AND indexname  = 'evidence_audit_id_idx'
  ) THEN
    CREATE INDEX evidence_audit_id_idx ON public.evidence (audit_id);
  END IF;
END $$;

-- Index: fast lookup by criterion within an audit
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'evidence'
      AND indexname  = 'evidence_criterion_id_idx'
  ) THEN
    CREATE INDEX evidence_criterion_id_idx ON public.evidence (criterion_id);
  END IF;
END $$;

-- Index: organisation isolation queries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'evidence'
      AND indexname  = 'evidence_organisation_id_idx'
  ) THEN
    CREATE INDEX evidence_organisation_id_idx ON public.evidence (organisation_id);
  END IF;
END $$;

-- RLS policy: users may only see evidence belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'evidence'
      AND policyname = 'evidence_org_isolation'
  ) THEN
    CREATE POLICY evidence_org_isolation ON public.evidence
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;
