-- =============================================================================
-- Migration: 20260530000003_mmm_function_search_path_hardening.sql
-- Wave: supabase-advisor-warning-cleanup-20260530
-- Purpose:
--   Resolve SQL-addressable Supabase Security Advisor warnings exported on
--   2026-05-30:
--   - Function Search Path Mutable
--   - Extension in Public (vector)
--   - RLS Policy Always True on mmm_free_assessments INSERT
--   - Public Bucket Allows Listing for organisation-assets
--   - Public/authenticated direct EXECUTE on SECURITY DEFINER functions
--
-- Non-SQL follow-up:
--   - auth_leaked_password_protection must be enabled in the Supabase Auth UI.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Move vector extension out of public
-- -----------------------------------------------------------------------------
-- Supabase recommends keeping extensions out of the exposed public schema.
-- Existing vector columns keep their type OIDs; future SQL should prefer
-- extensions.vector or ensure extensions is on the migration search_path.

CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace
    WHERE e.extname = 'vector'
      AND n.nspname = 'public'
  ) THEN
    ALTER EXTENSION vector SET SCHEMA extensions;
  END IF;
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. Pin search_path for app-owned public functions flagged by Advisor
-- -----------------------------------------------------------------------------

DO $$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT
      n.nspname,
      p.proname,
      pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'mmm_prevent_audit_log_update',
        'mmm_prevent_audit_log_delete',
        'mmm_prevent_override_log_update',
        'mmm_prevent_override_log_delete',
        'mmm_set_updated_at',
        'mmm_current_user_org_id',
        'mmm_current_user_role',
        'cascade_exclude_to_children',
        'set_updated_at_ai_data_sources',
        'record_onboarding_complete',
        'handle_new_user',
        'parse_write_back_atomic'
      )
  LOOP
    EXECUTE format(
      'ALTER FUNCTION %I.%I(%s) SET search_path = public, auth, storage, extensions, pg_temp',
      fn.nspname,
      fn.proname,
      fn.args
    );
  END LOOP;
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. Move RLS helper execution to a non-exposed private schema
-- -----------------------------------------------------------------------------
-- The public SECURITY DEFINER helpers must not be directly executable through
-- /rest/v1/rpc/*. Policies still need helper execution, so equivalent helpers
-- are created in app_private and policies are rewritten to reference them.

CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
REVOKE ALL ON SCHEMA app_private FROM anon;
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app_private.mmm_current_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
  SELECT organisation_id
  FROM public.mmm_profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION app_private.mmm_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
  SELECT role
  FROM public.mmm_profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION app_private.mmm_current_user_org_id() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION app_private.mmm_current_user_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app_private.mmm_current_user_org_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.mmm_current_user_role() TO authenticated, service_role;

DO $$
DECLARE
  pol record;
  new_qual text;
  new_check text;
  sql text;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        coalesce(qual, '') LIKE '%mmm_current_user_%'
        OR coalesce(with_check, '') LIKE '%mmm_current_user_%'
      )
  LOOP
    new_qual := pol.qual;
    new_check := pol.with_check;

    IF new_qual IS NOT NULL THEN
      new_qual := replace(new_qual, 'public.mmm_current_user_org_id()', 'app_private.mmm_current_user_org_id()');
      new_qual := replace(new_qual, 'public.mmm_current_user_role()', 'app_private.mmm_current_user_role()');
      new_qual := regexp_replace(new_qual, '(^|[^.[:alnum:]_])mmm_current_user_org_id\(\)', '\1app_private.mmm_current_user_org_id()', 'g');
      new_qual := regexp_replace(new_qual, '(^|[^.[:alnum:]_])mmm_current_user_role\(\)', '\1app_private.mmm_current_user_role()', 'g');
    END IF;

    IF new_check IS NOT NULL THEN
      new_check := replace(new_check, 'public.mmm_current_user_org_id()', 'app_private.mmm_current_user_org_id()');
      new_check := replace(new_check, 'public.mmm_current_user_role()', 'app_private.mmm_current_user_role()');
      new_check := regexp_replace(new_check, '(^|[^.[:alnum:]_])mmm_current_user_org_id\(\)', '\1app_private.mmm_current_user_org_id()', 'g');
      new_check := regexp_replace(new_check, '(^|[^.[:alnum:]_])mmm_current_user_role\(\)', '\1app_private.mmm_current_user_role()', 'g');
    END IF;

    sql := format('ALTER POLICY %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);

    IF new_qual IS NOT NULL THEN
      sql := sql || format(' USING (%s)', new_qual);
    END IF;

    IF new_check IS NOT NULL THEN
      sql := sql || format(' WITH CHECK (%s)', new_check);
    END IF;

    EXECUTE sql;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.mmm_current_user_org_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mmm_current_user_role() FROM PUBLIC, anon, authenticated;

-- -----------------------------------------------------------------------------
-- 4. Revoke direct RPC execution for SECURITY DEFINER functions not intended as
--    public/authenticated RPC endpoints
-- -----------------------------------------------------------------------------

DO $$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT
      n.nspname,
      p.proname,
      pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'mmm_prevent_audit_log_update',
        'mmm_prevent_audit_log_delete',
        'mmm_prevent_override_log_update',
        'mmm_prevent_override_log_delete',
        'record_onboarding_complete',
        'handle_new_user',
        'parse_write_back_atomic'
      )
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC', fn.nspname, fn.proname, fn.args);
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM anon', fn.nspname, fn.proname, fn.args);
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM authenticated', fn.nspname, fn.proname, fn.args);

    -- The atomic parser RPC is invoked by the Edge Function with service-role
    -- privileges; keep service-role execution while removing direct client RPC.
    IF fn.proname = 'parse_write_back_atomic' THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %I.%I(%s) TO service_role', fn.nspname, fn.proname, fn.args);
    END IF;
  END LOOP;
END;
$$;

-- -----------------------------------------------------------------------------
-- 5. Replace overly broad public INSERT policy on mmm_free_assessments
-- -----------------------------------------------------------------------------
-- Keep public assessment submission possible, but make the RLS check meaningful
-- rather than WITH CHECK (true). The Edge Function uses service_role and is not
-- restricted by this client-role policy.

DROP POLICY IF EXISTS "mmm_free_assessments_insert_public" ON public.mmm_free_assessments;
CREATE POLICY "mmm_free_assessments_insert_public"
  ON public.mmm_free_assessments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    session_token IS NOT NULL
    AND length(session_token) BETWEEN 16 AND 128
    AND status = 'IN_PROGRESS'
    AND responses IS NOT NULL
    AND jsonb_typeof(responses) = 'object'
    AND baseline_result IS NOT NULL
    AND jsonb_typeof(baseline_result) = 'object'
  );

-- -----------------------------------------------------------------------------
-- 6. Remove broad listing policy from public organisation-assets bucket
-- -----------------------------------------------------------------------------
-- Public bucket object URLs do not require a broad SELECT/list policy on
-- storage.objects. Dropping this policy prevents clients listing all files.

DROP POLICY IF EXISTS organisation_assets_public_read ON storage.objects;
