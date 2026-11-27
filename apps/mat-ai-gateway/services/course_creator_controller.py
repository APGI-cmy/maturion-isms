"""Maturion delegates typed invocations to the existing local Course Creator controller.

This service authorises/records execution; the approved local Codex adapter runs it.
It cannot change course QA, run arbitrary commands, sign off or clear a held job.
"""
from __future__ import annotations

import json
from typing import Literal
from uuid import UUID
from pathlib import Path
import re

from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict, Field
from services.course_creator_runtime import Ledger, authenticate, digest, knowledge

PATH = '/api/v1/course-creator/controller'
SHA = r'^[a-f0-9]{64}$'


class Counters(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    rounds_completed: int = Field(ge=0, le=5)
    producer_calls: int = Field(ge=0, le=5)
    review_calls: int = Field(ge=0, le=10)
    research_calls: int = Field(ge=0, le=2)


class Command(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    request_id: str
    invocation_id: str
    app: Literal['course-creator']
    orchestrator: Literal['maturion-agent']
    specialist: Literal['course-creator-agent']
    tenant_id: str = Field(min_length=1, max_length=100)
    user_id: str = Field(min_length=1, max_length=100)
    project_id: str = Field(min_length=1, max_length=100)
    unit_id: str = Field(pattern=r'^(COURSE|LU(0[1-9]|1[0-9]|20))$')
    operation: Literal['capability', 'reserve', 'return', 'handover']
    phase: Literal['research', 'producer', 'reviewer', 'correction',
                   'duplication', 'diagnosis', 'design', 'reconciliation']
    provider: Literal['codex-chatgpt-local']
    chain_id: str = Field(min_length=1, max_length=180)
    parent_sha256: str = Field(pattern=SHA)
    qa_sha256: str = Field(pattern=SHA)
    payload_sha256: str = Field(pattern=SHA)
    schema_sha256: str = Field(pattern=SHA)
    instructions_sha256: str = Field(pattern=SHA)
    bundle_sha256: str = Field(pattern=SHA)
    candidate_sha256: str | None = Field(default=None, pattern=SHA)
    controller_checked: Literal[True]
    owner_approved: Literal[False]
    change_QA_suite: Literal[False]
    commissioning: bool = False
    counters: Counters
    fifth_evidence: dict | None = None
    invocation_sha256: str | None = Field(default=None, pattern=SHA)
    output_sha256: str | None = Field(default=None, pattern=SHA)
    outcome: Literal['completed', 'indeterminate'] | None = None
    result: dict | None = None


def owner_recovery_cases():
    try:
        return json.loads((Path(__file__).resolve().parent.parent / 'course_creator' /
                           'owner-recovery-authorizations.json').read_text(encoding='utf-8'))['cases']
    except (OSError, ValueError, KeyError) as exc:
        raise HTTPException(503, 'Owner recovery registration is unavailable') from exc


def registered_owner_chain(task):
    return any(all(case.get(k) == getattr(task, k) for k in
                   ('tenant_id', 'user_id', 'project_id', 'chain_id'))
               for case in owner_recovery_cases())


def fifth_valid(task, registration=None):
    e = task.fifth_evidence or {}
    if registered_owner_chain(task) and e.get('classification') != 'owner_authorised_recovery':
        return False
    if e.get('classification') == 'owner_authorised_recovery':
        if (task.commissioning or e.get('allow_fifth') is not True
                or e.get('verified_by_existing_controller') is not True
                or e.get('original_round') != 4 or e.get('maximum_round') != 5
                or task.counters.rounds_completed != 4 or task.counters.producer_calls != 5
                or task.counters.review_calls < 4 or task.counters.research_calls != 0
                or task.phase not in ('producer', 'correction', 'duplication', 'reviewer')):
            return False
        assurance = (registration or {}).get('controller_assurance_ref', '')
        repair = e.get('repair_assurance_sha256', '')
        if not re.fullmatch(SHA, repair) or assurance != 'urn:apgi:independent-assurance:sha256:' + repair:
            return False
        for case in owner_recovery_cases():
            exact = all(case.get(k) == getattr(task, k) for k in
                        ('tenant_id', 'user_id', 'project_id', 'unit_id', 'chain_id',
                         'parent_sha256', 'qa_sha256'))
            if (exact and e.get('owner_authority_sha256') == case['authority_sha256']
                    and e.get('receipt_sha256') == case['authority_sha256']
                    and e.get('job_id') == case['job_id']
                    and e.get('original_request_sha256') == case['original_request_sha256']
                    and e.get('original_candidate_sha256') == case['original_candidate_sha256']
                    and case['original_round'] == 4 and case['maximum_round'] == 5):
                return True
        return False
    return (e.get('classification') == 'natural_evolution' and e.get('allow_fifth') is True
            and e.get('verified_by_existing_controller') is True and e.get('original_round') == 4
            and e.get('admin_loop') is False and isinstance(e.get('receipt_sha256'), str)
            and len(e['receipt_sha256']) == 64)


def controller(raw, headers, ledger=None):
    if len(raw) > 32000:
        raise HTTPException(413, 'Controller receipt is too large')
    try:
        task = Command.model_validate_json(raw)
        UUID(task.invocation_id)
        UUID(task.request_id)
    except Exception as exc:
        raise HTTPException(422, 'Invalid typed controller delegation') from exc
    ledger = ledger or Ledger()
    client = authenticate(headers, raw, task, ledger, path=PATH, purpose='controller')
    _, bundle = knowledge()
    if task.bundle_sha256 != bundle:
        raise HTTPException(409, 'Agent knowledge version requires affected-version acceptance')
    if (task.operation != 'capability' and registered_owner_chain(task)
            and not fifth_valid(task, ledger.client(client))):
        raise HTTPException(409, 'This owner-recovery chain cannot change authority or classification')
    if task.operation == 'capability':
        registration = ledger.client(client)
        return {'specialist': 'course-creator-agent', 'orchestrator': 'maturion-agent',
                'provider': task.provider, 'bundle_sha256': bundle,
                'controller_enabled': registration.get('controller_enabled', False),
                'assurance_ref': registration.get('controller_assurance_ref'),
                'scope': 'Existing course controller; unchanged QA, finite loops and human sign-off',
                'allowed_units': registration.get('allowed_unit_ids', [])}
    if task.operation == 'handover':
        result = task.result or {}
        required = ('complete_rendered', 'mandatory_QA_passed', 'duplication_passed', 'current_inputs_verified')
        if not all(result.get(k) is True for k in required) or result.get('owner_approved') is not False:
            raise HTTPException(409, 'Incomplete/failed QA or rendering prevents owner handover')
        refs = result.get('artifacts', {})
        if not all(isinstance(refs.get(k), str) and len(refs[k]) == 64 for k in ('manual', 'QA', 'duplication')):
            raise HTTPException(422, 'Exact complete artifact and QA receipts are required')
        review = ledger.request('GET',
                                '/cc_controller_invocations',
                                params={'client_id': 'eq.' + client,
                                        'invocation_id': 'eq.' + str(result.get('review_invocation_id')),
                                        'select': '*'})
        if len(review) != 1 or review[0]['state'] != 'completed' or review[0]['chain_id'] != task.chain_id:
            raise HTTPException(409, 'A completed independent Maturion review is required')
        if review[0]['binding']['phase'] != 'reviewer':
            raise HTTPException(409, 'Producer output cannot attest independent review')
        if any(review[0]['binding'].get(k) != getattr(task, k)
               for k in ('project_id', 'unit_id', 'parent_sha256', 'qa_sha256', 'bundle_sha256', 'commissioning')):
            raise HTTPException(409, 'Final review does not bind the current parent, scope and requirements')
        if not review[0].get('output_sha256'):
            raise HTTPException(409, 'Final review has no saved validated output')
        provenance = result.get('review_provenance', {})
        expected = {'review_invocation_id': result['review_invocation_id'],
                    'review_input_payload_sha256': review[0]['binding']['payload_sha256'],
                    'raw_review_output_sha256': review[0]['output_sha256'],
                    'reviewed_candidate_sha256': refs['manual'],
                    'assembled_QA_sha256': refs['QA'], 'duplication_sha256': refs['duplication'],
                    'assembly_method': 'existing_validated_report_and_retained_freeze'}
        if review[0]['binding'].get('candidate_sha256') != refs['manual'] or any(
                provenance.get(k) != v for k, v in expected.items()):
            raise HTTPException(409, 'Final artifact/QA assembly does not trace to the exact independent review')
        if len(provenance.get('assembly_evidence_sha256', '')) != 64:
            raise HTTPException(409, 'Saved report assembly evidence is required')
        acceptance = {'schema': 'maturion-course-handover/1', 'return_to': 'maturion-agent',
                      'invocation_id': task.invocation_id, 'chain_id': task.chain_id,
                      'project_id': task.project_id, 'unit_id': task.unit_id, 'artifacts': refs,
                      'QA_sha256': task.qa_sha256, 'owner_review_ready': True, 'owner_approved': False,
                      'message': ('The complete rendered work and its independent QA evidence are ready '
                                  'for your review and electronic sign-off.'),
                      'scope': ('Controller evidence verification and synthesis; '
                                'no repeated pedagogical QA or automatic signature.')}
        reserved = ledger.request('POST', '/rpc/cc_controller_reserve', json={
            'p_client': client, 'p_task': task.model_dump(exclude_none=True), 'p_hash': digest(raw)})
        if not reserved.get('execute'):
            if reserved.get('state') == 'completed':
                return reserved['result']
            raise HTTPException(409, 'This handover is already reserved; reconcile its saved result')
        ledger.request('POST', '/rpc/cc_controller_return', json={
            'p_client': client, 'p_id': task.invocation_id, 'p_hash': digest(raw),
            'p_output': digest(json.dumps(acceptance, sort_keys=True).encode()),
            'p_result': acceptance, 'p_state': 'completed'})
        return acceptance
    counters = task.counters
    if task.operation == 'reserve':
        if counters.rounds_completed >= 5:
            raise HTTPException(409, 'Finite-loop limit or missing verified fifth-round authority')
        if (counters.producer_calls == 5 or counters.review_calls > 8) and not fifth_valid(task, ledger.client(client)):
            raise HTTPException(409, 'Verified fifth-round authority is required')
    if task.operation == 'reserve':
        if counters.rounds_completed >= 4 and task.phase in (
                'producer', 'correction') and not fifth_valid(task, ledger.client(client)):
            raise HTTPException(409, 'Four-round stop: independent root-cause decision required')
        value = task.model_dump(exclude_none=True)
        return ledger.request('POST', '/rpc/cc_controller_reserve', json={
            'p_client': client, 'p_task': value, 'p_hash': digest(raw)})
    if not task.invocation_sha256 or not task.outcome:
        raise HTTPException(422, 'A return must identify its exact reserved invocation')
    prior = ledger.request('GET', '/cc_controller_invocations', params={
        'client_id': 'eq.' + client, 'invocation_id': 'eq.' + task.invocation_id, 'select': '*'})
    if len(prior) != 1 or prior[0]['request_sha256'] != task.invocation_sha256:
        raise HTTPException(409, 'Unrecognised reserved invocation')
    original = prior[0]['binding']
    actual = task.model_dump(exclude_none=True)
    fields = ('project_id', 'unit_id', 'phase', 'chain_id', 'parent_sha256', 'qa_sha256', 'payload_sha256',
              'schema_sha256', 'instructions_sha256', 'bundle_sha256', 'counters', 'provider', 'orchestrator',
              'specialist', 'commissioning', 'candidate_sha256')
    if any(original.get(k) != actual.get(k) for k in fields):
        raise HTTPException(409, 'Return schema, role, parent or evidence differs from its reservation')
    if task.outcome == 'completed' and not task.output_sha256:
        raise HTTPException(422, 'Completed return requires verified saved output')
    return ledger.request('POST', '/rpc/cc_controller_return', json={
        'p_client': client, 'p_id': task.invocation_id, 'p_hash': task.invocation_sha256,
        'p_output': task.output_sha256, 'p_result': task.result or {}, 'p_state': task.outcome})
