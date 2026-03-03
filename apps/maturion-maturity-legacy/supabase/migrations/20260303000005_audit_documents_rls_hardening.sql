-- INC-W13-BUCKET-RLS-001: Harden audit-documents storage bucket RLS with org-level path isolation
-- The prior policies (from 20260303000004_storage_buckets.sql) only check auth.role() = 'authenticated',
-- which allows any authenticated user to read/write any file regardless of organisation.
-- This migration replaces those weak policies with path-prefix org isolation:
--   Files must be stored under /{org_id}/... and users can only access paths matching their own org.

-- Drop the old weak policies for audit-documents
DROP POLICY IF EXISTS audit_documents_org_read   ON storage.objects;
DROP POLICY IF EXISTS audit_documents_org_insert ON storage.objects;
DROP POLICY IF EXISTS audit_documents_org_delete ON storage.objects;

-- SELECT: user may only read files whose top-level path component matches their organisation_id
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'audit_documents_org_read_v2'
  ) THEN
    CREATE POLICY audit_documents_org_read_v2 ON storage.objects
      FOR SELECT
      USING (
        bucket_id = 'audit-documents'
        AND auth.role() = 'authenticated'
        AND split_part(name, '/', 1) = (
          SELECT organisation_id::text
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;

-- INSERT: user may only upload into paths prefixed with their own organisation_id
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'audit_documents_org_insert_v2'
  ) THEN
    CREATE POLICY audit_documents_org_insert_v2 ON storage.objects
      FOR INSERT
      WITH CHECK (
        bucket_id = 'audit-documents'
        AND auth.role() = 'authenticated'
        AND split_part(name, '/', 1) = (
          SELECT organisation_id::text
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;

-- DELETE: user may only delete files within their own organisation's path prefix
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'audit_documents_org_delete_v2'
  ) THEN
    CREATE POLICY audit_documents_org_delete_v2 ON storage.objects
      FOR DELETE
      USING (
        bucket_id = 'audit-documents'
        AND auth.role() = 'authenticated'
        AND split_part(name, '/', 1) = (
          SELECT organisation_id::text
          FROM public.profiles
          WHERE id = auth.uid()
        )
      );
  END IF;
END $$;
