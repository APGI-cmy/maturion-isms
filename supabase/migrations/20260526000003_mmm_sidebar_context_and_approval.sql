-- =============================================================================
-- MMM Recovery Wave — Sidebar Context + MPS/Domain Approval (L1/L2)
-- =============================================================================

-- Keep organisation context explicitly timestamped for post-onboarding edits.
ALTER TABLE public.mmm_organisations
  ADD COLUMN IF NOT EXISTS context_updated_at timestamptz;

-- MPS-level (L1) approval action ledger.
CREATE TABLE IF NOT EXISTS public.mmm_mps_approval_actions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id   uuid NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  domain_id         uuid NOT NULL REFERENCES public.mmm_domains(id) ON DELETE CASCADE,
  mps_id            uuid NOT NULL REFERENCES public.mmm_maturity_process_steps(id) ON DELETE CASCADE,
  actor_id          uuid NOT NULL,
  action_type       text NOT NULL CHECK (action_type IN ('approve', 'reopen', 'reject', 'regenerate')),
  notes             text,
  resulting_state   text NOT NULL CHECK (resulting_state IN ('draft', 'approved_l1', 'rejected_l1')),
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_mps_approval_org_mps_created
  ON public.mmm_mps_approval_actions (organisation_id, mps_id, created_at DESC);

-- Domain-level (L2) approval request loop.
CREATE TABLE IF NOT EXISTS public.mmm_domain_approval_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id   uuid NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  domain_id         uuid NOT NULL REFERENCES public.mmm_domains(id) ON DELETE CASCADE,
  submitted_by      uuid NOT NULL,
  assigned_reviewer uuid,
  status            text NOT NULL CHECK (status IN ('draft', 'submitted_l2', 'returned_l2', 'approved_l2')) DEFAULT 'draft',
  locked            boolean NOT NULL DEFAULT false,
  latest_action_by  uuid,
  latest_action_at  timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (domain_id)
);

CREATE INDEX IF NOT EXISTS idx_mmm_domain_approval_org_status
  ON public.mmm_domain_approval_requests (organisation_id, status, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.mmm_domain_approval_comments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id        uuid NOT NULL REFERENCES public.mmm_domain_approval_requests(id) ON DELETE CASCADE,
  organisation_id   uuid NOT NULL REFERENCES public.mmm_organisations(id) ON DELETE CASCADE,
  domain_id         uuid NOT NULL REFERENCES public.mmm_domains(id) ON DELETE CASCADE,
  author_id         uuid NOT NULL,
  author_role       text,
  comment_type      text NOT NULL CHECK (comment_type IN ('user_note', 'reviewer_return', 'resubmit_note', 'approval_note')),
  message           text NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mmm_domain_approval_comments_request_created
  ON public.mmm_domain_approval_comments (request_id, created_at DESC);

ALTER TABLE public.mmm_mps_approval_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_domain_approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_domain_approval_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mmm_mps_approval_select_own_org" ON public.mmm_mps_approval_actions;
CREATE POLICY "mmm_mps_approval_select_own_org"
  ON public.mmm_mps_approval_actions
  FOR SELECT
  USING (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_mps_approval_insert_own_org" ON public.mmm_mps_approval_actions;
CREATE POLICY "mmm_mps_approval_insert_own_org"
  ON public.mmm_mps_approval_actions
  FOR INSERT
  WITH CHECK (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_domain_approval_select_own_org" ON public.mmm_domain_approval_requests;
CREATE POLICY "mmm_domain_approval_select_own_org"
  ON public.mmm_domain_approval_requests
  FOR SELECT
  USING (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_domain_approval_insert_own_org" ON public.mmm_domain_approval_requests;
CREATE POLICY "mmm_domain_approval_insert_own_org"
  ON public.mmm_domain_approval_requests
  FOR INSERT
  WITH CHECK (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_domain_approval_update_own_org" ON public.mmm_domain_approval_requests;
CREATE POLICY "mmm_domain_approval_update_own_org"
  ON public.mmm_domain_approval_requests
  FOR UPDATE
  USING (organisation_id = mmm_current_user_org_id())
  WITH CHECK (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_domain_approval_comments_select_own_org" ON public.mmm_domain_approval_comments;
CREATE POLICY "mmm_domain_approval_comments_select_own_org"
  ON public.mmm_domain_approval_comments
  FOR SELECT
  USING (organisation_id = mmm_current_user_org_id());

DROP POLICY IF EXISTS "mmm_domain_approval_comments_insert_own_org" ON public.mmm_domain_approval_comments;
CREATE POLICY "mmm_domain_approval_comments_insert_own_org"
  ON public.mmm_domain_approval_comments
  FOR INSERT
  WITH CHECK (organisation_id = mmm_current_user_org_id());
