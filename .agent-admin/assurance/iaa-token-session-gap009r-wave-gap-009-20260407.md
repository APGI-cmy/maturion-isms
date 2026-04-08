# IAA ASSURANCE-TOKEN — Session gap009r — 2026-04-08

> ⚠️ IMMUTABILITY RULE: This file is READ-ONLY after initial commit. No agent may edit it post-commit.
> Produced by: independent-assurance-agent v6.2.0 — STOP-AND-FIX gate.
> Authority: CS2 only (@APGI-cmy).

---

```
═══════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/gap-009-wire-supabase-insert (issue maturion-isms#1274)
Branch: copilot/gap-009-wire-supabase-insert
Invocation: R2 (re-invocation by api-builder session-gap009 after R1 REJECTION-PACKAGE)
R1 reference: .agent-admin/assurance/iaa-token-session-gap009-wave-gap-009-20260407.md
R1 failures resolved:
  - BD-003/BD-009/A-032: Capability.RAG CHECK constraint mismatch — RESOLVED ✅
    Migration 011_ai_episodic_capability_rag.sql: DROP old anon CHECK + ADD named CHECK with all 9 values incl. 'rag'
    Schema tests: gap009-episodic-capability-rag.test.ts — 5/5 GREEN (GAP009-SCH-T-001 through T-005)
All 14 checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-gap009r-20260407-PASS
PHASE_B_BLOCKING_TOKEN: IAA-gap009r-20260407-PASS
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════
```

---

## Verdict Metadata

```yaml
token_reference: IAA-gap009r-20260407-PASS
PHASE_B_BLOCKING_TOKEN: IAA-gap009r-20260407-PASS
pr_branch: copilot/gap-009-wire-supabase-insert
issue: maturion-isms#1274
invocation_type: R2 (re-invocation after R1 REJECTION-PACKAGE)
invoking_agent: api-builder session-gap009-20260407
producing_agent: independent-assurance-agent v6.2.0
pr_produced_by: api-builder v6.2.0
pr_category: AAWP_MAT
verdict: ASSURANCE-TOKEN
date: 2026-04-08
iaa_agent_version: 6.2.0
iaa_contract_version: 2.3.0
adoption_phase: PHASE_B_BLOCKING
checks_executed: 14
checks_passed: 14
checks_failed: 0
merge_gate_parity: PASS
test_suite: 325/325 GREEN (32 test files)
```

---

## R1 Failure Resolution Verification

### R1 Failure: BD-003 / BD-009 / A-032 — Capability.RAG CHECK constraint mismatch

**R1 finding**: `Capability.RAG = 'rag'` exists in the TypeScript Capability enum (9 values) but was absent from the `ai_episodic_events.capability` CHECK constraint in migration 004 (8 values). After this PR's Supabase wiring, any INSERT with `capability = 'rag'` would fail the DB CHECK constraint. `MemoryLifecycle.catch(() => {})` would silently swallow the error — silent data loss for all RAG capability events.

**R2 fix — Migration 011** (`packages/ai-centre/supabase/migrations/011_ai_episodic_capability_rag.sql`):
```sql
ALTER TABLE ai_episodic_events
  DROP CONSTRAINT IF EXISTS ai_episodic_events_capability_check;
ALTER TABLE ai_episodic_events
  ADD CONSTRAINT ai_episodic_events_capability_check
  CHECK (capability IN (
    'advisory', 'analysis', 'embeddings',
    'document-generation', 'image-generation', 'deep-search',
    'video-generation', 'algorithm-execution', 'rag'
  ));
```

**R2 fix — Schema tests** (`packages/ai-centre/src/__tests__/schema/gap009-episodic-capability-rag.test.ts`):
- GAP009-SCH-T-001: Migration file 011 exists ✅
- GAP009-SCH-T-002: Migration drops old anonymous CHECK constraint ✅
- GAP009-SCH-T-003: Migration adds CHECK containing 'rag' ✅
- GAP009-SCH-T-004: Migration retains all 8 original capability values ✅
- GAP009-SCH-T-005: Migration 004 does NOT contain 'rag' (root cause documentation) ✅

**Test suite verification**: 325/325 GREEN (32 test files) — confirmed R2.

---

## Checks Summary

| Check | Status |
|-------|--------|
| CERT-001 PREHANDOVER proof exists | ✅ PASS |
| CERT-002 Session memory exists (api-builder) | ✅ PASS |
| CERT-003 FAIL-ONLY-ONCE attested | ✅ PASS |
| CERT-004 IAA token field present (R2) | ✅ PASS |
| BD-000-A Journey declaration present | ✅ PASS |
| BD-001 Full scope delivered | ✅ PASS |
| BD-002 No stub/TODO in production paths | ✅ PASS |
| BD-003 One-time build compliance (R1 FAIL → R2 PASS) | ✅ PASS — migration 011 resolves RAG capability gap |
| BD-005 End-to-end wiring verified | ✅ PASS |
| BD-009 Cross-component integration fit (R1 FAIL → R2 PASS) | ✅ PASS — Capability enum and DB CHECK now fully aligned |
| BD-011 100% test pass rate | ✅ PASS — 325/325 GREEN |
| BD-015 RLS policies complete | ✅ PASS |
| BD-016 No hardcoded secrets | ✅ PASS |
| A-032 Schema column compliance (R1 FAIL → R2 PASS) | ✅ PASS — CHECK constraint now includes all 9 Capability values |

**Total: 14 PASS / 0 FAIL**

---

## Merge Gate Parity (§4.3)

| Check | Local Result |
|-------|-------------|
| Merge Gate Interface / merge-gate/verdict | ASSURANCE-TOKEN ✅ |
| Merge Gate Interface / governance/alignment | PASS ✅ |
| Merge Gate Interface / stop-and-fix/enforcement | PASS ✅ — R1 F-001 resolved |
| Test suite (ai-centre, 325 tests, 32 files) | PASS — 325/325 GREEN ✅ |
| A-032 schema column compliance | PASS ✅ — migration 011 complete |

**Parity result**: PASS

---

## Token Immutability Note

Per `AGENT_HANDOVER_AUTOMATION.md` §4.3b: This token file is the authoritative IAA verdict record for R2.
The R1 REJECTION-PACKAGE token (`.agent-admin/assurance/iaa-token-session-gap009-wave-gap-009-20260407.md`) is retained as historical record — CI correctly skips REJECTION-PACKAGE files during `iaa-token-self-certification`.

---

*Independent Assurance Agent v6.2.0 | Session gap009r-20260407 | 2026-04-08*
*Authority: CS2 (Johan Ras / @APGI-cmy)*
*Adoption phase: PHASE_B_BLOCKING*
*Self-Modification Lock: SELF-MOD-IAA-001 — ACTIVE*
