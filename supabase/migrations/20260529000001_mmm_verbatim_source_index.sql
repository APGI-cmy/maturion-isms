-- MMM Verbatim Source Index (organisation-context source diagnostics + strict lookup)
-- Wave: mmm-verbatim-source-index-20260529

create table if not exists public.mmm_org_source_verbatim_index (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.mmm_organisations(id) on delete cascade,
  document_id uuid not null references public.mmm_subject_knowledge_documents(id) on delete cascade,
  framework_id uuid null references public.mmm_frameworks(id) on delete set null,
  source_mode text not null check (source_mode in ('VERBATIM','HYBRID','GENERATED')),
  domain_name text not null,
  mps_code text not null,
  mps_title text not null,
  intent_verbatim text not null,
  source_anchor text null,
  confidence numeric(5,4) null,
  extracted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(document_id, domain_name, mps_code)
);

create index if not exists idx_mmm_org_source_verbatim_org_framework
  on public.mmm_org_source_verbatim_index (organisation_id, framework_id);

create index if not exists idx_mmm_org_source_verbatim_lookup
  on public.mmm_org_source_verbatim_index (organisation_id, domain_name, mps_code);

alter table public.mmm_org_source_verbatim_index enable row level security;

drop policy if exists "mmm_org_source_verbatim_select" on public.mmm_org_source_verbatim_index;
create policy "mmm_org_source_verbatim_select"
on public.mmm_org_source_verbatim_index
for select
to authenticated
using (
  exists (
    select 1
    from public.mmm_profiles p
    where p.id = auth.uid()
      and p.organisation_id = mmm_org_source_verbatim_index.organisation_id
  )
);

drop policy if exists "mmm_org_source_verbatim_insert" on public.mmm_org_source_verbatim_index;
create policy "mmm_org_source_verbatim_insert"
on public.mmm_org_source_verbatim_index
for insert
to authenticated
with check (
  exists (
    select 1
    from public.mmm_profiles p
    where p.id = auth.uid()
      and p.organisation_id = mmm_org_source_verbatim_index.organisation_id
  )
);

drop policy if exists "mmm_org_source_verbatim_update" on public.mmm_org_source_verbatim_index;
create policy "mmm_org_source_verbatim_update"
on public.mmm_org_source_verbatim_index
for update
to authenticated
using (
  exists (
    select 1
    from public.mmm_profiles p
    where p.id = auth.uid()
      and p.organisation_id = mmm_org_source_verbatim_index.organisation_id
  )
)
with check (
  exists (
    select 1
    from public.mmm_profiles p
    where p.id = auth.uid()
      and p.organisation_id = mmm_org_source_verbatim_index.organisation_id
  )
);

drop policy if exists "mmm_org_source_verbatim_delete" on public.mmm_org_source_verbatim_index;
create policy "mmm_org_source_verbatim_delete"
on public.mmm_org_source_verbatim_index
for delete
to authenticated
using (
  exists (
    select 1
    from public.mmm_profiles p
    where p.id = auth.uid()
      and p.organisation_id = mmm_org_source_verbatim_index.organisation_id
  )
);

create or replace function public.mmm_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_mmm_org_source_verbatim_index_updated_at on public.mmm_org_source_verbatim_index;
create trigger trg_mmm_org_source_verbatim_index_updated_at
before update on public.mmm_org_source_verbatim_index
for each row execute function public.mmm_set_updated_at();
