# IAA Assurance Token — Session 142 v3 / Wave 14 Batch C / 2026-03-05

**Token Reference**: IAA-session-142-v3-wave14-batchC-20260305-PASS
**IAA Session ID**: session-149 (next available — session-148 push-failed)
**Date**: 2026-03-05
**Agent**: independent-assurance-agent v6.2.0
**PR**: copilot/finalise-mat-gap-closure
**Issue**: #909 — Wave 14 Batch C: Finalise MAT remaining gap closure and QA acceptance
**Invoking Agent**: foreman-v2-agent v6.2.0 (session-142)
**Producing Agents**: schema-builder (TASK-W14-BC-001, BC-002, FINDING-BC-001 fix), mat-specialist (TASK-W14-BC-003, BC-004), qa-builder (FINDING-BC-002 fix)
**Category**: AAWP_MAT
**Adoption Phase**: PHASE_B_BLOCKING
**Invocation**: v3 re-invocation — A-030 correction addendum
**Prior Rejection History**: session-147 (FINDING-BC-001 + BC-002), session-148 local-only (FINDING-BC-003)

---

## Verbatim IAA Verdict

```
═══════════════════════════════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/finalise-mat-gap-closure / Issue #909
    Wave 14 Batch C — Finalise MAT Remaining Gap Closure and QA Acceptance
    v3 Re-invocation — A-030 correction addendum

All 35+ checks PASS. Merge gate parity: PASS.

Prior findings fully resolved:
  FINDING-BC-001 (BD-003/BD-005): RESOLVED ✅
    aggregate_scores_overall_unique partial index present and correct
    (CREATE UNIQUE INDEX IF NOT EXISTS aggregate_scores_overall_unique
     ON public.aggregate_scores (audit_id, level_type)
     WHERE scope_id IS NULL)

  FINDING-BC-002 (OVL-AM-CWT-01): RESOLVED ✅
    wave14-cwt-evidence-20260305.md present — formal CWT PASS verdict,
    17/17 Wave 14 test files GREEN, 104/104 tests PASS, 15/15 GAPs CLOSED,
    0 regressions, 9 pre-existing exclusions documented

  FINDING-BC-003 (A-026/CORE-021): RESOLVED ✅
    SCOPE_DECLARATION updated with IAA session-147 ceremony artifacts
    PREHANDOVER v3 correction addendum committed per A-030 pattern

Substantive assessment: Wave 14 Batch C schema migrations are
production-ready. The two-layer UPSERT pattern for aggregate_scores
(UNIQUE constraint for non-NULL scope_id + partial index for NULL scope_id)
is the correct PostgreSQL implementation. CWT evidence is comprehensive
and matches Wave 13 precedent. All 15 Wave 14 GAPs are CLOSED.

Merge permitted (subject to CS2 approval).
Token reference: IAA-session-142-v3-wave14-batchC-20260305-PASS
IAA Session: session-149 (next available after session-148 push-fail)
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════════════════════════════
```

---

## Checks Summary

| Phase | Checks | PASS | FAIL |
|-------|--------|------|------|
| FAIL-ONLY-ONCE | 7 | 7 | 0 |
| Core Invariants (applicable) | 13 | 13 | 0 |
| AAWP_MAT Overlay (BD-001 to BD-024) | All applicable | All PASS | 0 |
| OVL-AM-CST-01 | 1 | 1 | 0 |
| OVL-AM-CWT-01 | 1 | 1 | 0 |
| OVL-AM-FCWT-01 | 1 | 1 | 0 |
| Merge Gate Parity | 3 | 3 | 0 |

**Total**: 35+ checks executed. **0 FAIL.**

---

## Finding Resolution Attestation

| Finding | Session Raised | Fix Committed | IAA Verification |
|---------|---------------|--------------|-----------------|
| FINDING-BC-001 (partial index) | session-147 | 6399e8a (HEAD~1) | ✅ VERIFIED — index present in migration 000007, line 167–169 |
| FINDING-BC-002 (CWT evidence) | session-147 | 2c8b233 (HEAD~2) | ✅ VERIFIED — wave14-cwt-evidence-20260305.md present, CWT PASS verdict formal block confirmed |
| FINDING-BC-003 (SCOPE_DECLARATION) | session-148 (local) | 44dbfde (HEAD) | ✅ VERIFIED — IAA ceremony artifacts listed in SCOPE_DECLARATION; PREHANDOVER v3 correction addendum present |

---

## Authority

- **Issued by**: independent-assurance-agent v6.2.0
- **Authority**: CS2 only (@APGI-cmy)
- **Merge authority**: CS2 ONLY — this token permits merge, CS2 must approve
- **PREHANDOVER proof**: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-142-v3-wave14-batchC-20260305.md` — UNCHANGED (immutable per §4.3b)

---

*Token written per §4.3b — dedicated token file. PREHANDOVER proof not edited (read-only post-commit).*
