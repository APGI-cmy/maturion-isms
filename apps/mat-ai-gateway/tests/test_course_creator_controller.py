"""Controller transport invariants. These tests confer no learner-guide QA pass."""
import base64
import importlib.util
import json
import sys
from types import SimpleNamespace
import time
import uuid
from pathlib import Path

import pytest
from fastapi import HTTPException
from services.course_creator_controller import PATH, controller
from services.course_creator_runtime import digest
from tests.test_course_creator_private import MemoryLedger
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey


class ControllerLedger(MemoryLedger):
    def __init__(self, key):
        super().__init__(key)
        self.registration.update(controller_enabled=True, controller_assurance_ref='independent-test',
                                 controller_commissioning=True, allowed_unit_ids=['LU01', 'COURSE'])
        self.rows = {}

    def request(self, method, path, **kw):
        if method == 'GET':
            key = kw['params']['invocation_id'][3:]
            return [self.rows[key]] if key in self.rows else []
        body = kw['json']
        if path.endswith('reserve'):
            t = body['p_task']
            key = t['invocation_id']
            if key in self.rows:
                r = self.rows[key]
                if r['request_sha256'] != body['p_hash']:
                    raise HTTPException(409, 'idempotency conflict')
                return {'execute': False, **r}
            row = {'request_sha256': body['p_hash'], 'binding': t, 'chain_id': t['chain_id'],
                   'state': 'reserved', 'invocation_id': key}
            self.rows[key] = row
            return {'execute': True, **row}
        row = self.rows[body['p_id']]
        if row['request_sha256'] != body['p_hash']:
            raise HTTPException(409, 'return binding')
        if row['state'] == 'completed' and row['output_sha256'] != body['p_output']:
            raise HTTPException(409, 'changed completed output')
        row.update(state=body['p_state'], output_sha256=body['p_output'], result=body['p_result'])
        return {'accepted': True, 'state': row['state'], 'output_sha256': row['output_sha256']}


@pytest.fixture
def setup_controller(monkeypatch):
    key = Ed25519PrivateKey.generate()
    ledger = ControllerLedger(key)
    task = dict(request_id=str(uuid.uuid4()), invocation_id=str(uuid.uuid4()), app='course-creator',
                orchestrator='maturion-agent', specialist='course-creator-agent', tenant_id='tenant-a',
                user_id='owner-a', project_id='course-a', unit_id='LU01', operation='reserve',
                phase='producer', provider='codex-chatgpt-local', chain_id='retained-chain',
                controller_checked=True, owner_approved=False, change_QA_suite=False, commissioning=False,
                counters=dict(rounds_completed=0, producer_calls=1, review_calls=0, research_calls=0))
    for field in ('parent', 'qa', 'payload', 'schema', 'instructions', 'bundle'):
        task[field + '_sha256'] = 'a' * 64
    monkeypatch.setitem(controller.__globals__, 'knowledge', lambda: ('governed', 'a' * 64))

    def send(t, path=PATH, age=0):
        raw = json.dumps(t).encode()
        stamp = str(int(time.time()) - age)
        sig = key.sign((stamp + '\nPOST\n' + path + '\n' + digest(raw)).encode())
        headers = {'x-cc-client': 'test-client', 'x-cc-time': stamp,
                   'x-cc-signature': base64.b64encode(sig).decode()}
        return controller(raw, headers, ledger)
    return task, ledger, send


@pytest.mark.parametrize('field,value', [('tenant_id', 'other'), ('project_id', 'other'),
                                         ('unit_id', 'LU02'), ('owner_approved', True),
                                         ('change_QA_suite', True), ('orchestrator', 'other')])
def test_scope_and_authority_denied(setup_controller, field, value):
    task, ledger, send = setup_controller
    with pytest.raises(HTTPException):
        send({**task, field: value})
    assert not ledger.rows


def test_route_signature_expiry_and_disabled(setup_controller):
    task, ledger, send = setup_controller
    for options in ({'path': '/delegate'}, {'age': 90}):
        with pytest.raises(HTTPException):
            send(task, **options)
    ledger.registration['controller_enabled'] = False
    with pytest.raises(HTTPException):
        send(task)
    assert not ledger.rows


def test_replay_and_exact_return_binding(setup_controller):
    task, ledger, send = setup_controller
    permit = send(task)
    assert permit['execute'] and not send(task)['execute']
    ret = {**task, 'operation': 'return', 'invocation_sha256': permit['request_sha256'],
           'output_sha256': 'b' * 64, 'outcome': 'completed', 'result': {'actual_schema_validated': True}}
    for field in ('schema_sha256', 'parent_sha256', 'qa_sha256', 'payload_sha256'):
        with pytest.raises(HTTPException):
            send({**ret, field: 'c' * 64})
    assert send(ret)['accepted']
    assert send(ret)['accepted']
    with pytest.raises(HTTPException):
        send({**ret, 'output_sha256': 'c' * 64})
    assert len(ledger.rows) == 1


@pytest.mark.parametrize('rounds,phase,fifth,allowed',
                         [(3,
                           'correction',
                           False,
                           True),
                          (4,
                           'correction',
                           False,
                           False),
                             (4,
                              'diagnosis',
                              False,
                              True),
                             (4,
                              'correction',
                              True,
                              True),
                             (5,
                              'producer',
                              True,
                              False)])
def test_finite_four_and_conditional_five(setup_controller, rounds, phase, fifth, allowed):
    task, ledger, send = setup_controller
    task['phase'] = phase
    task['counters']['rounds_completed'] = rounds
    if fifth:
        task['fifth_evidence'] = dict(
            classification='natural_evolution',
            allow_fifth=True,
            verified_by_existing_controller=True,
            original_round=4,
            admin_loop=False,
            receipt_sha256='b' * 64)
    if allowed:
        assert send(task)['execute']
    else:
        with pytest.raises(HTTPException):
            send(task)
        assert not ledger.rows


def test_handover_requires_current_independent_review(setup_controller):
    task, ledger, send = setup_controller
    review = {**task, 'phase': 'reviewer', 'candidate_sha256': 'c' * 64}
    permit = send(review)
    send({**review, 'operation': 'return', 'invocation_sha256': permit['request_sha256'],
          'outcome': 'completed', 'output_sha256': 'b' * 64})
    result = dict(complete_rendered=True, mandatory_QA_passed=True, duplication_passed=True,
                  current_inputs_verified=True, owner_approved=False,
                  artifacts={k: 'c' * 64 for k in ('manual', 'QA', 'duplication')},
                  review_invocation_id=review['invocation_id'])
    result['review_provenance'] = {
        'review_invocation_id': review['invocation_id'],
        'review_input_payload_sha256': review['payload_sha256'],
        'raw_review_output_sha256': 'b' * 64,
        'reviewed_candidate_sha256': 'c' * 64,
        'assembled_QA_sha256': 'c' * 64,
        'duplication_sha256': 'c' * 64,
        'assembly_method': 'existing_validated_report_and_retained_freeze',
        'assembly_evidence_sha256': 'd' * 64}
    final = {**task, 'operation': 'handover', 'invocation_id': str(uuid.uuid4()), 'result': result}
    for changed in ({'qa_sha256': 'b' * 64}, {'result': {**result, 'mandatory_QA_passed': False}}):
        with pytest.raises(HTTPException):
            send({**final, **changed})
    receipt = send(final)
    assert receipt['owner_review_ready'] and not receipt['owner_approved']
    assert send(final) == receipt


@pytest.fixture
def bridge_module(monkeypatch):
    root = Path(__file__).resolve().parents[2] / 'course-creator-controller'
    monkeypatch.syspath_prepend(str(root))
    spec = importlib.util.spec_from_file_location('tested_bridge', root / 'course_agent_runtime.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_local_replay_crash_recovery_and_invalid_schema(bridge_module, tmp_path):
    m = bridge_module
    b = m.Bridge.__new__(m.Bridge)
    b.config = {}
    b.commissioning = False
    instruction = tmp_path / 'agent.md'
    instruction.write_text('Registered instructions')
    b.package = dict(root=tmp_path, bundle_sha256='a' * 64,
                     lock=dict(instruction_files=['agent.md']))
    calls = []
    ledger = {}

    def send(body):
        key = body['invocation_id']
        if body['operation'] == 'reserve':
            if key in ledger:
                return {'execute': False, **ledger[key]}
            ledger[key] = {'state': 'reserved'}
            return {'execute': True, 'invocation_id': key, 'request_sha256': m.sha(m.encoded(body)),
                    **{k: body[k] for k in ('chain_id', 'provider', 'specialist', 'orchestrator')}}
        ledger[key] = dict(state=body['outcome'], output_sha256=body.get('output_sha256'))
        return {'accepted': True, **ledger[key]}
    b.send = send
    schema = {
        'type': 'object',
        'properties': {
            'summary': {
                'type': 'string'}},
        'required': ['summary'],
        'additionalProperties': False}
    context = dict(project_id='test', unit_id='LU01', chain_id='test-chain', phase='producer',
                   parent={'sha256': 'b' * 64}, qa_sha256='c' * 64,
                   counters=dict(rounds_completed=0, producer_calls=1, review_calls=0, research_calls=0))

    def provider(*args):
        calls.append(1)
        return {'summary': 'Actual result'}
    folder = tmp_path / 'producer'
    assert b.invoke(provider, folder, 'task', schema, {}, context) == {'summary': 'Actual result'}
    assert b.invoke(provider, folder, 'task', schema, {}, context) == {'summary': 'Actual result'}
    assert len(calls) == 1
    # An unrelated pre-existing output cannot be attributed to a fresh invocation.
    unbound = tmp_path / 'unbound'
    unbound.mkdir()
    (unbound / 'Response.json').write_text(json.dumps({'summary': 'Old unrelated response'}))
    before = len(ledger)
    with pytest.raises(ValueError):
        b.invoke(provider, unbound, 'task', schema, {'x': 2}, context)
    assert len(ledger) == before and len(calls) == 1
    # A crash after saving output is return-only; no extra provider execution.
    record = folder / 'Governed invocation.json'
    saved = m.read(record)
    saved['state'] = 'reserved'
    record.write_text(json.dumps(saved))
    assert b.invoke(provider, folder, 'task', schema, {}, context) == {'summary': 'Actual result'}
    assert len(calls) == 1
    with pytest.raises(ValueError):
        b.invoke(provider, folder, 'changed', schema, {}, context)
    bad = tmp_path / 'invalid'
    with pytest.raises(Exception):
        b.invoke(lambda *a: {'wrong': True}, bad, 'task', schema, {'x': 1}, context)
    assert any(r['state'] == 'indeterminate' for r in ledger.values())
    with pytest.raises(Exception):
        b.invoke(provider, bad, 'task', schema, {'x': 1}, context)
    assert len(calls) == 1


def test_fifth_context_retains_completed_four_rounds(bridge_module, monkeypatch):
    m = bridge_module
    monkeypatch.setitem(sys.modules, 'review_workflow', SimpleNamespace(sha=lambda p: 'a' * 64))
    monkeypatch.setitem(sys.modules, 'course_loop_intervention', SimpleNamespace(extension=lambda w: True))
    worker = SimpleNamespace(
        request={
            'id': 'original',
            'project': {
                'id': 'test'},
            'unit': 'LU01',
            'policy': 'b' * 64},
        state={
            'loop_round': 4,
            'producer_calls': 4,
            'review_calls': 8},
        path='request',
        check=lambda: None)
    before = m.worker_context(worker, Path('root-cause-1'))
    worker.state.update(fifth_started=True, producer_calls=5, intervention={'sha256': 'c' * 64})
    after = m.worker_context(worker, Path('producer-5'))
    assert before['counters']['rounds_completed'] == after['counters']['rounds_completed'] == 4
