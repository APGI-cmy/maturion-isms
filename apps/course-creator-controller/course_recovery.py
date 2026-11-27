"""Exact-job owner recovery after administrative escalation, never a QA waiver."""
from pathlib import Path
from datetime import datetime,timezone
import copy,json
from commissions import identity
from review_workflow import read,sha,now

def held_identity(state):
    fields=('id','unit','kind','input_version','producer_calls','review_calls','diagnostic_calls',
            'loop_round','next_round','loop_stop','draft','quality_hold','intervention',
            'pending_corrections','correction_ledger','candidate_hashes','last_applied_producer',
            'round_prepared','result')
    return identity({key:state.get(key) for key in fields})

def case_for(store,p,unit,accepted=True):
    if unit!='LU01':return None
    pointer=store.folder(p,unit)/'Owner recovery.json'
    if not pointer.is_file():return None
    ref=read(pointer);case=read(store.checked(ref));auth=read(store.checked(case['authority']));scope=read(store.checked(case['scope']))
    if case['schema']!='course-owner-final-recovery-case/1' or auth['schema']!='course-owner-final-recovery-authority/1':raise ValueError('Invalid owner recovery record.')
    if auth['project']!=p or auth['unit']!=unit or auth['job_id']!=case['job_id'] or auth['chain_id']!=case['chain_id']:raise ValueError('Recovery belongs to another course, unit or chain.')
    if auth['source']!='direct_user_instruction' or auth['actor']!=p['owner'] or auth['user_reply']!='Authorise one final recovery round for LU1':raise ValueError('Actual explicit owner recovery authority is missing.')
    if auth['max_round']!=5 or auth['additional_producer_calls']!=1 or auth['counters']!={'producer_calls':4,'review_calls':4,'diagnostic_calls':1,'loop_round':4}:raise ValueError('Recovery cannot reset or expand its original allowance.')
    old=read(store.checked(auth['original_request']));snapshot=read(store.checked(auth['original_state']));denied=read(store.checked(auth['denied_natural_intervention']))
    for item in (*auth['draft'].values(),auth['quality_hold'],scope['research_result'],scope['research_record'],scope['research_qa'],scope['design_reconciliation']):store.checked(item)
    if old['id']!=case['job_id'] or old['manual_loop']['lineage']!=case['chain_id'] or snapshot['draft']!=auth['draft'] or snapshot['loop_round']!=4 or snapshot['producer_calls']!=4 or snapshot['review_calls']!=4 or snapshot['diagnostic_calls']!=1:raise ValueError('Recovery baseline/counters changed.')
    if denied['classification']!='admin_failure' or denied['allow_fifth'] is not False:raise ValueError('The original administrative rejection must remain intact.')
    from reconciliation import verified_release,policies
    release=verified_release(store.evidence.shared);current=policies(release)['digital']
    proof=store.evidence.requirements_reconciliation(release['fingerprint'])
    if not proof or proof.get('fresh_reconciliation')!=scope['design_reconciliation'] or proof['effective_policy']!=scope['effective_policy'] or current!=scope['new_digital_policy']:raise ValueError('Current operative requirements need new affected reconciliation; recovery is held.')
    before={c['id']:c for c in scope['old_digital_policy']['criteria']};after={c['id']:c for c in current['criteria']}
    changed=sorted(k for k in set(before)|set(after) if before.get(k)!=after.get(k))
    if changed!=scope['changed_criteria'] or changed!=['CR-12','CR-18','ELQA-08','SCENE-01'] or before['CR-23']!=after['CR-23']:raise ValueError('The approved scoped requirement impact changed.')
    from unit_duplication import gate
    if sha(gate.__file__)!=scope['duplication_validator']['sha256']:raise ValueError('The duplication validator dependency changed; retained dispositions cannot be reused.')
    if accepted:
        from course_agent_preflight import CONFIG,verify
        config=read(CONFIG);verify(config);acceptance=read(config['full_activation_acceptance']['path'])
        if acceptance.get('owner_recovery_case_sha256')!=ref['sha256'] or acceptance.get('owner_recovery_authority_sha256')!=case['authority']['sha256']:raise ValueError('This exact recovery and its process repair lack independent acceptance.')
    return {'ref':ref,'case':case,'auth':auth,'scope':scope,'old_request':old}

def effective_request(store,folder):
    path=Path(folder)/'Request.json';state=read(Path(folder)/'State.json')
    if state.get('recovery_request'):
        old=read(path);data=case_for(store,old['project'],old['unit'])
        if not data or state['recovery_request']!=data['case']['request'] or state.get('owner_recovery')!=data['case']['authority']:raise ValueError('The effective recovery request changed.')
        path=store.checked(state['recovery_request'])
    return read(path),Path(path)

def research_compatible(store,p,unit,result,token,base,previous):
    data=case_for(store,p,unit)
    if not data:return False
    scope=data['scope'];old=data['old_request'];passed=read(store.checked(scope['research_result']))
    return (result==passed and result['policy']==scope['old_policy'] and base['policy']==scope['effective_policy']
            and result['input_version']==token==old['input_version'] and result['course_version']==base['course_version']==old['course_version']
            and result.get('previous_approval_id')==previous and result.get('qa_ready') is True
            and datetime.now(timezone.utc)<datetime.fromisoformat(result['fresh_until']))

def duplication_compatible(worker,record):
    if not worker.request.get('owner_recovery'):return False
    data=case_for(worker.store,worker.request['project'],worker.request['unit'])
    return bool(data and worker.request['owner_recovery']==data['case']['authority'] and record['packet']['policy']==data['scope']['old_policy'])

def eligible(worker):
    r=worker.request
    if not r.get('owner_recovery'):return False
    data=case_for(worker.store,r['project'],r['unit']);state=worker.state
    if not data or r['id']!=data['case']['job_id'] or r['controller_chain_id']!=data['case']['chain_id'] or r['owner_recovery']!=data['case']['authority']:raise ValueError('Recovery job/chain authority changed.')
    if (worker.folder/'Recovery outcome.json').exists():return False
    if state['producer_calls'] not in (4,5) or not 4<=state['review_calls']<=10 or state.get('diagnostic_calls')!=1 or state.get('loop_round') not in (4,5):raise ValueError('Recovery counters are outside the preserved four-to-five boundary.')
    return True

def fifth_evidence(worker):
    if not eligible(worker):raise ValueError('No verified owner-authorised final recovery is available.')
    data=case_for(worker.store,worker.request['project'],worker.request['unit'])
    from course_agent_preflight import CONFIG
    config=read(CONFIG)
    return {'classification':'owner_authorised_recovery','allow_fifth':True,'verified_by_existing_controller':True,
            'original_round':4,'maximum_round':5,'owner_authority_sha256':data['case']['authority']['sha256'],
            'original_request_sha256':data['auth']['original_request']['sha256'],'original_candidate_sha256':data['auth']['draft']['artifact']['sha256'],
            'job_id':worker.request['id'],'receipt_sha256':data['case']['authority']['sha256'],
            'repair_assurance_sha256':config['full_activation_acceptance']['sha256']}

def start(store,value,listing,row):
    p=listing['project'];data=case_for(store,p,row['id'])
    if not data or value.get('authority_sha256')!=data['case']['authority']['sha256'] or value.get('actor')!=p['owner']:raise ValueError('Use the exact recorded owner authority for this recovery.')
    if not listing['course_current'] or row['locked'] or row['needs_alignment'] or not row['research_ready'] or not row['implementation_plan']['internal_ready']:raise ValueError('Current design, retained research and internal planning are required.')
    if any(u['active'] for u in listing['units']):raise ValueError('Another course job is active.')
    job=store.folder(p,row['id'])/'Jobs'/data['case']['job_id'];marker=job/'Recovery started.json'
    if marker.exists():return {'id':data['case']['job_id'],'reused':True,'recovery':read(marker),'message':'This one-time recovery was already consumed; no new run was started.'}
    current=read(job/'State.json')
    approved_state=read(store.checked(data['auth']['original_state']))
    if current['status']!='qa_held' or held_identity(current)!=held_identity(approved_state):raise ValueError('The held candidate/counters changed after owner approval.')
    request=read(store.checked(data['case']['request']))
    if request['id']!=data['case']['job_id'] or request['policy']!=listing['policy'] or request['input_version']!=row['input_version']:raise ValueError('The prepared recovery request is no longer current.')
    store.immutable(marker,{'authority':data['case']['authority'],'request':data['case']['request'],'started_at':now(),'actor':p['owner'],'scope':'Consume one final round, original counters retained, QA and owner sign-off mandatory.'})
    store.mutable(job/'State.json',{**current,'status':'queued','message':'Owner-authorised final recovery round queued. No sixth round or automatic sign-off.',
        'owner_recovery':data['case']['authority'],'recovery_request':data['case']['request'],'fifth_started':True,'loop_max':5,'next_round':5,'loop_stop':None,'quality_hold':{},'intervention_pending':False})
    store._spawn(p,row['id'],job)
    return {'id':request['id'],'recovery_queued':True,'max_round':5,'counters_preserved':data['auth']['counters']}

def finish(worker):
    if not worker.request.get('owner_recovery'):return
    path=worker.folder/'Recovery outcome.json'
    if path.exists():return
    passed=False
    if worker.state['status']=='ready_for_review' and worker.state.get('result'):
        result=read(worker.store.checked(worker.state['result']))
        qa=read(worker.store.checked(result['qa']))
        handover=read(worker.store.checked(result['maturion_handover']))
        passed=(result.get('qa_ready') is True and result.get('owner_approved') is False
                and result['policy']==worker.request['policy'] and result['artifact']==worker.state['draft']['artifact']
                and qa.get('decision')=='ready_for_owner_review' and not qa.get('findings')
                and handover.get('owner_review_ready') is True and handover.get('owner_approved') is False
                and handover.get('artifacts',{}).get('manual')==result['artifact']['sha256'])
    worker.store.immutable(path,{'schema':'course-owner-final-recovery-outcome/1','authority':worker.request['owner_recovery'],
        'job_id':worker.request['id'],'state':worker.state['status'],'decision':'QA_passed_pending_owner' if passed else 'permanently_held',
        'result':worker.state.get('result'),'producer_calls':worker.state['producer_calls'],'review_calls':worker.state['review_calls'],
        'diagnostic_calls':worker.state.get('diagnostic_calls'),'loop_round':worker.state.get('loop_round'),'created_at':now(),'owner_approved':False})
    if not passed:worker.update(status='qa_held',loop_stop='fifth_recovery_terminal',message='The final owner-authorised recovery did not pass every QA gate. This chain is permanently held; no sixth round or sign-off is permitted.')
