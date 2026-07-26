## PRE-BRIEF

IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "foreman-bootstrap-repair-1969"
  pr: "1970"
  issue: "#1969 — Restore the missing Foreman session-memory template and fail closed on missing Tier 2 controls"
  branch: "agent/foreman-bootstrap-fail-closed-1969"
  qualifying_tasks:
    - task_id: "GOV-1969-01"
      summary: "Restore the missing Foreman Tier 2 session-memory template and align its Tier 1 and Tier 2 references."
      assurance_category: "KNOWLEDGE_GOVERNANCE"
    - task_id: "GOV-1969-02"
      summary: "Make wake-up validation fail closed on every Tier 2 file declared required by the active Foreman contract."
      assurance_category: "CI_WORKFLOW"
    - task_id: "GOV-1969-03"
      summary: "Add executable complete-set, missing-control, output-integrity, and absent-list compatibility regression coverage."
      assurance_category: "CI_WORKFLOW"
    - task_id: "GOV-1969-04"
      summary: "Bind Foreman QP, ECAP administration, CI evidence, and independent final IAA assurance to the frozen PR head."
      assurance_category: "GOVERNANCE_EVIDENCE"
    - task_id: "GOV-1969-05"
      summary: "Keep Issue #1959 outside this repair wave and resume it only after CS2 closes the bootstrap repair."
      assurance_category: "GOVERNANCE_EVIDENCE"
  required_build_gates:
    - "Canonical pre-brief is committed before any builder appointment or implementation commit."
    - "Delegation-order evidence proves pre-brief commit, bounded appointment, and first implementation commit in strict order."
    - "The focused bootstrap regression suite passes for complete-set, missing-control, and absent-list compatibility cases."
    - "CI executes the focused regression command when the validator, Foreman contract/index/template, regression script, or relevant workflow changes."
    - "preflight/iaa-prebrief-contract-alignment"
    - "preflight/iaa-prebrief-existence"
    - "preflight/delegation-order-gate"
    - "preflight/scope-declaration-parity"
    - "foreman-implementation-check"
    - "builder-involvement-check"
    - "session-memory-check"
    - "merge-gate/verdict"
    - "governance/alignment"
    - "stop-and-fix/enforcement"
  expected_qa_scope:
    - "A complete Foreman Tier 2 required-file set makes .github/scripts/wake-up-protocol.sh foreman-v2 exit 0."
    - "An isolated fixture missing exactly one contract-declared Tier 2 required file exits nonzero."
    - "Failure output names the missing repository path and emits neither an all-checks-passed statement nor an agent-ready statement."
    - "A contract without tier2_knowledge.required_files preserves the validator's current compatible behavior."
    - "The Foreman Tier 1 contract and Tier 2 index both reference session-memory-template.md after restoration."
    - "CI path coverage runs the focused regression command for every authority or enforcement surface named by Issue #1969."
    - "No .github/agents file, product/runtime code, MMM artifact, Supabase artifact, Vercel artifact, or Issue #1959 implementation is changed."
  high_risk_failure_modes:
    - "The validator trusts Tier 2 index prose instead of the active contract's declared required_files list."
    - "A required Tier 2 file is absent while bootstrap exits 0 or emits success/readiness language."
    - "The repair restores the template but leaves Tier 1, Tier 2 index, validator behavior, or CI path coverage inconsistent."
    - "Fail-closed hardening breaks contracts that intentionally omit tier2_knowledge.required_files."
    - "Regression tests are vacuous, test only repository state, or do not exercise a genuinely missing-file fixture."
    - "Implementation begins before the canonical pre-brief and bounded builder appointment are committed."
    - "Foreman, ECAP, or the builder writes or implies an IAA token or final assurance result."
    - "Issue #1959, product runtime, MMM, Supabase, Vercel, workflows beyond the focused gate, or protected agent contracts enter the repair diff."
  required_builder_evidence:
    - "Exact changed-file inventory mapped to GOV-1969-01 through GOV-1969-03 and the Issue #1969 acceptance criteria."
    - "Commit lineage showing this pre-brief commit predates the bounded builder appointment and all implementation commits."
    - "Positive-path command, exit code, and output for the complete Foreman Tier 2 required-file set."
    - "Negative-path fixture command, nonzero exit code, and output naming the exact missing path."
    - "Negative-path output proof that success and ready statements are absent."
    - "Compatibility-path command, exit code, and output for a contract without tier2_knowledge.required_files."
    - "CI workflow/path-filter evidence proving the focused regression command executed on the PR head."
    - "Evidence that the restored template is referenced by both the Foreman Tier 1 contract and Tier 2 index."
    - "Diff proof that all prohibited and successor-work paths remained untouched."
  required_foreman_qp_checks:
    - "Map every Issue #1969 and wave-current-tasks acceptance condition to hard repository, command-output, or CI evidence."
    - "Confirm fail-closed behavior is driven by the active contract's declared required_files list and reports every missing path."
    - "Confirm the negative fixture genuinely removes a required file and cannot pass vacuously."
    - "Confirm complete-set and absent-list compatibility paths retain intended behavior."
    - "Confirm focused tests are 100 percent green with zero skipped, todo, incomplete, or weakened assertions."
    - "Confirm CI path coverage includes validator, Foreman contract/index/template, regression script, and relevant workflow changes."
    - "Confirm the actual diff contains no protected agent-contract, product/runtime, MMM, Supabase, Vercel, or Issue #1959 implementation changes."
    - "Bind the binary QP result to the exact frozen PR head before ECAP and final IAA."
  ecap_required: true
  ecap_expected_artifacts:
    - ".agent-admin/prs/pr-1970/wave-current-tasks.md"
    - ".agent-admin/scope-declarations/pr-1970.md"
    - ".admin/pr.json"
    - ".agent-admin/control/delegation-order.json"
    - "Foreman QP evidence bound to the frozen PR head."
    - "ECAP administrative validation bound to the same frozen PR head."
    - "Current-head CI evidence including the focused bootstrap regression run."
  final_iaa_focus:
    - "Independently verify every Issue #1969 acceptance condition against hard evidence at the exact final head."
    - "Verify the restored Tier 2 template is operationally clear, non-duplicative, and consistently registered in Foreman Tier 1 and Tier 2."
    - "Verify bootstrap fails closed for a contract-declared missing Tier 2 file, identifies the missing path, and emits no false success/readiness claim."
    - "Verify complete-set and absent-list compatibility behavior and reject vacuous or repository-state-only tests."
    - "Verify CI path coverage makes recurrence visible whenever any named authority or enforcement surface changes."
    - "Verify delegation order, builder separation, QP, ECAP, scope, and current-head CI evidence are coherent and non-stale."
    - "Verify no IAA self-certification, governance weakening, protected contract change, product/runtime change, infrastructure mutation, or Issue #1959 implementation entered this wave."
    - "Verify Issue #1959 remains blocked only until CS2 closure of this wave and has a truthful successor-resumption handoff."
  result: PREFLIGHT_BRIEF_COMPLETE


## REJECTION_HISTORY

### Final Assurance Invocation R1 — 2026-07-26

**IAA session:** IAA-session-1970-R1-20260726  
**PR:** #1970 — Governance: fail closed on missing Foreman Tier 2 controls  
**Issue:** #1969  
**Branch:** `agent/foreman-bootstrap-fail-closed-1969`  
**Reviewed HEAD:** `fb9f3c9e62e5390864558e519f6f58c30a8e9d64`  
**Produced by:** `CodexAdvisor-agent` under the bounded appointment committed at `f6b081c8014f235543815de185958ba8f2a01ab2`  
**Invoked by:** `foreman-v2-agent`  
**Ceremony-admin:** YES — ECAP carrier present  
**Independence:** CONFIRMED — this IAA did not produce or contribute to the reviewed repair  
**Diff-derived category:** MIXED — `CI_WORKFLOW` + `KNOWLEDGE_GOVERNANCE` + `GOVERNANCE_EVIDENCE`  
**Adoption phase:** `PHASE_B_BLOCKING`  
**Verdict:** `REJECTION-PACKAGE`  
**HANDOVER_ALLOWED:** no  
**RESULT:** `REJECTED_BACK_TO_PRODUCER`

### Exact-head evidence independently verified

- Actual diff: 13 files; the PR-scoped declaration and admin manifest both list the same 13 paths.
- Protected agent contracts, product/runtime code, MMM, Supabase, Vercel, infrastructure, and Issue #1959 implementation are absent from the diff.
- Delegation lineage is ordered: pre-brief `e1a9b9a95a9ef712a7d3e6f92e1aeb1327dad167` → appointment `f6b081c8014f235543815de185958ba8f2a01ab2` → first implementation `7cac621b9e04d83ed3149f1923051b0a4bddb0cf` → QP `ed15a811b6e617bcb2c8b30a0ec37ac4053c128d` → ECAP/admin head `fb9f3c9e62e5390864558e519f6f58c30a8e9d64`.
- Focused local command `bash .github/scripts/wake-up-protocol.test.sh`: 3 passed, 0 failed.
- Local Wave 7 command `node .github/scripts/wave7-governance-validation.js`: 10/10 policy scenarios and 13/13 real-gate fixtures matched.
- Hosted Wave 7 Governance Validation run `30202724391`, job `89795379621`, checked out `fb9f3c9e62e5390864558e519f6f58c30a8e9d64` and passed G13 plus all existing scenarios.
- All ten pull-request-triggered GitHub workflow runs at the reviewed head completed successfully, including CodeQL.
- All three Vercel commit statuses are `success`.
- Unresolved review threads: 0.
- `governance/CANON_INVENTORY.json`: 203 hash fields inspected; no null, empty, zeroed, or truncated values.

### Acceptance-Criteria Evidence Matrix

| # | Governing requirement | Required evidence | Independent evidence | Verdict |
|---|---|---|---|---|
| 1 | Restore a fit Foreman session-memory template with the mandatory identity, bootstrap, prior-session, role/delegation, blocker, QP/ECAP/IAA, tracker, CI, next-action and close fields | Committed artifact / static inspection | `.agent-workspace/foreman-v2/knowledge/session-memory-template.md` contains all named fields and completion rules | PASS |
| 2 | Exit nonzero when a contract-declared Tier 2 required file is absent | Executable negative-path test | Focused fixture removes `beta.md`, exits nonzero and names `beta.md`; validator loops across all declared entries | PASS |
| 3 | Do not generate a ready working contract after Tier 2 validation failure | Executable negative-path test | Focused fixture deletes any prior carrier, triggers Tier 2 failure, and verifies `working-contract.md` is absent and readiness text is not emitted | PASS |
| 4 | Focused happy and negative regressions pass, including current Foreman compatibility | CI_TEST plus real-agent execution | The three isolated fixtures pass, but the real Foreman complete-manifest path is not reliable: 4 of 20 repeated runs exited 2 during memory scan under the current head | **FAIL** |
| 5 | PR checks are green at the frozen head | Hosted CI/status evidence | Ten GitHub workflows and three Vercel statuses are successful at `fb9f3c9e62e5390864558e519f6f58c30a8e9d64` | PASS |
| 6 | Independent IAA must PASS or the wave remains blocked | Independent final review | This invocation rejects; no PASS token is issued | **FAIL — wave remains blocked** |
| 7 | #1959 remains unmodified until repair closure | Diff evidence | No #1959, MMM, product, database or infrastructure file appears in the 13-file diff | PASS |

**Matrix status:** INCOMPLETE — requirements 4 and 6 are unsatisfied.

### Core and overlay results

- `CORE-020`: PASS — no unverifiable item was assumed to pass.
- `CORE-021`: PASS — every identified defect is blocking.
- `CORE-026`: FAIL — acceptance matrix is incomplete because the real complete-manifest bootstrap is flaky.
- `CORE-027`: FAIL — the independent risk challenge identifies an evidenced post-merge failure and contradictory active ceremony state.
- `OVL-CI-001`: FAIL — the validator's isolated happy fixture does not represent a real agent with a populated memory history; full bootstrap is non-deterministic.
- `OVL-CI-002`: PASS — no required merge gate was removed or weakened.
- `OVL-CI-003`: FAIL — a pre-existing `pipefail` interaction in the modified validator is allowed to terminate bootstrap non-deterministically and is not covered by G13.
- `OVL-CI-004`: PASS — no environment-specific gate logic was introduced.
- `OVL-CI-005`: PASS — exact-head hosted evidence is present.
- `OVL-KG-001`: PASS — the restored template is operationally clear.
- `OVL-KG-002`: PASS — restoration is grounded in the confirmed missing-control incident.
- `OVL-KG-003`: PASS — no duplicate template exists at the required path.
- `OVL-KG-004`: PASS — the Tier 1 and Tier 2 references resolve to the restored file.
- `OVL-SAA-001`: PASS — Issue #1969 is unambiguous.
- `OVL-SAA-002`: PASS — the detected governance/admin/script change class matches the declared repair.
- `OVL-SAA-003`: PASS — CodexAdvisor, Foreman QP, ECAP and independent IAA roles are separated.
- `OVL-SAA-004`: PASS — product-delivery evidence is correctly suppressed.
- `OVL-SAA-005`: FAIL — final handover evidence is incomplete: no embedded PREHANDOVER proof and no Foreman session memory are committed.
- `OVL-SAA-006`: FAIL — the real populated-memory `pipefail` failure pattern was not covered by the focused regression.
- `OVL-SAA-007`: PASS — no final merge-ready claim was accepted while checks were red.
- `OVL-SAA-008`: FAIL — the identified real-memory pipeline risk is absent from the submitted risk record.
- `OVL-SMP-001 ADMIN_PASS`: no — active ceremony carriers contradict the committed execution state.
- `OVL-SMP-002 JOB_PASS`: no — current Foreman bootstrap cannot reliably complete.
- `OVL-SMP-003 NO_UNRESOLVED_DEFECTS`: no — findings F-001 through F-004 remain open.
- `MERGE_READY`: no.

### Findings

#### F-001 — Real Foreman bootstrap remains non-deterministic (Substantive / Systemic)

**Finding:** With 263 committed Foreman session memories, repeated execution of:

```text
.github/scripts/wake-up-protocol.sh foreman-v2
```

at the reviewed head produced 16 successful runs and 4 exit-code-2 failures. The same failure was independently reproduced for the IAA agent: 7 successful runs and 5 exit-code-2 failures across 12 runs. Failing runs stop in Phase 2 with:

```text
sort: write failed: 'standard output': Broken pipe
sort: write error
```

The cause is `.github/scripts/wake-up-protocol.sh` line 360: `find ... | sort -r | head -5 | while ...` executes under `set -euo pipefail`. On a populated memory directory, `head` can close the pipe before `sort` completes; whether `sort` receives SIGPIPE is timing-dependent. The isolated happy fixture has zero session memories, so G13 cannot detect this failure.

This violates Issue #1969's bounded regression obligation that the current Foreman required set passes and the appointment stop condition `existing agent bootstrap behavior regresses`. It also triggers the carry-forward rule for a broken state visible in the modified bootstrap surface.

**Required fix:**
1. Make the Phase 2 recent-session listing pipefail-safe without suppressing genuine `find` failures.
2. Extend `.github/scripts/wake-up-protocol.test.sh` with a populated-memory fixture containing more than five session files.
3. Prove repeated complete-manifest Foreman bootstrap execution is stable, then rerun Wave 7 and hosted exact-head checks.

**Structural prevention:** the regression must exercise a populated memory directory; an empty-memory happy path is insufficient for this bootstrap.

#### F-002 — Mandatory final ceremony evidence is absent (Ceremony)

**Finding:** This is a triggered `CI_WORKFLOW` / `KNOWLEDGE_GOVERNANCE` wave with ECAP required, but the active branch has neither:
- an embedded `## 2. PREHANDOVER Proof` section in the canonical IAA wave record; nor
- a committed Foreman session memory for Issue #1969 / PR #1970.

The universal ceremony gate therefore fails CERT-001, CERT-002, CERT-003 and CERT-004. The green Foreman Pre-Handover Lane Gate does not prove final ceremony completeness because the PR intentionally has not yet asserted handover intent.

**Required fix:** Commit the canonical embedded PREHANDOVER section and the Foreman session memory, bind them to the exact corrected head, include gate inventory/evidence and the expected IAA reference, and preserve PREHANDOVER immutability before re-invoking IAA.

#### F-003 — Active task carrier contradicts committed authority and execution state (Ceremony)

**Finding:** `.agent-admin/prs/pr-1970/wave-current-tasks.md` still declares:

- `Status: PREFLIGHT / IMPLEMENTATION NOT YET AUTHORIZED`;
- GOV-1969-01 through GOV-1969-04 as `PENDING`.

Those statements contradict the committed appointment, implementation, QP PASS and ECAP `ADMIN_VALIDATED` carriers. This is an active-bundle state contradiction and would trigger ACR-12/ACR-15 if a PASS token were issued.

**Required fix:** Reconcile the tracker truthfully before the immutable PREHANDOVER carrier is committed. Completed implementation/QP/ECAP work must not remain described as unauthorized or pending; final IAA and CS2 merge/closure must remain pending.

#### F-004 — PR-scoped authority text excludes the required IAA write (Ceremony)

**Finding:** `.agent-admin/scope-declarations/pr-1970.md` lists the canonical wave record as an authorized changed file, but its `OUT_OF_SCOPE` and Boundary text simultaneously exclude “IAA token or verdict writing” and “final IAA.” The required append-only verdict would therefore contradict the active PR-scoped authority carrier.

**Required fix:** Clarify that producer/Foreman/ECAP self-certification is prohibited while the independently invoked IAA is authorized to append the verdict or rejection to the already-declared canonical wave record. Keep merge authority with CS2.

### Independent Risk Challenge

1. **What could still fail after merge?** Real Foreman or IAA sessions with populated memory histories can terminate in Phase 2 even though all Tier 2 controls are present; the repository could also present contradictory lifecycle evidence during handover.
2. **What evidence would prove it does not fail?** A pipefail-safe memory listing, an executable populated-memory regression, repeated real Foreman passes, a current task carrier, immutable PREHANDOVER proof, committed session memory, and fresh exact-head CI.
3. **Is that evidence present?** No. The flake is reproducible and the required final ceremony carriers are absent.
4. **Is there a contradiction between issue intent, architecture requirements and PR evidence?** Yes. The issue promises a reliable current-Foreman happy path and final assurance, while the real path is flaky and active carriers still describe implementation as unauthorized/pending.
5. **Would a reasonable production owner accept this as merge-ready?** No. A governance bootstrap repair must not ship with a reproducible bootstrap termination and contradictory handover authority.

**Independent Risk Challenge:** INCOMPLETE — evidenced risks remain unmitigated.

### Binary verdict

```text
═══════════════════════════════════════
REJECTION-PACKAGE
PR: #1970 — Governance: fail closed on missing Foreman Tier 2 controls
Reviewed HEAD: fb9f3c9e62e5390864558e519f6f58c30a8e9d64
4 findings remain open. Merge blocked. STOP-AND-FIX required.
HANDOVER_ALLOWED: no
RESULT: REJECTED_BACK_TO_PRODUCER
Adoption phase: PHASE_B_BLOCKING
No ASSURANCE-TOKEN issued.
═══════════════════════════════════════
```

Re-invoke independent IAA only after all four findings are corrected and the new exact head is frozen.

### Final Assurance Invocation R2 — 2026-07-26

**IAA session:** `session-218` / `IAA-session-1970-R2-20260726`
**PR:** #1970 — Governance: fail closed on missing Foreman Tier 2 controls
**Issue:** #1969
**Branch:** `agent/foreman-bootstrap-fail-closed-1969`
**Reviewed HEAD:** `03b6c3106661852ae40caa295fdb87df967df0ba`
**Produced by:** `CodexAdvisor-agent` under the bounded appointment committed at `f6b081c8014f235543815de185958ba8f2a01ab2`
**Invoked by:** `foreman-v2-agent`
**Ceremony-admin:** YES — ECAP R3 is committed
**Independence:** CONFIRMED — this IAA did not produce or contribute to the reviewed artifacts
**Diff-derived category:** MIXED — `CI_WORKFLOW` + `KNOWLEDGE_GOVERNANCE` + `GOVERNANCE_EVIDENCE` / `SIMPLIFIED_ADMIN_ASSURANCE`
**Adoption phase:** `PHASE_B_BLOCKING`
**Verdict:** `REJECTION-PACKAGE`
**RCA_REVIEW:** `REFER_BACK`
**HANDOVER_ALLOWED:** no
**RESULT:** `REJECTED_BACK_TO_PRODUCER`

#### R1 finding closure mapping

| R1 finding | Independent R2 evidence | R2 state |
|---|---|---|
| F-001 — populated-memory bootstrap flake | The corrected recent-session path fully sorts to a temporary file before limiting output; focused suite 4/4; real `foreman-v2` 20/20 and `independent-assurance` 12/12 repeated bootstraps pass | CLOSED |
| F-002 — missing final ceremony evidence | Canonical embedded `## 2. PREHANDOVER Proof`, immutable source memory, and separately declared correction addendum are committed | CLOSED |
| F-003 — stale active task carrier | `.agent-admin/prs/pr-1970/wave-current-tasks.md` records QP R3 PASS, ECAP R3 `ADMIN_VALIDATED`, the committed final carrier, and only final IAA/CS2 closure as pending | CLOSED |
| F-004 — IAA append authority excluded | `.agent-admin/scope-declarations/pr-1970.md` expressly permits independently invoked IAA to append only its binary result to this wave record while prohibiting producer/Foreman/ECAP self-certification | CLOSED |

R1 closure does not waive a new defect independently identified in R2.

#### Exact-head evidence independently verified

- Actual diff against `origin/main`: exactly 16 paths; `.agent-admin/scope-declarations/pr-1970.md` and `.admin/prs/pr-1970.json` contain the same 16 paths.
- Ordered ancestry is proven from pre-brief `e1a9b9a9…` through appointment `f6b081c8…`, implementation, R1 rejection, corrections, QP R3, ECAP R3, addendum authorization, and frozen carrier `03b6c310…`.
- Shell and Node syntax checks pass.
- `bash .github/scripts/wake-up-protocol.test.sh`: 4/4 scenarios pass.
- `node .github/scripts/wave7-governance-validation.js`: 11/11 policy scenarios and 17/17 real-gate fixtures match.
- Real repeated bootstrap: `foreman-v2` 20/20 and `independent-assurance` 12/12 pass.
- `PR_NUMBER=1970 .github/scripts/validate-scope-to-diff.sh`: exact 16/16 set comparison PASS.
- `WAVE6_ALIGNMENT_SELF_TEST=1 node .github/scripts/merge-gate-required-checks-alignment.js`: manifest, Foreman contract, and workflow-backed checks align; 7/7 self-tests pass.
- All ten pull-request-triggered workflows at `03b6c310…` completed successfully: runs `30204917031`, `30204917266`, `30204917017`, `30204917033`, `30204917010`, `30204917040`, `30204917051`, `30204917045`, `30204917046`, and `30204917016`.
- Hosted Wave 7 job `89801203619` checked out `03b6c310…` and executed G1–G17 successfully.
- All three Vercel statuses are `success`; unresolved review threads are zero; the PR is open, draft, and mergeable.
- `governance/CANON_INVENTORY.json`: 406 hash-named fields inspected; zero null, blank, zeroed, or truncated values.
- No `.github/agents/**`, product/runtime, MMM, Supabase, Vercel configuration, infrastructure, deployment, or Issue #1959 implementation path is in the diff.

#### Acceptance-Criteria Evidence Matrix

| # | Governing Issue #1969 criterion | Required evidence | Independent evidence | Verdict |
|---|---|---|---|---|
| 1 | Required Foreman session-memory template exists with all named fields | Committed artifact / static inspection | Restored template contains identity, bootstrap, prior-session, role/delegation, blockers, QP/ECAP/IAA, tracker, CI, next-action, and close fields | PASS |
| 2 | Wake-up fails nonzero for any absent contract-declared Tier 2 file | Executable negative path | Focused fixture removes `beta.md`, exits nonzero, and names it; validator iterates all declared entries | PASS |
| 3 | No ready working contract after Tier 2 failure | Executable negative path | Fixture asserts readiness text absent and `working-contract.md` not generated | PASS |
| 4 | Focused bootstrap happy/negative regressions pass | CI_TEST | Local 4/4 plus hosted G13 PASS; repeated real bootstraps 20/20 and 12/12 | PASS |
| 5 | Truthful `handover_allowed: false` / `final_iaa_verdict: PENDING` ordinary memory passes without control | Executable semantic fixture | G14 and direct production-gate execution PASS without `handover-allowed.json` | PASS |
| 6 | Explicit PREHANDOVER paths and every actual positive readiness/handover claim remain fail-closed without valid current-head control | Executable positive/negative semantic challenge | Explicit PREHANDOVER and YAML/narrative examples fail correctly, but actual JSON and Markdown-table positive claims pass without a control | **FAIL** |
| 7 | A valid positive claim with valid current-head control passes | Executable controlled positive path | Independent fixture with `handover_allowed: true` plus valid exact-head control exits 0 | PASS |
| 8 | Frozen-head PR checks are green | Hosted CI/status evidence | Ten GitHub workflows and three Vercel statuses are successful at `03b6c310…` | PASS |
| 9 | IAA PASS or wave remains blocked | Independent assurance | This invocation rejects; no PASS token is issued and the wave remains blocked | BLOCKED |
| 10 | #1959 remains unmodified until repair closure | Diff evidence | No Issue #1959, MMM, product, database, or infrastructure implementation path appears in the diff | PASS |

**Matrix status:** INCOMPLETE — criterion 6 fails; criterion 9 therefore remains in its blocking branch.

#### Core, overlay, ACR, and merge-parity results

- `CORE-020`: PASS — no unverifiable evidence was assumed to pass.
- `CORE-021`: PASS — the identified defect is blocking.
- `CORE-026`: FAIL — the acceptance-criteria matrix is incomplete at criterion 6.
- `CORE-027`: FAIL — independent risk challenge confirms an evidenced post-merge bypass remains.
- `CERT-001` through `CERT-004`: PASS — committed PREHANDOVER, session evidence, FAIL-ONLY-ONCE attestation, and expected IAA reference are present.
- `OVL-CI-001`: FAIL — structured positive-claim enforcement does not cover all scanned carrier syntaxes.
- `OVL-CI-002`: PASS — no existing required gate was removed.
- `OVL-CI-003`: FAIL — unsupported structured syntax silently follows the no-claim pass path.
- `OVL-CI-004`: PASS — no environment-specific branch was introduced.
- `OVL-CI-005`: PASS — exact-head hosted execution evidence is present.
- `OVL-KG-001` through `OVL-KG-004`: PASS — the restored template is clear, incident-grounded, non-duplicative at its required path, and its references resolve.
- `OVL-KG-ADM-001` through `OVL-KG-ADM-003`: PASS — ceremony is present; the newly restored v1.0.0 template is registered by the existing index entry and requires no prior-version increment.
- `OVL-GE-001` through `OVL-GE-003`: PASS — no future-dated completion or live-runtime evidence downgrade was found.
- `OVL-GE-004`: FAIL — governing criterion 6 lacks complete hard evidence because independent counterexamples bypass the control.
- `OVL-SAA-001` through `OVL-SAA-005`: PASS.
- `OVL-SAA-006`: FAIL — the submitted known-risk coverage did not challenge JSON or Markdown-table structured claims even though the production scan pattern includes those carrier formats.
- `OVL-SAA-007`: PASS — no handover claim is accepted while required hosted checks are red.
- `OVL-SAA-008`: FAIL — the active risk record declares positive claims controlled but omits the evidenced structured-syntax bypass.
- `ACR-01` through `ACR-16`: PASS at the pre-verdict active bundle; historical R1 rejection and immutable source memory are correctly excluded from active-state contradiction checks.
- `OVL-SMP-001 ADMIN_PASS`: yes — active ceremony, scope, ordered lineage, ECAP, and exact-head evidence are coherent.
- `OVL-SMP-002 JOB_PASS`: no — positive-claim fail-closed enforcement is incomplete.
- `OVL-SMP-003 NO_UNRESOLVED_DEFECTS`: no — F-005 remains open.
- `MERGE_READY`: no.
- Local scope, required-check alignment, syntax, focused bootstrap, Wave 7, and hosted exact-head parity checks pass; substantive merge-gate parity fails on policy correctness.

**Total:** 57 checks; 48 PASS; 9 FAIL.

#### F-005 — Positive structured claims can bypass the prehandover control (Substantive / Systemic)

**Finding:** `.github/scripts/foreman-prehandover-lane-gate.js` explicitly scans ordinary `.md`, `.txt`, `.json`, `.yml`, and `.yaml` Foreman/ECAP carriers, but its structured positive-claim patterns at lines 14–17 accept only unquoted `key: value` lines. Independent production-gate fixtures show the following actual positive claims exit 0 without `.agent-admin/control/handover-allowed.json`:

```text
{"handover_allowed": true}
{"final_iaa_verdict": "PASS"}
| handover_allowed | true |
```

The gate reports zero positive claim hits and takes the no-claim pass path. G15–G17 do not cover these forms; they exercise only unquoted YAML-style fields and two narrative phrases. This contradicts Issue #1969 acceptance criterion 6 and the appointment prohibition against permitting a positive readiness claim merely because it appears in an ordinary session-memory path.

**Required fix:**

1. Make structured positive-claim detection format-aware for every carrier syntax the production scan admits, including quoted JSON keys/values and Markdown table fields.
2. Add real production-gate fixtures proving those positive forms fail without the control and still pass only with a valid exact-current-head control.
3. Retain G14's truthful pending/negative pass behavior and all explicit PREHANDOVER enforcement.
4. Refresh QP, ECAP, frozen-head hosted evidence, and independent IAA after the correction.

**Structural prevention:** real-gate coverage must include each admitted structured carrier format; duplicating only the same unquoted regex in the policy oracle is insufficient.

#### Independent Risk Challenge

1. **What could still fail after merge?** A Foreman or ECAP ordinary carrier can make a positive handover/readiness assertion in valid JSON or a Markdown table and the prehandover lane gate will treat it as no claim, allowing the branch to avoid the required current-head control.
2. **What evidence would prove it does not fail?** Format-aware production detection plus real-gate negative fixtures for JSON and Markdown-table positive fields, alongside the retained pending/negative and valid-control cases.
3. **Is that evidence present?** No. Independent fixtures reproduce the bypass at the frozen head.
4. **Is there a contradiction between issue intent, architecture requirements, and PR evidence?** Yes. The issue requires every actual positive claim to remain fail-closed, while the implementation and submitted fixtures cover only selected syntaxes.
5. **Would a reasonable production owner accept this as merge-ready?** No. A gate repair cannot be accepted while the protected positive-claim boundary is bypassable through carrier formats the gate itself declares scannable.

**Independent Risk Challenge:** COMPLETE; its answers require rejection.

#### Binary verdict

```text
═══════════════════════════════════════
REJECTION-PACKAGE
PR: #1970 — Governance: fail closed on missing Foreman Tier 2 controls
Reviewed HEAD: 03b6c3106661852ae40caa295fdb87df967df0ba
1 new systemic finding remains open. Merge blocked. STOP-AND-FIX required.
RCA_REVIEW: REFER_BACK
HANDOVER_ALLOWED: no
RESULT: REJECTED_BACK_TO_PRODUCER
Adoption phase: PHASE_B_BLOCKING
No ASSURANCE-TOKEN issued.
═══════════════════════════════════════
```

Re-invoke independent IAA only after F-005 is corrected, QP/ECAP are refreshed, and the new exact head is frozen.

### Final Assurance Invocation R3 — 2026-07-26

**IAA session:** `session-219` / `IAA-session-1970-R3-20260726`
**PR:** #1970 — Governance: fail closed on missing Foreman Tier 2 controls
**Issue:** #1969
**Branch:** `agent/foreman-bootstrap-fail-closed-1969`
**Reviewed HEAD:** `cdf6b5d5fc3640fef8f13134f7283f1bf5c1d92d`
**Produced by:** `CodexAdvisor-agent`; F-005 correction `719c5e7628d173805d0ab568ff387331d57c0316`
**Invoked by:** `foreman-v2-agent`
**Ceremony-admin:** YES — ECAP R4 `ADMIN_VALIDATED`
**Independence:** CONFIRMED — this IAA did not produce or contribute to the correction
**Diff-derived category:** MIXED — `CI_WORKFLOW` + `KNOWLEDGE_GOVERNANCE` + `GOVERNANCE_EVIDENCE` / `SIMPLIFIED_ADMIN_ASSURANCE`
**Adoption phase:** `PHASE_B_BLOCKING`
**Verdict:** `REJECTION-PACKAGE`
**RCA_REVIEW:** `REFER_BACK`
**HANDOVER_ALLOWED:** no
**RESULT:** `REJECTED_BACK_TO_PRODUCER`

#### Prior-finding closure mapping

| Finding | Independent R3 evidence | R3 state |
|---|---|---|
| F-001 — populated-memory bootstrap flake | Focused suite 4/4; real `foreman-v2` 20/20 and `independent-assurance` 12/12 repeated bootstraps pass | CLOSED |
| F-002 — missing final ceremony evidence | Embedded immutable PREHANDOVER proof, source memory, and correction addendum remain committed | CLOSED |
| F-003 — stale task carrier | Active tracker truthfully records QP R4 PASS, ECAP R4 `ADMIN_VALIDATED`, and final IAA pending | CLOSED |
| F-004 — IAA append authority excluded | PR scope permits only independent IAA to append its binary result to this wave record | CLOSED |
| F-005 — structured positive-claim bypass | Nested and alternate-key JSON, trailing-pipe Markdown, and negative/pending boundaries pass independent challenges; valid Markdown tables with an omitted trailing pipe or omitted edge pipes still bypass the control | **OPEN** |

#### Exact-head evidence independently verified

- Live Issue #1969 acceptance criteria were fetched directly from GitHub.
- Live PR #1970 is open and has the exact 16 filenames declared in `.agent-admin/scope-declarations/pr-1970.md` and `.admin/prs/pr-1970.json`.
- No `.github/agents/**`, product/runtime, MMM, Supabase, Vercel configuration, infrastructure, deployment, or Issue #1959 implementation path is in the diff.
- Shell and Node syntax checks pass.
- `bash .github/scripts/wake-up-protocol.test.sh`: 4/4 scenarios pass.
- `node .github/scripts/wave7-governance-validation.js`: 11/11 policy scenarios and 23/23 real-gate fixtures match.
- Real repeated bootstrap: `foreman-v2` 20/20 and `independent-assurance` 12/12 pass.
- `PR_NUMBER=1970 bash .github/scripts/validate-scope-to-diff.sh`: exact 16/16 parity PASS.
- `WAVE6_ALIGNMENT_SELF_TEST=1 node .github/scripts/merge-gate-required-checks-alignment.js`: 7/7 self-tests and required-check alignment PASS.
- All ten exact-head GitHub workflow runs succeeded: `30205926596`, `30205926599`, `30205926614`, `30205926605`, `30205926602`, `30205926616`, `30205926622`, `30205926595`, `30205926619`, and `30205926590`.
- Hosted Wave 7 job `89803848670` checked out exact head `cdf6b5d5…` and executed G1–G23 successfully.
- Three Vercel statuses are successful; unresolved review threads are zero.
- `governance/CANON_INVENTORY.json`: 203 `file_hash_sha256` fields inspected; zero invalid values.

#### Acceptance-Criteria Evidence Matrix

| # | Governing Issue #1969 criterion | Independent evidence | Verdict |
|---|---|---|---|
| 1 | Required Foreman template exists with mandatory fields | Committed template contains the named identity, bootstrap, continuity, delegation, blocker, QP/ECAP/IAA, tracker, CI, next-action, and close fields | PASS |
| 2 | Wake-up fails nonzero when any required Tier 2 file is absent | Focused missing-file fixture exits nonzero and names `beta.md`; validator iterates the active contract list | PASS |
| 3 | No ready working contract after Tier 2 failure | Negative fixture proves no readiness output and no `working-contract.md` | PASS |
| 4 | Focused bootstrap happy/negative regressions pass | Local 4/4; real repeated bootstraps 20/20 and 12/12; hosted G13 PASS | PASS |
| 5 | Negative/pending ordinary memory passes without control | G14, G22, G23, and independent JSON/Markdown boundary challenges PASS | PASS |
| 6 | Explicit PREHANDOVER or any positive readiness/handover claim fails without valid current-head control | Explicit paths, YAML, narrative, JSON, nested JSON, and trailing-pipe Markdown fail correctly; valid no-trailing-pipe and no-edge-pipe Markdown table claims pass without control | **FAIL** |
| 7 | Valid positive claim with current-head control passes | G21 and independent exact-head control fixture PASS | PASS |
| 8 | Frozen-head PR checks are green | Ten GitHub workflows and three Vercel statuses succeed at `cdf6b5d5…` | PASS |
| 9 | Independent IAA PASS or wave remains blocked | This invocation rejects; no token is issued and the wave remains blocked | BLOCKED |
| 10 | #1959 remains unmodified | Exact 16-path diff contains no #1959, MMM, product, database, or infrastructure implementation | PASS |

**Matrix status:** INCOMPLETE — criterion 6 fails; criterion 9 remains on its blocking branch.

#### Core, overlay, ACR, and parity results

- `FAIL-ONLY-ONCE` A-001 and A-002: PASS.
- `CORE-020`, `CORE-021`: PASS.
- `CORE-026`, `CORE-027`: FAIL — criterion 6 remains incomplete and the independent risk challenge reproduces a post-merge bypass.
- `CERT-001` through `CERT-004`: PASS.
- `OVL-CI-001`, `OVL-CI-003`: FAIL — advertised Markdown carrier enforcement remains syntax-dependent and silently takes the no-claim path.
- `OVL-CI-002`, `OVL-CI-004`, `OVL-CI-005`: PASS.
- `OVL-KG-001` through `OVL-KG-004` and `OVL-KG-ADM-001` through `OVL-KG-ADM-003`: PASS.
- `OVL-GE-001` through `OVL-GE-003`: PASS; `OVL-GE-004`: FAIL.
- `OVL-SAA-001` through `OVL-SAA-007`: PASS; `OVL-SAA-008`: FAIL because the active risk record does not include the alternate valid Markdown-table bypass.
- `ACR-01` through `ACR-16`: PASS for the active pre-verdict bundle; immutable PREHANDOVER and prior rejection history are correctly treated as historical sources.
- `OVL-SMP-001 ADMIN_PASS`: yes.
- `OVL-SMP-002 JOB_PASS`: no — F-005 is not fully corrected.
- `OVL-SMP-003 NO_UNRESOLVED_DEFECTS`: no — F-005 remains open.
- Required local merge-gate interfaces and exact-head hosted gates pass mechanically; substantive policy parity fails.

**Total:** 57 checks; 49 PASS; 8 FAIL.

#### F-005 — Markdown table positive claims remain syntax-dependent (Substantive / Systemic)

The F-005 correction detects JSON recursively and detects a Markdown row only when the trimmed line starts with `|` and the value survives `.split('|').slice(1, -1)`. Both of these valid GitHub-Flavored Markdown table forms therefore exit 0 without `.agent-admin/control/handover-allowed.json`:

```text
| field | value
|---|---
| handover_allowed | true
```

```text
field | value
---|---
handover_allowed | true
```

The gate reports zero positive claim hits and follows the no-claim pass path. The same independent suite confirms nested JSON, arrays, `handover-allowed`, `final_state`, quoted/bold values, and negative/pending near-miss boundaries behave correctly. The defect is limited to an incomplete Markdown-table parser, but it leaves Issue #1969 criterion 6 and the systemic prevention required by R2 F-005 unsatisfied.

**Required fix:**

1. Parse Markdown table rows with optional leading and trailing pipes.
2. Add real production-gate fixtures for positive rows without a trailing pipe and without edge pipes.
3. Preserve the existing negative/pending JSON/table, explicit PREHANDOVER, JSON, YAML, narrative, and valid-control behaviors.
4. Refresh QP, ECAP, exact-head hosted evidence, and independent IAA.

**Structural prevention:** the real-gate matrix must exercise syntactic variants admitted by the governed structured format, rather than only one canonical rendering.

#### Token-coherence review

The immutable PREHANDOVER reference `IAA-session-1970-R2-20260726-PASS` remains an expected handle only and is not an issued token. R3 denotes the third independent assurance invocation after the R2 rejection; it does not authorize retroactive reuse or fabrication of the R2 expected handle. Because F-005 remains open, neither that handle nor an R3 PASS token is issued.

#### Independent Risk Challenge

1. **What could still fail after merge?** A positive handover/readiness field in a valid Markdown table lacking a trailing pipe or edge pipes can bypass current-head control enforcement.
2. **What evidence would prove it does not fail?** Format-aware production parsing plus real-gate fixtures for both optional-pipe forms, while retaining all positive, negative, pending, and valid-control cases.
3. **Is that evidence present?** No. Independent production-gate fixtures reproduce both bypasses.
4. **Is there a contradiction between issue intent, architecture requirements, and PR evidence?** Yes. Issue #1969 requires every actual positive claim to remain fail-closed, while current behavior depends on one Markdown rendering.
5. **Would a reasonable production owner accept this as merge-ready?** No. The repaired governance boundary remains bypassable through valid syntax in a carrier format the gate explicitly scans.

**Independent Risk Challenge:** COMPLETE; its answers require rejection.

#### Binary verdict

```text
═══════════════════════════════════════
REJECTION-PACKAGE
PR: #1970 — Governance: fail closed on missing Foreman Tier 2 controls
Reviewed HEAD: cdf6b5d5fc3640fef8f13134f7283f1bf5c1d92d
F-005 remains open. Merge blocked. STOP-AND-FIX required.
RCA_REVIEW: REFER_BACK
HANDOVER_ALLOWED: no
RESULT: REJECTED_BACK_TO_PRODUCER
Adoption phase: PHASE_B_BLOCKING
No ASSURANCE-TOKEN issued.
═══════════════════════════════════════
```

Re-invoke independent IAA only after F-005 is fully corrected, QP/ECAP are refreshed, and the new exact head is frozen.

## 2. PREHANDOVER Proof

### 2.1 Identity and scope

- Wave: `foreman-bootstrap-repair-1969`
- Issue: #1969
- PR: #1970
- Branch: `agent/foreman-bootstrap-fail-closed-1969`
- Producing role: `CodexAdvisor-agent` under the bounded appointment at `f6b081c8014f235543815de185958ba8f2a01ab2`
- Invoking role: `foreman-v2-agent`
- Ceremony administrator: `execution-ceremony-admin-agent`
- Frozen evidence head: `3211472c165db0bb4e5c44baedc80be540d80579`
- Scope authority parent: `9d813b9e8d5b37b9d999074d01d41d32fda35977`
- Declared and effective scope: 16 paths
- Immutable source memory: `.agent-workspace/foreman-v2/memory/session-foreman-bootstrap-repair-1969-20260726.md`
- Current correction addendum: `.agent-workspace/foreman-v2/memory/CORRECTION-ADDENDUM-session-foreman-bootstrap-repair-1969-prehandover-deadlock-20260726.md`

### 2.2 Corrected delivery state

| Obligation | Evidence | State |
|---|---|---|
| Restore the required Tier 2 session-memory template | committed implementation `7cac621b9e04d83ed3149f1923051b0a4bddb0cf` | COMPLETE |
| Fail closed on missing contract-declared Tier 2 controls | focused missing-file fixture; no false success/readiness or working-contract output | COMPLETE |
| Remove populated-memory bootstrap flake | correction `ef8c628ca3bca433fbe084055c5dded1f13036f8`; Foreman 20/20 and IAA 12/12 | COMPLETE |
| Distinguish negative/pending evidence from positive readiness | semantic correction `a1baaaa8d89fdc4355392fb974e7af3cbe3e6869`; G14–G17 | COMPLETE |
| Preserve explicit PREHANDOVER and positive-claim enforcement | existing current-head control remains mandatory; positive fixtures fail without it | COMPLETE |
| Foreman QP | QP R3 carrier `e3aa19c7b6b92c2868067bb27b303cbfc5b59018` | PASS |
| ECAP administration | R3 carrier `3211472c165db0bb4e5c44baedc80be540d80579` | ADMIN_VALIDATED |
| Independent final IAA | IAA-only append to this wave record | PENDING |

### 2.3 Test and anti-regression evidence

- `bash .github/scripts/wake-up-protocol.test.sh`: 4/4 scenarios passed.
- `node .github/scripts/wave7-governance-validation.js`: 11/11 policy scenarios and 17/17 real-gate fixtures matched.
- Real `foreman-v2` bootstrap: 20/20 passes.
- Real `independent-assurance` bootstrap: 12/12 passes.
- Negative missing-file fixture exits nonzero, names the missing path, emits no readiness text, and creates no working contract.
- G14 permits truthful `handover_allowed: false` / `final_iaa_verdict: PENDING` ordinary session evidence.
- G15–G17 keep positive structured, merge-ready, and delivery-complete claims fail-closed.
- Explicit PREHANDOVER paths remain lane intent.
- No `.skip`, `.todo`, incomplete, vacuous, or stub assertion is introduced.

### 2.4 Gate inventory at the frozen evidence head

`gate_set_checked:`

| Gate | Run | State |
|---|---:|---|
| Preflight Evidence Gate | `30204655917` | GREEN |
| Foreman Pre-Handover Lane Gate | `30204655886` | GREEN |
| IAA Pre-Brief Contract Alignment | `30204655902` | GREEN |
| Stub Detection Check | `30204655885` | GREEN |
| Builder Delegation Order Gate | `30204655898` | GREEN |
| ECAP Admin Boundary Gate | `30204655887` | GREEN |
| Wave 7 Governance Validation | `30204655883` | GREEN |
| Merge Gate Required Checks Alignment | `30204655907` | GREEN |
| POLC Boundary Validation | `30204655889` | GREEN |
| CodeQL | `30204655869` | GREEN |

- GitHub workflows: 10/10 success.
- Vercel commit statuses: 3/3 success.
- Unresolved review threads: 0.
- PR state: open, draft, mergeable.
- `merge_gate_parity: PASS` at the frozen evidence head.
- The final carrier head must be rechecked non-mutatively before IAA R2.

### 2.5 Delegation and role separation

The ordered lineage is:

`e1a9b9a9… pre-brief → f6b081c8… appointment → 7cac621b… implementation → c7e28382… IAA R1 rejection → ef8c628c… correction → 610d4a4a… QP R2 → 781a7b62… ECAP R2 → 6ea18311… immutable source memory → 3cb551de… CS2 extension → a1baaaa8… semantic gate correction → 57bcf199… positive-claim coverage → e3aa19c7… QP R3 → 3211472c… ECAP R3 → 9d813b9e… addendum scope authority → final carrier`.

- Foreman made the QP judgment and did not implement the repair.
- ECAP made only administrative findings and did not invoke IAA.
- The producer, Foreman, and ECAP have not written a final assurance verdict or token.
- Independent IAA may append only its binary R2 verdict under this canonical wave record.
- Merge authority remains CS2-only.

### 2.6 Scope, security, and ripple assessment

- The effective 16-path diff is entirely within the PR-scoped manifest/declaration.
- No protected `.github/agents/**`, product/runtime, MMM, Supabase, Vercel, deployment, infrastructure, secret, or Issue #1959 implementation path is changed.
- Deployment surface enumeration: NOT APPLICABLE — governance bootstrap scripts and evidence only; no deployment workflow is modified.

| Agent or system | Impact | Conclusion |
|---|---|---|
| `foreman-v2-agent` | required Tier 2 validation and populated-memory bootstrap | IMPACTED — fail-closed and deterministic |
| `independent-assurance-agent` | same shared wake-up path | IMPACTED — repeated bootstrap verified |
| Prehandover governance gate | evidence/claim classification | IMPACTED — false positives removed; positive claims remain controlled |
| MMM product and Supabase/Vercel runtime | no changed paths or mutation | NO IMPACT |

### 2.7 ECAP reconciliation summary

| Field | Reconciled value |
|---|---|
| Issue / PR / wave / branch | `#1969` / `#1970` / `foreman-bootstrap-repair-1969` / `agent/foreman-bootstrap-fail-closed-1969` |
| ECAP record | `.agent-admin/ecap/pr-1970-ecap.md` — R3 `ADMIN_VALIDATED` |
| QP record | `.agent-admin/quality/pr-1970-foreman-qp.md` — R3 PASS |
| Scope | 16 declared paths; final carrier is contained in those paths |
| Session evidence | immutable source memory plus separately declared correction addendum |
| Ripple | governance bootstrap only; no PUBLIC_API/product ripple |
| Identity binding | PR, issue, branch, wave, manifest, scope, tracker, and wave record agree |
| Role boundary | Foreman/QP, ECAP administration, and IAA verdict authority remain separate |
| Admin-compliance result | PASS for final IAA invocation preparation |

### 2.8 Final assurance reference and stop state

- `iaa_audit_token: IAA-session-1970-R2-20260726-PASS` — expected reference only; not a producer-issued token.
- `iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-foreman-bootstrap-repair-1969-20260726.md`
- `final_iaa_verdict: PENDING`
- `handover_allowed: false`
- `HANDOVER_ALLOWED: no`
- `RESULT: AWAITING_INDEPENDENT_IAA_R2`

No merge, handover, #1969 closure, or #1959 execution is authorized by this PREHANDOVER proof.
