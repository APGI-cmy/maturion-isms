import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const DEFAULT_PASSWORD = 'PIT-W83-red-harness-Temp#2026';
let createClientFn;

async function loadCreateClient() {
  if (!createClientFn) {
    const mod = await import('@supabase/supabase-js');
    createClientFn = mod.createClient;
  }
  return createClientFn;
}

export function resolveHarnessConfig(t) {
  const config = {
    supabaseUrl: process.env.PIT_W83_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    anonKey:
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      process.env.PIT_W83_SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.PIT_W83_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    appUrl: process.env.PIT_W83_APP_URL || process.env.VITE_PIT_APP_URL || 'http://127.0.0.1:4173',
  };

  const missing = [];
  if (!config.supabaseUrl) missing.push('PIT_W83_SUPABASE_URL (or VITE_SUPABASE_URL)');
  if (!config.anonKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY (or PIT_W83_SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY)');
  if (!config.serviceRoleKey) missing.push('PIT_W83_SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE_KEY)');

  if (missing.length > 0) {
    const message = `Missing required Supabase harness env vars: ${missing.join(', ')}.`;
    assert.fail(`${message} Configure disposable/local Supabase credentials for PIT W8.3 RED execution.`);
  }

  const isLocalUrl = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/.test(config.supabaseUrl);
  if (!isLocalUrl && !process.env.PIT_W83_ALLOW_REMOTE_SUPABASE) {
    assert.fail(
      `Safety gate: PIT_W83_SUPABASE_URL points to a non-local instance (${config.supabaseUrl}). ` +
        'This harness uses the service role key to mutate auth state. ' +
        'Set PIT_W83_ALLOW_REMOTE_SUPABASE=1 to explicitly acknowledge running against a non-local project.',
    );
  }

  return config;
}

export async function createHarnessClients(config) {
  const createClient = await loadCreateClient();
  return {
    anonClient: createClient(config.supabaseUrl, config.anonKey),
    serviceClient: createClient(config.supabaseUrl, config.serviceRoleKey),
  };
}

export async function verifyHarnessReadiness(config, clients) {
  const healthResponse = await fetch(`${config.supabaseUrl}/auth/v1/settings`, {
    headers: { apikey: config.anonKey },
    signal: AbortSignal.timeout(10_000),
  });
  assert.ok(
    healthResponse.ok,
    `Harness auth readiness check failed: ${healthResponse.status} ${healthResponse.statusText}. Configure a valid disposable/local publishable or anon key.`,
  );

  const { error: sessionError } = await clients.anonClient.auth.getSession();
  assert.equal(sessionError, null, `Supabase auth session probe failed: ${sessionError?.message}`);
}

export async function createPersonas(clients) {
  const runId = randomUUID().slice(0, 8);
  const roles = [
    'viewer',
    'contributor',
    'milestone_owner',
    'deliverable_owner',
    'task_owner',
    'project_leader',
    'org_admin',
    'cross_tenant_actor',
  ];

  const personas = {};
  const orgId = `org-w83-${runId}`;
  const projectId = `proj-w83-${runId}`;

  for (const role of roles) {
    const email = `pit-w83-${role}-${runId}@example.test`;
    const password = process.env[`PIT_W83_${role.toUpperCase()}_PASSWORD`] || DEFAULT_PASSWORD;

    const { data: userData, error: createError } = await clients.serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        pit_role: role,
        pit_wave: 'w83-red',
      },
    });

    assert.equal(createError, null, `Persona seed failed for ${role}: ${createError?.message}`);

    const { data: signInData, error: signInError } = await clients.anonClient.auth.signInWithPassword({
      email,
      password,
    });

    assert.equal(signInError, null, `Persona auth failed for ${role}: ${signInError?.message}`);

    const userId = userData.user?.id;

    if (role !== 'cross_tenant_actor') {
      await clients.serviceClient
        .from('user_org_memberships')
        .upsert({ user_id: userId, org_id: orgId, created_at: new Date().toISOString() }, { onConflict: 'user_id,org_id', ignoreDuplicates: true });

      await clients.serviceClient
        .from('user_roles')
        .upsert({ user_id: userId, project_id: projectId, role, created_at: new Date().toISOString() }, { onConflict: 'user_id,project_id,role', ignoreDuplicates: true });
    }

    personas[role] = {
      email,
      password,
      userId,
      orgId,
      projectId,
      accessToken: signInData.session?.access_token,
    };
  }

  return { runId, personas };
}

export async function seedDomainFixtures(clients, personas) {
  const sc = clients.serviceClient;
  const projectLeader = personas.project_leader;
  const milestoneOwner = personas.milestone_owner;
  const deliverableOwner = personas.deliverable_owner;
  const contributor = personas.contributor;
  const projectId = projectLeader?.projectId ?? 'proj-demo';

  const fixtures = [
    {
      table: 'pit_milestones',
      rows: [
        { id: 'milestone-a', title: 'W8.3 Fixture Milestone A', project_id: projectId, status: 'active', owner_id: milestoneOwner?.userId },
      ],
    },
    {
      table: 'pit_deliverables',
      rows: [
        { id: 'deliverable-a', title: 'W8.3 Fixture Deliverable A', milestone_id: 'milestone-a', project_id: projectId, status: 'active', owner_id: deliverableOwner?.userId },
        { id: 'deliverable-b', title: 'W8.3 Fixture Deliverable B', milestone_id: 'milestone-a', project_id: projectId, status: 'active', owner_id: deliverableOwner?.userId },
      ],
    },
    {
      table: 'pit_tasks',
      rows: [
        { id: 'task-a', title: 'W8.3 Fixture Task A', deliverable_id: 'deliverable-a', project_id: projectId, status: 'active' },
        { id: 'task-x', title: 'W8.3 Fixture Task X', deliverable_id: 'deliverable-a', project_id: projectId, status: 'active', owner_id: personas.task_owner?.userId },
        { id: 'generated-task-a', title: 'W8.3 Generated Task A', deliverable_id: 'deliverable-a', project_id: projectId, status: 'active', source_lineage: { source: 'maturion', suggestion_id: 'suggestion-a' }, integration_status: null },
        { id: 'task-evidence-a', title: 'W8.3 Evidence Task A', deliverable_id: 'deliverable-a', project_id: projectId, status: 'active', progress_state: 'in_progress', canonical_status: 'pending' },
      ],
    },
    {
      table: 'pit_transfer_proposals',
      rows: [
        { id: 'proposal-a', source_id: 'milestone-a', targets: [], status: 'pending', created_by: milestoneOwner?.userId, version: 1 },
        { id: 'proposal-valid-multi-child', source_id: 'milestone-a', targets: [{ child_id: 'task-a', target_id: 'deliverable-b' }, { child_id: 'task-x', target_id: 'deliverable-b' }], status: 'pending', created_by: milestoneOwner?.userId, version: 1 },
        { id: 'proposal-force-rollback', source_id: 'milestone-a', targets: [{ child_id: 'task-a', target_id: 'deliverable-b' }, { child_id: 'task-x', target_id: 'deliverable-b' }], status: 'pending', created_by: milestoneOwner?.userId, version: 1 },
        { id: 'proposal-stale-version', source_id: 'milestone-a', targets: [{ child_id: 'task-a', target_id: 'deliverable-b' }], status: 'pending', created_by: milestoneOwner?.userId, version: 1 },
      ],
    },
    {
      table: 'pit_suggestions',
      rows: [
        { id: 'suggestion-a', task_id: 'task-a', project_id: projectId, created_by: contributor?.userId, status: 'pending' },
        { id: 'suggestion-opt-in', task_id: 'task-x', project_id: projectId, created_by: contributor?.userId, status: 'pending' },
      ],
    },
    {
      table: 'pit_evidence',
      rows: [
        { id: 'evidence-a', task_id: 'task-evidence-a', project_id: projectId, submitted_by: projectLeader?.userId, status: 'pending' },
      ],
    },
  ];

  const errors = [];
  for (const { table, rows } of fixtures) {
    const { error } = await sc.from(table).upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
    if (error) {
      errors.push(`${table}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    console.warn(`[pit-w83-harness] Domain fixture seed warnings (tables may not exist yet in RED phase): ${errors.join('; ')}`);
  }
}

export async function cleanupDomainFixtures(clients) {
  const sc = clients.serviceClient;
  const fixtureIds = {
    pit_evidence: ['evidence-a'],
    pit_suggestions: ['suggestion-a', 'suggestion-opt-in'],
    pit_transfer_proposals: ['proposal-a', 'proposal-valid-multi-child', 'proposal-force-rollback', 'proposal-stale-version'],
    pit_tasks: ['task-a', 'task-x', 'generated-task-a', 'task-evidence-a'],
    pit_deliverables: ['deliverable-a', 'deliverable-b'],
    pit_milestones: ['milestone-a'],
  };

  for (const [table, ids] of Object.entries(fixtureIds)) {
    await sc.from(table).delete().in('id', ids);
  }
}

export async function cleanupPersonas(clients, personas) {
  const all = Object.values(personas || {});
  await Promise.all(
    all.map(async (persona) => {
      if (!persona?.userId) return;
      await clients.serviceClient.auth.admin.deleteUser(persona.userId);
    }),
  );
}

export async function callRpcWithToken(config, rpcName, payload, accessToken) {
  const response = await fetch(`${config.supabaseUrl}/rest/v1/rpc/${rpcName}`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: ['Bearer', accessToken].join(' '),
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload ?? {}),
    signal: AbortSignal.timeout(15_000),
  });

  const bodyText = await response.text();
  let body;
  try {
    body = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    body = bodyText;
  }

  return { status: response.status, body };
}

export async function callRestMutation(config, path, method, payload, accessToken) {
  const response = await fetch(`${config.supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: config.anonKey,
      Authorization: ['Bearer', accessToken].join(' '),
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: payload ? JSON.stringify(payload) : undefined,
    signal: AbortSignal.timeout(15_000),
  });

  const bodyText = await response.text();
  let body;
  try {
    body = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    body = bodyText;
  }

  return { status: response.status, body };
}

export function assertGreenExpectation(result, expectation) {
  const { status, body } = result;
  const debug = typeof body === 'string' ? body : JSON.stringify(body);

  if (expectation === 'deny') {
    assert.ok(status === 401 || status === 403 || status === 409 || status === 422, `Expected denial status but got ${status} body=${debug}`);
    return;
  }

  if (expectation === 'success') {
    assert.ok(status >= 200 && status < 300, `Expected success status but got ${status} body=${debug}`);
    return;
  }

  if (expectation === 'no-write') {
    assert.ok(status === 400 || status === 401 || status === 403 || status === 409 || status === 422, `Expected validation/no-write status but got ${status} body=${debug}`);
  }
}
