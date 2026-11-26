"""Verify externally issued commissioning receipts; never self-activate an agent."""
from pathlib import Path
import argparse,base64,hashlib,json,sys
from datetime import datetime,timezone

GATES=('factory_review','independent_assurance','aimc_registration','runtime_commissioning')
ISSUERS={'factory_review':'agent-factory','independent_assurance':'independent-iaa','aimc_registration':'aimc-registry','runtime_commissioning':'aimc-runtime'}

def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode('utf8')
def read(path):return json.loads(Path(path).read_text(encoding='utf8'))
def digest(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def verify_receipt(document,gate,submission,trust,now):
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
    payload=document['payload'];key_id=document['key_id'];key=trust['keys'][key_id]
    if key['issuer']!=ISSUERS[gate] or key.get('revoked') or gate not in key['allowed_gates']:raise ValueError('Untrusted or revoked issuer for '+gate)
    Ed25519PublicKey.from_public_bytes(bytes.fromhex(key['public_key_hex'])).verify(base64.b64decode(document['signature'],validate=True),canonical(payload))
    if payload['schema']!='course-creator-commissioning-receipt/1' or payload['gate']!=gate or payload['subject']!='course-creator-agent' or payload['orchestrator']!='maturion-agent':raise ValueError('Receipt subject or gate mismatch')
    if payload['submission_sha256']!=submission or payload['verdict']!='PASS':raise ValueError('Receipt does not pass this exact submission')
    issued=datetime.fromisoformat(payload['issued_at'].replace('Z','+00:00'));expires=datetime.fromisoformat(payload['expires_at'].replace('Z','+00:00'))
    if not issued.tzinfo or not expires.tzinfo or not issued<=now<expires:raise ValueError('Receipt is expired, future-dated or unzoned')
    if not payload['evidence'] or any(not e.get('sha256') or len(e['sha256'])!=64 or not e.get('reference') for e in payload['evidence']):raise ValueError('Receipt has no bound evidence')
    if gate=='independent_assurance' and (payload.get('independent_of_producer') is not True or payload.get('independent_of_factory') is not True):raise ValueError('Independent assurance separation is absent')
    if gate=='aimc_registration':
        if payload.get('persona_id')!='course-creator-advisor' or payload.get('maturion_registered') is not True or payload.get('authenticated_route') is not True:raise ValueError('AIMC registration and Maturion route are unproven')
    if gate=='runtime_commissioning':
        required=('verified_identity','tenant_isolation','idempotency','current_QA_binding','retained_counters','maturion_review','failure_paths')
        if not all(payload.get('checks',{}).get(k) is True for k in required):raise ValueError('Runtime commissioning is incomplete')
        if payload.get('real_course_jobs_started') is not False:raise ValueError('Commissioning unexpectedly started real course work')
    return payload

def assess(root,receipts=None,trust=None,now=None):
    root=Path(root).resolve();now=now or datetime.now(timezone.utc);failures=[];verified={}
    lock=read(root/'bundle-lock.json');submission=digest(root/'bundle-lock.json')
    for name,expected in lock['files'].items():
        p=(root/name).resolve()
        if root not in p.parents or not p.is_file() or p.is_symlink() or digest(p)!=expected:failures.append('Changed or unavailable submitted file: '+name)
    authority=read(root/'governance/commissioning-authority.json')
    if authority.get('issue')!='https://github.com/APGI-cmy/maturion-isms/issues/2075':failures.append('Current commissioning authority is missing')
    if not trust or not trust.get('keys'):failures.append('No externally provisioned AIMC/assurance trust anchors')
    if not receipts:failures.append('No actual externally issued commissioning receipts')
    if trust and receipts:
        for gate in GATES:
            try:verified[gate]=verify_receipt(receipts[gate],gate,submission,trust,now)
            except Exception as exc:failures.append(gate+': '+(str(exc) or type(exc).__name__))
        if len({r.get('key_id') for r in receipts.values()})!=len(GATES):failures.append('Factory, IAA, registry and runtime issuers must be independently provisioned')
    return {'schema':'course-creator-runtime-preflight/1','subject':'course-creator-agent','submission_sha256':submission,'ready':not failures and len(verified)==len(GATES),'verified_gates':list(verified),'failures':failures,'activation_performed':False,'model_calls':0,'scope':'Read-only signature/integrity preflight. Runtime owner must separately enforce authenticated dispatch, scope, budget and actual route activation. No status flag, model output or fixture is an activation receipt.'}

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--deps',required=True);parser.add_argument('--receipts');parser.add_argument('--trust-anchors');parser.add_argument('--output',required=True);args=parser.parse_args();sys.path.insert(0,args.deps)
    root=Path(__file__).resolve().parents[1]
    try:report=assess(root,read(args.receipts) if args.receipts else None,read(args.trust_anchors) if args.trust_anchors else None)
    except Exception as exc:report={'ready':False,'failures':[str(exc)],'activation_performed':False}
    output=Path(args.output).resolve()
    if output==root or root in output.parents:raise SystemExit('Put runtime observations outside the immutable submitted package.')
    output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(report))
    return 0 if report['ready'] else 2

if __name__=='__main__':raise SystemExit(main())
