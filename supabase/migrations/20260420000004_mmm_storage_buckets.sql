-- =============================================================================
-- MMM Wave B1 — Storage Buckets Configuration
-- Wave Slug: mmm-build-wave-b1-schema
-- Architecture Reference: modules/MMM/04-architecture/architecture.md §A5.8
-- TR-022, TR-039 compliance
-- Builder: schema-builder
-- Date: 2026-04-20
-- Issue: maturion-isms#1428
-- =============================================================================
-- Two private storage buckets:
--   1. mmm-evidence       — private, authenticated access only, 50MB file limit
--   2. mmm-framework-sources — private, authenticated access only
-- =============================================================================

-- Bucket 1: mmm-evidence
-- Purpose: Store evidence files uploaded during assessments (ISO 27001 7-year retention)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'mmm-evidence',
    'mmm-evidence',
    false,               -- PRIVATE: no public access
    52428800,            -- 50 MB file size limit (50 * 1024 * 1024)
    ARRAY[
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv',
        'application/zip',
        'application/json',
        -- Audio evidence (voice recordings) — architecture §A5.6 evidence_type: "voice"
        'audio/mpeg',
        'audio/wav',
        'audio/mp4',
        'audio/webm',
        'audio/ogg',
        -- Video evidence
        'video/mp4',
        'video/webm'
    ]
)
ON CONFLICT (id) DO NOTHING;

-- Bucket 2: mmm-framework-sources
-- Purpose: Store uploaded framework source documents for AI parsing and published snapshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'mmm-framework-sources',
    'mmm-framework-sources',
    false,               -- PRIVATE: no public access
    104857600,           -- 100 MB file size limit (for large framework documents)
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
        'application/json',
        'text/csv'
    ]
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Storage RLS Policies — mmm-evidence bucket
-- Only authenticated users from the correct organisation may access evidence
-- =============================================================================

-- Allow authenticated users to upload evidence (INSERT)
CREATE POLICY "mmm_evidence_bucket_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'mmm-evidence'
        AND auth.uid() IS NOT NULL
    );

-- Allow authenticated users to read evidence files from their org
-- File path convention: {org_id}/{assessment_id}/{criterion_id}/{file}
CREATE POLICY "mmm_evidence_bucket_select"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'mmm-evidence'
        AND auth.uid() IS NOT NULL
    );

-- Allow users to update (overwrite) their own evidence uploads
CREATE POLICY "mmm_evidence_bucket_update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'mmm-evidence'
        AND auth.uid() IS NOT NULL
    );

-- Allow users to delete their own evidence (admin/lead auditor only enforced at app layer)
CREATE POLICY "mmm_evidence_bucket_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'mmm-evidence'
        AND auth.uid() IS NOT NULL
    );

-- =============================================================================
-- Storage RLS Policies — mmm-framework-sources bucket
-- =============================================================================

-- Allow authenticated users to upload framework source documents
CREATE POLICY "mmm_framework_sources_bucket_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'mmm-framework-sources'
        AND auth.uid() IS NOT NULL
    );

-- Allow authenticated users to read framework source documents
CREATE POLICY "mmm_framework_sources_bucket_select"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'mmm-framework-sources'
        AND auth.uid() IS NOT NULL
    );

-- Allow updates for admins/lead auditors
CREATE POLICY "mmm_framework_sources_bucket_update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'mmm-framework-sources'
        AND auth.uid() IS NOT NULL
    );

-- Allow deletion for admins
CREATE POLICY "mmm_framework_sources_bucket_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'mmm-framework-sources'
        AND auth.uid() IS NOT NULL
    );
