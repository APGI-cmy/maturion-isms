# IAA Token — session-143 / Wave 14 IBWR / 2026-03-05

**Token Reference**: IAA-session-143-wave14-ibwr-20260305-REJECT
**Verdict**: REJECTION-PACKAGE
**PR Branch**: copilot/update-wave-14-ibwr-tracker
**Wave**: Wave 14 IBWR — In-Between Wave Reconciliation (Final)
**IAA Session**: session-150 (internal)
**Date**: 2026-03-05
**Invoking Agent**: foreman-v2-agent (session-143)
**Adoption Phase**: PHASE_B_BLOCKING
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Verdict

```
═══════════════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/update-wave-14-ibwr-tracker / Wave 14 IBWR (session-143)
1 check FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:
  SUBSTANTIVE-002 / CORE-021: CWT tally arithmetic inconsistency

  Finding:
    IBWR §3 declares Batch C = 20 tests, Total = 104 tests.
    Arithmetic: 37 (Batch A) + 40 (Batch B) + 20 (Batch C) = 97 ≠ 104.
    7-test discrepancy unexplained in the IBWR.

    BUILD_PROGRESS_TRACKER CWT tally (approx. line 2862-2863) replicates
    the same error: "20 | 20/20 GREEN" for Batch C with "104" total.

    BUILD_PROGRESS_TRACKER audit log (line 2916) correctly states
    "27/27 Batch C tests GREEN" — 37+40+27=104 ✓ — consistent with
    the authoritative CWT runner output from wave14-cwt-evidence-20260305.md.

    The correct Batch C test count is 27, not 20. The "20" reflects
    the count of labeled sub-test spec identifiers (T-W14-UX-012a–f=6,
    T-W14-UX-013a–g=7, T-W14-UX-016a–g=7 → 20 labeled IDs), not the
    actual test assertion count produced by the test runner (27).

  Fix required:
    1. Update IBWR §3 CWT tally:
       - Batch C "20" → "27"; "20/20 GREEN" → "27/27 GREEN"
    2. Update BUILD_PROGRESS_TRACKER CWT tally:
       - Batch C "20 | ✅ 20/20 GREEN" → "27 | ✅ 27/27 GREEN"
    3. Commit both changes to branch copilot/update-wave-14-ibwr-tracker
    4. Re-invoke IAA

Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════════════════════════════════════
```

---

## Checks Summary

| Check ID | Check | Result |
|----------|-------|--------|
| CORE-007 | No placeholder content | ✅ PASS |
| CORE-013 | IAA invocation evidence (A-029 pre-populated token) | ✅ PASS |
| CORE-014 | No class exemption claim | ✅ PASS |
| CORE-015 | Session memory present | ✅ PASS |
| CORE-016 | IAA verdict file (first invocation exception) | ✅ PASS |
| CORE-017 | No .github/agents/ modifications | ✅ PASS |
| CORE-018 | Complete evidence artifact sweep | ✅ PASS |
| CORE-019 | Token cross-verification (first invocation exception) | ✅ PASS |
| CORE-020 | Zero partial pass rule | ✅ PASS |
| CORE-021 | Zero-severity tolerance — enforced | ✅ PASS (enforcement active) |
| A-026 | SCOPE_DECLARATION matches git diff (6/6) | ✅ PASS |
| A-028 | SCOPE_DECLARATION format compliance | ✅ PASS |
| OVL-AM-CWT-01 | CWT PASS evidence present before IBWR | ✅ PASS |
| SUBSTANTIVE-001a | GAP closure registry complete (15/15) | ✅ PASS |
| SUBSTANTIVE-001b | IAA token files all exist on branch | ✅ PASS |
| SUBSTANTIVE-001c | FCWT correctly pending (not falsely claimed PASS) | ✅ PASS |
| SUBSTANTIVE-001d | BUILD_PROGRESS_TRACKER updated correctly | ✅ PASS |
| SUBSTANTIVE-002 | CWT tally arithmetic — Batch C count | ❌ FAIL |
| Merge gate parity | merge-gate/verdict + governance/alignment | ❌ FAIL |

---

## Re-invocation Instructions

After fixing FINDING-IBWR-001:
1. Correct IBWR §3 Batch C: "20" → "27"; "20/20" → "27/27"
2. Correct BUILD_PROGRESS_TRACKER CWT tally Batch C: same correction
3. Git commit to branch `copilot/update-wave-14-ibwr-tracker`
4. Re-invoke IAA (new session)

Note on PREHANDOVER immutability (A-029): The PREHANDOVER proof is read-only post-commit.
No need to update the PREHANDOVER. The fix is limited to the IBWR artifact and
BUILD_PROGRESS_TRACKER. The iaa_audit_token in the PREHANDOVER remains pre-populated
as `IAA-session-143-wave14-ibwr-20260305-PASS` — the re-invocation will issue a
PASS token to that same file path upon successful re-review.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | **Adoption Phase**: PHASE_B_BLOCKING
**STOP-AND-FIX mandate**: ACTIVE — no merge until ASSURANCE-TOKEN issued
