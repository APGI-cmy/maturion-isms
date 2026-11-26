"""Private transport safety tests; not learner-guide QA rules or pass criteria."""
import base64
import copy
import json
import time
import uuid
from types import SimpleNamespace

import pytest
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
from fastapi import HTTPException

from services.course_creator_runtime import PATH, Model, delegate, digest


class MemoryLedger:
    def __init__(self, key):
        self.registration = {'public_key': key.public_key().public_bytes(Encoding.Raw, PublicFormat.Raw).hex(),
                             'tenant_id': 'tenant-a', 'user_id': 'owner-a', 'project_id': 'course-a',
                             'unit_id': 'LU01', 'enabled': True, 'commissioning': True,
                             'assurance_ref': 'test-receipt'}
        self.saved = {}
        self.claims = 0

    def client(self, _):
        return self.registration

    def claim(self, _, task, body_hash):
        if task.request_id in self.saved:
            row = self.saved[task.request_id]
            if body_hash != row['hash']:
                raise HTTPException(503, 'conflict')
            return {'claimed': False, **row}
        self.claims += 1
        self.saved[task.request_id] = {'hash': body_hash, 'state': 'running'}
        return {'claimed': True}

    def finish(self, task, state, result):
        self.saved[task.request_id].update(state=state, result=result)


class FakeModel:
    def __init__(self):
        self.calls = []
        self.broken = False

    def call(self, system, payload):
        self.calls.append((system, payload))
        if self.broken:
            raise RuntimeError('uncertain provider outcome')
        return {'summary': 'Saved work remains held.', 'findings': [
            {'title': 'Hold', 'evidence_ids': ['state'], 'recommendation': 'Inspect the existing stop.'}],
            'limits': ['Not a QA pass.']}, 20


@pytest.fixture
def setup():
    key = Ed25519PrivateKey.generate()
    task = {'request_id': str(uuid.uuid4()), 'app': 'course-creator', 'orchestrator': 'maturion-agent',
            'specialist': 'course-creator-agent', 'tenant_id': 'tenant-a', 'user_id': 'owner-a',
            'project_id': 'course-a', 'unit_id': 'LU01', 'operation': 'inspect', 'question': 'What is held?',
            'qa_sha256': 'a' * 64, 'evidence': {'state': {'status': 'qa_held'}},
            'counters': {'rounds_completed': 4, 'producer_calls': 4, 'review_calls': 4},
            'commissioning': False, 'runtime_revision': 'cc-private/1.1'}
    return key, task, MemoryLedger(key), FakeModel()


def send(setup, task=None, age=0, alter=None):
    key, original, ledger, model = setup
    raw = json.dumps(task or original).encode()
    stamp = str(int(time.time()) - age)
    signature = key.sign((stamp + '\nPOST\n' + PATH + '\n' + digest(raw)).encode())
    headers = {'x-cc-client': 'client-a', 'x-cc-time': stamp,
               'x-cc-signature': base64.b64encode(signature).decode()}
    if alter:
        raw = alter(raw)
    return delegate(raw, headers, ledger, model)


def test_private_specialist_then_maturion_and_retained_counters(setup):
    result = send(setup)
    assert len(setup[3].calls) == 2
    assert 'Tier 1 and governed Tier 2' in setup[3].calls[0][0]
    assert 'ecosystem orchestrator' in setup[3].calls[1][0]
    assert result['counters']['rounds_completed'] == 4
    assert not result['qa_pass'] and not result['owner_approved'] and not result['changes_implemented']


@pytest.mark.parametrize('field,value', [('tenant_id', 'tenant-b'), ('user_id', 'other'),
                                         ('project_id', 'other'), ('unit_id', 'LU02')])
def test_cross_scope_rejected_before_provider(setup, field, value):
    task = copy.deepcopy(setup[1])
    task[field] = value
    with pytest.raises(HTTPException) as exc:
        send(setup, task)
    assert exc.value.status_code == 401
    assert not setup[3].calls and setup[2].claims == 0


def test_expired_and_body_tamper_rejected(setup):
    with pytest.raises(HTTPException):
        send(setup, age=90)
    with pytest.raises(HTTPException):
        send(setup, alter=lambda r: r.replace(b'What is held?', b'Change it now'))
    assert not setup[3].calls


def test_repeated_request_reuses_exact_result(setup):
    result = send(setup)
    assert send(setup) == result
    assert len(setup[3].calls) == 2 and setup[2].claims == 1


def test_changed_payload_same_id_conflicts(setup):
    send(setup)
    task = copy.deepcopy(setup[1])
    task['question'] = 'Different question'
    with pytest.raises(HTTPException):
        send(setup, task)
    assert len(setup[3].calls) == 2


def test_uncertain_outcome_does_not_retry_or_refund(setup):
    setup[3].broken = True
    with pytest.raises(HTTPException):
        send(setup)
    with pytest.raises(HTTPException) as exc:
        send(setup)
    assert exc.value.status_code == 409
    assert len(setup[3].calls) == 1 and setup[2].claims == 1
    saved = setup[2].saved[setup[1]['request_id']]['result']
    assert saved['stage'] == 'specialist_call' and saved['model_calls_attempted'] == 1
    assert saved['error_type'] == 'RuntimeError'


def test_disabled_registration_cannot_bypass_commissioning(setup):
    setup[2].registration['enabled'] = False
    with pytest.raises(HTTPException):
        send(setup)
    assert not setup[3].calls


def test_unregistered_route_and_no_public_fallback(test_client):
    response = test_client.post(PATH, json={})
    assert response.status_code == 422


def test_fabricated_evidence_stops_synthesis(setup):
    def bad(system, payload):
        setup[3].calls.append((system, payload))
        return {'summary': 'Unsupported', 'findings': [
            {'title': 'Invented', 'evidence_ids': ['nonexistent'], 'recommendation': 'Stop'}],
            'limits': []}, 1
    setup[3].call = bad
    with pytest.raises(HTTPException):
        send(setup)
    assert len(setup[3].calls) == 1


def test_model_uses_strict_schema_and_preserves_truncation_metadata():
    calls = []

    def create(**kwargs):
        calls.append(kwargs)
        return SimpleNamespace(id='response-test', usage=SimpleNamespace(total_tokens=50),
                               choices=[SimpleNamespace(finish_reason='length', message=SimpleNamespace(
                                   content='{"summary":"unfinished', refusal=None))])
    model = Model.__new__(Model)
    model.client = SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(create=create)))
    with pytest.raises(ValueError):
        model.call('Inspect', {'evidence': {'state': {}}})
    assert len(calls) == 1
    assert calls[0]['response_format']['json_schema']['strict'] is True
    assert model.last_observation['finish_reason'] == 'length'
    assert model.last_observation['total_tokens'] == 50


def test_provider_error_telemetry_does_not_include_secret_error_text():
    class ProviderRefusal(Exception):
        status_code, request_id = 401, 'request-test'

    def create(**kwargs):
        raise ProviderRefusal('must-not-persist-secret-error-text')
    model = Model.__new__(Model)
    model.client = SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(create=create)))
    with pytest.raises(ProviderRefusal):
        model.call('Inspect', {'evidence': {'state': {}}})
    assert model.last_observation['provider_status'] == 401
    assert 'must-not-persist' not in json.dumps(model.last_observation)
