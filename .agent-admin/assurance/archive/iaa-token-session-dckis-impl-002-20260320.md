# IAA Verdict Artifact — DCKIS-IMPL-002 — REJECTION-PACKAGE

<!-- REJECTION-PACKAGE — this artifact is skipped by iaa-token-self-certification CI gate -->

**Agent**: independent-assurance-agent v6.2.0
**Session ID**: session-dckis-impl-002-20260320
**Date**: 2026-03-20
**Wave**: DCKIS-IMPL-002
**Branch**: copilot/dckis-impl-002-frontend-components
**Producing agent**: ui-builder (class: BUILDER)
**Invoking agent**: foreman-v2-agent
**Adoption phase at verdict**: PHASE_B_BLOCKING

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE
## PR: DCKIS-IMPL-002 — MAT Frontend Components — Knowledge Ingestion Interface
## 8 check(s) FAILED. Merge blocked. STOP-AND-FIX required.
## Adoption phase: PHASE_B_BLOCKING — HARD GATE
## ═══════════════════════════════════════

### FAILURES

---

#### FAILURE 1 — CORE-018 / A-029: iaa_audit_token field non-compliant

**Check**: CORE-018 Complete evidence artifact sweep — iaa_audit_token field  
**Finding**: `iaa_audit_token` in PREHANDOVER_PROOF_DCKIS_IMPL_002.md contains `"Pending IAA session execution"` — the OLD A-025 PENDING pattern. A-029 supersedes A-025 and requires this field to be pre-populated at commit time with the expected reference format: `IAA-session-dckis-impl-002-20260320-PASS`.  
**Fix required**: Update the PREHANDOVER proof `iaa_audit_token` field to contain the expected reference `IAA-session-dckis-impl-002-20260320-PASS` before re-invoking IAA. Per A-029, this must be committed. Per A-030, a correction addendum commit satisfies this requirement for re-invocation.

---

#### FAILURE 2 — CORE-023: process-document-v2 Edge Function deployment path not covered by CI workflow

**Check**: CORE-023 Workflow integrity ripple check  
**Finding**: `packages/ai-centre/supabase/functions/process-document-v2/index.ts` is delivered at a path that is NOT covered by the `deploy-mat-edge-functions.yml` workflow's `paths:` filter. That workflow monitors `supabase/functions/**` only. Changes to this Edge Function will NOT trigger automatic CI deployment.  
**Fix required**: Add `packages/ai-centre/supabase/functions/**` to the `paths:` filters (both `push` and `pull_request` triggers) in `.github/workflows/deploy-mat-edge-functions.yml`.

---

#### FAILURE 3 — BL-027 (MERGE GATE): SCOPE_DECLARATION.md stale

**Check**: Merge Gate Parity — BL-027 Scope Declaration  
**Finding**: `validate-scope-to-diff.sh` executed locally — EXIT CODE 1. SCOPE_DECLARATION.md on branch declares 0 files but `git diff --name-only origin/main...HEAD` shows 12 changed files. The existing SCOPE_DECLARATION.md is from the DCKIS-GOV-001 wave and has not been updated for this wave.  
**Fix required**: Create/update SCOPE_DECLARATION.md to list all 12 changed files in the required format:  
```
- `.agent-admin/assurance/iaa-prebrief-dckis-impl-002.md` — IAA Pre-Brief artifact
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — Wave task list update
- `.agent-workspace/ui-builder/memory/session-dckis-impl-002-20260320.md` — Builder session memory
- `PREHANDOVER_PROOF_DCKIS_IMPL_002.md` — PREHANDOVER ceremony proof
- `modules/mat/frontend/src/App.tsx` — Added /knowledge route
- `modules/mat/frontend/src/components/Layout.tsx` — Added Knowledge nav item
- `modules/mat/frontend/src/components/knowledge/DocumentChunkTester.tsx` — IMPL-002-D2
- `modules/mat/frontend/src/components/knowledge/KnowledgeDocumentsList.tsx` — IMPL-002-D3
- `modules/mat/frontend/src/components/knowledge/KnowledgeUploadPanel.tsx` — IMPL-002-D1+D5
- `modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts` — IMPL-001-D5 carried
- `modules/mat/frontend/src/pages/KnowledgeUploadPage.tsx` — IMPL-002-D4 page
- `packages/ai-centre/supabase/functions/process-document-v2/index.ts` — IMPL-001-D1 carried
```
Note: Per A-031, IAA's own new token file (this file) is excluded from SCOPE_DECLARATION when added in the correction commit (A-031 carve-out). The session memory file for this IAA session is also excluded.

---

#### FAILURE 4 — BD-005 / BD-003 / BD-022: process-document-v2 not invoked from upload flow

**Check**: BD-005 End-to-end wiring verified; BD-003 One-time build compliance; BD-022 Architecture alignment  
**Finding**: `useKnowledgeDocuments.ts` performs a direct INSERT of the raw file content as a single 'pending' record in `ai_knowledge`. The `process-document-v2` Edge Function (which implements chunking and embedding — the core Pipeline 2 functionality) is **never called** from the frontend upload flow. No `supabase.functions.invoke('process-document-v2', ...)` call exists anywhere in the delivered code. No DB webhook/trigger or cron mechanism is defined to process pending records. Result: documents are uploaded and stored as raw text but are never chunked or embedded. The RAG pipeline is non-functional.

This contradicts:
- Pre-brief §3.4 BD-005 declared chain: `KnowledgeUploadPanel → useKnowledgeDocuments → process-document-v2 → ai_knowledge`
- PREHANDOVER proof §1: "Documents are chunked, embedded, and stored for retrieval-augmented generation (RAG)"
- DCKIS alignment plan Pipeline 2 specification

**Fix required**: Wire the Edge Function invocation into the upload flow. Recommended approach:  
After the initial pending INSERT in `uploadWithRetry`, add:
```typescript
const { error: fnError } = await supabase.functions.invoke('process-document-v2', {
  body: {
    content: fileContent,
    source,
    organisation_id: organisationId,
    source_document_name: params.file.name,
  },
});
if (fnError) {
  console.warn('[useKnowledgeDocuments] process-document-v2 invocation failed:', fnError.message);
  // Note: The raw pending record was already inserted — the document is queued
  // but processing failed. Surface this to the user.
}
```
**OR**: Document and implement an explicit async processing trigger (DB webhook on ai_knowledge INSERT for pending records) with evidence of the trigger mechanism in the PR diff.

---

#### FAILURE 5 — BD-010: process-document-v2 is an orphaned deliverable

**Check**: BD-010 No orphaned deliverables  
**Finding**: `packages/ai-centre/supabase/functions/process-document-v2/index.ts` is created but not imported, referenced, or invoked by any other code in the delivered diff. It is unreachable at runtime.  
**Fix required**: Wire process-document-v2 into the upload flow (see Failure 4 fix). Once wired, BD-010 is resolved.

---

#### FAILURE 6 — BD-000-B: Journey J1 broken (BD-003 confirmation)

**Check**: BD-000-B User Journey step-by-step trace  
**Finding**: Journey J1 (Knowledge Document Upload) step "upload → chunk → embed → store as RAG-ready" is broken. The upload creates a raw pending record but the chunking/embedding step never executes. Journey J2 (Chunk Preflight Tester → Smart Chunk Reuse invocation) is also broken — the tester shows a preview but there is no code path to pass pre-validated chunks to process-document-v2 from the `DocumentChunkTester` component.  
**Fix required**: See Failure 4. For J2: Either add a "Use these chunks" button in DocumentChunkTester that invokes process-document-v2 with `chunked_from_tester: true, pre_validated_chunks: chunks.map(c => c.content)`, or document that this is a future-wave feature and remove the misleading UI copy about Smart Chunk Reuse invocation from DocumentChunkTester.

---

#### FAILURE 7 — BD-021: TypeScript ApprovalStatus type mismatch with DB CHECK constraint

**Check**: BD-021 International coding best practice (TypeScript type safety)  
**Finding**: `KnowledgeDocumentsList.tsx` declares `type ApprovalStatus = 'pending' | 'approved' | 'rejected'`. Migration 006 defines `CHECK (approval_status IN ('pending', 'approved', 'retired'))`. The TypeScript type uses `'rejected'`; the DB constraint uses `'retired'`. The `as KnowledgeDocument[]` cast masks this mismatch at compile time. At runtime: (1) `'rejected'` can never be stored in the DB (constraint violation), making the TypeScript `'rejected'` case dead code; (2) `'retired'` values from the DB fall through to the `default` case in both badge functions, displaying as 'Pending' — incorrect display. The alignment plan spec uses `'rejected'`, confirming the DB constraint is the bug.  
**Fix required**: Add a migration (e.g., `009_ai_knowledge_approval_status_fix.sql`) that alters the CHECK constraint:
```sql
ALTER TABLE ai_knowledge DROP CONSTRAINT IF EXISTS ai_knowledge_approval_status_check;
ALTER TABLE ai_knowledge ADD CONSTRAINT ai_knowledge_approval_status_check 
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));
```
This aligns the DB constraint with the alignment plan spec, the TypeScript type, and the existing ARC workflow semantics.

---

#### FAILURE 8 — BD-022: Architecture deviation — process-document-v2 not in upload chain

**Check**: BD-022 Architecture alignment  
**Finding**: Architecture declared in pre-brief §3.4 BD-005 chain: `KnowledgeUploadPanel → useKnowledgeDocuments → process-document-v2 → ai_knowledge`. Delivered implementation omits `process-document-v2` from the chain entirely. This is a **mistake** (BD-022 case b), not an improvement — the Edge Function was delivered but left disconnected.  
**Fix required**: See Failure 4. Once process-document-v2 is wired, BD-022 is resolved.

---

## Summary of Required Fixes Before Re-Invocation

| # | Fix | File(s) |
|---|-----|---------|
| 1 | Update `iaa_audit_token` in PREHANDOVER proof to `IAA-session-dckis-impl-002-20260320-PASS` | `PREHANDOVER_PROOF_DCKIS_IMPL_002.md` (correction addendum commit) |
| 2 | Update deploy-mat-edge-functions.yml paths filter to include `packages/ai-centre/supabase/functions/**` | `.github/workflows/deploy-mat-edge-functions.yml` |
| 3 | Create/update SCOPE_DECLARATION.md with all 12 changed files | `SCOPE_DECLARATION.md` |
| 4+5+6+8 | Wire process-document-v2 invocation from useKnowledgeDocuments upload flow (or implement + document async trigger) | `modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts`, `packages/ai-centre/supabase/functions/process-document-v2/index.ts` |
| 7 | Add migration to fix approval_status CHECK constraint ('retired' → 'rejected') | New migration file `packages/ai-centre/supabase/migrations/009_ai_knowledge_approval_status_fix.sql` |

**Note on Failures 4/5/6/8**: These four failures share the same root cause (process-document-v2 not wired). One fix resolves all four. Failure 4's DocumentChunkTester J2 gap (Smart Chunk Reuse invocation from tester) can be resolved separately by either implementing the invocation or removing the misleading UI copy.

---

## What PASSED

The following areas are CONFIRMED GREEN and need not be re-examined unless the fixes touch them:

- All 12 T-KU-xxx tests GREEN (independently re-run by IAA) ✅
- ADR-005 Pipeline 1 isolation: CLEAN ✅
- Auth guards on /knowledge route: CONFIRMED ✅
- WCAG 2.1 AA accessibility: CONFIRMED ✅
- RLS policies (SELECT + INSERT): CONFIRMED ✅
- No hardcoded secrets: CONFIRMED ✅
- No XSS vectors: CONFIRMED ✅
- No TypeScript `any` usage: CONFIRMED ✅
- Cache invalidation (NBR-001): CONFIRMED ✅
- RLS write error handling (NBR-002): CONFIRMED ✅
- No Pipeline 1 files in diff: CONFIRMED ✅
- No .github/agents/ modifications: CONFIRMED ✅
- CANON_INVENTORY hashes: ALL VALID ✅

---

## Re-Invocation Instruction

1. Fix all 8 failures listed above (5 distinct fix groups).
2. Commit all fixes to the same branch.
3. Re-run test suite to confirm still 12/12 GREEN.
4. Re-invoke IAA via `task(agent_type: "independent-assurance-agent")`.
5. IAA will issue ASSURANCE-TOKEN if all fixes are verified.

**This PR must not be opened until all failures are resolved and IAA re-invoked with ASSURANCE-TOKEN issued.**

---

**IAA session**: session-dckis-impl-002-20260320  
**Token reference**: IAA-session-dckis-impl-002-20260320-REJECTION  
**Adoption phase**: PHASE_B_BLOCKING — hard gate ACTIVE  
**Authority**: CS2 only (@APGI-cmy)

PHASE_B_BLOCKING_TOKEN: IAA-session-dckis-impl-002-20260320-REJECTION
