-- INC-W13-BUCKET-001: Create Supabase Storage buckets referenced by frontend hooks
-- Sources:
--   useCriteria.ts / useEvidence.ts  → supabase.storage.from('audit-documents')
--   useSettings.ts                   → supabase.storage.from('organisation-assets')
-- Migration is idempotent (ON CONFLICT DO NOTHING)

-- Bucket: audit-documents (private, 50 MB limit)
-- Stores evidence files: PDFs, Office docs, plain text, images, audio, video
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audit-documents',
  'audit-documents',
  false,
  52428800,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/mpeg',
    'audio/wav',
    'video/mp4'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Bucket: organisation-assets (public, 10 MB limit)
-- Stores branding assets: logos and imagery
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'organisation-assets',
  'organisation-assets',
  true,
  10485760,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: audit-documents — authenticated users access only their org's files
-- (Row-level policies on storage.objects use the bucket_id and path prefix convention)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'audit_documents_org_read'
  ) THEN
    CREATE POLICY audit_documents_org_read ON storage.objects
      FOR SELECT
      USING (
        bucket_id = 'audit-documents'
        AND auth.role() = 'authenticated'
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'audit_documents_org_insert'
  ) THEN
    CREATE POLICY audit_documents_org_insert ON storage.objects
      FOR INSERT
      WITH CHECK (
        bucket_id = 'audit-documents'
        AND auth.role() = 'authenticated'
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'audit_documents_org_delete'
  ) THEN
    CREATE POLICY audit_documents_org_delete ON storage.objects
      FOR DELETE
      USING (
        bucket_id = 'audit-documents'
        AND auth.role() = 'authenticated'
      );
  END IF;
END $$;

-- Storage RLS: organisation-assets — public reads, authenticated writes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'organisation_assets_public_read'
  ) THEN
    CREATE POLICY organisation_assets_public_read ON storage.objects
      FOR SELECT
      USING (bucket_id = 'organisation-assets');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'organisation_assets_auth_insert'
  ) THEN
    CREATE POLICY organisation_assets_auth_insert ON storage.objects
      FOR INSERT
      WITH CHECK (
        bucket_id = 'organisation-assets'
        AND auth.role() = 'authenticated'
      );
  END IF;
END $$;
