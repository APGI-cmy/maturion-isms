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
  const result = String(fields.RESULT || '').toUpperCase();
  const advisoryUnavailable = String(fields.ADVISORY_UNAVAILABLE || '').toLowerCase();
  const stopAndFix = result === 'STOP_AND_FIX';
  const gray = advisoryUnavailable === 'github_api_rate_limited' || result === 'ADVISORY_UNAVAILABLE';
  const amber = !gray && !stopAndFix && !clean;
  const status = clean ? 'yes' : 'no';

  const header = gray
    ? '# ⚪ ADVISORY UNAVAILABLE — GITHUB API RATE LIMIT'
    : stopAndFix
      ? '# 🛑 STOP — DO NOT CONTINUE TO HANDOVER'
      : clean
        ? '# ✅ GREEN — current head guidance is clean'
        : '# 🟠 AMBER — guidance pending / waiting';

  const lines = [STICKY_MARKER, header, '', `@copilot — trusted current-head guidance for PR #${prNumber} (\`${shortSha}...\`).`, ''];

  if (gray) {
    lines.push(
      'ADVISORY_UNAVAILABLE: github_api_rate_limited',
      'INFRASTRUCTURE_RERUN_NEEDED: yes',
      'PR_DEFECT_INFERRED: no',
      '',
      'GitHub API rate limiting prevented reliable advisory read/write checks. Re-run this workflow after rate limits reset.',
      'This is infrastructure rerun-needed noise, not a product/governance defect inference.',
    );
    return lines.join('\n');
  }

  if (stopAndFix) {
    lines.push(
      'STOP_AND_FIX: yes',
      'HANDOVER_ALLOWED: no',
      'FINAL_SUMMARY_ALLOWED: no',
      'READY_FOR_REVIEW_ALLOWED: no',
      `NEXT_REQUIRED_CONTROL: ${nextRequiredControl}`,
      '',
      'You must stop implementation/handover activity and fix the listed blocker before posting any final summary, ready-for-review claim, merge-ready claim, or handover message.',
      '',
      'Current blocker:',
      `- ${String(fields.REASON || `Control \`${nextRequiredControl}\` is still blocking.`).trim()}`,
      '',
      'Required next action:',
      `1. ${nextActionSentence(nextRequiredControl)}`,
      '2. Do not regenerate unrelated evidence.',
      '3. Rerun current-head preflight/checkpoint after the targeted fix.',
      '4. Only after green current-head checks, run `/prepare-handover`.',
      '',
      `CURRENT_HEAD_CHECKS: ${checksSummary}`,
      `CHECKPOINT_RESULT: ${String(fields.RESULT || 'unknown')}`,
    );
    return lines.join('\n');
  }

  lines.push(
    `FINAL_SUMMARY_ALLOWED: ${status}`,
    `READY_FOR_REVIEW_ALLOWED: ${status}`,
    `HANDOVER_CLAIM_ALLOWED: ${status}`,
    `NEXT_REQUIRED_CONTROL: ${nextRequiredControl}`,
    `INJECTION_STATE: ${String(fields.INJECTION_STATE || 'unknown')}`,
    `CURRENT_HEAD_CHECKS: ${checksSummary}`,
    `CHECKPOINT_RESULT: ${String(fields.RESULT || 'unknown')}`,
    '',
    clean
      ? '✅ Current-head checks and producer-side controls are clean.'
      : amber
        ? `Waiting on pending checks/data. ${nextActionSentence(nextRequiredControl)}`
        : `Not yet clean. ${nextActionSentence(nextRequiredControl)}`,
    'Before any final summary, ready for review, handover, or merge-ready claim, comment `/prepare-handover` and wait for the refreshed `PRE_HANDOVER_CHECKPOINT_RESULT` on the current HEAD.',
  );

  if (amber && String(fields.REASON || '').trim()) lines.push(`Current status: ${String(fields.REASON).trim()}`);

  return lines.join('\n');
}

module.exports = {
  STICKY_MARKER,
  summarizeChecks,
  isCleanState,
  renderGuidanceComment,
};
