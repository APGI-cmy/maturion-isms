'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const controller = require('./pit-cs2-controller.js');

const CONTROLLER_USER = { login: controller.CONTROLLER_LOGIN, type: 'Bot' };
const FOREMAN_USER = { login: controller.FOREMAN_LOGIN, type: 'Bot' };
const CS2_USER = { login: controller.PILOT_CS2_LOGIN, type: 'User' };
const OTHER_USER = { login: 'someone-else', type: 'User' };

test('register round-trips, validates, and starts in Foreman pre-brief state', () => {
  const row = controller.initialRegister({ issueNumber: 42, repository: 'APGI-cmy/maturion-isms' });
  assert.equal(row.next_action, 'FOREMAN_BOOTSTRAP_AND_IAA_PREBRIEF');
  assert.deepEqual(controller.parseRegister(controller.renderRegister(row)), row);
  assert.throws(() => controller.validateRegister({ ...row, state: 'not-a-real-state' }));
});

test('only one nominated pull request can bind to a work item', () => {
  const row = controller.nominatePullRequest(
    controller.initialRegister({ issueNumber: 42, repository: 'APGI-cmy/maturion-isms' }),
    {
      prNumber: 100,
      headRepository: 'APGI-cmy/maturion-isms',
      bodyMarker: 'CS2-Work-Item: pit-issue-42',
      actor: 'APGI-cmy',
    },
  );
  const bound = controller.bindPullRequest(row, { prNumber: 100, headSha: 'a'.repeat(40) });
  assert.equal(bound.pr_number, 100);
  assert.throws(() => controller.bindPullRequest(bound, { prNumber: 101, headSha: 'b'.repeat(40) }));
});

test('automation cannot record a human approval', () => {
  const row = controller.initialRegister({ issueNumber: 42, repository: 'APGI-cmy/maturion-isms' });
  assert.throws(() => controller.recordHumanApproval(row, 'merge', 'github-actions[bot]', 'approved'));
  assert.equal(controller.recordHumanApproval(row, 'merge', 'APGI-cmy', 'approved').human_approval.merge.status, 'approved');
});

function controllerComment(body, overrides = {}) {
  return {
    id: overrides.id || 1,
    body,
    user: overrides.user || CONTROLLER_USER,
  };
}

function createHarness({ issues, initialComments = {}, pulls = {} }) {
  let nextCommentId = 1000;
  const comments = new Map(Object.entries(initialComments).map(([issueNumber, rows]) => [
    String(issueNumber),
    rows.map((comment, index) => ({
      id: comment.id || (index + 1),
      body: comment.body,
      user: comment.user || CONTROLLER_USER,
    })),
  ]));

  function issueComments(issueNumber) {
    const key = String(issueNumber);
    if (!comments.has(key)) comments.set(key, []);
    return comments.get(key);
  }

  const github = {
    rest: {
      issues: {
        async listComments({ issue_number, page = 1, per_page = 100 }) {
          const rows = issueComments(issue_number);
          const start = (page - 1) * per_page;
          return { data: rows.slice(start, start + per_page).map((comment) => ({ ...comment })) };
        },
        async createComment({ issue_number, body }) {
          const comment = { id: nextCommentId++, body, user: CONTROLLER_USER };
          issueComments(issue_number).push(comment);
          return { data: { ...comment } };
        },
        async updateComment({ comment_id, body }) {
          for (const rows of comments.values()) {
            const existing = rows.find((comment) => comment.id === comment_id);
            if (existing) {
              existing.body = body;
              return { data: { ...existing } };
            }
          }
          throw new Error(`Unknown comment id ${comment_id}`);
        },
        async listForRepo({ state = 'open', page = 1, per_page = 100 }) {
          const filtered = issues.filter((issue) => state === 'all' || (issue.state || 'open') === state);
          const start = (page - 1) * per_page;
          return { data: filtered.slice(start, start + per_page).map((issue) => ({ ...issue })) };
        },
      },
      pulls: {
        async get({ pull_number }) {
          if (!pulls[pull_number]) throw new Error(`Unknown PR ${pull_number}`);
          return { data: JSON.parse(JSON.stringify(pulls[pull_number])) };
        },
      },
    },
  };

  const messages = { info: [], warning: [] };
  const core = {
    info(message) {
      messages.info.push(message);
    },
    warning(message) {
      messages.warning.push(message);
    },
  };

  return {
    comments,
    core,
    github,
    messages,
  };
}

function workRequestBody(module = 'PIT') {
  return [
    '### CS2 authorization reference',
    'https://github.com/APGI-cmy/maturion-isms/pull/2046#issuecomment-5740847452',
    '',
    '### Module',
    module,
    '',
    '### One responsibility',
    'Ship one bounded controller correction.',
    '',
    '### Allowed paths',
    '.github/workflows/pit-cs2-controller.yml',
    '',
    '### Measurable acceptance criteria',
    'Exactly one register row and one dispatch comment are created.',
    '',
    '### Required validation commands and hosted checks',
    'node --test .github/scripts/pit-cs2-controller.test.js',
    '',
    '### Known dependencies or user actions',
    'none known',
    '',
    '### Pilot limits',
    '- [x] I confirm this is one PIT job only; scope expansion and merge remain for Johan Ras / CS2.',
    '- [x] I confirm the controller may self-remediate only inside the declared sandbox.',
  ].join('\n');
}

function foremanNominationBody(prNumber, workItemId) {
  return [
    controller.FOREMAN_NOMINATION_MARKER,
    `FOREMAN_NOMINATE_PR: ${prNumber}`,
    `CS2-Work-Item: ${workItemId}`,
  ].join('\n');
}

test('real Issue Form payload is claimed once and duplicate intake is idempotent', async () => {
  const issue = {
    number: 42,
    title: '[CS2] PIT controller correction',
    body: workRequestBody(),
    labels: [{ name: 'cs2:queued' }],
    user: CS2_USER,
    state: 'open',
  };
  const harness = createHarness({
    issues: [issue],
    initialComments: {
      42: [
        {
          id: 12,
          body: controller.renderRegister(controller.initialRegister({ issueNumber: 42, repository: 'APGI-cmy/maturion-isms' })),
          user: OTHER_USER,
        },
      ],
    },
  });
  const context = {
    eventName: 'issues',
    payload: { issue },
    repo: { owner: 'APGI-cmy', repo: 'maturion-isms' },
  };

  await controller.run({ github: harness.github, context, core: harness.core, eventName: 'issues' });
  await controller.run({ github: harness.github, context, core: harness.core, eventName: 'issues' });

  const posted = harness.comments.get('42') || [];
  assert.equal(posted.filter((comment) => comment.body.includes(controller.REGISTER_MARKER)).length, 2);
  assert.equal(posted.filter((comment) => comment.user.login === controller.CONTROLLER_LOGIN && comment.body.includes(controller.REGISTER_MARKER)).length, 1);
  assert.equal(posted.filter((comment) => comment.body.includes(controller.FOREMAN_DISPATCH_MARKER)).length, 1);
  const dispatch = posted.find((comment) => comment.body.includes(controller.FOREMAN_DISPATCH_MARKER));
  assert.match(dispatch.body, /invoke `independent-assurance-agent` with `action: PRE-BRIEF`/);
  assert.match(dispatch.body, /before any builder delegation/);
  assert.match(dispatch.body, /CodexAdvisor\/CS2/);

  const persisted = controller.parseRegister(
    posted.find((comment) => comment.user.login === controller.CONTROLLER_LOGIN && comment.body.includes(controller.REGISTER_MARKER)).body,
  );
  assert.equal(persisted.work_item_id, 'pit-issue-42');
  assert.equal(persisted.state, 'foreman');
  assert.match(harness.messages.info.at(-1), /idempotent no-op/);
});

test('crafted issue from a non-CS2 actor cannot create a register or dispatch Foreman', async () => {
  const issue = {
    number: 43,
    title: '[CS2] crafted PIT request',
    body: workRequestBody(),
    labels: [{ name: 'cs2:queued' }],
    user: OTHER_USER,
    state: 'open',
  };
  const harness = createHarness({ issues: [issue] });

  await controller.run({
    github: harness.github,
    context: { eventName: 'issues', payload: { issue }, repo: { owner: 'APGI-cmy', repo: 'maturion-isms' } },
    core: harness.core,
    eventName: 'issues',
  });

  assert.equal((harness.comments.get('43') || []).length, 0);
  assert.match(harness.messages.info[0], /no action/i);
});

test('invalid controller register fails closed and blocks a second active work item', async () => {
  const issue = {
    number: 42,
    title: '[CS2] PIT controller correction',
    body: workRequestBody(),
    labels: [{ name: 'cs2:queued' }],
    user: CS2_USER,
    state: 'open',
  };
  const harness = createHarness({
    issues: [issue, { number: 77, title: 'Existing PIT request', state: 'closed' }],
    initialComments: {
      77: [controllerComment(`${controller.REGISTER_MARKER}\n\n\`\`\`json\n{"broken":true}\n\`\`\``, { id: 700 })],
    },
  });

  await controller.run({
    github: harness.github,
    context: { eventName: 'issues', payload: { issue }, repo: { owner: 'APGI-cmy', repo: 'maturion-isms' } },
    core: harness.core,
    eventName: 'issues',
  });

  const posted = harness.comments.get('42') || [];
  assert.equal(posted.length, 1);
  assert.match(posted[0].body, /register on #77 is invalid/i);
});

test('active validated register on a closed issue beyond the first page still blocks intake', async () => {
  const issue = {
    number: 42,
    title: '[CS2] PIT controller correction',
    body: workRequestBody(),
    labels: [{ name: 'cs2:queued' }],
    user: CS2_USER,
    state: 'open',
  };
  const closedBlocker = {
    number: 250,
    title: 'Closed but still active PIT work item',
    state: 'closed',
  };
  const issues = [
    issue,
    ...Array.from({ length: 100 }, (_, index) => ({ number: 1000 + index, title: `noise-${index}`, state: 'open' })),
    closedBlocker,
  ];
  const blockerRow = controller.initialRegister({ issueNumber: 250, repository: 'APGI-cmy/maturion-isms' });
  const harness = createHarness({
    issues,
    initialComments: {
      250: [controllerComment(controller.renderRegister(blockerRow), { id: 701 })],
    },
  });

  await controller.run({
    github: harness.github,
    context: { eventName: 'issues', payload: { issue }, repo: { owner: 'APGI-cmy', repo: 'maturion-isms' } },
    core: harness.core,
    eventName: 'issues',
  });

  const posted = harness.comments.get('42') || [];
  assert.equal(posted.length, 1);
  assert.match(posted[0].body, /pit-issue-250/);
});

test('only a Foreman-nominated authorised same-repository work-item PR can bind once to the active row', async () => {
  const repository = 'APGI-cmy/maturion-isms';
  const seededRow = controller.initialRegister({ issueNumber: 42, repository });
  const harness = createHarness({
    issues: [{ number: 42, title: '[CS2] PIT controller correction', labels: [{ name: 'cs2:queued' }], state: 'open' }],
    initialComments: {
      42: [controllerComment(controller.renderRegister(seededRow), { id: 900 })],
    },
    pulls: {
      502: {
        number: 502,
        body: 'CS2-Work-Item: pit-issue-42',
        head: { sha: 'b'.repeat(40), repo: { full_name: repository } },
        base: { repo: { full_name: repository } },
      },
    },
  });

  const baseContext = {
    repo: { owner: 'APGI-cmy', repo: 'maturion-isms' },
  };

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: {
        pull_request: {
          number: 500,
          body: 'No work-item marker here.',
          head: { sha: '0'.repeat(40), repo: { full_name: repository } },
          base: { repo: { full_name: repository } },
        },
      },
    },
    core: harness.core,
    eventName: 'pull_request_target',
  });

  let persisted = controller.parseRegister((harness.comments.get('42') || [])[0].body);
  assert.equal(persisted.pr_number, null);

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: {
        pull_request: {
          number: 501,
          body: 'CS2-Work-Item: pit-issue-42',
          head: { sha: 'a'.repeat(40), repo: { full_name: 'someone/fork' } },
          base: { repo: { full_name: repository } },
        },
      },
    },
    core: harness.core,
    eventName: 'pull_request_target',
  });

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: {
        pull_request: {
          number: 502,
          body: 'CS2-Work-Item: pit-issue-42',
          head: { sha: 'b'.repeat(40), repo: { full_name: repository } },
          base: { repo: { full_name: repository } },
        },
      },
    },
    core: harness.core,
    eventName: 'pull_request_target',
  });

  persisted = controller.parseRegister((harness.comments.get('42') || [])[0].body);
  assert.equal(persisted.pr_number, null);
  assert.equal(persisted.nominated_pr, null);
  assert.match(harness.messages.warning.at(-1), /no nominated PR/i);

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: {
        issue: { number: 42 },
        comment: { body: foremanNominationBody(502, 'pit-issue-42'), user: OTHER_USER },
      },
    },
    core: harness.core,
    eventName: 'issue_comment',
  });

  persisted = controller.parseRegister((harness.comments.get('42') || [])[0].body);
  assert.equal(persisted.nominated_pr, null);
  assert.match(harness.messages.info.at(-1), /human CS2/i);

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: {
        issue: { number: 42 },
        comment: { body: foremanNominationBody(502, 'pit-issue-999'), user: FOREMAN_USER },
      },
    },
    core: harness.core,
    eventName: 'issue_comment',
  });

  persisted = controller.parseRegister((harness.comments.get('42') || [])[0].body);
  assert.equal(persisted.nominated_pr, null);
  assert.match(harness.messages.warning.at(-1), /work item mismatch/i);

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: {
        issue: { number: 42 },
        comment: { body: foremanNominationBody(502, 'pit-issue-42'), user: FOREMAN_USER },
      },
    },
    core: harness.core,
    eventName: 'issue_comment',
  });

  persisted = controller.parseRegister((harness.comments.get('42') || [])[0].body);
  assert.equal(persisted.nominated_pr.number, 502);
  assert.equal(persisted.nominated_pr.head_repository, repository);
  assert.equal(persisted.nominated_pr.recorded_by, controller.FOREMAN_LOGIN);

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: {
        pull_request: {
          number: 503,
          body: 'CS2-Work-Item: pit-issue-42',
          head: { sha: 'c'.repeat(40), repo: { full_name: repository } },
          base: { repo: { full_name: repository } },
        },
      },
    },
    core: harness.core,
    eventName: 'pull_request_target',
  });

  persisted = controller.parseRegister((harness.comments.get('42') || [])[0].body);
  assert.equal(persisted.pr_number, null);
  assert.match(harness.messages.warning.at(-1), /not the nominated binding target/i);

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: {
        pull_request: {
          number: 502,
          body: 'CS2-Work-Item: pit-issue-42',
          head: { sha: 'b'.repeat(40), repo: { full_name: repository } },
          base: { repo: { full_name: repository } },
        },
      },
    },
    core: harness.core,
    eventName: 'pull_request_target',
  });

  persisted = controller.parseRegister((harness.comments.get('42') || [])[0].body);
  assert.equal(persisted.pr_number, 502);
  assert.equal(persisted.last_processed.head_sha, 'b'.repeat(40));
  assert.equal((harness.comments.get('502') || []).length, 1);
  const prBoundComment = (harness.comments.get('502') || [])[0];
  assert.match(prBoundComment.body, /wave-current-tasks\.md/);
  assert.match(prBoundComment.body, /Submitted head/);
  assert.match(prBoundComment.body, /Complete the job-bound IAA PRE-BRIEF now/);
  assert.match(prBoundComment.body, /If IAA returns a rejection, Foreman owns one bounded correction/);
  assert.match(prBoundComment.body, /Do not treat any READY_FOR_IAA-style status as terminal completion/);
  assert.match(prBoundComment.body, /do not create evidence-only commits merely to refresh the current HEAD/i);

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: {
        issue: { number: 42 },
        comment: { body: foremanNominationBody(502, 'pit-issue-42'), user: FOREMAN_USER },
      },
    },
    core: harness.core,
    eventName: 'issue_comment',
  });

  assert.match(harness.messages.info.at(-1), /idempotent no-op/);

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: {
        pull_request: {
          number: 502,
          body: 'CS2-Work-Item: pit-issue-42',
          head: { sha: 'b'.repeat(40), repo: { full_name: repository } },
          base: { repo: { full_name: repository } },
        },
      },
    },
    core: harness.core,
    eventName: 'pull_request_target',
  });

  assert.equal((harness.comments.get('502') || []).length, 1);
  assert.match(harness.messages.info.at(-1), /idempotent no-op/);
});

test('human approval commands normalize scope-expansion and reject automation or non-CS2 actors', async () => {
  const row = controller.initialRegister({ issueNumber: 42, repository: 'APGI-cmy/maturion-isms' });
  const harness = createHarness({
    issues: [{ number: 42, title: '[CS2] PIT controller correction', state: 'open' }],
    initialComments: {
      42: [controllerComment(controller.renderRegister(row), { id: 910 })],
    },
  });
  const baseContext = { repo: { owner: 'APGI-cmy', repo: 'maturion-isms' }, payload: { issue: { number: 42 } } };

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: { ...baseContext.payload, comment: { body: '/cs2-approve scope-expansion', user: { login: 'github-actions[bot]', type: 'Bot' } } },
    },
    core: harness.core,
    eventName: 'issue_comment',
  });

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: { ...baseContext.payload, comment: { body: '/cs2-approve merge', user: OTHER_USER } },
    },
    core: harness.core,
    eventName: 'issue_comment',
  });

  await controller.run({
    github: harness.github,
    context: {
      ...baseContext,
      payload: { ...baseContext.payload, comment: { body: '/cs2-approve scope-expansion', user: CS2_USER } },
    },
    core: harness.core,
    eventName: 'issue_comment',
  });

  const persisted = controller.parseRegister((harness.comments.get('42') || [])[0].body);
  assert.equal(persisted.human_approval.scope_expansion.status, 'approved');
  assert.equal(persisted.human_approval.scope_expansion.recorded_by, 'APGI-cmy');
  assert.match(harness.messages.info[0], /human CS2/i);
  assert.match(harness.messages.info[1], /human CS2/i);
});

// ---------------------------------------------------------------------------
// W0-2053-C — QA-to-RED coverage for the Strategy §5.1 safety envelope / human
// kill switch and §5.2 authoritative event decision record.
//
// Appointment: .agent-admin/builder-appointments/pr-2061-w0-qa-to-red-20261004.md
// IAA pre-brief: .agent-admin/assurance/iaa-wave-record-w0-safety-containment-20261004.md
//
// These tests are INTENTIONALLY RED. They exercise the controller API surface
// required by governance/strategy/GOVERNANCE_FAILURE_OUTENGINEERING_STRATEGY.md
// §5.1 and §5.2 (`evaluateSafetyEnvelope`, `enforceWorkItemLimits`,
// `enforceSpendControl`, `resetCircuitBreaker`, `buildDecisionRecord`,
// `recordTripEvent`, `simulateTwentyFourHourWindow`). None of these functions
// exist in `pit-cs2-controller.js` yet, so every test below fails because the
// required behaviour is absent — not because of malformed test setup. No test
// in this section stubs, mocks around, or weakens its way to a false GREEN;
// the implementation builder must satisfy these assertions as written.
// ---------------------------------------------------------------------------

const W0_SAFETY_ENVELOPE_FIELDS = [
  'work_item_id', 'approved_paths', 'approved_agents', 'maximum_active_jobs',
  'maximum_stage_attempts', 'maximum_remediation_attempts', 'maximum_dispatch_runtime',
  'maximum_total_runtime', 'maximum_spend', 'maximum_merge_attempts', 'expiry',
  'circuit_breaker_state', 'reset_authority', 'kill_switch_state',
];

const W0_DECISION_RECORD_FIELDS = [
  'event_id', 'received_at', 'source', 'work_item_id', 'pr_number', 'head_sha', 'base_sha',
  'reviewed_content_fingerprint', 'state_before', 'material_blockers', 'delta_class',
  'requested_stage', 'allowed_next_action', 'action_owner', 'idempotency_key', 'attempt_count',
  'safety_envelope_id', 'budget_snapshot', 'decision', 'reason_code', 'evidence_refs', 'state_after',
];

function w0BaselineEnvelope(overrides = {}) {
  return {
    work_item_id: 'pit-issue-42',
    approved_paths: ['.github/workflows/pit-cs2-controller.yml'],
    approved_agents: ['foreman-v2-agent', 'qa-builder'],
    maximum_active_jobs: 1,
    maximum_stage_attempts: 1,
    maximum_remediation_attempts: 1,
    maximum_dispatch_runtime: { unit: 'seconds', value: 30 * 60 },
    maximum_total_runtime: { unit: 'seconds', value: 2 * 60 * 60 },
    maximum_spend: { mode: 'runtime_only' },
    maximum_merge_attempts: 1,
    expiry: '2026-10-05T00:00:00.000Z',
    circuit_breaker_state: 'closed',
    reset_authority: 'human_cs2_only',
    kill_switch_state: 'armed',
    ...overrides,
  };
}

function w0TaskRecord(overrides = {}) {
  return { work_item_id: 'pit-issue-42', pr_number: 2061, ...overrides };
}

function w0SampleEvent(overrides = {}) {
  return {
    event_id: 'evt-0001',
    received_at: '2026-10-04T00:00:00.000Z',
    source: 'controller',
    work_item_id: 'pit-issue-42',
    pr_number: 2061,
    head_sha: 'a'.repeat(40),
    base_sha: 'b'.repeat(40),
    reviewed_content_fingerprint: 'sha256:' + 'c'.repeat(64),
    state_before: 'foreman',
    material_blockers: [],
    delta_class: 'admin_only',
    requested_stage: 'IAA_PREBRIEF_READY',
    allowed_next_action: 'FOREMAN_CREATE_PR_SCOPED_TASK_RECORD_AND_COMPLETE_IAA_PREBRIEF',
    action_owner: 'foreman-v2-agent',
    idempotency_key: 'pit-issue-42:evt-0001',
    attempt_count: 1,
    safety_envelope_id: 'env-pit-issue-42-v1',
    budget_snapshot: { active_work_items: 1, remediation_attempts: 0, dispatch_runtime_seconds: 0, total_runtime_seconds: 0 },
    decision: 'ALLOW',
    reason_code: 'NONE',
    evidence_refs: ['.agent-admin/evidence/pr-2061-w0-qa-to-red.md'],
    state_after: 'foreman',
    ...overrides,
  };
}

function w0TripEvent(overrides = {}) {
  return {
    idempotency_key: 'pit-issue-42:trip-0001',
    work_item_id: 'pit-issue-42',
    condition: 'DISPATCH_RUNTIME_EXCEEDED',
    attempt_count: 1,
    ...overrides,
  };
}

test('W0: a missing safety envelope fails closed and blocks dispatch', () => {
  const decision = controller.evaluateSafetyEnvelope(null, w0TaskRecord(), new Date('2026-10-04T00:00:00.000Z'));
  assert.equal(decision.decision, 'STOP_AND_FIX');
  assert.equal(decision.reason_code, 'ENVELOPE_MISSING');
});

test('W0: a malformed safety envelope (missing required field) fails closed', () => {
  const malformed = w0BaselineEnvelope();
  delete malformed.circuit_breaker_state;
  const decision = controller.evaluateSafetyEnvelope(malformed, w0TaskRecord(), new Date('2026-10-04T00:00:00.000Z'));
  assert.equal(decision.decision, 'STOP_AND_FIX');
  assert.equal(decision.reason_code, 'ENVELOPE_MALFORMED');
});

test('W0: a safety envelope missing any single Strategy §5.1 required field fails closed', () => {
  for (const field of W0_SAFETY_ENVELOPE_FIELDS) {
    const malformed = w0BaselineEnvelope();
    delete malformed[field];
    const decision = controller.evaluateSafetyEnvelope(malformed, w0TaskRecord(), new Date('2026-10-04T00:00:00.000Z'));
    assert.equal(decision.decision, 'STOP_AND_FIX', `expected STOP_AND_FIX when ${field} is absent`);
    assert.equal(decision.reason_code, 'ENVELOPE_MALFORMED', `expected ENVELOPE_MALFORMED when ${field} is absent`);
  }
});

test('W0: an expired safety envelope fails closed', () => {
  const expired = w0BaselineEnvelope({ expiry: '2026-10-03T00:00:00.000Z' });
  const decision = controller.evaluateSafetyEnvelope(expired, w0TaskRecord(), new Date('2026-10-04T00:00:00.000Z'));
  assert.equal(decision.decision, 'STOP_AND_FIX');
  assert.equal(decision.reason_code, 'ENVELOPE_EXPIRED');
});

test('W0: a task-inconsistent safety envelope (work_item_id mismatch) fails closed', () => {
  const envelope = w0BaselineEnvelope({ work_item_id: 'pit-issue-999' });
  const decision = controller.evaluateSafetyEnvelope(envelope, w0TaskRecord({ work_item_id: 'pit-issue-42' }), new Date('2026-10-04T00:00:00.000Z'));
  assert.equal(decision.decision, 'STOP_AND_FIX');
  assert.equal(decision.reason_code, 'ENVELOPE_TASK_INCONSISTENT');
});

test('W0: an unmeasurable safety envelope limit fails closed', () => {
  const unmeasurable = w0BaselineEnvelope({ maximum_dispatch_runtime: { unit: 'vibes', value: 'soon' } });
  const decision = controller.evaluateSafetyEnvelope(unmeasurable, w0TaskRecord(), new Date('2026-10-04T00:00:00.000Z'));
  assert.equal(decision.decision, 'STOP_AND_FIX');
  assert.equal(decision.reason_code, 'ENVELOPE_LIMIT_UNMEASURABLE');
});

test('W0: exactly one active work item is allowed; a second active work item is blocked', () => {
  const envelope = w0BaselineEnvelope();
  const allowed = controller.enforceWorkItemLimits({ active_work_items: 1 }, envelope);
  assert.equal(allowed.decision, 'ALLOW');
  const blocked = controller.enforceWorkItemLimits({ active_work_items: 2 }, envelope);
  assert.equal(blocked.decision, 'STOP_AND_FIX');
  assert.equal(blocked.reason_code, 'ACTIVE_WORK_ITEM_LIMIT_EXCEEDED');
});

test('W0: exactly one material remediation attempt is allowed; a second trips the breaker', () => {
  const envelope = w0BaselineEnvelope();
  const allowed = controller.enforceWorkItemLimits({ remediation_attempts: 1 }, envelope);
  assert.equal(allowed.decision, 'ALLOW');
  const tripped = controller.enforceWorkItemLimits({ remediation_attempts: 2 }, envelope);
  assert.equal(tripped.decision, 'STOP_AND_FIX');
  assert.equal(tripped.reason_code, 'REMEDIATION_ATTEMPT_LIMIT_EXCEEDED');
});

test('W0: dispatch runtime of exactly 30 minutes is allowed; 30 minutes and one second trips', () => {
  const envelope = w0BaselineEnvelope();
  const atLimit = controller.enforceWorkItemLimits({ dispatch_runtime_seconds: 30 * 60 }, envelope);
  assert.equal(atLimit.decision, 'ALLOW');
  const onePast = controller.enforceWorkItemLimits({ dispatch_runtime_seconds: 30 * 60 + 1 }, envelope);
  assert.equal(onePast.decision, 'STOP_AND_FIX');
  assert.equal(onePast.reason_code, 'DISPATCH_RUNTIME_EXCEEDED');
});

test('W0: total runtime of exactly two hours is allowed; two hours and one second trips', () => {
  const envelope = w0BaselineEnvelope();
  const atLimit = controller.enforceWorkItemLimits({ total_runtime_seconds: 2 * 60 * 60 }, envelope);
  assert.equal(atLimit.decision, 'ALLOW');
  const onePast = controller.enforceWorkItemLimits({ total_runtime_seconds: 2 * 60 * 60 + 1 }, envelope);
  assert.equal(onePast.decision, 'STOP_AND_FIX');
  assert.equal(onePast.reason_code, 'TOTAL_RUNTIME_EXCEEDED');
});

test('W0: spend control is runtime-only and refuses any live-spend-based input', () => {
  const envelope = w0BaselineEnvelope();
  assert.throws(() => controller.enforceSpendControl({ mode: 'live_spend', amount_usd: 0.01 }, envelope));
  const allowed = controller.enforceSpendControl({ mode: 'runtime_only' }, envelope);
  assert.equal(allowed.decision, 'ALLOW');
});

test('W0: a webhook-triggered reset cannot clear a tripped circuit breaker', () => {
  const result = controller.resetCircuitBreaker(
    { circuit_breaker_state: 'tripped' },
    { source: 'webhook', actor: { login: 'github-actions[bot]', type: 'Bot' } },
  );
  assert.equal(result.circuit_breaker_state, 'tripped');
  assert.equal(result.decision, 'STOP_AND_FIX');
});

test('W0: an agent-triggered reset cannot clear a tripped circuit breaker', () => {
  const result = controller.resetCircuitBreaker(
    { circuit_breaker_state: 'tripped' },
    { source: 'agent', actor: { login: 'foreman-v2-agent', type: 'Bot' } },
  );
  assert.equal(result.circuit_breaker_state, 'tripped');
  assert.equal(result.decision, 'STOP_AND_FIX');
});

test('W0: a token-triggered reset cannot clear a tripped circuit breaker', () => {
  const result = controller.resetCircuitBreaker(
    { circuit_breaker_state: 'tripped' },
    { source: 'token', actor: { login: controller.CONTROLLER_LOGIN, type: 'Bot' } },
  );
  assert.equal(result.circuit_breaker_state, 'tripped');
  assert.equal(result.decision, 'STOP_AND_FIX');
});

test('W0: a comment-triggered reset cannot clear a tripped circuit breaker', () => {
  const result = controller.resetCircuitBreaker(
    { circuit_breaker_state: 'tripped' },
    { source: 'comment', actor: { login: controller.PILOT_CS2_LOGIN, type: 'User' } },
  );
  assert.equal(result.circuit_breaker_state, 'tripped');
  assert.equal(result.decision, 'STOP_AND_FIX');
});

test('W0: a PR-triggered reset cannot clear a tripped circuit breaker', () => {
  const result = controller.resetCircuitBreaker(
    { circuit_breaker_state: 'tripped' },
    { source: 'pull_request', actor: { login: controller.PILOT_CS2_LOGIN, type: 'User' } },
  );
  assert.equal(result.circuit_breaker_state, 'tripped');
  assert.equal(result.decision, 'STOP_AND_FIX');
});

test('W0: an automatic-retry reset cannot clear a tripped circuit breaker', () => {
  const result = controller.resetCircuitBreaker(
    { circuit_breaker_state: 'tripped' },
    { source: 'automatic_retry', actor: null },
  );
  assert.equal(result.circuit_breaker_state, 'tripped');
  assert.equal(result.decision, 'STOP_AND_FIX');
});

test('W0: only an explicit human-CS2-attributed reset can clear a tripped circuit breaker', () => {
  const result = controller.resetCircuitBreaker(
    { circuit_breaker_state: 'tripped' },
    { source: 'human_cs2', actor: { login: controller.PILOT_CS2_LOGIN, type: 'User' } },
  );
  assert.equal(result.circuit_breaker_state, 'closed');
  assert.equal(result.decision, 'ALLOW');
});

test('W0: the decision record contains every Strategy §5.2 required field', () => {
  const record = controller.buildDecisionRecord(w0SampleEvent());
  for (const field of W0_DECISION_RECORD_FIELDS) {
    assert.ok(Object.hasOwn(record, field), `decision record missing required field: ${field}`);
  }
});

test('W0: identical input produces a byte/field-identical decision record (deterministic)', () => {
  const event = w0SampleEvent();
  const first = controller.buildDecisionRecord(event);
  const second = controller.buildDecisionRecord(event);
  assert.deepEqual(first, second);
});

test('W0: an unknown/unrecognized state_before returns a typed refusal, never inferred readiness', () => {
  const record = controller.buildDecisionRecord(w0SampleEvent({ state_before: 'not_a_real_state' }));
  assert.equal(record.decision, 'STOP_AND_FIX');
  assert.equal(record.reason_code, 'UNKNOWN_STATE');
});

test('W0: a duplicate trip event is suppressed and exactly one typed trip is recorded', () => {
  const ledger = [];
  const event = w0TripEvent({ idempotency_key: 'pit-issue-42:trip-dup' });
  controller.recordTripEvent(ledger, event);
  controller.recordTripEvent(ledger, event);
  const trips = ledger.filter((entry) => entry.type === 'LOOP_BREAK' || entry.type === 'BUDGET_TRIP');
  assert.equal(trips.length, 1);
});

test('W0: reordered duplicate trip events still yield exactly one typed trip', () => {
  const ledger = [];
  const later = w0TripEvent({ idempotency_key: 'pit-issue-42:trip-reorder', attempt_count: 2 });
  const earlier = w0TripEvent({ idempotency_key: 'pit-issue-42:trip-reorder', attempt_count: 1 });
  controller.recordTripEvent(ledger, later);
  controller.recordTripEvent(ledger, earlier);
  const trips = ledger.filter((entry) => entry.type === 'LOOP_BREAK' || entry.type === 'BUDGET_TRIP');
  assert.equal(trips.length, 1);
});

test('W0: a qualifying trip condition emits exactly one typed LOOP_BREAK or BUDGET_TRIP, never zero', () => {
  const ledger = [];
  controller.recordTripEvent(ledger, w0TripEvent({ idempotency_key: 'pit-issue-42:trip-exactly-one' }));
  const trips = ledger.filter((entry) => entry.type === 'LOOP_BREAK' || entry.type === 'BUDGET_TRIP');
  assert.equal(trips.length, 1);
  assert.ok(['LOOP_BREAK', 'BUDGET_TRIP'].includes(trips[0].type));
});

test('W0: a simulated 24-hour repeat-event sequence makes zero live spend or paid calls', () => {
  const envelope = w0BaselineEnvelope();
  const clock = { start: new Date('2026-10-04T00:00:00.000Z'), tick_seconds: 60 * 60, ticks: 24 };
  const outcome = controller.simulateTwentyFourHourWindow(envelope, clock);
  assert.equal(outcome.live_spend_calls, 0);
  assert.equal(outcome.paid_call_count, 0);
  assert.equal(outcome.production_effects, 0);
});

// ---------------------------------------------------------------------------
// W0-2053-C follow-up — Foreman QP scope omission: Strategy §5.1 requires the
// human kill switch to be *independently invocable* (usable without another
// agent run) and to immediately block four distinct action categories — new
// dispatches, retries, merges and successor release — while preserving
// evidence. The circuit-breaker reset tests above only prove reset-source
// restriction; they do not exercise a kill-switch entrypoint or any of the
// four blocked-action categories. These tests are INTENTIONALLY RED: no
// `invokeKillSwitch`, `evaluateRetryGate`, `evaluateMergeGate`, or
// `evaluateSuccessorReleaseGate` function exists on the controller module.
// ---------------------------------------------------------------------------

test('W0: the human kill switch is independently invocable, requiring no active job, dispatch context, or agent run', () => {
  const envelope = w0BaselineEnvelope();
  // Deliberately no controller.run(), no job/dispatch context, no active
  // work-item state machine — only the envelope and a direct human-CS2
  // request, proving the kill switch is a standalone entrypoint.
  const result = controller.invokeKillSwitch(envelope, {
    source: 'human_cs2',
    actor: CS2_USER,
    reason: 'incident containment test',
  });
  assert.equal(result.kill_switch_state, 'triggered');
  assert.equal(result.decision, 'ALLOW');
});

test('W0: a non-human-CS2 source cannot invoke the kill switch', () => {
  const envelope = w0BaselineEnvelope();
  const result = controller.invokeKillSwitch(envelope, {
    source: 'agent',
    actor: { login: 'foreman-v2-agent', type: 'Bot' },
  });
  assert.equal(result.kill_switch_state, 'armed');
  assert.equal(result.decision, 'STOP_AND_FIX');
});

test('W0: once triggered, the kill switch blocks any new dispatch regardless of an otherwise-valid safety envelope', () => {
  const triggeredEnvelope = w0BaselineEnvelope({ kill_switch_state: 'triggered' });
  const decision = controller.evaluateSafetyEnvelope(triggeredEnvelope, w0TaskRecord(), new Date('2026-10-04T00:00:00.000Z'));
  assert.equal(decision.decision, 'STOP_AND_FIX');
  assert.equal(decision.reason_code, 'KILL_SWITCH_TRIGGERED');
});

test('W0: once triggered, the kill switch blocks a retry attempt', () => {
  const triggeredEnvelope = w0BaselineEnvelope({ kill_switch_state: 'triggered' });
  const decision = controller.evaluateRetryGate(triggeredEnvelope, { work_item_id: 'pit-issue-42', attempt_count: 2 });
  assert.equal(decision.decision, 'STOP_AND_FIX');
  assert.equal(decision.reason_code, 'KILL_SWITCH_TRIGGERED');
});

test('W0: once triggered, the kill switch blocks a merge action', () => {
  const triggeredEnvelope = w0BaselineEnvelope({ kill_switch_state: 'triggered' });
  const decision = controller.evaluateMergeGate(triggeredEnvelope, { pr_number: 2061, head_sha: 'a'.repeat(40) });
  assert.equal(decision.decision, 'STOP_AND_FIX');
  assert.equal(decision.reason_code, 'KILL_SWITCH_TRIGGERED');
});

test('W0: once triggered, the kill switch blocks successor release', () => {
  const triggeredEnvelope = w0BaselineEnvelope({ kill_switch_state: 'triggered' });
  const decision = controller.evaluateSuccessorReleaseGate(triggeredEnvelope, {
    work_item_id: 'pit-issue-42',
    successor_work_item_id: 'pit-issue-43',
  });
  assert.equal(decision.decision, 'STOP_AND_FIX');
  assert.equal(decision.reason_code, 'KILL_SWITCH_TRIGGERED');
});

test('W0: a kill switch invocation preserves all existing evidence and decision-record history', () => {
  const envelope = w0BaselineEnvelope();
  const priorRecords = [controller.buildDecisionRecord(w0SampleEvent())];
  const result = controller.invokeKillSwitch(envelope, {
    source: 'human_cs2',
    actor: CS2_USER,
    reason: 'incident containment evidence test',
    existing_decision_records: priorRecords,
  });
  assert.equal(result.evidence_preserved, true);
  assert.deepEqual(result.preserved_decision_records, priorRecords);
});

// ---------------------------------------------------------------------------
// W0-2053-D — Schema-focused QA-to-RED coverage proving the absent versioned,
// machine-validatable safety-envelope and decision-record schema files, and
// the absent controller schema-validation interface that must gate their use
// before any evaluation, enforcement, or append is allowed.
//
// Task record: .agent-admin/prs/pr-2061/wave-current-tasks.md (task W0-2053-D)
// Evidence: .agent-admin/evidence/pr-2061-w0-qa-to-red.md
//
// These tests are INTENTIONALLY RED for one of two reasons only:
//   (a) `.github/cs2-controller/safety-envelope.schema.json` and
//       `.github/cs2-controller/decision-record.schema.json` do not exist on
//       disk (`fs.existsSync`/`fs.readFileSync` fails), or
//   (b) `controller.validateSafetyEnvelopeAgainstSchema` and
//       `controller.validateDecisionRecordAgainstSchema` do not exist on the
//       controller module (`TypeError: ... is not a function`).
// No test here creates, stubs, or fakes either schema file or the validator
// functions; every failure is attributable solely to the absent required
// artifact, never to a malformed fixture. `W0_SAFETY_ENVELOPE_FIELDS` and
// `W0_DECISION_RECORD_FIELDS` (defined above) are the authoritative Strategy
// §5.1 (14 fields) and §5.2 (22 fields) field lists, reused here so the
// schema assertions stay exactly aligned with the behavioural RED tests
// already accepted for W0-2053-C. The numeric limits asserted below (1
// active job, 1 remediation attempt, 1 merge attempt, 30-minute dispatch
// ceiling, 2-hour total runtime, runtime-only spend) match the exact W0
// limits already fixed in `w0BaselineEnvelope()` above and in
// `.agent-admin/prs/pr-2061/wave-current-tasks.md`.
// ---------------------------------------------------------------------------

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SAFETY_ENVELOPE_SCHEMA_PATH = path.join(REPO_ROOT, '.github', 'cs2-controller', 'safety-envelope.schema.json');
const DECISION_RECORD_SCHEMA_PATH = path.join(REPO_ROOT, '.github', 'cs2-controller', 'decision-record.schema.json');

function readSchemaFile(absolutePath) {
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

test('W0: a versioned, machine-validatable safety-envelope schema file exists at .github/cs2-controller/safety-envelope.schema.json', () => {
  assert.equal(
    fs.existsSync(SAFETY_ENVELOPE_SCHEMA_PATH),
    true,
    'expected .github/cs2-controller/safety-envelope.schema.json to exist',
  );
});

test('W0: a versioned, machine-validatable decision-record schema file exists at .github/cs2-controller/decision-record.schema.json', () => {
  assert.equal(
    fs.existsSync(DECISION_RECORD_SCHEMA_PATH),
    true,
    'expected .github/cs2-controller/decision-record.schema.json to exist',
  );
});

test('W0: the safety-envelope schema is valid, versioned JSON Schema (draft-aware $schema plus an explicit schema_version)', () => {
  const schema = readSchemaFile(SAFETY_ENVELOPE_SCHEMA_PATH);
  assert.equal(typeof schema.$schema, 'string');
  assert.match(schema.$schema, /json-schema\.org/);
  assert.equal(schema.type, 'object');
  assert.equal(typeof schema.schema_version, 'string');
  assert.match(schema.schema_version, /^\d+\.\d+\.\d+$/);
});

test('W0: the decision-record schema is valid, versioned JSON Schema (draft-aware $schema plus an explicit schema_version)', () => {
  const schema = readSchemaFile(DECISION_RECORD_SCHEMA_PATH);
  assert.equal(typeof schema.$schema, 'string');
  assert.match(schema.$schema, /json-schema\.org/);
  assert.equal(schema.type, 'object');
  assert.equal(typeof schema.schema_version, 'string');
  assert.match(schema.schema_version, /^\d+\.\d+\.\d+$/);
});

test('W0: the safety-envelope schema requires exactly the 14 Strategy §5.1 fields, no more and no fewer', () => {
  const schema = readSchemaFile(SAFETY_ENVELOPE_SCHEMA_PATH);
  assert.deepEqual([...schema.required].sort(), [...W0_SAFETY_ENVELOPE_FIELDS].sort());
  assert.deepEqual(Object.keys(schema.properties).sort(), [...W0_SAFETY_ENVELOPE_FIELDS].sort());
});

test('W0: the safety-envelope schema encodes the exact approved W0 limits: 1 active job, 1 remediation attempt, 1 merge attempt, 30-minute dispatch ceiling, 2-hour total runtime, runtime-only spend', () => {
  const schema = readSchemaFile(SAFETY_ENVELOPE_SCHEMA_PATH);
  assert.equal(schema.properties.maximum_active_jobs.const, 1);
  assert.equal(schema.properties.maximum_remediation_attempts.const, 1);
  assert.equal(schema.properties.maximum_merge_attempts.const, 1);
  assert.equal(schema.properties.maximum_dispatch_runtime.properties.value.const, 30 * 60);
  assert.equal(schema.properties.maximum_dispatch_runtime.properties.unit.const, 'seconds');
  assert.equal(schema.properties.maximum_total_runtime.properties.value.const, 2 * 60 * 60);
  assert.equal(schema.properties.maximum_total_runtime.properties.unit.const, 'seconds');
  assert.deepEqual(schema.properties.maximum_spend.properties.mode.enum, ['runtime_only']);
});

test('W0: the safety-envelope schema restricts reset_authority to human-CS2-only, excluding every automated reset source', () => {
  const schema = readSchemaFile(SAFETY_ENVELOPE_SCHEMA_PATH);
  assert.deepEqual(schema.properties.reset_authority.enum, ['human_cs2_only']);
  for (const forbiddenSource of ['webhook', 'agent', 'token', 'comment', 'pull_request', 'automatic_retry']) {
    assert.ok(
      !schema.properties.reset_authority.enum.includes(forbiddenSource),
      `reset_authority must not permit a ${forbiddenSource} source`,
    );
  }
});

test('W0: the decision-record schema requires exactly the 22 Strategy §5.2 fields, no more and no fewer', () => {
  const schema = readSchemaFile(DECISION_RECORD_SCHEMA_PATH);
  assert.deepEqual([...schema.required].sort(), [...W0_DECISION_RECORD_FIELDS].sort());
  assert.deepEqual(Object.keys(schema.properties).sort(), [...W0_DECISION_RECORD_FIELDS].sort());
});

test('W0: the decision-record schema forbids additional properties, pinning a single fixed deterministic shape', () => {
  const schema = readSchemaFile(DECISION_RECORD_SCHEMA_PATH);
  assert.equal(schema.additionalProperties, false);
});

test('W0: the decision-record schema constrains decision and reason_code to a closed, typed enum including the mandatory UNKNOWN_STATE refusal, never an open/free-text value', () => {
  const schema = readSchemaFile(DECISION_RECORD_SCHEMA_PATH);
  assert.ok(Array.isArray(schema.properties.decision.enum));
  assert.ok(schema.properties.decision.enum.includes('ALLOW'));
  assert.ok(schema.properties.decision.enum.includes('STOP_AND_FIX'));
  assert.ok(schema.properties.decision.enum.includes('PROVEN_EXTERNAL_BOUNDARY'));
  assert.ok(Array.isArray(schema.properties.reason_code.enum));
  assert.ok(schema.properties.reason_code.enum.includes('UNKNOWN_STATE'));
});

test('W0: a controller interface validates a well-formed safety envelope against the versioned schema before allowing any use', () => {
  const envelope = w0BaselineEnvelope();
  const result = controller.validateSafetyEnvelopeAgainstSchema(envelope);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('W0: the safety-envelope schema validator rejects an envelope that violates an exact approved limit, with typed errors, not a silent pass', () => {
  const envelope = w0BaselineEnvelope({ maximum_active_jobs: 2 });
  const result = controller.validateSafetyEnvelopeAgainstSchema(envelope);
  assert.equal(result.valid, false);
  assert.ok(Array.isArray(result.errors) && result.errors.length > 0);
});

test('W0: a controller interface validates a well-formed decision record against the versioned schema before allowing any append', () => {
  const record = w0SampleEvent();
  const result = controller.validateDecisionRecordAgainstSchema(record);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('W0: the decision-record schema validator issues a typed refusal for an unrecognized state_before, never a silent pass or inferred readiness', () => {
  const record = w0SampleEvent({ state_before: 'not_a_real_state' });
  const result = controller.validateDecisionRecordAgainstSchema(record);
  assert.equal(result.valid, false);
  assert.ok(Array.isArray(result.errors) && result.errors.length > 0);
});

test('W0: the controller refuses to evaluate a safety envelope that fails versioned schema validation, before any field-level enforcement runs', () => {
  const envelope = w0BaselineEnvelope({ maximum_dispatch_runtime: { unit: 'seconds', value: 1799 } });
  const schemaResult = controller.validateSafetyEnvelopeAgainstSchema(envelope);
  assert.equal(schemaResult.valid, false);
  const decision = controller.evaluateSafetyEnvelope(envelope, w0TaskRecord(), new Date('2026-10-04T00:00:00.000Z'));
  assert.equal(decision.decision, 'STOP_AND_FIX');
  assert.equal(decision.reason_code, 'ENVELOPE_SCHEMA_INVALID');
});
