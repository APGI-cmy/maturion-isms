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
const positiveHandoverStates = new Set([
  'pre_handover_gate_pass',
  'iaa_final_pass',
  'cs2_review',
  'ready_for_review',
  'merge_ready',
  'handover_allowed',
]);
const positiveNarrativeClaimPattern = /\b(?:ready[- ]for[- ]review|review[- ]ready|merge[- ]ready|ready[- ]to[- ]merge|release[- ]ready|production[- ]ready|handover[- ](?:ready|allowed|approved|authori[sz]ed)|handover\s+(?:is\s+)?(?:allowed|approved|authori[sz]ed)|ready\s+to\s+hand\s+over|(?:work|delivery|wave|job)\s+(?:is\s+)?(?:complete|done|released))\b/ig;
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

function normalizeStructuredToken(value) {
  return String(value)
    .trim()
    .replace(/^[\s"'`*_]+|[\s"'`*_,}]+$/g, '')
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

function structuredKeyValueIsPositive(key, value) {
  const normalizedKey = normalizeStructuredToken(key);
  const normalizedValue = normalizeStructuredToken(value);
  if (normalizedKey === 'handover_allowed') return normalizedValue === 'true' || normalizedValue === 'yes';
  if (normalizedKey === 'final_iaa_verdict') {
    return normalizedValue === 'pass' || normalizedValue === 'approved' || normalizedValue === 'final_assurance_pass';
  }
  if (normalizedKey === 'state' || normalizedKey === 'final_state' || normalizedKey === 'handover_state') {
    return positiveHandoverStates.has(normalizedValue);
  }
  return false;
}

function jsonValueHasPositiveHandoverClaim(value) {
  if (Array.isArray(value)) return value.some(jsonValueHasPositiveHandoverClaim);
  if (!value || typeof value !== 'object') return false;
  return Object.entries(value).some(([key, child]) => (
    structuredKeyValueIsPositive(key, child)
    || jsonValueHasPositiveHandoverClaim(child)
  ));
}

function bodyHasPositiveJsonClaim(body) {
  try {
    return jsonValueHasPositiveHandoverClaim(JSON.parse(body));
  } catch {
    return false;
  }
}

function lineHasPositiveStructuredClaim(line) {
  const trimmed = line.trim();
  if (trimmed.includes('|')) {
    const cells = trimmed
      .split('|')
      .map((cell) => cell.trim());
    if (cells[0] === '') cells.shift();
    if (cells[cells.length - 1] === '') cells.pop();
    for (let index = 0; index < cells.length - 1; index += 1) {
      if (structuredKeyValueIsPositive(cells[index], cells[index + 1])) return true;
    }
  }

  const keyValue = trimmed.match(/^(?:[-*]\s*)?["']?([A-Za-z0-9_-]+)["']?\s*:\s*(.+?)\s*$/);
  return Boolean(keyValue && structuredKeyValueIsPositive(keyValue[1], keyValue[2]));
}

function bodyHasPositiveHandoverClaim(body) {
  if (positiveStructuredClaimPatterns.some((pattern) => pattern.test(body))) return true;
  if (bodyHasPositiveJsonClaim(body)) return true;
  return body.split(/\r?\n/).some((line) => (
    lineHasPositiveStructuredClaim(line)
    || lineHasPositiveNarrativeClaim(line)
  ));
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
  if (prHeadSha && control.current_head_sha) {
    let shaValid = control.current_head_sha === prHeadSha;
    if (!shaValid) {
      // Also accept if current_head_sha is an ancestor of prHeadSha (handles the
      // case where handover-allowed.json itself is committed last, making the PR head
      // SHA differ from the SHA recorded when the file was written).
      try {
        runGit(['merge-base', '--is-ancestor', control.current_head_sha, prHeadSha]);
        shaValid = true;
      } catch {
        shaValid = false;
      }
    }
    if (!shaValid) {
      errors.push(`current_head_sha must equal or be an ancestor of PR head SHA ${prHeadSha}; got ${control.current_head_sha}`);
    }
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
