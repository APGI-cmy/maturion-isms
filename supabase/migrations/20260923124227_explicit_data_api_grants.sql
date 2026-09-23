-- Explicit Data API grants for the 2026-10-30 Supabase default-privilege change.
-- Forward-only: applied migrations and existing privileges/RLS are left intact.
-- This fixed allowlist covers the repository's existing application surface.
-- A table absent in a staged/partial deployment is reported and skipped; rerun
-- this migration after adding such a table, or grant access in its own migration.
-- Unknown/future tables are NEVER discovered or granted access automatically.
-- No GRANT ALL, ALTER DEFAULT PRIVILEGES, anonymous blanket grants, or RLS changes.

BEGIN;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

DO $grants$
DECLARE
  entry record;
  target oid;
  actual_kind "char";
  rls_enabled boolean;
  options text[];
BEGIN
  FOR entry IN
    SELECT * FROM (VALUES
      ('aggregate_scores', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('ai_data_sources', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('ai_episodic_events', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('ai_feedback_events', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('ai_knowledge', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('ai_memory', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('ai_requests', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('ai_telemetry', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('audit_invitations', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('audit_log', 'SELECT, INSERT', '', 'SELECT, INSERT', 'r'),
      ('audit_logs', 'SELECT, INSERT, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('audit_reports', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('audit_scores', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('audits', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('create_report_gate', 'SELECT', '', 'SELECT', 'v'),
      ('criteria', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('criteria_assignments', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('criteria_documents', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('criteria_evaluations', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('criteria_level_descriptors', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('domain_assignments', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('domain_level_descriptors', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('domains', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('evaluation_overrides', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('evidence', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('healthcheck', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('isms_assessments', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('isms_audit_events', 'SELECT, INSERT', '', 'SELECT, INSERT', 'r'),
      ('isms_entitlements', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('isms_maturity_handoffs', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('isms_onboarding_profiles', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('maturity_levels', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mini_performance_standards', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_ai_interactions', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_ai_learning_events', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_approval_approvers', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_approval_audit_events', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_approval_comments', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_approval_invitations', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_approval_locks', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_approval_notification_events', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_approval_proposed_changes', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_approval_rounds', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_assessments', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_audit_logs', 'SELECT', '', 'SELECT, INSERT', 'r'),
      ('mmm_audit_sessions', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_criteria', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_criteria_deferred_queue', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_criteria_learning_events', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_domain_approval_comments', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_domain_approval_requests', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_domains', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_evidence', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_findings', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_frameworks', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_free_assessments', 'SELECT, INSERT', 'SELECT, INSERT', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_invitations', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_level_descriptors', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_maturity_process_steps', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_maturity_scores', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_mps_approval_actions', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_org_source_verbatim_index', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_organisation_hierarchy', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_organisations', 'SELECT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_override_log', 'SELECT', '', 'SELECT, INSERT', 'r'),
      ('mmm_parse_ambiguities', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_parse_jobs', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_pit_exports', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_profiles', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_proposed_criteria', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_proposed_domains', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_proposed_mps', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_score_proposals', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_subject_knowledge_documents', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_subject_knowledge_migration_runs', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mmm_user_preferences', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mps', 'SELECT', '', 'SELECT', 'v'),
      ('mps_assignments', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('mps_level_descriptors', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('onboarding_completions', 'SELECT, INSERT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('organisation_settings', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('organisations', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('parse_tasks', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('parsing_instruction_templates', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('profiles', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('projects', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('qa_runs', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('responsibility_cascade', 'SELECT', '', 'SELECT', 'v'),
      ('scores', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('scoring_rules', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('source_links', 'SELECT', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('user_org_memberships', 'SELECT, INSERT, UPDATE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r'),
      ('user_profiles', 'SELECT', '', 'SELECT', 'v'),
      ('user_roles', 'SELECT, INSERT, UPDATE, DELETE', '', 'SELECT, INSERT, UPDATE, DELETE', 'r')
    ) AS access(table_name, authenticated_privileges, anon_privileges, service_privileges, expected_kind)
  LOOP
    target := to_regclass(format('public.%I', entry.table_name));
    IF target IS NULL THEN
      RAISE NOTICE 'Data API grants: public.% is absent; no object or privilege was created', entry.table_name;
      CONTINUE;
    END IF;

    SELECT relkind, relrowsecurity, reloptions INTO actual_kind, rls_enabled, options
      FROM pg_class WHERE oid = target;
    IF actual_kind::text <> entry.expected_kind THEN
      RAISE EXCEPTION 'Data API grants: unexpected object type for public.%', entry.table_name;
    END IF;
    IF actual_kind = 'r' AND NOT rls_enabled THEN
      RAISE EXCEPTION 'Data API grants: enable and review RLS on public.% before exposing it', entry.table_name;
    END IF;
    IF actual_kind = 'v' AND NOT coalesce(options @> ARRAY['security_invoker=true'], false) THEN
      RAISE EXCEPTION 'Data API grants: public.% must be a security_invoker view', entry.table_name;
    END IF;

    IF entry.authenticated_privileges <> '' THEN
      EXECUTE format('GRANT %s ON TABLE public.%I TO authenticated', entry.authenticated_privileges, entry.table_name);
    END IF;
    IF entry.anon_privileges <> '' THEN
      EXECUTE format('GRANT %s ON TABLE public.%I TO anon', entry.anon_privileges, entry.table_name);
    END IF;
    EXECUTE format('GRANT %s ON TABLE public.%I TO service_role', entry.service_privileges, entry.table_name);
  END LOOP;
END;
$grants$;

-- Explicit EXECUTE for existing RLS helpers (no new functions or public RPCs).
-- Trigger functions run through triggers and are not exposed here.
DO $helpers$
DECLARE
  signature text;
  target regprocedure;
BEGIN
  FOREACH signature IN ARRAY ARRAY[
    'public.mmm_current_user_org_id()',
    'public.mmm_current_user_role()',
    'public.pit_is_org_member(uuid)',
    'public.pit_has_org_role(uuid,text[])',
    'public.pit_is_cs2_admin()'
  ] LOOP
    target := to_regprocedure(signature);
    IF target IS NOT NULL THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', target);
    END IF;
  END LOOP;
END;
$helpers$;

COMMIT;
