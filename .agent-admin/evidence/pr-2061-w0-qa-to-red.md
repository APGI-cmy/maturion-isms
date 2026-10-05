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

---

## Addendum 2 — W0-2053-D: schema-focused RED coverage for the versioned safety-envelope and decision-record schemas and the controller validation interface (2026-10-05)

- pr: #2061
- issue: #2053
- work_item_id: W0-2053 (task **W0-2053-D**)
- wave_id: W0-SAFETY-CONTAINMENT-20261004
- owner: qa-builder
- bound task record: `.agent-admin/prs/pr-2061/wave-current-tasks.md` — task `W0-2053-D`: "Add schema-focused RED assertions proving the required versioned safety-envelope and decision-record schemas and validator interface are absent." `authorized_test_paths`: `.github/scripts/pit-cs2-controller.test.js`, `.github/scripts/pit-cs2-controller-workflow.test.js`. `constraints`: RED-only; no implementation or schema creation.
- appointment: same as Addendum 1, issued under `.agent-admin/builder-appointments/pr-2061-w0-qa-to-red-20261004.md`; no new appointment was created and no authorized path was expanded beyond what that appointment and the task record already grant.
- bound scope declaration: `.agent-admin/scope-declarations/pr-2061.md` (`SCOPE_FROZEN: YES`, `CURRENT_HEAD_BINDING: d2485fa5d502bf8800a7df94bc3caef69cda30da`); frozen task record head at the time of this addendum: `e0a0280482ca509b1fc3be6b52fd39e79c1f9a4f` ("Freeze W0 schema implementation scope") — not modified by this addendum.
- canonical IAA pre-brief: `.agent-admin/assurance/iaa-wave-record-w0-safety-containment-20261004.md` (unchanged, read-only referenced).
- status: **QA-to-RED ONLY — NOT GREEN, NOT HANDOVER, NOT FINAL ASSURANCE, NOT MERGE-READY. No implementation builder is appointed by this addendum.**

### Scope and authorized paths touched

Only these paths were created or modified by this task:

- `.github/scripts/pit-cs2-controller.test.js` (append-only: 161 added lines, 0 removed — 15 new tests appended after the existing 41 tests)
- `.agent-admin/evidence/pr-2061-w0-qa-to-red.md` (this addendum)

`.github/scripts/pit-cs2-controller-workflow.test.js` was **not** modified. Judgment call (Tier-2 procedural, documented per the Constitutional Sandbox Pattern): the task instruction authorized a workflow-test change "only if necessary." The required proof — that the two versioned schema files and the controller schema-validation interface are absent — is fully and unambiguously demonstrated at the controller-module level (file-existence/content checks via `fs`, and direct calls to the not-yet-existing `controller.validateSafetyEnvelopeAgainstSchema`/`controller.validateDecisionRecordAgainstSchema` functions). No additional workflow-entrypoint assertion was needed to prove that absence, so the workflow test file was left untouched to minimize footprint, consistent with "ONLY missing" assertions. No controller implementation (`pit-cs2-controller.js`), workflow (`.github/workflows/*.yml`), schema file, protected contract/CANON, deployment, scope/task/appointment/IAA artifact, or historic PR #2048/#2057 record was created, modified, or touched. Verified with `git status --short` and `git diff --stat` showing only the one test file and this evidence file as changed.

### What was added and why each test is genuinely RED

Confirmed before writing any test: `.github/cs2-controller/safety-envelope.schema.json` and `.github/cs2-controller/decision-record.schema.json` do not exist anywhere in the repository (only the unrelated, pre-existing `.github/cs2-controller/work-register.schema.json` from the earlier PR #2046 pilot is present), and `pit-cs2-controller.js`'s `module.exports` (verified by direct inspection of the export list) contains no `validateSafetyEnvelopeAgainstSchema`, `validateDecisionRecordAgainstSchema`, or `evaluateSafetyEnvelope` function. Every new test below therefore fails for exactly one of two reasons: (a) the schema file is absent (`fs.existsSync` returns `false`, or `fs.readFileSync` throws `ENOENT`), or (b) the validator/evaluator function is absent (`TypeError: controller.<fn> is not a function`). No test uses `.skip()`, `.todo()`, a stub, a mock-around, a try/catch that swallows the failure, or a weakened assertion to force a false GREEN — each failure is attributable solely to the absent required artifact, confirmed individually for every new test in the exact run output below.

`W0_SAFETY_ENVELOPE_FIELDS` (the 14-field array already defined in the file for the accepted W0-2053-C baseline) and `W0_DECISION_RECORD_FIELDS` (the 22-field array, likewise already accepted) are reused verbatim as the authoritative Strategy §5.1 and §5.2 field lists, so the new schema-content assertions stay exactly aligned with the already-accepted behavioural RED tests — no new field list was invented.

| Required coverage (this task) | New test(s) | Fails because |
|---|---|---|
| Both schema files exist at the exact governed paths | `W0: a versioned, machine-validatable safety-envelope schema file exists at .github/cs2-controller/safety-envelope.schema.json`; `W0: a versioned, machine-validatable decision-record schema file exists at .github/cs2-controller/decision-record.schema.json` | `fs.existsSync(...)` is `false` for both paths (file absent) |
| Both schemas are versioned, machine-validatable JSON Schema | `W0: the safety-envelope schema is valid, versioned JSON Schema (...)`; `W0: the decision-record schema is valid, versioned JSON Schema (...)` | `fs.readFileSync` throws `ENOENT` before any `$schema`/`schema_version` assertion runs |
| Safety schema requires exactly the 14 Strategy §5.1 fields | `W0: the safety-envelope schema requires exactly the 14 Strategy §5.1 fields, no more and no fewer` | `fs.readFileSync` throws `ENOENT` |
| Safety schema encodes the exact approved W0 limits (1 active job, 1 remediation attempt, 1 merge attempt, 30-min dispatch ceiling, 2-hour total runtime, runtime-only spend) | `W0: the safety-envelope schema encodes the exact approved W0 limits (...)` | `fs.readFileSync` throws `ENOENT` |
| Safety schema restricts reset authority to human-CS2-only | `W0: the safety-envelope schema restricts reset_authority to human-CS2-only, excluding every automated reset source` | `fs.readFileSync` throws `ENOENT` |
| Decision-record schema requires exactly the 22 Strategy §5.2 fields | `W0: the decision-record schema requires exactly the 22 Strategy §5.2 fields, no more and no fewer` | `fs.readFileSync` throws `ENOENT` |
| Decision-record schema pins a fixed, deterministic shape (`additionalProperties: false`) | `W0: the decision-record schema forbids additional properties, pinning a single fixed deterministic shape` | `fs.readFileSync` throws `ENOENT` |
| Decision-record schema forces a typed refusal for unknown state (closed `decision`/`reason_code` enum incl. `UNKNOWN_STATE`) — determinism/unknown-state behaviour as appropriate to a schema validator | `W0: the decision-record schema constrains decision and reason_code to a closed, typed enum including the mandatory UNKNOWN_STATE refusal, never an open/free-text value` | `fs.readFileSync` throws `ENOENT` |
| A controller validation interface validates the safety envelope against its schema before allowing use | `W0: a controller interface validates a well-formed safety envelope against the versioned schema before allowing any use`; `W0: the safety-envelope schema validator rejects an envelope that violates an exact approved limit, with typed errors, not a silent pass` | `TypeError: controller.validateSafetyEnvelopeAgainstSchema is not a function` |
| A controller validation interface validates the decision record against its schema before allowing use | `W0: a controller interface validates a well-formed decision record against the versioned schema before allowing any append`; `W0: the decision-record schema validator issues a typed refusal for an unrecognized state_before, never a silent pass or inferred readiness` | `TypeError: controller.validateDecisionRecordAgainstSchema is not a function` |
| Schema validation gates evaluation (validator runs before field-level enforcement) | `W0: the controller refuses to evaluate a safety envelope that fails versioned schema validation, before any field-level enforcement runs` | `TypeError: controller.validateSafetyEnvelopeAgainstSchema is not a function` |

### Exact run commands and RED output

```
$ node --version
v22.23.3

$ node --test .github/scripts/pit-cs2-controller.test.js
# tests 56
# suites 0
# pass 9
# fail 47
# cancelled 0
# skipped 0
# todo 0
exit code: 1
```

All 9 pre-existing (PR #2046 pilot) tests remain GREEN (`ok 1`–`ok 9`, unchanged). All 32 previously-accepted W0-2053-C tests remain RED, unchanged (`not ok 10`–`not ok 41`). All 15 new W0-2053-D schema tests are RED (`not ok 42`–`not ok 56`):

- `not ok 42` — safety-envelope schema file exists — `AssertionError [ERR_ASSERTION]: expected .github/cs2-controller/safety-envelope.schema.json to exist — false !== true`
- `not ok 43` — decision-record schema file exists — `AssertionError [ERR_ASSERTION]: expected .github/cs2-controller/decision-record.schema.json to exist — false !== true`
- `not ok 44` — safety-envelope schema valid/versioned — `Error: ENOENT: no such file or directory, open '.../.github/cs2-controller/safety-envelope.schema.json'`
- `not ok 45` — decision-record schema valid/versioned — `Error: ENOENT: no such file or directory, open '.../.github/cs2-controller/decision-record.schema.json'`
- `not ok 46` — safety-envelope schema requires exactly 14 fields — `ENOENT` (same path as above)
- `not ok 47` — safety-envelope schema encodes exact W0 limits — `ENOENT`
- `not ok 48` — safety-envelope schema restricts reset_authority — `ENOENT`
- `not ok 49` — decision-record schema requires exactly 22 fields — `ENOENT` (decision-record path)
- `not ok 50` — decision-record schema forbids additional properties — `ENOENT`
- `not ok 51` — decision-record schema constrains decision/reason_code enum — `ENOENT`
- `not ok 52` — validator validates well-formed safety envelope — `TypeError: controller.validateSafetyEnvelopeAgainstSchema is not a function`
- `not ok 53` — validator rejects an envelope violating an exact limit — `TypeError: controller.validateSafetyEnvelopeAgainstSchema is not a function`
- `not ok 54` — validator validates well-formed decision record — `TypeError: controller.validateDecisionRecordAgainstSchema is not a function`
- `not ok 55` — validator issues typed refusal for unrecognized state_before — `TypeError: controller.validateDecisionRecordAgainstSchema is not a function`
- `not ok 56` — evaluator refuses a schema-invalid envelope before field-level checks — `TypeError: controller.validateSafetyEnvelopeAgainstSchema is not a function`

Every one of the 15 failures above is attributable solely to the absent schema file or absent validator/evaluator function — confirmed individually, not assumed — never to a malformed fixture, incorrect assertion syntax, or test-runner error unrelated to the required behaviour.

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

This file was **not modified** by this addendum. Its result (3 pass, 5 fail) is unchanged from the Addendum 1 baseline, confirmed by re-running it after this addendum's edits — included here only to prove no regression was introduced by touching the sibling test file.

Full captured logs (not committed, reproducible on demand): `/tmp/w0d-test1.log`, `/tmp/w0d-test2.log` from this session.

### Confirmation: no controller/runtime/schema file was touched

```
$ git status --short
 M .github/scripts/pit-cs2-controller.test.js

$ git diff --stat .github/scripts/pit-cs2-controller.test.js
 .github/scripts/pit-cs2-controller.test.js | 161 +++++++++++++++++++++++++++
 1 file changed, 161 insertions(+)
```

No lines were removed (append-only); no existing test was weakened, skipped, or deleted. `pit-cs2-controller.js`, `.github/scripts/pit-cs2-controller-workflow.test.js`, `.github/workflows/*.yml`, `.github/cs2-controller/safety-envelope.schema.json`, `.github/cs2-controller/decision-record.schema.json` (both confirmed absent, not created), `governance/`, `.agent-admin/prs/pr-2061/wave-current-tasks.md`, `.agent-admin/scope-declarations/pr-2061.md`, `.agent-admin/evidence/pr-2061-w0-control-evidence-map.md`, `.agent-admin/builder-appointments/pr-2061-w0-qa-to-red-20261004.md`, `.agent-admin/assurance/iaa-wave-record-w0-safety-containment-20261004.md`, and the historic `.agent-admin/assurance/iaa-wave-record-pr-2048-*.md` / `iaa-wave-record-pr-2057-*.md` records are all byte-identical to the pre-addendum commit (not in the diff).

### Secret scan

`runtime-tools-secret_scanning` run against the changed test file (`.github/scripts/pit-cs2-controller.test.js`): **no secrets detected**.

### API surface assumed by these new RED tests (for the future implementation builder)

Consistent with the framing of the original evidence and its first addendum: these names, paths, and shapes are derived directly from Strategy §5.1/§5.2 and from the already-accepted `w0BaselineEnvelope()`/`w0SampleEvent()` fixtures; they are not a new architecture decision by this QA-to-RED task — they document the contract the new tests exercise so a future implementation builder can satisfy it precisely:

- `.github/cs2-controller/safety-envelope.schema.json` — a JSON Schema (`$schema` referencing json-schema.org, `type: object`, explicit semver `schema_version`) whose `required` and `properties` keys are exactly the 14 `W0_SAFETY_ENVELOPE_FIELDS`, with `maximum_active_jobs`/`maximum_remediation_attempts`/`maximum_merge_attempts` each constrained to `const: 1`, `maximum_dispatch_runtime` constrained to `{ unit: 'seconds' (const), value: 1800 (const) }`, `maximum_total_runtime` constrained to `{ unit: 'seconds' (const), value: 7200 (const) }`, `maximum_spend.properties.mode.enum` equal to `['runtime_only']`, and `reset_authority.enum` equal to `['human_cs2_only']` (excluding `webhook`/`agent`/`token`/`comment`/`pull_request`/`automatic_retry`).
- `.github/cs2-controller/decision-record.schema.json` — a JSON Schema (same versioning conventions) whose `required` and `properties` keys are exactly the 22 `W0_DECISION_RECORD_FIELDS`, with `additionalProperties: false` (pinning a fixed, deterministic shape) and `decision`/`reason_code` each constrained to a closed `enum` that includes `ALLOW`, `STOP_AND_FIX`, `PROVEN_EXTERNAL_BOUNDARY` (for `decision`) and `UNKNOWN_STATE` (for `reason_code`), so an unrecognized `state_before` can only ever resolve to one of these typed values, never an open/free-text string.
- `validateSafetyEnvelopeAgainstSchema(envelope) -> { valid: boolean, errors: Array }` — loads and validates against `safety-envelope.schema.json`; `errors` is empty only when `valid` is `true`.
- `validateDecisionRecordAgainstSchema(record) -> { valid: boolean, errors: Array }` — loads and validates against `decision-record.schema.json`; `errors` is empty only when `valid` is `true`.
- `evaluateSafetyEnvelope(...)` (already assumed above) must additionally call `validateSafetyEnvelopeAgainstSchema` first and return `{ decision: 'STOP_AND_FIX', reason_code: 'ENVELOPE_SCHEMA_INVALID' }` whenever schema validation fails, before any field-level fail-closed check (missing/expired/task-inconsistent/unmeasurable) runs.

### Blockers

None. The task's required proof — that the two versioned schema files and the controller schema-validation interface are absent — is represented by at least one genuinely RED test per requirement (file existence ×2, versioning ×2, §5.1 field-completeness, §5.1 exact limits, §5.1 reset authority, §5.2 field-completeness, §5.2 fixed shape, §5.2 typed-refusal/determinism posture, validator interface ×4, validator-gates-evaluator ×1). No governance gap, authority boundary, or tooling blocker was encountered.

### Mandatory process improvement reflection

1. **What went well:** Reusing the already-accepted `W0_SAFETY_ENVELOPE_FIELDS`/`W0_DECISION_RECORD_FIELDS` arrays and `w0BaselineEnvelope()`/`w0SampleEvent()` fixtures kept the new schema-content assertions exactly aligned with the previously accepted behavioural RED baseline, with zero risk of inventing a conflicting field list or limit value.
2. **What failed, was blocked, or required rework:** Nothing was blocked. One internal judgment call was made (documented above) to leave the workflow test file untouched since the controller-module-level tests already fully proved the required absence without needing a workflow-level assertion.
3. **What process, governance, or tooling changes would have improved this build:** None identified beyond what is already in place; the existing task record's `authorized_test_paths` and the appointment's path boundary made the scope unambiguous before any test was written.
4. **Governance-learning compliance (BL-016, BL-018, BL-019, BL-022, BL-024, BL-029):** BL-018/BL-019 (QA range/semantic alignment) — satisfied; every new assertion maps directly to a named Strategy §5.1/§5.2 requirement or the task's explicit "validator interface" requirement, with no out-of-range assertion added. BL-024 (constitutional sandbox) — the workflow-test-omission judgment call is a Tier-2 procedural choice, documented with rationale; no Tier-1 constitutional requirement (zero test debt, 100% GREEN eventually, no weakened assertions) was touched. BL-029 (tracker update) — not applicable; this is a QA-to-RED (not wave-completion) delivery and `BUILD_PROGRESS_TRACKER.md` update is a W0-2053-E implementation-wave concern, not this task's. BL-016/BL-022 — no ratchet condition or BL-022-specific trigger applies to a RED-only, no-implementation delivery.
5. **Actionable improvement to layer up to governance canon:** None beyond what is already captured in the task record; the already-precise `authorized_test_paths`/`constraints` fields in `wave-current-tasks.md` made this a low-ambiguity follow-up.

### Explicit non-claims

This addendum does **not** claim: GREEN status, build-to-green readiness, handover, final assurance, an ASSURANCE-TOKEN, or merge readiness. No implementation-builder appointment is made or implied. This remains QA-to-RED only. No implementation builder is appointed by this delivery; per the task record's required order, Foreman's independent evaluation of this RED baseline and any subsequent appointment of `pit-specialist` for W0-2053-E are Foreman's actions, not this builder's.
