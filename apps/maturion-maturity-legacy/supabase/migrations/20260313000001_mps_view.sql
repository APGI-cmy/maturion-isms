-- Wave 13 Task 13.1 — public.mps compatibility view
-- RCA Reference: MAT-RCA-002 (schema cache miss regression)
-- Task: T-W13-SCH-1–4 (schema-builder — schema migration verification)
--
-- Creates a public.mps view as an alias for public.mini_performance_standards.
-- This ensures any client or hook that references public.mps will resolve correctly.
-- Idempotent: CREATE OR REPLACE VIEW is safe to re-run.

CREATE OR REPLACE VIEW public.mps AS
  SELECT * FROM public.mini_performance_standards;

-- Grant access to authenticated and anonymous roles
GRANT SELECT ON public.mps TO authenticated;
GRANT SELECT ON public.mps TO anon;
