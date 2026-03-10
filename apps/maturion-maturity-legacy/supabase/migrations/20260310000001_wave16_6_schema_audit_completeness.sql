-- Wave 16.6 — Schema & Audit Completeness
-- Gaps addressed:
--   GAP-011 — scores INSERT/UPDATE RLS policies incomplete
--   GAP-012 — audit_scores INSERT/UPDATE RLS policies incomplete
--   GAP-016 — audit logging action types not formally defined
--   GAP-019 — evidence_submissions table missing
--
-- Architecture: architecture/implementation-plan.md Wave 16.6
-- Tests: modules/mat/tests/wave16.6/wave16.6-schema-audit-completeness.test.ts
-- Idempotent: all DDL guarded with IF NOT EXISTS / DO $$ BEGIN … END $$ checks.

-- ---------------------------------------------------------------------------
-- GAP-011: scores INSERT RLS — restricted to Lead Auditor within the org
-- Policy: scores_insert_lead_auditor
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'scores'
      AND policyname = 'scores_insert_lead_auditor'
  ) THEN
    CREATE POLICY scores_insert_lead_auditor ON public.scores
      FOR INSERT
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
            AND role = 'lead_auditor'
        )
      );
  END IF;
END $$;

-- GAP-011: scores UPDATE RLS — restricted to Lead Auditor within the org
-- Policy: scores_update_lead_auditor
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'scores'
      AND policyname = 'scores_update_lead_auditor'
  ) THEN
    CREATE POLICY scores_update_lead_auditor ON public.scores
      FOR UPDATE
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
            AND role = 'lead_auditor'
        )
      )
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
            AND role = 'lead_auditor'
        )
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- GAP-012: audit_scores INSERT RLS — restricted to Lead Auditor within the org
-- Policy: audit_scores_insert_lead_auditor
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_scores'
      AND policyname = 'audit_scores_insert_lead_auditor'
  ) THEN
    CREATE POLICY audit_scores_insert_lead_auditor ON public.audit_scores
      FOR INSERT
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
            AND role = 'lead_auditor'
        )
      );
  END IF;
END $$;

-- GAP-012: audit_scores UPDATE RLS — restricted to Lead Auditor within the org
-- Policy: audit_scores_update_lead_auditor
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_scores'
      AND policyname = 'audit_scores_update_lead_auditor'
  ) THEN
    CREATE POLICY audit_scores_update_lead_auditor ON public.audit_scores
      FOR UPDATE
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
            AND role = 'lead_auditor'
        )
      )
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
            AND role = 'lead_auditor'
        )
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- GAP-016: audit_logs action CHECK constraint — formally defines all valid
-- action types, including the previously undocumented event types:
--   evidence_upload, score_confirmed, score_overridden, report_generated
-- Existing action types carried forward:
--   criteria_parsed, criteria_parse_failed
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname   = 'audit_logs_action_check'
      AND conrelid  = 'public.audit_logs'::regclass
  ) THEN
    ALTER TABLE public.audit_logs
      ADD CONSTRAINT audit_logs_action_check
      CHECK (action IN (
        'criteria_parsed',
        'criteria_parse_failed',
        'evidence_upload',
        'score_confirmed',
        'score_overridden',
        'report_generated'
      ));
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- GAP-019: evidence_submissions table
-- Referenced by: EvidenceSubmissionInterface.tsx, test-data-sources-api function
-- Column names aligned with types.ts Row definition and existing codebase usage.
-- NOTE: organisation_id follows the maturion-isms British-spelling convention
--       used consistently across all tables (audits, scores, audit_scores, etc.).
--       Any legacy code referencing organization_id (American spelling) must be
--       updated to use organisation_id to query this table.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS evidence_submissions (
  id                       UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id          UUID          NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  audit_id                 UUID          REFERENCES public.audits(id) ON DELETE SET NULL,
  criteria_id              UUID          REFERENCES public.criteria(id) ON DELETE SET NULL,
  title                    TEXT          NOT NULL,
  description              TEXT,
  evidence_type            TEXT          NOT NULL
                             CHECK (evidence_type IN (
                               'document', 'image', 'video', 'audio',
                               'link', 'api_data', 'structured_data', 'other'
                             )),
  submission_method        TEXT          CHECK (submission_method IN ('manual', 'automated', 'api')),
  evaluation_status        TEXT          NOT NULL DEFAULT 'pending'
                             CHECK (evaluation_status IN (
                               'pending', 'in_review', 'approved', 'rejected'
                             )),
  file_path                TEXT,
  file_url                 TEXT,
  file_size                BIGINT,
  mime_type                TEXT,
  evidence_data            JSONB,
  evaluation_result        JSONB,
  risk_indicators          JSONB,
  metadata                 JSONB,
  tags                     TEXT[],
  ai_confidence_score      NUMERIC(5,4)  CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 1),
  compliance_score         NUMERIC(5,4)  CHECK (compliance_score >= 0 AND compliance_score <= 1),
  maturity_level_suggestion TEXT,
  human_review_required    BOOLEAN       NOT NULL DEFAULT false,
  assessment_id            UUID,
  data_source_id           UUID,
  submitted_by             UUID          NOT NULL REFERENCES auth.users(id),
  reviewed_by              UUID          REFERENCES auth.users(id),
  reviewer_comments        TEXT,
  reviewed_at              TIMESTAMPTZ,
  submitted_at             TIMESTAMPTZ   NOT NULL DEFAULT now(),
  created_at               TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ   NOT NULL DEFAULT now()
);

ALTER TABLE public.evidence_submissions ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'evidence_submissions'
      AND indexname  = 'evidence_submissions_organisation_id_idx'
  ) THEN
    CREATE INDEX evidence_submissions_organisation_id_idx
      ON public.evidence_submissions (organisation_id);
  END IF;
END $$;

-- Index: fast lookup by audit
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'evidence_submissions'
      AND indexname  = 'evidence_submissions_audit_id_idx'
  ) THEN
    CREATE INDEX evidence_submissions_audit_id_idx
      ON public.evidence_submissions (audit_id);
  END IF;
END $$;

-- Index: submitted_at for time-ordered queries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'evidence_submissions'
      AND indexname  = 'evidence_submissions_submitted_at_idx'
  ) THEN
    CREATE INDEX evidence_submissions_submitted_at_idx
      ON public.evidence_submissions (submitted_at DESC);
  END IF;
END $$;

-- Index: filter by evaluation_status
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'evidence_submissions'
      AND indexname  = 'evidence_submissions_evaluation_status_idx'
  ) THEN
    CREATE INDEX evidence_submissions_evaluation_status_idx
      ON public.evidence_submissions (evaluation_status)
      WHERE evaluation_status IN ('pending', 'in_review');
  END IF;
END $$;

-- RLS: SELECT — users may only see submissions belonging to their organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'evidence_submissions'
      AND policyname = 'evidence_submissions_org_isolation'
  ) THEN
    CREATE POLICY evidence_submissions_org_isolation ON public.evidence_submissions
      FOR SELECT
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;

-- RLS: INSERT — authenticated users within the org may submit evidence
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'evidence_submissions'
      AND policyname = 'evidence_submissions_insert_authenticated'
  ) THEN
    CREATE POLICY evidence_submissions_insert_authenticated ON public.evidence_submissions
      FOR INSERT
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;

-- RLS: UPDATE — Lead Auditor or the original submitter may update submissions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'evidence_submissions'
      AND policyname = 'evidence_submissions_update_lead_auditor'
  ) THEN
    CREATE POLICY evidence_submissions_update_lead_auditor ON public.evidence_submissions
      FOR UPDATE
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
            AND role = 'lead_auditor'
        )
        OR submitted_by = auth.uid()
      )
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;
