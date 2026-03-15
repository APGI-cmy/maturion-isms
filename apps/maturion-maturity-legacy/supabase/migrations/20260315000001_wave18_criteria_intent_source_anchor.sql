-- Migration: 20260315000001_wave18_criteria_intent_source_anchor.sql
-- Wave: Wave 18 — MAT Criteria Parsing Pipeline End-to-End Repair
-- Task IDs: T-W18-005
-- Issue: maturion-isms#1114
-- Branch: copilot/repair-mat-criteria-parsing-pipeline
--
-- Purpose:
--   Gap 3 — criteria table is missing the `intent_statement TEXT` column.
--            The AI parses an intent statement from the compliance document but
--            there is nowhere to persist it; it was previously discarded.
--   Gap 8 — `source_anchor` (the page/section reference from the source document)
--            was not stored as a discrete column.  The Edge Function was incorrectly
--            mapping source_anchor → guidance, losing both the real guidance text
--            and the traceability anchor.  This migration adds a dedicated column so
--            api-builder (T-W18-007) can wire the correct field mapping.
--
-- A-032 DDL self-check:
--   Column names used in this migration: intent_statement, source_anchor
--   Both match the column names asserted by T-W18-QA-001 and T-W18-QA-002.
--
-- Idempotency: ADD COLUMN IF NOT EXISTS guards ensure safe re-execution.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Add intent_statement column ───────────────────────────────────────────
ALTER TABLE public.criteria
  ADD COLUMN IF NOT EXISTS intent_statement TEXT;

COMMENT ON COLUMN public.criteria.intent_statement IS
  'Wave 18: The intent statement extracted from the compliance document — '
  'what this criterion aims to achieve (Gap 3 fix, T-W18-005)';

-- ── 2. Add source_anchor column ───────────────────────────────────────────────
ALTER TABLE public.criteria
  ADD COLUMN IF NOT EXISTS source_anchor TEXT;

COMMENT ON COLUMN public.criteria.source_anchor IS
  'Wave 18: The page/section reference in the source compliance document for '
  'traceability.  Previously stored incorrectly in the guidance column (Gap 8 fix, T-W18-005)';
