# IAA Rejection Package — wave-ai-criteria-creation-fix

**Token Reference**: IAA-session-wave-ai-criteria-creation-fix-20260311-R1-REJECTION
**Session ID**: session-wave-ai-criteria-creation-fix-20260311
**Date**: 2026-03-11
**PR Branch**: copilot/fix-ai-criteria-creation-failure
**Wave**: wave-ai-criteria-creation-fix
**IAA Agent**: independent-assurance-agent v6.2.0
**Invoking Agent**: foreman-v2-agent
**Producing Agents**: qa-builder (T-W17-QA-001), schema-builder (T-W17-SCH-001)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: wave-ai-criteria-creation-fix / copilot/fix-ai-criteria-creation-failure
1 check FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:
  A-026 / CORE-021: SCOPE_DECLARATION.md incomplete — 3 committed files missing from
  exact-match scope list.

  Finding:
    The file `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` was
    freshly overwritten for this wave and lists 6 of the 9 files in
    `git diff --name-only origin/main...HEAD`. Three committed wave files
    are absent:

      1. .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-ai-criteria-creation-fix-20260311.md
      2. .agent-workspace/foreman-v2/memory/session-wave-ai-criteria-creation-fix-20260311.md
      3. .agent-workspace/foreman-v2/parking-station/suggestions-log.md

    FAIL-ONLY-ONCE A-026: SCOPE_DECLARATION must match git diff
    --name-only origin/main...HEAD EXACTLY. No A-031 carve-out applies
    (A-031 covers IAA's own prior-rejection artifacts only).
    CORE-021 Zero-Severity-Tolerance: this finding cannot be characterised
    as minor or ceremony-only.

  Fix required:
    Add the 3 missing file entries to
    `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md`
    (with file type and category), commit and push the change to the branch,
    THEN re-invoke IAA.

    Example entries to add:
    | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-ai-criteria-creation-fix-20260311.md` | CEREMONY | PREHANDOVER proof |
    | `.agent-workspace/foreman-v2/memory/session-wave-ai-criteria-creation-fix-20260311.md` | CEREMONY | Foreman session memory |
    | `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` | CEREMONY | Parking station entry |

NOTE — All substantive build checks PASS:
  ✅ A-032 Schema Column Compliance: All 8 Edge Function INSERT columns confirmed
     present in post-migration schema. title TEXT (nullable) added.
     description NOT NULL dropped. Idempotent DDL guards verified.
  ✅ BD-001 Full scope delivered (root cause documented + fixed)
  ✅ BD-003 One-time build compliance (merge → deploy → pipeline healed)
  ✅ BD-005 End-to-end wiring verified (write + read path confirmed)
  ✅ BD-011 Tests 5/5 GREEN (IAA independently verified)
  ✅ BD-012 Zero test debt
  ✅ OVL-INJ-001 Pre-Brief committed BEFORE implementation (correct sequence)
  ✅ A-021 All artifacts committed before IAA invocation

The only failing check is the SCOPE_DECLARATION ceremony gap (A-026).
The fix is a one-line SCOPE_DECLARATION update + commit.

This PR must not be opened until the SCOPE_DECLARATION is corrected,
committed, and IAA re-invoked. The re-invocation will be a fast-pass
on substance (all build/quality checks already verified PASS).

Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════════════════════════════
```

---

## Checks Summary

| Check | Category | Result |
|-------|----------|--------|
| CORE-005 Governance block | CORE | PASS ✅ |
| CORE-006 CANON_INVENTORY alignment | CORE | PASS ✅ |
| CORE-007 No placeholder content | CORE | PASS ✅ |
| CORE-013 IAA invocation evidence | CORE | PASS ✅ |
| CORE-014 No class exemption | CORE | PASS ✅ |
| CORE-015 Session memory present | CORE | PASS ✅ |
| CORE-016 IAA verdict evidenced (§4.3b) | CORE | PASS ✅ (First Invocation) |
| CORE-017 No .github/agents modifications | CORE | PASS ✅ |
| CORE-018 Complete evidence artifact sweep | CORE | PASS ✅ |
| CORE-019 IAA token cross-verification | CORE | PASS ✅ (First Invocation) |
| CORE-020 Zero partial pass | CORE | PASS ✅ |
| CORE-021 Zero-severity-tolerance | CORE | ENFORCING — finding cited |
| A-026 SCOPE_DECLARATION exact match | FAIL-ONLY-ONCE | **FAIL ❌** |
| A-032 Schema Column Compliance | FAIL-ONLY-ONCE | PASS ✅ |
| A-021 Commit before IAA invocation | FAIL-ONLY-ONCE | PASS ✅ |
| BD-001 Full scope delivered | AAWP_MAT | PASS ✅ |
| BD-002 No stubs/TODOs | AAWP_MAT | PASS ✅ |
| BD-003 One-time build compliance | AAWP_MAT | PASS ✅ |
| BD-004 No leftover debt | AAWP_MAT | PASS ✅ |
| BD-005 End-to-end wiring | AAWP_MAT | PASS ✅ |
| BD-006 Writers and readers | AAWP_MAT | PASS ✅ |
| BD-007 Auth guards | AAWP_MAT | PASS ✅ |
| BD-008 FK integrity | AAWP_MAT | PASS ✅ |
| BD-009 Cross-component fit | AAWP_MAT | PASS ✅ |
| BD-010 No orphaned deliverables | AAWP_MAT | PASS ✅ |
| BD-011 100% test pass rate | AAWP_MAT | PASS ✅ (5/5 IAA-verified) |
| BD-012 Zero test debt | AAWP_MAT | PASS ✅ |
| BD-013 No test dodging | AAWP_MAT | PASS ✅ |
| BD-014 No deprecation | AAWP_MAT | PASS ✅ |
| BD-015 RLS complete | AAWP_MAT | PASS ✅ |
| BD-016 No hardcoded secrets | AAWP_MAT | PASS ✅ |
| BD-017 Input validation | AAWP_MAT | PASS ✅ |
| BD-018 No injection vectors | AAWP_MAT | PASS ✅ |
| BD-019 International standards | AAWP_MAT | PASS ✅ |
| OVL-INJ-001 Pre-Brief artifact existence | PRE_BRIEF_ASSURANCE | PASS ✅ |
| Merge gate parity | §4.3 | FAIL ❌ (A-026 causes failure) |

**Total**: ~36 checks. **35 PASS, 1 FAIL**.

---

## Re-Invocation Instructions

1. Foreman: update `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` to add the 3 missing file entries (PREHANDOVER proof, foreman session memory, parking-station/suggestions-log.md)
2. Commit the SCOPE_DECLARATION update to branch `copilot/fix-ai-criteria-creation-failure`
3. Push the commit
4. Re-invoke IAA — provide this rejection package as context (A-030 carve-out: correction addendum satisfies CORE-019 for re-invocation)
5. Re-invocation expected outcome: ASSURANCE-TOKEN (all substantive checks already PASS)

**A-030 Carve-Out**: This rejection artifact serves as the correction addendum for re-invocation. The PREHANDOVER proof's `iaa_audit_token` field (`IAA-session-wave-ai-criteria-creation-fix-20260311-PASS`) was pre-populated per A-029. For re-invocation, the PREHANDOVER proof need not be re-committed — only the SCOPE_DECLARATION fix is required. The token file for the re-invocation PASS will be at:
`.agent-admin/assurance/iaa-token-session-wave-ai-criteria-creation-fix-20260311-R2-PASS.md`

---

**IAA Agent**: independent-assurance-agent v6.2.0
**STOP-AND-FIX**: ACTIVE — No PR opens until IAA issues ASSURANCE-TOKEN
**Authority**: CS2 only (@APGI-cmy)
