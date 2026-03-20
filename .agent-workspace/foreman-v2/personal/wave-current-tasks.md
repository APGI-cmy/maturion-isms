# Wave Current Tasks — foreman-v2-agent

## Active Wave: DCKIS-CL11

wave: DCKIS-CL11
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-dckis-cl11.md

### Wave Description
Programme Close-Out — LKIAC CEP & Documentation Finalisation.
Wave DCKIS-CL11 updates the AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md with CL-11 status documentation (Amendment v1.7.0) and prepares CL-3 deprecation entries in LKIAC_DEPRECATION_REGISTER.md.

CS2 Authorization: GitHub issue "[governance-liaison] DCKIS-CL11: Programme Close-Out — LKIAC CEP & Documentation Finalisation" opened by CS2 and assigned to governance-liaison-isms-agent.

Entry criteria: All implementation (IMPL) waves merged (DCKIS-IMPL-002 merged to main — PR #1182).

### Deliverables

| ID | Artefact | Path | Status |
|----|---------|------|--------|
| CL11-D1 | AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md Amendment v1.7.0: CL-11 documentation | governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md | PENDING |
| CL11-D2 | LKIAC_DEPRECATION_REGISTER.md: CL-3 deprecation entries prepared | governance/aimc/LKIAC_DEPRECATION_REGISTER.md | PENDING |
| CL11-D3 | Close-out summary posted as issue comment | GitHub issue comment | PENDING |

### Constraints
- governance-liaison-isms-agent handles all documentation
- Foreman does NOT edit AIMC documents directly (NO-IMPLEMENT-001)
- Architecture document updates only — no code changes

### Status
- IAA Pre-Brief: PENDING
- Delegation: PENDING

### Updated
2026-03-20

---

## Previous Wave (archived): DCKIS-IMPL-002

wave: DCKIS-IMPL-002
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-dckis-impl-002.md

### Wave Description
Pipeline 2 Implementation — MAT Frontend UI for Knowledge Ingestion Interface.
Delivers all UI components and supporting backend artefacts to turn all 12 T-KU-xxx RED gate tests GREEN.

CS2 Authorization: Issue "[ui-builder] DCKIS-IMPL-002: MAT Frontend Components — Knowledge Ingestion Interface" opened by CS2 and assigned to ui-builder.

Scope Expansion (IAA Blocker A resolved): CS2 direct issue opening constitutes authorization to carry DCKIS-IMPL-001 artefacts (useKnowledgeDocuments.ts + process-document-v2) into this wave because IMPL-001 is not yet merged.

### Deliverables

| ID | Artefact | Path | Status |
|----|---------|------|--------|
| IMPL-002-D1 | KnowledgeUploadPanel.tsx | modules/mat/frontend/src/components/knowledge/KnowledgeUploadPanel.tsx | PENDING |
| IMPL-002-D2 | DocumentChunkTester.tsx | modules/mat/frontend/src/components/knowledge/DocumentChunkTester.tsx | PENDING |
| IMPL-002-D3 | KnowledgeDocumentsList.tsx | modules/mat/frontend/src/components/knowledge/KnowledgeDocumentsList.tsx | PENDING |
| IMPL-002-D4 | MAT routing + nav | App.tsx + Layout.tsx | PENDING |
| IMPL-002-D5 | Domain selector | Inline in KnowledgeUploadPanel.tsx | PENDING |
| IMPL-001-D5 (carried) | useKnowledgeDocuments.ts | modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts | PENDING |
| IMPL-001-D1 (carried) | process-document-v2 | packages/ai-centre/supabase/functions/process-document-v2/index.ts | PENDING |

### Test Gate

| Test | Status |
|------|--------|
| T-KU-001 KnowledgeUploadPanel exists | PENDING |
| T-KU-002 DocumentChunkTester size=2000 overlap=200 | PENDING |
| T-KU-003 Domain-to-source mapping in hook | PENDING |
| T-KU-004 chunk metadata columns (schema-builder) | GREEN ✅ |
| T-KU-005 INSERT RLS WITH CHECK (schema-builder) | GREEN ✅ |
| T-KU-006 KnowledgeDocumentsList approval_status badge | PENDING |
| T-KU-007 process-document-v2 chunked_from_tester | PENDING |
| T-KU-008 process-document-v2 Pipeline 1 isolation | PENDING |
| T-KU-009 useKnowledgeDocuments file extension validation | PENDING |
| T-KU-010 useKnowledgeDocuments retry + dedup | PENDING |
| T-KU-011 process-document-v2 chunk size=2000 overlap=200 | PENDING |
| T-KU-012 process-document-v2 embedding 1536-dim | PENDING |

### Constraints
- ADR-005: MUST NOT touch Pipeline 1 files (CriteriaUpload.tsx, CriteriaManagementPage.tsx, useCriteria.ts, invoke-ai-parse-criteria)
- QueryClientProvider: provided in main.tsx only (do NOT add another in App.tsx or pages)

### Status
- IAA Pre-Brief: COMMITTED (.agent-admin/assurance/iaa-prebrief-dckis-impl-002.md)
- Delegation: IN_PROGRESS → ui-builder

### Updated
2026-03-20T07:46:00Z
**Session ID**: session-markdown-rewrite-remediation-20260320
**Wave Slug**: markdown-rewrite-remediation
**Issue**: #1184 — Remediation List for the Markdown Rewrite
**Branch**: copilot/remediation-list-markdown-rewrite
**Date**: 2026-03-20
**Status**: IN PROGRESS

---

## IAA Pre-Brief

```yaml
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-markdown-rewrite-remediation-20260320.md
iaa_prebrief_status: COMMITTED (SHA: c545f24)
```

---

## Wave Objective

Revise `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md` to be more comprehensive and source-faithful to the original Word document, while preserving the existing document's strong structure, clean hierarchy, and readable product-spec style.

---

## Tasks

| ID | Task | Agent | Status |
|----|------|-------|--------|
| T-MRR-001 | Revise ROADMAP_APP_DESCRIPTION_v3.0.md per 10-item remediation list from Issue #1184 | mat-specialist | PENDING |

---

## Task Details

### T-MRR-001 — Revise ROADMAP_APP_DESCRIPTION_v3.0.md

**Agent**: mat-specialist
**File to modify**: `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md`
**Source reference**: `modules/maturity-roadmap/00-app-description/Lucara_Diamond_Control_Standard_V4.md` (per IAA pre-brief advisory)

**Priority 1 (Must Fix):**
1. Separate source-derived requirements from inferred enhancements (label inferred content as "Inferred Design Recommendation", "Suggested Enhancement", or "Implementation Proposal")
2. Preserve source ambiguity — "implementation users" vs "build users", "other organisations" phrasing, open conceptual areas
3. Strengthen "continuous live score" concept in Purpose/Overview, Audit Configuration/Scoring Logic, Dashboard, AI, Evidence sections
4. Expand evidence governance section substantially with: upload/connect/classification, acceptance/query/rejection/escalation, override/not-relevant handling, budget/skills constraints, freshness/staleness, re-evaluation, traceability, document vs live evidence, human override logging
5. Strengthen dashboard's company-wide visibility/wow-factor — live display, broad visibility, achievement celebration, company screens

**Priority 2 (Should Fix):**
6. Clarify post-subscription structure note (source has 2 main aspects; Markdown restructures as 3 parts — add acknowledgement note)
7. Clarify free assessment boundary (mainly MPS level, criteria/evidence after subscription, prompt if not done, baseline locked)
8. Preserve open conceptual notes from source in dedicated section ("Open Design Notes from Source" or similar)

**Priority 3 (Nice to Improve):**
9. Reduce over-formalization (label/remove architecture language beyond the Word file)
10. Add "Source Fidelity Notes" appendix

**IAA Pre-Brief acceptance bar**:
- CORE-007: No placeholder content (STUB/TODO/FIXME/TBD)
- DOC-FFA-001: Only ROADMAP_APP_DESCRIPTION_v3.0.md in diff
- DOC-FFA-002: All 5 Priority 1 items visibly addressed
- DOC-FFA-003: Priority 2 items 6–8 addressed
- DOC-FFA-004: Priority 3 items 9–10 (advisory only)
- DOC-FFA-005: Source fidelity — no over-specification beyond source
- DOC-FFA-006: Version header accurate
- DOC-FFA-007: No new stub sections
- PREHANDOVER proof committed before IAA invocation
- Session memory committed before IAA invocation

---

## Exit Criteria

- [ ] T-MRR-001 delivered and QP PASS
- [ ] PREHANDOVER proof written
- [ ] Session memory written  
- [ ] IAA invoked and ASSURANCE-TOKEN received
- [ ] Token ceremony complete
