#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONSUMER="${SCRIPT_DIR}/foreman-prehandover-lane-gate-consumer.js"
WORKFLOW="${SCRIPT_DIR}/../workflows/foreman-prehandover-lane-gate-consumer.yml"

node - "$CONSUMER" "$WORKFLOW" <<'NODE'
const assert = require('assert');
const consumer = require(process.argv[2]);
const fs = require('fs');
const workflow = fs.readFileSync(process.argv[3], 'utf8');

const payload = {
  schema_version: '1.0.0',
  source: 'foreman-prehandover-lane-gate',
  decision: 'FOREMAN_STOP_AND_FIX',
  reason: 'missing handover control',
  pr_number: 42,
  pr_head_sha: 'a'.repeat(40),
  workflow_sha: 'b'.repeat(40),
  source_run_id: '12345',
  source_workflow: 'Foreman Pre-Handover Lane Gate',
};

const validated = consumer.validateTrigger(payload, {
  sourceRunId: '12345',
  sourceWorkflow: 'Foreman Pre-Handover Lane Gate',
  prNumber: 42,
  headSha: 'a'.repeat(40),
});
const key = consumer.idempotencyKey(validated);
assert.match(key, /^[a-f0-9]{64}$/);
assert.match(consumer.renderReviewEvent(validated), /Foreman must stop/);
const rerun = consumer.validateTrigger({ ...payload, source_run_id: '67890' }, {
  sourceRunId: '67890',
  sourceWorkflow: 'Foreman Pre-Handover Lane Gate',
  prNumber: 42,
  headSha: 'a'.repeat(40),
});
assert.strictEqual(consumer.idempotencyKey(rerun), key);
assert.match(consumer.renderReviewEvent(rerun), /Source workflow run:\*\* `67890`/);
assert.throws(
  () => consumer.validateTrigger({ ...payload, pr_head_sha: 'c'.repeat(40) }, {
    sourceRunId: '12345', sourceWorkflow: 'Foreman Pre-Handover Lane Gate', prNumber: 42, headSha: 'a'.repeat(40),
  }),
  /head SHA/,
);
assert.throws(
  () => consumer.validateTrigger({ ...payload, decision: 'UNKNOWN' }, {
    sourceRunId: '12345', sourceWorkflow: 'Foreman Pre-Handover Lane Gate', prNumber: 42, headSha: 'a'.repeat(40),
  }),
  /decision/,
);
assert.match(
  consumer.renderReviewEvent({ ...payload, decision: 'CS2_ESCALATION_REQUIRED' }),
  /does not authorize or impersonate a CS2 decision/,
);
assert.match(
  workflow,
  /concurrency:\s*\n\s+group: foreman-prehandover-lane-gate-\$\{\{ github\.event\.workflow_run\.pull_requests\[0\]\.number \}\}-\$\{\{ github\.event\.workflow_run\.head_sha \}\}/,
);
assert.match(workflow, /cancel-in-progress: false/);
console.log('Foreman lane-gate consumer regression suite passed.');
NODE
