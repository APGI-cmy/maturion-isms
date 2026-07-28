import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright';

/**
 * PIT W8.3 — Browser RED Harness (real browser + running app)
 *
 * Covers contract IDs: PIT-RED-W83-010..014, 018..020, 030(component), 034.
 *
 * Run from repository root:
 *   node --test modules/pit/06-qa-to-red/executable/pit-w83-browser.red.test.mjs
 *
 * Environment:
 *   - Optional PIT_W83_BROWSER_BASE_URL: use existing started app (skip local dev spawn)
 *   - Otherwise this harness starts `pnpm --filter isms-portal dev` on 127.0.0.1:5173
 */

const REPO_ROOT = new URL('../../../../', import.meta.url).pathname;
const DEFAULT_PORT = '5173';
const BASE_URL = process.env.PIT_W83_BROWSER_BASE_URL ?? `http://127.0.0.1:${DEFAULT_PORT}`;
const MANAGE_LOCAL_DEV_SERVER = !process.env.PIT_W83_BROWSER_BASE_URL;

const ROUTES = {
  root: '/',
  milestoneWizard: '/projects/00000000-0000-4000-8010-000000000001/milestones/new',
  deliverableWizard: '/projects/00000000-0000-4000-8010-000000000001/deliverables/new?milestoneId=00000000-0000-4000-8020-000000000001',
  taskWizard: '/projects/00000000-0000-4000-8010-000000000001/tasks/new?deliverableId=00000000-0000-4000-8030-000000000001',
  inviteAcceptance: '/projects/00000000-0000-4000-8010-000000000001/hierarchy-invite/invite-token-001',
  lifecycle: '/projects/00000000-0000-4000-8010-000000000001/settings/hierarchy',
  mmmTransform: '/projects/00000000-0000-4000-8010-000000000001/mmm-transform',
  aimcPreferences: '/projects/00000000-0000-4000-8010-000000000001/settings/aimc-preferences',
};

let devServer;
let browser;
let page;
const snapshots = new Map();

async function waitForServer(url, timeoutMs = 90_000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok || response.status === 404) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Browser harness failed to start app at ${url}: ${String(lastError ?? 'timeout')}`);
}

function spawnLocalAppServer() {
  return spawn('pnpm', ['--filter', 'isms-portal', 'dev', '--host', '127.0.0.1', '--port', DEFAULT_PORT, '--strictPort'], {
    cwd: REPO_ROOT,
    stdio: 'ignore',
    env: { ...process.env, CI: '1' },
  });
}

async function captureRoute(name, routePath) {
  const target = new URL(routePath, BASE_URL).toString();
  try {
    const response = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 10_000 });
    const html = await page.content();
    snapshots.set(name, {
      url: page.url(),
      status: response?.status() ?? null,
      html,
      notFound: /not found|404|page not found/i.test(html),
      denied: /access denied|permission denied|unauthorized|forbidden/i.test(html),
      error: null,
    });
  } catch (error) {
    snapshots.set(name, {
      url: target,
      status: null,
      html: '',
      notFound: false,
      denied: false,
      error: String(error),
    });
  }
}

async function launchBrowserWithBootstrap() {
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    if (!String(error).includes("Executable doesn't exist")) throw error;
    const install = spawnSync('npx', ['playwright', 'install', 'chromium'], {
      cwd: REPO_ROOT,
      stdio: 'inherit',
      env: { ...process.env, CI: '1' },
    });
    assert.equal(
      install.status,
      0,
      'Playwright browser bootstrap failed. Unable to install Chromium for W8.3 browser harness.',
    );
    return chromium.launch({ headless: true });
  }
}

function requireSnapshot(routeKey, capability) {
  const snap = snapshots.get(routeKey);
  assert.ok(snap, `W8.3 browser harness missing route snapshot for ${routeKey}`);
  assert.equal(
    snap.error,
    null,
    `W8.3 browser harness failed before RED assertion for ${capability}: ${snap.error}`,
  );
  return snap;
}

function assertCapabilityInRenderedUi(routeKey, capabilityRegex, requirementText) {
  const snap = requireSnapshot(routeKey, requirementText);
  assert.equal(
    snap.notFound,
    false,
    `W8.3 requires routable ${routeKey} state before capability checks — route resolved to not-found`,
  );
  assert.match(
    snap.html,
    capabilityRegex,
    requirementText,
  );
}

before(async () => {
  if (MANAGE_LOCAL_DEV_SERVER) {
    devServer = spawnLocalAppServer();
    await waitForServer(BASE_URL);
  } else {
    await waitForServer(BASE_URL);
  }

  browser = await launchBrowserWithBootstrap();
  page = await browser.newPage();

  await captureRoute('root', ROUTES.root);
  await captureRoute('milestoneWizard', ROUTES.milestoneWizard);
  await captureRoute('deliverableWizard', ROUTES.deliverableWizard);
  await captureRoute('taskWizard', ROUTES.taskWizard);
  await captureRoute('inviteAcceptance', ROUTES.inviteAcceptance);
  await captureRoute('lifecycle', ROUTES.lifecycle);
  await captureRoute('mmmTransform', ROUTES.mmmTransform);
  await captureRoute('aimcPreferences', ROUTES.aimcPreferences);
});

after(async () => {
  if (page) await page.close();
  if (browser) await browser.close();
  if (devServer) {
    devServer.kill('SIGTERM');
    const exited = await Promise.race([
      once(devServer, 'exit'),
      new Promise((resolve) => setTimeout(() => resolve('timeout'), 5_000)),
    ]);
    if (exited === 'timeout') devServer.kill('SIGKILL');
  }
});

test('PIT-RED-W83-010 [browser] MilestoneSetupWizard renders five wizard states', () => {
  assertCapabilityInRenderedUi(
    'milestoneWizard',
    /milestone\s+setup\s+wizard|setup\s*→\s*configure\s*→\s*scope\s*→\s*invite\s*→\s*confirm/i,
    'W8.3 requires MilestoneSetupWizard rendered with five wizard states (setup/configure/scope/invite/confirm)',
  );
});

test('PIT-RED-W83-011 [browser] DeliverableSetupWizard renders with parent milestone scope', () => {
  assertCapabilityInRenderedUi(
    'deliverableWizard',
    /deliverable\s+setup\s+wizard|parent\s+milestone/i,
    'W8.3 requires DeliverableSetupWizard rendered with explicit parent-milestone scope',
  );
});

test('PIT-RED-W83-012 [browser] TaskSetupWizard enforces mandatory deliverable parent binding', () => {
  assertCapabilityInRenderedUi(
    'taskWizard',
    /task\s+setup\s+wizard|deliverable\s+parent/i,
    'W8.3 requires TaskSetupWizard rendered with mandatory deliverable parent binding',
  );
});

test('PIT-RED-W83-013 [browser] MilestoneOwnerInvitePreview renders accountability and timeline content', () => {
  assertCapabilityInRenderedUi(
    'milestoneWizard',
    /milestone\s+owner\s+invite\s+preview|accountability\s+scope|timeline/i,
    'W8.3 requires MilestoneOwnerInvitePreview with accountability scope and timeline content',
  );
});

test('PIT-RED-W83-014 [browser] HierarchyInviteAcceptance route renders acceptance journey', () => {
  assertCapabilityInRenderedUi(
    'inviteAcceptance',
    /hierarchy\s+invite\s+acceptance|accept\s+ownership/i,
    'W8.3 requires a rendered HierarchyInviteAcceptance journey on the hierarchy invite route',
  );
});

test('PIT-RED-W83-018 [browser] HierarchyLifecycleActions renders Archive/Cancel/Restore controls', () => {
  assertCapabilityInRenderedUi(
    'lifecycle',
    /archive|cancel|restore/i,
    'W8.3 requires HierarchyLifecycleActions controls (Archive, Cancel, Restore) in rendered lifecycle UI',
  );
});

test('PIT-RED-W83-019 [browser] CancellationDescendantGuard blocks milestone cancellation with incomplete descendants', () => {
  assertCapabilityInRenderedUi(
    'lifecycle',
    /incomplete\s+descendants|review\s+descendants|cancellation\s+blocked/i,
    'W8.3 requires milestone cancellation blocking modal for incomplete descendants',
  );
});

test('PIT-RED-W83-020 [browser] CancellationDescendantGuard blocks deliverable cancellation with incomplete tasks', () => {
  assertCapabilityInRenderedUi(
    'lifecycle',
    /incomplete\s+tasks|deliverable\s+cancellation\s+blocked/i,
    'W8.3 requires deliverable-level cancellation blocking modal for incomplete tasks',
  );
});

test('PIT-RED-W83-030 [browser] MmmTransformWizard renders domain/MPS/criterion transformation surface', () => {
  assertCapabilityInRenderedUi(
    'mmmTransform',
    /mmm\s+transform\s+wizard|domain|mps|criterion|import/i,
    'W8.3 requires MmmTransformWizard rendered with Domain/MPS/Criterion transformation controls',
  );
});

test('PIT-RED-W83-034 [browser] AIMC preference panel renders opt-in/inspect/delete controls', () => {
  assertCapabilityInRenderedUi(
    'aimcPreferences',
    /aimc\s+learning\s+opt-?in|stored\s+preferences|delete\s+all\s+preferences/i,
    'W8.3 requires AIMC preference panel with opt-in, inspect, and delete controls',
  );
});

test('PIT-RED-W83 [browser] W8.3 milestone/deliverable/task/settings/invite routes all render (not static checks)', () => {
  const required = ['milestoneWizard', 'deliverableWizard', 'taskWizard', 'lifecycle', 'inviteAcceptance'];
  const missing = required.filter((key) => requireSnapshot(key, key).notFound);
  assert.equal(
    missing.length,
    0,
    `W8.3 requires routed browser rendering for milestone/deliverable/task/settings/invite states — unresolved routes: ${missing.join(', ')}`,
  );
});
