-- Migration: Add sort_order column to domains, mini_performance_standards, and criteria
-- Incident: INC-POST-FCWT-SORT-ORDER-001
-- RCA: useCriteriaTree() calls .order('sort_order') on all three tables but no migration
--      had ever added the sort_order column. Schema-to-hook drift: same class as INC-W14-COL-MAPPING-001.
-- Authority: CS2 (Johan Ras / @APGI-cmy) — Issue #[Post-FCWT Production Failures]
-- Date: 2026-03-06

ALTER TABLE public.domains
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.mini_performance_standards
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.criteria
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
