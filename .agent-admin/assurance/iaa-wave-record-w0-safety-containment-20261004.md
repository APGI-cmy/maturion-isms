# IAA Wave Record — W0 Safety Envelope and Decision-Record Containment — 2026-10-04

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "w0-safety-containment-20261004"
  pr: "#2061"
  issue: "#2053 — W0: safety envelope and decision-record containment"
  branch: "copilot/implement-safety-envelope-containment"
  repository: "APGI-cmy/maturion-isms"
  current_head_sha: "8cc4b9450e13e6355e7735db8dd78974eedfc7f9"
  bound_task_record: ".agent-admin/prs/pr-2061/wave-current-tasks.md"
  bound_scope_declaration: ".agent-admin/scope-declarations/pr-2061.md"
  bound_baseline_evidence: ".agent-admin/evidence/pr-2061-w0-control-evidence-map.md"
  work_item_id: "W0-2053"
  cs2_authorization: "PR #2061 comment 5978529004 (2026-10-04)"
  qualifying_tasks:
    - task_id: "W0-2053-A"
      owner: "foreman-v2-agent"
      summary: "Establish the truthful FO-001–FO-019 control/evidence baseline and frozen W0 scope."
      status_at_prebrief: "IN_PROGRESS"
      assurance_category: "GOVERNANCE_AUDIT (admin/evidence baseline only — no canon, workflow, or runtime file touched)"
    - task_id: "W0-2053-B"
      owner: "independent-assurance-agent"
      summary: "Produce the canonical IAA pre-brief for this PR-scoped wave record (this artifact)."
      status_at_prebrief: "COMPLETE_ON_COMMIT_OF_THIS_RECORD"
      assurance_category: "GOVERNANCE_AUDIT — self-produced Pre-Brief artifact; IAA does not self-review; final assurance on this task is out of scope for IAA and rests with Foreman/CS2 process integrity"
    - task_id: "W0-2053-C"
      owner: "qa-builder"
      summary: "Create executable QA-to-RED coverage only for the frozen safety-envelope, decision-record, and kill-switch/circuit-breaker requirements. No implementation builder appointment; no controller behavior or activation change."
      status_at_prebrief: "BLOCKED_ON_IAA_PREBRIEF — UNBLOCKED BY THIS RECORD'S COMMIT"
      assurance_category: "AMBIGUOUS/MIXED pending declared file paths — plausible overlays are GOVERNANCE_EVIDENCE (temporal/evidence-type integrity for the decision-record and FO register) and PRE_BUILD_GATES (QA-to-Red is canonical Stage 6 of the 12-stage pre-build model). Per AMBIGUITY RULE (FAIL-ONLY-ONCE A-003), ambiguity resolves to MANDATORY full IAA re-invocation at QA-to-RED delivery and again at any later implementation-builder gate — it does NOT resolve to EXEMPT."
  applicable_overlay: "AMBIGUOUS/MIXED at pre-brief time — GOVERNANCE_EVIDENCE and PRE_BUILD_GATES both apply once W0-2053-C file paths are declared; full category re-classification is mandatory at the next IAA invocation (do not carry forward this provisional label per FAIL-ONLY-ONCE A-022)."
  anti_regression_obligations: "yes — FUNCTIONAL-BEHAVIOUR-REGISTRY.md and FAIL-ONLY-ONCE.md reviewed. No niggle pattern currently maps to this PR because no implementation or runtime code exists yet; the registry MUST be re-applied in full at W0-2053-C QA-to-RED review and at any future implementation-builder review, since QA-to-RED and implementation are BUILD-class artifacts under FAIL-ONLY-ONCE A-034."
  qa_to_red_gate:
    status: "ALLOWED_AFTER_THIS_PREBRIEF"
    condition: "Foreman may appoint qa-builder for W0-2053-C only, strictly bounded to executable RED test authorship for the frozen safety-envelope, decision-record, and kill-switch/circuit-breaker requirements below. No controller, schema, workflow, or production code may be activated or changed by this appointment."
  implementation_builder_appointment:
    status: "FORBIDDEN_UNTIL_FOREMAN_ACCEPTS_EXECUTABLE_RED_EVIDENCE"
    condition: "An implementation-builder appointment is NOT authorized by this pre-brief or by this wave record under any circumstance. It requires: (1) qa-builder returns executable RED evidence for W0-2053-C, (2) Foreman independently evaluates that RED baseline as genuinely RED (failing for the right reason, not malformed/erroring), and (3) a separate, explicitly accepted route/appointment record. This pre-brief does not pre-authorize that future route."
  w0_risk_modes_and_required_qa_scope:
    - mode: "fail_closed"
      requirement: "Absent, malformed, expired, task-inconsistent, or unmeasurable safety envelopes must RED-fail closed (block/deny), never silently pass or default-open."
      qa_scope: "RED tests for each of: missing envelope, malformed envelope, expired envelope, task-inconsistent envelope, and unmeasurable/unparseable envelope — each must assert a closed (blocking) outcome."
    - mode: "human_reset_only"
      requirement: "Circuit-breaker reset authority is human CS2 only. No webhook, agent, token, comment, PR, or automated retry may reset a tripped breaker."
      qa_scope: "RED tests asserting that webhook-triggered, agent-triggered, token-triggered, comment-triggered, PR-triggered, and automatic-retry reset attempts are all rejected; only an explicit human-CS2-attributed reset path may succeed (or remains unimplemented and therefore untested-as-absent, not falsely passing)."
    - mode: "exact_limit_enforcement"
      requirement: "Exact, non-approximate enforcement of: maximum active work items = 1; material remediation attempts = 1; dispatch runtime = 30 minutes; total automated runtime per work item = 2 hours; spend control = runtime-only (no live spend/telemetry in W0)."
      qa_scope: "RED tests at the exact boundary and one unit past it for each limit (e.g., 2nd active work item, 2nd remediation attempt, 30:01 dispatch runtime, 2:00:01 total runtime) — off-by-one must trip, not silently pass."
    - mode: "deterministic_decision_record"
      requirement: "The decision record must cover every factual field required by GOVERNANCE_FAILURE_OUTENGINEERING_STRATEGY.md §5.2 and must produce an identical, deterministic outcome for identical input."
      qa_scope: "RED tests asserting field-completeness against the full §5.2 field list, plus repeated-identical-input determinism tests (same input twice must yield byte-identical or field-identical decision records) and a typed refusal for any unknown/unrecognized state."
    - mode: "one_trip_decision"
      requirement: "Exactly one typed LOOP_BREAK or BUDGET_TRIP event may be emitted per qualifying condition — never zero, never duplicated, never reordered."
      qa_scope: "RED tests for duplicate-event suppression, reordered-event handling, and an assertion that exactly one typed LOOP_BREAK or BUDGET_TRIP is recorded per trip condition (not zero, not more than one)."
    - mode: "simulated_24_hour_no_live_spend"
      requirement: "A simulated 24-hour repeat-event sequence must be exercised with no live spend, paid call, or production side effect."
      qa_scope: "RED test harness simulating a compressed/mocked 24-hour repeat-event timeline entirely in-process or against mocks/fakes — asserting zero live spend, zero paid-call invocation, and correct envelope/limit/breaker behavior across the simulated window."
  required_build_gates:
    - "Keep the PR bound to `.agent-admin/prs/pr-2061/wave-current-tasks.md`, PR #2061, issue #2053, branch `copilot/implement-safety-envelope-containment`, work item `W0-2053`, and current head `8cc4b9450e13e6355e7735db8dd78974eedfc7f9`."
    - "No controller, workflow, schema, test runtime wiring, protected Tier 1/2/3, or CANON file may be created or modified by W0-2053-C; QA-to-RED artifacts must be test/spec files only, expressing RED outcomes against not-yet-implemented behavior."
    - "Do not treat this PRE-BRIEF as, or convert it into, an ASSURANCE-TOKEN, final assurance, merge-readiness claim, or activation of any W0 limit, kill switch, or circuit breaker."
    - "Do not edit, regenerate, or rebind archival PR #2048 or PR #2057 wave records; the W3 historic-reference scan defect (W0-BLK-002) is recorded for the W3 controller route only and is out of scope here."
    - "Do not modify `.agent-admin/prs/pr-2061/wave-current-tasks.md`, `.agent-admin/scope-declarations/pr-2061.md`, or `.agent-admin/evidence/pr-2061-w0-control-evidence-map.md` as part of producing or acting on this pre-brief."
  expected_qa_scope:
    - "Verify only W0-2053-C (QA-to-RED) is pursued next for PR #2061; no implementation-builder task may be opened from this record."
    - "Verify QA-to-RED coverage addresses all six W0 risk modes above: fail-closed, human-reset-only, exact-limit enforcement, deterministic decision record, one-trip decision, and simulated 24-hour no-live-spend."
    - "Verify the QA-to-RED suite is genuinely RED (fails for the correct reason — absent/not-yet-implemented behavior — not malformed, erroring, or vacuously passing)."
    - "Verify no QA-to-RED artifact activates, wires, or exercises live controller/runtime/production code paths."
  high_risk_failure_modes:
    - "QA-to-RED tests are authored against mocked/stubbed implementations that make them pass (GREEN) rather than genuinely RED against absent behavior — this would mask the fail-closed requirement."
    - "An implementation-builder is appointed directly from this pre-brief without Foreman's separate acceptance of executable RED evidence, violating the required order in the task record."
    - "The W3 historic-reference scan defect (W0-BLK-002) is used as a pretext to edit archival #2048/#2057 wave records."
    - "Exact-limit tests use approximate/fuzzy boundaries (e.g. '>30 minutes-ish') instead of the exact values (30 minutes, 2 hours, 1 active item, 1 remediation attempt) specified in the baseline."
    - "The simulated 24-hour sequence is implemented against a live/paid call path instead of a fully simulated, no-spend harness."
    - "Provisional AMBIGUOUS/MIXED overlay classification from this pre-brief is silently carried forward as final at the next IAA invocation instead of being re-classified against the actual QA-to-RED diff (FAIL-ONLY-ONCE A-022)."
  required_builder_evidence:
    - "Executable, runnable QA-to-RED test files demonstrating RED (failing-for-the-right-reason) status for each of the six W0 risk modes."
    - "A PR-scoped evidence artifact at `.agent-admin/evidence/pr-2061-w0-qa-to-red.md` documenting test file paths, run command, and RED output."
    - "Confirmation that no controller/runtime/schema file was created or modified by the QA-to-RED task."
  ecap_required: false
  ecap_note: "Ceremony-admin appointment is not declared in `.agent-admin/prs/pr-2061/wave-current-tasks.md` at pre-brief time; no ACR-01–16 ceremony-admin checks apply to this PRE-BRIEF invocation."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## BINDING

- Bound task record: `.agent-admin/prs/pr-2061/wave-current-tasks.md`
- Bound scope declaration: `.agent-admin/scope-declarations/pr-2061.md`
- Bound baseline evidence: `.agent-admin/evidence/pr-2061-w0-control-evidence-map.md`
- Bound repository: `APGI-cmy/maturion-isms`
- Bound PR / Issue: `#2061` / `#2053`
- Bound branch: `copilot/implement-safety-envelope-containment`
- Bound work item: `W0-2053`
- Bound current head (submitted intake head): `8cc4b9450e13e6355e7735db8dd78974eedfc7f9`
- Observed branch head at PRE-BRIEF creation (verified via `git rev-parse` and `git log`): `8cc4b9450e13e6355e7735db8dd78974eedfc7f9` (commit "Record W0 governed intake baseline"), parent `d2485fa5d502bf8800a7df94bc3caef69cda30da` ("Initial plan")
- Bound base branch: `main`
- Ceremony-admin appointment: not declared in `.agent-admin/prs/pr-2061/wave-current-tasks.md` — treated as NO for this invocation

## PRE-BRIEF RECORD

- Trigger basis: PR #2061 is the PR-scoped W0 intake for safety-envelope and decision-record containment per issue #2053 and `governance/strategy/GOVERNANCE_FAILURE_OUTENGINEERING_STRATEGY.md` §§5.1, 5.2, 6, and 8. No qualifying triggering artifact (agent contract, canon, CI workflow, or protected governance file) is present in the current diff (`.agent-admin/evidence/pr-2061-w0-control-evidence-map.md`, `.agent-admin/prs/pr-2061/wave-current-tasks.md`, `.agent-admin/scope-declarations/pr-2061.md` only, verified via `git diff --name-only origin/main...HEAD`). The controlling trigger for this pre-brief is the Phase 0 PRE-BRIEF protocol itself (IAA mandatory per the resolved PR-scoped task record), not an AGENT_CONTRACT/CANON_GOVERNANCE/CI_WORKFLOW event.
- Anti-regression review: `FAIL-ONLY-ONCE.md` and `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` reviewed. No BUILD/AAWP_MAT niggle pattern is yet triggered because no test or implementation code exists in this PR at pre-brief time. The registry and niggle-pattern library MUST be reapplied in full once W0-2053-C QA-to-RED artifacts are committed.
- QA-to-RED authorization: Per this record, Foreman MAY appoint `qa-builder` for W0-2053-C only, strictly bounded to the frozen safety-envelope, decision-record, and kill-switch/circuit-breaker requirements and the six W0 risk modes enumerated above. No controller, schema, workflow, or production behavior may be activated.
- Implementation-builder prohibition: An implementation-builder appointment is explicitly and absolutely **FORBIDDEN** until Foreman independently accepts executable RED evidence returned by `qa-builder` for W0-2053-C. This pre-brief does not authorize, pre-approve, or foreshadow that future appointment.
- Scope integrity: This record does not modify, rebind, or touch `.agent-admin/prs/pr-2061/wave-current-tasks.md`, `.agent-admin/scope-declarations/pr-2061.md`, `.agent-admin/evidence/pr-2061-w0-control-evidence-map.md`, any runtime/controller file, any protected Tier 1/2/3 or CANON file, any `.github/workflows/` file, or the historic `.agent-admin/assurance/iaa-wave-record-pr-2048-*.md` / `iaa-wave-record-pr-2057-*.md` records.
- Status: **PRE-BRIEF ONLY — NO FINAL IAA TOKEN OR REJECTION ISSUED IN THIS INVOCATION.** No ASSURANCE-TOKEN, REJECTION-PACKAGE, or merge-readiness claim is made or implied by this artifact.

## VALIDATION PERFORMED

- Phase 1 preflight: 4/4 silent checks PASS (contract YAML parseable and identity extracted; Tier 2 knowledge index present with all required files listed as PRESENT/ACTIVE; `governance/CANON_INVENTORY.json` hashes verified programmatically — 0 null/empty/zeroed `file_hash_sha256` values found; `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` present; FAIL-ONLY-ONCE.md loaded, no open unresolved breach blocking this invocation).
- Confirmed authoritative task record resolution order per Phase 0 Step 0.2: `.agent-admin/prs/pr-2061/wave-current-tasks.md` is present and used (PR-bound, highest priority); wave-level and legacy fallback records were not used.
- Read `.agent-admin/scope-declarations/pr-2061.md` and `.agent-admin/evidence/pr-2061-w0-control-evidence-map.md` in full; both are frozen/baseline and were not modified.
- Verified submitted intake head via `git fetch` + `git rev-parse HEAD` + `git log --oneline`: local checkout HEAD `8cc4b9450e13e6355e7735db8dd78974eedfc7f9` matches the instructed submitted intake head exactly; parent commit `d2485fa5d502bf8800a7df94bc3caef69cda30da` matches the task record's "Initial planning head SHA".
- Verified current diff scope via `git diff --name-only origin/main...HEAD`: exactly 3 files changed (`wave-current-tasks.md`, `scope-declarations/pr-2061.md`, `pr-2061-w0-control-evidence-map.md`); no controller, workflow, schema, CANON, or test file present in the diff.
- Confirmed historic records `.agent-admin/assurance/iaa-wave-record-pr-2048-cs2-direct-codexadvisor-recovery-hardening-20260919.md` and `.agent-admin/assurance/iaa-wave-record-pr-2057-active-cs2-successor-20260923.md` exist and were read-only referenced for format precedent; neither was opened for write.
- Applied AMBIGUITY RULE (FAIL-ONLY-ONCE A-003) to W0-2053-C: future QA-to-RED file paths are not yet known, so overlay classification is left explicitly provisional/AMBIGUOUS rather than guessed, with mandatory full re-classification required at the next IAA invocation (FAIL-ONLY-ONCE A-022).
- No merge-gate-parity check, CORE-020/CORE-021 evaluation, category-overlay substance evaluation, or verdict was performed — these are Phase 3/4 activities and are explicitly out of scope for a Phase 0 PRE-BRIEF invocation.
