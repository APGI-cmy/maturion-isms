'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('pilot workflow delegates controller decisions to the tested runtime module', () => {
  const workflow = read('workflows/pit-cs2-controller.yml');
  assert.match(workflow, /types: \[opened\]/);
  assert.match(workflow, /cron: '17 \* \* \* \*'/);
  assert.match(workflow, /await controller\.run\(\{ github, context, core, eventName: process\.env\.EVENT_NAME \}\)/);
  assert.match(workflow, /ref: \$\{\{ github\.event\.repository\.default_branch \}\}/);
});

test('pre-brief injection cannot use a repository-global legacy wave record', () => {
  const workflow = read('workflows/iaa-prebrief-inject.yml');
  assert.match(workflow, /require\('\.\/\.github\/scripts\/iaa-prebrief-inject\.js'\)/);
  assert.match(workflow, /name: Collect current-head injector inputs/);
  assert.match(workflow, /name: Evaluate current-head blocker snapshot/);
  assert.match(workflow, /CHECKPOINT_CHECK_RUNS_PATH:/);
  assert.match(workflow, /CHECKPOINT_MERGEABLE_WITH_BASE:/);
  assert.match(workflow, /core\.setOutput\('injection_outcome'/);
  assert.doesNotMatch(workflow, /taskPaths\.push\('\.agent-workspace\/foreman-v2\/personal\/wave-current-tasks\.md'\)/);
  assert.match(workflow, /A pre-brief belongs only to the PR-scoped job/);
  assert.match(workflow, /core\.setOutput\('task_path', taskPath\)/);
  assert.match(workflow, /core\.setOutput\('work_item_id', workItemId\)/);
  assert.match(workflow, /core\.setOutput\('task_head_sha', taskHeadSha\)/);
  assert.match(workflow, /core\.setOutput\('terminal_state_reason'/);
  assert.match(workflow, /steps\.inspect\.outputs\.injection_outcome == 'REQUEST_PREBRIEF'/);
  assert.match(workflow, /steps\.inspect\.outputs\.injection_outcome != 'REQUEST_PREBRIEF'/);
  assert.match(workflow, /PR-scoped task record:/);
  assert.match(workflow, /Submitted head:/);
  assert.doesNotMatch(workflow, /pull_request_target:\n\s+types: \[opened, ready_for_review\]/);
});

test('pilot documentation locks the controller-facing governance route', () => {
  const guide = read('cs2-controller/pit-pilot.md');
  assert.match(guide, /Foreman must create the PR-scoped task record, invoke IAA/i);
  assert.match(guide, /Foreman → CodexAdvisor\/CS2, not PIT implementation scope/);
  assert.match(guide, /IAA rejects the\s+submission, the controller route returns to Foreman for one bounded correction/i);
  assert.match(guide, /legacy\s+personal-path consultation is a Foreman\/IAA fallback only when no PR-scoped\s+task record exists/i);
  assert.match(guide, /independent external attestation/);
  assert.doesNotMatch(guide, /`NO_CHANGE`, `STOP_AND_FIX`, `READY_FOR_IAA`, or/);
  assert.match(guide, /`READY_FOR_IAA` \(or any ready-class label\) is never a terminal completion/i);
});
