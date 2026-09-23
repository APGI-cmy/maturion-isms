# Active-CS2 Job/Wave Acceptance Fixtures

These fixtures define the minimum static acceptance set for a downstream evaluator implementing `ACTIVE_CS2_JOB_WAVE.schema.json`. They are not evidence of a live controller.

| Fixture | Expected result |
|---|---|
| `valid-two-wave-pilot.json` | Schema-valid record with two approved waves; pilot configuration only |
| `valid-three-wave-plan.json` | Schema-valid record with three waves, proving no two-wave policy/schema limit |
| `evaluator-rejection-cases.json` | Static evaluator acceptance cases for ordering, duplicate wave identity/order, budgets, token-only versus material evidence deltas, incomplete policy baselines, and policy/authority refusals |
| `scoped-merge-policy.json` | Schema-valid repository, branch, path, job/wave, approval, and protected-authority-scoped policy |

A consumer implementation must run the static evaluator cases as automated tests in addition to schema validation. Graph-cycle detection, event ordering, counter monotonicity, and authority/merge checks are evaluator semantics not expressible solely in JSON Schema.
