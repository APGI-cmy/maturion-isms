import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '../../../..');
const read = (path) => readFileSync(join(repo, path), 'utf8');
const list = (path) => readdirSync(join(repo, path), { recursive: true }).map(String);

const routeSource = read('apps/isms-portal/src/App.tsx');
const pitPages = list('apps/isms-portal/src/pages/pit').join('\n');
const migrations = list('supabase/migrations').join('\n');

/**
 * Executable QA-to-RED sentinel for Issue #1968 / PR #1972.
 *
 * Run from the repository root:
 *   node --test modules/pit/06-qa-to-red/executable/pit-w83-prebuild.red.test.mjs
 *
 * These tests are intentionally RED until the appointed W8.3 implementation
 * builder supplies the missing runtime, schema and route capabilities. They are
 * not part of the normal GREEN regression command before builder appointment.
 */

test('PIT-RED-W83-001: milestone route is registered', () => {
  assert.match(routeSource, /projects\/:id\/milestones/, 'Missing milestone route');
});

test('PIT-RED-W83-002: deliverable route is registered', () => {
  assert.match(routeSource, /projects\/:id\/deliverables/, 'Missing deliverable route');
});

test('PIT-RED-W83-003: task route is registered', () => {
  assert.match(routeSource, /projects\/:id\/tasks/, 'Missing task route');
});

test('PIT-RED-W83-004: project settings route is registered', () => {
  assert.match(routeSource, /projects\/:id\/settings/, 'Missing project settings route');
});

test('PIT-RED-W83-005: hierarchy workspaces exist', () => {
  assert.match(pitPages, /Milestone/i, 'Missing milestone workspace');
  assert.match(pitPages, /Deliverable/i, 'Missing deliverable workspace');
  assert.match(pitPages, /Task/i, 'Missing task workspace');
});

test('PIT-RED-W83-006: Supabase hierarchy migration exists', () => {
  assert.match(migrations, /pit.*w83.*hierarchy/i, 'Missing W8.3 hierarchy migration');
});

test('PIT-RED-W83-007: structural-change approval migration exists', () => {
  assert.match(migrations, /hierarchy.*change.*request|structural.*change/i, 'Missing structural-change request and approval migration');
});

test('PIT-RED-W83-008: atomic transfer/cancel RPC is specified in migration source', () => {
  const migrationText = list('supabase/migrations')
    .filter((name) => name.endsWith('.sql'))
    .map((name) => read(`supabase/migrations/${name}`))
    .join('\n');
  assert.match(
    migrationText,
    /approve.*hierarchy.*change|apply.*structural.*change|transfer.*and.*cancel/i,
    'Missing atomic project-leader approval RPC for transfer and cancellation',
  );
});
