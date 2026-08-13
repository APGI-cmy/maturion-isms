# Independent Assurance Pre-Brief — PIT W8.3 Pre-Build Alignment

## Identity

- Governing issue: `#1968`
- Pull request: `#1972`
- Module: PIT
- Wave: Stage 12 / W8.3 pre-build alignment
- CS2 Authority: Johan Ras
- Assurance type: independent pre-build alignment and QA-to-RED readiness review

## Assurance objective

Determine whether the W8.3 pre-build package accurately represents the approved product strategy, preserves the established PIT authority chain, and provides sufficient failure-first QA evidence for a later implementation builder to build to GREEN without interpretation drift.

## Mandatory review questions

1. Does the package enforce the strict hierarchy `Project → Milestone → Deliverable → Task`?
2. Are direct project-level tasks explicitly excluded from W8.3?
3. Does cancellation fail closed when incomplete descendants exist?
4. Is re-parenting approval-based, project-leader controlled, atomic and append-only audited?
5. Are full-project visibility and subtree-scoped write permissions separated clearly?
6. Are project, milestone, deliverable and task accountability cascades unambiguous?
7. Are invitation, acceptance and setup-wizard boundaries defined without pulling W8.4 runtime into W8.3?
8. Are date-order and parent-date containment rules deterministic?
9. Are Archive, Cancel and Restore used instead of normal-user Delete?
10. Is the MMM → PIT transformation contract deterministic and lineage-preserving?
11. Is evidence assurance reused from MMM through a shared contract rather than duplicated?
12. Do AI suggestions remain AIMC-routed, reviewable and non-authoritative until accepted?
13. Is learning from edits explicit opt-in and isolated by user/tenant with inspect/correct/delete controls?
14. Are W8.3 requirements traceable into TRS, architecture and QA-to-RED IDs?
15. Do RED tests cover positive, denial, cross-tenant, invariant, approval, atomicity and audit paths?
16. Does the package preserve later-wave boundaries for W8.4–W8.10?
17. Does the current runtime remain honestly RED for missing hierarchy functionality?
18. Are no tests weakened, removed or falsely marked GREEN?

## Required evidence

- App Description alignment addendum.
- UX/Wiring alignment addendum.
- FRS alignment addendum.
- TRS/traceability alignment addendum.
- Architecture, RLS and integration alignment addendum.
- QA-to-RED contract with executable-test specifications.
- Role-denied and invariant-negative matrix.
- PBFAG golden/failure path pack.
- Stage 8 wave-boundary reconciliation.
- Improvement-register record.
- Foreman QP and ECAP administrative validation.

## Automatic NO-GO conditions

- Any active descendant may remain under a cancelled milestone or deliverable.
- Cancellation can move children without project-leader approval.
- Re-parenting and cancellation are not atomic.
- A task may exist without a deliverable parent.
- A user can mutate outside their authorised subtree.
- Cross-organisation records can be read or changed.
- AI output is applied without explicit human acceptance.
- AI memory writes occur without informed opt-in.
- PIT duplicates the MMM evidence-scoring engine.
- QA consists only of prose or file-existence checks.
- Any runtime implementation, migration or deployment is introduced in this pre-build PR.

## Expected disposition

IAA must return one of:

- `PASS — W8.3 IMPLEMENTATION BUILDER APPOINTMENT MAY BE PROPOSED`, or
- `FAIL — PRE-BUILD CORRECTION REQUIRED; BUILDER APPOINTMENT NO-GO`.

IAA does not merge the PR and does not appoint the implementation builder.
