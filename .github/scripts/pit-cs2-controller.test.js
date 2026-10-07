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
      users: {
        async getByUsername({ username }) {
          return { data: { login: username, type: 'User' } };
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
        w0ControllerStateComment(42),
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
      42: [w0ControllerStateComment(42)],
    },
  });

  await controller.run({
    github: harness.github,
    context: { eventName: 'issues', payload: { issue }, repo: { owner: 'APGI-cmy', repo: 'maturion-isms' } },
    core: harness.core,
    eventName: 'issues',
  });

  const posted = harness.comments.get('42') || [];
  const conflict = posted.find((comment) => comment.body.includes('pit-cs2-controller:single-job-conflict'));
  assert.ok(conflict);
  assert.match(conflict.body, /register on #77 is invalid/i);
  const state = controller.parseControllerState(
    posted.find((comment) => comment.body.includes(controller.CONTROLLER_STATE_MARKER)).body,
  );
  assert.equal(state.safety_envelope.circuit_breaker_state, 'tripped');
  assert.equal(state.trip_ledger.length, 1);
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
      42: [w0ControllerStateComment(42)],
    },
  });

  await controller.run({
    github: harness.github,
    context: { eventName: 'issues', payload: { issue }, repo: { owner: 'APGI-cmy', repo: 'maturion-isms' } },
    core: harness.core,
    eventName: 'issues',
  });

  const posted = harness.comments.get('42') || [];
  const conflict = posted.find((comment) => comment.body.includes('pit-cs2-controller:single-job-conflict'));
  assert.ok(conflict);
  assert.match(conflict.body, /pit-issue-250/);
  const state = controller.parseControllerState(
    posted.find((comment) => comment.body.includes(controller.CONTROLLER_STATE_MARKER)).body,
  );
  assert.equal(state.safety_envelope.circuit_breaker_state, 'tripped');
  assert.equal(state.trip_ledger.length, 1);
});

test('only a Foreman-nominated authorised same-repository work-item PR can bind once to the active row', async () => {
  const repository = 'APGI-cmy/maturion-isms';
  const seededRow = controller.initialRegister({ issueNumber: 42, repository });
  const harness = createHarness({
    issues: [{ number: 42, title: '[CS2] PIT controller correction', labels: [{ name: 'cs2:queued' }], state: 'open' }],
    initialComments: {
      42: [
        controllerComment(controller.renderRegister(seededRow), { id: 900 }),
        w0ControllerStateComment(42),
      ],
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
      42: [
        controllerComment(controller.renderRegister(row), { id: 910 }),
        w0ControllerStateComment(42),
      ],
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
// These accepted regressions exercise the controller API surface required by
// governance/strategy/GOVERNANCE_FAILURE_OUTENGINEERING_STRATEGY.md §§5.1–5.2.
// They remain executable against the real controller implementation.
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
    // Correction (2026-10-05, Foreman QP defect on W0-2053-D): CS2 has
    // explicitly stated maximum_merge_attempts and expiry remain required
    // fields but their defaults must not be enforced/activated. Each is
    // therefore an explicitly-tagged status object — an explicit
    // unactivated/proposed state by default here — never a bare, silently
    // active numeric/date default. An explicit approved/active state (via
    // `w0ActivatedLimit(value)`) remains available for tests that need to
    // exercise activated behaviour, but it must always be requested
    // explicitly, never inferred.
    maximum_merge_attempts: { status: 'proposed' },
    expiry: { status: 'proposed' },
    circuit_breaker_state: 'closed',
    reset_authority: 'human_cs2_only',
    kill_switch_state: 'armed',
    ...overrides,
  };
}

// Correction (2026-10-05): helper to construct an explicit approved/active
// value for a proposal-only field (maximum_merge_attempts, expiry), so tests
// that must exercise activated behaviour do so only via an explicit,
// human-CS2-decided state — never a silent default.
function w0ActivatedLimit(value) {
  return { status: 'approved_active', value };
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

function w0ControllerStateComment(issueNumber, envelope = w0BaselineEnvelope(), overrides = {}) {
  const workItemId = `pit-issue-${issueNumber}`;
  const state = {
    schema_version: '1.0.0',
    work_item_id: workItemId,
    safety_envelope: { ...envelope, work_item_id: workItemId },
    decision_history: [],
    trip_ledger: [],
    ...overrides,
  };
  return {
    id: 800 + issueNumber,
    body: controller.renderControllerState(state),
    user: CONTROLLER_USER,
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

test('W0: an explicitly approved/active expiry in the past fails closed (correction 2026-10-05: an explicit activation, never a silent default)', () => {
  const expired = w0BaselineEnvelope({ expiry: w0ActivatedLimit('2026-10-03T00:00:00.000Z') });
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
// restriction; the tests below exercise the independent kill-switch entrypoint
// and all four blocked-action categories against the real controller module.
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
// W0-2053-E correction (2026-10-05, Foreman QP defect on the pit-specialist
// containment implementation) — Strategy §5.1 requires that a kill-switch/
// circuit-breaker trip "produces exactly one LOOP_BREAK/BUDGET_TRIP
// decision" and that the 24-hour repeat-event simulation proves bounded
// execution. The prior implementation minted a distinct idempotency key per
// simulated tick (so a sustained over-limit condition could emit many
// BUDGET_TRIP ledger entries) and `invokeKillSwitch` never produced any
// typed trip decision at all. These tests prove the corrected behaviour and
// must remain green.
// ---------------------------------------------------------------------------

test('W0 correction: repeat events after the first total-runtime trip cause exactly one trip record, not one per tick', () => {
  const envelope = w0BaselineEnvelope();
  // tick_seconds is tiny relative to maximum_total_runtime (2 hours), so the
  // envelope trips early and the remaining simulated window represents many
  // repeat over-limit ticks for the same parent condition.
  const clock = { start: new Date('2026-10-04T00:00:00.000Z'), tick_seconds: 60, ticks: 24 * 60 };
  const outcome = controller.simulateTwentyFourHourWindow(envelope, clock);
  assert.equal(outcome.trip_count, 1, 'repeat over-limit ticks must not mint additional trip records');
  assert.equal(outcome.live_spend_calls, 0);
  assert.equal(outcome.paid_call_count, 0);
  assert.equal(outcome.production_effects, 0);
});

test('W0 correction: the 24-hour simulation halts at the first qualifying trip tick (bounded terminal behaviour)', () => {
  const envelope = w0BaselineEnvelope();
  // Request a far longer repeat-event window than 24 hours to prove the
  // simulation does not scale its ledger or its iteration count with the
  // requested window length once tripped.
  const clock = { start: new Date('2026-10-04T00:00:00.000Z'), tick_seconds: 60 * 60, ticks: 10000 };
  const outcome = controller.simulateTwentyFourHourWindow(envelope, clock);
  // maximum_total_runtime is 2 hours, so the trip occurs on tick 3 (the
  // first tick whose elapsed runtime exceeds the 2-hour ceiling).
  assert.equal(outcome.ticks_executed, 3);
  assert.ok(outcome.ticks_executed < clock.ticks, 'simulation must terminate well before the requested window length');
  assert.equal(outcome.trip_count, 1);
});

test('W0 correction: a non-tripping window within the fixed total-runtime ceiling executes every requested tick', () => {
  const envelope = w0BaselineEnvelope();
  const clock = { start: new Date('2026-10-04T00:00:00.000Z'), tick_seconds: 60 * 60, ticks: 2 };
  const outcome = controller.simulateTwentyFourHourWindow(envelope, clock);
  assert.equal(outcome.ticks_executed, 2);
  assert.equal(outcome.trip_count, 0);
});

test('W0 correction: an authorized kill-switch trip produces exactly one typed LOOP_BREAK or BUDGET_TRIP decision while preserving prior evidence', () => {
  const envelope = w0BaselineEnvelope();
  const priorRecords = [controller.buildDecisionRecord(w0SampleEvent())];
  const result = controller.invokeKillSwitch(envelope, {
    source: 'human_cs2',
    actor: CS2_USER,
    reason: 'incident containment typed-trip test',
    existing_decision_records: priorRecords,
  });
  assert.equal(result.kill_switch_state, 'triggered');
  assert.ok(result.trip_record, 'an authorized trip must produce a trip record');
  assert.ok(['LOOP_BREAK', 'BUDGET_TRIP'].includes(result.trip_record.type));
  assert.equal(result.trip_ledger.length, 1, 'exactly one typed trip must be recorded');
  // Prior evidence is unaffected by the new typed trip decision.
  assert.equal(result.evidence_preserved, true);
  assert.deepEqual(result.preserved_decision_records, priorRecords);
});

test('W0 correction: duplicate kill-switch calls for the same parent condition cannot emit a second trip', () => {
  const envelope = w0BaselineEnvelope();
  const sharedLedger = [];
  const first = controller.invokeKillSwitch(envelope, {
    source: 'human_cs2',
    actor: CS2_USER,
    reason: 'incident containment duplicate test (first call)',
    existing_trip_ledger: sharedLedger,
  });
  const second = controller.invokeKillSwitch(envelope, {
    source: 'human_cs2',
    actor: CS2_USER,
    reason: 'incident containment duplicate test (duplicate call)',
    existing_trip_ledger: sharedLedger,
  });
  assert.equal(first.trip_record.idempotency_key, second.trip_record.idempotency_key);
  assert.deepEqual(first.trip_record, second.trip_record);
  assert.equal(sharedLedger.length, 1, 'a duplicate kill-switch invocation must not mint a second trip');
});

test('W0 correction: reordered kill-switch calls for the same parent condition still yield exactly one trip', () => {
  const envelopeA = w0BaselineEnvelope({ work_item_id: 'pit-issue-77' });
  const sharedLedger = [];
  // Simulate reordering: a later-arriving retry request is processed before
  // an earlier one, both for the same work item / parent condition.
  const later = controller.invokeKillSwitch(envelopeA, {
    source: 'human_cs2',
    actor: CS2_USER,
    reason: 'reordered retry (processed first)',
    existing_trip_ledger: sharedLedger,
  });
  const earlier = controller.invokeKillSwitch(envelopeA, {
    source: 'human_cs2',
    actor: CS2_USER,
    reason: 'original request (processed second)',
    existing_trip_ledger: sharedLedger,
  });
  const trips = sharedLedger.filter((entry) => entry.type === 'LOOP_BREAK' || entry.type === 'BUDGET_TRIP');
  assert.equal(trips.length, 1);
  assert.deepEqual(later.trip_record, earlier.trip_record);
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
// These accepted schema regressions exercise the real versioned schemas and
// validator interface without stubbing either. `W0_SAFETY_ENVELOPE_FIELDS`
// and `W0_DECISION_RECORD_FIELDS` are the authoritative Strategy §5.1 (14
// fields) and §5.2 (22 fields) lists. The numeric limits asserted below (1
// active job, 1 remediation attempt, 30-minute dispatch ceiling, 2-hour
// total runtime, runtime-only spend) are the ONLY approved W0 numeric
// limits, and match the exact W0 limits already fixed in
// `w0BaselineEnvelope()` above and in
// `.agent-admin/prs/pr-2061/wave-current-tasks.md`.
//
// Correction (2026-10-05, Foreman QP defect on this task's original
// delivery): `maximum_merge_attempts` and `expiry` remain required fields of
// the safety-envelope schema (both are still asserted as present below), but
// per CS2's explicit direction their defaults remain proposal-only and must
// NOT be enforced or activated. Neither field is asserted with a `const` (or
// any other silently-activating) value below. Instead, each is proven to
// require an explicit, human-CS2-decided status — an explicit
// unactivated/proposed state, or an explicit approved/active state carrying
// its own value — and the controller validation interface is proven to fail
// closed when either field is missing or carries an invalid status, while
// never itself activating a proposed default.
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

test('W0: the safety-envelope schema encodes the exact approved W0 limits: 1 active job, 1 remediation attempt, 30-minute dispatch ceiling, 2-hour total runtime, runtime-only spend', () => {
  const schema = readSchemaFile(SAFETY_ENVELOPE_SCHEMA_PATH);
  assert.equal(schema.properties.maximum_active_jobs.const, 1);
  assert.equal(schema.properties.maximum_remediation_attempts.const, 1);
  assert.equal(schema.properties.maximum_dispatch_runtime.properties.value.const, 30 * 60);
  assert.equal(schema.properties.maximum_dispatch_runtime.properties.unit.const, 'seconds');
  assert.equal(schema.properties.maximum_total_runtime.properties.value.const, 2 * 60 * 60);
  assert.equal(schema.properties.maximum_total_runtime.properties.unit.const, 'seconds');
  assert.deepEqual(schema.properties.maximum_spend.properties.mode.enum, ['runtime_only']);
});

// ---------------------------------------------------------------------------
// Correction (2026-10-05, Foreman QP defect remediation) — the three tests
// below replace the prior defective `maximum_merge_attempts.const === 1`
// assertion. `maximum_merge_attempts` and `expiry` remain required fields
// (proven below), but CS2 has explicitly ruled their defaults remain
// proposal-only and must never be enforced/activated. These passing regressions
// ensure their status/value rules remain explicit and fail closed.
// ---------------------------------------------------------------------------

test('W0: the safety-envelope schema requires both maximum_merge_attempts and expiry as present fields (required, never silently dropped)', () => {
  const schema = readSchemaFile(SAFETY_ENVELOPE_SCHEMA_PATH);
  assert.ok(schema.required.includes('maximum_merge_attempts'), 'maximum_merge_attempts must remain a required field');
  assert.ok(schema.required.includes('expiry'), 'expiry must remain a required field');
  assert.ok(Object.hasOwn(schema.properties, 'maximum_merge_attempts'), 'maximum_merge_attempts must remain a declared property');
  assert.ok(Object.hasOwn(schema.properties, 'expiry'), 'expiry must remain a declared property');
});

test('W0: maximum_merge_attempts and expiry each require an explicit approved/active value or an explicit unactivated/proposed state, never a silently-defaulted active limit', () => {
  const schema = readSchemaFile(SAFETY_ENVELOPE_SCHEMA_PATH);
  for (const fieldName of ['maximum_merge_attempts', 'expiry']) {
    const fieldSchema = schema.properties[fieldName];
    assert.equal(fieldSchema.const, undefined, `${fieldName} must not carry a const (silently-activated) value`);
    assert.equal(fieldSchema.default, undefined, `${fieldName} must not carry a default (silently-activated) value`);
    assert.equal(fieldSchema.type, 'object', `${fieldName} must be an explicitly-tagged status object, not a bare value`);
    assert.ok(fieldSchema.required.includes('status'), `${fieldName} must require an explicit status`);
    assert.deepEqual(
      [...fieldSchema.properties.status.enum].sort(),
      ['approved_active', 'proposed'],
      `${fieldName}.status must be exactly an explicit approved/active or unactivated/proposed state`,
    );
  }
});

test('W0: the controller validation interface fails closed when maximum_merge_attempts or expiry is missing or carries an invalid status, but a proposed state never activates a default limit', () => {
  const missingMergeAttempts = w0BaselineEnvelope();
  delete missingMergeAttempts.maximum_merge_attempts;
  const missingDecision = controller.evaluateSafetyEnvelope(missingMergeAttempts, w0TaskRecord(), new Date('2026-10-04T00:00:00.000Z'));
  assert.equal(missingDecision.decision, 'STOP_AND_FIX');
  assert.equal(missingDecision.reason_code, 'ENVELOPE_MALFORMED');

  const invalidStatusEnvelope = w0BaselineEnvelope({ expiry: { status: 'not_a_real_status' } });
  const invalidResult = controller.validateSafetyEnvelopeAgainstSchema(invalidStatusEnvelope);
  assert.equal(invalidResult.valid, false);
  assert.ok(Array.isArray(invalidResult.errors) && invalidResult.errors.length > 0);

  const proposedOnlyEnvelope = w0BaselineEnvelope();
  const proposedValidation = controller.validateSafetyEnvelopeAgainstSchema(proposedOnlyEnvelope);
  assert.equal(proposedValidation.valid, true);
  assert.deepEqual(proposedValidation.errors, []);
  const proposedDecision = controller.evaluateSafetyEnvelope(proposedOnlyEnvelope, w0TaskRecord(), new Date('2026-10-04T00:00:00.000Z'));
  assert.equal(proposedDecision.decision, 'ALLOW');
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

test('W0 repair: tripped breaker blocks dispatch, retry, merge, successor release, and limit enforcement', () => {
  const envelope = w0BaselineEnvelope({ circuit_breaker_state: 'tripped' });
  const decision = controller.evaluateSafetyEnvelope(envelope, w0TaskRecord(), new Date('2026-10-04T00:00:00.000Z'));
  assert.deepEqual(decision, { decision: 'STOP_AND_FIX', reason_code: 'CIRCUIT_BREAKER_TRIPPED' });
  for (const gate of [
    controller.evaluateRetryGate,
    controller.evaluateMergeGate,
    controller.evaluateSuccessorReleaseGate,
  ]) {
    assert.deepEqual(gate(envelope, {}), { decision: 'STOP_AND_FIX', reason_code: 'CIRCUIT_BREAKER_TRIPPED' });
  }
  assert.deepEqual(
    controller.enforceWorkItemLimits({ active_work_items: 1 }, envelope),
    { decision: 'STOP_AND_FIX', reason_code: 'CIRCUIT_BREAKER_TRIPPED' },
  );
});

test('W0 repair: every action gate rejects absent, malformed, and schema-invalid envelopes', () => {
  const gates = [
    controller.evaluateRetryGate,
    controller.evaluateMergeGate,
    controller.evaluateSuccessorReleaseGate,
  ];
  for (const envelope of [null, {}, w0BaselineEnvelope({ maximum_active_jobs: 2 })]) {
    for (const gate of gates) {
      const result = gate(envelope, {});
      assert.equal(result.decision, 'STOP_AND_FIX');
      assert.notEqual(result.reason_code, 'NONE');
    }
  }
});

test('W0 repair: retry, merge, and successor gates reject a work-item-mismatched envelope', () => {
  const envelope = w0BaselineEnvelope();
  for (const gate of [
    controller.evaluateRetryGate,
    controller.evaluateMergeGate,
    controller.evaluateSuccessorReleaseGate,
  ]) {
    assert.deepEqual(
      gate(envelope, { work_item_id: 'pit-issue-999' }),
      { decision: 'STOP_AND_FIX', reason_code: 'ENVELOPE_TASK_INCONSISTENT' },
    );
    assert.equal(
      gate(envelope, { work_item_id: '' }).reason_code,
      'ENVELOPE_TASK_INCONSISTENT',
    );
  }
});

test('W0 repair: retry, merge, and successor gates reject expired approved envelopes', () => {
  const envelope = w0BaselineEnvelope({ expiry: w0ActivatedLimit('2020-01-01T00:00:00Z') });
  for (const gate of [
    controller.evaluateRetryGate,
    controller.evaluateMergeGate,
    controller.evaluateSuccessorReleaseGate,
  ]) {
    assert.deepEqual(
      gate(envelope, {}),
      { decision: 'STOP_AND_FIX', reason_code: 'ENVELOPE_EXPIRED' },
    );
  }
});

test('W0 repair: every supplied usage ceiling rejects negative, non-finite, fractional-count, and string values', () => {
  const envelope = w0BaselineEnvelope();
  const usageFields = [
    'active_work_items',
    'remediation_attempts',
    'dispatch_runtime_seconds',
    'total_runtime_seconds',
  ];
  for (const field of usageFields) {
    for (const value of [-1, Number.NaN, Number.POSITIVE_INFINITY, '1']) {
      const result = controller.enforceWorkItemLimits({ [field]: value }, envelope);
      assert.deepEqual(
        result,
        { decision: 'STOP_AND_FIX', reason_code: 'USAGE_UNMEASURABLE' },
        `${field}=${String(value)} must be refused`,
      );
    }
  }
  for (const field of ['active_work_items', 'remediation_attempts']) {
    assert.equal(
      controller.enforceWorkItemLimits({ [field]: 0.5 }, envelope).reason_code,
      'USAGE_UNMEASURABLE',
    );
  }
  assert.equal(
    controller.enforceWorkItemLimits({ untracked_runtime: Number.NaN }, envelope).reason_code,
    'USAGE_UNMEASURABLE',
  );
});

test('W0 repair: proposal fields require absent values when proposed and valid values when approved active', () => {
  for (const field of ['maximum_merge_attempts', 'expiry']) {
    const proposedWithValue = w0BaselineEnvelope({
      [field]: { status: 'proposed', value: field === 'expiry' ? '2026-10-04T00:00:00Z' : 1 },
    });
    const missingActiveValue = w0BaselineEnvelope({
      [field]: { status: 'approved_active' },
    });
    assert.equal(controller.validateSafetyEnvelopeAgainstSchema(proposedWithValue).valid, false);
    assert.equal(controller.validateSafetyEnvelopeAgainstSchema(missingActiveValue).valid, false);
  }
  assert.equal(controller.validateSafetyEnvelopeAgainstSchema(
    w0BaselineEnvelope({
      maximum_merge_attempts: { status: 'approved_active', value: 1 },
      expiry: { status: 'approved_active', value: '2026-10-04T00:00:00Z' },
    }),
  ).valid, true);
});

test('W0 repair: unknown decision states preserve the observed input and produce schema-valid typed refusals', () => {
  const unknown = controller.buildDecisionRecord(w0SampleEvent({ state_before: 'unexpected-phase' }));
  assert.equal(unknown.state_before, 'unexpected-phase');
  assert.equal(unknown.decision, 'STOP_AND_FIX');
  assert.equal(unknown.reason_code, 'UNKNOWN_STATE');
  assert.equal(controller.validateDecisionRecordAgainstSchema(unknown).valid, true);
});

test('W0 repair: missing or invalid decision facts become schema-valid STOP_AND_FIX records', () => {
  const record = controller.buildDecisionRecord({ event_id: 'invalid-facts', state_before: 'foreman' });
  assert.equal(record.decision, 'STOP_AND_FIX');
  assert.equal(record.reason_code, 'DECISION_RECORD_INVALID');
  assert.equal(controller.validateDecisionRecordAgainstSchema(record).valid, true);
  assert.ok(record.evidence_refs.some((ref) => ref === 'INVALID_FACT:work_item_id'));
});

test('W0 repair: decision schema rejects contradictory allow/refusal pairs', () => {
  const contradictory = w0SampleEvent({ decision: 'ALLOW', reason_code: 'KILL_SWITCH_TRIGGERED' });
  assert.equal(controller.validateDecisionRecordAgainstSchema(contradictory).valid, false);
});

test('W0 repair: claim path refuses missing and tripped persisted safety state before any register or dispatch write', async () => {
  const issue = {
    number: 42,
    title: '[CS2] PIT controller correction',
    body: workRequestBody(),
    labels: [{ name: 'cs2:queued' }],
    user: CS2_USER,
    state: 'open',
  };
  for (const initialComments of [{}, { 42: [w0ControllerStateComment(42, w0BaselineEnvelope({ circuit_breaker_state: 'tripped' }))] }]) {
    const harness = createHarness({ issues: [issue], initialComments });
    await controller.run({
      github: harness.github,
      context: { eventName: 'issues', payload: { issue }, repo: { owner: 'APGI-cmy', repo: 'maturion-isms' } },
      core: harness.core,
      eventName: 'issues',
    });
    const comments = harness.comments.get('42') || [];
    assert.equal(comments.some((comment) => comment.body.includes(controller.REGISTER_MARKER)), false);
    assert.equal(comments.some((comment) => comment.body.includes(controller.FOREMAN_DISPATCH_MARKER)), false);
    if (initialComments[42]) {
      const stateComment = comments.find((comment) => comment.body.includes(controller.CONTROLLER_STATE_MARKER));
      const state = controller.parseControllerState(stateComment.body);
      assert.equal(state.decision_history.at(-1).reason_code, 'CIRCUIT_BREAKER_TRIPPED');
    }
  }
});

test('W0 repair: PR bind path refuses a tripped persisted envelope before changing the register or dispatching', async () => {
  const repository = 'APGI-cmy/maturion-isms';
  const row = controller.nominatePullRequest(
    controller.initialRegister({ issueNumber: 42, repository }),
    {
      prNumber: 502,
      headRepository: repository,
      bodyMarker: 'CS2-Work-Item: pit-issue-42',
      actor: 'Copilot',
    },
  );
  const issue = { number: 42, title: 'PIT work item', state: 'open' };
  const harness = createHarness({
    issues: [issue],
    initialComments: {
      42: [
        controllerComment(controller.renderRegister(row), { id: 900 }),
        w0ControllerStateComment(42, w0BaselineEnvelope({ circuit_breaker_state: 'tripped' })),
      ],
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
  await controller.run({
    github: harness.github,
    context: {
      repo: { owner: 'APGI-cmy', repo: 'maturion-isms' },
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
  const persisted = controller.parseRegister(
    (harness.comments.get('42') || []).find((comment) => comment.body.includes(controller.REGISTER_MARKER)).body,
  );
  assert.equal(persisted.pr_number, null);
  assert.equal((harness.comments.get('502') || []).length, 0);
});

test('W0 repair: editable workflow input cannot impersonate CS2 for a reset', async () => {
  const harness = createHarness({
    issues: [{ number: 42, title: 'PIT work item', state: 'open' }],
    initialComments: {
      42: [w0ControllerStateComment(42, w0BaselineEnvelope({ circuit_breaker_state: 'tripped' }))],
    },
  });
  const result = await controller.runManualSafetyAction({
    github: harness.github,
    context: {
      actor: 'someone-else',
      repo: { owner: 'APGI-cmy', repo: 'maturion-isms' },
      payload: { inputs: { reset_actor_login: 'APGI-cmy' } },
    },
    core: harness.core,
    action: 'reset-circuit-breaker',
    issueNumber: 42,
  });
  assert.equal(result.decision, 'STOP_AND_FIX');
  assert.equal(result.reason_code, 'HUMAN_CS2_REQUIRED');
  const state = controller.parseControllerState(harness.comments.get('42')[0].body);
  assert.equal(state.safety_envelope.circuit_breaker_state, 'tripped');
  assert.equal(state.decision_history.length, 0);
});

test('W0 repair: human kill-switch persists envelope, prior history, and one trip ledger atomically across retries', async () => {
  const prior = controller.buildDecisionRecord(w0SampleEvent());
  const harness = createHarness({
    issues: [{ number: 42, title: 'PIT work item', state: 'open' }],
    initialComments: {
      42: [w0ControllerStateComment(42, w0BaselineEnvelope(), {
        decision_history: [prior],
      })],
    },
  });
  const context = {
    actor: 'APGI-cmy',
    repo: { owner: 'APGI-cmy', repo: 'maturion-isms' },
    payload: { inputs: { reset_actor_login: 'someone-else' } },
  };
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await controller.runManualSafetyAction({
      github: harness.github,
      context,
      core: harness.core,
      action: 'kill-switch',
      issueNumber: 42,
    });
    assert.equal(result.decision, 'ALLOW');
  }
  const comments = harness.comments.get('42');
  assert.equal(comments.length, 1);
  const state = controller.parseControllerState(comments[0].body);
  assert.equal(state.safety_envelope.kill_switch_state, 'triggered');
  assert.deepEqual(state.decision_history[0], prior);
  assert.equal(state.decision_history.length, 3);
  assert.equal(state.trip_ledger.length, 1);
  assert.equal(state.trip_ledger[0].type, 'BUDGET_TRIP');
});

test('W0 repair: authenticated human reset persists only the breaker transition and preserves trip evidence', async () => {
  const prior = controller.buildDecisionRecord(w0SampleEvent());
  const ledger = [controller.recordTripEvent([], w0TripEvent())];
  const harness = createHarness({
    issues: [{ number: 42, title: 'PIT work item', state: 'open' }],
    initialComments: {
      42: [w0ControllerStateComment(42, w0BaselineEnvelope({ circuit_breaker_state: 'tripped' }), {
        decision_history: [prior],
        trip_ledger: ledger,
      })],
    },
  });
  const result = await controller.runManualSafetyAction({
    github: harness.github,
    context: {
      actor: 'APGI-cmy',
      repo: { owner: 'APGI-cmy', repo: 'maturion-isms' },
    },
    core: harness.core,
    action: 'reset-circuit-breaker',
    issueNumber: 42,
  });
  assert.equal(result.decision, 'ALLOW');
  const state = controller.parseControllerState(harness.comments.get('42')[0].body);
  assert.equal(state.safety_envelope.circuit_breaker_state, 'closed');
  assert.deepEqual(state.trip_ledger, ledger);
  assert.deepEqual(state.decision_history[0], prior);
});
