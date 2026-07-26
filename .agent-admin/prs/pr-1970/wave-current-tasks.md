# PR #1970 Wave Current Tasks — Foreman Bootstrap Repair

**Wave:** foreman-bootstrap-repair-1969  
**Issue:** #1969  
**PR:** #1970  
**Branch:** `agent/foreman-bootstrap-fail-closed-1969`  
**Base SHA:** `36c7f42a1a9d23fe4fd9d9f7f12a7ef7beada919`  
**Status:** STOP-AND-FIX CORRECTED / QP R2 PASS / ECAP R2 COMPLETE / PREHANDOVER, EXACT-HEAD CI AND FINAL IAA PENDING
**CS2:** Johan Ras

## Qualifying tasks

| Task | Summary | Category | Status |
|---|---|---|---|
| GOV-1969-01 | Restore the missing Foreman Tier 2 session-memory template | GOVERNANCE_CONTROL_REPAIR | COMPLETE — implementation `7cac621b…`; QP R1 PASS |
| GOV-1969-02 | Make wake-up validation fail closed on every declared Tier 2 required file | BOOTSTRAP_ENFORCEMENT | COMPLETE — implementation `7cac621b…`; R1 populated-memory correction `ef8c628c…`; QP R2 PASS |
| GOV-1969-03 | Add executable happy-path, populated-memory, missing-control and absent-list compatibility regression coverage | GOVERNANCE_QA | COMPLETE — 4 focused scenarios PASS; Wave 7 10/10 policy and 13/13 real gates PASS |
| GOV-1969-04 | Bind QP, ECAP, CI and independent final IAA evidence to the frozen PR head | ASSURANCE | IN PROGRESS — QP R2 PASS; ECAP R2 ADMIN_VALIDATED; PREHANDOVER, exact-head CI and final IAA R2 pending |
| GOV-1969-05 | After CS2 closure, resume #1959 without weakening the private-helper model | SUCCESSOR_CONTROL | BLOCKED BY THIS WAVE |

## Acceptance tests

1. `.agent-workspace/foreman-v2/knowledge/session-memory-template.md` exists and is referenced by both Tier 1 and Tier 2 index.
2. `.github/scripts/wake-up-protocol.sh foreman-v2` exits 0 with the complete required set.
3. A populated-memory fixture completes 12 repeated runs without a `pipefail`/broken-pipe failure, and an isolated fixture with one declared Tier 2 file absent exits nonzero.
4. Failure output names the missing path and does not state that all checks passed or that the agent is ready.
5. An agent contract without `tier2_knowledge.required_files` retains current behavior.
6. The focused regression command is run by CI when the validator, Foreman contract/index/template, regression script, or workflow changes.
7. No `.github/agents/*.md`, product/runtime, MMM, Supabase or Vercel files change.
8. Independent IAA reviews the exact final head and returns PASS; otherwise the wave remains blocked.

## Required order

`scope commit 88c0994… -> task carrier -> canonical IAA pre-brief -> bounded appointment -> implementation -> QP R1 -> ECAP R1 -> IAA R1 rejection c7e28382… -> corrective implementation ef8c628c… -> QP R2 -> ECAP R2 -> immutable PREHANDOVER/session memory -> final IAA R2 -> CS2 merge`

## Stop conditions

- Missing/non-canonical pre-brief.
- No bounded appointment before implementation.
- Negative path does not fail.
- Validator trusts index prose rather than the active contract's declared list.
- Missing path is not reported.
- Existing bootstrap behavior regresses for contracts without Tier 2 lists.
- CI/frozen-head evidence is incomplete.
- IAA rejects or remains pending.
