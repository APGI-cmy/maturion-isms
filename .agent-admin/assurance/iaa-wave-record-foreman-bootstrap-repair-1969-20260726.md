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
