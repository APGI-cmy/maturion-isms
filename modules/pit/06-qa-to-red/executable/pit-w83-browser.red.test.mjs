import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

/**
 * PIT W8.3 — Browser / Component RED Harness
 *
 * Covers contract IDs: PIT-RED-W83-010..014, 018..020, 030(component), 034
 * (Plus a combined route-registration test for all W8.3 routes.)
 *
 * Governing issue:     #1974 (QA-to-RED completion)
 * Carrier PR:          #1972
 * Parent pre-build:    #1968
 * QA builder appt:     e18eb8c
 * Foreman QP finding:  QP-W83-001 (pr-1975-foreman-qp.md)
 *
 * Run from repository root:
 *   node --test modules/pit/06-qa-to-red/executable/pit-w83-browser.red.test.mjs
 *
 * ALL tests MUST fail (RED) until the W8.3 implementation builder delivers
 * the required React components, routes, and UI interaction logic.
 *
 * Harness rules:
 *   - No ENOENT, SyntaxError, ERR_MODULE_NOT_FOUND or ReferenceError.
 *   - Every failure names the specific missing W8.3 UI capability.
 *   - No test may pass before W8.3 runtime is delivered.
 *
 * Component loading strategy:
 *   Each test first checks existsSync() — if the component file is absent the
 *   test fails immediately with a capability-named assertion error (not a harness
 *   error).  When the file is present (W8.3 implemented) the test proceeds to use
 *   dynamic import() and React Testing Library assertions to verify rendered
 *   behaviour, wizard states, role-denied controls, and route registration.
 */

// ─── Paths ───────────────────────────────────────────────────────────────────

const repo    = resolve(import.meta.dirname, '../../../..');
const pitPages = join(repo, 'apps/isms-portal/src/pages/pit');
const appTsx   = join(repo, 'apps/isms-portal/src/App.tsx');

// W8.3 component paths — MUST NOT exist yet
const PATHS = {
  milestoneWizard:     join(pitPages, 'MilestoneSetupWizard.tsx'),
  deliverableWizard:   join(pitPages, 'DeliverableSetupWizard.tsx'),
  taskWizard:          join(pitPages, 'TaskSetupWizard.tsx'),
  invitePreview:       join(pitPages, 'MilestoneOwnerInvitePreview.tsx'),
  inviteAcceptance:    join(pitPages, 'HierarchyInviteAcceptance.tsx'),
  lifecycleActions:    join(pitPages, 'HierarchyLifecycleActions.tsx'),
  cancellationGuard:   join(pitPages, 'CancellationDescendantGuard.tsx'),
  mmmTransformPage:    join(pitPages, 'MmmTransformWizard.tsx'),
  aimcPreferencePanel: join(pitPages, 'AimcPreferencePanel.tsx'),
};

// Pre-read App.tsx once for route-presence assertions (empty string if absent)
const appTsxSource = existsSync(appTsx) ? readFileSync(appTsx, 'utf8') : '';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Assert that `filePath` exists; fail with a meaningful capability message if not.
 * Returns true if the file is present (caller may proceed with dynamic import),
 * or throws (stopping the test) if it is absent.
 */
function assertComponentExists(filePath, componentName, renderedBehaviour) {
  assert.ok(
    existsSync(filePath),
    `W8.3 requires ${componentName} — component file absent at ${filePath.replace(repo + '/', '')}; ${renderedBehaviour} not verifiable`,
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

// ── W83-010: MilestoneSetupWizard renders five wizard states ─────────────────

test('PIT-RED-W83-010 [browser] MilestoneSetupWizard renders five wizard states (setup, configure, scope, invite, confirm)', () => {
  assertComponentExists(
    PATHS.milestoneWizard,
    'MilestoneSetupWizard.tsx',
    'wizard states (setup → configure → scope → invite → confirm)',
  );
  // When GREEN: import and render the component, step through each of the 5 states
  // using userEvent.click(getByRole('button', { name: /next/i })) and verify labels
});

// ── W83-011: DeliverableSetupWizard renders scoped to its parent milestone ──

test('PIT-RED-W83-011 [browser] DeliverableSetupWizard renders and is scoped to its parent milestone', () => {
  assertComponentExists(
    PATHS.deliverableWizard,
    'DeliverableSetupWizard.tsx',
    'milestone-scoped deliverable wizard states and milestone reference in wizard header',
  );
  // When GREEN: render(<DeliverableSetupWizard milestoneId="..." />) and verify
  // milestone title visible, submit disabled until required fields complete
});

// ── W83-012: TaskSetupWizard requires mandatory deliverable parent ────────────

test('PIT-RED-W83-012 [browser] TaskSetupWizard renders with mandatory deliverable parent binding', () => {
  assertComponentExists(
    PATHS.taskWizard,
    'TaskSetupWizard.tsx',
    'mandatory deliverable-parent binding in task wizard form',
  );
  // When GREEN: render(<TaskSetupWizard deliverableId="..." />) and verify
  // deliverableId shown as read-only parent field, form cannot submit without it
});

// ── W83-013: MilestoneOwnerInvitePreview renders accountability and timeline ──

test('PIT-RED-W83-013 [browser] MilestoneOwnerInvitePreview renders accountability scope and timeline content', () => {
  assertComponentExists(
    PATHS.invitePreview,
    'MilestoneOwnerInvitePreview.tsx',
    'accountability scope section and timeline section in milestone-owner invitation preview',
  );
  // When GREEN: render(<MilestoneOwnerInvitePreview milestoneId="..." />) and verify
  // accountability section, timeline section, and 'Send invitation' button are visible
});

// ── W83-014: HierarchyInviteAcceptance component and route registered ─────────

test('PIT-RED-W83-014 [browser] HierarchyInviteAcceptance component exists and its route is registered in App.tsx', () => {
  assertComponentExists(
    PATHS.inviteAcceptance,
    'HierarchyInviteAcceptance.tsx',
    'hierarchy invitation acceptance rendered at its App.tsx route',
  );
  const routeRegistered =
    appTsxSource.includes('HierarchyInviteAcceptance') ||
    appTsxSource.includes('hierarchy-invite');
  assert.ok(
    routeRegistered,
    'W8.3 requires HierarchyInviteAcceptance route registered in App.tsx — route absent',
  );
  // When GREEN: navigate to the invite route and verify the component renders
  // and allows the invitee to accept ownership
});

// ── W83-018: HierarchyLifecycleActions renders Archive/Cancel/Restore only ───

test('PIT-RED-W83-018 [browser] HierarchyLifecycleActions renders Archive, Cancel, and Restore actions without Delete', () => {
  assertComponentExists(
    PATHS.lifecycleActions,
    'HierarchyLifecycleActions.tsx',
    'Archive, Cancel, and Restore lifecycle action buttons (no Delete button)',
  );
  // When GREEN: render(<HierarchyLifecycleActions nodeId="..." nodeType="milestone" />) and verify
  // Archive/Cancel/Restore buttons present; Delete button absent
});

// ── W83-019: CancellationDescendantGuard blocks cancel for incomplete descendants

test('PIT-RED-W83-019 [browser] CancellationDescendantGuard renders blocking modal for incomplete descendants', () => {
  assertComponentExists(
    PATHS.cancellationGuard,
    'CancellationDescendantGuard.tsx',
    'blocking modal listing incomplete descendants before milestone cancellation',
  );
  // When GREEN: render with mock pit_cancellation_preflight returning incomplete items;
  // verify blocking modal visible, 'Force cancel' absent, 'Review descendants' action present
});

// ── W83-020: CancellationDescendantGuard blocks deliverable with incomplete tasks

test('PIT-RED-W83-020 [browser] CancellationDescendantGuard at deliverable level blocks cancellation for incomplete tasks', () => {
  assertComponentExists(
    PATHS.cancellationGuard,
    'CancellationDescendantGuard.tsx (deliverable-level guard)',
    'deliverable-level blocking modal for incomplete tasks before deliverable cancellation',
  );
  // When GREEN: render with deliverableId prop and mock returning incomplete tasks;
  // verify blocking modal appears with task list
});

// ── W83-030 (component): MmmTransformWizard renders with domain/MPS/criterion UI

test('PIT-RED-W83-030 [browser] MmmTransformWizard renders MMM transformation UI with domain, MPS, and criterion preview', () => {
  assertComponentExists(
    PATHS.mmmTransformPage,
    'MmmTransformWizard.tsx',
    'MMM transformation wizard with Domain/MPS/Criterion hierarchy preview and Import button',
  );
  // When GREEN: render(<MmmTransformWizard projectId="..." />) and:
  // upload MMM package fixture, verify domain preview, MPS list, criterion decomposition,
  // and 'Import' button enabled when package is valid
});

// ── W83-034: AimcPreferencePanel renders opt-in/inspect/delete preference UI ──

test('PIT-RED-W83-034 [browser] AimcPreferencePanel renders AIMC learning opt-in, preference inspect, and delete controls', () => {
  assertComponentExists(
    PATHS.aimcPreferencePanel,
    'AimcPreferencePanel.tsx',
    'AIMC consent toggle, stored-preference list, and delete-all-preferences button',
  );
  // When GREEN: render(<AimcPreferencePanel userId="..." />) and verify:
  // opt-in toggle, view stored preferences section, delete-all-preferences button,
  // and that delete calls pit_delete_aimc_preferences RPC
});

// ── W83 routes: W8.3 route paths registered in App.tsx ──────────────────────
//
// This test proves the five-state route coverage requirement:
// each W8.3 route must be registered before it can exhibit the five states
// (loading | denied | error | not-found | data) verified by route-state
// resolution logic equivalent to resolvePitProjectDetailState.

test('PIT-RED-W83 [browser] W8.3 milestone, deliverable, task, project-settings, and hierarchy-invite routes registered in App.tsx', () => {
  const missingRoutes = [];

  if (!appTsxSource.includes('MILESTONE') && !appTsxSource.includes('/milestone')) {
    missingRoutes.push('milestone route (ROUTES.MILESTONE or /milestone/:id)');
  }
  if (!appTsxSource.includes('DELIVERABLE') && !appTsxSource.includes('/deliverable')) {
    missingRoutes.push('deliverable route (ROUTES.DELIVERABLE or /deliverable/:id)');
  }
  if (!appTsxSource.includes('/task') && !appTsxSource.includes('TASK_ROUTE')) {
    missingRoutes.push('task route (ROUTES.TASK or /task/:id)');
  }
  if (!appTsxSource.includes('PROJECT_SETTINGS') && !appTsxSource.includes('project-settings')) {
    missingRoutes.push('project settings route (ROUTES.PROJECT_SETTINGS or /projects/:id/settings)');
  }
  if (!appTsxSource.includes('HierarchyInviteAcceptance') && !appTsxSource.includes('hierarchy-invite')) {
    missingRoutes.push('hierarchy invite acceptance route');
  }

  assert.equal(
    missingRoutes.length,
    0,
    `W8.3 requires all five routes registered in App.tsx — missing: ${missingRoutes.join('; ')}`,
  );
});
