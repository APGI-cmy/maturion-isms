-- Separate RPC for the one registered LU01 continuation. The original ledger is retained.
create table if not exists public.cc_lu1_continuation_authority (
 client_id text not null references public.cc_runtime_clients(client_id),
 chain_id text not null,
 parent_sha256 text not null check (parent_sha256 ~ '^[a-f0-9]{64}$'),
 authority_sha256 text not null check (authority_sha256 ~ '^[a-f0-9]{64}$'),
 original_job_id text not null,
 original_candidate_sha256 text not null check (original_candidate_sha256 ~ '^[a-f0-9]{64}$'),
 expires_at timestamptz not null,
 primary key(client_id,chain_id),
 foreign key(client_id,chain_id) references public.cc_controller_chains(client_id,chain_id)
);
alter table public.cc_lu1_continuation_authority enable row level security;
revoke all on public.cc_lu1_continuation_authority from public,anon,authenticated,service_role;
grant select on public.cc_lu1_continuation_authority to service_role;

create or replace function public.cc_controller_reserve_lu1_continuation(p_client text,p_task jsonb,p_hash text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
 c public.cc_runtime_clients;
 a public.cc_lu1_continuation_authority;
 ch public.cc_controller_chains;
 old public.cc_controller_invocations;
 v_id uuid := (p_task->>'invocation_id')::uuid;
 v_chain text := p_task->>'chain_id';
 v_round int := (p_task->'counters'->>'rounds_completed')::int;
 v_producer int := (p_task->'counters'->>'producer_calls')::int;
 v_review int := (p_task->'counters'->>'review_calls')::int;
 v_research int := (p_task->'counters'->>'research_calls')::int;
 v_phase text := p_task->>'phase';
 v_operation text := p_task->>'operation';
 v_authority jsonb := p_task->'fifth_evidence';
 v_candidate text := p_task->>'candidate_sha256';
begin
 perform pg_catalog.pg_advisory_xact_lock(2077,2077);
 select * into c from public.cc_runtime_clients where client_id=p_client;
 if not found or not c.controller_enabled or c.controller_assurance_ref is null
    or p_task->>'commissioning' is distinct from 'false'
    or p_task->>'tenant_id' is distinct from c.tenant_id or p_task->>'user_id' is distinct from c.user_id
    or p_task->>'project_id' is distinct from c.project_id or p_task->>'unit_id' is distinct from 'LU01'
    or not ('LU01'=any(c.allowed_unit_ids)) then raise exception 'continuation_client_mismatch'; end if;
 select * into a from public.cc_lu1_continuation_authority where client_id=p_client and chain_id=v_chain;
 if not found or
    a.parent_sha256 is distinct from p_task->>'parent_sha256'
    or a.authority_sha256 is distinct from v_authority->>'authority_sha256'
    or a.original_job_id is distinct from v_authority->>'original_job_id'
    or a.original_candidate_sha256 is distinct from v_authority->>'original_candidate_sha256'
    or v_authority->>'classification' is distinct from 'owner_authorised_lu1_continuation'
 then raise exception 'continuation_authority_mismatch'; end if;
 select * into old from public.cc_controller_invocations where client_id=p_client and invocation_id=v_id;
 if found then
  if old.request_sha256<>p_hash then raise exception 'controller_idempotency_conflict'; end if;
  return pg_catalog.jsonb_build_object('execute',false,'state',old.state,'output_sha256',old.output_sha256,'result',old.result);
 end if;
 select * into ch from public.cc_controller_chains where client_id=p_client and chain_id=v_chain for update;
 if not found or ch.unit_id<>'LU01' or ch.project_id<>c.project_id
    or ch.qa_sha256 is distinct from p_task->>'qa_sha256'
    or ch.producer_calls<5 or ch.review_calls<6 or ch.max_round<4
 then raise exception 'continuation_parent_mismatch'; end if;
 if a.expires_at <= pg_catalog.now() then raise exception 'continuation_expired'; end if;
 if v_round is null or v_producer is null or v_review is null or v_research is distinct from 0
    or v_round not between 5 and 9 or v_round<ch.max_round or v_producer not between 6 and 10
    or v_review not between 6 and 16 or v_review<ch.review_calls
    or v_phase is null or v_phase not in ('producer','correction','duplication','reviewer','diagnosis')
    or v_operation is null or v_operation not in ('reserve','handover')
    or v_candidate is null or v_candidate !~ '^[a-f0-9]{64}$'
 then raise exception 'continuation_bounds'; end if;
 if ch.invocation_count>=32 or
    (select count(*) from public.cc_controller_invocations where created_at>=pg_catalog.date_trunc('day',pg_catalog.now()))>=100
 then raise exception 'controller_allowance_exhausted'; end if;
 if exists(select 1 from public.cc_controller_invocations where client_id=p_client and chain_id=v_chain and state in ('reserved','indeterminate'))
 then raise exception 'unresolved_invocation_in_chain'; end if;
 if exists (select 1 from public.cc_controller_invocations
            where client_id=p_client and chain_id=v_chain and state='completed' and binding->>'operation'='handover')
 then raise exception 'continuation_already_handed_over'; end if;
 if v_round=9 and v_phase<>'diagnosis' and
    (v_authority->>'conditional_fifth_sha256' is null or v_authority->>'conditional_fifth_sha256' !~ '^[a-f0-9]{64}$'
     or not exists(select 1 from public.cc_controller_invocations
                  where client_id=p_client and chain_id=v_chain and state='completed'
                    and binding->>'phase'='diagnosis' and binding->'fifth_evidence'->>'authority_sha256'=a.authority_sha256))
 then raise exception 'continuation_fifth_requires_diagnosis'; end if;

 if v_phase in ('producer','correction') and v_operation='reserve' then
  if v_producer<>ch.producer_calls+1 or v_review<>ch.review_calls or v_round>ch.max_round+1
     or (ch.producer_calls=5 and v_candidate<>a.original_candidate_sha256)
  then raise exception 'continuation_design_counter_mismatch'; end if;
 else
  if v_producer<>ch.producer_calls or (v_phase<>'diagnosis' and v_round<>ch.max_round)
  then raise exception 'continuation_review_counter_mismatch'; end if;
  if v_operation='reserve' and v_phase in ('reviewer','duplication') and v_review<>ch.review_calls+1 then
   raise exception 'continuation_review_counter_mismatch';
  end if;
  if (v_operation='handover' or v_phase='diagnosis') and v_review<>ch.review_calls then
   raise exception 'continuation_review_counter_mismatch';
  end if;
  if exists(select 1 from public.cc_controller_invocations
            where client_id=p_client and chain_id=v_chain and binding->>'phase'=v_phase and binding->>'operation'=v_operation
              and binding->>'candidate_sha256'=v_candidate
              and binding->'fifth_evidence'->>'authority_sha256'=a.authority_sha256)
  then raise exception 'continuation_candidate_phase_already_reserved'; end if;
  if v_operation='reserve' and v_phase='reviewer' and not exists(
   select 1 from public.cc_controller_invocations where client_id=p_client and chain_id=v_chain
    and state='completed' and binding->>'phase'='duplication' and binding->>'candidate_sha256'=v_candidate
    and binding->'fifth_evidence'->>'authority_sha256'=a.authority_sha256)
  then raise exception 'continuation_requires_bound_duplication_receipt'; end if;
 end if;
 insert into public.cc_controller_invocations(client_id,invocation_id,chain_id,request_sha256,binding)
 values(p_client,v_id,v_chain,p_hash,p_task);
 update public.cc_controller_chains set max_round=v_round,producer_calls=v_producer,review_calls=v_review,
 invocation_count=invocation_count+1 where client_id=p_client and chain_id=v_chain;
 return pg_catalog.jsonb_build_object('execute',true,'state','reserved','invocation_id',v_id,'chain_id',v_chain,
 'request_sha256',p_hash,'provider','codex-chatgpt-local','specialist','course-creator-agent','orchestrator','maturion-agent');
end $$;
revoke execute on function public.cc_controller_reserve_lu1_continuation(text,jsonb,text) from public,anon,authenticated;
grant execute on function public.cc_controller_reserve_lu1_continuation(text,jsonb,text) to service_role;
