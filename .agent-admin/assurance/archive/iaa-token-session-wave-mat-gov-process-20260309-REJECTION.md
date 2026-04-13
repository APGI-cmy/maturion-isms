# IAA REJECTION-PACKAGE — session-wave-mat-gov-process-20260309

**Token Reference**: IAA-session-wave-mat-gov-process-20260309-REJECTION
**Date**: 2026-03-09
**Adoption Phase**: PHASE_B_BLOCKING
PHASE_B_BLOCKING_TOKEN: IAA-session-wave-mat-gov-process-20260309-REJECTION
**Verdict**: REJECTION-PACKAGE

---

## PR Under Review

- **Branch**: `copilot/implement-governance-process-mat`
- **Wave**: wave-mat-gov-process
- **HEAD commit**: 984df96
- **Session**: session-wave-mat-gov-process-20260309
- **Invoking agent**: foreman-v2-agent
- **Producing agents**: mat-specialist (T-MGP-GOV-001 through T-MGP-GOV-004), foreman-v2-agent (T-MGP-FM-001)
- **PR category**: AAWP_MAT

---

## Verdict Block (verbatim)

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/implement-governance-process-mat (wave-mat-gov-process)
Session: session-wave-mat-gov-process-20260309
5 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  CORE-013 / FAIL-ONLY-ONCE A-001: IAA Invocation Evidence Not In Committed PR Artifacts
    Finding: PREHANDOVER proof staged only (git status `A`), NOT committed to branch.
    Committed diff (7 files) does not include PREHANDOVER proof.
    Fix required: git commit including PREHANDOVER proof and session memory. Verify git status clean.

  CORE-015: Session Memory Not In Committed PR Artifacts
    Finding: Session memory staged only (git status `A`), NOT committed.
    Fix required: Same commit as CORE-013 fix.

  CORE-018: Complete Evidence Artifact Sweep — Conditions (a) and (b) Fail
    Finding: Conditions (a) PREHANDOVER on branch and (b) session memory on branch both FAIL.
    Files exist on disk but are staged only — not committed.
    Fix required: Same commit as CORE-013/CORE-015 fix.

  A-021: Files Staged But Not Committed Before IAA Invocation
    Finding: Pre-IAA Commit Gate misinterprets `A` (staged) as committed. `A` entries are
    NOT acceptable in git status --porcelain at IAA invocation time. Second recent occurrence
    of this exact pattern (prior: session-wave-session-refresh-auth-fix-20260309 R1).
    Fix required: Commit staged files. Update Pre-IAA Commit Gate to check git log for file
    in commit history, not just absence of `??` entries.

  A-026 / BL-027: SCOPE_DECLARATION Mismatch
    Finding: SCOPE_DECLARATION lists 9 files; committed diff shows 7. 2 staged-only files
    declared in SCOPE_DECLARATION but not in committed diff. A-031 carve-out does not apply.
    Fix required: Commit the 2 staged files. SCOPE_DECLARATION will then match exactly.

Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════
```

---

## Checks Summary

| Check | Verdict |
|-------|---------|
| CORE-001 through CORE-012 | PASS (N/A for non-AGENT_CONTRACT) or PASS |
| CORE-013 | **FAIL** — PREHANDOVER not committed |
| CORE-014 | PASS |
| CORE-015 | **FAIL** — Session memory not committed |
| CORE-016 | PASS (First Invocation Exception) |
| CORE-017 | PASS |
| CORE-018 | **FAIL** — Evidence sweep conditions (a)+(b) fail |
| CORE-019 | PASS (First Invocation Exception) |
| CORE-020 | PASS |
| CORE-021 | PASS (active) |
| CORE-022 | PASS (N/A) |
| FAIL-ONLY-ONCE A-001 | **FAIL** |
| FAIL-ONLY-ONCE A-002 | PASS |
| FAIL-ONLY-ONCE A-021 | **FAIL** |
| FAIL-ONLY-ONCE A-026 | **FAIL** |
| OVL-AM: No code changes | PASS |
| OVL-AM: QP Verdict | PASS |
| OVL-AM: CS2 Authorization | PASS |
| OVL-AM: FRS Traceability Quality | PASS |
| OVL-AM: TRS Derivation Quality | PASS |
| OVL-AM: Implementation Plan Quality | PASS |
| OVL-AM: A-032 Schema Column | PASS |
| OVL-AM-CST-01 | PASS (not applicable) |
| OVL-AM-CWT-01 | PASS (not an IBWR) |
| OVL-AM-FCWT-01 | PASS (not applicable) |
| OVL-AM: A-026 SCOPE_DECLARATION | **FAIL** |

**Total: 25 PASS / 5 FAIL**

---

## Required Fix (Single Action)

```bash
# From branch root:
git commit -m "governance(wave-mat-gov-process): add PREHANDOVER proof and session memory"
# Verify:
git status --porcelain   # must show NO output (clean working tree)
git diff --name-only HEAD~4..HEAD  # must show all 9 SCOPE_DECLARATION files
```

After commit, re-invoke IAA. The substantive deliverables (FRS, TRS, impl-plan, tracker) are high quality and should pass on re-invocation.

---

## Substantive Quality Note

The wave deliverables themselves are high quality:
- FRS v2.2.0 (FR-104–111): Well-structured, gap-traced, test-ID-referenced ✓
- TRS v2.0.0 (TR-103–110): Clean FR→TR derivation, concrete technical detail ✓  
- Implementation plan v2.7.0 (Wave 16.1–16.9): Correct dependency graph, builder assignments ✓
- Traceability matrix: 8 clean bidirectional FR→TR pairs ✓
- No code/schema/test/CI changes confirmed ✓

Advisory (non-rejection): GAP-017 (JWT auth) and GAP-019 (evidence_submissions) tracked in Wave 16.6 
but lack dedicated FRs — consider adding TR entries for cleaner security traceability.

Advisory (non-rejection): PREHANDOVER template `## IAA Agent Response (verbatim)` section should be 
updated per §4.3b to reference the dedicated token file rather than "[AWAITING IAA ASSURANCE-TOKEN 
— will be populated before commit]" which implies post-commit editing (violates A-029 immutability).

---

*Authority: CS2 ONLY (@APGI-cmy)*
*independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING | SELF-MOD-IAA-001 ACTIVE*
