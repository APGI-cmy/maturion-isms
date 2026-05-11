# ROOT_CAUSE_CORRECTIVE_ACTION_ASSESSMENT

PR: #1595
Issue: #1593
Failure trigger: (1) PREHANDOVER/ECAP evidence committed against previous head SHA `8adae94f5f6afad1eb41d2bad5abce2b47a93196` — evidence became stale when commit `6757b2a` (the ECAP evidence commit itself) advanced the head. CS2 flagged the mismatch on review of head `6757b2a535d3c9354f08363bf8abb9ee9d82104d`. (2) Final verification posted claiming `HANDOVER_ALLOWED: yes` while `agent-contract-format/yaml-validation` and `agent-contract-format/verdict` CI gates were failing (character count 32,644 > 30,000; frontmatter lines 216 > 200).
Failure class: (1) stale-head handover evidence — CURRENT_HEAD_SHA in PREHANDOVER proof did not match actual PR head at time of CS2 review (same failure class as PR #1578). (2) premature-handover-claim — closure language used while required CI gates were not GREEN (HALT-012 / NO-BYPASS-QA-001 / merge_gate_parity BLOCKING).
Root cause: (1) The ECAP evidence creation workflow hardcodes the HEAD SHA at the moment the proof is authored. When the proof commit itself becomes the new head, the SHA recorded in the proof is immediately one commit behind. (2) The final verification comment was posted after CS2 listed specific green checks, but the agent did not independently enumerate all CI gates running on the PR before claiming handover. The pre-existing `agent-contract-format/yaml-validation` failures were noted as "pre-existing" but not resolved; HALT-012 and NO-BYPASS-QA-001 require ALL required gates GREEN, not just the named subset.
Was this already covered by existing guidance: (1) yes — FAIL-ONLY-ONCE registry and PR #1578 RCA; (2) yes — HALT-012, NO-BYPASS-QA-001, merge_gate_parity BLOCKING (contract 2.16.0); gap was failure to run a complete local gate inventory before claiming handover.
Lowest effective fix layer: (1) non-mutating final verification comment — once all CI checks are green on the current PR head, post a final current-head verification as a PR comment rather than pushing another SHA-refresh commit (which would itself advance HEAD and re-create the staleness); (2) pre-handover gate scan — before any HANDOVER_ALLOWED claim, enumerate all CI gate results; any non-GREEN gate → STOP_AND_FIX (HALT-012), even if that gate was failing before this PR.
Corrective action required: (1) Use final current-head verification as a non-mutating PR comment after all CI checks are green — do NOT push another SHA-only evidence-refresh commit. (2) Fix the failing CI gate: `agent-contract-format/yaml-validation` — reduce foreman-v2-agent.md YAML frontmatter to under 30,000 chars and 200 lines. (3) Add FAIL-ONLY-ONCE candidate A-039: "Do not claim HANDOVER_ALLOWED while any required CI gate is non-GREEN, regardless of whether the failure pre-dates the current PR." (4) Record as new Tier 1 prohibition instance: NO-STALE-GATE-001 already present in contract 2.16.0 prohibitions — compliance gap was not invoking it.
Regression needed: no — procedural compliance gap, not a logic error in tests
Tier 2 update needed: yes — add pre-handover gate scan protocol to FOREMAN_EXECUTION_LOCKS.md §HANDOVER_LOCK; add HALT-012 invocation requirement to session-memory template
Template update needed: no
Gate update needed: no — gates already enforce the limits; the agent should not claim handover while gate is red
Canon issue needed: no
Agent contract review needed: no — prohibitions NO-BYPASS-QA-001 and NO-STALE-GATE-001 already address this; gap was non-compliance not missing contract text
Product backlog item needed: no
Owner for correction: copilot (gate fix + evidence refresh) + Foreman contract / Tier 2 (procedural rule enforcement)
IAA review required: no
CS2 final overview required: yes
RCA verdict: CORRECTIVE_ACTION_REQUIRED
Merge position: HOLD — fix agent-contract-format/yaml-validation gate (done); post non-mutating final verification as PR comment once all CI checks are green; do not push further SHA-refresh commits.

## Recurrence Prevention

| Recurrence-prevention control | Layer | Status |
|---|---|---|
| After every `git commit` in a governance-evidence session, re-read `git rev-parse HEAD` and update CURRENT_HEAD_SHA before session close | Procedural | **ADDED** — A-038 |
| Non-mutating final verification comment as the terminal governance act — do not push SHA-refresh-only commits that advance HEAD and re-create staleness | Procedural | **CONFIRMED** — A-038 lowest-effective-fix-layer |
| Before any HANDOVER_ALLOWED claim, enumerate ALL CI gate results; any non-GREEN gate → STOP_AND_FIX (HALT-012) regardless of pre-PR origin | Procedural | **ADDED** — A-039 candidate |
| FAIL-ONLY-ONCE A-038: stale CURRENT_HEAD_SHA in PREHANDOVER proof after corrective commit | FAIL-ONLY-ONCE registry | **CONFIRMED** — A-038 |
| FAIL-ONLY-ONCE A-039: premature HANDOVER_ALLOWED claim with non-GREEN gates | FAIL-ONLY-ONCE registry | **CANDIDATE** — A-039 |
| ECAP gate SHA staleness check (ancestry rather than exact equality) | Gate layer | Future hardening — out of scope for this PR |
| Complete local CI gate inventory before handover claim — NO-STALE-GATE-001 compliance | Tier 1 prohibition | Already in contract 2.16.0 — compliance gap closed by this RCA |

## Evidence of Correction

- `agent-contract-format/yaml-validation` failure fixed: foreman-v2-agent.md reduced from 32,969 chars / 217 frontmatter lines to 29,803 chars / 119 frontmatter lines by moving operational-only YAML blocks (`escalation`, `capabilities`, `iaa_oversight`) to the markdown body as a compact reference section.
- Merge conflicts with `copilot/harden-foreman-execution-locks` resolved in merge commit `46bbdce` — accepted base branch version of foreman-v2-agent.md (29,803 chars / 119 FM lines).
- No pre-existing CI failures remain unaddressed in this PR.
- PREHANDOVER/ECAP SHA staleness: final current-head verification to be posted as a non-mutating PR comment after all CI checks are green — no further SHA-refresh commit will be pushed.

---

*Produced by: root-cause-corrective-action-agent invocation | Authority: CS2 (Johan Ras / @APGI-cmy) | Issue: #1593 | PR: #1595 | 2026-05-11*
