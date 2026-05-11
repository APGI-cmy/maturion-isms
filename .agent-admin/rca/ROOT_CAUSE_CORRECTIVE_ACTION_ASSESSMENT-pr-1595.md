# ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT

PR: #1595
Issue: #1593
FAIL-ONLY-ONCE-ID: A-038
RCA version: 2 (updated 2026-05-11 — second recurrence cycle)

## Occurrence 1 — Initial stale-head failure

Failure trigger: PREHANDOVER/ECAP evidence committed against previous head SHA `8adae94f5f6afad1eb41d2bad5abce2b47a93196` — evidence became stale when commit `6757b2a` advanced the head. CS2 flagged the mismatch on review of head `6757b2a535d3c9354f08363bf8abb9ee9d82104d`.
Failure class: stale-head handover evidence — CURRENT_HEAD_SHA in PREHANDOVER proof did not match actual PR head at time of CS2 review (same failure class as PR #1578)
Root cause: The ECAP evidence creation workflow hardcodes the HEAD SHA at the moment the proof is authored. When the proof commit itself becomes the new head, the SHA recorded in the proof is immediately one commit behind.
Corrective action taken: SHA refreshed in both PREHANDOVER proof and ECAP bundle to `7f68714eb69ab05c311ed7781bda3419f6b35c7b`.

## Occurrence 2 — Repeated stale-head + failing CI gates (A-038 confirmed)

Failure trigger (repeated): CS2 review comment 4418480204 flagged stale PREHANDOVER/ECAP evidence (`CURRENT_HEAD_SHA: 5d2c2ffe20d9f2ee4787cc83cc55d3fcea4eae08`) on current head `e3b4cd033ef68864def554d213e2ea16b547f058`. Simultaneously, `agent-contract-format/yaml-validation` CI gate was FAILING (character count 32,644 > 30,000 and frontmatter lines 216 > 200 in `foreman-v2-agent.md`).
Failure class: stale-head handover evidence + delivery with failing CI gates
Root cause (stale head): Same structural property as Occurrence 1 — the PREHANDOVER SHA is authored before the commit that creates it, so it is always one commit behind. This is a non-eliminable artifact of the commit-then-evidence pattern.
Root cause (failing gates): The `agent-contract-format/yaml-validation` failures were pre-existing before this PR (already failing at PR baseline commit `8adae94`). This PR added HALT-013–016 and other frontmatter entries which kept the count over the limit. The gate was not fixed in earlier sessions because it was mistakenly classified as "pre-existing, not introduced by this PR." That classification is incorrect: governance requires ALL gates to be GREEN before handover, regardless of who introduced the failure.
Was this already covered by existing guidance: yes — FAIL-ONLY-ONCE A-038 (candidate from Occurrence 1) is now confirmed. Foreman contract 2.16.0 HALT-012 requires all gates to be GREEN before handover; delivering with a failing gate violates HALT-012.
Lowest effective fix layer: (1) Fix the failing gate in the same commit as the evidence refresh — no separate SHA-refresh commit needed. (2) Post non-mutating final verification comment after CI is green.
Corrective action taken: (1) Reduced `foreman-v2-agent.md` to 29,979 chars (≤30,000) and 189 frontmatter lines (≤200) by removing duplicate HALT-013–016 frontmatter entries (documented in body EXECUTION LOCKS section), removing orphaned ESC-001/002/003 entries, removing redundant `can_invoke`/`cannot_invoke` blocks, and condensing verbose body content. (2) CURRENT_HEAD_SHA in PREHANDOVER and ECAP evidence updated to pre-commit HEAD `e3b4cd033ef68864def554d213e2ea16b547f058` — one-commit lag is structurally unavoidable and acknowledged (see §Residual Lag below). (3) A-038 confirmed (not just candidate). (4) Non-mutating final verification comment to be posted after CI is green.
Regression needed: no
Tier 2 update needed: no further — FOREMAN_EXECUTION_LOCKS.md §HANDOVER_LOCK guidance already documents post-commit SHA-refresh and non-mutating verification comment pattern.
Gate update needed: no
RCA verdict: CORRECTIVE_ACTION_REQUIRED — actions taken in this session
Merge position: HOLD pending non-mutating final verification comment after CI gates are GREEN on new head.

## Recurrence Prevention

| Recurrence-prevention control | Layer | Status |
|---|---|---|
| After every `git commit` in a governance-evidence session, re-read `git rev-parse HEAD` and update CURRENT_HEAD_SHA before session close | Procedural | **ACTIVE** — codified in FOREMAN_EXECUTION_LOCKS.md §HANDOVER_LOCK |
| FAIL-ONLY-ONCE A-038: "stale CURRENT_HEAD_SHA in PREHANDOVER proof after corrective commit" | FAIL-ONLY-ONCE registry | **CONFIRMED** — A-038 (was candidate; now confirmed after second occurrence) |
| All CI gates must be GREEN before handover; pre-existing failures do not exempt a PR from gate compliance | Procedural | **CONFIRMED** — HALT-012 applies regardless of failure origin |
| Combine gate fix + evidence SHA refresh in a single commit when possible; no separate SHA-refresh-only commits | Procedural | **ACTIVE** — applied in this session |
| ECAP gate SHA staleness check (if CI HEAD ref is available) | Gate layer | Future hardening — out of scope for this PR |

## §Residual One-Commit Lag

Every governance-evidence commit will always produce a PREHANDOVER/ECAP artifact where `CURRENT_HEAD_SHA` equals the parent of the tip commit. This is a structural property: evidence is authored before the commit that creates it. The ECAP gate should verify ancestry (SHA ∈ ancestors of HEAD) rather than exact equality; this is flagged as future gate hardening (out of scope here). The one-commit lag is accepted per this RCA.

## Evidence of Correction (Occurrence 2)

- `foreman-v2-agent.md`: 29,979 chars (was 32,644), 189 frontmatter lines (was 216)
- PREHANDOVER proof refreshed: `.agent-admin/prehandover/proof-pr-1595-foreman-execution-locks-20260510.md`
  - `CURRENT_HEAD_SHA: e3b4cd033ef68864def554d213e2ea16b547f058` (pre-commit HEAD; one-commit lag acknowledged)
- ECAP bundle refreshed: `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1595-foreman-execution-locks-20260510.md`
  - `CURRENT_HEAD_SHA: e3b4cd033ef68864def554d213e2ea16b547f058`
- All changes committed in a single commit (gate fix + RCA + evidence refresh)
- Non-mutating final verification comment to be posted after CI is GREEN

---

*Produced by: root-cause-corrective-action-agent invocation | Authority: CS2 (Johan Ras / @APGI-cmy) | Issue: #1593 | PR: #1595 | 2026-05-11*
