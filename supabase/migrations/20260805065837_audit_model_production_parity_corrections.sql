-- Production-parity corrections for audit model tables and cascade function.
-- Corrects gaps identified by independent metadata comparison after preview replay at e2a1b7b.

-- ─────────────────────────────────────────────────────────────────
-- 1. public.audits corrections
-- ─────────────────────────────────────────────────────────────────

-- Add missing audit period columns
alter table public.audits
  add column if not exists audit_period_start date,
  add column if not exists audit_period_end date;

-- Change facility_location from text to varchar (production type alignment)
alter table public.audits
  alter column facility_location type varchar using facility_location::varchar;

-- Remove default from organisation_name (retain varchar(255) not null)
alter table public.audits
  alter column organisation_name drop default;

-- Add missing INSERT policy: any authenticated user may create an audit
drop policy if exists audits_insert_authenticated on public.audits;
create policy audits_insert_authenticated
on public.audits
as permissive for insert
to authenticated
with check (created_by = auth.uid());

-- Add missing ALL policy: org-scoped universal access for organisation members
drop policy if exists audits_org_isolation on public.audits;
create policy audits_org_isolation
on public.audits
as permissive for all
to authenticated
using (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

-- ─────────────────────────────────────────────────────────────────
-- 2. public.domains corrections
-- ─────────────────────────────────────────────────────────────────

-- Add missing DELETE policy TO public, using profile-derived organisation predicate
drop policy if exists domains_delete_org_isolation on public.domains;
create policy domains_delete_org_isolation
on public.domains
for delete
to public
using (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

-- ─────────────────────────────────────────────────────────────────
-- 3. cascade_exclude_to_children() — production-equivalent search path
-- ─────────────────────────────────────────────────────────────────

create or replace function public.cascade_exclude_to_children()
returns trigger as $$
begin
  -- Cascade domain exclusion to child MPS rows
  if tg_table_name = 'domains' and old.excluded is distinct from new.excluded then
    update public.mini_performance_standards
       set excluded = new.excluded
     where domain_id = new.id;

    -- Also cascade to criteria directly under this domain
    update public.criteria
       set excluded = new.excluded
     where domain_id = new.id;
  end if;

  -- Cascade MPS exclusion to child criteria rows
  if tg_table_name = 'mini_performance_standards' and old.excluded is distinct from new.excluded then
    update public.criteria
       set excluded = new.excluded
     where mps_id = new.id;
  end if;

  return new;
end;
$$ language plpgsql
   set search_path = public, auth, storage, extensions, pg_temp;
