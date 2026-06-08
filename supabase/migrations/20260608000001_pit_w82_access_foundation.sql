-- Migration: 20260608000001_pit_w82_access_foundation
-- Purpose: PIT Stage 12 W8.2 org/user/role foundations, RLS-first access model, denied-path support.

CREATE TABLE IF NOT EXISTS public.user_org_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'removed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, org_id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  project_id uuid,
  role text NOT NULL CHECK (role IN ('cs2_admin', 'org_admin', 'project_manager', 'team_leader', 'contributor', 'viewer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, org_id, project_id, role)
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.qa_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  run_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('queued', 'running', 'passed', 'failed')),
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_org_memberships_user_org ON public.user_org_memberships (user_id, org_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_org_role ON public.user_roles (user_id, org_id, role);
CREATE INDEX IF NOT EXISTS idx_audit_log_org_created ON public.audit_log (org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qa_runs_org_created ON public.qa_runs (org_id, created_at DESC);

ALTER TABLE public.user_org_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_runs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.pit_is_org_member(target_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_org_memberships m
    WHERE m.user_id = auth.uid()
      AND m.org_id = target_org_id
      AND m.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.pit_has_org_role(target_org_id uuid, allowed_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles r
    WHERE r.user_id = auth.uid()
      AND r.org_id = target_org_id
      AND r.role = ANY(allowed_roles)
  );
$$;

DROP POLICY IF EXISTS user_org_memberships_select_member ON public.user_org_memberships;
CREATE POLICY user_org_memberships_select_member
  ON public.user_org_memberships
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.pit_has_org_role(org_id, ARRAY['cs2_admin','org_admin']));

DROP POLICY IF EXISTS user_org_memberships_insert_admin ON public.user_org_memberships;
CREATE POLICY user_org_memberships_insert_admin
  ON public.user_org_memberships
  FOR INSERT
  TO authenticated
  WITH CHECK (public.pit_has_org_role(org_id, ARRAY['cs2_admin','org_admin']));

DROP POLICY IF EXISTS user_org_memberships_update_admin ON public.user_org_memberships;
CREATE POLICY user_org_memberships_update_admin
  ON public.user_org_memberships
  FOR UPDATE
  TO authenticated
  USING (public.pit_has_org_role(org_id, ARRAY['cs2_admin','org_admin']))
  WITH CHECK (public.pit_has_org_role(org_id, ARRAY['cs2_admin','org_admin']));

DROP POLICY IF EXISTS user_roles_select_admin ON public.user_roles;
CREATE POLICY user_roles_select_admin
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.pit_has_org_role(org_id, ARRAY['cs2_admin','org_admin']));

DROP POLICY IF EXISTS user_roles_write_admin ON public.user_roles;
CREATE POLICY user_roles_write_admin
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.pit_has_org_role(org_id, ARRAY['cs2_admin','org_admin']))
  WITH CHECK (public.pit_has_org_role(org_id, ARRAY['cs2_admin','org_admin']));

DROP POLICY IF EXISTS audit_log_select_admin ON public.audit_log;
CREATE POLICY audit_log_select_admin
  ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (public.pit_has_org_role(org_id, ARRAY['cs2_admin','org_admin']));

DROP POLICY IF EXISTS audit_log_insert_member ON public.audit_log;
CREATE POLICY audit_log_insert_member
  ON public.audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (public.pit_is_org_member(org_id));

DROP POLICY IF EXISTS qa_runs_select_cs2 ON public.qa_runs;
CREATE POLICY qa_runs_select_cs2
  ON public.qa_runs
  FOR SELECT
  TO authenticated
  USING (public.pit_has_org_role(org_id, ARRAY['cs2_admin']));

DROP POLICY IF EXISTS qa_runs_write_cs2 ON public.qa_runs;
CREATE POLICY qa_runs_write_cs2
  ON public.qa_runs
  FOR ALL
  TO authenticated
  USING (public.pit_has_org_role(org_id, ARRAY['cs2_admin']))
  WITH CHECK (public.pit_has_org_role(org_id, ARRAY['cs2_admin']));
