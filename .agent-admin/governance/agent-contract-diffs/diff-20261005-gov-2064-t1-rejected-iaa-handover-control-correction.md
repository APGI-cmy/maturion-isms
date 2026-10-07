# Diff Record — GOV-2064-T1 Rejected-IAA Handover Control Correction

**PR**: #2065 — Prevent rejected-IAA handover and wrong-class admin loops
**Issue**: #2064 — Prevent rejected-IAA handover and wrong-class admin loops in Foreman–IAA–CS2 control chain
**Task**: GOV-2064-T1 (assigned builder: CodexAdvisor-agent, per `.agent-admin/prs/pr-2065/wave-current-tasks.md` and canonical pre-brief)
**Producing agent**: CodexAdvisor-agent
**Authority chain**:
- CS2-proxy appointment: issue #2064 body, "Bounded implementation" directive — "@copilot CS2 proxy appointment for this bounded issue ... Appoint CodexAdvisor for protected Tier 1 agent-contract changes."
- IAA pre-brief: `.agent-admin/assurance/iaa-wave-record-pr-2065-prevent-rejected-iaa-handover-20261005.md`, bound to submitted head `6cdf1bf99a6a3e36dedb2ad5b3478c2cfa3578bc`.

**Nature of this artifact**: implementation diff record for CodexAdvisor's own GOV-2064-T1 changes only. No IAA verdict, no ECAP invocation, and no merge-readiness claim is made here. Final independent IAA assurance for the whole PR remains pending and is out of this agent's authority.

---

## 1. Files changed and why (protected `.github/agents/**`, CodexAdvisor authority per AGCFPP-001)

| Path | Change | Bounded-implementation authorization |
|---|---|---|
| `.github/agents/foreman-v2-agent.md` | §4 state machine: `PRE_HANDOVER_GATE_PASS` is now explicitly **submission-to-IAA only** — never itself handover/completion/merge-readiness language, and a blocker/status report issued at that state must not be worded as a completed-job handover. `IAA_FINAL_PASS` is now the explicit first state where handover/completion language is permitted, requiring a current PASS token for the exact submitted head. Added an explicit **rejection transition**: an IAA REJECTION-PACKAGE or a missing/stale IAA token at or after `PRE_HANDOVER_GATE_PASS` returns Foreman to `STOP_AND_FIX / CORRECTION` — never to `CS2_REVIEW` — and re-enters the state machine at `BUILD_DELEGATED` once remediation evidence exists. Contract version 2.18.0 → 2.19.0. | Issue #2064 audit addendum, row "Foreman Tier 1 `.github/agents/foreman-v2-agent.md` §4" — bounded correction text quoted verbatim in the issue. |
| `.github/agents/independent-assurance-agent.md` | Step 2.3: classification now explicitly happens "by the actual changed files and any explicit functional-delivery or evidence-only claim ... before any evidence is demanded or evaluated." Step 3.2: added a **duplicate-request rule** alongside the existing evidence-binding rule — an unresolved `REJECTION_HISTORY` finding with a matching fingerprint/reviewed content is reissued as the same classification/finding, never converted into ASSURANCE-TOKEN and never given a new verdict artifact or fresh assurance cycle. Step 4.2 REJECTION-PACKAGE format: now requires `Applicable class`, `Authority/owner` per failure, and a `Single next substantive correction` line. Added prohibition `NO-DUPLICATE-PASS-001`. Contract version 2.11.0 → 2.12.0. | Issue #2064 bounded-implementation item 2 — "Align the smallest necessary IAA Tier 1/Tier 2 operational instructions to classify by changed files and explicit claims before demanding evidence. Require an IAA rejection to identify the applicable class, each hard blocker and authority, and the single next substantive correction. Detect and reject self-referential evidence/head refreshes and duplicate assurance requests without claiming a PASS." |
| `.github/agents/active-cs2-agent.md` | Phase 3 Step 5: merge/refusal controls now explicitly require "a current independent final IAA PASS"; a rejected, missing, or stale IAA token is now explicitly named a **typed refusal** that blocks completion handover, merge, and successor-wave dispatch, routes an ordinary correctable finding to Foreman, and consolidates a genuine protected/external/canon-conflict blocker into exactly one escalation to human CS2. Added `HALT-ACS2-006` (rejected/missing/stale IAA token) and prohibition `ACS2-NO-REJECTED-IAA-MERGE-001`. Contract version 1.0.0 → 1.1.0. | Issue #2064 bounded-implementation item 3 — "Align the smallest necessary active-CS2 Tier 1/Tier 2 instructions to treat IAA `REJECTION-PACKAGE` / missing or stale token as a typed refusal: no completion handover, merge, successor dispatch, or broad sign-off. Return ordinary correctable items to Foreman. Consolidate a genuinely external/protected/canon-conflict decision once for human CS2; never require infinite retries." |

---

## 2. What did not change (explicit non-actions)

- No `.agent-admin/control/handover-allowed.json` field split (`pre_iaa_submission_allowed` vs `final_cs2_handover_allowed`) — that Tier 3/checkpoint-evaluator change is GOV-2064-T4, assigned to `governance-liaison-isms-agent`, not this task.
- No `.github/scripts/validate-product-delivery-gates.sh` gate-router classification fix or regression fixture — that is GOV-2064-T2, assigned to `qa-builder`.
- No `active-cs2-agent` Tier 2/Tier 3 knowledge file edit (`merge-and-refusal-protocol.md`, `evidence-review-and-correction-protocol.md`, job-wave schema/evaluator) — that is GOV-2064-T3, assigned to `active-cs2-agent` itself.
- No Foreman Tier 2 operating-protocol/index or `FAIL-ONLY-ONCE.md` A-019/A-039 reconciliation, and no OPOJD v2.0-vs-v2.1 layer-down verification — that is GOV-2064-T4, assigned to `governance-liaison-isms-agent`.
- No `.github/agents/independent-assurance-agent.md` self-write by IAA — this entire file's diff was authored solely by CodexAdvisor-agent under the issue's explicit CS2-proxy appointment; IAA did not edit or self-assure its own contract.
- No `.agent-admin/assurance/**` file was created or modified by this task — no IAA verdict or token was written or altered.
- No PR #2058 substantive security/migration finding was reopened, reassessed, or relaxed.
- No governance automation was activated; `active-cs2-agent` remains `CONTRACT_READY / INACTIVE`.
- No `.agent-admin/prs/pr-2065/wave-current-tasks.md` edit — that tracker is Foreman-owned; CodexAdvisor's declared `write_paths` do not include it.

## 3. Mechanical validation performed

- YAML frontmatter parses for all three files (`yaml.safe_load`), `agent.contract_version` present and semver-valid.
- Character counts after edit: `foreman-v2-agent.md` 15,141 (≤ 30,000 hard limit); `independent-assurance-agent.md` 28,353 (≤ 30,000 hard limit — this file was already 27,798 chars, above the 25,000 target, before this task; this task's net addition is ~555 chars and does not newly create the hard-limit risk; reducing it to target size is out of this bounded task's scope); `active-cs2-agent.md` 12,688 (≤ 30,000 hard limit).
- Frontmatter line counts all ≤ 200 (111 / 163 / 139 respectively).
- No `STUB`, `TODO:`, `FIXME:`, `placeholder`, `to be populated`, or `TBD` pattern introduced (checked against the same exemption list used by `agent-contract-format-gate.yml`'s CORE-007 placeholder check).
- `runtime-tools-secret_scanning` run against all three changed files: no secrets detected.
- Searched `.github/scripts/**` and `.agent-admin/**` for existing executable tests asserting specific contract text/version/line-count values in these three files: none found (only path-example references in fixtures such as `handover-claim-gate.test.sh`, which use `.github/agents/foreman-v2-agent.md` solely as an example protected-path string, not as content it asserts). No test file was added or modified, consistent with the instruction to update tests only where existing infrastructure demonstrates an executable contract assertion is needed.

## 4. Scope note for CS2 / Foreman

This diff closes the CodexAdvisor-owned Tier 1 slice of GOV-2064-T1 only. Tasks GOV-2064-T2 (qa-builder), GOV-2064-T3 (active-cs2-agent), and GOV-2064-T4 (governance-liaison-isms-agent) remain outstanding per `.agent-admin/prs/pr-2065/wave-current-tasks.md`. Final independent IAA assurance for the whole PR #2065 — covering all four tasks together, per the bound pre-brief's `applicable_overlay: MIXED` finding — has not been requested or issued by this session.
