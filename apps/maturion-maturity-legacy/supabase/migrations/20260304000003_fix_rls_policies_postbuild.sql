-- Wave postbuild-fails-01: Fix RLS policies and handle_new_user() trigger
-- Incidents: F-001 (profiles RLS INSERT/UPDATE violation), F-002 (audits RLS INSERT violation)
-- Root cause: Missing handle_new_user() trigger and missing profiles/audits INSERT+UPDATE RLS policies
-- Idempotent: uses CREATE OR REPLACE, IF NOT EXISTS, DROP TRIGGER IF EXISTS

-- ─────────────────────────────────────────────────────────────────
-- 1. handle_new_user() trigger function
--    SECURITY DEFINER: runs as owner, bypasses RLS to insert the
--    first profiles row before any user-scoped policy can fire.
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Trigger: fires AFTER INSERT on auth.users (idempotent: drop then recreate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────
-- 2. profiles RLS policies
--    The profiles table has RLS ENABLED but previously had no
--    INSERT or UPDATE policies, causing upsert failures (F-001).
-- ─────────────────────────────────────────────────────────────────

-- SELECT: authenticated user can read their own profile
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'profiles_select_own'
  ) THEN
    CREATE POLICY profiles_select_own ON public.profiles
      FOR SELECT
      USING (auth.uid() = id);
  END IF;
END $$;

-- INSERT: authenticated user can insert their own profile row
--   Covers: useUpdateUserProfile upsert + handle_new_user() trigger path
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'profiles_insert_own'
  ) THEN
    CREATE POLICY profiles_insert_own ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- UPDATE: authenticated user can update only their own profile row
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'profiles_update_own'
  ) THEN
    CREATE POLICY profiles_update_own ON public.profiles
      FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────
-- 3. audits RLS INSERT policy
--    The audits table previously had only audits_org_isolation
--    (USING clause only → SELECT/UPDATE/DELETE), but no INSERT
--    WITH CHECK policy, causing audit creation failures (F-002).
-- ─────────────────────────────────────────────────────────────────

-- INSERT: authenticated user may create an audit they own
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'audits' AND policyname = 'audits_insert_authenticated'
  ) THEN
    CREATE POLICY audits_insert_authenticated ON public.audits
      FOR INSERT
      WITH CHECK (
        auth.role() = 'authenticated'
        AND auth.uid() = created_by
      );
  END IF;
END $$;
