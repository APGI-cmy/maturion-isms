"""The approved composition uses one existing handover reservation, with no AI call."""
from copy import deepcopy
import json
import pytest
from fastapi import HTTPException
from services import course_creator_controller as cc


@pytest.fixture
def handover(monkeypatch):
    case = json.loads(cc.F06_CASE.read_text(encoding='utf-8'))
    task = case['task']
    monkeypatch.setattr(cc, 'authenticate', lambda *_args, **_kwargs: case['client_id'])
    monkeypatch.setattr(cc, 'knowledge', lambda: ('', task['bundle_sha256']))

    class Ledger:
        def __init__(self):
            self.rows = {case[name]['invocation_id']: {**deepcopy(case[name]), 'chain_id': task['chain_id']}
                         for name in ('review', 'duplication_review')}
            self.reservations = 0

        def request(self, method, path, **kwargs):
            if method == 'GET':
                row = self.rows.get(kwargs['params']['invocation_id'][3:])
                return [row] if row else []
            args = kwargs['json']
            invocation = task['invocation_id']
            if path == '/rpc/cc_controller_reserve_lu1_continuation':
                assert args['p_task']['counters'] == task['counters']
                if invocation in self.rows:
                    return {'execute': False, **self.rows[invocation]}
                self.reservations += 1
                self.rows[invocation] = {'state': 'reserved'}
                return {'execute': True}
            assert path == '/rpc/cc_controller_return'
            assert args['p_id'] == invocation
            self.rows[invocation].update(state='completed', result=args['p_result'])
            return {'accepted': True}

    ledger = Ledger()
    def send(value):
        return cc.controller(json.dumps(value).encode(), {}, ledger)
    return case, ledger, send


def test_complete_and_replay_exact_handover(handover):
    case, ledger, send = handover
    receipt = send(case['task'])
    assert receipt['owner_review_ready'] and not receipt['owner_approved']
    assert receipt['counters'] == case['task']['counters']
    assert receipt['review_provenance'] == case['task']['result']['review_provenance']
    assert send(case['task']) == receipt
    assert ledger.reservations == 1


def test_resume_only_exact_reserved_handover(handover):
    case, ledger, send = handover
    ledger.rows[case['task']['invocation_id']] = {'state': 'reserved'}
    assert send(case['task'])['owner_review_ready']
    assert ledger.reservations == 0


@pytest.mark.parametrize('damage', ['other_unit', 'counter', 'paper', 'manual', 'duplication', 'prior_output', 'role'])
def test_changed_evidence_cannot_reserve(handover, damage):
    case, ledger, send = handover
    task = deepcopy(case['task'])
    if damage == 'other_unit':
        task['unit_id'] = 'LU02'
    elif damage == 'counter':
        task['counters']['review_calls'] = 15
    elif damage == 'paper':
        task['result']['review_provenance']['targeted_f06_sha256'] = '0' * 64
    elif damage == 'manual':
        task['candidate_sha256'] = task['result']['artifacts']['manual'] = '0' * 64
    elif damage == 'duplication':
        ledger.rows.pop(case['duplication_review']['invocation_id'])
    elif damage == 'prior_output':
        ledger.rows[case['review']['invocation_id']]['output_sha256'] = '0' * 64
    elif damage == 'role':
        task['phase'] = 'producer'
    with pytest.raises(HTTPException):
        send(task)
    assert ledger.reservations == 0

