-- Wave 13 Task 13.1 — public.user_profiles compatibility view
-- RCA Reference: INC-W13-PROFILE-TABLE-001 (useSettings.ts table-name drift)
-- Task: T-W13-SCH-3 (schema-builder — schema migration verification)
--
-- Creates a public.user_profiles view as an alias for public.profiles.
-- This is a compatibility shim only; frontend hooks should reference profiles directly.
-- The INC-W13-PROFILE-TABLE-001 fix (useSettings.ts → .from('profiles')) is the
-- primary remediation; this view provides a fallback guard.
-- Idempotent: CREATE OR REPLACE VIEW is safe to re-run.

CREATE OR REPLACE VIEW public.user_profiles AS
  SELECT * FROM public.profiles;

-- Grant SELECT to authenticated role only.
-- anon is intentionally excluded: profiles contains PII (email, etc.) and
-- granting to anon would expose all rows to unauthenticated users, bypassing RLS.
GRANT SELECT ON public.user_profiles TO authenticated;
