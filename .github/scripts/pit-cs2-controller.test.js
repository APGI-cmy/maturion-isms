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
