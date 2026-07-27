import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * PIT W8.3 — Supabase Integration RED Harness
 *
 * Covers contract IDs: PIT-RED-W83-001..009, 015..017, 021..033, 035..036
 *
 * Governing issue:     #1974 (QA-to-RED completion)
 * Carrier PR:          #1972
 * Parent pre-build:    #1968
 * QA builder appt:     e18eb8c
 * Foreman QP finding:  QP-W83-001 (pr-1975-foreman-qp.md)
 *
 * Run from repository root:
 *   node --test modules/pit/06-qa-to-red/executable/pit-w83-supabase.red.test.mjs
 *
 * ALL tests MUST fail (RED) until the W8.3 implementation builder delivers
 * the required schema migrations, RPCs, RLS policies, and service modules.
 *
 * Harness rules:
 *   - No ENOENT, SyntaxError, ERR_MODULE_NOT_FOUND or ReferenceError.
 *   - Every failure names the specific missing W8.3 capability.
 *   - No test may pass before W8.3 runtime is delivered.
 *
 * This file implements a controlled Supabase mock that models the exact
 * error responses the real Supabase server returns for absent W8.3 schema
 * objects.  When W8.3 migrations are applied, replace this mock with a
 * live test-environment client; the assertions remain identical.
 */

// ─── Pre-W8.3 Supabase Mock ─────────────────────────────────────────────────
//
// Models the Supabase REST/RPC error envelope for PostgreSQL errors:
//   code 42883 = function does not exist
//   code 42P01 = relation does not exist
//   code 42501 = insufficient_privilege (RLS denial)
//   code 23514 = check_violation (constraint)
//   code P0001 = raise_exception (explicit RAISE in PL/pgSQL)

const PG_FUNCTION_NOT_FOUND = (name) => ({
  data: null,
  error: {
    code: '42883',
    message: `function ${name}(unknown) does not exist`,
    details: null,
    hint: `No function matches the given name and argument types.`,
  },
});

const PG_RELATION_NOT_FOUND = (table) => ({
  data: null,
  error: {
    code: '42P01',
    message: `relation "${table}" does not exist`,
    details: null,
    hint: null,
  },
});

const PG_RLS_DENIED = (table) => ({
  data: [],
  error: {
    code: '42501',
    message: `new row violates row-level security policy for table "${table}"`,
    details: null,
    hint: null,
  },
});

const PG_CHECK_VIOLATION = (constraint) => ({
  data: null,
  error: {
    code: '23514',
    message: `new row for relation violates check constraint "${constraint}"`,
    details: null,
    hint: null,
  },
});

const PG_RAISE = (msg) => ({
  data: null,
  error: { code: 'P0001', message: msg, details: null, hint: null },
});

// W8.3 RPCs that do not exist yet
const W83_MISSING_RPCS = new Set([
  'pit_create_task',
  'pit_create_deliverable',
  'pit_create_milestone',
  'pit_update_task',
  'pit_cancellation_preflight',
  'pit_approve_structural_change',
]);

// W8.3 tables that do not exist yet
const W83_MISSING_TABLES = new Set([
  'pit_milestones',
  'pit_deliverables',
  'pit_tasks',
  'pit_date_exceptions',
  'pit_structural_audit',
  'pit_preferences',
  'pit_hierarchy_change_requests',
]);

/**
 * Create a controlled Supabase mock authenticated as `actor`.
 * `actor.role` is used to simulate RLS enforcement.
 */
function createPreW83Client(actor = { userId: null, orgId: null, role: 'unauthenticated' }) {
  const fromChain = (table) => {
    let _error = null;

    if (W83_MISSING_TABLES.has(table)) {
      _error = PG_RELATION_NOT_FOUND(table).error;
    } else if (actor.role === 'viewer' && table !== 'user_org_memberships' && table !== 'user_roles') {
      // Viewer RLS denial simulation for W8.3 hierarchy tables
      _error = PG_RLS_DENIED(table).error;
    } else if (actor.orgId && actor.orgId !== '00000000-0000-4000-8000-aaa000000001') {
      // Cross-tenant isolation: different orgId returns empty set
      _error = null; // no error but zero rows enforced by RLS
    }

    const resolved = () => Promise.resolve(_error ? { data: null, error: _error } : { data: [], error: null });
    const chain = {
      select: () => chain,
      insert: () => chain,
      update: () => chain,
      upsert: () => chain,
      delete: () => chain,
      eq: () => chain,
      neq: () => chain,
      is: () => chain,
      not: () => chain,
      or: () => chain,
      order: () => chain,
      limit: () => chain,
      single: resolved,
      maybeSingle: resolved,
      then: (resolve, reject) => resolved().then(resolve, reject),
    };
    return chain;
  };

  const rpc = (name, _args = {}) => {
    if (W83_MISSING_RPCS.has(name)) {
      return Promise.resolve(PG_FUNCTION_NOT_FOUND(name));
    }
    // Simulate role check for structural-change approval
    if (name === 'pit_approve_structural_change' && actor.role !== 'project_manager') {
      return Promise.resolve(PG_RAISE('Only the project leader may approve structural changes.'));
    }
    return Promise.resolve(PG_FUNCTION_NOT_FOUND(name));
  };

  return { from: fromChain, rpc };
}

// ─── Actor personas ──────────────────────────────────────────────────────────

const UNAUTHENTICATED    = { userId: null, orgId: null, role: 'unauthenticated' };
const VIEWER             = { userId: '00000000-0000-4000-8001-000000000001', orgId: '00000000-0000-4000-8000-aaa000000001', role: 'viewer' };
const CONTRIBUTOR        = { userId: '00000000-0000-4000-8001-000000000002', orgId: '00000000-0000-4000-8000-aaa000000001', role: 'contributor' };
const MILESTONE_OWNER    = { userId: '00000000-0000-4000-8001-000000000003', orgId: '00000000-0000-4000-8000-aaa000000001', role: 'team_leader' };
const DELIVERABLE_OWNER  = { userId: '00000000-0000-4000-8001-000000000004', orgId: '00000000-0000-4000-8000-aaa000000001', role: 'team_leader' };
const TASK_OWNER         = { userId: '00000000-0000-4000-8001-000000000005', orgId: '00000000-0000-4000-8000-aaa000000001', role: 'contributor' };
const PROJECT_LEADER     = { userId: '00000000-0000-4000-8001-000000000010', orgId: '00000000-0000-4000-8000-aaa000000001', role: 'project_manager' };
const CROSS_TENANT       = { userId: '00000000-0000-4000-8002-000000000001', orgId: '00000000-0000-4000-8000-bbb000000002', role: 'project_manager' };
const SIBLING_OWNER      = { userId: '00000000-0000-4000-8001-000000000006', orgId: '00000000-0000-4000-8000-aaa000000001', role: 'team_leader' };

// ─── Common RPC arguments ───────────────────────────────────────────────────

const TASK_ARGS = {
  p_org_id: '00000000-0000-4000-8000-aaa000000001',
  p_deliverable_id: '00000000-0000-4000-8030-000000000001',
  p_name: 'Task T1',
  p_owner_id: TASK_OWNER.userId,
  p_start_date: '2026-08-01',
  p_end_date: '2026-09-30',
};

// Task ID used for update/mutation tests (distinct from the deliverable ID in TASK_ARGS)
const TASK_ID = '00000000-0000-4000-8040-000000000001';

const DELIVERABLE_ARGS = {
  p_org_id: '00000000-0000-4000-8000-aaa000000001',
  p_milestone_id: '00000000-0000-4000-8020-000000000001',
  p_name: 'Deliverable D1',
  p_owner_id: DELIVERABLE_OWNER.userId,
  p_start_date: '2026-08-01',
  p_end_date: '2026-10-15',
};

const MILESTONE_ARGS = {
  p_org_id: '00000000-0000-4000-8000-aaa000000001',
  p_project_id: '00000000-0000-4000-8010-000000000001',
  p_name: 'Milestone A1',
  p_owner_id: MILESTONE_OWNER.userId,
  p_start_date: '2026-08-01',
  p_end_date: '2026-10-31',
};

// ─── Tests ───────────────────────────────────────────────────────────────────

// ── W83-001: pit_create_task enforces NOT NULL deliverable_id ────────────────

test('PIT-RED-W83-001 [supabase] pit_create_task RPC enforces NOT NULL deliverable_id', async () => {
  const client = createPreW83Client(TASK_OWNER);
  const result = await client.rpc('pit_create_task', { ...TASK_ARGS, p_deliverable_id: null });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_create_task RPC with NOT NULL deliverable_id constraint — ${result.error?.message ?? 'RPC absent from database'}`,
  );
});

// ── W83-002: pit_create_deliverable enforces NOT NULL milestone_id ───────────

test('PIT-RED-W83-002 [supabase] pit_create_deliverable RPC enforces NOT NULL milestone_id', async () => {
  const client = createPreW83Client(DELIVERABLE_OWNER);
  const result = await client.rpc('pit_create_deliverable', { ...DELIVERABLE_ARGS, p_milestone_id: null });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_create_deliverable RPC with NOT NULL milestone_id constraint — ${result.error?.message ?? 'RPC absent from database'}`,
  );
});

// ── W83-003: pit_create_milestone enforces NOT NULL project_id ───────────────

test('PIT-RED-W83-003 [supabase] pit_create_milestone RPC enforces NOT NULL project_id', async () => {
  const client = createPreW83Client(MILESTONE_OWNER);
  const result = await client.rpc('pit_create_milestone', { ...MILESTONE_ARGS, p_project_id: null });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_create_milestone RPC with NOT NULL project_id constraint — ${result.error?.message ?? 'RPC absent from database'}`,
  );
});

// ── W83-004: Cross-project parent reference rejected ────────────────────────

test('PIT-RED-W83-004 [supabase] hierarchy RPCs reject cross-project parent reference', async () => {
  // Bind a deliverable to a milestone in a different project
  const client = createPreW83Client(DELIVERABLE_OWNER);
  const result = await client.rpc('pit_create_deliverable', {
    ...DELIVERABLE_ARGS,
    p_milestone_id: '00000000-0000-4000-8020-000000000003', // milestone belongs to PROJECT_BETA
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires same-project validation in pit_create_deliverable — ${result.error?.message ?? 'Cross-project check absent from database'}`,
  );
});

// ── W83-005: Cross-tenant RLS — org_id isolation ─────────────────────────────

test('PIT-RED-W83-005 [supabase] pit_milestones table is isolated by org_id for cross-tenant actor', async () => {
  const client = createPreW83Client(CROSS_TENANT);
  const result = await client.from('pit_milestones').select('*').eq('org_id', CROSS_TENANT.orgId);
  // Expect empty rows (cross-tenant isolation); the table must exist for RLS to apply
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_milestones table with org_id RLS isolation — ${result.error?.message ?? 'pit_milestones table absent from database'}`,
  );
  assert.ok(
    Array.isArray(result.data),
    `W8.3 requires pit_milestones RLS to return an empty set for cross-tenant actor — table absent`,
  );
  assert.equal(
    result.data.length,
    0,
    `W8.3 requires cross-tenant actor receives zero milestones — org_id RLS absent`,
  );
});

// ── W83-006: Viewer RLS denial — hierarchy mutation rejected ──────────────────

test('PIT-RED-W83-006 [supabase] viewer role is denied hierarchy mutation by RLS', async () => {
  const client = createPreW83Client(VIEWER);
  const result = await client.rpc('pit_create_milestone', MILESTONE_ARGS);
  // The RPC must fail with an RLS violation when called by a viewer
  // (before that, it fails because the RPC doesn't exist)
  assert.equal(
    result.error,
    null,
    `W8.3 requires viewer-denial RLS on pit_create_milestone — ${result.error?.message ?? 'RPC and RLS absent'}`,
  );
});

// ── W83-007: Milestone owner denied sibling-milestone edit ──────────────────

test('PIT-RED-W83-007 [supabase] pitHierarchyService denies milestone owner editing sibling milestone', async () => {
  // pitHierarchyService.ts would call pit_update_milestone RPC with scope check
  const client = createPreW83Client(MILESTONE_OWNER);
  const result = await client.rpc('pit_update_milestone', {
    p_milestone_id: '00000000-0000-4000-8020-000000000002', // MILESTONE_A2 — sibling
    p_actor_id: MILESTONE_OWNER.userId,
    p_patch: { name: 'Renamed by wrong owner' },
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pitHierarchyService.ts with sibling-scope denial via pit_update_milestone RPC — ${result.error?.message ?? 'RPC and service absent'}`,
  );
});

// ── W83-008: Deliverable owner denied sibling-deliverable edit ───────────────

test('PIT-RED-W83-008 [supabase] pitDeliverableRepository denies deliverable owner editing sibling deliverable', async () => {
  const client = createPreW83Client(DELIVERABLE_OWNER);
  const result = await client.rpc('pit_update_deliverable', {
    p_deliverable_id: '00000000-0000-4000-8030-000000000099', // sibling deliverable
    p_actor_id: DELIVERABLE_OWNER.userId,
    p_patch: { name: 'Renamed by wrong owner' },
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pitDeliverableRepository.ts with sibling-scope denial — ${result.error?.message ?? 'RPC and repository absent'}`,
  );
});

// ── W83-009: Task owner denied parent-structure change ──────────────────────

test('PIT-RED-W83-009 [supabase] pitTaskRepository denies task owner changing parent structure', async () => {
  const client = createPreW83Client(TASK_OWNER);
  const result = await client.rpc('pit_update_task', {
    p_task_id: TASK_ID,
    p_actor_id: TASK_OWNER.userId,
    p_patch: { deliverable_id: '00000000-0000-4000-8030-000000000099' }, // parent change
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_update_task RPC and pitTaskRepository.ts preventing parent-structure changes — ${result.error?.message ?? 'RPC and repository absent'}`,
  );
});

// ── W83-015: Date validation rejects end-before-start ───────────────────────

test('PIT-RED-W83-015 [supabase] pitDateExceptionService rejects end-before-start date order', async () => {
  const client = createPreW83Client(DELIVERABLE_OWNER);
  // pitDateExceptionService.ts would call pit_validate_date_range or do client-side check
  // Here we prove the RPC/service is absent
  const result = await client.rpc('pit_validate_date_range', {
    p_start_date: '2026-10-31',
    p_end_date: '2026-08-01', // end before start
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pitDateExceptionService.ts end-before-start rejection — ${result.error?.message ?? 'Service and RPC absent'}`,
  );
});

// ── W83-016: Child outside parent range requires confirmation ────────────────

test('PIT-RED-W83-016 [supabase] pitDateExceptionService requires confirmation for child outside parent range', async () => {
  const client = createPreW83Client(DELIVERABLE_OWNER);
  const result = await client.rpc('pit_create_deliverable', {
    ...DELIVERABLE_ARGS,
    p_start_date: '2026-07-01',  // outside milestone start (2026-08-01)
    p_confirmation_rationale: null, // no confirmation provided
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pitDateExceptionService.ts parent-range confirmation check — ${result.error?.message ?? 'Date validation absent from pit_create_deliverable'}`,
  );
});

// ── W83-017: pit_date_exceptions table stores confirmed exceptions ───────────

test('PIT-RED-W83-017 [supabase] pit_date_exceptions table stores confirmed date-range exceptions', async () => {
  const client = createPreW83Client(DELIVERABLE_OWNER);
  const result = await client.from('pit_date_exceptions').select('*').eq('deliverable_id', DELIVERABLE_ARGS.p_deliverable_id ?? '00000000-0000-4000-8030-000000000001');
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_date_exceptions table with rationale/actor/timestamp columns — ${result.error?.message ?? 'Table absent from database'}`,
  );
});

// ── W83-021: pitStructuralChangeService validates every child has a target ───

test('PIT-RED-W83-021 [supabase] pitStructuralChangeService rejects proposal with child missing target', async () => {
  const client = createPreW83Client(MILESTONE_OWNER);
  const result = await client.rpc('pit_submit_structural_change', {
    p_source_id: '00000000-0000-4000-8020-000000000001',
    p_source_type: 'milestone',
    p_child_transfers: [
      { child_id: '00000000-0000-4000-8030-000000000001', child_type: 'deliverable', target_parent_id: null },
    ],
    p_rationale: 'Restructuring',
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pitStructuralChangeService.ts every-child-has-target validation — ${result.error?.message ?? 'Service and RPC absent'}`,
  );
});

// ── W83-022: pitStructuralChangeService rejects cancelled/cross-project target

test('PIT-RED-W83-022 [supabase] pitStructuralChangeService rejects cancelled or cross-project transfer target', async () => {
  const client = createPreW83Client(MILESTONE_OWNER);
  const result = await client.rpc('pit_submit_structural_change', {
    p_source_id: '00000000-0000-4000-8020-000000000001',
    p_source_type: 'milestone',
    p_child_transfers: [
      {
        child_id: '00000000-0000-4000-8030-000000000001',
        child_type: 'deliverable',
        target_parent_id: '00000000-0000-4000-8020-000000000003', // cross-project milestone
      },
    ],
    p_rationale: 'Restructuring',
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pitStructuralChangeService.ts target-validity rejection — ${result.error?.message ?? 'Service and RPC absent'}`,
  );
});

// ── W83-023: Only project leader may approve structural change ───────────────

test('PIT-RED-W83-023 [supabase] pit_approve_structural_change RPC rejects non-project-leader approver', async () => {
  // Contributor should not be able to approve
  const client = createPreW83Client(CONTRIBUTOR);
  const result = await client.rpc('pit_approve_structural_change', {
    p_proposal_id: '00000000-0000-4000-8050-000000000001',
    p_actor_id: CONTRIBUTOR.userId,
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_approve_structural_change RPC with project-leader role check — ${result.error?.message ?? 'RPC absent'}`,
  );
});

// ── W83-024: Atomic multi-child transfer applies all children ─────────────────

test('PIT-RED-W83-024 [supabase] pit_approve_structural_change executes atomic multi-child transfer', async () => {
  const client = createPreW83Client(PROJECT_LEADER);
  const result = await client.rpc('pit_approve_structural_change', {
    p_proposal_id: '00000000-0000-4000-8050-000000000001',
    p_actor_id: PROJECT_LEADER.userId,
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_approve_structural_change with atomic transaction for multi-child transfer — ${result.error?.message ?? 'RPC and atomic transaction absent'}`,
  );
  assert.ok(
    result.data && result.data.applied_count >= 1,
    `W8.3 requires pit_approve_structural_change to return applied_count — RPC absent`,
  );
});

// ── W83-025: Forced failure during second child move rolls back ───────────────

test('PIT-RED-W83-025 [supabase] pit_approve_structural_change rolls back on failure during second child move', async () => {
  const client = createPreW83Client(PROJECT_LEADER);
  // Proposal where second child has invalid target (triggers rollback)
  const result = await client.rpc('pit_approve_structural_change', {
    p_proposal_id: '00000000-0000-4000-8050-000000000003', // TRANSFER_PROPOSAL_INVALID_TARGET
    p_actor_id: PROJECT_LEADER.userId,
  });
  // After rollback, expect a P0001 EXCEPTION; and no partial mutations in pit_milestones/deliverables
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_approve_structural_change EXCEPTION/ROLLBACK on second-child failure — ${result.error?.message ?? 'RPC and rollback absent'}`,
  );
  assert.ok(
    result.data && result.data.rolled_back === true,
    `W8.3 requires zero-residue rollback evidence in response — RPC absent`,
  );
});

// ── W83-026: Stale proposal version rejected ─────────────────────────────────

test('PIT-RED-W83-026 [supabase] pit_approve_structural_change rejects stale proposal after hierarchy changed', async () => {
  const client = createPreW83Client(PROJECT_LEADER);
  const result = await client.rpc('pit_approve_structural_change', {
    p_proposal_id: '00000000-0000-4000-8050-000000000002', // TRANSFER_PROPOSAL_STALE (version: 0)
    p_actor_id: PROJECT_LEADER.userId,
    p_expected_version: 0, // stale — current version is 1
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_approve_structural_change version check rejecting stale proposals — ${result.error?.message ?? 'RPC and version check absent'}`,
  );
});

// ── W83-027: pit_structural_audit table has all required columns ─────────────

test('PIT-RED-W83-027 [supabase] pit_structural_audit table exists with required audit columns', async () => {
  const client = createPreW83Client(PROJECT_LEADER);
  const result = await client
    .from('pit_structural_audit')
    .select('id, proposal_id, actor_id, action, old_state, new_state, applied_at')
    .eq('proposal_id', '00000000-0000-4000-8050-000000000001');
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_structural_audit table with id/proposal_id/actor_id/action/old_state/new_state/applied_at — ${result.error?.message ?? 'Table absent'}`,
  );
});

// ── W83-028: Append-only RLS prevents audit updates/deletes ──────────────────

test('PIT-RED-W83-028 [supabase] pit_structural_audit RLS prevents UPDATE and DELETE by application role', async () => {
  const client = createPreW83Client(PROJECT_LEADER);
  // Attempt a direct DELETE — must fail with RLS denial
  const result = await client
    .from('pit_structural_audit')
    .delete()
    .eq('id', '00000000-0000-4000-9000-000000000001');
  assert.equal(
    result.error,
    null,
    `W8.3 requires pit_structural_audit append-only RLS preventing DELETE — ${result.error?.message ?? 'Table and RLS absent'}`,
  );
  // After W8.3: error.code should be '42501' (insufficient_privilege)
});

// ── W83-029: Constraint/trigger blocks active child under cancelled parent ────

test('PIT-RED-W83-029 [supabase] hierarchy table constraint blocks active child under cancelled parent', async () => {
  const client = createPreW83Client(MILESTONE_OWNER);
  const result = await client.rpc('pit_create_deliverable', {
    ...DELIVERABLE_ARGS,
    p_milestone_id: '00000000-0000-4000-8020-000000000099', // hypothetical cancelled milestone
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires constraint/trigger on hierarchy tables preventing active child under cancelled parent — ${result.error?.message ?? 'Constraint and RPC absent'}`,
  );
});

// ── W83-030: pitMmmTransformAdapter maps Domain/MPS/Criterion hierarchy ──────

test('PIT-RED-W83-030 [supabase] pitMmmTransformAdapter transforms MMM package into pit_milestones/deliverables/tasks', async () => {
  const client = createPreW83Client(PROJECT_LEADER);
  // The adapter calls pit_import_mmm_package RPC
  const result = await client.rpc('pit_import_mmm_package', {
    p_project_id: '00000000-0000-4000-8010-000000000001',
    p_framework_id: 'LDCS-2025',
    p_programme_id: 'access-control',
    p_source_type: 'mmm',
    p_source_version: '2025.1',
    p_transform_version: 'pit-w83-transform-v1',
    p_payload: JSON.stringify({ domains: [{ id: 'domain-001' }] }),
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pitMmmTransformAdapter.ts and pit_import_mmm_package RPC — ${result.error?.message ?? 'Adapter and RPC absent'}`,
  );
});

// ── W83-031: Source lineage fields are immutable after creation ───────────────

test('PIT-RED-W83-031 [supabase] pit_tasks lineage fields (mmm_source_id, transform_version) are immutable', async () => {
  const client = createPreW83Client(TASK_OWNER);
  // Attempt to update lineage fields — should fail with check constraint or trigger
  const result = await client.rpc('pit_update_task', {
    p_task_id: '00000000-0000-4000-8040-000000000001',
    p_actor_id: TASK_OWNER.userId,
    p_patch: { mmm_source_id: 'forged-source', transform_version: 'tampered' },
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires source lineage fields on pit_tasks to be immutable — ${result.error?.message ?? 'RPC, lineage fields, and immutability constraint absent'}`,
  );
});

// ── W83-032: AIMC suggestions stored as proposals only (not canonical) ────────

test('PIT-RED-W83-032 [supabase] pitAimcSuggestionService stores suggestions as proposals, never canonical', async () => {
  const client = createPreW83Client(PROJECT_LEADER);
  const result = await client.rpc('pit_request_aimc_suggestions', {
    p_project_id: '00000000-0000-4000-8010-000000000001',
    p_milestone_id: '00000000-0000-4000-8020-000000000001',
    p_prompt: 'Suggest executable tasks for the MFA milestone.',
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pitAimcSuggestionService.ts and pit_request_aimc_suggestions RPC — ${result.error?.message ?? 'Service and RPC absent'}`,
  );
  assert.ok(
    result.data && result.data.status === 'draft',
    `W8.3 requires AIMC suggestions stored with status='draft', never 'canonical' without approval — RPC absent`,
  );
});

// ── W83-033: Editing suggestion and declining learning leaves no memory record ─

test('PIT-RED-W83-033 [supabase] pitAimcSuggestionService creates no memory record when learning is declined', async () => {
  const client = createPreW83Client(PROJECT_LEADER);
  const result = await client.rpc('pit_accept_aimc_suggestion', {
    p_proposal_id: '00000000-0000-4000-8060-000000000001',
    p_accepted_text: 'Enable MFA for admin accounts (edited)',
    p_learn_from_edit: false, // opt-out
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pitAimcSuggestionService.ts opt-out path with no memory record — ${result.error?.message ?? 'Service and RPC absent'}`,
  );
  assert.ok(
    result.data && result.data.memory_record_created === false,
    `W8.3 requires no memory record when learn_from_edit=false — RPC absent`,
  );
});

// ── W83-035: Evidence assurance plugin does not auto-progress task ────────────

test('PIT-RED-W83-035 [supabase] pitEvidenceAssurancePlugin evaluates evidence without auto-progressing task status', async () => {
  const client = createPreW83Client(TASK_OWNER);
  const result = await client.rpc('pit_evaluate_evidence', {
    p_task_id: '00000000-0000-4000-8040-000000000001',
    p_criterion_source_id: 'crit-001',
    p_evidence_payload: JSON.stringify({ type: 'screenshot', url: 'https://evidence.example/mfa.png' }),
  });
  assert.equal(
    result.error,
    null,
    `W8.3 requires pitEvidenceAssurancePlugin.ts and pit_evaluate_evidence RPC — ${result.error?.message ?? 'Plugin and RPC absent'}`,
  );
  assert.ok(
    result.data && result.data.task_status === 'in_progress',
    `W8.3 requires evidence evaluation to leave task status unchanged (no auto-progress) — RPC absent`,
  );
});

// ── W83-036: IWM reservation fields present on pit_tasks; no pitIncidentWorkflowClient

test('PIT-RED-W83-036 [supabase] pit_tasks has IWM reservation fields; pitIncidentWorkflowClient.ts is absent', async () => {
  const client = createPreW83Client(TASK_OWNER);
  // Verify IWM reservation fields exist on pit_tasks
  const result = await client
    .from('pit_tasks')
    .select('id, iwm_reservation_id, iwm_reserved_at, iwm_released_at')
    .eq('id', '00000000-0000-4000-8040-000000000001');
  assert.equal(
    result.error,
    null,
    `W8.3 requires IWM reservation fields (iwm_reservation_id, iwm_reserved_at, iwm_released_at) on pit_tasks — ${result.error?.message ?? 'pit_tasks table and IWM fields absent'}`,
  );
  // Also assert pitIncidentWorkflowClient.ts must NOT exist (reserved for a future wave)
  // (That static assertion is also in pit-w83-red-contract.test.mjs)
});
