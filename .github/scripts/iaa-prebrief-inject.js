#!/usr/bin/env node

const { evaluateFinalPassCs2ReviewState } = require('./final-pass-cs2-review');

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
  const terminalState = evaluateFinalPassCs2ReviewState({
    nextRequiredAction: activeState.next_required_action,
    manifestStatus: manifest.status,
    waveTasksStatus: parseWaveStatus(taskText),
    finalAssurancePresent: /## TOKEN|PHASE_B_BLOCKING_TOKEN\s*:/i.test(iaaArtifactText),
    tokenPresent: /PHASE_B_BLOCKING_TOKEN\s*:\s*(?!PENDING\b)\S+/i.test(iaaArtifactText),
    tokenPending: /PHASE_B_BLOCKING_TOKEN\s*:\s*PENDING\b/i.test(iaaArtifactText),
    substantiveDeltaAfterEvidence: activeState.substantive_delta_after_evidence === true,
    invalidatedEvidence: /SUPERSEDED:\s*yes\b/i.test(iaaArtifactText),
  });

  return {
    suppressPrebriefRequest: terminalState.effectiveCs2Review,
    terminalState,
    reason: terminalState.effectiveCs2Review
      ? 'Final IAA PASS is already recorded for this PR-scoped state; suppress redundant pre-brief injection.'
      : (
        terminalState.superseded
          ? `Recorded final PASS is superseded by current blocker(s): ${terminalState.blockers.join('; ')}`
          : 'PR-scoped final PASS / CS2-review-only state is not currently effective.'
      ),
  };
}

module.exports = {
  buildInjectionDecision,
  parseWaveStatus,
  readSimpleField,
};
