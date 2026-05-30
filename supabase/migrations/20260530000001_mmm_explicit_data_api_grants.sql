-- =============================================================================
-- Migration: 20260530000001_mmm_explicit_data_api_grants.sql
-- Wave: supabase-data-api-grants-20260530
-- Purpose:
--   Add explicit Data API table grants for MMM public-schema tables that are
--   accessed through supabase-js/PostgREST. RLS remains the row-level control.
-- Author: ChatGPT delegated by Johan Ras
-- =============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT, INSERT, UPDATE
ON TABLE public.mmm_subject_knowledge_documents
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.ai_knowledge
TO authenticated;

GRANT SELECT, INSERT, UPDATE
ON TABLE public.mmm_subject_knowledge_migration_runs
TO authenticated;

GRANT SELECT, INSERT
ON TABLE public.mmm_criteria_learning_events
TO authenticated;

GRANT SELECT, INSERT, UPDATE
ON TABLE public.mmm_criteria_deferred_queue
TO authenticated;

DROP POLICY IF EXISTS ai_knowledge_org_delete ON public.ai_knowledge;
CREATE POLICY ai_knowledge_org_delete
  ON public.ai_knowledge
  FOR DELETE
  TO authenticated
  USING (organisation_id = public.mmm_current_user_org_id()::text);

COMMENT ON POLICY ai_knowledge_org_delete ON public.ai_knowledge IS
  'Allows authenticated users to delete ai_knowledge chunks only within their current organisation; required by OrganisationContextPage source-document archive flow.';

COMMENT ON TABLE public.ai_knowledge IS
  'AIMC/MMM canonical knowledge chunks. Explicit authenticated Data API grants are paired with RLS policies for organisation isolation.';

COMMENT ON TABLE public.mmm_subject_knowledge_documents IS
  'MMM subject-knowledge document ledger. Explicit authenticated Data API grants are paired with RLS policies for organisation isolation.';
