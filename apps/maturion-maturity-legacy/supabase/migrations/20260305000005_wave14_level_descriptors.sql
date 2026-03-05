-- Wave 14 — Level Descriptor Tables (GAP-W12)
-- FR-100 / TR-100
-- Issue #909 — TASK-W14-BC-001
-- Architecture ref: modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W12
--
-- Creates three new tables for per-criteria/MPS/domain maturity level descriptors:
--
--   public.criteria_level_descriptors  — one row per criteria per maturity level (1–5)
--   public.mps_level_descriptors       — one row per MPS per maturity level (1–5)
--   public.domain_level_descriptors    — one row per domain per maturity level (1–5)
--
-- Descriptors are generated from org-uploaded LDCS documents (via AI parsing).
-- All three tables are org-scoped for RLS isolation.
-- RLS: SELECT policies enforcing org-isolation are defined here and consolidated
--      in migration 20260305000008_wave14_new_tables_rls.sql.
-- Migration is idempotent: CREATE TABLE IF NOT EXISTS, DO $$ IF NOT EXISTS for policies.

-- ---------------------------------------------------------------------------
-- TABLE: public.criteria_level_descriptors
-- Stores a descriptor text per maturity level (1–5) for each criteria.
-- The criteria card shows the descriptor for the current confirmed evaluation level.
-- Descriptor rows are generated from org-specific LDCS documents — org-scoped.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.criteria_level_descriptors (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  criteria_id     UUID        NOT NULL REFERENCES public.criteria(id) ON DELETE CASCADE,
  level           INTEGER     NOT NULL CHECK (level BETWEEN 1 AND 5),
  descriptor_text TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (criteria_id, level)
);

ALTER TABLE public.criteria_level_descriptors ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by criteria
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_level_descriptors'
      AND indexname  = 'criteria_level_descriptors_criteria_id_idx'
  ) THEN
    CREATE INDEX criteria_level_descriptors_criteria_id_idx
      ON public.criteria_level_descriptors (criteria_id);
  END IF;
END $$;

-- RLS SELECT policy: org-isolation via criteria_id → criteria.organisation_id
-- Users see only descriptors for criteria belonging to their organisation.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_level_descriptors'
      AND policyname = 'criteria_level_descriptors_select'
  ) THEN
    CREATE POLICY criteria_level_descriptors_select
      ON public.criteria_level_descriptors
      FOR SELECT
      USING (
        criteria_id IN (
          SELECT c.id
          FROM public.criteria c
          WHERE c.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      );
  END IF;
END $$;

-- RLS INSERT policy: org-isolation — AI parsing inserts descriptors for org's criteria only
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_level_descriptors'
      AND policyname = 'criteria_level_descriptors_insert'
  ) THEN
    CREATE POLICY criteria_level_descriptors_insert
      ON public.criteria_level_descriptors
      FOR INSERT
      WITH CHECK (
        criteria_id IN (
          SELECT c.id
          FROM public.criteria c
          WHERE c.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- TABLE: public.mps_level_descriptors
-- Stores a descriptor text per maturity level (1–5) for each Mini Performance Standard.
-- The MPS card shows the descriptor for the aggregate level computed from criteria.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mps_level_descriptors (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  mps_id          UUID        NOT NULL REFERENCES public.mini_performance_standards(id) ON DELETE CASCADE,
  level           INTEGER     NOT NULL CHECK (level BETWEEN 1 AND 5),
  descriptor_text TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (mps_id, level)
);

ALTER TABLE public.mps_level_descriptors ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by MPS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'mps_level_descriptors'
      AND indexname  = 'mps_level_descriptors_mps_id_idx'
  ) THEN
    CREATE INDEX mps_level_descriptors_mps_id_idx
      ON public.mps_level_descriptors (mps_id);
  END IF;
END $$;

-- RLS SELECT policy: org-isolation via mps_id → mini_performance_standards.organisation_id
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'mps_level_descriptors'
      AND policyname = 'mps_level_descriptors_select'
  ) THEN
    CREATE POLICY mps_level_descriptors_select
      ON public.mps_level_descriptors
      FOR SELECT
      USING (
        mps_id IN (
          SELECT mps.id
          FROM public.mini_performance_standards mps
          WHERE mps.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      );
  END IF;
END $$;

-- RLS INSERT policy: org-isolation for MPS descriptor inserts
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'mps_level_descriptors'
      AND policyname = 'mps_level_descriptors_insert'
  ) THEN
    CREATE POLICY mps_level_descriptors_insert
      ON public.mps_level_descriptors
      FOR INSERT
      WITH CHECK (
        mps_id IN (
          SELECT mps.id
          FROM public.mini_performance_standards mps
          WHERE mps.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- TABLE: public.domain_level_descriptors
-- Stores a descriptor text per maturity level (1–5) for each domain.
-- The Domain card shows the descriptor for the aggregate level computed from MPS scores.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.domain_level_descriptors (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id       UUID        NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  level           INTEGER     NOT NULL CHECK (level BETWEEN 1 AND 5),
  descriptor_text TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (domain_id, level)
);

ALTER TABLE public.domain_level_descriptors ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by domain
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'domain_level_descriptors'
      AND indexname  = 'domain_level_descriptors_domain_id_idx'
  ) THEN
    CREATE INDEX domain_level_descriptors_domain_id_idx
      ON public.domain_level_descriptors (domain_id);
  END IF;
END $$;

-- RLS SELECT policy: org-isolation via domain_id → domains.organisation_id
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'domain_level_descriptors'
      AND policyname = 'domain_level_descriptors_select'
  ) THEN
    CREATE POLICY domain_level_descriptors_select
      ON public.domain_level_descriptors
      FOR SELECT
      USING (
        domain_id IN (
          SELECT d.id
          FROM public.domains d
          WHERE d.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      );
  END IF;
END $$;

-- RLS INSERT policy: org-isolation for domain descriptor inserts
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'domain_level_descriptors'
      AND policyname = 'domain_level_descriptors_insert'
  ) THEN
    CREATE POLICY domain_level_descriptors_insert
      ON public.domain_level_descriptors
      FOR INSERT
      WITH CHECK (
        domain_id IN (
          SELECT d.id
          FROM public.domains d
          WHERE d.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      );
  END IF;
END $$;
