-- Wave 14 — Evidence Schema Extensions (FR-093 / TR-093)
-- Issue #909 — TASK-W14-BB-001
-- Architecture ref: modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W05
--
-- Adds Wave 14 columns to the existing public.evidence table:
--   findings_text  TEXT                       — user-typed observations, auto-saved
--   deleted        BOOLEAN NOT NULL DEFAULT false — soft-delete flag (replaces deleted_at semantics)
--   storage_path   TEXT                       — Supabase Storage object path for file evidence
--
-- Updates the type CHECK constraint to include 'file' and 'voice' evidence types.
--
-- Migration is idempotent:
--   - ADD COLUMN IF NOT EXISTS guards for all new columns
--   - DROP CONSTRAINT IF EXISTS + ADD CONSTRAINT pattern for type constraint update

-- ---------------------------------------------------------------------------
-- ADD COLUMN: findings_text TEXT
-- Stores free-text findings observations for a criterion. Auto-saved by the
-- EvidenceUploadPanel component with a debounced write.
-- ---------------------------------------------------------------------------
ALTER TABLE public.evidence
  ADD COLUMN IF NOT EXISTS findings_text TEXT;

-- ---------------------------------------------------------------------------
-- ADD COLUMN: deleted BOOLEAN NOT NULL DEFAULT false
-- Soft-delete flag for evidence items. The Wave 14 UX uses a boolean deleted
-- field rather than the nullable deleted_at TIMESTAMPTZ used in v1 schema.
-- Both columns may coexist; this adds the boolean deleted semantics.
-- ---------------------------------------------------------------------------
ALTER TABLE public.evidence
  ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- ADD COLUMN: storage_path TEXT
-- Supabase Storage object path for uploaded evidence files (distinct from the
-- v1 file_path column). Used by the Wave 14 storage-bucket integration.
-- ---------------------------------------------------------------------------
ALTER TABLE public.evidence
  ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- ---------------------------------------------------------------------------
-- UPDATE TYPE CHECK CONSTRAINT
-- Drop the existing inline CHECK constraint (named evidence_type_check by
-- PostgreSQL convention for inline constraints) and replace it with an
-- extended version that adds 'file' and 'voice' evidence types.
--
-- Full updated set:
--   'text', 'photo', 'audio', 'video', 'document', 'interview', 'file', 'voice'
--
-- DROP IF EXISTS + ADD is idempotent: DROP removes whatever exists (or no-ops
-- if absent), then ADD creates the updated constraint fresh.
-- ---------------------------------------------------------------------------
ALTER TABLE public.evidence
  DROP CONSTRAINT IF EXISTS evidence_type_check;

ALTER TABLE public.evidence
  ADD CONSTRAINT evidence_type_check
    CHECK (type IN (
      'text',
      'photo',
      'audio',
      'video',
      'document',
      'interview',
      'file',
      'voice'
    ));
