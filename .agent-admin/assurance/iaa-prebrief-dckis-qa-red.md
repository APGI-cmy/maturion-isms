# IAA Pre-Brief — DCKIS-QA-RED: Pipeline 2 RED Gate Test Suite

**Document type**: IAA Pre-Brief Artifact (Phase 0 — PRE-BRIEF mode)
**Wave slug**: dckis-qa-red
**Declared branch**: `copilot/dckis-qa-red-execute-failing-tests-again`
**Issue**: [qa-builder] DCKIS-QA-RED: Execute 12 RED Gate Failing Tests — Knowledge Ingestion
**Pre-Brief authored by**: independent-assurance-agent v6.2.0 (via foreman-v2-agent delegation)
**Date**: 2026-03-19
**Authority**: CS2 (@APGI-cmy) | `INDEPENDENT_ASSURANCE_AGENT_CANON.md`
**Invocation mode**: PHASE 0 — PRE-BRIEF ONLY. Phases 1–4 assurance NOT executed in this session.

---

## 1. Wave Scope Declaration

Wave DCKIS-QA-RED delivers the 12 RED gate tests for Pipeline 2 (MAT Knowledge Ingestion).
All tests must FAIL at handover — confirming no implementation has been added prematurely.
Entry criteria confirmed: DCKIS-GOV-001 merged (governance PR #1176 — FR-KU-001–005, TR-KU-001–004 exist).

**Responsible Agent**: `qa-builder`
**Source Spec**: `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` §4, Wave DCKIS-QA-RED

---

## 2. Trigger Categories

| Category | Applies | Rationale |
|---|---|---|
| New test file | ✅ YES | 12 new test cases in new directory |
| Pipeline 2 scope | ✅ YES | Tests cover KnowledgeUploadPanel, DocumentChunkTester, useKnowledgeDocuments, process-document-v2 |
| RED gate integrity | ✅ YES | All 12 must FAIL — zero GREEN at handover |
| ADR-005 (Pipeline 1 isolation) | ✅ YES | T-KU-008 explicitly guards Pipeline 1 |
| Schema delta | ✅ YES | T-KU-004, T-KU-005 check missing chunk-metadata columns and RLS INSERT gap |

---

## 3. FFA Checks at Handover

IAA will verify at handover:

1. **All 12 tests fail**: Run `vitest run modules/mat/tests/dckis-qa-red/` — zero GREEN
2. **Zero stub/todo/skip**: No `it.skip`, `it.todo`, `xit`, `xdescribe` in test file
3. **File-based only**: No live DB calls, no network calls, no Supabase client
4. **Pipeline 1 isolation**: No modifications to Pipeline 1 source files
5. **ADR-005 compliance**: T-KU-008 explicitly verifies Pipeline 2 isolation from criteria table
6. **Test IDs present**: All 12 test IDs (T-KU-001 through T-KU-012) declared in test file
7. **CANON_INVENTORY clean**: No hash degradation
8. **No production code**: This wave adds tests only — no implementation code

---

## 4. PREHANDOVER Proof Structure Required

| Field | Required Value |
|---|---|
| Session ID | session-dckis-qa-red-YYYYMMDD |
| Wave description | DCKIS-QA-RED — 12 RED gate tests for Pipeline 2 Knowledge Ingestion |
| QP verdict | PASS (all 12 tests confirmed FAILING) |
| OPOJD gate | All 12 tests RED — zero GREEN; zero skipped/stub |
| Test file location | `modules/mat/tests/dckis-qa-red/knowledge-ingestion.test.ts` |
| Pipeline 1 files modified | NONE |
| CANON_INVENTORY alignment | CONFIRMED |
| merge_gate_parity | PASS |
| iaa_audit_token | Expected reference at commit time |

---

## 5. Scope Blockers and Governance Conflicts

| Item | Status |
|---|---|
| DCKIS-GOV-001 merged (FR/TR exist) | ✅ CONFIRMED — governance PR merged |
| CS2 wave-start authorisation | ✅ CONFIRMED — issue opened by CS2 |
| Pipeline 1 not in scope | ✅ CONFIRMED — no implementation in this wave |
| process-document-v2 in legacy | ✅ EXISTS — `apps/maturion-maturity-legacy/supabase/functions/process-document-v2/` |
| Target components do not exist yet | ✅ CONFIRMED — knowledge/ directory absent |
| S-035 open improvement suggestion | ⚠️ NOTED — tracked but not blocking this wave |

---

## 6. Qualifying Tasks for Assurance

| Task | Agent | Assurance Required |
|---|---|---|
| T-DCKIS-QA-001: Create 12 RED gate test file | qa-builder | IAA Phase 2: RED state verification |
| T-DCKIS-QA-002: Governance artifacts (pre-brief, wave-current-tasks) | foreman-v2-agent | IAA Phase 1: pre-brief existence |

---

*Pre-Brief invoked per AGENT_HANDOVER_AUTOMATION.md §4.1. No assurance phases executed.*
*Authority: CS2 (@APGI-cmy) | Governed by: LIVING_AGENT_SYSTEM.md v6.2.0*
