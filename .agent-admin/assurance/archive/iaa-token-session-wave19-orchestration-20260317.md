# IAA ASSURANCE-TOKEN — Wave 19: MAT Criteria Parsing Holistic Repair

**Document type**: IAA ASSURANCE-TOKEN
**Token reference**: IAA-session-wave19-orchestration-20260317-R3-PASS
**PR**: Wave 19 — MAT Criteria Parsing Holistic Repair
**Branch**: copilot/wave-19-holistic-mat-criteria-repair
**Issue**: maturion-isms#1137
**Date**: 2026-03-17
**IAA Session**: session-wave19-orchestration-20260317-R3
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.2.0)
**Adoption Phase**: PHASE_B_BLOCKING
PHASE_B_BLOCKING_TOKEN: IAA-session-wave19-orchestration-20260317-R3-PASS
**Authority**: CS2 (@APGI-cmy)
**Round**: R3 (R1 REJECTED, R2 REJECTED, R3 PASS)

---

## ═══════════════════════════════════════
## ASSURANCE-TOKEN
**PR**: Wave 19 — MAT Criteria Parsing Holistic Repair (maturion-isms#1137)
**All 19 checks PASS. Merge gate parity: PASS.**
**Merge permitted (subject to CS2 approval).**
**Token reference**: IAA-session-wave19-orchestration-20260317-R3-PASS
**Adoption phase**: PHASE_B_BLOCKING — hard gate ACTIVE
## ═══════════════════════════════════════

---

## R3 Verification — A-032 Fix Confirmed

**Commit verified**: `4be54518` — `fix(schema): wave19 RPC fix — criteria INSERT uses title not name (A-032) [IAA-R2]`

Migration `apps/maturion-maturity-legacy/supabase/migrations/20260317000003_parse_write_back_atomic_rpc.sql`:

- INSERT column list line 215: `title` ✅ (was `name`)
- VALUES clause line 226: `v_crit->>'title'` ✅ (was `v_crit->>'name'`)
- A-032 DDL self-check comment present at line 40 ✅

The `name` references remaining in the migration are for `domains` and `mps` tables which DO have `name` columns — correct and unaffected.

---

## All Checks Summary (R3)

| Check | Result |
|-------|--------|
| CORE-001: Working tree clean (nothing to commit) | PASS ✅ |
| CORE-002: Branch declared — copilot/wave-19-holistic-mat-criteria-repair | PASS ✅ |
| CORE-003: Tests 14/14 PASS (vitest 315ms) | PASS ✅ |
| CORE-004: Zero test debt / stubs | PASS ✅ |
| CORE-005: Architecture decisions honoured (AD-W19-001/002/003) | PASS ✅ |
| CORE-006: POLC boundary (Foreman no direct production code) | PASS ✅ |
| CORE-013: PREHANDOVER proof committed (2ff6fc87) | PASS ✅ |
| CORE-015: Session memory committed | PASS ✅ |
| CORE-016/A-029: iaa_audit_token pre-populated in PREHANDOVER | PASS ✅ |
| CORE-018: Evidence artifact bundle complete | PASS ✅ |
| CORE-019: PREHANDOVER reflects actual state (A-030) | PASS ✅ |
| CORE-021/A-021: Commits present (HEAD local ahead of origin by 2 — token commit will push) | PASS ✅ |
| CORE-022/A-026: SCOPE_DECLARATION current | PASS ✅ |
| **A-032: Schema column compliance — title (not name) in criteria INSERT** | **PASS ✅** |
| OVL-AM-CWT-01: CWT PASS evidence | PASS ✅ |
| OVL-AM-CST-01: CST checkpoint | PASS ✅ |
| GAP-PARSE coverage: GAP-PARSE-001 through GAP-PARSE-012 all addressed | PASS ✅ |
| MERGE GATE PARITY (§4.3): local checks aligned | PASS ✅ |
| INDEPENDENCE: IAA did not produce any artifact in this PR | CONFIRMED ✅ |
| **Total** | **19 PASS / 0 FAIL** |

---

## Build Quality Attestation

- 14/14 T-W19-NNN TypeScript tests PASS (zero failures, zero stubs, zero skips)
- All 12 GAP-PARSE defects addressed (GAP-PARSE-001 through GAP-PARSE-012)
- 3 migrations correct and idempotent
- Edge Function fixes wired correctly
- AI Gateway MpsResult model correct
- CI schema validation script present
- LDCS E2E fixture present
- CodeQL 0 alerts (per api-builder evidence)
- OPOJD: PASS

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Merge authority**: CS2 ONLY. IAA does not merge.
**PREHANDOVER proof**: unchanged post-commit (immutable per §4.3b)
