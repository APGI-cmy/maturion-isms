#!/usr/bin/env node

const STICKY_MARKER = '<!-- post-handover-auto-remediation -->';
const MAX_REMEDIATION_CYCLES = 3;

const GOVERNANCE_CONTROL_PATTERNS = [
  /^governance\//,
  /^\.github\/workflows\//,
  /^\.github\/scripts\//,
  /^\.github\/agents\//,
];

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function isYes(value) {
  return normalize(value) === 'yes' || normalize(value) === 'true';
}

function isNone(value) {
  const normalized = normalize(value);
  return normalized === '' || normalized === 'none' || normalized === 'not_required' || normalized === 'n/a';
}

function splitList(value) {
  if (isNone(value)) return [];
  return String(value)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseStickyFields(body = '') {
  const fields = {};
  const lines = String(body).split('\n');
  for (const line of lines) {
    const match = line.match(/^([A-Z_]+):\s*(.+)$/);
    if (!match) continue;
    fields[match[1]] = match[2].trim();
  }
  return fields;
}

function parseCycle(value) {
  const match = String(value || '').match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return 0;
  return Number.parseInt(match[1], 10) || 0;
}

function hasCodeqlRateLimit(checkRuns = []) {
  return (checkRuns || []).some((run) => {
    const name = normalize(run?.name);
    if (!name.includes('codeql')) return false;
    const status = normalize(run?.status);
    const conclusion = normalize(run?.conclusion);
    if (status !== 'completed') return false;
    if (['success', 'skipped', 'neutral'].includes(conclusion)) return false;
    const text = [
      run?.output?.title,
      run?.output?.summary,
      run?.output?.text,
      run?.details_url,
    ].join(' ').toLowerCase();
    return text.includes('rate limit')
      || text.includes('secondary rate')
      || text.includes('github app installation')
      || text.includes('api limit');
  });
}

function classifyPostHandover({
  fields = {},
  changedFiles = [],
  manifest = null,
  checkRuns = [],
  advisoryUnavailable = 'none',
} = {}) {
  if (normalize(advisoryUnavailable) === 'comments_api_rate_limited') {
    return {
      handoverAccepted: false,
      readyForHumanEvaluation: false,
      failureClassification: 'ADVISORY_UNAVAILABLE',
      nextRequiredControl: 'WAIT_FOR_ADVISORY_RECOVERY',
      specificBlocker: 'PR comment history could not be read due to GitHub API rate limits.',
      infrastructureRerunNeeded: true,
    };
  }

  if (
    normalize(advisoryUnavailable).includes('rate_limited')
    || normalize(fields.ADVISORY_UNAVAILABLE).includes('rate_limited')
  ) {
    return {
      handoverAccepted: false,
      readyForHumanEvaluation: false,
      failureClassification: 'INFRASTRUCTURE_RERUN_NEEDED',
      nextRequiredControl: 'RERUN_INFRASTRUCTURE_CHECKS',
      specificBlocker: 'GitHub API rate limiting prevents a reliable current-head handover decision.',
      infrastructureRerunNeeded: true,
    };
  }

  if (hasCodeqlRateLimit(checkRuns)) {
    return {
      handoverAccepted: false,
      readyForHumanEvaluation: false,
      failureClassification: 'INFRASTRUCTURE_RERUN_NEEDED',
      nextRequiredControl: 'RERUN_INFRASTRUCTURE_CHECKS',
      specificBlocker: 'CodeQL failed due to GitHub API/app rate limiting and requires rerun.',
      infrastructureRerunNeeded: true,
    };
  }

  const failing = splitList(fields.FAILING_CHECKS);
  const pending = splitList(fields.PENDING_CHECKS);
  const missing = splitList(fields.MISSING_CHECKS);
  const requiresEcapFalse = manifest && manifest.requires_ecap === false;
  const governanceFilesChanged = (changedFiles || []).some((filePath) => GOVERNANCE_CONTROL_PATTERNS.some((pattern) => pattern.test(filePath)));

  const allGreen = isYes(fields.HANDOVER_ALLOWED)
    && normalize(fields.RESULT) === 'handover_allowed'
    && failing.length === 0
    && pending.length === 0
    && missing.length === 0
    && (!isYes(fields.IAA_REQUIRED) || isYes(fields.IAA_SATISFIED_OR_VALIDLY_WAIVED))
    && (!isYes(fields.ECAP_REQUIRED) || isYes(fields.ECAP_SATISFIED_OR_VALIDLY_WAIVED))
    && normalize(fields.ACTIVE_PR_IDENTITY_BINDING || 'pass') !== 'fail';
  if (allGreen) {
    return {
      handoverAccepted: true,
      readyForHumanEvaluation: true,
      failureClassification: 'none',
      nextRequiredControl: 'none',
      specificBlocker: 'none',
      infrastructureRerunNeeded: false,
    };
  }

  if (!manifest || (requiresEcapFalse && governanceFilesChanged)) {
    return {
      handoverAccepted: false,
      readyForHumanEvaluation: false,
      failureClassification: 'ADMIN_MANIFEST_DEFECT',
      nextRequiredControl: 'FIX_ADMIN_MANIFEST',
      specificBlocker: !manifest
        ? 'PR admin manifest is missing or unreadable for the current head.'
        : 'Manifest sets requires_ecap=false while governance/control files changed.',
      infrastructureRerunNeeded: false,
    };
  }

  if (
    normalize(fields.ACTIVE_PR_IDENTITY_BINDING) === 'fail'
    || ['missing', 'stale', 'dirty'].includes(normalize(fields.INJECTION_STATE))
    || normalize(fields.NEXT_REQUIRED_CONTROL) === 'refresh_injection_intake'
  ) {
    return {
      handoverAccepted: false,
      readyForHumanEvaluation: false,
      failureClassification: 'ADMIN_BINDING_DEFECT',
      nextRequiredControl: 'BIND_ACTIVE_STATE',
      specificBlocker: 'Active-state / IAA preflight binding is missing, stale, or mismatched for current head.',
      infrastructureRerunNeeded: false,
    };
  }

  const gateChangeFailed = [...failing, ...pending, ...missing].some((name) => name.includes('preflight/gate-changing-pr-rule'));
  if (gateChangeFailed) {
    return {
      handoverAccepted: false,
      readyForHumanEvaluation: false,
      failureClassification: 'GATE_CHANGE_EVIDENCE_DEFECT',
      nextRequiredControl: 'PROVIDE_GATE_CHANGE_EVIDENCE',
      specificBlocker: 'Strict gate-changing evidence/waiver check is not green on current head.',
      infrastructureRerunNeeded: false,
    };
  }

  if (isYes(fields.IAA_REQUIRED) && !isYes(fields.IAA_SATISFIED_OR_VALIDLY_WAIVED)) {
    return {
      handoverAccepted: false,
      readyForHumanEvaluation: false,
      failureClassification: 'IAA_ASSURANCE_DEFECT',
      nextRequiredControl: 'SATISFY_IAA_REQUIREMENT',
      specificBlocker: 'IAA-required preflight/final assurance state is not satisfied for current head.',
      infrastructureRerunNeeded: false,
    };
  }

  if (isYes(fields.ECAP_REQUIRED) && !isYes(fields.ECAP_SATISFIED_OR_VALIDLY_WAIVED)) {
    return {
      handoverAccepted: false,
      readyForHumanEvaluation: false,
      failureClassification: 'ECAP_CEREMONY_DEFECT',
      nextRequiredControl: 'SATISFY_ECAP_REQUIREMENT',
      specificBlocker: 'ECAP-required ceremony/admin evidence is not satisfied for current head.',
      infrastructureRerunNeeded: false,
    };
  }

  if (
    (isYes(fields.PRODUCT_DELIVERY_REQUIRED) && normalize(fields.FUNCTIONAL_PASS) === 'no')
    || !isNone(fields.FAILED_AFFECTED_GATES)
  ) {
    return {
      handoverAccepted: false,
      readyForHumanEvaluation: false,
      failureClassification: 'PRODUCT_DEFECT',
      nextRequiredControl: 'FIX_PRODUCT_DEFECT',
      specificBlocker: 'Product delivery or affected product gates are failing for current head.',
      infrastructureRerunNeeded: false,
    };
  }

  if (failing.length > 0 || pending.length > 0 || missing.length > 0 || normalize(fields.RESULT) === 'stop_and_fix') {
    return {
      handoverAccepted: false,
      readyForHumanEvaluation: false,
      failureClassification: 'PR_DEFECT',
      nextRequiredControl: 'FIX_REQUIRED_GATES',
      specificBlocker: String(fields.REASON || 'Required current-head checks are not green.').trim(),
      infrastructureRerunNeeded: false,
    };
  }

  return {
    handoverAccepted: false,
    readyForHumanEvaluation: false,
    failureClassification: 'AMBIGUOUS_ESCALATE',
    nextRequiredControl: 'ESCALATE_TO_HUMAN',
    specificBlocker: 'Gate posture could not be classified safely with current data.',
    infrastructureRerunNeeded: false,
  };
}

function resolveRemediationCycle({ previousStickyBody = '', headSha = '', blocked = false } = {}) {
  if (!blocked) return { cycle: 0, escalated: false };
  const previousFields = parseStickyFields(previousStickyBody);
  const previousCycle = parseCycle(previousFields.REMEDIATION_CYCLE);
  const previousHead = String(previousFields.CURRENT_HEAD_SHA || '').trim();
  const previousNotAccepted = normalize(previousFields.HANDOVER_ACCEPTED) === 'no';

  const nextCycle = previousNotAccepted && previousHead && previousHead === headSha
    ? Math.max(previousCycle, 1)
    : Math.min(previousCycle + 1, MAX_REMEDIATION_CYCLES);

  return {
    cycle: nextCycle,
    escalated: nextCycle >= MAX_REMEDIATION_CYCLES,
  };
}

function renderAutoRemediationComment({
  decision,
  headSha,
  cycle = 0,
  escalated = false,
} = {}) {
  const shortHead = String(headSha || 'unknown').trim() || 'unknown';
  if (decision.handoverAccepted && decision.readyForHumanEvaluation) {
    return [
      STICKY_MARKER,
      '',
      '# ✅ READY_FOR_HUMAN_EVALUATION',
      '',
      'HANDOVER_ACCEPTED: yes',
      'READY_FOR_HUMAN_EVALUATION: yes',
      'STOP_AND_FIX: no',
      `CURRENT_HEAD_SHA: ${shortHead}`,
      '',
      'Admin state: clean',
      'Preflight: green',
      'Required CI: green',
    ].join('\n');
  }

  if (escalated) {
    return [
      STICKY_MARKER,
      '',
      '# ⚠️ AUTO_REMEDIATION_ESCALATED — HUMAN REVIEW REQUIRED',
      '',
      'AUTO_REMEDIATION_ACTIVE: no',
      `REMEDIATION_CYCLE: ${cycle}/${MAX_REMEDIATION_CYCLES}`,
      'AUTO_REMEDIATION_ESCALATED: yes',
      'HUMAN_REVIEW_REQUIRED: yes',
      'HANDOVER_ACCEPTED: no',
      'READY_FOR_HUMAN_EVALUATION: no',
      'STOP_AND_FIX: no',
      `NEXT_REQUIRED_CONTROL: ${decision.nextRequiredControl}`,
      `FAILURE_CLASSIFICATION: ${decision.failureClassification}`,
      `CURRENT_HEAD_SHA: ${shortHead}`,
      '',
      `Reason: ${decision.specificBlocker}`,
    ].join('\n');
  }

  const actionLine = decision.infrastructureRerunNeeded
    ? 'Rerun only the impacted infrastructure checks/workflows after rate limits reset.'
    : `Fix only: ${decision.specificBlocker}`;

  return [
    STICKY_MARKER,
    '',
    '@copilot',
    '',
    '# 🛑 STOP_AND_FIX — HANDOVER NOT ACCEPTED',
    '',
    'AUTO_REMEDIATION_ACTIVE: yes',
    `REMEDIATION_CYCLE: ${cycle}/${MAX_REMEDIATION_CYCLES}`,
    'HANDOVER_ACCEPTED: no',
    'READY_FOR_HUMAN_EVALUATION: no',
    'STOP_AND_FIX: yes',
    `NEXT_REQUIRED_CONTROL: ${decision.nextRequiredControl}`,
    `FAILURE_CLASSIFICATION: ${decision.failureClassification}`,
    `CURRENT_HEAD_SHA: ${shortHead}`,
    '',
    '## Required next action',
    '',
    `1. ${actionLine}`,
    '2. Do not regenerate unrelated evidence.',
    '3. Do not change unrelated product/runtime files.',
    '4. Push the fix.',
    '5. Do not post another handover/final-summary claim until current-head Preflight and required CI are green.',
  ].join('\n');
}

module.exports = {
  STICKY_MARKER,
  MAX_REMEDIATION_CYCLES,
  parseStickyFields,
  classifyPostHandover,
  resolveRemediationCycle,
  renderAutoRemediationComment,
};

