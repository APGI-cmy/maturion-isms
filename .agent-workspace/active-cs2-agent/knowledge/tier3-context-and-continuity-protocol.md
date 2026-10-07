# Active-CS2 — Tier 3 Context and Continuity Protocol

## Required Tier 3 fields

Every active-wave context must be reconstructable from durable facts and current repository state:

- `job_id`, `wave_id`, `ordinal`, `depends_on`
- approved scope and envelope reference
- repository plus the exact ref/content fingerprint available at the current stage, and PR number/base SHA/head SHA/reviewed-content fingerprint once a PR-bound submission exists
- current blockers and dependency outcomes
- QP, ECAP, and IAA references applicable to the current stage
- remaining runtime/correction/attempt counters
- merge-policy version and compare-and-set claim reference when applicable
- `rejection_fingerprint` ledger: the set of `hash(failed_obligation, reviewed_content_sha256)` values already raised as a findings packet or escalation for this job, used to detect duplicates (see dedup rule in `evidence-review-and-correction-protocol.md`)
- `reviewed_content_identity`: the current frozen `evidenceBinding.frozen_substantive_fingerprint`, used to tell a genuine substantive re-entry apart from a token-only append
- `attempts` / `spend`: the job-wave schema's `event.budget` fields (`stage_attempts`, `merge_attempts`, `material_corrections`, `spend`), always read from the **durable append-only event ledger bound to `job_id`**, never from session memory or PR metadata

Tier 3 never grants authority and never overrides Tier 1.

## Persistence and reconstruction across restarts

All of the fields above — rejection fingerprint ledger, reviewed-content identity, attempt/spend counters, and recorded `NO_OP` duplicate-detection events — are derived **only** from the durable job/wave record's append-only `events` array (the job-wave schema's authoritative ledger for `job_id`). They must be fully reconstructable by replaying that ledger after any process restart, session end, or agent re-bootstrap, with no reliance on in-memory or session-scoped state.

- A fresh session, a new PR number, or a replacement wave-dispatch record referencing the **same `job_id`** must load the existing ledger and its accumulated counters — it must never reinitialize `stage_attempts`, `merge_attempts`, `material_corrections`, `spend`, or the rejection-fingerprint/dedup set to zero/empty. Attempting to do so is itself an `attempted-budget-reset` condition and is rejected (`BUDGET_RESET` / `BUDGET_EXHAUSTED`), per the existing evaluator acceptance case for budget-reset attempts.
- Only a separately authorised human-CS2 breaker reset may clear counters, and only for the envelope/job it is explicitly scoped to.
- A duplicate event (same `idempotency_key` as an already-recorded event) replays as `NO_OP` on reconstruction — it is never replayed as a second `REJECTED` finding, second escalation, or second IAA/ECAP invocation, even across a restart.

## Continuity rules

- A new agent starts with no historical sessions; do not fabricate five prior sessions.
- Record real session memory only after real work occurs.
- Record non-breaking improvements in `parking-station/suggestions-log.md`.
- Persist breaches only after confirmed process violations.
