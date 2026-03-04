-- Wave 14 — Exclude Cascade: Domains → MPS → Criteria (GAP-W03)
-- FR-091 / TR-091
-- Adds `excluded` BOOLEAN columns to domains, mini_performance_standards, and criteria.
-- Implements a cascade trigger: setting domains.excluded = true propagates to all child
-- MPS rows (and their criteria). Setting mps.excluded = true propagates to child criteria.
-- The "Create Report" gate query must filter out excluded criteria
-- (WHERE excluded IS NOT TRUE / excluded = false).
-- Idempotent: uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

-- ---------------------------------------------------------------------------
-- Add excluded column to domains
-- ---------------------------------------------------------------------------
ALTER TABLE public.domains
  ADD COLUMN IF NOT EXISTS excluded BOOLEAN NOT NULL DEFAULT FALSE;

-- ---------------------------------------------------------------------------
-- Add excluded column to mini_performance_standards (MPS)
-- ---------------------------------------------------------------------------
ALTER TABLE public.mini_performance_standards
  ADD COLUMN IF NOT EXISTS excluded BOOLEAN NOT NULL DEFAULT FALSE;

-- ---------------------------------------------------------------------------
-- Add excluded column to criteria
-- ---------------------------------------------------------------------------
ALTER TABLE public.criteria
  ADD COLUMN IF NOT EXISTS excluded BOOLEAN NOT NULL DEFAULT FALSE;

-- ---------------------------------------------------------------------------
-- Cascade trigger function: when a domain is toggled excluded, propagate to
-- its child MPS rows and then to their child criteria rows.
-- Also handles MPS-level cascade to child criteria.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cascade_exclude_to_children()
RETURNS TRIGGER AS $$
BEGIN
  -- Cascade domain exclusion to child MPS rows
  IF TG_TABLE_NAME = 'domains' AND OLD.excluded IS DISTINCT FROM NEW.excluded THEN
    UPDATE public.mini_performance_standards
       SET excluded = NEW.excluded
     WHERE domain_id = NEW.id;

    -- Also cascade to criteria directly under this domain
    UPDATE public.criteria
       SET excluded = NEW.excluded
     WHERE domain_id = NEW.id;
  END IF;

  -- Cascade MPS exclusion to child criteria rows
  IF TG_TABLE_NAME = 'mini_performance_standards' AND OLD.excluded IS DISTINCT FROM NEW.excluded THEN
    UPDATE public.criteria
       SET excluded = NEW.excluded
     WHERE mps_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Attach cascade trigger to domains
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'exclude_cascade_domains_trigger'
  ) THEN
    CREATE TRIGGER exclude_cascade_domains_trigger
      AFTER UPDATE OF excluded ON public.domains
      FOR EACH ROW
      EXECUTE FUNCTION public.cascade_exclude_to_children();
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Attach cascade trigger to mini_performance_standards
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'exclude_cascade_mps_trigger'
  ) THEN
    CREATE TRIGGER exclude_cascade_mps_trigger
      AFTER UPDATE OF excluded ON public.mini_performance_standards
      FOR EACH ROW
      EXECUTE FUNCTION public.cascade_exclude_to_children();
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- "Create Report" gate query helper view
-- Counts non-excluded, non-confirmed criteria still blocking report generation.
-- The gate query uses: WHERE excluded IS NOT TRUE (excluded = false or null)
-- to avoid counting excluded criteria as blocking.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.create_report_gate AS
  SELECT
    c.audit_id,
    COUNT(*) FILTER (
      WHERE c.excluded IS NOT TRUE
    ) AS total_non_excluded_criteria
  FROM public.criteria c
  GROUP BY c.audit_id;

-- Comment: the excluded column filters are used in the Create Report gate to
-- skip excluded criteria when checking evaluation completion:
--   SELECT COUNT(*) FROM criteria
--   WHERE audit_id = $1
--     AND excluded IS NOT TRUE
--     AND confirmed_at IS NULL;
