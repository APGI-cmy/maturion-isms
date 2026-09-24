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
SET LOCAL ROLE postgres;
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['projects','source_links'] LOOP
  IF NOT has_table_privilege('authenticated',format('public.%I',t),'SELECT') OR has_table_privilege('authenticated',format('public.%I',t),'INSERT,UPDATE,DELETE') THEN
   RAISE EXCEPTION 'PIT RPC-only mutation boundary changed for %',t;
  END IF;
 END LOOP;
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
