-- MMM criteria edit + maturity descriptor write policies
-- Date: 2026-06-03
-- Purpose:
--   - Allow organisation-scoped users to edit accepted criteria.
--   - Allow organisation-scoped users to create/update five level descriptors per criterion.
--   - Enforce one descriptor row per criterion/level for safe upsert semantics.

DELETE FROM public.mmm_level_descriptors d
USING (
  SELECT
    ctid,
    row_number() OVER (
      PARTITION BY criterion_id, level
      ORDER BY created_at DESC, id DESC
    ) AS duplicate_rank
  FROM public.mmm_level_descriptors
) ranked
WHERE d.ctid = ranked.ctid
  AND ranked.duplicate_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mmm_level_descriptors_criterion_level
  ON public.mmm_level_descriptors (criterion_id, level);

GRANT SELECT, INSERT, UPDATE ON TABLE public.mmm_criteria TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.mmm_level_descriptors TO authenticated;

DROP POLICY IF EXISTS "mmm_criteria_update_own_org" ON public.mmm_criteria;
CREATE POLICY "mmm_criteria_update_own_org"
  ON public.mmm_criteria FOR UPDATE
  TO authenticated
  USING (
    mps_id IN (
      SELECT mps.id FROM public.mmm_maturity_process_steps mps
      JOIN public.mmm_domains d ON d.id = mps.domain_id
      JOIN public.mmm_frameworks f ON f.id = d.framework_id
      WHERE f.organisation_id = public.mmm_current_user_org_id()
    )
  )
  WITH CHECK (
    mps_id IN (
      SELECT mps.id FROM public.mmm_maturity_process_steps mps
      JOIN public.mmm_domains d ON d.id = mps.domain_id
      JOIN public.mmm_frameworks f ON f.id = d.framework_id
      WHERE f.organisation_id = public.mmm_current_user_org_id()
    )
  );

DROP POLICY IF EXISTS "mmm_level_descriptors_insert_own_org" ON public.mmm_level_descriptors;
CREATE POLICY "mmm_level_descriptors_insert_own_org"
  ON public.mmm_level_descriptors FOR INSERT
  TO authenticated
  WITH CHECK (
    criterion_id IN (
      SELECT c.id FROM public.mmm_criteria c
      JOIN public.mmm_maturity_process_steps mps ON mps.id = c.mps_id
      JOIN public.mmm_domains d ON d.id = mps.domain_id
      JOIN public.mmm_frameworks f ON f.id = d.framework_id
      WHERE f.organisation_id = public.mmm_current_user_org_id()
    )
  );

DROP POLICY IF EXISTS "mmm_level_descriptors_update_own_org" ON public.mmm_level_descriptors;
CREATE POLICY "mmm_level_descriptors_update_own_org"
  ON public.mmm_level_descriptors FOR UPDATE
  TO authenticated
  USING (
    criterion_id IN (
      SELECT c.id FROM public.mmm_criteria c
      JOIN public.mmm_maturity_process_steps mps ON mps.id = c.mps_id
      JOIN public.mmm_domains d ON d.id = mps.domain_id
      JOIN public.mmm_frameworks f ON f.id = d.framework_id
      WHERE f.organisation_id = public.mmm_current_user_org_id()
    )
  )
  WITH CHECK (
    criterion_id IN (
      SELECT c.id FROM public.mmm_criteria c
      JOIN public.mmm_maturity_process_steps mps ON mps.id = c.mps_id
      JOIN public.mmm_domains d ON d.id = mps.domain_id
      JOIN public.mmm_frameworks f ON f.id = d.framework_id
      WHERE f.organisation_id = public.mmm_current_user_org_id()
    )
  );
