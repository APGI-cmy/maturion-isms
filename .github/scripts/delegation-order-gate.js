#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = process.cwd();
const workflowSha = process.env.GITHUB_SHA || '';
const prHeadSha = process.env.PR_HEAD_SHA || workflowSha;
const prBaseSha = process.env.PR_BASE_SHA || '';
const prNumber = (process.env.PR_NUMBER || '').trim();

const legacyControlRelPath = '.agent-admin/control/delegation-order.json';
const scopedControlRelPath = prNumber ? `.agent-admin/control/delegation-orders/pr-${prNumber}.json` : '';
const legacyControlPath = path.join(repoRoot, legacyControlRelPath);
const scopedControlPath = scopedControlRelPath ? path.join(repoRoot, scopedControlRelPath) : '';

const implementationPathPattern = /^(modules\/[^/]+\/src\/|apps\/[^/]+\/src\/|packages\/[^/]+\/src\/|supabase\/functions\/|api\/|lib\/)/;
const implementationTestPattern = /(^|\/)(__tests__|tests?)\/|\.(test|spec)\.(ts|tsx|js|jsx)$/;
const stopAndFixGuidance = [
  'STOP_AND_FIX: Delegation order could not be proven.',
  'Required order: canonical IAA pre-brief commit -> builder appointment commit -> first implementation commit.',
  'Same-commit proof is not accepted because it cannot prove delegation happened before implementation.',
  'Implementation PRs must provide PR-scoped evidence at .agent-admin/control/delegation-orders/pr-<PR_NUMBER>.json.',
  'Do not overwrite .agent-admin/control/delegation-order.json for product or implementation PRs.',
  'Record/commit IAA pre-brief and builder appointment before implementation, or obtain explicit CS2 waiver outside delegation-order evidence.',
  'Do not proceed to handover.'
].join(' ');

function fail(message) {
  console.error(`::error::${message}`);
  process.exitCode = 1;
}

function warn(message) {
  console.warn(`::warning::${message}`);
}

function runGit(args, options = {}) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', ...options }).trim();
}

function getChangedFiles() {
  if (process.env.CHANGED_FILES && process.env.CHANGED_FILES.trim()) {
    return process.env.CHANGED_FILES.split(/\r?\n/).map((file) => file.trim()).filter(Boolean);
  }

  if (prBaseSha && prHeadSha) {
    try {
      return runGit(['diff', '--name-only', `${prBaseSha}...${prHeadSha}`])
        .split(/\r?\n/)
        .map((file) => file.trim())
        .filter(Boolean);
    } catch (error) {
      warn(`Could not diff PR base/head (${prBaseSha}...${prHeadSha}): ${error.message}`);
    }
  }

  try {
    return runGit(['diff', '--name-only', 'HEAD~1', 'HEAD'])
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter(Boolean);
  } catch (error) {
    warn(`Could not determine changed files from git fallback: ${error.message}`);
    return [];
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Cannot read valid JSON from ${path.relative(repoRoot, filePath)}: ${error.message}`);
    return null;
  }
}

function commitExists(sha) {
  try {
    runGit(['cat-file', '-e', `${sha}^{commit}`]);
    return true;
  } catch (_error) {
    return false;
  }
}

function isAncestor(ancestor, descendant) {
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', ancestor, descendant], { cwd: repoRoot, encoding: 'utf8' });
    return true;
  } catch (_error) {
    return false;
  }
}

function isStrictAncestor(ancestor, descendant) {
  return ancestor !== descendant && isAncestor(ancestor, descendant);
}

function firstImplementationCommit(implementationFiles) {
  if (!prBaseSha || !prHeadSha || implementationFiles.length === 0) return '';
  try {
    const args = ['log', '--reverse', '--format=%H', `${prBaseSha}..${prHeadSha}`, '--', ...implementationFiles];
    const output = runGit(args);
    return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0] || '';
  } catch (error) {
    warn(`Could not determine first implementation commit: ${error.message}`);
    return '';
  }
}

function validIsoDateTime(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  const time = Date.parse(value);
  return Number.isFinite(time);
}

function validateControl(control, firstImplCommit, sourceRelPath) {
  const errors = [];
  const required = [
    'schema_version',
    'wave_id',
    'pr_number',
    'prebrief_commit_sha',
    'builder_appointment_timestamp',
    'builder_appointment_commit_sha',
    'builder_agent',
    'builder_task_ref',
    'first_implementation_commit_sha',
    'qp_review_timestamp',
    'result',
  ];

  for (const key of required) {
    if (!(key in control)) errors.push(`missing required key: ${key}`);
  }

  if (control.schema_version !== '1.0.0') errors.push('schema_version must be 1.0.0');
  if (control.result !== 'DELEGATION_ORDER_VERIFIED') errors.push('result must be DELEGATION_ORDER_VERIFIED');
  if (!validIsoDateTime(control.builder_appointment_timestamp)) errors.push('builder_appointment_timestamp must be an ISO date-time string');
  if (!validIsoDateTime(control.qp_review_timestamp)) errors.push('qp_review_timestamp must be an ISO date-time string');

  if (prNumber && String(control.pr_number) !== prNumber) {
    errors.push(`pr_number must match current PR number ${prNumber}; got ${control.pr_number}`);
  }

  if (prNumber && sourceRelPath !== scopedControlRelPath) {
    errors.push(`delegation evidence must be PR-scoped at ${scopedControlRelPath}; got ${sourceRelPath}`);
  }

  const shaFields = [
    'prebrief_commit_sha',
    'builder_appointment_commit_sha',
    'first_implementation_commit_sha',
  ];

  for (const field of shaFields) {
    const value = control[field];
    if (typeof value !== 'string' || !/^[a-f0-9]{40}$/.test(value)) {
      errors.push(`${field} must be a 40-character lowercase commit SHA`);
    } else if (!commitExists(value)) {
      errors.push(`${field} does not resolve to a commit in this checkout: ${value}`);
    }
  }

  if (control.prebrief_commit_sha === control.builder_appointment_commit_sha) {
    errors.push('prebrief_commit_sha and builder_appointment_commit_sha must be different commits; same-commit proof is not accepted');
  }

  if (control.builder_appointment_commit_sha === control.first_implementation_commit_sha) {
    errors.push('builder_appointment_commit_sha and first_implementation_commit_sha must be different commits; same-commit proof is not accepted');
  }

  if (firstImplCommit && control.first_implementation_commit_sha !== firstImplCommit) {
    errors.push(`first_implementation_commit_sha must equal detected first implementation commit ${firstImplCommit}; got ${control.first_implementation_commit_sha}`);
  }

  if (control.prebrief_commit_sha && control.builder_appointment_commit_sha) {
    if (!isStrictAncestor(control.prebrief_commit_sha, control.builder_appointment_commit_sha)) {
      errors.push('prebrief_commit_sha must be a strict ancestor of builder_appointment_commit_sha');
    }
  }

  if (control.builder_appointment_commit_sha && control.first_implementation_commit_sha) {
    if (!isStrictAncestor(control.builder_appointment_commit_sha, control.first_implementation_commit_sha)) {
      errors.push('builder_appointment_commit_sha must be a strict ancestor of first_implementation_commit_sha');
    }
  }

  if (control.first_implementation_commit_sha && prHeadSha) {
    if (!isAncestor(control.first_implementation_commit_sha, prHeadSha)) {
      errors.push('first_implementation_commit_sha must be an ancestor of current PR head SHA');
    }
  }

  return errors;
}

function selectControlEvidence() {
  if (scopedControlPath && fs.existsSync(scopedControlPath)) {
    return { path: scopedControlPath, relPath: scopedControlRelPath };
  }

  if (!prNumber && fs.existsSync(legacyControlPath)) {
    warn(`PR_NUMBER was not available; falling back to legacy singleton ${legacyControlRelPath}.`);
    return { path: legacyControlPath, relPath: legacyControlRelPath };
  }

  return null;
}

function exitWithStopAndFix(code = 1) {
  console.error(`::error::${stopAndFixGuidance}`);
  process.exit(code);
}

const changedFiles = getChangedFiles();
const implementationFiles = changedFiles.filter((file) => implementationPathPattern.test(file) || implementationTestPattern.test(file));
const legacySingletonChanged = changedFiles.includes(legacyControlRelPath);

console.log('=== Builder Delegation Order Gate ===');
console.log(`Workflow SHA: ${workflowSha || 'unknown'}`);
console.log(`PR number: ${prNumber || 'unknown'}`);
console.log(`PR head SHA: ${prHeadSha || 'unknown'}`);
console.log(`PR base SHA: ${prBaseSha || 'unknown'}`);
console.log(`Changed files: ${changedFiles.length}`);
console.log(`Implementation files changed: ${implementationFiles.length}`);
console.log(`Expected PR-scoped evidence: ${scopedControlRelPath || 'unavailable because PR_NUMBER is missing'}`);

if (implementationFiles.length === 0) {
  console.log('No implementation-like files changed. Delegation order gate passes.');
  process.exit(0);
}

if (legacySingletonChanged) {
  fail(`Implementation PRs must not modify legacy singleton delegation evidence at ${legacyControlRelPath}. Use ${scopedControlRelPath || '.agent-admin/control/delegation-orders/pr-<PR_NUMBER>.json'} instead.`);
  exitWithStopAndFix(1);
}

const detectedFirstImplementationCommit = firstImplementationCommit(implementationFiles);
if (!detectedFirstImplementationCommit) {
  fail('Implementation files changed but the first implementation commit could not be determined.');
  exitWithStopAndFix(process.exitCode || 1);
}

const selectedControl = selectControlEvidence();
if (!selectedControl) {
  fail(`Missing PR-scoped delegation evidence while implementation files changed: ${scopedControlRelPath || '.agent-admin/control/delegation-orders/pr-<PR_NUMBER>.json'}`);
  warn(`implementation files changed: ${implementationFiles.slice(0, 20).join(', ')}`);
  warn(`detected first implementation commit: ${detectedFirstImplementationCommit}`);
  exitWithStopAndFix(process.exitCode || 1);
}

console.log(`Using delegation evidence: ${selectedControl.relPath}`);
const control = readJson(selectedControl.path);
if (!control) exitWithStopAndFix(process.exitCode || 1);

const errors = validateControl(control, detectedFirstImplementationCommit, selectedControl.relPath);
if (errors.length > 0) {
  console.error('Delegation order gate failed:');
  for (const error of errors) console.error(`- ${error}`);
  warn(`implementation files changed: ${implementationFiles.slice(0, 20).join(', ')}`);
  warn(`detected first implementation commit: ${detectedFirstImplementationCommit}`);
  exitWithStopAndFix(1);
}

console.log('Delegation order gate passed.');
