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
