"""Isolated signature fixtures, never real assurance or activation receipts."""
from pathlib import Path
import base64,copy,hashlib,json,sys,tempfile,unittest
from datetime import datetime,timezone,timedelta
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from runtime_preflight import assess,canonical,GATES,ISSUERS
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding,PublicFormat

class RuntimePreflightTests(unittest.TestCase):
    def setUp(self):
        work=Path(tempfile.gettempdir())/'apgi-course-creator-preflight-fixtures';work.mkdir(parents=True,exist_ok=True)
        self.temp=tempfile.TemporaryDirectory(dir=work);self.root=Path(self.temp.name);(self.root/'governance').mkdir()
        (self.root/'governance/commissioning-authority.json').write_text(json.dumps({'issue':'https://github.com/APGI-cmy/maturion-isms/issues/2075'}))
        (self.root/'contract.txt').write_text('Immutable fixture contract.')
        self.expected=hashlib.sha256((self.root/'contract.txt').read_bytes()).hexdigest()
        (self.root/'bundle-lock.json').write_text(json.dumps({'files':{'contract.txt':self.expected}}))
        self.submission=hashlib.sha256((self.root/'bundle-lock.json').read_bytes()).hexdigest();self.now=datetime(2026,11,26,12,tzinfo=timezone.utc)
        self.keys={g:Ed25519PrivateKey.generate() for g in GATES};self.trust={'keys':{g:{'issuer':ISSUERS[g],'allowed_gates':[g],'public_key_hex':self.keys[g].public_key().public_bytes(Encoding.Raw,PublicFormat.Raw).hex(),'revoked':False} for g in GATES}}
        self.receipts={g:self.sign(g,{'schema':'course-creator-commissioning-receipt/1','gate':g,'subject':'course-creator-agent','orchestrator':'maturion-agent','submission_sha256':self.submission,'verdict':'PASS','issued_at':(self.now-timedelta(minutes=1)).isoformat(),'expires_at':(self.now+timedelta(minutes=1)).isoformat(),'evidence':[{'reference':'fixture-only:never-real-evidence','sha256':'a'*64}],'independent_of_producer':True,'independent_of_factory':True,'persona_id':'course-creator-advisor','maturion_registered':True,'authenticated_route':True,'checks':{k:True for k in ('verified_identity','tenant_isolation','idempotency','current_QA_binding','retained_counters','maturion_review','failure_paths')},'real_course_jobs_started':False}) for g in GATES}
    def tearDown(self):self.temp.cleanup()
    def sign(self,gate,payload):return {'key_id':gate,'payload':payload,'signature':base64.b64encode(self.keys[gate].sign(canonical(payload))).decode()}
    def test_valid_separate_signed_fixtures_pass_without_activating(self):
        report=assess(self.root,self.receipts,self.trust,self.now)
        self.assertTrue(report['ready']);self.assertFalse(report['activation_performed']);self.assertEqual(report['model_calls'],0)
    def test_missing_real_receipts_and_trust_fail_closed(self):
        self.assertFalse(assess(self.root,now=self.now)['ready'])
    def test_forged_or_replayed_changed_submission_rejected(self):
        bad=copy.deepcopy(self.receipts);bad['factory_review']['payload']['subject']='other-agent';self.assertFalse(assess(self.root,bad,self.trust,self.now)['ready'])
        (self.root/'contract.txt').write_text('Changed after independent review.');self.assertFalse(assess(self.root,self.receipts,self.trust,self.now)['ready'])
    def test_expired_revoked_wrong_subject_and_nonindependent_receipts_rejected(self):
        self.assertFalse(assess(self.root,self.receipts,self.trust,self.now+timedelta(hours=1))['ready'])
        revoked=copy.deepcopy(self.trust);revoked['keys']['factory_review']['revoked']=True;self.assertFalse(assess(self.root,self.receipts,revoked,self.now)['ready'])
        for gate,change in [('independent_assurance',{'independent_of_factory':False}),('aimc_registration',{'authenticated_route':False}),('runtime_commissioning',{'real_course_jobs_started':True})]:
            bad=copy.deepcopy(self.receipts);payload={**bad[gate]['payload'],**change};bad[gate]=self.sign(gate,payload);self.assertFalse(assess(self.root,bad,self.trust,self.now)['ready'])

if __name__=='__main__':unittest.main()
