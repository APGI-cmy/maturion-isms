-- =============================================================================
-- MMM Storage Model Codification — Audio MIME fix for mmm-evidence bucket
-- Wave: mmm-storage-model-codification-20260422
-- Architecture Reference: modules/MMM/04-architecture/architecture.md §A5.6
-- ADR Reference: modules/MMM/storage-model-decision.md §3.2
-- Issue: maturion-isms#1458
-- Builder: schema-builder
-- Date: 2026-04-22
-- =============================================================================
-- Purpose: Add missing audio/video MIME types to mmm-evidence bucket.
--   The B1 migration created mmm-evidence but omitted audio MIME types required
--   for the architecture's evidence_type: "voice" support (§A5.6).
--   This migration uses ON CONFLICT DO UPDATE to add the missing MIME types.
-- =============================================================================

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
    -- Images (photo evidence)
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    -- Documents
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
WHERE id = 'mmm-evidence';
