# SCOPE DECLARATION — Wave DCKIS-IMPL-002

**Agent**: ui-builder v4.1.0
**Wave**: DCKIS-IMPL-002 — MAT Frontend Knowledge Ingestion UI
**Session**: session-dckis-impl-002-20260320
**Date**: 2026-03-20
**Branch**: copilot/dckis-impl-002-frontend-components
**Authority**: CS2 (@APGI-cmy) via Foreman delegation

## Declared Scope: Files Modified

Per `git diff --name-only f5d0206..HEAD` output:

1. `.agent-admin/assurance/iaa-prebrief-dckis-impl-002.md` — IAA pre-brief artifact for DCKIS-IMPL-002
2. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — Foreman wave task tracking update
3. `.agent-workspace/ui-builder/memory/session-dckis-impl-002-20260320.md` — UI Builder session memory
4. `PREHANDOVER_PROOF_DCKIS_IMPL_002.md` — Pre-handover proof for DCKIS-IMPL-002
5. `modules/mat/frontend/src/App.tsx` — Added KnowledgeUploadPage route
6. `modules/mat/frontend/src/components/Layout.tsx` — Added Knowledge Upload nav link
7. `modules/mat/frontend/src/components/knowledge/DocumentChunkTester.tsx` — Document chunk tester component
8. `modules/mat/frontend/src/components/knowledge/KnowledgeDocumentsList.tsx` — Knowledge documents list component
9. `modules/mat/frontend/src/components/knowledge/KnowledgeUploadPanel.tsx` — Knowledge upload panel component
10. `modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts` — Pipeline 2 knowledge documents hook (Edge Function wired)
11. `modules/mat/frontend/src/pages/KnowledgeUploadPage.tsx` — Knowledge upload page
12. `packages/ai-centre/supabase/functions/process-document-v2/index.ts` — Edge Function for document processing

## ADR-005 Compliance Attestation

Pipeline 1 files UNTOUCHED. Verified by `git diff --name-only`:
- No changes to `criteria`, `domains`, or `mini_performance_standards` related files
- No changes to any Wave 1–18 implementation files
- No changes to Pipeline 1 Edge Functions (invoke-ai-parse-criteria untouched)

## Out-of-Scope Files (NOT modified)

All Pipeline 1 files, all agent contracts, all canonical governance files unrelated to DCKIS-IMPL-002.

---

*Authority: ui-builder v4.1.0 | Wave DCKIS-IMPL-002 | 2026-03-20*
