-- INC-W13-ORG-SETTINGS-001: organisation_settings table for org-level branding and
-- configuration; not in data-architecture.md v1.0.0 (gap WGI-07)
-- Source: modules/mat/frontend/src/lib/hooks/useSettings.ts uses .from('organisation_settings')
-- Migration is idempotent (CREATE TABLE IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS public.organisation_settings (
  id              UUID PRIMARY KEY REFERENCES public.organisations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  logo_url        TEXT,
  primary_color   TEXT,
  secondary_color TEXT,
  report_template TEXT NOT NULL DEFAULT 'standard'
                       CHECK (report_template IN ('standard', 'detailed', 'executive')),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organisation_settings ENABLE ROW LEVEL SECURITY;

-- RLS policy: users may only see/modify settings for their own organisation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'organisation_settings'
      AND policyname = 'organisation_settings_org_isolation'
  ) THEN
    CREATE POLICY organisation_settings_org_isolation ON public.organisation_settings
      USING (
        id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;
