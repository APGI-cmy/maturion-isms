-- ==========================================================
-- MATURION ISMS – SCORING API RPCS & VIEWS
-- Version: 1.0
-- Purpose: Read-only RPCs for maturity scoring results
-- ==========================================================

set check_function_bodies = off;

-- ----------------------------------------------------------
-- 1. Criterion Score RPC
-- ----------------------------------------------------------
create or replace function get_criterion_score(c_id uuid, cycle uuid)
returns jsonb
language sql
stable
as $$
  select to_jsonb(cs.*)
  from criteria_scores cs
  where cs.criterion_id = c_id
    and cs.cycle_id = cycle
$$;

grant execute on function get_criterion_score(uuid, uuid)
  to authenticated, service_role;

-- ----------------------------------------------------------
-- 2. MPS Score RPC
-- ----------------------------------------------------------
create or replace function get_mps_score(m_id uuid, cycle uuid)
returns jsonb
language sql
stable
as $$
  select to_jsonb(ms.*)
  from mps_scores ms
  where ms.mps_id = m_id
    and ms.cycle_id = cycle
$$;

grant execute on function get_mps_score(uuid, uuid)
  to authenticated, service_role;

-- ----------------------------------------------------------
-- 3. Domain Score RPC
-- ----------------------------------------------------------
create or replace function get_domain_score(d_id uuid, cycle uuid)
returns jsonb
language sql
stable
as $$
  select to_jsonb(ds.*)
  from domain_scores ds
  where ds.domain_id = d_id
    and ds.cycle_id = cycle
$$;

grant execute on function get_domain_score(uuid, uuid)
  to authenticated, service_role;

-- ----------------------------------------------------------
-- 4. Organization Maturity RPC
-- ----------------------------------------------------------
create or replace function get_organization_maturity(o_id uuid, cycle uuid)
returns jsonb
language sql
stable
as $$
  select to_jsonb(os.*)
  from organization_maturity_scores os
  where os.org_id = o_id
    and os.cycle_id = cycle
$$;

grant execute on function get_organization_maturity(uuid, uuid)
  to authenticated, service_role;

-- ----------------------------------------------------------
-- 5. Helper Views (Optional)
-- ----------------------------------------------------------

-- View: current cycle criterion scores per org
create or replace view v_current_criterion_scores as
  select
    cs.*,
    c.mps_id,
    m.domain_id,
    d.org_id
  from criteria_scores cs
  join criteria c on cs.criterion_id = c.id
  join mps m on c.mps_id = m.id
  join domains d on m.domain_id = d.id;

-- View: current cycle MPS scores per org
create or replace view v_current_mps_scores as
  select
    ms.*,
    m.domain_id,
    d.org_id
  from mps_scores ms
  join mps m on ms.mps_id = m.id
  join domains d on m.domain_id = d.id;

-- View: current cycle domain scores per org
create or replace view v_current_domain_scores as
  select
    ds.*,
    d.org_id
  from domain_scores ds
  join domains d on ds.domain_id = d.id;

-- View: organization maturity with domain breakdown
create or replace view v_org_maturity_overview as
  select
    os.*,
    json_agg(
      json_build_object(
        'domain_id', ds.domain_id,
        'numeric_score', ds.numeric_score,
        'maturity_level', ds.maturity_level,
        'gap', ds.gap
      )
      order by ds.domain_id
    ) as domains
  from organization_maturity_scores os
  left join domain_scores ds
    on ds.cycle_id = os.cycle_id
   and ds.domain_id in (select id from domains where org_id = os.org_id)
  group by os.id;

-- ==========================================================
-- END OF FILE
-- ==========================================================
