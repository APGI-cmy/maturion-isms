-- Migration: 20260317000002_mps_intent_guidance.sql
-- Wave: Wave 19 — MAT Criteria Parsing Holistic Repair
-- Task IDs: T-W19B-002, T-W19B-004
-- Issue: maturion-isms#1135 (wave-gov-mat-criteria-repair-1135)
-- Branch: copilot/wave-19-holistic-mat-criteria-repair
--
-- Purpose:
--   GAP-PARSE-002 — mini_performance_standards is missing the `intent_statement`
--   and `guidance` columns. LDCS documents contain MPS-level Intent statements
--   (what the standard aims to achieve) and Guidance text (how to achieve it).
--   Both were previously discarded by the Edge Function because there was nowhere
--   to persist them. This migration adds both columns.
--
-- T-W19B-004 — RLS coverage for new columns:
--   In PostgreSQL, row-level security policies govern access at the row level,
--   not the column level. The existing SELECT policy
--   `mini_performance_standards_select_org_isolation` (added in migration
--   20260304000004_fix_rls_remaining_tables.sql) already controls which rows an
--   authenticated user can read — this coverage automatically extends to the new
--   `intent_statement` and `guidance` columns added here.
--
--   Writes to mini_performance_standards (including the new columns) are
--   performed exclusively via the service_role key (bypasses RLS) or via
--   the SECURITY DEFINER function parse_write_back_atomic (migration
--   20260317000003), which runs with elevated privileges. No additional INSERT
--   or UPDATE RLS policies are required, consistent with the pattern established
--   in migration 20260304000004 ("Writes are managed exclusively by service_role
--   key (bypasses RLS)").
--
-- A-032 DDL self-check:
--   Columns added: mini_performance_standards.intent_statement, mini_performance_standards.guidance
--   Table NOT altered: criteria.number (TEXT migration is in 20260317000001)
--   Assertion test: T-W19-003
--
-- Idempotency: ADD COLUMN IF NOT EXISTS guards ensure safe re-execution.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Add intent_statement column ───────────────────────────────────────────
ALTER TABLE public.mini_performance_standards
  ADD COLUMN IF NOT EXISTS intent_statement TEXT;

COMMENT ON COLUMN public.mini_performance_standards.intent_statement IS
  'Wave 19 (GAP-PARSE-002): The intent statement extracted from the LDCS compliance '
  'document — what this Mini Performance Standard aims to achieve. '
  'Previously discarded by the Edge Function; now persisted for full LDCS traceability.';

-- ── 2. Add guidance column ────────────────────────────────────────────────────
ALTER TABLE public.mini_performance_standards
  ADD COLUMN IF NOT EXISTS guidance TEXT;

COMMENT ON COLUMN public.mini_performance_standards.guidance IS
  'Wave 19 (GAP-PARSE-002): Guidance text extracted from the LDCS compliance document — '
  'how to achieve this Mini Performance Standard. '
  'Previously mapped incorrectly or discarded; now stored in its own column.';

-- ── 3. RLS coverage assertion (T-W19B-004) ───────────────────────────────────
-- The existing SELECT org-isolation policy on mini_performance_standards covers
-- all columns including the two added above. No new policy DDL is required.
-- This DO block is a documentation checkpoint — it verifies the existing policy
-- is in place and raises a notice if it is absent (which would indicate a
-- deployment sequencing error).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'mini_performance_standards'
      AND policyname = 'mini_performance_standards_select_org_isolation'
  ) THEN
    RAISE NOTICE
      'Wave 19 T-W19B-004: mini_performance_standards_select_org_isolation policy '
      'not found. Ensure migration 20260304000004_fix_rls_remaining_tables.sql '
      'has been applied before this migration.';
  END IF;
END $$;
