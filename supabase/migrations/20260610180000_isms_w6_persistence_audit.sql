-- ISMS W6 — Backend Boundary, Persistence, Schema/RLS, Audit
-- Scope: schema/RLS/audit boundary only. No Edge Function is introduced by this migration.

create extension if not exists pgcrypto;

create table if not exists public.isms_onboarding_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organisation_name text not null,
  sector text not null,
  primary_goal text not null,
  responsible_person text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.isms_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  organisation_name text,
  sector text,
  overall_score numeric(3,1),
  overall_level text,
  domain_results jsonb not null default '[]'::jsonb,
  report_summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.isms_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_key text not null,
  source text,
  status text not null default 'mock_active',
  created_at timestamptz not null default now(),
  unique (user_id, module_key)
);

create table if not exists public.isms_maturity_handoffs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organisation_name text not null,
  sector text not null,
  primary_goal text not null,
  responsible_person text not null,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.isms_audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  surface text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.isms_onboarding_profiles enable row level security;
alter table public.isms_assessments enable row level security;
alter table public.isms_entitlements enable row level security;
alter table public.isms_maturity_handoffs enable row level security;
alter table public.isms_audit_events enable row level security;

create policy "ISMS onboarding profiles are user scoped"
  on public.isms_onboarding_profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "ISMS assessments are user scoped when authenticated"
  on public.isms_assessments
  for all
  using (user_id is null or auth.uid() = user_id)
  with check (user_id is null or auth.uid() = user_id);

create policy "ISMS entitlements are user scoped"
  on public.isms_entitlements
  for select
  using (auth.uid() = user_id);

create policy "ISMS maturity handoffs are user scoped"
  on public.isms_maturity_handoffs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "ISMS audit events are user scoped"
  on public.isms_audit_events
  for all
  using (user_id is null or auth.uid() = user_id)
  with check (user_id is null or auth.uid() = user_id);

create index if not exists isms_onboarding_profiles_user_idx on public.isms_onboarding_profiles(user_id);
create index if not exists isms_assessments_user_idx on public.isms_assessments(user_id);
create index if not exists isms_entitlements_user_idx on public.isms_entitlements(user_id);
create index if not exists isms_maturity_handoffs_user_idx on public.isms_maturity_handoffs(user_id);
create index if not exists isms_audit_events_user_idx on public.isms_audit_events(user_id);
create index if not exists isms_audit_events_type_idx on public.isms_audit_events(event_type);
