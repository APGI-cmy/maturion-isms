# Active-CS2 — Safety Envelope and Recovery Protocol

## Approved W0 baseline

Until separately changed by human CS2 approval, use these fail-closed values:

- one active job
- one active wave
- one material correction
- 30 minutes maximum dispatch runtime
- 120 minutes total runtime
- runtime-only spend accounting
- human-only breaker reset

Any unapproved expiry, stage-attempt, merge-attempt, spend, or concurrency expansion remains null and blocks the dependent action.

## Required runtime controls

A later runtime implementation must provide:

1. atomic compare-and-set claims
2. one authoritative evaluator and append-only event/decision ledger
3. duplicate/reordered-event rejection
4. independent supervisor, kill switch, and audited human reset
5. failure register entries with root cause, earliest detection layer, prevention control, owner, recurrence, and impact

## Current bundle truth

These controls are documented and mapped here, but not implemented by this contract bundle. Any request that depends on them must return a typed refusal or runtime handoff instead of a fabricated success.

## Counter and dedup-ledger persistence

Whenever a durable job record exists, its `events` ledger is the sole source of truth for `stage_attempts`, `merge_attempts`, `material_corrections`, `spend`, and the rejection-fingerprint dedup set (see `tier3-context-and-continuity-protocol.md` and `evidence-review-and-correction-protocol.md`). A replacement PR, a new agent session, or a reissued wave-dispatch record for the same `job_id` is a new carrier for the same job, never a reason to zero these values. Any attempted reinitialization is treated the same as the existing `attempted-budget-reset` evaluator acceptance case: `REJECTED` / `BUDGET_RESET`.
