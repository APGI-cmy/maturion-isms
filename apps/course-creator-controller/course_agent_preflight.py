"""Verify actual accepted bundle/registry/routing evidence; never self-activate."""
from pathlib import Path
import hashlib,json,os

CONFIG=Path(os.environ.get('LOCALAPPDATA',''))/'APGI/CourseCreator/private-connection.json'

def read(path):return json.loads(Path(path).read_text(encoding='utf-8-sig'))
def sha(raw):return hashlib.sha256(raw).hexdigest()

def verify(config,commissioning=False):
    if not commissioning and not config.get('full_agent_active'):
        raise ValueError('The governed Course Creator controller is not activated.')
    root=Path(config['agent_package']).resolve()
    lock=read(root/'agent-runtime-lock.json')
    for name,expected in lock['files'].items():
        path=(root/name).resolve()
        if not path.is_relative_to(root) or path.is_symlink() or getattr(path,'is_junction',lambda:False)():
            raise ValueError('Invalid governed agent package path.')
        if sha(path.read_bytes())!=expected:raise ValueError('Agent source changed: '+name)
    if not lock.get('files') or not lock.get('instruction_files'):
        raise ValueError('The registered agent package is incomplete.')
    authority=root/'.agent-admin/authorities/course-creator-activation-2077.md'
    if not authority.is_file() or '2077' not in authority.read_text(encoding='utf-8'):
        raise ValueError('The actual owner authority record is missing.')
    adapter=Path(config['adapter_root']).resolve()
    for name,expected in read(root/'installed-controller-lock.json')['files'].items():
        path=(adapter/name).resolve()
        if not path.is_relative_to(adapter) or sha(path.read_bytes().replace(b'\r\n',b'\n'))!=expected:
            raise ValueError('Accepted controller wiring changed: '+name)
    registry=read(root/'governance/AGENT_REGISTRY.json')
    rows={r['agent_id']:r for r in registry['agents']}
    target=rows.get('course-creator-agent',{});parent=rows.get('maturion-agent',{})
    if target.get('orchestrator_link')!='maturion-agent' or parent.get('agent_class')!='orchestrator':
        raise ValueError('A real registered Maturion parent is required.')
    if not commissioning and (target.get('status')!='active' or parent.get('status')!='active'):
        raise ValueError('Canonical agent/orchestrator registration is inactive.')
    route=read(root/'apps/mat-ai-gateway/course_creator/controller-registration.json')
    if route['specialist']!='course-creator-agent' or route['orchestrator']!='maturion-agent' or route['provider']!='codex-chatgpt-local':
        raise ValueError('The actual provider/controller route is not registered.')
    inventory=read(root/'governance/CANON_INVENTORY.json')
    indexed={r['path']:r for r in inventory['canons']}
    for row in (target,parent):
        entry=indexed.get(row.get('path'),{})
        actual=sha((root/row['path']).read_bytes())
        if entry.get('file_hash_sha256')!=actual:raise ValueError('Canonical agent integrity is unproven.')
    if not commissioning:
        ref=config.get('full_activation_acceptance') or {}
        acceptance=read(ref['path'])
        if sha(Path(ref['path']).read_bytes())!=ref['sha256']:
            raise ValueError('Independent acceptance identity changed.')
        if acceptance.get('decision')!='PASS' or acceptance.get('subject')!='course-creator-agent':
            raise ValueError('Actual independent activation acceptance is missing.')
        if acceptance.get('reviewed_content_sha256')!=lock['reviewed_content_sha256']:
            raise ValueError('Acceptance is for a different agent submission.')
        if not acceptance.get('independent_of_producer') or not acceptance.get('independent_of_factory'):
            raise ValueError('Producer checks cannot replace independent assurance.')
    chunks=[]
    for name in lock['instruction_files']:
        chunks.append(name+'\n'+(root/name).read_text(encoding='utf-8'))
    return {'root':root,'bundle_sha256':lock['runtime_knowledge_sha256'],
            'submission_sha256':sha((root/'agent-runtime-lock.json').read_bytes()),
            'instructions':'\n\n'.join(chunks),'lock':lock}


def main():
    import argparse,sys
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config',type=Path,default=CONFIG)
    parser.add_argument('--commissioning',action='store_true')
    parser.add_argument('--capability',action='store_true')
    args=parser.parse_args()
    try:
        config=read(args.config);value=verify(config,args.commissioning)
        result={'schema':'course-agent-preflight/1','source_verified':True,
                'submission_sha256':value['submission_sha256'],
                'runtime_bundle_sha256':value['bundle_sha256'],
                'scope':'commissioning_only' if args.commissioning else 'accepted_controller',
                'QA_pass':False,'owner_approved':False}
        if args.capability:
            from course_agent_runtime import Bridge
            bridge=Bridge(config,args.commissioning)
            context={'project_id':config['project_id'],'unit_id':'LU01','chain_id':'capability-read',
                     'parent':{'sha256':'0'*64},'qa_sha256':'0'*64,'phase':'design',
                     'counters':{'rounds_completed':0,'producer_calls':0,'review_calls':0,'research_calls':0}}
            task=bridge.task(context,Path.cwd(),'Authenticated readiness query',{}, {})
            task['operation']='capability'
            result['authenticated_capability']=bridge.send(task)
        print(json.dumps(result,indent=2))
    except Exception as exc:
        print(json.dumps({'source_verified':False,'state':'HELD','reason':str(exc)}))
        sys.exit(1)


if __name__=='__main__':main()
