# PIT Architecture Addendum — W8.3 Strategy Alignment

## 1. Bounded-context model

PIT owns execution hierarchy, responsibility, lifecycle, schedule fields, progress inputs and evidence linkage. MMM owns maturity-framework truth and the reusable maturity evidence-assurance capability. AIMC owns governed AI routing. Incident Workflow Management owns workflow execution after an approved future handoff.

## 2. Core aggregates

### Project aggregate

Owns project purpose, description, dates, project leader, organisation binding, source link and hierarchy policy.

### Milestone aggregate

Belongs to one project. Owns planned dates, status, milestone owner and child deliverables.

### Deliverable aggregate

Belongs to one milestone. Owns planned dates, status, deliverable owner and child tasks.

### Task aggregate

Belongs to one deliverable. Owns executable statement, acceptance/evidence criteria, planned dates, status, task owner and integration references.

### Hierarchy Change Request aggregate

Owns proposed transfer plan, rationale, source cancellation, approval state, version and immutable decision history.

## 3. Invariants

1. No hierarchy record crosses organisation boundaries.
2. No child crosses project boundaries.
3. A task cannot exist without a deliverable.
4. A deliverable cannot exist without a milestone.
5. A milestone cannot exist without a project.
6. `end_at` cannot precede `start_at`.
7. Parent-range exceptions require explicit confirmation metadata.
8. No active/incomplete descendant may remain under a cancelled parent.
9. Re-parenting cannot create cycles.
10. Approved transfer and cancellation are atomic.
11. Audit and source-lineage records are append-only/immutable.

## 4. RLS and authorisation matrix

| Actor | Read project | Project structure | Owned milestone subtree | Owned deliverable subtree | Owned task execution | Approve structural transfer |
|---|---|---|---|---|---|---|
| viewer | yes | no | no | no | no | no |
| contributor | yes | no | no | no | assigned-task fields only in W8.4 | no |
| team_leader / contextual owner | yes | bounded | owned scope | owned scope | owned scope | no |
| project_manager / project leader | yes | yes | yes | yes | yes | yes |
| org_admin / cs2_admin | yes | governed admin | governed admin | governed admin | governed admin | policy dependent |

RLS must combine organisation membership with project membership and contextual ownership. Service-role bypass is never exposed to the browser.

## 5. Structural-change sequence

1. Requester calls cancellation preflight.
2. Service returns incomplete descendant list.
3. Requester submits a versioned transfer plan.
4. Project leader reviews current source/target state.
5. Approval RPC locks affected records, revalidates proposal, moves children and cancels source.
6. Audit events are written in the same transaction.
7. Failure rolls back all effects.

## 6. MMM transformation adapter

The adapter receives an approved MMM implementation package and creates a PIT proposal graph:

- project node from framework/programme;
- milestone nodes from Domains;
- deliverable nodes from MPSs;
- one-or-more task proposals from each Criterion.

The adapter may not alter MMM canonical identifiers. PIT stores source type, source id, source version and transformation version.

## 7. AI boundary

Hierarchy-generation requests pass from PIT to AIMC with bounded context. Returned objects are proposals stored outside canonical tables until human acceptance. No provider call originates directly from PIT.

## 8. Evidence assurance plugin

PIT sends evidence plus task/criterion context to a shared assurance interface. The interface returns completeness, relevance, sufficiency, confidence, gaps and proposed score/progress impact. Human confirmation remains the canonical decision gate.

## 9. Future Incident Workflow adapter

The future adapter shall use idempotent creation, mapped task/work-activity identity, explicit state ownership and signed evidence/status callbacks. W8.3 stores only the fields needed to avoid future schema rupture.

## 10. Failure containment

- stale proposal → reject with no change;
- missing target → reject with no change;
- cross-project target → reject with no change;
- concurrent child update → reject/retry with no partial change;
- audit write failure → complete transaction rollback;
- AIMC unavailable → manual hierarchy workflow remains available;
- shared evidence service unavailable → evidence remains submitted/pending; no fabricated score.
