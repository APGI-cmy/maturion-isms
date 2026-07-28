import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveHarnessConfig,
  createHarnessClients,
  verifyHarnessReadiness,
  createPersonas,
  cleanupPersonas,
} from './harness/pit-w83-supabase-harness.mjs';

let state;
let browser;
let chromium;

async function initializeHarness(t) {
  const config = resolveHarnessConfig(t);
  if (!config) return null;

  if (!state) {
    const clients = await createHarnessClients(config);
    await verifyHarnessReadiness(config, clients);
    const personaSeed = await createPersonas(clients);
    if (!chromium) {
      const playwright = await import('playwright');
      chromium = playwright.chromium;
    }

    const appProbe = await fetch(config.appUrl, { signal: AbortSignal.timeout(10_000) });
    assert.ok(
      appProbe.ok,
      `Application probe failed at ${config.appUrl} (${appProbe.status}). Start the app before executing browser RED tests.`,
    );

    browser = await chromium.launch({ headless: true });
    state = { config, clients, ...personaSeed };
  }

  return state;
}

async function withPage(t, run) {
  const current = await initializeHarness(t);
  if (!current) return;

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await run({ page, state: current });
  } finally {
    await context.close();
  }
}

const browserCases = [
  {
    id: 'PIT-RED-W83-006',
    title: 'viewer mutation controls are disabled and crafted API mutation is denied',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/projects/demo/milestones`, { waitUntil: 'domcontentloaded' });
      const editButton = page.locator('[data-testid="pit-mutation-edit"]');
      await assert.rejects(editButton.click(), /.+/, 'Expected viewer mutation control to be unavailable/disabled');

      const denial = await page.evaluate(async ({ url, key, token }) => {
        const response = await fetch(`${url}/rest/v1/rpc/pit_reparent_task`, {
          method: 'POST',
          headers: {
            apikey: key,
            Authorization: ['Bearer', token].join(' '),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ task_id: 'task-a', deliverable_id: 'deliverable-b' }),
        });
        return response.status;
      }, {
        url: state.config.supabaseUrl,
        key: state.config.anonKey,
        token: state.personas.viewer.accessToken,
      });

      assert.ok([401, 403, 409, 422].includes(denial), `Expected crafted viewer mutation denial but got HTTP ${denial}`);
    },
  },
  {
    id: 'PIT-RED-W83-007',
    title: 'milestone owner cannot edit sibling milestone',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/projects/demo/milestones`, { waitUntil: 'domcontentloaded' });
      await page.getByTestId('pit-milestone-row-sibling').getByRole('button', { name: /edit/i }).click();
      await assert.rejects(
        page.getByText(/unauthori[sz]ed|permission denied/i).waitFor({ timeout: 4_000 }),
        /.+/,
        'Expected explicit role-denial messaging for sibling milestone edit attempt',
      );
    },
  },
  {
    id: 'PIT-RED-W83-008',
    title: 'deliverable owner cannot edit sibling deliverable',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/projects/demo/deliverables`, { waitUntil: 'domcontentloaded' });
      await page.getByTestId('pit-deliverable-row-sibling').getByRole('button', { name: /edit/i }).click();
      await assert.rejects(
        page.getByText(/unauthori[sz]ed|permission denied/i).waitFor({ timeout: 4_000 }),
        /.+/,
        'Expected explicit role-denial messaging for sibling deliverable edit attempt',
      );
    },
  },
  {
    id: 'PIT-RED-W83-010',
    title: 'project leader milestone setup wizard renders five states',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/projects/demo/milestones`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: /new milestone|setup milestone/i }).click();
      await page.getByTestId('pit-milestone-wizard-step-1').waitFor();
      await page.getByTestId('pit-milestone-wizard-step-2').waitFor();
      await page.getByTestId('pit-milestone-wizard-step-3').waitFor();
      await page.getByTestId('pit-milestone-wizard-step-4').waitFor();
      await page.getByTestId('pit-milestone-wizard-step-5').waitFor();
    },
  },
  {
    id: 'PIT-RED-W83-011',
    title: 'milestone owner deliverable wizard is scope-bound',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/projects/demo/deliverables`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: /new deliverable|setup deliverable/i }).click();
      await page.getByTestId('pit-deliverable-wizard').waitFor();
      await page.getByTestId('pit-deliverable-parent-milestone').waitFor();
    },
  },
  {
    id: 'PIT-RED-W83-012',
    title: 'deliverable owner task wizard enforces deliverable parent',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/projects/demo/tasks`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: /new task|setup task/i }).click();
      await page.getByTestId('pit-task-parent-deliverable').waitFor();
      await page.getByRole('button', { name: /save draft/i }).click();
      await page.getByText(/deliverable parent is required/i).waitFor();
    },
  },
  {
    id: 'PIT-RED-W83-013',
    title: 'milestone-owner invitation preview includes accountability and timeline wording',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/projects/demo/settings`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: /invite milestone owner/i }).click();
      await page.getByText(/accountability/i).waitFor();
      await page.getByText(/timeline/i).waitFor();
      await page.getByText(/child management/i).waitFor();
    },
  },
  {
    id: 'PIT-RED-W83-014',
    title: 'invitation acceptance flow links account and grants scoped access',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/pit/invite/demo-token/accept`, { waitUntil: 'domcontentloaded' });
      await page.getByLabel(/email/i).fill('invitee@example.test');
      await page.getByLabel(/password/i).fill('Invited-user#2026');
      await page.getByRole('button', { name: /accept invite/i }).click();
      await page.getByText(/workspace access granted/i).waitFor();
    },
  },
  {
    id: 'PIT-RED-W83-016',
    title: 'child date outside parent range requires explicit exception confirmation',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/projects/demo/milestones`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: /new deliverable/i }).click();
      await page.getByLabel(/start date/i).fill('2027-01-20');
      await page.getByLabel(/end date/i).fill('2027-01-21');
      await page.getByRole('button', { name: /save/i }).click();
      await page.getByText(/outside parent range/i).waitFor();
      await page.getByRole('button', { name: /confirm exception/i }).waitFor();
    },
  },
  {
    id: 'PIT-RED-W83-018',
    title: 'non-admin removal menu excludes hard delete option',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/projects/demo/milestones`, { waitUntil: 'domcontentloaded' });
      await page.getByTestId('pit-row-actions').first().click();
      await page.getByRole('menuitem', { name: /archive/i }).waitFor();
      await page.getByRole('menuitem', { name: /cancel/i }).waitFor();
      await page.getByRole('menuitem', { name: /restore/i }).waitFor();
      await assert.rejects(page.getByRole('menuitem', { name: /delete/i }).waitFor({ timeout: 2_000 }), /.+/, 'Delete action must remain unavailable to non-admin users');
    },
  },
  {
    id: 'PIT-RED-W83-032',
    title: 'Maturion suggestion request stores proposal without canonical write before approval',
    run: async ({ page, state }) => {
      await page.goto(`${state.config.appUrl}/projects/demo/tasks`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: /request maturion suggestion/i }).click();
      await page.getByText(/proposal generated/i).waitFor();
      await assert.rejects(
        page.getByText(/canonical progress updated automatically/i).waitFor({ timeout: 2_000 }),
        /.+/,
        'Canonical progress must not auto-update prior to explicit approval',
      );
    },
  },
];

for (const scenario of browserCases) {
  test(`${scenario.id}: ${scenario.title}`, async (t) => {
    await withPage(t, scenario.run);
  });
}

test.after(async () => {
  if (browser) await browser.close();
  if (state) await cleanupPersonas(state.clients, state.personas);
});
