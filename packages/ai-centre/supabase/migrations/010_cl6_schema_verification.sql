-- CL-6 Schema Verification SQL — LKIAC Wave 3 Knowledge Re-ingestion
--
-- Wave:         CL-6 (LKIAC Wave 3)
-- Deliverable:  CL-6-D2 (schema verification component)
-- Architecture: CL6-FFA-010 (schema verification correctness)
--               CL6-FFA-007 (RLS policy scoped to authenticated only)
-- Issue:        #1240
-- Branch:       copilot/cl-6-relaunch-knowledge-ingestion
--
-- Purpose:
--   1. Verify ai_knowledge table contains all required columns from the
--      migration chain (003 → 006 → 008 → 009).
--   2. Fix RLS policy: drop anon INSERT access, scope
--      ai_knowledge_org_insert to TO authenticated only.

-- ---------------------------------------------------------------------------
-- Part 1: Schema Column Verification (CL6-FFA-010)
-- Raises an exception if any required column is missing.
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  v_missing_columns TEXT := '';
  v_required_columns TEXT[] := ARRAY[
    'id',
    'organisation_id',
    'content',
    'source',
    'domain',
    'metadata',
    'embedding',
    'content_hash',
    'approval_status',
    'created_at'
  ];
  v_col TEXT;
  v_col_exists BOOLEAN;
BEGIN
  FOREACH v_col IN ARRAY v_required_columns LOOP
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name   = 'ai_knowledge'
        AND column_name  = v_col
    ) INTO v_col_exists;

    IF NOT v_col_exists THEN
      v_missing_columns := v_missing_columns || v_col || ', ';
    END IF;
  END LOOP;

  IF v_missing_columns <> '' THEN
    RAISE EXCEPTION
      'CL6-FFA-010: ai_knowledge table is missing required columns: [%]. '
      'Verify migration chain 003→006→008→009 has been applied.',
      rtrim(v_missing_columns, ', ');
  ELSE
    RAISE NOTICE 'CL6-FFA-010: All 10 required columns verified present in ai_knowledge.';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Part 2: RLS Policy Fix — Drop anon INSERT, scope to authenticated only
-- CL6-FFA-007: ai_knowledge_org_insert must be TO authenticated only.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  -- Drop the existing policy regardless of its current role scope
  -- so we can recreate it scoped correctly to authenticated only.
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'ai_knowledge'
      AND policyname = 'ai_knowledge_org_insert'
  ) THEN
    EXECUTE 'DROP POLICY ai_knowledge_org_insert ON public.ai_knowledge';
    RAISE NOTICE 'CL6-FFA-007: Dropped existing ai_knowledge_org_insert policy.';
  ELSE
    RAISE NOTICE 'CL6-FFA-007: ai_knowledge_org_insert policy not found — will create fresh.';
  END IF;
END $$;

-- Recreate the INSERT policy scoped to authenticated role only.
-- anon role must NOT have INSERT access to ai_knowledge (CL6-FFA-007).
-- Uses the same org-isolation predicate as migrations 003 and 008 to stay
-- consistent with the rest of the schema (current_setting convention).
CREATE POLICY ai_knowledge_org_insert
  ON public.ai_knowledge
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Org-scoped insert: authenticated user may only insert rows for the
    -- organisation set in the existing session-scoped organisation context.
    organisation_id = NULLIF(current_setting('app.current_organisation_id', true), '')::text
  );

-- Verify the recreated policy is scoped to authenticated only
DO $$
DECLARE
  v_roles TEXT;
BEGIN
  SELECT string_agg(r.rolname, ', ' ORDER BY r.rolname)
  INTO v_roles
  FROM pg_policies p
  JOIN pg_roles r ON r.rolname = ANY(
    -- Parse roles array from pg_policies.roles (text[])
    string_to_array(
      btrim(p.roles::text, '{}'),
      ','
    )
  )
  WHERE p.schemaname = 'public'
    AND p.tablename  = 'ai_knowledge'
    AND p.policyname = 'ai_knowledge_org_insert';

  RAISE NOTICE 'CL6-FFA-007: ai_knowledge_org_insert policy roles: [%]', COALESCE(v_roles, '(none)');

  -- Final assertion: anon must not appear in the recreated policy
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'ai_knowledge'
      AND policyname = 'ai_knowledge_org_insert'
      AND 'anon' = ANY(roles)
  ) THEN
    RAISE EXCEPTION
      'CL6-FFA-007 VIOLATION: ai_knowledge_org_insert policy still grants INSERT to anon role. '
      'Manual remediation required.';
  ELSE
    RAISE NOTICE 'CL6-FFA-007: VERIFIED — ai_knowledge_org_insert is scoped to authenticated only. anon INSERT access removed.';
  END IF;
END $$;
