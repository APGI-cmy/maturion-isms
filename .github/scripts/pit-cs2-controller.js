'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REGISTER_MARKER = '<!-- pit-cs2-work-register:v1 -->';
const FOREMAN_DISPATCH_MARKER = '<!-- pit-cs2-foreman-dispatch:v1 -->';
const PR_BOUND_MARKER = '<!-- pit-cs2-pr-bound:v1 -->';
const CONTROLLER_LOGIN = 'github-actions[bot]';
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
    'Do not ask Johan/CS2 to authorise, waive, or create this pre-brief. Resolve ordinary governance, tooling, evidence-format, and configuration defects inside the declared sandbox. Escalate only a genuine external credential/cost/destructive action, protected-contract change, unresolvable business decision, or final human UI/UX acceptance.',
    '',
    'Before PR binding, nominate exactly one same-repository PR on this Issue with `/cs2-nominate-pr <number>`.',
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
    if (author !== PILOT_CS2_LOGIN || String(actor.type || '') === 'Bot') {
      core.info('Controller commands are accepted only from human CS2.');
      return;
    }
    const body = String(context.payload.comment.body || '').trim();
    const nomination = body.match(/^\/cs2-nominate-pr\s+#?(\d+)$/i);
    if (nomination) {
      const prNumber = Number(nomination[1]);
      const { data: pr } = await github.rest.pulls.get({ owner, repo, pull_number: prNumber });
      const expectedMarker = `CS2-Work-Item: ${found.row.work_item_id}`;
      if (!isSameRepositoryPullRequest(pr, repository) || boundWorkItem(pr.body || '') !== found.row.work_item_id) {
        core.warning(`PR #${prNumber} is not an authorised nomination target for ${found.row.work_item_id}.`);
        return;
      }
      const next = nominatePullRequest(found.row, {
        prNumber,
        headRepository: pr.head.repo.full_name,
        bodyMarker: expectedMarker,
        actor: author,
      });
      await writeRegister(github, owner, repo, issue.number, found.comment, next);
      core.info(`Recorded nominated PR #${prNumber} for ${found.row.work_item_id}.`);
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
  parseRegister,
  recordHumanApproval,
  renderRegister,
  run,
  validateRegister,
};
