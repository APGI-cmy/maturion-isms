-- Wave 14 — AI Evaluation Tables (FR-094 / TR-094)
-- Issue #909 — TASK-W14-BB-003
-- Architecture ref: modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W06
--
-- Creates two new tables for the Wave 14 AI evaluation workflow:
--
--   public.criteria_evaluations  — AI-generated evaluation result per criteria per audit
--   public.evaluation_overrides  — Lead Auditor manual override of an AI evaluation
--
-- Both tables are org-scoped for RLS isolation.
-- RLS policies: SELECT + INSERT (IAA-flagged — both required for AI writes).
-- Migration is idempotent: CREATE TABLE IF NOT EXISTS, DO $$ IF NOT EXISTS for policies.

-- ---------------------------------------------------------------------------
-- TABLE: public.criteria_evaluations
-- One row per criteria per audit (UNIQUE constraint).
-- Stores the full AI evaluation payload: proposed level, confidence score,
-- rationale, findings summary, next-level guidance, and status lifecycle.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.criteria_evaluations (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id              UUID        NOT NULL REFERENCES public.audits(id)         ON DELETE CASCADE,
  criteria_id           UUID        NOT NULL REFERENCES public.criteria(id)       ON DELETE CASCADE,
  organisation_id       UUID        NOT NULL REFERENCES public.organisations(id)  ON DELETE CASCADE,
  proposed_level        INTEGER,
  confidence_score      NUMERIC(4,3),
  rationale             TEXT,
  findings_summary      TEXT,
  next_level_guidance   TEXT,
  next_plus_one_taster  TEXT,
  evaluated_by          UUID        REFERENCES auth.users(id),
  status                TEXT        NOT NULL DEFAULT 'pending_review'
                                    CHECK (status IN ('pending_review', 'confirmed', 'overridden')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (audit_id, criteria_id)
);

ALTER TABLE public.criteria_evaluations ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by audit
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_evaluations'
      AND indexname  = 'criteria_evaluations_audit_id_idx'
  ) THEN
    CREATE INDEX criteria_evaluations_audit_id_idx
      ON public.criteria_evaluations (audit_id);
  END IF;
END $$;

-- Index: org isolation queries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_evaluations'
      AND indexname  = 'criteria_evaluations_organisation_id_idx'
  ) THEN
    CREATE INDEX criteria_evaluations_organisation_id_idx
      ON public.criteria_evaluations (organisation_id);
  END IF;
END $$;

-- RLS SELECT policy: org isolation — users see only their own org's evaluations
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_evaluations'
      AND policyname = 'criteria_evaluations_select'
  ) THEN
    CREATE POLICY criteria_evaluations_select
      ON public.criteria_evaluations
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

-- RLS INSERT policy: org isolation — AI service inserts only for authenticated user's org
-- (IAA-flagged requirement: SELECT-only insufficient; AI writes require explicit INSERT policy)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_evaluations'
      AND policyname = 'criteria_evaluations_insert'
  ) THEN
    CREATE POLICY criteria_evaluations_insert
      ON public.criteria_evaluations
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

-- ---------------------------------------------------------------------------
-- TABLE: public.evaluation_overrides
-- Tracks manual Lead Auditor overrides of AI-proposed evaluations.
-- justification is NOT NULL — every override must be documented.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evaluation_overrides (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id    UUID        NOT NULL REFERENCES public.criteria_evaluations(id) ON DELETE CASCADE,
  criteria_id      UUID        NOT NULL REFERENCES public.criteria(id)             ON DELETE CASCADE,
  audit_id         UUID        NOT NULL REFERENCES public.audits(id)               ON DELETE CASCADE,
  organisation_id  UUID        NOT NULL REFERENCES public.organisations(id)        ON DELETE CASCADE,
  overridden_by    UUID        REFERENCES auth.users(id),
  overridden_level INTEGER     NOT NULL,
  justification    TEXT        NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.evaluation_overrides ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by evaluation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'evaluation_overrides'
      AND indexname  = 'evaluation_overrides_evaluation_id_idx'
  ) THEN
    CREATE INDEX evaluation_overrides_evaluation_id_idx
      ON public.evaluation_overrides (evaluation_id);
  END IF;
END $$;

-- Index: org isolation queries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'evaluation_overrides'
      AND indexname  = 'evaluation_overrides_organisation_id_idx'
  ) THEN
    CREATE INDEX evaluation_overrides_organisation_id_idx
      ON public.evaluation_overrides (organisation_id);
  END IF;
END $$;

-- RLS SELECT policy: org isolation — users see only their own org's overrides
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'evaluation_overrides'
      AND policyname = 'evaluation_overrides_select'
  ) THEN
    CREATE POLICY evaluation_overrides_select
      ON public.evaluation_overrides
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

-- RLS INSERT policy: org isolation — Lead Auditor inserts only for their org
-- (IAA-flagged requirement: INSERT policy required alongside SELECT)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'evaluation_overrides'
      AND policyname = 'evaluation_overrides_insert'
  ) THEN
    CREATE POLICY evaluation_overrides_insert
      ON public.evaluation_overrides
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
