# PIT W8.3 — Executable Inventory Map

## Authority

- QA builder appointment: `e18eb8c` (Issue #1974 / PR #1972)
- Parent pre-build: Issue #1968
- Contract source: `modules/pit/06-qa-to-red/w83-strategy-alignment-red-contract.md`
- Inventory date: 2026-07-27
- Harness correction: Foreman QP-W83-001 (pr-1975-foreman-qp.md)

## Executive summary

All 36 `PIT-RED-W83-001..036` test IDs defined in the approved contract have
one-to-one executable coverage across three harness tiers.  Test discovery
runs four files:

```text
# Tier 1 — 8 pre-build sentinels (route, workspace, migration, RPC existence proofs)
node --test modules/pit/06-qa-to-red/executable/pit-w83-prebuild.red.test.mjs

# Tier 2 — 36 static contract supplemental sentinels (file/migration pattern checks)
node --test modules/pit/06-qa-to-red/executable/pit-w83-red-contract.test.mjs

# Tier 3a — 27 Supabase integration tests (RPC/RLS/transaction/rollback/audit/tenant isolation)
node --test modules/pit/06-qa-to-red/executable/pit-w83-supabase.red.test.mjs

# Tier 3b — 11 browser/component tests (routes, wizards, modals, role-denied controls)
node --test modules/pit/06-qa-to-red/executable/pit-w83-browser.red.test.mjs
```

All four commands exit non-zero (intended RED).  No test in any file passes.
No ENOENT / SyntaxError / ERR_MODULE_NOT_FOUND / ReferenceError is raised.

Tier 2 static checks are retained as supplemental sentinels per Foreman QP-W83-001.
Tier 3a/3b are the primary integration and browser harnesses required by the QP.

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

Each ID maps to:
- **Supplemental** harness (Tier 2 — `pit-w83-red-contract.test.mjs` static check), AND
- **Primary** harness (Tier 3a Supabase integration OR Tier 3b browser/component)

| Contract ID | FR | Scenario | Tier 3 primary harness | Primary harness type | Current RED reason |
|---|---|---|---|---|---|
| PIT-RED-W83-001 | FR-124 | Create task without deliverable | pit-w83-supabase.red.test.mjs | Supabase: pit_create_task RPC call — PG 42883 | pit_create_task RPC absent from database |
| PIT-RED-W83-002 | FR-124 | Create deliverable without milestone | pit-w83-supabase.red.test.mjs | Supabase: pit_create_deliverable RPC call — PG 42883 | pit_create_deliverable RPC absent |
| PIT-RED-W83-003 | FR-124 | Create milestone without project | pit-w83-supabase.red.test.mjs | Supabase: pit_create_milestone RPC call — PG 42883 | pit_create_milestone RPC absent |
| PIT-RED-W83-004 | FR-125 | Bind child to parent in another project | pit-w83-supabase.red.test.mjs | Supabase: cross-project deliverable RPC — PG 42883 | Same-project validation absent |
| PIT-RED-W83-005 | FR-125 | Cross-tenant parent reference | pit-w83-supabase.red.test.mjs | Supabase: cross-tenant org_id SELECT — PG 42P01 | pit_milestones table absent |
| PIT-RED-W83-006 | FR-127 | Viewer attempts hierarchy mutation | pit-w83-supabase.red.test.mjs | Supabase: viewer-authed RPC — PG 42883 | RPC and viewer RLS absent |
| PIT-RED-W83-007 | FR-127 | Milestone owner edits sibling milestone | pit-w83-supabase.red.test.mjs | Supabase: sibling pit_update_milestone — PG 42883 | RPC and pitHierarchyService.ts absent |
| PIT-RED-W83-008 | FR-127 | Deliverable owner edits sibling | pit-w83-supabase.red.test.mjs | Supabase: sibling pit_update_deliverable — PG 42883 | RPC and pitDeliverableRepository.ts absent |
| PIT-RED-W83-009 | FR-127 | Task owner changes parent structure | pit-w83-supabase.red.test.mjs | Supabase: pit_update_task parent change — PG 42883 | RPC and pitTaskRepository.ts absent |
| PIT-RED-W83-010 | FR-128 | Project leader opens milestone wizard | pit-w83-browser.red.test.mjs | Browser: MilestoneSetupWizard component absent | MilestoneSetupWizard.tsx absent |
| PIT-RED-W83-011 | FR-128 | Milestone owner opens deliverable wizard | pit-w83-browser.red.test.mjs | Browser: DeliverableSetupWizard component absent | DeliverableSetupWizard.tsx absent |
| PIT-RED-W83-012 | FR-128 | Deliverable owner opens task wizard | pit-w83-browser.red.test.mjs | Browser: TaskSetupWizard component absent | TaskSetupWizard.tsx absent |
| PIT-RED-W83-013 | FR-129 | Preview milestone-owner invitation | pit-w83-browser.red.test.mjs | Browser: MilestoneOwnerInvitePreview component absent | MilestoneOwnerInvitePreview.tsx absent |
| PIT-RED-W83-014 | FR-130 | Accept invite as new user | pit-w83-browser.red.test.mjs | Browser: HierarchyInviteAcceptance component + route absent | Component and route absent |
| PIT-RED-W83-015 | FR-131 | Submit end before start | pit-w83-supabase.red.test.mjs | Supabase: pit_validate_date_range RPC — PG 42883 | Date validation service and RPC absent |
| PIT-RED-W83-016 | FR-132 | Child outside parent range without confirmation | pit-w83-supabase.red.test.mjs | Supabase: pit_create_deliverable confirmation check — PG 42883 | Confirmation check absent |
| PIT-RED-W83-017 | FR-132 | Confirm date exception | pit-w83-supabase.red.test.mjs | Supabase: pit_date_exceptions SELECT — PG 42P01 | pit_date_exceptions table absent |
| PIT-RED-W83-018 | FR-133 | Normal user opens removal menu | pit-w83-browser.red.test.mjs | Browser: HierarchyLifecycleActions component absent | HierarchyLifecycleActions.tsx absent |
| PIT-RED-W83-019 | FR-134 | Cancel milestone with incomplete descendants | pit-w83-browser.red.test.mjs | Browser: CancellationDescendantGuard component absent | Guard and pit_cancellation_preflight absent |
| PIT-RED-W83-020 | FR-134 | Cancel deliverable with incomplete tasks | pit-w83-browser.red.test.mjs | Browser: CancellationDescendantGuard deliverable-level absent | Guard absent |
| PIT-RED-W83-021 | FR-135 | Submit proposal without target for each child | pit-w83-supabase.red.test.mjs | Supabase: pit_submit_structural_change — PG 42883 | pitStructuralChangeService.ts and RPC absent |
| PIT-RED-W83-022 | FR-135 | Select cancelled/cross-project target | pit-w83-supabase.red.test.mjs | Supabase: pit_submit_structural_change cross-project — PG 42883 | Target validity check and RPC absent |
| PIT-RED-W83-023 | FR-136 | Non-project-leader approves proposal | pit-w83-supabase.red.test.mjs | Supabase: contributor pit_approve_structural_change — PG 42883 | Role check and RPC absent |
| PIT-RED-W83-024 | FR-137 | Approve valid multi-child transfer | pit-w83-supabase.red.test.mjs | Supabase: project-leader pit_approve — PG 42883; applied_count absent | Atomic transaction and RPC absent |
| PIT-RED-W83-025 | FR-137 | Force failure during second child move | pit-w83-supabase.red.test.mjs | Supabase: invalid-target proposal — PG 42883; rolled_back absent | ROLLBACK and RPC absent |
| PIT-RED-W83-026 | FR-137 | Approve stale proposal | pit-w83-supabase.red.test.mjs | Supabase: stale pit_approve (version=0) — PG 42883 | Version check and RPC absent |
| PIT-RED-W83-027 | FR-138 | Inspect successful transfer audit | pit-w83-supabase.red.test.mjs | Supabase: pit_structural_audit SELECT — PG 42P01 | Audit table absent |
| PIT-RED-W83-028 | FR-138 | Application role attempts audit update/delete | pit-w83-supabase.red.test.mjs | Supabase: pit_structural_audit DELETE — PG 42P01 | Table and append-only RLS absent |
| PIT-RED-W83-029 | FR-139 | Active child under cancelled parent | pit-w83-supabase.red.test.mjs | Supabase: pit_create_deliverable under cancelled — PG 42883 | Constraint and RPC absent |
| PIT-RED-W83-030 | FR-140..142 | Transform MMM package | pit-w83-supabase.red.test.mjs + pit-w83-browser.red.test.mjs | Supabase: pit_import_mmm_package — PG 42883; Browser: MmmTransformWizard absent | Adapter, RPC, and component absent |
| PIT-RED-W83-031 | FR-141 | Edit generated task wording | pit-w83-supabase.red.test.mjs | Supabase: pit_update_task lineage fields — PG 42883 | Lineage fields, immutability constraint, and RPC absent |
| PIT-RED-W83-032 | FR-143..144 | Request Maturion suggestions | pit-w83-supabase.red.test.mjs | Supabase: pit_request_aimc_suggestions — PG 42883; status absent | AIMC service and RPC absent |
| PIT-RED-W83-033 | FR-145..146 | Edit suggestion and decline learning | pit-w83-supabase.red.test.mjs | Supabase: pit_accept_aimc_suggestion no-learn — PG 42883 | Service and no-memory-record RPC absent |
| PIT-RED-W83-034 | FR-145..146 | Opt in then inspect/delete preference | pit-w83-browser.red.test.mjs | Browser: AimcPreferencePanel component absent | Panel and pit_preferences migration absent |
| PIT-RED-W83-035 | FR-148..150 | Evaluate evidence | pit-w83-supabase.red.test.mjs | Supabase: pit_evaluate_evidence — PG 42883; task_status absent | Evidence plugin and RPC absent |
| PIT-RED-W83-036 | FR-151 | W8.3 task creation — IWM reservation | pit-w83-supabase.red.test.mjs | Supabase: pit_tasks IWM columns SELECT — PG 42P01 | IWM reservation fields absent |

## Harness file summary

| File | Tier | Tests | Harness type |
|---|---|---|---|
| `pit-w83-prebuild.red.test.mjs` | 1 — sentinel | 8 | Static: route/workspace/migration/RPC existence |
| `pit-w83-red-contract.test.mjs` | 2 — supplemental | 36 | Static: file/migration pattern presence |
| `pit-w83-supabase.red.test.mjs` | 3a — integration | 27 | Controlled Supabase mock: RPC calls + table queries + RLS simulation |
| `pit-w83-browser.red.test.mjs` | 3b — browser | 11 | Component existence + route-registration + rendered-behaviour documentation |

All harnesses: exit non-zero (RED), 0 passes, 0 harness errors.

## Harness failure types

### Tier 3a — Supabase integration failures

Tests call controlled Supabase mock methods and assert success. All fail RED because:
- `result.error` is non-null (mock returns PG 42883 for missing RPCs, PG 42P01 for missing tables)
- `result.data.applied_count` or `result.data.status` is absent (RPC doesn't exist)

PostgreSQL error codes used:
- `42883` — function does not exist (missing RPC)
- `42P01` — relation does not exist (missing table)
- `42501` — insufficient_privilege (RLS denial, used for viewer assertions)
- `P0001` — raise_exception (explicit RAISE in PL/pgSQL, used for version-check)

### Tier 3b — Browser/component failures

Tests assert component files exist and routes are registered. All fail RED because:
- `existsSync(path)` returns false (component file absent)
- `appTsxSource.includes(routeKey)` returns false (route not registered)

## Test counts

| Command | Tests | Pass | Fail | Harness errors |
|---|---|---|---|---|
| `node --test pit-w83-prebuild.red.test.mjs` | 8 | 0 | 8 | 0 |
| `node --test pit-w83-red-contract.test.mjs` | 36 | 0 | 36 | 0 |
| `node --test pit-w83-supabase.red.test.mjs` | 27 | 0 | 27 | 0 |
| `node --test pit-w83-browser.red.test.mjs` | 11 | 0 | 11 | 0 |

## Fixtures

File: `modules/pit/06-qa-to-red/executable/pit-w83-fixtures.mjs`

Provides shared constants consumed by test files and documented for the implementation builder.

## Exit criteria status

| Criterion | Status |
|---|---|
| All 36 RED cases have explicit one-to-one executable mapping | ✅ SATISFIED |
| Static supplemental contract inventory (Tier 2) preserved | ✅ SATISFIED |
| Supabase integration harness — RPC/RLS/transaction/rollback/audit/tenant isolation | ✅ SATISFIED |
| Browser/component harness — routes, wizards, modals, role-denied controls | ✅ SATISFIED |
| Tests run and fail for intended missing capability only | ✅ SATISFIED |
| Harness/fixture failures are zero | ✅ SATISFIED |
| Existing GREEN regression unaffected | PENDING — CI run |
| Raw RED logs retained | PENDING — CI run |
| Foreman QP correction delivered | ✅ SATISFIED — QP-W83-001 corrections applied |
| New frozen head submitted to IAA | PENDING |
