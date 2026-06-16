#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const manifestPath = '.agent-admin/control/merge-gate-required-checks.json';
const foremanPath = '.github/agents/foreman-v2-agent.md';
const workflowsDir = '.github/workflows';

function fail(message) {
  console.error(`::error::${message}`);
  process.exitCode = 1;
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function unique(values) {
  return [...new Set(values)];
}

function asSet(values) {
  return new Set(values || []);
}

function diff(left, right) {
  const rightSet = asSet(right);
  return left.filter((value) => !rightSet.has(value));
}

function extractForemanRequiredChecks() {
  const body = readText(foremanPath);
  const blockMatch = body.match(/merge_gate_interface:\n[\s\S]*?required_checks:\n([\s\S]*?)\n\s*parity_required:/);
  if (!blockMatch) {
    throw new Error('Could not find merge_gate_interface.required_checks in Foreman contract.');
  }
  const checks = [];
  const linePattern = /^\s*-\s+["']([^"']+)["']\s*$/gm;
  let match;
  while ((match = linePattern.exec(blockMatch[1])) !== null) {
    checks.push(match[1]);
  }
  return checks;
}

function listWorkflowFiles(dir) {
  const absolute = path.join(repoRoot, dir);
  if (!fs.existsSync(absolute)) return [];
  const files = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listWorkflowFiles(rel));
    } else if (/\.ya?ml$/i.test(entry.name)) {
      files.push(rel);
    }
  }
  return files;
}

function extractWorkflowCheckNames() {
  const names = [];
  for (const file of listWorkflowFiles(workflowsDir)) {
    const body = readText(file);
    const linePattern = /^\s+name:\s*["']([^"']+)["']\s*$/gm;
    let match;
    while ((match = linePattern.exec(body)) !== null) {
      if (/^(preflight|merge-gate|governance|stop-and-fix)\//.test(match[1]) || /^(foreman|builder|session)-/.test(match[1])) {
        names.push(match[1]);
      }
    }
  }
  return unique(names).sort();
}

function assertNoDuplicates(label, values) {
  const seen = new Set();
  const duplicates = [];
  for (const value of values) {
    if (seen.has(value)) duplicates.push(value);
    seen.add(value);
  }
  if (duplicates.length > 0) {
    fail(`${label} contains duplicates: ${unique(duplicates).join(', ')}`);
  }
}

console.log('=== Merge Gate Required Checks Alignment ===');

const manifest = readJson(manifestPath);
const manifestRequired = manifest.required_checks || [];
const manifestWorkflowBacked = manifest.workflow_backed_required_checks || [];
const manifestMapped = Object.keys(manifest.mapped_legacy_or_external_required_checks || {});
const foremanRequired = extractForemanRequiredChecks();
const liveWorkflowNames = extractWorkflowCheckNames();

console.log(`Manifest required checks: ${manifestRequired.length}`);
console.log(`Foreman required checks: ${foremanRequired.length}`);
console.log(`Manifest workflow-backed checks: ${manifestWorkflowBacked.length}`);
console.log(`Mapped legacy/external checks: ${manifestMapped.length}`);
console.log(`Live workflow check names discovered: ${liveWorkflowNames.length}`);

assertNoDuplicates('manifest.required_checks', manifestRequired);
assertNoDuplicates('Foreman merge_gate_interface.required_checks', foremanRequired);

const missingFromForeman = diff(manifestRequired, foremanRequired);
const extraInForeman = diff(foremanRequired, manifestRequired);
if (missingFromForeman.length > 0) fail(`Foreman required_checks missing manifest checks: ${missingFromForeman.join(', ')}`);
if (extraInForeman.length > 0) fail(`Foreman required_checks contains checks absent from manifest: ${extraInForeman.join(', ')}`);

const unmappedRequired = diff(manifestRequired, [...manifestWorkflowBacked, ...manifestMapped]);
if (unmappedRequired.length > 0) fail(`Manifest required checks are neither workflow-backed nor mapped legacy/external: ${unmappedRequired.join(', ')}`);

const mappedNotRequired = diff(manifestMapped, manifestRequired);
if (mappedNotRequired.length > 0) fail(`Mapped legacy/external checks are not present in required_checks: ${mappedNotRequired.join(', ')}`);

const workflowBackedNotRequired = diff(manifestWorkflowBacked, manifestRequired);
if (workflowBackedNotRequired.length > 0) fail(`Workflow-backed checks are not present in required_checks: ${workflowBackedNotRequired.join(', ')}`);

const missingLiveWorkflows = diff(manifestWorkflowBacked, liveWorkflowNames);
if (missingLiveWorkflows.length > 0) fail(`Workflow-backed required checks are missing matching live workflow job names: ${missingLiveWorkflows.join(', ')}`);

const wave6Added = manifest.wave6_added_required_checks || [];
const wave6Missing = diff(wave6Added, manifestRequired);
if (wave6Missing.length > 0) fail(`Wave 6 added checks are not in required_checks: ${wave6Missing.join(', ')}`);

if (process.exitCode) {
  console.error('STOP_AND_FIX: Align .agent-admin/control/merge-gate-required-checks.json, .github/agents/foreman-v2-agent.md, and live workflow job names before declaring merge-gate parity.');
  process.exit(process.exitCode);
}

console.log('Required-check manifest, Foreman contract, and live workflow-backed gates are aligned for Wave 6.');
console.log('Mapped legacy/external checks remain tracked for Wave 7 validation.');
