"""Existing Course Creator provider, governed by signed Maturion command/return permits.

No new course controller or QA rules. The bridge may only run after the existing
controller validates the saved job. Remote failure never falls back to raw Codex.
"""
import base64,json,sys,time,urllib.request,urllib.error,uuid
from pathlib import Path
from course_agent_preflight import CONFIG,read,sha,verify

PATH='/api/v1/course-creator/controller'
GATEWAY='https://maturion-mat-ai-gateway-staging.onrender.com'

def encoded(value):return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()

class Bridge:
    def __init__(self,config=None,commissioning=False):
        self.config=config or read(CONFIG);self.commissioning=commissioning
        self.package=verify(self.config,commissioning)

    def send(self,body):
        from private_maturion import unprotect
        deps=self.config['crypto_dependencies']
        if deps not in sys.path:sys.path.insert(0,deps)
        from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
        raw=encoded(body);stamp=str(int(time.time()))
        signature=Ed25519PrivateKey.from_private_bytes(unprotect(self.config['dpapi_private_key'])).sign(
            (stamp+'\nPOST\n'+PATH+'\n'+sha(raw)).encode())
        req=urllib.request.Request(GATEWAY+PATH,data=raw,headers={'Content-Type':'application/json',
            'X-CC-Client':self.config['client_id'],'X-CC-Time':stamp,
            'X-CC-Signature':base64.b64encode(signature).decode()})
        try:
            with urllib.request.urlopen(req,timeout=30) as r:return json.load(r)
        except urllib.error.HTTPError as exc:
            raise ValueError('Governed controller stopped (HTTP '+str(exc.code)+'). Saved allowance retained; no automatic retry.') from exc
        except OSError as exc:
            raise ValueError('Governed controller outcome is unconfirmed. Inspect its saved permit; do not repeat the provider.') from exc

    def task(self,context,folder,instruction,schema,payload):
        counters=context['counters']
        if context.get('loop_stop') and context['phase'] not in ('diagnosis','reviewer','duplication'):
            raise ValueError('Existing stop-and-fix hold prevents further design execution.')
        parent=context['parent']
        # Parent and cumulative lineage come from the controller, never from model prose or a new UUID.
        core={'parent_sha256':parent['sha256'],'phase':context['phase'],
              'payload_sha256':sha(encoded(payload)),'schema_sha256':sha(encoded(schema)),
              'instructions_sha256':sha(instruction.encode()),'counters':counters,
              'bundle_sha256':self.package['bundle_sha256'],
              'candidate_sha256':context.get('candidate_sha256')}
        invocation=str(uuid.uuid5(uuid.NAMESPACE_URL,context['chain_id']+':'+sha(encoded(core))))
        return {'request_id':invocation,'invocation_id':invocation,'app':'course-creator',
                'orchestrator':'maturion-agent','specialist':'course-creator-agent',
                'tenant_id':self.config.get('tenant_id','local-subscriber'),
                'user_id':self.config.get('user_id','Johan'),
                'project_id':context['project_id'],'unit_id':context['unit_id'],
                'operation':'reserve','provider':'codex-chatgpt-local','chain_id':context['chain_id'],
                'qa_sha256':context['qa_sha256'],'controller_checked':True,'owner_approved':False,
                'change_QA_suite':False,'commissioning':self.commissioning,
                'fifth_evidence':context.get('fifth_evidence'),**core}

    def invoke(self,provider,folder,instruction,schema,payload,context):
        folder=Path(folder);folder.mkdir(parents=True,exist_ok=True)
        role='review' if context['phase'] in ('reviewer','duplication','diagnosis','reconciliation') else 'producer'
        selected=self.package['lock'].get('instruction_profiles',{}).get(role,self.package['lock']['instruction_files'])
        instructions='\n\n'.join((self.package['root']/n).read_text(encoding='utf-8') for n in selected)
        expanded='GOVERNED TIER 1/TIER 2:\n'+instructions+'\nTASK:\n'+instruction
        wire_payload=payload
        if len(expanded)+len(encoded(wire_payload).decode())>1039000:
            from reconciliation import exact_pool
            wire_payload=exact_pool(payload)
        if len(expanded)+len(encoded(wire_payload).decode())>1039000:
            raise ValueError('Complete governed input exceeds transport after lossless pooling. No permit or provider call.')
        task=self.task(context,folder,instruction,schema,payload)
        call_hash=sha(encoded(task));record=folder/'Governed invocation.json'
        saved=read(record) if record.is_file() else None
        result_path=folder/'Response.json'
        provenance=folder/'Validated invocation output.json'
        if not saved and (result_path.exists() or provenance.exists()):
            raise ValueError('Unbound pre-existing response found. Preserve and investigate; no invocation was reserved.')
        if saved and saved['request_sha256']!=call_hash:
            raise ValueError('A saved invocation cannot be reused for changed evidence/schema/role.')
        if saved and saved.get('state')=='completed':
            result=read(folder/'Response.json')
            if sha(encoded(result))!=saved['output_sha256']:raise ValueError('Saved approved output changed.')
            return result
        permit=self.send(task)
        # Crash/uncertainty recovery may RETURN existing verified output; never re-execute it.
        if not permit.get('execute'):
            proof=read(provenance) if provenance.is_file() else {}
            if result_path.is_file() and proof.get('request_sha256')==call_hash and proof.get('output_sha256')==sha(encoded(read(result_path))):
                result=read(result_path)
            else:raise ValueError('This invocation is already reserved or indeterminate; inspect it before further work.')
        else:
            expected={'invocation_id':task['invocation_id'],'request_sha256':call_hash,
                      'chain_id':task['chain_id'],'provider':task['provider'],
                      'specialist':task['specialist'],'orchestrator':task['orchestrator']}
            if any(permit.get(k)!=v for k,v in expected.items()):
                raise ValueError('Execution permit does not match the registered task and provider.')
            record.write_text(json.dumps({'request_sha256':call_hash,'state':'reserved','permit':permit},indent=2),encoding='utf-8')
            (folder/'Agent induction.json').write_text(json.dumps({
                'schema':'course-creator-runtime-induction/1','actual_runtime':'OpenAI Codex local adapter',
                'phase':'preflight_and_induction_complete','subject':'course-creator-agent',
                'orchestrator':'maturion-agent','profile':role,'bundle_sha256':self.package['bundle_sha256'],
                'loaded_instruction_files':selected,'controller_context':context,
                'transport_payload_sha256':sha(encoded(wire_payload)),
                'delegation_id':task['invocation_id'],'QA_pass_inferred':False},indent=2),encoding='utf-8')
            try:
                result=provider(folder,expanded,schema,wire_payload)
                # The provider writes Response.json itself; explicit adapters must return identical data.
                result_path.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
            except Exception as exc:
                returned={**task,'operation':'return','invocation_sha256':call_hash,'outcome':'indeterminate',
                          'result':{'error_type':type(exc).__name__,'provider_outcome':'uncertain'}}
                self.send(returned)
                raise
        deps=self.config.get('validation_dependencies')
        if deps and deps not in sys.path:sys.path.insert(0,deps)
        import jsonschema
        try:
            jsonschema.Draft202012Validator(schema).validate(result)
        except Exception:
            self.send({**task,'operation':'return','invocation_sha256':call_hash,'outcome':'indeterminate',
                       'result':{'error_type':'SchemaValidationError','provider_outcome':'saved_invalid_output'}})
            raise
        output=sha(encoded(result))
        provenance.write_text(json.dumps({'request_sha256':call_hash,'output_sha256':output,
                                         'schema_sha256':task['schema_sha256']},indent=2),encoding='utf-8')
        returned={**task,'operation':'return','invocation_sha256':call_hash,'output_sha256':output,
                  'outcome':'completed','result':{'validated_schema_sha256':task['schema_sha256'],
                  'source_bundle_sha256':self.package['bundle_sha256'],'counters':task['counters'],
                  'QA_pass_inferred':False,'owner_approved':False}}
        receipt=self.send(returned)
        if not receipt.get('accepted') or receipt.get('output_sha256')!=output:
            raise ValueError('Maturion controller rejected the exact validated output return.')
        record.write_text(json.dumps({'invocation_id':task['invocation_id'],'request_sha256':call_hash,'state':'completed','output_sha256':output,
                                      'permit':permit,'return_receipt':receipt,'binding':task},indent=2),encoding='utf-8')
        return result

def worker_context(worker,folder):
    from review_workflow import sha as file_sha
    request=getattr(worker,'request',None) or worker.r
    worker.check()
    state=worker.state
    name=Path(folder).name.lower()
    phase=('diagnosis' if 'root' in name or 'diagnos' in name else 'duplication' if 'duplication' in name
           else 'correction' if 'correction' in name or 'consolidat' in name else 'reviewer' if 'review' in name
           else 'research' if 'research' in name else 'producer')
    fifth=None
    if state.get('fifth_started') or state.get('loop_round',0)>4:
        from course_loop_intervention import extension
        if not extension(worker):raise ValueError('The existing controller did not verify a fifth round.')
        if request.get('owner_recovery'):
            from course_recovery import fifth_evidence
            fifth=fifth_evidence(worker)
        else:
            receipt=state['intervention']
            fifth={'classification':'natural_evolution','allow_fifth':True,'verified_by_existing_controller':True,
                   'original_round':4,'admin_loop':False,'receipt_sha256':receipt['sha256']}
    # Count completed rounds before the current reserved producer/reviewer, retaining actual call totals.
    round_number=state.get('loop_round') or state.get('producer_calls',0)
    completed=round_number if phase=='diagnosis' else max(0,round_number-1)
    if phase=='producer':completed=max(completed,state.get('producer_calls',0)-1)
    if fifth:completed=4  # Generic worker increments the fifth producer before receiving its design.
    context={'project_id':request['project']['id'],'unit_id':request.get('unit','LU01'),
             'chain_id':request.get('controller_chain_id') or request.get('manual_loop',{}).get('lineage') or request['id'],
             'parent':{'sha256':file_sha(worker.path)},'qa_sha256':request['policy'],
             'phase':phase,'candidate_sha256':(state.get('draft') or {}).get('artifact',{}).get('sha256'),'loop_stop':state.get('loop_stop'),'fifth_evidence':fifth,
             'counters':{'rounds_completed':completed,'producer_calls':state.get('producer_calls',0),
                         'review_calls':state.get('review_calls',0),'research_calls':state.get('research_calls',0)}}
    return context

def invoke_runtime(runtime,folder,instruction,schema,payload):
    bridge=Bridge(getattr(runtime,'agent_config',None),getattr(runtime,'agent_commissioning',False))
    worker=getattr(runtime,'governed_worker',None)
    context=worker_context(worker,folder) if worker else getattr(runtime,'governed_context',None)
    if not context:
        root=Path(getattr(runtime,'work_root',folder)).resolve()
        location=Path(folder).resolve()
        while location.is_relative_to(root):
            record=location/'Controller delegation context.json'
            if record.is_file():context=read(record);break
            if location==root:break
            location=location.parent
    if callable(context):context=context(folder,payload)
    if not context:raise ValueError('The registered controller did not supply an authorised parent context.')
    return bridge.invoke(runtime._invoke_provider,folder,instruction,schema,payload,context)

def stage_context(folder,project,qa,parent,phase='design',chain=None):
    context={'project_id':project['id'],'unit_id':'COURSE','chain_id':chain or parent['sha256'],
             'parent':parent,'qa_sha256':qa,'phase':phase,
             'counters':{'rounds_completed':0,'producer_calls':0,'review_calls':0,'research_calls':0}}
    (Path(folder)/'Controller delegation context.json').write_text(json.dumps(context,indent=2),encoding='utf-8')
    return context

def handover(worker,result):
    if not result.get('qa_ready'):return result
    # Actual existing controller checks current requirements, approvals and all hash-bound files.
    pending=worker.folder/'Pending Maturion handover.json'
    if pending.is_file():
        if read(pending)!=result:raise ValueError('Pending handover evidence changed; preserve and investigate it.')
    else:worker.store.immutable(pending,result)
    worker.check()
    refs={k:worker.store.checked(result[k]) for k in ('artifact','qa','duplication')}
    qa=read(refs['qa'])
    if qa.get('decision')!='ready_for_owner_review' or qa.get('findings'):
        raise ValueError('Independent QA still has findings; no Maturion handover is permitted.')
    from unit_duplication import gate
    gate.verify_record(read(refs['duplication']))
    candidates=[]
    for record in worker.work.rglob('Governed invocation.json'):
        value=read(record)
        if value.get('state')=='completed' and ('review' in record.parent.name.lower() and 'duplication' not in record.parent.name.lower()):
            candidates.append((record.stat().st_mtime,value,record.parent))
    if not candidates:raise ValueError('No governed independent-review return is saved.')
    _,last,review_folder=max(candidates,key=lambda x:x[0])
    binding=last['binding']
    if binding.get('candidate_sha256')!=result['artifact']['sha256']:
        raise ValueError('The completed review was not commissioned against this exact rendered manual.')
    raw_review=read(review_folder/'Response.json')
    if sha(encoded(raw_review))!=last['output_sha256']:
        raise ValueError('The independently reviewed raw response changed.')
    provenance={'review_invocation_id':last['invocation_id'],
                'review_input_payload_sha256':binding['payload_sha256'],
                'raw_review_output_sha256':last['output_sha256'],
                'reviewed_candidate_sha256':binding['candidate_sha256'],
                'assembled_QA_sha256':result['qa']['sha256'],
                'duplication_sha256':result['duplication']['sha256'],
                'assembly_method':'existing_validated_report_and_retained_freeze',
                'assembly_evidence_sha256':sha(encoded({'frozen':worker.state.get('frozen_sections',[]),
                    'correction_ledger':worker.state.get('correction_ledger',[]),
                    'raw_review_output_sha256':last['output_sha256'],'QA':result['qa']}))}
    worker.store.immutable(worker.folder/('Controller QA provenance-'+result['qa']['sha256'][:16]+'.json'),provenance)
    bridge=Bridge(getattr(worker.runtime,'agent_config',None),getattr(worker.runtime,'agent_commissioning',False))
    context=worker_context(worker,worker.work/'final-handover');context['phase']='reviewer'
    value={'complete_rendered':True,'mandatory_QA_passed':True,'duplication_passed':True,
           'current_inputs_verified':True,'owner_approved':False,
           'review_invocation_id':last.get('invocation_id') or last['permit'].get('invocation_id'),
           'review_provenance':provenance,
           'artifacts':{'manual':result['artifact']['sha256'],'QA':result['qa']['sha256'],
                        'duplication':result['duplication']['sha256']},
           'frozen_components':worker.state.get('frozen_sections',[])}
    task=bridge.task(context,worker.work/'final-handover','Maturion final evidence verification',{},value)
    task.update(operation='handover',result=value)
    receipt=bridge.send(task)
    if not receipt.get('owner_review_ready') or receipt.get('owner_approved'):
        raise ValueError('Maturion did not accept the complete handover evidence.')
    path=worker.folder/'Maturion handover receipt.json';worker.store.immutable(path,receipt)
    result['maturion_handover']=worker.store.ref(path)
    return result


def resume_handover(worker):
    """Explicit worker restart resumes only the saved handover, with zero AI calls."""
    pending=worker.folder/'Pending Maturion handover.json'
    if not pending.is_file():return False
    result=handover(worker,read(pending))
    path=worker.folder/'Result.json'
    if path.exists() and read(path)!=result:
        path=worker.folder/('Result-handover-'+result['artifact']['sha256'][:16]+'.json')
    worker.store.immutable(path,result)
    worker.update(status='ready_for_review',result=worker.store.ref(path),
                  message='Saved complete manual and independent QA recovered without another model call. Ready for your review and electronic sign-off.')
    return True
