# Builder Appointment — PIT W8.3 Executable QA-to-RED Completion

## Appointment identity

- Governing QA issue: `#1974`
- Parent pre-build issue: `#1968`
- Carrier pull request: `#1972`
- Module: PIT
- Wave: Stage 12 / W8.3 QA-to-RED completion
- Appointed role: `qa-builder`
- Appointing authority: Foreman acting under explicit CS2 instruction
- CS2 Authority: Johan Ras
- Prior frozen assurance baseline: `7857fda531b9d455481f58afa96eb1d604e7e502`
- Prior IAA disposition: `FAIL — PRE-BUILD CORRECTION REQUIRED; IMPLEMENTATION BUILDER APPOINTMENT NO-GO`

## Appointment decision

The QA Builder is formally appointed to complete the executable failure-first QA inventory for the approved W8.3 build contract.

This appointment authorises QA implementation only. It does not authorise W8.3 product runtime, schema, deployment or build-to-GREEN implementation.

## Authorised job

The QA Builder shall:

1. Convert the full `PIT-RED-W83-001..036` catalogue into executable tests or explicit one-to-one executable mappings.
2. Preserve and, where necessary, refine the existing eight sentinels without weakening their assertions.
3. Create bounded test fixtures and harness plumbing for:
   - unauthenticated actors;
   - viewer, contributor, contextual owner and project leader roles;
   - cross-tenant actors;
   - organisations, projects, milestones, deliverables and tasks;
   - cancellation and structural-change proposals;
   - MMM source hierarchy and immutable lineage;
   - AIMC proposal and consent states;
   - shared evidence-assurance and future Incident Workflow reservation boundaries.
4. Provide the correct test class for each contract:
   - unit/contract tests for deterministic mapping and invariant definitions;
   - isolated Supabase integration specifications/harnesses for RLS, RPC, transaction, rollback, stale-proposal and audit paths;
   - browser specifications/harnesses for route, wizard, invitation, modal and role-denied states.
5. Ensure test discovery proves all 36 IDs are present exactly once or are transparently mapped where one executable scenario covers multiple layers.
6. Run the complete RED inventory and prove failures arise from missing product capabilities rather than broken fixtures, syntax, module resolution or unavailable test tooling.
7. Preserve raw RED logs, collected-test inventory and negative-path evidence.
8. Run existing regression evidence and preserve GREEN output.
9. Update Foreman QP and ECAP evidence with exact commands, results and changed-file boundary.
10. Hand over a new candidate frozen head for independent IAA.

## Mandatory behavioural coverage

The completed executable inventory must cover:

- strict Project → Milestone → Deliverable → Task parentage;
- no task without a deliverable;
- no cross-project or cross-organisation parent binding;
- anonymous, viewer, sibling-scope, parent-scope and cross-tenant denial;
- guided milestone, deliverable and task setup states;
- invitation accountability preview and acceptance boundary;
- invalid date order and confirmed parent-range exception;
- Archive/Cancel/Restore vocabulary and no normal-user Delete;
- cancellation blocked where incomplete descendants exist;
- complete target mapping for each continuing child;
- invalid, cancelled and cross-project transfer targets denied;
- project-leader-only structural approval;
- stale/concurrent proposal rejection;
- atomic re-parenting and cancellation;
- forced mid-transaction rollback;
- append-only structural audit and denied audit mutation;
- prevention of active descendants under cancelled parents;
- MMM Domain → Milestone, MPS → Deliverable and Criterion → one-or-more Tasks mapping;
- immutable source lineage following user edits;
- AIMC proposal-only behaviour before human approval;
- no preference-memory write when consent is declined;
- authorised preference inspection/correction/deletion boundary;
- shared MMM-derived evidence assurance with no automatic canonical progress;
- no live Incident Workflow call during W8.3.

## Prohibited work

The QA Builder shall not:

- implement hierarchy product functionality;
- create production-ready hierarchy tables, RPCs, UI workspaces or routes to make tests GREEN;
- alter any live Supabase project;
- deploy migrations or RLS policies;
- change Vercel, Render or production environment configuration;
- weaken tenant isolation, authorisation, audit, lineage, atomicity or human-control assertions;
- replace server-side negative-path requirements with frontend-only checks;
- use mocks to claim RLS, transaction or cross-tenant proof;
- mark an intended RED test GREEN without product implementation;
- remove or rename approved test IDs in a way that breaks traceability;
- appoint or act as the W8.3 implementation builder;
- merge PR #1972;
- close Issue #1968 or claim PIT/Stage 12 completion.

## Required working sequence

1. Load Issue #1974, Issue #1968 and the full PR #1972 pre-build authority chain.
2. Reconcile all 36 test IDs against FRS, TRS, architecture and PBFAG.
3. Publish the executable inventory map before writing test bodies.
4. Implement fixtures and harness foundations in a distinct commit.
5. Implement executable RED tests in one or more bounded commits.
6. Run test discovery and complete RED execution.
7. Correct harness defects only; do not implement product capability.
8. Run existing regression suite.
9. Publish exact RED and GREEN evidence.
10. Update QP/ECAP and return to Foreman.
11. Freeze the resulting head.
12. Obtain independent IAA before any implementation-builder appointment.

## Handover requirements

The QA Builder must report:

- exact changed files;
- exact test-ID-to-file mapping;
- exact commands used;
- number of tests collected;
- expected and observed failures for each test group;
- confirmation that harness/fixture failures are zero;
- existing regression results;
- artifact/run identifiers for retained evidence;
- explicit confirmation that no product runtime, schema deployment or infrastructure mutation occurred;
- residual gaps or environmental blockers, if any.

## Exit gate

The QA Builder job is complete only when:

- all 36 RED cases are executable and discoverable;
- all currently fail for the intended missing product capability;
- no harness or fixture defect remains;
- existing regression remains GREEN;
- evidence is retained and traceable;
- Foreman QP and ECAP pass;
- a new frozen head is independently assured;
- IAA returns `PASS — W8.3 IMPLEMENTATION BUILDER APPOINTMENT MAY BE PROPOSED`.

## Current disposition

`QA BUILDER APPOINTED — EXECUTABLE QA-TO-RED COMPLETION AUTHORISED — PRODUCT IMPLEMENTATION REMAINS NO-GO`

Approved by AI-assisted CS2 proxy evaluator for Johan Ras. CS2 Authority: Johan Ras.
