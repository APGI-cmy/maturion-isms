-- Foundational bootstrap: source-of-truth replay prerequisite for public.criteria parity.

create table if not exists public.criteria (
  id uuid primary key default gen_random_uuid(),
  mps_id uuid not null references public.mini_performance_standards(id) on delete cascade,
  domain_id uuid not null references public.domains(id) on delete cascade,
  audit_id uuid not null references public.audits(id) on delete cascade,
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  number text not null,
  description text,
  guidance text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  excluded boolean not null default false,
  sort_order integer not null default 0,
  title text,
  source_anchor text,
  intent_statement text,
  unique (audit_id, number)
);

alter table public.criteria enable row level security;

drop policy if exists criteria_select_org_isolation on public.criteria;
create policy criteria_select_org_isolation
on public.criteria
for select
to authenticated
using (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists criteria_insert_org_isolation on public.criteria;
create policy criteria_insert_org_isolation
on public.criteria
for insert
to public
with check (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists criteria_update_org_isolation on public.criteria;
create policy criteria_update_org_isolation
on public.criteria
for update
to public
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