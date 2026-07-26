#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = process.cwd();
const workflowSha = process.env.GITHUB_SHA || '';
const prHeadSha = process.env.PR_HEAD_SHA || workflowSha;
const prBaseSha = process.env.PR_BASE_SHA || '';
const eventName = process.env.GITHUB_EVENT_NAME || '';
const controlPath = path.join(repoRoot, '.agent-admin/control/handover-allowed.json');

const positiveStructuredClaimPatterns = [
  /^\s*(?:[-*]\s*)?(?:handover_allowed|handover-allowed)\s*:\s*(?:true|yes)\b/im,
  /^\s*(?:[-*]\s*)?(?:final_iaa_verdict|final-iaa-verdict)\s*:\s*(?:pass|approved|final_assurance_pass)\b/im,
  /^\s*(?:[-*]\s*)?(?:state|final_state|handover_state)\s*:\s*(?:PRE_HANDOVER_GATE_PASS|IAA_FINAL_PASS|CS2_REVIEW|READY_FOR_REVIEW|MERGE_READY|HANDOVER_ALLOWED)\b/im,
];
const positiveNarrativeClaimPattern = /\b(?:ready[- ]for[- ]review|merge[- ]ready|handover[- ](?:ready|allowed|approved|authori[sz]ed)|handover\s+(?:is\s+)?(?:allowed|approved|authori[sz]ed)|ready\s+to\s+hand\s+over|work\s+(?:is\s+)?(?:complete|done|released))\b/ig;
const negativeValueAfterClaimPattern = /^\s*[:=]\s*(?:false|no|pending|blocked|not[_ -]?allowed)\b/i;
const negationBeforeClaimPattern = /\b(?:no|not|never|without|pending|blocked|prohibited|cannot|can't|must\s+not|does\s+not|do\s+not)\b[^.!?;]{0,64}$/i;
const laneIntentPattern = /(^|\/)\.agent-workspace\/foreman-v2\/memory\/PREHANDOVER-.*\.md$|(^|\/)\.agent-workspace\/execution-ceremony-admin-agent\/bundles\/PREHANDOVER-.*\.md$|(^|\/)\.agent-admin\/control\/handover-allowed\.json$/i;
const handoverLanguageScanPattern = /(^|\/)\.agent-workspace\/foreman-v2\/memory\/.*\.(md|txt|json|yml|yaml)$|(^|\/)\.agent-workspace\/execution-ceremony-admin-agent\/bundles\/.*\.(md|txt|json|yml|yaml)$/i;
const implementationPathPattern = /^(modules\/[^/]+\/src\/|apps\/[^/]+\/src\/|packages\/[^/]+\/src\/|supabase\/functions\/|api\/|lib\/)/;
const implementationTestPattern = /(^|\/)(__tests__|tests?)\/|\.(test|spec)\.(ts|tsx|js|jsx)$/;

function fail(message) {
  console.error(`::error::${message}`);
  process.exitCode = 1;
}

function warn(message) {
  console.warn(`::warning::${message}`);
}

function runGit(args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
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

function lineHasPositiveNarrativeClaim(line) {
  positiveNarrativeClaimPattern.lastIndex = 0;
  let match;
  while ((match = positiveNarrativeClaimPattern.exec(line)) !== null) {
    const before = line.slice(0, match.index);
    const after = line.slice(match.index + match[0].length);
    if (!negationBeforeClaimPattern.test(before) && !negativeValueAfterClaimPattern.test(after)) {
      return true;
    }
  }
  return false;
}

function bodyHasPositiveHandoverClaim(body) {
  if (positiveStructuredClaimPatterns.some((pattern) => pattern.test(body))) return true;
  return body.split(/\r?\n/).some(lineHasPositiveNarrativeClaim);
}

function findPositiveHandoverClaims(files) {
  const candidates = files.filter((file) => handoverLanguageScanPattern.test(file));
  const hits = [];
  for (const file of candidates) {
    try {
      const body = fs.readFileSync(path.join(repoRoot, file), 'utf8');
      if (bodyHasPositiveHandoverClaim(body)) hits.push(file);
    } catch (error) {
      warn(`Could not inspect ${file}: ${error.message}`);
    }
  }
  return hits;
}

function validateControl(control, implementationChanged) {
  const errors = [];
  const required = [
    'schema_version',
    'wave_id',
    'pr_number',
    'current_head_sha',
    'state',
    'handover_allowed',
    'foreman_qp_pass',
    'builder_delegation_verified',
    'delegation_precedes_implementation',
    'iaa_prebrief_ready',
    'scope_current',
    'ecap_required',
    'ecap_admin_validated',
    'all_required_checks_green',
    'iaa_final_required',
    'blocking_findings',
  ];

  for (const key of required) {
    if (!(key in control)) errors.push(`missing required key: ${key}`);
  }

  if (control.schema_version !== '1.0.0') errors.push('schema_version must be 1.0.0');
  if (prHeadSha && control.current_head_sha !== prHeadSha) {
    errors.push(`current_head_sha must equal PR head SHA ${prHeadSha}; got ${control.current_head_sha}`);
  }
  if (control.state !== 'PRE_HANDOVER_GATE_PASS' && control.handover_allowed === true) {
    errors.push('handover_allowed may be true only when state is PRE_HANDOVER_GATE_PASS');
  }
  if (!Array.isArray(control.blocking_findings)) errors.push('blocking_findings must be an array');
  if (Array.isArray(control.blocking_findings) && control.blocking_findings.length > 0) {
    errors.push(`blocking_findings must be empty before handover: ${control.blocking_findings.join('; ')}`);
  }

  const requiredTrue = [
    'handover_allowed',
    'foreman_qp_pass',
    'iaa_prebrief_ready',
    'scope_current',
    'all_required_checks_green',
  ];

  for (const key of requiredTrue) {
    if (control[key] !== true) errors.push(`${key} must be true before handover/completion language is allowed`);
  }

  if (implementationChanged) {
    if (control.builder_delegation_verified !== true) {
      errors.push('builder_delegation_verified must be true when implementation files changed');
    }
    if (control.delegation_precedes_implementation !== true) {
      errors.push('delegation_precedes_implementation must be true when implementation files changed');
    }
  }

  if (control.ecap_required === true && control.ecap_admin_validated !== true) {
    errors.push('ecap_admin_validated must be true when ecap_required is true');
  }

  return errors;
}

const changedFiles = getChangedFiles();
const handoverHits = findPositiveHandoverClaims(changedFiles);
const laneIntentFiles = changedFiles.filter((file) => laneIntentPattern.test(file));
const implementationFiles = changedFiles.filter((file) => implementationPathPattern.test(file) || implementationTestPattern.test(file));

const implementationChanged = implementationFiles.length > 0;
const handoverGateRelevant = handoverHits.length > 0 || laneIntentFiles.length > 0;

console.log('=== Foreman Pre-Handover Lane Gate ===');
console.log(`Event: ${eventName}`);
console.log(`Workflow SHA: ${workflowSha || 'unknown'}`);
console.log(`PR head SHA: ${prHeadSha || 'unknown'}`);
console.log(`PR base SHA: ${prBaseSha || 'unknown'}`);
console.log(`Changed files: ${changedFiles.length}`);
console.log(`Positive handover/readiness claim hits in scanned artifacts: ${handoverHits.length}`);
console.log(`Explicit pre-handover lane intent files changed: ${laneIntentFiles.length}`);
console.log(`Implementation files changed: ${implementationFiles.length}`);

if (!handoverGateRelevant) {
  if (implementationChanged) {
    console.log('Implementation-like files changed, but no Foreman/ECAP handover artifact or handover/completion language was detected. Pre-handover lane gate is not yet applicable; delegation-order gate remains responsible for implementation-order enforcement.');
  } else {
    console.log('No Foreman handover artifacts or handover/completion language detected. Gate passes.');
  }
  process.exit(0);
}

if (!fs.existsSync(controlPath)) {
  fail('Missing .agent-admin/control/handover-allowed.json while pre-handover lane gate is relevant.');
  if (implementationFiles.length) warn(`implementation files changed: ${implementationFiles.slice(0, 20).join(', ')}`);
  if (laneIntentFiles.length) warn(`pre-handover lane intent files changed: ${laneIntentFiles.slice(0, 20).join(', ')}`);
  if (handoverHits.length) warn(`positive handover/readiness claim appears in: ${handoverHits.slice(0, 20).join(', ')}`);
  process.exit(process.exitCode || 1);
}

const control = readJson(controlPath);
if (!control) process.exit(process.exitCode || 1);

const errors = validateControl(control, implementationChanged);

if (errors.length > 0) {
  console.error('Pre-handover lane gate failed:');
  for (const error of errors) console.error(`- ${error}`);
  if (implementationFiles.length) warn(`implementation files changed: ${implementationFiles.slice(0, 20).join(', ')}`);
  if (laneIntentFiles.length) warn(`pre-handover lane intent files changed: ${laneIntentFiles.slice(0, 20).join(', ')}`);
  if (handoverHits.length) warn(`positive handover/readiness claim appears in: ${handoverHits.slice(0, 20).join(', ')}`);
  process.exit(1);
}

console.log('Pre-handover lane gate passed.');
