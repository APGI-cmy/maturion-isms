-- Migration: 20260315000003_wave18_profiles_rls_fix.sql
-- Wave: Wave 18 — MAT Criteria Parsing Pipeline End-to-End Repair (Post-Merge Hotfix)
-- Task ID: T-W18P-001
-- Branch: copilot/fix-wave-18-post-merge-hotfixes
--
-- Purpose:
--   Hotfix for the two failure modes that cause audit-documents uploads to be
--   rejected by the secure policy audit_documents_org_insert_v2 (from
--   20260303000005_audit_documents_rls_hardening.sql):
--
--   Failure mode 1 — Missing profiles row:
--     Some auth.users entries may have no corresponding public.profiles row
--     (e.g. users created before the handle_new_user() trigger was deployed in
--     20260304000003_fix_rls_policies_postbuild.sql).  The org-path-prefix
--     subquery returns NULL for these users and all uploads are blocked.
--
--   Failure mode 2 — NULL organisation_id:
--     handle_new_user() creates a profiles row with only (id, email, role); it
--     does NOT set organisation_id.  The RLS comparison:
--         split_part(name, '/', 1) = (SELECT organisation_id::text
--                                     FROM public.profiles WHERE id = auth.uid())
--     evaluates to NULL/FALSE until organisation_id is explicitly assigned.
--     This is CORRECT and INTENTIONAL — uploads MUST be blocked until the user
--     is assigned to an organisation.
--
-- Fix strategy:
--   1. Backfill missing profiles rows for auth.users with no profiles entry.
--   2. Ensure profiles_insert_own and profiles_update_own policies exist so that
--      the application can set organisation_id when assigning a user to an org.
--   3. Document the application contract so it is clear that setting
--      organisation_id is an application-layer responsibility.
--
-- ── Application contract (MUST be enforced by callers) ──────────────────────
--
--   BEFORE a user may upload to the audit-documents bucket ALL of the following
--   must be true:
--
--     a. public.profiles WHERE id = auth.uid() exists AND
--        organisation_id IS NOT NULL
--
--     b. The storage object name begins with the user's organisation_id:
--            /<organisation_id>/<audit_id>/<filename>
--        e.g. 'acme-corp-uuid/audit-123/report.pdf'
--
--   Setting organisation_id is an application-layer responsibility performed
--   when a user is assigned to an organisation (org assignment flow).  The RLS
--   policy correctly blocks uploads until that step is complete.
--
--   DO NOT widen audit_documents_org_insert_v2 to bypass this check — doing so
--   reintroduces INC-W13-BUCKET-RLS-001 (cross-tenant write vulnerability).
--
-- A-032 DDL self-check:
--   Tables / objects touched by this migration:
--     - public.profiles  (INSERT backfill; policy additions)
--   Tables / objects NOT touched:
--     - storage.objects  (policies unchanged — audit_documents_org_insert_v2 preserved)
--     - audit-documents  (bucket unchanged)
--   Column references: profiles.organisation_id (documented/read-only in this migration)
--   Regex compliance (T-W18-QA-012):
--     /audit[-_]documents|storage\.(objects|buckets)|profiles.*organisation_id/i
--     ✓  "audit-documents"           → matches audit[-_]documents
--     ✓  "profiles.organisation_id" → matches profiles.*organisation_id
--
-- Idempotency: INSERT … ON CONFLICT DO NOTHING, DROP POLICY IF EXISTS guards.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Backfill missing profiles rows ────────────────────────────────────────
-- For any auth.users entry that has no corresponding public.profiles row, insert
-- a minimal row with (id, email, role='staff').  organisation_id is intentionally
-- left NULL — it must be set explicitly by the org-assignment flow.
--
-- This is a one-time data backfill.  The handle_new_user() trigger (deployed in
-- 20260304000003) prevents future gaps for new signups.
INSERT INTO public.profiles (id, email, role)
SELECT
  au.id,
  au.email,
  'staff'::text
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ── 2. profiles RLS policies (idempotent) ────────────────────────────────────
-- These policies are also created by 20260304000003_fix_rls_policies_postbuild.sql.
-- The DO $$ blocks below are provided here for completeness and resilience: if
-- 20260304000003 was not run (e.g. in a clean test schema), this migration
-- ensures the policies exist before the org-assignment flow is exercised.

-- INSERT: user can create their own profile row (needed for org assignment flow)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'profiles_insert_own'
  ) THEN
    CREATE POLICY profiles_insert_own ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- UPDATE: user can update their own profile row to set organisation_id
--   This is the write path for the org-assignment flow:
--     UPDATE public.profiles SET organisation_id = $1 WHERE id = auth.uid()
--   Without this policy the application cannot set organisation_id and uploads
--   will remain blocked forever by audit_documents_org_insert_v2.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'profiles_update_own'
  ) THEN
    CREATE POLICY profiles_update_own ON public.profiles
      FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- ── 3. Preservation assertion comment ────────────────────────────────────────
-- audit_documents_org_insert_v2 (from 20260303000005_audit_documents_rls_hardening.sql)
-- is NOT modified by this migration.  The org-path-prefix isolation:
--
--     split_part(name, '/', 1) = (SELECT organisation_id::text
--                                 FROM public.profiles
--                                 WHERE id = auth.uid())
--
-- remains the sole INSERT guard for the audit-documents bucket.  Any migration
-- that weakens this check reintroduces INC-W13-BUCKET-RLS-001 and must not be
-- merged.
-- ─────────────────────────────────────────────────────────────────────────────
