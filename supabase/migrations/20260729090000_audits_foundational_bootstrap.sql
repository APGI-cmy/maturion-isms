-- Foundational bootstrap: source-of-truth replay prerequisite for public.audits parity.
-- Prerequisites: public.organisations (existing bootstrap), auth.users (identity link).

create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  title text not null,
  description text,
  framework text,
  status text not null default 'draft',
  target_date date,
  created_by uuid references auth.users(id),
  organisation_name varchar(255) not null default '',
  facility_location text,
  audit_lead_id uuid references auth.users(id),
  criteria_approved boolean not null default false,
  criteria_approved_at timestamptz,
  criteria_approved_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.audits enable row level security;

drop policy if exists audits_select_org_isolation on public.audits;
create policy audits_select_org_isolation
on public.audits
as permissive for select
to authenticated
using (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists audits_update_org_isolation on public.audits;
create policy audits_update_org_isolation
on public.audits
as permissive for update
to authenticated
using (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
)
with check (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists audits_delete_org_isolation on public.audits;
create policy audits_delete_org_isolation
on public.audits
as permissive for delete
to authenticated
using (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);
