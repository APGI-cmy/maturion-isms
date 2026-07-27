# PIT W8.3 — Executable Inventory Map

## Authority

- QA builder appointment: `e18eb8c` (Issue #1974 / PR #1972)
- Parent pre-build: Issue #1968
- Contract source: `modules/pit/06-qa-to-red/w83-strategy-alignment-red-contract.md`
- Inventory date: 2026-07-27

## Executive summary

All 36 `PIT-RED-W83-001..036` test IDs defined in the approved contract now have
one-to-one executable coverage.  Test discovery runs two files:

```text
# 8 pre-build sentinels (route, workspace, migration, RPC existence proofs)
node --test modules/pit/06-qa-to-red/executable/pit-w83-prebuild.red.test.mjs

# 36 behavioural contract tests (hierarchy, RLS, wizards, dates, lifecycle,
# transfer, audit, MMM, AIMC, evidence, IWM reservation)
node --test modules/pit/06-qa-to-red/executable/pit-w83-red-contract.test.mjs
```

Both commands exit non-zero (intended RED).  No test in either file passes, no
ENOENT / SyntaxError / ERR_MODULE_NOT_FOUND / ReferenceError is raised.

## Sentinel file — pre-build route/schema/RPC existence proofs

File: `modules/pit/06-qa-to-red/executable/pit-w83-prebuild.red.test.mjs`

These tests confirm the broadest W8.3 implementation gaps (routes, workspaces,
migrations, atomic approval RPC) and are preserved from the original baseline.

| Sentinel ID | Test name | Missing capability named |
|---|---|---|
| PIT-RED-W83-SENTINEL-001 | milestone route is registered | Missing milestone route |
| PIT-RED-W83-SENTINEL-002 | deliverable route is registered | Missing deliverable route |
| PIT-RED-W83-SENTINEL-003 | task route is registered | Missing task route |
| PIT-RED-W83-SENTINEL-004 | project settings route is registered | Missing project settings route |
| PIT-RED-W83-SENTINEL-005 | hierarchy workspaces exist | Missing milestone/deliverable/task workspace |
| PIT-RED-W83-SENTINEL-006 | Supabase hierarchy migration exists | Missing W8.3 hierarchy migration |
| PIT-RED-W83-SENTINEL-007 | structural-change approval migration exists | Missing structural-change request and approval migration |
| PIT-RED-W83-SENTINEL-008 | atomic transfer/cancel RPC is specified | Missing atomic project-leader approval RPC |

## Contract inventory — PIT-RED-W83-001..036

File: `modules/pit/06-qa-to-red/executable/pit-w83-red-contract.test.mjs`

| Contract ID | FR | Scenario | Test class | Expected GREEN behaviour | Current RED reason |
|---|---|---|---|---|---|
| PIT-RED-W83-001 | FR-124 | Create task without deliverable | Migration/contract | pit_create_task RPC with NOT NULL deliverable_id | pit_create_task migration absent |
| PIT-RED-W83-002 | FR-124 | Create deliverable without milestone | Migration/contract | pit_create_deliverable RPC with NOT NULL milestone_id | pit_create_deliverable migration absent |
| PIT-RED-W83-003 | FR-124 | Create milestone without project | Migration/contract | pit_create_milestone RPC with NOT NULL project_id | pit_create_milestone migration absent |
| PIT-RED-W83-004 | FR-125 | Bind child to parent in another project | Migration/contract | Same-project validation in hierarchy RPCs | Cross-project check absent from migrations |
| PIT-RED-W83-005 | FR-125 | Cross-tenant parent reference | Migration/contract | org_id on hierarchy tables for RLS isolation | pit_milestones/deliverables/tasks tables absent |
| PIT-RED-W83-006 | FR-127 | Viewer attempts hierarchy mutation | Migration/contract | Viewer explicitly excluded in RLS | Hierarchy RLS viewer-denial policy absent |
| PIT-RED-W83-007 | FR-127 | Milestone owner edits sibling milestone | Unit/contract | pitHierarchyService.ts — sibling-scope denial | pitHierarchyService.ts absent |
| PIT-RED-W83-008 | FR-127 | Deliverable owner edits sibling | Unit/contract | pitDeliverableRepository.ts — sibling denial | pitDeliverableRepository.ts absent |
| PIT-RED-W83-009 | FR-127 | Task owner changes parent structure | Unit/contract | pitTaskRepository.ts + pit_update_task RPC | pitTaskRepository.ts and migration absent |
| PIT-RED-W83-010 | FR-128 | Project leader opens milestone wizard | Component/contract | MilestoneSetupWizard.tsx with five states | MilestoneSetupWizard.tsx absent |
| PIT-RED-W83-011 | FR-128 | Milestone owner opens deliverable wizard | Component/contract | DeliverableSetupWizard.tsx scoped to milestone | DeliverableSetupWizard.tsx absent |
| PIT-RED-W83-012 | FR-128 | Deliverable owner opens task wizard | Component/contract | TaskSetupWizard.tsx with mandatory deliverable parent | TaskSetupWizard.tsx absent |
| PIT-RED-W83-013 | FR-129 | Preview milestone-owner invitation | Component/contract | MilestoneOwnerInvitePreview.tsx — accountability/timeline content | MilestoneOwnerInvitePreview.tsx absent |
| PIT-RED-W83-014 | FR-130 | Accept invite as new user | Component/contract | HierarchyInviteAcceptance.tsx + route in App.tsx | Component and route absent |
| PIT-RED-W83-015 | FR-131 | Submit end before start | Unit/contract | pitDateExceptionService.ts end-before-start rejection | pitDateExceptionService.ts absent |
| PIT-RED-W83-016 | FR-132 | Child outside parent range without confirmation | Unit/contract | pitDateExceptionService.ts parent-range confirmation requirement | pitDateExceptionService.ts absent |
| PIT-RED-W83-017 | FR-132 | Confirm date exception | Migration/contract | pit_date_exceptions table with rationale/actor/timestamp | Migration absent |
| PIT-RED-W83-018 | FR-133 | Normal user opens removal menu | Component/contract | HierarchyLifecycleActions.tsx Archive/Cancel/Restore, no Delete | HierarchyLifecycleActions.tsx absent |
| PIT-RED-W83-019 | FR-134 | Cancel milestone with incomplete descendants | Component+migration | CancellationDescendantGuard.tsx + pit_cancellation_preflight RPC | Guard and migration absent |
| PIT-RED-W83-020 | FR-134 | Cancel deliverable with incomplete tasks | Component/contract | CancellationDescendantGuard.tsx — deliverable-level guard | Guard absent |
| PIT-RED-W83-021 | FR-135 | Submit proposal without target for each child | Unit/contract | pitStructuralChangeService.ts — every-child-has-target validation | Service absent |
| PIT-RED-W83-022 | FR-135 | Select cancelled/cross-project target | Unit/contract | pitStructuralChangeService.ts — target validity rejection | Service absent |
| PIT-RED-W83-023 | FR-136 | Non-project-leader approves proposal | Migration/contract | pit_approve_structural_change RPC with project-leader role check | Migration absent |
| PIT-RED-W83-024 | FR-137 | Approve valid multi-child transfer | Migration/contract | pit_approve_structural_change with atomic transaction | Migration absent |
| PIT-RED-W83-025 | FR-137 | Force failure during second child move | Migration/contract | pit_approve_structural_change EXCEPTION/ROLLBACK handling | EXCEPTION block absent |
| PIT-RED-W83-026 | FR-137 | Approve stale proposal after hierarchy changed | Migration/contract | pit_approve_structural_change version check | Version check absent |
| PIT-RED-W83-027 | FR-138 | Inspect successful transfer audit | Migration/contract | pit_structural_audit table with all required columns | Audit table absent |
| PIT-RED-W83-028 | FR-138 | Application role attempts audit update/delete | Migration/contract | pit_structural_audit RLS (append-only) | Audit RLS absent |
| PIT-RED-W83-029 | FR-139 | Direct attempt — active child under cancelled parent | Migration/contract | Constraint/trigger on hierarchy tables | Constraint absent |
| PIT-RED-W83-030 | FR-140..142 | Transform MMM package | Unit/contract | pitMmmTransformAdapter.ts — Domain/MPS/Criterion mapping | Adapter absent |
| PIT-RED-W83-031 | FR-141 | Edit generated task wording | Unit+migration | Source lineage fields + immutability in migrations | Lineage fields absent |
| PIT-RED-W83-032 | FR-143..144 | Request Maturion suggestions | Unit/contract | pitAimcSuggestionService.ts AIMC-routed with proposal storage | Service absent |
| PIT-RED-W83-033 | FR-145..146 | Edit suggestion and decline learning | Unit/contract | pitAimcSuggestionService.ts — no memory record on decline | Service absent |
| PIT-RED-W83-034 | FR-145..146 | Opt in then inspect/delete preference | Component+migration | AimcPreferencePanel.tsx + pit_preferences table scoped by user | Panel and migration absent |
| PIT-RED-W83-035 | FR-148..150 | Evaluate evidence | Unit/contract | pitEvidenceAssurancePlugin.ts — shared service with no auto-progress | Plugin absent |
| PIT-RED-W83-036 | FR-151 | W8.3 task creation — IWM reservation | Migration+contract | IWM reservation fields present; no pitIncidentWorkflowClient.ts | IWM reservation fields absent |

## Fixtures

File: `modules/pit/06-qa-to-red/executable/pit-w83-fixtures.mjs`

Provides the following exported constants consumed by the test files and
documented for the implementation builder:

- **Actor identities**: UNAUTHENTICATED, VIEWER, CONTRIBUTOR, MILESTONE_OWNER,
  DELIVERABLE_OWNER, TASK_OWNER, PROJECT_LEADER, CROSS_TENANT_ACTOR,
  SIBLING_MILESTONE_OWNER
- **Organisations**: ORG_A (owning), ORG_B (cross-tenant)
- **Projects**: PROJECT_ALPHA, PROJECT_BETA (same org, different projects)
- **Milestones**: MILESTONE_A1 (owned), MILESTONE_A2 (sibling), MILESTONE_BETA_PROJECT (cross-project)
- **Deliverables**: DELIVERABLE_A1_D1
- **Tasks**: TASK_D1_T1
- **Structural-change proposals**: TRANSFER_PROPOSAL_VALID, TRANSFER_PROPOSAL_STALE,
  TRANSFER_PROPOSAL_INVALID_TARGET
- **MMM source**: MMM_IMPLEMENTATION_PACKAGE (domain/MPS/criteria)
- **Date scenarios**: DATE_ORDER_VIOLATION, PARENT_RANGE_EXCEPTION
- **AIMC scenario**: AIMC_SUGGESTION_REQUEST, AIMC_SUGGESTION_RESPONSE_DRAFT
- **Evidence assurance**: EVIDENCE_ASSURANCE_REQUEST

## Harness validation summary

All tests in `pit-w83-red-contract.test.mjs`:

- Run under `node --test` (Node.js native test runner)
- Produce 36 failures, 0 passes
- Contain no ENOENT, SyntaxError, ERR_MODULE_NOT_FOUND or ReferenceError
- Name the missing W8.3 capability in every failure message
- Do not use live Supabase connections or browser automation

All tests in `pit-w83-prebuild.red.test.mjs`:

- Produce 8 failures, 0 passes
- Preserved and unmodified from the frozen baseline

## Negative-path evidence coverage

| Negative-path requirement | Covered by test(s) |
|---|---|
| Anonymous access denied without data leakage | SENTINEL-006, W83-005 (RLS org_id isolation) |
| Cross-tenant actor receives zero records | W83-005 (org_id FK isolation) |
| Viewer mutation denied — UI and backend | W83-006 (RLS viewer denial) |
| Contextual owner cannot mutate sibling scope | W83-007 (milestone), W83-008 (deliverable), W83-009 (task) |
| Project-leader approval required for structural transfer | W83-023 |
| Stale/concurrent proposals fail without partial mutation | W83-026 |
| Audit and lineage fields cannot be changed by application roles | W83-028 (audit RLS), W83-031 (lineage immutability) |
| AIMC outage leaves manual paths intact | W83-032 (proposal-only, not canonical) |
| Evidence service unavailable leaves result pending | W83-035 (no auto-progress) |

## Implementation builder guidance

When turning each test GREEN, the implementation builder must:

1. Create migrations for `pit_milestones`, `pit_deliverables`, `pit_tasks`,
   `pit_date_exceptions`, `pit_structural_audit`, `pit_preferences` and
   `pit_hierarchy_change_requests` tables.
2. Create RPCs: `pit_create_milestone`, `pit_create_deliverable`, `pit_create_task`,
   `pit_update_task`, `pit_cancellation_preflight`, `pit_approve_structural_change`.
3. Create service modules: `pitHierarchyService.ts`, `pitMilestoneRepository.ts`,
   `pitDeliverableRepository.ts`, `pitTaskRepository.ts`,
   `pitStructuralChangeService.ts`, `pitDateExceptionService.ts`,
   `pitHierarchyLifecycle.ts`, `pitMmmTransformAdapter.ts`,
   `pitAimcSuggestionService.ts`, `pitEvidenceAssurancePlugin.ts`.
4. Create page components: `MilestoneSetupWizard.tsx`, `DeliverableSetupWizard.tsx`,
   `TaskSetupWizard.tsx`, `MilestoneOwnerInvitePreview.tsx`,
   `HierarchyInviteAcceptance.tsx`, `HierarchyLifecycleActions.tsx`,
   `CancellationDescendantGuard.tsx`, `TransferProposalForm.tsx`,
   `StructuralChangeApproval.tsx`, `MmmTransformWizard.tsx`,
   `AimcSuggestionPanel.tsx`, `AimcPreferencePanel.tsx`, `EvidenceAssurancePanel.tsx`.
5. Register all new routes in `App.tsx` and `pitRoutes.ts`.
6. Do NOT create `pitIncidentWorkflowClient.ts` in W8.3 (reserved for a future wave).

## Exit criteria status

| Criterion | Status |
|---|---|
| All 36 RED cases exist or have explicit one-to-one executable mapping | ✅ SATISFIED |
| Test discovery proves complete inventory collected | ✅ SATISFIED (36 tests in contract file) |
| Tests run and fail for intended missing capability only | ✅ SATISFIED (no harness errors) |
| Harness/fixture failures are zero | ✅ SATISFIED |
| Existing regression remains GREEN | PENDING — run regression suite |
| Raw RED logs retained | PENDING — CI run |
| Foreman QP and ECAP updated | PENDING |
| New frozen head submitted to IAA | PENDING |
