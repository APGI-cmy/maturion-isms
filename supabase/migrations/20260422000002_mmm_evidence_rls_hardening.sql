-- =============================================================================
-- MMM Storage Model Codification — RLS hardening for mmm-evidence bucket
-- Wave: mmm-storage-model-codification-20260422
-- Architecture Reference: modules/MMM/04-architecture/architecture.md §A5.6
-- Issue: maturion-isms#1458
-- Builder: schema-builder
-- Date: 2026-04-22
-- =============================================================================

DROP POLICY IF EXISTS "mmm_evidence_bucket_insert" ON storage.objects;
DROP POLICY IF EXISTS "mmm_evidence_bucket_select" ON storage.objects;
DROP POLICY IF EXISTS "mmm_evidence_bucket_update" ON storage.objects;
DROP POLICY IF EXISTS "mmm_evidence_bucket_delete" ON storage.objects;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='mmm_evidence_org_read_v2') THEN
    CREATE POLICY "mmm_evidence_org_read_v2" ON storage.objects FOR SELECT TO authenticated
      USING (bucket_id = 'mmm-evidence' AND split_part(name,'/',1)=(SELECT organisation_id::text FROM mmm_organisations mo JOIN mmm_organisation_users mou ON mou.organisation_id=mo.id WHERE mou.user_id=auth.uid() LIMIT 1));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='mmm_evidence_org_insert_v2') THEN
    CREATE POLICY "mmm_evidence_org_insert_v2" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'mmm-evidence' AND split_part(name,'/',1)=(SELECT organisation_id::text FROM mmm_organisations mo JOIN mmm_organisation_users mou ON mou.organisation_id=mo.id WHERE mou.user_id=auth.uid() LIMIT 1));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='mmm_evidence_org_update_v2') THEN
    CREATE POLICY "mmm_evidence_org_update_v2" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'mmm-evidence' AND split_part(name,'/',1)=(SELECT organisation_id::text FROM mmm_organisations mo JOIN mmm_organisation_users mou ON mou.organisation_id=mo.id WHERE mou.user_id=auth.uid() LIMIT 1))
      WITH CHECK (bucket_id = 'mmm-evidence' AND split_part(name,'/',1)=(SELECT organisation_id::text FROM mmm_organisations mo JOIN mmm_organisation_users mou ON mou.organisation_id=mo.id WHERE mou.user_id=auth.uid() LIMIT 1));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='mmm_evidence_org_delete_v2') THEN
    CREATE POLICY "mmm_evidence_org_delete_v2" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'mmm-evidence' AND split_part(name,'/',1)=(SELECT organisation_id::text FROM mmm_organisations mo JOIN mmm_organisation_users mou ON mou.organisation_id=mo.id WHERE mou.user_id=auth.uid() LIMIT 1));
  END IF;
END $$;
