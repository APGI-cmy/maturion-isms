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
  const envless = process.env.PIT_W83_ALLOW_ENVLESS === '1';
  const config = {
    supabaseUrl: process.env.PIT_W83_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    anonKey: process.env.PIT_W83_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.PIT_W83_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    appUrl: process.env.PIT_W83_APP_URL || process.env.VITE_PIT_APP_URL || 'http://127.0.0.1:4173',
    envless,
  };

  const missing = [];
  if (!config.supabaseUrl) missing.push('PIT_W83_SUPABASE_URL (or VITE_SUPABASE_URL)');
  if (!config.anonKey) missing.push('PIT_W83_SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY)');
  if (!config.serviceRoleKey) missing.push('PIT_W83_SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE_KEY)');

  if (missing.length > 0) {
    const message = `Missing required Supabase harness env vars: ${missing.join(', ')}.`;
    if (envless && t?.skip) {
      t.skip(`${message} Set PIT_W83_ALLOW_ENVLESS=0 to hard-fail instead of skipping.`);
      return null;
    }
    assert.fail(`${message} Configure disposable/local Supabase credentials for PIT W8.3 RED execution.`);
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
  const healthResponse = await fetch(`${config.supabaseUrl}/rest/v1/`, {
    headers: { apikey: config.anonKey },
    signal: AbortSignal.timeout(10_000),
  });
  assert.ok(
    healthResponse.ok,
    `Harness health check failed: ${healthResponse.status} ${healthResponse.statusText}. Start disposable/local Supabase before running RED suite.`,
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

    personas[role] = {
      email,
      password,
      userId: userData.user?.id,
      accessToken: signInData.session?.access_token,
    };
  }

  return { runId, personas };
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
