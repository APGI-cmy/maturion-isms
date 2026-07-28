-- MMM approval workflow foundation runtime
-- Issue: #1961

ALTER TABLE public.mmm_domain_approval_requests
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS framework_id uuid,
  ADD COLUMN IF NOT EXISTS idempotency_key text,
  ADD COLUMN IF NOT EXISTS latest_reason text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mmm_domain_approval_idempotency
  ON public.mmm_domain_approval_requests (organisation_id, domain_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.mmm_framework_approval_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL,
  framework_id uuid NOT NULL,
  submitted_by uuid NOT NULL,
  assigned_approver uuid,
  status text NOT NULL DEFAULT 'draft',
  locked boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1,
  idempotency_key text,
  latest_reason text,
  latest_action_by uuid,
  latest_action_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organisation_id, framework_id),
  UNIQUE (organisation_id, framework_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS public.mmm_approval_transitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL,
  framework_id uuid NOT NULL,
  domain_id uuid,
  request_id uuid NOT NULL,
  package_type text NOT NULL CHECK (package_type IN ('domain','framework')),
  action text NOT NULL,
  state_before text NOT NULL,
  state_after text NOT NULL,
  version_before integer NOT NULL,
  version_after integer NOT NULL,
  actor_user_id uuid NOT NULL,
  actor_role text,
  reason text NOT NULL,
  idempotency_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organisation_id, package_type, request_id, idempotency_key)
);

ALTER TABLE public.mmm_framework_approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmm_approval_transitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS mmm_framework_approval_select_own_org ON public.mmm_framework_approval_requests;
CREATE POLICY mmm_framework_approval_select_own_org ON public.mmm_framework_approval_requests
  FOR SELECT TO authenticated
  USING (organisation_id = app_private.mmm_current_user_org_id());

DROP POLICY IF EXISTS mmm_approval_transitions_select_own_org ON public.mmm_approval_transitions;
CREATE POLICY mmm_approval_transitions_select_own_org ON public.mmm_approval_transitions
  FOR SELECT TO authenticated
  USING (organisation_id = app_private.mmm_current_user_org_id());

GRANT SELECT ON public.mmm_framework_approval_requests TO authenticated;
GRANT SELECT ON public.mmm_approval_transitions TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.mmm_approval_transitions FROM authenticated, anon;

CREATE OR REPLACE FUNCTION public.mmm_prevent_approval_transition_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Approval transition history is immutable';
END;
$$;

DROP TRIGGER IF EXISTS trg_mmm_approval_transition_no_update ON public.mmm_approval_transitions;
CREATE TRIGGER trg_mmm_approval_transition_no_update
BEFORE UPDATE OR DELETE ON public.mmm_approval_transitions
FOR EACH ROW EXECUTE FUNCTION public.mmm_prevent_approval_transition_mutation();
