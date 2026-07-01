#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = process.cwd();
const requiredFiles = [
  '.agent-admin/control/merge-gate-required-checks.json',
  '.agent-admin/control/schemas/iaa-preflight-brief.schema.json',
  '.agent-admin/control/schemas/delegation-order.schema.json',
  '.agent-admin/control/schemas/handover-allowed.schema.json',
  '.agent-admin/control/schemas/ecap-admin-validation.schema.json',
  '.github/scripts/foreman-prehandover-lane-gate.js',
  '.github/scripts/delegation-order-gate.js',
  '.github/scripts/ecap-admin-boundary-gate.js',
  '.github/scripts/merge-gate-required-checks-alignment.js',
];

const scriptPaths = {
  delegation: path.join(repoRoot, '.github/scripts/delegation-order-gate.js'),
  prehandover: path.join(repoRoot, '.github/scripts/foreman-prehandover-lane-gate.js'),
  ecap: path.join(repoRoot, '.github/scripts/ecap-admin-boundary-gate.js'),
  mergeAlignment: path.join(repoRoot, '.github/scripts/merge-gate-required-checks-alignment.js'),
};

function fail(message) {
  console.error(`::error::${message}`);
  process.exitCode = 1;
}

function requireFile(relativePath) {
  const absolute = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolute)) {
    fail(`Required Wave 7 dependency missing: ${relativePath}`);
    return false;
  }
  return true;
}

function mkdirp(fileOrDir, isDir = false) {
  const dir = isDir ? fileOrDir : path.dirname(fileOrDir);
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(baseDir, relativePath, content) {
  const file = path.join(baseDir, relativePath);
  mkdirp(file);
  fs.writeFileSync(file, content);
}

function run(cmd, args, options = {}) {
  return spawnSync(cmd, args, {
    cwd: options.cwd || repoRoot,
    env: { ...process.env, ...(options.env || {}) },
    encoding: 'utf8',
  });
}

function runGit(cwd, args) {
  const result = run('git', args, { cwd });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

function createTempRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wave7-gate-fixture-'));
  runGit(dir, ['init']);
  runGit(dir, ['config', 'user.email', 'wave7@example.invalid']);
  runGit(dir, ['config', 'user.name', 'Wave 7 Fixture']);
  writeFile(dir, 'README.md', 'fixture repo\n');
  runGit(dir, ['add', '.']);
  runGit(dir, ['commit', '-m', 'base']);
  return dir;
}

function commitAll(cwd, message) {
  runGit(cwd, ['add', '.']);
  runGit(cwd, ['commit', '-m', message]);
  return runGit(cwd, ['rev-parse', 'HEAD']);
}

function hasImplementationFiles(files) {
  return files.some((file) => /^(src|app|lib|modules|packages|services|scripts|api|server|client|database|db)\//.test(file) || /\.(ts|tsx|js|jsx|py|go|rs|sql)$/.test(file));
}

function hasHandoverLanguage(text) {
  return /\b(handover|ready[- ]for[- ]review|merge[- ]ready|complete|completion)\b/i.test(text || '');
}

function validatePolicyScenario(scenario) {
  const findings = [];
  const implementationChanged = hasImplementationFiles(scenario.files_changed || []);
  const handoverClaimMade = hasHandoverLanguage(scenario.claim_text || '');

  if (implementationChanged) {
    if (!scenario.iaa_prebrief_ready) findings.push('IAA_PREBRIEF_MISSING: implementation changes require canonical IAA pre-brief before delegation.');
    if (!scenario.builder_delegation_recorded) findings.push('BUILDER_DELEGATION_MISSING: implementation changes require builder delegation evidence.');
    if (scenario.builder_delegation_recorded && !scenario.delegation_precedes_implementation) findings.push('RETROACTIVE_DELEGATION_BLOCKED: delegation must strictly predate first implementation commit.');
  }

  if (handoverClaimMade) {
    if (!scenario.handover_allowed_exists) findings.push('HANDOVER_ALLOWED_MISSING: handover/completion language requires handover-allowed.json.');
    else if (!scenario.handover_allowed_head_matches) findings.push('HANDOVER_ALLOWED_STALE: handover-allowed.json must match current PR head.');
    else if (!scenario.handover_allowed_true) findings.push('HANDOVER_ALLOWED_FALSE: handover gate exists but does not permit handover.');
  }

  if (scenario.ecap_required && !scenario.ecap_admin_validated) findings.push('ECAP_ADMIN_VALIDATION_MISSING: ECAP-required wave requires admin validation evidence.');
  if (scenario.required_checks_green === false) findings.push('REQUIRED_CHECKS_NOT_GREEN: required checks must be green at current HEAD before handover.');

  return { id: scenario.id, expected: scenario.expected, actual: findings.length === 0 ? 'PASS' : 'FAIL', findings };
}

const policyScenarios = [
  { id: 'S1-foreman-only-governance-doc-change-no-implementation-files', expected: 'PASS', files_changed: ['.agent-admin/control/overlays/example.md'], claim_text: 'governance documentation update only', iaa_prebrief_ready: true, builder_delegation_recorded: false, delegation_precedes_implementation: false, handover_allowed_exists: false, handover_allowed_head_matches: false, handover_allowed_true: false, ecap_required: false, ecap_admin_validated: false, required_checks_green: true },
  { id: 'S2-builder-implementation-change-valid-prebrief-and-ordered-delegation', expected: 'PASS', files_changed: ['modules/example/src/service.ts'], claim_text: 'implementation evidence recorded only', iaa_prebrief_ready: true, builder_delegation_recorded: true, delegation_precedes_implementation: true, handover_allowed_exists: false, handover_allowed_head_matches: false, handover_allowed_true: false, ecap_required: false, ecap_admin_validated: false, required_checks_green: true },
  { id: 'S3-implementation-change-missing-builder-delegation', expected: 'FAIL', files_changed: ['modules/example/src/service.ts'], claim_text: 'implementation evidence recorded only', iaa_prebrief_ready: true, builder_delegation_recorded: false, delegation_precedes_implementation: false, handover_allowed_exists: false, handover_allowed_head_matches: false, handover_allowed_true: false, ecap_required: false, ecap_admin_validated: false, required_checks_green: true },
  { id: 'S4-implementation-change-retroactive-delegation', expected: 'FAIL', files_changed: ['modules/example/src/service.ts'], claim_text: 'implementation evidence recorded only', iaa_prebrief_ready: true, builder_delegation_recorded: true, delegation_precedes_implementation: false, handover_allowed_exists: false, handover_allowed_head_matches: false, handover_allowed_true: false, ecap_required: false, ecap_admin_validated: false, required_checks_green: true },
  { id: 'S5-handover-language-without-handover-allowed-json', expected: 'FAIL', files_changed: ['.agent-workspace/foreman-v2/memory/PREHANDOVER-session-001.md'], claim_text: 'handover complete and ready-for-review', iaa_prebrief_ready: true, builder_delegation_recorded: false, delegation_precedes_implementation: false, handover_allowed_exists: false, handover_allowed_head_matches: false, handover_allowed_true: false, ecap_required: false, ecap_admin_validated: false, required_checks_green: true },
  { id: 'S6-stale-handover-allowed-head-mismatch', expected: 'FAIL', files_changed: ['.agent-workspace/foreman-v2/memory/PREHANDOVER-session-001.md'], claim_text: 'handover complete and ready-for-review', iaa_prebrief_ready: true, builder_delegation_recorded: false, delegation_precedes_implementation: false, handover_allowed_exists: true, handover_allowed_head_matches: false, handover_allowed_true: true, ecap_required: false, ecap_admin_validated: false, required_checks_green: true },
  { id: 'S7-ecap-admin-validation-missing-while-required', expected: 'FAIL', files_changed: ['.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-001.md'], claim_text: 'admin bundle handover complete', iaa_prebrief_ready: true, builder_delegation_recorded: false, delegation_precedes_implementation: false, handover_allowed_exists: true, handover_allowed_head_matches: true, handover_allowed_true: true, ecap_required: true, ecap_admin_validated: false, required_checks_green: true },
  { id: 'S8-iaa-prebrief-missing-for-implementation-change', expected: 'FAIL', files_changed: ['modules/example/src/service.ts'], claim_text: 'implementation evidence recorded only', iaa_prebrief_ready: false, builder_delegation_recorded: true, delegation_precedes_implementation: true, handover_allowed_exists: false, handover_allowed_head_matches: false, handover_allowed_true: false, ecap_required: false, ecap_admin_validated: false, required_checks_green: true },
  { id: 'S9-delegation-evidence-only-first-two-pass-lane-skipped', expected: 'PASS', files_changed: ['modules/example/src/service.ts', '.agent-admin/control/delegation-orders/pr-1800.json', '.agent-admin/builder-appointments/wave7-fixture.md'], claim_text: 'implementation evidence recorded only', iaa_prebrief_ready: true, builder_delegation_recorded: true, delegation_precedes_implementation: true, handover_allowed_exists: false, handover_allowed_head_matches: false, handover_allowed_true: false, ecap_required: false, ecap_admin_validated: false, required_checks_green: true },
  { id: 'S10-explicit-prehandover-intent-with-token-all-pass', expected: 'PASS', files_changed: ['.agent-workspace/foreman-v2/memory/PREHANDOVER-session-001.md'], claim_text: 'handover complete and ready-for-review', iaa_prebrief_ready: true, builder_delegation_recorded: true, delegation_precedes_implementation: true, handover_allowed_exists: true, handover_allowed_head_matches: true, handover_allowed_true: true, ecap_required: false, ecap_admin_validated: false, required_checks_green: true },
];

function expectGate(id, commandResult, expected) {
  const actual = commandResult.status === 0 ? 'PASS' : 'FAIL';
  if (actual !== expected) {
    fail(`REAL-GATE MISMATCH: ${id} expected=${expected} actual=${actual} stdout=${commandResult.stdout} stderr=${commandResult.stderr}`);
    return false;
  }
  console.log(`REAL-GATE PASS: ${id} expected=${expected} actual=${actual}`);
  return true;
}

function runDelegationFixture(id, mode, expected) {
  const dir = createTempRepo();
  const baseSha = runGit(dir, ['rev-parse', 'HEAD']);
  writeFile(dir, '.agent-admin/assurance/iaa-wave-record-test.md', '## PRE-BRIEF\nIAA_PREFLIGHT_BRIEF\n');
  const prebriefSha = commitAll(dir, 'prebrief');
  writeFile(dir, '.agent-admin/delegations/builder-appointment.md', 'builder appointed\n');
  const builderSha = commitAll(dir, 'builder appointment');
  writeFile(dir, 'modules/example/src/service.ts', 'export const ok = true;\n');
  const implSha = commitAll(dir, 'implementation');

  if (mode !== 'missing-control') {
    const retro = mode === 'retroactive';
    writeFile(dir, '.agent-admin/control/delegation-order.json', JSON.stringify({
      schema_version: '1.0.0',
      wave_id: 'wave7-fixture',
      pr_number: 1800,
      prebrief_commit_sha: prebriefSha,
      builder_appointment_timestamp: '2026-06-16T00:00:00Z',
      builder_appointment_commit_sha: retro ? implSha : builderSha,
      builder_agent: 'builder-fixture',
      builder_task_ref: 'wave7-fixture',
      first_implementation_commit_sha: implSha,
      qp_review_timestamp: '2026-06-16T01:00:00Z',
      result: 'DELEGATION_ORDER_VERIFIED',
    }, null, 2));
  }

  const result = run('node', [scriptPaths.delegation], {
    cwd: dir,
    env: { CHANGED_FILES: 'modules/example/src/service.ts', PR_BASE_SHA: baseSha, PR_HEAD_SHA: implSha },
  });
  return expectGate(id, result, expected);
}

function runPrehandoverFixture(id, mode, expected) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wave7-prehandover-fixture-'));
  const head = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  writeFile(dir, '.agent-workspace/foreman-v2/memory/PREHANDOVER-session-001.md', 'handover complete and ready-for-review\n');
  if (mode !== 'missing-control') {
    writeFile(dir, '.agent-admin/control/handover-allowed.json', JSON.stringify({
      schema_version: '1.0.0',
      wave_id: 'wave7-fixture',
      pr_number: 1800,
      current_head_sha: mode === 'stale-control' ? 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' : head,
      state: 'PRE_HANDOVER_GATE_PASS',
      handover_allowed: true,
      foreman_qp_pass: true,
      builder_delegation_verified: true,
      delegation_precedes_implementation: true,
      iaa_prebrief_ready: true,
      scope_current: true,
      ecap_required: mode === 'ecap-missing',
      ecap_admin_validated: mode !== 'ecap-missing',
      all_required_checks_green: true,
      iaa_final_required: true,
      blocking_findings: [],
    }, null, 2));
  }
  const changed = mode === 'ecap-missing'
    ? '.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-001.md'
    : '.agent-workspace/foreman-v2/memory/PREHANDOVER-session-001.md';
  if (mode === 'ecap-missing') writeFile(dir, changed, 'admin bundle handover complete\n');
  const result = run('node', [scriptPaths.prehandover], { cwd: dir, env: { CHANGED_FILES: changed, PR_HEAD_SHA: head } });
  return expectGate(id, result, expected);
}

function runPrehandoverImplementationOnlyFixture(id, expected) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wave7-prehandover-implementation-only-'));
  writeFile(dir, 'modules/example/src/service.ts', 'export const ok = true;\n');
  const result = run('node', [scriptPaths.prehandover], { cwd: dir, env: { CHANGED_FILES: 'modules/example/src/service.ts', PR_HEAD_SHA: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' } });
  return expectGate(id, result, expected);
}

function runPrehandoverDelegationEvidenceOnlyFixture(id, expected) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wave7-prehandover-delegation-only-'));
  writeFile(dir, 'modules/example/src/service.ts', 'export const ok = true;\n');
  writeFile(dir, '.agent-admin/control/delegation-orders/pr-1800.json', JSON.stringify({
    schema_version: '1.0.0',
    wave_id: 'wave7-fixture',
    pr_number: 1800,
    prebrief_commit_sha: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    builder_appointment_timestamp: '2026-06-16T00:00:00Z',
    builder_appointment_commit_sha: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    builder_agent: 'ui-builder',
    builder_task_ref: '.agent-admin/builder-appointments/wave7-fixture.md',
    first_implementation_commit_sha: 'cccccccccccccccccccccccccccccccccccccccc',
    qp_review_timestamp: '2026-06-16T01:00:00Z',
    result: 'DELEGATION_ORDER_VERIFIED',
  }, null, 2));
  writeFile(dir, '.agent-admin/builder-appointments/wave7-fixture.md', 'builder: ui-builder\n');
  const changed = [
    'modules/example/src/service.ts',
    '.agent-admin/control/delegation-orders/pr-1800.json',
    '.agent-admin/builder-appointments/wave7-fixture.md',
  ].join('\n');
  const result = run('node', [scriptPaths.prehandover], { cwd: dir, env: { CHANGED_FILES: changed, PR_HEAD_SHA: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' } });
  return expectGate(id, result, expected);
}

function runEcapFixture(id, mode, expected) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wave7-ecap-fixture-'));
  const file = '.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-001.md';
  const body = mode === 'valid'
    ? 'ecap_admin_validation:\n  substantive_readiness_judgment_made: false\n  iaa_invoked_by_ecap: false\n  foreman_qp_judgment_rewritten: false\n  admin_validation_result: ADMIN_VALIDATED\n'
    : 'ecap_admin_validation:\n  admin_validation_result: ADMIN_VALIDATED\n  substantive_readiness: READY\n';
  writeFile(dir, file, body);
  const result = run('node', [scriptPaths.ecap], { cwd: dir, env: { CHANGED_FILES: file } });
  return expectGate(id, result, expected);
}

console.log('=== Wave 7 Governance Validation Scenarios ===');
for (const file of requiredFiles) requireFile(file);

let policyExecuted = 0;
let policyPassed = 0;
for (const scenario of policyScenarios) {
  policyExecuted += 1;
  const result = validatePolicyScenario(scenario);
  const ok = result.actual === result.expected;
  if (ok) {
    policyPassed += 1;
    console.log(`POLICY-SCENARIO PASS: ${result.id} expected=${result.expected} actual=${result.actual}`);
  } else {
    fail(`POLICY-SCENARIO MISMATCH: ${result.id} expected=${result.expected} actual=${result.actual} findings=${result.findings.join(' | ')}`);
  }
  if (result.findings.length > 0) console.log(`  guidance: ${result.findings.join(' | ')}`);
}

let realGateExecuted = 0;
let realGatePassed = 0;
const realGateRuns = [
  () => runDelegationFixture('G1-delegation-valid-ordered-proof', 'valid', 'PASS'),
  () => runDelegationFixture('G2-delegation-missing-control', 'missing-control', 'FAIL'),
  () => runDelegationFixture('G3-delegation-retroactive-proof', 'retroactive', 'FAIL'),
  () => runPrehandoverImplementationOnlyFixture('G4-prehandover-implementation-only-no-claim', 'PASS'),
  () => runPrehandoverFixture('G5-handover-missing-control', 'missing-control', 'FAIL'),
  () => runPrehandoverFixture('G6-handover-stale-control', 'stale-control', 'FAIL'),
  () => runPrehandoverFixture('G7-ecap-required-admin-validation-missing', 'ecap-missing', 'FAIL'),
  () => runEcapFixture('G8-ecap-valid-admin-output', 'valid', 'PASS'),
  () => runEcapFixture('G9-ecap-readiness-overstep-output', 'overstep', 'FAIL'),
  () => runPrehandoverDelegationEvidenceOnlyFixture('G10-delegation-evidence-only-lane-skipped', 'PASS'),
  () => runPrehandoverFixture('G11-explicit-prehandover-with-valid-token', 'valid', 'PASS'),
  () => expectGate('G12-merge-required-check-alignment-current-branch', run('node', [scriptPaths.mergeAlignment], { cwd: repoRoot, env: { WAVE6_ALIGNMENT_SELF_TEST: '1' } }), 'PASS'),
];

for (const execute of realGateRuns) {
  realGateExecuted += 1;
  if (execute()) realGatePassed += 1;
}

console.log(`Policy scenarios executed: ${policyExecuted}`);
console.log(`Policy scenarios matched expectation: ${policyPassed}`);
console.log(`Real gate fixtures executed: ${realGateExecuted}`);
console.log(`Real gate fixtures matched expectation: ${realGatePassed}`);

if (process.exitCode) {
  console.error('STOP_AND_FIX: Wave 7 governance validation scenario mismatch. Fix validation logic or upstream gates before final readiness.');
  process.exit(process.exitCode);
}

console.log('Wave 7 governance validation scenarios and real-gate fixtures all matched expected pass/fail behavior.');
