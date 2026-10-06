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

## IAA Assurance Verdict — Final Invocation (2026-10-06)

### Binding

- Bound PR / issue: `#2061` / `#2053`
- Bound current head (independently confirmed via `git fetch origin pull/2061/head` + `git rev-parse` + PR API `head.sha`): `5a3f280755e67f3a4afae4ed21c43e4895f9ac7c`
- Bound task record: `.agent-admin/prs/pr-2061/wave-current-tasks.md` (status at invocation: `FOREMAN_QP_PASS_ECAP_COMPLETE_IAA_PENDING`)
- Bound ECAP admin bundle: `.agent-admin/prs/pr-2061/ecap-admin-bundle-20261006.md` (`ADMIN_VALIDATED`, bound/validated head `216e8f7c3c98a0a901a8444ab4afc50f3fe17bd8`)
- Diff independently re-verified between ECAP-validated head and this bound current head (`216e8f7c..5a3f280`): exactly 3 files changed, all `.agent-admin/**` administrative (ECAP's own bundle + disposition lines), zero controller/schema/workflow/test changes — confirms ECAP's pass was admin-only over the frozen implementation.
- Full base→head diff independently re-computed (`659fed07..5a3f280`): 15 files, matches `.agent-admin/scope-declarations/pr-2061.md` file list exactly; 0 of the 15 files appear in `governance/CANON_INVENTORY.json` (217 entries checked).

### Phase 1 preflight (silent, this invocation)

4/4 PASS — YAML parsed, Tier 2 index files all present, `governance/CANON_INVENTORY.json` independently re-parsed (217 canons, 0 null/empty/zeroed `file_hash_sha256`), `FAIL-ONLY-ONCE.md` loaded, no open unresolved breach found.

### Phase 2 alignment

- Invocation: PR #2061/#2053 | Invoked by: CS2 (direct task) | Produced by: pit-specialist (implementation), qa-builder (RED), foreman-v2-agent (intake/QP), execution-ceremony-admin-agent (bounded admin pass) | Ceremony-admin: YES (ECAP admin bundle present and bound) — ACR-01–16 applied below | STOP-AND-FIX: ACTIVE
- Independence: CONFIRMED — IAA produced only the Phase 0 PRE-BRIEF artifact (task W0-2053-B) and did not author, draft, or contribute to any controller, schema, workflow, test, or evidence artifact under review.
- A-041 Diff-First Classification: actual changed files independently computed from `git diff` (list above) = `.github/scripts/pit-cs2-controller.js`, `.github/scripts/pit-cs2-controller.test.js`, `.github/scripts/pit-cs2-controller-workflow.test.js`, `.github/workflows/pit-cs2-controller.yml`, `.github/cs2-controller/*.schema.json`, plus `.agent-admin/**` administrative artifacts. Declared category candidates at pre-brief (GOVERNANCE_EVIDENCE/PRE_BUILD_GATES) are superseded by the diff: this is now squarely **CI_WORKFLOW** (workflow file modified with new conditional job steps) with AAWP_MAT/PIT-module characteristics. Diff-derived category: `CI_WORKFLOW`. Match to any stale provisional label: NO — re-classified per FAIL-ONLY-ONCE A-022/A-041. SCOPE_DECLARATION parity: MATCH (all 15 files declared).
- Category: CI_WORKFLOW | IAA triggered: YES (mandatory, CI/workflow change) | Ambiguity: CLEAR (no ambiguity — a workflow file and its controlling script were committed).
- Checklist loaded: CORE-020, CORE-021 (IAA-retained) + CI_WORKFLOW overlay (OVL-CI-001 through OVL-CI-005) + ACR-01–16 (ceremony-admin appointed).

### Phase 3 — Substance evaluation

**A-001/A-002 (FAIL-ONLY-ONCE)**: IAA's own PRE-BRIEF invocation evidence is present (task W0-2053-B, this record). No agent-class exemption claimed anywhere in the bundle. PASS.

**CORE-020 (zero partial pass)**: All claims below are backed by hard, independently-reproduced artifacts, not agent attestation. No assumed passes. PASS as a methodology; see individual findings below for the one area where evidence is absent.

**CORE-021 (zero-severity-tolerance)**: No finding below is downgraded with "minor"/"cosmetic"/"low-impact" language. Findings are reported at face value.

| Check | Evidence independently obtained by IAA | Verdict |
|---|---|---|
| OVL-CI-001 Workflow policy correctness | Read full `pit-cs2-controller.js` (929 lines) and `pit-cs2-controller.yml` (183 lines). `evaluateSafetyEnvelope` correctly fails closed for missing/malformed/expired/task-inconsistent/unmeasurable/schema-invalid envelopes (lines 278–309). `enforceWorkItemLimits` uses strict `>` comparisons against exact consts 1/1/1800s/7200s (lines 316–334), confirmed by independently executing the boundary tests (30:00 ALLOW, 30:01 STOP_AND_FIX; 2:00:00 ALLOW, 2:00:01 STOP_AND_FIX). `resetCircuitBreaker`/`invokeKillSwitch` require `source==='human_cs2' && actor.type==='User' && actor.login===PILOT_CS2_LOGIN` (lines 350–362, 379–421) — independently confirmed webhook/agent/token/comment/PR/automatic_retry sources are all rejected by re-running the 6 negative tests plus the 1 positive test. `recordTripEvent` dedupes on `idempotency_key` (lines 475–482) — confirmed exactly-once behaviour under duplicate and reordered delivery. `buildDecisionRecord` forces `STOP_AND_FIX`/`UNKNOWN_STATE` for any `state_before` outside the closed set (lines 452–459). `maximum_stage_attempts` and `maximum_merge_attempts` are confirmed, by direct grep, to be read nowhere except the required-field presence list — never enforced, matching the "proposal-only, never silently activated" design intent. `simulateTwentyFourHourWindow` is a pure in-process loop with zero network/spend calls and halts at first trip (independently confirmed: 10,000-tick request halts at tick 3 for the 2-hour ceiling). | **PASS** |
| OVL-CI-002 Merge gate integrity | All 3 contractual required checks (`merge-gate/verdict`, `governance/alignment`, `stop-and-fix/enforcement`) independently confirmed `success` at bound head `5a3f280` via PR API. Full 49-check-run list fetched and reviewed: 0 non-skip failures/cancellations. No required check was removed, weakened, or made conditional by this diff. | **PASS** |
| OVL-CI-003 Silent failure risk | Reviewed all new/changed steps in `pit-cs2-controller.yml`: no `continue-on-error`, no unguarded exit-code suppression. The pre-existing `run()` claim/bind/observe path (lines 729–887) is untouched by this diff (confirmed via line-level diff — only new W0 functions and their comments were added; `run()` itself has zero changed lines). | **PASS** |
| OVL-CI-004 Environment parity | Single `ubuntu-latest` runner, no environment-specific branching introduced. N/A beyond that — no discrepancy found. | **PASS** |
| OVL-CI-005 CI evidence present | **A workflow file (`pit-cs2-controller.yml`) was modified, adding three entirely new `workflow_dispatch`-gated job steps** (`evaluate-envelope`, `reset-circuit-breaker`, `kill-switch` — the real, non-extracted wiring for the human-CS2-only reset and independently-invocable kill switch, which is the core W0-2053-C/E deliverable). Independently queried GitHub Actions: **zero `workflow_dispatch` runs exist for this workflow** (`list_workflow_runs` filtered to `workflow_dispatch` → `total_count: 0`). The only executed trigger at the bound head is `pull_request_target`, which takes the pre-existing, unchanged "claim, bind, or safely observe" branch only (`core.info('PR has no CS2 work-item binding; no action.')` — confirmed directly from the job log) — it never reaches the three new conditional steps. No PREHANDOVER/evidence artifact (`pr-2061-w0-qa-to-red.md`, `pr-2061-w0-control-evidence-map.md`, `wave-current-tasks.md`, `ecap-admin-bundle-20261006.md`, both builder-appointment records) invokes the required S-033 Inherent-Limitation-Exception substitute, and none of the three required substitutes (actionlint/yamllint output, documented pattern-parity comparison, explicit workflow_dispatch-retention statement) is present anywhere in the bundle. This is not even a case where the exception would cleanly apply: `workflow_dispatch` on this branch *could* have been manually invoked via `gh workflow run --ref copilot/implement-safety-envelope-containment` to produce real evidence before this review — it simply was not done. **Absence of evidence = failing check per CORE-020.** | **FAIL** |

**A-034/A-035 FUNCTIONAL-BEHAVIOUR-REGISTRY / niggle-pattern-library**: Reviewed both. No registered niggle pattern in either file maps to GitHub Actions workflow_dispatch/github-script wiring or Node.js CS2-controller logic (patterns are Next.js/Supabase/TanStack/Zustand stack-specific). No applicable pattern found; none silently skipped.

**Non-blocking observation (not a REJECTION ground)**: `.github/scripts/pit-cs2-controller.test.js` and `.github/scripts/pit-cs2-controller-workflow.test.js` are independently confirmed to pass in full — I executed `node --test` against both files at the bound head and obtained **73/73 pass, 0 fail/skip/todo**, matching the Foreman QP and ECAP claims exactly (hard CI_TEST-equivalent evidence, not accepted on attestation alone). However, no CI workflow in this repository executes these two files automatically (confirmed: `npm test` runs `vitest run` scoped to `modules/mat`, `modules/MMM`, `packages/ai-centre`, `api/` only per `vitest.config.ts` — `.github/scripts/**` is not included; no workflow greps/names these two files). This matches a pre-existing, repository-wide convention for this script category (`foreman-prehandover-lane-gate.test.js` and `iaa-prebrief-inject.test.js` are likewise never CI-executed, and were previously accepted under IAA wave record `iaa-wave-record-GOVERNANCE-2047-FOREMAN-CONVERGENCE-20260919.md`). Because this is consistent with established, previously-accepted repository practice and issue #2053 does not explicitly mandate continuous CI wiring (only that the tests exist and the required limits be "testable"), this is recorded as a residual risk for Foreman/CS2 follow-up, not a blocking finding in this invocation.

### A-039 Acceptance-Criteria Matrix (governing issue #2053)

| # | Governing-issue criterion | Required evidence type | Evidence reference | Independently verified |
|---|---|---|---|---|
| 1 | Truthful FO-001–FO-019 control baseline | ARTIFACT | `pr-2061-w0-control-evidence-map.md` | YES — read in full; labelled "BASELINE / NOT VERIFIED", no false closure |
| 2 | Versioned safety-envelope schema + validator, 14 required fields | STATIC_CODE + CI_TEST | `safety-envelope.schema.json`; `validateSafetyEnvelopeAgainstSchema` | YES — schema read in full; test re-executed |
| 3 | Deterministic decision-record schema + validator | STATIC_CODE + CI_TEST | `decision-record.schema.json`; `buildDecisionRecord` | YES — schema read in full; determinism test re-executed |
| 4 | Fail-closed kill-switch/circuit-breaker wired to real workflow entrypoint, human-reset-only, exactly-one-trip | CI_TEST (module) + LIVE/CI_RUN (workflow wiring) | module: `pit-cs2-controller.test.js`; workflow: `pit-cs2-controller-workflow.test.js` (static-match only) + `pit-cs2-controller.yml` | Module logic: YES (re-run, 73/73 pass). **Real workflow-entrypoint runtime execution: NO — zero workflow_dispatch runs exist (see OVL-CI-005 FAIL above)** |
| 5 | Focused QA-to-RED/regression tests for all 6 risk modes | CI_TEST | both test files | YES — re-executed, all 6 modes covered and passing |
| 6 | W0 evidence/control map separates implemented vs proposed, no false FO closure | ARTIFACT | `pr-2061-w0-control-evidence-map.md` | YES |
| 7 | All changed files within frozen PR-scoped scope declaration | ARTIFACT | `scope-declarations/pr-2061.md` | YES — 15/15 match |
| 8 | No active-CS2 activation/live merge/successor dispatch/Tier 1-2-3/CANON change | STATIC_CODE (diff) | full diff | YES — independently re-diffed against `CANON_INVENTORY.json`, 0 hits; `run()` untouched |

**Matrix status: INCOMPLETE — criterion 4's "wired to the real workflow entrypoint" clause has STATIC_CODE/claim-only evidence for actual runtime execution; the required CI_TEST/LIVE evidence class for the real GitHub Actions wiring is MISSING with no CS2 waiver on file (A-040 Evidence-Type Downgrade Prohibition applies: STATIC_CODE/pattern-match cannot substitute for the CI-run evidence this criterion requires).**

### A-042 Independent Risk Challenge

1. **What could still fail after merge?** The three new `workflow_dispatch`-gated steps (`evaluate-envelope`, `reset-circuit-breaker`, `kill-switch`) — the actual human-operable containment surface this wave exists to build — have never executed once in the real GitHub Actions runtime. A trivial wiring defect (env var name mismatch, JSON parse failure on a real `workflow_dispatch` string input, incorrect `require` path resolution under `actions/github-script@v7`, or an uncaught exception from malformed human-entered JSON) would only surface the first time a human CS2 actually needs to use the kill switch during a live incident — the worst possible time to discover it.
2. **What evidence would prove it does not fail?** A single successful `workflow_dispatch` run for each of the three new actions (or at minimum one exercising all three code paths), or the properly-invoked and documented S-033 exception (YAML lint + pattern-parity + dispatch-retention) if a live run is genuinely precluded.
3. **Is that evidence present?** NO — confirmed zero `workflow_dispatch` runs exist; no S-033 exception invoked anywhere in the bundle.
4. **Contradiction between issue intent, architecture, and PR evidence?** YES — issue #2053 requires "a fail-closed, independently invocable kill-switch/circuit-breaker control surface" as the central deliverable, and this PR's own evidence trail (QA-to-RED follow-up notes) explicitly states the correction was needed because the prior cut "never wired the kill switch to its existing `workflow_dispatch` trigger" — the wiring now exists in source form but has not been proven to execute.
5. **Would a reasonable production owner accept this as merge-ready?** NO — not for the one deliverable whose entire purpose is to be reliable under human-operated incident conditions, with zero runtime proof it executes without error.

**Challenge status: COMPLETE. Q3 = NO and Q5 = NO → REJECTED (not BLOCKED_PENDING_RUNTIME_EVIDENCE, since no CS2 waiver exists and the gap is remediable by the producing agents without new CS2 authorization — it requires only an evidentiary action already within the approved implementation paths).**

### ACR-01–16 (ceremony-admin appointed: YES)

Reviewed `.agent-admin/prs/pr-2061/ecap-admin-bundle-20261006.md` in full against all 16 triggers. ACR-01 (reconciliation summary): PRESENT (`## ECAP_RECONCILIATION_SUMMARY` with C1–C6 complete). ACR-02 (conflicting status wording): NONE — ECAP explicitly states `HANDOVER_ALLOWED: no` and does not claim an ASSURANCE-TOKEN. ACR-03 (ID consistency): PASS — PR/issue/branch/wave consistent throughout. ACR-04/05/07/08 (scope/hash/path staleness): PASS — ECAP's own file-count/head-binding update is internally consistent and independently re-verified by IAA against the live diff. ACR-06 (PUBLIC_API ripple omission): PASS — ECAP's ripple scan (0 hits) independently re-confirmed by IAA against `CANON_INVENTORY.json`. ACR-09 (gate_set_checked named): PRESENT. ACR-10/11 (stale/unconfirmed gate wording): NONE found — ECAP does not claim `merge_gate_parity: PASS`; IAA performs that check independently in this record. ACR-12 (cross-artifact contradiction): NONE found within the active bundle. ACR-13 (unfilled IAA token field while claiming COMPLETE): N/A — ECAP does not declare `final_state: COMPLETE`; it declares `ADMIN_VALIDATED — AWAITING_FINAL_IAA`. ACR-14 (unresolvable carried-forward claim): N/A. ACR-15 (open `[ ]` tasks vs declared complete): the task record's checklist items remain unchecked `[ ]` markers while individual task `status:` fields show per-task completion — this is the record's established convention (status line is authoritative, checkbox glyph is not toggled) and is consistent across all prior waves reviewed; not a fresh contradiction. ACR-16 (IAA token mismatch / `active_bundle_iaa_coherence`): N/A — no IAA token exists yet on this record prior to this invocation. **No ACR auto-reject trigger fires.**

### Phase 4 — Merge Gate Parity

| Check | Result |
|---|---|
| `merge-gate/verdict` | PASS (independently confirmed via PR API at bound head) |
| `governance/alignment` | PASS (independently confirmed via PR API at bound head) |
| `stop-and-fix/enforcement` | PASS (independently confirmed via PR API at bound head) |

Merge gate parity for the three contractual required checks: PASS. This does not cure the OVL-CI-005/A-039/A-042 finding above, which is a substance finding outside the generic merge-gate check set.

### Tally

Total: 6 substance checks (OVL-CI-001–005 + A-039 matrix) + 16 ACR checks + 3 merge-gate-parity checks = 25. PASS: 23. FAIL: 1 (OVL-CI-005 / A-039 criterion 4 / A-042). Classification: **Substantive** (directly against the governing issue's core deliverable — proven-reliable kill-switch/circuit-breaker human control surface) — not Ceremony, not solely Systemic, though it reflects a recurring repo-wide pattern (workflow_dispatch wiring added without a pre-merge dispatch run) worth a named structural prevention: **Foreman/QA-builder should require one `workflow_dispatch` run (or documented S-033 substitute) as a standard QA-to-RED/Build-to-Green exit criterion for any PR adding new `workflow_dispatch` input-gated steps** — recommended for FAIL-ONLY-ONCE promotion by CS2/CodexAdvisor.

### Adoption phase

PHASE_B_BLOCKING — this verdict is hard-blocking per `capabilities.adoption_phase.current`.

## REJECTION_HISTORY

### Entry 1 — 2026-10-06 (final independent IAA assurance)

- **Bound head**: `5a3f280755e67f3a4afae4ed21c43e4895f9ac7c`
- **Finding**: OVL-CI-005 / A-039 criterion 4 / A-042 — the new `workflow_dispatch`-gated `evaluate-envelope`, `reset-circuit-breaker`, and `kill-switch` steps added to `.github/workflows/pit-cs2-controller.yml` (the real, non-extracted wiring for the human-CS2-only reset and independently-invocable kill switch required by issue #2053) have **zero GitHub Actions execution evidence** (`workflow_dispatch` run count = 0, independently confirmed), and no S-033 Inherent-Limitation-Exception substitute (YAML lint + pattern-parity + dispatch-retention) is documented anywhere in the PR's evidence bundle.
- **Fix required**: Foreman/pit-specialist must either (a) manually trigger `workflow_dispatch` on this branch for each of the three `safety_control_action` options and record the resulting run URLs/log snippets in `.agent-admin/evidence/pr-2061-w0-qa-to-red.md` or a new evidence addendum, confirming each step executes without error and produces the expected `core.setOutput` decision; or (b) explicitly invoke the S-033 exception in the evidence bundle with all three required substitutes (actionlint/yamllint clean-run output, a documented pattern-parity comparison against an approved equivalent workflow, and explicit confirmation that `workflow_dispatch` is retained for post-merge CS2 validation). Re-invoke IAA once either remediation is committed.
- **Classification**: Substantive.
- **Recommended structural prevention**: Promote to FAIL-ONLY-ONCE — "any PR adding new `workflow_dispatch` input-gated step(s) must include at least one real dispatch run (or a properly-invoked S-033 substitute) before IAA final assurance."

## TOKEN

No `PHASE_B_BLOCKING_TOKEN` is issued by this invocation — see `REJECTION-PACKAGE` verdict above. No ASSURANCE-TOKEN exists for PR #2061 as of this invocation.

RESULT: `REJECTED_BACK_TO_PRODUCER`
RCA_REVIEW: `REFER_BACK`
HANDOVER_ALLOWED: `no`
iaa_token_reference: `IAA-session-2061-w0-20261006-REJECT`
