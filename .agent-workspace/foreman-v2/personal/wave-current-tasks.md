# Foreman Wave Current Tasks

## Active Wave: DCKIS-IMPL-002

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
