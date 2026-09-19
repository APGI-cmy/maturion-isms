'use strict';

const REGISTER_MARKER = '<!-- pit-cs2-work-register:v1 -->';
const FOREMAN_DISPATCH_MARKER = '<!-- pit-cs2-foreman-dispatch:v1 -->';
const PR_BOUND_MARKER = '<!-- pit-cs2-pr-bound:v1 -->';
const ACTIVE_STATES = new Set([
  'intake', 'foreman', 'builder', 'qp', 'ecap', 'iaa', 'cs2_review', 'awaiting_human',
]);
const WORK_ITEM_PATTERN = /^CS2-Work-Item:\s*(pit-issue-\d+)\s*$/mi;

function initialRegister({ issueNumber, repository }) {
  return {
    register_version: '1.0.0',
    work_item_id: `pit-issue-${issueNumber}`,
    repository,
    module: 'PIT',
    issue_number: issueNumber,
    pr_number: null,
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

function parseRegister(body) {
  if (!body || !body.includes(REGISTER_MARKER)) return null;
  const match = body.match(/<!-- pit-cs2-work-register:v1 -->\s*```json\s*([\s\S]*?)\s*```/);
  if (!match) throw new Error('PIT work-register marker does not contain JSON.');
  return JSON.parse(match[1]);
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
    next_action: 'FOREMAN_COMPLETE_IAA_PREBRIEF',
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

async function listComments(github, owner, repo, issueNumber) {
  const { data } = await github.rest.issues.listComments({
    owner, repo, issue_number: issueNumber, per_page: 100,
  });
  return data;
}

async function registerComment(github, owner, repo, issueNumber, core) {
  for (const comment of await listComments(github, owner, repo, issueNumber)) {
    try {
      const row = parseRegister(comment.body || '');
      if (row) return { comment, row };
    } catch (error) {
      core.warning(`Ignoring malformed controller record on #${issueNumber}: ${error.message}`);
    }
  }
  return null;
}

async function writeRegister(github, owner, repo, issueNumber, existingComment, row) {
  const body = renderRegister(row);
  if (existingComment) {
    await github.rest.issues.updateComment({ owner, repo, comment_id: existingComment.id, body });
    return;
  }
  await github.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body });
}

async function activeRows(github, owner, repo, exceptIssueNumber, core) {
  const { data: issues } = await github.rest.issues.listForRepo({
    owner, repo, state: 'open', per_page: 100,
  });
  const rows = [];
  for (const issue of issues) {
    if (issue.pull_request || issue.number === exceptIssueNumber) continue;
    const found = await registerComment(github, owner, repo, issue.number, core);
    if (found && isActive(found.row)) rows.push({ issue, ...found });
  }
  return rows;
}

async function dispatchForeman(github, owner, repo, issueNumber, row) {
  const already = (await listComments(github, owner, repo, issueNumber)).some((comment) =>
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
    `When an implementation PR is opened, include \`CS2-Work-Item: ${row.work_item_id}\` in its body.`,
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
    if (await registerComment(github, owner, repo, issue.number, core)) {
      core.info('Work register already exists; idempotent no-op.');
      return;
    }
    const active = await activeRows(github, owner, repo, issue.number, core);
    if (active.length) {
      await github.rest.issues.createComment({
        owner, repo, issue_number: issue.number,
        body: `<!-- pit-cs2-controller:single-job-conflict -->\nCS2_DECISION_REQUIRED: active PIT work item \`${active[0].row.work_item_id}\` is not closed. This request was not claimed.`,
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
    const found = await registerComment(github, owner, repo, issueNumber, core);
    if (!found || !isActive(found.row) || found.row.work_item_id !== workItemId) {
      core.warning('Work-item binding is absent, closed, or mismatched; no action.');
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
      owner, repo, issue_number: pr.number,
      body: [
        PR_BOUND_MARKER,
        `@copilot Foreman: PR #${pr.number} at \`${pr.head.sha}\` is bound to \`${next.work_item_id}\`.`,
        'Complete the job-bound IAA PRE-BRIEF now. A missing pre-brief is a Foreman action, not a CS2 escalation. Ignore any historic wave, pre-brief, or gate material that is not bound to this work-item and PR.',
      ].join('\n'),
    });
    return;
  }

  if (activeEventName === 'issue_comment' && !context.payload.issue.pull_request) {
    const issue = context.payload.issue;
    const found = await registerComment(github, owner, repo, issue.number, core);
    if (!found) {
      core.info('No PIT work register on this Issue; no action.');
      return;
    }
    const author = String(context.payload.comment.user?.login || '');
    if (author !== 'APGI-cmy') {
      core.info('Approval commands are accepted only from human CS2.');
      return;
    }
    const command = String(context.payload.comment.body || '').trim()
      .match(/^\/cs2-(approve|reject)\s+(scope-expansion|merge)$/i);
    if (!command) {
      core.info('No controller approval command; no action.');
      return;
    }
    const status = command[1].toLowerCase() === 'approve' ? 'approved' : 'rejected';
    const kind = command[2].toLowerCase();
    const next = recordHumanApproval(found.row, kind, author, status);
    await writeRegister(github, owner, repo, issue.number, found.comment, next);
    core.info(`Recorded human ${kind} decision: ${status}.`);
    return;
  }

  core.info('Safety observation complete: no changed, controller-owned transition to apply.');
}

module.exports = {
  ACTIVE_STATES,
  FOREMAN_DISPATCH_MARKER,
  PR_BOUND_MARKER,
  REGISTER_MARKER,
  boundWorkItem,
  bindPullRequest,
  initialRegister,
  isPitRequest,
  isSameRepositoryPullRequest,
  issueFormField,
  isActive,
  parseRegister,
  recordHumanApproval,
  renderRegister,
  run,
};
