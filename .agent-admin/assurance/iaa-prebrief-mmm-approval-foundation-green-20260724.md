# IAA Pre-Brief — MMM Approval Workflow Foundation Build-to-GREEN

**Issue:** #1961  
**Security prerequisite:** #1959  
**Wave:** `mmm-approval-workflow-foundation-green`  
**Date:** 2026-07-24  
**CS2 Authority:** Johan Ras

## Objective

Independently verify that the merged QA-to-RED contract from PR #1962 is implemented as a genuine server-enforced approval foundation without weakening tenant isolation, RLS, segregation of duties, concurrency protection, auditability or descriptor regressions.

## Required evidence

1. #1959 is corrected by preserving the `app_private` helper model and removing stale public/unqualified policy references.
2. A central approval state machine defines valid Level 1, Level 2 and Level 3 states and transitions.
3. Domain actions enforce completeness, assignment, no self-approval, required reasons/comments, expected state/version and idempotency.
4. Framework Level 3 actions require current Level 2 approval for every required domain.
5. Every successful transition creates immutable transition and audit evidence; persistence/audit failure is fatal.
6. Signed content cannot be silently mutated; a later change requires revision/reapproval.
7. UI reads server status/lock truth and does not claim authorisation from button visibility alone.
8. The dedicated approval foundation test command is GREEN without weakening assertions.
9. Existing descriptor regression and live-closure authority remain unchanged.
10. No ISMS Portal, PIT, billing, unrelated module or descriptor-generation redesign enters scope.

## Prohibited shortcuts

- public RPC execution for MMM identity helpers;
- service-role exposure to browser code;
- UI-only authorisation;
- self-approval;
- mutable deletion/replacement of transition history;
- non-fatal audit writes;
- broad RLS bypass;
- hard-coded user, organisation, framework or domain IDs;
- deleting or weakening QA-to-RED assertions.

## Handover rule

IAA may recommend merge only when the implementation is bounded, current-head gates are green, the approval RED contract is GREEN, the #1959 production verification is recorded, and the progress tracker accurately distinguishes foundation completion from later Level 2 workspace and publication waves.