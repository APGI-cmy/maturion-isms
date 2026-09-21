'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { buildInjectionDecision } = require('./iaa-prebrief-inject');

test('final PASS / CS2 review suppresses redundant pre-brief injection', () => {
  const decision = buildInjectionDecision({
    taskText: [
      'PR: #2049',
      'Issue: #2047',
      'Status: IAA_FINAL_PASS_CS2_REVIEW',
    ].join('\n'),
    activeState: {
      pr: 2049,
      next_required_action: 'CS2_REVIEW',
      substantive_delta_after_evidence: false,
    },
    manifest: {
      pr: 2049,
      status: 'IAA_FINAL_PASS_CS2_REVIEW',
    },
    iaaArtifactText: [
      'PR: #2049',
      'CURRENT_HEAD_SHA: CURRENT_HEAD',
      '## TOKEN',
      'PHASE_B_BLOCKING_TOKEN: IAA-session-1291-20260921-PASS',
    ].join('\n'),
  });

  assert.equal(decision.suppressPrebriefRequest, true);
  assert.equal(decision.terminalState.effectiveCs2Review, true);
});

test('substantive delta after evidence prevents terminal-state suppression', () => {
  const decision = buildInjectionDecision({
    taskText: [
      'PR: #2049',
      'Issue: #2047',
      'Status: IAA_FINAL_PASS_CS2_REVIEW',
    ].join('\n'),
    activeState: {
      pr: 2049,
      next_required_action: 'CS2_REVIEW',
      substantive_delta_after_evidence: true,
    },
    manifest: {
      pr: 2049,
      status: 'IAA_FINAL_PASS_CS2_REVIEW',
    },
    iaaArtifactText: [
      'PR: #2049',
      'CURRENT_HEAD_SHA: CURRENT_HEAD',
      '## TOKEN',
      'PHASE_B_BLOCKING_TOKEN: IAA-session-1291-20260921-PASS',
    ].join('\n'),
  });

  assert.equal(decision.suppressPrebriefRequest, false);
  assert.equal(decision.terminalState.superseded, true);
  assert.match(decision.reason, /superseded/i);
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

  assert.equal(decision.suppressPrebriefRequest, false);
  assert.equal(decision.terminalState.declaredFinalPass, false);
});
