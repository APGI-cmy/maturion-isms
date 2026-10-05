# IAA Wave Record — PR #2065 prevent-rejected-iaa-handover — 2026-10-05

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pr-2065-prevent-rejected-iaa-handover-20261005"
  pr: "#2065"
  issue: "#2064 — Prevent rejected-IAA handover and wrong-class admin loops in Foreman–IAA–CS2 control chain"
  branch: "copilot/prevent-rejected-iaa-handover"
  repository: "APGI-cmy/maturion-isms"
  submitted_head_sha: "6cdf1bf99a6a3e36dedb2ad5b3478c2cfa3578bc"
  work_item_id: "issue-2064"
  bound_task_record: ".agent-admin/prs/pr-2065/wave-current-tasks.md"
  qualifying_tasks:
    - task_id: "GOV-2064-T1"
      summary: "Correct protected Foreman, IAA, and active-CS2 Tier 1 contracts (`.github/agents/foreman-v2-agent.md`, `.github/agents/independent-assurance-agent.md`, `.github/agents/active-cs2-agent.md`) for rejected-assurance and class-first control flow, including the Foreman §4/§6 pre-IAA-vs-final-handover state split."
      assigned_builder: "CodexAdvisor-agent"
      assurance_category: "AGENT_CONTRACT"
      note: "IAA must neither edit nor assure its own contract (`independent-assurance-agent.md`). Any change to that file in this PR must be escalated to CS2 for direct review, not self-certified by IAA."
    - task_id: "GOV-2064-T2"
      summary: "Correct PR-class detection in `.github/scripts/validate-product-delivery-gates.sh` (gate router) so a migration/security payload never falls through to EVIDENCE_ONLY when mixed with tests/workflow/docs/admin files, plus focused regression tests for mixed migration/security payload classification."
      assigned_builder: "qa-builder"
      assurance_category: "CI_WORKFLOW (gate/merge-router script — treated as mandatory-trigger infrastructure under the AMBIGUITY RULE; not a literal `.github/workflows/` path but functionally equivalent merge-gate classification logic)"
    - task_id: "GOV-2064-T3"
      summary: "Align active-CS2 Tier 1 (`merge-and-refusal-protocol.md`), Tier 2 (`evidence-review-and-correction-protocol.md`), and Tier 3 (job-wave schema/evaluator) rejection-deduplication, bounded-correction, and refusal behavior so rejected/missing/stale IAA produces a typed refusal with no completion/merge/successor dispatch."
      assigned_builder: "active-cs2-agent"
      assurance_category: "KNOWLEDGE_GOVERNANCE (`.agent-workspace/active-cs2-agent/knowledge/` and continuity/runtime bundle files) — remains CONTRACT_READY / INACTIVE scope only; no activation claim permitted"
    - task_id: "GOV-2064-T4"
      summary: "Align Foreman Tier 2 operating/index and FAIL-ONLY-ONCE registry (duplicate-finding/retry rule, A-019/A-039 reconciliation) and the Tier 3 checkpoint field split (`pre_iaa_submission_allowed` vs `final_cs2_handover_allowed` in `.agent-admin/control/handover-allowed.json`); verify whether the local OPOJD copy (v2.0) is behind the publisher's v2.1 and, if so, execute the normal published layer-down route only."
      assigned_builder: "governance-liaison-isms-agent"
      assurance_category: "LIAISON_ADMIN / CANON_GOVERNANCE (published canon layer-down verification; local OPOJD copy must not be hand-edited into a divergent canon)"
  applicable_overlay: "MIXED — AGENT_CONTRACT is the controlling/dominant trigger (Task 1 modifies `.github/agents/*.md` for Foreman, IAA, and active-CS2); CI_WORKFLOW/gate-script, KNOWLEDGE_GOVERNANCE, and LIAISON_ADMIN/CANON_GOVERNANCE overlays also apply to Tasks 2–4 respectively. Per the Trigger Table, any triggering artifact activates IAA for the whole PR, and ambiguity (gate script vs literal workflow path) resolves to MANDATORY, not EXEMPT. `IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` (AC-01–AC-07) is the organising framework for Task 1 at final assurance."
  anti_regression_obligations: >-
    yes — `FAIL-ONLY-ONCE.md` and `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` reviewed. No pre-existing
    niggle pattern in FUNCTIONAL-BEHAVIOUR-REGISTRY.md or niggle-pattern-library.md covers this
    control-chain domain (rejected-IAA handover suppression, wrong-class gate routing, admin-loop
    dedup) — this is a novel control correction, not a repeat of a registered product-build niggle.
    The binding anti-regression suite for this PR is the issue's own seven acceptance tests and six
    focused regression scenarios (a)-(f): mixed migration+test/workflow/doc never classifies
    EVIDENCE_ONLY; runtime UI/API change or explicit functional-delivery claim still forces full
    functional profile; IAA rejects wrong-class evidence demands without converting a rejection into
    a conditional PASS; rejected/pending/stale IAA blocks Foreman completion handover and active-CS2
    merge/successor dispatch; repeated identical findings with no changed substantive evidence
    produce no new tracked proof artifact or duplicate invocation; a genuine external/canon-conflict
    blocker yields exactly one CS2 escalation while the job stays BLOCKED. Final IAA assurance must
    verify these against the actual gate/controller entrypoints (not document wording only), and any
    newly confirmed recurring pattern must be promoted to FAIL-ONLY-ONCE.md /
    FUNCTIONAL-BEHAVIOUR-REGISTRY.md per NO-REPEAT-PREVENTABLE-001 at Step 3.4b of final assurance.
    Relevant existing rules already in force and re-checked at final assurance: A-002 (no class
    exemption for AGENT_CONTRACT), A-003 (ambiguity -> mandatory), A-005 (`.github/agents/**` is
    CodexAdvisor-only with explicit CS2 authorization — here, the issue's CS2-proxy appointment
    comment), A-021 (verify committed artifact, not working tree), A-026 (SCOPE_DECLARATION exact
    match).
  required_build_gates:
    - "Keep the PR bound to `.agent-admin/prs/pr-2065/wave-current-tasks.md`, PR #2065, issue #2064, branch `copilot/prevent-rejected-iaa-handover`, and the submitted head model (re-verify head SHA at each later phase — do not treat this PRE-BRIEF's observed head as a standing approval of later commits)."
    - "Do not resolve, reassess, merge, or relax any #2058 substantive security/migration finding under this issue; #2058 remains out of scope except for the separate CS2-proxy comment referenced in the issue body."
    - "IAA must not edit or assure its own contract file (`.github/agents/independent-assurance-agent.md`); any change there in this PR is escalated to human CS2, not self-certified."
    - "No new mandatory artifact family, new waiver, or broad governance cleanup — bounded to the four named control corrections only."
    - "No hand-edit of a divergent OPOJD canon; only the normal published layer-down route is permitted for Task 4's OPOJD v2.0/v2.1 question."
    - "No repeated tracked proof/scope/head-refresh commit solely to chase prior evidence (ADMIN_LOOP_BREAKER-001) — this applies to this correction PR itself, not only to the artifacts it governs."
  expected_qa_scope:
    - "Verify only GOV-2064-T1 through GOV-2064-T4 are pursued for PR #2065; no #2058 substantive reassessment folded in."
    - "Verify CodexAdvisor-agent is the sole producer of any `.github/agents/*.md` diff, with CS2-proxy authorization documented in the PREHANDOVER proof (A-005)."
    - "Verify qa-builder's gate-router regression tests exercise the actual `.github/scripts/validate-product-delivery-gates.sh` entrypoint against the mixed migration/security/test/workflow/doc fixture described in issue #2064, not only document wording."
    - "Verify active-cs2-agent's Tier 2/3 rejection-dedup and refusal changes remain CONTRACT_READY / INACTIVE with no controller/evaluator/merge-runtime activation claim."
    - "Verify governance-liaison-isms-agent's OPOJD verification uses the normal layer-down/ripple route and does not widen into general canon repair."
  high_risk_failure_modes:
    - "A rejected/stale/missing IAA token is still treated as sufficient for Foreman completion handover or active-CS2 merge/successor dispatch (the exact defect this issue exists to close)."
    - "The gate-router fix narrows correctly for the cited fixture but still fails open for a different mixed-file-type combination, or raises the class incorrectly for an unrelated EVIDENCE_ONLY PR."
    - "Task 3 or Task 4 work quietly activates active-CS2 runtime/controller behavior, or hand-edits the local OPOJD copy instead of using the published layer-down route."
    - "Scope creep into #2058's substantive security/migration reassessment, or into unrelated governance automation (explicitly out of scope per issue #1411)."
    - "A self-referential evidence-only SHA-refresh commit is produced in response to this PRE-BRIEF or any later IAA finding, rather than a substantive correction."
  required_builder_evidence:
    - "Diff evidence for each of the four Tier 1/2/3 contract and script changes, scoped exactly to the four task_ids above."
    - "Focused regression test results for the gate-router classification fix (mixed migration+test/workflow/doc fixture) run against the actual script entrypoint."
    - "A concise before/after class-and-state matrix for the Foreman/active-CS2 checkpoint field split and the rejected-IAA handover block, demonstrating the actual enforcement path (not only document wording)."
    - "Evidence of the OPOJD v2.0-vs-v2.1 verification outcome and, if divergence is confirmed, evidence of the normal published layer-down route being used (not a hand-edit)."
    - "Ordinary PR-scoped SCOPE_DECLARATION, PREHANDOVER proof, and producer session memory before final IAA assurance is requested."
  required_foreman_qp_checks:
    - "Confirm only GOV-2064-T1 through GOV-2064-T4 qualify for PR #2065, each routed to its named builder class."
    - "Confirm AGENT_CONTRACT remains the controlling overlay for the whole PR even though Tasks 2-4 touch non-`.github/agents/` paths."
    - "Confirm IAA is not asked to review its own contract file change; any such change is routed to human CS2 directly."
    - "Confirm no #2058 substantive reassessment, broad governance-automation activation, or new mandatory artifact family is introduced under this bounded issue."
  ecap_required: false
  ecap_note: "`ceremony_admin_appointed` is not declared as true in `.agent-admin/prs/pr-2065/wave-current-tasks.md` at PRE-BRIEF time. Re-check this field at final assurance — if appointed later, ACR-01..16 admin-ceremony checks become mandatory at that time."
  final_iaa_focus:
    - "Rejected/stale/missing IAA blocks Foreman completion handover and active-CS2 merge/successor dispatch at the actual checkpoint/controller entrypoints, not only in document wording."
    - "Gate-router classification fix is verified against the actual script with the mixed-fixture regression, with no new fail-open path introduced."
    - "Active-CS2 and Foreman Tier 2/3 changes remain within stated scope (no runtime activation, no divergent OPOJD hand-edit, no #2058 reassessment)."
    - "No self-referential evidence-only SHA-refresh loop is accepted as satisfying any of the above."
  result: PREFLIGHT_BRIEF_COMPLETE
```

## BINDING

- Bound task record: `.agent-admin/prs/pr-2065/wave-current-tasks.md`
- Bound repository: `APGI-cmy/maturion-isms`
- Bound PR / Issue: `#2065` / `#2064`
- Bound branch: `copilot/prevent-rejected-iaa-handover`
- Submitted head at PRE-BRIEF: `6cdf1bf99a6a3e36dedb2ad5b3478c2cfa3578bc` (observed: single empty "Initial plan" commit on top of `659fed0`, no diff yet — re-verify head at every later phase; this PRE-BRIEF does not approve any content beyond this head)
- Ceremony-admin appointment: not declared in `.agent-admin/prs/pr-2065/wave-current-tasks.md` (treated as NO at PRE-BRIEF time; re-check at final assurance)

## PRE-BRIEF RECORD

- Trigger basis: Task 1 requires modification of `.github/agents/foreman-v2-agent.md`, `.github/agents/independent-assurance-agent.md`, and `.github/agents/active-cs2-agent.md` — `AGENT_CONTRACT` is therefore the controlling trigger category for the whole PR. Tasks 2-4 add CI_WORKFLOW(-equivalent)/KNOWLEDGE_GOVERNANCE/LIAISON_ADMIN sub-triggers; per the Trigger Table MIXED rule, any triggering artifact activates IAA for the whole PR and ambiguity never resolves to exempt.
- Independence note: IAA did not produce, draft, or contribute to any artifact qualifying for this PR. IAA explicitly will not edit or self-assure its own contract file; any change to `independent-assurance-agent.md` surfaced in this PR is escalated to human CS2, not reviewed by IAA itself.
- Anti-regression review: `FAIL-ONLY-ONCE.md` and `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` reviewed; no pre-existing niggle pattern matches this control-chain domain — see `anti_regression_obligations` above for the binding regression suite (issue #2064's own acceptance tests and focused regression scenarios).
- Status: `PRE-BRIEF ONLY — NO FINAL IAA TOKEN OR REJECTION ISSUED IN THIS INVOCATION`

## REJECTION_HISTORY

### 2026-10-05 — GOV-2064-T4 submission review (pre_iaa_submission_allowed scope only; not a final-PR-bundle verdict)

- **Reviewed**: Uncommitted working-tree slice for task GOV-2064-T4 (governance-liaison-isms-agent), proof at `.agent-admin/prehandover/proof-pr-2065-gov-2064-t4-foreman-tier23-opojd-20261005.md`, session memory `.agent-workspace/governance-liaison-isms/memory/session-074-20261005.md`, against HEAD `b5ea440`.
- **Verdict**: REJECTION-PACKAGE (T4 slice only — Tasks 1-3 not reassessed).
- **Confirmed correct** (re-verified independently, not just asserted): no `.github/agents/**` or `.github/workflows/**` touched; `handover-allowed.json` (stale PR-2049 instance) left untouched; OPOJD local file SHA256 `3a3daa1a93bfacace50aa5dc82579900aed3a4f6229180e1dba6debd6fb6b74a` is byte-identical to canonical (fetched fresh via curl); `foreman-prehandover-lane-gate.test.sh` reproduces 8 passed/1 failed exactly as claimed, and the 1 failure is confirmed pre-existing via `git stash` (fails identically on `b5ea440` before this session's changes); `wave7-governance-validation.js` reproduces 11/11 + 27/27 exactly as claimed; evaluator logic for `final_cs2_handover_allowed` state-gating and the `handover_allowed === final_cs2_handover_allowed` consistency check are each independently verified (via targeted removal/mutation) to actually be exercised by their corresponding new tests.
- **Findings**:
  1. **Systemic — unverified test-coverage claim (2 of 5 "focused tests" are confounded)**: The PREHANDOVER proof and session memory both explicitly claim 5 new focused tests in `foreman-prehandover-lane-gate.test.sh` covering 5 distinct behaviors, including "`pr_number` mismatch (stale control file) → FAIL" and "`pre_iaa_submission_allowed` true before `PRE_HANDOVER_GATE_PASS` → FAIL". Verified by mutation (temporarily deleting each guarding code block and re-running the suite): with the stale-`pr_number` detection block fully removed, the "pr_number mismatch ... must fail" test still reports ✅ PASS (8/9 green, same as baseline); with the `pre_iaa_submission_allowed` state-gating block fully removed, the "pre_iaa_submission_allowed true before PRE_HANDOVER_GATE_PASS ... must fail" test also still reports ✅ PASS. Both tests pass for an unrelated, confounding reason: `run_full_control_case` always writes a static `handover_allowed: true` line into the scanned lane-intent fixture file, which makes `claimsFinalHandover` true in every scenario, which alone produces a failure via the (unrelated, already-covered) `final_cs2_handover_allowed must be true before handover/completion language is allowed` check whenever `final_cs2_handover_allowed` is not simultaneously `true` at `IAA_FINAL_PASS`/`CS2_REVIEW` — which is the case in both of these fixtures regardless of the specific mechanism nominally under test. This means the two cited tests provide **no actual regression coverage** for the stale-PR-number detection or the submission-state gating they are named after and documented as verifying; a future regression that silently deletes either check would not be caught by this suite, exactly contradicting the PREHANDOVER proof's explicit evidence claim. (By contrast, the other 3 of 5 new tests — `final_cs2_handover_allowed` true at `PRE_HANDOVER_GATE_PASS`, the `handover_allowed`/`final_cs2_handover_allowed` consistency check, and the genuine-pass case — were each independently confirmed via the same mutation method to correctly depend on their named check.) **Required fix**: give each `run_full_control_case` fixture independent, minimal scenario inputs (e.g. omit the static lane-intent-file claim text, or assert on the specific error string present in `cs2-trigger.json`/stdout rather than only "any failure routes to FOREMAN_STOP_AND_FIX") so each test fails closed only for the mechanism it is named after; re-run the full mutation check for all 5 tests and record it in the resubmission's evidence.
  2. **Ceremony — status-key self-contradiction in the active control artifact**: `.agent-admin/prs/pr-2065/wave-current-tasks.md` row 4 was updated to `🟢 DONE`, and the file's own `**Status key**` line defines `🟢 DONE` as `(IAA ASSURANCE-TOKEN received)`. No IAA token has been issued for GOV-2064-T4 (the "IAA Tokens Received This Wave" table in the same file still shows `PENDING` for PR #2065, and this is confirmed as the first IAA invocation for this task). Marking the row `🟢 DONE` before a token exists is a premature-completion status claim in the wave's own active control artifact — notable because preventing exactly this class of premature/rejected-handover claim is the subject of the parent issue (#2064) this task is part of. **Required fix**: use a non-terminal status (e.g. `🟡 IN PROGRESS` or an explicit "submitted, pending IAA" marker) until a genuine ASSURANCE-TOKEN is recorded in the tokens table, for both row 3 and row 4.
- **Classification**: Finding 1 = Systemic (recurring-pattern risk: any future `run_full_control_case`-style table-driven test suite for this evaluator is at risk of the same fixture-contamination confound; prevention action = mutation-check each new assertion before claiming coverage, and prefer asserting the specific error string over generic pass/fail + routing). Finding 2 = Ceremony.
- **Note on scope**: This is a T4-slice submission review only (`pre_iaa_submission_allowed`), not a final handover verdict for PR #2065 as a whole; Tasks 1-3 are unaffected and not reassessed here.

Token reference: IAA-session-gov2064t4-20261005-REJECT

