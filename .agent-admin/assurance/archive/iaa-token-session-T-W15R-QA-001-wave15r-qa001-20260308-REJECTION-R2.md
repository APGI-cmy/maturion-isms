# IAA Verdict Artifact — REJECTION-PACKAGE (R2)
# Session: session-T-W15R-QA-001-R2 | Wave 15R-QA001 | 2026-03-08

| Field | Value |
|-------|-------|
| `token_type` | REJECTION-PACKAGE |
| `session_id` | session-T-W15R-QA-001-R2-wave15r-qa001-20260308 |
| `date` | 2026-03-08 |
| `branch` | copilot/create-red-tests-wave-15r |
| `pr_reviewed` | T-W15R-QA-001 — Wave 15R Batch C governance closure (Issue #1000) — re-invocation after R1 REJECTION |
| `invoking_agent` | foreman-v2-agent (Phase 4.3a IAA HANDOVER AUDIT RE-INVOCATION) |
| `producing_agent` | foreman-v2-agent |
| `producing_agent_class` | foreman |
| `pr_category` | AAWP_MAT (governance ceremony closure) |
| `adoption_phase` | PHASE_B_BLOCKING |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-T-W15R-QA-001-wave15r-qa001-20260308-REJECTION-R2 |
| `checks_executed` | 26 applicable (15 core, 1 N/A groups; AAWP_MAT overlay applicable) |
| `checks_passed` | 25 |
| `checks_failed` | 1 |
| `merge_gate_parity` | FAIL — 1 failure: A-026 |

---

## Fixes Reviewed (from prior REJECTION-R1)

| Fix | Status | Evidence |
|-----|--------|---------|
| FIX 1 — CORE-007 (CORRECTION-ADDENDUM) | PASS ✅ | Committed at f8a522e; actual git log present; A-030 satisfied |
| FIX 2 — A-026 (PREHANDOVER filename) | PASS ✅ | SCOPE_DECLARATION.md now declares correct filename with `-wave15r-qa001` slug |
| FIX 3 — A-028 (prior-wave trimming) | PASS ✅ | `wave15r-closure-correction` section removed; SCOPE_DECLARATION contains T-W15R-QA-001 only |

---

## New Failure: A-026 (IAA Ceremony Files Undeclared)

**Finding**: Two IAA-authored ceremony files from the prior REJECTION (R1, commit 85eb6a2) are
present in `git diff --name-only b2449c1..HEAD` but are NOT declared in `SCOPE_DECLARATION.md`:

1. `.agent-admin/assurance/iaa-token-session-T-W15R-QA-001-wave15r-qa001-20260308-REJECTION.md`
   — IAA REJECTION-PACKAGE token (R1 — IAA-authored, committed by IAA during prior ceremony)

2. `.agent-workspace/independent-assurance-agent/memory/session-T-W15R-QA-001-wave15r-qa001-20260308.md`
   — IAA session memory (R1 REJECTION — IAA-authored, committed by IAA during prior ceremony)

No A-031 carve-out note is present in `SCOPE_DECLARATION.md`.

Per FAIL-ONLY-ONCE A-031: "If YES but carve-out note is absent → A-026 FAIL."

**Fix Required** (choose ONE):

**Option A** — Declare ALL IAA ceremony files in SCOPE_DECLARATION.md ## Files Changed:
- Add R1 REJECTION token `.../iaa-token-session-T-W15R-QA-001-wave15r-qa001-20260308-REJECTION.md`
- Add R1 session memory `.../session-T-W15R-QA-001-wave15r-qa001-20260308.md`
- Add R2 REJECTION token `.../iaa-token-session-T-W15R-QA-001-wave15r-qa001-20260308-REJECTION-R2.md` (this file)
- Add R2 session memory `.../session-T-W15R-QA-001-R2-wave15r-qa001-20260308.md` (to be written)

**Option B** — Add A-031 carve-out note (RECOMMENDED — prevents future recurrence):
Add to SCOPE_DECLARATION.md:
```
## Governance Actions

IAA ceremony artifacts committed on this branch during rejection sessions are excluded from
declaration per A-031 carve-out. All `.agent-admin/assurance/iaa-token-*-REJECTION*.md` files
and all `.agent-workspace/independent-assurance-agent/` files that appear in the git diff but
are not listed above are IAA-owned artifacts. All producing-agent deliverables are fully
declared above.
```

This covers ALL prior AND future IAA rejection artifacts on this branch.

---

## Verbatim Verdict Output

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: Branch copilot/create-red-tests-wave-15r
    T-W15R-QA-001 — Wave 15R Batch C governance closure (Issue #1000)
1 check FAILED. Merge blocked. STOP-AND-FIX required.
FAILURE: A-026 — IAA ceremony artifacts from R1 rejection undeclared
in SCOPE_DECLARATION.md; A-031 carve-out note absent.
Fix: Add A-031 carve-out note (Option B) or declare all 4 IAA
     ceremony files (Option A). Commit. Re-invoke IAA.
Adoption phase: PHASE_B_BLOCKING
═══════════════════════════════════════════════════════════════
```

---

## Substantive Assessment (for record — all PASS)

- QP: 35/35 tests GREEN (independently verified this invocation)
- Test quality: file-based assertions, zero skip/todo/debt
- INC-OPOJD-W15R-QA-001: REMEDIATED — closes maturion-isms#1000
- Governance closure artifacts: complete and well-formed
- CORRECTION-ADDENDUM: committed, correct content (A-030 ✅)
- S-025/A-033: properly declared as open carry-forward

**This REJECTION is ceremony-layer only. One commit resolves it.**

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Produced by**: independent-assurance-agent v6.2.0
**Session**: session-T-W15R-QA-001-R2-wave15r-qa001-20260308

PHASE_B_BLOCKING_TOKEN: IAA-session-T-W15R-QA-001-wave15r-qa001-20260308-REJECTION-R2
