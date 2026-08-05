-- Recovery of the already-applied MMM private-helper policy reconciliation.
-- Provenance: live migration history 20260728070417 and Issue #1959.
-- Source-only recovery: this migration is already recorded on the bound project.

begin;

drop policy if exists mmm_criteria_update_own_org on public.mmm_criteria;
create policy mmm_criteria_update_own_org
on public.mmm_criteria
for update
to authenticated
using (
  mps_id in (
    select mps.id
    from public.mmm_maturity_process_steps mps
    join public.mmm_domains d on d.id = mps.domain_id
    join public.mmm_frameworks f on f.id = d.framework_id
    where f.organisation_id = app_private.mmm_current_user_org_id()
  )
)
with check (
  mps_id in (
    select mps.id
    from public.mmm_maturity_process_steps mps
    join public.mmm_domains d on d.id = mps.domain_id
    join public.mmm_frameworks f on f.id = d.framework_id
    where f.organisation_id = app_private.mmm_current_user_org_id()
  )
);

drop policy if exists mmm_level_descriptors_insert_own_org on public.mmm_level_descriptors;
create policy mmm_level_descriptors_insert_own_org
on public.mmm_level_descriptors
for insert
to authenticated
with check (
  criterion_id in (
    select c.id
    from public.mmm_criteria c
    join public.mmm_maturity_process_steps mps on mps.id = c.mps_id
    join public.mmm_domains d on d.id = mps.domain_id
    join public.mmm_frameworks f on f.id = d.framework_id
    where f.organisation_id = app_private.mmm_current_user_org_id()
  )
);

drop policy if exists mmm_level_descriptors_update_own_org on public.mmm_level_descriptors;
create policy mmm_level_descriptors_update_own_org
on public.mmm_level_descriptors
for update
to authenticated
using (
  criterion_id in (
    select c.id
    from public.mmm_criteria c
    join public.mmm_maturity_process_steps mps on mps.id = c.mps_id
    join public.mmm_domains d on d.id = mps.domain_id
    join public.mmm_frameworks f on f.id = d.framework_id
    where f.organisation_id = app_private.mmm_current_user_org_id()
  )
)
with check (
  criterion_id in (
    select c.id
    from public.mmm_criteria c
    join public.mmm_maturity_process_steps mps on mps.id = c.mps_id
    join public.mmm_domains d on d.id = mps.domain_id
    join public.mmm_frameworks f on f.id = d.framework_id
    where f.organisation_id = app_private.mmm_current_user_org_id()
  )
);

drop policy if exists mmm_evidence_org_read_v2 on storage.objects;
create policy mmm_evidence_org_read_v2
on storage.objects
for select
to authenticated
using (
  bucket_id = 'mmm-evidence'
  and split_part(name, '/', 1) = app_private.mmm_current_user_org_id()::text
);

drop policy if exists mmm_evidence_org_insert_v2 on storage.objects;
create policy mmm_evidence_org_insert_v2
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'mmm-evidence'
  and split_part(name, '/', 1) = app_private.mmm_current_user_org_id()::text
);

drop policy if exists mmm_evidence_org_update_v2 on storage.objects;
create policy mmm_evidence_org_update_v2
on storage.objects
for update
to authenticated
using (
  bucket_id = 'mmm-evidence'
  and split_part(name, '/', 1) = app_private.mmm_current_user_org_id()::text
)
with check (
  bucket_id = 'mmm-evidence'
  and split_part(name, '/', 1) = app_private.mmm_current_user_org_id()::text
);

drop policy if exists mmm_evidence_org_delete_v2 on storage.objects;
create policy mmm_evidence_org_delete_v2
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'mmm-evidence'
  and split_part(name, '/', 1) = app_private.mmm_current_user_org_id()::text
);

commit;
