BEGIN;
SET LOCAL ROLE postgres;
INSERT INTO public.mmm_organisations(id,name,slug,tier) VALUES
 ('10000000-0000-0000-0000-000000000001','Org one','test-one','FREE'),
 ('10000000-0000-0000-0000-000000000002','Org two','test-two','FREE');
INSERT INTO public.mmm_profiles(id,organisation_id,role) VALUES
 ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','ADMIN'),
 ('00000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','ADMIN');
INSERT INTO public.mmm_frameworks(id,organisation_id,name,status) VALUES
 ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','Other framework','DRAFT');
INSERT INTO auth.users(id,email) VALUES
 ('00000000-0000-0000-0000-000000000101','pit-one@example.test'),
 ('00000000-0000-0000-0000-000000000102','pit-two@example.test');
INSERT INTO public.organisations(id,name) VALUES
 ('30000000-0000-0000-0000-000000000001','PIT org one'),
 ('30000000-0000-0000-0000-000000000002','PIT org two');
UPDATE public.profiles SET organisation_id = '30000000-0000-0000-0000-000000000001', role = 'lead_auditor'
 WHERE id = '00000000-0000-0000-0000-000000000101';
UPDATE public.profiles SET organisation_id = '30000000-0000-0000-0000-000000000002', role = 'lead_auditor'
 WHERE id = '00000000-0000-0000-0000-000000000102';
INSERT INTO public.user_org_memberships(user_id,org_id,status) VALUES
 ('00000000-0000-0000-0000-000000000101','30000000-0000-0000-0000-000000000001','active'),
 ('00000000-0000-0000-0000-000000000102','30000000-0000-0000-0000-000000000002','active');
INSERT INTO public.user_roles(user_id,org_id,role) VALUES
 ('00000000-0000-0000-0000-000000000101','30000000-0000-0000-0000-000000000001','project_manager'),
 ('00000000-0000-0000-0000-000000000102','30000000-0000-0000-0000-000000000002','contributor');
SET LOCAL request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
SET LOCAL request.jwt.claim.role = 'authenticated';
SET LOCAL ROLE authenticated;
INSERT INTO public.mmm_frameworks(id,organisation_id,name,status) VALUES
 ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Own framework','DRAFT');
INSERT INTO public.mmm_approval_rounds(organisation_id,framework_id,approval_level,submitted_by_user_id)
 VALUES ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','level_2',auth.uid());
DO $$ BEGIN
 IF (SELECT count(*) FROM public.mmm_frameworks) <> 1 THEN RAISE EXCEPTION 'Organisation isolation failed'; END IF;
 IF (SELECT count(*) FROM public.mmm_approval_rounds) <> 1 THEN RAISE EXCEPTION 'Approval reads failed'; END IF;
 BEGIN
  INSERT INTO public.mmm_frameworks(organisation_id,name,status) VALUES ('10000000-0000-0000-0000-000000000002','Forbidden','DRAFT');
  RAISE EXCEPTION 'Cross-org write unexpectedly allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SET LOCAL request.jwt.claim.sub = '00000000-0000-0000-0000-000000000101';
DO $security_regressions$
DECLARE
 new_project_id uuid;
 updated_description text;
BEGIN
 BEGIN
   PERFORM public.pit_is_org_member('30000000-0000-0000-0000-000000000002');
   RAISE EXCEPTION 'Authenticated caller invoked public PIT membership oracle';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
   PERFORM public.pit_has_org_role('30000000-0000-0000-0000-000000000002', ARRAY['org_admin']);
   RAISE EXCEPTION 'Authenticated caller invoked public PIT role oracle';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
   PERFORM public.pit_is_cs2_admin();
   RAISE EXCEPTION 'Authenticated caller invoked public PIT administrator oracle';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
   PERFORM public.mmm_current_user_org_id();
   RAISE EXCEPTION 'Authenticated caller invoked public MMM organisation helper';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
   PERFORM public.mmm_current_user_role();
   RAISE EXCEPTION 'Authenticated caller invoked public MMM role helper';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;

 SELECT (public.pit_create_project(
   '30000000-0000-0000-0000-000000000001',
   'Controlled RPC project',
   'project',
   'quick_win',
   'Project created through the approved RPC',
   'Project leader',
   '2026-01-01',
   '2026-12-31',
   'manual'
 )->>'id')::uuid INTO new_project_id;

 SELECT (public.pit_update_project(
   new_project_id,
   '30000000-0000-0000-0000-000000000001',
   '{"description":"Updated through the approved RPC"}'::jsonb
 )->>'description') INTO updated_description;
 IF updated_description <> 'Updated through the approved RPC' THEN
   RAISE EXCEPTION 'Approved PIT update RPC did not complete';
 END IF;

 BEGIN
   PERFORM public.pit_create_project(
     '30000000-0000-0000-0000-000000000002',
     'Unauthorised RPC project',
     'project',
     'quick_win',
     'Must be denied',
     'Project leader',
     '2026-01-01',
     '2026-12-31',
     'manual'
   );
   RAISE EXCEPTION 'Unauthorised PIT project RPC unexpectedly allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END
$security_regressions$;
SET LOCAL ROLE postgres;
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['projects','source_links'] LOOP
  -- PostgreSQL 17: a comma-separated privilege list returns true if ANY listed
  -- privilege is held. Keep this OR-style assertion intact:
  -- https://www.postgresql.org/docs/17/functions-info.html#FUNCTIONS-INFO-ACCESS
  IF NOT has_table_privilege('authenticated',format('public.%I',t),'SELECT') OR has_table_privilege('authenticated',format('public.%I',t),'INSERT,UPDATE,DELETE') THEN
   RAISE EXCEPTION 'PIT RPC-only mutation boundary changed for %',t;
  END IF;
 END LOOP;
 IF has_function_privilege('authenticated','public.mmm_current_user_org_id()','EXECUTE')
    OR has_function_privilege('authenticated','public.mmm_current_user_role()','EXECUTE')
    OR has_function_privilege('authenticated','public.pit_is_org_member(uuid)','EXECUTE')
    OR has_function_privilege('authenticated','public.pit_has_org_role(uuid,text[])','EXECUTE')
    OR has_function_privilege('authenticated','public.pit_is_cs2_admin()','EXECUTE') THEN
   RAISE EXCEPTION 'An authenticated role can execute a public helper, including through an effective PUBLIC grant';
 END IF;
 IF NOT has_schema_privilege('authenticated','app_private','USAGE')
    OR NOT has_function_privilege('authenticated','app_private.mmm_current_user_org_id()','EXECUTE')
    OR NOT has_function_privilege('authenticated','app_private.mmm_current_user_role()','EXECUTE')
    OR NOT has_function_privilege('authenticated','app_private.pit_is_org_member(uuid)','EXECUTE')
    OR NOT has_function_privilege('authenticated','app_private.pit_has_org_role(uuid,text[])','EXECUTE')
    OR NOT has_function_privilege('authenticated','app_private.pit_is_cs2_admin()','EXECUTE') THEN
   RAISE EXCEPTION 'Private helper execution required by RLS policies is unavailable';
 END IF;
 IF has_function_privilege('anon','public.pit_is_org_member(uuid)','EXECUTE')
    OR has_function_privilege('anon','public.mmm_current_user_org_id()','EXECUTE') THEN
   RAISE EXCEPTION 'Anonymous role can execute an organisation helper';
 END IF;
 IF EXISTS (
   SELECT 1 FROM pg_policies
   WHERE (coalesce(qual,'') LIKE '%mmm_current_user_org_id%'
       AND coalesce(qual,'') NOT LIKE '%app_private.mmm_current_user_org_id%')
      OR (coalesce(qual,'') LIKE '%mmm_current_user_role%'
       AND coalesce(qual,'') NOT LIKE '%app_private.mmm_current_user_role%')
      OR (coalesce(qual,'') LIKE '%pit_is_cs2_admin%'
       AND coalesce(qual,'') NOT LIKE '%app_private.pit_is_cs2_admin%')
      OR (coalesce(qual,'') LIKE '%pit_is_org_member%'
       AND coalesce(qual,'') NOT LIKE '%app_private.pit_is_org_member%')
      OR (coalesce(qual,'') LIKE '%pit_has_org_role%'
       AND coalesce(qual,'') NOT LIKE '%app_private.pit_has_org_role%')
      OR (coalesce(with_check,'') LIKE '%mmm_current_user_org_id%'
       AND coalesce(with_check,'') NOT LIKE '%app_private.mmm_current_user_org_id%')
      OR (coalesce(with_check,'') LIKE '%mmm_current_user_role%'
       AND coalesce(with_check,'') NOT LIKE '%app_private.mmm_current_user_role%')
      OR (coalesce(with_check,'') LIKE '%pit_is_cs2_admin%'
       AND coalesce(with_check,'') NOT LIKE '%app_private.pit_is_cs2_admin%')
      OR (coalesce(with_check,'') LIKE '%pit_is_org_member%'
       AND coalesce(with_check,'') NOT LIKE '%app_private.pit_is_org_member%')
      OR (coalesce(with_check,'') LIKE '%pit_has_org_role%'
       AND coalesce(with_check,'') NOT LIKE '%app_private.pit_has_org_role%')
 ) THEN
   RAISE EXCEPTION 'An RLS policy still calls a helper outside app_private';
 END IF;
 IF NOT has_function_privilege('authenticated','public.pit_create_project(uuid,text,text,text,text,text,date,date,text,text,numeric,numeric,text)','EXECUTE')
    OR NOT has_function_privilege('authenticated','public.pit_update_project(uuid,uuid,jsonb)','EXECUTE')
    OR has_function_privilege('anon','public.pit_create_project(uuid,text,text,text,text,text,date,date,text,text,numeric,numeric,text)','EXECUTE')
    OR has_function_privilege('anon','public.pit_update_project(uuid,uuid,jsonb)','EXECUTE') THEN
   RAISE EXCEPTION 'The reviewed PIT project RPC execution boundary changed';
 END IF;
 FOREACH t IN ARRAY ARRAY['mmm_approval_rounds','mmm_approval_approvers','mmm_approval_invitations','mmm_approval_proposed_changes','mmm_approval_comments','mmm_approval_locks','mmm_approval_audit_events','mmm_approval_notification_events','mmm_ai_learning_events'] LOOP
  IF NOT has_table_privilege('authenticated',format('public.%I',t),'INSERT') OR NOT has_table_privilege('service_role',format('public.%I',t),'SELECT') THEN
   RAISE EXCEPTION 'Approval workflow grant missing for %',t;
  END IF;
  IF has_table_privilege('anon',format('public.%I',t),'SELECT,INSERT,UPDATE,DELETE') THEN RAISE EXCEPTION 'Approval table % exposed to anon',t; END IF;
 END LOOP;
 IF NOT has_table_privilege('anon','public.mmm_free_assessments','SELECT') OR NOT has_table_privilege('anon','public.mmm_free_assessments','INSERT') THEN RAISE EXCEPTION 'Public assessment path lost'; END IF;
 IF has_table_privilege('anon','public.mmm_profiles','SELECT') THEN RAISE EXCEPTION 'Anonymous profile access'; END IF;
END $$;
ROLLBACK;
