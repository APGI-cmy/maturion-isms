create or replace function public.cc_controller_reserve(p_client text,p_task jsonb,p_hash text)
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
 if exists(select 1 from public.cc_controller_invocations
  where client_id=p_client and chain_id=v_chain
  and binding->'fifth_evidence'->>'classification'='owner_authorised_recovery')
  and (p_task->'fifth_evidence'->>'classification' is distinct from 'owner_authorised_recovery')
 then raise exception 'owner_recovery_classification_changed'; end if;
 -- An explicitly registered owner recovery consumes one producer and one QA
 -- pipeline in the original chain. The advisory lock makes new-ID races atomic.
 if p_task->'fifth_evidence'->>'classification'='owner_authorised_recovery' then
  if v_round<>4 or v_producer<>5 or p_task->>'unit_id'<>'LU01'
  then raise exception 'invalid_owner_final_recovery_boundary'; end if;
  if exists(select 1 from public.cc_controller_invocations
   where client_id=p_client and chain_id=v_chain
   and binding->'fifth_evidence'->>'classification'='owner_authorised_recovery'
   and (binding->'fifth_evidence'->>'owner_authority_sha256' is distinct from
        p_task->'fifth_evidence'->>'owner_authority_sha256'))
  then raise exception 'owner_recovery_authority_changed'; end if;
  if p_task->>'operation'='handover' and exists(select 1 from public.cc_controller_invocations
   where client_id=p_client and chain_id=v_chain and binding->>'operation'='handover'
   and binding->'fifth_evidence'->>'classification'='owner_authorised_recovery')
  then raise exception 'owner_recovery_handover_already_consumed'; end if;
  if p_task->>'operation'='reserve' and exists(select 1 from public.cc_controller_invocations
   where client_id=p_client and chain_id=v_chain
   and binding->'fifth_evidence'->>'classification'='owner_authorised_recovery'
   and binding->>'operation'='reserve'
   and ((p_task->>'phase' in ('producer','correction') and binding->>'phase' in ('producer','correction'))
        or p_task->>'phase'=binding->>'phase'))
  then raise exception 'owner_recovery_phase_already_consumed'; end if;
 end if;
 insert into public.cc_controller_invocations(client_id,invocation_id,chain_id,request_sha256,binding)
 values(p_client,v_id,v_chain,p_hash,p_task);
 update public.cc_controller_chains set max_round=v_round,producer_calls=v_producer,review_calls=v_review,
 research_calls=v_research,invocation_count=invocation_count+1 where client_id=p_client and chain_id=v_chain;
 return jsonb_build_object('execute',true,'state','reserved','invocation_id',v_id,'chain_id',v_chain,
 'request_sha256',p_hash,'provider','codex-chatgpt-local','specialist','course-creator-agent','orchestrator','maturion-agent');
end $$;
