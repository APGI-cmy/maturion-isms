-- MMM RLS private-helper policy reconciliation
-- Issue: #1959
-- Purpose:
--   Repair policy drift where later migrations recreated policies with unqualified
--   or public identity-helper calls after the helpers were hardened into app_private.
-- Security invariant:
--   Keep public helper RPC execution revoked. Policies call app_private helpers only.

DO $$
DECLARE
  pol record;
  new_qual text;
  new_check text;
  statement text;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname, qual, with_check
    FROM pg_policies
    WHERE
      coalesce(qual, '') ~ '(^|[^.[:alnum:]_])mmm_current_user_(org_id|role)\(\)'
      OR coalesce(with_check, '') ~ '(^|[^.[:alnum:]_])mmm_current_user_(org_id|role)\(\)'
      OR coalesce(qual, '') LIKE '%public.mmm_current_user_%'
      OR coalesce(with_check, '') LIKE '%public.mmm_current_user_%'
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

    statement := format('ALTER POLICY %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
    IF new_qual IS NOT NULL THEN
      statement := statement || format(' USING (%s)', new_qual);
    END IF;
    IF new_check IS NOT NULL THEN
      statement := statement || format(' WITH CHECK (%s)', new_check);
    END IF;
    EXECUTE statement;
  END LOOP;
END;
$$;

-- Preserve the hardened helper execution model.
REVOKE EXECUTE ON FUNCTION public.mmm_current_user_org_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mmm_current_user_role() FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.mmm_current_user_org_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.mmm_current_user_role() TO authenticated, service_role;
