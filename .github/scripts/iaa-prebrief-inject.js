#!/usr/bin/env node

const {
  evaluateFinalPassCs2ReviewState,
  evaluateFinalPassCs2ReviewStateFromFields,
} = require('./final-pass-cs2-review');

function readSimpleField(text, label) {
  const regex = new RegExp(`^[ \\t>*-]*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*(.+)$`, 'im');
  const match = String(text || '').match(regex);
  return match ? match[1].trim() : '';
}

function parseWaveStatus(taskText) {
  return readSimpleField(taskText, 'Status');
}

function buildInjectionDecision(input = {}) {
  const taskText = String(input.taskText || '');
  const activeState = input.activeState || {};
  const manifest = input.manifest || {};
  const iaaArtifactText = String(input.iaaArtifactText || '');
  const checkpointFields = input.checkpointFields || null;
  const terminalState = checkpointFields
    ? evaluateFinalPassCs2ReviewStateFromFields(checkpointFields)
    : evaluateFinalPassCs2ReviewState({
      nextRequiredAction: activeState.next_required_action,
      manifestStatus: manifest.status,
      waveTasksStatus: parseWaveStatus(taskText),
      finalAssurancePresent: /## TOKEN|PHASE_B_BLOCKING_TOKEN\s*:/i.test(iaaArtifactText),
      tokenPresent: /PHASE_B_BLOCKING_TOKEN\s*:\s*(?!PENDING\b)\S+/i.test(iaaArtifactText),
      tokenPending: /PHASE_B_BLOCKING_TOKEN\s*:\s*PENDING\b/i.test(iaaArtifactText),
      substantiveDeltaAfterEvidence: activeState.substantive_delta_after_evidence === true,
      invalidatedEvidence: /SUPERSEDED:\s*yes\b/i.test(iaaArtifactText),
    });

  let outcome = 'REQUEST_PREBRIEF';
  let reason = 'PR-scoped final PASS / CS2-review-only state is not currently effective.';
  if (terminalState.effectiveCs2Review) {
    outcome = 'SUPPRESS_TERMINAL';
    reason = 'Final IAA PASS is already recorded for this PR-scoped state; suppress redundant pre-brief injection.';
  } else if (terminalState.superseded) {
    outcome = 'STOP_AND_FIX_NO_INJECTION';
    reason = `Recorded final PASS is superseded by current blocker(s): ${terminalState.blockers.join('; ')}`;
  }

  return {
    outcome,
    suppressPrebriefRequest: outcome === 'SUPPRESS_TERMINAL',
    terminalState,
    reason,
  };
}

module.exports = {
  buildInjectionDecision,
  parseWaveStatus,
  readSimpleField,
};
