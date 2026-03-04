-- Wave postbuild-fails-02: Fix RLS policies for remaining 8 tables (GAP-006 to GAP-013)
-- Issue: #897 — TASK-PBF2-005
-- Incident gaps: GAP-006 (organisations), GAP-007 (domains), GAP-008 (mini_performance_standards),
--                GAP-009 (criteria), GAP-010 (evidence), GAP-011 (scores),
--                GAP-012 (organisation_settings), GAP-013 (audit_scores)
-- Idempotent: all policy additions use IF NOT EXISTS guards via DO $$ BEGIN ... END $$
-- RLS is ALREADY ENABLED on all 8 tables (confirmed per supabase-sync-audit-20260304.md).
-- Prior wave policies (profiles_*, audits_insert_authenticated) are NOT redeclared here.

-- ─────────────────────────────────────────────────────────────────
-- GAP-006: organisations — INSERT + UPDATE policies
-- Table: public.organisations (id, name, created_at, updated_at)
-- Isolation model: UPDATE scoped to user's own organisation via profiles join.
--   INSERT: any authenticated user may create a new organisation (sign-up/onboarding flow).
--   UPDATE: user may only update the organisation they belong to.
-- ─────────────────────────────────────────────────────────────────

-- INSERT: authenticated user may create an organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'organisations'
      AND policyname = 'organisations_insert_authenticated'
  ) THEN
    CREATE POLICY organisations_insert_authenticated ON public.organisations
      FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- UPDATE: user may only update their own organisation (the one they are a member of)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'organisations'
      AND policyname = 'organisations_update_own'
  ) THEN
    CREATE POLICY organisations_update_own ON public.organisations
      FOR UPDATE
      USING (
        id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      )
      WITH CHECK (
        id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────
-- GAP-007: domains — INSERT + UPDATE policies
-- Table: public.domains (id, audit_id, organisation_id, ...)
-- Isolation model: org-isolation via profiles → organisation_id join.
--   Both INSERT and UPDATE are scoped to rows belonging to the user's organisation.
-- ─────────────────────────────────────────────────────────────────

-- INSERT: user may insert a domain for their own organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'domains'
      AND policyname = 'domains_insert_org_isolation'
  ) THEN
    CREATE POLICY domains_insert_org_isolation ON public.domains
      FOR INSERT
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- UPDATE: user may only update domains belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'domains'
      AND policyname = 'domains_update_org_isolation'
  ) THEN
    CREATE POLICY domains_update_org_isolation ON public.domains
      FOR UPDATE
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      )
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────
-- GAP-008: mini_performance_standards — SELECT org-isolation policy ONLY
-- Table: public.mini_performance_standards (id, domain_id, audit_id, organisation_id, ...)
-- IMPORTANT: This is a reference/lookup table. Write access is service_role-only.
-- Application users (anon / authenticated) MUST NOT have INSERT or UPDATE policies.
-- Schema-level enforcement: only service_role key (bypasses RLS) may write to this table.
-- Ref: MINI_PERFORMANCE_STANDARDS_SPECIAL_RULE (iaa-prebrief-wave-postbuild-fails-02.md)
-- ─────────────────────────────────────────────────────────────────

-- SELECT: org-isolated read access for authenticated users
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'mini_performance_standards'
      AND policyname = 'mini_performance_standards_select_org_isolation'
  ) THEN
    CREATE POLICY mini_performance_standards_select_org_isolation ON public.mini_performance_standards
      FOR SELECT
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- NO INSERT or UPDATE policies added for mini_performance_standards.
-- Writes are managed exclusively by service_role key (bypasses RLS).

-- ─────────────────────────────────────────────────────────────────
-- GAP-009: criteria — INSERT + UPDATE policies
-- Table: public.criteria (id, mps_id, domain_id, audit_id, organisation_id, ...)
-- Isolation model: org-isolation via profiles → organisation_id join.
-- ─────────────────────────────────────────────────────────────────

-- INSERT: user may insert criteria for their own organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria'
      AND policyname = 'criteria_insert_org_isolation'
  ) THEN
    CREATE POLICY criteria_insert_org_isolation ON public.criteria
      FOR INSERT
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- UPDATE: user may only update criteria belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria'
      AND policyname = 'criteria_update_org_isolation'
  ) THEN
    CREATE POLICY criteria_update_org_isolation ON public.criteria
      FOR UPDATE
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      )
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────
-- GAP-010: evidence — INSERT + UPDATE + DELETE policies
-- Table: public.evidence (id, criterion_id, audit_id, organisation_id, created_by, ...)
-- Isolation model:
--   INSERT: org-scoped; authenticated user can insert for their org.
--   UPDATE: owner-scoped (created_by = auth.uid()); user may only update their own evidence.
--   DELETE: owner-scoped (created_by = auth.uid()); user may only delete their own evidence.
-- Hooks: useUploadEvidence (INSERT), useDeleteEvidence (DELETE); UPDATE via direct supabase call.
-- ─────────────────────────────────────────────────────────────────

-- INSERT: authenticated user may create evidence for their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'evidence'
      AND policyname = 'evidence_insert_authenticated'
  ) THEN
    CREATE POLICY evidence_insert_authenticated ON public.evidence
      FOR INSERT
      WITH CHECK (
        auth.role() = 'authenticated'
        AND organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- UPDATE: user may only update evidence they created
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'evidence'
      AND policyname = 'evidence_update_own'
  ) THEN
    CREATE POLICY evidence_update_own ON public.evidence
      FOR UPDATE
      USING (created_by = auth.uid())
      WITH CHECK (created_by = auth.uid());
  END IF;
END $$;

-- DELETE: user may only delete evidence they created
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'evidence'
      AND policyname = 'evidence_delete_own'
  ) THEN
    CREATE POLICY evidence_delete_own ON public.evidence
      FOR DELETE
      USING (created_by = auth.uid());
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────
-- GAP-011: scores — INSERT + UPDATE policies
-- Table: public.scores (id, criterion_id, audit_id, organisation_id, confirmed_by, ...)
-- Isolation model: org-isolation for both INSERT and UPDATE.
--   AI scoring (via Edge Function / service_role) bypasses RLS.
--   Human confirmation/override (useConfirmScore, useOverrideScore) uses authenticated key → RLS applies.
-- ─────────────────────────────────────────────────────────────────

-- INSERT: authenticated user may insert a score for their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'scores'
      AND policyname = 'scores_insert_authenticated'
  ) THEN
    CREATE POLICY scores_insert_authenticated ON public.scores
      FOR INSERT
      WITH CHECK (
        auth.role() = 'authenticated'
        AND organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- UPDATE: user may only update scores belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'scores'
      AND policyname = 'scores_update_own'
  ) THEN
    CREATE POLICY scores_update_own ON public.scores
      FOR UPDATE
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      )
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────
-- GAP-012: organisation_settings — INSERT + UPDATE policies
-- Table: public.organisation_settings (id → FK to organisations.id, name, ...)
-- Isolation model: id column IS the organisation_id FK.
--   Policies check id (which equals organisation_id) against profiles join.
-- Hook: useSettings.ts — upsert() on organisation_settings
-- ─────────────────────────────────────────────────────────────────

-- INSERT: user may insert settings for their own organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'organisation_settings'
      AND policyname = 'organisation_settings_insert_org_isolation'
  ) THEN
    CREATE POLICY organisation_settings_insert_org_isolation ON public.organisation_settings
      FOR INSERT
      WITH CHECK (
        id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- UPDATE: user may only update settings for their own organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'organisation_settings'
      AND policyname = 'organisation_settings_update_org_isolation'
  ) THEN
    CREATE POLICY organisation_settings_update_org_isolation ON public.organisation_settings
      FOR UPDATE
      USING (
        id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      )
      WITH CHECK (
        id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────
-- GAP-013: audit_scores — INSERT + UPDATE policies
-- Table: public.audit_scores (id, audit_id, organisation_id, scored_by, ...)
-- Isolation model: org-isolation for both INSERT and UPDATE.
-- Hook: useAuditMetrics.ts — SELECT only; useScoring.ts / AI edge functions insert scores.
-- ─────────────────────────────────────────────────────────────────

-- INSERT: authenticated user may insert an audit score for their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_scores'
      AND policyname = 'audit_scores_insert_authenticated'
  ) THEN
    CREATE POLICY audit_scores_insert_authenticated ON public.audit_scores
      FOR INSERT
      WITH CHECK (
        auth.role() = 'authenticated'
        AND organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- UPDATE: user may only update audit scores belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_scores'
      AND policyname = 'audit_scores_update_own'
  ) THEN
    CREATE POLICY audit_scores_update_own ON public.audit_scores
      FOR UPDATE
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      )
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;
