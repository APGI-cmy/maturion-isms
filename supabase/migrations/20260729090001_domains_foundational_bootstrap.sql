-- Foundational bootstrap: source-of-truth replay prerequisite for public.domains parity.
-- Prerequisites: public.organisations, public.audits.

create table if not exists public.domains (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references public.audits(id) on delete cascade,
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  number integer not null,
  name text not null,
  description text,
  excluded boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (audit_id, number)
);

alter table public.domains enable row level security;

drop policy if exists domains_select_org_isolation on public.domains;
create policy domains_select_org_isolation
on public.domains
as permissive for select
to authenticated
using (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists domains_insert_org_isolation on public.domains;
create policy domains_insert_org_isolation
on public.domains
for insert
with check (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists domains_update_org_isolation on public.domains;
create policy domains_update_org_isolation
on public.domains
for update
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
