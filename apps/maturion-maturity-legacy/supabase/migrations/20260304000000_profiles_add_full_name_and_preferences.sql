-- Wave 14 Addendum A: Add full_name and preferences columns to profiles table
-- Incidents: INC-W14-PROFILES-COL-001 (full_name), INC-W14-PROFILES-COL-002 (preferences)
-- Architecture: modules/mat/02-architecture/data-architecture.md §1.1.2 (extended)
-- Idempotent: ADD COLUMN IF NOT EXISTS guards prevent errors on re-run

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;
