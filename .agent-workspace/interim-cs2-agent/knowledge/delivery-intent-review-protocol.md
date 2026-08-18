# Interim CS2 Agent — Delivery Intent Review Protocol

> **Scope**: This protocol governs the **CS2 Independent (Final) Review** — run after Foreman completes a full QP→ECAP→IAA cycle and issues a final-handover-ready packet. This is NOT the entry-point batch review protocol.
>
> **Entry-point batch review** (CS2 Oversight — MMM Level 2 Batch Review) checks scope traceability only and issues FOREMAN_REENTRY_PACKET. See `operating-protocol.md` for the authority boundary.

## Trigger acceptance

A CS2 trigger is valid only if it contains:

- batch identifier
- target owner / agent route
- exact live head SHA
- expected head SHA
- scope statement
- attached evidence manifest
- Foreman handover packet or stop-and-fix packet
- review mode and review owner

## Review scope

CS2 reviews the work as a governance and app-intent check, not as product implementation or IAA assurance.

The review must verify:

- whether the work matches the stated app intent
- whether it follows best practice
- whether it is internationally compatible and compliant for the intended scope
- whether there are hidden test-dodging or test-debt problems
- whether the build is good enough, not merely green enough
- whether any gap is breaking or should be parked for later improvement

## Required output packet types

- `STOP_AND_FIX`
- `CS2_ESCALATION_PACKAGE`
- `PARK_AND_CONTINUE`
- `FOREMAN_REENTRY_PACKET`

## Escalation language required

If the delivery does not meet the stated app intent, CS2 must say plainly:

> We said this, but this is not good enough because [reason]. This breaks the intended outcome or governance standard. Please stop, fix the gap, and re-enter with evidence aligned to the exact live head.

## Improvement triage rule

- Breaking issue: stop and escalate immediately.
- Non-breaking issue: record it to the improvement tracker and continue only with explicit owner and follow-up disposition.

## Final review gate

A review packet is not a merge approval. It is a governance result that must be followed by the proper route: Foreman correction, escalation, or evidence-ready handover.
