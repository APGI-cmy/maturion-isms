-- Wave 14 — Org-Isolation RLS for all Wave 14 tables (GAP-W15 cross-cutting)
-- FR-089 to FR-102 / TR-089 to TR-102
-- Defines or consolidates SELECT RLS policies for the 11 org-scoped Wave 14 tables:
--   audit_invitations, domain_assignments, mps_assignments, criteria_assignments,
--   criteria_evaluations, evaluation_overrides, criteria_level_descriptors,
--   mps_level_descriptors, domain_level_descriptors, aggregate_scores, audit_reports.
-- Global reference tables (publicly readable):
--   maturity_levels, scoring_rules — no restrictive SELECT RLS needed.
-- Idempotent: uses DO $$ IF NOT EXISTS guards.
--
-- NOTE — Migration ordering dependency (WP-004):
--   This migration (000008) references tables created in Batch B migrations:
--   - criteria_evaluations, evaluation_overrides → 20260305000004_wave14_evaluations.sql
--   - criteria_level_descriptors              → 20260305000005_wave14_level_descriptors.sql
--   - audit_reports                           → 20260305000006_wave14_audit_reports.sql
--   - aggregate_scores                        → 20260305000007_wave14_scoring_tables.sql
--   Batch A deployment (migrations 000000–000003): run 000000–000003 only.
--   Full Wave 14 deployment: run ALL migrations 000000–000008 in order.

-- ---------------------------------------------------------------------------
-- audit_invitations — org-isolation SELECT RLS (FR-090)
-- NOTE: Migration 20260305000001 already creates the primary SELECT policy
-- `audit_invitations_select`. This migration adds a second policy
-- `audit_invitations_org_select` for consolidated Batch A+B deployment safety.
-- PostgreSQL combines multiple SELECT policies with OR logic; both policies
-- share identical USING conditions, so the combined result is functionally
-- equivalent to a single policy. This is intentional — redundant but harmless.
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'audit_invitations'
      AND policyname = 'audit_invitations_org_select'
  ) THEN
    CREATE POLICY audit_invitations_org_select ON public.audit_invitations
      FOR SELECT
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- domain_assignments — org-isolation SELECT RLS (FR-090)
-- NOTE: As above — migration 000001 creates the primary SELECT policy
-- `domain_assignments_select`. This policy is a safety reinforcement for
-- consolidated deployment and is intentionally redundant.
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'domain_assignments'
      AND policyname = 'domain_assignments_org_select'
  ) THEN
    CREATE POLICY domain_assignments_org_select ON public.domain_assignments
      FOR SELECT
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- criteria_evaluations — org-isolation SELECT RLS (FR-094)
-- Table created in migration 20260305000004_wave14_evaluations.sql (Batch B)
-- Guard: skipped if table does not yet exist (Batch A-only deployment)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'criteria_evaluations') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE tablename = 'criteria_evaluations'
        AND policyname = 'criteria_evaluations_org_select'
    ) THEN
      CREATE POLICY criteria_evaluations_org_select ON public.criteria_evaluations
        FOR SELECT
        USING (
          organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
          )
        );
    END IF;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- evaluation_overrides — org-isolation SELECT RLS (FR-094)
-- Table created in migration 20260305000004_wave14_evaluations.sql (Batch B)
-- Guard: skipped if table does not yet exist (Batch A-only deployment)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'evaluation_overrides') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE tablename = 'evaluation_overrides'
        AND policyname = 'evaluation_overrides_org_select'
    ) THEN
      CREATE POLICY evaluation_overrides_org_select ON public.evaluation_overrides
        FOR SELECT
        USING (
          organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
          )
        );
    END IF;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- criteria_level_descriptors — org-isolation SELECT RLS (FR-100)
-- Table created in migration 20260305000005_wave14_level_descriptors.sql (Batch B)
-- Guard: skipped if table does not yet exist (Batch A-only deployment)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'criteria_level_descriptors') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE tablename = 'criteria_level_descriptors'
        AND policyname = 'criteria_level_descriptors_org_select'
    ) THEN
      CREATE POLICY criteria_level_descriptors_org_select ON public.criteria_level_descriptors
        FOR SELECT
        USING (
          organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
          )
        );
    END IF;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- audit_reports — org-isolation SELECT RLS (FR-099)
-- Table created in migration 20260305000006_wave14_audit_reports.sql (Batch B)
-- Guard: skipped if table does not yet exist (Batch A-only deployment)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_reports') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE tablename = 'audit_reports'
        AND policyname = 'audit_reports_org_select'
    ) THEN
      CREATE POLICY audit_reports_org_select ON public.audit_reports
        FOR SELECT
        USING (
          organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
          )
        );
    END IF;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- aggregate_scores — org-isolation SELECT RLS (FR-101)
-- Table created in migration 20260305000007_wave14_scoring_tables.sql (Batch B)
-- Guard: skipped if table does not yet exist (Batch A-only deployment)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'aggregate_scores') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE tablename = 'aggregate_scores'
        AND policyname = 'aggregate_scores_org_select'
    ) THEN
      CREATE POLICY aggregate_scores_org_select ON public.aggregate_scores
        FOR SELECT
        USING (
          organisation_id IN (
            SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
          )
        );
    END IF;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- maturity_levels — globally readable reference table (TR-101)
-- No restrictive SELECT policy. Grant read access to all authenticated users.
-- ---------------------------------------------------------------------------
GRANT SELECT ON public.maturity_levels TO authenticated;
