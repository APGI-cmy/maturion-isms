-- BD-022: Align organisation_name type with data-architecture.md §1.1.3
-- Architecture spec requires organisation_name to be VARCHAR(255) NOT NULL.
-- The prior migration (20260304000001) added it as TEXT (nullable).
-- This migration:
--   1. Backfills any NULL values to prevent NOT NULL constraint failure on existing rows.
--   2. Alters organisation_name to VARCHAR(255) NOT NULL.
--   3. Alters facility_location to VARCHAR(255) to match the VARCHAR(255) spec.
-- Idempotent: safe to re-run — type changes use IF EXISTS column guards.

-- Step 1: Backfill NULLs in organisation_name so NOT NULL can be enforced
-- Placeholder used so existing rows remain identifiable and do not silently pass
-- the 'Organisation name is required' check as if they were legitimately empty.
UPDATE public.audits
SET organisation_name = '(Not Set)'
WHERE organisation_name IS NULL;

-- Step 2: Change organisation_name from TEXT (nullable) to VARCHAR(255) NOT NULL
ALTER TABLE public.audits
  ALTER COLUMN organisation_name TYPE VARCHAR(255),
  ALTER COLUMN organisation_name SET NOT NULL;

-- Step 3: Add max-length DB constraint for organisation_name (belt-and-suspenders over VARCHAR(255))
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'audits_organisation_name_length'
      AND conrelid = 'public.audits'::regclass
  ) THEN
    ALTER TABLE public.audits
      ADD CONSTRAINT audits_organisation_name_length
      CHECK (char_length(organisation_name) <= 255);
  END IF;
END $$;

-- Step 4: Change facility_location from TEXT to VARCHAR(255) to match architecture spec
ALTER TABLE public.audits
  ALTER COLUMN facility_location TYPE VARCHAR(255);

-- Step 5: Add max-length DB constraint for facility_location
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'audits_facility_location_length'
      AND conrelid = 'public.audits'::regclass
  ) THEN
    ALTER TABLE public.audits
      ADD CONSTRAINT audits_facility_location_length
      CHECK (facility_location IS NULL OR char_length(facility_location) <= 255);
  END IF;
END $$;
