#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

function hasImplementationFiles(files) {
  return files.some((file) => /^(src|app|lib|modules|packages|services|scripts|api|server|client|database|db)\//.test(file) || /\.(ts|tsx|js|jsx|py|go|rs|sql)$/.test(file));
}

function hasHandoverLanguage(text) {
  return /\b(handover|ready[- ]for[- ]review|merge[- ]ready|complete|completion)\b/i.test(text || '');
}

function validateScenario(scenario) {
  const findings = [];
  const implementationChanged = hasImplementationFiles(scenario.files_changed || []);
  const handoverClaimMade = hasHandoverLanguage(scenario.claim_text || '');

  if (implementationChanged) {
    if (!scenario.iaa_prebrief_ready) {
      findings.push('IAA_PREBRIEF_MISSING: implementation changes require canonical IAA pre-brief before delegation.');
    }
    if (!scenario.builder_delegation_recorded) {
      findings.push('BUILDER_DELEGATION_MISSING: implementation changes require builder delegation evidence.');
    }
    if (scenario.builder_delegation_recorded && !scenario.delegation_precedes_implementation) {
      findings.push('RETROACTIVE_DELEGATION_BLOCKED: delegation must strictly predate first implementation commit.');
    }
  }

  if (handoverClaimMade) {
    if (!scenario.handover_allowed_exists) {
      findings.push('HANDOVER_ALLOWED_MISSING: handover/completion language requires handover-allowed.json.');
    } else if (!scenario.handover_allowed_head_matches) {
      findings.push('HANDOVER_ALLOWED_STALE: handover-allowed.json must match current PR head.');
    } else if (!scenario.handover_allowed_true) {
      findings.push('HANDOVER_ALLOWED_FALSE: handover gate exists but does not permit handover.');
    }
  }

  if (scenario.ecap_required && !scenario.ecap_admin_validated) {
    findings.push('ECAP_ADMIN_VALIDATION_MISSING: ECAP-required wave requires admin validation evidence.');
  }

  if (scenario.required_checks_green === false) {
    findings.push('REQUIRED_CHECKS_NOT_GREEN: required checks must be green at current HEAD before handover.');
  }

  return {
    id: scenario.id,
    expected: scenario.expected,
    actual: findings.length === 0 ? 'PASS' : 'FAIL',
    findings,
  };
}

const scenarios = [
  {
    id: 'S1-foreman-only-governance-doc-change-no-implementation-files',
    expected: 'PASS',
    files_changed: ['.agent-admin/control/overlays/example.md', '.agent-workspace/foreman-v2/knowledge/example.md'],
    claim_text: 'governance documentation update; no handover claim',
    iaa_prebrief_ready: true,
    builder_delegation_recorded: false,
    delegation_precedes_implementation: false,
    handover_allowed_exists: false,
    handover_allowed_head_matches: false,
    handover_allowed_true: false,
    ecap_required: false,
    ecap_admin_validated: false,
    required_checks_green: true,
  },
  {
    id: 'S2-builder-implementation-change-valid-prebrief-and-ordered-delegation',
    expected: 'PASS',
    files_changed: ['src/service.ts'],
    claim_text: 'implementation evidence only; no handover claim yet',
    iaa_prebrief_ready: true,
    builder_delegation_recorded: true,
    delegation_precedes_implementation: true,
    handover_allowed_exists: false,
    handover_allowed_head_matches: false,
    handover_allowed_true: false,
    ecap_required: false,
    ecap_admin_validated: false,
    required_checks_green: true,
  },
  {
    id: 'S3-implementation-change-missing-builder-delegation',
    expected: 'FAIL',
    files_changed: ['src/service.ts'],
    claim_text: 'implementation evidence only; no handover claim yet',
    iaa_prebrief_ready: true,
    builder_delegation_recorded: false,
    delegation_precedes_implementation: false,
    handover_allowed_exists: false,
    handover_allowed_head_matches: false,
    handover_allowed_true: false,
    ecap_required: false,
    ecap_admin_validated: false,
    required_checks_green: true,
  },
  {
    id: 'S4-implementation-change-retroactive-delegation',
    expected: 'FAIL',
    files_changed: ['src/service.ts'],
    claim_text: 'implementation evidence only; no handover claim yet',
    iaa_prebrief_ready: true,
    builder_delegation_recorded: true,
    delegation_precedes_implementation: false,
    handover_allowed_exists: false,
    handover_allowed_head_matches: false,
    handover_allowed_true: false,
    ecap_required: false,
    ecap_admin_validated: false,
    required_checks_green: true,
  },
  {
    id: 'S5-handover-language-without-handover-allowed-json',
    expected: 'FAIL',
    files_changed: ['.agent-workspace/foreman-v2/memory/PREHANDOVER-session-001.md'],
    claim_text: 'handover complete and ready-for-review',
    iaa_prebrief_ready: true,
    builder_delegation_recorded: false,
    delegation_precedes_implementation: false,
    handover_allowed_exists: false,
    handover_allowed_head_matches: false,
    handover_allowed_true: false,
    ecap_required: false,
    ecap_admin_validated: false,
    required_checks_green: true,
  },
  {
    id: 'S6-stale-handover-allowed-head-mismatch',
    expected: 'FAIL',
    files_changed: ['.agent-workspace/foreman-v2/memory/PREHANDOVER-session-001.md'],
    claim_text: 'handover complete and ready-for-review',
    iaa_prebrief_ready: true,
    builder_delegation_recorded: false,
    delegation_precedes_implementation: false,
    handover_allowed_exists: true,
    handover_allowed_head_matches: false,
    handover_allowed_true: true,
    ecap_required: false,
    ecap_admin_validated: false,
    required_checks_green: true,
  },
  {
    id: 'S7-ecap-admin-validation-missing-while-required',
    expected: 'FAIL',
    files_changed: ['.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-001.md'],
    claim_text: 'admin bundle handover complete',
    iaa_prebrief_ready: true,
    builder_delegation_recorded: false,
    delegation_precedes_implementation: false,
    handover_allowed_exists: true,
    handover_allowed_head_matches: true,
    handover_allowed_true: true,
    ecap_required: true,
    ecap_admin_validated: false,
    required_checks_green: true,
  },
  {
    id: 'S8-iaa-prebrief-missing-for-implementation-change',
    expected: 'FAIL',
    files_changed: ['src/service.ts'],
    claim_text: 'implementation evidence only; no handover claim yet',
    iaa_prebrief_ready: false,
    builder_delegation_recorded: true,
    delegation_precedes_implementation: true,
    handover_allowed_exists: false,
    handover_allowed_head_matches: false,
    handover_allowed_true: false,
    ecap_required: false,
    ecap_admin_validated: false,
    required_checks_green: true,
  },
];

console.log('=== Wave 7 Governance Validation Scenarios ===');
for (const file of requiredFiles) requireFile(file);

let executed = 0;
let passed = 0;
const results = [];
for (const scenario of scenarios) {
  executed += 1;
  const result = validateScenario(scenario);
  results.push(result);
  const ok = result.actual === result.expected;
  if (ok) {
    passed += 1;
    console.log(`SCENARIO PASS: ${result.id} expected=${result.expected} actual=${result.actual}`);
  } else {
    fail(`SCENARIO MISMATCH: ${result.id} expected=${result.expected} actual=${result.actual} findings=${result.findings.join(' | ')}`);
  }
  if (result.findings.length > 0) {
    console.log(`  guidance: ${result.findings.join(' | ')}`);
  }
}

console.log(`Wave 7 scenarios executed: ${executed}`);
console.log(`Wave 7 scenarios matched expectation: ${passed}`);

if (process.exitCode) {
  console.error('STOP_AND_FIX: Wave 7 governance validation scenario mismatch. Fix validation logic or upstream gates before final readiness.');
  process.exit(process.exitCode);
}

console.log('Wave 7 governance validation scenarios all matched expected pass/fail behavior.');
