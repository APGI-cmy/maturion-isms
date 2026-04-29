-- Migration: Add organisation_id, created_by, source_type to mmm_parse_jobs
-- Issue: maturion-isms#1507
-- Wave: fix-signup-onboarding-route-20260428
-- Authority: architecture §A4.2 / mmm-upload-framework-source B7 live wire
--
-- The B7 live wire implementation of mmm-upload-framework-source inserts
-- organisation_id, created_by, and source_type into mmm_parse_jobs as part
-- of the KUC upload audit trail. These columns were not present in the initial
-- B1 schema migration (20260420000001_mmm_core_tables.sql).
--
-- This migration adds the three required columns and a matching RLS policy
-- so that parse jobs are org-scoped and auditable.

ALTER TABLE public.mmm_parse_jobs
    ADD COLUMN IF NOT EXISTS organisation_id uuid REFERENCES public.mmm_organisations(id),
    ADD COLUMN IF NOT EXISTS created_by      uuid,
    ADD COLUMN IF NOT EXISTS source_type     text NOT NULL DEFAULT 'VERBATIM';

-- Index for efficient org-scoped parse job queries
CREATE INDEX IF NOT EXISTS idx_mmm_parse_jobs_organisation_id
    ON public.mmm_parse_jobs (organisation_id);

-- RLS: users may only see parse jobs belonging to their own organisation
CREATE POLICY mmm_parse_jobs_org_select
    ON public.mmm_parse_jobs
    FOR SELECT
    USING (organisation_id = public.mmm_current_user_org_id());

CREATE POLICY mmm_parse_jobs_org_insert
    ON public.mmm_parse_jobs
    FOR INSERT
    WITH CHECK (organisation_id = public.mmm_current_user_org_id());

COMMENT ON COLUMN public.mmm_parse_jobs.organisation_id IS 'Owning organisation — org-scoped access via mmm_current_user_org_id().';
COMMENT ON COLUMN public.mmm_parse_jobs.created_by      IS 'auth.users.id of the user who submitted the parse job.';
COMMENT ON COLUMN public.mmm_parse_jobs.source_type     IS 'Source classification: VERBATIM (default) or other upload contexts.';
