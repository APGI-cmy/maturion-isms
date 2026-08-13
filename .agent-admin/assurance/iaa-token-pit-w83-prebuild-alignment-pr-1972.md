# Independent Assurance Final Review — PIT W8.3 Pre-Build Alignment

## Identity

- Governing issue: `#1968`
- Pull request: `#1972`
- Module: PIT
- Wave: Stage 12 / W8.3 pre-build alignment
- CS2 Authority: Johan Ras
- Review basis: PR artifact chain plus workflow run `30249666564`
- Tested head: `906230fab6494cfcc641462a1ff699dab85f6f29`
- Review date: 2026-07-27

## Independence statement

This review evaluates the completed pre-build package against the filed IAA pre-brief. It does not merge the PR, appoint a builder, implement runtime code or substitute administrative ECAP evidence for assurance judgement.

## Assurance results

### Product and authority alignment

| Review question | Result |
|---|---|
| strict Project → Milestone → Deliverable → Task hierarchy | PASS |
| direct project-level tasks excluded from W8.3 | PASS |
| cancellation fails closed with incomplete descendants | PASS |
| project-leader-approved re-parenting | PASS |
| atomic transfer, cancellation and rollback contract | PASS |
| append-only structural audit contract | PASS |
| full-project visibility separated from subtree write scope | PASS |
| cascading accountability represented | PASS |
| deterministic date and exception rules | PASS |
| Archive/Cancel/Restore terminology | PASS |
| MMM → PIT transformation and immutable lineage | PASS |
| AIMC-only, human-controlled AI suggestions | PASS |
| explicit opt-in for preference learning | PASS |
| shared MMM-derived evidence assurance rather than duplication | PASS |
| later-wave boundaries preserved | PASS |
| no runtime/migration/deployment implementation in this PR | PASS |

### Executed evidence

| Evidence | Result |
|---|---|
| eight-case W8.3 sentinel executes | PASS |
| sentinel fails for intended missing capabilities | PASS |
| sentinel free of harness/module/syntax failures | PASS |
| existing Vitest regression | PASS — 127/127 |
| route verification | PASS — 18 routes |
| production build | PASS |
| raw RED and GREEN logs retained as workflow artifacts | PASS |

## Material assurance finding

### IAA-W83-001 — Complete QA-to-RED contract is not yet executable

Severity: **appointment blocker**

The approved QA-to-RED contract defines `PIT-RED-W83-001..036`, covering hierarchy invariants, RLS/role denials, guided wizards, invitation behaviour, date exceptions, cancellation blocking, transfer approval, stale proposals, transactional rollback, audit immutability, MMM transformation, AIMC proposal handling, consent-governed preference memory, shared evidence assurance and future integration containment.

The current executable inventory contains eight coarse sentinels. Those sentinels honestly prove that major routes, workspaces, migrations and the atomic approval RPC do not yet exist, but they do not execute the remaining behavioural, security, transaction and browser contracts.

The following required classes remain specifications rather than executable RED tests:

1. isolated Supabase tests for strict parentage and project/organisation consistency;
2. unauthenticated, viewer, contextual-owner and cross-tenant denial tests;
3. project-leader approval and non-leader denial;
4. stale proposal, concurrency and complete transaction rollback;
5. append-only audit and immutable lineage enforcement;
6. browser tests for role-specific setup wizards and cancellation/transfer UX;
7. MMM Domain/MPS/Criterion transformation fixtures;
8. AIMC proposal, human-acceptance and consent-decline paths;
9. shared evidence-assurance proposal without automatic canonical progress;
10. proof that W8.3 creates no live Incident Workflow call.

The IAA pre-brief requires sufficient failure-first QA evidence for a builder to build to GREEN without interpretation drift and identifies prose/file-existence-only QA as an automatic NO-GO condition. The eight sentinels are useful but are not a complete executable representation of the 36-case build contract.

## Non-blocking observation

### IAA-W83-002 — ESLint 9 configuration debt

The repository package command `ci:w7` currently cannot complete because ESLint 9 requires an `eslint.config.*` file that is absent. Vitest, route verification and production build are GREEN. This tooling debt predates PR #1972 and is not caused by the pre-build alignment, but no party may claim the lint stage passed.

This should be corrected separately and does not replace finding IAA-W83-001.

## Required correction for appointment readiness

Before the W8.3 implementation builder is appointed, a bounded QA-builder lane must:

1. convert all 36 W8.3 RED cases into executable test inventory;
2. provide isolated Supabase fixtures/identities for RPC, RLS, transaction and audit tests;
3. provide browser-level RED tests for the required routes, five states, wizards and denied paths;
4. prove each test fails for its intended missing capability rather than a harness failure;
5. preserve the existing 127-test GREEN baseline, route verification and build;
6. rerun independent IAA on the frozen QA-complete head.

The QA-builder may build tests and fixtures only. It must not implement the product capability or weaken assertions to manufacture RED/GREEN outcomes.

## Final IAA disposition

```text
FAIL — PRE-BUILD CORRECTION REQUIRED; IMPLEMENTATION BUILDER APPOINTMENT NO-GO
```

Reason:

```text
THE 36-CASE W8.3 QA-TO-RED CONTRACT IS ALIGNED BUT NOT YET FULLY EXECUTABLE
```

The pre-build strategy alignment is accepted as substantively correct. The implementation appointment remains blocked until the executable QA inventory represents the complete approved build contract and independent IAA confirms the corrected frozen head.
