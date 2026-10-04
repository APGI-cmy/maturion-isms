# PR #2061 — W0-2053-C QA-to-RED Evidence

- pr: #2061
- issue: #2053
- work_item_id: W0-2053 (task W0-2053-C)
- wave_id: W0-SAFETY-CONTAINMENT-20261004
- owner: qa-builder
- appointment: `.agent-admin/builder-appointments/pr-2061-w0-qa-to-red-20261004.md` (commit `4e4a6f1093e32b76dad74aacf061e06b5d5adc61`)
- canonical IAA pre-brief: `.agent-admin/assurance/iaa-wave-record-w0-safety-containment-20261004.md` (commit `ed66cc062cec3156abce2b51a563bb34e3bb6df2`, strictly ancestor of the appointment commit — verified via `git merge-base --is-ancestor`)
- status: **QA-to-RED ONLY — NOT GREEN, NOT HANDOVER, NOT FINAL ASSURANCE, NOT MERGE-READY**

## Scope and authorized paths

Only these paths were created or modified by this task:

- `.github/scripts/pit-cs2-controller.test.js` (append-only: 301 added lines, 0 removed)
- `.github/scripts/pit-cs2-controller-workflow.test.js` (append-only: 31 added lines, 0 removed)
- `.agent-admin/evidence/pr-2061-w0-qa-to-red.md` (this file, new)

No controller implementation (`pit-cs2-controller.js`), workflow (`.github/workflows/*.yml`), schema (`work-register.schema.json`), protected contract/CANON, deployment, scope/task/appointment/IAA artifact, or historic PR #2048/#2057 record was created, modified, or touched. Verified with `git status --short` and `git diff --stat` showing only the three paths above.

## What was added and why each test is genuinely RED

The existing `pit-cs2-controller.js` (from the earlier PR #2046 pilot) implements only the single-work-item intake/binding/human-approval register. It exports no safety-envelope, decision-record, circuit-breaker, or trip-event API. Every new test below calls the controller API required by `governance/strategy/GOVERNANCE_FAILURE_OUTENGINEERING_STRATEGY.md` §5.1 (safety envelope / human kill switch) and §5.2 (authoritative event decision record), using exactly the field names and semantics specified there. Because the implementation does not exist, every assertion either throws `TypeError: controller.<fn> is not a function` or (for the workflow-content tests) fails a `assert.match`/`assert.doesNotMatch` against workflow text that does not yet contain the required wiring. No test uses `.skip()`, `.todo()`, a stub, a mock-around, or a weakened assertion to force a GREEN result — each failure is attributable solely to the absent required behavior.

### `.github/scripts/pit-cs2-controller.test.js` (25 new RED tests, appended after the existing 9 GREEN tests)

| Required coverage (appointment §"Required RED coverage") | New test(s) | Calls (not yet implemented) |
|---|---|---|
| 1. Fail-closed: missing/malformed/expired/task-inconsistent/unmeasurable envelopes | `W0: a missing safety envelope fails closed and blocks dispatch`; `W0: a malformed safety envelope (missing required field) fails closed`; `W0: a safety envelope missing any single Strategy §5.1 required field fails closed` (loops all 14 §5.1 fields); `W0: an expired safety envelope fails closed`; `W0: a task-inconsistent safety envelope (work_item_id mismatch) fails closed`; `W0: an unmeasurable safety envelope limit fails closed` | `controller.evaluateSafetyEnvelope(envelope, taskRecord, now)` |
| 2. Exact/one-past boundary: 1 active item, 1 remediation, 30-min dispatch, 2-hour total runtime, runtime-only spend | `W0: exactly one active work item is allowed; a second active work item is blocked`; `W0: exactly one material remediation attempt is allowed; a second trips the breaker`; `W0: dispatch runtime of exactly 30 minutes is allowed; 30 minutes and one second trips`; `W0: total runtime of exactly two hours is allowed; two hours and one second trips`; `W0: spend control is runtime-only and refuses any live-spend-based input` | `controller.enforceWorkItemLimits(usage, envelope)`; `controller.enforceSpendControl(spend, envelope)` |
| 3. Human-CS2-only reset; reject webhook/agent/token/comment/PR/automatic-retry | `W0: a webhook-triggered reset cannot clear a tripped circuit breaker`; `W0: an agent-triggered reset cannot clear a tripped circuit breaker`; `W0: a token-triggered reset cannot clear a tripped circuit breaker`; `W0: a comment-triggered reset cannot clear a tripped circuit breaker`; `W0: a PR-triggered reset cannot clear a tripped circuit breaker`; `W0: an automatic-retry reset cannot clear a tripped circuit breaker`; `W0: only an explicit human-CS2-attributed reset can clear a tripped circuit breaker` | `controller.resetCircuitBreaker(state, resetRequest)` |
| 4. §5.2 decision-record fields, determinism, typed unknown-state refusal | `W0: the decision record contains every Strategy §5.2 required field` (all 22 fields); `W0: identical input produces a byte/field-identical decision record (deterministic)`; `W0: an unknown/unrecognized state_before returns a typed refusal, never inferred readiness` | `controller.buildDecisionRecord(event)` |
| 5. Duplicate/reordered events; exactly one typed LOOP_BREAK/BUDGET_TRIP | `W0: a duplicate trip event is suppressed and exactly one typed trip is recorded`; `W0: reordered duplicate trip events still yield exactly one typed trip`; `W0: a qualifying trip condition emits exactly one typed LOOP_BREAK or BUDGET_TRIP, never zero` | `controller.recordTripEvent(ledger, event)` |
| 6. Simulated 24-hour repeat sequence, no live spend | `W0: a simulated 24-hour repeat-event sequence makes zero live spend or paid calls` | `controller.simulateTwentyFourHourWindow(envelope, clock)` |

### `.github/scripts/pit-cs2-controller-workflow.test.js` (4 new RED tests, appended after the existing 3 GREEN tests)

These assert the real workflow entrypoint (`.github/workflows/pit-cs2-controller.yml`), not only the extracted module, carries the required ceilings and wiring (per Strategy §5: "the regression suite must use the real workflow entrypoints, not only an extracted renderer/evaluator"):

- `W0: controller dispatch step enforces the Strategy §5.1 30-minute maximum dispatch runtime ceiling` — expects `timeout-minutes: 30`; absent today (no step-level timeout declared).
- `W0: controller job enforces the Strategy §5.1 two-hour maximum total runtime ceiling` — expects `timeout-minutes: 120` on the job; absent today (job uses the GitHub default of 360 minutes).
- `W0: controller workflow evaluates the safety envelope before claiming, binding, or dispatching a work item` — expects an `evaluateSafetyEnvelope` call and `safety_envelope`/`safety-envelope` reference in the workflow script; absent today.
- `W0: controller workflow exposes a human-CS2-only circuit breaker reset path` — expects `resetCircuitBreaker`, `reset_authority`, and `human_cs2_only` references in the workflow; absent today.

## Exact run commands and RED output

```
$ node --version
v22.23.3

$ node --test .github/scripts/pit-cs2-controller.test.js
# tests 34
# suites 0
# pass 9
# fail 25
# cancelled 0
# skipped 0
# todo 0
exit code: 1
```

All 9 pre-existing (PR #2046 pilot) tests remain GREEN (`ok 1`–`ok 9`). All 25 new W0 tests are RED (`not ok 10`–`not ok 34`), each failing with `TypeError: controller.<fn> is not a function` for one of: `evaluateSafetyEnvelope`, `enforceWorkItemLimits`, `enforceSpendControl`, `resetCircuitBreaker`, `buildDecisionRecord`, `recordTripEvent`, `simulateTwentyFourHourWindow`.

```
$ node --test .github/scripts/pit-cs2-controller-workflow.test.js
# tests 7
# suites 0
# pass 3
# fail 4
# cancelled 0
# skipped 0
# todo 0
exit code: 1
```

All 3 pre-existing workflow tests remain GREEN (`ok 1`–`ok 3`). All 4 new W0 workflow tests are RED (`not ok 4`–`not ok 7`), each failing on `assert.match`/`assert.doesNotMatch` against workflow text that does not yet contain the required ceiling/wiring strings.

Full captured logs (not committed, reproducible on demand): `/tmp/test1.log`, `/tmp/test2.log` from this session.

## Confirmation: no controller/runtime/schema file was touched

```
$ git status --short
 M .github/scripts/pit-cs2-controller-workflow.test.js
 M .github/scripts/pit-cs2-controller.test.js

$ git diff --stat .github/scripts/pit-cs2-controller.test.js .github/scripts/pit-cs2-controller-workflow.test.js
 .../scripts/pit-cs2-controller-workflow.test.js    |  31 +++
 .github/scripts/pit-cs2-controller.test.js         | 301 +++++++++++++++++++++
 2 files changed, 332 insertions(+)
```

No lines were removed from either test file (append-only); no existing test was weakened, skipped, or deleted. `pit-cs2-controller.js`, `.github/workflows/*.yml`, `.github/cs2-controller/work-register.schema.json`, `governance/`, `.agent-admin/prs/pr-2061/wave-current-tasks.md`, `.agent-admin/scope-declarations/pr-2061.md`, `.agent-admin/evidence/pr-2061-w0-control-evidence-map.md`, and the historic `.agent-admin/assurance/iaa-wave-record-pr-2048-*.md` / `iaa-wave-record-pr-2057-*.md` records are all byte-identical to `HEAD~0` before this commit (not in the diff).

## Secret scan

`runtime-tools-secret_scanning` run against both changed test files: **no secrets detected**.

## API surface assumed by these RED tests (for the future implementation builder)

These names and shapes are derived directly from Strategy §5.1/§5.2 field lists and are not an architecture decision by this QA-to-RED task; they document the contract the tests exercise so a future implementation builder can satisfy it precisely, without the QA builder guessing at or freezing architecture:

- `evaluateSafetyEnvelope(envelope, taskRecord, now) -> { decision: 'ALLOW'|'STOP_AND_FIX', reason_code }`
- `enforceWorkItemLimits(usage, envelope) -> { decision, reason_code }` (active items, remediation attempts, dispatch runtime, total runtime)
- `enforceSpendControl(spend, envelope) -> { decision, reason_code }` (throws on `mode: 'live_spend'`; runtime-only is the only allowed mode in W0)
- `resetCircuitBreaker(state, resetRequest) -> { circuit_breaker_state, decision }` (only `source: 'human_cs2'` with a human CS2 actor clears a trip)
- `buildDecisionRecord(event) -> record` with all 22 Strategy §5.2 fields: `event_id, received_at, source, work_item_id, pr_number, head_sha, base_sha, reviewed_content_fingerprint, state_before, material_blockers, delta_class, requested_stage, allowed_next_action, action_owner, idempotency_key, attempt_count, safety_envelope_id, budget_snapshot, decision, reason_code, evidence_refs, state_after`; deterministic for identical input; typed `STOP_AND_FIX`/`reason_code: 'UNKNOWN_STATE'` refusal for unrecognized `state_before`
- `recordTripEvent(ledger, event)` — idempotency-key deduplication; exactly one typed `LOOP_BREAK` or `BUDGET_TRIP` entry per qualifying condition regardless of duplication or reordering
- `simulateTwentyFourHourWindow(envelope, clock) -> { live_spend_calls: 0, paid_call_count: 0, production_effects: 0, trip_count }` — fully in-process/mocked, no live spend or paid call

## Blockers

None. All required RED coverage items (1–6 in the appointment) are represented by at least one genuinely RED test. No governance gap, authority boundary, or tooling blocker was encountered.

## Explicit non-claims

This evidence file does **not** claim: GREEN status, build-to-green readiness, handover, final assurance, an ASSURANCE-TOKEN, or merge readiness. No implementation-builder appointment is made or implied. Per the appointment's required ordering, this RED evidence is step 3 of 4; Foreman's independent evaluation and any subsequent PR-scoped delegation-order evidence are Foreman's actions, not this builder's.

---

## Addendum — Foreman QP scope omission: independently invocable human kill switch (2026-10-04)

**Finding:** Foreman QP reviewed the original RED coverage above and found that the circuit-breaker reset-source tests (`a webhook/agent/token/comment/PR/automatic-retry-triggered reset cannot clear a tripped circuit breaker`) prove only reset-source restriction on the circuit breaker. They do **not** directly exercise Strategy §5.1's separate requirement that the **human kill switch** be independently invocable (usable without another agent run) and that, once engaged, it immediately blocks **new dispatches, retries, merge actions, and successor release**, while **preserving evidence**. This addendum adds genuinely RED tests closing that specific gap. No other scope change was made.

**Authorized paths touched (append-only, same three as above):**

- `.github/scripts/pit-cs2-controller.test.js` (append-only: 7 new tests appended after the existing 34 tests)
- `.github/scripts/pit-cs2-controller-workflow.test.js` (append-only: 1 new test appended after the existing 7 tests)
- `.agent-admin/evidence/pr-2061-w0-qa-to-red.md` (this addendum)

No controller implementation (`pit-cs2-controller.js`), workflow (`.github/workflows/*.yml`), schema, protected contract/CANON, deployment, scope/task/appointment/IAA artifact, or historic PR #2048/#2057 record was created, modified, or touched. Confirmed with `git status --short` showing only the two test files as modified (this evidence file is the third, expected change).

### New tests and why each is genuinely RED

`.github/scripts/pit-cs2-controller.test.js` — 7 new tests, calling `controller.invokeKillSwitch`, `controller.evaluateRetryGate`, `controller.evaluateMergeGate`, and `controller.evaluateSuccessorReleaseGate`, none of which exist on the controller module (confirmed absent from `module.exports` and from the file body via `grep`):

| Required coverage (this addendum) | New test | Fails because |
|---|---|---|
| Independently invocable (no agent run required) | `W0: the human kill switch is independently invocable, requiring no active job, dispatch context, or agent run` | `controller.invokeKillSwitch is not a function` |
| Only a human-CS2 source may invoke it | `W0: a non-human-CS2 source cannot invoke the kill switch` | `controller.invokeKillSwitch is not a function` |
| Blocks new dispatch | `W0: once triggered, the kill switch blocks any new dispatch regardless of an otherwise-valid safety envelope` | `controller.evaluateSafetyEnvelope is not a function` (pre-existing absent function; this test additionally pins the `KILL_SWITCH_TRIGGERED` reason code once implemented) |
| Blocks retries | `W0: once triggered, the kill switch blocks a retry attempt` | `controller.evaluateRetryGate is not a function` |
| Blocks merge actions | `W0: once triggered, the kill switch blocks a merge action` | `controller.evaluateMergeGate is not a function` |
| Blocks successor release | `W0: once triggered, the kill switch blocks successor release` | `controller.evaluateSuccessorReleaseGate is not a function` |
| Preserves evidence | `W0: a kill switch invocation preserves all existing evidence and decision-record history` | `controller.buildDecisionRecord is not a function` (pre-existing absent function, reused here as the evidence fixture) |

`.github/scripts/pit-cs2-controller-workflow.test.js` — 1 new test, asserting the real workflow entrypoint (not only the extracted module) wires the kill switch to its existing `workflow_dispatch` trigger (the manual, human-triggerable entrypoint already declared in `workflows/pit-cs2-controller.yml`), per Strategy §5's requirement that "the regression suite must use the real workflow entrypoints, not only an extracted renderer/evaluator":

- `W0: controller workflow exposes a human-invocable kill switch independent of any agent run` — expects `invokeKillSwitch` and `kill_switch_state` references in the workflow script; absent today. Confirmed RED on the `invokeKillSwitch` assertion specifically (the `workflow_dispatch:` assertion in the same test already passes, since that trigger pre-exists; only the kill-switch wiring is missing).

### Exact run commands and RED output

```
$ node --version
v22.23.3

$ node --test .github/scripts/pit-cs2-controller.test.js
# tests 41
# suites 0
# pass 9
# fail 32
# cancelled 0
# skipped 0
# todo 0
exit code: 1
```

All 9 pre-existing (PR #2046 pilot) tests remain GREEN (`ok 1`–`ok 9`). All 25 original W0 tests remain RED (`not ok 10`–`not ok 34`, unchanged). All 7 new kill-switch tests are RED (`not ok 35`–`not ok 41`):

- `not ok 35` — `W0: the human kill switch is independently invocable, requiring no active job, dispatch context, or agent run` — `TypeError: controller.invokeKillSwitch is not a function`
- `not ok 36` — `W0: a non-human-CS2 source cannot invoke the kill switch` — `TypeError: controller.invokeKillSwitch is not a function`
- `not ok 37` — `W0: once triggered, the kill switch blocks any new dispatch regardless of an otherwise-valid safety envelope` — `TypeError: controller.evaluateSafetyEnvelope is not a function`
- `not ok 38` — `W0: once triggered, the kill switch blocks a retry attempt` — `TypeError: controller.evaluateRetryGate is not a function`
- `not ok 39` — `W0: once triggered, the kill switch blocks a merge action` — `TypeError: controller.evaluateMergeGate is not a function`
- `not ok 40` — `W0: once triggered, the kill switch blocks successor release` — `TypeError: controller.evaluateSuccessorReleaseGate is not a function`
- `not ok 41` — `W0: a kill switch invocation preserves all existing evidence and decision-record history` — `TypeError: controller.buildDecisionRecord is not a function`

```
$ node --test .github/scripts/pit-cs2-controller-workflow.test.js
# tests 8
# suites 0
# pass 3
# fail 5
# cancelled 0
# skipped 0
# todo 0
exit code: 1
```

All 3 pre-existing workflow tests remain GREEN (`ok 1`–`ok 3`). All 4 original W0 workflow tests remain RED (`not ok 4`–`not ok 7`, unchanged). The 1 new kill-switch workflow test is RED:

- `not ok 8` — `W0: controller workflow exposes a human-invocable kill switch independent of any agent run` — `AssertionError: The input did not match the regular expression /invokeKillSwitch/` (the `workflow_dispatch:` sub-assertion in the same test passed; only `invokeKillSwitch`/`kill_switch_state` wiring is missing, confirming the failure is attributable solely to absent required behavior, not malformed test setup).

Full captured logs (not committed, reproducible on demand): `/tmp/test1.log`, `/tmp/test2.log` from this session.

### Additional API surface assumed by this addendum's RED tests

Consistent with the original evidence's framing: these names and shapes are derived directly from Strategy §5.1 ("the human kill switch disables new dispatches, retries, merges and successor release immediately while preserving evidence; it must be usable without another agent run") and are not an architecture decision by this QA-to-RED task — they document the contract the new tests exercise:

- `invokeKillSwitch(envelope, request) -> { kill_switch_state: 'armed'|'triggered', decision: 'ALLOW'|'STOP_AND_FIX', evidence_preserved, preserved_decision_records }` — standalone entrypoint, independently invocable (no active job/dispatch context required); only `request.source === 'human_cs2'` with a human CS2 actor can set `kill_switch_state` to `'triggered'`; any other source returns `STOP_AND_FIX` and leaves `kill_switch_state` at `'armed'`; when `existing_decision_records` is supplied, the result must preserve it unchanged under `preserved_decision_records` and set `evidence_preserved: true`.
- `evaluateSafetyEnvelope(...)` (already assumed above) must additionally return `{ decision: 'STOP_AND_FIX', reason_code: 'KILL_SWITCH_TRIGGERED' }` whenever `envelope.kill_switch_state === 'triggered'`, regardless of the envelope's other fields being otherwise valid — this blocks new dispatch.
- `evaluateRetryGate(envelope, retryRequest) -> { decision, reason_code }` — must return `{ decision: 'STOP_AND_FIX', reason_code: 'KILL_SWITCH_TRIGGERED' }` when `envelope.kill_switch_state === 'triggered'` — this blocks retries.
- `evaluateMergeGate(envelope, mergeRequest) -> { decision, reason_code }` — same blocking behavior for merge actions.
- `evaluateSuccessorReleaseGate(envelope, successorRequest) -> { decision, reason_code }` — same blocking behavior for successor release.

### Secret scan (addendum)

`runtime-tools-secret_scanning` run against both changed test files (`.github/scripts/pit-cs2-controller.test.js`, `.github/scripts/pit-cs2-controller-workflow.test.js`): **no secrets detected**.

### Explicit non-claims (addendum)

This addendum does **not** claim: GREEN status, build-to-green readiness, handover, final assurance, an ASSURANCE-TOKEN, or merge readiness. No implementation-builder appointment is made or implied. This remains QA-to-RED only, issued under the same appointment (`.agent-admin/builder-appointments/pr-2061-w0-qa-to-red-20261004.md`) in response to Foreman QP's identified scope omission; it is not a new appointment and does not expand authorized paths beyond the three already granted.
