/**
 * PIT W8.3 RED Test Fixtures
 *
 * Shared constants for test identities, organisation/project stubs,
 * MMM source-lineage payloads and structural-change scenarios used
 * across the PIT-RED-W83-001..036 behavioural inventory.
 *
 * These fixtures are referenced by pit-w83-red-contract.test.mjs.
 * They document the inputs that the W8.3 implementation builder must
 * accept and process correctly when turning each test GREEN.
 *
 * QA authority: Issue #1974 / PR #1972 / Appointment e18eb8c
 */

// ─── Actor identities ──────────────────────────────────────────────────────

export const UNAUTHENTICATED = { role: 'unauthenticated' };

export const VIEWER = {
  userId: '00000000-0000-4000-8001-000000000001',
  orgId:   '00000000-0000-4000-8000-aaa000000001',
  role: 'viewer',
};

export const CONTRIBUTOR = {
  userId: '00000000-0000-4000-8001-000000000002',
  orgId:   '00000000-0000-4000-8000-aaa000000001',
  role: 'contributor',
};

export const MILESTONE_OWNER = {
  userId: '00000000-0000-4000-8001-000000000003',
  orgId:   '00000000-0000-4000-8000-aaa000000001',
  role: 'team_leader',
};

export const DELIVERABLE_OWNER = {
  userId: '00000000-0000-4000-8001-000000000004',
  orgId:   '00000000-0000-4000-8000-aaa000000001',
  role: 'team_leader',
};

export const TASK_OWNER = {
  userId: '00000000-0000-4000-8001-000000000005',
  orgId:   '00000000-0000-4000-8000-aaa000000001',
  role: 'contributor',
};

export const PROJECT_LEADER = {
  userId: '00000000-0000-4000-8001-000000000010',
  orgId:   '00000000-0000-4000-8000-aaa000000001',
  role: 'project_manager',
};

export const CROSS_TENANT_ACTOR = {
  userId: '00000000-0000-4000-8002-000000000001',
  orgId:   '00000000-0000-4000-8000-bbb000000002',
  role: 'project_manager',
};

export const SIBLING_MILESTONE_OWNER = {
  userId: '00000000-0000-4000-8001-000000000006',
  orgId:   '00000000-0000-4000-8000-aaa000000001',
  role: 'team_leader',
};

// ─── Organisations ─────────────────────────────────────────────────────────

export const ORG_A = { id: '00000000-0000-4000-8000-aaa000000001', name: 'Org Alpha' };
export const ORG_B = { id: '00000000-0000-4000-8000-bbb000000002', name: 'Org Beta (cross-tenant)' };

// ─── Projects ─────────────────────────────────────────────────────────────

export const PROJECT_ALPHA = {
  id: '00000000-0000-4000-8010-000000000001',
  orgId: ORG_A.id,
  name: 'Alpha Implementation',
  projectLeaderId: PROJECT_LEADER.userId,
  startDate: '2026-08-01',
  endDate: '2026-12-31',
  status: 'active',
};

export const PROJECT_BETA = {
  id: '00000000-0000-4000-8010-000000000002',
  orgId: ORG_A.id,
  name: 'Beta Implementation',
  projectLeaderId: PROJECT_LEADER.userId,
  startDate: '2026-09-01',
  endDate: '2026-12-31',
  status: 'active',
};

// ─── Milestones ────────────────────────────────────────────────────────────

export const MILESTONE_A1 = {
  id: '00000000-0000-4000-8020-000000000001',
  projectId: PROJECT_ALPHA.id,
  orgId: ORG_A.id,
  name: 'Milestone A1',
  ownerId: MILESTONE_OWNER.userId,
  startDate: '2026-08-01',
  endDate: '2026-10-31',
  status: 'active',
};

export const MILESTONE_A2 = {
  id: '00000000-0000-4000-8020-000000000002',
  projectId: PROJECT_ALPHA.id,
  orgId: ORG_A.id,
  name: 'Milestone A2 (sibling of A1)',
  ownerId: SIBLING_MILESTONE_OWNER.userId,
  startDate: '2026-09-01',
  endDate: '2026-11-30',
  status: 'active',
};

export const MILESTONE_BETA_PROJECT = {
  id: '00000000-0000-4000-8020-000000000003',
  projectId: PROJECT_BETA.id,
  orgId: ORG_A.id,
  name: 'Milestone in Beta project (cross-project)',
  ownerId: MILESTONE_OWNER.userId,
  startDate: '2026-09-01',
  endDate: '2026-12-31',
  status: 'active',
};

// ─── Deliverables ──────────────────────────────────────────────────────────

export const DELIVERABLE_A1_D1 = {
  id: '00000000-0000-4000-8030-000000000001',
  milestoneId: MILESTONE_A1.id,
  projectId: PROJECT_ALPHA.id,
  orgId: ORG_A.id,
  name: 'Deliverable D1 under Milestone A1',
  ownerId: DELIVERABLE_OWNER.userId,
  startDate: '2026-08-01',
  endDate: '2026-10-15',
  status: 'active',
};

// ─── Tasks ─────────────────────────────────────────────────────────────────

export const TASK_D1_T1 = {
  id: '00000000-0000-4000-8040-000000000001',
  deliverableId: DELIVERABLE_A1_D1.id,
  milestoneId: MILESTONE_A1.id,
  projectId: PROJECT_ALPHA.id,
  orgId: ORG_A.id,
  name: 'Task T1 under Deliverable D1',
  ownerId: TASK_OWNER.userId,
  startDate: '2026-08-01',
  endDate: '2026-09-30',
  status: 'active',
};

// ─── Structural-change proposals ───────────────────────────────────────────

export const TRANSFER_PROPOSAL_VALID = {
  id: '00000000-0000-4000-8050-000000000001',
  sourceId: MILESTONE_A1.id,
  sourceType: 'milestone',
  requesterId: MILESTONE_OWNER.userId,
  projectId: PROJECT_ALPHA.id,
  rationale: 'Restructuring required due to scope change.',
  childTransfers: [
    {
      childId: DELIVERABLE_A1_D1.id,
      childType: 'deliverable',
      targetParentId: MILESTONE_A2.id,
    },
  ],
  status: 'pending',
  version: 1,
};

export const TRANSFER_PROPOSAL_STALE = {
  ...TRANSFER_PROPOSAL_VALID,
  id: '00000000-0000-4000-8050-000000000002',
  version: 0, // stale — hierarchy has changed since proposal was created
};

export const TRANSFER_PROPOSAL_INVALID_TARGET = {
  ...TRANSFER_PROPOSAL_VALID,
  id: '00000000-0000-4000-8050-000000000003',
  childTransfers: [
    {
      childId: DELIVERABLE_A1_D1.id,
      childType: 'deliverable',
      targetParentId: MILESTONE_BETA_PROJECT.id, // cross-project: forbidden
    },
  ],
};

// ─── MMM source payloads ───────────────────────────────────────────────────

export const MMM_IMPLEMENTATION_PACKAGE = {
  frameworkId: 'LDCS-2025',
  programmeId: 'access-control',
  domains: [
    {
      id: 'domain-001',
      label: 'Access Management',
      mps: [
        {
          id: 'mps-001',
          label: 'User Authentication',
          criteria: [
            { id: 'crit-001', label: 'MFA implementation', decompositionHint: 'multi-task' },
            { id: 'crit-002', label: 'Password policy enforcement', decompositionHint: 'single-task' },
          ],
        },
      ],
    },
  ],
  sourceType: 'mmm',
  sourceVersion: '2025.1',
  transformVersion: 'pit-w83-transform-v1',
};

// ─── Date-exception payloads ────────────────────────────────────────────────

export const DATE_ORDER_VIOLATION = {
  startDate: '2026-10-31',
  endDate: '2026-08-01', // end before start
};

export const PARENT_RANGE_EXCEPTION = {
  childStartDate: '2026-07-01', // outside parent (2026-08-01)
  childEndDate: '2026-09-30',
  parentStartDate: '2026-08-01',
  parentEndDate: '2026-10-31',
  confirmationRationale: 'Pre-work required before parent start.',
  confirmedBy: DELIVERABLE_OWNER.userId,
};

// ─── AIMC suggestion scenario ──────────────────────────────────────────────

export const AIMC_SUGGESTION_REQUEST = {
  requestingUserId: PROJECT_LEADER.userId,
  projectId: PROJECT_ALPHA.id,
  milestoneId: MILESTONE_A1.id,
  prompt: 'Suggest executable tasks for the MFA milestone.',
};

export const AIMC_SUGGESTION_RESPONSE_DRAFT = {
  proposalId: '00000000-0000-4000-8060-000000000001',
  suggestions: [
    { description: 'Enable MFA for admin accounts', acceptanceEvidence: 'MFA active in audit log' },
    { description: 'Roll out MFA to all users', acceptanceEvidence: 'All accounts enrolled' },
  ],
  status: 'draft', // must never be 'canonical' without human approval
};

// ─── Evidence assurance scenario ───────────────────────────────────────────

export const EVIDENCE_ASSURANCE_REQUEST = {
  taskId: TASK_D1_T1.id,
  criterionSourceId: 'crit-001',
  evidencePayload: { type: 'screenshot', url: 'https://evidence.example/mfa-enabled.png' },
};
