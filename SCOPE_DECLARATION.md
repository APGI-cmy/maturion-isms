# SCOPE DECLARATION — Wave DCKIS-IMPL-002

**Agent**: ui-builder v4.1.0
**Wave**: DCKIS-IMPL-002 — MAT Frontend Knowledge Ingestion UI
**Session**: session-dckis-impl-002-20260320
**Date**: 2026-03-20
**Branch**: copilot/dckis-impl-002-frontend-components
**Authority**: CS2 (@APGI-cmy) via Foreman delegation

## Declared Scope: Files Modified

Per `git diff --name-only f5d0206..HEAD` output (updated after R2 code-review changes):

1. `.agent-admin/assurance/iaa-prebrief-dckis-impl-002.md` — IAA pre-brief artifact for DCKIS-IMPL-002
2. `.agent-admin/assurance/iaa-token-session-dckis-impl-002-20260320-R2.md` — IAA assurance token (R2)
3. `.agent-admin/assurance/iaa-token-session-dckis-impl-002-20260320.md` — IAA assurance token (initial)
4. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-dckis-impl-002-20260320.md` — Foreman pre-handover session memory
5. `.agent-workspace/foreman-v2/memory/session-dckis-impl-002-foreman-20260320-R2.md` — Foreman R2 session memory
6. `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` — Foreman parking station suggestions log
7. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — Foreman wave task tracking update
8. `.agent-workspace/independent-assurance-agent/memory/session-dckis-impl-002-20260320-R2.md` — IAA R2 session memory
9. `.agent-workspace/ui-builder/memory/session-dckis-impl-002-20260320.md` — UI Builder session memory
10. `.github/workflows/deploy-mat-edge-functions.yml` — Narrowed paths filter to invoke-ai-parse-criteria only
11. `CORRECTION_ADDENDUM_DCKIS_IMPL_002_R1.md` — Correction addendum for R1 review
12. `PREHANDOVER_PROOF_DCKIS_IMPL_002.md` — Pre-handover proof for DCKIS-IMPL-002
13. `SCOPE_DECLARATION.md` — This file (scope declaration)
14. `modules/mat/frontend/src/App.tsx` — Added KnowledgeUploadPage route
15. `modules/mat/frontend/src/components/Layout.tsx` — Added Knowledge Upload nav link
16. `modules/mat/frontend/src/components/knowledge/DocumentChunkTester.tsx` — Document chunk tester component (local-preview copy, safeOverlap guard)
17. `modules/mat/frontend/src/components/knowledge/KnowledgeDocumentsList.tsx` — Knowledge documents list component
18. `modules/mat/frontend/src/components/knowledge/KnowledgeUploadPanel.tsx` — Knowledge upload panel component
19. `modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts` — Pipeline 2 knowledge documents hook (binary format check, profiles table org lookup)
20. `modules/mat/frontend/src/pages/KnowledgeUploadPage.tsx` — Knowledge upload page
21. `packages/ai-centre/supabase/functions/process-document-v2/index.ts` — Edge Function: CORS headers on all paths, JWT validation, profiles org lookup, MAX_CHUNKS guard, consistent chunk params
22. `packages/ai-centre/supabase/migrations/009_ai_knowledge_approval_status_fix.sql` — Migration: ai_knowledge approval_status fix

## ADR-005 Compliance Attestation

Pipeline 1 files UNTOUCHED. Verified by `git diff --name-only`:
- No changes to `criteria`, `domains`, or `mini_performance_standards` related files
- No changes to any Wave 1–18 implementation files
- No changes to Pipeline 1 Edge Functions (invoke-ai-parse-criteria untouched)

## Out-of-Scope Files (NOT modified)

All Pipeline 1 files, all agent contracts, all canonical governance files unrelated to DCKIS-IMPL-002.

---

*Authority: ui-builder v4.1.0 | Wave DCKIS-IMPL-002 | 2026-03-20*
