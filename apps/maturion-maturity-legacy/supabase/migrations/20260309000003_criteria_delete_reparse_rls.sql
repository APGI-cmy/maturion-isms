-- Migration: 20260309000003_criteria_delete_reparse_rls.sql
-- Wave: wave-criteria-delete-reparse
-- Purpose: Add 5 missing RLS policies required by useDeleteCriteriaDocument and
--          useReparseCriteriaDocument hooks (identified by IAA REJECTION-PACKAGE
--          BD-015, re-invocation R2, 2026-03-09).
--
-- Without these policies, DELETE and upsert (INSERT/UPDATE) operations issued
-- by authenticated frontend users are rejected by PostgreSQL RLS default-deny.
--
-- All policies use idempotent IF NOT EXISTS guards.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. domains — DELETE: user may only delete domains belonging to their org
--    (required by useDeleteCriteriaDocument step 1 + useReparseCriteriaDocument step 1)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'domains'
      AND policyname = 'domains_delete_org_isolation'
  ) THEN
    CREATE POLICY domains_delete_org_isolation ON public.domains
      FOR DELETE
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE profiles.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. criteria_documents — INSERT: user may only insert records for their org's audits
--    (required by useReparseCriteriaDocument upsert step 2)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_documents'
      AND policyname = 'criteria_documents_insert_org_isolation'
  ) THEN
    CREATE POLICY criteria_documents_insert_org_isolation ON public.criteria_documents
      FOR INSERT
      WITH CHECK (
        audit_id IN (
          SELECT a.id FROM public.audits a
          JOIN public.profiles p ON p.organisation_id = a.organisation_id
          WHERE p.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. criteria_documents — UPDATE: user may only update records for their org's audits
--    (required by useReparseCriteriaDocument upsert step 2)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_documents'
      AND policyname = 'criteria_documents_update_org_isolation'
  ) THEN
    CREATE POLICY criteria_documents_update_org_isolation ON public.criteria_documents
      FOR UPDATE
      USING (
        audit_id IN (
          SELECT a.id FROM public.audits a
          JOIN public.profiles p ON p.organisation_id = a.organisation_id
          WHERE p.id = auth.uid()
        )
      )
      WITH CHECK (
        audit_id IN (
          SELECT a.id FROM public.audits a
          JOIN public.profiles p ON p.organisation_id = a.organisation_id
          WHERE p.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. criteria_documents — DELETE: user may only delete records for their org's audits
--    (required by useDeleteCriteriaDocument step 2)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'criteria_documents'
      AND policyname = 'criteria_documents_delete_org_isolation'
  ) THEN
    CREATE POLICY criteria_documents_delete_org_isolation ON public.criteria_documents
      FOR DELETE
      USING (
        audit_id IN (
          SELECT a.id FROM public.audits a
          JOIN public.profiles p ON p.organisation_id = a.organisation_id
          WHERE p.id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. audit_logs — DELETE: user may only delete entries belonging to their org
--    (required by useDeleteCriteriaDocument step 3)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'audit_logs'
      AND policyname = 'audit_logs_delete_org_isolation'
  ) THEN
    CREATE POLICY audit_logs_delete_org_isolation ON public.audit_logs
      FOR DELETE
      USING (
        organisation_id IN (
          SELECT organisation_id
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;
