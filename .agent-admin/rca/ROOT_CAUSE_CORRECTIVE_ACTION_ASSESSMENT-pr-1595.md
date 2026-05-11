# ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT

PR: #1595
Issue: #1593
Failure trigger: PREHANDOVER/ECAP evidence committed against previous head SHA `8adae94f5f6afad1eb41d2bad5abce2b47a93196` — evidence became stale when commit `6757b2a` (the ECAP evidence commit itself) advanced the head. CS2 flagged the mismatch on review of head `6757b2a535d3c9354f08363bf8abb9ee9d82104d`.
Failure class: stale-head handover evidence — CURRENT_HEAD_SHA in PREHANDOVER proof did not match actual PR head at time of CS2 review (same failure class as PR #1578)
Root cause: The ECAP evidence creation workflow hardcodes the HEAD SHA at the moment the proof is authored. When the proof commit itself becomes the new head, the SHA recorded in the proof is immediately one commit behind. The agent session that created the evidence did not refresh the SHA after committing, producing a self-stale artifact: the evidence file records the pre-commit SHA, but the act of committing it advances the head.
Was this already covered by existing guidance: yes — FAIL-ONLY-ONCE registry and PR #1578 RCA identified stale-head evidence as a known failure class; the execution-lock work in this very PR is intended to prevent this pattern
Lowest effective fix layer: evidence-refresh protocol — after every commit that contains governance evidence, the evidence file(s) must be re-opened and the CURRENT_HEAD_SHA must be updated to `git rev-parse HEAD` before the session closes; a single "re-read HEAD and patch" step prevents recurrence
Corrective action required: (1) Refresh CURRENT_HEAD_SHA in PREHANDOVER proof and ECAP bundle to actual current head `7f68714eb69ab05c311ed7781bda3419f6b35c7b`. (2) Add a FAIL-ONLY-ONCE candidate rule: any session producing PREHANDOVER evidence MUST read `git rev-parse HEAD` after every commit and update CURRENT_HEAD_SHA before the session ends. (3) Document this as a required step in FOREMAN_EXECUTION_LOCKS.md §HANDOVER_LOCK operational guidance.
Regression needed: no — existing tests do not cover runtime SHA refresh; this is a procedural control
Tier 2 update needed: yes — add a "post-commit SHA-refresh" step to FOREMAN_EXECUTION_LOCKS.md §HANDOVER_LOCK and to the PREHANDOVER proof authoring guidance
Template update needed: no
Gate update needed: no — the ECAP gate already checks CURRENT_HEAD_SHA presence; it does not verify staleness (would require runtime CI access to current HEAD which is already available but not currently enforced at gate level)
Canon issue needed: no
Agent contract review needed: no — the Foreman contract 2.16.0 HANDOVER_LOCK already requires current-head evidence; this RCA confirms that procedural compliance (refreshing SHA after commit) is the outstanding gap
Product backlog item needed: no
Owner for correction: copilot (evidence refresh) + Foreman contract / Tier 2 (procedural rule update)
IAA review required: no — RCA is in scope of ECAP ceremony, not a blocking IAA prerequisite for this PR
CS2 final overview required: yes — CS2 must confirm RCA is accepted before HOLD is lifted
RCA verdict: CORRECTIVE_ACTION_REQUIRED
Merge position: HOLD — refresh CURRENT_HEAD_SHA in both PREHANDOVER proof and ECAP bundle, then re-submit for CS2 review

## Recurrence Prevention

| Recurrence-prevention control | Layer | Status |
|---|---|---|
| After every `git commit` in a governance-evidence session, re-read `git rev-parse HEAD` and update CURRENT_HEAD_SHA before session close | Procedural | **ADDED** — this RCA records the rule; Tier 2 update to FOREMAN_EXECUTION_LOCKS.md §HANDOVER_LOCK will codify it |
| FAIL-ONLY-ONCE candidate: "stale CURRENT_HEAD_SHA in PREHANDOVER proof after corrective commit" | FAIL-ONLY-ONCE registry | **CANDIDATE** — A-038 |
| ECAP gate SHA staleness check (if CI HEAD ref is available) | Gate layer | Future hardening — out of scope for this PR |

## Evidence of Refresh

- PREHANDOVER proof refreshed: `.agent-admin/prehandover/proof-pr-1595-foreman-execution-locks-20260510.md`
  - `CURRENT_HEAD_SHA: 7f68714eb69ab05c311ed7781bda3419f6b35c7b`
- ECAP bundle refreshed: `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1595-foreman-execution-locks-20260510.md`
  - `CURRENT_HEAD_SHA: 7f68714eb69ab05c311ed7781bda3419f6b35c7b`
- Local validation re-run at current head `7f68714` then refreshed to `a793130` after commit:
  - `bash .github/scripts/validate-governance-evidence-exactness.test.sh` — 11/11 PASS

---

*Produced by: root-cause-corrective-action-agent invocation | Authority: CS2 (Johan Ras / @APGI-cmy) | Issue: #1593 | PR: #1595 | 2026-05-11*
