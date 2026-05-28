-- Migration: 20260525000002_mmm_aimc_knowledge_canonical
-- Purpose:
--   1) Promote AIMC canonical knowledge schema into MMM runtime (`ai_knowledge`)
--   2) Add MMM subject-knowledge document ledger for DMC
--   3) Add legacy migration run tracking + criteria learning tables
--   4) Create subject-knowledge storage bucket contract
--
-- References:
--   modules/MMM/02-frs/functional-requirements.md
--   modules/MMM/03-trs/technical-requirements-specification.md
--   packages/ai-centre/supabase/migrations/003,006,008,009_ai_knowledge_*.sql

CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- 1) DMC subject-knowledge document ledger (document-level status)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_subject_knowledge_documents (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id     uuid        NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
    uploaded_by         uuid        NOT NULL,
    updated_by          uuid        NOT NULL,
    title               text        NOT NULL,
    file_name           text        NOT NULL,
    mime_type           text        NOT NULL,
    file_size           bigint      NOT NULL DEFAULT 0,
    storage_bucket      text        NOT NULL,
    storage_path        text        NOT NULL,
    document_role       text        NOT NULL CHECK (document_role IN ('criteria_source', 'evidence', 'knowledge_source', 'guidance', 'template')),
    scope_type          text        NOT NULL DEFAULT 'subject_knowledge',
    processing_status   text        NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    chunk_count         integer     NOT NULL DEFAULT 0,
    content_hash        text,
    tags                jsonb       NOT NULL DEFAULT '[]'::jsonb,
    upload_notes        text,
    legacy_document_id  text UNIQUE,
    kuc_upload_id       text,
    kuc_parse_job_id    text,
    kuc_classification  jsonb,
    processing_error    text,
    archived_at         timestamptz,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_subject_knowledge_docs_org_status
  ON public.mmm_subject_knowledge_documents (organisation_id, processing_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mmm_subject_knowledge_docs_legacy
  ON public.mmm_subject_knowledge_documents (legacy_document_id)
  WHERE legacy_document_id IS NOT NULL;

ALTER TABLE public.mmm_subject_knowledge_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mmm_subject_knowledge_docs_select" ON public.mmm_subject_knowledge_documents;
CREATE POLICY "mmm_subject_knowledge_docs_select"
  ON public.mmm_subject_knowledge_documents
  FOR SELECT
  TO authenticated
  USING (organisation_id = public.mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_subject_knowledge_docs_insert" ON public.mmm_subject_knowledge_documents;
CREATE POLICY "mmm_subject_knowledge_docs_insert"
  ON public.mmm_subject_knowledge_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (organisation_id = public.mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_subject_knowledge_docs_update" ON public.mmm_subject_knowledge_documents;
CREATE POLICY "mmm_subject_knowledge_docs_update"
  ON public.mmm_subject_knowledge_documents
  FOR UPDATE
  TO authenticated
  USING (organisation_id = public.mmm_current_user_org_id())
  WITH CHECK (organisation_id = public.mmm_current_user_org_id());

-- ============================================================================
-- 2) AIMC canonical chunk-level knowledge store (`ai_knowledge`)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ai_knowledge (
    id                    uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id       text         NOT NULL,
    content               text         NOT NULL,
    source                text,
    embedding             vector(1536),
    created_at            timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_knowledge
  ADD COLUMN IF NOT EXISTS domain                text,
  ADD COLUMN IF NOT EXISTS module                text,
  ADD COLUMN IF NOT EXISTS standard_ref          text,
  ADD COLUMN IF NOT EXISTS freshness_date        timestamptz,
  ADD COLUMN IF NOT EXISTS approval_status       text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS chunk_index           integer,
  ADD COLUMN IF NOT EXISTS chunk_size            integer DEFAULT 2000,
  ADD COLUMN IF NOT EXISTS chunk_overlap         integer DEFAULT 200,
  ADD COLUMN IF NOT EXISTS source_document_name  text,
  ADD COLUMN IF NOT EXISTS document_id           text,
  ADD COLUMN IF NOT EXISTS content_hash          text,
  ADD COLUMN IF NOT EXISTS metadata              jsonb DEFAULT '{}'::jsonb;

ALTER TABLE public.ai_knowledge
  DROP CONSTRAINT IF EXISTS ai_knowledge_approval_status_check;

ALTER TABLE public.ai_knowledge
  ADD CONSTRAINT ai_knowledge_approval_status_check
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_org
  ON public.ai_knowledge (organisation_id);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_approval_status
  ON public.ai_knowledge (approval_status);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_document_id
  ON public.ai_knowledge (document_id);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_content_hash
  ON public.ai_knowledge (content_hash);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_embedding
  ON public.ai_knowledge
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

ALTER TABLE public.ai_knowledge ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_knowledge_org_isolation ON public.ai_knowledge;
CREATE POLICY ai_knowledge_org_isolation
  ON public.ai_knowledge
  FOR SELECT
  TO authenticated
  USING (organisation_id = public.mmm_current_user_org_id()::text);

DROP POLICY IF EXISTS ai_knowledge_org_insert ON public.ai_knowledge;
CREATE POLICY ai_knowledge_org_insert
  ON public.ai_knowledge
  FOR INSERT
  TO authenticated
  WITH CHECK (organisation_id = public.mmm_current_user_org_id()::text);

DROP POLICY IF EXISTS ai_knowledge_org_update ON public.ai_knowledge;
CREATE POLICY ai_knowledge_org_update
  ON public.ai_knowledge
  FOR UPDATE
  TO authenticated
  USING (organisation_id = public.mmm_current_user_org_id()::text)
  WITH CHECK (organisation_id = public.mmm_current_user_org_id()::text);

-- ============================================================================
-- 3) Legacy migration run tracking (idempotent import evidence)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_subject_knowledge_migration_runs (
    id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id       uuid        NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
    started_by            uuid        NOT NULL,
    status                text        NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
    scanned_count         integer     NOT NULL DEFAULT 0,
    migrated_count        integer     NOT NULL DEFAULT 0,
    deduped_count         integer     NOT NULL DEFAULT 0,
    failed_count          integer     NOT NULL DEFAULT 0,
    failure_report        jsonb       NOT NULL DEFAULT '[]'::jsonb,
    started_at            timestamptz NOT NULL DEFAULT now(),
    completed_at          timestamptz
);

CREATE INDEX IF NOT EXISTS idx_mmm_subject_knowledge_runs_org_started
  ON public.mmm_subject_knowledge_migration_runs (organisation_id, started_at DESC);

ALTER TABLE public.mmm_subject_knowledge_migration_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mmm_subject_knowledge_runs_select" ON public.mmm_subject_knowledge_migration_runs;
CREATE POLICY "mmm_subject_knowledge_runs_select"
  ON public.mmm_subject_knowledge_migration_runs
  FOR SELECT
  TO authenticated
  USING (organisation_id = public.mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_subject_knowledge_runs_insert" ON public.mmm_subject_knowledge_migration_runs;
CREATE POLICY "mmm_subject_knowledge_runs_insert"
  ON public.mmm_subject_knowledge_migration_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (organisation_id = public.mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_subject_knowledge_runs_update" ON public.mmm_subject_knowledge_migration_runs;
CREATE POLICY "mmm_subject_knowledge_runs_update"
  ON public.mmm_subject_knowledge_migration_runs
  FOR UPDATE
  TO authenticated
  USING (organisation_id = public.mmm_current_user_org_id())
  WITH CHECK (organisation_id = public.mmm_current_user_org_id());

-- ============================================================================
-- 4) Criteria learning + deferred queue (7-scenario learning capture)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mmm_criteria_learning_events (
    id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id       uuid        NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
    framework_id          uuid        REFERENCES public.mmm_frameworks(id) ON DELETE SET NULL,
    domain_id             uuid        REFERENCES public.mmm_domains(id) ON DELETE SET NULL,
    mps_id                uuid        REFERENCES public.mmm_maturity_process_steps(id) ON DELETE SET NULL,
    scenario_code         text        NOT NULL,
    disposition           text        NOT NULL CHECK (disposition IN ('accepted', 'edited', 'rejected', 'deferred', 'duplicate', 'split')),
    criterion_code        text,
    original_text         text,
    revised_text          text,
    industry_key          text,
    metadata              jsonb       NOT NULL DEFAULT '{}'::jsonb,
    created_by            uuid        NOT NULL,
    created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_criteria_learning_org_created
  ON public.mmm_criteria_learning_events (organisation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mmm_criteria_learning_industry
  ON public.mmm_criteria_learning_events (industry_key);

ALTER TABLE public.mmm_criteria_learning_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mmm_criteria_learning_select" ON public.mmm_criteria_learning_events;
CREATE POLICY "mmm_criteria_learning_select"
  ON public.mmm_criteria_learning_events
  FOR SELECT
  TO authenticated
  USING (organisation_id = public.mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_criteria_learning_insert" ON public.mmm_criteria_learning_events;
CREATE POLICY "mmm_criteria_learning_insert"
  ON public.mmm_criteria_learning_events
  FOR INSERT
  TO authenticated
  WITH CHECK (organisation_id = public.mmm_current_user_org_id());

CREATE TABLE IF NOT EXISTS public.mmm_criteria_deferred_queue (
    id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id       uuid        NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
    framework_id          uuid        REFERENCES public.mmm_frameworks(id) ON DELETE SET NULL,
    source_domain_id      uuid        REFERENCES public.mmm_domains(id) ON DELETE SET NULL,
    target_domain_slug    text,
    target_mps_code       text,
    criterion_text        text        NOT NULL,
    reason_code           text        NOT NULL,
    status                text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'dismissed')),
    created_by            uuid        NOT NULL,
    created_at            timestamptz NOT NULL DEFAULT now(),
    resolved_at           timestamptz
);

CREATE INDEX IF NOT EXISTS idx_mmm_criteria_deferred_org_status
  ON public.mmm_criteria_deferred_queue (organisation_id, status, created_at DESC);

ALTER TABLE public.mmm_criteria_deferred_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mmm_criteria_deferred_select" ON public.mmm_criteria_deferred_queue;
CREATE POLICY "mmm_criteria_deferred_select"
  ON public.mmm_criteria_deferred_queue
  FOR SELECT
  TO authenticated
  USING (organisation_id = public.mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_criteria_deferred_insert" ON public.mmm_criteria_deferred_queue;
CREATE POLICY "mmm_criteria_deferred_insert"
  ON public.mmm_criteria_deferred_queue
  FOR INSERT
  TO authenticated
  WITH CHECK (organisation_id = public.mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_criteria_deferred_update" ON public.mmm_criteria_deferred_queue;
CREATE POLICY "mmm_criteria_deferred_update"
  ON public.mmm_criteria_deferred_queue
  FOR UPDATE
  TO authenticated
  USING (organisation_id = public.mmm_current_user_org_id())
  WITH CHECK (organisation_id = public.mmm_current_user_org_id());

-- ============================================================================
-- 5) Subject-knowledge storage bucket contract
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'mmm-subject-knowledge',
    'mmm-subject-knowledge',
    false,
    104857600,
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/markdown',
      'text/csv',
      'application/json'
    ]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "mmm_subject_knowledge_bucket_insert" ON storage.objects;
CREATE POLICY "mmm_subject_knowledge_bucket_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'mmm-subject-knowledge' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "mmm_subject_knowledge_bucket_select" ON storage.objects;
CREATE POLICY "mmm_subject_knowledge_bucket_select"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'mmm-subject-knowledge' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "mmm_subject_knowledge_bucket_update" ON storage.objects;
CREATE POLICY "mmm_subject_knowledge_bucket_update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'mmm-subject-knowledge' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "mmm_subject_knowledge_bucket_delete" ON storage.objects;
CREATE POLICY "mmm_subject_knowledge_bucket_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'mmm-subject-knowledge' AND auth.uid() IS NOT NULL);
