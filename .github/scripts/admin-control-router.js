#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function normalizeBool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n'].includes(normalized)) return false;
  return fallback;
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function git(args) {
  try {
    return cp.execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function dedupe(values) {
  return [...new Set(values.filter(Boolean))];
}

function parseIssueNumber(text) {
  const source = String(text || '');
  const match = source.match(/(?:fixes|closes|resolves|issue)\s*#(\d+)/i);
  return match ? Number(match[1]) : null;
}

function classifyChangedFiles(changedFiles) {
  let hasProductChange = false;
  let hasGovernanceChange = false;
  let hasProtectedPath = false;
  let hasGateChange = false;
  let hasAgentContractChange = false;

  for (const file of changedFiles) {
    if (/^\.github\/agents\/.*\.md$/i.test(file)) {
      hasAgentContractChange = true;
      hasProtectedPath = true;
      continue;
    }

    if (/^\.github\/(workflows|scripts)\//.test(file)) {
      hasGateChange = true;
      hasProtectedPath = true;
      continue;
    }

    if (/^(governance\/|\.agent-admin\/|\.admin\/|\.agent-workspace\/)/.test(file)) {
      hasGovernanceChange = true;
      hasProtectedPath = true;
      continue;
    }

    if (/^(apps\/|modules\/|packages\/|supabase\/|api\/|src\/)/.test(file) || /\.(ts|tsx|js|jsx|py|go|sql|java|rb|rs)$/i.test(file)) {
      hasProductChange = true;
      continue;
    }
  }

  const jobClass = [];
  if (hasProductChange && !hasGovernanceChange && !hasProtectedPath && !hasGateChange && !hasAgentContractChange) {
    jobClass.push('product-fix');
  }
  if (hasGovernanceChange) jobClass.push('governance-change');
  if (hasProtectedPath) jobClass.push('protected-path');
  if (hasGateChange) jobClass.push('gate-change');
  if (hasAgentContractChange) jobClass.push('agent-contract');
  if (hasProductChange && (hasGovernanceChange || hasProtectedPath || hasGateChange || hasAgentContractChange)) {
    jobClass.push('mixed');
  }

  if (jobClass.length === 0) {
    jobClass.push('product-fix');
  }

  return {
    jobClass: dedupe(jobClass),
    hasProductChange,
    hasGovernanceChange,
    hasProtectedPath,
    hasGateChange,
    hasAgentContractChange,
  };
}

function getChangedFiles(baseSha) {
  if (process.env.CHANGED_FILES_JSON) {
    try {
      const parsed = JSON.parse(process.env.CHANGED_FILES_JSON);
      if (Array.isArray(parsed)) return dedupe(parsed.map((x) => String(x || '').trim()).filter(Boolean));
    } catch {
      // fall through
    }
  }

  if (baseSha) {
    const diff = git(['diff', '--name-only', `${baseSha}...HEAD`]) || git(['diff', '--name-only', baseSha, 'HEAD']);
    if (diff) return dedupe(diff.split('\n').map((line) => line.trim()).filter(Boolean));
  }

  const fallback = git(['diff', '--name-only', 'HEAD~1', 'HEAD']);
  if (fallback) return dedupe(fallback.split('\n').map((line) => line.trim()).filter(Boolean));
  return [];
}

function readIdentityBundle() {
  if (process.env.ACTIVE_IDENTITY_BUNDLE_JSON) {
    try {
      return JSON.parse(process.env.ACTIVE_IDENTITY_BUNDLE_JSON);
    } catch {
      return null;
    }
  }
  if (process.env.ACTIVE_IDENTITY_BUNDLE_PATH) {
    return readJsonFile(process.env.ACTIVE_IDENTITY_BUNDLE_PATH);
  }
  return null;
}

function issueBlockingReason(code, details) {
  const messages = {
    NONE: 'All required controls satisfied for current identity and phase.',
    IDENTITY_BINDING: details || 'Active identity bundle mismatches current GitHub PR context.',
    DRAFT_WIP_PHASE_NOT_COMPLETE: 'Draft/WIP posture must be completed before review or handover.',
    CODEXADVISOR_CS2_AUTHORIZATION: 'Agent-contract changes require CodexAdvisor/CS2 authorization path.',
    IAA_PREFLIGHT: 'IAA pre-brief is required before work/handover progression.',
    STRICT_GATE_CHANGE_EVIDENCE: 'Gate-change detected; strict gate-change evidence is required before handover.',
    ECAP_PROTECTED_PATH_CEREMONY: 'Protected/governance paths require ECAP ceremony normalization before handover.',
    FOREMAN_ADMIN_READINESS: 'Foreman admin-readiness acceptance is required after ECAP ceremony.',
    IAA_FINAL_ASSURANCE: 'IAA final assurance is required before handover/merge posture.',
    CURRENT_HEAD_GATE_PARITY: 'Current-head required checks must be green before handover/merge posture.',
  };

  return {
    code,
    message: messages[code] || code,
  };
}

function main() {
  const eventPayload = process.env.GITHUB_EVENT_PATH ? readJsonFile(process.env.GITHUB_EVENT_PATH) : null;
  const prContext = eventPayload && eventPayload.pull_request ? eventPayload.pull_request : null;

  const prNumber = Number(process.env.PR_NUMBER || prContext?.number || 0) || null;
  const headSha = process.env.HEAD_SHA || prContext?.head?.sha || git(['rev-parse', 'HEAD']) || 'unknown';
  const baseSha = process.env.BASE_SHA || prContext?.base?.sha || '';
  const branch = process.env.HEAD_REF || prContext?.head?.ref || git(['branch', '--show-current']) || 'unknown';
  const baseBranch = process.env.BASE_REF || prContext?.base?.ref || 'unknown';
  const prBody = process.env.PR_BODY || prContext?.body || '';
  const prTitle = process.env.PR_TITLE || prContext?.title || '';
  const issueNumber = Number(process.env.ISSUE_NUMBER || 0) || parseIssueNumber(`${prTitle}\n${prBody}`);

  const isDraft = normalizeBool(process.env.PR_DRAFT, Boolean(prContext?.draft));
  const isWip = /\bWIP\b/i.test(prTitle) || /\bWIP\b/i.test(prBody);
  const isDraftWip = isDraft || isWip;

  const changedFiles = getChangedFiles(baseSha);
  const classes = classifyChangedFiles(changedFiles);
  const jobClass = [...classes.jobClass];
  if (isDraftWip) jobClass.push('draft-wip');

  const productOnlySimple = classes.hasProductChange
    && !classes.hasGovernanceChange
    && !classes.hasProtectedPath
    && !classes.hasGateChange
    && !classes.hasAgentContractChange;

  const requiresIaaPreflight = !productOnlySimple;
  const requiresEcap = classes.hasProtectedPath || classes.hasGovernanceChange;
  const requiresStrictGateEvidence = classes.hasGateChange;
  const requiresAgentContractAuth = classes.hasAgentContractChange;
  const requiresIaaFinalAssurance = requiresIaaPreflight || requiresEcap || requiresStrictGateEvidence || requiresAgentContractAuth;

  const requiredControls = ['IDENTITY_BINDING'];
  if (requiresIaaPreflight) requiredControls.push('IAA_PREFLIGHT');
  if (requiresEcap) requiredControls.push('ECAP_PROTECTED_PATH_CEREMONY');
  if (requiresStrictGateEvidence) requiredControls.push('STRICT_GATE_CHANGE_EVIDENCE');
  if (requiresAgentContractAuth) requiredControls.push('CODEXADVISOR_CS2_AUTHORIZATION');
  if (requiresIaaFinalAssurance) requiredControls.push('IAA_FINAL_ASSURANCE');
  requiredControls.push('CURRENT_HEAD_GATE_PARITY');

  const identityBundle = readIdentityBundle();
  let identityMismatch = false;
  let identityMismatchReasons = [];
  if (identityBundle && typeof identityBundle === 'object') {
    const bundlePr = Number(identityBundle.pr || identityBundle.PR || 0) || null;
    const bundleBranch = String(identityBundle.branch || identityBundle.BRANCH || '').trim();
    const bundleHead = String(identityBundle.head_sha || identityBundle.headSha || identityBundle.CURRENT_HEAD_SHA || '').trim();

    if (bundlePr && prNumber && bundlePr !== prNumber) {
      identityMismatch = true;
      identityMismatchReasons.push(`bundle PR ${bundlePr} != context PR ${prNumber}`);
    }
    if (bundleBranch && branch && bundleBranch !== branch) {
      identityMismatch = true;
      identityMismatchReasons.push(`bundle branch ${bundleBranch} != context branch ${branch}`);
    }
    if (bundleHead && headSha && bundleHead !== headSha) {
      identityMismatch = true;
      identityMismatchReasons.push(`bundle head ${bundleHead} != context head ${headSha}`);
    }
  }

  const codexAuthComplete = normalizeBool(process.env.CODEXADVISOR_CS2_AUTHORIZATION_COMPLETE, false);
  const iaaPreflightComplete = normalizeBool(process.env.IAA_PREFLIGHT_COMPLETE, false);
  const strictGateEvidenceComplete = normalizeBool(process.env.STRICT_GATE_CHANGE_EVIDENCE_COMPLETE, false);
  const ecapComplete = normalizeBool(process.env.ECAP_COMPLETED, false);
  const foremanAdminAccepted = normalizeBool(process.env.FOREMAN_ADMIN_ACCEPTED, false);
  const iaaFinalIssued = normalizeBool(process.env.IAA_FINAL_ASSURANCE_ISSUED, false);
  const currentHeadGatesPassed = normalizeBool(process.env.CURRENT_HEAD_GATES_PASSED, false);

  let nextRequiredControl = 'NONE';
  if (identityMismatch) {
    nextRequiredControl = 'IDENTITY_BINDING';
  } else if (isDraftWip) {
    nextRequiredControl = 'DRAFT_WIP_PHASE_NOT_COMPLETE';
  } else if (requiresAgentContractAuth && !codexAuthComplete) {
    nextRequiredControl = 'CODEXADVISOR_CS2_AUTHORIZATION';
  } else if (requiresIaaPreflight && !iaaPreflightComplete) {
    nextRequiredControl = 'IAA_PREFLIGHT';
  } else if (requiresStrictGateEvidence && !strictGateEvidenceComplete) {
    nextRequiredControl = 'STRICT_GATE_CHANGE_EVIDENCE';
  } else if (requiresEcap && !ecapComplete) {
    nextRequiredControl = 'ECAP_PROTECTED_PATH_CEREMONY';
  } else if (requiresEcap && !foremanAdminAccepted) {
    nextRequiredControl = 'FOREMAN_ADMIN_READINESS';
  } else if (requiresIaaFinalAssurance && !iaaFinalIssued) {
    nextRequiredControl = 'IAA_FINAL_ASSURANCE';
  } else if (!currentHeadGatesPassed) {
    nextRequiredControl = 'CURRENT_HEAD_GATE_PARITY';
  }

  const blocking = nextRequiredControl === 'NONE'
    ? issueBlockingReason('NONE')
    : issueBlockingReason(
      nextRequiredControl,
      identityMismatch ? `Identity mismatch: ${identityMismatchReasons.join('; ')}` : undefined,
    );

  const handoverAllowed = nextRequiredControl === 'NONE';
  const readyForReviewAllowed = handoverAllowed && !isDraftWip;
  const mergeAllowed = handoverAllowed && currentHeadGatesPassed && !isDraftWip;

  const controlState = {
    active_identity: {
      pr: prNumber,
      issue: issueNumber || null,
      branch,
      head_sha: headSha,
      base_sha: baseSha || 'unknown',
      base_branch: baseBranch,
      source_of_truth: prContext ? 'github_pr_context' : 'local_git_context',
    },
    job_class: dedupe(jobClass),
    required_controls: dedupe(requiredControls),
    next_required_control: nextRequiredControl,
    handover_allowed: handoverAllowed,
    ready_for_review_allowed: readyForReviewAllowed,
    merge_allowed: mergeAllowed,
    blocking_reason: blocking.code,
    blocking_reason_human: blocking.message,
    diagnostics: {
      changed_files_count: changedFiles.length,
      changed_files: changedFiles,
      identity_mismatch: identityMismatch,
      identity_mismatch_reasons: identityMismatchReasons,
      flags: {
        product_only_simple: productOnlySimple,
        requires_iaa_preflight: requiresIaaPreflight,
        requires_ecap: requiresEcap,
        requires_strict_gate_change_evidence: requiresStrictGateEvidence,
        requires_agent_contract_authorization: requiresAgentContractAuth,
        requires_iaa_final_assurance: requiresIaaFinalAssurance,
        draft_or_wip: isDraftWip,
        current_head_gates_passed: currentHeadGatesPassed,
      },
    },
  };

  const defaultOutputPath = prNumber
    ? path.join('.agent-admin', 'control-state', `pr-${prNumber}.json`)
    : path.join('.agent-admin', 'control-state', 'pr-unknown.json');
  const outputPath = process.env.CONTROL_STATE_OUTPUT_PATH || defaultOutputPath;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(controlState, null, 2)}\n`, 'utf8');

  if (process.env.GITHUB_OUTPUT) {
    const bool = (v) => (v ? 'true' : 'false');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `control_state_path=${outputPath}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `next_required_control=${nextRequiredControl}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `handover_allowed=${bool(handoverAllowed)}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `ready_for_review_allowed=${bool(readyForReviewAllowed)}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `merge_allowed=${bool(mergeAllowed)}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `blocking_reason=${blocking.code}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `job_class=${controlState.job_class.join(',')}\n`);
  }

  process.stdout.write(`${JSON.stringify(controlState, null, 2)}\n`);
}

main();
