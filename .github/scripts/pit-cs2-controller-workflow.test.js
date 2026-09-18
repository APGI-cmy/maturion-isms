'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('pilot workflow persists one register and has hourly safety observation', () => {
  const workflow = read('workflows/pit-cs2-controller.yml');
  assert.match(workflow, /controller\.renderRegister\(row\)/);
  assert.match(workflow, /cron: '17 \* \* \* \*'/);
  assert.match(workflow, /CS2-Work-Item:/);
  assert.match(workflow, /idempotent no-op/);
  assert.match(workflow, /\/cs2-\(approve\|reject\)/);
  assert.match(workflow, /author !== 'APGI-cmy'/);
});

test('pre-brief injection cannot use a repository-global legacy wave record', () => {
  const workflow = read('workflows/iaa-prebrief-inject.yml');
  assert.doesNotMatch(workflow, /taskPaths\.push\('\.agent-workspace\/foreman-v2\/personal\/wave-current-tasks\.md'\)/);
  assert.match(workflow, /A pre-brief belongs only to the PR-scoped job/);
  assert.doesNotMatch(workflow, /pull_request_target:\n\s+types: \[opened, ready_for_review\]/);
});
