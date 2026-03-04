-- Wave 14 follow-up: organisations SELECT policy for linked users
-- Without this, authenticated users cannot read their own organisation row
-- because RLS is enabled but no SELECT policy exists.
-- Idempotent via DO $$ BEGIN ... IF NOT EXISTS ... END $$

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'organisations'
      AND policyname = 'organisations_member_read'
  ) THEN
    CREATE POLICY organisations_member_read ON public.organisations
      FOR SELECT
      USING (
        id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;
