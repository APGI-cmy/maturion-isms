'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REGISTER_MARKER = '<!-- pit-cs2-work-register:v1 -->';
const FOREMAN_DISPATCH_MARKER = '<!-- pit-cs2-foreman-dispatch:v1 -->';
const FOREMAN_NOMINATION_MARKER = '<!-- pit-cs2-foreman-nominate:v1 -->';
const PR_BOUND_MARKER = '<!-- pit-cs2-pr-bound:v1 -->';
const CONTROLLER_LOGIN = 'github-actions[bot]';
const FOREMAN_LOGIN = 'Copilot';
const PILOT_CS2_LOGIN = 'APGI-cmy';
const LIST_PAGE_SIZE = 100;
const ACTIVE_STATES = new Set([
  'intake', 'foreman', 'builder', 'qp', 'ecap', 'iaa', 'cs2_review', 'awaiting_human',
]);
const WORK_ITEM_PATTERN = /^CS2-Work-Item:\s*(pit-issue-\d+)\s*$/mi;
const WORK_REGISTER_SCHEMA = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'cs2-controller', 'work-register.schema.json'),
  'utf8',
));

// ---------------------------------------------------------------------------
// W0 safety envelope and decision-record containment
// (GOVERNANCE_FAILURE_OUTENGINEERING_STRATEGY.md Sections 5.1 and 5.2).
//
// This section implements only the frozen W0-2053 design/test surface:
//   - a versioned, machine-validatable safety-envelope schema and validator;
//   - a versioned, machine-validatable decision-record schema and validator;
//   - fail-closed evaluation of the safety envelope and its exact approved
//     limits (1 active work item, 1 material remediation attempt, a 30-minute
//     dispatch ceiling, a 2-hour total runtime ceiling, runtime-only spend);
//   - a human-CS2-only circuit-breaker reset and an independently invocable
//     human kill switch that blocks dispatch, retry, merge and successor
//     release while preserving evidence;
//   - a deterministic decision-record builder with a typed unknown-state
//     refusal, and an idempotent trip-event recorder that emits exactly one
//     typed LOOP_BREAK/BUDGET_TRIP per qualifying condition; and
//   - an in-process, no-live-spend 24-hour simulation harness.
//
// `maximum_stage_attempts`, `maximum_merge_attempts`, and `expiry` remain
// required safety-envelope fields but are proposal-only: none of them carries
// a schema `const`/`default`, and no function below reads `maximum_stage_attempts`
// for enforcement. `maximum_merge_attempts`/`expiry` are explicitly-tagged
// `{ status: 'proposed' | 'approved_active', value? }` objects, so a human-CS2
// decision must explicitly activate either field; neither is ever silently
// defaulted to an active limit. No merge authority, live merge action, or
// successor dispatch is activated by this module.
// ---------------------------------------------------------------------------

const SAFETY_ENVELOPE_SCHEMA = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'cs2-controller', 'safety-envelope.schema.json'),
  'utf8',
));
const DECISION_RECORD_SCHEMA = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'cs2-controller', 'decision-record.schema.json'),
  'utf8',
));

const W0_SAFETY_ENVELOPE_FIELDS = [
  'work_item_id', 'approved_paths', 'approved_agents', 'maximum_active_jobs',
  'maximum_stage_attempts', 'maximum_remediation_attempts', 'maximum_dispatch_runtime',
  'maximum_total_runtime', 'maximum_spend', 'maximum_merge_attempts', 'expiry',
  'circuit_breaker_state', 'reset_authority', 'kill_switch_state',
];

const W0_KNOWN_DECISION_STATES = new Set([...ACTIVE_STATES, 'closed']);

function initialRegister({ issueNumber, repository }) {
  return {
    register_version: '1.0.0',
    work_item_id: `pit-issue-${issueNumber}`,
    repository,
    module: 'PIT',
    issue_number: issueNumber,
    pr_number: null,
    nominated_pr: null,
    submission_head: null,
    state: 'foreman',
    next_action: 'FOREMAN_BOOTSTRAP_AND_IAA_PREBRIEF',
    correction_count: 0,
    max_corrections: 1,
    human_approval: {
      scope_expansion: { status: 'not_requested', recorded_by: null },
      merge: { status: 'not_requested', recorded_by: null },
    },
    last_processed: { head_sha: null, comment_id: null, review_id: null },
  };
}

function renderRegister(register) {
  return `${REGISTER_MARKER}\n\n\`\`\`json\n${JSON.stringify(register, null, 2)}\n\`\`\``;
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function schemaTypeMatches(value, expected) {
  const types = Array.isArray(expected) ? expected : [expected];
  return types.some((type) => {
    if (type === 'null') return value === null;
    if (type === 'integer') return Number.isInteger(value);
    if (type === 'object') return isObject(value);
    return typeof value === type;
  });
}

function validateAgainstSchema(value, schema, at = 'register') {
  if (schema.type && !schemaTypeMatches(value, schema.type)) {
    throw new Error(`${at} must match type ${JSON.stringify(schema.type)}.`);
  }
  if (schema.const !== undefined && value !== schema.const) {
    throw new Error(`${at} must equal ${JSON.stringify(schema.const)}.`);
  }
  if (schema.enum && !schema.enum.includes(value)) {
    throw new Error(`${at} must be one of ${schema.enum.join(', ')}.`);
  }
  if (schema.pattern && typeof value === 'string' && !(new RegExp(schema.pattern).test(value))) {
    throw new Error(`${at} does not match required pattern.`);
  }
  if (schema.minLength !== undefined && typeof value === 'string' && value.length < schema.minLength) {
    throw new Error(`${at} must be at least ${schema.minLength} characters.`);
  }
  if (schema.minimum !== undefined && typeof value === 'number' && value < schema.minimum) {
    throw new Error(`${at} must be >= ${schema.minimum}.`);
  }
  if (schema.maximum !== undefined && typeof value === 'number' && value > schema.maximum) {
    throw new Error(`${at} must be <= ${schema.maximum}.`);
  }
  if (schema.properties && isObject(value)) {
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(schema.properties, key)) {
          throw new Error(`${at}.${key} is not allowed.`);
        }
      }
    }
    for (const key of schema.required || []) {
      if (!Object.hasOwn(value, key)) {
        throw new Error(`${at}.${key} is required.`);
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties)) {
      if (Object.hasOwn(value, key)) {
        validateAgainstSchema(value[key], childSchema, `${at}.${key}`);
      }
    }
  }
}

function validateRegister(register) {
  validateAgainstSchema(register, WORK_REGISTER_SCHEMA);
  return register;
}

function parseRegister(body) {
  if (!body || !body.includes(REGISTER_MARKER)) return null;
  const match = body.match(/<!-- pit-cs2-work-register:v1 -->\s*```json\s*([\s\S]*?)\s*```/);
  if (!match) throw new Error('PIT work-register marker does not contain JSON.');
  return validateRegister(JSON.parse(match[1]));
}

function isActive(register) {
  return ACTIVE_STATES.has(register.state);
}

// ---------------------------------------------------------------------------
// W0 schema validation interface (error-collecting, non-throwing)
//
// `validateAgainstSchema` above is intentionally throw-on-first-error and is
// reserved for the pre-existing work-register use. The W0 safety-envelope and
// decision-record validators below never throw: they collect every violation
// into a typed `errors` array and return `{ valid, errors }`, so a caller can
// fail closed on a schema-invalid envelope/record without an uncaught
// exception, and so a human/evidence trail can see every violation, not just
// the first one.
// ---------------------------------------------------------------------------

function w0SchemaTypeMatches(value, expected) {
  const types = Array.isArray(expected) ? expected : [expected];
  return types.some((type) => {
    if (type === 'null') return value === null;
    if (type === 'integer') return Number.isInteger(value);
    if (type === 'array') return Array.isArray(value);
    if (type === 'object') return isObject(value);
    return typeof value === type;
  });
}

function collectSchemaValidationErrors(value, schema, at, errors) {
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${at} must be one of [${schema.enum.join(', ')}]; received ${JSON.stringify(value)}.`);
    return;
  }
  if (Object.hasOwn(schema, 'const') && JSON.stringify(value) !== JSON.stringify(schema.const)) {
    errors.push(`${at} must equal ${JSON.stringify(schema.const)}; received ${JSON.stringify(value)}.`);
    return;
  }
  if (schema.type && !w0SchemaTypeMatches(value, schema.type)) {
    errors.push(`${at} must match type ${JSON.stringify(schema.type)}; received ${JSON.stringify(value)}.`);
    return;
  }
  if (schema.pattern && typeof value === 'string' && !(new RegExp(schema.pattern).test(value))) {
    errors.push(`${at} does not match required pattern ${schema.pattern}.`);
  }
  if (schema.minLength !== undefined && typeof value === 'string' && value.length < schema.minLength) {
    errors.push(`${at} must be at least ${schema.minLength} characters.`);
  }
  if (schema.minimum !== undefined && typeof value === 'number' && value < schema.minimum) {
    errors.push(`${at} must be >= ${schema.minimum}.`);
  }
  if (schema.maximum !== undefined && typeof value === 'number' && value > schema.maximum) {
    errors.push(`${at} must be <= ${schema.maximum}.`);
  }
  if (Array.isArray(value) && schema.items) {
    value.forEach((item, index) => collectSchemaValidationErrors(item, schema.items, `${at}[${index}]`, errors));
  }
  if (schema.properties && isObject(value)) {
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(schema.properties, key)) {
          errors.push(`${at}.${key} is not an allowed property.`);
        }
      }
    }
    for (const key of schema.required || []) {
      if (!Object.hasOwn(value, key)) {
        errors.push(`${at}.${key} is required.`);
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties)) {
      if (Object.hasOwn(value, key)) {
        collectSchemaValidationErrors(value[key], childSchema, `${at}.${key}`, errors);
      }
    }
  }
}

function validateSafetyEnvelopeAgainstSchema(envelope) {
  const errors = [];
  if (envelope === null || envelope === undefined) {
    errors.push('safety_envelope is required.');
    return { valid: false, errors };
  }
  collectSchemaValidationErrors(envelope, SAFETY_ENVELOPE_SCHEMA, 'safety_envelope', errors);
  return { valid: errors.length === 0, errors };
}

function validateDecisionRecordAgainstSchema(record) {
  const errors = [];
  if (record === null || record === undefined) {
    errors.push('decision_record is required.');
    return { valid: false, errors };
  }
  collectSchemaValidationErrors(record, DECISION_RECORD_SCHEMA, 'decision_record', errors);
  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// W0 fail-closed safety-envelope evaluation (Strategy Section 5.1)
// ---------------------------------------------------------------------------

function isMeasurableRuntime(runtime) {
  return isObject(runtime)
    && runtime.unit === 'seconds'
    && typeof runtime.value === 'number'
    && Number.isFinite(runtime.value);
}

function envelopeLimitsAreMeasurable(envelope) {
  return isMeasurableRuntime(envelope.maximum_dispatch_runtime)
    && isMeasurableRuntime(envelope.maximum_total_runtime)
    && Number.isInteger(envelope.maximum_active_jobs)
    && Number.isInteger(envelope.maximum_remediation_attempts);
}

function evaluateSafetyEnvelope(envelope, taskRecord, now) {
  if (envelope === null || envelope === undefined) {
    return { decision: 'STOP_AND_FIX', reason_code: 'ENVELOPE_MISSING' };
  }
  for (const field of W0_SAFETY_ENVELOPE_FIELDS) {
    if (!Object.hasOwn(envelope, field)) {
      return { decision: 'STOP_AND_FIX', reason_code: 'ENVELOPE_MALFORMED' };
    }
  }
  if (envelope.kill_switch_state === 'triggered') {
    return { decision: 'STOP_AND_FIX', reason_code: 'KILL_SWITCH_TRIGGERED' };
  }
  if (!taskRecord || envelope.work_item_id !== taskRecord.work_item_id) {
    return { decision: 'STOP_AND_FIX', reason_code: 'ENVELOPE_TASK_INCONSISTENT' };
  }
  if (!envelopeLimitsAreMeasurable(envelope)) {
    return { decision: 'STOP_AND_FIX', reason_code: 'ENVELOPE_LIMIT_UNMEASURABLE' };
  }
  const schemaResult = validateSafetyEnvelopeAgainstSchema(envelope);
  if (!schemaResult.valid) {
    return { decision: 'STOP_AND_FIX', reason_code: 'ENVELOPE_SCHEMA_INVALID' };
  }
  if (isObject(envelope.expiry) && envelope.expiry.status === 'approved_active') {
    const expiryTime = new Date(envelope.expiry.value).getTime();
    if (Number.isNaN(expiryTime)) {
      return { decision: 'STOP_AND_FIX', reason_code: 'ENVELOPE_LIMIT_UNMEASURABLE' };
    }
    if (expiryTime < now.getTime()) {
      return { decision: 'STOP_AND_FIX', reason_code: 'ENVELOPE_EXPIRED' };
    }
  }
  return { decision: 'ALLOW', reason_code: 'NONE' };
}

// ---------------------------------------------------------------------------
// W0 exact-limit enforcement and runtime-only spend control
// ---------------------------------------------------------------------------

function enforceWorkItemLimits(usage, envelope) {
  if (typeof usage.active_work_items === 'number'
    && usage.active_work_items > envelope.maximum_active_jobs) {
    return { decision: 'STOP_AND_FIX', reason_code: 'ACTIVE_WORK_ITEM_LIMIT_EXCEEDED' };
  }
  if (typeof usage.remediation_attempts === 'number'
    && usage.remediation_attempts > envelope.maximum_remediation_attempts) {
    return { decision: 'STOP_AND_FIX', reason_code: 'REMEDIATION_ATTEMPT_LIMIT_EXCEEDED' };
  }
  if (typeof usage.dispatch_runtime_seconds === 'number'
    && usage.dispatch_runtime_seconds > envelope.maximum_dispatch_runtime.value) {
    return { decision: 'STOP_AND_FIX', reason_code: 'DISPATCH_RUNTIME_EXCEEDED' };
  }
  if (typeof usage.total_runtime_seconds === 'number'
    && usage.total_runtime_seconds > envelope.maximum_total_runtime.value) {
    return { decision: 'STOP_AND_FIX', reason_code: 'TOTAL_RUNTIME_EXCEEDED' };
  }
  return { decision: 'ALLOW', reason_code: 'NONE' };
}

function enforceSpendControl(spend, envelope) {
  if (!spend || spend.mode !== 'runtime_only') {
    throw new Error(`W0 spend control is runtime-only; refusing spend mode ${spend && spend.mode}.`);
  }
  if (!envelope || !envelope.maximum_spend || envelope.maximum_spend.mode !== 'runtime_only') {
    throw new Error('W0 safety envelope does not authorise runtime-only spend.');
  }
  return { decision: 'ALLOW', reason_code: 'NONE' };
}

// ---------------------------------------------------------------------------
// W0 human-CS2-only circuit-breaker reset (Strategy Section 5.1)
// ---------------------------------------------------------------------------

function resetCircuitBreaker(state, resetRequest) {
  const isHumanCs2Reset = Boolean(resetRequest)
    && resetRequest.source === 'human_cs2'
    && resetRequest.actor
    && resetRequest.actor.type === 'User'
    && resetRequest.actor.login === PILOT_CS2_LOGIN;
  if (isHumanCs2Reset) {
    return { circuit_breaker_state: 'closed', decision: 'ALLOW' };
  }
  return {
    circuit_breaker_state: state ? state.circuit_breaker_state : 'tripped',
    decision: 'STOP_AND_FIX',
  };
}

// ---------------------------------------------------------------------------
// W0 independently invocable human kill switch (Strategy Section 5.1)
//
// `invokeKillSwitch` is a standalone entrypoint: it requires no active job,
// dispatch context, or agent run, and only a human-CS2-attributed request can
// move `kill_switch_state` from 'armed' to 'triggered'. Once triggered, the
// four gates below (dispatch via `evaluateSafetyEnvelope`, retry, merge, and
// successor release) all fail closed with the same typed
// `KILL_SWITCH_TRIGGERED` reason code. No gate here performs a merge or
// successor-release action itself -- each only decides whether one would be
// blocked, preserving the W0 prohibition on activating live merge/successor
// capability.
// ---------------------------------------------------------------------------

function invokeKillSwitch(envelope, request) {
  const isHumanCs2 = Boolean(request)
    && request.source === 'human_cs2'
    && request.actor
    && request.actor.type === 'User'
    && request.actor.login === PILOT_CS2_LOGIN;
  const preservedDecisionRecords = request && Array.isArray(request.existing_decision_records)
    ? [...request.existing_decision_records]
    : [];
  if (isHumanCs2) {
    // Strategy §5.1: "A trip produces exactly one LOOP_BREAK/BUDGET_TRIP
    // decision." The trip ledger is caller-supplied (`existing_trip_ledger`)
    // so that duplicate or reordered kill-switch invocations for the same
    // work item share one idempotent ledger and `recordTripEvent` dedupes
    // on `idempotency_key`, guaranteeing exactly one typed trip entry per
    // parent condition regardless of how many times the switch is invoked.
    const tripLedger = request && Array.isArray(request.existing_trip_ledger)
      ? request.existing_trip_ledger
      : [];
    const workItemId = envelope && envelope.work_item_id;
    const condition = (request && request.condition) || 'KILL_SWITCH_TRIGGERED';
    const tripRecord = recordTripEvent(tripLedger, {
      idempotency_key: `${workItemId}:kill-switch-trip`,
      work_item_id: workItemId,
      condition,
      attempt_count: tripLedger.length + 1,
    });
    return {
      kill_switch_state: 'triggered',
      decision: 'ALLOW',
      evidence_preserved: true,
      preserved_decision_records: preservedDecisionRecords,
      trip_record: tripRecord,
      trip_ledger: tripLedger,
    };
  }
  return {
    kill_switch_state: envelope ? envelope.kill_switch_state : 'armed',
    decision: 'STOP_AND_FIX',
    evidence_preserved: true,
    preserved_decision_records: preservedDecisionRecords,
  };
}

function killSwitchGate(envelope) {
  if (envelope && envelope.kill_switch_state === 'triggered') {
    return { decision: 'STOP_AND_FIX', reason_code: 'KILL_SWITCH_TRIGGERED' };
  }
  return { decision: 'ALLOW', reason_code: 'NONE' };
}

function evaluateRetryGate(envelope, _retryRequest) {
  return killSwitchGate(envelope);
}

function evaluateMergeGate(envelope, _mergeRequest) {
  return killSwitchGate(envelope);
}

function evaluateSuccessorReleaseGate(envelope, _successorRequest) {
  return killSwitchGate(envelope);
}

// ---------------------------------------------------------------------------
// W0 authoritative event decision record (Strategy Section 5.2)
//
// `buildDecisionRecord` is a pure function of its input: identical input
// always produces a field-identical record. Unknown/unrecognized
// `state_before` values never infer readiness -- they are overridden to a
// typed `STOP_AND_FIX`/`UNKNOWN_STATE` refusal while every other supplied
// field is preserved verbatim for the evidence trail.
// ---------------------------------------------------------------------------

function buildDecisionRecord(event) {
  const record = { ...event };
  if (!W0_KNOWN_DECISION_STATES.has(event.state_before)) {
    record.decision = 'STOP_AND_FIX';
    record.reason_code = 'UNKNOWN_STATE';
  }
  return record;
}

// ---------------------------------------------------------------------------
// W0 one-trip-per-condition ledger (Strategy Section 5)
//
// `recordTripEvent` is idempotent on `idempotency_key`: a duplicate or
// reordered re-delivery of the same qualifying condition never produces a
// second typed ledger entry. Exactly one typed `LOOP_BREAK` or `BUDGET_TRIP`
// entry is recorded per qualifying condition -- never zero, never more than
// one.
// ---------------------------------------------------------------------------

function classifyTripType(condition) {
  return /LOOP/i.test(String(condition || '')) ? 'LOOP_BREAK' : 'BUDGET_TRIP';
}

function recordTripEvent(ledger, event) {
  const existing = ledger.find((entry) => (entry.type === 'LOOP_BREAK' || entry.type === 'BUDGET_TRIP')
    && entry.idempotency_key === event.idempotency_key);
  if (existing) return existing;
  const entry = { ...event, type: classifyTripType(event.condition) };
  ledger.push(entry);
  return entry;
}

// ---------------------------------------------------------------------------
// W0 simulated 24-hour repeat-event window -- fully in-process, zero live
// spend, zero paid calls, zero production effects (Strategy Section 5.1).
// ---------------------------------------------------------------------------

function simulateTwentyFourHourWindow(envelope, clock) {
  const ledger = [];
  const ticks = clock && Number.isInteger(clock.ticks) ? clock.ticks : 24;
  const tickSeconds = clock && Number.isFinite(clock.tick_seconds) ? clock.tick_seconds : 60 * 60;
  let ticksExecuted = 0;
  for (let tick = 1; tick <= ticks; tick += 1) {
    ticksExecuted = tick;
    const elapsedSeconds = tick * tickSeconds;
    const limitResult = enforceWorkItemLimits({ total_runtime_seconds: elapsedSeconds }, envelope);
    if (limitResult.decision === 'STOP_AND_FIX') {
      // Strategy §5.1: a qualifying trip condition is keyed by work item +
      // reason code (NOT by tick), so every subsequent repeat tick for the
      // same still-over-limit condition is recognised by `recordTripEvent`
      // as the same parent condition and is suppressed -- never a distinct
      // ledger entry per tick. The loop then halts (terminal behaviour):
      // once breaker-tripped, the simulation never keeps ticking through
      // the remainder of the 24-hour (or longer) repeat-event window, so
      // execution time and ledger growth are both bounded regardless of
      // how many ticks the caller requests.
      recordTripEvent(ledger, {
        idempotency_key: `${envelope.work_item_id}:${limitResult.reason_code}`,
        work_item_id: envelope.work_item_id,
        condition: limitResult.reason_code,
        attempt_count: tick,
      });
      break;
    }
  }
  return {
    live_spend_calls: 0,
    paid_call_count: 0,
    production_effects: 0,
    trip_count: ledger.length,
    ticks_executed: ticksExecuted,
    ticks_requested: ticks,
  };
}

function bindPullRequest(register, { prNumber, headSha }) {
  if (register.pr_number && register.pr_number !== prNumber) {
    throw new Error(`Work item ${register.work_item_id} is already bound to PR #${register.pr_number}.`);
  }
  return {
    ...register,
    pr_number: prNumber,
    submission_head: headSha,
    state: 'foreman',
    next_action: 'FOREMAN_CREATE_PR_SCOPED_TASK_RECORD_AND_COMPLETE_IAA_PREBRIEF',
    last_processed: { ...register.last_processed, head_sha: headSha },
  };
}

function recordHumanApproval(register, kind, actor, status) {
  if (!['scope_expansion', 'merge'].includes(kind)) throw new Error('Unknown approval type.');
  if (!['approved', 'rejected'].includes(status)) throw new Error('Human approval must be approved or rejected.');
  if (!actor || actor.endsWith('[bot]')) throw new Error('Automation cannot record human approval.');
  return {
    ...register,
    human_approval: {
      ...register.human_approval,
      [kind]: { status, recorded_by: actor },
    },
  };
}

function nominatePullRequest(register, { prNumber, headRepository, bodyMarker, actor }) {
  return {
    ...register,
    nominated_pr: {
      number: prNumber,
      head_repository: headRepository,
      body_marker: bodyMarker,
      recorded_by: actor,
    },
    next_action: 'WAIT_FOR_NOMINATED_PR_BIND',
  };
}

function parseForemanNomination(body) {
  if (!body || !body.includes(FOREMAN_NOMINATION_MARKER)) return null;
  const prMatch = body.match(/FOREMAN_NOMINATE_PR:\s*#?(\d+)/i);
  const workItemId = boundWorkItem(body);
  if (!prMatch || !workItemId) {
    throw new Error('Foreman nomination must include FOREMAN_NOMINATE_PR and CS2-Work-Item.');
  }
  return {
    prNumber: Number(prMatch[1]),
    workItemId,
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function issueFormField(body, label) {
  if (!body) return '';
  const match = body.match(new RegExp(
    `^#{2,6}\\s*${escapeRegExp(label)}\\s*$\\n+([\\s\\S]*?)(?=^#{2,6}\\s+|\\Z)`,
    'mi',
  ));
  return match ? match[1].trim() : '';
}

function hasLabel(issue, name) {
  return Array.isArray(issue.labels) && issue.labels.some((label) => {
    if (typeof label === 'string') return label === name;
    return label?.name === name;
  });
}

function isPitRequest(issue) {
  return /^\[CS2\]/.test(issue.title || '')
    && issue?.user?.login === PILOT_CS2_LOGIN
    && hasLabel(issue, 'cs2:queued')
    && issueFormField(issue.body || '', 'CS2 authorization reference') !== ''
    && /^PIT$/i.test(issueFormField(issue.body || '', 'Module'));
}

function boundWorkItem(body) {
  return (body || '').match(WORK_ITEM_PATTERN)?.[1] || null;
}

function isSameRepositoryPullRequest(pr, repository) {
  return pr?.head?.repo?.full_name === repository && pr?.base?.repo?.full_name === repository;
}

function isControllerComment(comment) {
  return comment?.user?.login === CONTROLLER_LOGIN && comment?.user?.type === 'Bot';
}

async function listAllComments(github, owner, repo, issueNumber) {
  const comments = [];
  for (let page = 1; ; page += 1) {
    const { data } = await github.rest.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      page,
      per_page: LIST_PAGE_SIZE,
    });
    comments.push(...data);
    if (data.length < LIST_PAGE_SIZE) break;
  }
  return comments;
}

async function findRegisterComment(github, owner, repo, issueNumber, core) {
  const valid = [];
  const invalid = [];
  for (const comment of await listAllComments(github, owner, repo, issueNumber)) {
    if (!comment?.body?.includes(REGISTER_MARKER) || !isControllerComment(comment)) continue;
    try {
      const row = parseRegister(comment.body || '');
      if (row) valid.push({ comment, row });
    } catch (error) {
      invalid.push({ comment, error });
    }
  }
  if (invalid.length) {
    const message = `Controller work-register on #${issueNumber} is invalid; refusing to trust or bypass it.`;
    core.warning(message);
    return { status: 'invalid', message, invalid };
  }
  if (valid.length > 1) {
    const message = `Controller work-register on #${issueNumber} is ambiguous (${valid.length} records); refusing to continue.`;
    core.warning(message);
    return { status: 'invalid', message, valid };
  }
  if (valid.length === 1) {
    return { status: 'valid', ...valid[0] };
  }
  return { status: 'absent' };
}

async function writeRegister(github, owner, repo, issueNumber, existingComment, row) {
  const body = renderRegister(validateRegister(row));
  if (existingComment) {
    await github.rest.issues.updateComment({ owner, repo, comment_id: existingComment.id, body });
    return;
  }
  await github.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body });
}

async function listAllIssues(github, owner, repo) {
  const issues = [];
  for (let page = 1; ; page += 1) {
    const { data } = await github.rest.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      page,
      per_page: LIST_PAGE_SIZE,
    });
    issues.push(...data);
    if (data.length < LIST_PAGE_SIZE) break;
  }
  return issues;
}

async function activeRows(github, owner, repo, exceptIssueNumber, core) {
  const rows = [];
  for (const issue of await listAllIssues(github, owner, repo)) {
    if (issue.pull_request || issue.number === exceptIssueNumber) continue;
    const found = await findRegisterComment(github, owner, repo, issue.number, core);
    if (found.status === 'invalid') {
      rows.push({ issue, status: 'invalid', message: found.message });
      continue;
    }
    if (found.status === 'valid' && isActive(found.row)) rows.push({ issue, ...found });
  }
  return rows;
}

async function dispatchForeman(github, owner, repo, issueNumber, row) {
  const already = (await listAllComments(github, owner, repo, issueNumber)).some((comment) =>
    (comment.body || '').includes(FOREMAN_DISPATCH_MARKER) && (comment.body || '').includes(row.work_item_id));
  if (already) return;
  const body = [
    FOREMAN_DISPATCH_MARKER,
    `## Foreman dispatch — ${row.work_item_id}`,
    '',
    '@copilot You are **foreman-v2-agent** for this one work item. Bootstrap yourself and load the applicable Tier 2/Tier 3 context.',
    '',
    '**Your immediate, Foreman-owned action is mandatory:** create the PR-scoped `wave-current-tasks.md`, invoke `independent-assurance-agent` with `action: PRE-BRIEF`, and obtain the canonical, job-bound IAA pre-brief before any builder delegation.',
    '',
    'Do not ask Johan/CS2 to authorise, waive, or create this pre-brief. Resolve ordinary governance, tooling, evidence-format, and configuration defects inside the declared sandbox. Escalate only a genuine external credential/cost/destructive action, a protected agent-contract or canon conflict that must route through CodexAdvisor/CS2, an unresolvable business decision, or final human UI/UX acceptance.',
    '',
    'Before PR binding, Foreman must nominate exactly one same-repository PR on this Issue with the authenticated controller marker comment.',
    '',
    '```text',
    `${FOREMAN_NOMINATION_MARKER}`,
    `FOREMAN_NOMINATE_PR: <pr-number>`,
    `CS2-Work-Item: ${row.work_item_id}`,
    '```',
    `The nominated PR must include \`CS2-Work-Item: ${row.work_item_id}\` in its body.`,
  ].join('\n');
  await github.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body });
}

async function run({ github, context, core, eventName }) {
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const repository = `${owner}/${repo}`;
  const activeEventName = eventName || context.eventName;

  if (activeEventName === 'issues') {
    const issue = context.payload.issue;
    if (!isPitRequest(issue)) {
      core.info('Not a PIT CS2 Work Request; no action.');
      return;
    }
    const current = await findRegisterComment(github, owner, repo, issue.number, core);
    if (current.status === 'invalid') {
      core.warning('Current Issue has an invalid controller register; refusing to proceed.');
      return;
    }
    if (current.status === 'valid') {
      core.info('Work register already exists; idempotent no-op.');
      return;
    }
    const active = await activeRows(github, owner, repo, issue.number, core);
    if (active.length) {
      const blocker = active[0];
      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: issue.number,
        body: blocker.status === 'invalid'
          ? `<!-- pit-cs2-controller:single-job-conflict -->\nCS2_DECISION_REQUIRED: PIT controller register on #${blocker.issue.number} is invalid. This request was not claimed.`
          : `<!-- pit-cs2-controller:single-job-conflict -->\nCS2_DECISION_REQUIRED: active PIT work item \`${blocker.row.work_item_id}\` is not closed. This request was not claimed.`,
      });
      return;
    }
    const row = initialRegister({ issueNumber: issue.number, repository });
    await writeRegister(github, owner, repo, issue.number, null, row);
    await dispatchForeman(github, owner, repo, issue.number, row);
    return;
  }

  if (activeEventName === 'pull_request_target') {
    const pr = context.payload.pull_request;
    const workItemId = boundWorkItem(pr.body || '');
    if (!workItemId) {
      core.info('PR has no CS2 work-item binding; no action.');
      return;
    }
    if (!isSameRepositoryPullRequest(pr, repository)) {
      core.warning('Only same-repository PRs may bind an active PIT work item.');
      return;
    }
    const issueNumber = Number(workItemId.replace('pit-issue-', ''));
    const found = await findRegisterComment(github, owner, repo, issueNumber, core);
    if (found.status !== 'valid' || !isActive(found.row) || found.row.work_item_id !== workItemId) {
      core.warning('Work-item binding is absent, closed, or mismatched; no action.');
      return;
    }
    const expectedMarker = `CS2-Work-Item: ${workItemId}`;
    if (!found.row.nominated_pr) {
      core.warning(`Work item ${workItemId} has no nominated PR; no action.`);
      return;
    }
    if (found.row.nominated_pr.number !== pr.number
      || found.row.nominated_pr.head_repository !== pr.head.repo.full_name
      || found.row.nominated_pr.body_marker !== expectedMarker
      || !String(pr.body || '').includes(expectedMarker)) {
      core.warning(`PR #${pr.number} is not the nominated binding target for ${workItemId}.`);
      return;
    }
    if (found.row.pr_number && found.row.pr_number !== pr.number) {
      core.warning(`Work item ${workItemId} is already bound to PR #${found.row.pr_number}.`);
      return;
    }
    if (found.row.pr_number === pr.number && found.row.last_processed?.head_sha === pr.head.sha) {
      core.info('Nominated PR head was already processed; idempotent no-op.');
      return;
    }
    const next = bindPullRequest(found.row, { prNumber: pr.number, headSha: pr.head.sha });
    await writeRegister(github, owner, repo, issueNumber, found.comment, next);
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: pr.number,
      body: [
        PR_BOUND_MARKER,
        `@copilot Foreman: PR #${pr.number} at \`${pr.head.sha}\` is bound to \`${next.work_item_id}\`.`,
        `PR-scoped task record: \`.agent-admin/prs/pr-${pr.number}/wave-current-tasks.md\`.`,
        `Work item: \`${next.work_item_id}\`. Submitted head: \`${pr.head.sha}\`.`,
        'Complete the job-bound IAA PRE-BRIEF now. A missing pre-brief is a Foreman action, not a CS2 escalation. Ignore any historic wave, pre-brief, or gate material that is not bound to this work-item and PR.',
        'If IAA returns a rejection, Foreman owns one bounded correction on this same PR-scoped route and must re-invoke the PRE-BRIEF/IAA path for the bound work item.',
        'Do not treat any READY_FOR_IAA-style status as terminal completion, and do not create evidence-only commits merely to refresh the current HEAD; bind evidence to the submitted reviewed head or an independent external attestation.',
      ].join('\n'),
    });
    return;
  }

  if (activeEventName === 'issue_comment' && !context.payload.issue.pull_request) {
    const issue = context.payload.issue;
    const found = await findRegisterComment(github, owner, repo, issue.number, core);
    if (found.status !== 'valid') {
      core.info('No PIT work register on this Issue; no action.');
      return;
    }
    const actor = context.payload.comment.user || {};
    const author = String(actor.login || '');
    const body = String(context.payload.comment.body || '').trim();
    if (author === FOREMAN_LOGIN) {
      const nomination = parseForemanNomination(body);
      if (!nomination) {
        core.info('No Foreman nomination transition; no action.');
        return;
      }
      if (nomination.workItemId !== found.row.work_item_id) {
        core.warning(`Foreman nomination work item mismatch for #${issue.number}.`);
        return;
      }
      const prNumber = nomination.prNumber;
      const { data: pr } = await github.rest.pulls.get({ owner, repo, pull_number: prNumber });
      const expectedMarker = `CS2-Work-Item: ${found.row.work_item_id}`;
      if (!isSameRepositoryPullRequest(pr, repository) || boundWorkItem(pr.body || '') !== found.row.work_item_id) {
        core.warning(`PR #${prNumber} is not an authorised nomination target for ${found.row.work_item_id}.`);
        return;
      }
      if (found.row.nominated_pr
        && found.row.nominated_pr.number === prNumber
        && found.row.nominated_pr.head_repository === pr.head.repo.full_name
        && found.row.nominated_pr.body_marker === expectedMarker) {
        core.info(`Foreman nomination for PR #${prNumber} already recorded; idempotent no-op.`);
        return;
      }
      const next = nominatePullRequest(found.row, {
        prNumber,
        headRepository: pr.head.repo.full_name,
        bodyMarker: expectedMarker,
        actor: author,
      });
      await writeRegister(github, owner, repo, issue.number, found.comment, next);
      core.info(`Recorded Foreman-nominated PR #${prNumber} for ${found.row.work_item_id}.`);
      return;
    }
    if (author !== PILOT_CS2_LOGIN || String(actor.type || '') === 'Bot') {
      core.info('Human controller commands are accepted only from human CS2.');
      return;
    }
    const command = body.match(/^\/cs2-(approve|reject)\s+(scope-expansion|merge)$/i);
    if (!command) {
      core.info('No controller approval command; no action.');
      return;
    }
    const status = command[1].toLowerCase() === 'approve' ? 'approved' : 'rejected';
    const kind = command[2].toLowerCase().replace(/-/g, '_');
    const next = recordHumanApproval(found.row, kind, author, status);
    await writeRegister(github, owner, repo, issue.number, found.comment, next);
    core.info(`Recorded human ${kind} decision: ${status}.`);
    return;
  }

  core.info('Safety observation complete: no changed, controller-owned transition to apply.');
}

module.exports = {
  ACTIVE_STATES,
  CONTROLLER_LOGIN,
  FOREMAN_DISPATCH_MARKER,
  FOREMAN_LOGIN,
  FOREMAN_NOMINATION_MARKER,
  PILOT_CS2_LOGIN,
  PR_BOUND_MARKER,
  REGISTER_MARKER,
  boundWorkItem,
  bindPullRequest,
  findRegisterComment,
  initialRegister,
  isControllerComment,
  isPitRequest,
  isSameRepositoryPullRequest,
  issueFormField,
  isActive,
  nominatePullRequest,
  parseForemanNomination,
  parseRegister,
  recordHumanApproval,
  renderRegister,
  run,
  validateRegister,
  // W0 safety envelope and decision-record containment
  W0_SAFETY_ENVELOPE_FIELDS,
  validateSafetyEnvelopeAgainstSchema,
  validateDecisionRecordAgainstSchema,
  evaluateSafetyEnvelope,
  enforceWorkItemLimits,
  enforceSpendControl,
  resetCircuitBreaker,
  invokeKillSwitch,
  evaluateRetryGate,
  evaluateMergeGate,
  evaluateSuccessorReleaseGate,
  buildDecisionRecord,
  recordTripEvent,
  simulateTwentyFourHourWindow,
};
