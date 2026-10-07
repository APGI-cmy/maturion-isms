# IAA Wave Record — PR #2065 prevent-rejected-iaa-handover — 2026-10-05

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pr-2065-prevent-rejected-iaa-handover-20261005"
  pr: "#2065"
  issue: "#2064 — Prevent rejected-IAA handover and wrong-class admin loops in Foreman–IAA–CS2 control chain"
  branch: "copilot/prevent-rejected-iaa-handover"
  current_head_sha: "6cdf1bf99a6a3e36dedb2ad5b3478c2cfa3578bc"
  work_item_id: "issue-2064"
  qualifying_tasks:
    - task_id: "GOV-2064-T1"
      summary: "Correct protected Foreman, IAA, and active-CS2 Tier 1 contracts (`.github/agents/foreman-v2-agent.md`, `.github/agents/independent-assurance-agent.md`, `.github/agents/active-cs2-agent.md`) for rejected-assurance and class-first control flow, including the Foreman §4/§6 pre-IAA-vs-final-handover state split."
      assurance_category: "AGENT_CONTRACT"
    - task_id: "GOV-2064-T2"
      summary: "Correct PR-class detection in `.github/scripts/validate-product-delivery-gates.sh` (gate router) so a migration/security payload never falls through to EVIDENCE_ONLY when mixed with tests/workflow/docs/admin files, plus focused regression tests for mixed migration/security payload classification."
      assurance_category: "CI_WORKFLOW (gate/merge-router script — treated as mandatory-trigger infrastructure under the AMBIGUITY RULE; not a literal `.github/workflows/` path but functionally equivalent merge-gate classification logic)"
    - task_id: "GOV-2064-T3"
      summary: "Align active-CS2 Tier 1 (`merge-and-refusal-protocol.md`), Tier 2 (`evidence-review-and-correction-protocol.md`), and Tier 3 (job-wave schema/evaluator) rejection-deduplication, bounded-correction, and refusal behavior so rejected/missing/stale IAA produces a typed refusal with no completion/merge/successor dispatch."
      assurance_category: "KNOWLEDGE_GOVERNANCE (`.agent-workspace/active-cs2-agent/knowledge/` and continuity/runtime bundle files) — remains CONTRACT_READY / INACTIVE scope only; no activation claim permitted"
    - task_id: "GOV-2064-T4"
      summary: "Align Foreman Tier 2 operating/index and FAIL-ONLY-ONCE registry (duplicate-finding/retry rule, A-019/A-039 reconciliation) and the Tier 3 checkpoint field split (`pre_iaa_submission_allowed` vs `final_cs2_handover_allowed` in `.agent-admin/control/handover-allowed.json`); verify whether the local OPOJD copy (v2.0) is behind the publisher's v2.1 and, if so, execute the normal published layer-down route only."
      assurance_category: "LIAISON_ADMIN / CANON_GOVERNANCE (published canon layer-down verification; local OPOJD copy must not be hand-edited into a divergent canon)"
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
  ecap_expected_artifacts: []
  final_iaa_focus:
    - "Rejected/stale/missing IAA blocks Foreman completion handover and active-CS2 merge/successor dispatch at the actual checkpoint/controller entrypoints, not only in document wording."
    - "Gate-router classification fix is verified against the actual script with the mixed-fixture regression, with no new fail-open path introduced."
    - "Active-CS2 and Foreman Tier 2/3 changes remain within stated scope (no runtime activation, no divergent OPOJD hand-edit, no #2058 reassessment)."
    - "No self-referential evidence-only SHA-refresh loop is accepted as satisfying any of the above."
  result: PREFLIGHT_BRIEF_COMPLETE
```

### PRE-BRIEF CONTEXT (outside the canonical schema object)

- Repository: `APGI-cmy/maturion-isms`.
- Bound task record: `.agent-admin/prs/pr-2065/wave-current-tasks.md`.
- The `current_head_sha` above preserves the original PRE-BRIEF submission head; it is not approval of later commits.
- Builder assignments: GOV-2064-T1 — `CodexAdvisor-agent`; GOV-2064-T2 — `qa-builder`; GOV-2064-T3 — `active-cs2-agent`; GOV-2064-T4 — `governance-liaison-isms-agent`.
- GOV-2064-T1 note: IAA must neither edit nor assure its own contract (`independent-assurance-agent.md`). Any change to that file in this PR must be escalated to CS2 for direct review, not self-certified by IAA.
- Applicable overlay: MIXED — AGENT_CONTRACT is the controlling/dominant trigger (Task 1 modifies `.github/agents/*.md` for Foreman, IAA, and active-CS2); CI_WORKFLOW/gate-script, KNOWLEDGE_GOVERNANCE, and LIAISON_ADMIN/CANON_GOVERNANCE overlays also apply to Tasks 2–4 respectively. Per the Trigger Table, any triggering artifact activates IAA for the whole PR, and ambiguity (gate script vs literal workflow path) resolves to MANDATORY, not EXEMPT. `IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` (AC-01–AC-07) is the organising framework for Task 1 at final assurance.
- Anti-regression obligations: `FAIL-ONLY-ONCE.md` and `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` reviewed. No pre-existing niggle pattern in `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` or `niggle-pattern-library.md` covers this control-chain domain (rejected-IAA handover suppression, wrong-class gate routing, admin-loop dedup); this is a novel control correction, not a repeat of a registered product-build niggle. The binding anti-regression suite for this PR is the issue's seven acceptance tests and six focused regression scenarios (a)-(f): mixed migration+test/workflow/doc never classifies EVIDENCE_ONLY; runtime UI/API change or explicit functional-delivery claim still forces full functional profile; IAA rejects wrong-class evidence demands without converting a rejection into a conditional PASS; rejected/pending/stale IAA blocks Foreman completion handover and active-CS2 merge/successor dispatch; repeated identical findings with no changed substantive evidence produce no new tracked proof artifact or duplicate invocation; a genuine external/canon-conflict blocker yields exactly one CS2 escalation while the job stays BLOCKED. Final IAA assurance must verify these against the actual gate/controller entrypoints (not document wording only), and any newly confirmed recurring pattern must be promoted to `FAIL-ONLY-ONCE.md` / `FUNCTIONAL-BEHAVIOUR-REGISTRY.md` per NO-REPEAT-PREVENTABLE-001 at Step 3.4b of final assurance. Relevant existing rules already in force and re-checked at final assurance: A-002 (no class exemption for AGENT_CONTRACT), A-003 (ambiguity -> mandatory), A-005 (`.github/agents/**` is CodexAdvisor-only with explicit CS2 authorization — here, the issue's CS2-proxy appointment comment), A-021 (verify committed artifact, not working tree), A-026 (SCOPE_DECLARATION exact match).
- ECAP explanation: `ceremony_admin_appointed` was not declared as true in `.agent-admin/prs/pr-2065/wave-current-tasks.md` at PRE-BRIEF time. Re-check this field at final assurance — if appointed later, ACR-01..16 admin-ceremony checks become mandatory at that time.
- These context notes preserve the original scope and rationale and do not add schema fields or change the assurance result.

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

### 2026-10-07 — GOV-2064-T3 bounded delta review (PR #2065)

- **Invocation / binding**: Directed by CS2 PR comment `6031688449`. Reviewed repository `APGI-cmy/maturion-isms`, PR `#2065`, branch `copilot/prevent-rejected-iaa-handover`, exact submitted HEAD `fff8b83ca3d6a8908a80d9acd1d4e252b7a13313`. Producer for this bounded correction: `active-cs2-agent` (protocol-model fixture/test) and Copilot (wave-record pre-brief normalization). Ceremony-admin appointment is not declared in the PR-bound task record; treated as NO. No IAA-agent contract content was reviewed.
- **Scope**: Only the corrected `IAA_PREFLIGHT_BRIEF` carrier/context and GOV-2064-T3 stale-PASS/successor fixture assertions were newly assessed. Existing T1/T2/T4 scoped PASS token and direct CS2 PASS for `independent-assurance-agent.md` remain as prior evidence; their content was not reassessed.
- **PRE-BRIEF carrier**: PASS. Independently parsed the fenced object and validated it against the unchanged `.agent-admin/control/schemas/iaa-preflight-brief.schema.json`. Top-level and per-task keys conform; `current_head_sha` preserves the original `6cdf1bf99a6a3e36dedb2ad5b3478c2cfa3578bc`; repository/task-record binding, assignments, notes, overlay and anti-regression analysis, and ECAP explanation are outside the schema object.
- **Active-CS2 status and limitation**: `CONTRACT_READY / INACTIVE` remains explicit in `.github/agents/active-cs2-agent.md` and Tier 2 index. No runtime/controller or CI activation was added; the test and README correctly limit claims to schema-valid protocol-model fixture consistency.
- **Focused test**: Baseline run at the assessed content passed 24/24 and validated the fixture against the unchanged `governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json`. It contains an explicit stale-PASS `EVIDENCE_STALE` event, mismatched stale/current fingerprints, and a dependent successor represented as `PLANNED` with no dispatch event.
- **Finding — Systemic (recurring confounded regression coverage)**: The stale-PASS effect is not isolated or bound to the blocked outcomes. Earlier event `evt-5` already rejects with `RESERVED_MATTER` and sets the current wave to `BLOCKED`; `evt-7-stale-iaa-refusal` starts in `BLOCKED` and is followed by static blocked job/final-acceptance and planned-successor values. The final-acceptance, merge-eligibility, and successor assertions therefore remain true independently of the stale refusal. I independently mutation-tested the runner in memory by changing only `evt-7.state_after` from `BLOCKED` to `IN_REVIEW` while retaining the earlier blocker: all 24 assertions still passed. This contradicts the focused assertion claim that the stale mismatch itself blocks final acceptance, merge eligibility, and successor release.
- **Required correction / owner**: `active-cs2-agent` must isolate an `EVIDENCE_STALE` scenario without a preceding blocker that already makes the wave `BLOCKED`, and make the stale event/current-fingerprint mismatch and its blocked final-acceptance, merge-ineligibility, and undispatched-successor outcomes explicit in that same scenario. Add a mutation-sensitivity check demonstrating that neutralizing the stale-specific outcome makes the focused regression fail. Upstream prevention action: require isolated, mechanism-specific mutation checks for each focused protocol-model regression (recurrence of the previously recorded confounded-test pattern).
- **Aggregate current-head assessment**: Prior scoped approvals remain bounded to their recorded scopes; the IAA-contract content remains covered only by CS2's direct PASS. The pre-brief normalization and inactive-state limitation pass, but this T3 regression gap blocks aggregate closure at the assessed HEAD. Current GitHub required checks/status observed green; that does not cure the model-assertion finding or establish runtime behavior.
- **Verdict**: REJECTION-PACKAGE — one Systemic finding. `RCA_REVIEW: REFER_BACK`; `HANDOVER_ALLOWED: no`; `RESULT: REJECTED_BACK_TO_PRODUCER`. No handover, merge, activation, or successor-dispatch claim is made. No task record, PREHANDOVER proof, scope declaration, or standalone artifact was changed.

## TOKEN

### 2026-10-05 — GOV-2064-T1/T2/T4 corrected-slice re-assessment (NOT a full PR #2065 final-handover/merge-readiness verdict)

```
═══════════════════════════════════════
ASSURANCE-TOKEN (SCOPED)
PR: #2065 "prevent-rejected-iaa-handover" — GOV-2064-T1 (certification only, IAA-file diff excluded) / T2 (qa-builder corrected entrypoints) / T4 (governance-liaison-isms-agent mutation-sensitivity + wave-task truthfulness) re-assessment
Verified HEAD: 4f4a698ebefef694520c0fe7b7db4aed142e464e (confirmed == origin/copilot/prevent-rejected-iaa-handover; ancestry 5ea96ba -> a04e0c0 -> 7dd188a -> 4f4a698 independently confirmed via git log/rev-parse, not taken from invocation claim)
All applicable checks PASS. Merge gate parity (required_checks): PASS.
PHASE_B_BLOCKING_TOKEN: IAA-session-gov2064-t1t2t4-reassess-20261005-PASS
Adoption phase: PHASE_B_BLOCKING
═══════════════════════════════════════
```

**SCOPE — what this token covers:**
1. T4 (governance-liaison-isms-agent, commit `5ea96ba`): both named mutation-sensitivity guards in `foreman-prehandover-lane-gate.test.sh` ("pr_number mismatch is a stale control file" and "pre_iaa_submission_allowed true before PRE_HANDOVER_GATE_PASS") independently re-verified genuinely isolated — guard removed one at a time in `foreman-prehandover-lane-gate.js`, confirmed only its own named case flips to FAIL while all others (including the pre-existing unrelated failure) are unaffected, file restored to byte-identical original (md5 `a467f9f00ae84d8141a8a21619169f3f`, zero `git diff`) after each test. `wave-current-tasks.md` rows 3/4 independently confirmed truthful: both read `🟡 IN PROGRESS`, IAA token table still showed `PENDING` as of the reviewed head — no premature terminal claim. This closes REJECTION_HISTORY finding 1 (Systemic — unverified mutation-sensitivity) and finding 2 (Ceremony — premature 🟢 DONE) from the `2026-10-05 — GOV-2064-T4 submission review` entry above. This is a genuine substantive correction, not a self-referential resubmission — `NO-DUPLICATE-PASS-001` does not apply.
2. T1 (CodexAdvisor-agent certification, commit `a04e0c0`): independently re-read the actual diffs in commit `11a9d61` for `.github/agents/foreman-v2-agent.md` and `.github/agents/active-cs2-agent.md` only. Confirmed substantively: Foreman §4 now routes an IAA REJECTION-PACKAGE or missing/stale token at/after `PRE_HANDOVER_GATE_PASS` to `STOP_AND_FIX / CORRECTION`, never `CS2_REVIEW`; `active-cs2-agent.md` `HALT-ACS2-006` + `ACS2-NO-REJECTED-IAA-MERGE-001` + Phase 3 Step 5 block completion handover, merge, and successor-wave dispatch on a rejected/missing/stale token. No `governance/canon/**` path touched by commit `11a9d61` — no divergent local canon edit, confirmed via `git show --stat`. YAML frontmatter re-parsed successfully for both files at current HEAD; character counts well under the 30,000 hard limit. CodexAdvisor's minimality/sufficiency determination is corroborated.
   - **EXCLUDED FROM THIS TOKEN**: the diff to `.github/agents/independent-assurance-agent.md` in the same commit `11a9d61`. Per `SELF-MOD-IAA-001`/`NO-SELF-REVIEW-001` and CS2's explicit instruction, IAA does not and must not self-assure this file's content. Structural fact only (verifiable, not a content judgment): IAA did not author that diff — it was authored by CodexAdvisor under CS2-proxy appointment, and no IAA self-review violation exists. The substantive content of that diff remains for **direct human CS2 review** and is not covered by this ASSURANCE-TOKEN.
3. T2 (qa-builder, commits `7dd188a` + `4f4a698`): independently re-read the diffs to `.github/scripts/post-handover-auto-remediation.js`, `.github/workflows/handover-claim-gate.yml`, and `.github/scripts/pre-handover-checkpoint.js`, and independently re-ran (not just read) all three regression suites plus the lane-gate suite — exact counts below. Confirmed substantively (not just by test pass-count) that the six required properties hold: (a) `ADMIN_MANIFEST_DEFECT` is now gated on `ADMIN_MANIFEST_APPLICABLE`, defaulting to strict/applicable when absent, preserving old behavior for other callers (cases 9-12 PASS); (b) `requires_iaa`/`requires_ecap` for legacy/no-manifest PRs are derived from actual governance-control-path impact, not defaulted to all-checks-required, and the canonical `REQUIRED_CHECKS` catalog length used for `REQUIRED_CHECKS_TOTAL` reconciliation is untouched (T2-B1..B4 PASS); (c) identity-binding/staleness detection (`identityScopedArtifacts`/`isForeignPrArtifact`) excludes only artifacts explicitly bound to a *different* PR number, never ambiguous/unscoped evidence (tests 31, 33, 34 PASS — test 34 specifically proves no over-exclusion); (d) a CS2-authored (`apgi-cmy`-login-matched) comment is never read as the producer's own completion claim, by authorship not wording (T2-D1..D5 PASS, including D3/D5 controls proving non-CS2 claims are still enforced); (e) a current PR-bound wave-record PASS token is recognized without requiring a self-referential evidence-only commit (test 32 PASS); (f) genuine security/IAA/delegation-order failures remain blocking (T2-B2, P1-P9, tests 4-6, 33-34 all PASS, correctly failing-closed).
   `wave-current-tasks.md` row 2 (commit `4f4a698`) independently confirmed: `🟡 IN PROGRESS`, non-terminal, consistent with token table `PENDING`.

**Independently re-run test counts (exact, not copied from commit messages):**
| Suite | Result |
|---|---|
| `.github/scripts/foreman-prehandover-lane-gate.test.sh` | 8 passed, 1 failed — the 1 failure ("stale handover control fails exact head check") independently confirmed **pre-existing**: reproduced identically on the PR's own first commit `6cdf1bf` (parent `659fed0`, which predates PR #2065 entirely) via isolated `git worktree`. **Not a regression from this wave. Out of scope for this token** — tracked below as a separate, pre-existing defect. |
| `.github/scripts/post-handover-auto-remediation.test.sh` | 12 passed, 0 failed |
| `.github/scripts/handover-claim-gate.test.sh` | 45 passed, 0 failed |
| `.github/scripts/pre-handover-checkpoint.test.sh` | 57 passed, 0 failed |

**Merge gate parity (Step 4.1, current HEAD `4f4a698`):** `merge-gate/verdict` success, `governance/alignment` success, `stop-and-fix/enforcement` success (live CI, independently queried). All other check runs at this HEAD (50 total) are `success` or `skipped` — no `failure`/`pending`/`queued` observed at time of review.

**`wave-current-tasks.md` truthfulness (CORE-021/ACR-15 style check, this token's scope):** confirmed no row reads terminal `🟢 DONE` while the "IAA Tokens Received This Wave" table still reads `PENDING` for PR #2065. Row 1 (CodexAdvisor/T1) reads `🔴 PENDING` despite T1 substance being certified-complete — this is a conservative **under-statement**, not a false completion claim, so it does not fail this check; it is a stale-label bookkeeping discrepancy (observation below), not a governance violation.

**What this token does NOT cover (explicitly out of scope):**
- Full final-handover / merge-readiness assurance for PR #2065 as a whole.
- The substantive content of the `.github/agents/independent-assurance-agent.md` diff in commit `11a9d61` — reserved for direct human CS2 review per CS2's explicit instruction; IAA does not self-assure this file.
- GOV-2064-T3 (active-cs2-agent) — not re-reviewed in this invocation; its own prior proof/session-memory stands on its own record.
- The pre-existing `foreman-prehandover-lane-gate.test.sh` "stale handover control fails exact head check" failure (predates PR #2065, traces to commit `659fed0`) — tracked as a separate, independently triageable defect, not resolved or waived by this token.
- The `wave-current-tasks.md` row-1 stale-`PENDING`-label discrepancy (CodexAdvisor/T1) — reported to Foreman for correction, not a blocking defect of this token.

**Single next action for Foreman:** (1) route the `.github/agents/independent-assurance-agent.md` diff to direct human CS2 review (do not ask IAA to self-assure it); (2) correct `wave-current-tasks.md` row 1 from `🔴 PENDING` to the correct non-terminal `🟡 IN PROGRESS` label (bookkeeping only, T1 substance already certified); (3) open or confirm a separate tracked defect for the pre-existing lane-gate test failure (origin `659fed0`, predates this PR) so it does not get silently carried forward as "this wave's problem" or silently dropped.

Token reference: IAA-session-gov2064-t1t2t4-reassess-20261005-PASS

---

### 2026-10-06 — GOV-2064-T3 (active-cs2-agent) independent review + aggregate current-head closure (PR #2065 bundle, IAA-contract content excluded)

**Invocation context**: Human CS2 (`APGI-cmy`) proxy-completion instruction, PR #2065 comment id `6015951908` (authored by `APGI-cmy`, independently re-read verbatim from the live PR comment, not taken on trust): "Invoke IAA once only for the unassured GOV-2064-T3 active-CS2 Tier 2/3 change and the aggregate current-head closure review excluding the IAA-contract content." That same comment records: "Direct CS2 review: PASS" for the `.github/agents/independent-assurance-agent.md` diff in commit `11a9d61` — this IAA invocation does not and did not re-review that file's content; it is treated as structurally present but explicitly out of IAA's review scope, per `SELF-MOD-IAA-001`/`NO-SELF-REVIEW-001`.

**Verified HEAD**: `99b6373235f6fe05180123423e98cdf06f6046cf` (confirmed via `git rev-parse HEAD` == `origin/copilot/prevent-rejected-iaa-handover`; linear ancestry `8d6f8b4 → 11a9d61 → adcce22 → b5ea440 → 665802b → [247e512/2758a8b/d5dd1c6/ad95e07/12c5735 RCA commits] → 5ea96ba → a04e0c0 → 7dd188a → 4f4a698 → 99b6373` independently walked via `git log --oneline --graph 659fed0..99b6373`, not taken from the invocation claim).

#### Part A — GOV-2064-T3 (active-cs2-agent, commit `b5ea440`) — independent first-time review

Builder's own proof reviewed for context only, not relied on as evidence: `.agent-admin/prehandover/proof-pr-2065-gov-2064-t3-active-cs2-tier23-20261005.md`. Every claim below was independently re-derived from the actual diff, the actual canon files, and a live re-run — not copied from that proof.

- **Scope/write-path check**: `git show b5ea440 --stat` confirms the only paths touched are `.agent-workspace/active-cs2-agent/knowledge/**`, the new `.agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/**` bundle, `.agent-workspace/active-cs2-agent/memory/session-001-20261005.md`, `.agent-workspace/active-cs2-agent/parking-station/suggestions-log.md`, and the two admin files (this proof + `wave-current-tasks.md` row 3, which commit `5ea96ba` later corrected from a premature `🟢 DONE` back to truthful `🟡 IN PROGRESS` — independently confirmed via `git show 5ea96ba -- .agent-admin/prs/pr-2065/wave-current-tasks.md`). **No** `.github/agents/**`, `.github/workflows/**`, or `governance/**` path appears in this commit's stat. PASS.
- **Tier 1 contract file untouched since T1-token-reviewed commit**: `git log --oneline a04e0c0..99b6373 -- .github/agents/active-cs2-agent.md` returns empty; `git diff a04e0c0 99b6373 -- .github/agents/active-cs2-agent.md` returns empty. Confirmed independently: no further change to that Tier 1 file occurred after the already-token-assured commit. Per scope, its content is not re-assessed here. PASS.
- **CONTRACT_READY / INACTIVE scope preserved — no runtime/controller activation, no CI wiring, no divergent canon**:
  - `governance/CANON_INVENTORY.json` parsed independently: zero `.agent-workspace/active-cs2-agent/**` paths tracked (confirmed by grep against the raw JSON — no match). No divergent canon hand-edit is possible under this inventory.
  - `git diff 659fed0 99b6373 -- governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json` is empty — the canon schema the new fixture validates against is byte-identical to the PR's base.
  - `grep -rln "evaluator-entrypoint-tests\|validate-rejected-iaa-dedup" .github/workflows/` returns empty — the new test script is **not** wired into any CI workflow.
  - `grep -rln "active-cs2-agent" .github/workflows/*.yml` returns empty — no workflow references this agent class at all. PASS.
- **No new refusal code invented outside the approved merge-policy vocabulary**: canonical vocabulary independently extracted from `governance/schemas/ACTIVE_CS2_MERGE_POLICY.schema.json`'s `refusal_codes` enum: `UNAPPROVED_SCOPE, DEPENDENCY_UNMET, BUDGET_EXHAUSTED, BREAKER_TRIPPED, EVIDENCE_STALE, MATERIAL_BLOCKER, GATE_UNSATISFIED, IDENTITY_MISMATCH, UNKNOWN_DELTA, CONFLICT, RESERVED_MATTER` (11 total — note: the smaller 5-code subset in the `scoped-merge-policy.json` *fixture* is a per-fixture scoped subset, not the full canonical vocabulary; this was checked against the actual schema enum, not the fixture, to avoid a false-positive "new code" finding). Every refusal code referenced across the six changed knowledge files (`EVIDENCE_STALE`, `GATE_UNSATISFIED`, `MATERIAL_BLOCKER`, `RESERVED_MATTER`, `UNAPPROVED_SCOPE`, `BUDGET_EXHAUSTED`) is a member of this pre-existing enum. No new code string was introduced. PASS.
- **Test evidence independently reproduced** (not just read): `python3 .agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/validate-rejected-iaa-dedup.test.py` run at current HEAD `99b6373` reproduces **exactly** 15/15 PASS, 0 FAIL, exit code 0 — identical to the builder's claim, independently executed by IAA, not copied from the proof.
- **Independent negative-control/mutation sanity check (IAA's own, in addition to and separate from the builder's own ad hoc negative control cited in its proof)**: two separate mutations were applied to a working copy of `rejected-iaa-wave-record.json`, each run against the unmodified real test script, then the file was restored and `git diff --stat` confirmed clean (zero diff) after each:
  1. Set `status: COMPLETE` (job) and `status: MERGED` (wave) → 3 of 15 checks correctly flipped to FAIL (`wave never advances to MERGE_ELIGIBLE/MERGED/VALIDATED...`, `wave status is CORRECTION or BLOCKED...`, `job status is BLOCKED, not COMPLETE...`), 12 unaffected. Exit code 1.
  2. Changed event `evt-2`'s `decision` from `NO_OP` to `REJECTED` (simulating an un-deduped repeat finding) → exactly 1 of 15 checks correctly flipped to FAIL (`no duplicate rejection/escalation re-emitted for an unchanged rejection fingerprint`, reporting the exact duplicated fingerprint), 14 unaffected. Exit code 1.
  Both mutations confirm the harness discriminates correctly and is not vacuous; it fails closed exactly on the mechanism each check is named after. PASS.
- **Checklist/evidence-files cross-check**: the builder's own checklist and evidence-files list in its proof were spot-checked against the actual commit diff (file list, line counts, FAIL-ONLY-ONCE additions ACS2-005/ACS2-006) and found accurate; no unverifiable or unsupported claim found.

**T3 verdict: PASS.** 0 findings.

#### Part B — Aggregate current-head closure review (whole PR #2065 bundle, IAA-contract content excluded)

- **All four qualifying tasks have a current, non-stale assurance basis at HEAD `99b6373`**:
  - T1 (excl. `independent-assurance-agent.md` content) / T2 / T4 — covered by this wave record's existing `## TOKEN` (`IAA-session-gov2064-t1t2t4-reassess-20261005-PASS`, verified HEAD `4f4a698`); ancestry `4f4a698` → `99b6373` independently re-walked (2 commits, both wave-record/session-memory only — see below). Not re-reviewed in substance per binding instruction.
  - T3 — Part A above, this invocation, PASS.
  - `.github/agents/independent-assurance-agent.md` diff (commit `11a9d61`) — direct human CS2 PASS, PR #2065 comment id `6015951908`, author `APGI-cmy`, independently re-read verbatim from the live comment (see Invocation context above). Confirmed unchanged since that commit (`git log 11a9d61..99b6373 -- .github/agents/independent-assurance-agent.md` empty).
- **No `.github/agents/**` or `.github/workflows/**` file changed since the last token's reviewed HEAD (`4f4a698`)**: `git diff 4f4a698..99b6373 --stat` shows exactly 2 files changed — this wave record (45 insertions) and the `session-gov2064-t1t2t4-reassess-20261005.md` session memory (8 insertions) — both added by the token-issuance commit `99b6373` itself. `git diff 4f4a698..99b6373 --name-only | grep -E "^\.github/(agents|workflows)/"` returns empty. Confirmed. PASS.
- **`wave-current-tasks.md` truthfulness**: at HEAD `99b6373`, row 1 reads `🔴 PENDING` (conservative under-statement, already reported to Foreman as a non-blocking bookkeeping item by the prior token — not re-flagged as a new defect here), rows 2/3/4 read `🟡 IN PROGRESS` (non-terminal). No row reads `🟢 DONE` while its corresponding substance lacks a current IAA token. No false terminal claim. PASS. (This invocation updates row 3 to `🟢 DONE` below, now that T3 has its own current token — see task-record update.)
- **Pre-existing lane-gate failure still present, still traces to pre-PR commit `659fed0`, not a regression, kept visible**: `bash .github/scripts/foreman-prehandover-lane-gate.test.sh` at HEAD `99b6373` reproduces **8 passed, 1 failed** — the 1 failure is `current_head_sha must equal or be an ancestor of PR head SHA ...; got ...` (stale handover control fails exact head check). Independently re-verified via `git worktree add` at commit `659fed0` (the PR's actual base, pre-dating the PR entirely): the **same** `current_head_sha must equal or be an ancestor...` failure reproduces there too (3 passed/1 failed — fewer total tests at base because the 5 additional T4 mutation-sensitivity tests did not yet exist, but the same failing check and identical failure message are present at both ends). Confirmed non-regression, confirmed still visible (not hidden, waived, or folded into this PR's scope) — matches CS2's explicit instruction ("Keep the pre-existing lane-gate test failure visible as a baseline item... not a reason to reopen, waive, or delay this bounded control correction"). PASS (as a confirmed, correctly-tracked baseline item — not resolved by this PR, not blocking it).
- **Control property — rejected/missing/stale IAA continues to block Foreman completion handover and active-CS2 merge/successor dispatch**: confirmed as a control property (not a re-test of T1-T4 substance): the already-token-assured T1 Foreman/active-CS2 Tier 1 contract corrections (commit `11a9d61`) plus this invocation's T3 Tier 2/3 knowledge alignment (commit `b5ea440`, Part A above, independently test-verified 15/15 + 2 additional IAA-run mutations) jointly state and enforce the same rule at both the contract and knowledge layers: a `REJECTION-PACKAGE`/missing/stale IAA result produces a typed refusal (`MATERIAL_BLOCKER`/`GATE_UNSATISFIED`/`EVIDENCE_STALE`), never a `STOP_AND_FIX`-to-`CS2_REVIEW`-as-pass conversion, never `MERGE_ELIGIBLE`/`MERGED`/`VALIDATED`/`COMPLETE`. PASS.
- **Merge gate parity (Step 4.1)**: live CI check-runs queried directly against PR #2065 at HEAD `99b6373` (50 check runs total). Every `required_checks` entry from `.agent-admin/control/merge-gate-required-checks.json` that is also listed in that manifest's `workflow_backed_required_checks` is present and `success`: `preflight/phase-1-evidence`, `preflight/iaa-prebrief-contract-alignment`, `preflight/foreman-prehandover-lane-gate`, `preflight/delegation-order-gate`, `preflight/ecap-admin-boundary-gate`, `preflight/merge-gate-required-checks-alignment`. The remaining always-required checks `merge-gate/verdict`, `governance/alignment`, `stop-and-fix/enforcement`, `foreman-implementation-check`, `builder-involvement-check`, `session-memory-check` are all `success`. The manifest's `mapped_legacy_or_external_required_checks` names not currently workflow-backed (`preflight/iaa-prebrief-existence`, `preflight/iaa-token-self-certification`, `preflight/hfmc-ripple-presence`, `preflight/evidence-exactness`, `preflight/iaa-final-assurance`, `preflight/ecap-admin-ceremony`, `preflight/scope-declaration-parity`, `preflight/mmm-pr-admin`) are correctly absent from the live check-run list and are not treated as blocking, per the manifest's own `wave7_validation_required: true` flag and CS2's instruction. One non-required, non-manifest check (`copilot`) is `in_progress` — this is this very IAA invocation's own session check, not a merge-gate requirement. Result: **PASS**, no `failure`/blocking `pending` observed among required, workflow-backed checks.
- **Ceremony-admin re-check**: `ceremony_admin_appointed` is still not declared `true` in `.agent-admin/prs/pr-2065/wave-current-tasks.md` at this invocation. ACR-01..16 admin-ceremony checks remain inapplicable.

**Aggregate verdict: PASS.** 0 findings.

#### Merge Gate Parity Check (Step 4.1) — summary

| Check | Result |
|---|---|
| Live required, workflow-backed CI checks at HEAD `99b6373` | PASS ✅ (all `success`) |
| Legacy/pending-Wave-7 manifest names | Correctly non-blocking (absent from live checks, per manifest) |
| `foreman-prehandover-lane-gate.test.sh` local re-run | 8/9 — 1 confirmed pre-existing, non-regression, visible baseline item |
| T3 independent test re-run | 15/15 PASS, reproduced exactly |
| T3 IAA-original mutation sanity checks (×2) | Both correctly fail-closed, file restored clean |

```
═══════════════════════════════════════
ASSURANCE-TOKEN (SCOPED)
PR: #2065 "prevent-rejected-iaa-handover" — GOV-2064-T3 (active-cs2-agent, commit `b5ea440`) independent first-time review + aggregate current-head closure for the whole PR #2065 bundle, EXCLUDING the substantive content of `.github/agents/independent-assurance-agent.md` (directly reviewed and PASSED by human CS2, PR #2065 comment id 6015951908)
Verified HEAD: 99b6373235f6fe05180123423e98cdf06f6046cf (confirmed == origin/copilot/prevent-rejected-iaa-handover via git rev-parse, full ancestry independently walked, not taken from invocation claim)
All applicable checks PASS. Merge gate parity (required_checks, workflow-backed subset): PASS.
PHASE_B_BLOCKING_TOKEN: IAA-session-gov2064-t3-aggregate-20261006-PASS
Adoption phase: PHASE_B_BLOCKING
═══════════════════════════════════════
```

**SCOPE — what this token covers:**
1. GOV-2064-T3 (active-cs2-agent, commit `b5ea440`): first independent IAA review of this task's Tier 2/Tier 3 knowledge changes — PASS, 0 findings (Part A above).
2. Aggregate current-head closure for PR #2065 as a whole, at HEAD `99b6373`, combining: (a) the existing scoped token for T1(excl.)/T2/T4 at `4f4a698`; (b) this invocation's T3 PASS; (c) the direct human-CS2 PASS for the `independent-assurance-agent.md` diff (comment 6015951908); (d) confirmation that nothing in `.github/agents/**`/`.github/workflows/**` changed between `4f4a698` and `99b6373` other than this wave record and session memory; (e) confirmation the pre-existing lane-gate failure remains a visible, correctly-tracked, non-regressing baseline item; (f) confirmation live required CI checks are green.

**What this token does NOT cover (explicitly out of scope):**
- The substantive content of `.github/agents/independent-assurance-agent.md` — reserved for human CS2, who has already directly reviewed and PASSED it (comment 6015951908). IAA does not and will not self-assure this file.
- Re-review of T1 (excl. IAA file)/T2/T4 substance — these stand on the existing `IAA-session-gov2064-t1t2t4-reassess-20261005-PASS` token at `4f4a698` and are not reopened here.
- Resolution or waiver of the pre-existing `foreman-prehandover-lane-gate.test.sh` "stale handover control fails exact head check" failure — it remains open, tracked, and out of this PR's scope, per CS2's explicit instruction not to fold it in.
- Any future commit after `99b6373` — this token binds to the exact HEAD stated above only.

**Single next action**: Per CS2's own comment (6015951908) — Foreman performs one whole-bundle QP treating this token, the existing T1/T2/T4 token, and the direct-CS2 contract approval as binding inputs, then makes **one** non-mutating final current-head verification citing all of the above plus current green checks, and returns the finished bundle to CS2 for the merge decision. **No** further status-only, proof-only, manifest-only, or head-refresh commit should be pushed after that — doing so would itself be the self-referential evidence-only loop this correction PR exists to prevent. No production deployment, active-CS2 activation, automatic reset, successor dispatch, or use of #2058's exceptional override is authorized by this token.

Token reference: IAA-session-gov2064-t3-aggregate-20261006-PASS

## OVL-CI-005 S-033 Inherent-Limitation Evidence — Final Bounded Delta

**Classification before evidence selection:** This PR is a mixed governance-control bundle. The current residual is classified `CI_WORKFLOW` because `.github/workflows/handover-claim-gate.yml` is modified. No product/runtime UI or API delivery claim is made. This section records validation evidence only; it does not claim handover, completion, or merge readiness.

**Bounded workflow limitation at reviewed baseline `a7c9df0bf0eef682ccd45f26afdecbe1516755e6`:** The handover gate is deliberately event-context-bound. Its only triggers are `issue_comment` and `pull_request_target`; its job condition accepts those event contexts; PR number and head SHA are derived from the issue-comment API lookup or the pull-request payload. It checks out trusted default-branch code (`refs/heads/${{ github.event.repository.default_branch }}`), not the unmerged PR workflow. A bare `workflow_dispatch` has no supported PR event context and would require a new synthetic route; a branch dispatch would still run trusted default-branch workflow code rather than validate this unmerged workflow. Therefore a manual dispatch or live run of the modified head is not meaningful evidence for this change. No `workflow_dispatch` trigger or synthetic route was added.

### S-033 Substitute 1 — YAML syntax validation

Ran the existing Ruby standard-library YAML parser against `.github/workflows/handover-claim-gate.yml`:

```text
$ ruby -e 'require "yaml"; YAML.load_file(".github/workflows/handover-claim-gate.yml"); puts "YAML syntax: PASS"'
YAML syntax: PASS
```

The modified workflow also passed its targeted `yamllint` syntax check. The repository-wide `.github/scripts/validate-yaml.sh` run remains red on three unchanged, out-of-scope files: `.github/workflows/foreman-reanchor.yml`, `.github/workflows/cs2-foreman-cycle.yml`, and `.github/workflows/update-liveness.yml`. None is part of this PR's changed-file set; these failures are recorded, not waived or represented as passes.

### S-033 Substitute 2 — focused regressions and mutation evidence

Focused tests were executed at baseline HEAD `a7c9df0bf0eef682ccd45f26afdecbe1516755e6`:

| Regression suite | Result |
|---|---:|
| `.github/scripts/handover-claim-gate.test.sh` | 51 passed, 0 failed |
| `.github/scripts/pre-handover-checkpoint.test.sh` | 64 passed, 0 failed |
| `.github/scripts/resolve-active-pr-state.test.sh` | 7 passed, 0 failed |
| `.agent-workspace/active-cs2-agent/evaluator-entrypoint-tests/validate-rejected-iaa-dedup.test.py` | 23 assertions passed, 0 failed |

The active-CS2 fixture suite is schema-valid protocol-model consistency coverage only; it does not execute or prove evaluator/controller behavior, and active-CS2 remains `CONTRACT_READY / INACTIVE`.

Three temporary negative-control mutations were applied and restored with no remaining source diff:

1. Changed the handover manifest resolver to treat all nonzero HTTP statuses as absence instead of accepting only confirmed 404; the API-read-error regression failed as expected.
2. Disabled the checkpoint's invalid-manifest fail-closed guard; the malformed per-PR manifest regression failed as expected.
3. Removed the checkpoint's explicit foreign-PR artifact exclusion; the shared-issue/branch archival-identity regression failed as expected.

### S-033 Substitute 3 — trusted-main and event-context boundary

Static inspection of the workflow confirmed:

- `on` contains only `issue_comment` and `pull_request_target` (`.github/workflows/handover-claim-gate.yml:65-69`).
- The trusted checkout explicitly uses the repository default branch (`.github/workflows/handover-claim-gate.yml:98-103`).
- The job condition accepts only those event contexts (`.github/workflows/handover-claim-gate.yml:84-95`).
- The PR number/head SHA are read from the comment-triggered PR API lookup or the pull-request event payload (`.github/workflows/handover-claim-gate.yml:111-125`).

No live post-change workflow execution is claimed. The active PR-scoped scope declaration records the exact diff; IAA reassessment and a single non-mutating current-head verification remain required.
