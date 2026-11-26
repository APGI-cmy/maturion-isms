-- #2077: signed command/return bridge. Existing course QA/controller remains authoritative.
alter table public.cc_runtime_clients add column controller_enabled boolean not null default false;
alter table public.cc_runtime_clients add column controller_commissioning boolean not null default false;
alter table public.cc_runtime_clients add column controller_assurance_ref text;
alter table public.cc_runtime_clients add column allowed_unit_ids text[] not null default array['LU01'];

create table public.cc_controller_chains (
 client_id text not null references public.cc_runtime_clients(client_id), chain_id text not null,
 project_id text not null, unit_id text not null, qa_sha256 text not null,
 max_round integer not null default 0, producer_calls integer not null default 0,
 review_calls integer not null default 0, research_calls integer not null default 0,
 invocation_count integer not null default 0, primary key(client_id,chain_id)
);
create table public.cc_controller_invocations (
 client_id text not null, invocation_id uuid not null, chain_id text not null,
 request_sha256 text not null, binding jsonb not null, state text not null default 'reserved',
 output_sha256 text, result jsonb, created_at timestamptz not null default now(),
 primary key(client_id,invocation_id),
 foreign key(client_id,chain_id) references public.cc_controller_chains(client_id,chain_id)
);
alter table public.cc_controller_chains enable row level security;
alter table public.cc_controller_invocations enable row level security;
revoke all on public.cc_controller_chains,public.cc_controller_invocations from public,anon,authenticated;
grant select,insert,update on public.cc_controller_chains,public.cc_controller_invocations to service_role;

create function public.cc_controller_reserve(p_client text,p_task jsonb,p_hash text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare c public.cc_runtime_clients; old public.cc_controller_invocations; ch public.cc_controller_chains;
 v_id uuid:=(p_task->>'invocation_id')::uuid; v_chain text:=p_task->>'chain_id';
 v_round int:=(p_task->'counters'->>'rounds_completed')::int;
 v_producer int:=(p_task->'counters'->>'producer_calls')::int;
 v_review int:=(p_task->'counters'->>'review_calls')::int;
 v_research int:=(p_task->'counters'->>'research_calls')::int;
begin
 perform pg_advisory_xact_lock(2077,2077);
 select * into c from public.cc_runtime_clients where client_id=p_client;
 if not found or c.project_id<>p_task->>'project_id' or not ((p_task->>'unit_id')=any(c.allowed_unit_ids))
 or not (case when (p_task->>'commissioning')::boolean then c.controller_commissioning else c.controller_enabled and c.controller_assurance_ref is not null end)
 then raise exception 'controller_not_authorised'; end if;
 select * into old from public.cc_controller_invocations where client_id=p_client and invocation_id=v_id;
 if found then
  if old.request_sha256<>p_hash then raise exception 'controller_idempotency_conflict'; end if;
  return jsonb_build_object('execute',false,'state',old.state,'output_sha256',old.output_sha256,'result',old.result);
 end if;
 insert into public.cc_controller_chains(client_id,chain_id,project_id,unit_id,qa_sha256)
 values(p_client,v_chain,c.project_id,p_task->>'unit_id',p_task->>'qa_sha256') on conflict do nothing;
 select * into ch from public.cc_controller_chains where client_id=p_client and chain_id=v_chain for update;
 if ch.project_id<>p_task->>'project_id' or ch.unit_id<>p_task->>'unit_id' then raise exception 'chain_parent_conflict'; end if;
 if ch.qa_sha256<>p_task->>'qa_sha256' then raise exception 'changed_operative_QA_requires_reconciliation'; end if;
 if v_round<ch.max_round or v_producer<ch.producer_calls or v_review<ch.review_calls or v_research<ch.research_calls
 then raise exception 'retained_counter_regression'; end if;
 if exists(select 1 from public.cc_controller_invocations where client_id=p_client and chain_id=v_chain and state in ('reserved','indeterminate'))
 then raise exception 'unresolved_invocation_in_chain'; end if;
 if ch.invocation_count>=32 then raise exception 'controller_chain_allowance_exhausted'; end if;
 if (select count(*) from public.cc_controller_invocations where created_at>=date_trunc('day',now()))>=100
 then raise exception 'controller_daily_allowance_exhausted'; end if;
 insert into public.cc_controller_invocations(client_id,invocation_id,chain_id,request_sha256,binding)
 values(p_client,v_id,v_chain,p_hash,p_task);
 update public.cc_controller_chains set max_round=v_round,producer_calls=v_producer,review_calls=v_review,
 research_calls=v_research,invocation_count=invocation_count+1 where client_id=p_client and chain_id=v_chain;
 return jsonb_build_object('execute',true,'state','reserved','invocation_id',v_id,'chain_id',v_chain,
 'request_sha256',p_hash,'provider','codex-chatgpt-local','specialist','course-creator-agent','orchestrator','maturion-agent');
end $$;
revoke execute on function public.cc_controller_reserve(text,jsonb,text) from public,anon,authenticated;
grant execute on function public.cc_controller_reserve(text,jsonb,text) to service_role;

create function public.cc_controller_return(p_client text,p_id uuid,p_hash text,p_output text,p_result jsonb,p_state text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.cc_controller_invocations;
begin
 select * into r from public.cc_controller_invocations where client_id=p_client and invocation_id=p_id for update;
 if not found or r.request_sha256<>p_hash then raise exception 'return_binding_conflict'; end if;
 if r.state='completed' then
  if r.output_sha256 is distinct from p_output then raise exception 'changed_completed_output'; end if;
  return jsonb_build_object('accepted',true,'state','completed','output_sha256',r.output_sha256);
 end if;
 if r.state not in ('reserved','indeterminate') or p_state not in ('completed','indeterminate')
 then raise exception 'invalid_return_transition'; end if;
 -- Recovery is return-only from actual saved output. It never grants another execution permit.
 update public.cc_controller_invocations set state=p_state,output_sha256=p_output,result=p_result
 where client_id=p_client and invocation_id=p_id;
 return jsonb_build_object('accepted',true,'state',p_state,'output_sha256',p_output);
end $$;
revoke execute on function public.cc_controller_return(text,uuid,text,text,jsonb,text) from public,anon,authenticated;
grant execute on function public.cc_controller_return(text,uuid,text,text,jsonb,text) to service_role;
