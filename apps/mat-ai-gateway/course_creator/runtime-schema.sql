-- Private controller ledger. No course input text, credentials or public grants.
create table public.cc_runtime_clients (
 client_id text primary key, public_key text not null,
 tenant_id text not null, user_id text not null, project_id text not null,
 unit_id text not null default 'LU01',
 enabled boolean not null default false,
 commissioning boolean not null default true,
 assurance_ref text,
 created_at timestamptz not null default now()
);
create table public.cc_runtime_requests (
 tenant_id text not null, request_id uuid not null, client_id text not null,
 body_sha256 text not null, project_id text not null, qa_sha256 text not null,
 state text not null default 'running', result jsonb,
 created_at timestamptz not null default now(),
 primary key (tenant_id,request_id)
);
alter table public.cc_runtime_clients enable row level security;
alter table public.cc_runtime_requests enable row level security;
revoke all on public.cc_runtime_clients, public.cc_runtime_requests from public, anon, authenticated;
grant select,insert,update on public.cc_runtime_clients, public.cc_runtime_requests to service_role;

create function public.cc_runtime_claim(p_client text,p_request uuid,p_hash text,p_project text,p_qa text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare c public.cc_runtime_clients; r public.cc_runtime_requests;
begin
 perform pg_advisory_xact_lock(2075,2076);
 select * into c from public.cc_runtime_clients where client_id=p_client for update;
 if not found or not (c.enabled or c.commissioning) or c.project_id<>p_project then
  raise exception 'client_not_registered';
 end if;
 select * into r from public.cc_runtime_requests where tenant_id=c.tenant_id and request_id=p_request;
 if found then
  if r.body_sha256<>p_hash or r.client_id<>p_client then raise exception 'idempotency_conflict'; end if;
  return jsonb_build_object('claimed',false,'state',r.state,'result',r.result);
 end if;
 -- Every request reserves two model calls, including failed/indeterminate ones.
 if (select count(*) from public.cc_runtime_requests where created_at>=date_trunc('day',now()))>=40 then
  raise exception 'daily_budget_exhausted';
 end if;
 insert into public.cc_runtime_requests(tenant_id,request_id,client_id,body_sha256,project_id,qa_sha256)
 values(c.tenant_id,p_request,p_client,p_hash,p_project,p_qa);
 return jsonb_build_object('claimed',true,'state','running');
end $$;
revoke execute on function public.cc_runtime_claim(text,uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.cc_runtime_claim(text,uuid,text,text,text) to service_role;
