# IAA Verdict — Session gap009 | Wave gap-009-episodic-memory-remediation

```yaml
session_id: session-gap009-20260407
wave: gap-009-episodic-memory-remediation
branch: copilot/gap-009-wire-supabase-insert
issue: maturion-isms#1274
pr_produced_by: api-builder v6.2.0
pr_category: AAWP_MAT
verdict: REJECTION-PACKAGE
date: 2026-04-07
iaa_version: 6.2.0
adoption_phase: PHASE_B_BLOCKING
authority: CS2 (Johan Ras / @APGI-cmy)
```

---

## REJECTION-PACKAGE

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/gap-009-wire-supabase-insert (issue maturion-isms#1274)
Wave: gap-009-episodic-memory-remediation
Session: session-gap009-20260407
Agent reviewed: api-builder v6.2.0 (class: builder)

2 check(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.

FAILURES:

  BD-003 (One-time build compliance) / BD-009 (Cross-component integration fit):
  Capability.RAG schema mismatch — Runtime silent data loss for RAG capability events

  Finding:
  The Capability enum (packages/ai-centre/src/types/index.ts) has 9 values including
  RAG = 'rag'. The ai_episodic_events.capability CHECK constraint in migration
  004_ai_episodic_memory.sql lists only 8 values — 'rag' is absent from the constraint.

  This PR is the first to write to ai_episodic_events using the Capability type. Before
  this PR, all writes were in-memory (DB CHECK constraint did not apply). After this PR,
  any record() call with capability: Capability.RAG will fail the DB CHECK constraint.

  Confirmed runtime failure path:
  MemoryLifecycle.recordTurn() calls:
    this.episodicAdapter.record({ capability: params.request.capability, ... })
  params.request.capability is typed as Capability — which includes Capability.RAG.
  A RAG capability invocation triggers:
    → rpc('set_config') — succeeds
    → from('ai_episodic_events').insert({ capability: 'rag', ... }) — FAILS DB CHECK
    → adapter throws the error
    → MemoryLifecycle.catch(() => {}) silently swallows the error
    → RAG capability event is NEVER persisted to episodic memory
    → No error surfaced — silent data loss

  The PREHANDOVER SB-002 attestation states "capability ← entry.capability (typed
  Capability enum — values match CHECK constraint)" — this claim is INCORRECT.
  9 enum values exist; only 8 are covered by the CHECK constraint.

  Root cause: Pre-existing schema drift between TypeScript enum and DB CHECK constraint,
  which was harmless when the adapter was in-memory, but is now a real runtime failure
  path introduced by this PR's Supabase wiring.

  FAIL-ONLY-ONCE A-032: Migration DDL read directly per rule. Cross-check performed.

  Fix required (choose ONE before re-invoking IAA):

  (a) PREFERRED — Add new migration for 'rag' capability:
      File: packages/ai-centre/supabase/migrations/005_add_rag_capability.sql
      Content:
        ALTER TABLE ai_episodic_events
          DROP CONSTRAINT IF EXISTS ai_episodic_events_capability_check;
        ALTER TABLE ai_episodic_events
          ADD CONSTRAINT ai_episodic_events_capability_check
          CHECK (capability IN (
            'advisory',
            'analysis',
            'embeddings',
            'rag',
            'document-generation',
            'image-generation',
            'deep-search',
            'video-generation',
            'algorithm-execution'
          ));
      Also update test: add a test case recording Capability.RAG and asserting it
      persists correctly via mock, then verify mock.rows[0].capability === 'rag'.
      Note: The DROP CONSTRAINT requires knowing the actual constraint name from
      the Supabase schema — introspect or use pg_constraint to find it.

  (b) Remove Capability.RAG from the enum — investigate all downstream callers
      (request handlers, routing, tests) before removing.

  (c) Runtime guard in toRow() — add validation that throws before the DB call:
      const ALLOWED_CAPABILITIES = new Set([
        'advisory', 'analysis', 'embeddings', 'document-generation',
        'image-generation', 'deep-search', 'video-generation', 'algorithm-execution'
      ]);
      if (!ALLOWED_CAPABILITIES.has(entry.capability)) {
        throw new Error(`EpisodicMemoryAdapter: capability '${entry.capability}' is not
          supported by ai_episodic_events CHECK constraint`);
      }
      NOTE: This does not fix the schema drift — it converts silent failure to explicit
      failure. Option (a) is strongly preferred.

This PR must NOT be opened until the failure above is resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate. No PR opens without ASSURANCE-TOKEN.
═══════════════════════════════════════
```

---

## Checks Summary

| Check | Status |
|-------|--------|
| CORE-013 IAA invocation evidence | PASS ✅ |
| CORE-014 No class exemption | PASS ✅ |
| CORE-015 Session memory present | PASS ✅ |
| CORE-016 IAA verdict evidenced | PASS ✅ (first invocation exception) |
| CORE-017 No .github/agents/ modifications | PASS ✅ |
| CORE-018 Complete evidence artifact sweep | PASS ✅ |
| CORE-019 IAA token cross-verification | PASS ✅ (first invocation exception) |
| CORE-023 Workflow integrity ripple | PASS ✅ |
| CERT-001 PREHANDOVER proof exists | PASS ✅ |
| CERT-002 Session memory exists | PASS ✅ |
| CERT-003 FAIL-ONLY-ONCE attested | PASS ✅ |
| CERT-004 IAA audit token field present | PASS ✅ |
| BD-000-A Journey declaration present | PASS ✅ |
| BD-000-B Journey step-by-step trace | PASS ✅ |
| BD-000-C/D Edge case declaration | PASS ✅ |
| BD-001 Full scope delivered | PASS ✅ |
| BD-002 No stub/TODO in production paths | PASS ✅ |
| BD-003 One-time build compliance | **FAIL ❌** — F-001: RAG events silently never recorded |
| BD-004 No leftover debt | PASS ✅ |
| BD-005 End-to-end wiring verified | PASS ✅ |
| BD-006 Writers and readers confirmed | PASS ✅ |
| BD-007 Auth guards applied | PASS ✅ |
| BD-008 FK and relational integrity | N/A ✅ |
| BD-009 Cross-component integration fit | **FAIL ❌** — F-001: Capability.RAG DB constraint mismatch |
| BD-010 No orphaned deliverables | PASS ✅ |
| BD-011 100% test pass rate | PASS ✅ — 13/13 GREEN verified locally |
| BD-012 Zero test debt | PASS ✅ |
| BD-013 No test dodging | PASS ✅ |
| BD-014 No deprecation accumulation | PASS ✅ |
| BD-015 RLS policies complete | PASS ✅ |
| BD-016 No hardcoded secrets | PASS ✅ |
| BD-017 Input validation present | PASS ✅ |
| BD-018 No injection vectors | PASS ✅ |
| BD-019 International standards | PASS ✅ |
| BD-020 Clean coding structure | PASS ✅ |
| BD-021 International coding best practice | PASS ✅ |
| BD-022 Architecture alignment | PASS ✅ |
| BD-023 Technology currency | PASS ✅ |
| A-032 Schema column compliance | PASS (names) / FAIL (CHECK value — F-001) ❌ |

**Total: 35 PASS / 2 FAIL**

---

## FFA Summary

```
FFA Result:
  FFA-01 Delivery Completeness: PASS — All SB-001–SB-007 items delivered (except F-001 gap)
  FFA-02 Wiring Verification: PASS — record() and retrieve() fully wired to Supabase
  FFA-03 Integration Fit: FAIL — Capability.RAG (Capability enum) not covered by DB CHECK constraint; MemoryLifecycle silently swallows the resulting error
  FFA-04 Security: PASS — RLS correctly wired; no injection vectors; no hardcoded secrets
  FFA-05 Code Quality: PASS — Clean, idiomatic TypeScript; minimal interface pattern; proper error handling throughout
  FFA-06 One-Time Build: FAIL — RAG capability events will silently fail to persist after merge
  FFA-CARRY-FORWARD: NONE (F-001 is blocking, must be fixed before merge)
```

---

## IAA Assessment — What Is Outstanding

The implementation quality is **excellent** across all dimensions except F-001. The Supabase wiring
is correct, the RLS enforcement is correctly implemented, error handling is thorough, the test
suite is comprehensive and meaningful, and the code is clean. The only finding is a pre-existing
schema drift that this PR exposes as a new runtime failure path.

The fix for F-001 is straightforward — a single migration adding 'rag' to the CHECK constraint
is the preferred path. Once resolved, IAA expects to issue ASSURANCE-TOKEN on re-invocation.

---

## Merge Gate Parity (§4.3)

| Check | Local Result |
|-------|-------------|
| Merge Gate Interface / merge-gate/verdict | REJECTION-PACKAGE issued |
| Merge Gate Interface / governance/alignment | PASS |
| Merge Gate Interface / stop-and-fix/enforcement | FAIL — F-001 triggers STOP-AND-FIX |
| Test suite (ai-centre, 13 tests) | PASS — 13/13 GREEN |
| A-032 schema column compliance | FAIL (CHECK constraint value) |

---

*Independent Assurance Agent v6.2.0 | Session gap009-20260407 | 2026-04-07*
*Authority: CS2 (Johan Ras / @APGI-cmy)*
*Adoption phase: PHASE_B_BLOCKING*
*STOP-AND-FIX mandate: ACTIVE — This PR must not be opened until IAA re-invokes and issues ASSURANCE-TOKEN*
