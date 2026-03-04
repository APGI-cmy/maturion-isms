-- Wave 14 — Onboarding Support (GAP-W01)
-- FR-089 / TR-089
-- Creates the onboarding_completions table to track users who have completed the
-- two-step onboarding wizard (full name → create organisation).
-- Idempotent: uses IF NOT EXISTS throughout.

CREATE TABLE IF NOT EXISTS public.onboarding_completions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID       NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  completed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.onboarding_completions ENABLE ROW LEVEL SECURITY;

-- Org-isolation SELECT policy: users can only see their own completion row
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'onboarding_completions'
      AND policyname = 'onboarding_completions_org_isolation'
  ) THEN
    CREATE POLICY onboarding_completions_org_isolation ON public.onboarding_completions
      FOR SELECT
      USING (
        organisation_id IN (
          SELECT organisation_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- Trigger function: after an organisation is created during onboarding, record completion
CREATE OR REPLACE FUNCTION public.record_onboarding_complete()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.onboarding_completions (user_id, organisation_id)
  VALUES (NEW.id, NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: fires after INSERT on organisations (onboarding creates the org)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'organisations_insert_onboarding'
  ) THEN
    CREATE TRIGGER organisations_insert_onboarding
      AFTER INSERT ON public.organisations
      FOR EACH ROW
      EXECUTE FUNCTION public.record_onboarding_complete();
  END IF;
END $$;
