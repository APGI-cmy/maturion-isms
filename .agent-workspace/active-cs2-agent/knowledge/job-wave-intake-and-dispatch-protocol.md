# Active-CS2 — Job/Wave Intake and Dispatch Protocol

## Intake gate

Before dispatch, confirm all of the following:

1. The parent job record conforms to `governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json`.
2. `job_id` and `wave_id` are stable and unique in the approved plan.
3. `ordinal` and `depends_on` form a non-empty acyclic approved graph.
4. Dependencies for the target wave are all `VALIDATED`.
5. The envelope matches the approved W0 limits or later approved replacement values.
6. When execution is PR-bound, the PR/head/base/content fingerprint in Tier 3 matches the reviewed submission. Before a PR exists, the repository/ref/content fingerprint available at the current stage must match the approved job context and be upgraded to a PR-bound fingerprint before handover or merge-stage controls.
7. No active breaker, missing limit, unknown predecessor, or out-of-scope path exists.

## Dispatch output

A successful release yields a dispatch envelope with:

- `job_id`, `wave_id`, and `dispatch_idempotency_key`
- approved scope and envelope reference
- predecessor validation result
- PR/head/base/reviewed-content fingerprint when PR-bound, otherwise the exact repository/ref/content fingerprint available at dispatch time
- current blockers
- stage evidence references available at dispatch time
- next allowed stage and Foreman return route

## Current implementation truth

This repository currently ships the governance, schemas, fixtures, and templates for dispatch semantics. It does not yet ship the durable evaluator, event ledger, or compare-and-set claim store required for live dispatch. Until those exist, the correct result for a live-dispatch request is `RUNTIME_HANDOFF_ONLY` or a typed refusal naming the missing runtime control.

## Typed refusals

Use only precise codes such as `UNAPPROVED_SCOPE`, `DEPENDENCY_UNMET`, `BUDGET_EXHAUSTED`, `BREAKER_TRIPPED`, `MATERIAL_BLOCKER`, `GATE_UNSATISFIED`, `IDENTITY_MISMATCH`, `UNKNOWN_DELTA`, `CONFLICT`, `RESERVED_MATTER`, or `RUNTIME_NOT_IMPLEMENTED`.

## Rejected / missing / stale IAA mapping

No new refusal code is introduced for rejected, missing, or stale IAA — the approved merge-policy `refusal_codes` vocabulary already expresses each case exactly:

- **Rejected** final IAA (an actual REJECTION-PACKAGE exists for the reviewed content) → `MATERIAL_BLOCKER`.
- **Missing** final IAA (no final verdict yet bound to the reviewed content; pre-brief alone is not sufficient) → `GATE_UNSATISFIED`.
- **Stale** final IAA (a prior PASS no longer binds the current reviewed-content fingerprint) → `EVIDENCE_STALE`.

Each of these blocks dispatch of any successor wave and blocks advancing `current_wave_id` past the affected wave. See `merge-and-refusal-protocol.md` for the full handover/merge consequence and `evidence-review-and-correction-protocol.md` for dedup and re-entry handling of repeated or resolved occurrences.

## Durable counters survive replacement carriers

Intake must load `stage_attempts`, `merge_attempts`, `material_corrections`, `spend`, and the rejection-fingerprint/dedup ledger from the existing durable job record keyed by `job_id` whenever one exists. A replacement PR number, a new agent session, or a reissued wave-dispatch record for the **same `job_id`** is a new carrier for the same job — it is never treated as grounds to reinitialize counters or clear the dedup ledger. See the persistence rule in `tier3-context-and-continuity-protocol.md`.
