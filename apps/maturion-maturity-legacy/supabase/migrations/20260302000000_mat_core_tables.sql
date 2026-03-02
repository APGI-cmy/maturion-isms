-- Wave 13 Task 13.1: MAT Core Tables Migration
-- Fixes W13-GAP-001: Missing public.audits in production schema cache
-- RCA Reference: MAT-RCA-002 (F-02)
-- Idempotent: uses CREATE TABLE IF NOT EXISTS

-- organisations table (prerequisite)
CREATE TABLE IF NOT EXISTS public.organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- profiles table (prerequisite)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES public.organisations(id),
  display_name TEXT,
  email TEXT,
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- audits table (W13-GAP-001 fix)
CREATE TABLE IF NOT EXISTS public.audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  framework TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','completed','archived')),
  target_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- domains table (W13-GAP-003 fix)
CREATE TABLE IF NOT EXISTS public.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (audit_id, number)
);

-- mini_performance_standards table
CREATE TABLE IF NOT EXISTS public.mini_performance_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (audit_id, number)
);

-- criteria table (W13-GAP-003 fix)
CREATE TABLE IF NOT EXISTS public.criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mps_id UUID NOT NULL REFERENCES public.mini_performance_standards(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  description TEXT NOT NULL,
  guidance TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (audit_id, number)
);

-- Enable RLS
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mini_performance_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;

-- RLS policies (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='audits' AND policyname='audits_org_isolation') THEN
    CREATE POLICY audits_org_isolation ON public.audits
      USING (organisation_id::text = current_setting('app.current_organisation_id', true));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='domains' AND policyname='domains_org_isolation') THEN
    CREATE POLICY domains_org_isolation ON public.domains
      USING (organisation_id::text = current_setting('app.current_organisation_id', true));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='criteria' AND policyname='criteria_org_isolation') THEN
    CREATE POLICY criteria_org_isolation ON public.criteria
      USING (organisation_id::text = current_setting('app.current_organisation_id', true));
  END IF;
END $$;
