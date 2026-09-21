'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { buildInjectionDecision } = require('./iaa-prebrief-inject');

test('final PASS / CS2 review suppresses redundant pre-brief injection', () => {
  const decision = buildInjectionDecision({
    checkpointFields: {
      ACTIVE_STATE_NEXT_REQUIRED_ACTION: 'CS2_REVIEW',
      PR_MANIFEST_STATUS: 'IAA_FINAL_PASS_CS2_REVIEW',
      WAVE_TASKS_STATUS: 'IAA_FINAL_PASS_CS2_REVIEW',
      IAA_FINAL_ASSURANCE_PRESENT: 'yes',
      IAA_TOKEN_PRESENT: 'yes',
      IAA_TOKEN_PENDING: 'no',
      MERGE_CONFLICT_CHECKED: 'yes',
      MERGEABLE_WITH_BASE: 'yes',
      BASE_SYNCED_OR_CONFLICTS_RESOLVED: 'yes',
      ACTIVE_PR_IDENTITY_BINDING: 'PASS',
      SCOPE_CURRENT: 'yes',
      STALE_EVIDENCE_FOUND: 'no',
      ACTIVE_ARTIFACTS_REPORT_FAIL_OR_NO: 'no',
      IAA_ARTIFACT_CURRENT: 'yes',
      ECAP_CURRENT_HEAD_SHA_MATCH: 'yes',
      OUT_OF_SANDBOX_OR_GOVERNANCE_BLOCKER: 'none',
    },
  });

  assert.equal(decision.outcome, 'SUPPRESS_TERMINAL');
  assert.equal(decision.suppressPrebriefRequest, true);
  assert.equal(decision.terminalState.effectiveCs2Review, true);
});

test('final PASS plus failed check becomes STOP_AND_FIX_NO_INJECTION', () => {
  const decision = buildInjectionDecision({
    checkpointFields: {
      ACTIVE_STATE_NEXT_REQUIRED_ACTION: 'CS2_REVIEW',
      PR_MANIFEST_STATUS: 'IAA_FINAL_PASS_CS2_REVIEW',
      WAVE_TASKS_STATUS: 'IAA_FINAL_PASS_CS2_REVIEW',
      IAA_FINAL_ASSURANCE_PRESENT: 'yes',
      IAA_TOKEN_PRESENT: 'yes',
      IAA_TOKEN_PENDING: 'no',
      FAILING_CHECKS: 'preflight/delegation-order-gate',
      MERGE_CONFLICT_CHECKED: 'yes',
      MERGEABLE_WITH_BASE: 'yes',
      BASE_SYNCED_OR_CONFLICTS_RESOLVED: 'yes',
    },
  });

  assert.equal(decision.outcome, 'STOP_AND_FIX_NO_INJECTION');
  assert.equal(decision.suppressPrebriefRequest, false);
  assert.equal(decision.terminalState.superseded, true);
  assert.match(decision.reason, /failing checks/i);
});

test('final PASS plus pending or missing required checks becomes STOP_AND_FIX_NO_INJECTION', () => {
  const pendingDecision = buildInjectionDecision({
    checkpointFields: {
      ACTIVE_STATE_NEXT_REQUIRED_ACTION: 'CS2_REVIEW',
      PR_MANIFEST_STATUS: 'IAA_FINAL_PASS_CS2_REVIEW',
      WAVE_TASKS_STATUS: 'IAA_FINAL_PASS_CS2_REVIEW',
      IAA_FINAL_ASSURANCE_PRESENT: 'yes',
      IAA_TOKEN_PRESENT: 'yes',
      IAA_TOKEN_PENDING: 'no',
      PENDING_CHECKS: 'preflight/scope-declaration-parity',
      MERGE_CONFLICT_CHECKED: 'yes',
      MERGEABLE_WITH_BASE: 'yes',
      BASE_SYNCED_OR_CONFLICTS_RESOLVED: 'yes',
    },
  });
  assert.equal(pendingDecision.outcome, 'STOP_AND_FIX_NO_INJECTION');
  assert.match(pendingDecision.reason, /pending checks/i);

  const missingDecision = buildInjectionDecision({
    checkpointFields: {
      ACTIVE_STATE_NEXT_REQUIRED_ACTION: 'CS2_REVIEW',
      PR_MANIFEST_STATUS: 'IAA_FINAL_PASS_CS2_REVIEW',
      WAVE_TASKS_STATUS: 'IAA_FINAL_PASS_CS2_REVIEW',
      IAA_FINAL_ASSURANCE_PRESENT: 'yes',
      IAA_TOKEN_PRESENT: 'yes',
      IAA_TOKEN_PENDING: 'no',
      MISSING_CHECKS: 'preflight/delegation-order-gate',
      MERGE_CONFLICT_CHECKED: 'yes',
      MERGEABLE_WITH_BASE: 'yes',
      BASE_SYNCED_OR_CONFLICTS_RESOLVED: 'yes',
    },
  });
  assert.equal(missingDecision.outcome, 'STOP_AND_FIX_NO_INJECTION');
  assert.match(missingDecision.reason, /missing checks/i);
});

test('final PASS plus unresolved merge/base conflict becomes STOP_AND_FIX_NO_INJECTION', () => {
  const decision = buildInjectionDecision({
    checkpointFields: {
      ACTIVE_STATE_NEXT_REQUIRED_ACTION: 'CS2_REVIEW',
      PR_MANIFEST_STATUS: 'IAA_FINAL_PASS_CS2_REVIEW',
      WAVE_TASKS_STATUS: 'IAA_FINAL_PASS_CS2_REVIEW',
      IAA_FINAL_ASSURANCE_PRESENT: 'yes',
      IAA_TOKEN_PRESENT: 'yes',
      IAA_TOKEN_PENDING: 'no',
      MERGE_CONFLICT_CHECKED: 'yes',
      MERGEABLE_WITH_BASE: 'no',
      BASE_SYNCED_OR_CONFLICTS_RESOLVED: 'no',
    },
  });

  assert.equal(decision.outcome, 'STOP_AND_FIX_NO_INJECTION');
  assert.match(decision.reason, /merge conflicts with base unresolved/i);
});

test('ordinary incomplete state still requests canonical pre-brief', () => {
  const decision = buildInjectionDecision({
    taskText: [
      'PR: #2049',
      'Issue: #2047',
      'Status: PRE_BRIEF_ONLY',
    ].join('\n'),
    activeState: {
      pr: 2049,
      next_required_action: 'IAA_PREBRIEF',
      substantive_delta_after_evidence: false,
    },
    manifest: {
      pr: 2049,
      status: 'PRE_BRIEF_ONLY',
    },
    iaaArtifactText: '',
  });

  assert.equal(decision.outcome, 'REQUEST_PREBRIEF');
  assert.equal(decision.suppressPrebriefRequest, false);
  assert.equal(decision.terminalState.declaredFinalPass, false);
});
