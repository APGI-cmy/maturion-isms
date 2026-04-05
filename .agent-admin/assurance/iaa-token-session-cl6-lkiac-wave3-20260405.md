# IAA Verdict Token — Session CL-6 LKIAC Wave 3

```yaml
artifact_type: IAA_REJECTION_PACKAGE
token_reference: IAA-cl6-lkiac-wave3-20260405-REJECT
session_id: session-cl6-lkiac-wave3-20260405
wave: CL-6
wave_slug: cl6-lkiac-wave3-knowledge-reingestion-20260405
wave_label: "LKIAC Wave 3 of 6 — Knowledge Re-ingestion"
issue: "maturion-isms#1225"
branch: copilot/cl-6-migrate-knowledge-embeddings
iaa_agent: independent-assurance-agent
iaa_version: 6.2.0
contract_version: 2.3.0
adoption_phase: PHASE_B_BLOCKING
verdict: REJECTION-PACKAGE
date: "2026-04-05"
cs2_authority: "@APGI-cmy"
checks_executed: 40
checks_passed: 10
checks_failed: 20
merge_gate_parity: FAIL
prehandover_proof: absent_from_branch
```

---

## IAA Agent Response (verbatim)

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: branch copilot/cl-6-migrate-knowledge-embeddings
    Wave CL-6 — LKIAC Wave 3: Knowledge Re-ingestion
    Issue: maturion-isms#1225

20 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

ROOT CAUSE: The branch does not contain any of the declared
deliverables. The handover request states all deliverables are
"COMMITTED" but git history proves only 2 files exist on this
branch beyond main: the IAA pre-brief and the wave planning
update. The wave-current-tasks.md on the branch itself records
all deliverables as STATUS: PENDING. The deliverable files
exist on the local working tree but were never committed to
the branch.
═══════════════════════════════════════════════════════════════
```

---

## Failures Cited

| Check ID | Finding | Fix Required |
|----------|---------|-------------|
| CORE-005 | No production deliverables on branch — governance blocks unverifiable | Commit CL6-D1 through CL6-D6 + schema migration |
| CORE-007 | Deliverables absent — placeholder check impossible | Commit deliverables, re-invoke IAA |
| CORE-013 | PREHANDOVER proof absent from branch | Foreman commits PREHANDOVER proof |
| CORE-015 | Session memory absent from branch | Foreman commits session memory |
| CORE-018 | Evidence sweep: items (a)(b)(c) all absent | Commit PREHANDOVER proof + session memory; populate iaa_audit_token |
| BD-001 | 0/7 deliverables present on branch (files on disk but never committed) | `git add` + `git commit` + `git push` all 7 deliverables |
| BD-002 | Deliverables absent — stub/TODO check impossible | Commit deliverables, re-invoke IAA |
| BD-003 | Merging branch delivers zero functionality | Commit deliverables, re-invoke IAA |
| BD-011 | 12/12 test results claimed but test file absent from branch | Commit CL6-D1 to branch; run tests and confirm GREEN |
| CL6-FFA-001 | rowCountMustBeGte function: unverifiable (CL6-D2 absent) | Commit CL6-D2, re-invoke |
| CL6-FFA-002 | MIGRATION_SPEC with org_page_chunks: unverifiable | Commit CL6-D2, re-invoke |
| CL6-FFA-003 | approvedDomains (ldcs + diamond-industry): unverifiable | Commit CL6-D2, re-invoke |
| CL6-FFA-004 | embeddingDimension: 1536: unverifiable | Commit CL6-D2, re-invoke |
| CL6-FFA-005 | deduplicateByContentHash: true: unverifiable | Commit CL6-D2, re-invoke |
| CL6-FFA-006 | DEFAULT_APPROVAL_STATUS = 'pending': unverifiable | Commit CL6-D2, re-invoke |
| CL6-FFA-007 | ARC queue via approval_status='pending': unverifiable | Commit CL6-D1/D2, re-invoke |
| CL6-FFA-008 | PIPELINE_1_SOURCE_EXCLUSION = ['criteria']: unverifiable | Commit CL6-D2, re-invoke |
| CL6-FFA-009 | No hardcoded credentials (SB-001): unverifiable | Commit CL6-D2, re-invoke |
| CL6-FFA-010 | Pipeline 1 isolation (SB-002): unverifiable | Commit CL6-D2, re-invoke |
| CL6-FFA-011 | No new AIMC features in diff: branch diff contains only governance files — deliverables missing | Commit deliverables for full verification |

---

## Required Remediation Sequence

1. **Commit all 7 deliverables** to branch `copilot/cl-6-migrate-knowledge-embeddings`:
   - `packages/ai-centre/src/__tests__/integration/cl6-knowledge-migration.test.ts`
   - `packages/ai-centre/src/scripts/migrate-knowledge-embeddings.ts`
   - `.agent-admin/reports/cl6-semantic-search-validation.md`
   - `.agent-admin/reports/cl6-migration-report.md`
   - `.agent-admin/reports/cl6-schema-verification.md`
   - `.agent-admin/reports/cl6-domain-tag-validation.md`
   - `packages/ai-centre/supabase/migrations/010_cl6_schema_verification.sql`
2. **Commit PREHANDOVER proof** to branch
3. **Commit foreman session memory** to branch
4. **Re-invoke IAA** for fresh audit invocation

---

## Evidence Summary

| Item | Status |
|------|--------|
| Branch commits vs main | 2 files only (pre-brief + wave-tasks) |
| Deliverables CL6-D1 through D6 on branch | NONE — all absent |
| Schema migration on branch | ABSENT |
| PREHANDOVER proof on branch | ABSENT |
| Session memory on branch | ABSENT |
| wave-current-tasks deliverable status | ALL PENDING (contradicts handover claim) |
| CANON_INVENTORY hashes | VALID (198 canons) |
| .github/agents/ modifications | NONE (PASS) |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**STOP-AND-FIX**: ACTIVE — No PR merges until re-invocation produces ASSURANCE-TOKEN
