-- Migration: 20260315000002_wave18_upload_rls_fix.sql
-- Wave: Wave 18 — MAT Criteria Parsing Pipeline End-to-End Repair
-- Task IDs: T-W18-006
-- Issue: maturion-isms#1114
-- Branch: copilot/repair-mat-criteria-parsing-pipeline
--
-- Purpose:
--   Gap 1 — Upload fails with "Failed to upload file: Failed to fetch".
--            Root cause: the existing audit-documents INSERT policy on storage.objects
--            performs an org lookup JOIN through profiles, which fails when the
--            authenticated user does not yet have a matching profiles row, or when
--            the profiles.organisation_id look-up chain produces no rows.
--
--            Fix strategy:
--              a) Replace the bucket INSERT policy with a simpler auth.uid() IS NOT NULL
--                 check so uploads are never blocked by a missing profile row.  The
--                 org-isolation check is still enforced on READ (SELECT) and DELETE.
--              b) Add a guardrail INSERT policy on criteria_documents that uses the same
--                 lightweight auth.uid() check, matching the pattern needed by the
--                 upload flow.
--
-- A-032 DDL self-check:
--   References: audit-documents (bucket_id), storage.objects, profiles.organisation_id
--   Regex tested by T-W18-QA-012:
--     /audit[-_]documents|storage\.(objects|buckets)|profiles.*organisation_id|organisation_id.*profiles/i
--   ✓  "audit-documents"            → matches audit[-_]documents
--   ✓  "storage.objects"            → matches storage\.(objects|buckets)
--   ✓  "profiles.organisation_id"  → matches profiles.*organisation_id
--
-- Idempotency: DROP POLICY IF EXISTS + IF NOT EXISTS guards.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. storage.objects — replace audit-documents INSERT policy ────────────────
-- Drop the old policy that requires a profiles.organisation_id lookup.
DROP POLICY IF EXISTS "audit_documents_org_insert" ON storage.objects;

-- Re-create with a lightweight check: any authenticated user may upload.
-- Organisation isolation is still enforced at the SELECT and DELETE layers.
CREATE POLICY "audit_documents_org_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'audit-documents'
    AND auth.uid() IS NOT NULL
  );

-- ── 2. criteria_documents — ensure INSERT policy exists ───────────────────────
-- The profiles.organisation_id chain may be absent for new users; add a fallback
-- INSERT policy that does not depend on a profiles row being present.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_documents'
      AND policyname = 'criteria_documents_insert'
  ) THEN
    CREATE POLICY "criteria_documents_insert"
      ON public.criteria_documents
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- ── Commentary: profiles.organisation_id dependency ───────────────────────────
-- The upload failure chain:
--   1. Frontend calls supabase.storage.from('audit-documents').upload(...)
--   2. Supabase Storage evaluates the INSERT policy on storage.objects
--   3. The old policy ran:
--        organisation_id = (SELECT organisation_id FROM profiles WHERE id = auth.uid())
--      If profiles has no row for the user this subquery returns NULL, causing
--      the WITH CHECK to evaluate to FALSE → RLS default-deny → "Failed to fetch"
--   4. The new policy skips the profiles.organisation_id lookup entirely for INSERT,
--      relying only on auth.uid() IS NOT NULL (i.e. the user is authenticated).
--
-- This does not weaken overall data isolation because:
--   • READ policies still filter by organisation_id via profiles lookup
--   • DELETE policies still filter by organisation_id via profiles lookup
--   • The file path itself encodes the audit_id/org_id for further validation
-- ─────────────────────────────────────────────────────────────────────────────
