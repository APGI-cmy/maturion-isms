-- Wave AI Criteria Creation Fix — criteria table schema fix
-- Root cause:
--   PRIMARY  — criteria DDL missing `title TEXT` column.
--              Edge Function (supabase/functions/invoke-ai-parse-criteria/index.ts, line 318)
--              inserts `title: c.title ?? null`; PostgreSQL rejected all INSERTs with:
--              "column 'title' of relation 'criteria' does not exist"
--              → every AI parse ended in parse_failed, no criteria stored in DB.
--   SECONDARY — `description TEXT NOT NULL` constraint in core DDL but Edge Function sends
--              `c.description ?? null`; null description would trigger NOT NULL violation.
--
-- Wave    : wave-ai-criteria-creation-fix
-- Branch  : copilot/fix-ai-criteria-creation-failure
-- Task ID : T-W17-SCH-001
-- Tests   : modules/mat/tests/wave17/wave17-criteria-title-fix.test.ts
-- Idempotent: all DDL guarded with IF NOT EXISTS / DO $$ BEGIN … END $$ checks.

-- ---------------------------------------------------------------------------
-- FIX 1 — Add `title TEXT` column to criteria (nullable; title is optional
--         in the AI response — Edge Function sends `c.title ?? null`)
-- ---------------------------------------------------------------------------
ALTER TABLE public.criteria
  ADD COLUMN IF NOT EXISTS title TEXT;

-- ---------------------------------------------------------------------------
-- FIX 2 — Drop NOT NULL constraint on `description` column.
--         The Edge Function sends `c.description ?? null`; when the AI does
--         not provide a description the current NOT NULL constraint causes a
--         violation and the entire upsert fails.
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'criteria'
      AND column_name  = 'description'
      AND is_nullable  = 'NO'
  ) THEN
    ALTER TABLE public.criteria ALTER COLUMN description DROP NOT NULL;
  END IF;
END $$;
