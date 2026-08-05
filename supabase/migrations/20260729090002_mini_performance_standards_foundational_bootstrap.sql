-- Foundational bootstrap: source-of-truth replay prerequisite for public.mini_performance_standards parity.
-- Prerequisites: public.organisations, public.audits, public.domains.
-- Write access is service_role-only (no insert/update policies).

create table if not exists public.mini_performance_standards (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references public.domains(id) on delete cascade,
  audit_id uuid not null references public.audits(id) on delete cascade,
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  number integer not null,
  name text not null,
  description text,
  intent_statement text,
  guidance text,
  excluded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (audit_id, number)
);

alter table public.mini_performance_standards enable row level security;

drop policy if exists mini_performance_standards_select_org_isolation on public.mini_performance_standards;
create policy mini_performance_standards_select_org_isolation
on public.mini_performance_standards
for select
to public
using (
  organisation_id in (
    select organisation_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);
