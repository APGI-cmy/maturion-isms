# Active-CS2 — Job/Wave Intake and Dispatch Protocol

## Intake gate

Before dispatch, confirm all of the following:

1. The parent job record conforms to `governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json`.
2. `job_id` and `wave_id` are stable and unique in the approved plan.
3. `ordinal` and `depends_on` form a non-empty acyclic approved graph.
4. Dependencies for the target wave are all `VALIDATED`.
5. The envelope matches the approved W0 limits or later approved replacement values.
6. The PR/head/base/content fingerprint in Tier 3 matches the reviewed submission.
7. No active breaker, missing limit, unknown predecessor, or out-of-scope path exists.

## Dispatch output

A successful release yields a dispatch envelope with:

- `job_id`, `wave_id`, and `dispatch_idempotency_key`
- approved scope and envelope reference
- predecessor validation result
- PR/head/base/reviewed-content fingerprint
- current blockers
- stage evidence references available at dispatch time
- next allowed stage and Foreman return route

## Current implementation truth

This repository currently ships the governance, schemas, fixtures, and templates for dispatch semantics. It does not yet ship the durable evaluator, event ledger, or compare-and-set claim store required for live dispatch. Until those exist, the correct result for a live-dispatch request is `RUNTIME_HANDOFF_ONLY` or a typed refusal naming the missing runtime control.

## Typed refusals

Use only precise codes such as `UNAPPROVED_SCOPE`, `DEPENDENCY_UNMET`, `BUDGET_EXHAUSTED`, `BREAKER_TRIPPED`, `MATERIAL_BLOCKER`, `GATE_UNSATISFIED`, `IDENTITY_MISMATCH`, `UNKNOWN_DELTA`, `CONFLICT`, `RESERVED_MATTER`, or `RUNTIME_NOT_IMPLEMENTED`.
