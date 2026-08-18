#!/usr/bin/env node
'use strict';

const crypto = require('crypto');

const MARKER = '<!-- foreman-prehandover-lane-gate-consumer -->';
const VALID_DECISIONS = new Set(['FOREMAN_STOP_AND_FIX', 'CS2_ESCALATION_REQUIRED']);

function fail(message) {
  throw new Error(message);
}

function isSha(value) {
  return typeof value === 'string' && /^[a-f0-9]{40}$/i.test(value);
}

function validateTrigger(payload, { sourceRunId, sourceWorkflow, prNumber, headSha }) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) fail('artifact payload must be an object');
  if (payload.schema_version !== '1.0.0') fail('artifact schema_version must be 1.0.0');
  if (payload.source !== 'foreman-prehandover-lane-gate') fail('artifact source is not foreman-prehandover-lane-gate');
  if (payload.trigger !== 'PRE_HANDOVER_CHECKPOINT') fail('artifact trigger is unsupported');
  if (payload.action !== '/prepare-handover') fail('artifact action is unsupported');
  if (!VALID_DECISIONS.has(payload.decision)) fail('artifact decision is unsupported');
  if (typeof payload.reason !== 'string' || !payload.reason.trim()) fail('artifact reason is missing');
  if (!Number.isInteger(payload.pr_number) || payload.pr_number !== Number(prNumber)) fail('artifact PR identity does not match source run');
  if (!isSha(payload.pr_head_sha) || payload.pr_head_sha !== headSha) fail('artifact head SHA does not match current PR head');
  if (String(payload.source_run_id || '') !== String(sourceRunId)) fail('artifact source run ID does not match workflow_run event');
  if (payload.source_workflow !== sourceWorkflow) fail('artifact source workflow does not match workflow_run event');
  if (!isSha(payload.workflow_sha)) fail('artifact workflow SHA is malformed');
  return payload;
}

function idempotencyKey(payload) {
  const data = [payload.pr_number, payload.pr_head_sha, payload.decision].join(':');
  return crypto.createHash('sha256').update(data).digest('hex');
}

function renderReviewEvent(payload) {
  const key = idempotencyKey(payload);
  const route = payload.decision === 'FOREMAN_STOP_AND_FIX'
    ? 'Foreman must stop the handover claim, correct the listed lane-gate defect, and rerun the current-head checkpoint.'
    : 'CS2 review is required before further authority-bound governance action. This event does not authorize or impersonate a CS2 decision.';
  const reason = String(payload.reason)
    .replace(/[\r\n]+/g, ' ')
    .replace(/@/g, '@\u200b')
    .replace(/`/g, "'")
    .slice(0, 500);
  return [
    MARKER,
    '<!-- bounded-review-event -->',
    `<!-- idempotency-key: ${key} -->`,
    '## Pre-handover lane-gate review event',
    '',
    `- **Decision:** \`${payload.decision}\``,
    `- **PR:** #${payload.pr_number}`,
    `- **Head SHA:** \`${payload.pr_head_sha}\``,
    `- **Source workflow run:** \`${payload.source_run_id}\``,
    `- **Idempotency key:** \`${key}\``,
    `- **Reason:** \`${reason}\``,
    '',
    `**Bounded action:** ${route}`,
    '',
    'This event creates no merge, no work session, and no autonomous remediation.',
  ].join('\n');
}

module.exports = { MARKER, idempotencyKey, renderReviewEvent, validateTrigger };
