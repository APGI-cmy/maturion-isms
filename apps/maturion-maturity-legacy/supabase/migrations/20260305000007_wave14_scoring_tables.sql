-- Wave 14 — Scoring Tables and Default Rule (GAP-W13)
-- FR-101 / TR-101
-- Issue #909 — TASK-W14-BC-002
-- Architecture ref: modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W13
--
-- Creates three tables for the Wave 14 maturity scoring pipeline:
--
--   public.maturity_levels  — global reference table (5 named levels, publicly readable)
--   public.scoring_rules    — per-org aggregation config; organisation_id = NULL = global default
--   public.aggregate_scores — computed maturity scores per audit scope (criteria/MPS/domain/overall)
--
-- Seed data:
--   - 5 maturity_levels rows (Basic through Resilient)
--   - 1 global default scoring_rules row (organisation_id = NULL, aggregation_method = 'weighted_average')
--
-- Fallback strategy (graceful failure — TR-101):
--   Queries SHOULD use: ORDER BY organisation_id NULLS LAST LIMIT 1
--   This returns the per-org rule if one exists, otherwise COALESCE falls back to
--   the global default (organisation_id IS NULL). If no rule is found at all,
--   the compute function must RAISE an exception rather than silently compute wrong scores.
--   COALESCE(per_org_rule.aggregation_method, global_rule.aggregation_method) ensures
--   safe fallback at query time.
--
-- RLS:
--   - maturity_levels: GRANT SELECT to authenticated (globally readable reference data)
--   - scoring_rules: SELECT for all authenticated (global default visible to all orgs)
--   - aggregate_scores: org-isolation SELECT via audit_id → audits.organisation_id
--
-- NOTE — NULL UNIQUE semantics (aggregate_scores):
--   The UNIQUE constraint on (audit_id, level_type, scope_id) where scope_id is NULLABLE
--   leverages PostgreSQL's standard behaviour: NULLs in UNIQUE constraints are treated as
--   distinct from each other. This is intentional — scope_id = NULL represents the overall
--   (audit-level) aggregate score, and multiple overall scores are NOT expected. In practice
--   scope_id will be NULL only for the overall score row, so uniqueness is preserved.
--   ON CONFLICT (audit_id, level_type, scope_id) DO UPDATE is the intended UPSERT pattern.
--
-- Migration is idempotent: CREATE TABLE IF NOT EXISTS, ON CONFLICT DO NOTHING for seed data,
-- DO $$ IF NOT EXISTS for policies.

-- ---------------------------------------------------------------------------
-- TABLE: public.maturity_levels
-- Global reference table mapping maturity level names to numeric values (1–5).
-- The frontend queries this table to avoid hardcoding numeric level values.
-- No org-isolation required — this is static reference data.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.maturity_levels (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT    NOT NULL,
  level_number INTEGER NOT NULL,
  description  TEXT,
  UNIQUE (level_number)
);

-- Seed: 5 maturity levels (Basic through Resilient)
-- ON CONFLICT DO NOTHING ensures idempotency across re-runs.
INSERT INTO public.maturity_levels (name, level_number, description) VALUES
  ('Basic',     1, 'Foundational controls in place'),
  ('Reactive',  2, 'Responding to incidents as they occur'),
  ('Compliant', 3, 'Meeting baseline compliance requirements'),
  ('Proactive', 4, 'Anticipating and preventing issues'),
  ('Resilient', 5, 'Continuously improving and adapting')
ON CONFLICT (level_number) DO NOTHING;

-- GRANT SELECT to authenticated users — globally readable reference data (TR-101)
-- Consolidated in migration 20260305000008_wave14_new_tables_rls.sql as well.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'maturity_levels'
  ) THEN
    EXECUTE 'GRANT SELECT ON public.maturity_levels TO authenticated';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- TABLE: public.scoring_rules
-- Stores the aggregation configuration used when computing maturity scores.
-- organisation_id = NULL   → global default (applies to all orgs with no override)
-- organisation_id = <uuid> → per-org override (takes precedence over global default)
--
-- Query pattern for graceful fallback (TR-101):
--   SELECT aggregation_method
--   FROM public.scoring_rules
--   WHERE organisation_id = $org_id OR organisation_id IS NULL
--   ORDER BY organisation_id NULLS LAST
--   LIMIT 1
--
-- This ensures:
--   1. Per-org rule is returned first (organisation_id IS NOT NULL sorts before NULL)
--   2. Global default returned if no per-org rule exists (NULLS LAST)
--   3. If neither exists, COALESCE / RAISE exception in the caller
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scoring_rules (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id     UUID        REFERENCES public.organisations(id) ON DELETE CASCADE,
  aggregation_method  TEXT        NOT NULL DEFAULT 'weighted_average',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Global default scoring rule: organisation_id = NULL, aggregation_method = 'weighted_average'
-- Idempotent: WHERE NOT EXISTS guard prevents duplicate global default rows.
INSERT INTO public.scoring_rules (organisation_id, aggregation_method)
SELECT NULL, 'weighted_average'
WHERE NOT EXISTS (
  SELECT 1 FROM public.scoring_rules WHERE organisation_id IS NULL
);

-- RLS: scoring_rules is readable by all authenticated users.
-- Global default (organisation_id IS NULL) must be accessible to every org at report time.
-- Per-org rows are also readable (org-level queries use the same fallback pattern).
ALTER TABLE public.scoring_rules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'scoring_rules'
      AND policyname = 'scoring_rules_select'
  ) THEN
    CREATE POLICY scoring_rules_select
      ON public.scoring_rules
      FOR SELECT
      USING (
        -- Global default (organisation_id IS NULL) is visible to all authenticated users.
        -- Per-org rows are visible to users in that org.
        -- COALESCE fallback: caller uses ORDER BY organisation_id NULLS LAST LIMIT 1.
        organisation_id IS NULL
        OR organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
        )
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- TABLE: public.aggregate_scores
-- Stores computed maturity scores per audit, per scope.
-- level_type: 'criteria' | 'mps' | 'domain' | 'overall'
-- scope_id:   FK to the entity being scored (NULL for overall/audit-level score)
--
-- UNIQUE (audit_id, level_type, scope_id) enables ON CONFLICT DO UPDATE (UPSERT).
-- NOTE — NULL scope_id: PostgreSQL treats NULLs as distinct in UNIQUE constraints.
-- For the 'overall' level_type (scope_id = NULL), only one overall score per audit
-- is expected. Application code must use ON CONFLICT DO UPDATE to handle re-computation.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.aggregate_scores (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id    UUID        NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  level_type  TEXT        NOT NULL,
  scope_id    UUID,
  score       NUMERIC(5,2),
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (audit_id, level_type, scope_id)
);

ALTER TABLE public.aggregate_scores ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by audit
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'aggregate_scores'
      AND indexname  = 'aggregate_scores_audit_id_idx'
  ) THEN
    CREATE INDEX aggregate_scores_audit_id_idx
      ON public.aggregate_scores (audit_id);
  END IF;
END $$;

-- RLS SELECT policy: org-isolation via audit_id → audits.organisation_id
-- Users see only scores for audits belonging to their organisation.
-- Consolidated in migration 20260305000008_wave14_new_tables_rls.sql as well.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'aggregate_scores'
      AND policyname = 'aggregate_scores_select'
  ) THEN
    CREATE POLICY aggregate_scores_select
      ON public.aggregate_scores
      FOR SELECT
      USING (
        audit_id IN (
          SELECT a.id
          FROM public.audits a
          WHERE a.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      );
  END IF;
END $$;

-- RLS INSERT policy: org-isolation — scoring compute function inserts only for own org's audits
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'aggregate_scores'
      AND policyname = 'aggregate_scores_insert'
  ) THEN
    CREATE POLICY aggregate_scores_insert
      ON public.aggregate_scores
      FOR INSERT
      WITH CHECK (
        audit_id IN (
          SELECT a.id
          FROM public.audits a
          WHERE a.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      );
  END IF;
END $$;

-- RLS UPDATE policy: org-isolation — re-computation updates only org's own scores
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'aggregate_scores'
      AND policyname = 'aggregate_scores_update'
  ) THEN
    CREATE POLICY aggregate_scores_update
      ON public.aggregate_scores
      FOR UPDATE
      USING (
        audit_id IN (
          SELECT a.id
          FROM public.audits a
          WHERE a.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      )
      WITH CHECK (
        audit_id IN (
          SELECT a.id
          FROM public.audits a
          WHERE a.organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE id = auth.uid()
          )
        )
      );
  END IF;
END $$;
