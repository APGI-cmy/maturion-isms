"""Exact explicit-owner exception; default limits and human sign-off remain intact."""
import copy
import json
from pathlib import Path
import pytest
from fastapi import HTTPException
from tests import test_course_creator_controller as base_controller
from services.course_creator_controller import Command, fifth_valid

setup_controller = base_controller.setup_controller


@pytest.fixture
def owner_recovery(setup_controller):
    task, ledger, send = setup_controller
    case = json.loads((Path(__file__).resolve().parent.parent /
                       'course_creator/owner-recovery-authorizations.json').read_text())['cases'][0]
    for name in ('tenant_id', 'user_id', 'project_id', 'unit_id', 'chain_id', 'parent_sha256', 'qa_sha256'):
        task[name] = case[name]
    ledger.registration.update({k: case[k] for k in ('tenant_id', 'user_id', 'project_id')})
    ledger.registration['controller_assurance_ref'] = 'urn:apgi:independent-assurance:sha256:' + 'b' * 64
    task['counters'].update(rounds_completed=4, producer_calls=5, review_calls=4, research_calls=0)
    task['fifth_evidence'] = {
        'classification': 'owner_authorised_recovery', 'allow_fifth': True,
        'verified_by_existing_controller': True, 'original_round': 4, 'maximum_round': 5,
        'owner_authority_sha256': case['authority_sha256'], 'receipt_sha256': case['authority_sha256'],
        'job_id': case['job_id'], 'original_request_sha256': case['original_request_sha256'],
        'original_candidate_sha256': case['original_candidate_sha256'], 'repair_assurance_sha256': 'b' * 64}
    return task, ledger, send


def test_exact_registered_owner_case_can_reserve_fifth(owner_recovery):
    task, ledger, send = owner_recovery
    assert fifth_valid(Command(**task), ledger.registration)
    assert send(task)['execute']
    assert send(task)['execute'] is False


@pytest.mark.parametrize('key', ['tenant_id', 'user_id', 'project_id',
                         'unit_id', 'chain_id', 'parent_sha256', 'qa_sha256'])
def test_other_scope_parent_or_policy_cannot_reuse_case(owner_recovery, key):
    task, ledger, send = owner_recovery
    bad = copy.deepcopy(task)
    bad[key] = 'LU02' if key == 'unit_id' else 'c' * 64 if key.endswith('sha256') else 'another'
    with pytest.raises(HTTPException):
        send(bad)
    assert not ledger.rows


@pytest.mark.parametrize('key', ['owner_authority_sha256', 'receipt_sha256', 'job_id',
                         'original_request_sha256', 'original_candidate_sha256', 'repair_assurance_sha256'])
def test_fabricated_authority_or_repair_receipt_is_denied(owner_recovery, key):
    task, ledger, send = owner_recovery
    bad = copy.deepcopy(task)
    bad['fifth_evidence'][key] = 'c' * 64
    with pytest.raises(HTTPException):
        send(bad)
    assert not ledger.rows


@pytest.mark.parametrize('change', [{'rounds_completed': 5}, {'producer_calls': 6},
                         {'producer_calls': 4}, {'review_calls': 3}, {'research_calls': 1}])
def test_no_sixth_or_counter_disguise(owner_recovery, change):
    task, ledger, send = owner_recovery
    bad = copy.deepcopy(task)
    bad['counters'].update(change)
    with pytest.raises(HTTPException):
        send(bad)
    assert not ledger.rows


def test_owner_case_never_creates_QA_pass_or_signature(owner_recovery):
    task, ledger, send = owner_recovery
    for key in ('owner_approved', 'change_QA_suite'):
        bad = copy.deepcopy(task)
        bad[key] = True
        with pytest.raises(HTTPException):
            send(bad)
    assert not ledger.rows


def test_research_or_new_design_phase_cannot_disguise_final_correction(owner_recovery):
    task, ledger, send = owner_recovery
    for phase in ('research', 'design', 'reconciliation', 'diagnosis'):
        bad = copy.deepcopy(task)
        bad['phase'] = phase
        with pytest.raises(HTTPException):
            send(bad)
    assert not ledger.rows


def test_registered_owner_chain_cannot_downgrade_to_natural_or_absent_authority(owner_recovery):
    task, ledger, send = owner_recovery
    downgraded = {
        'classification': 'natural_evolution', 'allow_fifth': True,
        'verified_by_existing_controller': True, 'original_round': 4,
        'admin_loop': False, 'receipt_sha256': 'd' * 64}
    for evidence in (None, downgraded):
        bad = copy.deepcopy(task)
        bad['fifth_evidence'] = evidence
        for phase in ('producer', 'design', 'reviewer'):
            bad['phase'] = phase
            with pytest.raises(HTTPException):
                send(bad)
    assert not ledger.rows
