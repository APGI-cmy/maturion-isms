# IAA REJECTION-PACKAGE — session-wave-mat-gov-process-20260309-R2

**Token Reference**: IAA-session-wave-mat-gov-process-20260309-R2-REJECTION
**Date**: 2026-03-09
**Adoption Phase**: PHASE_B_BLOCKING
**Verdict**: REJECTION-PACKAGE — R2 RE-INVOCATION

---

## PR Under Review

- **Branch**: `copilot/implement-governance-process-mat`
- **Wave**: wave-mat-gov-process
- **HEAD commit**: 5271a5b (at time of R2 invocation)
- **Session**: session-wave-mat-gov-process-20260309-R2
- **Invoking agent**: foreman-v2-agent
- **Producing agents**: mat-specialist (T-MGP-GOV-001 through T-MGP-GOV-004), foreman-v2-agent (T-MGP-FM-001)
- **PR category**: AAWP_MAT
- **Prior invocation**: R1 REJECTION-PACKAGE (IAA-session-wave-mat-gov-process-20260309-REJECTION, SHA 5271a5b)

---

## R1 Failures Status

| R1 Failure | Status in R2 |
|------------|-------------|
| CORE-013 / A-001 — PREHANDOVER not committed | ✅ RESOLVED — committed in 5271a5b |
| CORE-015 — Session memory not committed | ✅ RESOLVED — committed in 5271a5b |
| CORE-018 — Evidence sweep conditions (a)+(b) fail | ✅ RESOLVED — both now committed |
| A-021 — Files staged but not committed | ✅ RESOLVED — `git status --porcelain` clean |
| A-026 / BL-027 — SCOPE_DECLARATION mismatch | ❌ **NOT RESOLVED — NEW ANALYSIS BELOW** |

---

## R2 Verdict Block

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/implement-governance-process-mat (wave-mat-gov-process) — R2
Session: session-wave-mat-gov-process-20260309-R2
2 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  A-026 / BL-027: SCOPE_DECLARATION.md Not Updated for This Wave
    Finding: SCOPE_DECLARATION.md at HEAD is from wave-OVL-INJ (March 7, 2026). It does not
    list a single wave-mat-gov-process file. Direct verification:
      - `git diff 5344fcf HEAD -- SCOPE_DECLARATION.md` → empty (NO DIFF)
      - `git log --all --oneline SCOPE_DECLARATION.md` → only `c90542f Initial plan` (grafted base)
      - SCOPE_DECLARATION.md header: "# Scope Declaration — wave-OVL-INJ — 2026-03-07"
    The R1 fix commit (5271a5b) correctly committed PREHANDOVER proof and session memory
    but omitted SCOPE_DECLARATION.md — which was apparently also staged at R1 time but
    not included in the fix. The R1 REJECTION-PACKAGE claim "SCOPE_DECLARATION will then
    match exactly" was an incomplete diagnosis: SCOPE_DECLARATION.md itself also needed committing.
    Fix required: Rewrite SCOPE_DECLARATION.md from scratch for wave-mat-gov-process.
    List all files in `git diff --name-only 5344fcf HEAD` that are producer deliverables,
    plus A-031 carve-out note for IAA ceremony artifacts. Trim all prior-wave entries.
    Commit. Verify `git status --porcelain` clean. Re-invoke IAA as R3.

  A-028: Prior-Wave Entries Not Trimmed
    Finding: Linked to A-026. SCOPE_DECLARATION.md contains OVL-INJ and wave-session-refresh-
    auth-fix entries. Per A-028: "Must be trimmed to contain ONLY files in current PR diff."
    Fix required: Same single action as A-026 fix — rewrite SCOPE_DECLARATION.md for this wave.

Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════
```

---

## R2 Checks Summary

| Check | Verdict |
|-------|---------|
| CORE-001 through CORE-012 | N/A (not AGENT_CONTRACT) |
| CORE-013 | ✅ PASS — PREHANDOVER committed |
| CORE-014 | ✅ PASS |
| CORE-015 | ✅ PASS — Session memory committed |
| CORE-016 | ✅ PASS — R1 REJECTION token on branch; R2 token written this session |
| CORE-017 | ✅ PASS — No .github/agents/ changes |
| CORE-018 | ✅ PASS — All (a)–(d) conditions met |
| CORE-019 | ✅ PASS — A-030 carve-out (R1 REJECTION documents prior verdict) |
| CORE-020 | ✅ PASS (operating principle) |
| CORE-022 | N/A |
| FAIL-ONLY-ONCE A-001 | ✅ PASS |
| FAIL-ONLY-ONCE A-002 | ✅ PASS |
| FAIL-ONLY-ONCE A-021 | ✅ PASS — git status clean |
| **FAIL-ONLY-ONCE A-026** | **❌ FAIL** |
| **FAIL-ONLY-ONCE A-028** | **❌ FAIL** |
| BD-001 Full scope delivered | ✅ PASS |
| BD-002 through BD-019 | N/A (doc-only wave) |
| BD-022 Architecture alignment | ✅ PASS |
| OVL-INJ-001 Injection audit trail | ✅ PASS |
| OVL-AM-CST-01 | ✅ PASS (N/A) |
| OVL-AM-CWT-01 | ✅ PASS (N/A) |
| OVL-AM-FCWT-01 | ✅ PASS (N/A) |
| §4.3 Merge gate parity | ❌ FAIL (SCOPE_DECLARATION validation) |

**Total: 15 PASS / 2 FAIL**

---

## Required Fix (Single Action)

```bash
# Create SCOPE_DECLARATION.md for wave-mat-gov-process:
# Content must include:
# Header: "# Scope Declaration — wave-mat-gov-process — 2026-03-09"
# Wave, Branch, Session, Date, Authority, PR fields
# All producer deliverable files from `git diff --name-only 5344fcf HEAD`:
#   - .agent-admin/assurance/iaa-prebrief-wave-mat-gov-process.md
#   - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-mat-gov-process-20260309.md
#   - .agent-workspace/foreman-v2/memory/session-wave-mat-gov-process-20260309.md
#   - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
#   - modules/mat/01-frs/functional-requirements.md
#   - modules/mat/01.5-trs/frs-to-trs-traceability.md
#   - modules/mat/01.5-trs/technical-requirements-specification.md
#   - modules/mat/03-implementation-plan/implementation-plan.md
#   - modules/mat/BUILD_PROGRESS_TRACKER.md
#   - SCOPE_DECLARATION.md (this file)
# Plus A-031 carve-out note for IAA ceremony artifacts in the diff:
#   - .agent-admin/assurance/iaa-token-session-wave-mat-gov-process-20260309-REJECTION.md
#   - .agent-admin/assurance/iaa-token-session-wave-mat-gov-process-20260309-R2-REJECTION.md
#   - .agent-workspace/independent-assurance-agent/memory/session-wave-mat-gov-process-20260309.md
#   - .agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md
#
git add SCOPE_DECLARATION.md
git commit -m "governance(wave-mat-gov-process): update SCOPE_DECLARATION.md for current wave — A-026/A-028 fix"
# Verify:
git status --porcelain   # must show empty output
git diff --name-only 5344fcf HEAD  # must show SCOPE_DECLARATION.md in the list
```

After these steps, re-invoke IAA (R3). All other checks PASS.

---

## Substantive Quality Note (Unchanged from R1)

The wave deliverables remain high quality:
- FRS v2.2.0 (FR-104–111): Well-structured, gap-traced ✅
- TRS v2.0.0 (TR-103–110): Clean FR→TR derivation ✅
- Implementation plan v2.7.0 (Wave 16.1–16.9): Correct dependency graph ✅
- Traceability matrix: 8 clean bidirectional FR→TR pairs ✅
- BUILD_PROGRESS_TRACKER v1.8: 25-gap register complete ✅

R3 ASSURANCE-TOKEN expected following SCOPE_DECLARATION.md fix.

---

*Authority: CS2 ONLY (@APGI-cmy)*
*independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING | SELF-MOD-IAA-001 ACTIVE*
*Token Reference: IAA-session-wave-mat-gov-process-20260309-R2-REJECTION*
