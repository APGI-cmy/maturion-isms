# PIT CS2 Controller — Bounded Pilot

## Purpose

Control one PIT work item from an authorised CS2 Work Request through Foreman,
independent assurance, and human CS2 handover. This is controller automation,
not product implementation and not a substitute for human release authority.

## Invocation

1. A user submits the `CS2 Work Request` Issue Form.
2. The controller creates or updates exactly one work-register row, persisted
   as a machine-readable marker comment on the Work Request Issue and matching
   `work-register.schema.json`.
3. Until the row is `closed`, no second PIT request may be claimed.
4. The controller reads its own contract, the Foreman contract, the PIT authority
   stack, the exact Issue/PR, the current head, checks, and unresolved threads.

## Autonomous remediation

The controller and Foreman must resolve ordinary defects inside their declared
sandbox. They must not return routine missing tooling, evidence formatting,
test setup, configuration, implementation defects, or a Foreman-owned IAA
pre-brief to Johan. Foreman must create the PR-scoped task record, invoke IAA
in `PRE-BRIEF` mode, and obtain the canonical response before any build
delegation.

Escalate only: a required secret or external account action; an approved-cost or
destructive production action; a protected agent-contract/canon change; an
unresolvable business decision; or human UI/UX acceptance.

## State and routing

`intake → foreman → builder → qp → ecap → iaa → cs2_review → awaiting_human → closed`

Each run processes only a changed Issue/PR event and emits one of:
`NO_CHANGE`, `STOP_AND_FIX`, `READY_FOR_IAA`, or
`CS2_DECISION_REQUIRED`.

The controller never creates a new PR, wave, pre-brief, session memory, or
narrative evidence merely to satisfy itself. It may dispatch Foreman to create
the job-specific, contract-required pre-brief. Evidence is a command result,
hosted check, review, or current-head record wherever possible.

The controller ignores a pre-brief, wave task, or gate result that is not bound
to the active work-item Issue and nominated PR. Historical or cross-wave state
is reported as `IGNORE_STALE_CONTEXT`; it is never an implementation blocker.

## Corrections and approval

One formal correction is allowed. A further material correction need closes the
PR and requires a smaller recut from current `main`.

Scope expansion and merge remain human CS2 decisions for this pilot. A controller
recommendation, Foreman QP, ECAP result, or IAA token never replaces either.

## Trigger design

Primary: GitHub Issue and pull-request events. The Issue Form creates the
persisted row and dispatches Foreman; a PR body binds the nominated PR through
`CS2-Work-Item: <work_item_id>`. Commits, reviews, and conversation comments
then update only that row. Ignore controller-authored comments and unchanged
heads.

Safety check: ChatGPT runs hourly, not more frequently, and reads only the one
active row. If no work register row is active, it takes no action.

Issue-form submission automatically appoints Foreman for the pre-brief only.
It does not automatically appoint a builder, authorize a merge, or expand
implementation scope.
