# PR #1970 Wave Current Tasks — Foreman Bootstrap Repair

**Wave:** foreman-bootstrap-repair-1969  
**Issue:** #1969  
**PR:** #1970  
**Branch:** `agent/foreman-bootstrap-fail-closed-1969`  
**Base SHA:** `36c7f42a1a9d23fe4fd9d9f7f12a7ef7beada919`  
**Status:** IAA R2 F-005 CORRECTED / QP R4 PASS / ECAP R4 AND FINAL IAA PENDING
**CS2:** Johan Ras

## Qualifying tasks

| Task | Summary | Category | Status |
|---|---|---|---|
| GOV-1969-01 | Restore the missing Foreman Tier 2 session-memory template | GOVERNANCE_CONTROL_REPAIR | COMPLETE — implementation `7cac621b…`; QP R1 PASS |
| GOV-1969-02 | Make wake-up validation fail closed on every declared Tier 2 required file | BOOTSTRAP_ENFORCEMENT | COMPLETE — implementation `7cac621b…`; R1 populated-memory correction `ef8c628c…`; QP R2 PASS |
| GOV-1969-03 | Add executable happy-path, populated-memory, missing-control and absent-list compatibility regression coverage | GOVERNANCE_QA | COMPLETE — 4 focused scenarios PASS; Wave 7 11/11 policy and 23/23 real gates PASS |
| GOV-1969-04 | Bind QP, ECAP, CI and independent final IAA evidence to the frozen PR head | ASSURANCE | IN PROGRESS — IAA R2 rejection recorded; F-005 corrected at `719c5e76…`; QP R4 PASS; ECAP R4 and final IAA pending |
| GOV-1969-05 | After CS2 closure, resume #1959 without weakening the private-helper model | SUCCESSOR_CONTROL | BLOCKED BY THIS WAVE |
| GOV-1969-06 | Repair prehandover false-positive detection without weakening positive-claim enforcement | CI_WORKFLOW / GOVERNANCE_CONTROL_REPAIR | COMPLETE — semantic correction at `a1baaaa8…`; JSON/Markdown structured-claim correction at `719c5e76…`; QP R4 PASS |

## Acceptance tests

1. `.agent-workspace/foreman-v2/knowledge/session-memory-template.md` exists and is referenced by both Tier 1 and Tier 2 index.
2. `.github/scripts/wake-up-protocol.sh foreman-v2` exits 0 with the complete required set.
3. A populated-memory fixture completes 12 repeated runs without a `pipefail`/broken-pipe failure, and an isolated fixture with one declared Tier 2 file absent exits nonzero.
4. Failure output names the missing path and does not state that all checks passed or that the agent is ready.
5. An agent contract without `tier2_knowledge.required_files` retains current behavior.
6. The focused regression command is run by CI when the validator, Foreman contract/index/template, regression script, or workflow changes.
7. No `.github/agents/*.md`, product/runtime, MMM, Supabase or Vercel files change.
8. Independent IAA reviews the exact final head and returns PASS; otherwise the wave remains blocked.
9. An ordinary session memory containing `handover_allowed: false` and `final_iaa_verdict: PENDING` does not activate the prehandover lane.
10. Explicit PREHANDOVER paths and actual positive readiness/handover claims still require a valid current-head `handover-allowed.json`.
11. The semantic boundary is exercised by hosted real-gate fixtures.

## Required order

`scope commit 88c0994… -> task carrier -> canonical IAA pre-brief -> bounded appointment -> implementation -> QP R1 -> ECAP R1 -> IAA R1 rejection c7e28382… -> corrective implementation ef8c628c… -> QP R2 -> ECAP R2 -> session memory/deadlock discovery -> CS2 extension -> prehandover gate correction -> refreshed QP/ECAP -> frozen-head final IAA -> CS2 merge`

## Stop conditions

- Missing/non-canonical pre-brief.
- No bounded appointment before implementation.
- Negative path does not fail.
- Validator trusts index prose rather than the active contract's declared list.
- Missing path is not reported.
- Existing bootstrap behavior regresses for contracts without Tier 2 lists.
- Truthful negative/pending session evidence activates the prehandover lane.
- Explicit PREHANDOVER or positive readiness claims evade the existing current-head control.
- CI/frozen-head evidence is incomplete.
- IAA rejects or remains pending.
