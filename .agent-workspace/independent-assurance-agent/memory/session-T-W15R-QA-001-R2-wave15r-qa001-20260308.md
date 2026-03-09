# IAA Session Memory — session-T-W15R-QA-001-R2-wave15r-qa001-20260308

| Field | Value |
|-------|-------|
| `session_id` | session-T-W15R-QA-001-R2-wave15r-qa001-20260308 |
| `date` | 2026-03-08 |
| `agent_version` | independent-assurance-agent v6.2.0 |
| `contract_version` | 2.2.0 |
| `pr_reviewed` | Branch copilot/create-red-tests-wave-15r — T-W15R-QA-001 Wave 15R Batch C governance closure (Issue #1000) — re-invocation after R1 REJECTION |
| `invoking_agent` | foreman-v2-agent (Phase 4.3a IAA HANDOVER AUDIT RE-INVOCATION) |
| `producing_agent` | foreman-v2-agent |
| `producing_agent_class` | foreman |
| `pr_category` | AAWP_MAT (governance ceremony closure for MAT QA deliverable) |
| `checks_executed` | 26 applicable |
| `checks_passed` | 25 |
| `checks_failed` | 1 |
| `merge_gate_parity_result` | FAIL — 1 failure: A-026 |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-T-W15R-QA-001-wave15r-qa001-20260308-REJECTION-R2 |
| `token_file_path` | `.agent-admin/assurance/iaa-token-session-T-W15R-QA-001-wave15r-qa001-20260308-REJECTION-R2.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-T-W15R-QA-001-wave15r-qa001-20260308 (REJECTION-R1), session-prebrief-wave15r-qa001-20260308 (PRE-BRIEF), session-wave15r-impl-R2-20260308, session-wave15r-gov-20260308-R2, session-wave15r-gov-20260308 |

---

## Fixes Reviewed vs Prior REJECTION-R1

| Fix | Stated Fix | Verified? | Status |
|-----|-----------|-----------|--------|
| FIX 1 (CORE-007) | CORRECTION-ADDENDUM committed at f8a522e | YES — read addendum, contains actual git log | PASS ✅ |
| FIX 2 (A-026 filename) | SCOPE_DECLARATION.md line 27 corrected to include `-wave15r-qa001` | YES — file read, filename correct | PASS ✅ |
| FIX 3 (A-028) | `wave15r-closure-correction` section removed | YES — SCOPE_DECLARATION.md contains T-W15R-QA-001 only | PASS ✅ |

---

## Failure Cited

| # | Check | Finding | Fix Required |
|---|-------|---------|-------------|
| 1 | A-026 | Two IAA ceremony files from the R1 REJECTION ceremony (commit 85eb6a2) appear in git diff but are NOT declared in SCOPE_DECLARATION.md: (1) `.agent-admin/assurance/iaa-token-session-T-W15R-QA-001-wave15r-qa001-20260308-REJECTION.md` and (2) `.agent-workspace/independent-assurance-agent/memory/session-T-W15R-QA-001-wave15r-qa001-20260308.md`. A-031 carve-out note is absent from SCOPE_DECLARATION.md. | Add A-031 carve-out note to SCOPE_DECLARATION.md (Option B — recommended) covering ALL IAA ceremony artifacts from rejection sessions on this branch. OR add all 4 IAA ceremony files (R1 + R2) to SCOPE_DECLARATION.md Files Changed list (Option A). Commit. Re-invoke IAA. |

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied? | Outcome |
|------|----------|---------|
| A-001 | YES | Pre-Brief committed SHA 5900e56 — PASS |
| A-002 | YES | Foreman class, IAA invoked — no class exception — PASS |
| A-021 | YES | git status CLEAN at invocation time (commit f8a522e HEAD) — PASS |
| A-026 | YES | FAIL — IAA ceremony artifacts from R1 REJECTION undeclared; A-031 note absent |
| A-028 | YES | Prior-wave entries removed — PASS |
| A-029 | YES | PREHANDOVER immutable — not edited post-commit — PASS |
| A-030 | YES | CORRECTION-ADDENDUM committed, satisfies CORE-007 — PASS |
| A-031 | YES | Applied — undeclared files are exclusively IAA ceremony artifacts, but carve-out note absent — FAIL |

---

## Substantive Quality Assessment

All substantive checks PASS. This is a ceremony-only rejection:
- **35/35 tests GREEN** — independently run and verified by IAA this session
- Zero test debt, zero skip/todo/stub
- INC-OPOJD-W15R-QA-001 properly remediated and documented
- QA-to-Red bypass acknowledged with CS2 authorization
- S-025/A-033 carry-forward openly declared
- `Closes: maturion-isms#1000` declared
- Zero scope creep — all files governance artifacts
- CORRECTION-ADDENDUM (FIX 1) correct and complete
- PREHANDOVER filename (FIX 2) now correct
- SCOPE_DECLARATION prior-wave trimming (FIX 3) applied

One trivial commit with the A-031 note will resolve this and enable ASSURANCE-TOKEN.

---

## Fail-Only-Once Updates

No new FAIL-ONLY-ONCE rules required this session. The A-031 pattern has already been codified.
However, this session reinforces the importance of using A-031 Option B proactively whenever
a prior REJECTION exists on a branch. The PREHANDOVER template should include a reminder
to add the A-031 carve-out note whenever re-invoking IAA after a rejection.

---

## Learning Notes

1. **A-031 cascade pattern**: When IAA issues a REJECTION, it writes ceremony artifacts to the branch. On re-invocation, those artifacts appear in the git diff. If the Foreman updates SCOPE_DECLARATION.md during the fix commit without also declaring IAA ceremony artifacts (or adding the A-031 note), a new A-026 failure is triggered. This creates a cascade where each rejection adds new IAA artifacts to the diff. A-031 Option B (broad carve-out note) breaks this cascade permanently for the branch.

2. **Best practice for re-invocations**: When a producing agent commits fixes after a REJECTION, they should ALWAYS check `git diff --name-only origin/base...HEAD` and compare against SCOPE_DECLARATION.md before re-invoking IAA. Any IAA ceremony files in the diff should be handled via A-031 (Option A full declaration or Option B carve-out note).

3. **Recommend PREHANDOVER template update**: The PREHANDOVER template's SCOPE_DECLARATION ceremony section should include a re-invocation note: "If this is a re-invocation after a REJECTION, check for IAA ceremony artifacts in the git diff and add them to the Files Changed list or invoke A-031 carve-out."

---

## Suggestions for Improvement

**Concrete improvement**: The PREHANDOVER template should add a "Re-invocation checklist" item to its SCOPE_DECLARATION ceremony section: "If re-invoking IAA after a REJECTION-PACKAGE, run `git diff --name-only origin/main...HEAD`, check for IAA-authored files (`.agent-admin/assurance/iaa-token-*-REJECTION*` and `.agent-workspace/independent-assurance-agent/`), and either declare them or add A-031 carve-out note before committing." This would prevent the A-031 cascade pattern that has now occurred on multiple branches.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Produced by**: independent-assurance-agent v6.2.0
