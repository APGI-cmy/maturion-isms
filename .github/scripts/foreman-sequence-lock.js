#!/usr/bin/env node

/**
 * foreman-sequence-lock.js
 *
 * Validates the sequence integrity of FOREMAN_HANDOVER and CS2_MERGE_APPROVAL
 * payloads to ensure they arrive in the expected order and are bound to the
 * correct head SHA before any downstream merge or approval action is taken.
 */

const fs = require('fs');
const path = require('path');

const payloadArg = process.argv.find((arg, index, arr) => arr[index - 1] === '--payload');
const outArg = process.argv.find((arg, index, arr) => arr[index - 1] === '--output');

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

function readJsonInput() {
  const raw = payloadArg ? payloadArg : process.env.FOREMAN_SEQUENCE_PAYLOAD;
  if (!raw) {
    fail('No payload provided. Pass --payload <json> or set FOREMAN_SEQUENCE_PAYLOAD.');
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    const filePath = path.resolve(raw);
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (fileError) {
        fail(`Payload file is not valid JSON: ${filePath} — ${fileError.message}`);
      }
    }
    fail(`Payload is not valid JSON: ${e.message}`);
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

function assertHeadBound(payload) {
  const currentHead = (payload.current_head_sha || '').trim();
  const expectedHead = (payload.expected_head_sha || '').trim();
  const liveHead = (process.env.PR_HEAD_SHA || process.env.GITHUB_SHA || '').trim();

  if (!currentHead) {
    fail('Sequence lock: current_head_sha is required and must be a non-empty string');
  }
  if (!expectedHead) {
    fail('Sequence lock: expected_head_sha is required and must be a non-empty string');
  }
  if (currentHead !== expectedHead) {
    fail(`Sequence lock: current_head_sha (${currentHead}) does not match expected_head_sha (${expectedHead})`);
  }
  if (liveHead && currentHead !== liveHead) {
    fail(`Sequence lock: payload head (${currentHead}) does not match live head (${liveHead})`);
  }
  if (liveHead && expectedHead !== liveHead) {
    fail(`Sequence lock: expected_head_sha (${expectedHead}) does not match live head (${liveHead})`);
  }
}

function validateForemanHandover(payload) {
  ensureString(payload, 'batch_id');
  ensureString(payload, 'current_head_sha');
  ensureString(payload, 'expected_head_sha');
  ensureBoolean(payload, 'foreman_qp_pass');
  ensureBoolean(payload, 'iaa_prebrief_ready');
  ensureBoolean(payload, 'all_required_checks_green');

  if (!payload.foreman_qp_pass) {
    fail('Sequence lock: FOREMAN_HANDOVER blocked — foreman_qp_pass is false');
  }
  if (!payload.iaa_prebrief_ready) {
    fail('Sequence lock: FOREMAN_HANDOVER blocked — iaa_prebrief_ready is false');
  }
  if (!payload.all_required_checks_green) {
    fail('Sequence lock: FOREMAN_HANDOVER blocked — all_required_checks_green is false');
  }
}

function validateCs2MergeApproval(payload) {
  ensureString(payload, 'batch_id');
  ensureString(payload, 'current_head_sha');
  ensureString(payload, 'expected_head_sha');
  ensureBoolean(payload, 'merge_approved');
  ensureBoolean(payload, 'iaa_final_pass');
  ensureBoolean(payload, 'exact_head_binding_verified');
  ensureBoolean(payload, 'all_required_checks_green');

  if (!payload.merge_approved) {
    fail('Sequence lock: CS2_MERGE_APPROVAL blocked — merge_approved is false');
  }
  if (!payload.iaa_final_pass) {
    fail('Sequence lock: CS2_MERGE_APPROVAL blocked — iaa_final_pass is false');
  }
  if (!payload.exact_head_binding_verified) {
    fail('Sequence lock: CS2_MERGE_APPROVAL blocked — exact_head_binding_verified is false');
  }
  if (!payload.all_required_checks_green) {
    fail('Sequence lock: CS2_MERGE_APPROVAL blocked — all_required_checks_green is false');
  }
}

function main() {
  const payload = readJsonInput();

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    fail('Payload must be a JSON object');
  }

  const messageType = (payload.message_type || '').trim();
  if (!messageType) {
    fail('Sequence lock: message_type is required in payload');
  }

  assertHeadBound(payload);

  switch (messageType) {
    case 'FOREMAN_HANDOVER':
      validateForemanHandover(payload);
      break;
    case 'CS2_MERGE_APPROVAL':
      validateCs2MergeApproval(payload);
      break;
    default:
      fail(`Sequence lock: unsupported message_type '${messageType}'. Expected FOREMAN_HANDOVER or CS2_MERGE_APPROVAL.`);
  }

  const result = {
    ok: true,
    sequence_lock: 'PASS',
    message_type: messageType,
    batch_id: payload.batch_id || null,
    current_head_sha: payload.current_head_sha,
    expected_head_sha: payload.expected_head_sha,
    validated_at: new Date().toISOString(),
  };

  if (outArg) {
    fs.writeFileSync(path.resolve(outArg), JSON.stringify(result, null, 2));
    console.log(`Wrote sequence lock result to ${outArg}`);
  }

  console.log(JSON.stringify(result, null, 2));
}

main();
