-- ─────────────────────────────────────────────────────────────────────────────
-- Wave postbuild-fails-03: Fix current_setting RLS policies — replace with auth.uid()
-- Issue: TASK-PBF3-005
-- Wave: postbuild-fails-03 — MAT App: current_setting RLS Fix + Storage Path Prefix
--
-- Background:
--   Migration 20260302000000_mat_core_tables.sql created three policies using
--   current_setting('app.current_organisation_id', true) — a Postgres session variable
--   that is NEVER set by the Supabase JS SDK client. This causes ALL SELECT/UPDATE/DELETE
--   operations on audits, domains, and criteria to fail for authenticated users.
--
--   Additionally, the organisations table has RLS ENABLED but no SELECT policy,
--   making it completely inaccessible to authenticated users.
--
-- What this migration does:
--   1. Drops the broken current_setting-based policies (audits_org_isolation,
--      domains_org_isolation, criteria_org_isolation)
--   2. Adds correct SELECT policies using auth.uid() + profiles JOIN for org isolation
--      on audits, domains, and criteria tables
--   3. Adds correct UPDATE/DELETE policies for audits using auth.uid()
--   4. Adds SELECT policy on organisations table (organisations_select_own)
--
-- What this migration does NOT do:
--   - Does NOT re-add INSERT/UPDATE policies for domains or criteria (already present
--     from migration 20260304000004_fix_rls_remaining_tables.sql)
--
-- Idempotent: DROP POLICY uses IF EXISTS; CREATE POLICY statements use
--   DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies ...) THEN ... END IF; END $$
-- ─────────────────────────────────────────────────────────────────────────────


-- ─────────────────────────────────────────────────────────────────
-- 1. Fix audits table RLS
-- Drop broken current_setting policy and replace with auth.uid()-based policies
-- ─────────────────────────────────────────────────────────────────

-- Drop the broken current_setting-based policy
DROP POLICY IF EXISTS audits_org_isolation ON public.audits;

-- SELECT: user may only read audits belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audits'
      AND policyname = 'audits_select_org_isolation'
  ) THEN
    CREATE POLICY audits_select_org_isolation ON public.audits
      AS PERMISSIVE FOR SELECT
      TO authenticated
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- UPDATE: user may only update audits belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audits'
      AND policyname = 'audits_update_org_isolation'
  ) THEN
    CREATE POLICY audits_update_org_isolation ON public.audits
      AS PERMISSIVE FOR UPDATE
      TO authenticated
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      )
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- DELETE: user may only delete audits belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audits'
      AND policyname = 'audits_delete_org_isolation'
  ) THEN
    CREATE POLICY audits_delete_org_isolation ON public.audits
      AS PERMISSIVE FOR DELETE
      TO authenticated
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────
-- 2. Fix domains table RLS
-- Drop broken current_setting policy and replace with auth.uid()-based SELECT policy.
-- NOTE: INSERT (domains_insert_org_isolation) and UPDATE (domains_update_org_isolation)
-- policies were already added by migration 20260304000004_fix_rls_remaining_tables.sql
-- and are NOT redeclared here.
-- ─────────────────────────────────────────────────────────────────

-- Drop the broken current_setting-based policy
DROP POLICY IF EXISTS domains_org_isolation ON public.domains;

-- SELECT: user may only read domains belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'domains'
      AND policyname = 'domains_select_org_isolation'
  ) THEN
    CREATE POLICY domains_select_org_isolation ON public.domains
      AS PERMISSIVE FOR SELECT
      TO authenticated
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────
-- 3. Fix criteria table RLS
-- Drop broken current_setting policy and replace with auth.uid()-based SELECT policy.
-- NOTE: INSERT (criteria_insert_org_isolation) and UPDATE (criteria_update_org_isolation)
-- policies were already added by migration 20260304000004_fix_rls_remaining_tables.sql
-- and are NOT redeclared here.
-- ─────────────────────────────────────────────────────────────────

-- Drop the broken current_setting-based policy
DROP POLICY IF EXISTS criteria_org_isolation ON public.criteria;

-- SELECT: user may only read criteria belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria'
      AND policyname = 'criteria_select_org_isolation'
  ) THEN
    CREATE POLICY criteria_select_org_isolation ON public.criteria
      AS PERMISSIVE FOR SELECT
      TO authenticated
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────
-- 4. Add organisations SELECT policy
-- The organisations table had RLS enabled but NO SELECT policy,
-- making it completely inaccessible to authenticated users.
-- ─────────────────────────────────────────────────────────────────

-- SELECT: user may only read their own organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'organisations'
      AND policyname = 'organisations_select_own'
  ) THEN
    CREATE POLICY organisations_select_own ON public.organisations
      AS PERMISSIVE FOR SELECT
      TO authenticated
      USING (
        id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;
