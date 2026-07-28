-- APW durable paid-call spend authority.
-- Repository artefact only: do not apply without a separate CS2 deployment decision.

create schema if not exists app_private;

create table if not exists app_private.apw_paid_call_budget_day (
  budget_day date primary key,
  reserved_calls integer not null default 0 check (reserved_calls >= 0),
  reserved_tokens bigint not null default 0 check (reserved_tokens >= 0),
  failure_count integer not null default 0 check (failure_count >= 0),
  circuit_state text not null default 'closed' check (circuit_state in ('closed', 'open')),
  updated_at timestamptz not null default now()
);

create table if not exists app_private.apw_paid_call_client_bucket (
  budget_day date not null references app_private.apw_paid_call_budget_day(budget_day) on delete cascade,
  client_bucket text not null check (length(client_bucket) between 8 and 64),
  reserved_calls integer not null default 0 check (reserved_calls >= 0),
  updated_at timestamptz not null default now(),
  primary key (budget_day, client_bucket)
);

create table if not exists app_private.apw_paid_call_reservation (
  reservation_id uuid primary key default gen_random_uuid(),
  budget_day date not null references app_private.apw_paid_call_budget_day(budget_day) on delete cascade,
  client_bucket text not null,
  estimated_tokens integer not null check (estimated_tokens >= 0),
  actual_tokens integer,
  status text not null default 'reserved' check (status in ('reserved', 'succeeded', 'failed')),
  created_at timestamptz not null default now(),
  reconciled_at timestamptz
);

alter table app_private.apw_paid_call_budget_day enable row level security;
alter table app_private.apw_paid_call_client_bucket enable row level security;
alter table app_private.apw_paid_call_reservation enable row level security;

revoke all on app_private.apw_paid_call_budget_day from public, anon, authenticated;
revoke all on app_private.apw_paid_call_client_bucket from public, anon, authenticated;
revoke all on app_private.apw_paid_call_reservation from public, anon, authenticated;

grant select, insert, update, delete on app_private.apw_paid_call_budget_day to service_role;
grant select, insert, update, delete on app_private.apw_paid_call_client_bucket to service_role;
grant select, insert, update on app_private.apw_paid_call_reservation to service_role;

create or replace function public.apw_reserve_paid_call(
  p_budget_day date,
  p_client_bucket text,
  p_call_limit integer,
  p_token_limit bigint,
  p_estimated_tokens integer,
  p_client_limit integer
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, app_private
as $$
declare
  v_day app_private.apw_paid_call_budget_day%rowtype;
  v_client_calls integer;
  v_reservation uuid;
begin
  if p_call_limit < 0 or p_token_limit < 0 or p_estimated_tokens < 0 or p_client_limit < 0 then
    raise exception 'invalid paid-call budget arguments';
  end if;

  insert into app_private.apw_paid_call_budget_day (budget_day)
  values (p_budget_day)
  on conflict (budget_day) do nothing;

  select * into v_day
  from app_private.apw_paid_call_budget_day
  where budget_day = p_budget_day
  for update;

  if v_day.circuit_state <> 'closed' then
    return jsonb_build_object(
      'permitted', false,
      'reason', 'paid_call_circuit_open',
      'budget_day', p_budget_day,
      'reserved_calls', v_day.reserved_calls,
      'reserved_tokens', v_day.reserved_tokens,
      'circuit_state', v_day.circuit_state
    );
  end if;

  insert into app_private.apw_paid_call_client_bucket (budget_day, client_bucket)
  values (p_budget_day, p_client_bucket)
  on conflict (budget_day, client_bucket) do nothing;

  select reserved_calls into v_client_calls
  from app_private.apw_paid_call_client_bucket
  where budget_day = p_budget_day and client_bucket = p_client_bucket
  for update;

  if v_client_calls >= p_client_limit then
    return jsonb_build_object(
      'permitted', false,
      'reason', 'client_rate_limit_reached',
      'budget_day', p_budget_day,
      'reserved_calls', v_day.reserved_calls,
      'reserved_tokens', v_day.reserved_tokens,
      'circuit_state', v_day.circuit_state
    );
  end if;

  if v_day.reserved_calls >= p_call_limit then
    return jsonb_build_object(
      'permitted', false,
      'reason', 'durable_daily_call_limit_reached',
      'budget_day', p_budget_day,
      'reserved_calls', v_day.reserved_calls,
      'reserved_tokens', v_day.reserved_tokens,
      'circuit_state', v_day.circuit_state
    );
  end if;

  if v_day.reserved_tokens + p_estimated_tokens > p_token_limit then
    return jsonb_build_object(
      'permitted', false,
      'reason', 'durable_daily_token_limit_reached',
      'budget_day', p_budget_day,
      'reserved_calls', v_day.reserved_calls,
      'reserved_tokens', v_day.reserved_tokens,
      'circuit_state', v_day.circuit_state
    );
  end if;

  insert into app_private.apw_paid_call_reservation (
    budget_day,
    client_bucket,
    estimated_tokens
  ) values (
    p_budget_day,
    p_client_bucket,
    p_estimated_tokens
  ) returning reservation_id into v_reservation;

  update app_private.apw_paid_call_budget_day
  set reserved_calls = reserved_calls + 1,
      reserved_tokens = reserved_tokens + p_estimated_tokens,
      updated_at = now()
  where budget_day = p_budget_day
  returning * into v_day;

  update app_private.apw_paid_call_client_bucket
  set reserved_calls = reserved_calls + 1,
      updated_at = now()
  where budget_day = p_budget_day and client_bucket = p_client_bucket;

  return jsonb_build_object(
    'permitted', true,
    'reason', 'paid_call_permitted',
    'reservation_id', v_reservation,
    'budget_day', p_budget_day,
    'reserved_calls', v_day.reserved_calls,
    'reserved_tokens', v_day.reserved_tokens,
    'circuit_state', v_day.circuit_state
  );
end;
$$;

create or replace function public.apw_reconcile_paid_call_success(
  p_reservation_id uuid,
  p_actual_tokens integer
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, app_private
as $$
declare
  v_row app_private.apw_paid_call_reservation%rowtype;
begin
  select * into v_row
  from app_private.apw_paid_call_reservation
  where reservation_id = p_reservation_id
  for update;

  if not found or v_row.status <> 'reserved' then
    return jsonb_build_object('reconciled', false);
  end if;

  update app_private.apw_paid_call_budget_day
  set reserved_tokens = greatest(0, reserved_tokens - v_row.estimated_tokens + greatest(0, p_actual_tokens)),
      failure_count = 0,
      updated_at = now()
  where budget_day = v_row.budget_day;

  update app_private.apw_paid_call_reservation
  set actual_tokens = greatest(0, p_actual_tokens),
      status = 'succeeded',
      reconciled_at = now()
  where reservation_id = p_reservation_id;

  return jsonb_build_object('reconciled', true);
end;
$$;

create or replace function public.apw_reconcile_paid_call_failure(
  p_reservation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, app_private
as $$
declare
  v_row app_private.apw_paid_call_reservation%rowtype;
  v_failures integer;
begin
  select * into v_row
  from app_private.apw_paid_call_reservation
  where reservation_id = p_reservation_id
  for update;

  if not found or v_row.status <> 'reserved' then
    return jsonb_build_object('reconciled', false);
  end if;

  update app_private.apw_paid_call_budget_day
  set reserved_calls = greatest(0, reserved_calls - 1),
      reserved_tokens = greatest(0, reserved_tokens - v_row.estimated_tokens),
      failure_count = failure_count + 1,
      circuit_state = case when failure_count + 1 >= 3 then 'open' else circuit_state end,
      updated_at = now()
  where budget_day = v_row.budget_day
  returning failure_count into v_failures;

  update app_private.apw_paid_call_client_bucket
  set reserved_calls = greatest(0, reserved_calls - 1),
      updated_at = now()
  where budget_day = v_row.budget_day and client_bucket = v_row.client_bucket;

  update app_private.apw_paid_call_reservation
  set status = 'failed',
      reconciled_at = now()
  where reservation_id = p_reservation_id;

  return jsonb_build_object('reconciled', true, 'circuit_open', v_failures >= 3);
end;
$$;

revoke all on function public.apw_reserve_paid_call(date, text, integer, bigint, integer, integer) from public, anon, authenticated;
revoke all on function public.apw_reconcile_paid_call_success(uuid, integer) from public, anon, authenticated;
revoke all on function public.apw_reconcile_paid_call_failure(uuid) from public, anon, authenticated;

grant execute on function public.apw_reserve_paid_call(date, text, integer, bigint, integer, integer) to service_role;
grant execute on function public.apw_reconcile_paid_call_success(uuid, integer) to service_role;
grant execute on function public.apw_reconcile_paid_call_failure(uuid) to service_role;
