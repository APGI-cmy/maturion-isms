#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const allowedTypes = new Set([
  'CS2_ASSIGNMENT',
  'FOREMAN_HANDOVER',
  'CS2_STOP_AND_FIX',
  'CS2_MERGE_APPROVAL',
  'CS2_POSTMERGE_HANDOVER',
]);

const payloadArg = process.argv.find((arg, index, arr) => arr[index - 1] === '--payload');
const typeArg = process.argv.find((arg, index, arr) => arr[index - 1] === '--type');
const headArg = process.argv.find((arg, index, arr) => arr[index - 1] === '--head-sha');
const outArg = process.argv.find((arg, index, arr) => arr[index - 1] === '--output');

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

function readJsonInput() {
  const rawFromArg = payloadArg ? payloadArg : process.env.CS2_FOREMAN_PAYLOAD;
  if (!rawFromArg) {
    if (process.stdin.isTTY) {
      return {};
    }
    const chunks = [];
    return new Promise((resolve, reject) => {
      process.stdin.on('data', (chunk) => chunks.push(chunk));
      process.stdin.on('end', () => {
        const text = chunks.join('');
        if (!text.trim()) return resolve({});
        try {
          resolve(JSON.parse(text));
        } catch (error) {
          reject(new Error(`Invalid JSON from STDIN: ${error.message}`));
        }
      });
      process.stdin.on('error', reject);
    });
  }

  try {
    return JSON.parse(rawFromArg);
  } catch (error) {
    const filePath = path.resolve(rawFromArg);
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (fileError) {
        fail(`Payload file is not valid JSON: ${filePath} — ${fileError.message}`);
      }
    }
    fail(`Payload is not valid JSON: ${error.message}`);
  }
}

function ensureObject(obj, context) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    fail(`${context} must be a JSON object`);
  }
}

function ensureString(obj, key) {
  if (typeof obj[key] !== 'string' || !obj[key].trim()) {
    fail(`Field '${key}' is required and must be a non-empty string`);
  }
}

function ensureBoolean(obj, key) {
  if (typeof obj[key] !== 'boolean') {
    fail(`Field '${key}' is required and must be boolean`);
  }
}

function ensureArrayWithStrings(obj, key) {
  if (!Array.isArray(obj[key]) || obj[key].length === 0 || obj[key].some((item) => typeof item !== 'string' || !item.trim())) {
    fail(`Field '${key}' is required and must be a non-empty array of strings`);
  }
}

function assertExactHead(payload, liveHead) {
  if (!liveHead) return;
  const current = (payload.current_head_sha || '').trim();
  const expected = (payload.expected_head_sha || '').trim();
  if (current && current !== liveHead) {
    fail(`Exact-head validation failed: current_head_sha (${current}) does not match live head (${liveHead})`);
  }
  if (expected && expected !== liveHead) {
    fail(`Exact-head validation failed: expected_head_sha (${expected}) does not match live head (${liveHead})`);
  }
}

async function main() {
  const payload = await readJsonInput();
  ensureObject(payload, 'payload');
  const explicitType = (typeArg || payload.message_type || payload.type || process.env.CS2_MESSAGE_TYPE || '').trim();
  if (!allowedTypes.has(explicitType)) {
    fail(`Unsupported message_type '${explicitType}'. Allowed: ${Array.from(allowedTypes).join(', ')}`);
  }

  payload.message_type = explicitType;

  const headSha = (headArg || process.env.PR_HEAD_SHA || process.env.GITHUB_SHA || '').trim();
  assertExactHead(payload, headSha);

  switch (explicitType) {
    case 'CS2_ASSIGNMENT': {
      ensureString(payload, 'batch_id');
      ensureString(payload, 'issue_id');
      ensureString(payload, 'triggered_by');
      ensureString(payload, 'target_agent');
      ensureString(payload, 'current_head_sha');
      ensureString(payload, 'expected_head_sha');
      ensureString(payload, 'scope');
      ensureObject(payload.gate_snapshot, 'gate_snapshot');
      ensureBoolean(payload, 'immediate_dispatch');
      break;
    }
    case 'FOREMAN_HANDOVER': {
      ensureString(payload, 'batch_id');
      ensureString(payload, 'current_head_sha');
      ensureString(payload, 'expected_head_sha');
      ensureBoolean(payload, 'foreman_qp_pass');
      ensureBoolean(payload, 'iaa_prebrief_ready');
      ensureBoolean(payload, 'all_required_checks_green');
      ensureBoolean(payload, 'builder_delegation_verified');
      ensureBoolean(payload, 'delegation_precedes_implementation');
      ensureObject(payload.gate_snapshot, 'gate_snapshot');
      if (!payload.foreman_qp_pass || !payload.iaa_prebrief_ready || !payload.all_required_checks_green) {
        fail('FOREMAN_HANDOVER is blocked until QP pass, IAA prebrief, and all required checks are green');
      }
      break;
    }
    case 'CS2_STOP_AND_FIX': {
      ensureString(payload, 'batch_id');
      ensureString(payload, 'current_head_sha');
      ensureString(payload, 'expected_head_sha');
      ensureString(payload, 'fix_reason');
      ensureString(payload, 'owner');
      ensureObject(payload.review_findings, 'review_findings');
      break;
    }
    case 'CS2_MERGE_APPROVAL': {
      ensureString(payload, 'batch_id');
      ensureString(payload, 'current_head_sha');
      ensureString(payload, 'expected_head_sha');
      ensureBoolean(payload, 'merge_approved');
      ensureBoolean(payload, 'iaa_final_pass');
      ensureBoolean(payload, 'exact_head_binding_verified');
      ensureBoolean(payload, 'all_required_checks_green');
      if (!payload.merge_approved || !payload.iaa_final_pass || !payload.exact_head_binding_verified || !payload.all_required_checks_green) {
        fail('CS2_MERGE_APPROVAL cannot be approved unless all hard gates are green');
      }
      break;
    }
    case 'CS2_POSTMERGE_HANDOVER': {
      ensureString(payload, 'batch_id');
      ensureString(payload, 'current_head_sha');
      ensureString(payload, 'expected_head_sha');
      ensureString(payload, 'handover_to');
      ensureString(payload, 'improvement_artifact');
      ensureString(payload, 'cwt_closure_report');
      ensureString(payload, 'cross_wave_validation_artifact');
      ensureArrayWithStrings(payload, 'validation_evidence');
      ensureArrayWithStrings(payload, 'compatibility_security_compliance_evidence');
      ensureObject(payload.evaluation, 'evaluation');
      ensureBoolean(payload.evaluation, 'cwt_complete');
      ensureBoolean(payload.evaluation, 'cross_wave_anti_regression_complete');
      ensureBoolean(payload.evaluation, 'compatibility_security_compliance_complete');
      ensureBoolean(payload.evaluation, 'post_delivery_validation_complete');
      if (
        !payload.evaluation.cwt_complete ||
        !payload.evaluation.cross_wave_anti_regression_complete ||
        !payload.evaluation.compatibility_security_compliance_complete ||
        !payload.evaluation.post_delivery_validation_complete
      ) {
        fail('CS2_POSTMERGE_HANDOVER cannot close until CWT, cross-wave anti-regression, and compatibility/security/compliance validation are all complete');
      }
      break;
    }
    default:
      fail(`Unhandled message_type '${explicitType}'`);
  }

  const result = {
    ok: true,
    message_type: explicitType,
    batch_id: payload.batch_id || null,
    current_head_sha: payload.current_head_sha || null,
    expected_head_sha: payload.expected_head_sha || null,
    validated_at: new Date().toISOString(),
    exact_head_bound:
      !!(payload.current_head_sha && payload.expected_head_sha && headSha) &&
      payload.current_head_sha === headSha &&
      payload.expected_head_sha === headSha,
  };

  if (outArg) {
    fs.writeFileSync(path.resolve(outArg), JSON.stringify(result, null, 2));
    console.log(`Wrote validation result to ${outArg}`);
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => fail(error.message));
