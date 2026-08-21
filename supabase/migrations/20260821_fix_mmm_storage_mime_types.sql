-- Fix MMM supplementary file upload failures
-- Root cause: storage bucket mmm-subject-knowledge was missing PPTX/XLSX MIME type allowlist entries
-- Impact: Supplementary .pptx and .xlsx file uploads were rejected at storage layer with 422/415 error
-- Solution: Add missing MIME types to allowed_mime_types array

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
WHERE name = 'mmm-subject-knowledge';
