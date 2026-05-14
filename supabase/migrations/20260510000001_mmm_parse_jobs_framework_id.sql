-- Migration: Add framework_id to mmm_parse_jobs
-- Issue: maturion-isms#1589
-- PR: #1590
-- Wave: mmm-p4-phase6-stop-and-fix-20260510
-- Authority: CS2 review comment 4415326119
--
-- Links parse jobs to frameworks in a first-class way (not only inside result_json).
-- Required for Mode A review page parse-job polling and Compile gate logic.

ALTER TABLE public.mmm_parse_jobs
    ADD COLUMN IF NOT EXISTS framework_id uuid REFERENCES public.mmm_frameworks(id) ON DELETE CASCADE;

-- Index for efficient framework-scoped parse job queries (review page polling)
CREATE INDEX IF NOT EXISTS idx_mmm_parse_jobs_framework_id
    ON public.mmm_parse_jobs (framework_id);

COMMENT ON COLUMN public.mmm_parse_jobs.framework_id IS 'Framework this parse job belongs to. Required for review-page parse-job polling.';
