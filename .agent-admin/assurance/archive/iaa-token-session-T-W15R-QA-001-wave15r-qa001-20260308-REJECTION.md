# IAA Verdict Artifact — REJECTION-PACKAGE
# Session: session-T-W15R-QA-001 | Wave 15R-QA001 | 2026-03-08

| Field | Value |
|-------|-------|
| `token_type` | REJECTION-PACKAGE |
| `session_id` | session-T-W15R-QA-001-20260308 |
| `date` | 2026-03-08 |
| `branch` | copilot/create-red-tests-wave-15r |
| `pr_reviewed` | T-W15R-QA-001 — Wave 15R Batch C governance closure (Issue #1000) |
| `invoking_agent` | foreman-v2-agent (Phase 4.3a IAA HANDOVER AUDIT) |
| `producing_agent` | foreman-v2-agent |
| `producing_agent_class` | foreman |
| `pr_category` | AAWP_MAT (governance ceremony closure) |
| `adoption_phase` | PHASE_B_BLOCKING |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-T-W15R-QA-001-wave15r-qa001-20260308-REJECTION |
| `checks_executed` | 38 applicable |
| `checks_passed` | 35 |
| `checks_failed` | 3 |
| `merge_gate_parity` | FAIL — 3 failures |

---

## Verbatim Verdict Output

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: Branch copilot/create-red-tests-wave-15r
    T-W15R-QA-001 — Wave 15R Batch C governance closure (Issue #1000)
3 check(s) FAILED. Merge blocked. STOP-AND-FIX required.
═══════════════════════════════════════════════════════════════

FAILURE 1 — CORE-007: Placeholder content in committed artifact
Finding: PREHANDOVER proof contains literal unfilled placeholder in Pre-IAA Commit Gate section:
  "[To be populated immediately before IAA invocation per A-021 enforcement]"
  (in the git log field). Phrase "to be populated" matches CORE-007 search pattern.
  PREHANDOVER is locked read-only (A-029).
Fix: Commit CORRECTION-ADDENDUM file (A-030 path) documenting actual git log:
  656f773, 5900e56, b2449c1. Add to SCOPE_DECLARATION.md. Re-invoke IAA.

FAILURE 2 — A-026: SCOPE_DECLARATION.md filename mismatch
Finding: SCOPE_DECLARATION.md line 27 declares:
  `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-T-W15R-QA-001-20260308.md`
Actual committed file:
  `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-T-W15R-QA-001-wave15r-qa001-20260308.md`
A-031 carve-out does NOT apply — this is a Foreman-produced artifact.
Fix: Correct SCOPE_DECLARATION.md line 27 filename. Commit. Re-invoke IAA.

FAILURE 3 — A-028: Prior-wave entries not trimmed from SCOPE_DECLARATION.md
Finding: SCOPE_DECLARATION.md contains prior-wave content from wave15r-closure-correction
  (Scope section, Files Changed, Governance Notes). Per A-028 these must be trimmed.
Fix: Remove wave15r-closure-correction section from SCOPE_DECLARATION.md. Commit. Re-invoke IAA.
═══════════════════════════════════════════════════════════════
SUBSTANTIVE QUALITY (informational — does not change verdict):
All substantive checks PASS:
✅ Test file 35/35 GREEN, zero debt, legitimate assertions
✅ QP evaluation accurate with run evidence
✅ INC-OPOJD-W15R-QA-001 properly remediated and documented
✅ QA-to-Red bypass acknowledged with CS2 authorization
✅ S-025/A-033 openly declared as carry-forward
✅ Closes: maturion-isms#1000 declared
✅ Zero scope creep — governance artifacts only
Failures are ceremony-layer only. Fixes are straightforward.
Re-invocation after fixes should yield ASSURANCE-TOKEN.
═══════════════════════════════════════════════════════════════
This PR must not be opened until all 3 failures resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
Authority: CS2 ONLY (@APGI-cmy). I do not merge under any other instruction.
═══════════════════════════════════════════════════════════════
```

---

## Re-Invocation Requirements

When re-invoking IAA after fixes:

1. **CORE-007 fix (CORRECTION-ADDENDUM)**: Commit a new file, e.g.
   `.agent-workspace/foreman-v2/memory/CORRECTION-ADDENDUM-session-T-W15R-QA-001-git-log-20260308.md`
   containing the actual git log (656f773, 5900e56, b2449c1) and referencing the
   PREHANDOVER file by path. Do NOT edit the existing PREHANDOVER proof (A-029 immutable).

2. **A-026 fix**: Correct SCOPE_DECLARATION.md item 6 from
   `PREHANDOVER-session-T-W15R-QA-001-20260308.md` to
   `PREHANDOVER-session-T-W15R-QA-001-wave15r-qa001-20260308.md`

3. **A-028 fix**: Remove `wave15r-closure-correction` section from SCOPE_DECLARATION.md

4. Add CORRECTION-ADDENDUM file to SCOPE_DECLARATION.md file list.

5. Add this REJECTION token file to SCOPE_DECLARATION.md (per A-030 convention).

6. Commit all fixes in a single commit. Confirm git status clean. Re-invoke IAA.

---

**Produced by**: independent-assurance-agent v6.2.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Date**: 2026-03-08
**STOP-AND-FIX mandate**: ACTIVE — no PR opens until ASSURANCE-TOKEN issued

PHASE_B_BLOCKING_TOKEN: IAA-session-T-W15R-QA-001-wave15r-qa001-20260308-REJECTION
