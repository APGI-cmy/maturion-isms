-- PIT Stage 12 Slice 4 — projects, source_links and organisation-scoped RLS
-- Authority: issue #1943; governance PR #1945; implementation PR #1952.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(id) on delete restrict,
  name text not null check (length(btrim(name)) > 0),
  type text not null check (type in ('project', 'operational', 'improvement')),
  quick_win_type text not null check (quick_win_type in ('quick_win', 'medium_term', 'long_term')),
  description text not null default '',
  project_leader_id uuid not null references public.profiles(id) on delete restrict,
  project_leader_label text not null check (length(btrim(project_leader_label)) > 0),
  start_date date not null,
  end_date date not null,
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  capex_amount numeric(18,2) check (capex_amount is null or capex_amount >= 0),
  opex_amount numeric(18,2) check (opex_amount is null or opex_amount >= 0),
  fiscal_year text,
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  updated_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_date_order_check check (end_date >= start_date)
);

create table if not exists public.source_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  source_type text not null check (source_type in ('manual', 'risk', 'audit', 'incident', 'roadmap')),
  source_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint source_links_reference_check check (
    (source_type = 'manual' and source_ref is null)
    or (source_type <> 'manual' and length(btrim(source_ref)) > 0)
  )
);

create index if not exists projects_org_created_idx on public.projects(org_id, created_at desc);
create index if not exists projects_org_status_idx on public.projects(org_id, status);
create index if not exists source_links_project_idx on public.source_links(project_id);

create or replace function public.pit_touch_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

DROP TRIGGER IF EXISTS projects_touch_updated_at ON public.projects;
create trigger projects_touch_updated_at
before update on public.projects
for each row execute function public.pit_touch_updated_at();

DROP TRIGGER IF EXISTS source_links_touch_updated_at ON public.source_links;
create trigger source_links_touch_updated_at
before update on public.source_links
for each row execute function public.pit_touch_updated_at();

alter table public.projects enable row level security;
alter table public.source_links enable row level security;

DROP POLICY IF EXISTS projects_select_member ON public.projects;
create policy projects_select_member
on public.projects for select
to authenticated
using (public.pit_is_org_member(org_id));

DROP POLICY IF EXISTS projects_insert_creator ON public.projects;
create policy projects_insert_creator
on public.projects for insert
to authenticated
with check (
  created_by = auth.uid()
  and updated_by = auth.uid()
  and project_leader_id = auth.uid()
  and public.pit_has_org_role(
    org_id,
    array['cs2_admin', 'org_admin', 'project_manager', 'team_leader', 'contributor']::text[]
  )
);

DROP POLICY IF EXISTS projects_update_authorised ON public.projects;
create policy projects_update_authorised
on public.projects for update
to authenticated
using (
  public.pit_has_org_role(
    org_id,
    array['cs2_admin', 'org_admin', 'project_manager', 'team_leader']::text[]
  )
)
with check (
  updated_by = auth.uid()
  and public.pit_has_org_role(
    org_id,
    array['cs2_admin', 'org_admin', 'project_manager', 'team_leader']::text[]
  )
);

DROP POLICY IF EXISTS source_links_select_parent ON public.source_links;
create policy source_links_select_parent
on public.source_links for select
to authenticated
using (
  exists (
    select 1 from public.projects p
    where p.id = source_links.project_id
      and public.pit_is_org_member(p.org_id)
  )
);

DROP POLICY IF EXISTS source_links_insert_parent_creator ON public.source_links;
create policy source_links_insert_parent_creator
on public.source_links for insert
to authenticated
with check (
  exists (
    select 1 from public.projects p
    where p.id = source_links.project_id
      and public.pit_has_org_role(
        p.org_id,
        array['cs2_admin', 'org_admin', 'project_manager', 'team_leader', 'contributor']::text[]
      )
  )
);

DROP POLICY IF EXISTS source_links_update_parent_authorised ON public.source_links;
create policy source_links_update_parent_authorised
on public.source_links for update
to authenticated
using (
  exists (
    select 1 from public.projects p
    where p.id = source_links.project_id
      and public.pit_has_org_role(
        p.org_id,
        array['cs2_admin', 'org_admin', 'project_manager', 'team_leader']::text[]
      )
  )
)
with check (
  exists (
    select 1 from public.projects p
    where p.id = source_links.project_id
      and public.pit_has_org_role(
        p.org_id,
        array['cs2_admin', 'org_admin', 'project_manager', 'team_leader']::text[]
      )
  )
);

create or replace function public.pit_create_project(
  p_org_id uuid,
  p_name text,
  p_type text,
  p_quick_win_type text,
  p_description text,
  p_project_leader_label text,
  p_start_date date,
  p_end_date date,
  p_source_type text,
  p_source_ref text default null,
  p_capex_amount numeric default null,
  p_opex_amount numeric default null,
  p_fiscal_year text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = public, auth, pg_temp
as $$
declare
  v_project public.projects;
  v_source public.source_links;
begin
  if auth.uid() is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if p_end_date < p_start_date then
    raise exception 'invalid_date_order' using errcode = '22023';
  end if;

  if p_source_type <> 'manual' and nullif(btrim(p_source_ref), '') is null then
    raise exception 'source_reference_required' using errcode = '22023';
  end if;

  insert into public.projects (
    org_id, name, type, quick_win_type, description, project_leader_id,
    project_leader_label, start_date, end_date, capex_amount, opex_amount,
    fiscal_year, created_by, updated_by
  ) values (
    p_org_id, btrim(p_name), p_type, p_quick_win_type, coalesce(btrim(p_description), ''), auth.uid(),
    btrim(p_project_leader_label), p_start_date, p_end_date, p_capex_amount,
    p_opex_amount, nullif(btrim(p_fiscal_year), ''), auth.uid(), auth.uid()
  ) returning * into v_project;

  insert into public.source_links(project_id, source_type, source_ref)
  values (
    v_project.id,
    p_source_type,
    case when p_source_type = 'manual' then null else btrim(p_source_ref) end
  ) returning * into v_source;

  return to_jsonb(v_project) || jsonb_build_object(
    'source_type', v_source.source_type,
    'source_ref', v_source.source_ref
  );
end;
$$;

create or replace function public.pit_update_project(
  p_project_id uuid,
  p_org_id uuid,
  p_patch jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = public, auth, pg_temp
as $$
declare
  v_existing public.projects;
  v_project public.projects;
  v_source public.source_links;
  v_start_date date;
  v_end_date date;
  v_source_type text;
  v_source_ref text;
begin
  if auth.uid() is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into v_existing
  from public.projects
  where id = p_project_id and org_id = p_org_id;

  if not found then
    raise exception 'project_not_found' using errcode = 'P0002';
  end if;

  v_start_date := coalesce((p_patch->>'startDate')::date, v_existing.start_date);
  v_end_date := coalesce((p_patch->>'endDate')::date, v_existing.end_date);
  if v_end_date < v_start_date then
    raise exception 'invalid_date_order' using errcode = '22023';
  end if;

  update public.projects set
    name = coalesce(nullif(btrim(p_patch->>'name'), ''), name),
    type = coalesce(p_patch->>'type', type),
    quick_win_type = coalesce(p_patch->>'quickWinType', quick_win_type),
    description = coalesce(p_patch->>'description', description),
    project_leader_label = coalesce(nullif(btrim(p_patch->>'projectLeaderLabel'), ''), project_leader_label),
    start_date = v_start_date,
    end_date = v_end_date,
    status = coalesce(p_patch->>'status', status),
    capex_amount = case when p_patch ? 'capexAmount' then (p_patch->>'capexAmount')::numeric else capex_amount end,
    opex_amount = case when p_patch ? 'opexAmount' then (p_patch->>'opexAmount')::numeric else opex_amount end,
    fiscal_year = case when p_patch ? 'fiscalYear' then nullif(btrim(p_patch->>'fiscalYear'), '') else fiscal_year end,
    updated_by = auth.uid()
  where id = p_project_id and org_id = p_org_id
  returning * into v_project;

  select source_type, source_ref into v_source_type, v_source_ref
  from public.source_links where project_id = p_project_id;

  if p_patch ? 'sourceType' or p_patch ? 'sourceRef' then
    v_source_type := coalesce(p_patch->>'sourceType', v_source_type, 'manual');
    v_source_ref := case
      when v_source_type = 'manual' then null
      when p_patch ? 'sourceRef' then nullif(btrim(p_patch->>'sourceRef'), '')
      else v_source_ref
    end;
    if v_source_type <> 'manual' and v_source_ref is null then
      raise exception 'source_reference_required' using errcode = '22023';
    end if;

    insert into public.source_links(project_id, source_type, source_ref)
    values (p_project_id, v_source_type, v_source_ref)
    on conflict (project_id) do update set
      source_type = excluded.source_type,
      source_ref = excluded.source_ref,
      updated_at = now()
    returning * into v_source;
  else
    select * into v_source from public.source_links where project_id = p_project_id;
  end if;

  return to_jsonb(v_project) || jsonb_build_object(
    'source_type', coalesce(v_source.source_type, 'manual'),
    'source_ref', v_source.source_ref
  );
end;
$$;

grant select, insert, update on public.projects to authenticated;
grant select, insert, update on public.source_links to authenticated;
grant execute on function public.pit_create_project(uuid,text,text,text,text,text,date,date,text,text,numeric,numeric,text) to authenticated;
grant execute on function public.pit_update_project(uuid,uuid,jsonb) to authenticated;

revoke all on public.projects from anon;
revoke all on public.source_links from anon;
revoke execute on function public.pit_create_project(uuid,text,text,text,text,text,date,date,text,text,numeric,numeric,text) from anon;
revoke execute on function public.pit_update_project(uuid,uuid,jsonb) from anon;
