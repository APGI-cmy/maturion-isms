-- Wave 14 — Invitations and Assignments (GAP-W02, GAP-W04, GAP-W14)
-- FR-090, FR-092, FR-102 / TR-090, TR-092, TR-102
-- Creates:
--   audit_invitations  — pending/accepted invitations (domain or criteria scope)
--   domain_assignments — links auditor user to a specific audit domain
--   mps_assignments    — links auditor user to a specific MPS within an audit
--   criteria_assignments — links evidence submitter to a specific criteria
-- Implements responsibility cascade VIEW resolving responsible user per criteria.
-- Idempotent: uses IF NOT EXISTS throughout.

-- ---------------------------------------------------------------------------
-- audit_invitations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_invitations (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id         UUID        NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id  UUID        NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  inviter_id       UUID        REFERENCES auth.users(id),
  invitee_email    TEXT        NOT NULL,
  invitee_name     TEXT,
  scope_type       TEXT        NOT NULL CHECK (scope_type IN ('domain', 'criteria')),
  scope_id         UUID,
  invitation_token UUID        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status           TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at      TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- domain_assignments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.domain_assignments (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id        UUID        NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id UUID        NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  domain_id       UUID        NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (audit_id, domain_id, user_id)
);

-- ---------------------------------------------------------------------------
-- mps_assignments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mps_assignments (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id        UUID        NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id UUID        NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  mps_id          UUID        NOT NULL REFERENCES public.mini_performance_standards(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (audit_id, mps_id, user_id)
);

-- ---------------------------------------------------------------------------
-- criteria_assignments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.criteria_assignments (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id        UUID        NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id UUID        NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  criteria_id     UUID        NOT NULL REFERENCES public.criteria(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (audit_id, criteria_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.audit_invitations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_assignments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mps_assignments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criteria_assignments ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- RLS policies — org-isolation SELECT
-- ---------------------------------------------------------------------------

-- audit_invitations: org-isolation SELECT policy (FR-090 — cross-org invitation leakage prevention)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'audit_invitations'
      AND policyname = 'audit_invitations_select'
  ) THEN
    CREATE POLICY audit_invitations_select ON public.audit_invitations
      FOR SELECT
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- audit_invitations: INSERT policy — org members may create invitations
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'audit_invitations'
      AND policyname = 'audit_invitations_insert'
  ) THEN
    CREATE POLICY audit_invitations_insert ON public.audit_invitations
      FOR INSERT
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- audit_invitations: UPDATE policy — invitee may accept their own invitation
-- (status: 'pending' → 'accepted'; accepted_at set by application code)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'audit_invitations'
      AND policyname = 'audit_invitations_update'
  ) THEN
    CREATE POLICY audit_invitations_update ON public.audit_invitations
      FOR UPDATE
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      )
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- domain_assignments: org-isolation SELECT policy
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'domain_assignments'
      AND policyname = 'domain_assignments_select'
  ) THEN
    CREATE POLICY domain_assignments_select ON public.domain_assignments
      FOR SELECT
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- domain_assignments: INSERT policy — org members may create domain assignments
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'domain_assignments'
      AND policyname = 'domain_assignments_insert'
  ) THEN
    CREATE POLICY domain_assignments_insert ON public.domain_assignments
      FOR INSERT
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- mps_assignments: org-isolation SELECT policy
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'mps_assignments'
      AND policyname = 'mps_assignments_select'
  ) THEN
    CREATE POLICY mps_assignments_select ON public.mps_assignments
      FOR SELECT
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- mps_assignments: INSERT policy — org members may create MPS assignments
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'mps_assignments'
      AND policyname = 'mps_assignments_insert'
  ) THEN
    CREATE POLICY mps_assignments_insert ON public.mps_assignments
      FOR INSERT
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- criteria_assignments: org-isolation SELECT policy (TR-092 — scoped access enforcement)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'criteria_assignments'
      AND policyname = 'criteria_assignments_select'
  ) THEN
    CREATE POLICY criteria_assignments_select ON public.criteria_assignments
      FOR SELECT
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- criteria_assignments: INSERT policy — org members may create criteria assignments
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'criteria_assignments'
      AND policyname = 'criteria_assignments_insert'
  ) THEN
    CREATE POLICY criteria_assignments_insert ON public.criteria_assignments
      FOR INSERT
      WITH CHECK (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Responsibility cascade VIEW (TR-102)
-- Resolves responsible_user_id for each criteria, walking up the hierarchy:
--   criteria_assignments → mps_assignments → domain_assignments → audits.created_by
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.responsibility_cascade AS
  SELECT
    c.id               AS criteria_id,
    c.audit_id,
    c.domain_id,
    c.mps_id,
    c.organisation_id,
    COALESCE(
      ca.user_id,   -- criteria-level assignment (highest priority)
      ma.user_id,   -- MPS-level assignment
      da.user_id,   -- domain-level assignment
      a.created_by  -- default: Lead Auditor (audit.created_by)
    )                  AS responsible_user_id
  FROM  public.criteria c
  JOIN  public.audits a
        ON a.id = c.audit_id
  LEFT JOIN public.criteria_assignments ca
        ON ca.criteria_id = c.id
       AND ca.audit_id    = c.audit_id
  LEFT JOIN public.mps_assignments ma
        ON ma.mps_id   = c.mps_id
       AND ma.audit_id = c.audit_id
  LEFT JOIN public.domain_assignments da
        ON da.domain_id = c.domain_id
       AND da.audit_id  = c.audit_id;
