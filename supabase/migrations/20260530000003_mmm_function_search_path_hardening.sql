-- =============================================================================
-- Migration: 20260530000003_mmm_function_search_path_hardening.sql
-- Wave: supabase-advisor-warning-cleanup-20260530
-- Purpose:
--   Resolve Supabase Security Advisor "Function Search Path Mutable" warnings
--   for known public application functions by pinning an explicit search_path.
--
-- Notes:
--   - This migration intentionally targets application-owned functions only.
--   - It avoids blanket ALTERs on extension-owned functions in public.
--   - SECURITY DEFINER helper functions keep access to public/auth/storage as
--     needed for RLS policies, triggers, auth.uid(), and storage metadata usage.
-- =============================================================================

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
        'handle_new_user'
      )
  LOOP
    EXECUTE format(
      'ALTER FUNCTION %I.%I(%s) SET search_path = public, auth, storage, pg_temp',
      fn.nspname,
      fn.proname,
      fn.args
    );
  END LOOP;
END;
$$;
