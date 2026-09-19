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
  assert.doesNotMatch(workflow, /taskPaths\.push\('\.agent-workspace\/foreman-v2\/personal\/wave-current-tasks\.md'\)/);
  assert.match(workflow, /A pre-brief belongs only to the PR-scoped job/);
  assert.match(workflow, /core\.setOutput\('task_path', taskPath\)/);
  assert.match(workflow, /core\.setOutput\('work_item_id', workItemId\)/);
  assert.match(workflow, /core\.setOutput\('task_head_sha', taskHeadSha\)/);
  assert.match(workflow, /PR-scoped task record:/);
  assert.match(workflow, /Submitted head:/);
  assert.doesNotMatch(workflow, /pull_request_target:\n\s+types: \[opened, ready_for_review\]/);
});
