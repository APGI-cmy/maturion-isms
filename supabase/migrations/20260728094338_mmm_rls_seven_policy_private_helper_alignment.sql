-- Issue #1959: align exactly seven MMM RLS policies with the hardened
-- private organisation identity helper. The statements preserve each policy's
-- command, role list, and all predicates other than the qualified helper call.

ALTER POLICY "mmm_criteria_update_own_org"
  ON public.mmm_criteria
  USING (
    mps_id IN (
      SELECT mps.id FROM public.mmm_maturity_process_steps mps
      JOIN public.mmm_domains d ON d.id = mps.domain_id
      JOIN public.mmm_frameworks f ON f.id = d.framework_id
      WHERE f.organisation_id = app_private.mmm_current_user_org_id()
    )
  )
  WITH CHECK (
    mps_id IN (
      SELECT mps.id FROM public.mmm_maturity_process_steps mps
      JOIN public.mmm_domains d ON d.id = mps.domain_id
      JOIN public.mmm_frameworks f ON f.id = d.framework_id
      WHERE f.organisation_id = app_private.mmm_current_user_org_id()
    )
  );

ALTER POLICY "mmm_level_descriptors_insert_own_org"
  ON public.mmm_level_descriptors
  WITH CHECK (
    criterion_id IN (
      SELECT c.id FROM public.mmm_criteria c
      JOIN public.mmm_maturity_process_steps mps ON mps.id = c.mps_id
      JOIN public.mmm_domains d ON d.id = mps.domain_id
      JOIN public.mmm_frameworks f ON f.id = d.framework_id
      WHERE f.organisation_id = app_private.mmm_current_user_org_id()
    )
  );

ALTER POLICY "mmm_level_descriptors_update_own_org"
  ON public.mmm_level_descriptors
  USING (
    criterion_id IN (
      SELECT c.id FROM public.mmm_criteria c
      JOIN public.mmm_maturity_process_steps mps ON mps.id = c.mps_id
      JOIN public.mmm_domains d ON d.id = mps.domain_id
      JOIN public.mmm_frameworks f ON f.id = d.framework_id
      WHERE f.organisation_id = app_private.mmm_current_user_org_id()
    )
  )
  WITH CHECK (
    criterion_id IN (
      SELECT c.id FROM public.mmm_criteria c
      JOIN public.mmm_maturity_process_steps mps ON mps.id = c.mps_id
      JOIN public.mmm_domains d ON d.id = mps.domain_id
      JOIN public.mmm_frameworks f ON f.id = d.framework_id
      WHERE f.organisation_id = app_private.mmm_current_user_org_id()
    )
  );

ALTER POLICY "mmm_evidence_org_read_v2"
  ON storage.objects
  USING (
    bucket_id = 'mmm-evidence'
    AND split_part(name, '/', 1) = app_private.mmm_current_user_org_id()::text
  );

ALTER POLICY "mmm_evidence_org_insert_v2"
  ON storage.objects
  WITH CHECK (
    bucket_id = 'mmm-evidence'
    AND split_part(name, '/', 1) = app_private.mmm_current_user_org_id()::text
  );

ALTER POLICY "mmm_evidence_org_update_v2"
  ON storage.objects
  USING (
    bucket_id = 'mmm-evidence'
    AND split_part(name, '/', 1) = app_private.mmm_current_user_org_id()::text
  )
  WITH CHECK (
    bucket_id = 'mmm-evidence'
    AND split_part(name, '/', 1) = app_private.mmm_current_user_org_id()::text
  );

ALTER POLICY "mmm_evidence_org_delete_v2"
  ON storage.objects
  USING (
    bucket_id = 'mmm-evidence'
    AND split_part(name, '/', 1) = app_private.mmm_current_user_org_id()::text
  );
