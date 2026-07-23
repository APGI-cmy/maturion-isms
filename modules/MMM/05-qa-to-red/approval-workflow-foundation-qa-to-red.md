# MMM Approval Workflow Foundation — QA-to-RED

**Issue:** #1961  
**Wave:** `mmm-approval-workflow-foundation-qa-red`  
**Status:** Executable red authority

## Objective

Prove that the current partial domain-approval surface is not yet a complete governed Level 1/2/3 approval runtime, and establish the exact contract that build-to-green must satisfy.

## Trace matrix

| ID | Required proof | Current expected red reason |
|---|---|---|
| T-MMM-AWF-001 | owner edit/submit authority; unassigned submit denied | no central actor/assignment state-machine contract |
| T-MMM-AWF-002 | incomplete package rejected from submission | no server completeness gate contract |
| T-MMM-AWF-003 | Level 1 submit locks and records immutable transition/comment | partial UI action only; immutable transition contract absent |
| T-MMM-AWF-004 | submitter cannot self-approve Level 2 | explicit segregation rule absent |
| T-MMM-AWF-005 | assigned Level 2 reviewer only | assignment enforcement contract incomplete |
| T-MMM-AWF-006 | return requires reason and controlled remediation unlock | state/reason contract incomplete |
| T-MMM-AWF-007 | resubmission preserves history | immutable history contract incomplete |
| T-MMM-AWF-008 | Level 2 approve idempotent and version-locking | idempotency/version contract absent |
| T-MMM-AWF-009 | Level 3 waits for all current Level 2 approvals | Level 3 runtime absent |
| T-MMM-AWF-010 | assigned/authorised Level 3 actor only | Level 3 authorisation absent |
| T-MMM-AWF-011 | Level 3 transitions audited/idempotent | Level 3 persistence absent |
| T-MMM-AWF-012 | signed content mutation requires revision/reapproval | signed-version mutation guard absent |
| T-MMM-AWF-013 | cross-tenant reads/actions denied | full action-path proof absent |
| T-MMM-AWF-014 | stale expected state/version rejected | optimistic concurrency contract absent |
| T-MMM-AWF-015 | reviewer reassignment authorised/audited | reassignment transition absent |
| T-MMM-AWF-016 | UI reload projects server status/locks/actions | full server-truth projection absent |
| T-MMM-AWF-017 | RLS helper execution works without broadening access | issue #1959 open |
| T-MMM-AWF-018 | descriptor regression remains green | must run existing descriptor suites unchanged |

## First executable contract

The initial red test is intentionally file/contract based. It requires:

1. a central production approval state-machine module;
2. Level 1, Level 2 and Level 3 server action functions;
3. explicit allowed-state transitions;
4. expected-state/version conflict handling;
5. self-approval denial;
6. assignment and tenant checks;
7. idempotency keys;
8. immutable transition/audit persistence;
9. revision-required handling after signed mutation;
10. minimum execute-grant migration evidence for the MMM identity helper dependency.

The current repository is expected to fail these assertions. A red result is valid only when failures identify missing production contracts rather than syntax, path or fixture defects.

## Required command

```bash
pnpm vitest run modules/MMM/tests/B4-framework/approval-workflow-foundation-red.test.ts
```

## Build-to-green boundary

No production implementation is authorised by this file. The successor build issue must be created after this QA authority is reviewed and merged.
