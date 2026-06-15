#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const headSha = process.env.GITHUB_SHA || '';
const eventName = process.env.GITHUB_EVENT_NAME || '';
const controlPath = path.join(repoRoot, '.agent-admin/control/handover-allowed.json');

const handoverLanguagePattern = /\b(complete|ready for review|ready-for-review|handover|merge-ready|released|done)\b/i;
const foremanArtifactPattern = /(^|\/)\.agent-workspace\/foreman-v2\/memory\/|(^|\/)PREHANDOVER-session-|(^|\/)session-[0-9].*\.md$/i;
const implementationPathPattern = /^(modules\/[^/]+\/src\/|apps\/[^/]+\/src\/|packages\/[^/]+\/src\/|supabase\/functions\/)/;
const implementationTestPattern = /(^|\/)(__tests__|tests?)\/|\.(test|spec)\.(ts|tsx|js|jsx)$/;

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Cannot read valid JSON from ${path.relative(repoRoot, filePath)}: ${error.message}`);
  }
}

function fail(message) {
  console.error(`::error::${message}`);
  process.exitCode = 1;
}

function warn(message) {
  console.warn(`::warning::${message}`);
}

function listFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(repoRoot, full).replace(/\\/g, '/');
    if (rel === '.git' || rel.startsWith('.git/')) continue;
    if (entry.isDirectory()) listFiles(full, out);
    else out.push(rel);
  }
  return out;
}

function hasHandoverLanguage(files) {
  const candidates = files.filter((file) => /\.(md|txt|json|yml|yaml)$/i.test(file));
  const hits = [];
  for (const file of candidates) {
    try {
      const body = fs.readFileSync(path.join(repoRoot, file), 'utf8');
      if (handoverLanguagePattern.test(body)) hits.push(file);
    } catch (_error) {
      // Ignore unreadable files; checkout text files should normally be readable.
    }
  }
  return hits;
}

function validateControl(control) {
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
  if (headSha && control.current_head_sha !== headSha) {
    errors.push(`current_head_sha must equal current HEAD ${headSha}; got ${control.current_head_sha}`);
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

  if (control.ecap_required === true && control.ecap_admin_validated !== true) {
    errors.push('ecap_admin_validated must be true when ecap_required is true');
  }

  return errors;
}

const allFiles = listFiles(repoRoot);
const handoverHits = hasHandoverLanguage(allFiles);
const foremanArtifacts = allFiles.filter((file) => foremanArtifactPattern.test(file));
const implementationFiles = allFiles.filter((file) => implementationPathPattern.test(file) || implementationTestPattern.test(file));

const laneGateRelevant = handoverHits.length > 0 || foremanArtifacts.length > 0 || implementationFiles.length > 0;

console.log('=== Foreman Pre-Handover Lane Gate ===');
console.log(`Event: ${eventName}`);
console.log(`HEAD: ${headSha || 'unknown'}`);
console.log(`Handover language hits: ${handoverHits.length}`);
console.log(`Foreman artifacts: ${foremanArtifacts.length}`);
console.log(`Implementation-like files in checkout: ${implementationFiles.length}`);

if (!laneGateRelevant) {
  console.log('No handover language, Foreman artifacts, or implementation-like files detected. Gate passes.');
  process.exit(0);
}

if (!fs.existsSync(controlPath)) {
  fail('Missing .agent-admin/control/handover-allowed.json while handover/completion lane gate is relevant.');
  process.exit(process.exitCode || 1);
}

const control = readJson(controlPath);
const errors = validateControl(control);

if (errors.length > 0) {
  console.error('Pre-handover lane gate failed:');
  for (const error of errors) console.error(`- ${error}`);
  if (handoverHits.length) {
    warn(`handover/completion language appears in: ${handoverHits.slice(0, 20).join(', ')}`);
  }
  process.exit(1);
}

console.log('Pre-handover lane gate passed.');
