-- PIT Stage 12 Slice 4 RPC-only mutation boundary
-- Direct authenticated table mutation is removed. Project and source-link writes
-- are available only through the controlled transactional RPCs below.

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
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_actor uuid := auth.uid();
  v_project public.projects;
  v_source public.source_links;
begin
  if v_actor is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if not public.pit_is_org_member(p_org_id)
     or not public.pit_has_org_role(
       p_org_id,
       array['cs2_admin', 'org_admin', 'project_manager', 'team_leader', 'contributor']::text[]
     ) then
    raise exception 'project_create_forbidden' using errcode = '42501';
  end if;

  if nullif(btrim(p_name), '') is null
     or nullif(btrim(p_project_leader_label), '') is null then
    raise exception 'required_project_field_missing' using errcode = '22023';
  end if;

  if p_end_date < p_start_date then
    raise exception 'invalid_date_order' using errcode = '22023';
  end if;

  if p_source_type <> 'manual' and nullif(btrim(p_source_ref), '') is null then
    raise exception 'source_reference_required' using errcode = '22023';
  end if;

  insert into public.projects (
    org_id,
    name,
    type,
    quick_win_type,
    description,
    project_leader_id,
    project_leader_label,
    start_date,
    end_date,
    capex_amount,
    opex_amount,
    fiscal_year,
    created_by,
    updated_by
  ) values (
    p_org_id,
    btrim(p_name),
    p_type,
    p_quick_win_type,
    coalesce(btrim(p_description), ''),
    v_actor,
    btrim(p_project_leader_label),
    p_start_date,
    p_end_date,
    p_capex_amount,
    p_opex_amount,
    nullif(btrim(p_fiscal_year), ''),
    v_actor,
    v_actor
  )
  returning * into v_project;

  insert into public.source_links(project_id, source_type, source_ref)
  values (
    v_project.id,
    p_source_type,
    case when p_source_type = 'manual' then null else btrim(p_source_ref) end
  )
  returning * into v_source;

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
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_actor uuid := auth.uid();
  v_existing public.projects;
  v_project public.projects;
  v_source public.source_links;
  v_start_date date;
  v_end_date date;
  v_source_type text;
  v_source_ref text;
begin
  if v_actor is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into v_existing
  from public.projects
  where id = p_project_id
    and org_id = p_org_id;

  if not found then
    raise exception 'project_not_found' using errcode = 'P0002';
  end if;

  if not public.pit_is_org_member(v_existing.org_id)
     or not public.pit_has_org_role(
       v_existing.org_id,
       array['cs2_admin', 'org_admin', 'project_manager', 'team_leader']::text[]
     ) then
    raise exception 'project_update_forbidden' using errcode = '42501';
  end if;

  select * into v_source
  from public.source_links
  where project_id = p_project_id;

  if not found then
    raise exception 'source_link_not_found' using errcode = 'P0002';
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
    updated_by = v_actor
  where id = p_project_id
    and org_id = v_existing.org_id
  returning * into v_project;

  v_source_type := v_source.source_type;
  v_source_ref := v_source.source_ref;

  if p_patch ? 'sourceType' or p_patch ? 'sourceRef' then
    v_source_type := coalesce(p_patch->>'sourceType', v_source_type);
    v_source_ref := case
      when v_source_type = 'manual' then null
      when p_patch ? 'sourceRef' then nullif(btrim(p_patch->>'sourceRef'), '')
      else v_source_ref
    end;

    if v_source_type <> 'manual' and v_source_ref is null then
      raise exception 'source_reference_required' using errcode = '22023';
    end if;

    update public.source_links set
      source_type = v_source_type,
      source_ref = v_source_ref
    where project_id = p_project_id
    returning * into v_source;
  end if;

  return to_jsonb(v_project) || jsonb_build_object(
    'source_type', v_source.source_type,
    'source_ref', v_source.source_ref
  );
end;
$$;

revoke all on table public.projects from authenticated;
revoke all on table public.source_links from authenticated;
grant select on table public.projects to authenticated;
grant select on table public.source_links to authenticated;

revoke all on function public.pit_create_project(uuid,text,text,text,text,text,date,date,text,text,numeric,numeric,text) from public;
revoke all on function public.pit_update_project(uuid,uuid,jsonb) from public;
revoke all on function public.pit_create_project(uuid,text,text,text,text,text,date,date,text,text,numeric,numeric,text) from anon;
revoke all on function public.pit_update_project(uuid,uuid,jsonb) from anon;
grant execute on function public.pit_create_project(uuid,text,text,text,text,text,date,date,text,text,numeric,numeric,text) to authenticated, service_role;
grant execute on function public.pit_update_project(uuid,uuid,jsonb) to authenticated, service_role;
