-- Migration: 20260317000001_criteria_number_text.sql
-- Wave: Wave 19 — MAT Criteria Parsing Holistic Repair
-- Task IDs: T-W19B-001
-- Issue: maturion-isms#1135 (wave-gov-mat-criteria-repair-1135)
-- Branch: copilot/wave-19-holistic-mat-criteria-repair
--
-- Purpose:
--   GAP-PARSE-001 — criteria.number is INTEGER NOT NULL, but LDCS criteria
--   identifiers are hierarchical strings like "1.4.1", "2.7.5", "5.26.7".
--   An INTEGER column cannot store these values. The Edge Function was working
--   around this by substituting idx+1 (sequential integer), discarding the real
--   LDCS IDs. This migration converts the column to TEXT so the real identifiers
--   can be stored.
--
-- AD-W19-001 CONSTRAINT (DO NOT REMOVE):
--   mini_performance_standards.number stays INTEGER — ONLY criteria.number
--   is changed to TEXT. This constraint is enforced by tests T-W19-002 and T-W19-015.
--
-- A-032 DDL self-check:
--   Column altered: criteria.number (INTEGER → TEXT)
--   Table NOT altered: mini_performance_standards.number (stays INTEGER)
--   Assertion tests: T-W19-002, T-W19-015
--
-- Idempotency note:
--   ALTER COLUMN TYPE is not idempotent by default. The USING cast (number::TEXT)
--   is safe on re-run only if the column is already TEXT (a no-op TYPE change).
--   Wrap with a conditional check to make it idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  -- Only execute the ALTER if the column is still integer/numeric type.
  -- This makes the migration safe to re-run (idempotent).
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'criteria'
      AND column_name  = 'number'
      AND data_type    IN ('integer', 'bigint', 'smallint', 'numeric')
  ) THEN
    ALTER TABLE public.criteria ALTER COLUMN number TYPE TEXT USING number::TEXT;
  END IF;
END $$;

COMMENT ON COLUMN public.criteria.number IS
  'Wave 19 (GAP-PARSE-001): LDCS hierarchical criteria identifier, e.g. "1.4.1", "2.7.5". '
  'Changed from INTEGER to TEXT so real LDCS IDs can be persisted. '
  'AD-W19-001: mini_performance_standards.number remains INTEGER.';
