# Builder Appointment — PR #2061 W0 Safety Envelope and Decision Record

- issue: #2053
- pr: #2061
- work_item_id: W0-2053
- wave_id: W0-SAFETY-CONTAINMENT-20261004
- appointed_builder_agent: pit-specialist
- appointment_timestamp_utc: 2026-10-05T11:23:56Z
- authority: CS2 proxy comment 5993445415; canonical IAA pre-brief at `.agent-admin/assurance/iaa-wave-record-w0-safety-containment-20261004.md`
- iaa_prebrief_commit_sha: ed66cc062cec3156abce2b51a563bb34e3bb6df2
- accepted_qa_to_red_commits: d2da1392f74673330e56cda2bd24c7161f16d3d9, a6355778d500ce859cfaa3e859560513e409575c, c338f4ccbae2ca8c421f8a88fe62b89e5eeda068, 391e812
- task_ref: .agent-admin/prs/pr-2061/wave-current-tasks.md#W0-2053-E

## Authorized implementation paths

- `.github/scripts/pit-cs2-controller.js`
- `.github/workflows/pit-cs2-controller.yml`
- `.github/cs2-controller/safety-envelope.schema.json`
- `.github/cs2-controller/decision-record.schema.json`
- `.github/scripts/pit-cs2-controller.test.js`
- `.github/scripts/pit-cs2-controller-workflow.test.js`

## Required outcome

Make every accepted W0 RED assertion green without weakening, deleting, skipping, stubbing, or replacing it:

1. Versioned machine-validatable safety-envelope and decision-record schemas, and controller validation before evaluation or append.
2. Fail-closed absent, malformed, expired when explicitly activated, task-inconsistent, unmeasurable, or schema-invalid envelopes.
3. Exact approved limits only: one active work item, one material remediation, 30-minute dispatch, two-hour total runtime, and runtime-only spend.
4. Human-CS2-only circuit-breaker reset; no automated reset source may clear a trip.
5. Deterministic, fixed-shape decision records with a typed unknown-state refusal; duplicate/reordered events yield exactly one typed `LOOP_BREAK` or `BUDGET_TRIP`.
6. Independently invocable human kill switch blocks dispatch, retry, merge, and successor-release paths and preserves evidence.
7. Simulated 24-hour repeat events make no live paid or production calls.
8. Real workflow coverage validates the 30-minute and two-hour ceilings plus safety-envelope, reset, and human kill-switch wiring.

`maximum_stage_attempts`, `maximum_merge_attempts`, and `expiry` remain required schema fields but are proposal-only unless separately human-CS2 approved. They must never silently activate a default.

## Prohibitions

- Do not activate active-CS2 merge authority, live merge actions, or successor dispatch.
- Do not add automatic reset, spend telemetry, paid calls, production/database/deployment behavior, or change the approved limits.
- Do not modify protected Tier 1/2/3, CANON, non-authorized paths, or archival #2048/#2057 evidence.
- Do not claim handover, final assurance, merge readiness, or completion.

## Required validation

Run both existing controller test files. Report exact pass/fail/skip/todo counts and confirm no live paid or production call. Preserve the PR as draft for Foreman QP and later governed checks.
