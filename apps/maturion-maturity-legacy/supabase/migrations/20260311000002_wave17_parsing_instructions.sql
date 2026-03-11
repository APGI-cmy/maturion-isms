-- Migration: 20260311000002_wave17_parsing_instructions.sql
-- Wave: Wave 17 — User-Guided AI Parsing Instruction System
-- Purpose: Add parsing_instructions column to criteria_documents and create
--          parsing_instruction_templates table with RLS policies and seed data.
--
-- Deliverables:
--   1. ADD COLUMN parsing_instructions TEXT to criteria_documents (nullable)
--   2. CREATE TABLE parsing_instruction_templates
--   3. Seed 3 system templates (is_system=true), LDCS Standard as is_default=true
--   4. RLS: authenticated SELECT for all; own-row INSERT/UPDATE/DELETE; system templates read-only
--
-- Idempotent: all DDL uses IF NOT EXISTS guards or conditional DO blocks.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Add parsing_instructions column to criteria_documents
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'criteria_documents'
      AND column_name  = 'parsing_instructions'
  ) THEN
    ALTER TABLE public.criteria_documents
      ADD COLUMN parsing_instructions TEXT;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Create parsing_instruction_templates table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.parsing_instruction_templates (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL UNIQUE,
  instructions TEXT        NOT NULL,
  is_default   BOOLEAN     NOT NULL DEFAULT false,
  is_system    BOOLEAN     NOT NULL DEFAULT false,
  created_by   UUID        REFERENCES auth.users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Seed system templates (idempotent: insert only if name not yet present)
-- ─────────────────────────────────────────────────────────────────────────────

-- Template 1: LDCS Standard (verbatim) — default template
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.parsing_instruction_templates
    WHERE name = 'LDCS Standard (verbatim)'
  ) THEN
    INSERT INTO public.parsing_instruction_templates
      (name, instructions, is_default, is_system, created_by)
    VALUES (
      'LDCS Standard (verbatim)',
      'Extract ALL criteria exactly as written. Preserve verbatim text in description fields. Follow LDCS numbered hierarchy: Domain > MPS (25 total) > Criteria with X.Y.Z numbering. Do not summarise. Do not paraphrase. Each criterion description MUST be the complete verbatim text including all sub-items and bullets.',
      true,
      true,
      NULL
    );
  END IF;
END $$;

-- Template 2: Generic Numbered Standard
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.parsing_instruction_templates
    WHERE name = 'Generic Numbered Standard'
  ) THEN
    INSERT INTO public.parsing_instruction_templates
      (name, instructions, is_default, is_system, created_by)
    VALUES (
      'Generic Numbered Standard',
      'Extract criteria following numbered section hierarchy. Preserve full section text in description fields verbatim. Map numbered sections to domains and mini performance standards. Do not summarise.',
      false,
      true,
      NULL
    );
  END IF;
END $$;

-- Template 3: Free-form Policy Document
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.parsing_instruction_templates
    WHERE name = 'Free-form Policy Document'
  ) THEN
    INSERT INTO public.parsing_instruction_templates
      (name, instructions, is_default, is_system, created_by)
    VALUES (
      'Free-form Policy Document',
      'Extract policy requirements and obligations as criteria. Group by policy area or theme as domains. Preserve full requirement text verbatim in description fields. Identify any numbered obligations or requirements.',
      false,
      true,
      NULL
    );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Enable RLS on parsing_instruction_templates
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.parsing_instruction_templates ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. RLS Policies for parsing_instruction_templates
-- ─────────────────────────────────────────────────────────────────────────────

-- 5a. SELECT: all authenticated users may read all templates
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'parsing_instruction_templates'
      AND policyname = 'parsing_instruction_templates_select_authenticated'
  ) THEN
    CREATE POLICY parsing_instruction_templates_select_authenticated
      ON public.parsing_instruction_templates
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- 5b. INSERT: authenticated users may insert their own rows (created_by = auth.uid())
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'parsing_instruction_templates'
      AND policyname = 'parsing_instruction_templates_insert_own'
  ) THEN
    CREATE POLICY parsing_instruction_templates_insert_own
      ON public.parsing_instruction_templates
      FOR INSERT
      TO authenticated
      WITH CHECK (
        created_by = auth.uid()
        AND is_system = false
      );
  END IF;
END $$;

-- 5c. UPDATE: authenticated users may update their own non-system rows only
--     System templates (is_system=true) are read-only for all non-service-role users.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'parsing_instruction_templates'
      AND policyname = 'parsing_instruction_templates_update_own'
  ) THEN
    CREATE POLICY parsing_instruction_templates_update_own
      ON public.parsing_instruction_templates
      FOR UPDATE
      TO authenticated
      USING (
        created_by = auth.uid()
        AND is_system = false
      )
      WITH CHECK (
        created_by = auth.uid()
        AND is_system = false
      );
  END IF;
END $$;

-- 5d. DELETE: authenticated users may delete their own non-system rows only
--     System templates (is_system=true) are read-only for all non-service-role users.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'parsing_instruction_templates'
      AND policyname = 'parsing_instruction_templates_delete_own'
  ) THEN
    CREATE POLICY parsing_instruction_templates_delete_own
      ON public.parsing_instruction_templates
      FOR DELETE
      TO authenticated
      USING (
        created_by = auth.uid()
        AND is_system = false
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS note: service role bypasses RLS entirely in Supabase, so the Edge Function
-- using service-role key can UPDATE criteria_documents.parsing_instructions
-- without requiring a dedicated service-role policy. No additional policy
-- is needed for criteria_documents beyond what is already defined.
-- ─────────────────────────────────────────────────────────────────────────────
