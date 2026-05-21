#!/usr/bin/env node

const STICKY_MARKER = '<!-- producer-next-action-shortfall -->';

const NEXT_ACTION_GUIDANCE = {
  REFRESH_INJECTION_INTAKE: 'Comment `/prepare-handover` again after the latest push or instruction change to refresh the trusted current-head intake.',
  RESOLVE_PR_CHECKLIST_ITEMS: 'Resolve every unchecked required PR checklist item before claiming final summary, ready-for-review, or handover.',
  IAA_PREFLIGHT_BRIEFING: 'Refresh the current-head IAA prebrief / wave binding artifacts before any handover posture.',
  ECAP_GATE_AND_ADMIN_REPORT: 'Run `/prepare-handover`, then wait for the refreshed producer-side checkpoint/admin report before any handover or merge-ready claim.',
  IAA_FINAL_ASSURANCE: 'Obtain fresh IAA final assurance for the current head before any handover or merge-ready claim.',
  BUILDER_QA_FUNCTIONAL_EVIDENCE: 'Add or refresh the required builder QA / functional evidence for the current head.',
  CURRENT_HEAD_GATES_GREEN: 'Fix or wait out the current-head failing, pending, or missing checks until everything is green.',
  none: 'No blocking producer control is currently outstanding.',
};

function normalizeList(value) {
  const text = String(value || 'none').trim();
  return text || 'none';
}

function isCleanState(fields = {}) {
  return String(fields.HANDOVER_ALLOWED || '').toLowerCase() === 'yes'
    && String(fields.NEXT_REQUIRED_CONTROL || 'none').toLowerCase() === 'none'
    && normalizeList(fields.FAILING_CHECKS) === 'none'
    && normalizeList(fields.PENDING_CHECKS) === 'none'
    && normalizeList(fields.MISSING_CHECKS) === 'none';
}

function summarizeChecks(fields = {}) {
  const parts = [
    ['failing', normalizeList(fields.FAILING_CHECKS)],
    ['pending', normalizeList(fields.PENDING_CHECKS)],
    ['missing', normalizeList(fields.MISSING_CHECKS)],
  ]
    .filter(([, value]) => value !== 'none')
    .map(([label, value]) => `${label}: ${value}`);

  return parts.length > 0 ? parts.join(' | ') : 'none';
}

function nextActionSentence(nextRequiredControl) {
  return NEXT_ACTION_GUIDANCE[nextRequiredControl] || `Clear \`${nextRequiredControl}\` before any final summary, ready-for-review, handover, or merge-ready claim.`;
}

function renderGuidanceComment({ prNumber, headSha, fields = {} }) {
  const clean = isCleanState(fields);
  const nextRequiredControl = String(fields.NEXT_REQUIRED_CONTROL || 'none');
  const shortSha = String(headSha || '').slice(0, 12) || 'unknown';
  const checksSummary = summarizeChecks(fields);
  const title = clean
    ? '## ✅ Producer next action guidance — current head is clean'
    : '## ⏭️ Producer next action guidance — action still required';
  const status = clean ? 'yes' : 'no';

  const lines = [
    STICKY_MARKER,
    title,
    '',
    `@copilot — trusted current-head guidance for PR #${prNumber} (\`${shortSha}...\`).`,
    '',
    `- FINAL_SUMMARY_ALLOWED: ${status}`,
    `- READY_FOR_REVIEW_ALLOWED: ${status}`,
    `- HANDOVER_CLAIM_ALLOWED: ${status}`,
    `- NEXT_REQUIRED_CONTROL: ${nextRequiredControl}`,
    `- INJECTION_STATE: ${String(fields.INJECTION_STATE || 'unknown')}`,
    `- CURRENT_HEAD_CHECKS: ${checksSummary}`,
    `- CHECKPOINT_RESULT: ${String(fields.RESULT || 'unknown')}`,
    '',
    clean
      ? '> ✅ Current-head checks and producer-side controls are clean.'
      : `> 🚫 Not yet clean. ${nextActionSentence(nextRequiredControl)}`,
    '> Before any final summary, ready for review, handover, or merge-ready claim, comment `/prepare-handover` and wait for the refreshed `PRE_HANDOVER_CHECKPOINT_RESULT` on the current HEAD.',
  ];

  if (!clean && String(fields.REASON || '').trim()) {
    lines.push(`> Current blocker summary: ${String(fields.REASON).trim()}`);
  }

  return lines.join('\n');
}

module.exports = {
  STICKY_MARKER,
  summarizeChecks,
  isCleanState,
  renderGuidanceComment,
};
