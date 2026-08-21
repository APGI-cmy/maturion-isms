-- =============================================================================
-- MMM Storage Model Codification — Office MIME types fix for mmm-subject-knowledge bucket
-- Wave: mmm-supplementary-storage-mime-types-20260821
-- Issue: maturion-isms#2025, maturion-isms#2030
-- Builder: interim-cs2-agent (remediation)
-- Date: 2026-08-21
-- =============================================================================
-- Purpose: Add missing Office document MIME types to mmm-subject-knowledge bucket.
--   The bucket's allowlist was missing support for PPT/PPTX (PowerPoint) and XLS/XLSX
--   (Excel) file formats, causing supplementary document uploads to fail at the storage
--   layer with 422/415 errors. This migration adds all Office MIME type variants
--   (both modern Open XML formats and legacy Office formats) for backward compatibility.
-- =============================================================================

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json'
]
WHERE id = 'mmm-subject-knowledge';
