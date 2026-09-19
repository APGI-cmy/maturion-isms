'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const controller = require('./pit-cs2-controller.js');

test('register round-trips and starts in Foreman pre-brief state', () => {
  const row = controller.initialRegister({ issueNumber: 42, repository: 'APGI-cmy/maturion-isms' });
  assert.equal(row.next_action, 'FOREMAN_BOOTSTRAP_AND_IAA_PREBRIEF');
  assert.deepEqual(controller.parseRegister(controller.renderRegister(row)), row);
});

test('only one nominated pull request can bind to a work item', () => {
  const row = controller.initialRegister({ issueNumber: 42, repository: 'APGI-cmy/maturion-isms' });
  const bound = controller.bindPullRequest(row, { prNumber: 100, headSha: 'a'.repeat(40) });
  assert.equal(bound.pr_number, 100);
  assert.throws(() => controller.bindPullRequest(bound, { prNumber: 101, headSha: 'b'.repeat(40) }));
});

test('automation cannot record a human approval', () => {
  const row = controller.initialRegister({ issueNumber: 42, repository: 'APGI-cmy/maturion-isms' });
  assert.throws(() => controller.recordHumanApproval(row, 'merge', 'github-actions[bot]', 'approved'));
  assert.equal(controller.recordHumanApproval(row, 'merge', 'APGI-cmy', 'approved').human_approval.merge.status, 'approved');
});

function createHarness({ issues, initialComments = {} }) {
  let nextCommentId = 1;
  const comments = new Map(Object.entries(initialComments).map(([issueNumber, rows]) => [
    String(issueNumber),
    rows.map((comment) => ({ ...comment })),
  ]));

  function issueComments(issueNumber) {
    const key = String(issueNumber);
    if (!comments.has(key)) comments.set(key, []);
    return comments.get(key);
  }

  const github = {
    rest: {
      issues: {
        async listComments({ issue_number }) {
          return { data: issueComments(issue_number).map((comment) => ({ ...comment })) };
        },
        async createComment({ issue_number, body }) {
          const comment = { id: nextCommentId++, body };
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
        async listForRepo() {
          return { data: issues.map((issue) => ({ ...issue })) };
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
    'https://github.com/APGI-cmy/maturion-isms/pull/2046#issuecomment-5740718105',
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

test('real Issue Form payload is claimed once and duplicate intake is idempotent', async () => {
  const issue = {
    number: 42,
    title: '[CS2] PIT controller correction',
    body: workRequestBody(),
    labels: [{ name: 'cs2:queued' }],
  };
  const harness = createHarness({ issues: [issue] });
  const context = {
    eventName: 'issues',
    payload: { issue },
    repo: { owner: 'APGI-cmy', repo: 'maturion-isms' },
  };

  await controller.run({ github: harness.github, context, core: harness.core, eventName: 'issues' });
  await controller.run({ github: harness.github, context, core: harness.core, eventName: 'issues' });

  const posted = harness.comments.get('42') || [];
  assert.equal(posted.length, 2);
  assert.equal(posted.filter((comment) => comment.body.includes(controller.REGISTER_MARKER)).length, 1);
  assert.equal(posted.filter((comment) => comment.body.includes(controller.FOREMAN_DISPATCH_MARKER)).length, 1);

  const persisted = controller.parseRegister(posted.find((comment) => comment.body.includes(controller.REGISTER_MARKER)).body);
  assert.equal(persisted.work_item_id, 'pit-issue-42');
  assert.equal(persisted.state, 'foreman');
  assert.match(harness.messages.info.at(-1), /idempotent no-op/);
});

test('only the authorised same-repository work-item PR can bind once to the active row', async () => {
  const repository = 'APGI-cmy/maturion-isms';
  const seededRow = controller.initialRegister({ issueNumber: 42, repository });
  const harness = createHarness({
    issues: [{ number: 42, title: '[CS2] PIT controller correction', labels: [{ name: 'cs2:queued' }] }],
    initialComments: {
      42: [{ id: 900, body: controller.renderRegister(seededRow) }],
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

  persisted = controller.parseRegister((harness.comments.get('42') || [])[0].body);
  assert.equal(persisted.pr_number, null);
  assert.equal(harness.messages.warning.length, 1);
  assert.match(harness.messages.warning[0], /same-repository PRs/);

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
