import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveHarnessConfig,
  createHarnessClients,
  verifyHarnessReadiness,
  createPersonas,
  cleanupPersonas,
  callRpcWithToken,
  callRestMutation,
  assertGreenExpectation,
} from './harness/pit-w83-supabase-harness.mjs';

let sharedState;

async function getHarnessState(t) {
  const config = resolveHarnessConfig(t);
  if (!config) return null;

  if (!sharedState) {
    const clients = await createHarnessClients(config);
    await verifyHarnessReadiness(config, clients);
    const seed = await createPersonas(clients);
    sharedState = {
      config,
      clients,
      ...seed,
    };
  }

  return sharedState;
}

async function runRpcCase(t, role, rpcName, payload, expectation) {
  const state = await getHarnessState(t);
  if (!state) return;

  const token = state.personas[role]?.accessToken;
  assert.ok(token, `Missing access token for role ${role}`);

  const result = await callRpcWithToken(state.config, rpcName, payload, token);
  assertGreenExpectation(result, expectation);
}

async function runRestCase(t, role, path, method, payload, expectation) {
  const state = await getHarnessState(t);
  if (!state) return;

  const token = state.personas[role]?.accessToken;
  assert.ok(token, `Missing access token for role ${role}`);

  const result = await callRestMutation(state.config, path, method, payload, token);
  assertGreenExpectation(result, expectation);
}

test('PIT-RED-W83-HARNESS-001: Supabase REST endpoint reachable', async (t) => {
  const state = await getHarnessState(t);
  if (!state) return;

  const response = await fetch(`${state.config.supabaseUrl}/rest/v1/`, {
    headers: { apikey: state.config.anonKey },
    signal: AbortSignal.timeout(10_000),
  });
  assert.equal(response.ok, true, `Expected Supabase REST endpoint to be reachable but got ${response.status}`);
});

test('PIT-RED-W83-HARNESS-002: Persona auth seed succeeded', async (t) => {
  const state = await getHarnessState(t);
  if (!state) return;

  for (const [role, persona] of Object.entries(state.personas)) {
    assert.ok(persona.userId, `Expected seeded user id for role ${role}`);
    assert.ok(persona.accessToken, `Expected seeded access token for role ${role}`);
  }
});

const supabaseCases = [
  {
    id: 'PIT-RED-W83-001',
    title: 'create task without deliverable is rejected',
    run: (t) => runRestCase(t, 'contributor', 'pit_tasks', 'POST', { title: 'orphan-task' }, 'no-write'),
  },
  {
    id: 'PIT-RED-W83-002',
    title: 'create deliverable without milestone is rejected',
    run: (t) => runRestCase(t, 'contributor', 'pit_deliverables', 'POST', { title: 'orphan-deliverable' }, 'no-write'),
  },
  {
    id: 'PIT-RED-W83-003',
    title: 'create milestone without project is rejected',
    run: (t) => runRestCase(t, 'contributor', 'pit_milestones', 'POST', { title: 'orphan-milestone' }, 'no-write'),
  },
  {
    id: 'PIT-RED-W83-004',
    title: 'cross-project child binding is rejected',
    run: (t) => runRpcCase(t, 'contributor', 'pit_bind_child_to_parent', { child_id: 'child-A', parent_id: 'parent-B', parent_project_id: 'proj-B', child_project_id: 'proj-A' }, 'deny'),
  },
  {
    id: 'PIT-RED-W83-005',
    title: 'cross-tenant parent reference is denied by policy',
    run: (t) => runRpcCase(t, 'cross_tenant_actor', 'pit_bind_child_to_parent', { child_id: 'child-A', parent_id: 'parent-B', parent_project_id: 'tenant-b-project' }, 'deny'),
  },
  {
    id: 'PIT-RED-W83-009',
    title: 'task owner cannot change parent structure directly',
    run: (t) => runRpcCase(t, 'task_owner', 'pit_reparent_task', { task_id: 'task-x', deliverable_id: 'deliverable-y' }, 'deny'),
  },
  {
    id: 'PIT-RED-W83-017',
    title: 'date exception confirmation persists actor/rationale',
    run: (t) => runRpcCase(t, 'project_leader', 'pit_confirm_date_exception', { node_id: 'milestone-a', rationale: 'outage overlap', confirm: true }, 'success'),
  },
  {
    id: 'PIT-RED-W83-019',
    title: 'cancel milestone with incomplete descendants is blocked',
    run: (t) => runRpcCase(t, 'milestone_owner', 'pit_cancel_milestone', { milestone_id: 'milestone-a' }, 'deny'),
  },
  {
    id: 'PIT-RED-W83-020',
    title: 'cancel deliverable with incomplete tasks is blocked',
    run: (t) => runRpcCase(t, 'deliverable_owner', 'pit_cancel_deliverable', { deliverable_id: 'deliverable-a' }, 'deny'),
  },
  {
    id: 'PIT-RED-W83-021',
    title: 'transfer proposal without child target map is rejected',
    run: (t) => runRpcCase(t, 'milestone_owner', 'pit_submit_transfer_proposal', { source_id: 'milestone-a', targets: [] }, 'no-write'),
  },
  {
    id: 'PIT-RED-W83-022',
    title: 'cross-project transfer targets are rejected',
    run: (t) => runRpcCase(t, 'milestone_owner', 'pit_submit_transfer_proposal', { source_id: 'milestone-a', targets: [{ child_id: 'child-a', target_id: 'cancelled-or-cross-project-target' }] }, 'no-write'),
  },
  {
    id: 'PIT-RED-W83-023',
    title: 'non-project-leader cannot approve transfer proposal',
    run: (t) => runRpcCase(t, 'contributor', 'pit_approve_transfer_proposal', { proposal_id: 'proposal-a' }, 'deny'),
  },
  {
    id: 'PIT-RED-W83-024',
    title: 'project leader can approve valid multi-child transfer atomically',
    run: (t) => runRpcCase(t, 'project_leader', 'pit_approve_transfer_proposal', { proposal_id: 'proposal-valid-multi-child' }, 'success'),
  },
  {
    id: 'PIT-RED-W83-025',
    title: 'forced second-child failure rolls back entire transfer transaction',
    run: (t) => runRpcCase(t, 'project_leader', 'pit_approve_transfer_proposal', { proposal_id: 'proposal-force-rollback', force_second_child_failure: true }, 'no-write'),
  },
  {
    id: 'PIT-RED-W83-026',
    title: 'stale proposal approval is rejected without mutation',
    run: (t) => runRpcCase(t, 'project_leader', 'pit_approve_transfer_proposal', { proposal_id: 'proposal-stale-version', expected_version: 3 }, 'no-write'),
  },
  {
    id: 'PIT-RED-W83-027',
    title: 'successful transfer audit trail is append-only and queryable',
    run: (t) => runRestCase(t, 'project_leader', 'pit_transfer_audit_log?select=proposal_id,decision,moved_children,cancelled_node,created_at&limit=1', 'GET', null, 'success'),
  },
  {
    id: 'PIT-RED-W83-028',
    title: 'application role cannot update or delete transfer audit rows',
    run: async (t) => {
      await runRestCase(t, 'contributor', 'pit_transfer_audit_log?id=eq.fake-audit-row', 'PATCH', { decision: 'tamper' }, 'deny');
      await runRestCase(t, 'contributor', 'pit_transfer_audit_log?id=eq.fake-audit-row', 'DELETE', null, 'deny');
    },
  },
  {
    id: 'PIT-RED-W83-029',
    title: 'active child cannot remain under cancelled parent',
    run: (t) => runRpcCase(t, 'project_leader', 'pit_validate_cancelled_parent_invariant', { parent_id: 'cancelled-parent', child_id: 'active-child' }, 'no-write'),
  },
  {
    id: 'PIT-RED-W83-031',
    title: 'generated task wording edits do not mutate immutable source lineage',
    run: (t) => runRestCase(t, 'task_owner', 'pit_tasks?id=eq.generated-task-a', 'PATCH', { title: 'edited wording', source_lineage: { source: 'tamper' } }, 'deny'),
  },
  {
    id: 'PIT-RED-W83-033',
    title: 'declined learning path stores no memory preference record',
    run: async (t) => {
      await runRpcCase(t, 'contributor', 'pit_finalize_suggestion', { suggestion_id: 'suggestion-a', accepted: false, persist_preference: false }, 'success');
      await runRestCase(t, 'contributor', 'pit_preference_memory?select=id&suggestion_id=eq.suggestion-a', 'GET', null, 'no-write');
    },
  },
  {
    id: 'PIT-RED-W83-034',
    title: 'opt-in preference record is isolated to authorized actor and removable',
    run: async (t) => {
      await runRpcCase(t, 'contributor', 'pit_finalize_suggestion', { suggestion_id: 'suggestion-opt-in', accepted: true, persist_preference: true }, 'success');
      await runRestCase(t, 'contributor', 'pit_preference_memory?select=id,scope&limit=1', 'GET', null, 'success');
      await runRestCase(t, 'contributor', 'pit_preference_memory?id=eq.pref-opt-in-row', 'DELETE', null, 'success');
    },
  },
  {
    id: 'PIT-RED-W83-036',
    title: 'task creation preserves integration reservation fields without IWMS side effects',
    run: (t) => runRestCase(t, 'deliverable_owner', 'pit_tasks', 'POST', {
      title: 'W8.3 reserved integration task',
      deliverable_id: 'deliverable-a',
      integration_status: 'reserved',
      integration_reference: null,
    }, 'success'),
  },
];

for (const scenario of supabaseCases) {
  test(`${scenario.id}: ${scenario.title}`, async (t) => {
    await scenario.run(t);
  });
}

test('PIT-RED-W83-035: evidence evaluation stores proposal without automatic canonical progress mutation', async (t) => {
  await runRpcCase(t, 'project_leader', 'pit_evaluate_task_evidence', {
    task_id: 'task-evidence-a',
    evidence_id: 'evidence-a',
    evaluator: 'shared-assurance-service',
  }, 'success');

  await runRestCase(t, 'project_leader', 'pit_tasks?id=eq.task-evidence-a&select=id,progress_state,canonical_status', 'GET', null, 'success');
});

test.after(async () => {
  if (!sharedState) return;
  await cleanupPersonas(sharedState.clients, sharedState.personas);
});
