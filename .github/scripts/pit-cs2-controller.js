'use strict';

const REGISTER_MARKER = '<!-- pit-cs2-work-register:v1 -->';
const ACTIVE_STATES = new Set([
  'intake', 'foreman', 'builder', 'qp', 'ecap', 'iaa', 'cs2_review', 'awaiting_human',
]);

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

module.exports = {
  ACTIVE_STATES,
  REGISTER_MARKER,
  bindPullRequest,
  initialRegister,
  isActive,
  parseRegister,
  recordHumanApproval,
  renderRegister,
};
