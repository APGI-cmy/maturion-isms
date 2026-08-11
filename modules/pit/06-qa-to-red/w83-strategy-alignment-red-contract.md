# PIT W8.3 QA-to-RED Contract — Strategy Alignment

## Purpose

Define executable failure-first tests that represent the approved W8.3 build before implementation. These tests supplement and do not weaken the existing `PROJECT-001..016` and route RED baseline.

## RED status rule

A test is legitimately RED when the current runtime lacks the required route, schema, RPC, policy, state transition, approval workflow or rendered behaviour. A test must not be marked GREEN through mocks that bypass Supabase/RLS or by checking only file/string existence.

## Harness requirements

- Vitest/unit tests for pure invariants and mapping.
- Supabase integration tests against an isolated test project/schema for RPC, transaction and RLS behaviour.
- Playwright deployed-browser tests for route, wizard, role and modal behaviour.
- Network/HAR evidence for denied and atomic mutation paths.
- Database before/after snapshots for rollback and audit tests.
- Test identities: unauthenticated, viewer, contributor, contextual owner, project leader, org admin and cross-tenant actor.

## Test catalogue

| ID | Requirement | Scenario | Expected GREEN behaviour | Harness | Current expected state |
|---|---|---|---|---|---|
| PIT-RED-W83-001 | FR-124 | Create task without deliverable | Rejected; no row | Supabase integration | RED |
| PIT-RED-W83-002 | FR-124 | Create deliverable without milestone | Rejected; no row | Supabase integration | RED |
| PIT-RED-W83-003 | FR-124 | Create milestone without project | Rejected; no row | Supabase integration | RED |
| PIT-RED-W83-004 | FR-125 | Bind child to parent in another project | Rejected; no partial row | Supabase integration | RED |
| PIT-RED-W83-005 | FR-125 | Cross-tenant parent reference | Denied by RPC/RLS | Supabase integration | RED |
| PIT-RED-W83-006 | FR-127 | Viewer attempts hierarchy mutation | UI disabled and API denied | Playwright + integration | RED |
| PIT-RED-W83-007 | FR-127 | Milestone owner edits sibling milestone | Denied; sibling unchanged | Playwright + integration | RED |
| PIT-RED-W83-008 | FR-127 | Deliverable owner edits sibling deliverable | Denied; sibling unchanged | Playwright + integration | RED |
| PIT-RED-W83-009 | FR-127 | Task owner changes parent structure | Denied | Integration | RED |
| PIT-RED-W83-010 | FR-128 | Project leader opens milestone setup wizard | Wizard renders five states and saves valid draft | Playwright | RED |
| PIT-RED-W83-011 | FR-128 | Milestone owner opens deliverable wizard | Scoped wizard renders | Playwright | RED |
| PIT-RED-W83-012 | FR-128 | Deliverable owner opens task wizard | Task requires deliverable parent | Playwright | RED |
| PIT-RED-W83-013 | FR-129 | Preview milestone-owner invitation | Accountability, timeline and child-management duty shown | Playwright | RED |
| PIT-RED-W83-014 | FR-130 | Accept invite as new user | Signup/link-in and scoped access | Playwright E2E | RED |
| PIT-RED-W83-015 | FR-131 | Submit end before start | Hard validation; no write | Unit + integration | RED |
| PIT-RED-W83-016 | FR-132 | Child outside parent range without confirmation | Rejected with explicit warning | Playwright + integration | RED |
| PIT-RED-W83-017 | FR-132 | Confirm date exception | Saved with rationale/actor/time | Integration | RED |
| PIT-RED-W83-018 | FR-133 | Normal user opens removal menu | Archive/Cancel/Restore only; no Delete | Playwright | RED |
| PIT-RED-W83-019 | FR-134 | Cancel milestone with incomplete descendants | Blocked; hierarchy unchanged | Playwright + integration | RED |
| PIT-RED-W83-020 | FR-134 | Cancel deliverable with incomplete tasks | Blocked; hierarchy unchanged | Playwright + integration | RED |
| PIT-RED-W83-021 | FR-135 | Submit transfer proposal without target for each child | Rejected | Integration | RED |
| PIT-RED-W83-022 | FR-135 | Select cancelled/cross-project target | Rejected | Integration | RED |
| PIT-RED-W83-023 | FR-136 | Non-project-leader approves proposal | Denied | Integration | RED |
| PIT-RED-W83-024 | FR-137 | Approve valid multi-child transfer | All children moved and source cancelled in one transaction | Integration | RED |
| PIT-RED-W83-025 | FR-137 | Force failure during second child move | Entire transaction rolls back | Integration | RED |
| PIT-RED-W83-026 | FR-137 | Approve stale proposal after hierarchy changed | Rejected; no mutation | Integration | RED |
| PIT-RED-W83-027 | FR-138 | Inspect successful transfer audit | Request, decision, moves and cancellation recorded append-only | Integration | RED |
| PIT-RED-W83-028 | FR-138 | Application role attempts audit update/delete | Denied | RLS integration | RED |
| PIT-RED-W83-029 | FR-139 | Direct attempt to leave active child under cancelled parent | Constraint/RPC rejects | Integration | RED |
| PIT-RED-W83-030 | FR-140..142 | Transform MMM package | Domain→milestone, MPS→deliverable, criterion→1+ tasks | Contract test | RED |
| PIT-RED-W83-031 | FR-141 | Edit generated task wording | Source lineage remains immutable | Integration | RED |
| PIT-RED-W83-032 | FR-143..144 | Request Maturion suggestions | AIMC proposal only; no canonical write before approval | Contract + Playwright | RED |
| PIT-RED-W83-033 | FR-145..146 | Edit suggestion and decline learning | No memory record created | Integration | RED |
| PIT-RED-W83-034 | FR-145..146 | Opt in then inspect/delete preference | Isolated record visible/removable only to authorised scope | Integration + Playwright | RED |
| PIT-RED-W83-035 | FR-148..150 | Evaluate evidence | Shared service called; proposal stored; no automatic canonical progress | Contract integration | RED |
| PIT-RED-W83-036 | FR-151 | W8.3 task creation | Integration reservation fields persist but no live IWMS call occurs | Integration | RED |

## Route RED extensions

The following routes must be covered in all five UI states and role-denied paths:

- `/projects/:id` Implementation hierarchy;
- `/projects/:id/milestones`;
- `/projects/:id/deliverables`;
- `/projects/:id/tasks`;
- `/projects/:id/settings`;
- structural-change request/review surfaces under the project boundary.

## Required negative-path evidence

1. Anonymous access returns authentication redirect/401 without data leakage.
2. Cross-tenant actor receives zero records/403 and cannot infer record existence.
3. Viewer mutation controls are unavailable and backend denies crafted requests.
4. Contextual owner cannot mutate sibling or parent scope.
5. Project leader approval is required for structural transfer.
6. Stale/concurrent proposals fail without partial mutation.
7. Audit and lineage fields cannot be changed by application roles.
8. AIMC or evidence-service outage leaves manual/pending paths intact and never fabricates results.

## Existing RED baseline reconciliation

Existing tests `PIT-RED-PROJECT-001..016`, `PIT-RED-ROUTE-010`, `012..014`, `017` remain authoritative. The W83 series adds missing strategy/invariant coverage. No existing test may be deleted, softened, relabelled or marked GREEN without executable evidence.

## Exit condition

QA-to-RED is complete only when:

- test files are added to the executable test inventory;
- they fail for the intended missing capability, not harness errors;
- failure output names the unmet requirement;
- current runtime remains otherwise non-regressed;
- the implementation builder receives exact tests to build to GREEN.
