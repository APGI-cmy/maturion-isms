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

function extractForemanRequiredChecksFromText(body) {
  const blockMatch = body.match(/merge_gate_interface:\n[\s\S]*?required_checks:\n([\s\S]*?)\n\s*required_check_manifest:/);
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

function extractForemanRequiredChecks() {
  return extractForemanRequiredChecksFromText(readText(foremanPath));
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

function extractWorkflowCheckNamesFromText(body) {
  const names = [];
  const linePattern = /^\s+name:\s*(?:["']([^"']+)["']|([^#\r\n]+?))\s*(?:#.*)?$/gm;
  let match;
  while ((match = linePattern.exec(body)) !== null) {
    const candidate = (match[1] || match[2] || '').trim();
    if (/^(preflight|merge-gate|governance|stop-and-fix)\//.test(candidate) || /^(foreman|builder|session)-/.test(candidate)) {
      names.push(candidate);
    }
  }
  return unique(names).sort();
}

function extractWorkflowCheckNames() {
  const names = [];
  for (const file of listWorkflowFiles(workflowsDir)) {
    names.push(...extractWorkflowCheckNamesFromText(readText(file)));
  }
  return unique(names).sort();
}

function assertNoDuplicates(label, values, errors) {
  const seen = new Set();
  const duplicates = [];
  for (const value of values) {
    if (seen.has(value)) duplicates.push(value);
    seen.add(value);
  }
  if (duplicates.length > 0) {
    errors.push(`${label} contains duplicates: ${unique(duplicates).join(', ')}`);
  }
}

function validateAlignment({ manifestRequired, manifestWorkflowBacked, manifestMapped, foremanRequired, liveWorkflowNames, wave6Added }) {
  const errors = [];
  assertNoDuplicates('manifest.required_checks', manifestRequired, errors);
  assertNoDuplicates('Foreman merge_gate_interface.required_checks', foremanRequired, errors);

  const missingFromForeman = diff(manifestRequired, foremanRequired);
  const extraInForeman = diff(foremanRequired, manifestRequired);
  if (missingFromForeman.length > 0) errors.push(`Foreman required_checks missing manifest checks: ${missingFromForeman.join(', ')}`);
  if (extraInForeman.length > 0) errors.push(`Foreman required_checks contains checks absent from manifest: ${extraInForeman.join(', ')}`);

  const unmappedRequired = diff(manifestRequired, [...manifestWorkflowBacked, ...manifestMapped]);
  if (unmappedRequired.length > 0) errors.push(`Manifest required checks are neither workflow-backed nor mapped legacy/external: ${unmappedRequired.join(', ')}`);

  const mappedNotRequired = diff(manifestMapped, manifestRequired);
  if (mappedNotRequired.length > 0) errors.push(`Mapped legacy/external checks are not present in required_checks: ${mappedNotRequired.join(', ')}`);

  const workflowBackedNotRequired = diff(manifestWorkflowBacked, manifestRequired);
  if (workflowBackedNotRequired.length > 0) errors.push(`Workflow-backed checks are not present in required_checks: ${workflowBackedNotRequired.join(', ')}`);

  const missingLiveWorkflows = diff(manifestWorkflowBacked, liveWorkflowNames);
  if (missingLiveWorkflows.length > 0) errors.push(`Workflow-backed required checks are missing matching live workflow job names: ${missingLiveWorkflows.join(', ')}`);

  const wave6Missing = diff(wave6Added, manifestRequired);
  if (wave6Missing.length > 0) errors.push(`Wave 6 added checks are not in required_checks: ${wave6Missing.join(', ')}`);

  return errors;
}

function runCwtSelfTests() {
  const base = {
    manifestRequired: ['preflight/a', 'preflight/b', 'legacy/c'],
    manifestWorkflowBacked: ['preflight/a', 'preflight/b'],
    manifestMapped: ['legacy/c'],
    foremanRequired: ['preflight/a', 'preflight/b', 'legacy/c'],
    liveWorkflowNames: ['preflight/a', 'preflight/b'],
    wave6Added: ['preflight/b'],
  };

  const scenarios = [
    {
      id: 'happy-path-aligned-inventory',
      mutate: (ctx) => ctx,
      expectErrors: false,
    },
    {
      id: 'required-check-missing-from-foreman-fails',
      mutate: (ctx) => ({ ...ctx, foremanRequired: ['preflight/a', 'legacy/c'] }),
      expectErrors: true,
    },
    {
      id: 'extra-foreman-check-fails',
      mutate: (ctx) => ({ ...ctx, foremanRequired: [...ctx.foremanRequired, 'preflight/extra'] }),
      expectErrors: true,
    },
    {
      id: 'workflow-backed-check-missing-live-job-fails',
      mutate: (ctx) => ({ ...ctx, liveWorkflowNames: ['preflight/a'] }),
      expectErrors: true,
    },
    {
      id: 'unmapped-required-check-fails',
      mutate: (ctx) => ({ ...ctx, manifestRequired: [...ctx.manifestRequired, 'preflight/unmapped'] }),
      expectErrors: true,
    },
    {
      id: 'wave6-added-check-missing-from-required-list-fails',
      mutate: (ctx) => ({ ...ctx, wave6Added: ['preflight/not-required'] }),
      expectErrors: true,
    },
  ];

  let passed = 0;
  for (const scenario of scenarios) {
    const result = validateAlignment(scenario.mutate({ ...base }));
    const hasErrors = result.length > 0;
    if (hasErrors === scenario.expectErrors) {
      passed += 1;
      console.log(`CWT scenario PASS: ${scenario.id}`);
    } else {
      fail(`CWT scenario FAILED: ${scenario.id}; errors=${JSON.stringify(result)}`);
    }
  }

  const parsed = extractWorkflowCheckNamesFromText(`
jobs:
  quoted:
    name: "preflight/quoted"
  single:
    name: 'preflight/single'
  unquoted:
    name: preflight/unquoted
  irrelevant:
    name: Build app
`);
  const expected = ['preflight/quoted', 'preflight/single', 'preflight/unquoted'];
  const parseErrors = diff(expected, parsed);
  if (parseErrors.length > 0) {
    fail(`CWT parser scenario FAILED: missing parsed job names ${parseErrors.join(', ')}`);
  } else {
    passed += 1;
    console.log('CWT scenario PASS: quoted-and-unquoted-workflow-job-name-parser');
  }

  console.log(`CWT self-test scenarios passed: ${passed}/7`);
}

console.log('=== Merge Gate Required Checks Alignment ===');

if (process.env.WAVE6_ALIGNMENT_SELF_TEST === '1') {
  runCwtSelfTests();
}

const manifest = readJson(manifestPath);
const manifestRequired = manifest.required_checks || [];
const manifestWorkflowBacked = manifest.workflow_backed_required_checks || [];
const manifestMapped = Object.keys(manifest.mapped_legacy_or_external_required_checks || {});
const foremanRequired = extractForemanRequiredChecks();
const liveWorkflowNames = extractWorkflowCheckNames();
const wave6Added = manifest.wave6_added_required_checks || [];

console.log(`Manifest required checks: ${manifestRequired.length}`);
console.log(`Foreman required checks: ${foremanRequired.length}`);
console.log(`Manifest workflow-backed checks: ${manifestWorkflowBacked.length}`);
console.log(`Mapped legacy/external checks: ${manifestMapped.length}`);
console.log(`Live workflow check names discovered: ${liveWorkflowNames.length}`);

const errors = validateAlignment({ manifestRequired, manifestWorkflowBacked, manifestMapped, foremanRequired, liveWorkflowNames, wave6Added });
for (const error of errors) fail(error);

if (process.exitCode) {
  console.error('STOP_AND_FIX: Align .agent-admin/control/merge-gate-required-checks.json, .github/agents/foreman-v2-agent.md, and live workflow job names before declaring merge-gate parity.');
  process.exit(process.exitCode);
}

console.log('Required-check manifest, Foreman contract, and live workflow-backed gates are aligned for Wave 6.');
console.log('Mapped legacy/external checks remain tracked for Wave 7 validation.');
