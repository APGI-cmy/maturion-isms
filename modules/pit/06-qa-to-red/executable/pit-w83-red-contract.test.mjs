import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * PIT W8.3 — Executable RED contract inventory
 * Tests: PIT-RED-W83-001 through PIT-RED-W83-036
 *
 * Governing issue:     #1974 (QA-to-RED completion)
 * Carrier PR:          #1972
 * Parent pre-build:    #1968
 * QA builder appt:     e18eb8c
 * Contract source:     modules/pit/06-qa-to-red/w83-strategy-alignment-red-contract.md
 *
 * Run from repository root:
 *   node --test modules/pit/06-qa-to-red/executable/pit-w83-red-contract.test.mjs
 *
 * ALL tests MUST fail (RED) until the W8.3 implementation builder delivers
 * the required runtime, schema and behaviour.  Each failure message names
 * the unmet requirement so the implementation builder has exact test targets.
 *
 * Harness rules enforced by CI:
 *   - No ENOENT, SyntaxError, ERR_MODULE_NOT_FOUND or ReferenceError.
 *   - Failures must name missing product capabilities.
 *   - No test may pass before W8.3 runtime is delivered.
 */

// ─── Paths ──────────────────────────────────────────────────────────────────

const repo = resolve(import.meta.dirname, '../../../..');

const paths = {
  appTsx:                  join(repo, 'apps/isms-portal/src/App.tsx'),
  pitPages:                join(repo, 'apps/isms-portal/src/pages/pit'),
  migrations:              join(repo, 'supabase/migrations'),
  pitLibDir:               join(repo, 'apps/isms-portal/src/lib'),

  // W8.3 service modules — MUST NOT exist yet
  hierarchyService:        join(repo, 'apps/isms-portal/src/lib/pitHierarchyService.ts'),
  milestoneRepo:           join(repo, 'apps/isms-portal/src/lib/pitMilestoneRepository.ts'),
  deliverableRepo:         join(repo, 'apps/isms-portal/src/lib/pitDeliverableRepository.ts'),
  taskRepo:                join(repo, 'apps/isms-portal/src/lib/pitTaskRepository.ts'),
  structuralChangeService: join(repo, 'apps/isms-portal/src/lib/pitStructuralChangeService.ts'),
  mmmTransformAdapter:     join(repo, 'apps/isms-portal/src/lib/pitMmmTransformAdapter.ts'),
  aimcSuggestionService:   join(repo, 'apps/isms-portal/src/lib/pitAimcSuggestionService.ts'),
  evidenceAssurancePlugin: join(repo, 'apps/isms-portal/src/lib/pitEvidenceAssurancePlugin.ts'),
  dateExceptionService:    join(repo, 'apps/isms-portal/src/lib/pitDateExceptionService.ts'),
  hierarchyLifecycle:      join(repo, 'apps/isms-portal/src/lib/pitHierarchyLifecycle.ts'),

  // W8.3 page components — MUST NOT exist yet
  milestoneWizard:         join(repo, 'apps/isms-portal/src/pages/pit/MilestoneSetupWizard.tsx'),
  deliverableWizard:       join(repo, 'apps/isms-portal/src/pages/pit/DeliverableSetupWizard.tsx'),
  taskWizard:              join(repo, 'apps/isms-portal/src/pages/pit/TaskSetupWizard.tsx'),
  invitePreview:           join(repo, 'apps/isms-portal/src/pages/pit/MilestoneOwnerInvitePreview.tsx'),
  inviteAcceptance:        join(repo, 'apps/isms-portal/src/pages/pit/HierarchyInviteAcceptance.tsx'),
  lifecycleActions:        join(repo, 'apps/isms-portal/src/pages/pit/HierarchyLifecycleActions.tsx'),
  cancellationGuard:       join(repo, 'apps/isms-portal/src/pages/pit/CancellationDescendantGuard.tsx'),
  transferProposalForm:    join(repo, 'apps/isms-portal/src/pages/pit/TransferProposalForm.tsx'),
  approvalWorkspace:       join(repo, 'apps/isms-portal/src/pages/pit/StructuralChangeApproval.tsx'),
  mmmTransformPage:        join(repo, 'apps/isms-portal/src/pages/pit/MmmTransformWizard.tsx'),
  aimcSuggestionPanel:     join(repo, 'apps/isms-portal/src/pages/pit/AimcSuggestionPanel.tsx'),
  preferencePanel:         join(repo, 'apps/isms-portal/src/pages/pit/AimcPreferencePanel.tsx'),
  evidencePanel:           join(repo, 'apps/isms-portal/src/pages/pit/EvidenceAssurancePanel.tsx'),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Read a file that is expected to exist (source file, App.tsx, etc.) */
function read(filePath) {
  return readFileSync(filePath, 'utf8');
}

/** Collect SQL migration content as one joined string. */
function allMigrationSql() {
  if (!existsSync(paths.migrations)) return '';
  const files = readdirSync(paths.migrations, { recursive: true })
    .map(String)
    .filter((n) => n.endsWith('.sql'));
  return files.map((n) => read(join(paths.migrations, n))).join('\n');
}

/** Check that a file exists; fail with a named-capability message if absent. */
function assertFileExists(filePath, requirement) {
  assert.ok(
    existsSync(filePath),
    `W8.3 requires ${requirement} — missing: ${filePath.replace(repo + '/', '')}`,
  );
}

/** Check a source file contains a pattern; the source file is expected to exist. */
function assertSourceContains(filePath, pattern, requirement) {
  const src = read(filePath);
  assert.match(src, pattern, `W8.3 requires ${requirement}`);
}

/** Assert a SQL pattern exists in migrations; fail naming the missing capability. */
function assertMigrationContains(pattern, requirement) {
  const sql = allMigrationSql();
  assert.match(sql, pattern, `W8.3 requires ${requirement}`);
}

// Pre-read stable source files (these exist; reading them cannot produce ENOENT)
const appTsx = read(paths.appTsx);
const migrations = allMigrationSql();

// ─── GROUP 1: Hierarchy parentage and organisation consistency (001–005) ────
//
// These tests prove that strict Project→Milestone→Deliverable→Task
// parentage is enforced at the RPC and schema level.
// Expected RED reason: pit_create_milestone / pit_create_deliverable /
//   pit_create_task RPCs and hierarchy migration are absent.

test('PIT-RED-W83-001: pit_create_task RPC enforces strict deliverable parentage — task creation without deliverable_id must be rejected', () => {
  assert.match(
    migrations,
    /pit_create_task/,
    'W8.3 requires pit_create_task RPC that enforces deliverable_id NOT NULL; migration absent',
  );
  assert.match(
    migrations,
    /pit_create_task[\s\S]{0,2000}deliverable_id[\s\S]{0,500}NOT NULL|deliverable_id\s+uuid\s+NOT NULL/i,
    'W8.3 requires pit_create_task RPC to enforce NOT NULL deliverable_id — parentage invariant absent',
  );
});

test('PIT-RED-W83-002: pit_create_deliverable RPC enforces strict milestone parentage — deliverable creation without milestone_id must be rejected', () => {
  assert.match(
    migrations,
    /pit_create_deliverable/,
    'W8.3 requires pit_create_deliverable RPC that enforces milestone_id NOT NULL; migration absent',
  );
  assert.match(
    migrations,
    /pit_create_deliverable[\s\S]{0,2000}milestone_id[\s\S]{0,500}NOT NULL|milestone_id\s+uuid\s+NOT NULL/i,
    'W8.3 requires pit_create_deliverable RPC to enforce NOT NULL milestone_id — parentage invariant absent',
  );
});

test('PIT-RED-W83-003: pit_create_milestone RPC enforces strict project parentage — milestone creation without project_id must be rejected', () => {
  assert.match(
    migrations,
    /pit_create_milestone/,
    'W8.3 requires pit_create_milestone RPC that enforces project_id NOT NULL; migration absent',
  );
  assert.match(
    migrations,
    /pit_create_milestone[\s\S]{0,2000}project_id[\s\S]{0,500}NOT NULL|project_id\s+uuid\s+NOT NULL/i,
    'W8.3 requires pit_create_milestone RPC to enforce NOT NULL project_id — parentage invariant absent',
  );
});

test('PIT-RED-W83-004: hierarchy RPCs reject cross-project parent binding — child and parent must share the same project_id', () => {
  assert.match(
    migrations,
    /pit_create_deliverable|pit_create_task/,
    'W8.3 requires hierarchy RPCs; migrations absent',
  );
  assert.match(
    migrations,
    /cross.project|project_id.*match|same.*project|parent.*project/i,
    'W8.3 hierarchy RPCs must enforce same-project binding — cross-project parent rejection absent from migrations',
  );
});

test('PIT-RED-W83-005: RLS rejects cross-tenant parent reference — hierarchy tables must carry org_id FK isolation', () => {
  assert.match(
    migrations,
    /pit_milestones|pit_deliverables|pit_tasks/,
    'W8.3 requires pit_milestones, pit_deliverables and pit_tasks tables; migrations absent',
  );
  assert.match(
    migrations,
    /pit_milestones[\s\S]{0,3000}org_id|pit_deliverables[\s\S]{0,3000}org_id|pit_tasks[\s\S]{0,3000}org_id/,
    'W8.3 hierarchy tables must carry org_id column for cross-tenant RLS isolation — absent from migrations',
  );
});

// ─── GROUP 2: Scoped write authority and role denial (006–009) ─────────────
//
// These tests prove that viewer, sibling-scope and cross-tenant
// mutation paths are denied by RLS and RPC role checks.
// Expected RED reason: hierarchy RLS policies and role-check
//   conditions are absent from migrations.

test('PIT-RED-W83-006: viewer role is denied all hierarchy mutation — RLS policies must explicitly deny viewer INSERT/UPDATE', () => {
  assert.match(
    migrations,
    /pit_milestones|pit_deliverables|pit_tasks/,
    'W8.3 hierarchy tables required; migrations absent',
  );
  assert.match(
    migrations,
    /viewer|role.*viewer|viewer.*role/i,
    'W8.3 RLS must explicitly exclude viewer role from hierarchy mutation — viewer denial policy absent',
  );
});

test('PIT-RED-W83-007: milestone owner is denied mutation of sibling milestones — RPC must scope writes to owned subtree only', () => {
  assertFileExists(
    paths.hierarchyService,
    'pitHierarchyService.ts — sibling-scope write denial logic for milestone owner',
  );
});

test('PIT-RED-W83-008: deliverable owner is denied mutation of sibling deliverables — RPC must scope writes to owned deliverable only', () => {
  assertFileExists(
    paths.deliverableRepo,
    'pitDeliverableRepository.ts — sibling-scope write denial for deliverable owner',
  );
});

test('PIT-RED-W83-009: task owner is denied parent-structure changes — task mutation must not permit milestone or deliverable re-assignment', () => {
  assertFileExists(
    paths.taskRepo,
    'pitTaskRepository.ts — parent-structure change denial for task owner',
  );
  assert.match(
    migrations,
    /pit_update_task/,
    'W8.3 requires pit_update_task RPC that denies parent-structure mutation by task owner; migration absent',
  );
});

// ─── GROUP 3: Guided setup wizards and invitation behaviour (010–014) ───────
//
// These tests prove that role-specific setup wizards and invitation
// preview pages exist and implement required states.
// Expected RED reason: wizard and invite-preview components are absent.

test('PIT-RED-W83-010: project-leader milestone setup wizard exists and declares five required states', () => {
  assertFileExists(
    paths.milestoneWizard,
    'MilestoneSetupWizard.tsx — project-leader guided setup with five required states',
  );
  assertSourceContains(
    paths.milestoneWizard,
    /step|state|phase|wizard/i,
    'MilestoneSetupWizard.tsx to declare guided setup states',
  );
});

test('PIT-RED-W83-011: milestone-owner deliverable setup wizard exists and scopes creation to owned milestone', () => {
  assertFileExists(
    paths.deliverableWizard,
    'DeliverableSetupWizard.tsx — milestone-owner scoped deliverable creation',
  );
});

test('PIT-RED-W83-012: deliverable-owner task wizard exists and enforces deliverable-parent selection', () => {
  assertFileExists(
    paths.taskWizard,
    'TaskSetupWizard.tsx — deliverable-owner task creation with mandatory deliverable parent',
  );
});

test('PIT-RED-W83-013: milestone-owner invitation preview exists and shows accountability, timeline and descendant-management responsibility', () => {
  assertFileExists(
    paths.invitePreview,
    'MilestoneOwnerInvitePreview.tsx — invitation with accountability, timeline and descendant-management content',
  );
});

test('PIT-RED-W83-014: invitation acceptance activates scoped project access for the invited user', () => {
  assertFileExists(
    paths.inviteAcceptance,
    'HierarchyInviteAcceptance.tsx — invitation acceptance with scoped visibility activation',
  );
  assert.match(
    appTsx,
    /invite.*accept|accept.*invite|hierarchy.*invite/i,
    'W8.3 requires a hierarchy invitation acceptance route registered in App.tsx',
  );
});

// ─── GROUP 4: Date validation and parent-range exceptions (015–017) ─────────
//
// These tests prove that end-before-start is rejected, child-outside-
// parent-range requires confirmation, and confirmed exceptions are
// recorded with rationale, actor and timestamp.
// Expected RED reason: date validation module and exception service absent.

test('PIT-RED-W83-015: end_at before start_at is rejected for all hierarchy items — no write must occur', () => {
  assertFileExists(
    paths.dateExceptionService,
    'pitDateExceptionService.ts — end-before-start validation that blocks all hierarchy writes',
  );
  assertSourceContains(
    paths.dateExceptionService,
    /end.*start|start.*end|date.*order|invalid.*date/i,
    'pitDateExceptionService.ts to implement end_at < start_at rejection',
  );
});

test('PIT-RED-W83-016: child outside parent date range requires explicit confirmation — silent rejection or adjustment is prohibited', () => {
  assertFileExists(
    paths.dateExceptionService,
    'pitDateExceptionService.ts — child-outside-parent-range confirmation requirement',
  );
  assertSourceContains(
    paths.dateExceptionService,
    /parent.*range|outside.*parent|confirm|rationale/i,
    'pitDateExceptionService.ts to require confirmation and rationale when child is outside parent range',
  );
});

test('PIT-RED-W83-017: confirmed parent-range exception is saved with rationale, confirming actor and timestamp', () => {
  assert.match(
    migrations,
    /pit_date_exceptions|date_exception|exception.*rationale/i,
    'W8.3 requires a pit_date_exceptions table or date_exception column capturing rationale, actor and timestamp; absent from migrations',
  );
});

// ─── GROUP 5: Lifecycle vocabulary and cancellation blocking (018–020) ───────
//
// These tests prove that normal users see only Archive/Cancel/Restore
// and that cancellation is blocked when incomplete descendants exist.
// Expected RED reason: lifecycle actions component and cancellation guard absent.

test('PIT-RED-W83-018: normal-user removal menu shows Archive, Cancel and Restore only — Delete is absent', () => {
  assertFileExists(
    paths.lifecycleActions,
    'HierarchyLifecycleActions.tsx — lifecycle actions component with Archive/Cancel/Restore and no Delete for normal users',
  );
  assertSourceContains(
    paths.lifecycleActions,
    /[Aa]rchive|[Cc]ancel|[Rr]estore/,
    'HierarchyLifecycleActions.tsx to expose Archive, Cancel and Restore actions',
  );
  assertSourceContains(
    paths.lifecycleActions,
    /[Dd]elete.*false|no.*[Dd]elete|isAdmin|role.*admin/i,
    'HierarchyLifecycleActions.tsx to suppress Delete for non-admin users',
  );
});

test('PIT-RED-W83-019: cancellation of a milestone is blocked when incomplete descendants exist', () => {
  assertFileExists(
    paths.cancellationGuard,
    'CancellationDescendantGuard.tsx — pre-cancellation descendant check that blocks when incomplete items exist',
  );
  assert.match(
    migrations,
    /pit_cancellation_preflight|pit_check_descendants|incomplete.*descendant|descendant.*incomplete/i,
    'W8.3 requires a pit_cancellation_preflight or pit_check_descendants RPC to detect incomplete descendants; absent from migrations',
  );
});

test('PIT-RED-W83-020: cancellation of a deliverable is blocked when incomplete tasks exist', () => {
  assertFileExists(
    paths.cancellationGuard,
    'CancellationDescendantGuard.tsx — cancellation guard covers deliverable-level blocking for incomplete tasks',
  );
  assertSourceContains(
    paths.cancellationGuard,
    /task|deliverable.*task|incomplete/i,
    'CancellationDescendantGuard.tsx to handle deliverable-level cancellation blocking for incomplete tasks',
  );
});

// ─── GROUP 6: Structural transfer proposal and approval (021–026) ────────────
//
// These tests prove transfer proposals are validated, only project
// leaders can approve, transactions are atomic and stale proposals
// are rejected.
// Expected RED reason: structural change service, approval RPC and
//   hierarchy_change_requests table absent.

test('PIT-RED-W83-021: transfer proposal must include a target parent for every incomplete child — incomplete mapping is rejected', () => {
  assertFileExists(
    paths.structuralChangeService,
    'pitStructuralChangeService.ts — transfer proposal validation requiring target for each incomplete child',
  );
  assertSourceContains(
    paths.structuralChangeService,
    /child.*target|target.*child|incomplete.*target|every.*child/i,
    'pitStructuralChangeService.ts to validate that every incomplete child has a target in the proposal',
  );
});

test('PIT-RED-W83-022: transfer proposal with cancelled or cross-project target parent is rejected', () => {
  assertFileExists(
    paths.structuralChangeService,
    'pitStructuralChangeService.ts — cross-project and cancelled target rejection',
  );
  assertSourceContains(
    paths.structuralChangeService,
    /cross.project|cancel|invalid.*target|target.*invalid/i,
    'pitStructuralChangeService.ts to reject cancelled or cross-project transfer targets',
  );
});

test('PIT-RED-W83-023: non-project-leader user is denied structural transfer approval', () => {
  assert.match(
    migrations,
    /pit_approve_structural_change|pit_approve_hierarchy_change|approve.*transfer/i,
    'W8.3 requires pit_approve_structural_change RPC with project-leader role check; absent from migrations',
  );
  assert.match(
    migrations,
    /project_leader|project_manager|role.*check|role.*require/i,
    'W8.3 pit_approve_structural_change RPC must enforce project-leader role; role check absent from migrations',
  );
});

test('PIT-RED-W83-024: approved multi-child transfer moves all children and cancels the source in one atomic transaction', () => {
  assert.match(
    migrations,
    /pit_approve_structural_change|pit_approve_hierarchy_change/i,
    'W8.3 requires pit_approve_structural_change RPC performing atomic multi-child transfer; absent from migrations',
  );
  assert.match(
    migrations,
    /BEGIN|TRANSACTION|atomic|FOR UPDATE/i,
    'W8.3 pit_approve_structural_change RPC must use a transaction for atomic transfer; transaction block absent from migrations',
  );
});

test('PIT-RED-W83-025: a simulated failure during the second child move rolls back the entire transfer transaction', () => {
  assert.match(
    migrations,
    /EXCEPTION|ROLLBACK|RAISE|rollback.*transfer|transfer.*rollback/i,
    'W8.3 pit_approve_structural_change RPC must handle mid-transaction failure with full rollback; error/rollback handling absent from migrations',
  );
  assertFileExists(
    paths.structuralChangeService,
    'pitStructuralChangeService.ts — client-side error handling to surface rollback result to the UI',
  );
});

test('PIT-RED-W83-026: a stale proposal (hierarchy changed since proposal was created) is rejected before any mutation', () => {
  assert.match(
    migrations,
    /pit_approve_structural_change|pit_approve_hierarchy_change/i,
    'W8.3 approval RPC required; absent from migrations',
  );
  assert.match(
    migrations,
    /version|stale|concurrent|optimistic/i,
    'W8.3 pit_approve_structural_change RPC must perform a stale-proposal version check before mutating; stale-check absent from migrations',
  );
});

// ─── GROUP 7: Structural-change audit and immutability (027–028) ─────────────
//
// These tests prove that the audit trail is append-only and cannot
// be modified by application roles.
// Expected RED reason: structural audit table and RLS absent.

test('PIT-RED-W83-027: successful transfer audit record contains request, decision, moves, cancellation and timestamps in append-only storage', () => {
  assert.match(
    migrations,
    /pit_structural_audit|pit_hierarchy_audit|structural_change_log/i,
    'W8.3 requires a pit_structural_audit or pit_hierarchy_audit table recording request, decision, moves and cancellation; absent from migrations',
  );
  assert.match(
    migrations,
    /requester|approver|rationale|source|target|decision/i,
    'W8.3 structural audit table must include requester, approver, rationale, source, target and decision columns; absent from migrations',
  );
});

test('PIT-RED-W83-028: application role is denied UPDATE and DELETE on the structural audit table — append-only RLS is enforced', () => {
  assert.match(
    migrations,
    /pit_structural_audit|pit_hierarchy_audit/i,
    'W8.3 structural audit table required; absent from migrations',
  );
  assert.match(
    migrations,
    /ENABLE ROW LEVEL SECURITY|FOR SELECT|INSERT.*audit|audit.*INSERT|no.*update|no.*delete/i,
    'W8.3 structural audit table must have RLS that prevents UPDATE and DELETE by application roles; RLS absent from migrations',
  );
});

// ─── GROUP 8: No active descendants under cancelled parent (029) ─────────────
//
// This test proves that an active/incomplete descendant cannot be
// left bound to a cancelled milestone or deliverable.
// Expected RED reason: descendant-under-cancelled-parent constraint absent.

test('PIT-RED-W83-029: database constraint prevents active descendant from remaining bound to a cancelled parent', () => {
  assert.match(
    migrations,
    /pit_milestones|pit_deliverables/,
    'W8.3 hierarchy tables required; absent from migrations',
  );
  assert.match(
    migrations,
    /cancelled.*parent|active.*descendant|descendant.*cancel|CHECK.*status|CONSTRAINT.*cancel/i,
    'W8.3 requires a constraint or trigger preventing active descendants under a cancelled parent; absent from migrations',
  );
});

// ─── GROUP 9: MMM-to-PIT transformation and immutable lineage (030–031) ─────
//
// These tests prove that the MMM transformation adapter maps the
// correct structure and that source lineage is immutable after edits.
// Expected RED reason: MMM transformation adapter module absent.

test('PIT-RED-W83-030: MMM transformation adapter maps Domain→milestone, MPS→deliverable and Criterion→one-or-more tasks', () => {
  assertFileExists(
    paths.mmmTransformAdapter,
    'pitMmmTransformAdapter.ts — Domain→milestone, MPS→deliverable, Criterion→one-or-more tasks mapping',
  );
  assertSourceContains(
    paths.mmmTransformAdapter,
    /domain.*milestone|milestone.*domain/i,
    'pitMmmTransformAdapter.ts to map MMM Domain to PIT milestone',
  );
  assertSourceContains(
    paths.mmmTransformAdapter,
    /mps.*deliverable|deliverable.*mps/i,
    'pitMmmTransformAdapter.ts to map MMM MPS to PIT deliverable',
  );
  assertSourceContains(
    paths.mmmTransformAdapter,
    /criterion.*task|task.*criterion/i,
    'pitMmmTransformAdapter.ts to map MMM Criterion to one or more PIT tasks',
  );
});

test('PIT-RED-W83-031: editing a generated task does not alter the immutable MMM source lineage fields', () => {
  assertFileExists(
    paths.mmmTransformAdapter,
    'pitMmmTransformAdapter.ts — immutable source lineage protection',
  );
  assert.match(
    migrations,
    /source_id|source_type|source_version|transform_version|lineage/i,
    'W8.3 hierarchy tables must store immutable MMM source lineage fields (source_id, source_type, source_version, transform_version); absent from migrations',
  );
  assert.match(
    migrations,
    /source_id.*GENERATED|source_id.*immutable|update.*lineage.*deny|lineage.*NOT.*update/i,
    'W8.3 requires that source lineage fields are protected from update; immutability enforcement absent from migrations',
  );
});

// ─── GROUP 10: AIMC proposal-only behaviour and consent governance (032–034) ─
//
// These tests prove that AI suggestions are stored as proposals only
// and that preference memory requires explicit opt-in consent.
// Expected RED reason: AIMC suggestion service and preference panel absent.

test('PIT-RED-W83-032: Maturion suggestion request routes through AIMC and returns a proposal; no canonical hierarchy write occurs without human approval', () => {
  assertFileExists(
    paths.aimcSuggestionService,
    'pitAimcSuggestionService.ts — AIMC-routed suggestion with proposal storage and no canonical write before approval',
  );
  assertSourceContains(
    paths.aimcSuggestionService,
    /\/api\/ai\/request|aimc|proposal/i,
    'pitAimcSuggestionService.ts must route through AIMC (/api/ai/request) and store result as proposal, not canonical record',
  );
  assertSourceContains(
    paths.aimcSuggestionService,
    /proposal|draft|pending.*approval|await.*approval/i,
    'pitAimcSuggestionService.ts must store AI output as a proposal pending human approval — direct canonical write absent',
  );
});

test('PIT-RED-W83-033: declining preference learning after accepting a suggestion creates no preference-memory record', () => {
  assertFileExists(
    paths.aimcSuggestionService,
    'pitAimcSuggestionService.ts — consent-governed preference learning path',
  );
  assertSourceContains(
    paths.aimcSuggestionService,
    /consent|opt.in|decline|no.*memory|preference/i,
    'pitAimcSuggestionService.ts must implement consent-governed preference learning — decline path must not write a memory record',
  );
});

test('PIT-RED-W83-034: authorised user can inspect and delete their stored PIT preference record; preference is isolated to their scope', () => {
  assertFileExists(
    paths.preferencePanel,
    'AimcPreferencePanel.tsx — preference inspection and deletion UI for authorised scope',
  );
  assert.match(
    migrations,
    /pit_preferences|pit_ai_preferences|preference.*record|preference.*isolated/i,
    'W8.3 requires a pit_preferences table scoped to the authorised user; absent from migrations',
  );
  assert.match(
    migrations,
    /pit_preferences[\s\S]{0,1000}user_id|user_id[\s\S]{0,200}pit_preferences/i,
    'W8.3 pit_preferences table must be scoped by user_id; user scoping absent from migrations',
  );
});

// ─── GROUP 11: Shared evidence assurance (035) ───────────────────────────────
//
// This test proves that the evidence assurance plugin routes to the
// shared service and stores a proposal without automatic canonical
// progress update.
// Expected RED reason: evidence assurance plugin module absent.

test('PIT-RED-W83-035: evidence assurance sends context to the shared service and stores a proposal; no automatic canonical progress update occurs', () => {
  assertFileExists(
    paths.evidenceAssurancePlugin,
    'pitEvidenceAssurancePlugin.ts — shared evidence assurance routing with proposal storage and no automatic canonical progress',
  );
  assertSourceContains(
    paths.evidenceAssurancePlugin,
    /assurance|evidence|proposal|no.*canonical|pending.*approval/i,
    'pitEvidenceAssurancePlugin.ts must route to shared evidence assurance and store a proposal without writing canonical progress',
  );
  assertSourceContains(
    paths.evidenceAssurancePlugin,
    /human.*confirm|confirm.*human|manual.*gate|no.*auto/i,
    'pitEvidenceAssurancePlugin.ts must require human confirmation before canonical progress is updated',
  );
});

// ─── GROUP 12: No live Incident Workflow call in W8.3 (036) ──────────────────
//
// This test proves that W8.3 stores only the IWM reservation fields
// required to avoid future schema rupture and does not initiate any
// live Incident Workflow Management call.
// Expected RED reason: IWM reservation fields not present in migrations;
//   no IWM client module must exist in W8.3 scope.

test('PIT-RED-W83-036: W8.3 stores IWM reservation fields but makes no live Incident Workflow Management call', () => {
  // Reservation fields must be present in migrations once W8.3 is built
  assert.match(
    migrations,
    /iwms_reservation|iwm_reservation|incident_workflow.*id|iw.*reference/i,
    'W8.3 requires IWM reservation fields in the hierarchy schema (e.g. iwms_reservation_id) to avoid future schema rupture; absent from migrations',
  );
  // The live IWM client must NOT be present in W8.3 source
  const iwmClient = join(repo, 'apps/isms-portal/src/lib/pitIncidentWorkflowClient.ts');
  assert.ok(
    !existsSync(iwmClient),
    'pitIncidentWorkflowClient.ts must NOT exist in W8.3 — live IWM calls are reserved for a future wave; this file must only be created in the later wave',
  );
  // And App.tsx must not reference a live IWM endpoint
  assert.doesNotMatch(
    appTsx,
    /incident.*workflow.*call|iwm.*live|live.*iwm/i,
    'App.tsx must not contain live Incident Workflow Management call references in W8.3',
  );
});
