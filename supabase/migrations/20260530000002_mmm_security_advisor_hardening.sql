-- =============================================================================
-- Migration: 20260530000002_mmm_security_advisor_hardening.sql
-- Wave: supabase-data-api-grants-20260530
-- Purpose:
--   Address conservative live Supabase Security Advisor findings:
--   - enable RLS on public tables flagged as exposed without RLS
--   - remove client role access from migration tracking tables
--   - convert flagged views to SECURITY INVOKER
--   - revoke anon/public EXECUTE from sensitive SECURITY DEFINER helpers
-- Author: ChatGPT delegated by Johan Ras
-- =============================================================================

ALTER TABLE IF EXISTS public.legacy_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.aimc_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.healthcheck ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.maturity_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mmm_native_migrations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.legacy_migrations FROM anon, authenticated;
REVOKE ALL ON TABLE public.aimc_migrations FROM anon, authenticated;
REVOKE ALL ON TABLE public.mmm_native_migrations FROM anon, authenticated;

DO $$
BEGIN
  IF to_regclass('public.healthcheck') IS NOT NULL THEN
    DROP POLICY IF EXISTS healthcheck_authenticated_read ON public.healthcheck;
    CREATE POLICY healthcheck_authenticated_read
      ON public.healthcheck
      FOR SELECT
      TO authenticated
      USING (true);

    GRANT SELECT ON TABLE public.healthcheck TO authenticated;
    REVOKE ALL ON TABLE public.healthcheck FROM anon;
  END IF;

  IF to_regclass('public.maturity_levels') IS NOT NULL THEN
    DROP POLICY IF EXISTS maturity_levels_authenticated_read ON public.maturity_levels;
    CREATE POLICY maturity_levels_authenticated_read
      ON public.maturity_levels
      FOR SELECT
      TO authenticated
      USING (true);

    GRANT SELECT ON TABLE public.maturity_levels TO authenticated;
    REVOKE ALL ON TABLE public.maturity_levels FROM anon;
  END IF;
END;
$$;

ALTER VIEW IF EXISTS public.responsibility_cascade SET (security_invoker = true);
ALTER VIEW IF EXISTS public.user_profiles SET (security_invoker = true);
ALTER VIEW IF EXISTS public.mps SET (security_invoker = true);
ALTER VIEW IF EXISTS public.create_report_gate SET (security_invoker = true);

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
        'handle_new_user',
        'mmm_current_user_org_id',
        'mmm_current_user_role'
      )
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM anon', fn.nspname, fn.proname, fn.args);
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC', fn.nspname, fn.proname, fn.args);
  END LOOP;
END;
$$;
